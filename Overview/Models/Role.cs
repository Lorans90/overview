using System.Collections.Generic;

//Test
namespace Template.Models
{
    public class Role
    {
        public Role()
        {
            UserRoles = new HashSet<UserRole>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}