namespace fsm.varietyshop.com.tr
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });

            // Program.cs içerisine eklenecek satır:
            builder.Services.AddHttpClient();


            var app = builder.Build();


            app.UseCors("AllowAll");
            app.UseWebSockets();
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseAuthorization();
            app.MapControllers();

            Console.WriteLine("🐺 HBV Mega Swarm Commander Aktif!");
            Console.WriteLine("👉 Dashboard: http://localhost:5001");

            app.Run();
        }
    }
}