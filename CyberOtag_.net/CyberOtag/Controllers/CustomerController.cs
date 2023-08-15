﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using DbAccess.DBModels;
using DbAccess.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public IActionResult GetAllCustomers()
        {
            List<Customer> allCustomers = _customerService.GetAllCustomers();
            return Ok(allCustomers);
        }

        [HttpGet("{customerId}")]
        public IActionResult GetCustomerById(int customerId)
        {
            Customer customerData = _customerService.GetCustomerById(customerId);
            if (customerData == null)
            {
                return NotFound();
            }
            return Ok(customerData);
        }

        [HttpPost]
        public IActionResult AddCustomer([FromBody] Customer customerToAdd)
        {
            _customerService.AddCustomer(customerToAdd);
            return Ok();
        }

        [HttpPut("{customerId}")]
        public IActionResult UpdateCustomer(int customerId, [FromBody] Customer updatedCustomer)
        {
            if (_customerService.GetCustomerById(customerId) == null)
            {
                return NotFound();
            }
            updatedCustomer.Customerid = customerId;
            _customerService.UpdateCustomer(updatedCustomer);
            return Ok();
        }

        [HttpDelete("{customerId}")]
        public IActionResult DeleteCustomer(int customerId)
        {
            if (_customerService.GetCustomerById(customerId) == null)
            {
                return NotFound();
            }
            _customerService.DeleteCustomer(customerId);
            return Ok();
        }
    }
}
