using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.SocialMedia;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Core
{
    public class UserActions
    {
        public UserActionResponse GetAllUsersActionExecution()
        {
            var userDtos = new List<UserDto>();
            using (var userContext = new AppDbContext())
            {
                var users = userContext.Users.ToList();
                if (users == null || users.Count == 0)
                    return new UserActionResponse
                    {
                        IsValid = false,
                        Message = "No users found."
                    };

                foreach (var user in users)
                {
                    userDtos.Add(new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Role = user.Role,
                        Username = user.Username,
                        AvatarUrl = user.AvatarUrl,
                        Bio = user.Bio,
                        Location = user.Location,
                        Website = user.Website,
                        SocialMedia = user.SocialMedia,
                        JoinedDate = user.JoinedDate
                    });
                }
            }
            // if we got here, we have users
            return new UserActionResponse
            {
                Message = "Users retrieved successfully.",
                IsValid = true,
                UserDtos = userDtos,
            };
        }

        public UserActionResponse GetUserByIdActionExecution(string userId)
        {
            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);

                if (user == null) return new UserActionResponse
                {
                    IsValid = false,
                    Message = "User not found."
                };

                return new UserActionResponse
                {
                    IsValid = true,
                    Message = "User retrieved successfully.",
                    UserDto = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Username = user.Username,
                        Role = user.Role,
                        AvatarUrl = user.AvatarUrl,
                        Bio = user.Bio,
                        Location = user.Location,
                        Website = user.Website,
                        SocialMedia = user.SocialMedia,
                        JoinedDate = user.JoinedDate
                    }
                };
            }
        }

        public UserActionResponse CreateUserActionExecution(CreateUserDto userData)
        {
            var validationResult = new AuthActions().UserSignupValidationExecution(userData);
            if (!validationResult.IsValid) return validationResult;
            
            using (var userContext = new AppDbContext())
            {
                var emailTaken = userContext.Users.Any(u => u.Email == userData.Email);
                var usernameTaken = userContext.Users.Any(u => u.Username == userData.Username);
                if (emailTaken)
                    return new UserActionResponse { IsValid = false, Message = "Email already taken." };

                if (usernameTaken)
                    return new UserActionResponse { IsValid = false, Message = "Username already taken." };

                var newUser = new UserData
                {
                    Username = userData.Username,
                    Email = userData.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(userData.Password)
                };
                userContext.Users.Add(newUser);
                userContext.SaveChanges();
            }

            return new UserActionResponse
            {
                IsValid = true,
                Message = "User created successfully."
            };
        }
        public UserActionResponse UpdateUserActionExecution(string userId, UpdateUserDto data)
        {
            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                    return new UserActionResponse { IsValid = false, Message = "User not found." };

                // Check username/email not taken by someone else
                if (!string.IsNullOrWhiteSpace(data.Username) && data.Username != user.Username)
                {
                    var taken = userContext.Users.Any(u => u.Username == data.Username && u.Id != userId);
                    if (taken) return new UserActionResponse { IsValid = false, Message = "Username already taken." };
                    user.Username = data.Username;
                }

                if (!string.IsNullOrWhiteSpace(data.Email) && data.Email != user.Email)
                {
                    var taken = userContext.Users.Any(u => u.Email == data.Email && u.Id != userId);
                    if (taken) return new UserActionResponse { IsValid = false, Message = "Email already taken." };
                    user.Email = data.Email;
                }

                if (data.Location != null) user.Location = data.Location;
                if (data.Website != null) user.Website = data.Website;
                if (data.Bio != null) user.Bio = data.Bio;
                if (data.AvatarUrl != null) user.AvatarUrl = data.AvatarUrl;

                if (data.SocialMedia != null)
                {
                    user.SocialMedia ??= new SocialMediaData();
                    user.SocialMedia.Pinterest = data.SocialMedia.Pinterest;
                    user.SocialMedia.Twitter = data.SocialMedia.Twitter;
                    user.SocialMedia.DeviantArt = data.SocialMedia.DeviantArt;
                    user.SocialMedia.YouTube = data.SocialMedia.YouTube;
                    user.SocialMedia.Discord = data.SocialMedia.Discord;
                }

                if (data.Role.HasValue) user.Role = data.Role.Value;

                userContext.SaveChanges();
            }

            return new UserActionResponse { IsValid = true, Message = "Profile updated." };
        }

        public UserActionResponse DeleteUserActionExecution(string userId)
        {
            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                    return new UserActionResponse
                    {
                        IsValid = false,
                        Message = "User not found."
                    };
                userContext.Remove(user);
                userContext.SaveChanges();
            }
            return new UserActionResponse
            {
                IsValid = true,
                Message = "User deleted."
            };
        }
    }
}