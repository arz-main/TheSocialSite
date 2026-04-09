using Microsoft.EntityFrameworkCore;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.Badge;
using TheSocialSite.Domain.Models.Badge;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class BadgeTemplateActions
    {
        public BadgeTemplateActionResponse GetBadgeTemplateByIdActionExecution(string badgeId)
        {
            using (var context = new AppDbContext())
            {
                var badge = context.BadgeTemplates
                    .FirstOrDefault(b => b.Id == badgeId);

                if (badge == null)
                    return new BadgeTemplateActionResponse
                    {
                        IsValid = false,
                        Message = "Badge template not found."
                    };

                return new BadgeTemplateActionResponse
                {
                    IsValid = true,
                    Message = "Badge template retrieved successfully.",
                    BadgeTemplate = new BadgeTemplateDto
                    {
                        Id = badge.Id,
                        Title = badge.Title,
                        Description = badge.Description,
                        IconUrl = badge.IconUrl,
                        Category = badge.Category,
                        Tier = badge.Tier,
                        CriteriaTarget = badge.CriteriaTarget,
                        CreatedAt = badge.CreatedAt
                    }
                };
            }
        }

        public BadgeTemplateActionResponse GetAllBadgeTemplatesActionExecution()
        {
            using (var context = new AppDbContext())
            {
                var badges = context.BadgeTemplates.ToList();

                if (badges == null || badges.Count == 0)
                    return new BadgeTemplateActionResponse
                    {
                        IsValid = false,
                        Message = "No badge templates found."
                    };

                return new BadgeTemplateActionResponse
                {
                    IsValid = true,
                    Message = "Badge templates retrieved successfully.",
                    BadgeTemplates = badges.Select(b => new BadgeTemplateDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Description = b.Description,
                        IconUrl = b.IconUrl,
                        Category = b.Category,
                        Tier = b.Tier,
                        CriteriaTarget = b.CriteriaTarget,
                        CreatedAt = b.CreatedAt
                    }).ToList()
                };
            }
        }

        public BadgeTemplateActionResponse CreateBadgeTemplateActionExecution(CreateBadgeTemplateDto badgeData)
        {
            if (badgeData == null)
                return new BadgeTemplateActionResponse
                {
                    IsValid = false,
                    Message = "Invalid badge template data."
                };

            using (var context = new AppDbContext())
            {
                var newBadge = new BadgeTemplateData
                {
                    Title = badgeData.Title,
                    Description = badgeData.Description,
                    IconUrl = badgeData.IconUrl,
                    Category = badgeData.Category,
                    Tier = badgeData.Tier,
                    CriteriaTarget = badgeData.CriteriaTarget
                };

                context.BadgeTemplates.Add(newBadge);
                context.SaveChanges();

                return new BadgeTemplateActionResponse
                {
                    IsValid = true,
                    Message = "Badge template created successfully.",
                    BadgeTemplate = new BadgeTemplateDto
                    {
                        Id = newBadge.Id,
                        Title = newBadge.Title,
                        Description = newBadge.Description,
                        IconUrl = newBadge.IconUrl,
                        Category = newBadge.Category,
                        Tier = newBadge.Tier,
                        CriteriaTarget = newBadge.CriteriaTarget,
                        CreatedAt = newBadge.CreatedAt
                    }
                };
            }
        }

        public BadgeTemplateActionResponse UpdateBadgeTemplateActionExecution(string badgeId, UpdateBadgeTemplateDto badgeData)
        {
            if (badgeData == null)
                return new BadgeTemplateActionResponse
                {
                    IsValid = false,
                    Message = "Invalid badge template data."
                };

            using (var context = new AppDbContext())
            {
                var badge = context.BadgeTemplates.FirstOrDefault(b => b.Id == badgeId);

                if (badge == null)
                    return new BadgeTemplateActionResponse
                    {
                        IsValid = false,
                        Message = "Badge template not found."
                    };

                badge.Title = badgeData.Title;
                badge.Description = badgeData.Description;
                badge.IconUrl = badgeData.IconUrl;
                badge.Category = badgeData.Category;
                badge.Tier = badgeData.Tier;
                badge.CriteriaTarget = badgeData.CriteriaTarget;

                context.SaveChanges();

                return new BadgeTemplateActionResponse
                {
                    IsValid = true,
                    Message = "Badge template updated successfully.",
                    BadgeTemplate = new BadgeTemplateDto
                    {
                        Id = badge.Id,
                        Title = badge.Title,
                        Description = badge.Description,
                        IconUrl = badge.IconUrl,
                        Category = badge.Category,
                        Tier = badge.Tier,
                        CriteriaTarget = badge.CriteriaTarget,
                        CreatedAt = badge.CreatedAt
                    }
                };
            }
        }

        public BadgeTemplateActionResponse DeleteBadgeTemplateByIdActionExecution(string badgeId)
        {
            using (var context = new AppDbContext())
            {
                var badge = context.BadgeTemplates.FirstOrDefault(b => b.Id == badgeId);

                if (badge == null)
                    return new BadgeTemplateActionResponse
                    {
                        IsValid = false,
                        Message = "Badge template not found."
                    };

                context.BadgeTemplates.Remove(badge);
                context.SaveChanges();

                return new BadgeTemplateActionResponse
                {
                    IsValid = true,
                    Message = "Badge template deleted successfully."
                };
            }
        }
    }
}