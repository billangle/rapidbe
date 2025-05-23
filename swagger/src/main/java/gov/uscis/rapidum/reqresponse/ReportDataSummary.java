package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

/*
 * 		"UniqueCityStateDate": 6,
		"TotalRequests": 14
 */

public class ReportDataSummary {

    @JsonProperty("UniqueCityStateDate")
    @Schema(name="UniqueCityStateDate", required= true, example="6")
    String uniqueCityStateDate;

    @JsonProperty("TotalRequests")
    @Schema(name="TotalRequests", required= true, example="14")
    int totalRequests;
    


}
