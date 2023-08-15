using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class CityService
    {
        private readonly TaslakContext _dbContext;

        public CityService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<City> GetAllCities()
        {
            return _dbContext.Cities.ToList();
        }

        public City GetCityById(int cityId)
        {
            return _dbContext.Cities.FirstOrDefault(c => c.Cityid == cityId);
        }

        public void AddCity(City city)
        {
            _dbContext.Cities.Add(city);
            _dbContext.SaveChanges();
        }

        public void UpdateCity(City updatedCity)
        {
            var existingCity = _dbContext.Cities.FirstOrDefault(c => c.Cityid == updatedCity.Cityid);
            if (existingCity != null)
            {
                existingCity.Cityname = updatedCity.Cityname;
               
                _dbContext.SaveChanges();
            }
        }

        public void DeleteCity(int cityId)
        {
            var cityToDelete = _dbContext.Cities.FirstOrDefault(c => c.Cityid == cityId);
            if (cityToDelete != null)
            {
                _dbContext.Cities.Remove(cityToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
