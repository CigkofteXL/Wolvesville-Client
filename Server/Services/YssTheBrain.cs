using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using yss.varietyshop.com.tr.Models;

namespace yss.varietyshop.com.tr.Services
{
    public class YssTheBrain
    {
        private readonly CommandManager _cmdManager;
        private readonly ConcurrentDictionary<string, BotState> _manga = new ConcurrentDictionary<string, BotState>();

        // Görev Zamanlayıcısı ve Kuyruklar (Queue)
        private readonly Timer _heartbeatTimer;
        private readonly ConcurrentQueue<string> _lootboxQueue = new ConcurrentQueue<string>();

        // Metrikler (XP Gauge & Heatmap)
        private readonly ConcurrentBag<TimeSpan> _matchDurations = new ConcurrentBag<TimeSpan>();
        private long _totalXpGainedThisSession = 0;
        private DateTime _sessionStartTime = DateTime.UtcNow;

        private readonly string[] _tehlikeliSololar = { "serial-killer" };
        private readonly string[] _copSololar = { "headhunter", "fool" };

        public YssTheBrain(CommandManager cmdManager)
        {
            _cmdManager = cmdManager;

            // 🔥 BEYİN KALP ATIŞI: Her 5 saniyede bir siber döngüyü kontrol eder (Zombi, Görevler, Kuyruklar)
            _heartbeatTimer = new Timer(BrainHeartbeatTick, null, 5000, 5000);
        }

        // ========================================================
        // ⏱️ ZAMANLANMIŞ GÖREVLER & ZOMBİ TESPİT DÖNGÜSÜ
        // ========================================================
        private void BrainHeartbeatTick(object? state)
        {
            var now = DateTime.UtcNow;

            // 1. LOOTBOX QUEUE (Kuyruktaki Kutuları Tek Tek Eritir)
            if (_lootboxQueue.TryDequeue(out string targetBot))
            {
                Console.WriteLine($"📦 [QUEUE] Sıradaki kutu açılışı {targetBot} için tetikleniyor...");
                _cmdManager.OpenLootBox(targetBot);
            }

            foreach (var bot in _manga.Values.ToList())
            {
                // 2. ZOMBİ TESPİTİ (45 Saniye sinyal vermeyen botu infaz listesine atar)
                if ((now - bot.LastSeen).TotalSeconds > 45)
                {
                    Console.WriteLine($"⚠️ [ZOMBİ TESPİTİ] {bot.BotName} 45 saniyedir sağıra yatıyor! İnfaz emri veriliyor.");
                    _manga.TryRemove(bot.PlayerId, out _);
                    _cmdManager.KillZombieBot(bot.BotName); // CommandManager üzerinden FSM'yi vurur
                    continue;
                }

                // 3. DAILY CALENDAR CLAIMER (Günde 1 kez)
                if ((now - bot.LastDailyClaim).TotalHours >= 24)
                {
                    bot.LastDailyClaim = now;
                    _cmdManager.ClaimDailyCalendar(bot.BotName);
                }

                // 4. INVENTORY LIVE SYNC (Her 15 dakikada bir envanter senkronizasyonu)
                if ((now - bot.LastInventorySync).TotalMinutes >= 15)
                {
                    bot.LastInventorySync = now;
                    _cmdManager.SendCommandToBot(bot.BotName, "SYNC_INVENTORY", "");
                }

                // 5. CLAN QUEST DONATOR (Örnek: Her 2 saatte bir klan bağış tetiği yollar)
                if ((now - bot.LastClanDonate).TotalHours >= 2)
                {
                    bot.LastClanDonate = now;
                    _cmdManager.DonateClanQuest(bot.BotName, "gold", 100);
                }
            }
        }

        // ========================================================
        // 🎮 TEMEL OYUN MOTORU FONKSİYONLARI
        // ========================================================
        public void AskerSinyalVerdi(string botName, bool isAlpha)
        {
            // Sinyal (Ping) geldiğinde LastSeen güncellenir
            var bot = _manga.Values.FirstOrDefault(x => x.BotName == botName);
            if (bot != null)
            {
                bot.LastSeen = DateTime.UtcNow;
            }
            else
            {
                // İlk giriş
                bot = new BotState { BotName = botName, IsAlpha = isAlpha, LastSeen = DateTime.UtcNow };
                _manga.TryAdd(Guid.NewGuid().ToString(), bot); // PlayerId gelene kadar geçici ID

                // Kendiliğinden Oda Açma Lojiği: Eğer bot Alpha ise odayı anında kursun
                if (isAlpha)
                {
                    Console.WriteLine($"🐺 [OTO-ODA] Alpha bot {botName} sahaya indi. İlk CREATE_ROOM emri fırlatılıyor...");
                    _cmdManager.StartSwarmOperation(botName, "{}");
                }
            }
        }

