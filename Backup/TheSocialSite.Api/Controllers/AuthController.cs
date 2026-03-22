using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtServiceAction _jwtService;
        private readonly IUserAuthAction _userAuthAction;
        public AuthController()
        {
            _jwtService = new JwtServiceAction();
            _userAuthAction = new BusinessLogic().UserAuthAction();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDto loginData)
        {
            if (loginData == null)
                return BadRequest("No data provided");

            var validation = _userAuthAction.UserLoginDataValidation(loginData);

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
            SignupActionResponse validationInfo = _userAuthAction.UserCreationAction(userData);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.Message);
            }
            return Ok(new
            {
                message = "User created successfully"
            });
        }
    }
}
