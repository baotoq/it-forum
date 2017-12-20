using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using ItForum.Common;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Dtos;
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
                .Where(m => m.User.Role == Role.Moderator)
                .Select(m => m.User);
        }

        public bool IsManagement(int topicId, int userId)
        {
            var moderators = FindModerators(topicId).ToList();
            return moderators.Any(u => u.Id == userId);
        }

        public User FindWithManagements(int id)
        {
            return DbSet.Include(x => x.Managements)
                .SingleOrDefault(u => u.Id == id);
        }

        public User FindNoTrackingWithManagements(int id)
        {
            return DbSet.AsNoTracking()
                .Include(x => x.Managements)
                .SingleOrDefault(u => u.Id == id);
        }

        public IEnumerable<Post> FindUserPosts(int id, ApprovalStatus approvalStatus)
        {
            return Context.Posts.AsNoTracking()
                .Include(x => x.Thread)
                .Where(x => x.CreatedById == id && x.ApprovalStatus == approvalStatus);
        }

        public IEnumerable<Post> FindUserPostsWithVote(int id, ApprovalStatus approvalStatus)
        {
            return Context.Posts.AsNoTracking()
                .Include(x => x.Votes)
                .Where(x => x.CreatedById == id && x.ApprovalStatus == approvalStatus);
        }

        public IEnumerable<Thread> FindUserThreads(int id, ApprovalStatus approvalStatus)
        {
            return Context.Threads.AsNoTracking()
                .Where(x => x.CreatedById == id && x.ApprovalStatus == approvalStatus);
        }

        public IEnumerable<Thread> FindUserThreadsWithPostsAndTopic(int id, ApprovalStatus approvalStatus)
        {
            return Context.Threads.AsNoTracking()
                .Include(x => x.Topic)
                .Include(x => x.Posts)
                .Where(x => x.CreatedById == id && x.ApprovalStatus == approvalStatus);
        }

        public void CaculateReputationsNumberOfPostsThreads(int id, UserDto userDto)
        {
            var posts = FindUserPostsWithVote(id, ApprovalStatus.Approved).ToList();

            userDto.Reputations = 0;

            posts.ForEach(p => { userDto.Reputations += _helperService.CaculatePoint(p.Votes); });

            userDto.NumberOfPosts = posts.Count;
            userDto.NumberOfThreads = FindUserThreads(id, ApprovalStatus.Approved).ToList().Count;
        }

        public void Attach(Management management)
        {
            Context.Managements.Attach(management);
        }
    }
}