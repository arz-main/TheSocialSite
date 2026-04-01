using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

            var user = _userAction.GetUserByIdAction(id);
            if (user == null) return Unauthorized();

            // if this is uncommented the admin page won't allow other users profile updates
            // when the admin controller is in place, put these lines back
            // also make sure the id comes from the jwt later, dont allow users to modify other users
            //if (userId != id)
            //    return Forbid("You can only update your own profile");

            var result = _userAction.UserUpdateAction(id, profileData);
            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser([FromRoute] string id)
        {
            var user = _userAction.GetUserByIdAction(id);
            if (user == null) return Unauthorized();

            // same story as with the update endpoint above
            //if (userId != id)
            //    return Forbid();

            var result = _userAction.UserDeleteAction(id);

            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }
    }
}