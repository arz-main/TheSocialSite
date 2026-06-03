using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TheSocialSite.Domain.Models.Friendship
{
    public class FriendshipResponseDto
    {
        [Required]
        /*temporar*/ public string FriendId {get; set;} = string.Empty;
        /*temporar*/ public string Username {get; set;} = string.Empty;
        public string? AvatarUrl {get; set;}
        public string? Bio {get; set;}
        /*temporar*/ public string Status {get; set;} = string.Empty;
        public DateTime CreatedAt {get; set;}
        public DateTime? UpdatedAt {get; set;}
    }
}