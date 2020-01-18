using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Overview.Models;

namespace Overview.Data.Configurations
{
    public class ReceiveConfiguration : IEntityTypeConfiguration<Receive>
    {
        public void Configure(EntityTypeBuilder<Receive> builder)
        {
            // builder.HasKey(e => e.Id);
        }
    }
}