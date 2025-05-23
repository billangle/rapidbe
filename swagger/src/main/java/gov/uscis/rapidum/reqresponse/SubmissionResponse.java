package gov.uscis.rapidum.reqresponse;


//{"ReportType":"RevSelTrackingReport","Email":"william.beckett@reisystems.com","Result":"Successful Request"}

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public class SubmissionResponse {


    @JsonProperty("msg")
    @Schema(name = "msg", required = true, example = "User Action Completed")
    String msg;

}