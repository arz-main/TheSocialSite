using System.Linq;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Core
{
    public class SocialMediaActions
    {
        public SocialMediaActions() { }

        // --- Get ---
        public SocialMediaActionResponse GetSocialMediaActionExecution(string userId)
        {
            using (var _userContext = new AppDbContext())
            {
                var links = _userContext.SocialMedia
                    .FirstOrDefault(sm => sm.UserId == userId);

                if (links == null)
                    return new SocialMediaActionResponse
                    {
                        IsValid = false,
                        Message = "Social links not found"
                    };

                // Map entity to DTO for response
                var dto = new SocialMediaDto
                {
                    UserId = links.UserId,
                    Twitter = links.Twitter,
                    YouTube = links.YouTube,
                    Discord = links.Discord,
                    Pinterest = links.Pinterest,
                    DeviantArt = links.DeviantArt
                };

                return new SocialMediaActionResponse
                {
                    IsValid = true,
                    Message = "Social links retrieved successfully",
                    Links = dto
                };
            }
        }

        // --- Create ---
        public SocialMediaActionResponse CreateSocialMediaActionExecution(SocialMediaDto dto)
        {
            using (var _userContext = new AppDbContext())
            {
                var exists = _userContext.SocialMedia
                    .Any(sl => sl.UserId == dto.UserId);

                if (exists)
                    return new SocialMediaActionResponse
                    {
                        IsValid = false,
                        Message = "Social links already exist for this user"
                    };

                // Map DTO to EF entity
                var entity = new SocialMedia
                {
                    UserId = dto.UserId,
                    Twitter = dto.Twitter,
                    YouTube = dto.YouTube,
                    Discord = dto.Discord,
                    Pinterest = dto.Pinterest,
                    DeviantArt = dto.DeviantArt
                };

                _userContext.SocialMedia.Add(entity);
                _userContext.SaveChanges();

                return new SocialMediaActionResponse
                {
                    IsValid = true,
                    Message = "Social links created successfully",
                    Links = dto
                };
            }
        }

        // --- Update ---
        public SocialMediaActionResponse UpdateSocialMediaActionExecution(SocialMediaDto dto)
        {
            using (var _userContext = new AppDbContext())
            {
                var existing = _userContext.SocialMedia
                    .FirstOrDefault(sl => sl.UserId == dto.UserId);

                if (existing == null)
                    return new SocialMediaActionResponse
                    {
                        IsValid = false,
                        Message = "Social links not found"
                    };

                existing.Twitter = dto.Twitter;
                existing.YouTube = dto.YouTube;
                existing.Discord = dto.Discord;
                existing.Pinterest = dto.Pinterest;
                existing.DeviantArt = dto.DeviantArt;

                _userContext.SaveChanges();

                return new SocialMediaActionResponse
                {
                    IsValid = true,
                    Message = "Social links updated successfully",
                    Links = dto
                };
            }
        }

        // --- Delete ---
        public SocialMediaActionResponse DeleteSocialMediaActionExecution(string userId)
        {
            using (var _userContext = new AppDbContext())
            {
                var existing = _userContext.SocialMedia
                    .FirstOrDefault(sl => sl.UserId == userId);

                if (existing == null)
                    return new SocialMediaActionResponse
                    {
                        IsValid = false,
                        Message = "Social links not found"
                    };

                _userContext.SocialMedia.Remove(existing);
                _userContext.SaveChanges();

                return new SocialMediaActionResponse
                {
                    IsValid = true,
                    Message = "Social links deleted successfully"
                };
            }
        }
    }
}