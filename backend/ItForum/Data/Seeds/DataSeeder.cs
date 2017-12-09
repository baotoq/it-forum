using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bogus;
using ItForum.Data.Domains;
using ItForum.Services;
using MoreLinq;

namespace ItForum.Data.Seeds
{
    public class DataSeeder
    {
        private readonly NeptuneContext _context;
        private readonly HelperService _helperService;
        private readonly UserService _userService;

        public DataSeeder(NeptuneContext context, UserService userService, HelperService helperService)
        {
            _context = context;
            _userService = userService;
            _helperService = helperService;
        }

        public async Task InitializeAsync()
        {
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            var tagFaker = new Faker<Tag>().Rules((f, o) =>
            {
                o.Name = f.Name.JobArea();
                o.DateCreated = f.Date.Past(3);
                o.DateModified = o.DateCreated;
            });

            var tags = tagFaker.Generate(10);

            var userFaker = new Faker<User>().Rules((f, o) =>
            {
                o.Name = f.Name.FindName();
                o.Phone = f.Person.Phone;
                o.Birthday = f.Person.DateOfBirth;
                o.Avatar = f.Internet.Avatar();
                o.Email = f.Person.Email;
                o.Password = _userService.Hash("1");
                o.Role = f.PickRandom(o.Role);
                o.DateCreated = f.Date.Past(4);
                o.DateModified = o.DateCreated;
            });

            var admin = userFaker.Generate();
            admin.Email = "admin@gmail.com";
            admin.Role = Role.Administrator;
            _context.Add(admin);
            await _context.SaveChangesAsync();
            admin.ApprovedBy = admin;

            var users = userFaker.Generate(100);
            users.ToList().ForEach(x => x.ApprovedBy = admin);
            _context.Users.AddRange(users);
            await _context.SaveChangesAsync();

            var postFaker = new Faker<Post>().Rules((f, o) =>
            {
                o.Content = f.Lorem.Paragraphs(f.Random.Number(1, 4), "<div></div>");
                o.CreatedBy = f.PickRandom(users);
                o.ApprovalStatus = ApprovalStatus.Pending;
                if (f.Random.Number(0, 50) != 0)
                {
                    o.ApprovalStatus = ApprovalStatus.Approved;
                    o.ApprovalStatusModifiedBy = admin;
                }
                o.DateCreated = f.Date.Past(3);
                o.DateModified = o.DateCreated;

                var temp = new List<User>(users);
                var votes = new List<Vote>();
                for (var i = 0; i < f.Random.Number(0, 10); i++)
                {
                    var u = f.PickRandom(temp);
                    temp.Remove(u);
                    votes.Add(new Vote {User = u, Like = f.Random.Bool()});
                }
                o.Votes = votes.ToList();
                o.Point = _helperService.CaculatePoint(o.Votes);
            });

            var threadFaker = new Faker<Thread>().Rules((f, o) =>
            {
                o.Title = f.Lorem.Sentence();
                o.CreatedBy = f.PickRandom(users);
                o.Views = f.Random.Number(1, 10000);
                o.Pinned = false;
                o.NumberOfPosts = 0;
                o.Posts = postFaker.Generate(f.Random.Number(3, 30)).ToList();
                o.NumberOfPosts += o.Posts.Count(x => x.ApprovalStatus == ApprovalStatus.Approved);
                o.Posts.ForEach(x =>
                {
                    x.Replies = postFaker.Generate(f.Random.Number(0, 3)).ToList();
                    x.Replies.ForEach(y => y.Thread = o);
                    o.NumberOfPosts += x.Replies.Count(z => z.ApprovalStatus == ApprovalStatus.Approved);
                });
                var p = o.Posts.OrderBy(x => x.DateCreated).FirstOrDefault();
                p.CreatedBy = o.CreatedBy;
                o.DateCreated = p.DateCreated;
                o.DateModified = o.DateCreated;
                o.LastActivity = o.Posts.OrderByDescending(x => x.DateCreated).FirstOrDefault().DateCreated.Value;

                var temp = new List<Tag>(tags);
                var threadTags = new List<ThreadTag>();
                for (var i = 0; i < f.Random.Number(2, 5); i++)
                {
                    var t = f.PickRandom(temp);
                    temp.Remove(t);
                    threadTags.Add(new ThreadTag {Tag = t});
                }
                o.ThreadTags = threadTags.ToList();
            });

            var topicFaker = new Faker<Topic>().Rules((f, o) =>
            {
                o.Name = f.Commerce.ProductName();
                o.Description = f.Lorem.Sentences(3);
                o.CreatedBy = admin;
                o.DateCreated = f.Date.Past(4);
                o.DateModified = o.DateCreated;
            });

            var topics = topicFaker.Generate(3);
            topics.ForEach(x =>
            {
                var f = new Faker();
                x.SubTopics = topicFaker.Generate(f.Random.Number(2, 3)).ToList();
                x.SubTopics.ForEach(s =>
                {
                    s.Threads = threadFaker.Generate(f.Random.Number(10, 30)).ToList();
                    for (var i = 0; i < f.Random.Number(1, 5); i++)
                    {
                        var t = f.PickRandom(s.Threads);
                        s.Threads.Remove(t);
                        t.Pinned = true;
                        s.Threads.Add(t);
                    }
                    s.NumberOfThreads = s.Threads.Count;
                });
            });
            _context.AddRange(topics);

            users = userFaker.Generate(50);
            var index = 1;
            users.ToList().ForEach(x =>
            {
                x.Role = Role.None;
                x.Email = $"user{index++}@gmail.com";
            });
            _context.AddRange(users);

            await _context.SaveChangesAsync();
        }
    }
}