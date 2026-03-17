using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/signup")]
    [ApiController]
    public class SignupController : ControllerBase
    {
        internal readonly IUserSignupAction _userSignupAction;
        public SignupController()
        {
            var bl = new Business.BusinessLogic();
            _userSignupAction = bl.UserSignupAction();
        }

        [HttpPost]
        public IActionResult Signup([FromBody] UserSignupDto userData)
        {
            if (userData == null)
            {
                return BadRequest("No data provided");
            }
            UserSignupValidationDto validationInfo = _userSignupAction.UserCreation(userData);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.ErrorMessage);
            }
            return Ok($"User signup successful. Data: {validationInfo.Username}");
        }
    }
}
