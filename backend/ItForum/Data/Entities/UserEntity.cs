using System;
using ItForum.Data.Domains;

namespace ItForum.Data.Entities
{
    public abstract class UserEntity : Entity
    {
        public string Name { get; set; }

        public string Phone { get; set; }

        public string Avatar { get; set; }

        public DateTime Birthday { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public Role Role { get; set; }

        public int? ConfirmedById { get; set; }
    }
}