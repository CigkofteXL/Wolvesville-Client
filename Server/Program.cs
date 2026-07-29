using yss.varietyshop.com.tr.Services;

namespace yss.varietyshop.com.tr
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            // HTTP Factory'i ekliyoruz ki YSS dışarıya Post atabilsin kanka
            builder.Services.AddHttpClient();
            builder.Services.AddSingleton<CommandManager>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            // 🔥 KRİTİK: Proje ayağa kalktığında WebSocket Santralini de ateşliyoruz panpa!
            var cmdManager = app.Services.GetRequiredService<CommandManager>();
            cmdManager.StartServer();

            app.Run();
        }
    }
}