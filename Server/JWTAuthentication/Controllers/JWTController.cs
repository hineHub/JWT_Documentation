using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using JWTAuthentication.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace JWTAuthentication.Controllers
{
    [EnableCors("MyCrazyGetPolicy")]
    [Authorize]
    [Route("api/JWT")]
    public class JWTController : Controller
    {
        [Authorize(Roles ="King")]
        [HttpGet("Test")]
        public IActionResult Test()
        {
            return Ok(new { Message = $"{DateTime.Now} - Your majesty I have received your secret bribe." });
        }

        [EnableCors("MyAngularAppPolicy")]
        [AllowAnonymous]
        [HttpPost("Token")]
        public IActionResult RequestToken([FromBody] TokenRequest request)
        {
            if (ModelState.IsValid)
            {
                string userRole = request.UserName == "Bill" ? "King" : "Pauper";


            if (request.Password == "Again, not for production use, DEMO ONLY!")
                {
                    var claims = new[]
                    {
                        new Claim(ClaimTypes.Name, request.UserName),
                        new Claim(ClaimTypes.Role, userRole)
                    };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MySuperSecureKey"));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: "yourdomain.com",
                        audience: "yourdomain.com",
                        claims: claims,
                        expires: DateTime.Now.AddSeconds(10),
                        signingCredentials: creds);

                    return Ok(new
                    {
                        token = new JwtSecurityTokenHandler().WriteToken(token)
                    });
                }

                
            }

            return BadRequest("Could not verify username and password");
        }

    }
}