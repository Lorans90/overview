using System;
using Overview.Models;

namespace Overview.Controllers.Resources
{
    public class UserResource
    {
        public int? Id { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Title { get; set; }
        public bool IsActive { get; set; }
        public DateTimeOffset? LastLoggedIn { get; set; }
        public string Tel { get; set; }
        public string EMail { get; set; }
        public string Location { get; set; }
        public string UserRoles { get; set; }
        public Role[] Roles { get; set; }
    }
}