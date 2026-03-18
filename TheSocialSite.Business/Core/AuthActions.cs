using System.Xml.Serialization;
using TheSocialSite.Business.Structure;
using TheSocialSite.DataAccess;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.User;

namespace TheSocialSite.Business.Core
{
    public class AuthActions
    {
        private readonly DbSession _dbSession;
        private readonly JwtServiceAction _jwtService;
        public AuthActions()
        {
            _dbSession = new DbSession();
            _jwtService = new JwtServiceAction();
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
                    return new UserLoginValidationDto { IsValid = false, ErrorMessage = "User not found." };

                if (!BCrypt.Net.BCrypt.Verify(loginData.Password, user.Password))
                    return new UserLoginValidationDto { IsValid = false, ErrorMessage = "Invalid password." };

                // generate token while user is still in scope
                var token = _jwtService.GenerateTokenAction(user.Username);

                return new UserLoginValidationDto
                {
                    UserIdentifier = loginData.UserIdentifier,
                    IsValid = true,
                    Token = token
                };
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

        public UserSignupValidationDto UserCreationExecution(UserSignupDto userData)
        {
            var validationInfo = UserSignupValidationExecution(userData);
            if (!validationInfo.IsValid)
                return validationInfo;

            using (var userContext = _dbSession.UserContext())
            {
                // check for duplicate email/username before creating
                var exists = userContext.Users
                    .Any(u => u.Email == userData.Email || u.Username == userData.Username);

                if (exists)
                    return new UserSignupValidationDto { IsValid = false, ErrorMessage = "Email or username already taken." };

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

            return new UserSignupValidationDto
            {
                IsValid = true,
                Email = userData.Email,
                Username = userData.Username
            };
        }
    }
}