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
            return SingleOrDefault(x => x.Email == email);
        }

        public bool IsExistEmail(string email)
        {
            return Any(x => x.Email == email);
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

        public bool ApprovePost(int currentUserId, ref Post post)
        {
            var createdBy = FindById(currentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
            {
                post.ApprovalStatusModifiedBy = createdBy;
                post.ApprovalStatus = ApprovalStatus.Approved;
                return true;
            }
            return false;
        }

        public bool ApproveThread(int currentUserId, ref Thread thread)
        {
            var createdBy = FindById(currentUserId);
            if (createdBy.Role == Role.Administrator || createdBy.Role == Role.Moderator)
            {
                thread.ApprovalStatusModifiedBy = createdBy;
                thread.ApprovalStatus = ApprovalStatus.Approved;

                thread.Posts[0].ApprovalStatusModifiedBy = createdBy;
                thread.Posts[0].ApprovalStatus = ApprovalStatus.Approved;
                thread.NumberOfPosts += 1;

                return true;
            }
            return false;
        }

        public IEnumerable<User> FindModerators(int topicId)
        {
            return Context.Managements.Include(m => m.User)
                .Where(m => m.TopicId == topicId)
                .Select(m => m.User);
        }
    }
}