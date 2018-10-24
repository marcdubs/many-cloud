let firstTimeGettingCredentials = true;
const fs = require("fs");
const fetch = require("node-fetch");

const _getCredentials = async () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    let ref_ = await fetch(process.env.CI_CREDS_URI + "get_ref_token", {
      method: "POST",
      body: JSON.stringify({
        t: process.env.CREDS_REQ_TOKEN
      }),
      headers: { "Content-Type": "application/json" }
    });

    let ref = await ref_.json();

    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_BOX_CLIENT_ID,
        client_secret: process.env.CI_BOX_CLIENT_SECRET
      },
      tokens: {
        access_token: "toget",
        refresh_token: ref
      }
    };
    fs.writeFileSync("./credentials/box.json", JSON.stringify(creds), "utf8");
  }
  return require("../../../../credentials/box.json");
};

describe("Box", () => {
  beforeAll(async () => {
    await _getCredentials();
  });

  afterAll(async () => {
    if (process.env.IS_CI) {
      let creds = await _getCredentials();
      await fetch(process.env.CI_CREDS_URI + "set_ref_token", {
        method: "POST",
        body: JSON.stringify({
          t: process.env.CREDS_REQ_TOKEN,
          new_token: creds.tokens.refresh_token
        }),
        headers: { "Content-Type": "application/json" }
      });
    }
  });

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

      beforeEach(async () => {
        credentials = await _getCredentials();
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
          props["force_reset"] = true;
          connection = await integration(props);
          done();
        });

        it("should have a different refresh_token", () => {
          expect(original_refresh_token).not.toEqual(
            connection.get_tokens()["refresh_token"]
          );
        });

        it("should have a different access_token", () => {
          expect(original_access_token).not.toEqual(
            connection.get_tokens()["access_token"]
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
