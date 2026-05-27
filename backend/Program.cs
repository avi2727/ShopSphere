using Microsoft.EntityFrameworkCore;
using System;
using MyDotNetApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

// ASP.NET Core Web Application builder init. Ye pure application ke services aur middleware configure karta hai.
var builder = WebApplication.CreateBuilder(args);

// CORS Policy Configuration: 
// Angular local client "http://localhost:4200" ko secure cross-origin requests initiate karne ki permission di gayi hai.
// Iske bina browser API responses ko security reason se reject (block) kar dega.
builder.Services.AddCors(options =>{
options.AddPolicy("AllowAngular", policy => {
    policy.WithOrigins("http://localhost:4200")
    .AllowAnyHeader()
    .AllowAnyMethod();  
});
});

// JWT Authentication Configuration:
// API controllers par security verification lagane ke liye. Jab user login karta hai tab ek token milta hai,
// aur har request ke header me "Authorization: Bearer <token>" bheja jata hai jise ye parser validate karta hai.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
        )
    };
});

builder.Services.AddAuthorization();

// Controllers and DI registration:
// API controllers ko IOC Container me add karta hai. 
// AddScoped<JwtService>() se har HTTP request cycle ke liye JwtService ka single instance inject kiya jata hai.
builder.Services.AddControllers();
builder.Services.AddScoped<JwtService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Connection Registry:
// EF Core DbContext ko Entity Framework configuration engine ke saath bind kiya jata hai.
// AppDbContext PostgreSQL connect karne ke liye ConnectionString file config (appsettings.json) se read karega.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline:
// Development environment me Swagger UI dashboards open karne ke liye check.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// UseStaticFiles(): 
// Ye middleware static assets (jaise uploads folder me saved product images) serve karne me help karta hai.
// Iske bina physical computer me save kiye image direct URLs browser me status 404 (Not Found) return karte.
app.UseStaticFiles();

// Middleware Ordering is Critical!
// 1. CORS policies process hoti hain.
// 2. Authentication check karta hai user token valid hai ya nahi.
// 3. Authorization verify karta hai permissions (jaise Admin control).
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

// Controllers ki maps compile hoti hain API routes trigger karne ke liye.
app.MapControllers();

app.Run();