        public void KuyrugaLootboxEkle(string botName)
        {
            _lootboxQueue.Enqueue(botName);
            Console.WriteLine($"📥 [QUEUE] {botName} kuyruğa eklendi. Sırada bekleyen: {_lootboxQueue.Count}");
        }

        public void AskerOyunaGirdi(string botName, string playerId, int gridIdx, string rol, string team)
        {
            var mevcutBot = _manga.Values.FirstOrDefault(x => x.BotName == botName);
            string key = playerId;

            if (mevcutBot != null)
            {
                // Geçici key'i silip asıl PlayerId ile mühürlüyoruz
                var tempKey = _manga.FirstOrDefault(x => x.Value.BotName == botName).Key;
                if (tempKey != null && tempKey != playerId) _manga.TryRemove(tempKey, out _);
                key = playerId;
            }

            if (!_manga.ContainsKey(key)) _manga[key] = new BotState();

            _manga[key].BotName = botName;
            _manga[key].PlayerId = playerId;
            _manga[key].GridIdx = gridIdx;
            _manga[key].Role = rol;
            _manga[key].Team = team;
            _manga[key].IsDead = false;
            _manga[key].LoverIds.Clear();
            _manga[key].LastSeen = DateTime.UtcNow;

            // Isı Haritası için başlangıç zamanını kaydet
            if (_manga[key].MatchStartTime == null)
                _manga[key].MatchStartTime = DateTime.UtcNow;
        }

        public void AsiklarBelirlendi(string playerId, List<string> loverIds)
        {
            if (_manga.ContainsKey(playerId))
            {
                _manga[playerId].LoverIds = loverIds.Where(id => id != playerId).ToList();
            }
        }

        public void GeceOldu()
        {
            Console.WriteLine("🌙 [KARARGAH BEYNİ] Gece çöktü. 'Vill Win' taktik matrisi hesaplanıyor...");

            var yasiyanlar = _manga.Values.Where(x => !x.IsDead).ToList();
            var kurtlar = yasiyanlar.Where(x => x.Team == "WEREWOLF").ToList();

            var asigiYasiyanKurtlar = kurtlar.Where(k => {
                var loverId = k.LoverIds.FirstOrDefault();
                var lover = yasiyanlar.FirstOrDefault(y => y.PlayerId == loverId);
                return lover != null && lover.Team != "WEREWOLF";
            }).ToList();

            var jw = asigiYasiyanKurtlar.FirstOrDefault(x => x.Role == "junior-werewolf");
            var digerKurt = asigiYasiyanKurtlar.FirstOrDefault(x => x.Role != "junior-werewolf");

            if (jw != null && digerKurt != null)
            {
                Console.WriteLine("⚡ [VILL WIN] Çapraz Aşık İnfaz Protokolü devrede.");
                string jwLoverId = jw.LoverIds.First();
                string digerKurtLoverId = digerKurt.LoverIds.First();

                _cmdManager.Useskill(jw.BotName, digerKurtLoverId);
                _cmdManager.Vote(digerKurt.BotName, jwLoverId);
            }
            else if (asigiYasiyanKurtlar.Count > 0)
            {
                Console.WriteLine("⚡ [VILL WIN] Kendi eşini infaz etme hattı devrede.");
                var secilenKurt = asigiYasiyanKurtlar.FirstOrDefault(k =>
                    yasiyanlar.FirstOrDefault(y => y.PlayerId == k.LoverIds.FirstOrDefault())?.Role != "priest") ?? asigiYasiyanKurtlar.First();

                _cmdManager.Vote(secilenKurt.BotName, secilenKurt.LoverIds.First());
            }

            // Seri Katil Yapay Zekası
            var sk = yasiyanlar.FirstOrDefault(x => x.Role == "serial-killer");
            if (sk != null)
            {
                string skHedefId = "";
                if (sk.LoverIds.Any()) skHedefId = sk.LoverIds.First();

                if (string.IsNullOrEmpty(skHedefId) && kurtlar.Count > 0)
                {
                    var kurban = yasiyanlar.FirstOrDefault(y => kurtlar.SelectMany(k => k.LoverIds).Contains(y.PlayerId) && y.Team != "WEREWOLF");
                    if (kurban != null) skHedefId = kurban.PlayerId;
                }

                if (string.IsNullOrEmpty(skHedefId))
                {
                    var rastgele = yasiyanlar.FirstOrDefault(x => x.PlayerId != sk.PlayerId && x.Team != "WEREWOLF");
                    if (rastgele != null) skHedefId = rastgele.PlayerId;
                }

                if (!string.IsNullOrEmpty(skHedefId)) _cmdManager.Useskill(sk.BotName, skHedefId);
            }
        }

