using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Core
{
    public class UserActions
    {
        public UserActions() { }

        public List<UserDto> GetAllUsersActionExecution()
        {
            var result = new List<UserDto>();
            using (var userContext = new AppDbContext())
            {
                var users = userContext.Users.ToList();

                foreach (var user in users)
                {
                    result.Add(new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        Role = user.Role,
                        Username = user.Username,
                        Avatar = user.Avatar,
                        Bio = user.Bio,
                        Location = user.Location,
                        Website = user.Website,
                        SocialLinks = user.SocialLinks,
                        PostsCount = user.PostsCount,
                        JoinedDate = user.JoinedDate
                    });
                }
            }
            return result;
        }

        public UserDto GetUserByIdActionExecution(string userId)
        {
            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);

                if (user == null) return null;

                // AutoMapper handles all property copying for you
                return new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Username = user.Username,
                    Role = user.Role,
                    Avatar = user.Avatar,
                    Bio = user.Bio,
                    Location = user.Location,
                    Website = user.Website,
                    SocialLinks = user.SocialLinks,
                    PostsCount = user.PostsCount,
                    JoinedDate = user.JoinedDate
                };
            }
        }

        public SignupActionResponse UserSignupValidationExecution(UserSignupDto userData)
        {
            if (userData == null)
                return new SignupActionResponse { IsValid = false, Message = "Signup data is required." };

            if (string.IsNullOrWhiteSpace(userData.Email))
                return new SignupActionResponse { IsValid = false, Message = "Email is required." };

            if (string.IsNullOrWhiteSpace(userData.Username))
                return new SignupActionResponse { IsValid = false, Message = "Username is required." };

            if (string.IsNullOrWhiteSpace(userData.Password))
                return new SignupActionResponse { IsValid = false, Message = "Password is required." };

            if (string.IsNullOrWhiteSpace(userData.ConfirmPassword))
                return new SignupActionResponse { IsValid = false, Message = "Confirmation password is required." };

            if (userData.Password != userData.ConfirmPassword)
                return new SignupActionResponse { IsValid = false, Message = "Passwords do not match." };

            return new SignupActionResponse { IsValid = true };
        }

        public SignupActionResponse CreateUserActionExecution(UserSignupDto userData)
        {
            var validationResult = UserSignupValidationExecution(userData);
            if (!validationResult.IsValid)
            {
                return validationResult;
            }
            using (var userContext = new AppDbContext())
            {
                var newUser = new UserData
                {
                    Username = userData.Username,
                    Email = userData.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(userData.Password)
                };
                userContext.Users.Add(newUser);
                userContext.SaveChanges();
            }

            return new SignupActionResponse
            {
                IsValid = true,
                Email = userData.Email,
                Username = userData.Username
            };
        }
        public DefaultActionResponse UpdateUserActionExecution(string userId, UpdateUserDto data)
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
                userContext.SaveChanges();
            }

            return new DefaultActionResponse { IsValid = true, Message = "Profile updated." };
        }

        public DefaultActionResponse DeleteUserActionExecution(string userId)
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
    }
}