Feature: Login in Okta

  Scenario: Successful login
    Given I use "Chrome"
    When I navigate to "https://trial-2921931.okta.com/"
    And I get an MFA code from "https://oktaqa.reirapid.net/" for "new.usertest@reirapid.net"
    And I log in with the MFA and password ""
    And I click Submit
    Then I should see the message "reisystems-trial-2921931"

