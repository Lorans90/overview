using System.ComponentModel.DataAnnotations;

namespace Overview.Controllers.Resources
{
	public class ResetPasswordResource
	{
		[Required]
		public int UserId { get; set; }
		
		[Required]
		[StringLength(100, MinimumLength = 4)]
		[DataType(DataType.Password)]
		public string NewPassword { get; set; }

		[Required]
		[DataType(DataType.Password)]
		[Compare(nameof(NewPassword))]
		public string ConfirmPassword { get; set; }
	}
}