using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Entities.User
{
    public class UserFollowData
    {
        [Key]
        public string Id { get; set; }

        [Required]
        public string FollowerId { get; set; }
        public UserData? Follower { get; set; }

        [Required]
        public string FollowingId { get; set; }
        public UserData? Following { get; set; }

        [Required]
        public DateTime FollowedAt { get; set; } = DateTime.UtcNow;
    }
}
