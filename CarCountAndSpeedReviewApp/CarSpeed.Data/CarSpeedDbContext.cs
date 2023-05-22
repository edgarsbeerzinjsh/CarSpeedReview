using CarSpeed.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace CarSpeed.Data
{
    public class CarSpeedDbContext : DbContext, ICarSpeedDbContext
    {
        public CarSpeedDbContext(DbContextOptions options) : base(options)
        { 
        }

        public DbSet<CarSpeedEntry> CarSpeeds { get; set; }
    }
}
