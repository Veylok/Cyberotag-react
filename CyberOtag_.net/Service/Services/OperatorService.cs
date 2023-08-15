using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;
using Microsoft.EntityFrameworkCore;
namespace DbAccess.Services
{
    public class OperatorService
    {
        private readonly TaslakContext _context;

        public OperatorService(TaslakContext context)
        {
            _context = context;
        }

        public void Ekle(Operator operatorToAdd)
        {
            _context.Operators.Add(operatorToAdd);
            _context.SaveChanges();
        }

        public void Sil(int operatorId)
        {
            Operator operatorToDelete = _context.Operators.Find(operatorId);
            if (operatorToDelete != null)
            {
                _context.Operators.Remove(operatorToDelete);
                _context.SaveChanges();
            }
        }

        public void Guncelle(Operator updatedOperator)
        {
            Operator operatorToUpdate = _context.Operators.Find(updatedOperator.Operatorid);
            if (operatorToUpdate != null)
            {
                operatorToUpdate.Operatorname = updatedOperator.Operatorname;
                operatorToUpdate.Operatorsurname = updatedOperator.Operatorsurname;
                operatorToUpdate.Operatorphonenumber = updatedOperator.Operatorphonenumber;
                _context.SaveChanges();
            }
        }

        public Operator Getir(int operatorId)
        {
            return _context.Operators.Find(operatorId);
        }

        public List<Operator> TumOperatorleriGetir()
        {
            return _context.Operators.ToList();
        }
    }
}
