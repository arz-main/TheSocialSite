using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Business.Core
{
    public class UserActivitySnapshotBuilder
    {
        public UserActivitySnapshot Build(string userId)
        {
            using (var context = new AppDbContext())
            {
                var postCount = context.Posts
                    .Count(p => p.AuthorId == userId);

                var likesReceived = context.PostLikes
                    .Count(pl => pl.Post.AuthorId == userId);

                var likesGiven = context.PostLikes
                    .Count(pl => pl.UserId == userId);

                return new UserActivitySnapshot
                {
                    UserId = userId,
                    PostCount = postCount,
                    LikesReceived = likesReceived,
                    LikesGiven = likesGiven,

                    // To be filled once you share those entities
                    CommentCount = 0,
                    FriendCount = 0,
                    LoginStreakDays = 0,
                    ProfileCompletenessPercent = 0
                };
            }
        }
    }
}
