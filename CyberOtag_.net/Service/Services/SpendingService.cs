using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class SpendingService
    {
        private readonly TaslakContext _dbContext;

        public SpendingService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Spending> GetAllSpendings()
        {
            return _dbContext.Spendings.ToList();
        }

        public Spending GetSpendingById(int spendingId)
        {
            return _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == spendingId);
        }

        public void AddSpending(Spending spending)
        {
            _dbContext.Spendings.Add(spending);
            _dbContext.SaveChanges();
        }

        public void UpdateSpending(Spending updatedSpending)
        {
            var existingSpending = _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == updatedSpending.Spendingid);
            if (existingSpending != null)
            {
                existingSpending.Operationid = updatedSpending.Operationid;
                existingSpending.Spendingtypeid = updatedSpending.Spendingtypeid;
                existingSpending.Spendingamount = updatedSpending.Spendingamount;
                existingSpending.Spendingdate = updatedSpending.Spendingdate;
                existingSpending.Operatorid = updatedSpending.Operatorid;
               
                _dbContext.SaveChanges();
            }
        }

        public void DeleteSpending(int spendingId)
        {
            var spendingToDelete = _dbContext.Spendings.FirstOrDefault(s => s.Spendingid == spendingId);
            if (spendingToDelete != null)
            {
                _dbContext.Spendings.Remove(spendingToDelete);
                _dbContext.SaveChanges();
            }
        }
       
      
    }
}
