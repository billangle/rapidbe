const {Utils} = require("../resources/utils");
const axios = require('axios');

let utils = new Utils();


class apiHelpers {
	constructor() {

	}



	async getOktaMFA() {

		let OktaUser = await utils.getOktaAdminCreds();
		let getCodeUrl = await utils.getOktaCCApiUrl() + '/oktaqa/onlycode/' + OktaUser.username 
		let mfaCode="";

		try {
	
			
			let res = await axios.get(getCodeUrl,{});
			mfaCode= res.data.toString();
			console.log("mfaCode: " + mfaCode);
	
		} catch (e) {
			console.error ("Error URL: " + getCodeUrl + " : " +e);
		}
	
	   return mfaCode;
	}


}

module.exports = {apiHelpers};