package gov.uscis.rapidum.controller;

import gov.uscis.rapidum.formbasicapi.ResponseUtility;
import gov.uscis.rapidum.reqresponse.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "usermgmt")
@RequestMapping("/rapid")
@SecurityRequirement(name = "Authorization")
@AllArgsConstructor
public class ControllerUserMgmt {

    @PutMapping("/request/newuser")
    @Operation(summary = "Create New User")
    @ApiResponse(responseCode = "200", description ="Create New User ")
    public ResponseEntity<SubmissionResponse> CreateNewUser (@RequestBody NewUserData data) {

        SubmissionResponse tdata = new SubmissionResponse();
        return ResponseUtility.buildOkResponse(tdata);

    }

    @PutMapping("/change/password/{username}")
    @Operation(summary = "Change Password")
    @ApiResponse(responseCode = "200", description ="Change Password ")
    public ResponseEntity<SubmissionResponse> ChangePassword  (@PathVariable String username, @RequestBody ChangePasswordRequest data) {

        SubmissionResponse tdata = new SubmissionResponse();
        return ResponseUtility.buildOkResponse(tdata);

    }

    @DeleteMapping("/delete/user/{username}")
    @Operation(summary = "Delete User")
    @ApiResponse(responseCode = "200", description ="Delete User ")
    public ResponseEntity<SubmissionResponse> DeleteUser  (@PathVariable String username) {

        SubmissionResponse tdata = new SubmissionResponse();
        return ResponseUtility.buildOkResponse(tdata);

    }

    @GetMapping("/list/users")
    @Operation(summary = "List Users")
    @ApiResponse(responseCode = "200", description ="List Users ")
    public ResponseEntity<UserList> ListUsers() {

        UserList tdata = new UserList();
        return ResponseUtility.buildOkResponse(tdata);

    }

    @PutMapping("/send/message")
    @Operation(summary = "Send Message")
    @ApiResponse(responseCode = "200", description ="Send Message ")
    public ResponseEntity<SubmissionResponse> SendMessage  (@RequestBody SendMessageDoc data) {

        SubmissionResponse tdata = new SubmissionResponse();
        return ResponseUtility.buildOkResponse(tdata);

    }

    @GetMapping("/report/data")
    @Operation(summary = "Report Data")
    @ApiResponse(responseCode = "200", description ="Report Data ")
    public ResponseEntity<ReportData> ReportData() {

        ReportData tdata = new ReportData();
        return ResponseUtility.buildOkResponse(tdata);

    }

}

