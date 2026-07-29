using Microsoft.AspNetCore.Mvc;
using System;
using yss.varietyshop.com.tr.Services;

namespace yss.varietyshop.com.tr.Controllers
{
    [ApiController]
    [Route("bot-action")]
    public class BotActionController : ControllerBase
    {
        private readonly CommandManager _cmdManager;

        // Singleton veya Scoped olarak kayıtlı CommandManager içeri alınıyor kanka
        public BotActionController(CommandManager cmdManager)
        {
            _cmdManager = cmdManager;
        }

        // ========================================================
        // 📦 FSM'DEN GELEN MANUEL HASAT / ÇARK EMİRLERİNİ TETİKLER
        // ========================================================
        [HttpPost("trigger-inventory")]
        public IActionResult TriggerInventory([FromBody] FsmInventoryActionRequest model)
        {
            if (model == null || string.IsNullOrEmpty(model.WolvesvilleId))
                return BadRequest("Geçersiz siber emir paketi.");

            Console.WriteLine($"[FSM -> YSS API] 🟢 EMİR ALINDI: {model.WolvesvilleId} için {model.Action.ToUpper()} tetikleniyor...");

            // Switch mekanizmasıyla doğrudan CommandManager'daki socket fonksiyonlarına vuruyoruz kanka
            switch (model.Action.ToLower())
            {
                case "open-lootbox":
                    _cmdManager.OpenLootBox(model.WolvesvilleId);
                    break;
                case "spin-rose":
                    _cmdManager.SpinRoseWheel(model.WolvesvilleId);
                    break;
                case "spin-gold":
                    _cmdManager.SpinGoldWheel(model.WolvesvilleId);
                    break;
                default:
                    return BadRequest($"Bilinmeyen siber aksiyon: {model.Action}");
            }

            return Ok(new { success = true, message = "Emir soket hattına basıldı." });
        }
    }

    // --- DTO MODELİ ---
    public class FsmInventoryActionRequest
    {
        public string WolvesvilleId { get; set; } = string.Empty; // _activeBots sözlüğündeki anahtar (botName)
        public string Action { get; set; } = string.Empty;
    }
}