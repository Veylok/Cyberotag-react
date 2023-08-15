﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using DbAccess.DBModels;
using DbAccess.Services;

namespace CyberOtag.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchController : ControllerBase
    {
        private readonly BranchService _branchService;

        public BranchController(BranchService branchService)
        {
            _branchService = branchService;
        }

        [HttpGet]
        public IActionResult GetAllBranches()
        {
            List<Branch> allBranches = _branchService.GetAllBranches();
            return Ok(allBranches);
        }

        [HttpGet("{branchId}")]
        public IActionResult GetBranchById(int branchId)
        {
            Branch branchData = _branchService.GetBranchById(branchId);
            if (branchData == null)
            {
                return NotFound();
            }
            return Ok(branchData);
        }

        [HttpPost]
        public IActionResult AddBranch([FromBody] Branch branchToAdd)
        {
            _branchService.AddBranch(branchToAdd);
            return Ok();
        }

        [HttpPut("{branchId}")]
        public IActionResult UpdateBranch(int branchId, [FromBody] Branch updatedBranch)
        {
            if (_branchService.GetBranchById(branchId) == null)
            {
                return NotFound();
            }
            updatedBranch.Branchid = branchId;
            _branchService.UpdateBranch(updatedBranch);
            return Ok();
        }

        [HttpDelete("{branchId}")]
        public IActionResult DeleteBranch(int branchId)
        {
            if (_branchService.GetBranchById(branchId) == null)
            {
                return NotFound();
            }
            _branchService.DeleteBranch(branchId);
            return Ok();
        }
    }
}
