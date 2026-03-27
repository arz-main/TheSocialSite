using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserInteractAction _userAction;

        public UserController()
        {
            var bl = new BusinessLogic();
            _userAction = bl.UserInteractAction();
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _userAction.GetAllUsersAction();
            if (users == null)
                return BadRequest("Could not find users");

            return Ok(users);
        }


        [HttpGet("{id}")]
        public IActionResult GetUser([FromRoute] string id)
        {
            var user = _userAction.GetUserByIdAction(id);
            if (user == null)
            {
                return BadRequest("Could not find user");
            }
            return Ok(user);
        }

        [HttpPost("create")]
        public IActionResult CreateUser([FromBody] UserSignupDto userData)
        {
            var validation = _userAction.UserCreationAction(userData);
            if (!validation.IsValid)
                return BadRequest(validation.Message);

            return Ok(new { message = "User created successfully" });
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateProfile([FromRoute] string id, [FromBody] UserUpdateDto profileData)
        {
            if (profileData == null)
                return BadRequest("No data provided");

            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null)
                return Unauthorized();

            if (userId != id)
                return Forbid("You can only update your own profile");

            var result = _userAction.UserUpdateAction(userId, profileData);
            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}