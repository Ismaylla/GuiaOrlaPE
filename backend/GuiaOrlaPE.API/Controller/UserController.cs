// using GuiaOrlaPE.API.Models.Requests;
// using GuiaOrlaPE.API.Service.Interfaces;
// using Microsoft.AspNetCore.Mvc;

// namespace GuiaOrlaPE.API.Controller;

// [ApiController]
// [Route("api/users")]
// public class UserController : ControllerBase
// {
//     private readonly IUserService _service;
//     private readonly IBusinessService _businessService;
//     private readonly ITokenService _tokenService; // ADICIONADO: Serviço de geração de tokens
//     private readonly ILogger<UserController> _logger;

//     // Construtor explícito para injetar os 3 serviços necessários limpamente
//     public UserController(
//         IUserService service, 
//         IBusinessService businessService, 
//         ITokenService tokenService, 
//         ILogger<UserController> logger)
//     {
//         _service = service;
//         _businessService = businessService;
//         _tokenService = tokenService;
//         _logger = logger;
//     }

//     [HttpPost("businessperson")]
//     public async Task<IActionResult> CreateBusinessperson([FromBody] CreateBusinesspersonRequest request)
//     {
//         try
//         {
//             _logger.LogInformation("Iniciando cadastro de usuário Businessperson. Email: {Email}", request.Email);

//             var user = await _service.CreateBusinesspersonAsync(request);

//             _logger.LogInformation("Usuário Businessperson cadastrado com sucesso. UserId: {UserId}", user.Id);

//             return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Erro ao cadastrar usuário Businessperson. Email: {Email}", request.Email);
//             return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
//         }
//     }

//     // =========================================================================
//     // ENDPOINT DE LOGIN CORRIGIDO (GERA E RETORNA O TOKEN JWT LEGÍTIMO)
//     // =========================================================================
//     [HttpPost("login")]
//     public async Task<IActionResult> Login([FromBody] LoginRequest request)
//     {
//         try
//         {
//             _logger.LogInformation("Recebida tentativa de login para o email: {Email}", request.Email);

//             var users = await _service.GetAllAsync();
            
//             var usuarioValido = users.FirstOrDefault(u => 
//                 u.Email.ToLower() == request.Email.ToLower());

//             if (usuarioValido != null)
//             {
//                 _logger.LogInformation("Login efetuado com sucesso para o usuário real: {Id}", usuarioValido.Id);
                
//                 // 1. GERA O TOKEN REAL usando a instância do usuário do banco
//                 var tokenGerado = _tokenService.GenerateToken(usuarioValido);

//                 // 2. RETORNA os dados do usuário JUNTO com o accessToken verdadeiro!
//                 return Ok(new 
//                 { 
//                     Id = usuarioValido.Id, 
//                     Name = usuarioValido.Name, 
//                     Email = usuarioValido.Email,
//                     AccessToken = tokenGerado // O NextAuth e o Axios finalmente vão ler a hash real aqui!
//                 });
//             }

//             return BadRequest(new { Message = "E-mail não encontrado no banco de dados." });
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Erro interno ao processar o login.");
//             return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
//         }
//     }

//     [HttpGet]
//     public async Task<IActionResult> GetAll()
//     {
//         try
//         {
//             _logger.LogInformation("Iniciando busca de usuários.");
//             var users = await _service.GetAllAsync();
//             return Ok(users);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Erro ao buscar usuários.");
//             return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
//         }
//     }

//     [HttpGet("{id:guid}")]
//     public async Task<IActionResult> GetById(Guid id)
//     {
//         try
//         {
//             _logger.LogInformation("Buscando usuário por id. UserId: {UserId}", id);
//             var user = await _service.GetByIdAsync(id);

//             if (user is null)
//             {
//                 return NotFound(new { Message = "Usuário não encontrado." });
//             }

//             return Ok(user);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Erro ao buscar usuário por id. UserId: {UserId}", id);
//             return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
//         }
//     }

//     [HttpPut("{id:guid}")]
//     public async Task<IActionResult> Update(Guid id, [FromBody] CreateBusinesspersonRequest request)
//     {
//         try
//         {
//             await _service.UpdateAsync(id, request);
//             return NoContent();
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Erro ao atualizar usuário. UserId: {UserId}", id);
//             return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
//         }
//     }

//     [HttpGet("{userId:guid}/business")]
//     public async Task<IActionResult> GetBusinessesByUser(Guid userId, [FromQuery] PaginationRequest request)
//     {
//         try
//         {
//             var response = await _businessService.GetByUserIdAsync(userId, request);
//             return Ok(response);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Erro interno ao buscar empreendimentos do usuário. UserId: {UserId}", userId);
//             return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
//         }
//     }

    

    
// }

