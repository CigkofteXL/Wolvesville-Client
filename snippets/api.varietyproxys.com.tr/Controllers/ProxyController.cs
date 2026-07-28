using Microsoft.AspNetCore.Mvc;
using api.varietyproxys.com.tr.Services;
using api.varietyproxys.com.tr.Entities;
using System.Threading.Tasks;
using System;

namespace api.varietyproxys.com.tr.Controllers
{
    [ApiController]
    [Route("proxy-manager")]
    public class ProxyManagerController : ControllerBase
    {
        private readonly ProxyManager _proxyManager;

        public ProxyManagerController(ProxyManager proxyManager)
        {
            _proxyManager = proxyManager;
        }

        // ========================================================
        // 🔥 FSM'DEN GELECEK DİNAMİK BASIC AUTH TESCİL KAPISI
        // ========================================================
        [HttpPost("assign")]
        public IActionResult AssignProxy([FromBody] ProxyAssignRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { success = false, message = "Eskik bot istihbaratı!" });
            }

            try
            {
                // 1. Havuzdaki 'IsActive = true' ve boşta olan fiziksel ProxyEntity çekiliyor kanka
                var mockPhysicalProxy = new ProxyEntity
                {
                    Ip = "185.230.12.45", // Gerçek canlıda burası DB'den çekilecek
                    Port = 3128,
                    Username = "variety_provider_user",
                    Password = "secure_password_123"
                };

                // 2. 🔥 HATA FIX: _proxyApiManager yerine _proxyManager ve doğru SyncBotProxy metodu bağlandı panpa
                _proxyManager.SyncBotProxy(request.Email, request.Password, mockPhysicalProxy);

                Console.WriteLine($"[PROXY-API] {request.WolvesvilleId} ({request.Email}) için yönlendirme tüneli kilitlendi.");

                return Ok(new { success = true, message = "Siber rota başarıyla kilitlendi." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    // --- SİBER PROXY MODEL YAPILARI ---
    public class ProxyAssignRequest
    {
        public Guid UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string WolvesvilleId { get; set; } = string.Empty;
    }
}