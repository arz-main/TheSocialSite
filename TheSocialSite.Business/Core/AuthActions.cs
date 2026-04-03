using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class AuthActions
    {
        private readonly IJwtInteractAction _jwtServiceAction;
        public AuthActions(){
            _jwtServiceAction = new JwtInteractAction();
        }

        public LoginActionResponse UserLoginDataValidationExecution(UserLoginDto loginData)
        {
            if (loginData == null)
                return new LoginActionResponse { IsValid = false, Message = "Login data is required." };

            if (string.IsNullOrWhiteSpace(loginData.UserIdentifier))
                return new LoginActionResponse { IsValid = false, Message = "Email or username is required." };

            if (string.IsNullOrWhiteSpace(loginData.Password))
                return new LoginActionResponse { IsValid = false, Message = "Password is required." };

            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users
                    .FirstOrDefault(u => u.Username == loginData.UserIdentifier || u.Email == loginData.UserIdentifier);

                if (user == null)
                    return new LoginActionResponse { IsValid = false, Message = "User not found." };

                if (!BCrypt.Net.BCrypt.Verify(loginData.Password, user.Password))
                    return new LoginActionResponse { IsValid = false, Message = "Invalid password." };

                // generate session token
                var token = _jwtServiceAction.GenerateTokenAction(user.Id, user.Username, user.Role);

                return new LoginActionResponse
                {
                    UserIdentifier = loginData.UserIdentifier,
                    IsValid = true,
                    Message = "Login successful",
                    Token = token
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

        public LoginActionResponse RefreshTokenActionExecution(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return new LoginActionResponse
                {
                    IsValid = false,
                    Message = "User ID is required to refresh token."
                };
            }

            using (var userContext = new AppDbContext())
            {
                var user = userContext.Users.FirstOrDefault(u => u.Id == userId);
                if (user == null)
                {
                    return new LoginActionResponse
                    {
                        IsValid = false,
                        Message = "User not found."
                    };
                }

                // Generate a new JWT based on the latest role and info
                var token = _jwtServiceAction.GenerateTokenAction(user.Id, user.Username, user.Role);

                return new LoginActionResponse
                {
                    IsValid = true,
                    Message = "Token refreshed successfully.",
                    Token = token,
                    UserIdentifier = user.Username
                };
            }
        }
    }
}