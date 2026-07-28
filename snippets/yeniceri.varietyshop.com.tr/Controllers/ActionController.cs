using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.IO;

namespace yeniceri.varietyshop.com.tr.Controllers
{
    [ApiController]
    [Route("action")] // api/ eki tamamen kaldırıldı, direkt operasyon rotası
    public class ActionController : ControllerBase
    {
        // ========================================================
        // 1. FSM EMRE: SAĞIR VE İZOLE BOT KONTEYNIRINI ATEŞLE (START)
        // ========================================================
        [HttpPost("launch-container")]
        public IActionResult LaunchContainer([FromBody] ContainerLaunchRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { success = false, message = "Eksik bot mühimmatı!" });
            }

            // Docker'da ad çakışması olmasın diye konteynır ismini bot adına göre sabitliyoruz kanka
            string safeProfileName = request.WolvesvilleId.Replace(" ", "_");
            string containerName = $"wov_bot_{safeProfileName}";
            Console.WriteLine($"\n[YENİÇERİ] FSM'den BAŞLAT emri geldi! Profil: {request.WolvesvilleId}");

            try
            {
                // 🔥 ÇEREZ KORUMA KALKANI: Konteynır silinse bile çerezler yerel diskte kalsın diye yol çiziyoruz
                string hostProfilesDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "HBV_Profiles", safeProfileName);

                // Docker daemon klasörü root olarak açmasın diye yerelde klasörü biz oluşturuyoruz kanka
                if (!Directory.Exists(hostProfilesDir))
                {
                    Directory.CreateDirectory(hostProfilesDir);
                }

                var processInfo = new ProcessStartInfo
                {
                    FileName = "docker",
                    // 🔥 RECOV: BOT_EMAIL, BOT_PASSWORD ve -v Volume köprüsü mermi gibi enjekte edildi!
                    Arguments = $"run -d --name {containerName} " +
                                $"-v \"{hostProfilesDir}\":\"/app/HBV_Profiles/{safeProfileName}\" " +
                                $"-e BOT_EMAIL=\"{request.Email}\" " +
                                $"-e BOT_PASSWORD=\"{request.Password}\" " +
                                $"-e BOT_PROFIL=\"{request.WolvesvilleId}\" " +
                                $"-e BOT_PROXY=\"{request.AssignedProxy}\" " +
                                $"-e BOT_UA=\"{request.UserAgent}\" " +
                                $"hbv_bot_node:latest",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(processInfo))
                {
                    if (process == null) return StatusCode(500, "Docker soket sürücüsü tetiklenemedi.");

                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();

                    if (process.ExitCode != 0)
                    {
                        Console.WriteLine($"[YENİÇERİ HATA] Konteynır kalkamadı: { error}");
                        return BadRequest(new { success = false, message = error });
                    }

                    string containerId = output.Trim();
                    Console.WriteLine($"[YENİÇERİ SUCCESS] Asker sahaya fırlatıldı! ID: { containerId}");

                    return Ok(new { success = true, containerId = containerId });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ========================================================
        // 2. FSM EMRE: SİTEDEN MANUEL DURDURMA BASILDIĞINDA (STOP)
        // ========================================================
        [HttpPost("stop-container")]
        public IActionResult StopContainer([FromBody] ContainerStopRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.WolvesvilleId)) return BadRequest();

            string containerName = $"wov_bot_{request.WolvesvilleId.Replace(" ", "_")}";
            Console.WriteLine($"\n[YENİÇERİ] Siteden geçici DURDURMA emri geldi: { containerName}");

            try
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = $"stop {containerName}", // Sadece askıya alır, verileri ve hacimleri ellemez
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(processInfo))
                {
                    if (process == null) return StatusCode(500, "Docker CLI bağlantı hatası.");
                    process.WaitForExit();

                    Console.WriteLine($"[YENİÇERİ] {containerName} askıya alındı.");
                    return Ok(new { success = true });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ========================================================
        // 3. FSM EMRE: KOTA BİTTİĞİNDE KONTEYNIRI KÖKTEN KAZI (KILL)
        // ========================================================
        [HttpPost("kill-container")]
        public IActionResult KillContainer([FromBody] ContainerKillRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.WolvesvilleId)) return BadRequest();

            string containerName = $"wov_bot_{request.WolvesvilleId.Replace(" ", "_")}";
            Console.WriteLine($"\n[YENİÇERİ] KOTA BİTTİ VEYA SİLİNDİ!Konteynır imha ediliyor: { containerName}");

            try
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = "docker",
                    Arguments = $"rm -f {containerName}", // -f hem stop çeker hem konteynırı siler. -v eklemedik çünkü çerez klasörü hostta kalmalı!
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(processInfo))
                {
                    if (process == null) return StatusCode(500, "Docker CLI imha hatası.");
                    process.WaitForExit();

                    Console.WriteLine($"[YENİÇERİ] {containerName} sistemden tamamen kazındı. Çerezler korundu.");
                    return Ok(new { success = true });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    // --- SİBER DTO MODELLERİ ---
    public class ContainerLaunchRequest
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string WolvesvilleId { get; set; } = string.Empty;
        public string AssignedProxy { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
    }

    public class ContainerStopRequest { public string WolvesvilleId { get; set; } = string.Empty; }
    public class ContainerKillRequest { public string WolvesvilleId { get; set; } = string.Empty; }
}