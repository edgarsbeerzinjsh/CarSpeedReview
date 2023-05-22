using CarSpeed.Core.Models;

namespace CarSpeed.Core.Services
{
    public interface ICarSpeedService : IDbService<CarSpeedEntry>
    {
        public IEnumerable<AverageSpeedByHour> GetAverageSpeedByHour(DateTime date);
        public IEnumerable<CarSpeedEntry> PagedEntries(IEnumerable<CarSpeedEntry> carList, Paging page);
        public IEnumerable<DateTime> GetDistinct(Func<CarSpeedEntry, DateTime> selector);
    }
}
