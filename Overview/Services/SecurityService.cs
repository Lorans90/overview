using System;
using System.Security.Cryptography;
using System.Text;

namespace Template.Services
{
    public interface ISecurityService
    {
        string GetSha256Hash(string input);
        string GetSha256Hash(string input, string salt);
        string GetSalt();
    }

    public class SecurityService : ISecurityService
    {
        private static readonly int SaltLength = 256;

        public string GetSha256Hash(string input)
        {
            using (var hashAlgorithm = new SHA256CryptoServiceProvider())
            {
                var byteValue = Encoding.UTF8.GetBytes(input);
                var byteHash = hashAlgorithm.ComputeHash(byteValue);
                return Convert.ToBase64String(byteHash);
            }
        }

        public string GetSha256Hash(string input, string salt)
        {
            return GetSha256Hash(salt + input);
        }

        public string GetSalt()
        {
            var salt = new byte[SaltLength];
            using( var random = new RNGCryptoServiceProvider())
            {
                random.GetNonZeroBytes(salt);
            }
            return Convert.ToBase64String(salt);
        }
    }
}