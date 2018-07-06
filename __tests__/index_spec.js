describe("Index", () => {
  const app = require("../");
  it("app should not be null", () => {
    expect(app).not.toBeNull();
  });

  describe("#integration_list", () => {
    const loaded_integration_list = require("../lib/integrations/list.json");
    it("/lib/integrations/list.json should exist", () => {
      expect(loaded_integration_list).not.toBeNull();
    });

    it("integration_list should exist", () => {
      expect(app.integration_list).not.toBeNull();
    });

    describe("All Integrations Exist", () => {
      for (let i = 0; i < loaded_integration_list.length; i++)
        it(
          'Integration: "' + loaded_integration_list[i] + '" should exist',
          () => {
            expect(app.integration_list).toContainEqual(
              loaded_integration_list[i]
            );
          }
        );
    });
  });

  describe("#integration", () => {
    const loaded_integration_list = require("../lib/integrations/list.json");
    for (let i = 0; i < loaded_integration_list.length; i++)
      it('Can get Integration: "' + loaded_integration_list[i] + '"', () => {
        expect(app.integration(loaded_integration_list[i])).not.toBeNull();
      });
  });
});
