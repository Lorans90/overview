using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace Template.Extensions
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context /* other dependencies */)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            if( exception is AppException ||
                (exception is DbUpdateException && exception.InnerException is SqlException &&
                (exception.InnerException.Message.Contains("The DELETE statement conflicted with the REFERENCE constraint") ||
                exception.InnerException.Message.Contains("Cannot insert duplicate key row"))))
            {
                code = HttpStatusCode.Conflict;
            }

            //Hide exception message in production
            var hostingEnvironment = context.RequestServices.GetService(typeof(IHostingEnvironment)) as IHostingEnvironment;
            var message = (exception is AppException || hostingEnvironment.IsDevelopment()) ? exception.Message +
                (exception.InnerException != null ? $"({exception.InnerException.Message})" : "") : "";

            var result = JsonConvert.SerializeObject(new { error = message });
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;
            return context.Response.WriteAsync(result);
        }
    }
}