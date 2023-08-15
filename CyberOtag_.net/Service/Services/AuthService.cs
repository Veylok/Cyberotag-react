using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using DbAccess.DBModels;

namespace Service.Services
{
    public class AuthService
    {
        private readonly IConfiguration _configuration;
        private readonly TaslakContext _dbContext;

        public AuthService(IConfiguration configuration, TaslakContext dbContext)
        {
            _configuration = configuration;
            _dbContext = dbContext;
        }

        public async Task<string> Login(string username, string password)
        {
            try
            {
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

                if (user == null || user.Password != password)
                {
                    throw new SecurityTokenException("Geçersiz kullanıcı adı veya şifre");
                }

                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();
                await SaveRefreshToken(user.Userid, refreshToken);

                return accessToken;
            }
            catch (SecurityTokenException ex)
            {
                
                throw;
            }
            catch (Exception ex)
            {
               
                throw new Exception("Giriş işlemi sırasında bir hata oluştu.", ex);
            }
        }


        private async Task<string> GetUserRoleName(int roleId)
        {
            var role = await _dbContext.Roles.FindAsync(roleId);
            return role?.Rolename ?? "User";
        }

        public string GenerateAccessToken(User user)
        {
            var roleName = GetUserRoleName(user.Roleid).Result;
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, roleName),
                
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1), 
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        public async Task SaveRefreshToken(int userId, string refreshToken)
        {
            var expiryDateTime = DateTime.UtcNow.AddDays(7); 
            var refreshTokenEntry = new Refreshtoken
            {
                Userid = userId,
                Token = refreshToken,
                Expirydatetime = expiryDateTime
            };

            _dbContext.Refreshtokens.Add(refreshTokenEntry);
            await _dbContext.SaveChangesAsync();
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["Jwt:Key"])),
                ValidateLifetime = true 
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            return principal;
        }

        public async Task<string> RefreshAccessToken(string refreshToken)
        {
            var principal = GetPrincipalFromExpiredToken(refreshToken);

            if (principal == null || !principal.HasClaim(c => c.Type == ClaimTypes.Name))
            {
                throw new SecurityTokenException("Geçersiz token");
            }

            var expirationDateUnix = long.Parse(principal.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Exp).Value);
            var expirationDateTimeUtc = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expirationDateUnix);

            if (expirationDateTimeUtc > DateTime.UtcNow)
            {
                throw new SecurityTokenException("Token süresi dolmuş");
            }

            var username = principal.Identity.Name;

           
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
            {
                throw new SecurityTokenException("Kullanıcı bulunamadı");
            }

            return GenerateAccessToken(user);
        }
    }
}
