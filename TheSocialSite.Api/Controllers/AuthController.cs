using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthInteractAction _userAuthAction;
        private readonly IUserInteractAction _userInteractAction;
        private readonly IJwtInteractAction _jwtInteractAction;
        public AuthController()
        {
            _userAuthAction = new BusinessLogic().UserAuthAction();
            _userInteractAction = new BusinessLogic().UserInteractAction();
            _jwtInteractAction = new BusinessLogic().JwtInteractAction();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto loginData)
        {
            if (loginData == null)
                return BadRequest("No data provided");

            var response = _userAuthAction.UserLoginDataValidationAction(loginData);

            if (!response.IsValid)
                return BadRequest(response.Message);
            Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(response));
            return Ok(response);
        }

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] CreateUserDto userData)
        {
            if (userData == null)
                return BadRequest("No data provided");

            var response = _userInteractAction.CreateUserAction(userData);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpPost("refresh-token/{id}")]
        [Authorize]
        public IActionResult RefreshTokenForUser([FromRoute] string id)
        {
            var userResponse = _userInteractAction.GetUserByIdAction(id);
            if (!userResponse.IsValid)
                return NotFound(userResponse.Message);

            var isAdmin = User.IsInRole("Admin");
            var userIdFromToken = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!isAdmin && userIdFromToken != id)
                return Forbid();

            var user = userResponse.UserDto;
            var jwtResponse = _jwtInteractAction.GenerateTokenAction(user.Id, user.Username, user.Role);
            if (!jwtResponse.IsValid)
                return BadRequest("Failed to generate token.");

            return Ok(jwtResponse);
        }
    }
}
