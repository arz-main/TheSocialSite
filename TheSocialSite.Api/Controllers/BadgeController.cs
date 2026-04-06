using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/badges")]
    [ApiController]
    public class BadgeController : ControllerBase
    {
        private readonly IBadgeInteractAction _badgeInteractAction;
        public BadgeController()
        {
            var bl = new BusinessLogic();
            _badgeInteractAction = bl.BadgeInteractAction();
        }

        [HttpGet("{badgeId}")]
        [Authorize]
        public IActionResult GetBadgeById(string badgeId)
        {
            var jwtUserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var response = _badgeInteractAction.GetBadgeByIdAction(badgeId);
            if (!response.IsValid)
            {
                return NotFound(response.Message);
            }

            //check to see if the badge belongs to the user
            if (response.Badge?.UserId != jwtUserId)
                return Forbid("You can only view your own badges");

            return Ok(response.Badge);
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public IActionResult GetBadgesByUserId(string userId)
        {
            var jwtUserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if(jwtUserId != userId)
                return Forbid("You can only view your own badges");

            var response = _badgeInteractAction.GetBadgesByUserIdAction(userId);
            if (!response.IsValid)
            {
                return NotFound(response.Message);
            }
            return Ok(response.Badges);
        }

        [HttpPost("create")]
        [Authorize] // need to be authenticated to create a badge
        public IActionResult CreateBadge([FromBody] CreateBadgeDto badgeData)
        {
            var jwtUserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            badgeData.UserId = jwtUserId; // set the userId from the JWT
            var response = _badgeInteractAction.CreateBadgeAction(badgeData);
            if (!response.IsValid)
            {
                return BadRequest(response.Message);
            }
            return Ok(response.Message);
        }
    }
}
