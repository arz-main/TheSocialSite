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
                return BadRequest("Could not find posts");

            return Ok(response.PostDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetPostById([FromRoute] string id)
        {
            var response = _postAction.GetPostByIdAction(id);
            if (!response.IsValid)
                return BadRequest("Could not find posts");

            return Ok(response.PostDto);
        }

        [HttpGet("user/{id}")]
        public IActionResult GetUserPosts([FromRoute] string id)
        {
            var response = _postAction.GetUserPostsAction(id);
            if (!response.IsValid)
                return BadRequest("Could not find posts");

            return Ok(response.PostDtos);
        }

        [Authorize]
        [HttpPost("create")]
        public IActionResult CreatePost([FromBody] CreatePostDto postData)
        {
            if (postData == null)
                return BadRequest("No data provided");

            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var response = _postAction.CreatePostAction(postData, userId);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Message);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeletePost([FromRoute] string id)
        {
            var postResponse = _postAction.GetPostByIdAction(id);
            if (!postResponse.IsValid)
                return BadRequest(postResponse.Message);

            // get from jwt
            var isAdmin = User.IsInRole("Admin");
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); 

            if (!isAdmin && userId != id)
                return Forbid();

            var deleteResponse = _postAction.DeletePostAction(id);

            if (!deleteResponse.IsValid)
                return BadRequest(deleteResponse.Message);

            return Ok(deleteResponse.Message);
        }
    }
}
