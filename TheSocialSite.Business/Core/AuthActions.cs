using TheSocialSite.Business.Interfaces;
using TheSocialSite.Business.Structure;
using TheSocialSite.DataAccess.Context;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;

namespace TheSocialSite.Business.Core
{
    public class AuthActions
    {
        private readonly IJwtServiceAction _jwtServiceAction;
        public AuthActions(){
            _jwtServiceAction = new JwtServiceAction();
        }

        public LoginActionResponse UserLoginDataValidationExecution(UserLoginDto loginData)
        {
            if (loginData == null)
                return new LoginActionResponse { IsValid = false, Message = "Login data is required." };

            if (string.IsNullOrWhiteSpace(loginData.UserIdentifier))
                return new LoginActionResponse { IsValid = false, Message = "Email or username is required." };

            if (string.IsNullOrWhiteSpace(loginData.Password))
                return new LoginActionResponse { IsValid = false, Message = "Password is required." };

            using (var userContext = new UserContext())
            {
                var user = userContext.Users
                    .FirstOrDefault(u => u.Username == loginData.UserIdentifier || u.Email == loginData.UserIdentifier);

                if (user == null)
                    return new LoginActionResponse { IsValid = false, Message = "User not found." };

                if (!BCrypt.Net.BCrypt.Verify(loginData.Password, user.Password))
                    return new LoginActionResponse { IsValid = false, Message = "Invalid password." };

                // generate session token
                var token = _jwtServiceAction.GenerateTokenAction(user.Username, user.Id);

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

        public SignupActionResponse UserCreationExecution(UserSignupDto userData)
        {
            var validationInfo = UserSignupValidationExecution(userData);
            if (!validationInfo.IsValid)
                return validationInfo;

            using (var userContext = new UserContext())
            {
                // check for duplicate email/username before creating
                var exists = userContext.Users
                    .Any(u => u.Email == userData.Email || u.Username == userData.Username);

                if (exists)
                    return new SignupActionResponse { IsValid = false, Message = "Email or username already taken." };

                var user = new UserData
                {
                    Email = userData.Email,
                    Username = userData.Username,
                    Password = BCrypt.Net.BCrypt.HashPassword(userData.Password),
                    Role = UserRole.User,
                    JoinedDate = DateTime.UtcNow
                };

                userContext.Users.Add(user);
                userContext.SaveChanges();
            }

            return new SignupActionResponse
            {
                IsValid = true,
                Message = "User created successfully",
                Email = userData.Email,
                Username = userData.Username
            };
        }
    }
}