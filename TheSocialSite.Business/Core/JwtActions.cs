using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TheSocialSite.Business.Interfaces;
using TheSocialSite.Domain.Entities.User;
using TheSocialSite.Domain.Models.Response;

public class JwtActions
{
    private readonly IConfiguration _configuration =
        new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

    public JwtActionResponse GenerateTokenActionExecution(string id, string username, Role role)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]);
        var issuer = _configuration["JwtSettings:Issuer"];
        var audience = _configuration["JwtSettings:Audience"];
        var expires = DateTime.UtcNow.AddDays(double.Parse(_configuration["JwtSettings:ExpiryDays"]));
        
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, id),
            new Claim(JwtRegisteredClaimNames.Name, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, role.ToString()), // keep this one as ClaimTypes, roles are special
        };
        
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256));
        
        return new JwtActionResponse
        {
            IsValid = true,
            Message = "Token generated successfully.",
            Token = new JwtSecurityTokenHandler().WriteToken(token)
        };
    }
}