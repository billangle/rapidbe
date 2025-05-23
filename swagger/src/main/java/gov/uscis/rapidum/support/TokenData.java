package gov.uscis.rapidum.support;

import com.fasterxml.jackson.annotation.JsonProperty;


public class TokenData {

    @JsonProperty("username")
    String username;

    @JsonProperty("token")
    String token;

}
