using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
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

        public bool IsExistEmail(string email)
        {
            return Any(x => x.Email.ToLower() == email.ToLower());
        }

        public IEnumerable<User> GetUnapprove()
        {
            return DbSet.Where(x => x.ApprovedBy == null);
        }

        public string GenerateJwt(User user)
        {
            var claims = new[]
            {
                new Claim("id", user.Id.ToString()),
                new Claim("name", user.Name),
                new Claim("avatar", string.IsNullOrEmpty(user.Avatar) ? "null" : user.Avatar),
                new Claim("email", user.Email),
                new Claim("role", user.Role.ToString())
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

        public void SelfApprovePost(int currentUserId, ref Post post, ref Thread thread)
        {
            var createdBy = FindById(currentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
            {
                post.ApprovalStatusModifiedBy = createdBy;
                post.ApprovalStatus = ApprovalStatus.Approved;
                thread.NumberOfPosts += 1;
            }
        }

        public string Hash(string value)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(value));
                var hash = BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
                return hash;
            }
        }
    }
}