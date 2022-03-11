import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  vus: 100,
  duration: '15s'
};

function getRandomProductId() {
  return Math.floor(Math.random() * 1000011);
}

export default function () {
  const res = http.get(`http://localhost:3000/api/qa/questions/${getRandomProductId()}`);

  sleep(1);
  check(res, {
    'status was 200': (r) => r.status === 200,
    'transaction time < 50ms': r => r.timings.duration < 50,
    'transaction time < 100ms': r => r.timings.duration < 100,
    'transaction time < 200ms': r => r.timings.duration < 200,
    'transaction time < 500ms': r => r.timings.duration < 500,
    'transaction time < 1000ms': r => r.timings.duration < 1000,
    'transaction time < 2000ms': r => r.timings.duration < 2000
  });
}