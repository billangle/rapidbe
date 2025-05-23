
const { handler } = require("./index.mjs");
jest.mock('@aws-sdk/client-cognito-identity-provider');
const { CognitoIdentityServiceProvider } = require('@aws-sdk/client-cognito-identity-provider');

jest.mock('/opt/nodejs/Utils.mjs');
const { Utils } = require("/opt/nodejs/Utils.mjs");

describe("createUser tests", () => {
    let event, context, utilsMock;

    beforeEach(() => {
      
        context = {
            // Mock context data
            functionName: "createUser"
        };

      
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    


    it('should create a user successfully', async () => {

        event = {
            // Mock event data
            body: JSON.stringify({
                data: {
                    username: "testuser",
                    email: "testuser@example.com",
                    firstName: "Test",
                    lastName: "User",
                    password: "Test@1234"
                }
            })
        };
        const result = await handler(event, context);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body).toEqual({ msg: 'New User testuser Registered' });

    });

    

    
    it('should handle existing username error', async () => {
        event = {
            body: JSON.stringify({
                data: {
                    username: "testuserfail",
                    email: "testuser@example.com",
                    firstName: "Test",
                    lastName: "User",
                    password: "Test@1234"
                }
            })
        }
      
        const result = await handler(event, context);

        expect(result.statusCode).toBe(400);
        const body = JSON.parse(result.body);
        expect(body).toEqual({ error: "username already exists" });
        
    });


    it('should handle invalid user name', async () => {
        event = {
            body: JSON.stringify({
                data: {
                    username: "user#!.?",
                    email: "",
                    firstName: "Test",
                    lastName: "User",
                    password: "Test@1234"
                }
            })
        }

        const result = await handler(event, context);

        expect(result.statusCode).toBe(400);
        const body = JSON.parse(result.body);
        
    });
    
});
