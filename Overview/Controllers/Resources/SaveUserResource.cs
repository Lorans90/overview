using System.ComponentModel.DataAnnotations;
using Template.Models;

namespace Template.Controllers.Resources
{
    public class SaveUserResource
    {
        public int? Id { get; set; }
        [Required]
        [MaxLength(450)]
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Title { get; set; }
        public bool IsActive { get; set; }
        public string Tel { get; set; }
        public string EMail { get; set; }
        public string Location { get; set; }
        public Role[] Roles { get; set; }
    }
}