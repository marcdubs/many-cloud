const require_fields = require("../require_fields");

describe("require fields", () => {
  describe("when an undefined object is passed in", () => {
    it("throws an error", () => {
      expect(() => {
        require_fields();
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("when fields is", () => {
    describe("undefined", () => {
      it("throws an error", () => {
        expect(() => {
          require_fields({});
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe("not an array", () => {
      it("throws an error", () => {
        expect(() => {
          require_fields({}, "not_an_array");
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe("when an object does not contain a required field", () => {
    it("throws an error", () => {
      expect(() => {
        require_fields({}, ["a_key"]);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe("when an object does contain a required field", () => {
    it("does not throw an error", () => {
      expect(() => {
        require_fields({ a_key: "hello" }, ["a_key"]);
      }).not.toThrowError();
    });
  });
});
