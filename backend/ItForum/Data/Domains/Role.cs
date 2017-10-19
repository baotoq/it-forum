namespace ItForum.Data.Domains
{
    public enum Role
    {
        Administrator,
        Moderator,
        User
    }

    public static class RoleExtensions
    {
        public static string GetValue(this Role role)
        {
            return role.ToString("d");
        }
    }
}