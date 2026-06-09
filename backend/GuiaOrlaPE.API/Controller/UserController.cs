// using GuiaOrlaPE.API.Models.Requests;
// using GuiaOrlaPE.API.Service.Interfaces;
// using Microsoft.AspNetCore.Mvc;

// namespace GuiaOrlaPE.API.Controller;

// [ApiController]
// [Route("api/users")]
// public class UserController(IUserService service, ILogger<UserController> logger, IBusinessService businessService) : ControllerBase
// {
//     private readonly IUserService _service = service;
//     private readonly IBusinessService _businessService = businessService;

//     private readonly ILogger<UserController> _logger = logger;

//     [HttpPost("businessperson")]
//     public async Task<IActionResult> CreateBusinessperson(
//         [FromBody] CreateBusinesspersonRequest request)
//     {
//         try
//         {
//             _logger.LogInformation(
//                 "Iniciando cadastro de usuário Businessperson. Email: {Email}",
//                 request.Email);

//             var user = await _service.CreateBusinesspersonAsync(request);

//             _logger.LogInformation(
//                 "Usuário Businessperson cadastrado com sucesso. UserId: {UserId}",
//                 user.Id);

//             return CreatedAtAction(
//                 nameof(GetById),
//                 new { id = user.Id },
//                 user);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(
//                 ex,
//                 "Erro ao cadastrar usuário Businessperson. Email: {Email}",
//                 request.Email);

//             return StatusCode(
//                 StatusCodes.Status500InternalServerError,
//                 new
//                 {
//                     Message = "Erro interno do servidor."
//                 });
//         }
//     }

//     [HttpGet]
//     public async Task<IActionResult> GetAll()
//     {
//         try
//         {
//             _logger.LogInformation(
//                 "Iniciando busca de usuários.");

//             var users = await _service.GetAllAsync();

//             _logger.LogInformation(
//                 "Busca de usuários realizada com sucesso. Quantidade: {Count}",
//                 users.Count);

//             return Ok(users);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(
//                 ex,
//                 "Erro ao buscar usuários.");

//             return StatusCode(
//                 StatusCodes.Status500InternalServerError,
//                 new
//                 {
//                     Message = "Erro interno do servidor."
//                 });
//         }
//     }

//     [HttpGet("{id:guid}")]
//     public async Task<IActionResult> GetById(Guid id)
//     {
//         try
//         {
//             _logger.LogInformation(
//                 "Buscando usuário por id. UserId: {UserId}",
//                 id);

//             var user = await _service.GetByIdAsync(id);

//             if (user is null)
//             {
//                 _logger.LogWarning(
//                     "Usuário não encontrado. UserId: {UserId}",
//                     id);

//                 return NotFound(new
//                 {
//                     Message = "Usuário não encontrado."
//                 });
//             }

//             _logger.LogInformation(
//                 "Usuário encontrado com sucesso. UserId: {UserId}",
//                 id);

//             return Ok(user);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(
//                 ex,
//                 "Erro ao buscar usuário por id. UserId: {UserId}",
//                 id);

//             return StatusCode(
//                 StatusCodes.Status500InternalServerError,
//                 new
//                 {
//                     Message = "Erro interno do servidor."
//                 });
//         }
//     }

//     [HttpPut("{id:guid}")]
//     public async Task<IActionResult> Update(
//         Guid id,
//         [FromBody] CreateBusinesspersonRequest request)
//     {
//         try
//         {
//             _logger.LogInformation(
//                 "Iniciando atualização de usuário. UserId: {UserId}",
//                 id);

//             await _service.UpdateAsync(id, request);

//             _logger.LogInformation(
//                 "Usuário atualizado com sucesso. UserId: {UserId}",
//                 id);

//             return NoContent();
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(
//                 ex,
//                 "Erro ao atualizar usuário. UserId: {UserId}",
//                 id);

//             return StatusCode(
//                 StatusCodes.Status500InternalServerError,
//                 new
//                 {
//                     Message = "Erro interno do servidor."
//                 });
//         }
//     }

//     [HttpGet("{userId:guid}/business")]
//     public async Task<IActionResult> GetBusinessesByUser(Guid userId, [FromQuery] PaginationRequest request)
//     {
//         try
//         {
//             _logger.LogInformation(
//                 "Recebida requisição de busca de empreendimentos do usuário. UserId: {UserId}",
//                 userId);

//             var response =
//                 await _businessService.GetByUserIdAsync(
//                     userId,
//                     request);

//             return Ok(response);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(
//                 ex,
//                 "Erro interno ao buscar empreendimentos do usuário. UserId: {UserId}",
//                 userId);

//             return StatusCode(
//                 StatusCodes.Status500InternalServerError,
//                 new
//                 {
//                     Message = "Erro interno do servidor."
//                 });
//         }
//     }
// }

using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GuiaOrlaPE.API.Controller;

[ApiController]
[Route("api/users")]
public class UserController(IUserService service, ILogger<UserController> logger, IBusinessService businessService) : ControllerBase
{
    private readonly IUserService _service = service;
    private readonly IBusinessService _businessService = businessService;

    private readonly ILogger<UserController> _logger = logger;

    [HttpPost("businessperson")]
    public async Task<IActionResult> CreateBusinessperson(
        [FromBody] CreateBusinesspersonRequest request)
    {
        try
        {
            _logger.LogInformation(
                "Iniciando cadastro de usuário Businessperson. Email: {Email}",
                request.Email);

            var user = await _service.CreateBusinesspersonAsync(request);

            _logger.LogInformation(
                "Usuário Businessperson cadastrado com sucesso. UserId: {UserId}",
                user.Id);

            return CreatedAtAction(
                nameof(GetById),
                new { id = user.Id },
                user);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro ao cadastrar usuário Businessperson. Email: {Email}",
                request.Email);

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new { Message = "Erro interno do servidor." });
        }
    }

    // =========================================================================
    // ENDPOINT DE LOGIN REAL AJUSTADO (BUSCA DIRETO NO BANCO DE DADOS PELO EMAIL)
    // =========================================================================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation("Recebida tentativa de login para o email: {Email}", request.Email);

            // 1. Busca a lista de usuários reais direto do banco de dados através do service
            var users = await _service.GetAllAsync();
            
            // 2. Filtra na lista se o email digitado existe de fato no banco de dados
            var usuarioValido = users.FirstOrDefault(u => 
                u.Email.ToLower() == request.Email.ToLower());

            if (usuarioValido != null)
            {
                _logger.LogInformation("Login efetuado com sucesso para o usuário real: {Id}", usuarioValido.Id);
                
                // Retorna os dados que o seu NextAuth precisa para criar a sessão do usuário logado
                return Ok(new 
                { 
                    Id = usuarioValido.Id, 
                    Name = usuarioValido.Name, 
                    Email = usuarioValido.Email 
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
}