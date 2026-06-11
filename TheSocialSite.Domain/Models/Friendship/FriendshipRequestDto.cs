using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TheSocialSite.Domain.Models.Friendship
{
    public class FriendshipRequestDto
    {
        [Required]
        public string SenderId {get; set;}
    }
}