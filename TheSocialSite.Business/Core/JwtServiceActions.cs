using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TheSocialSite.Business.Interfaces;

public class JwtServiceActions
{
    private readonly IConfiguration _configuration =
        new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();

    public string GenerateTokenActionExecution(string username)
    {
        var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]);
        var issuer = _configuration["JwtSettings:Issuer"];
        var audience = _configuration["JwtSettings:Audience"];
        var expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:ExpiryDays"]));
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}