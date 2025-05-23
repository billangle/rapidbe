export class Utils {
    async getUserPool() {
        return 'mockUserPoolId';
    }

    async getEmailForUserName(username) {
        if (username === 'testuserfail') {
            return 'testuserfail@example.com'
        }
        else if (username === "user#!.?") {
            return 'invalid username';
        }
        else if (username === "change.password") {
            return "change.password";
        }
        else if (username === "change.password.fail") {
            return "";
        }
        return '';
    }

    async getClientId() {
        return 'mockClientId';
    }

    async createCognitoUser(user) {
        return {};
    }

    async setPassword(user) {
        return {};
    }

    async setGroups(user, userType) {
        return {};
    }

    async deleteUser (username) {

        if (username === "faileduser") {
            throw new Error("user delete failed");
            return {"error": "invalid username"};
        }
        else {
          return {"deleteUser": "user "+ username + " deleted"};
        }
    }
    
    async listPoolUsers() {

        let users = [
            {
                "Attributes": [
                  {
                    "Name": "email",
                    "Value": "randomeuxm3@test.com"
                  }
                ],
                "Enabled": true,
                "UserCreateDate": "2024-12-07T15:01:39.711Z",
                "UserLastModifiedDate": "2024-12-07T15:01:39.875Z",
                "UserStatus": "CONFIRMED",
                "Username": "randomeuxm3"
              },
              {
                "Attributes": [
                  {
                    "Name": "email",
                    "Value": "randomeuxm3@test.com"
                  }
                ],
                "Enabled": true,
                "UserCreateDate": "2024-12-07T15:01:39.711Z",
                "UserLastModifiedDate": "2024-12-07T15:01:39.875Z",
                "UserStatus": "CONFIRMED",
                "Username": "randomeuxm3"
              },

        ]
        return users;
    }

    httpRes(statusCode, body) {
        return {
            statusCode,
            body: JSON.stringify(body)
        };
    }

    
}
