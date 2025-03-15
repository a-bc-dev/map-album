const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");

// Helper function to validate marker data
function validateMarkerData(title, latitude, longitude, idMap) {
    if (!title || !latitude || !longitude || !idMap) {
        return "Missing required fields: title, latitude, longitude, idMap";
    }

    if (typeof title !== "string" || title.length < 3 || title.length > 255) {
        return "Title must be between 3 and 255 characters";
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        return "Latitude and longitude must be valid numbers";
    }

    if (isNaN(idMap) || idMap < 1) {
        return "idMap must be a valid positive number";
    }

    return null;
}

// ✅ GET all markers with pagination
router.get("/", async (req, res) => {
    try {
        const connection = await getConnection();
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const [totalResults] = await connection.query(`SELECT COUNT(*) AS total FROM markers;`);
        const total = totalResults[0].total;

        const [results] = await connection.query(`SELECT * FROM markers LIMIT ? OFFSET ?;`, [limit, offset]);
        await connection.end();

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "No markers found" });
        }

        res.json({
            success: true,
            info: { total, page, limit, totalPages: Math.ceil(total / limit) },
            results,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ GET a single marker
router.get("/:idMarker", async (req, res) => {
    try {
        const idMarker = req.params.idMarker;

        if (!idMarker || isNaN(idMarker)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const connection = await getConnection();
        const [results] = await connection.query(`SELECT * FROM markers WHERE idMarker = ?;`, [idMarker]);
        await connection.end();

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Marker not found" });
        }

        res.json({ success: true, result: results[0] });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ POST a new marker
router.post("/", async (req, res) => {
    try {
        const { title, latitude, longitude, idMap } = req.body;
        const validationError = validateMarkerData(title, latitude, longitude, idMap);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO markers (title, latitude, longitude, idMap) VALUES (?, ?, ?, ?);`,
            [title, latitude, longitude, idMap]
        );

        await connection.end();
        res.json({ success: true, idMarker: result.insertId });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ PUT (update) a marker
router.put("/:idMarker", async (req, res) => {
    try {
        const idMarker = req.params.idMarker;
        const { title, latitude, longitude, idMap } = req.body;

        if (!idMarker || isNaN(idMarker)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const validationError = validateMarkerData(title, latitude, longitude, idMap);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();

        // Check if the marker exists before updating
        const [existing] = await connection.query(`SELECT * FROM markers WHERE idMarker = ?;`, [idMarker]);

        if (existing.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Marker not found" });
        }

        const [result] = await connection.execute(
            `UPDATE markers SET title = ?, latitude = ?, longitude = ?, idMap = ? WHERE idMarker = ?;`,
            [title || existing[0].title, latitude || existing[0].latitude, longitude || existing[0].longitude, idMap || existing[0].idMap, idMarker]
        );

        await connection.end();
        res.json({ success: true, message: "Marker updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ DELETE a marker
router.delete("/:idMarker", async (req, res) => {
    try {
        const idMarker = req.params.idMarker;

        if (!idMarker || isNaN(idMarker)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const connection = await getConnection();

        // Check if the marker exists before deleting
        const [existing] = await connection.query(`SELECT * FROM markers WHERE idMarker = ?;`, [idMarker]);

        if (existing.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Marker not found" });
        }

        await connection.execute(`DELETE FROM markers WHERE idMarker = ?;`, [idMarker]);

        await connection.end();
        res.json({ success: true, message: "Marker deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;


