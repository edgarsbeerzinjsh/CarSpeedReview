using CarSpeed.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace CarSpeed.Data
{
    public interface ICarSpeedDbContext
    {
        DbSet<CarSpeedEntry> CarSpeeds { get; set; }

        DbSet<T> Set<T>() where T : class;
        EntityEntry<T> Entry<T>(T entity) where T : class;
        int SaveChanges();
    }
}
