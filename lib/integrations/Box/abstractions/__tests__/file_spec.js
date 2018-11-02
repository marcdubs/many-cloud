const File = require("../file");

describe("file", () => {
  describe("constructor", () => {
    const expected_id = "1234";
    const expected_type = "file";
    const expected_connection = "a_connection";
    let actual;
    beforeEach(() => {
      actual = new File(expected_id, expected_connection);
    });

    it("sets the id", () => {
      expect(actual.id).toEqual(expected_id);
    });

    it("sets the type", () => {
      expect(actual.type).toEqual(expected_type);
    });

    it("sets the connection", () => {
      expect(actual.connection).toEqual(expected_connection);
    });
  });
});
