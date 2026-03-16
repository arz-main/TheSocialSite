using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Post;

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

        [HttpPost("create")]
        public IActionResult CreatePost([FromBody] CreatePostDto postData)
        {
            if (postData == null)
            {
                return BadRequest("No data provided");
            }
            PostValidationDto validationInfo = _postAction.CreatePostAction(postData);
            if (!validationInfo.IsValid)
            {
                return BadRequest(validationInfo.ErrorMessage);
            }
            return Ok($"Post creation successful. PostId: {validationInfo.PostId}");
        }
    }
}
