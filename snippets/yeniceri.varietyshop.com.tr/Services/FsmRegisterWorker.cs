using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace yeniceri.varietyshop.com.tr.Services
{
    public class FsmRegisterWorker : IHostedService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _fsmRegisterUrl;
        private readonly string _myPort;

        public FsmRegisterWorker(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;

            // FSM'nin sabit domain adresi json'dan okunuyor kanka
            _fsmRegisterUrl = configuration["SystemSettings:FsmRegisterUrl"]
                ?? "http://fsm.varietyshop.com.tr/orchestrator/register-worker";

            _myPort = configuration["SystemSettings:MyPort"] ?? "5002";
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("\n[YENİÇERİ] Çekirdek hat ayağa kalkıyor...");

            // 🔥 SİBER İSTİHBARAT: Kendi dış IP'mizi otomatik kapıyoruz kanka
            string myExternalIp = await GetMyExternalIpAsync();
            string myExternalUrl = $"http://{myExternalIp}:{_myPort}";

            Console.WriteLine($"[Sİ SİSTEM] Kendi Dış IP'miz Çözüldü: {myExternalIp}");
            Console.WriteLine($"[İSTİHBARAT] Hedef FSM Rotalanıyor: {_fsmRegisterUrl}");

            var workerMetadata = new
            {
                WorkerName = "Yeniçeri_Askeri_Dinamik_Node",
                WorkerUrl = myExternalUrl // FSM'ye o anki dinamik dış IP'mizi fırlatıyoruz panpa
            };

            var client = _clientFactory.CreateClient();
            var jsonContent = new StringContent(JsonSerializer.Serialize(workerMetadata), Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync(_fsmRegisterUrl, jsonContent, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("[YENİÇERİ] Başarılı: FSM komuta zincirine dinamik IP ile tescil edildik! Emirler bekleniyor...\n");
                }
                else
                {
                    Console.WriteLine("[YENİÇERİ UYARI] FSM açık ama kaydı reddetti! appsettings.json kontrol et.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[YENİÇERİ HATA] FSM Merkezine ulaşılamadı! Hattı kontrol et kanka: {ex.Message}\n");
            }
        }

        // 🔥 KENDİ DIŞ IP'SİNİ BULAN SİBER METOT
        private async Task<string> GetMyExternalIpAsync()
        {
            var client = _clientFactory.CreateClient();
            try
            {
                // Dünyanın en stabil IP servislerinden birine hafif bir istek atıyoruz kanka
                string ip = await client.GetStringAsync("https://api.ipify.org");
                return ip.Trim();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UYARI] Dış IP otomatik alınamadı, yedek localhost hattına düşülüyor: {ex.Message}");
                return "127.0.0.1"; // Çökmesin diye fallback
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Console.WriteLine("[YENİÇERİ] İşçi kapatılıyor, FSM komuta hattından çıkılıyor.");
            return Task.CompletedTask;
        }
    }
}