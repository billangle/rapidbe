package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;

public class Users {

    @JsonProperty("Attributes")
    ArrayList<UserAttribUser> Attributes;

    @JsonProperty("Enabled")
    @Schema(name="Enabled  ", required= true, example="true")
    String enabledd;

    @JsonProperty("UserCreateDate")
    @Schema(name="UserCreatedDate", required= true, example="2024-11-14T16:36:48.311Z")
    String usercreateddate;

    @JsonProperty("UserLastModifiedDate")
    @Schema(name="UserLastModifiedDate", required= true, example="2024-11-14T16:36:48.541Z")
    String userclastmodifieddate;

    @JsonProperty("UserStatus")
    @Schema(name="UserStatus", required= true, example="CONFIRMED")
    String userstatus;

    @JsonProperty("Username")
    @Schema(name="Username", required= true, example="user.user")
    String username;

}
