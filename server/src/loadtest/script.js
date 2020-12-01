import http from 'k6/http'
import { sleep, group } from 'k6'
import { Counter, Rate } from 'k6/metrics'
//command for debugging default function the script
//k6 run script.js --http-debug="full" -i 1 -u 1
export const options = {
  scenarios: {
    anonymousUser_scenario: {
      exec: 'anonymousUser',//function to execute
      startTime: '30s',//DEBUG
      // name of the executor to use
      executor: 'ramping-arrival-rate',
      // common scenario configuration
      startRate: '50',
      timeUnit: '1s',
      // executor-specific configuration
      preAllocatedVUs: 50,
      maxVUs: 500,
      stages: [
        { target: 1, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
    },
    registeredWriter_scenario: {
      exec: 'registeredWriter',//function to execute
      // name of the executor to use
      executor: 'ramping-arrival-rate',   //'constant-vus'
      // common scenario configuration
      startRate: '0',
      timeUnit: '1s',
      // executor-specific configuration
      preAllocatedVUs: 2,
      // setupTimeout: '90s',
      maxVUs: 10,
      stages: [
        { target: 5, duration: '30s' },
        { target: 0, duration: '1m' },
      ],
    },
  },
  // thresholds: {
  //   http_req_duration: ['p(99)<5000'], // 99% of requests must complete below 5s
  // },
}

const headers =  {
  'Content-Type': 'application/json',
};
//util function for extracting desired authToken cookie from response header Set-Cookie
function getCookie(cookie, name) {
  const value = `; ${cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function anonymousUser() {
  group('user flow: anonymous user', function () {
    group('visit homepage', function () {
      http.get('http://localhost:3000');
    });
    group('view most recent work', function () {
      //TODO: adjust link based on response
      const work = http.get('http://localhost:3000/app/work/1/0');
    });
    group('view serveral chapters', function () {
      http.get('http://localhost:3000/app/1/1');
      sleep(3);
      //TODO: Initialize the work with more chapters
      //TODO: get more chapters of the work
    });
  });
}

export function registeredWriter() {
  var payload = JSON.stringify({
    email: 'test@gmail.com',
    password: 'password',
  });
  var cookies;
  group('user flow: Registered Writer', function () {
    group('login', function() {
      const login = http.post('http://localhost:3000/auth/login', payload, { headers });
      const setCookieHeader = login.headers["Set-Cookie"]
      const token = getCookie(setCookieHeader, "authToken");
      cookies = {
        authToken: token,
      };
      // console.log("cookie:")//DEBUG
      // console.log(JSON.stringify(cookies))//DEBUG
    });
    group('redirected to profile page as a loggedin user', function() {
      const profilePage = http.get('http://localhost:3000/app/profile', { cookies });
    });
    group('post new work', function() {
      let workUserIdPost = 2; // TODO: adjust based on previous login user
      let createWorkMutation = `
        mutation WorkPost {
          createWork(workUserID:${workUserIdPost}, workTitle:"new book", workSummary:"new work for load testing created by k6")
        }`;
      const createWork = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createWorkMutation }), {
        headers,
      })
    });
    group('go to the new work', function() {
      let workID = 33; // TODO: adjust based on previous generated work
      const newWorkPage = http.get(`http://localhost:3000/app/work/${workID}/0`, { cookies });
      sleep(3);
      group('create new chapters', function() {
        let createChapterMutation = `
          mutation ChapterPost {
            addChapter(workID:${workID}, chapterTitle:"new chapter", chapterText:"new chapter for load testing created by k6")
          }`;
        const createChapter = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createChapterMutation }), {
          headers,})
      });
    });

  });

}

export default function () {
  var payload = JSON.stringify({
    email: 'test@gmail.com',
    password: 'password',
  });
  var cookies;
  group('user flow: Registered Writer', function () {
    group('login', function() {
      const login = http.post('http://localhost:3000/auth/login', payload, { headers });
      const setCookieHeader = login.headers["Set-Cookie"]
      const token = getCookie(setCookieHeader, "authToken");
      cookies = {
        authToken: token,
      };
      // console.log("cookie:")//DEBUG
      // console.log(JSON.stringify(cookies))//DEBUG
    });
    group('redirected to profile page after login', function() {
      const profilePage = http.get('http://localhost:3000/app/profile', { cookies });
    });
    group('go to create page (after clicking "Create Work" button)', function() {
      const createPage = http.get('http://localhost:3000/app/create/', { cookies });
    });
    group('post new work', function() {
      let workUserIdPost = 2; // TODO: adjust based on previous login user
      let createWorkMutation = `
        mutation WorkPost {
          createWork(workUserID:${workUserIdPost}, workTitle:"new book by default", workSummary:"new work for load testing created by k6")
        }`;
      const createWork = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createWorkMutation }), {
        headers, cookies
      })
    });

    group('go to the new work', function() {
      let workID = 33; // TODO: adjust based on previous generated work
      const newWorkPage = http.get(`http://localhost:3000/app/work/${workID}/0`, { cookies });
      sleep(3);
      let createChapterMutation = `
        mutation ChapterPost {
          addChapter(workID:${workID}, chapterTitle:"new chapter", chapterText:"new chapter for load testing created by k6")
        }`;
      const createChapter = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createChapterMutation }), {
        headers
      })
    });
  });
  // recordRates(
  // let query = `
  //   query FetchWorks {
  //     works {
  //       id
  //       title
  //       summary
  //       user {
  //         name
  //       }
  //     }
  //   }`;
  // load homepage resources
  // let query = `
  // query FetchWorks {
  //   works {
  //     id
  //   }
  // }`;

  // // homepage
  // const homePage = http.post('http://localhost:3000/graphql', JSON.stringify({ query: query }), { headers: headers, timeout: 60000 });
  // // view most recent work
  // const work = http.get('http://localhost:3000/app/19/0');
  // // view chapters of the work
  // const chapter1 = http.get('http://localhost:3000/app/19/13');
  // //sleep(60);
  // const chapter2 = http.get('http://localhost:3000/app/19/14');
  // //sleep(60);
  // const chapter3 = http.get('http://localhost:3000/app/19/15');
  // //sleep(60);

  // const login = http.post(
  //   'http://localhost:3000/auth/login',
  //   '{"email":"test2@gmail.com","password":"password"}'
  // )};

  // const resp = http.post(
  //   'http://localhost:3000/graphql',
  //   '{"operationName":"AnswerSurveyQuestion","variables":{"input":{"answer":"🤗","questionId":1}},"query":"mutation AnswerSurveyQuestion($input: SurveyInput!) {\\n  answerSurvey(input: $input)\\n}\\n"}',
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }
  // )
  // )
  // sleep(1)
  // http.get('http://localhost:3000')
}

const count200 = new Counter('status_code_2xx')
const count300 = new Counter('status_code_3xx')
const count400 = new Counter('status_code_4xx')
const count500 = new Counter('status_code_5xx')

const rate200 = new Rate('rate_status_code_2xx')
const rate300 = new Rate('rate_status_code_3xx')
const rate400 = new Rate('rate_status_code_4xx')
const rate500 = new Rate('rate_status_code_5xx')

function recordRates(res) {
  if (res.status >= 200 && res.status < 300) {
    count200.add(1)
    rate200.add(1)
  } else if (res.status >= 300 && res.status < 400) {
    console.log(res.body)
    count300.add(1)
    rate300.add(1)
  } else if (res.status >= 400 && res.status < 500) {
    count400.add(1)
    rate400.add(1)
  } else if (res.status >= 500 && res.status < 600) {
    count500.add(1)
    rate500.add(1)
  }
}