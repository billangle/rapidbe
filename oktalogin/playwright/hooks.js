// Import necessary modules
const { Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium, waitForTimeout } = require("playwright");
const path = require("path");
const fs = require("fs");
const { Status } = require("@cucumber/cucumber");

// Set a default timeout for Cucumber steps
setDefaultTimeout(60000);

// Global variables for scenario name and old video path
let scenarioName;
let oldvideoPath;
let userAgent;

// Function to launch the browser
async function launchBrowser() {
	userAgent =
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";

	global.browser = await chromium.launch({
		headless: false, // Open with browser (false) or without browser (true)
		slowMo: 100,    // Slow motion for better visibility
	});
}

// Function to create a browser context with video recording
async function createBrowserContextwithRecording() {
	global.context = await global.browser.newContext({
		userAgent,
		recordVideo: {
			dir: path.join(__dirname, "results/videos"), // Video recording directory
			size: { width: 640, height: 480 },   // Video dimensions
		}
	});
	await createPageContext();
}

// Function to create a new page context
async function createPageContext() {
	global.page = await global.context.newPage();
}

// Function to capture a screenshot
async function captureScreenshot() {
	const screenshotPath = path.join(__dirname, "results/screenshots");
	if (!fs.existsSync(screenshotPath)) {
		fs.mkdirSync(screenshotPath);
	}
	const screenshotName = `${scenarioName}_${new Date().toLocaleString().replace(/[/:,]/g, '_')}.png`;
	console.log('screenshotName: ', screenshotName);
	const screenshotFilePath = path.join(screenshotPath, screenshotName);
	await global.page.screenshot({ path: screenshotFilePath });
}

// Function to close the context
async function closeContext() {
	await global.page.close();
	await global.page.video().delete(); // Delete the recorded video
	await global.context.close();
}

// Function to close the browser
async function closeBrowser() {
	await global.browser.close();
}

// Function to rename the captured video
async function renamedCapturedVideo() {
	try {
		await global.page.close();
		const newVideoName = `${scenarioName}_${new Date().toLocaleString().replace(/[/:,]/g, '_')}.webm`;
		const newVideoPath = path.join(__dirname, "results/videos", newVideoName);
		await new Promise(resolve => setTimeout(resolve, 3000)); // Delay to ensure the video is fully written
		await fs.promises.rename(oldvideoPath, newVideoPath);
		console.log('File is renamed');
	}
	catch (error) {
		console.error('Error while renaming the video:', error);
	}
}

// Before All Hook: Launch the browser before all scenarios
BeforeAll(async () => {
	await launchBrowser();
});

// Before Hook: Create a new browser context and page before each scenario
Before(async (scenario) => {
	scenarioName = scenario.pickle.name;
	await createBrowserContextwithRecording();
});

// After Hook: Cleanup and capture a screenshot after each scenario
After(async function (scenario) {
	oldvideoPath = await global.page.video().path();
	if (scenario.result.status === Status.FAILED) {
		await captureScreenshot();
		console.log('❌  Scenario is failed. ' + scenario.pickle.name);
		await renamedCapturedVideo();
	}
	else {
		await closeContext();
		console.log('✅  ' + scenario.pickle.name);
	}
});

// After All Hook: Close the browser after all scenarios
AfterAll(async function () {
	await closeBrowser();
});
