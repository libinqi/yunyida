'use strict';

var express = require('express');
var controller = require('./upload.controller');

var router = express.Router();

router.get('/files', controller.index);

module.exports = router;
