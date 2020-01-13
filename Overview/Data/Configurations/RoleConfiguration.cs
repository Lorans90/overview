using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Models;
using Template.Services;

namespace Template.Data.Configurations
{
    internal class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.Property(e => e.Name).HasMaxLength(450).IsRequired();
            builder.HasIndex(e => e.Name).IsUnique();

            var adminRole = new Role { Id = 1, Name = CustomRoles.Admin };
            var userRole = new Role { Id = 2, Name = CustomRoles.User };

            builder.HasData(adminRole,
                userRole);
        }
    }
}