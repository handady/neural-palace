const express = require('express');
const router = express.Router();

const neuronNodeRoutes = require('./neuronNode');
const cosRoutes = require('./cosRoutes');

router.use('/neuronNode', neuronNodeRoutes);
router.use('/cos', cosRoutes);

module.exports = router;