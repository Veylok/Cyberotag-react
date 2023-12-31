﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using DbAccess.DBModels;
using DbAccess.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationController : ControllerBase
    {
        private readonly OperationService _operationService;

        public OperationController(OperationService operationService)
        {
            _operationService = operationService;
        }

        [HttpGet]
        public IActionResult GetAllOperations()
        {
            List<Operation> allOperations = _operationService.GetAllOperations();
            return Ok(allOperations);
        }

        [HttpGet("{operationId}")]
        public IActionResult GetOperationById(int operationId)
        {
            Operation operationData = _operationService.GetOperationById(operationId);
            if (operationData == null)
            {
                return NotFound();
            }
            return Ok(operationData);
        }

        [HttpPost]
        public IActionResult AddOperation([FromBody] Operation operationToAdd)
        {
            _operationService.AddOperation(operationToAdd);
            return Ok();
        }

        [HttpPut("{operationId}")]
        public IActionResult UpdateOperation(int operationId, [FromBody] Operation updatedOperation)
        {
            if (_operationService.GetOperationById(operationId) == null)
            {
                return NotFound();
            }
            updatedOperation.Operationid = operationId;
            _operationService.UpdateOperation(updatedOperation);
            return Ok();
        }

        [HttpDelete("{operationId}")]
        public IActionResult DeleteOperation(int operationId)
        {
            if (_operationService.GetOperationById(operationId) == null)
            {
                return NotFound();
            }
            _operationService.DeleteOperation(operationId);
            return Ok();
        }
    }
}
