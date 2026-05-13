using System;
using System.Collections.Generic;
using System.Collections.Generic;
using TheSocialSite.Domain.Models.Friendship;
using TheSocialSite.Domain.Models.Response;

public interface IFriendshipInteractAction
{
    FriendshipActionResponse SendFriendRequest(string senderId, string receiverId);
    FriendshipActionResponse AcceptFriendRequest(string requestId, string userId);
    FriendshipActionResponse DeclineFriendRequest(string requestId, string userId);
    FriendshipActionResponse RemoveFriend(string userId, string friendId);
    List<FriendshipResponseDto> GetFriendsList(string userId);
}