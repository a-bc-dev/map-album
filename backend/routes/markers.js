const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");

// Helper function to validate markers
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

// POST a new marker
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

module.exports = router;
