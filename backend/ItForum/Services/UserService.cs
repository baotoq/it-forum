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
        public UserService(NeptuneContext context) : base(context)
        {
        }

        public User FindBy(string email)
        {
            return SingleOrDefault(x => x.Email == email && x.ApprovalStatus != ApprovalStatus.Declined);
        }

        public bool IsExistEmail(string email)
        {
            return Any(x => x.Email == email && x.ApprovalStatus != ApprovalStatus.Declined);
        }

        public IEnumerable<User> FindBy(ApprovalStatus approvalStatus)
        {
            return DbSet.Where(x => x.ApprovalStatus == approvalStatus);
        }

        public IEnumerable<User> FindByNoTracking(ApprovalStatus approvalStatus)
        {
            return DbSet.AsNoTracking().Where(x => x.ApprovalStatus == approvalStatus);
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

        public IEnumerable<Post> FindUserPosts(int id)
        {
            return DbSet.AsNoTracking().Include(x => x.Posts).ThenInclude(x => x.Thread)
                .SingleOrDefault(x => x.Id == id)?.Posts;
        }
    }
}