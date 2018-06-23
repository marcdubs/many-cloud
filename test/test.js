const assert = require("assert");

describe("Index", function() {
	const app = require("../");
	it("app should not be null", function() {
		assert(app);
	});

	describe("#integration_list", function() {
		const loaded_integration_list = require("../lib/integrations/list.json");
		it("/lib/integrations/list.json should exist", function() {
			assert(loaded_integration_list);
		});

		it("integration_list should exist", function() {
			assert(app.integration_list);
		});

		describe("All Integrations Exist", function() {
			for (let i = 0; i < loaded_integration_list.length; i++)
				it(
					'Integration: "' +
						loaded_integration_list[i] +
						'" should exist',
					function() {
						assert(
							app.integration_list.includes(
								loaded_integration_list[i]
							)
						);
					}
				);
		});
	});

	describe("#integration", function() {
		const loaded_integration_list = require("../lib/integrations/list.json");
		for (let i = 0; i < loaded_integration_list.length; i++)
			it(
				'Can get Integration: "' + loaded_integration_list[i] + '"',
				function() {
					assert(app.integration(loaded_integration_list[i]));
				}
			);
	});
});
