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
}