const {expect} = require("@playwright/test");



class OktaLoginPage {

	constructor() {
	
		this.userName = '[name="identifier"]'; // input for username
		this.password = '[name="credentials.passcode"]'; // input for MFA or password data
		this.nextButton = 'input.button.button-primary[value="Next"]';  // next buttons
		this.emailButton = 'button:text("Send me an email")';  // send the MFA email
		this.buttonVerify = 'input.button.button-primary[value="Verify"]'; // verify value button
		this.selectEmail = 'a.button.select-factor.link-button[aria-label^="Select Email -"]'; // select email
		this.sendMFAEmail = 'input.button.button-primary[value="Send me an email"]'; // send MFA email
		this.useMFALink = 'button.button-link.enter-auth-code-instead-link'; // link to reveal the MFA code input box
		this.verifyWithPassword = 'h2[data-se="o-form-head"]:has-text("Verify with your password")'; // password next page
		this.dashboardMyApps = 'span[data-se="section-label"]#section-label-no-apps:has-text("My Apps")';  // validate the login next page
		this.dropDownMenu = 'div.dropdown-menu--button-sub.no-translate[data-se="dropdown-menu-button-sub"]'; // validate the login
	}

	async verifyPage(page) {
		await expect(await global.page.locator(this.userName)).toBeVisible();

	}



	async sendMfaEmail( userCreds){
		await global.page.locator(this.userName).fill(userCreds.username);


		/** selecting the type of MFA */
		await page.click(this.nextButton);  // click the next button
		await page.click(this.selectEmail); // select email MFA
		await page.click(this.sendMFAEmail); // send me an email
		
		
		await page.waitForTimeout(4000);  // waiting for the email to be processed

		
	}

	async doLogin( userCreds, mfaCode){


		/** MFA data input */
		await page.click(this.useMFALink); // click to reveal the MFA code input
		await page.fill(this.password, mfaCode);   // enter the mFA code from the reirapid.net API
		await page.click(this.buttonVerify);  // verify the MFA code

	
		//** enter the user passsword */
		await page.waitForSelector(this.verifyWithPassword); // login password
		await page.fill(this.password, userCreds.password);  // enter the login password
		await page.click(this.buttonVerify); // validate the password

         // waiting for the page post-login
		await page.waitForSelector(this.dashboardMyApps); // wait for the dashboard


	}

	async verifyLogin(){
		

		//validating the login
		 await page.waitForSelector(this.dropDownMenu);
     	 const elementText = await page.textContent(this.dropDownMenu);

		
	  return elementText;
	}


}

module.exports = { OktaLoginPage };