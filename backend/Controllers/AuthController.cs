using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using MyDotNetApi.DTOs;
using MyDotNetApi.Models;
using MyDotNetApi.Data;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDto dto)
    {
        var user = _context.Users
            .FirstOrDefault(x => x.Username == dto.Username);

        if (user == null)
            return Unauthorized("Invalid credentials");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

        if (!isValidPassword)
            return Unauthorized("Invalid credentials");

        var token = _jwtService.GenerateToken(user.Username, user.Role);

        return Ok(new { token });
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var existingUser = _context.Users
            .FirstOrDefault(x => x.Username == dto.Username);

        if (existingUser != null)
            return BadRequest("User already exists");

        var user = new User
        {
            Username = dto.Username,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new
        {
            message = "User registered successfully"
        });
    }
}