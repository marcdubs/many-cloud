let firstTimeGettingCredentials = true;
const fs = require("fs");

const _getCredentials = () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_BOX_CLIENT_ID,
        client_secret: process.env.CI_BOX_CLIENT_SECRET
      },
      tokens: {
        access_token: "toget",
        refresh_token: process.env.CI_BOX_REFRESH_TOKEN
      }
    };
    fs.writeFileSync("./credentials/box.json", JSON.stringify(creds), "utf8");
  }
  return require("../../../../credentials/box.json");
};

describe("Box", () => {
  const app = require("../../../../");

  describe("integration", () => {
    let integration;

    beforeEach(() => {
      integration = app.integration("Box");
    });

    it("should create a Box integration", () => {
      expect(integration).not.toBeNull();
    });

    describe("credentials", () => {
      let credentials;
      let original_access_token, original_refresh_token;

      beforeEach(() => {
        credentials = _getCredentials();
      });

      it("should put box.json inside of the credentials directory", () => {
        expect(credentials).not.toBeNull();
      });

      it("should make the credentials file contain installed->client_id", () => {
        expect(credentials["installed"]["client_id"]).not.toBeNull();
      });

      it('should have access and refresh tokens from "npm run auth_box"', () => {
        expect(credentials["tokens"]).not.toBeNull();
        expect(credentials["tokens"]["access_token"]).not.toBeNull();
        expect(credentials["tokens"]["refresh_token"]).not.toBeNull();
        original_access_token = credentials["tokens"]["access_token"];
        original_refresh_token = credentials["tokens"]["refresh_token"];
      });

      describe("get_tokens", () => {
        let connection;

        beforeAll(async done => {
          jest.setTimeout(20000);
          let props = JSON.parse(JSON.stringify(credentials.tokens));
          props.credentials = credentials;
          props["force_reset"] = false;
          connection = await integration(props);
          done();
        });

        it("should have the same refresh_token", () => {
          expect(original_refresh_token).toEqual(
            connection.get_tokens()["refresh_token"]
          );
          original_access_token = connection.get_tokens()["access_token"];
        });
      });

      describe("connection without providing credentials properties", () => {
        let require_fn;
        beforeAll(async done => {
          jest.setTimeout(20000);
          let props = JSON.parse(JSON.stringify(credentials.tokens));
          connection = await integration(props);
          let fs = require("fs");
          fs.writeFile = jest.fn();
          require_fn = jest.fn();
          require = require_fn;
          done();
        });

        it("trys to read credentials from the file", () => {
          expect(require_fn.mock.calls[0]).toMatchSnapshot();
        });
      });
    });
  });
});
