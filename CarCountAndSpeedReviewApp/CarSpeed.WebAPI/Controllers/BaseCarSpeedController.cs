using CarSpeed.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarSpeed.WebAPI.Controllers
{
    public abstract class BaseCarSpeedController : ControllerBase
    {
        protected ICarSpeedService _carSpeedService;
        protected BaseCarSpeedController(ICarSpeedService carSpeedService)
        {
            _carSpeedService = carSpeedService;
        }
    }
}
