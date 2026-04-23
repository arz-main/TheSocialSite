using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
namespace TheSocialSite.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseCreatorController : ControllerBase
    {
        private readonly ICourseCreatorAction _CCAction;


    }
}
