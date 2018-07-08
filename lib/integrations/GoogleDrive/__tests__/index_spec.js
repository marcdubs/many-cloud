describe("GoogleDrive", () => {
  const app = require("../../../../");

  const integration = app.integration("GoogleDrive");
  it("GoogleDrive integration should exist", () => {
    expect(integration).not.toBeNull();
  });

  describe("credentials", () => {
    let credentials;
    let original_access_token;

    beforeEach(() => {
      credentials = require("../../../../credentials/gdrive.json");
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
        let props = credentials.tokens;
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
        let props = credentials.tokens;
        props["force_reset"] = false;
        connection = integration(props, () => {
          expect(original_access_token).toStrictEqual(
            connection.get_tokens()["access_token"]
          );
        });
      });
    });
  });

  describe("functions", () => {
    //Establish a fresh credentials and conection object before each test
    beforeEach(done => {
      credentials = require("../../../../credentials/gdrive.json");
      let props = credentials.tokens;
      connection = integration(props, () => {
        done();
      });
    });

    describe("list_files", () => {
      it("list files should work successfully", () => {
        expect(connection.list_files()).resolves.not.toBeNull();
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
            connection.list_files(10, nextPageToken).then(secondPageAssertion);
          } else {
            done();
          }
        };

        connection.list_files().then(assertion);
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
    });

    describe("upload_file", () => {
      it("rejects with no parameter", async () => {
        await expect(
          connection.upload_file()
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      it("rejects when file not found", async () => {
        await expect(
          connection.upload_file("/notafile/lol")
        ).rejects.toThrowErrorMatchingSnapshot();
      });

      it("rejects when path is directory", async () => {
        await expect(
          connection.upload_file("dummy_files")
        ).rejects.toThrowErrorMatchingSnapshot();
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
      it("rejects with no parameter", async () => {
        await expect(
          connection.delete_file()
        ).rejects.toThrowErrorMatchingSnapshot();
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