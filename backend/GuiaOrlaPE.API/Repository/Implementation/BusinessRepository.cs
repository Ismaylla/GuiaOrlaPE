using GuiaOrlaPE.API.Domain.Entities;
using GuiaOrlaPE.API.Domain.Enum;
using GuiaOrlaPE.API.Models.Requests;
using GuiaOrlaPE.API.Repository.Intefaces;
using Microsoft.EntityFrameworkCore;

namespace GuiaOrlaPE.API.Repository.Implementation;

public class BusinessRepository : IBusinessRepository
{
    private readonly AppDbContext _context;

    public BusinessRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Business business)
    {
        await _context.Businesses.AddAsync(business);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Business>> GetAllAsync()
    {
        return await _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.Photos)
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Business?> GetByIdAsync(Guid id)
    {
        return await _context.Businesses
            .Include(x => x.User)
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<(List<Business> Items, int TotalItems)> SearchAsync(SearchBusinessRequest request)
    {
        var query = _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.Photos)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(search) || x.Address.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.Categoria))
        {
            // Tenta converter para int primeiro, pois o seu enum é numérico
            if (int.TryParse(request.Categoria, out int categoriaId))
            {
                query = query.Where(x => (int)x.ServiceType == categoriaId);
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Localizacao))
        {
            query = query.Where(x => x.Address.ToLower().Contains(request.Localizacao.ToLower()));
        }

        // Usa == true explicitamente. O compilador do C# entende isso como:
        // "Se for nulo, ignora. Se for false, ignora. Se for true, filtra."
        if (request.Cartao == true) query = query.Where(x => x.Cartao);
        if (request.Chuveiro == true) query = query.Where(x => x.Chuveiro);
        if (request.Estacionamento == true) query = query.Where(x => x.Estacionamento);
        if (request.Cadeira == true) query = query.Where(x => x.Cadeira);
        if (request.PetFriendly == true) query = query.Where(x => x.PetFriendly);
        if (request.Acessibilidade == true) query = query.Where(x => x.Acessibilidade);


        var totalItems = await query.CountAsync();

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return (Items: items, TotalItems: totalItems);
    }

    public async Task<(List<Business> Items, int TotalItems)> GetByUserIdAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.Photos)
            .Where(x => x.UserId == userId);

        var totalItems = await query.CountAsync();

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (Items: items, TotalItems: totalItems);
    }

    public async Task UpdateAsync(Business business)
    {
        // 1. Busca a entidade original diretamente rastreada pelo DbContext atual do request
        var dbBusiness = await _context.Businesses
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Id == business.Id);

        if (dbBusiness == null)
            throw new KeyNotFoundException("Estabelecimento não encontrado no repositório.");

        // 2. Sincroniza apenas os valores primitivos escalares na tabela pai (evita chamar o .Update global)
        _context.Entry(dbBusiness).CurrentValues.SetValues(business);

        // 3. ATUALIZADO: Sincronização manual e controlada das fotos da galeria
        if (business.Photos != null)
        {
            var novasUrls = business.Photos.Select(p => p.PhotoUrl).ToList();

            // Identifica o que foi removido e deleta explicitamente da tabela filha
            var fotosRemovidas = dbBusiness.Photos
                .Where(p => !novasUrls.Contains(p.PhotoUrl))
                .ToList();

            foreach (var foto in fotosRemovidas)
            {
                _context.Set<BusinessPhoto>().Remove(foto);
            }

            // Identifica o que é verdadeiramente inédito
            var urlsAtuais = dbBusiness.Photos.Select(p => p.PhotoUrl).ToList();
            var urlsParaAdicionar = novasUrls.Where(url => !urlsAtuais.Contains(url)).ToList();

            // Adiciona como novas entidades em estado limpo "Added"
            foreach (var url in urlsParaAdicionar)
            {
                dbBusiness.Photos.Add(new BusinessPhoto
                {
                    Id = Guid.NewGuid(),
                    BusinessId = dbBusiness.Id,
                    PhotoUrl = url
                });
            }
        }

        // 4. Executa a gravação cirúrgica atômica
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Business business)
    {
        // Garante que estamos apagando a entidade rastreada pelo contexto correto
        var dbBusiness = await _context.Businesses
            .Include(x => x.Photos)
            .FirstOrDefaultAsync(x => x.Id == business.Id);

        if (dbBusiness == null)
            throw new KeyNotFoundException("Estabelecimento não encontrado no repositório.");

        // Remove as fotos relacionadas primeiro (evita problemas de FK)
        if (dbBusiness.Photos != null && dbBusiness.Photos.Any())
        {
            _context.Set<BusinessPhoto>().RemoveRange(dbBusiness.Photos);
        }

        _context.Businesses.Remove(dbBusiness);
        await _context.SaveChangesAsync();
    }
}