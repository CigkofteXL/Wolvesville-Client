using Microsoft.EntityFrameworkCore;
using api.varietyproxys.com.tr.Data;
using api.varietyproxys.com.tr.Services;

namespace api.varietyproxys.com.tr
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // 1. Veritabanı Yolunu Tanımla (Proje klasöründe proxy.db adında bir dosya açar)
            builder.Services.AddDbContext<ProxyDbContext>(options =>
                options.UseSqlite("Data Source=proxy.db"));

            // 2. ProxyManager'ı Singleton (Tekil Ömürlü) olarak sisteme kaydet
            builder.Services.AddSingleton<ProxyManager>();

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            var app = builder.Build();

            // 3. wwwroot altındaki index.html panelini dışarıya açmak için aktif et
            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            // 🔥 4. PROXY MOTORUNU ATEŞLE (8888 portunda trafiği dinlemeye başlar)
            var proxyManager = app.Services.GetRequiredService<ProxyManager>();
            proxyManager.StartProxy(8888);

            // 5. Veritabanı yoksa otomatik oluşturmasını sağla (Migration uğraşını eler)
            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ProxyDbContext>();
                db.Database.EnsureCreated();
            }

            app.Run();
        }
    }
}