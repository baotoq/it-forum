using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using ItForum.Common;
using ItForum.Data;
using ItForum.Data.Domains;
using Microsoft.EntityFrameworkCore;

namespace ItForum.Services
{
    public class UserService : Service<User>
    {
        private readonly HelperService _helperService;

        public UserService(NeptuneContext context, HelperService helperService) : base(context)
        {
            _helperService = helperService;
        }

        public User FindBy(string email)
        {
            return SingleOrDefault(x => x.Email == email && x.ApprovalStatus != ApprovalStatus.Declined);
        }

        public bool IsExistEmail(string email)
        {
            return Any(x => x.Email == email && x.ApprovalStatus != ApprovalStatus.Declined);
        }

        public IEnumerable<User> FindPending()
        {
            return DbSet.Where(x => x.ApprovalStatus == ApprovalStatus.Pending);
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

        public IEnumerable<User> FindModerators(int topicId)
        {
            return Context.Managements.Include(m => m.User)
                .Where(m => m.TopicId == topicId)
                .Select(m => m.User);
        }

        public bool IsManagement(int topicId, int userId)
        {
            var moderators = FindModerators(topicId).ToList();
            return moderators.Any(u => u.Id == userId);
        }
    }
}