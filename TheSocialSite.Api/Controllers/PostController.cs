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
            return Ok(posts.PostDtos);
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserPosts([FromRoute] string id)
        {
            var posts = _postAction.GetUserPostsAction(id);
            if (posts == null)
            {
                return BadRequest("Could not find posts");
            }
            return Ok(posts.PostDtos);
        }

        [Authorize]
        [HttpPost("create")]
        public IActionResult CreatePost([FromBody] CreatePostDto postData)
        {
            if (postData == null)
                return BadRequest("No data provided");

            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            DefaultActionResponse data = _postAction.CreatePostAction(postData, userId);
            if (!data.IsValid)
                return BadRequest(data.Message);

            return Ok(data);
        }
    }
}
