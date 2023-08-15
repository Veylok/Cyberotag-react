using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;
using Microsoft.EntityFrameworkCore;

namespace DbAccess.Services
{
    public class GraphicsetService
    {
        private readonly TaslakContext _dbContext;

        public GraphicsetService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

      
        public List<Graphicset> GetAllGraphicsetsWithBranchNames()
        {
            return _dbContext.Graphicsets.Include(g => g.Branch).ToList();
        }
        public List<Graphicset> GetAllGraphicset()
        {
            return _dbContext.Graphicsets.ToList();
        }
        public List<Graphicset> GetGraphicsetsByBranchId(int branchId)
        {
            return _dbContext.Graphicsets.Where(g => g.Branchid == branchId).ToList();
        }

        public Graphicset GetGraphicsetById(int graphicsetId)
        {
            return _dbContext.Graphicsets.Include(g => g.Branch).FirstOrDefault(g => g.Graphicsetid == graphicsetId);
        }

        public void AddGraphicset(Graphicset graphicsetToAdd)
        {
            _dbContext.Graphicsets.Add(graphicsetToAdd);
            _dbContext.SaveChanges();
        }

        public void UpdateGraphicset(Graphicset updatedGraphicset)
        {
            _dbContext.Graphicsets.Update(updatedGraphicset);
            _dbContext.SaveChanges();
        }

        public void DeleteGraphicset(int graphicsetId)
        {
            var graphicsetToDelete = _dbContext.Graphicsets.Find(graphicsetId);
            if (graphicsetToDelete != null)
            {
                _dbContext.Graphicsets.Remove(graphicsetToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
