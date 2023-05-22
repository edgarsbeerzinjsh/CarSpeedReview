using CarSpeed.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSpeed.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VisualizationController : BaseCarSpeedController
    {
        public VisualizationController(ICarSpeedService carSpeedService) : base(carSpeedService)
        {
        }

        [HttpGet]
        public IActionResult GetData([FromQuery] DateTime date)
        {
            return Ok(_carSpeedService.GetAverageSpeedByHour(date));
        }

        [HttpGet]
        [Route("possibleDays")]
        public IActionResult GetDaysWithData()
        {
            return Ok(_carSpeedService.GetDistinct(d => d.TimeOfRecord.Date));
        }
    }
}
