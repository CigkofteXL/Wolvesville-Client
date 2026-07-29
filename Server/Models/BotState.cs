using System;
using System.Collections.Generic;

namespace yss.varietyshop.com.tr.Models
{
    public class BotState
    {
        public string BotName { get; set; } = string.Empty;
        public string PlayerId { get; set; } = string.Empty;
        public int GridIdx { get; set; }
        public string Role { get; set; } = "Bilinmiyor";
        public string Team { get; set; } = "Bilinmiyor";
        public bool IsDead { get; set; }
        public List<string> LoverIds { get; set; } = new();

        // 🔥 YENİ: Sürü Zekası ve Metrik Takip Değişkenleri
        public bool IsAlpha { get; set; } = false; // Lider mi? (Oda Kurucu)
        public DateTime LastSeen { get; set; } = DateTime.UtcNow; // Zombi tespiti için son sinyal
        public DateTime? MatchStartTime { get; set; } // Isı haritası (Heatmap) için maç başı
        public DateTime LastDailyClaim { get; set; } = DateTime.MinValue;
        public DateTime LastClanDonate { get; set; } = DateTime.MinValue;
        public DateTime LastInventorySync { get; set; } = DateTime.MinValue;
    }
}