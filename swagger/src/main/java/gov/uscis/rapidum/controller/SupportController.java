package gov.uscis.rapidum.controller;

import gov.uscis.rapidum.formbasicapi.ResponseUtility;
import gov.uscis.rapidum.support.TokenData;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "auth")
@RequestMapping("/auth")
@AllArgsConstructor
public class SupportController {

    /**
     * Internal Login 
     */
    @GetMapping("/internal/login/{username}/{password}")
    @Operation(summary = "Get JWT TOKEN for a username and password")
    @ApiResponse(responseCode = "200", description ="JWT TOKEN ")
    public ResponseEntity<TokenData> getListOfTopics (@PathVariable String username,
                                                      @PathVariable String password) {

        TokenData tdata = new TokenData();
        return ResponseUtility.buildOkResponse(tdata);

    }



}
