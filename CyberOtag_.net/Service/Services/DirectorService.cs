using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class DirectorService
    {
        private readonly TaslakContext _dbContext;

        public DirectorService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Director> GetAllDirectors()
        {
            return _dbContext.Directors.ToList();
        }

        public Director GetDirectorById(int directorId)
        {
            return _dbContext.Directors.FirstOrDefault(d => d.Directorid == directorId);
        }

        public void AddDirector(Director director)
        {
            _dbContext.Directors.Add(director);
            _dbContext.SaveChanges();
        }

        public void UpdateDirector(Director updatedDirector)
        {
            var existingDirector = _dbContext.Directors.FirstOrDefault(d => d.Directorid == updatedDirector.Directorid);
            if (existingDirector != null)
            {
                existingDirector.Directorname = updatedDirector.Directorname;
                existingDirector.Directorsurname = updatedDirector.Directorsurname;
               
                _dbContext.SaveChanges();
            }
        }

        public void DeleteDirector(int directorId)
        {
            var directorToDelete = _dbContext.Directors.FirstOrDefault(d => d.Directorid == directorId);
            if (directorToDelete != null)
            {
                _dbContext.Directors.Remove(directorToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
