const ApiBaseClass = require("../../classes/api-base-class");
const exclusions = require("./_genericexclusions").Exclusions;
let controller;
let swaggerResponse;
const JWTs = {
    userJWT: "",
    adminJWT: "",
};

before(() => {
    // Act
    cy.getSwaggerData().then((swaggerData) => {
        swaggerResponse = swaggerData;
        controller = new ApiBaseClass(swaggerData);
    });

    cy.fixture("users").then((userDetails) => {
        const adminUserData = {
            username: userDetails.admin_username,
            password: userDetails.admin_password,
            organisation: "Collaborative Partners",
            authentication: "Demo",
        };
        cy.getJWT(adminUserData).then((jwtToken) => {
            JWTs.adminJWT = "JWT " + jwtToken;
        });
        const userData = {
            username: userDetails.username,
            password: userDetails.password,
            organisation: "Collaborative Partners",
            authentication: "Demo",
        };
        cy.getJWT(userData).then((jwtToken) => {
            JWTs.userJWT = "JWT " + jwtToken;
        });
    });
});

describe("Test Setup", () => {
    it("Is Swagger Data available?", () => {
        expect(swaggerResponse.length).to.be.at.least(1);
    });
    it("User Token is available to use", () => {
        cy.expect(JWTs.userJWT.length).to.be.at.least(1);
    });
    it("Admin Token is available to use", () => {
        cy.expect(JWTs.adminJWT.length).to.be.at.least(1);
    });
});

describe("Test Endpoints", () => {
    it("Check if endpoints to test", () => {
        cy.expect(controller.orderedEndpointData.length).to.be.at.least(1);
    });

    it("Check if endpoints are valid", () => {
        controller.orderedEndpointData.forEach((endpoint) => {
            cy.expect(endpoint.endpoint).to.be.a("string");
            cy.expect(endpoint.requestType).to.be.a("string");
        });
    });

    it("Check PUT endpoints - SUCCESS (200)", () => {
        const testingPUTTEndpointList = controller.orderedEndpointData.filter((x) => {
            return x.requestType === "put" && !exclusions.isInPutExclusionList(x.tags[0]);
        });
        console.log("Put endpoints...");
        console.log(testingPUTTEndpointList);

        // TODO: Add tests
        testingPUTTEndpointList.forEach((endpoint) => {
            if (endpoint.responses["403"]) {
                // cy.apiRequest(endpoint, JWTs.adminJWT).then((response) => {
                //     cy.expect(response.status).to.be.equal(200);
                // });
            } else if (endpoint.security) {
                // cy.apiRequest(endpoint, JWTs.userJWT).then((response) => {
                //     cy.expect(response.status).to.be.equal(200);
                // });
            } else {
                // cy.apiRequest(endpoint).then((response) => {
                //     cy.expect(response.status).to.be.equal(200);
                // });
            }
        });
    });

    it("Check PUT endpoints - BAD Requests (404)", () => {
        const testingPUTTEndpointList = controller.orderedEndpointData.filter((x) => {
            return x.requestType === "put" && !exclusions.isInPutExclusionList(x.tags[0]);
        });

        // TODO: Add tests
        testingPUTTEndpointList.forEach((endpoint) => {
            if (endpoint.responses["404"]) {
                if (endpoint.responses["403"]) {
                    // cy.apiRequest(endpoint, JWTs.adminJWT).then((response) => {
                    //     cy.expect(response.status).to.be.equal(404);
                    // });
                } else if (endpoint.security) {
                    // cy.apiRequest(endpoint, JWTs.userJWT).then((response) => {
                    //     cy.expect(response.status).to.be.equal(404);
                    // });
                } else {
                    // cy.apiRequest(endpoint).then((response) => {
                    //     cy.expect(response.status).to.be.equal(404);
                    // });
                }
            }
        });
    });
});
