using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class AssignmentService
    {
        private readonly TaslakContext _dbContext;

        public AssignmentService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Assignment> GetAllAssignments()
        {
            return _dbContext.Assignments.ToList();
        }

        public Assignment GetAssignmentById(int assignmentId)
        {
            return _dbContext.Assignments.FirstOrDefault(a => a.Assignmentid == assignmentId);
        }

        public void AddAssignment(Assignment assignment)
        {
            _dbContext.Assignments.Add(assignment);
            _dbContext.SaveChanges();
        }

        public void UpdateAssignment(Assignment updatedAssignment)
        {
            var existingAssignment = _dbContext.Assignments.FirstOrDefault(a => a.Assignmentid == updatedAssignment.Assignmentid);
            if (existingAssignment != null)
            {
                existingAssignment.Operationid = updatedAssignment.Operationid;
                existingAssignment.Operatorid = updatedAssignment.Operatorid;
                
                _dbContext.SaveChanges();
            }
        }

        public void DeleteAssignment(int assignmentId)
        {
            var assignmentToDelete = _dbContext.Assignments.FirstOrDefault(a => a.Assignmentid == assignmentId);
            if (assignmentToDelete != null)
            {
                _dbContext.Assignments.Remove(assignmentToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}

