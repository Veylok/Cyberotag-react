using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class SpendingtypeService
    {
        private readonly TaslakContext _dbContext;

        public SpendingtypeService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Spendingtype> GetAllSpendingtypes()
        {
            return _dbContext.Spendingtypes.ToList();
        }

        public Spendingtype GetSpendingtypeById(int spendingtypeId)
        {
            return _dbContext.Spendingtypes.FirstOrDefault(s => s.Spendingtypeid == spendingtypeId);
        }

        public void AddSpendingtype(Spendingtype spendingtype)
        {
            _dbContext.Spendingtypes.Add(spendingtype);
            _dbContext.SaveChanges();
        }

        public void UpdateSpendingtype(Spendingtype updatedSpendingtype)
        {
            var existingSpendingtype = _dbContext.Spendingtypes.FirstOrDefault(s => s.Spendingtypeid == updatedSpendingtype.Spendingtypeid);
            if (existingSpendingtype != null)
            {
                existingSpendingtype.Spendingtypename = updatedSpendingtype.Spendingtypename;
                
                _dbContext.SaveChanges();
            }
        }

        public void DeleteSpendingtype(int spendingtypeId)
        {
            var spendingtypeToDelete = _dbContext.Spendingtypes.FirstOrDefault(s => s.Spendingtypeid == spendingtypeId);
            if (spendingtypeToDelete != null)
            {
                _dbContext.Spendingtypes.Remove(spendingtypeToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