        public void GunduzOldu()
        {
            Console.WriteLine("☀️ [KARARGAH BEYNİ] Gündüz oylama matrisi kuruluyor.");
            var yasiyanlar = _manga.Values.Where(x => !x.IsDead).ToList();

            var asilacakAdam = yasiyanlar.FirstOrDefault(x => _tehlikeliSololar.Contains(x.Role))
                               ?? yasiyanlar.FirstOrDefault(x => x.Team == "WEREWOLF")
                               ?? yasiyanlar.FirstOrDefault(x => _copSololar.Contains(x.Role));

            if (asilacakAdam != null)
            {
                Console.WriteLine($"🎯 HEDEF KİLİTLENDİ: {asilacakAdam.Role} ({asilacakAdam.GridIdx + 1})");

                var gunner = yasiyanlar.FirstOrDefault(x => x.Role == "gunner");
                bool gunnerVurabilir = (gunner != null && !gunner.LoverIds.Contains(asilacakAdam.PlayerId));

                var imam = yasiyanlar.FirstOrDefault(x => x.Role == "priest");
                bool imamVurabilir = false;
                bool imamIntiharEdecek = false;
                string imamIntiharHedefi = "";

                if (imam != null && asilacakAdam.Role != "serial-killer")
                {
                    if (imam.LoverIds.Contains(asilacakAdam.PlayerId))
                    {
                        var masumKoylu = yasiyanlar.FirstOrDefault(x => x.Team == "VILLAGER" && x.Role != "priest");
                        if (masumKoylu != null)
                        {
                            imamIntiharEdecek = true;
                            imamIntiharHedefi = masumKoylu.PlayerId;
                        }
                    }
                    else imamVurabilir = true;
                }

                if (imamIntiharEdecek) Task.Delay(1000).ContinueWith(t => { if (!imam!.IsDead) _cmdManager.Useskill(imam.BotName, imamIntiharHedefi); });
                else if (gunnerVurabilir) Task.Delay(1500).ContinueWith(t => { if (!gunner!.IsDead) _cmdManager.Useskill(gunner.BotName, asilacakAdam.PlayerId); });
                else if (imamVurabilir) Task.Delay(1500).ContinueWith(t => { if (!imam!.IsDead) _cmdManager.Useskill(imam.BotName, asilacakAdam.PlayerId); });

                foreach (var asker in yasiyanlar)
                {
                    if (asker.PlayerId != asilacakAdam.PlayerId && !asker.LoverIds.Contains(asilacakAdam.PlayerId))
                    {
                        Task.Delay(Random.Shared.Next(500, 2000)).ContinueWith(t => { if (!asker.IsDead) _cmdManager.Vote(asker.BotName, asilacakAdam.PlayerId); });
                    }
                }
            }
        }

        public void AskerOldu(string playerId)
        {
            if (_manga.TryGetValue(playerId, out var bot))
            {
                bot.IsDead = true;
                Console.WriteLine($"☠️ [BEYİN KONTROL] {bot.Role} can verdi.");
            }
        }

        public void MacBitti(string botName)
        {
            var bot = _manga.Values.FirstOrDefault(x => x.BotName == botName);
            if (bot != null && bot.MatchStartTime.HasValue)
            {
                // Isı Haritası (Heatmap) ve Süre Ölçümü
                var duration = DateTime.UtcNow - bot.MatchStartTime.Value;
                _matchDurations.Add(duration);
                bot.MatchStartTime = null;

                // XP/Hour Gauge Hesaplaması
                _totalXpGainedThisSession += 3500; // Maç başı xp
                double totalHours = (DateTime.UtcNow - _sessionStartTime).TotalHours;
                long xpPerHour = totalHours > 0 ? (long)(_totalXpGainedThisSession / totalHours) : _totalXpGainedThisSession;

                double avgSeconds = _matchDurations.Count > 0 ? _matchDurations.Average(ts => ts.TotalSeconds) : 0;

                Console.WriteLine($"\n📊 [METRİK] {botName} maçı tamamladı.");
                Console.WriteLine($"⏳ Game Duration: {duration.TotalSeconds:F1}s | Heatmap Avg: {avgSeconds:F1}s");
                Console.WriteLine($"🔥 XP/Hour Gauge: {xpPerHour.ToString("N0")} XP/h");
                Console.WriteLine($"🏁 Savaş meydanı temizlendi, bot beklemede.\n");
            }
        }
    }
}