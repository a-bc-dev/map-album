const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const mapsRoutes = require("./routes/maps");
const markersRoutes = require("./routes/markers");
const multimediaRoutes = require("./routes/multimedia");

// Use Routes
app.use("/maps", mapsRoutes);
app.use("/markers", markersRoutes);
app.use("/multimedia", multimediaRoutes);

// Only start the server if not in test mode
if (process.env.NODE_ENV !== "test") {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

// Export app for testing
module.exports = app;


