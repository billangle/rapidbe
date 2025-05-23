Feature: Okta Login


  @regression
  Scenario: Verify valid user credentials will allow the user to login

    Given I am on the Okta login page
    When I attempt a valid login
    Then I will be logged in