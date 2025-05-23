package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public class UserAttribUser {

    @JsonProperty("Name")
    @Schema(name="Name", required= true, example="email")
    String name;

    @JsonProperty("Value")
    @Schema(name="Value", required= true, example="some@any.net")
    String value;
}
