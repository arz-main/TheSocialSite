using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.DataAccess.Context;
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

        [HttpPost("create")]
        public IActionResult CreateUser([FromBody] UserSignupDto userData)
        {
            var validation = _userAction.UserCreationAction(userData);
            if (!validation.IsValid)
                return BadRequest(validation.Message);

            return Ok(new { message = "User created successfully" });
        }

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile()
        {
            // Read the user ID that was baked into the token at login time
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
            if (userId == null)
                return Unauthorized();

            using var ctx = new UserContext();
            var user = ctx.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
                return NotFound("User not found.");

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.Avatar,
                user.Bio,
                user.Location,
                user.Website,
                user.PostsCount,
                user.JoinedDate,
                SocialLinks = user.SocialLinks
            });
        }

        [HttpPut("profile")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] UpdateProfileDto profileData)
        {
            if (profileData == null)
                return BadRequest("No data provided");

            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Jti);
            if (userId == null)
                return Unauthorized();

            var result = _userAction.UpdateProfileAction(userId, profileData);
            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result);
        }
    }
}