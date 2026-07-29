using Fleck;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using yss.varietyshop.com.tr.Models;

namespace yss.varietyshop.com.tr.Services
{
    public class CommandManager
    {
        private WebSocketServer? _server;
        private readonly IHttpClientFactory _clientFactory;
        private readonly YssTheBrain _brain;
        private readonly string _fsmReportUrl;
        private readonly string _fsmKillUrl;

        // Aktif botların soket bağlantı havuzu
        private readonly ConcurrentDictionary<string, IWebSocketConnection> _activeBots = new();

        // 🔥 YENİ: Oda Sahipleri (Alphas) ve Sürü (Swarm) Ayrımı kanka
        private readonly ConcurrentDictionary<string, bool> _alphaBots = new();

        private string _currentSwarmRoomId = "";
        private string _swarmCommanderProfile = "";

        // 🔥 Evrensel camelCase ayarı
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public CommandManager(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _fsmReportUrl = configuration["SystemSettings:FsmReportUrl"] ?? "http://localhost:5001/orchestrator/report-progress";
            _fsmKillUrl = configuration["SystemSettings:FsmKillUrl"] ?? "http://localhost:5001/orchestrator/kill-bot";
            _brain = new YssTheBrain(this);
        }

        public void StartServer()
        {
            _server = new WebSocketServer("ws://0.0.0.0:9090");
            _server.Start(socket =>
            {
                socket.OnOpen = () => Console.WriteLine("🟢 [YSS] Bir bot konteynırı tünelden ağa sızdı. Kimlik bekleniyor...");
                socket.OnClose = () => RemoveBotBySocket(socket);

                socket.OnMessage = message =>
                {
                    try
                    {
                        var data = JsonSerializer.Deserialize<JsonElement>(message);
                        string type = data.GetProperty("type").GetString() ?? "";

                        // 1. STATUS_REPORT GELDİYSE
                        if (type == "STATUS_REPORT")
                        {
                            string botName = data.GetProperty("botName").GetString() ?? "";
                            string status = data.GetProperty("status").GetString() ?? "";

                            // 🔥 YENİ: Bot Alpha mı (Oda Kurucu) yoksa Sürü mü?
                            bool isRoomHost = data.TryGetProperty("isRoomHost", out var hostProp) && hostProp.GetBoolean();

                            var existingBot = _activeBots.FirstOrDefault(kvp => kvp.Value == socket);

                            if (existingBot.Key == null || existingBot.Key != botName)
                            {
                                if (existingBot.Key != null) _activeBots.TryRemove(existingBot.Key, out _);
                                _activeBots.TryAdd(botName, socket);
                                _alphaBots[botName] = isRoomHost; // Rolünü mühürlüyoruz kanka

                                Console.WriteLine($"👑 [YSS] Askerin siber kimliği tescillendi: {botName} | Sınıf: {(isRoomHost ? "ALPHA LİDER" : "SWARM ASKERİ")}");
                            }

                            // Oyun içi durum makinelerini besliyoruz
                            switch (status)
                            {
                                case "PLAYING":
                                    string extraJson = data.TryGetProperty("extra", out var ext) ? ext.GetString() ?? "{}" : "{}";
                                    try
                                    {
                                        var extraData = JsonSerializer.Deserialize<JsonElement>(extraJson);
                                        string rol = extraData.TryGetProperty("role", out var r) ? r.GetString() ?? "Bilinmiyor" : "Bilinmiyor";
                                        string team = extraData.TryGetProperty("team", out var t) ? t.GetString() ?? "Bilinmiyor" : "Bilinmiyor";
                                        int grid = extraData.TryGetProperty("grid", out var g) ? g.GetInt32() : 0;
                                        string pId = extraData.TryGetProperty("playerId", out var p) ? p.GetString() ?? "Bilinmiyor" : "Bilinmiyor";

                                        _brain.AskerOyunaGirdi(botName, pId, grid, rol, team);
                                    }
                                    catch { Console.WriteLine("⚠️ [YSS] PLAYING verisi deşifre edilemedi!"); }
                                    break;

                                case "LOVERS_SET":
                                    string loverExtraJson = data.TryGetProperty("extra", out var lExt) ? lExt.GetString() ?? "{}" : "{}";
                                    try
                                    {
                                        var lData = JsonSerializer.Deserialize<JsonElement>(loverExtraJson);
                                        string pId = lData.TryGetProperty("playerId", out var p) ? p.GetString() ?? "" : "";
                                        var lIds = JsonSerializer.Deserialize<List<string>>(lData.GetProperty("loverIds").GetRawText());
                                        _brain.AsiklarBelirlendi(pId, lIds ?? new List<string>());
                                    }
                                    catch { Console.WriteLine("⚠️ [YSS] LOVERS_SET paketi çözülemedi!"); }
                                    break;

                                case "NIGHT_STARTED": _brain.GeceOldu(); break;
                                case "DAY_VOTING": _brain.GunduzOldu(); break;
                                case "DEAD":
                                    string deadId = data.TryGetProperty("targetId", out var dId) ? dId.GetString() ?? "" : "";
                                    if (!string.IsNullOrEmpty(deadId)) _brain.AskerOldu(deadId);
                                    break;

                                case "GAME_OVER":
                                    _brain.MacBitti(botName);
                                    _ = ReportXpToFsmAsync(botName, 3500);

                                    // Lider bot ise otomatik REPLAY (Yeniden Oyna) lojini tetikler kanka
                                    if (botName == _swarmCommanderProfile || _alphaBots.GetValueOrDefault(botName, false))
                                    {
                                        Console.WriteLine($"⏳ [OTO-REPLAY] Lider ({botName}) maç bitirdi. 4 saniye dinlenme...");
                                        Task.Delay(4000).ContinueWith(t =>
                                        {
                                            Console.WriteLine($"♻️ [OTO-REPLAY] Süre doldu. {botName} için REPLAY emri gidiyor.");
                                            ReplaySwarmOperation(botName); // 🔥 Artık CREATE değil REPLAY atıyor
                                        });
                                    }
                                    break;
                            }
                        }
                        // 2. ROOM_CREATED VEYA REPLAY GELDİYSE
                        else if (type == "ROOM_CREATED" || type == "ROOM_REPLAYED")
                        {
                            var senderBot = _activeBots.FirstOrDefault(kvp => kvp.Value == socket).Key ?? "Bilinmeyen";

                            // Lider odayı başarıyla açtıysa sürüyü odaya dolduruyoruz kanka
                            if (senderBot == _swarmCommanderProfile || _alphaBots.GetValueOrDefault(senderBot, false))
                            {
                                _currentSwarmRoomId = data.GetProperty("gameId").GetString() ?? "";
                                _swarmCommanderProfile = senderBot;

                                Console.WriteLine($"\n🐺 [SWARM] Lider ({senderBot}) lobiyi başarıyla açtı! ODA ID: {_currentSwarmRoomId}");
                                Console.WriteLine("🚀 [SWARM] Tüm manga üyelerine odaya sızma emri veriliyor...\n");
                                CommandSwarmJoin();
                            }
                            else
                            {
                                Console.WriteLine($"✔️ [SWARM] Manga üyesi ({senderBot}) odaya enjekte oldu.");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[YSS KRİTİK HATA] Paket işlenirken tünel tıkandı: {ex.Message}");
                    }
                };
            });

            Console.WriteLine("👑 [SYSTEM] YSS Savaş Strateji Motoru 9090 Portunda Aktif!");
        }

        // --- FSM KOMUTA MERKEZİNE XP RAPORLAMA KANALI ---
        private async Task ReportXpToFsmAsync(string wolvesvilleId, int xp)
        {
            var client = _clientFactory.CreateClient();
            var payload = new { WolvesvilleId = wolvesvilleId, GainedXp = xp };
            var jsonContent = new StringContent(JsonSerializer.Serialize(payload, _jsonOptions), Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync(_fsmReportUrl, jsonContent);
                if (response.IsSuccessStatusCode) Console.WriteLine($"[YSS -> FSM] BAŞARILI: {wolvesvilleId} için +{xp} XP verisi FSM hattına senkronize edildi.");
            }
            catch (Exception ex) { Console.WriteLine($"[YSS HATA] FSM'ye XP raporu fırlatılırken hat oluştu: {ex.Message}"); }
        }

        // --- 🔥 YENİ: ZOMBİ BOT BİLDİRİM KANALI (KILL EMRİ İÇİN FSM'Yİ VURUR) ---
        private async Task ReportZombieBotToFsmAsync(string wolvesvilleId)
        {
            var client = _clientFactory.CreateClient();
            var payload = new { WolvesvilleId = wolvesvilleId };
            var jsonContent = new StringContent(JsonSerializer.Serialize(payload, _jsonOptions), Encoding.UTF8, "application/json");

            try
            {
                Console.WriteLine($"⚠️ [YSS -> FSM] {wolvesvilleId} tünelden koptu ve zombileşti! FSM'ye infaz emri (KILL) gidiyor...");
                await client.PostAsync(_fsmKillUrl, jsonContent);
            }
            catch (Exception ex) { Console.WriteLine($"[YSS HATA] FSM İnfaz hattına erişilemedi: {ex.Message}"); }
        }

        // İlk Odayı Kurma (Create)
        public void StartSwarmOperation(string commanderProfile, string roomSettings)
        {
            _swarmCommanderProfile = commanderProfile;
            _currentSwarmRoomId = "";
            SendCommandToBot(commanderProfile, "CREATE_ROOM", roomSettings);
            Console.WriteLine($"🐺 [SWARM] Lider ({commanderProfile}) için İLK CREATE_ROOM emri fırlatıldı.");
        }

        // 🔥 YENİ: Yeniden Oynama (Replay) Emri kanka
        public void ReplaySwarmOperation(string commanderProfile)
        {
            _swarmCommanderProfile = commanderProfile;
            _currentSwarmRoomId = "";
            SendCommandToBot(commanderProfile, "REPLAY_ROOM", "{}");
            Console.WriteLine($"🐺 [SWARM] Lider ({commanderProfile}) için OTO REPLAY_ROOM emri fırlatıldı.");
        }

        // Sürüyü odaya doldurur
        private void CommandSwarmJoin()
        {
            if (string.IsNullOrEmpty(_currentSwarmRoomId)) return;
            foreach (var bot in _activeBots)
            {
                // Oda kurucusu olmayan herkese odaya girme emri gönderiyoruz kanka
                if (!_alphaBots.GetValueOrDefault(bot.Key, false))
                {
                    SendCommandToBot(bot.Key, "JOIN_ROOM", _currentSwarmRoomId);
                }
            }
        }

        public void SendCommandToBot(string botName, string action, string data)
        {
            if (_activeBots.TryGetValue(botName, out var socket) && socket.IsAvailable)
            {
                var commandObj = new { action = action, data = data };
                string payload = JsonSerializer.Serialize(commandObj, _jsonOptions);
                socket.Send(payload);
                Console.WriteLine($"🚀 [YSS -> BOT] Emir Paketi Gönderildi -> {botName} | Komut: {action}");
            }
        }

        public void SendCommandToSwarm(string action, string data = "")
        {
            if (_activeBots.Count == 0) return;
            var commandObj = new { action = action, data = data };
            string payload = JsonSerializer.Serialize(commandObj, _jsonOptions);

            foreach (var bot in _activeBots.Values)
            {
                if (bot.IsAvailable) bot.Send(payload);
            }
        }

        private void RemoveBotBySocket(IWebSocketConnection socket)
        {
            var item = _activeBots.FirstOrDefault(kvp => kvp.Value == socket);
            if (!item.Equals(default(KeyValuePair<string, IWebSocketConnection>)))
            {
                _activeBots.TryRemove(item.Key, out _);
                _alphaBots.TryRemove(item.Key, out _);
                Console.WriteLine($"🔴 [YSS] {item.Key} tünelden koptu (Konteynır kapatılmış olabilir).");

                // Bot koptuğu an FSM'ye "Bu adam patladı kanka, diskten kazı" diyoruz
                _ = ReportZombieBotToFsmAsync(item.Key);
            }
        }
        // CommandManager.cs içine eklenecek zombi tetikleyicisi kanka:
        public void KillZombieBot(string botName)
        {
            // Zombi botu tünelden atıp FSM'yi vuruyoruz
            if (_activeBots.TryRemove(botName, out var socket)) socket.Close();
            _alphaBots.TryRemove(botName, out _);

            // FSM'nin Kill endpointine isteği atar
            _ = ReportZombieBotToFsmAsync(botName);
        }

        // Temel Oyun Komutları
        public void Vote(string voter, string targetId) { if (_activeBots.ContainsKey(voter)) SendCommandToBot(voter, "VOTE", targetId); }
        public void Useskill(string player, string targetId) { if (_activeBots.ContainsKey(player)) SendCommandToBot(player, "USE_SKILL", $"{{\"target\":\"{targetId}\"}}"); }
        public void SendMessage(string sender, string message) => SendCommandToBot(sender, "SEND_CHAT", message);
        public void Refresh(string player) => SendCommandToBot(player, "REFRESH", "");
        public void RefreshAll() => SendCommandToSwarm("REFRESH");

        // Yeni Hasat ve Envanter Komutları kanka
        public void SpinGoldWheel(string player) => SendCommandToBot(player, "SPIN_GOLD", "");
        public void SpinRoseWheel(string player) => SendCommandToBot(player, "SPIN_ROSE", "");
        public void OpenLootBox(string player) => SendCommandToBot(player, "OPEN_LOOTBOX", "");
        public void ClaimDailyCalendar(string player) => SendCommandToBot(player, "CLAIM_DAILY", "");
        public void DonateClanQuest(string player, string questType, int amount) => SendCommandToBot(player, "DONATE_CLAN", $"{{\"type\":\"{questType}\", \"amount\":{amount}}}");
    }
}