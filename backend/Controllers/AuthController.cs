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
            .FirstOrDefault(x => x.Email == dto.Email);

        if (user == null)
            return Unauthorized("Invalid credentials");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

        if (!isValidPassword)
            return Unauthorized("Invalid credentials");

        // Self-healing: auto-promote to "Admin" role if username contains "admin" and role is currently "User"
        if (user.Username.ToLower().Contains("admin") && user.Role != "Admin")
        {
            user.Role = "Admin";
            _context.SaveChanges();
        }

        var token = _jwtService.GenerateToken(user.Id, user.Username, user.Role);

        return Ok(new
        {
            token,
            role = user.Role,
            username = user.Username,
            email = user.Email
        });
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterDto dto)
    {
        var existingUser = _context.Users
            .FirstOrDefault(x => x.Username == dto.Username);

        if (existingUser != null)
            return BadRequest("User already exists");

        // Set role to "Admin" if the username contains "admin"
        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Username.ToLower().Contains("admin") ? "Admin" : "User"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new
        {
            message = "User registered successfully"
        });
    }
}