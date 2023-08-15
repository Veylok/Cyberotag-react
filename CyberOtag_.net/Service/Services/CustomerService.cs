using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class CustomerService
    {
        private readonly TaslakContext _dbContext;

        public CustomerService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Customer> GetAllCustomers()
        {
            return _dbContext.Customers.ToList();
        }

        public Customer GetCustomerById(int customerId)
        {
            return _dbContext.Customers.FirstOrDefault(c => c.Customerid == customerId);
        }

        public void AddCustomer(Customer customer)
        {
            _dbContext.Customers.Add(customer);
            _dbContext.SaveChanges();
        }

        public void UpdateCustomer(Customer updatedCustomer)
        {
            var existingCustomer = _dbContext.Customers.FirstOrDefault(c => c.Customerid == updatedCustomer.Customerid);
            if (existingCustomer != null)
            {
                existingCustomer.Customername = updatedCustomer.Customername;
                
                _dbContext.SaveChanges();
            }
        }

        public void DeleteCustomer(int customerId)
        {
            var customerToDelete = _dbContext.Customers.FirstOrDefault(c => c.Customerid == customerId);
            if (customerToDelete != null)
            {
                _dbContext.Customers.Remove(customerToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
