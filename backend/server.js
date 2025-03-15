// Import libraries

const express = require('express');
const cors = require ('cors');
const app = express();

app.use(cors());
app.use(express.json());

//Launch the server

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port <http://localhost:${port}>`);
});

//First endpoint
app.get("/", (req, res) => {
    res.send("MapAlbum backend is running");
  });