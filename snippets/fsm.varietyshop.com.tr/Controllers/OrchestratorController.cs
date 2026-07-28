using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace fsm.varietyshop.com.tr.Controllers
{
    [ApiController]
    [Route("orchestrator")] // FSM direkt merkez komuta ünitesi
    public class OrchestratorController : ControllerBase
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _proxyApiUrl;
        private readonly string _proxyServerUrl;
        private readonly string _shopSyncUrl;
        private readonly string _yeniceriUrl;
        private readonly string _yssUrl; // 🔥 FIX 1: Oyuncu motoru kontrol hattı eklendi kanka

        // 🔥 JSON HAFIZA DOSYASI: FSM'nin siber hafıza kartı
        private static readonly string REGISTRY_FILE_PATH = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "fsm_registry.json");
        private static readonly object _fileLock = new object();

        // 🔥 TÜM HESAPLARIN CANLI İSTATÜSÜ VE KASILAN XP'LERİ BURADA TUTULUYOR
        private static readonly ConcurrentDictionary<string, BotStatusModel> _botRegistry = new ConcurrentDictionary<string, BotStatusModel>();
        private static bool _isHafizaYuklendi = false;

        public OrchestratorController(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _proxyApiUrl = configuration["SystemSettings:ProxyApiUrl"] ?? "http://localhost:5002/proxy-manager/assign";
            _proxyServerUrl = configuration["SystemSettings:ProxyServerUrl"] ?? "http://localhost:8888";
            _shopSyncUrl = configuration["SystemSettings:ShopSyncUrl"] ?? "http://localhost:5000/saas/wolvesville/sync-xp-internal";
            _yeniceriUrl = configuration["SystemSettings:YeniceriUrl"] ?? "http://localhost:5003/action";

            // 🔥 YSS 5004 portunda oyuncuları yönetecek kanka
            _yssUrl = configuration["SystemSettings:YssUrl"] ?? "http://localhost:5004/api/bot";

            if (!_isHafizaYuklendi)
            {
                LoadRegistryFromFile();
                _isHafizaYuklendi = true;
            }
        }

        // 🔥 YENİÇERİ ASKERLERİNİN CANLI ADRESLERİNİ TUTAN SİBER HAVUZ
        private static readonly ConcurrentDictionary<string, string> _activeWorkers = new ConcurrentDictionary<string, string>();

        // ========================================================
        // 🛰️ YENİÇERİ DİNAMİK KAYIT KAPISI
        // ========================================================
        [HttpPost("register-worker")]
        public IActionResult RegisterWorker([FromBody] RegisterWorkerRequest model)
        {
            if (model == null || string.IsNullOrEmpty(model.WorkerUrl))
                return BadRequest("Asker verisi deşifre edilemedi.");

            _activeWorkers.AddOrUpdate(model.WorkerName, model.WorkerUrl, (key, old) => model.WorkerUrl);

            Console.WriteLine($"\n[YENİÇERİ -> FSM] 🟢 BAŞARILI: {model.WorkerName} dinamik hattıyla bağlandı! Rota: {model.WorkerUrl}");
            return Ok(new { success = true, message = "FSM komuta zincirine alındın asker!" });
        }

        // 🔥 Evrensel siber standart: camelCase ayar kartı
        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // ========================================================
        // ÖRNEK: ActionInventory İçinde Kullanımı kanka:
        // ========================================================
        [HttpPost("action-inventory")]
        public async Task<IActionResult> ActionInventory([FromBody] InventoryActionRequest request)
        {
            if (string.IsNullOrEmpty(request.Email)) return BadRequest("E-posta eksik komutanım.");

            var bot = _botRegistry.Values.FirstOrDefault(x => x.Email == request.Email);
            if (bot == null) return NotFound("Bot hafızada bulunamadı.");

            var httpClient = _clientFactory.CreateClient();

            // 🔥 _jsonOptions enjekte edilerek YSS'nin tam anlayacağı dilden (camelCase) paketlendi!
            var payloadString = JsonSerializer.Serialize(new { WolvesvilleId = bot.WolvesvilleId, Action = request.Action }, _jsonOptions);
            var payloadContent = new StringContent(payloadString, Encoding.UTF8, "application/json");

            try
            {
                // Rota direkt YSS'deki temiz adrese vuruyor panpa:
                var response = await httpClient.PostAsync($"{_yssUrl}/bot-action/trigger-inventory", payloadContent);
                if (!response.IsSuccessStatusCode)
                    return BadRequest("YSS Oyuncu Motoru şu an bu envanter emrini kabul edemiyor.");

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FSM UYARI] YSS tüneline erişilemedi (Simülasyon Modu): {ex.Message}");
                return Ok(new { success = true, message = "Simülasyon hattında komut işlendi." });
            }
        }

        // ========================================================
        // 1. SHOP API: HESAP KAYIT / GÜNCELLEME (Upsert)
        // ========================================================
        [HttpPost("save-account")]
        public IActionResult SaveAccount([FromBody] AccountStartRequest request)
        {
            if (string.IsNullOrEmpty(request.Email)) return BadRequest(new { message = "E-posta eksik!" });

            _botRegistry.AddOrUpdate(request.Email,
                new BotStatusModel { UserId = request.UserId, Email = request.Email, Password = request.Password, WolvesvilleId = request.WolvesvilleId, UserXpLimit = request.XpLimit, AccountXpLimit = request.XpLimit, CurrentXp = 0, Status = "Hazır" },
                (key, old) => { old.UserId = request.UserId; old.Password = request.Password; old.WolvesvilleId = request.WolvesvilleId; old.UserXpLimit = request.XpLimit; return old; });

            SaveRegistryToFile();
            Console.WriteLine($"[SHOP -> FSM] Hesap Tescil Edildi: {request.Email}");
            return Ok(new { success = true });
        }

        // ========================================================
        // 2. SHOP API: BOT BAŞLATMA PROTOKOLÜ (Eksiksiz Özellik Haritalama)
        // ========================================================
        [HttpPost("start-bot")]
        public async Task<IActionResult> StartBot([FromBody] FsmStartRequest request)
        {
            var bot = _botRegistry.AddOrUpdate(request.Email,
                new BotStatusModel
                {
                    UserId = request.UserId,
                    Email = request.Email,
                    Password = request.Password,
                    WolvesvilleId = request.WolvesvilleId,
                    UserXpLimit = request.RemainingUserXpLimit,
                    AccountXpLimit = request.AccountXpLimit,
                    CurrentXp = 0,
                    Status = "Hazır",
                    // Siber Toggıllar Hafızaya Alınıyor panpa
                    RoleCardOptimizer = request.RoleCardOptimizer,
                    ExchangeNetwork = request.ExchangeNetwork,
                    RandomEmoteSender = request.RandomEmoteSender,
                    AutoAvatarSlot = request.AutoAvatarSlot,
                    AutoXpBoost = request.AutoXpBoost,
                    AutoTalisman = request.AutoTalisman,
                    ClanConfig = request.ClanConfig
                },
                (key, old) => {
                    old.UserId = request.UserId; old.Password = request.Password; old.WolvesvilleId = request.WolvesvilleId;
                    old.UserXpLimit = request.RemainingUserXpLimit; old.AccountXpLimit = request.AccountXpLimit;
                    old.RoleCardOptimizer = request.RoleCardOptimizer; old.ExchangeNetwork = request.ExchangeNetwork; old.RandomEmoteSender = request.RandomEmoteSender;
                    old.AutoAvatarSlot = request.AutoAvatarSlot; old.AutoXpBoost = request.AutoXpBoost; old.AutoTalisman = request.AutoTalisman;
                    old.ClanConfig = request.ClanConfig;
                    return old;
                });

            SaveRegistryToFile();
            Console.WriteLine($"\n[FSM] Başlatma emri devrede. Hesap: {bot.Email} | Rol Optimizer: {bot.RoleCardOptimizer} | Takas Ağı: {bot.ExchangeNetwork}");

            // --- ADIM 1: PROXY SERVİSİ TESCİLİ ---
            var httpClient = _clientFactory.CreateClient();
            var proxyPayload = new { Email = bot.Email, Password = bot.Password, ProfileName = bot.WolvesvilleId };
            // ESKİ HALİ: var proxyContent = new StringContent(JsonSerializer.Serialize(proxyPayload), ...);
            // YENİ ÖZ HAKİKİ HALİ:
            var proxyContent = new StringContent(JsonSerializer.Serialize(proxyPayload, _jsonOptions), Encoding.UTF8, "application/json");

            try
            {
                var proxyResponse = await httpClient.PostAsync(_proxyApiUrl, proxyContent);
                if (!proxyResponse.IsSuccessStatusCode)
                {
                    bot.Status = "Proxy Hatası";
                    SaveRegistryToFile();
                    return BadRequest(new { success = false, message = "Proxy havuzu mühimmatı onaylamadı!" });
                }
            }
            catch (Exception ex)
            {
                bot.Status = "Proxy Bağlantı Hatası";
                SaveRegistryToFile();
                return StatusCode(500, new { success = false, message = $"Proxy tünel hatası: {ex.Message}" });
            }

            // --- ADIM 2: YENİÇERİ (GARDİYAN) ATEŞLEME ---
            Console.WriteLine($"[FSM -> YENİÇERİ] {bot.WolvesvilleId} için dilsiz izole kabuk tetikleniyor...");
            var yeniceriPayload = new
            {
                UserId = bot.UserId,
                Email = bot.Email,
                Password = bot.Password,
                WolvesvilleId = bot.WolvesvilleId,
                AssignedProxy = _proxyServerUrl,
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            };

            try
            {
                var yeniceriContent = new StringContent(JsonSerializer.Serialize(yeniceriPayload, _jsonOptions), Encoding.UTF8, "application/json");
                var yeniceriResponse = await httpClient.PostAsync($"{_yeniceriUrl}/launch-container", yeniceriContent);

                if (!yeniceriResponse.IsSuccessStatusCode)
                {
                    bot.Status = "Docker Hatası";
                    SaveRegistryToFile();
                    return BadRequest(new { success = false, message = "Yeniçeri siber kabuğu ayağa kaldıramadı!" });
                }
                Console.WriteLine("[FSM <- YENİÇERİ] Gardiyan konteynırı mermi gibi ateşledi.");
            }
            catch (Exception ex)
            {
                bot.Status = "Yeniçeri İletişim Hatası";
                SaveRegistryToFile();
                return StatusCode(500, new { success = false, message = $"Yeniçeri hattı koptu: {ex.Message}" });
            }

            bot.Status = "Çalışıyor";
            SaveRegistryToFile();
            return Ok(new { success = true, message = "Operasyon Yeniçeri safında başlatıldı kanka." });
        }

        // ========================================================
        // 3. SHOP API: BOT DURDURMA PROTOKOLÜ (STOP)
        // ========================================================
        [HttpPost("stop-bot")]
        public async Task<IActionResult> StopBot([FromBody] FsmStopRequest request)
        {
            if (!_botRegistry.TryGetValue(request.Email, out var bot)) return NotFound();

            bot.Status = "Durduruldu";
            SaveRegistryToFile();
            Console.WriteLine($"\n[FSM] [🛑 STOP] {bot.Email} operasyonu askıya alınıyor...");

            var httpClient = _clientFactory.CreateClient();
            var stopPayload = new { WolvesvilleId = bot.WolvesvilleId };
            var stopContent = new StringContent(JsonSerializer.Serialize(stopPayload), Encoding.UTF8, "application/json");

            try
            {
                await httpClient.PostAsync($"{_yeniceriUrl}/stop-container", stopContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FSM UYARI] Yeniçeri durdurma sinyalini işletemedi: {ex.Message}");
            }

            return Ok(new { success = true, message = "Durduruldu." });
        }

        // ========================================================
        // 💀 4. YENİ: KONTEYNIRLARI KÖKTEN SİLME (KILL)
        // ========================================================
        [HttpPost("kill-bot")]
        public async Task<IActionResult> KillBot([FromBody] FsmKillRequest request)
        {
            var bot = _botRegistry.Values.FirstOrDefault(x => x.Email == request.Email || x.WolvesvilleId == request.WolvesvilleId);
            string targetWovId = bot != null ? bot.WolvesvilleId : request.WolvesvilleId;

            if (string.IsNullOrEmpty(targetWovId)) return BadRequest("Silinecek bota ait kimlik bulunamadı.");

            if (bot != null) _botRegistry.TryRemove(bot.Email, out _);
            SaveRegistryToFile();

            Console.WriteLine($"\n[FSM] [💀 KILL] {targetWovId} konteynırı kökten imha ediliyor...");

            var httpClient = _clientFactory.CreateClient();
            var killPayload = new { WolvesvilleId = targetWovId };
            var killContent = new StringContent(JsonSerializer.Serialize(killPayload), Encoding.UTF8, "application/json");

            try
            {
                await httpClient.PostAsync($"{_yeniceriUrl}/kill-container", killContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FSM HATA] Yeniçeri imha sinyalini işletemedi: {ex.Message}");
            }

            return Ok(new { success = true, message = "Konteynır yok edildi." });
        }

        // ========================================================
        // 5. YSS (OYUN MOTORU) CANLI RAPOR KANALI
        // ========================================================
        [HttpPost("report-progress")]
        public async Task<IActionResult> ReportProgress([FromBody] XpReportRequest report)
        {
            var bot = _botRegistry.Values.FirstOrDefault(x => x.WolvesvilleId == report.WolvesvilleId);

            if (bot == null)
            {
                Console.WriteLine($"⚠️ [ZOMBİ ALARMI] Hayalet bot vurdu: {report.WolvesvilleId}!");
                var httpClientEmergency = _clientFactory.CreateClient();
                var emergencyContent = new StringContent(JsonSerializer.Serialize(new { WolvesvilleId = report.WolvesvilleId }), Encoding.UTF8, "application/json");
                await httpClientEmergency.PostAsync($"{_yeniceriUrl}/stop-container", emergencyContent);
                return NotFound(new { message = "Hayalet bot yakalandı ve Yeniçeri tarafından askıya alındı." });
            }

            bot.CurrentXp += report.GainedXp;
            SaveRegistryToFile();
            Console.WriteLine($"[YSS -> FSM] {bot.WolvesvilleId} Maçta +{report.GainedXp} XP kastı. Toplam: {bot.CurrentXp}");

            var httpClient = _clientFactory.CreateClient();
            var syncPayload = new { UserId = bot.UserId, GainedXp = (long)report.GainedXp };
            var jsonContent = new StringContent(JsonSerializer.Serialize(syncPayload, _jsonOptions), Encoding.UTF8, "application/json");

            try
            {
                var shopResponse = await httpClient.PostAsync(_shopSyncUrl, jsonContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FSM HATA] Shop API senkronizasyon hattı koptu: {ex.Message}");
            }

            if (bot.CurrentXp >= bot.AccountXpLimit || bot.CurrentXp >= bot.UserXpLimit)
            {
                bot.Status = "Limit Doldu";
                SaveRegistryToFile();
                var stopPayload = new { WolvesvilleId = bot.WolvesvilleId };
                var stopContent = new StringContent(JsonSerializer.Serialize(stopPayload), Encoding.UTF8, "application/json");

                try
                {
                    await httpClient.PostAsync($"{_yeniceriUrl}/stop-container", stopContent);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[FSM HATA] Yeniçeri durdurma emrini yerine getiremedi: {ex.Message}");
                }
            }

            return Ok(new { success = true });
        }

        // ========================================================
        // 6. SHOP PANELİ: ANLIK DASHBOARD İSTATİSTİKLERİ
        // ========================================================
        [HttpGet("dashboard-stats")]
        public IActionResult GetDashboardStats()
        {
            var bots = _botRegistry.Values.ToList();
            long totalXp = bots.Sum(x => x.CurrentXp);

            return Ok(new { success = true, totalXpGained = totalXp, accounts = bots });
        }

        // ========================================================
        // 💾 SİBER PERSISTENCE: JSON DISK MOTORU
        // ========================================================
        private void SaveRegistryToFile()
        {
            lock (_fileLock)
            {
                try
                {
                    var json = JsonSerializer.Serialize(_botRegistry);
                    System.IO.File.WriteAllText(REGISTRY_FILE_PATH, json, Encoding.UTF8);
                }
                catch (Exception ex) { Console.WriteLine($"[HAFIZA HATA] JSON yazılamadı: {ex.Message}"); }
            }
        }

        private void LoadRegistryFromFile()
        {
            lock (_fileLock)
            {
                try
                {
                    if (System.IO.File.Exists(REGISTRY_FILE_PATH))
                    {
                        string json = System.IO.File.ReadAllText(REGISTRY_FILE_PATH, Encoding.UTF8);
                        var recoveredData = JsonSerializer.Deserialize<ConcurrentDictionary<string, BotStatusModel>>(json);

                        if (recoveredData != null)
                        {
                            _botRegistry.Clear();
                            foreach (var kvp in recoveredData) { _botRegistry.TryAdd(kvp.Key, kvp.Value); }
                            Console.WriteLine($"[HAFIZA OKUNDU] Siber Hafıza Geri Yüklendi! Toplam {_botRegistry.Count} aktif bot kaydı RAM'e çekildi.");
                        }
                    }
                }
                catch (Exception ex) { Console.WriteLine($"[HAFIZA HATA] JSON okunamadı: {ex.Message}"); }
            }
        }
    }

    // --- 🗃️ SAAS UYUMLU DOĞRU VE HAKİKİ DTO MODELLERİ ---
    public class RegisterWorkerRequest { public string WorkerName { get; set; } = string.Empty; public string WorkerUrl { get; set; } = string.Empty; }
    public class InventoryActionRequest { public string Email { get; set; } = string.Empty; public string Action { get; set; } = string.Empty; }
    public class AccountStartRequest { public Guid UserId { get; set; } public string Email { get; set; } = string.Empty; public string Password { get; set; } = string.Empty; public string WolvesvilleId { get; set; } = string.Empty; public long XpLimit { get; set; } }
    public class FsmStopRequest { public string Email { get; set; } = string.Empty; }
    public class FsmKillRequest { public string Email { get; set; } = string.Empty; public string WolvesvilleId { get; set; } = string.Empty; }
    public class XpReportRequest { public string WolvesvilleId { get; set; } = string.Empty; public int GainedXp { get; set; } }

    public class FsmStartRequest
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string WolvesvilleId { get; set; } = string.Empty;
        public long RemainingUserXpLimit { get; set; }
        public long AccountXpLimit { get; set; }
        public bool RoleCardOptimizer { get; set; }
        public bool ExchangeNetwork { get; set; }
        public bool RandomEmoteSender { get; set; }
        public bool AutoAvatarSlot { get; set; }
        public bool AutoXpBoost { get; set; }
        public bool AutoTalisman { get; set; }
        public FsmClanConfig ClanConfig { get; set; } = new FsmClanConfig();
    }

    public class FsmClanConfig
    {
        public int GoldAmount { get; set; }
        public int GemAmount { get; set; }
        public string GoldScheduleType { get; set; } = "0";
        public string GemScheduleType { get; set; } = "0";
        public int GoldDayOfWeek { get; set; }
        public int GemDayOfWeek { get; set; }
        public int GoldDayOfMonth { get; set; }
        public int GemDayOfMonth { get; set; }
        public int GoldMonthOfYear { get; set; } = 1;
        public int GemMonthOfYear { get; set; } = 1;
        public int GoldDayOfYear { get; set; }
        public int GemDayOfYear { get; set; }
        public bool AutoSkipQuest { get; set; }
    }

    public class BotStatusModel
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string WolvesvilleId { get; set; } = string.Empty;
        public long UserXpLimit { get; set; }
        public long AccountXpLimit { get; set; }
        public long CurrentXp { get; set; }
        public string Status { get; set; } = "Hazır";
        public bool RoleCardOptimizer { get; set; }
        public bool ExchangeNetwork { get; set; }
        public bool RandomEmoteSender { get; set; }
        public bool AutoAvatarSlot { get; set; }
        public bool AutoXpBoost { get; set; }
        public bool AutoTalisman { get; set; }
        public FsmClanConfig ClanConfig { get; set; } = new FsmClanConfig();
    }
}