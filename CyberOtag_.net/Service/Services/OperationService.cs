using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class OperationService
    {
        private readonly TaslakContext _dbContext;

        public OperationService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Operation> GetAllOperations()
        {
            return _dbContext.Operations.ToList();
        }

        public Operation GetOperationById(int operationId)
        {
            return _dbContext.Operations.FirstOrDefault(o => o.Operationid == operationId);
        }

        public void AddOperation(Operation operation)
        {
            _dbContext.Operations.Add(operation);
            _dbContext.SaveChanges();
        }

        public void UpdateOperation(Operation updatedOperation)
        {
            var existingOperation = _dbContext.Operations.FirstOrDefault(o => o.Operationid == updatedOperation.Operationid);
            if (existingOperation != null)
            {
                existingOperation.Date = updatedOperation.Date;
                existingOperation.Startingtime = updatedOperation.Startingtime;
                existingOperation.Endingtime = updatedOperation.Endingtime;
                existingOperation.Branchid = updatedOperation.Branchid;
                existingOperation.Cityid = updatedOperation.Cityid;
                existingOperation.Customerid = updatedOperation.Customerid;
                existingOperation.Channelid = updatedOperation.Channelid;
                existingOperation.Directorid = updatedOperation.Directorid;
                existingOperation.Graphicsetid = updatedOperation.Graphicsetid;
                existingOperation.Facilityid = updatedOperation.Facilityid;
                
                _dbContext.SaveChanges();
            }
        }

        public void DeleteOperation(int operationId)
        {
            var operationToDelete = _dbContext.Operations.FirstOrDefault(o => o.Operationid == operationId);
            if (operationToDelete != null)
            {
                _dbContext.Operations.Remove(operationToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
