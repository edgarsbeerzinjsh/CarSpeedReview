using CarSpeed.Core.Models;
using CarSpeed.Core.Services;
using CarSpeed.Data;
using CarSpeed.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .WithExposedHeaders("X-Pagination")
            .AllowAnyMethod();
    });
});
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<CarSpeedDbContext>(options =>
    options.UseMySQL(connectionString: builder.Configuration.GetConnectionString("RoadSpeedEntries")));
builder.Services.AddTransient<ICarSpeedDbContext, CarSpeedDbContext>();
builder.Services.AddScoped<IDbService<CarSpeedEntry>, DbService<CarSpeedEntry>>();
builder.Services.AddScoped<ICarSpeedService, CarSpeedService>();

var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();