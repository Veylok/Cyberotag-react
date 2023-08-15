using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class BranchService
    {
        private readonly TaslakContext _dbContext;

        public BranchService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Branch> GetAllBranches()
        {
            return _dbContext.Branches.ToList();
        }

        public Branch GetBranchById(int branchId)
        {
            return _dbContext.Branches.FirstOrDefault(b => b.Branchid == branchId);
        }

        public void AddBranch(Branch branch)
        {
            _dbContext.Branches.Add(branch);
            _dbContext.SaveChanges();
        }

        public void UpdateBranch(Branch updatedBranch)
        {
            var existingBranch = _dbContext.Branches.FirstOrDefault(b => b.Branchid == updatedBranch.Branchid);
            if (existingBranch != null)
            {
                existingBranch.Branchname = updatedBranch.Branchname;
                
                _dbContext.SaveChanges();
            }
        }

        public void DeleteBranch(int branchId)
        {
            var branchToDelete = _dbContext.Branches.FirstOrDefault(b => b.Branchid == branchId);
            if (branchToDelete != null)
            {
                _dbContext.Branches.Remove(branchToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
