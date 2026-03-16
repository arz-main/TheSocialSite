using System.Linq;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Models.User;
using TheSocialSite.DataAccess;
using TheSocialSite.Domain.Entities.User;

namespace TheSocialSite.Business.Core
{
    public class UserActions
    {
        private readonly DbSession _dbSession;

        public UserActions()
        {
            _dbSession = new DbSession();
        }

        public UserLoginValidationDto UserLoginDataValidationExecution(UserLoginDto loginData)
        {
            if (loginData == null)
                return new UserLoginValidationDto { IsValid = false, ErrorMessage = "Login data is required." };

            if (string.IsNullOrWhiteSpace(loginData.UserIdentifier))
                return new UserLoginValidationDto { IsValid = false, ErrorMessage = "Email or username is required." };

            if (string.IsNullOrWhiteSpace(loginData.Password))
                return new UserLoginValidationDto { IsValid = false, ErrorMessage = "Password is required." };

            using (var userContext = _dbSession.UserContext())
            {
                var user = userContext.Users
                    .FirstOrDefault(u => u.Username == loginData.UserIdentifier || u.Email == loginData.UserIdentifier);

                if (user == null)
                {
                    return new UserLoginValidationDto
                    {
                        IsValid = false,
                        ErrorMessage = "User not found."
                    };
                }
            }

            return new UserLoginValidationDto
            {
                UserIdentifier = loginData.UserIdentifier,
                IsValid = true
            };
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

        public UserSignupValidationDto UserCreationExecution(UserSignupDto userData)
        {
            var validationInfo = UserSignupValidationExecution(userData);
            if (!validationInfo.IsValid)
                return validationInfo;

            using (var userContext = _dbSession.UserContext())
            {
                // Hash the password before saving
                //var hashedPassword = ...;

                var user = new UserData
                {
                    Email = userData.Email,
                    Username = userData.Username,
                    Password = userData.Password,
                    Role = UserRole.User,
                    JoinedDate = DateTime.UtcNow
                };

                userContext.Users.Add(user);
                userContext.SaveChanges();
            }

            return new UserSignupValidationDto
            {
                Email = userData.Email,
                Username = userData.Username,
                IsValid = true
            };
        }
    }
}