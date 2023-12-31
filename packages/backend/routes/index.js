const express = require('express');
const router = express.Router();

const neuronNodeRoutes = require('./neuronNode');
const neuronLinkRoutes = require('./neuronLink');
const neuronPositionsRoutes = require('./neuronPositions');
const cosRoutes = require('./cosRoutes');

router.use('/neuronNode', neuronNodeRoutes);
router.use('/neuronLink', neuronLinkRoutes);
router.use('/neuronPositions', neuronPositionsRoutes);
router.use('/cos', cosRoutes);

module.exports = router;