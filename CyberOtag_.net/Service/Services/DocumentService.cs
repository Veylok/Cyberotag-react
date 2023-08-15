using System;
using System.Collections.Generic;
using System.Linq;
using DbAccess.DBModels;

namespace DbAccess.Services
{
    public class DocumentService
    {
        private readonly TaslakContext _dbContext;

        public DocumentService(TaslakContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<Document> GetAllDocuments()
        {
            return _dbContext.Documents.ToList();
        }

        public Document GetDocumentById(int documentId)
        {
            return _dbContext.Documents.FirstOrDefault(d => d.Documentid == documentId);
        }

        public void AddDocument(Document document)
        {
            _dbContext.Documents.Add(document);
            _dbContext.SaveChanges();
        }

        public void UpdateDocument(Document updatedDocument)
        {
            var existingDocument = _dbContext.Documents.FirstOrDefault(d => d.Documentid == updatedDocument.Documentid);
            if (existingDocument != null)
            {
                existingDocument.Spendingid = updatedDocument.Spendingid;
                existingDocument.Documentimg = updatedDocument.Documentimg; 
                _dbContext.SaveChanges();
            }
        }

        public void DeleteDocument(int documentId)
        {
            var documentToDelete = _dbContext.Documents.FirstOrDefault(d => d.Documentid == documentId);
            if (documentToDelete != null)
            {
                _dbContext.Documents.Remove(documentToDelete);
                _dbContext.SaveChanges();
            }
        }
    }
}
