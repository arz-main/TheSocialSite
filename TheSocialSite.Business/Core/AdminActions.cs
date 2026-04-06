using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Core
{
    public class AdminActions
    {
        public DefaultActionResponse AdminUpdateUserActionExecution(string userId, UpdateUserDto data)
        {
            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                    return new DefaultActionResponse { IsValid = false, Message = "User not found." };

                // Check username/email not taken by someone else
                if (!string.IsNullOrWhiteSpace(data.Username) && data.Username != user.Username)
                {
                    var taken = userContext.Users.Any(u => u.Username == data.Username && u.Id != userId);
                    if (taken) return new DefaultActionResponse { IsValid = false, Message = "Username already taken." };
                    user.Username = data.Username;
                }

                if (!string.IsNullOrWhiteSpace(data.Email) && data.Email != user.Email)
                {
                    var taken = userContext.Users.Any(u => u.Email == data.Email && u.Id != userId);
                    if (taken) return new DefaultActionResponse { IsValid = false, Message = "Email already taken." };
                    user.Email = data.Email;
                }

                if (data.Location != null) user.Location = data.Location;
                if (data.Website != null) user.Website = data.Website;
                if (data.Bio != null) user.Bio = data.Bio;
                if (data.Avatar != null) user.Avatar = data.Avatar;

                if (data.SocialLinks != null)
                {
                    user.SocialLinks ??= new SocialMedia();
                    user.SocialLinks.Pinterest = data.SocialLinks.Pinterest;
                    user.SocialLinks.Twitter = data.SocialLinks.Twitter;
                    user.SocialLinks.DeviantArt = data.SocialLinks.DeviantArt;
                    user.SocialLinks.YouTube = data.SocialLinks.YouTube;
                    user.SocialLinks.Discord = data.SocialLinks.Discord;
                }

                if (data.Role.HasValue)
                {
                    user.Role = data.Role.Value;
                }

                userContext.SaveChanges();
            }

            return new DefaultActionResponse { IsValid = true, Message = "Profile updated." };
        }

        public DefaultActionResponse AdminDeleteUserActionExecution(string userId)
        {
            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                    return new DefaultActionResponse { IsValid = false, Message = "User not found." };
                userContext.Remove(user);
                userContext.SaveChanges();
            }
            return new DefaultActionResponse { IsValid = true, Message = "User deleted." };

        }

        public DefaultActionResponse AdminDeletePostActionExecution(string id)
        {
            using (var _appDbContext = new AppDbContext())
            {
                var post = _appDbContext.Posts.FirstOrDefault(p => p.Id == id);
                if (post == null)
                {
                    return new DefaultActionResponse
                    {
                        IsValid = false,
                        Message = "Post not found"
                    };
                }
                _appDbContext.Posts.Remove(post);
                _appDbContext.SaveChanges();
                return new DefaultActionResponse
                {
                    IsValid = true,
                    Message = "Post deleted successfully"
                };
            }
        }
    }
}
