using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        internal readonly IUserLoginAction _userLoginAction;
        public LoginController()
        {
            var bl = new Business.BusinessLogic();
            _userLoginAction = bl.UserLoginAction();
        }

        [HttpPost]
        public IActionResult Login([FromBody] UserLoginDto loginData)
        {
            if (loginData == null)
            {
                return BadRequest("No data provided");
            }
            UserLoginValidationDto validationInfo = _userLoginAction.UserLoginDataValidation(loginData);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.ErrorMessage);
            }
            return Ok($"User login successful. UserIdentifier: {validationInfo.UserIdentifier}");
        }
    }
}
