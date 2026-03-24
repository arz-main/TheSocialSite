using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Post;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/posts")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostInteractAction _postAction;
        public PostController()
        {
            var bl = new Business.BusinessLogic();
            _postAction = bl.PostInteractAction();
        }

        [HttpGet]
        public IActionResult GetPosts()
        {
            var posts = _postAction.GetAllPostsAction();
            if (posts == null)
            {
                return BadRequest("Could not find posts");
            }
            return Ok(posts);
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserPosts([FromRoute] string id)
        {
            var posts = _postAction.GetUserPostsAction(id);
            if (posts == null)
            {
                return BadRequest("Could not find posts");
            }
            return Ok(posts);
        }

        [Authorize]
        [HttpPost("create")]
        public IActionResult CreatePost([FromBody] PostCreationDto postData)
        {
            if (postData == null)
            {
                return BadRequest("No data provided");
            }
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var username = User.FindFirstValue(JwtRegisteredClaimNames.Name);
            Console.WriteLine(userId);
            ActionResponse validationInfo = _postAction.PostCreationAction(postData, userId, username);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.Message);
            }
            return Ok(validationInfo);
        }
    }
}
