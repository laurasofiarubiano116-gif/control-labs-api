const express = require('express');

const loanController = require('../controllers/loanController');

const router = express.Router();

router.post('/', loanController.createLoan);

router.get('/', loanController.getAllLoans);

router.get('/:id', loanController.getLoanById);

router.put('/:id/accept', loanController.acceptLoan);

module.exports = router;