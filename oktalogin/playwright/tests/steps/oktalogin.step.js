const {Given, Before, After, When, Then} = require("@cucumber/cucumber");
const {Utils} = require("../resources/utils");
const {apiHelpers} = require('../resources/apiHepers')
const {OktaLoginPage} = require("../pages/OktaLoginPage");
const {expect} = require("playwright/test");



let page;
let utils = new Utils(page);
let loginPage;
let oktaSystem;

Before(async function () {

	page = global.page;

});

After(async function () {

	// await browser.close();

})

Given('I am on the Okta login page', async function () {
	await global.page.goto(await utils.getOktaCCUrl());

});


When('I attempt a valid login', async function () {
	let apihelper = new apiHelpers();
	loginPage = new OktaLoginPage(page);
	await loginPage.sendMfaEmail(await utils.getOktaAdminCreds())
	let mfaCode = await apihelper.getOktaMFA();
	await loginPage.doLogin(await utils.getOktaAdminCreds(), mfaCode)

});

Then('I will be logged in', async function () {
	
	const user = await utils.getOktaAdminCreds()
	oktaSystem = await loginPage.verifyLogin();

	if (oktaSystem === user.system) {
		console.log("THEN Logged in " + user.username + " to " + oktaSystem);
		expect(oktaSystem).toBe(user.system);  // This will assert that oktaSystem equals user.system
	  } else {
		console.error(`Test failed: ${user.username} logged into ${oktaSystem} instead of ${user.system}`);
		expect(oktaSystem).toBe(user.system);  // This will cause the test to fail if the condition is not met
	  }


});

