using System;
using System.Threading.Tasks;
using yeniceri.varietyshop.com.tr.Services;

namespace yeniceri.varietyshop.com.tr
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            // 🔥 ÇİFT MOD AYRIMI: Eğer içeride BOT_PROFIL env değişkeni varsa bu bir Docker askeri demektir!
            if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("BOT_PROFIL")))
            {
                Console.WriteLine("[SİSTEM] Konteynır içi bağımsız bot modu aktifleşti.");
                var browserService = new BrowserService();
                await browserService.InitializeAsync();
                await browserService.LaunchProfileAsync();

                // Konteynırın anında kapanıp ölmemesi için ana thread'i sonsuz uykuya alıyoruz panpa
                await Task.Delay(Timeout.Infinite);
            }
            else
            {
                // Sunucuda (Host OS) çıplak çalışıyorsa normal Yeniçeri Web API'sini ayağa kaldır kanka
                var builder = WebApplication.CreateBuilder(args);
                builder.Services.AddControllers();
                builder.Services.AddHttpClient();
                builder.Services.AddHostedService<FsmRegisterWorker>();

                var app = builder.Build();
                app.UseAuthorization();
                app.MapControllers();
                app.Run();
            }
        }
    }
}