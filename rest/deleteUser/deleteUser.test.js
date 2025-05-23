const path = require("path");
const { handler } = require("./index.mjs");

jest.mock('/opt/nodejs/Utils.mjs');
const { Utils } = require("/opt/nodejs/Utils.mjs");


let username ="anyuser";

describe("Delete User tests", () => {
    let event, context, utilsMock;

    beforeEach(() => {
       
    
        context = {
            functionName: "deleteUser"
        };

        utilsMock = new Utils();
        Utils.mockImplementation(() => utilsMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should delete successfully', async () => {
        let event = {
            pathParameters: {
                username: username
             } 
        }

        let  expected = {"deleteUser": "user "+ username + " deleted"};

        const result = await handler(event, context);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body).toEqual(expected);
    });

    it('should NOT delete', async () => {

        username = "faileduser";
        let event = {
            pathParameters: {
                username: username
             } 
        }


        let  expected = {"deleteUsers": "failed", "error": "user delete failed"};

        const result = await handler(event, context);

        expect(result.statusCode).toBe(404);
        const body = JSON.parse(result.body);
        expect(body).toEqual(expected);
    });
  
});