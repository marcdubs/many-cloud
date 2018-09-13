describe("authenticate", () => {
  const expected_access_token = "accessington",
    expected_refresh_token = "refreshington",
    expected_access_token_ttlms = "timington",
    expected_acquired_at_ms = "millisecondington";

  let data,
    auth_func,
    getTokensAuthorizationCodeGrant,
    getTokensRefreshGrant,
    getPersistentClient,
    fs;

  beforeEach(() => {
    getTokensAuthorizationCodeGrant = jest
      .fn()
      .mockImplementation((t, n, func) => {
        func(null, {
          accessToken: expected_access_token,
          refreshToken: expected_refresh_token,
          accessTokenTTLMS: expected_access_token_ttlms,
          acquiredAtMS: expected_acquired_at_ms
        });
      });

    getTokensRefreshGrant = jest
      .fn()
      .mockImplementation((refresh_token, callback) => {
        callback(null, {
          accessToken: expected_access_token,
          refreshToken: expected_refresh_token,
          accessTokenTTLMS: expected_access_token_ttlms,
          acquiredAtMS: expected_acquired_at_ms
        });
      });

    getPersistentClient = jest.fn();
    data = {
      credentials: {},
      sdk: {
        getTokensAuthorizationCodeGrant: getTokensAuthorizationCodeGrant,
        getTokensRefreshGrant: getTokensRefreshGrant,
        getPersistentClient: getPersistentClient
      }
    };
    auth_func = require("../authenticate")(data);
    fs = require("fs");
    fs.writeFile = jest
      .fn()
      .mockImplementation((file_name, file, format, callback) => {
        callback(null);
      });
  });

  describe("when provided an authentication_token", () => {
    const expected_auth_token = "authy_the_authonator";
    beforeEach(done => {
      auth_func(
        {
          authentication_token: expected_auth_token
        },
        function() {
          done();
        }
      );
    });

    it("calls getTokensAuthorizationCodeGrant", () => {
      expect(getTokensAuthorizationCodeGrant).toHaveBeenCalled();
    });

    it("calls getTokensAuthorizationCodeGrant with authentication_token", () => {
      expect(getTokensAuthorizationCodeGrant.mock.calls[0][0]).toEqual(
        expected_auth_token
      );
    });

    it("sets data.credentials.tokens to expected values", () => {
      expect(data.credentials.tokens).toMatchSnapshot();
    });

    it("calls fs.writeFile", () => {
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe("when provided an access_token and refresh_token", () => {
    describe("with access_token_TTLMS and acquired_at_MS", () => {
      beforeEach(done => {
        auth_func(
          {
            access_token: expected_access_token,
            refresh_token: expected_refresh_token,
            access_token_TTLMS: expected_access_token_ttlms,
            acquired_at_MS: expected_acquired_at_ms
          },
          function() {
            done();
          }
        );
      });

      it("does not call getTokensRefreshGrant", () => {
        expect(getTokensRefreshGrant).not.toHaveBeenCalled();
      });

      it("calls getPersistentClient", () => {
        expect(getPersistentClient).toHaveBeenCalled();
      });

      it("calls getPersistentClient with provided token info", () => {
        expect(getPersistentClient.mock.calls[0][0]).toMatchSnapshot();
      });
    });

    describe("without access_token_TTLMS or acquired_at_MS", () => {
      const expected_init_refresh_token = "another_thing_that_will_be_replaced";
      beforeEach(done => {
        auth_func(
          {
            access_token: "something_that_will_be_replaced",
            refresh_token: expected_init_refresh_token
          },
          function() {
            done();
          }
        );
      });

      it("calls getTokensRefreshGrant", () => {
        expect(getTokensRefreshGrant).toHaveBeenCalled();
      });

      it("calls getTokensRefreshGrant with the refresh_token", () => {
        expect(getTokensRefreshGrant.mock.calls[0][0]).toEqual(
          expected_init_refresh_token
        );
      });

      it("sets data.credentials.tokens to expected values", () => {
        expect(data.credentials.tokens).toMatchSnapshot();
      });

      it("calls fs.writeFile", () => {
        expect(fs.writeFile).toHaveBeenCalled();
      });

      it("calls getPersistentClient", () => {
        expect(getPersistentClient).toHaveBeenCalled();
      });

      it("calls getPersistentClient with the expected tokenInfo", () => {
        expect(getPersistentClient.mock.calls[0][0]).toMatchSnapshot();
      });

      describe("tokenStore", () => {
        let tokenStore;
        beforeEach(() => {
          tokenStore = getPersistentClient.mock.calls[0][1];
        });

        describe("read", () => {
          let callback;
          beforeEach(() => {
            callback = jest.fn();
            tokenStore.read(callback);
          });

          it("calls the callback", () => {
            expect(callback).toHaveBeenCalled();
          });

          it("calls the callback with the expected tokenInfo", () => {
            expect(callback.mock.calls[0][1]).toMatchSnapshot();
          });
        });

        describe("clear", () => {
          let callback;
          beforeEach(() => {
            callback = jest.fn();
            console.log = jest.fn();
            tokenStore.clear(callback);
          });

          it("calls the callback", () => {
            expect(callback).toHaveBeenCalled();
          });

          it("calls console.log alerting of the unsupported operation", () => {
            expect(console.log.mock.calls[0][0]).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe("when fs.writeFile returns an error", () => {
    beforeEach(() => {
      fs.writeFile = jest
        .fn()
        .mockImplementation((file_name, file, format, callback) => {
          callback("not null");
        });
    });

    it("throws an error", () => {
      expect(() => {
        auth_func(
          {
            access_token: expected_access_token,
            refresh_token: expected_refresh_token
          },
          null
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("when getTokensRefreshGrant returns an error", () => {
    beforeEach(() => {
      getTokensRefreshGrant.mockImplementation((refresh_token, callback) => {
        callback("well that's a problem");
      });
    });

    it("throws an error", () => {
      expect(() => {
        auth_func(
          {
            access_token: expected_access_token,
            refresh_token: expected_refresh_token
          },
          null
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("when getTokensAuthorizationCodeGrant returns an error", () => {
    const expected_auth_token = "authy_the_authonator";
    beforeEach(() => {
      getTokensAuthorizationCodeGrant.mockImplementation(
        (auth_token, t, callback) => {
          callback("well that's a problem");
        }
      );
    });

    it("throws an error", () => {
      expect(() => {
        auth_func(
          {
            authentication_token: expected_auth_token
          },
          null
        );
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("when provided nothing of use", () => {
    it("throws an error", () => {
      expect(() => {
        auth_func({}, null);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("when provided nothing", () => {
    it("throws an error", () => {
      expect(() => {
        auth_func(null, null);
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
