const { handler } = require("./index.mjs");

jest.mock('/opt/nodejs/Utils.mjs');
const { Utils } = require("/opt/nodejs/Utils.mjs");

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

describe("listUsers tests", () => {
    let event, context, utilsMock;

    beforeEach(() => {
        event = {};
        context = {
            functionName: "listUsers"
        };

        utilsMock = new Utils();
        Utils.mockImplementation(() => utilsMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should list users successfully', async () => {
        let  expected = {users: users}

        const result = await handler(event, context);

        expect(result.statusCode).toBe(200);
        const body = JSON.parse(result.body);
        expect(body).toEqual(expected);
    });

  
});