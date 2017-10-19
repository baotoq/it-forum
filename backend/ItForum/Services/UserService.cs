using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using ItForum.Common;
using ItForum.Data;
using ItForum.Data.Domains;

namespace ItForum.Services
{
    public class UserService : Service<User>
    {
        public UserService(NeptuneContext context) : base(context)
        {
        }

        public User FindBy(string email, string password)
        {
            return SingleOrDefault(x => x.Email == email && x.Password == password);
        }

        public bool HasEmail(string email)
        {
            return Any(x => x.Email.ToLower() == email.ToLower());
        }

        public List<User> GetUnconfirmed()
        {
            return DbSet.Where(x => x.ConfirmedBy == null).ToList();
        }

        public string GenerateJwt(User user)
        {
            var claims = new[]
            {
                new Claim("id", user.Id.ToString()),
                new Claim("name", user.Name),
                new Claim("phone", user.Phone),
                new Claim("avatar", user.Avatar),
                new Claim("birthday", user.Birthday.ToString()),
                new Claim("email", user.Email),
                new Claim("role", user.Role.GetValue())
            };

            var token = new JwtSecurityToken(
                Jwt.Issuer,
                Jwt.Audience,
                claims,
                Jwt.NotBefore,
                Jwt.Expires,
                Jwt.SigningCredentials);

            var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);

            return encodedToken;
        }
    }
}