using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TheSocialSite.Business;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.SocialMedia;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/socialmedia")]
    [ApiController]
    public class SocialMediaController : ControllerBase
    {
        private readonly ISocialMediaInteractAction _socialMediaAction;

        public SocialMediaController()
        {
            var bl = new BusinessLogic();
            _socialMediaAction = bl.SocialMediaInteractAction();
        }

        // --- GET ---
        [HttpGet("{id}")]
        public IActionResult Get([FromRoute] string id)
        {
            var response = _socialMediaAction.GetSocialMediaAction(id);

            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.SocialMediaDto);
        }

        // --- CREATE ---
        [HttpPost("create")]
        public IActionResult Create([FromBody] CreateSocialMediaDto links)
        {
            var response = _socialMediaAction.CreateSocialMediaAction(links);

            if (!response.IsValid || response.SocialMediaDto == null)
                return BadRequest(response.Message);

            return Ok(response.SocialMediaDto);
        }

        // --- UPDATE ---
        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] string id, [FromBody] SocialMediaDto links)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            if (userId != id || userId != links.UserId)
                return Forbid();

            var response = _socialMediaAction.UpdateSocialMediaAction(links);

            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response.SocialMediaDto);
        }

        // --- DELETE ---
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] string id)
        {
            var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            if (userId != id)
                return Forbid();

            var response = _socialMediaAction.DeleteSocialMediaAction(userId);

            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(new { message = response.Message });
        }
    }
}