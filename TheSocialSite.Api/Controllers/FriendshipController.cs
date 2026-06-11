using Microsoft.AspNetCore.Mvc;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Friendship;

namespace TheSocialSite.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FriendshipController : ControllerBase
    {
        private readonly IFriendshipInteractAction _friendshipAction;

        public FriendshipController(IFriendshipInteractAction friendshipAction)
        {
            _friendshipAction = friendshipAction;
        }

        [HttpPost("send-request")]
        public IActionResult RequestFollow([FromQuery] string senderId, [FromQuery] string receiverId)
        {
            var result = _friendshipAction.RequestFollow(senderId, receiverId);
            return Ok(result);
        }

        [HttpPost("accept")]
        public IActionResult AcceptFriendRequest([FromQuery] string requestId, [FromQuery] string userId)
        {
            var result = _friendshipAction.AcceptFriendRequestAction(requestId, userId);
            return Ok(result);
        }

        [HttpPost("decline")]
        public IActionResult DeclineFriendRequest([FromQuery] string requestId, [FromQuery] string userId)
        {
            var result = _friendshipAction.DeclineFriendRequestAction(requestId, userId);
            return Ok(result);
        }

        [HttpPost("remove")]
        public IActionResult RemoveFriend([FromQuery] string userId, [FromQuery] string friendId)
        {
            var result = _friendshipAction.RemoveFriendAction(userId, friendId);
            return Ok(result);
        }

        [HttpGet("friends")]
        public IActionResult GetFriendsList([FromRoute] string userId)
        {
            var result = _friendshipAction.GetFriendsList(userId);
            return Ok(result);
        }

        [HttpGet("pending")]
        public IActionResult GetPendingRequests([FromRoute] string userId)
        {
            var result = _friendshipAction.GetPendingRequests(userId);
            return Ok(result);
        }
    }
}