const request = require("supertest");
const app = require("../server");

let testMultimediaId;

describe("Multimedia API", () => {
    it("should return a list of multimedia", async () => {
        const response = await request(app).get("/multimedia");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should create a new multimedia entry", async () => {
        const newMultimedia = { type: "photo_file", idMarker: 1 };
        const response = await request(app).post("/multimedia").send(newMultimedia);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
        testMultimediaId = response.body.idMultimedia;
    });

    it("should return a single multimedia entry", async () => {
        const response = await request(app).get(`/multimedia/${testMultimediaId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should update a multimedia entry", async () => {
        const updatedMultimedia = { type: "video_file", idMarker: 1 };
        const response = await request(app).put(`/multimedia/${testMultimediaId}`).send(updatedMultimedia);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });

    it("should delete the multimedia entry", async () => {
        const response = await request(app).delete(`/multimedia/${testMultimediaId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("success", true);
    });
});
