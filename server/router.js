const Router = require('express-promise-router');
const db = require('../database');

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// route to list questions and answers for a given product
router.get('/qa/questions', async (req, res) => {
  try {
    const product_id = req.query.product_id;
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const offset = count * page - count
    const { rows } = await db.query(
      `SELECT
      q.question_id,
      q.question_body,
      q.question_date_written,
      q.asker_name,
      q.question_reported,
      q.question_helpful,
      json_agg(
        DISTINCT aap.*
      ) AS answers
      FROM questions AS q
      LEFT JOIN (
        SELECT
        a.question_id,
        a.answer_id,
        a.answer_body,
        a.answer_date_written,
        a.answerer_name,
        a.answer_reported,
        a.answer_helpful,
        json_build_object(
          'urls', array_remove(array_agg(DISTINCT ap.photo_url), NULL)
        ) AS photos
        FROM answers AS a
        LEFT JOIN photos AS ap
        USING (answer_id)
        WHERE a.answer_reported = false
        GROUP BY a.answer_id
      ) AS aap
      USING (question_id)
      WHERE q.product_id = $1
      AND q.question_reported = false
      GROUP BY q.question_id
      LIMIT $2
      OFFSET $3`,
      [product_id, count, offset]
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
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const offset = count * page - count
    const { rows } = await db.query(
      `SELECT
      a.answer_id,
      a.answer_body,
      a.answer_date_written,
      a.answerer_name,
      a.answer_reported,
      a.answer_helpful,
      json_build_object(
        'urls', array_remove(array_agg(DISTINCT ap.photo_url), NULL)
      ) AS photos
      FROM answers AS a
      LEFT JOIN photos AS ap
      USING (answer_id)
      WHERE a.question_id = $1
      AND a.answer_reported = false
      GROUP BY a.answer_id
      LIMIT $2
      OFFSET $3`,
      [question_id, count, offset]
    );
    const result = {
      question_id: question_id,
      results: rows
    }
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to add a question for a given product
router.post('/qa/questions', async (req, res) => {
  try {
    const { product_id, question_body, asker_name, asker_email } = req.body;
    const postedQuestion = await db.query(
      `INSERT INTO questions (product_id, question_body, question_date_written, asker_name, asker_email, question_reported, question_helpful)
      VALUES ($1, $2, current_timestamp, $3, $4, FALSE, 0)`,
      [product_id, question_body, asker_name, asker_email]
    );
    res.status(201).send(`successfully posted question: ${question_body}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to add an answer for a given question
router.post('/qa/questions/:question_id/answers', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { answer_body, answerer_name, answerer_email, answer_photos } = req.body;
    const postedAnswer = await db.query(
      `INSERT INTO answers (question_id, answer_body, answer_date_written, answerer_name, answerer_email, answer_reported, answer_helpful)
      VALUES ($1, $2, current_timestamp, $3, $4, FALSE, 0)
      RETURNING answer_id`,
      [question_id, answer_body, answerer_name, answerer_email]
    );
    const photo_answer_id = postedAnswer.rows[0].answer_id
    answer_photos.forEach((photo) => {
      db.query(
        `INSERT INTO photos (answer_id, photo_url)
        VALUES ($1, $2)`,
        [photo_answer_id, photo]
      )
    });
    res.status(201).send(`successfully posted answer: ${answer_body}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to mark a given question as helpful
router.put('/qa/questions/:question_id/helpful', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { rows } = await db.query(
      `UPDATE questions
      SET question_helpful = question_helpful + 1
      WHERE question_id = $1`,
      [question_id]
    );
    res.status(204).send(`successfully marked question ${question_id} as helpful`);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to report a given question
router.put('/qa/questions/:question_id/report', async (req, res) => {
  try {
    const { question_id } = req.params;
    const { rows } = await db.query(
      `UPDATE questions
      SET question_reported = true
      WHERE question_id = $1`,
      [question_id]
    );
    res.status(204).send(`successfully reported question ${question_id}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to mark a given answer as helpful
router.put('/qa/answers/:answer_id/helpful', async (req, res) => {
  try {
    const { answer_id } = req.params;
    const { rows } = await db.query(
      `UPDATE answers
      SET answer_helpful = answer_helpful + 1
      WHERE answer_id = $1`,
      [answer_id]
    );
    res.status(204).send(`successfully marked answer ${answer_id} as helpful`);
  } catch (error) {
    res.status(400).send(error);
  }
});

// route to report a given answer
router.put('/qa/answers/:answer_id/report', async (req, res) => {
  try {
    const { answer_id } = req.params;
    const { rows } = await db.query(
      `UPDATE answers
      SET answer_reported = true
      WHERE answer_id = $1`,
      [answer_id]
    );
    res.status(204).send(`successfully reported answer ${answer_id}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;