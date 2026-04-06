using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business.Core;
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
            var response = _postAction.GetAllPostsAction();
            if (!response.IsValid)
            {
                return BadRequest("Could not find posts");
            }
            return Ok(response.PostDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetPostById([FromRoute] string id)
        {
            var response = _postAction.GetPostsByIdAction(id);
            if (!response.IsValid)
            {
                return BadRequest("Could not find posts");
            }
            return Ok(response.PostDto);
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserPosts([FromRoute] string id)
        {
            var response = _postAction.GetUserPostsAction(id);
            if (!response.IsValid)
            {
                return BadRequest("Could not find posts");
            }
            return Ok(response.PostDtos);
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

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult AdminDeletePost([FromRoute] string id)
        {
            var postResponse = _postAction.GetPostsByIdAction(id);
            if (!postResponse.IsValid)
                return NotFound();

            var userIdFromPost = postResponse.PostDto.Author.Id;
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userIdFromPost != userId)
                return Forbid("You can only delete your own posts");

            var deleteResponse = _postAction.DeletePostAction(id);

            if (!deleteResponse.IsValid)
                return BadRequest(deleteResponse.Message);

            return Ok(deleteResponse.Message);
        }
    }
}
