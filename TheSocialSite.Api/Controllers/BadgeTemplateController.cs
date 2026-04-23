using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/badge-templates")]
    [ApiController]
    public class BadgeTemplateController : ControllerBase
    {
        private readonly IBadgeTemplateInteractAction _badgeInteractAction;

        public BadgeTemplateController()
        {
            var bl = new BusinessLogic();
            _badgeInteractAction = bl.BadgeInteractAction();
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetBadgeById(string id)
        {
            var response = _badgeInteractAction.GetBadgeTemplateByIdAction(id);
            if (!response.IsValid || response.BadgeTemplate == null)
                return NotFound(response.Message);

            return Ok(response);
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllBadges()
        {
            var response = _badgeInteractAction.GetAllBadgeTemplatesAction();
            if (!response.IsValid || response.BadgeTemplates == null)
                return NotFound(response.Message);

            return Ok(response);
        }

        [HttpPost("create")]
        [Authorize]
        public IActionResult CreateBadge([FromBody] CreateBadgeTemplateDto badgeData)
        {
            var response = _badgeInteractAction.CreateBadgeTemplateAction(badgeData);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response);
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateBadge(string id, [FromBody] UpdateBadgeTemplateDto badgeData)
        {
            var response = _badgeInteractAction.UpdateBadgeTemplateAction(id, badgeData);
            if (!response.IsValid)
                return BadRequest(response.Message);

            return Ok(response);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult DeleteBadge(string id)
        {
            var response = _badgeInteractAction.DeleteBadgeTemplateByIdAction(id);
            if (!response.IsValid)
                return NotFound(response.Message);

            return Ok(response.Message);
        }
    }
}