using System.ComponentModel.DataAnnotations;

namespace api.varietyproxys.com.tr.Entities
{
    public class ProxyEntity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Ip { get; set; }

        [Required]
        public int Port { get; set; }

        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? AssignedProfile { get; set; }

        // 🔥 YENİ SİBER PARAMETRELER
        public string Status { get; set; } = "Bilinmiyor"; // Online, Offline, Bilinmiyor
        public int Ping { get; set; } = 0; // ms cinsinden gecikme

        public bool IsActive { get; set; } = true;
    }
}