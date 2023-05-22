using CarSpeed.Core.Models;
using CarSpeed.Core.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace CarSpeed.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CarSpeedDataController : BaseCarSpeedController
    {
        public CarSpeedDataController(ICarSpeedService carSpeedService) : base(carSpeedService)
        {
        }

        [HttpGet]
        public IActionResult GetAll([FromQuery] Paging @params)
        {
            var dbEntries = _carSpeedService.GetAll();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(
                new PaginationMetadata (dbEntries.Count(), @params.Page, @params.ItemsPerPage)));

            return Ok(_carSpeedService.PagedEntries(dbEntries, @params));
        }

        [HttpGet]
        [Route("filtered")]
        public IActionResult GetFiltered([FromQuery] Paging @params, [FromQuery] EntryDataFilter filters)
        {
            var filteredData = _carSpeedService.GetFiltered(e => 
                e.Speed > filters.MinimalSpeed && 
                e.TimeOfRecord >= filters.DateFrom && 
                e.TimeOfRecord <= filters.DateTo);

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(
                new PaginationMetadata(filteredData.Count(), @params.Page, @params.ItemsPerPage)));

            return Ok(_carSpeedService.PagedEntries(filteredData, @params));
        }

        [HttpPost]
        [Route("upload")]
        public IActionResult AddData(List<CarSpeedEntry> batch)
        {
            _carSpeedService.CreateBatch(batch);

            return Ok();
        }
    }
}
