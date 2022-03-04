const Router = require('express-promise-router');
const db = require('../database');
// const controllers = require('./controllers');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// ap.photo_url
// route to list questions and answers for a given product
router.get('/qa/questions', async (req, res) => {
  try {
    const { product_id } = req.query;
    const { rows } = await db.query(
      `SELECT
      q.question_id,
      q.question_body,
      q.question_date_written,
      q.asker_name,
      q.question_reported,
      q.question_helpful,
      aap.answer_id,
      aap.answer_body,
      aap.answer_date_written,
      aap.answerer_name,
      aap.answer_reported,
      aap.answer_helpful,
      aap.photo_id,
      aap.photo_url
      FROM questions AS q
      LEFT JOIN (
        SELECT
        a.answer_id,
        a.question_id,
        a.answer_body,
        a.answer_date_written,
        a.answerer_name,
        a.answer_reported,
        a.answer_helpful,
        ap.photo_id,
        ap.photo_url
        FROM answers AS a
        LEFT JOIN photos AS ap
        ON a.answer_id = ap.answer_id
      ) AS aap
      ON q.question_id = aap.question_id
      WHERE q.product_id = $1`,
      [product_id]
    );
    res.status(200).send(rows);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to list answers for a given question
router.get('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { rows } = await db.query(
      `SELECT
      a.answer_id,
      a.answer_body,
      a.answer_date_written,
      a.answerer_name,
      a.answer_reported,
      a.answer_helpful,
      ap.photo_id,
      ap.photo_url
      FROM answers AS a
      LEFT JOIN photos AS ap
      ON a.answer_id = ap.answer_id
      WHERE a.question_id = $1`,
      [question_id]
    );
    res.status(200).send(rows);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to add a question for a given product
router.post('/qa/questions', async (req, res) => {
  try {
    const { body, name, email, product_id } = req.body;
    const rows = await db.query(
      `INSERT INTO
      questions(id, product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES (null, ?, ?, SELECT now()::timestamp, ?, ?, false, 0)`,
      [product_id, body, name, email]
    );
    res.status(201).send(rows);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to add an answer for a given question
router.post('/qa/questions/:question_id/answers', async (req, res) => {
  try {

  } catch (error) {
    res.status(400).send(error);
  }
});

// route to mark a given question as helpful
router.put('/qa/questions/:question_id/helpful', async (req, res) => {
  try {

  } catch (error) {
    res.status(400).send(error);
  }
});

// route to report a given question
router.put('/qa/questions/:question_id/report', async (req, res) => {
  try {

  } catch (error) {
    res.status(400).send(error);
  }
});

// route to mark a given answer as helpful
router.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  try {

  } catch (error) {
    res.status(400).send(error);
  }
});

// route to report a given answer
router.put('/qa/answers/:answer_id/report', async (req, res) => {
  try {

  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;