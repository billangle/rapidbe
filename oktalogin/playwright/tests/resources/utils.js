
var settings = require('../../env-configs.json');

class Utils {
	constructor(page) {
		this.page = page;

	}



	async getOktaCCUrl(){
		if (!process.env.env){
			await console.log("Env not set.  Defaulting to okta")
			process.env.env = 'okta';
		}
		switch (process.env.env.toLocaleLowerCase()) {
			case 'okta':
				return settings.environments.okta.rccUrl;
			default:
				return settings.environments.okta.rccUrl;
		}
	}
		

	async getOktaCCApiUrl(){
		if (!process.env.env){
			await console.log("Env not set.  Defaulting to okta")
			process.env.env = 'okta';
		}
		switch (process.env.env.toLocaleLowerCase()) {
			case 'okta':
					return settings.environments.okta.apiUrl;
			default:
				return settings.environments.okta.apiUrl;
		}
	}


	async getOktaAdminCreds(){
		switch (process.env.env.toLocaleLowerCase()) {
			case 'okta':
				return {"username":settings.environments.okta.OktaAdmin.username, "password": settings.environments.okta.OktaAdmin.password, "system": settings.environments.okta.OktaAdmin.system};
		default:
				return {"username":settings.environments.okta.OktaAdmin.username, "password": settings.environments.okta.OktaAdmin.password, "system": settings.environments.okta.OktaAdmin.system};
		}
	}


	
}

module.exports = {Utils};