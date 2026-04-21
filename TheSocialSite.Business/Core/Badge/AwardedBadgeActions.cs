using Microsoft.EntityFrameworkCore;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core.Badges
{
    public class AwardedBadgeActions
    {
        public AwardedBadgeActionResponse GetAwardedBadgeByIdActionExecution(string id)
        {
            using (var context = new AppDbContext())
            {
                var awardedBadge = context.AwardedBadges
                    .FirstOrDefault(ab => ab.Id == id);

                if (awardedBadge == null)
                    return new AwardedBadgeActionResponse
                    {
                        IsValid = false,
                        Message = "Awarded badge not found."
                    };

                return new AwardedBadgeActionResponse
                {
                    IsValid = true,
                    Message = "Awarded badge retrieved successfully.",
                    AwardedBadge = new AwardedBadgeDto
                    {
                        Id = awardedBadge.Id,
                        UserId = awardedBadge.UserId,
                        BadgeTemplateId = awardedBadge.BadgeTemplateId,
                        EarnedDate = awardedBadge.EarnedDate
                    }
                };
            }
        }

        public AwardedBadgeActionResponse GetAwardedBadgeByUserIdActionExecution(string userId)
        {
            using (var context = new AppDbContext())
            {
                var awardedBadges = context.AwardedBadges
                    .Where(ab => ab.UserId == userId)
                    .ToList();

                if (awardedBadges == null || awardedBadges.Count == 0)
                    return new AwardedBadgeActionResponse
                    {
                        IsValid = false,
                        Message = "No awarded badges found for this user."
                    };

                return new AwardedBadgeActionResponse
                {
                    IsValid = true,
                    Message = "Awarded badges retrieved successfully.",
                    AwardedBadges = awardedBadges.Select(ab => new AwardedBadgeDto
                    {
                        Id = ab.Id,
                        UserId = ab.UserId,
                        BadgeTemplateId = ab.BadgeTemplateId,
                        EarnedDate = ab.EarnedDate
                    }).ToList()
                };
            }
        }

        public AwardedBadgeActionResponse CreateAwardedBadgeActionExecution(CreateAwardedBadgeDto data)
        {
            if (data == null)
                return new AwardedBadgeActionResponse
                {
                    IsValid = false,
                    Message = "Invalid awarded badge data."
                };

            using (var context = new AppDbContext())
            {
                var newAwardedBadge = new AwardedBadgeData
                {
                    UserId = data.UserId,
                    BadgeTemplateId = data.BadgeTemplateId
                };

                context.AwardedBadges.Add(newAwardedBadge);
                context.SaveChanges();

                return new AwardedBadgeActionResponse
                {
                    IsValid = true,
                    Message = "Awarded badge created successfully.",
                    AwardedBadge = new AwardedBadgeDto
                    {
                        Id = newAwardedBadge.Id,
                        UserId = newAwardedBadge.UserId,
                        BadgeTemplateId = newAwardedBadge.BadgeTemplateId,
                        EarnedDate = newAwardedBadge.EarnedDate
                    }
                };
            }
        }

        public AwardedBadgeActionResponse UpdateAwardedBadgeActionExecution(UpdateAwardedBadgeDto data)
        {
            if (data == null)
                return new AwardedBadgeActionResponse
                {
                    IsValid = false,
                    Message = "Invalid awarded badge data."
                };

            using (var context = new AppDbContext())
            {
                var awardedBadge = context.AwardedBadges
                    .FirstOrDefault(ab => ab.Id == data.Id);

                if (awardedBadge == null)
                    return new AwardedBadgeActionResponse
                    {
                        IsValid = false,
                        Message = "Awarded badge not found."
                    };

                awardedBadge.UserId = data.UserId;
                awardedBadge.BadgeTemplateId = data.BadgeTemplateId;

                context.SaveChanges();

                return new AwardedBadgeActionResponse
                {
                    IsValid = true,
                    Message = "Awarded badge updated successfully.",
                    AwardedBadge = new AwardedBadgeDto
                    {
                        Id = awardedBadge.Id,
                        UserId = awardedBadge.UserId,
                        BadgeTemplateId = awardedBadge.BadgeTemplateId,
                        EarnedDate = awardedBadge.EarnedDate
                    }
                };
            }
        }

        public AwardedBadgeActionResponse DeleteAwardedBadgeActionExecution(string awardedBadgeId)
        {
            using (var context = new AppDbContext())
            {
                var awardedBadge = context.AwardedBadges
                    .FirstOrDefault(ab => ab.Id == awardedBadgeId);

                if (awardedBadge == null)
                    return new AwardedBadgeActionResponse
                    {
                        IsValid = false,
                        Message = "Awarded badge not found."
                    };

                context.AwardedBadges.Remove(awardedBadge);
                context.SaveChanges();

                return new AwardedBadgeActionResponse
                {
                    IsValid = true,
                    Message = "Awarded badge deleted successfully."
                };
            }
        }
    }
}