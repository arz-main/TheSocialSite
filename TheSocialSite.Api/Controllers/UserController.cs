using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
            var response = _userAction.GetAllUsersAction();
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.UserDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetUser([FromRoute] string id)
        {
            var response = _userAction.GetUserByIdAction(id);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.UserDto);
        }

        [HttpPost("create")]
        public IActionResult CreateUser([FromBody] CreateUserDto userData)
        {
            var response = _userAction.CreateUserAction(userData);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateProfile([FromRoute] string id, [FromBody] UpdateUserDto profileData)
        {
            if (profileData == null)
                return BadRequest("No data provided");

            var response = _userAction.GetUserByIdAction(id);
            if (!response.IsValid) 
                return BadRequest(response.Message);

            // if a user tries to update another person's account, forbid the action
            var isAdmin = User.IsInRole("Admin");
            var userIdFromToken = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!isAdmin && userIdFromToken != id)
                return Forbid();

            var result = _userAction.UpdateUserAction(id, profileData);
            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteUser([FromRoute] string id)
        {
            var response = _userAction.GetUserByIdAction(id);
            if (!response.IsValid) return BadRequest(response.Message);

            // if a user tries to delete another person's account, forbid the action
            var isAdmin = User.IsInRole("Admin");
            var userIdFromToken = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (!isAdmin && userIdFromToken != id)
                return Forbid();

            var result = _userAction.DeleteUserAction(id);

            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }
    }
}