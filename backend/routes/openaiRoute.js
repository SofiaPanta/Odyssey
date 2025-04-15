const express = require('express');
const router = express.Router();
const { getAISuggestions } = require('../controllers/openaiController');

router.post('/', getAISuggestions);

module.exports = router;