using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;
    private readonly IBusinessService _businessService;
    private readonly ITokenService _tokenService; // ADICIONADO: Serviço de geração de tokens
    private readonly ILogger<UserController> _logger;

    // Construtor explícito para injetar os 3 serviços necessários limpamente
    public UserController(
        IUserService service, 
        IBusinessService businessService, 
        ITokenService tokenService, 
        ILogger<UserController> logger)
    {
        _service = service;
        _businessService = businessService;
        _tokenService = tokenService;
        _logger = logger;
    }

    [HttpPost("businessperson")]
    public async Task<IActionResult> CreateBusinessperson([FromBody] CreateBusinesspersonRequest request)
    {
        try
        {
            _logger.LogInformation("Iniciando cadastro de usuário Businessperson. Email: {Email}", request.Email);

            var user = await _service.CreateBusinesspersonAsync(request);

            _logger.LogInformation("Usuário Businessperson cadastrado com sucesso. UserId: {UserId}", user.Id);

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cadastrar usuário Businessperson. Email: {Email}", request.Email);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    // =========================================================================
    // ENDPOINT DE LOGIN CORRIGIDO (GERA E RETORNA O TOKEN JWT LEGÍTIMO)
    // =========================================================================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation("Recebida tentativa de login para o email: {Email}", request.Email);

            var users = await _service.GetAllAsync();
            
            var usuarioValido = users.FirstOrDefault(u => 
                u.Email.ToLower() == request.Email.ToLower());

            if (usuarioValido != null)
            {
                _logger.LogInformation("Login efetuado com sucesso para o usuário real: {Id}", usuarioValido.Id);
                
                // 1. GERA O TOKEN REAL usando a instância do usuário do banco
                var tokenGerado = _tokenService.GenerateToken(usuarioValido);

                // 2. RETORNA os dados do usuário JUNTO com o accessToken verdadeiro!
                return Ok(new 
                { 
                    Id = usuarioValido.Id, 
                    Name = usuarioValido.Name, 
                    Email = usuarioValido.Email,
                    AccessToken = tokenGerado // O NextAuth e o Axios finalmente vão ler a hash real aqui!
                });
            }

            return BadRequest(new { Message = "E-mail não encontrado no banco de dados." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno ao processar o login.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            _logger.LogInformation("Iniciando busca de usuários.");
            var users = await _service.GetAllAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar usuários.");
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            _logger.LogInformation("Buscando usuário por id. UserId: {UserId}", id);
            var user = await _service.GetByIdAsync(id);

            if (user is null)
            {
                return NotFound(new { Message = "Usuário não encontrado." });
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar usuário por id. UserId: {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateBusinesspersonRequest request)
    {
        try
        {
            await _service.UpdateAsync(id, request);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar usuário. UserId: {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    [HttpGet("{userId:guid}/business")]
    public async Task<IActionResult> GetBusinessesByUser(Guid userId, [FromQuery] PaginationRequest request)
    {
        try
        {
            var response = await _businessService.GetByUserIdAsync(userId, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro interno ao buscar empreendimentos do usuário. UserId: {UserId}", userId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    // =========================================================================
    // NOVO ENDPOINT: ATUALIZAR E-MAIL
    // =========================================================================
    [HttpPut("{id:guid}/update-email")]
    public async Task<IActionResult> UpdateEmail(Guid id, [FromBody] UpdateEmailRequest request)
    {
        try
        {
            _logger.LogInformation("Iniciando atualização de e-mail para o usuário. UserId: {UserId}", id);
            await _service.UpdateEmailAsync(id, request.NewEmail);
            _logger.LogInformation("E-mail atualizado com sucesso. UserId: {UserId}", id);
            return Ok(new { message = "E-mail atualizado com sucesso!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar e-mail. UserId: {UserId}", id);
            if (ex.Message.Contains("já está em uso") || ex.Message.Contains("não encontrado"))
            {
                return BadRequest(new { Message = ex.Message });
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    // =========================================================================
    // NOVO ENDPOINT: ALTERAR SENHA
    // =========================================================================
    [HttpPut("{id:guid}/change-password")]
    public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordRequest request)
    {
        try
        {
            _logger.LogInformation("Iniciando alteração de senha. UserId: {UserId}", id);
            await _service.ChangePasswordAsync(id, request.CurrentPassword, request.NewPassword);
            _logger.LogInformation("Senha alterada com sucesso. UserId: {UserId}", id);
            return Ok(new { message = "Senha alterada com sucesso!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao alterar senha. UserId: {UserId}", id);
            // Se a senha atual estiver errada, retorna 400 (BadRequest) para o frontend mostrar o erro
            if (ex.Message.Contains("incorreta") || ex.Message.Contains("não encontrado"))
            {
                return BadRequest(new { Message = ex.Message });
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }

    // =========================================================================
    // NOVO ENDPOINT: DELETAR CONTA (SOFT DELETE)
    // =========================================================================
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            _logger.LogInformation("Iniciando exclusão de conta. UserId: {UserId}", id);
            await _service.DeleteAsync(id);
            _logger.LogInformation("Conta excluída (inativada) com sucesso. UserId: {UserId}", id);
            return Ok(new { message = "Conta excluída com sucesso." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao excluir conta. UserId: {UserId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Erro interno do servidor." });
        }
    }
}

// =========================================================================
// DTOS PARA AS REQUISIÇÕES
// =========================================================================
public class UpdateEmailRequest
{
    public string NewEmail { get; set; } = string.Empty;
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}