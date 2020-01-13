using System;
using System.Collections.Generic;
using System.Linq;

namespace Template.Extensions
{
    public class AppException : Exception
    {
        public AppException()
        {
        }

        public AppException(string message)
            : base(message)
        {
        }

        public AppException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
