using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Overview.Models;

namespace Overview.Data.Configurations
{
    internal class UserRoleConfiguration : IEntityTypeConfiguration<UserRole>
    {
        public void Configure(EntityTypeBuilder<UserRole> builder)
        {
            builder.HasKey(e => new {e.UserId, e.RoleId});
            builder.HasIndex(e => e.UserId);
            builder.HasIndex(e => e.RoleId);
            builder.Property(e => e.UserId);
            builder.Property(e => e.RoleId);
            builder.HasOne(d => d.Role).WithMany(p => p.UserRoles).HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.HasOne(d => d.User).WithMany(p => p.UserRoles).HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasData(new UserRole {RoleId = 1, UserId = 1},
                new UserRole {RoleId = 2, UserId = 1}
            );
        }
    }
}