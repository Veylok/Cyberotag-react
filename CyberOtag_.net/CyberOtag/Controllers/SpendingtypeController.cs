﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using DbAccess.DBModels;
using DbAccess.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpendingtypeController : ControllerBase
    {
        private readonly SpendingtypeService _spendingtypeService;

        public SpendingtypeController(SpendingtypeService spendingtypeService)
        {
            _spendingtypeService = spendingtypeService;
        }

        [HttpGet]
        public IActionResult GetAllSpendingtypes()
        {
            List<Spendingtype> allSpendingtypes = _spendingtypeService.GetAllSpendingtypes();
            return Ok(allSpendingtypes);
        }

        [HttpGet("{spendingtypeId}")]
        public IActionResult GetSpendingtypeById(int spendingtypeId)
        {
            Spendingtype spendingtypeData = _spendingtypeService.GetSpendingtypeById(spendingtypeId);
            if (spendingtypeData == null)
            {
                return NotFound();
            }
            return Ok(spendingtypeData);
        }

        [HttpPost]
        public IActionResult AddSpendingtype([FromBody] Spendingtype spendingtypeToAdd)
        {
            _spendingtypeService.AddSpendingtype(spendingtypeToAdd);
            return Ok();
        }

        [HttpPut("{spendingtypeId}")]
        public IActionResult UpdateSpendingtype(int spendingtypeId, [FromBody] Spendingtype updatedSpendingtype)
        {
            if (_spendingtypeService.GetSpendingtypeById(spendingtypeId) == null)
            {
                return NotFound();
            }
            updatedSpendingtype.Spendingtypeid = spendingtypeId;
            _spendingtypeService.UpdateSpendingtype(updatedSpendingtype);
            return Ok();
        }

        [HttpDelete("{spendingtypeId}")]
        public IActionResult DeleteSpendingtype(int spendingtypeId)
        {
            if (_spendingtypeService.GetSpendingtypeById(spendingtypeId) == null)
            {
                return NotFound();
            }
            _spendingtypeService.DeleteSpendingtype(spendingtypeId);
            return Ok();
        }
    }
}
