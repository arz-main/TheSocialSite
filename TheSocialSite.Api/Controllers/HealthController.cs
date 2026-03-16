using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Healthy");
        }
    }
}
