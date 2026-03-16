using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Core
{
    public class UserActions
    {
        private readonly DbSession _dbSession;
        public UserActions()
        {
            _dbSession = new DbSession();
        }

        public UserData[] GetAllUsersActionExecution()
        {
            using (var userContext = _dbSession.UserContext())
            {
                return userContext.Users.ToArray();
            }
        }
        public UserSignupValidationDto UserSignupValidationExecution(UserSignupDto userData)
        {
            if (userData == null)
                return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Signup data is required." };

            if (string.IsNullOrWhiteSpace(userData.Email))
                return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Email is required." };

            if (string.IsNullOrWhiteSpace(userData.Username))
                return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Username is required." };

            if (string.IsNullOrWhiteSpace(userData.Password))
                return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Password is required." };

            if (string.IsNullOrWhiteSpace(userData.ConfirmPassword))
                return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Confirmation password is required." };

            if (userData.Password != userData.ConfirmPassword)
                return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Passwords do not match." };

            return new UserSignupValidationDto { IsValid = true };
        }

        public UserSignupValidationDto CreateUserActionExecution(UserSignupDto userData)
        {
            var validationResult = UserSignupValidationExecution(userData);
            if (!validationResult.IsValid)
            {
                return validationResult;
            }
            using (var userContext = _dbSession.UserContext())
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
            return new UserSignupValidationDto
            {
                IsValid = true,
                Email = userData.Email,
                Username = userData.Username
            };
        }
    }
}