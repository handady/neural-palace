const express = require('express');
const router = express.Router();

const neuronNodeRoutes = require('./neuronNode');

router.use('/neuronNode', neuronNodeRoutes);

module.exports = router;