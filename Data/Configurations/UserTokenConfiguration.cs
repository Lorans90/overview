using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Overview.Models;

namespace Overview.Data.Configurations
{
    internal class UserTokenConfiguration : IEntityTypeConfiguration<UserToken>
    {
        public void Configure(EntityTypeBuilder<UserToken> builder)
        {
            builder.HasOne(ut => ut.User).WithMany(u => u.UserTokens).HasForeignKey(ut => ut.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            builder.Property(ut => ut.RefreshTokenIdHash).HasMaxLength(450).IsRequired();
            builder.Property(ut => ut.RefreshTokenIdHashSource).HasMaxLength(450);
        }
    }
}