const request = require("supertest");
const app = require("../server");

// Store a test map ID for further tests
let testMapId;

describe("Maps API", () => {
    // Test GET all maps
    it("should return a list of maps", async () => {
        const response = await request(app).get("/maps");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    // Test POST a new map
    it("should create a new map", async () => {
        const newMap = {
            name: "Test Map",
            description: "Test Description",
            privacy: "private",
            idUser: 1
        };
        const response = await request(app).post("/maps").send(newMap);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        expect(response.body).toHaveProperty("idMap");
        testMapId = response.body.idMap; // Store ID for next tests
    });

    // Test GET single map
    it("should return a single map", async () => {
        const response = await request(app).get(`/maps/${testMapId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    // Test PUT (update) a map
    it("should update an existing map", async () => {
        const updatedMap = { name: "Updated Map", description: "Updated", privacy: "public", idUser: 1 };
        const response = await request(app).put(`/maps/${testMapId}`).send(updatedMap);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    // Test DELETE a map
    it("should delete the test map", async () => {
        const response = await request(app).delete(`/maps/${testMapId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });
});
