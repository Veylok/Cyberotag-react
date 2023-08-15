// FacilityService.cs
using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;
using Microsoft.EntityFrameworkCore;

namespace DbAccess.Services
{
    public class FacilityService
    {
        private readonly TaslakContext _dbContext;

        public FacilityService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Facility> GetAllFacilities()
        {
            return _dbContext.Facilities.ToList();
        }

        public List<Facility> GetAllFacilitiesWithCityNames()
        {
            return _dbContext.Facilities.Include(f => f.City).ToList();
        }

        public Facility GetFacilityById(int facilityId)
        {
            return _dbContext.Facilities.FirstOrDefault(f => f.Facilityid == facilityId);
        }

        public void AddFacility(Facility facility)
        {
            _dbContext.Facilities.Add(facility);
            _dbContext.SaveChanges();
        }

        public void UpdateFacility(Facility updatedFacility)
        {
            var existingFacility = _dbContext.Facilities.FirstOrDefault(f => f.Facilityid == updatedFacility.Facilityid);
            if (existingFacility != null)
            {
                existingFacility.Facilityname = updatedFacility.Facilityname;
                existingFacility.Cityid = updatedFacility.Cityid;
                
                _dbContext.SaveChanges();
            }
        }

        public void DeleteFacility(int facilityId)
        {
            var facilityToDelete = _dbContext.Facilities.FirstOrDefault(f => f.Facilityid == facilityId);
            if (facilityToDelete != null)
            {
                _dbContext.Facilities.Remove(facilityToDelete);
                _dbContext.SaveChanges();
            }
        }

        public List<Facility> GetFacilitiesByCity(int cityId)
        {
            return _dbContext.Facilities.Where(f => f.Cityid == cityId).ToList();
        }

    }
}
