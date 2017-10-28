using System.Linq;
using System.Threading.Tasks;
using Bogus;
using ItForum.Data.Domains;

namespace ItForum.Data.Seeds
{
    public class DataSeeder
    {
        public static async Task InitializeAsync(NeptuneContext context)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            var userFaker = new Faker<User>().Rules((f, o) =>
            {
                o.Name = f.Name.FindName();
                o.Phone = f.Person.Phone;
                o.Birthday = f.Person.DateOfBirth;
                o.Avatar = f.Internet.Avatar();
                o.Email = f.Person.Email;
                o.Password = "123";
                o.Role = f.PickRandom(o.Role);
                o.CreatedDate = f.Date.Past(4);
                o.UpdatedDate = o.CreatedDate;
            });

            var admin = userFaker.Generate();
            admin.Email = "admin@gmail.com";
            admin.Role = Role.Administrator;
            context.Add(admin);
            await context.SaveChangesAsync();
            admin.ConfirmedBy = admin;

            var users = userFaker.Generate(100);
            users.ToList().ForEach(x => x.ConfirmedBy = admin);
            context.Users.AddRange(users);
            await context.SaveChangesAsync();

            var commentFaker = new Faker<Post>().Rules((f, o) =>
            {
                o.Content = string.Join(" ", f.Rant.Reviews(lines: f.Random.Number(1, 5)));
                o.User = f.PickRandom(users);
                o.CreatedDate = f.Date.Past(3);
                o.UpdatedDate = o.CreatedDate;
            });

            var postFaker = new Faker<Thread>().Rules((f, o) =>
            {
                o.Title = f.Lorem.Sentence();
                o.Content = f.Lorem.Paragraphs(f.Random.Number(10, 50), "<div></div>");
                o.User = f.PickRandom(users);
                o.Views = f.Random.Number(1, 10000);
                o.Posts = commentFaker.Generate(f.Random.Number(4, 20)).ToList();
                o.CreatedDate = f.Date.Past(4);
                o.UpdatedDate = o.CreatedDate;
                o.LastActivity = o.Posts.OrderByDescending(x => x.CreatedDate).FirstOrDefault().CreatedDate.Value;
            });

            var discussionFaker = new Faker<Discussion>().Rules((f, o) =>
            {
                o.Name = f.Commerce.ProductName();
                o.Description = f.Lorem.Sentences(3);
                o.Threads = postFaker.Generate(f.Random.Number(20, 50)).ToList();
                o.CreatedDate = f.Date.Past(4);
                o.UpdatedDate = o.CreatedDate;
            });

            var topicFaker = new Faker<Topic>().Rules((f, o) =>
            {
                o.Name = f.Commerce.ProductName();
                o.Description = f.Lorem.Sentences(3);
                o.Discussions = discussionFaker.Generate(f.Random.Number(2, 6)).ToList();
                o.CreatedDate = f.Date.Past(4);
                o.UpdatedDate = o.CreatedDate;
            });

            var topics = topicFaker.Generate(10);
            context.AddRange(topics);

            users = userFaker.Generate(50);
            var index = 1;
            users.ToList().ForEach(x =>
            {
                x.Role = Role.User;
                x.Email = $"user{index++}@gmail.com";
            });
            context.AddRange(users);

            await context.SaveChangesAsync();
        }
    }
}