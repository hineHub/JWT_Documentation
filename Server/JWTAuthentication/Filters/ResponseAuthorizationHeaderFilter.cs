using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace JWTAuthentication.Filters
{
    public class ResponseAuthorizationHeaderFilter : ResultFilterAttribute
    {
        const string AuthorizationKeyName = "authorization";
        const string TokenIdentifier = "bearer ";

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            var request = context.HttpContext.Request;
            var response = context.HttpContext.Response;

            if (ShouldApplyAuthorizationHeader(request, response))
            {
                if (context.HttpContext.Response.Headers.ContainsKey(AuthorizationKeyName))
                {
                    context.HttpContext.Response.Headers.Remove(AuthorizationKeyName);
                }

                var token = TokenIdentifier + GenerateToken(request.Headers[AuthorizationKeyName]);

                context.HttpContext.Response.Headers.Add(AuthorizationKeyName, token);
            }

            base.OnResultExecuting(context);
        }

        private string GenerateToken(string requestToken)
        {
            //var pureToken = requestToken.Replace(TokenIdentifier, string.Empty);

            //var jwt = new JwtSecurityToken(pureToken);

            var claims = new[]
            {
                        new Claim(ClaimTypes.Name, "blah"),
                        new Claim(ClaimTypes.Role, "King")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MySuperSecureKey"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "yourdomain.com",
                audience: "yourdomain.com",
                claims: claims,
                expires: DateTime.Now.AddSeconds(10),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);



            //var token = new JwtSecurityToken(
            //    issuer: jwt.Issuer,
            //    audience: string.Concat(jwt.Audiences),
            //    claims: jwt.Claims,
            //    expires: DateTime.Now.AddSeconds(30),
            //    signingCredentials: jwt.SigningCredentials);

            //return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool ShouldApplyAuthorizationHeader(HttpRequest request, HttpResponse response)
        {
            return response.StatusCode == 200 &&
                request.Headers.ContainsKey(AuthorizationKeyName) &&
                request.Headers[AuthorizationKeyName].ToString().IndexOf(TokenIdentifier) == 0;
        }
    }
}
