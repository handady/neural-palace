const express = require('express');
const app = express();
const port = 3001;

// Enable CORS for all requests
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});