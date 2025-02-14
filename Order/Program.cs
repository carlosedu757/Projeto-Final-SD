using Order.Data;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

// ✅ Register OrderDb as a service
builder.Services.AddScoped<OrderDb>();
// ✅ Add Controllers
builder.Services.AddControllers();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// ✅ Swagger should only run in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Order API v1"); // Ensure correct Swagger endpoint
    });
}

app.UseHttpsRedirection();
app.UseRouting();

app.MapControllers(); // ✅ Ensure controllers are mapped

app.Run();