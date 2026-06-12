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
            .Include(x => x.Photos) // 👈 ADICIONADO: Traz as fotos da galeria
            .OrderBy(x => x.Name)
            .ToListAsync();
    }

    public async Task<Business?> GetByIdAsync(Guid id)
    {
        return await _context.Businesses
            .Include(x => x.User)
            .Include(x => x.Photos) // 👈 ADICIONADO: Traz as fotos da galeria para o Perfil Público
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<(List<Business> Items, int TotalItems)> SearchAsync(SearchBusinessRequest request)
    {
        var query = _context.Businesses
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.Photos) // 👈 ADICIONADO: Traz as fotos da galeria na busca
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.Trim().ToLower();
            query = query.Where(x => x.Name.ToLower().Contains(search) || x.Address.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(request.Categoria))
        {
            if (Enum.TryParse<BusinessServiceTypeEnum>(request.Categoria, true, out var enumCategoria))
            {
                query = query.Where(x => x.ServiceType == enumCategoria);
            }
        }

        if (!string.IsNullOrWhiteSpace(request.Localizacao))
        {
            query = query.Where(x => x.Address.ToLower().Contains(request.Localizacao.ToLower()));
        }

        if (request.Cartao == true) query = query.Where(x => x.Cartao == true);
        if (request.Chuveiro == true) query = query.Where(x => x.Chuveiro == true);
        if (request.Estacionamento == true) query = query.Where(x => x.Estacionamento == true);
        if (request.Cadeira == true) query = query.Where(x => x.Cadeira == true);
        if (request.PetFriendly == true) query = query.Where(x => x.PetFriendly == true);
        if (request.Acessibilidade == true) query = query.Where(x => x.Acessibilidade == true);

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
            .Include(x => x.Photos) // 👈 ADICIONADO: Traz as fotos na listagem do Dono
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
        _context.Businesses.Update(business);
        await _context.SaveChangesAsync();
    }
}