const request = require("supertest");
const app = require("../server");

let testMarkerId;

describe("Markers API", () => {
    it("should return a list of markers", async () => {
        const response = await request(app).get("/markers");
        console.log("Markers List Response:", response.body); // Debugging log
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should create a new marker", async () => {
        const newMarker = {
            title: "Test Marker",
            description: "Test Location",
            latitude: 40.7128,
            longitude: -74.0060,
            idMap: 1
        };
        const response = await request(app).post("/markers").send(newMarker);
        console.log("Create Marker Response:", response.body); // Debugging log
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        testMarkerId = response.body.idMarker;
        console.log("Stored testMarkerId:", testMarkerId); // Debugging log
    });

    it("should return a single marker", async () => {
        console.log("Fetching marker with ID:", testMarkerId); // Debugging log
        const response = await request(app).get(`/markers/${testMarkerId}`);
        console.log("Single Marker Response:", response.body); // Debugging log
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should update the marker", async () => {
        const updatedMarker = { title: "Updated Marker", latitude: 40.7128, longitude: -73.935242, idMap: 1 };
        const response = await request(app).put(`/markers/${testMarkerId}`).send(updatedMarker);
        console.log("Update Marker Response:", response.body); // Debugging log
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should delete the marker", async () => {
        const response = await request(app).delete(`/markers/${testMarkerId}`);
        console.log("Delete Marker Response:", response.body); // Debugging log
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });
});

