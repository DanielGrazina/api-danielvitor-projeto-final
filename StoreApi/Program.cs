using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;
using Microsoft.OpenApi.Models;
using StoreApi.Data;
using System.Text;
using Polly;
using Polly.Extensions.Http;
using System.Net.Http;
using Polly.Retry;
using Polly.CircuitBreaker;
using Polly.Timeout;

var builder = WebApplication.CreateBuilder(args);

// DATABASE
builder.Services.AddDbContext<StoreDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// REDIS
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration["Redis:ConnectionString"];
});


// CONTROLLERS + JSON
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// SERVICES
builder.Services.AddScoped<StoreApi.Services.IUserService, StoreApi.Services.UserService>();
builder.Services.AddScoped<StoreApi.Services.IAuthService, StoreApi.Services.AuthService>();
builder.Services.AddScoped<StoreApi.Services.ICartService, StoreApi.Services.CartService>();
builder.Services.AddScoped<StoreApi.Services.ICategoryService, StoreApi.Services.CategoryService>();
builder.Services.AddScoped<StoreApi.Services.ICheckoutService, StoreApi.Services.CheckoutService>();
builder.Services.AddScoped<StoreApi.Services.IProductService, StoreApi.Services.ProductService>();

// SWAGGER + AUTH
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Insira o token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});


// Mount with Polly Policies
builder.Services.AddHttpClient("PaymentClient", client =>
{
    var url = builder.Configuration["ImposterUrl"] ?? "http://localhost:4545";
    client.BaseAddress = new Uri(url);
}).AddPolicyHandler(GetRetryPolicy()).AddPolicyHandler(GetCircuitBreakerPolicy());

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});


var app = builder.Build();

// PIPELINE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()              // 5xx, 408, etc.
        .OrResult(msg => (int)msg.StatusCode == 429) // Too Many Requests
        .WaitAndRetryAsync(
            3,                                    // tenta 3 vezes
            tentativa => TimeSpan.FromSeconds(Math.Pow(2, tentativa)) // 2s, 4s, 8s
        );
}

static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 3,       // após 3 falhas seguidas
            durationOfBreak: TimeSpan.FromSeconds(30)    // "desliga" 30s
        );
}