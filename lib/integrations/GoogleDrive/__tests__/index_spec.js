let firstTimeGettingCredentials = true;
const fs = require("fs");

const _getCredentials = () => {
  if (process.env.IS_CI && firstTimeGettingCredentials) {
    firstTimeGettingCredentials = false;
    const creds = {
      installed: {
        client_id: process.env.CI_GDRIVE_CLIENT_ID,
        client_secret: process.env.CI_GDRIVE_CLIENT_SECRET,
        project_id: process.env.CI_GDRIVE_PROJECT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        redirect_uris: [process.env.CI_GDRIVE_REDIRECT_URI]
      },
      tokens: {
        access_token: "toget",
        expiry_date: 1,
        refresh_token: process.env.CI_GDRIVE_REFRESH_TOKEN,
        token_type: "Bearer",
        force_reset: true
      }
    };
    fs.writeFileSync(
      "./credentials/gdrive.json",
      JSON.stringify(creds),
      "utf8"
    );
  }
  return require("../../../../credentials/gdrive.json");
};

describe("GoogleDrive", () => {
  const app = require("../../../../");

  describe("integration", () => {
    let integration;

    beforeEach(() => {
      integration = app.integration("GoogleDrive");
    });

    it("GoogleDrive integration should exist", () => {
      expect(integration).not.toBeNull();
    });

    describe("credentials", () => {
      let credentials;
      let original_access_token;

      beforeEach(() => {
        credentials = _getCredentials();
      });

      it("gdrive.json should exist inside of the credentials directory", () => {
        expect(credentials).not.toBeNull();
      });

      it("installed->client_id should exist in credentials file", () => {
        expect(credentials["installed"]["client_id"]).not.toBeNull();
      });

      it('should have access and refresh tokens from "npm run auth_gdrive"', () => {
        expect(credentials["tokens"]).not.toBeNull();
        expect(credentials["tokens"]["access_token"]).not.toBeNull();
        expect(credentials["tokens"]["refresh_token"]).not.toBeNull();
        original_access_token = credentials["tokens"]["access_token"];
      });

      describe("connection", () => {
        let connection;

        beforeAll(async done => {
          let props = JSON.parse(JSON.stringify(credentials.tokens));
          props.credentials = credentials;
          props["force_reset"] = true;
          connection = integration(props, () => {
            done();
          });
        });

        it("Access token should not be the same", () => {
          expect(original_access_token).not.toEqual(
            connection.get_tokens()["access_token"]
          );
          original_access_token = connection.get_tokens()["access_token"];
        });

        it("Access token should be the same", async () => {
          let props = JSON.parse(JSON.stringify(credentials.tokens));
          props.credentials = credentials;
          props["force_reset"] = false;
          connection = integration(props, () => {
            expect(original_access_token).toStrictEqual(
              connection.get_tokens()["access_token"]
            );
          });
        });
      });
    });

    describe("function", () => {
      //Establish a fresh credentials and conection object before each test
      beforeEach(done => {
        credentials = _getCredentials();
        let props = JSON.parse(JSON.stringify(credentials.tokens));
        props.credentials = credentials;
        connection = integration(props, () => {
          done();
        });
      });

      describe("authenticate", () => {
        describe("when empty props are passed in", () => {
          it("an error is thrown", () => {
            expect(() => {
              connection.authenticate({}, null);
            }).toThrowErrorMatchingSnapshot();
          });
        });
      });

      describe("list_files", () => {
        it("should work successfully", () => {
          expect(connection.list_files()).resolves.not.toBeNull();
        });

        describe("page size", () => {
          it("rejects if negative", async () => {
            await expect(
              connection.list_files(-5)
            ).rejects.toThrowErrorMatchingSnapshot();
          });
        });

        describe("next page token", () => {
          it("rejects if invalid", async () => {
            await expect(
              connection.list_files(10, "woatherecowboynahthisaintapagetoken")
            ).rejects.toThrowErrorMatchingSnapshot();
          });

          it("If there is a nextpageToken, it works and gives us different files", done => {
            let firstFileID = null;
            let nextPageToken = null;

            let secondPageAssertion = result => {
              expect(result).not.toBeNull();
              expect(firstFileID).not.toEqual(result.files[0].id);
              done();
            };

            let assertion = result => {
              expect(result).not.toBeNull();
              expect(result.files).not.toBeNull();
              if (result.files.length > 0 && result.nextPageToken) {
                firstFileID = result.files[0].id;
                nextPageToken = result.nextPageToken;
                connection
                  .list_files(10, nextPageToken)
                  .then(secondPageAssertion);
              } else {
                done();
              }
            };

            connection.list_files().then(assertion);
          });
        });

        describe("when google drive api returns an error", () => {
          let expected = new Error("super fancy error from google");
          beforeEach(() => {
            connection.drive = {
              files: {
                list: (params, callback) => {
                  callback(expected);
                }
              }
            };
          });

          it("function rejects", async () => {
            await expect(
              connection.list_files()
            ).rejects.toThrowErrorMatchingSnapshot();
          });
        });
      });

      describe("list_all_files", () => {
        it("If there is more than one file in the drive, list_all_files should have more", done => {
          let list_all_files_assertion = result => {
            expect(result.files).not.toBeNull();
            expect(result.files.length > 1).not.toBeNull();
            done();
          };

          let list_files_assertion = result => {
            expect(result).not.toBeNull();
            if (!result.nextPageToken) done();
            else {
              connection.list_all_files().then(list_all_files_assertion);
            }
          };

          connection.list_files(1).then(list_files_assertion);
        });

        describe("when google drive api returns an error", () => {
          let expected = new Error("super fancy error from google");
          beforeEach(() => {
            connection.drive = {
              files: {
                list: (params, callback) => {
                  callback(expected);
                }
              }
            };
          });

          it("function rejects", async () => {
            await expect(
              connection.list_all_files()
            ).rejects.toThrowErrorMatchingSnapshot();
          });
        });
      });

      describe("upload_file", () => {
        describe("rejects", () => {
          it("with no parameter", async () => {
            await expect(
              connection.upload_file()
            ).rejects.toThrowErrorMatchingSnapshot();
          });

          it("when file not found", async () => {
            await expect(
              connection.upload_file("/notafile/lol")
            ).rejects.toThrowErrorMatchingSnapshot();
          });

          it("when path is directory", async () => {
            await expect(
              connection.upload_file("dummy_files")
            ).rejects.toThrowErrorMatchingSnapshot();
          });

          describe("with the google drive api", async () => {
            const expected = new Error("super fancy error from google");
            beforeEach(() => {
              connection.drive = {
                files: {
                  create: (params, callback) => {
                    callback(expected);
                  }
                }
              };
            });

            it("when it returns an error", async () => {
              await expect(
                connection.upload_file("dummy_files/TestFile.txt")
              ).rejects.toThrowErrorMatchingSnapshot();
            });
          });
        });

        describe("upload successfull", () => {
          let result;
          it("returns id when file is found", async done => {
            let upload_assertion = _result => {
              result = _result;
              expect(result).not.toBeNull();
              expect(result.name).toBe("TestFile.txt");
              done();
            };

            await connection
              .upload_file("dummy_files/TestFile.txt")
              .then(upload_assertion);
          });

          afterAll(async done => {
            await connection.delete_file(result.id).then(() => {
              done();
            });
          });
        });
      });

      describe("delete_file", () => {
        describe("rejects", () => {
          it("with no parameter", async () => {
            await expect(
              connection.delete_file()
            ).rejects.toThrowErrorMatchingSnapshot();
          });
        });

        describe("delete successfull", () => {
          let file_id;
          beforeEach(async done => {
            await connection
              .upload_file("dummy_files/TestFile.txt")
              .then(result => {
                file_id = result.id;
                done();
              });
          });

          it('when response is "done"', async done => {
            let delete_assertion = _result => {
              expect(_result).toMatchSnapshot();
              done();
            };
            await connection.delete_file(file_id).then(delete_assertion);
          });
        });
      });
    });
  });
});
