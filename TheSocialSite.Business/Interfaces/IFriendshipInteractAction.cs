using System;
using System.Collections.Generic;
using System.Collections.Generic;
using TheSocialSite.Domain.Models.Friendship;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Interfaces {
   public interface IFriendshipInteractAction
   {FriendshipActionResponse RequestFollow(string senderId, string receiverId);
    List<FriendshipResponseDto> GetFriendsList(string userId);
    FriendshipActionResponse AcceptFriendRequest(string requestId, string userId);
    FriendshipActionResponse DeclineFriendRequest(string requestId, string userId);
    FriendshipActionResponse RemoveFriend(string userId, string friendId);}
 }