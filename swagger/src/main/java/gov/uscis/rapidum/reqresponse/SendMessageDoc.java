package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

public class SendMessageDoc {



    @JsonProperty("companyName")
    @Schema(name="companyName", required= true, example="Any Company")
    String companyName;
    @JsonProperty("salary")
    @Schema(name="salary", required= true, example="100k")
    String salary;
    @JsonProperty("title")
    @Schema(name="title", required= true, example="Chief")
    String title;
    @JsonProperty("SSN")
    @Schema(name="SSN", required= true, example="****")
    String SSN;
    
    
    @JsonProperty("street1")
    @Schema(name="street1", required= true, example="1234 Main St")
    String street1;
    @JsonProperty("city")
    @Schema(name="city", required= true, example="Fairfax")
    String city;
    @JsonProperty("state")
    @Schema(name="state", required= true, example="VA")
    String state;
    @JsonProperty("zip")
    @Schema(name="zip", required= true, example="22033")
    String zip;

}
