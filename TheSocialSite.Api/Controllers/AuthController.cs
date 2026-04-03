using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
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

            var validation = _userAuthAction.UserLoginDataValidationAction(loginData);

            if (!validation.IsValid)
                return BadRequest(validation.Message);

            return Ok(validation);
        }

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] UserSignupDto userData)
        {
            if (userData == null)
            {
                return BadRequest("No data provided");
            }
            SignupActionResponse validationInfo = _userInteractAction.CreateUserAction(userData);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.Message);
            }
            return Ok(new
            {
                message = "User created successfully"
            });
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] UserRefreshTokenDto data)
        {
            var user = _userInteractAction.GetUserByIdAction(data.UserId);
            if (user == null) return Unauthorized();

            // Generate a NEW JWT using current user.Role
            var token = _jwtInteractAction.GenerateTokenAction(user.Id, user.Username, user.Role);

            return Ok(new { token });
        }
    }
}
