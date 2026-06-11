using System;
using System.Collections.Generic;
using System.Collections.Generic;
using TheSocialSite.Domain.Models.Friendship;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces {
   public interface IFriendshipInteractAction
   {FriendshipActionResponse RequestFollow(string senderId, string receiverId);
    List<FriendshipResponseDto> GetFriendsList(string userId);
   List<FriendshipResponseDto> GetPendingRequests(string userId);
    FriendshipActionResponse AcceptFriendRequestAction(string requestId, string userId);
    FriendshipActionResponse DeclineFriendRequestAction(string requestId, string userId);
    FriendshipActionResponse RemoveFriendAction(string userId, string friendId);}
 }