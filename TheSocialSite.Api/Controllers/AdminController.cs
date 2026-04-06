using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminInteractAction _adminAction;
        private readonly IUserInteractAction _userAction;
        private readonly IPostInteractAction _postAction;
        public AdminController()
        {
            var bl = new BusinessLogic();
            _adminAction = bl.AdminInteractAction();
            _userAction = bl.UserInteractAction();
            _postAction = bl.PostInteractAction();
        }

        [HttpPut("user/{id}")]
        [Authorize]
        public IActionResult AdminUpdateProfile([FromRoute] string id, [FromBody] UpdateUserDto profileData)
        {
            if (profileData == null)
                return BadRequest("No data provided");

            var user = _userAction.GetUserByIdAction(id);
            if (user == null) return NotFound();

            var result = _adminAction.AdminUpdateUserAction(id, profileData);
            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpDelete("user/{id}")]
        [Authorize]
        public IActionResult AdminDeleteUser([FromRoute] string id)
        {
            var user = _userAction.GetUserByIdAction(id);
            if (user == null) return NotFound();

            var result = _adminAction.AdminDeleteUserAction(id);

            if (!result.IsValid)
                return BadRequest(result.Message);

            return Ok(result.Message);
        }

        [HttpDelete("post/{id}")]
        [Authorize]
        public IActionResult AdminDeletePost([FromRoute] string id)
        {
            var postRsponse = _postAction.GetPostsByIdAction(id);
            if (!postRsponse.IsValid)
                return NotFound();

            var deleteResponse = _adminAction.AdminDeletePostAction(id);

            if (!deleteResponse.IsValid)
                return BadRequest(deleteResponse.Message);

            return Ok(deleteResponse.Message);
        }
    }
}
