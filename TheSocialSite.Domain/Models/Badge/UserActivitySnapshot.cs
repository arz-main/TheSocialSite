using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TheSocialSite.Domain.Models.Badge
{
    public class UserActivitySnapshot
    {
        public string UserId { get; set; }

        // ContentCreation
        public int PostCount { get; set; }
        public int CommentCount { get; set; }

        // Engagement
        public int LikesReceived { get; set; }
        public int FriendCount { get; set; }
        public int LoginStreakDays { get; set; }

        // CommunitySupport
        public int LikesGiven { get; set; }

        // Milestone
        public int ProfileCompletenessPercent { get; set; }
    }
}
