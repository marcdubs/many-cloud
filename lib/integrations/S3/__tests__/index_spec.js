const integration = require("../");

describe("Amazon S3", () => {
  describe("with provided accessKeyId and secretAccessKey", () => {
    const expectedAccessKeyID = "expected-access-key";
    const expectedSecretAccessKey = "expected-secret-access-key";
    const expectedBucket = "da-bucket";

    let connection;

    beforeEach(async () => {
      connection = await integration({
        accessKeyId: expectedAccessKeyID,
        secretAccessKey: expectedSecretAccessKey,
        bucket: expectedBucket
      });
    });

    it("sets the bucket", () => {
      expect(connection.bucket).toEqual(expectedBucket);
    });

    it("sets the accessKeyId", () => {
      expect(connection.accessKeyId).toEqual(expectedAccessKeyID);
    });

    it("sets the secretAccessKey", () => {
      expect(connection.secretAccessKey).toEqual(expectedSecretAccessKey);
    });
  });

  describe("with not provided accessKeyId and secretAccessKey", () => {
    const expectedBucket = "da-bucket";

    let connection;

    beforeEach(async () => {
      connection = await integration({
        bucket: expectedBucket
      });
    });

    it("sets the bucket", () => {
      expect(connection.bucket).toEqual(expectedBucket);
    });

    it("sets the accessKeyId from credentials file", () => {
      expect(connection.accessKeyId).toBeDefined();
    });

    it("sets the secretAccessKey from credentials file", () => {
      expect(connection.secretAccessKey).toBeDefined();
    });
  });
});
