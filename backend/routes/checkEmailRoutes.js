const express = require('express');
const { checkEmailExists } = require('../controllers/checkEmail');  
const router = express.Router();

router.post('/check-email', checkEmailExists);

module.exports = router;
