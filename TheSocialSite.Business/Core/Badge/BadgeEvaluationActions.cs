using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Models.Badge;

namespace TheSocialSite.Business.Core
{
    public class BadgeEvaluationActions
    {
        public List<AwardedBadgeDto> EvaluateAndAward(UserActivitySnapshot snapshot)
        {
            var newlyAwarded = new List<AwardedBadgeDto>();

            using (var context = new AppDbContext())
            {
                var allTemplates = context.BadgeTemplates.ToList();

                var alreadyAwardedIds = context.AwardedBadges
                    .Where(ab => ab.UserId == snapshot.UserId)
                    .Select(ab => ab.BadgeTemplateId)
                    .ToHashSet();

                foreach (var template in allTemplates)
                {
                    // Skip if user already has this badge
                    if (alreadyAwardedIds.Contains(template.Id))
                        continue;

                    int userValue = ResolveUserValue(template.Category, snapshot);

                    if (userValue >= template.CriteriaTarget)
                    {
                        var awarded = new AwardedBadgeData
                        {
                            UserId = snapshot.UserId,
                            BadgeTemplateId = template.Id,
                            EarnedDate = DateTime.UtcNow
                        };

                        context.AwardedBadges.Add(awarded);
                        context.SaveChanges();

                        newlyAwarded.Add(new AwardedBadgeDto
                        {
                            Id = awarded.Id,
                            UserId = awarded.UserId,
                            BadgeTemplateId = awarded.BadgeTemplateId,
                            EarnedDate = awarded.EarnedDate
                        });
                    }
                }
            }

            return newlyAwarded;
        }

        private int ResolveUserValue(BadgeCategory category, UserActivitySnapshot snapshot)
        {
            return category switch
            {
                BadgeCategory.ContentCreation => snapshot.PostCount + snapshot.CommentCount,
                BadgeCategory.Engagement => snapshot.LikesReceived + snapshot.FriendCount + snapshot.LoginStreakDays,
                BadgeCategory.CommunitySupport => snapshot.LikesGiven,
                BadgeCategory.Milestone => snapshot.ProfileCompletenessPercent,
                _ => 0
            };
        }
    }
}
