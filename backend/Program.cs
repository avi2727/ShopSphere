using Microsoft.EntityFrameworkCore;
using System;
using MyDotNetApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>{
options.AddPolicy("AllowAngular", policy => {
    policy.WithOrigins("http://localhost:4200")

    .AllowAnyHeader()
    .AllowAnyMethod();
    
});
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 2. Enable CORS middleware (MUST be placed before Authorization)
app.UseCors("AllowAngular");

app.UseAuthorization();

app.MapControllers();

app.Run();
