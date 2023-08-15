using DbAccess.DBModels;
using DbAccess.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc.Formatters;
using System.Text.Json;
using System.Text.Json.Serialization;
using Service.Services;

var builder = WebApplication.CreateBuilder(args);

//jhson sonsuz döngüye giriyordu bunu önlemnek için 
builder.Services.AddControllers(options =>
{
    options.OutputFormatters.RemoveType<SystemTextJsonOutputFormatter>();
    options.OutputFormatters.Add(new SystemTextJsonOutputFormatter(new JsonSerializerOptions
    {
        ReferenceHandler = ReferenceHandler.IgnoreCycles, 
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    }));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TaslakContext>();
builder.Services.AddScoped<OperatorService>();
builder.Services.AddScoped<BranchService>();
builder.Services.AddScoped<ChannelService>();
builder.Services.AddScoped<CityService>();
builder.Services.AddScoped<CustomerService>();
builder.Services.AddScoped<DirectorService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<FacilityService>();
builder.Services.AddScoped<GraphicsetService>();
builder.Services.AddScoped<OperationService>();
builder.Services.AddScoped<SpendingService>();
builder.Services.AddScoped<SpendingtypeService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AssignmentService>();
builder.Services.AddScoped<RoleService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
