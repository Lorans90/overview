using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Template.Models;

namespace Template.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.Property(e => e.Username).HasMaxLength(450).IsRequired();
            builder.HasIndex(e => e.Username).IsUnique();
            builder.Property(e => e.Password).IsRequired();
            builder.Property(e => e.Salt).IsRequired();
            builder.Property(e => e.SerialNumber).HasMaxLength(450);

            // Add users
            // Add Admin user
            var adminUser = new User
            {
                Id = 1,
                Username = "Admin",
                DisplayName = "Admin",
                IsActive = true,
                LastLoggedIn = null,
                Salt = @"ZVmu8znaXa6hOfCZn3+nDFgQzxN/OXV5d4FK0rBXsmDbeDEMJ6Fv2P1WITOIvVnvpcntARyih8D/zS7cv8dsRoTEmcKXNx/m40Du1tqQMMq0GUbKuUXviDEzG2EbdIECoVs7GESLPSid5gpmtRI4+Hjjz26q7L053BUcMoMmuA0PAzhlyL8G9VQZwMWzh3YcMX0SsmzrF8QV+eliCpP6hsemOTrPBn/PWdHLIl0w5BsuahaDW1VwevBMzUf2P+g0DoILwfCLlOzej6nfrBHZaZitji+cW16pVquajvA/JIerFq2Lg7Mv7k4iHuQauW4HL9M7eagUvw7iHoO4speBhA==",
                Password = @"zF/NFsaUf3sZ3jx6rBUXtafR0mzIZS/kp6OvtE03ooA=",
                SerialNumber = @"ef786f7326864b60a4c5f991b6ca7487"
            };


            builder.HasData(adminUser);
        }
    }

}

