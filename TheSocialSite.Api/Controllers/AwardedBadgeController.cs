using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Api.Controllers
{
    [Route("api/awarded-badges")]
    [ApiController]
    public class AwardedBadgeController : ControllerBase
    {
        private readonly IAwardedBadgeInteractAction _awardedBadgeAction;
        public AwardedBadgeController()
        {
            var bl = new Business.BusinessLogic();
            _awardedBadgeAction = bl.AwardedBadgeInteractAction();
        }

        [HttpGet("{id}")]
        public IActionResult GetAwardedBadgeById(string id)
        {
            var result = _awardedBadgeAction.GetAwardedBadgeByIdAction(id);
            if (!result.IsValid)
                return NotFound(result.Message);

            return Ok(result.AwardedBadge);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetAwardedBadgeByUserId([FromRoute] string userId)
        {
            var result = _awardedBadgeAction.GetAwardedBadgeByUserIdAction(userId);
            if (!result.IsValid)
                return NotFound(result.Message);

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAwardedBadge(string id)
        {
            var result = _awardedBadgeAction.DeleteAwardedBadgeAction(id);
            if (!result.IsValid)
                return NotFound(result.Message);

            return Ok(result.Message);
        }


        [HttpPost("create")]
        public IActionResult CreateAwardedBadge([FromBody] CreateAwardedBadgeDto data)
        {
            var result = _awardedBadgeAction.CreateAwardedBadgeAction(data);
            if (!result.IsValid)
                return BadRequest(result.Message);
            return Ok(result.AwardedBadge);
        }
    }   
}
