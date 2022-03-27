# questions_answers_api

Hello World! (๑•́ ᵕ •̀๑)◞ This is an RESTFUL API endpoint for the Questions and Answers module for the Project EcoMock website. This updated API endpoint is a part of an legacy API overhaul.

### Built With
![image](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![image](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![image](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![image](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![image](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

## Testing and Deployment
* Local stress testing with K6 Grafana
* Cloud-based stress testing with Loader.io
* Deployment of Postgresql database, Express servers, and NGINX load balancer with AWS EC2 instances

## Installing Dependencies and Setup
### 1. Fork and clone this repository
### 2. Install dependencies
```bash
npm install
```
### 3. Run servers on local environment
```bash
npm start
```
### 4. Create a dotenv file with the following configurations:
```bash
PG_USER='[insert pg user]'
PG_PASSWORD='[insert pg password]'
PG_HOST='localhost'
PG_PORT='5432'
PG_DATABASE='questions_answers'
SERVER_PORT='3000'
LOADERIO_TOKEN='[insert loader.io token]'
```
## Endpoints
* [List Questions](#list-questions)
* [List Answers](#list-answers)
* [Add a Question](#add-a-question)
* [Add an Answer](#add-an-answer)
* [Mark a Question as Helpful](#mark-a-question-as-helpful)
* [Report a Question](#report-a-question)
* [Mark an Answer as Helpful](#mark-an-answer-as-helpful)
* [Report an Answer](#report-an-answer)

### List Questions
`GET /qa/questions`

| Parameter  | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.         |
| page       | integer | Selects the page of results to return. Default 1.              |
| count      | integer | Specifies how many results per page to return. Default 5.      |

Example Response:
```
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": false,
        "answers": {
          68: {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": false,
        "answers": {
          70: {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          78: {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}
```

### List Answers
`GET /qa/questions/:question_id/answers`

| Parameter  | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.         |

| Query Parameter  | Type    | Description                                                    |
| ---------------- | ------- | -------------------------------------------------------------- |
| page             | integer | Selects the page of results to return. Default 1.              |
| count            | integer | Specifies how many results per page to return. Default 5.      |

Example Response:
```
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```

### Add a Question
`POST /qa/questions`

| Parameter  | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| body       | text    | Text of question being asked.                                  |
| name       | text    | Username for question asker.                                   |
| email      | text    | Email address for question asker.                              |
| product_id | integer | Required ID of the Product for which the question is posted.   |

### Add an Answer
`POST /qa/questions/:question_id/answers`

| Parameter   | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| question_id | integer | Required ID of the question to post the answer for.            |

| Parameter  | Type    | Description                                                    |
| ---------- | ------- | -------------------------------------------------------------- |
| body       | text    | Text of answer for a given question.                           |
| name       | text    | Username for question answerer.                                |
| email      | text    | Email address for question answerer.                           |
| photos     | [text]  | An array of urls corresponding to images to display.           |

### Mark a Question as Helpful
`PUT /qa/questions/:question_id/helpful`

| Parameter   | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| question_id | integer | Required ID of question to update.                             |

### Report a Question
`PUT /qa/questions/:question_id/report`

| Parameter   | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| question_id | integer | Required ID of question to update.                             |

### Mark an Answer as Helpful
`PUT /qa/answers/:answer_id/helpful`

| Parameter   | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| question_id | integer | Required ID of answer to update.                               |

### Report an Answer
`PUT /qa/answers/:answer_id/report`

| Parameter   | Type    | Description                                                    |
| ----------- | ------- | -------------------------------------------------------------- |
| question_id | integer | Required ID of answer to update.                               |

## Contributors
* [Samantha Pham](https://github.com/samanthavpham)
