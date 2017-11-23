using System.Security.Claims;
using System.Text;
using AutoMapper;
using ItForum.Common;
using ItForum.Data;
using ItForum.Data.Domains;
using ItForum.Data.Seeds;
using ItForum.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;

namespace ItForum
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<NeptuneContext>(options => options.UseSqlite("Data Source=neptune.db"));

            services.AddCors();

            services.AddMvc().AddJsonOptions(options =>
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore);

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Jwt.Issuer,
                    ValidateIssuer = true,
                    ValidAudience = Jwt.Audience,
                    ValidateAudience = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jwt.Secret)),
                    ValidateIssuerSigningKey = true
                };
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policy.Administrator,
                    policy => policy.RequireClaim(ClaimTypes.Role, Role.Administrator.GetValue()));
                options.AddPolicy(Policy.Moderator,
                    policy => policy.RequireClaim(ClaimTypes.Role, Role.Moderator.GetValue(),
                        Role.Administrator.GetValue()));
                options.AddPolicy(Policy.User,
                    policy => policy.RequireClaim(ClaimTypes.Role, Role.User.GetValue(), Role.Moderator.GetValue(),
                        Role.Administrator.GetValue()));
            });

            services.AddTransient<UserService>();
            services.AddTransient<TopicService>();
            services.AddTransient<DiscussionService>();
            services.AddTransient<ThreadService>();
            services.AddTransient<PostService>();
            services.AddTransient<TagService>();
            services.AddTransient<UnitOfWork>();

            services.AddSingleton<HelperService>();
            services.AddAutoMapper();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();                
            }

            app.UseCors(builder =>
            {
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
                builder.AllowAnyOrigin();
            });

            app.UseAuthentication();

            app.UseMvc();
        }
    }
}