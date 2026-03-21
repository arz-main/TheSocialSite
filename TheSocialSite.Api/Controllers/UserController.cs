using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Response;
namespace TheSocialSite.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserInteractAction _userAction;
        public UserController()
        {
            var bl = new Business.BusinessLogic();
            _userAction = bl.UserInteractAction();
        }
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _userAction.GetAllUsersAction();
            if(users == null)
            {
                return BadRequest("Could not find users");
            }
            return Ok(users);
        }
        [HttpPost("create")]
        public IActionResult CreateUser([FromBody] UserSignupDto userData)
        {
            var validation = _userAction.UserCreationAction(userData);
            if (!validation.IsValid)
                return BadRequest(validation.Message);

            return Ok(new { message = "User created successfully" });
        }
    }
}
