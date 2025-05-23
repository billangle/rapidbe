package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public class ChangePasswordRequest {

    @JsonProperty("newpassword")
    @Schema(name="newpassword", required= true, example="MyNewPassW0rd!")
    String newpassword;
}
