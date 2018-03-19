using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using JWTAuthentication.Filters;
using JWTAuthentication.Model;
using Microsoft.AspNetCore.Antiforgery;
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
        private readonly ITokenGenerator _tokenGenerator;

        public JWTController(ITokenGenerator tokenGenerator)
        {
            _tokenGenerator = tokenGenerator;
        }

        [EnableCors("MyAngularAppPolicy")]
        [Authorize(Roles ="King")]
        [ResponseAuthorizationHeaderFilter]
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
            var _tokenGenerator = new TokenGenerator();

            if (ModelState.IsValid)
            {
                if (ValidCredentials(request))
                {
                    var tokenVal = _tokenGenerator.Generate(request.UserName);

                    return Ok(new
                    {
                        token = tokenVal
                    });
                }
            }

            return BadRequest("Could not verify username and password");
        }

        private bool ValidCredentials(TokenRequest request)
        {
            return request.Password == "Again, not for production use, DEMO ONLY!";
        }

    }
}