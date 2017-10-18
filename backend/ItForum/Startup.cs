﻿using System.Security.Claims;
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
                options.AddPolicy(Policy.Admin,
                    policy => policy.RequireClaim(ClaimTypes.Role, Role.Admin.ToString("d")));
                options.AddPolicy(Policy.Mod,
                    policy => policy.RequireClaim(ClaimTypes.Role, Role.Mod.ToString("d"), Role.Admin.ToString("d")));
                options.AddPolicy(Policy.User,
                    policy => policy.RequireClaim(ClaimTypes.Role, Role.User.ToString("d"), Role.Mod.ToString("d"),
                        Role.Admin.ToString("d")));
            });

            services.AddTransient<UserService>();
            services.AddTransient<TopicService>();
            services.AddTransient<PostService>();
            services.AddTransient<CommentService>();
            services.AddTransient<UnitOfWork>();

            services.AddSingleton<HelperService>();
            services.AddAutoMapper();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app, IHostingEnvironment env, NeptuneContext context)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                await DataSeeder.InitializeAsync(context);
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