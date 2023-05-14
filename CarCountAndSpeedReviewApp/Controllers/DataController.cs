using CarCountAndSpeedReviewApp.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;

namespace CarCountAndSpeedReviewApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class DataController : ControllerBase
    {
        private static readonly ReaderWriterLockSlim entryWriteLockLock = new ReaderWriterLockSlim();
        private readonly RoadEntriesDbContext _context;
        public DataController(RoadEntriesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get([FromQuery] string date = "0000-00-00")
        {

            var roadEntries = _context.RoadEntries.OrderBy(time => time.TimeOfRecord);

            if (date == "0000-00-00")
            {
                var distinctDates = roadEntries
                    .Select(time => time.TimeOfRecord.Date.ToString("yyyy-MM-dd"))
                    .Distinct()
                    .ToList();
                return Ok(distinctDates);
            }

            var parsedDate = DateTime.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture).Date;
            var dateRoadEntries = roadEntries.Where(d => d.TimeOfRecord.Date == parsedDate);

            var hourlyAverageSpeeds = dateRoadEntries
                .GroupBy(e => e.TimeOfRecord.Hour)
                .Select(g => new {Hour = g.Key, AverageSpeed = g.Average(e => e.Speed)})
                .ToList();

            return Ok(hourlyAverageSpeeds);
        }

        [HttpPost]
        public IActionResult Post(RoadEntries data)
        {
            entryWriteLockLock.EnterWriteLock();
            try
            {
                _context.RoadEntries.Add(data);
                _context.SaveChanges();
            }
            finally
            {
                entryWriteLockLock.ExitWriteLock();
            }

            return Ok(data);
        }

        [Route("filtered")]
        [HttpPost]
        public IActionResult Filter(Filter? filter, [FromQuery] Paging @params)
        {
            var filterData = filter;

            if (filterData == null)
            {
                filterData = new Filter();
            }

            if (filter?.DateFrom == null)
            {
                filterData.DateFrom = DateTime.MinValue;
            }

            if (filter?.DateTo == null)
            {
                filterData.DateTo = DateTime.MaxValue;
            }

            if (filter?.MinimalSpeed == null)
            {
                filterData.MinimalSpeed = 0;
            }

            var roadEntries = _context.RoadEntries
                .Where(entry => entry.Speed > filterData.MinimalSpeed &&
                                entry.TimeOfRecord >= filterData.DateFrom &&
                                entry.TimeOfRecord <= filterData.DateTo)
                .OrderBy(time => time.TimeOfRecord);

            var paginationMetadata = new PaginationMetadata(roadEntries.Count(), @params.Page, @params.ItemsPerPage);
            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetadata));

            var items = roadEntries
                .Skip((@params.Page - 1) * @params.ItemsPerPage)
                .Take(@params.ItemsPerPage);

            return Ok(items);
        }


        [HttpPut]
        public IActionResult Clear()
        {
            _context.RoadEntries.RemoveRange(_context.RoadEntries);
            _context.SaveChanges();

            return Ok();
        }
    }
}
