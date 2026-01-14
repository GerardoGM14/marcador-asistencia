const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createClient, getClients, deleteClient } = require('../controllers/clientsController');

router.post('/', upload.array('tURLDocumentacion', 5), createClient);
router.get('/', getClients);
router.delete('/:id', deleteClient);

module.exports = router;
