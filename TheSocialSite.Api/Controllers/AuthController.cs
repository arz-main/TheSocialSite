using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;
using TheSocialSite.Domain.Models.User;

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
                return BadRequest(validation.ErrorMessage);

            // Generate token AFTER validation
            var token = _jwtService.GenerateTokenAction(validation.UserIdentifier);

            return Ok(new
            {
                token,
                user = validation.UserIdentifier
            });
        }

        [HttpPost("signup")]
        public IActionResult Signup([FromBody] UserSignupDto userData)
        {
            if (userData == null)
            {
                return BadRequest("No data provided");
            }
            UserSignupValidationDto validationInfo = _userAuthAction.CreateUserAction(userData);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.ErrorMessage);
            }
            return Ok(new
            {
                message = "User created successfully"
            });
        }
    }
}
