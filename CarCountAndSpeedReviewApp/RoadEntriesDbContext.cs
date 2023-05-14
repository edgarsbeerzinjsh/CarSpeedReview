using CarCountAndSpeedReviewApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CarCountAndSpeedReviewApp
{
    public class RoadEntriesDbContext : DbContext
    {
        public RoadEntriesDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<RoadEntries> RoadEntries { get; set; }
    }
}
