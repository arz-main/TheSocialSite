using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/socialmedia")]
    [ApiController]
    public class SocialMediaController : ControllerBase
    {
        private readonly ISocialMediaInteractAction _socialMediaAction;

        public SocialMediaController()
        {
            _socialMediaAction = new BusinessLogic().SocialMediaInteractAction();
        }

        // --- GET ---
        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] string id)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            if (userId != id)
                return Forbid("You can only access your own social links");

            var response = _socialMediaAction.GetSocialMediaAction(userId);

            if (!response.IsValid)
                return NotFound(response.Message);

            return Ok(response.Links);
        }

        // --- CREATE ---
        [HttpPost("create")]
        public IActionResult Create([FromBody] SocialMediaDto links)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            if (userId != links.UserId)
                return Forbid("You can only create social links for yourself");

            var response = _socialMediaAction.CreateSocialMediaAction(links);

            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Links);
        }

        // --- UPDATE ---
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] string id, [FromBody] SocialMediaDto links)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            if (userId != id || userId != links.UserId)
                return Forbid("You can only update your own social links");

            var response = _socialMediaAction.UpdateSocialMediaAction(links);

            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.Links);
        }

        // --- DELETE ---
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] string id)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            if (userId != id)
                return Forbid("You can only delete your own social links");

            var response = _socialMediaAction.DeleteSocialMediaAction(userId);

            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(new { message = response.Message });
        }
    }
}