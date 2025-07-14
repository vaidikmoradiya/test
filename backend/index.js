require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDb } = require('./db/db');
const indexRoute = require('./routes/indexROutes');
const app = express();

const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use("/api",indexRoute);
app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    connectDb();
    console.log(`Server Is Connected At Port ${port}`);
});