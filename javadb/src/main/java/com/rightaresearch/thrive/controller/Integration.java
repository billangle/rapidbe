package com.rightaresearch.thrive.controller;


import com.rightaresearch.thrive.api.SiteDetails;
import com.rightaresearch.thrive.api.SiteIntegration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;


import javax.validation.Valid;
import java.util.Collection;

@RequestMapping(value = "/properties/integration")
//@Tag(name = "Integration Controller")
public interface Integration {

    @PostMapping("/site/{id}")
    @Operation(summary = "New Site")
    @ApiResponse(responseCode = "200", description ="Create new site")
    ResponseEntity<SiteIntegration> importNewSite(@PathVariable String id,
                                                  @Valid @RequestBody SiteDetails newSiteDetails)
            throws Exception;


    @DeleteMapping("/site/{id}/index/{index}")
    @Operation(summary = "Delete Site")
    @ApiResponse(responseCode = "200", description ="Delete a site by index")
    ResponseEntity<SiteIntegration> deleteSite(@PathVariable String id, @PathVariable int index)
            throws Exception;

    @GetMapping("/site/{id}")
    @Operation(summary = "Get Site")
    @ApiResponse(responseCode = "200", description ="Get site by index")
    ResponseEntity<Collection<SiteIntegration>> getSite(@PathVariable String id)
            throws Exception;
}
