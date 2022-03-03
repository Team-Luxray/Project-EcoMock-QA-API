const express = require('express');
const router = express.Router();
// const controllers = require('./controllers');

// route to list questions and answers for a given product
router.get('/qa/questions');

// route to list answers for a given question
router.get('/qa/questions/:question_id/answers');

// route to add a question for a given product
router.post('/qa/questions');

// route to add an answer for a given question
router.post('/qa/questions/:question_id/answers');

// route to mark a given question as helpful
router.put('/qa/questions/:question_id/helpful');

// route to report a given question
router.put('/qa/questions/:question_id/report');

// route to mark a given answer as helpful
router.put('/qa/answers/:answer_id/helpful');

// route to report a given answer
router.put('/qa/answers/:answer_id/report');

module.exports = router;