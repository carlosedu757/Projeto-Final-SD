using Order.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(); 

builder.Services.AddScoped<OrderDb>();
builder.Services.AddScoped<UserDb>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", x =>
    {
        x.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHttpsRedirection();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Order API v1"); 
    });
}

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseRouting();

app.MapControllers();

app.Run();