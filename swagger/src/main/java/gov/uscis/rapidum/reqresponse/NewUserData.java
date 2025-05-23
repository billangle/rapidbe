package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public class NewUserData {

    @JsonProperty("data")
    NewUserRequest data;

}
