const path = require("path");
const { handler } = require("./index.mjs");

jest.mock('/opt/nodejs/Utils.mjs');
const { Utils } = require("/opt/nodejs/Utils.mjs");


let username ="change.password";

describe("Change Password tests", () => {
    let event, context, utilsMock;

    beforeEach(() => {
       
    
        context = {
            functionName: "changePassword"
        };

        utilsMock = new Utils();
        Utils.mockImplementation(() => utilsMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should change password successfully', async () => {
        let event = {
            pathParameters: {
                username: username
             },
            body: "{\"password\": \"Test@1234\"}",
        }
            
        let  expected = { "changePassword": "user "+ username + " password changed"};

        const result = await handler(event, context);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body).toEqual(expected);
    });

    it('should NOT delete - user not found', async () => {

        username = "change.password.fail";
        let event = {
            pathParameters: {
                username: username
             },
            body: "{\"password\": \"Test@1234\"}",
        }


        let  expected = {"error": "username does not exist"};

        const result = await handler(event, context);

        expect(result.statusCode).toBe(400);
        const body = JSON.parse(result.body);
        expect(body).toEqual(expected);
    });

    it('should NOT delete data error', async () => {

        username = "change.password";
        let event = {
            pathParameters: {
                username: username
             },
            body: "",
        }


        let  expected = {"changePassword": "failed", "error": "Unexpected end of JSON input"};

        const result = await handler(event, context);

        expect(result.statusCode).toBe(404);
        const body = JSON.parse(result.body);
        expect(body).toEqual(expected);
    });
  
});