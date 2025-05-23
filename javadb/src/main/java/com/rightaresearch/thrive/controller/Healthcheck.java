package com.rightaresearch.thrive.controller;

import com.rightaresearch.thrive.service.util.ResponseUtility;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;


@RestController
@SecurityRequirement(name = "usermgmt")
@RequestMapping("/")
@SecurityRequirement(name = "Authorization")
@AllArgsConstructor
public class Healthcheck {


    @GetMapping("/")
    @Operation(summary = "Health Check")
    @ApiResponse(responseCode = "200", description ="Health Check ")
    public ResponseEntity<String> HealthCheck() {


        String tdata = "OK";
        return ResponseUtility.buildOkResponse(tdata);


    }


}
