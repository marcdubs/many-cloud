describe("Index", () => {
  const app = require("../");
  it("app should not be null", () => {
    expect(app).not.toBeNull();
  });

  describe("integration_list", () => {
    const loaded_integration_list = require("../lib/integrations/list.json");
    it("/lib/integrations/list.json should exist", () => {
      expect(loaded_integration_list).not.toBeNull();
    });

    it("integration_list should exist", () => {
      expect(app.integration_list).not.toBeNull();
    });

    describe("all Integrations Exist", () => {
      for (let i = 0; i < loaded_integration_list.length; i++)
        it(
          'integration: "' + loaded_integration_list[i] + '" should exist',
          () => {
            expect(app.integration_list).toContainEqual(
              loaded_integration_list[i]
            );
          }
        );
    });
  });

  describe("integration", () => {
    describe("test all", () => {
      const loaded_integration_list = require("../lib/integrations/list.json");
      for (let i = 0; i < loaded_integration_list.length; i++)
        it('can get Integration: "' + loaded_integration_list[i] + '"', () => {
          expect(app.integration(loaded_integration_list[i])).not.toBeNull();
        });
    });

    describe("when argument is missing", () => {
      it("throws an error", () => {
        expect(() => {
          app.integration();
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe("when integration is unknown", () => {
      it("throws an error", () => {
        expect(() => {
          app.integration("not_an_integration");
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe("abstraction", () => {
    describe("when argument is folder", () => {
      it("returns the folder abstraction", () => {
        expect(app.abstraction("folder")).toEqual(
          require("../lib/abstractions/folder")
        );
      });
    });

    describe("when argument is file", () => {
      it("returns the file abstraction", () => {
        expect(app.abstraction("file")).toEqual(
          require("../lib/abstractions/file")
        );
      });
    });

    describe("when missing argument", () => {
      it("throws an error", () => {
        expect(() => {
          app.abstraction();
        }).toThrowErrorMatchingSnapshot();
      });
    });

    describe("when argument is not an abstraction", () => {
      it("throws an error", () => {
        expect(() => {
          app.abstraction("not_an_abstraction");
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
