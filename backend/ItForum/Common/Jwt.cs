using System;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ItForum.Common
{
    public static class Jwt
    {
        public static string Issuer { get; } = "http://localhost:5000";

        public static string Audience { get; } = "http://localhost:4200";

        public static string Secret { get; } = "Very super extremely long long long secret";

        public static DateTime NotBefore => DateTime.Now;

        public static DateTime Expires => NotBefore.AddDays(1);

        public static SymmetricSecurityKey SymmetricSecurityKey { get; } =
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Secret));

        public static SigningCredentials SigningCredentials { get; } =
            new SigningCredentials(SymmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        public static TokenValidationParameters TokenValidationParameters { get; } = new TokenValidationParameters
        {
            ValidIssuer = Issuer,
            ValidateIssuer = true,
            ValidAudience = Audience,
            ValidateAudience = true,
            IssuerSigningKey = SymmetricSecurityKey,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true
        };
    }
}