using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Comment;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentInteractAction _commentActions;

        public CommentController()
        {
            var bl = new BusinessLogic();
            _commentActions = bl.CommentInteractAction();
        }

        // GET: api/comments/post/{postId}
        [HttpGet("post/{postId}")]
        public IActionResult GetCommentsByPostId(string postId)
        {
            var result = _commentActions.GetCommentsByPostIdAction(postId);
            return Ok(result.CommentDtos);
        }

        // GET: api/comments/{id}
        [HttpGet("{id}")]
        public IActionResult GetCommentById(string id)
        {
            var result = _commentActions.GetCommentById(id);
            return Ok(result.CommentDto);
        }

        // POST: api/comments
        [HttpPost("create")]
        [Authorize]
        public IActionResult CreateComment([FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); // get JWT sub
            if (userId == null) return Unauthorized();

            var result = _commentActions.CreateCommentAction(dto.PostId, dto.Content, userId);
            if (!result.IsValid) return BadRequest(result.Message);

            return Ok(result);
        }

        // PUT: api/comments/{id}
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateComment(string id, [FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); // get JWT sub
            if (userId == null) return Unauthorized();

            var result = _commentActions.UpdateCommentAction(id, userId, dto.Content);
            if (!result.IsValid) return BadRequest(result.Message);

            return Ok(result.Message);
        }

        // DELETE: api/comments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteComment(string id)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); // get JWT sub
            if (userId == null) return Unauthorized();

            var result = _commentActions.DeleteCommentAction(id, userId);
            if (!result.IsValid) return BadRequest(result.Message);

            return Ok(result.Message);
        }
    }
}