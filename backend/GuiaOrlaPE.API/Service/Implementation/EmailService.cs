using GuiaOrlaPE.API.Service.Interfaces;
using MailKit.Net.Smtp;
using MimeKit;

namespace GuiaOrlaPE.API.Service.Implementation;

public class EmailService(IConfiguration configuration) : IEmailService
{
    private readonly IConfiguration _configuration = configuration;

    public async Task SendAsync(string toEmail, string subject, string body)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_configuration["Email:From"]));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = subject;
        email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_configuration["Email:Host"], int.Parse(_configuration["Email:Port"]), MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_configuration["Email:User"], _configuration["Email:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}