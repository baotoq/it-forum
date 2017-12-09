using System;
using ItForum.Data.Domains;
using ItForum.Data.Entities.Core;

namespace ItForum.Data.Entities
{
    public abstract class UserEntity : IEntity
    {
        public string Name { get; set; }

        public string Phone { get; set; }

        public string Avatar { get; set; }

        public DateTime Birthday { get; set; }

        public string Email { get; set; }

        public string Salt { get; set; }

        public string Password { get; set; }

        public Role Role { get; set; }

        public int AccessFailedCount { get; set; }

        public bool LockoutEnabled { get; set; }

        public DateTime LockoutEnd { get; set; }

        public int? ApprovedById { get; set; }

        public int Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }

        public DateTime? DateDeleted { get; set; }
    }
}