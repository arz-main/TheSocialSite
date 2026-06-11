using System;
using System.Collections.Generic;
using TheSocialSite.Business.Core;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Models.Friendship;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Structure
{
    public class FriendshipInteractActions : FriendshipActions, IFriendshipInteractAction
    {
        public FriendshipActionResponse RequestFollow(string senderId, string receiverId) => RequestFollowExecution(senderId, receiverId);
        public List<FriendshipResponseDto> GetFriendsList(string userId) => GetFriendsListExecution(userId);
        public List<FriendshipResponseDto> GetPendingRequests(string userId) => GetPendingRequestsExecution(userId);
        public FriendshipActionResponse AcceptFriendRequestAction(string requestId, string userId) => AcceptFriendRequestExecution(requestId, userId);
        public FriendshipActionResponse DeclineFriendRequestAction(string requestId, string userId) => DeclineFriendRequestExecution(requestId, userId);
        public FriendshipActionResponse RemoveFriendAction(string userId, string friendId) => RemoveFriendExecution   (userId, friendId);
    }
}