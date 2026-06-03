using System;
using System.Collections.Generic;
using TheSocialSite.Domain.Models.Friendship;

namespace TheSocialSite.Domain.Models.Response
{
    public class FriendshipActionResponse
    {
        public bool IsValid {get; set;}
        public string? Message {get; set;}
        public FriendshipResponseDto? Friend {get; set;}
    }
}