using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class BadgeActions
    {
        public BadgeActionResponse GetBadgeByIdActionExecution(string badgeId)
        {
            using(var context = new AppDbContext())
            {
                var badge = context.Badges.FirstOrDefault(b => b.Id == badgeId);
                if (badge == null)
                {
                    return new BadgeActionResponse
                    {
                        IsValid = false,
                        Message = "Badge not found."
                    };
                }
                return new BadgeActionResponse
                {
                    IsValid = true,
                    Message = "Badge retrieved successfully.",
                    Badge = new BadgeDto
                    {
                        Id = badge.Id,
                        Title = badge.Title,
                        Description = badge.Description,
                        IconUrl = badge.IconUrl,
                        Category = badge.Category,
                        Tier = badge.Tier,
                        UserId = badge.UserId,
                        // use the navigation property to get use data,
                        // but not expose the entire user data
                        UserAvatarUrl = badge.User?.Avatar,
                        UserName = badge.User?.Username,
                    }
                };
            }
        }
        public BadgeActionResponse GetBadgesByUserIdActionExecution(string userId)
        {
            using(var context = new AppDbContext())
            {
                var badges = context.Badges.Where(b => b.UserId == userId).ToList();
                if (badges == null || badges.Count == 0)
                {
                    return new BadgeActionResponse
                    {
                        IsValid = false,
                        Message = "No badges found for this user."
                    };
                }
                return new BadgeActionResponse
                {
                    IsValid = true,
                    Message = "Badges retrieved successfully.",
                    Badges = badges.Select(b => new BadgeDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Description = b.Description,
                        IconUrl = b.IconUrl,
                        Category = b.Category,
                        Tier = b.Tier,
                        UserId = b.UserId,
                        UserAvatarUrl = b.User?.Avatar,
                        UserName = b.User?.Username,
                        
                    }).ToList()
                };
            }
        }
        public BadgeActionResponse CreateBadgeActionExecution(CreateBadgeDto badgeData)
        {
            using(var context = new AppDbContext())
            {
                var newBadge = new BadgeData
                {
                    Title = badgeData.Title,
                    Description = badgeData.Description,
                    IconUrl = badgeData.IconUrl,
                    Category = badgeData.Category,
                    Tier = badgeData.Tier,
                    UserId = badgeData.UserId
                };
                context.Badges.Add(newBadge);
                context.SaveChanges();
                return new BadgeActionResponse
                {
                    IsValid = true,
                    Message = "Badge created successfully.",
                    Badge = new BadgeDto
                    {
                        Id = newBadge.Id,
                        Title = newBadge.Title,
                        Description = newBadge.Description,
                        IconUrl = newBadge.IconUrl,
                        Category = newBadge.Category,
                        UserId = newBadge.UserId,
                        Tier = newBadge.Tier
                    }
                };
            }
        }
        public BadgeActionResponse UpdateBadgeActionExecution()
        {
            throw new NotImplementedException("UpdateBadgeActionExecution is not implemented yet.");
        }
        public BadgeActionResponse DeleteBadgeByIdActionExecution(string badgeId)
        {
            throw new NotImplementedException("DeleteBadgeByIdActionExecution is not implemented yet.");
        }
    }
}
