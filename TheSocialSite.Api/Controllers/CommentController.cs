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
            var response = _commentActions.GetCommentsByPostIdAction(postId);
            if (!response.IsValid || response.CommentDtos == null) 
                return NotFound();

            return Ok(response.CommentDtos);
        }

        // GET: api/comments/{id}
        [HttpGet("{id}")]
        public IActionResult GetCommentById(string id)
        {
            var response = _commentActions.GetCommentById(id);
            if (!response.IsValid || response.CommentDto == null)
                return NotFound();

            return Ok(response.CommentDto);
        }

        // POST: api/comments
        [HttpPost("create")]
        [Authorize]
        public IActionResult CreateComment([FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); // get JWT sub
            if (userId == null) return NotFound();

            var response = _commentActions.CreateCommentAction(dto.PostId, dto.Content, userId);
            if (!response.IsValid) return BadRequest(response.Message);

            return Ok(response);
        }

        // PUT: api/comments/{id}
        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateComment(string id, [FromBody] CreateCommentDto dto)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); // get JWT sub
            if (userId == null) return Unauthorized();

            var response = _commentActions.UpdateCommentAction(id, userId, dto.Content);
            if (!response.IsValid) return BadRequest(response.Message);

            return Ok(response.Message);
        }
        
        // DELETE: api/comments/{id}
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteComment(string id)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub); // get JWT sub
            if (userId == null) return Unauthorized();

            var response = _commentActions.DeleteCommentAction(id, userId);
            if (!response.IsValid) return BadRequest(response.Message);

            return Ok(response.Message);
        }
    }
}