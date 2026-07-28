using Microsoft.EntityFrameworkCore;
using api.varietyproxys.com.tr.Entities;

namespace api.varietyproxys.com.tr.Data
{
    public class ProxyDbContext : DbContext
    {
        public ProxyDbContext(DbContextOptions<ProxyDbContext> options) : base(options) { }
        public DbSet<ProxyEntity> Proxies { get; set; }
    }
}