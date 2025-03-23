using Gestão_Planos_Telefonia.backend;
using Microsoft.EntityFrameworkCore;
using Repository;
using Services;

var builder = WebApplication.CreateBuilder(args);
var dataBaseConnectionString = builder.Configuration.GetConnectionString("DatabaseConnection");
var googleClientId = builder.Configuration.GetSection("GoogleAuth")["GoogleClientId"];
var secretId = builder.Configuration.GetSection("Jwt")["SecretId"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

builder.Services.AddControllers().AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TelefoniaContext>(options =>
    options.UseSqlServer(dataBaseConnectionString));

builder.Services.AddScoped<IClienteService, ClienteService>();
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IPlanoService, PlanoService>();
builder.Services.AddScoped<IPlanoRepository, PlanoRepository>();

Environment.SetEnvironmentVariable("googleClientId", googleClientId);
Environment.SetEnvironmentVariable("secretId", secretId);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
