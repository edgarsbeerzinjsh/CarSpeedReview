using CarSpeed.Core.Models;
using CarSpeed.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSpeed.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CleanupController : ControllerBase
    {
        public IDbService<CarSpeedEntry> _dbService;
        public CleanupController(IDbService<CarSpeedEntry> dbService)
        {
            _dbService = dbService;
        }

        [HttpDelete]
        public IActionResult Clear()
        {
            _dbService.ClearAll();

            return Ok();
        }
    }
}
