const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");

// Helper function to validate multimedia data
function validateMultimediaData(type, idMarker) {
    const validTypes = ["photo_file", "video_file", "text_file"];

    if (!type || !idMarker) {
        return "Missing required fields: type, idMarker";
    }

    if (!validTypes.includes(type)) {
        return "Invalid type. Must be one of: 'photo_file', 'video_file', 'text_file'";
    }

    if (isNaN(idMarker) || idMarker < 1) {
        return "idMarker must be a valid positive number";
    }

    return null;
}

// GET all multimedia with pagination
router.get("/", async (req, res) => {
    try {
        const connection = await getConnection();
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        let offset = (page - 1) * limit;

        const [totalResults] = await connection.query(`SELECT COUNT(*) AS total FROM multimedia;`);
        const total = totalResults[0].total;

        const [results] = await connection.query(`SELECT * FROM multimedia LIMIT ? OFFSET ?;`, [limit, offset]);
        await connection.end();

        res.json({
            success: true,
            info: { total, page, limit, totalPages: Math.ceil(total / limit) },
            results,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET a single multimedia entry
router.get("/:idMultimedia", async (req, res) => {
    try {
        const connection = await getConnection();
        const [results] = await connection.query(`SELECT * FROM multimedia WHERE idMultimedia = ?;`, [req.params.idMultimedia]);
        await connection.end();

        if (results.length === 0) return res.status(404).json({ success: false, message: "Multimedia entry not found" });

        res.json({ success: true, result: results[0] });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST a new multimedia entry
router.post("/", async (req, res) => {
    try {
        const { type, idMarker } = req.body;
        const validationError = validateMultimediaData(type, idMarker);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();
        const [result] = await connection.execute(
            `INSERT INTO multimedia (type, idMarker) VALUES (?, ?);`,
            [type, idMarker]
        );

        await connection.end();
        res.json({ success: true, idMultimedia: result.insertId });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT (update) a multimedia entry
router.put("/:idMultimedia", async (req, res) => {
    try {
        const idMultimedia = req.params.idMultimedia;
        const { type, idMarker } = req.body;

        if (!idMultimedia || isNaN(idMultimedia)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const validationError = validateMultimediaData(type, idMarker);
        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const connection = await getConnection();

        // Check if the multimedia entry exists before updating
        const [existing] = await connection.query(`SELECT * FROM multimedia WHERE idMultimedia = ?;`, [idMultimedia]);

        if (existing.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Multimedia entry not found" });
        }

        const [result] = await connection.execute(
            `UPDATE multimedia SET type = ?, idMarker = ? WHERE idMultimedia = ?;`,
            [type || existing[0].type, idMarker || existing[0].idMarker, idMultimedia]
        );

        await connection.end();
        res.json({ success: true, message: "Multimedia entry updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE a multimedia entry
router.delete("/:idMultimedia", async (req, res) => {
    try {
        const idMultimedia = req.params.idMultimedia;

        if (!idMultimedia || isNaN(idMultimedia)) {
            return res.status(400).json({ success: false, message: "Invalid ID format. ID must be a number." });
        }

        const connection = await getConnection();

        // Check if the multimedia entry exists before deleting
        const [existing] = await connection.query(`SELECT * FROM multimedia WHERE idMultimedia = ?;`, [idMultimedia]);

        if (existing.length === 0) {
            await connection.end();
            return res.status(404).json({ success: false, message: "Multimedia entry not found" });
        }

        await connection.execute(`DELETE FROM multimedia WHERE idMultimedia = ?;`, [idMultimedia]);

        await connection.end();
        res.json({ success: true, message: "Multimedia entry deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
