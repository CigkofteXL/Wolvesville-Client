using Microsoft.Playwright;
using System;
using System.Collections.Concurrent;
using System.Diagnostics.Metrics;
using System.IO;
using System.Threading.Tasks;

namespace yeniceri.varietyshop.com.tr.Services
{
    public class BrowserService
    {
        private IPlaywright? _playwright;
        private IBrowserType? _chromium;

        // Tek konteynırda tek bir canlı bot oturumu tutacağımız için yönetimi tüy gibi hafiflettik kanka
        private IBrowserContext? _activeContext;

        // 1. Motoru Isıtma (Konteynır açıldığında bir kere çalışır)
        public async Task InitializeAsync()
        {
            _playwright = await Playwright.CreateAsync();
            _chromium = _playwright.Chromium;
            Console.WriteLine("[SYSTEM] Playwright Siber Motoru Ateşlendi!");
        }

        // 2. İzole Profil Başlatma
        public async Task<bool> LaunchProfileAsync()
        {
            // 🔥 DNA ENJEKSİYONU: Yeniçeri'nin konteynırın içine bastığı tüm mühimmatları okuyoruz kanka
            string profileName = Environment.GetEnvironmentVariable("BOT_PROFIL") ?? "Bilinmeyen_Asker";
            string proxyServer = Environment.GetEnvironmentVariable("BOT_PROXY") ?? "http://localhost:8888";
            string authEmail = Environment.GetEnvironmentVariable("BOT_EMAIL") ?? "";
            string authPassword = Environment.GetEnvironmentVariable("BOT_PASSWORD") ?? "";
            string userAgent = Environment.GetEnvironmentVariable("BOT_UA") ?? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

            if (_activeContext != null)
            {
                Console.WriteLine($"[MOTOR] {profileName} zaten bu kabukta yayında!");
                return false;
            }

            // Oturum verilerinin ve profilin konteynır içindeki izole güvenli adresi
            string userDataDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "HBV_Profiles", profileName.Replace(" ", "_"));

            // Siber Optimizasyon Argümanları
            var launchOptions = new BrowserTypeLaunchPersistentContextOptions
            {
                Headless = true, // 🔥 KRİTİK: Sunucuda arka planda 24/7 ekransız çalışacağı için burası true olmak zorunda kanka!
                Channel = "chrome", // Öz hakiki Chrome tüneli
                UserAgent = userAgent,

                // 🔥 PROXY DEVRİMİ BAĞLANDI: Sabit kapıya, botun kendi Mail/Şifresiyle basic auth yapıyoruz!
                Proxy = new Proxy
                {
                    Server = proxyServer,  // Bizim merkezi proxy istasyonunun adresi (localhost:8888 vb.)
                    Username = authEmail,   // Proxy istasyonumuz bizi bu mailden tanıyacak
                    Password = authPassword // Ve bu şifreyle dış dünyaya temiz IP'den fırlatacak
                },

                IgnoreDefaultArgs = new[] { "--disable-extensions", "--no-sandbox", "--enable-automation" },
                Args = new[]
                {
                    "--disable-gpu",
                    "--disable-dev-shm-usage",
                    "--mute-audio",
                    "--js-flags=--expose-gc",
                    "--disable-blink-features=AutomationControlled",
                    "--disable-features=BlockInsecurePrivateNetworkRequests",
                    "--disable-rtc-smoothness-algorithm",
                    "--disable-webrtc-hw-decoding",
                    "--disable-webrtc-hw-encoding",
                    "--webrtc-ip-handling-policy=disable_non_proxied_udp",
                    "--force-webrtc-ip-handling-policy",
                    "--proxy-bypass-list=<-loopback>"
                },
                ViewportSize = ViewportSize.NoViewport
            };

            try
            {
                // Tarayıcıyı ve İzole Oturumu Başlat kanka!
                _activeContext = await _chromium!.LaunchPersistentContextAsync(userDataDir, launchOptions);

                // Tarayıcı kapanırsa log fırlat
                _activeContext.Close += (_, _) =>
                {
                    Console.WriteLine($"[UYARI] { profileName} oturumu sonlandı!");
                    _activeContext = null;
                };

                var page = _activeContext.Pages.Count > 0 ? _activeContext.Pages[0] : await _activeContext.NewPageAsync();

                // Tarayıcı içi logları terminalimize akıtan hat
                page.Console += (_, msg) => Console.WriteLine($"[BROWSER LOG] { msg.Text}");

                // Vurgunun (modified_main.js) tetikleneceği Wolvesville siber hattına sızıyoruz kanka
                await page.GotoAsync("https://www.wolvesville.com/");

                // Optimize Edilmiş Cloudflare Avcısı (İşlemciyi eritmez)
                _ = Task.Run(async () =>
                {
                Console.WriteLine($"[CF-HUNTER] { profileName} için avcı nöbete başladı...");
                var cfLocator = page.Locator("iframe[src*='challenges.cloudflare.com']");
                var rnd = new Random();

                while (!page.IsClosed)
                {
                    try
                    {
                        if (await cfLocator.First.IsVisibleAsync())
                        {
                            Console.WriteLine($"[CF-HUNTER] { profileName} -Bulut Kalkanı Yakalandı!Kilitleniliyor...");
                            await Task.Delay(rnd.Next(1500, 3000));

                            var box = await cfLocator.First.BoundingBoxAsync();
                            if (box != null)
                            {
                                float clickX = box.X + (box.Width / 2) + rnd.Next(-15, 15);
                                float clickY = box.Y + (box.Height / 2) + rnd.Next(-5, 5);

                                await page.Mouse.MoveAsync(clickX, clickY, new MouseMoveOptions { Steps = rnd.Next(5, 15) });
                                await Task.Delay(rnd.Next(100, 250));

                                await page.Mouse.DownAsync();
                                await Task.Delay(rnd.Next(50, 150));
                                await page.Mouse.UpAsync();

                                Console.WriteLine($"[CF-HUNTER] { profileName} -Tıklandı.Tepki bekleniyor...");
                                await Task.Delay(5000);
                            }
                        }
                    }
                    catch { /* Siber kalkan esnekliği */ }

                    // 🔥 HATA FIX: İşlemci alev almasın diye stabil bekleme döngünün tabanına çekildi panpa
                    await Task.Delay(2000);
                }
                });

                Console.WriteLine($"[PWM] { profileName} başarıyla wolvesville hatlarına sızdı.");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PWM] HATA - {profileName} siber tüneli açamadı: {ex.Message}");
                return false;
            }
        }

        public async Task CloseProfileAsync()
        {
            if (_activeContext != null)
            {
                await _activeContext.CloseAsync();
                Console.WriteLine("[PWM] Profil kapatıldı ve bellek serbest bırakıldı.");
            }
        }
    }
}