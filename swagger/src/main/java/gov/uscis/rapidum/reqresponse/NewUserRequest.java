package gov.uscis.rapidum.reqresponse;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

/*
{
        "username": username,
        "password": "Passw0rd123qwery!",
        "email": "william.beckett+rapidtest@reisystems.com",
        "firstName": "William",
        "lastName": "Beckett",
        "street1": "1234 Main St",
        "city": "Fairfax",
        "state": "VA",
        "zip": "22033",
        "phone": "123-456-7890",
        "confirmEmail": "william.beckett+rapidtest@reisystems.com",
        "apt": "111D",
        "middlename": "Middle",
        "prefix": "Mr.",
        "suffix": "Jr.",
        "challengeQuestion": "What is your favorite color?",
        "challengeAnswer": "Blue"    }
 */
public class NewUserRequest {
    @JsonProperty("username")
    @Schema(name="username", required= true, example="user.name")
    String username;
    @JsonProperty("password")
    @Schema(name="password", required= true, example="S0mepassword123!")
    String password;
    @JsonProperty("email")
    @Schema(name="email", required= true, example="some@any.com")
    String email;
    @JsonProperty("firstName")
    @Schema(name="firstName", required= true, example="John")
    String firstName;
    @JsonProperty("lastName")
    @Schema(name="lastName", required= true, example="Doe")
    String lastName;
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
    @JsonProperty("phone")
    @Schema(name="phone", required= true, example="123-456-7890")
    String phone;
    @JsonProperty("confirmEmail")
    @Schema(name="confirmEmail", required= true, example="some@any.com")
    String confirmEmail;

    @JsonProperty("middlename")
    @Schema(name="middlename", required= false, example="Middle")
    String middlename;
    @JsonProperty("prefix")
    @Schema(name="prefix", required= false, example="Mr.")
    String prefix;
    @JsonProperty("suffix")
    @Schema(name="suffix", required= false, example="Jr.")
    String suffix;
    @JsonProperty("challengeQuestion")
    @Schema(name="challengeQuestion", required= false, example="What is your favorite color?")
    String challengeQuestion;
    @JsonProperty("challengeAnswer")
    @Schema(name="challengeAnswer", required= false, example="Blue")
    String challengeAnswer;

    @JsonProperty("apt")
    @Schema(name="apt", required= false, example="111D")
    String apt;


}
