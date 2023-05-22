using CarSpeed.Core.Models;
using CarSpeed.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSpeed.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PingController : ControllerBase
    {
        public IDbService<CarSpeedEntry> _dbService;
        public PingController(IDbService<CarSpeedEntry> dbService)
        {
            _dbService = dbService;
        }

        [HttpGet]
        public IActionResult GetEntryCount()
        {
            return Ok(_dbService.GetAll().Count());
        }
    }
}
