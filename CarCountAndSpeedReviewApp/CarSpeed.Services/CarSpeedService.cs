using CarSpeed.Core.Models;
using CarSpeed.Core.Services;
using CarSpeed.Data;

namespace CarSpeed.Services
{
    public class CarSpeedService : DbService<CarSpeedEntry>, ICarSpeedService
    {
        public CarSpeedService(ICarSpeedDbContext context) : base(context)
        {
        }

        public override IEnumerable<CarSpeedEntry> GetAll()
        {
            return _context.Set<CarSpeedEntry>().OrderBy(t => t.TimeOfRecord);
        }

        public override IEnumerable<CarSpeedEntry> GetFiltered(Func<CarSpeedEntry, bool> filter)
        {
            return _context.Set<CarSpeedEntry>().Where(filter).OrderBy(t => t.TimeOfRecord);
        }

        public IEnumerable<AverageSpeedByHour> GetAverageSpeedByHour(DateTime date)
        {
            return _context.Set<CarSpeedEntry>()
                .Where(d => d.TimeOfRecord.Date == date.Date)
                .GroupBy(h => h.TimeOfRecord.Hour)
                .Select(g => new AverageSpeedByHour { Hour = g.Key, AverageSpeed = g.Average(e => e.Speed) });
        }

        public IEnumerable<CarSpeedEntry> PagedEntries(IEnumerable<CarSpeedEntry> carList, Paging page)
        {
            return carList
                .Skip((page.Page-1)*page.ItemsPerPage)
                .Take(page.ItemsPerPage);
        }

        public IEnumerable<DateTime> GetDistinct(Func<CarSpeedEntry, DateTime> selector)
        {
            return _context.Set<CarSpeedEntry>().Select(selector).Distinct().Order();
        }
    }
}
