const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/message', (req, res) => {
    res.json({ message: "test" });
});

app.listen(5000, () => {
    console.log("Backend start http://localhost:5000");
});
