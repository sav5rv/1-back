const express = require('express');
const app = require('./app');
const mongoose = require('./db');

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
