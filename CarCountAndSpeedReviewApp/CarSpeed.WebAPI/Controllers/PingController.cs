using CarSpeed.Core.Models;
using CarSpeed.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSpeed.WebAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PingController : ControllerBase
    {

        [HttpGet]
        public IActionResult GetEntryCount()
        {
            return Ok("Web api ON");
        }
    }
}
