namespace GuiaOrlaPE.API.Service.Interfaces;

public interface IEmailService
{
    Task SendAsync(string toEmail, string subject, string body);
}