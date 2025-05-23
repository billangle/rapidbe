
package gov.dmdc;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.Wait;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import org.openqa.selenium.JavascriptExecutor;
import static org.assertj.core.api.Assertions.assertThat;
import static org.slf4j.LoggerFactory.getLogger;
import org.slf4j.Logger;
import static java.lang.invoke.MethodHandles.lookup;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;



public class OktaLoginSteps {

    private WebDriver driver;
    static final Logger log = getLogger(lookup().lookupClass());

    String userName = "[name=\"identifier\"]"; // input for username
    String passwordBox = "[name=\"credentials.passcode\"]"; // input for MFA or password data
    String nextButton = "input.button.button-primary[value=\"Next\"]";  // next buttons
    String emailButton = "button:text(\"Send me an email\")";  // send the MFA email
    String selectEmail = "a.button.select-factor.link-button[aria-label^=\"Select Email -\"]"; // select email
    String sendMFAEmail = "input.button.button-primary[value=\"Send me an email\"]"; // send MFA email
    String buttonVerify = "input.button.button-primary[value=\"Verify\"]"; // verify value button
    String useMFALink = "button.button-link.enter-auth-code-instead-link"; // link to reveal the MFA code input box
    String verifyWithPassword = "h2[data-se=\"o-form-head\"]:has-text(\"Verify with your password\")"; // password next page
    String dashboardMyApps = "span[data-se=\"section-label\"]#section-label-no-apps:has-text(\"My Apps\")";  // validate the login next page
    String dropDownMenu = "div.dropdown-menu--button-sub.no-translate[data-se=\"dropdown-menu-button-sub\"]"; // validate the login


    String mfaCode;



  public void justWait(int waitTime) {
      JavascriptExecutor js = (JavascriptExecutor) driver;

        Duration pause = Duration.ofSeconds(waitTime);
        String script = "const callback = arguments[arguments.length - 1];"
                + "window.setTimeout(callback, " + pause.toMillis() + ");";

        long initMillis = System.currentTimeMillis();
        js.executeAsyncScript(script);
        Duration elapsed = Duration
                .ofMillis(System.currentTimeMillis() - initMillis);
        log.debug("The script took {} ms to be executed", elapsed.toMillis());
        assertThat(elapsed).isGreaterThanOrEqualTo(pause);
      
  }

    public String getMFA (String mfaUrl, String username) {
        try {
        HttpClient client = HttpClient.newHttpClient();
            
            // Create the HttpRequest
            String url = "https://oktaqa.reirapid.net/oktaqa/onlycode/" + username;
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()  // Set method to GET
                .header("Content-Type", "application/json")
                .build();
            
            // Send the request and get the response
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            log.info(response.body());
         
         return response.body();
        } catch (Exception e) {
            log.error(e.getMessage());
            return "";
        }
        
    }

    @Given("I use {string}")
    public void iUse(String browser) {
        driver = WebDriverManager.getInstance(browser).create();
    }

    @When("I navigate to {string}")
    public void iNavigateTo(String url) {
        driver.get(url);
    }

    @And("I get an MFA code from {string} for {string}")
    public void iMFA(String mfaUrl, String username) {
      
         WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
         wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(userName)));


         driver.findElement(By.cssSelector(userName)).sendKeys(username);


         wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(nextButton)));
          driver.findElement(By.cssSelector(nextButton)).click();
       
         wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(selectEmail)));
          driver.findElement(By.cssSelector(selectEmail)).click();

       
         wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(sendMFAEmail)));
           driver.findElement(By.cssSelector(sendMFAEmail)).click();
          
    
        justWait(5);  // need to wait for the email to be processed
      

        mfaCode = getMFA(mfaUrl, username);
        log.info(mfaCode);
      


    }

    @And("I log in with the MFA and password {string}")
    public void iLogin( String password) {

        log.info("user password; "+ password);

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
         driver.findElement(By.cssSelector(useMFALink)).click();
         wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(passwordBox)));
         driver.findElement(By.cssSelector(passwordBox)).sendKeys(mfaCode);

  

        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(buttonVerify)));
          driver.findElement(By.cssSelector(buttonVerify)).click();

        justWait(2);  // wait for the button verify - since the names of the elements are the same for password and mfa

    
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(passwordBox)));
         driver.findElement(By.cssSelector(passwordBox)).sendKeys(password);

        justWait(2);
   
    }

    @And("I click Submit")
    public void iPressEnter() {
         WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
         wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(buttonVerify)));
          driver.findElement(By.cssSelector(buttonVerify)).click();
    }

    @Then("I should see the message {string}")
    public void iShouldSee(String result) {
     
        
        try {
            WebDriverWait wait = new WebDriverWait(driver,
                    Duration.ofSeconds(10));
           wait.until(ExpectedConditions.textToBePresentInElementLocated(
                   By.tagName("body"), result));
        } finally {
            driver.quit();
        }
        


    }

}