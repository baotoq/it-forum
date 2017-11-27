using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bogus;
using ItForum.Data.Domains;

namespace ItForum.Data.Seeds
{
    public class DataSeeder
    {
        private readonly NeptuneContext _context;

        public DataSeeder(NeptuneContext context)
        {
            _context = context;
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
                o.Password = "123";
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
                o.DateCreated = f.Date.Past(3);
                o.DateModified = o.DateCreated;
            });

            var threadFaker = new Faker<Thread>().Rules((f, o) =>
            {
                o.Title = f.Lorem.Sentence();
                o.CreatedBy = f.PickRandom(users);
                o.Views = f.Random.Number(1, 10000);
                o.Pinned = false;
                o.Posts = postFaker.Generate(f.Random.Number(4, 20)).ToList();
                o.DateCreated = f.Date.Past(4);
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

            var discussionFaker = new Faker<Discussion>().Rules((f, o) =>
            {
                o.Name = f.Name.JobType();
                o.Description = f.Lorem.Sentences(3);
                o.CreatedBy = admin;
                o.Threads = threadFaker.Generate(f.Random.Number(20, 50)).ToList();
                o.DateCreated = f.Date.Past(4);
                o.DateModified = o.DateCreated;
                for (var i = 0; i < f.Random.Number(1, 5); i++)
                {
                    var t = f.PickRandom(o.Threads);
                    o.Threads.Remove(t);
                    t.Pinned = true;
                    o.Threads.Add(t);
                }
            });

            var topicFaker = new Faker<Topic>().Rules((f, o) =>
            {
                o.Name = f.Commerce.ProductName();
                o.Description = f.Lorem.Sentences(3);
                o.CreatedBy = admin;
                o.Discussions = discussionFaker.Generate(f.Random.Number(2, 6)).ToList();
                o.DateCreated = f.Date.Past(4);
                o.DateModified = o.DateCreated;
            });

            var topics = topicFaker.Generate(10);
            _context.AddRange(topics);

            users = userFaker.Generate(50);
            var index = 1;
            users.ToList().ForEach(x =>
            {
                x.Role = Role.User;
                x.Email = $"user{index++}@gmail.com";
            });
            _context.AddRange(users);

            await _context.SaveChangesAsync();
        }
    }
}