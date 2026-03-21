using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TheSocialSite.DataAccess;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class UserActions
    {
        public UserActions(){}

        public UserData[] GetAllUsersActionExecution()
        {
            using (var userContext = new UserContext())
            {
                return userContext.Users.ToArray();
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

        public SignupActionResponse UserCreationActionExecution(UserSignupDto userData)
        {
            var validationResult = UserSignupValidationExecution(userData);
            if (!validationResult.IsValid)
            {
                return validationResult;
            }
            using (var userContext = new UserContext())
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
    }
}