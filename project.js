const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.json());

// Mock in-memory database
const mockDatabase = {
    "sales_data": [
        { "region": "North", "sales": 10000 },
        { "region": "South", "sales": 15000 }
    ]
};

// Function to convert simple natural language queries to pseudo-SQL
function convertToPseudoSQL(nlQuery) {
    if (nlQuery.toLowerCase().includes("sales in north")) {
        return "SELECT sales FROM sales_data WHERE region='North'";
    } else if (nlQuery.toLowerCase().includes("sales in south")) {
        return "SELECT sales FROM sales_data WHERE region='South'";
    } else {
        return "QUERY_NOT_UNDERSTOOD";
    }
}

// Endpoint to simulate AI-powered data query processing
app.post('/query', (req, res) => {
    const { query } = req.body;
    const sqlQuery = convertToPseudoSQL(query);
    
    if (sqlQuery === "QUERY_NOT_UNDERSTOOD") {
        return res.status(400).json({ error: "Query not understood" });
    }
    
    const result = mockDatabase.sales_data.filter(data => query.toLowerCase().includes(data.region.toLowerCase()));
    res.json({ sqlQuery, result });
});

// Endpoint to explain the query breakdown
app.post('/explain', (req, res) => {
    const { query } = req.body;
    const sqlQuery = convertToPseudoSQL(query);
    res.json({ explanation: `Your query is translated to: ${sqlQuery}` });
});

// Endpoint to validate query feasibility
app.post('/validate', (req, res) => {
    const { query } = req.body;
    const sqlQuery = convertToPseudoSQL(query);
    res.json({ valid: sqlQuery !== "QUERY_NOT_UNDERSTOOD", sqlQuery });
});

// Lightweight authentication middleware
app.use((req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken || authToken !== "Bearer secretToken") {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    next();
});

app.listen(6600, () => {
    console.log(`Mini Data Query Simulation Engine running on http://localhost:6600`);
});
