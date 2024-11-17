const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Pool
const pool = new Pool({
    user: "your_db_user",
    host: "localhost",
    database: "yourr_database_name",
    password: "root",
    port: 3360,
});

// API Endpoints
app.post("/contacts", async (req, res) => {
    const { firstName, lastName, email, phoneNumber, company, jobTitle } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO contacts (first_name, last_name, email, phone_number, company, job_title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [firstName, lastName, email, phoneNumber, company, jobTitle]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/contacts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM contacts ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, company, jobTitle } = req.body;
    try {
        const result = await pool.query(
            "UPDATE contacts SET first_name=$1, last_name=$2, email=$3, phone_number=$4, company=$5, job_title=$6 WHERE id=$7 RETURNING *",
            [firstName, lastName, email, phoneNumber, company, jobTitle, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/contacts/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM contacts WHERE id=$1", [id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
