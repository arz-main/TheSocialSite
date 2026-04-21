using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Domain.Entities.Post
{
    public class PostLikeData
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PostId { get; set; }
        public string UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public PostData Post { get; set; }
        public UserData User { get; set; }
    }
}
