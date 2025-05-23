package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class UserList {


    @JsonProperty("users")
    ArrayList<Users> users;

}
