import http from 'k6/http'
import { sleep, group, check } from 'k6'
import { Counter, Rate } from 'k6/metrics'
// cd server/src/loadtest
//command for debugging default function the script
//k6 run script.js --http-debug="full" -i 1 -u 1

export const options = {
  scenarios: {
    anonymousUser_scenario: {
      exec: 'anonymousUser',//function to execute
      // startTime: '30s',//DEBUG
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 2 }, // below normal load
        { duration: '5m', target: 2 },
        { duration: '1m', target: 4 }, // normal load
        { duration: '5m', target: 4 },
        { duration: '1m', target: 8 }, // around the breaking point
        { duration: '5m', target: 8 },
        { duration: '1m', target: 15 }, // beyond the breaking point
        { duration: '5m', target: 15 },
        { duration: '1m', target: 0 }, // scale down. Recovery stage.
      ],
      gracefulRampDown: '30s',
    },
    registeredWriter_scenario: {
      exec: 'registeredWriter',//function to execute
      // startTime: '30s',//DEBUG
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 1 }, // below normal load
        { duration: '5m', target: 1 },
        { duration: '1m', target: 2 }, // normal load
        { duration: '5m', target: 2 },
        { duration: '1m', target: 3 }, // around the breaking point
        { duration: '5m', target: 3 },
        { duration: '1m', target: 4 }, // beyond the breaking point
        { duration: '5m', target: 4 },
        { duration: '1m', target: 0 }, // scale down. Recovery stage.
      ],
      gracefulRampDown: '30s',
    },
    newReader_scenario: {
      exec: 'newReader',//function to execute
      // startTime: '30s',//DEBUG
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '1m', target: 2 }, // below normal load
        { duration: '5m', target: 2 },
        { duration: '1m', target: 4 }, // normal load
        { duration: '5m', target: 4 },
        { duration: '1m', target: 6 }, // around the breaking point
        { duration: '5m', target: 6 },
        { duration: '1m', target: 8 }, // beyond the breaking point
        { duration: '5m', target: 8 },
        { duration: '1m', target: 0 }, // scale down. Recovery stage.
      ],
      gracefulRampDown: '30s',
    },
        // anonymousUser_scenario: {
    //   exec: 'anonymousUser',//function to execute
    //   // startTime: '30s',//DEBUG
    //   executor: 'ramping-vus',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '30s', target: 5 }, // below normal load
    //     { duration: '3m', target: 5 },
    //     { duration: '1m', target: 30 }, // normal load
    //     { duration: '3m', target: 30 },
    //     { duration: '1m', target: 40 }, // around the breaking point
    //     { duration: '3m', target: 40 },
    //     { duration: '1m', target: 50 }, // beyond the breaking point
    //     { duration: '3m', target: 50 },
    //     { duration: '1m', target: 0 }, // scale down. Recovery stage.
    //   ],
    //   gracefulRampDown: '0s',
    // },

    // registeredWriter_scenario: {
    //   exec: 'registeredWriter',//function to execute
    //   // name of the executor to use
    //   executor: 'ramping-arrival-rate',   //'constant-vus'
    //   // common scenario configuration
    //   startRate: '1',
    //   timeUnit: '1s',
    //   // executor-specific configuration
    //   preAllocatedVUs: 5,
    //   // setupTimeout: '90s',
    //   maxVUs: 5,
    //   stages: [
    //     { target: 1, duration: '4m' },
    //     { target: 3, duration: '4m' },
    //     { target: 5, duration: '4m' },
    //     { target: 0, duration: '30s' },
    //   ],
    //   gracefulStop: '1m',
    // },
    // newReader_scenario: {
    //   exec: 'newReader',//function to execute
    //   // name of the executor to use
    //   // startTime: '30s',//DEBUG
    //   executor: 'ramping-arrival-rate',   //'constant-vus'
    //   // common scenario configuration
    //   startRate: '1',
    //   timeUnit: '1s',
    //   // executor-specific configuration
    //   preAllocatedVUs: 5,
    //   // setupTimeout: '90s',
    //   maxVUs: 10,
    //   stages: [
    //     { target: 3, duration: '4m' },
    //     { target: 5, duration: '4m' },
    //     { target: 10, duration: '4m' },
    //     { target: 0, duration: '30s' },
    //   ],
    //   gracefulStop: '1m',
    // },
    // newReader_scenario: {
    //   exec: 'newReader',//function to execute
    //   executor: 'constant-arrival-rate',
    //   rate: 1,
    //   maxVUs: 10,
    //   duration: '10m',
    //   preallocatedVUs: 10,
    // },
  },
  // thresholds: {
  //   http_req_duration: ['p(99)<5000'], // 99% of requests must complete below 5s
  // },
}

var currentUserIndex = 0;
const headers =  {
  'Content-Type': 'application/json',
};
//util function for extracting desired 'authToken' from response header Set-Cookie
//sample Set-Cookie: authToken=7a014db4-048e-4c3d-9e2d-af7836775122; Max-Age=2592000; Path=/; Expires=xxx; HttpOnly
function getCookie(cookie, name) {
  const value = `; ${cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
//util function for extracting userid from response body
function getUserID(msg , body) {
  const matchedStrings = body.match(/apolloState: {"User:(.+?)":/);
  if(matchedStrings === null) {
    console.log(msg + "-kicked out. Using the default userid");
    return 1;//use the default user
  } else {
    console.log(msg + "-get user id " + matchedStrings[1]);
    return matchedStrings[1];
  }
}

//util function for extracting workID from response body of a search query
function getFoundedWorkID(body) {
  const idList = body.matchAll(/{"id":(.+?),/);
  return idList;
}

//UTIL function for getting random output
// console.log(getRandomInt(3)); // expected output: 0, 1 or 2
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// export default function() {//DEBUG
export function anonymousUser() {
  group('user flow: anonymous user', function () {
    group('visit homepage', function () {
      const homepage = http.get('http://localhost:3000/app/index');
      // http.get('http://localhost:3000');//returns different body
      check(homepage, {
        'is status 200': (r) => r.status === 200,
      });
    });
    group('view most recent work', function () {
      //TODO: adjust link based on response
      const work = http.get('http://localhost:3000/app/work/1/0');
      check(work, {
        'is status 200': (r) => r.status === 200,
      });
    });
    group('view serveral chapters', function () {
      const ch2 = http.get('http://localhost:3000/app/work/1/2');
      sleep(3);
      const ch3  = http.get('http://localhost:3000/app/work/1/3');
      const ch1 = http.get('http://localhost:3000/app/work/1/1');
      sleep(3);
      check(ch1, {
        'is status 200': (r) => r.status === 200,
      });
      check(ch2, {
        'is status 200': (r) => r.status === 200,
      });
      check(ch3, {
        'is status 200': (r) => r.status === 200,
      });
    });
  });
}
// export default function () {//DEBUG
export function registeredWriter() {
  // const randNum = getRandomInt(11);
  var payload = JSON.stringify({
    email: `writer${__VU}@test.com`,
    password: 'password',
  });
  console.log(payload);
  var cookies, workID, userID;
  group('user flow: Registered Writer', function () {
    group('login', function() {
      const login = http.post('http://localhost:3000/auth/login', payload, { headers });
      check(login, {
        'is status 200': (r) => r.status === 200,
      });

      const setCookieHeader = login.headers["Set-Cookie"]
      const token = getCookie(setCookieHeader, "authToken");
      cookies = {
        authToken: token,
      };
      // console.log("cookie:")//DEBUG
      // console.log(JSON.stringify(cookies))//DEBUG
    });
    group('redirected to profile page', function() {
      const profilePage = http.get('http://localhost:3000/app/profile');
      check(profilePage, {
        'is status 200': (r) => r.status === 200,
      });
      // const profilePage = http.get('http://localhost:3000/app/profile', { cookies });
      userID = getUserID("login", profilePage.body);

    group('post new work', function() {
      let createWorkMutation = `
        mutation WorkPost {
          createWork(workUserID:${userID}, workTitle:"new book", workSummary:"new work for load testing created by k6")
        }`;
      const createWork = http.post('http://localhost:3000/graphql?name=createWorkMutation', JSON.stringify({ query: createWorkMutation }), {
        headers,
      })
      check(createWork, {
        'is status 200': (r) => r.status === 200,
      });
      // console.log("createWork:")//DEBUG
      // console.log(JSON.stringify(createWork, null, 2));//DEBUG
      workID = JSON.parse(createWork.body)["data"]["createWork"];//body = "{"data":{"createWork":125}}"
      if(workID === null) {
        console.log("Debugging createWork");
        console.log(JSON.stringify(createWork, null, 2));
      }
    });
    group('go to the new work', function() {
      const newWorkPage = http.get(`http://localhost:3000/app/work/${workID}/0`, { cookies });
      check(newWorkPage, {
        'is status 200': (r) => r.status === 200,
      });
      group('create new chapters', function() {
        let createChapterMutation = `
          mutation ChapterPost {
            addChapter(workID:${workID}, chapterTitle:"new chapter", chapterText:"new chapter for load testing created by k6")
          }`;
        const createChapter = http.post('http://localhost:3000/graphql?name=createChapterMutation', JSON.stringify({ query: createChapterMutation }), {
          headers, cookies});
        check(createChapter, {
          'is status 200': (r) => r.status === 200,
        });
      });
      group('delete the work', function() {
        let deleteWorkMutation = `
          mutation WorkDel {
            deleteWork(workID:${workID})
          }`;
        const deleteWork = http.post('http://localhost:3000/graphql?name=deleteWorkMutation', JSON.stringify({ query: deleteWorkMutation }), {
          headers });
        // console.log("deleting work: " + workID);
        if(deleteWork.status !== 200) {
          console.log(JSON.stringify(deleteWork, null, 2));
        }
        check(deleteWork, {
          'is status 200': (r) => r.status === 200,
        });

      });
    });
  });
  });

}

// export default function () {//DEBUG
export function newReader() {
  var payload = JSON.stringify({
    email: `reader${__VU}@test.com`,
    name: `Test Reader${__VU}`,
    });
  console.log(payload)
  var cookies, workID, userID, bookmarkID;
  group('user flow: signup new Reader', function () {
    group('signup', function() {
      const signup = http.post('http://localhost:3000/auth/createUser', payload, { headers });
      check(signup, {
        'is status 200': (r) => r.status === 200,
      });
      const setCookieHeader = signup.headers["Set-Cookie"]
      const token = getCookie(setCookieHeader, "authToken");
      cookies = {
        authToken: token,
      };
    });
    group('go to home page', function() {
      // const homePage = http.get('http://localhost:3000/app/index', {cookies});
      const homePage = http.get('http://localhost:3000/app/index');
      check(homePage, {
        'is status 200': (r) => r.status === 200,
      });
      userID = getUserID("signup", homePage.body);
      // console.log(userID);//DEBUG
      //console.log(JSON.stringify(homePage, null, 2));//DEBUG
    });
    group('search for a work', function() {
      let searchWord = "gameofthrones"; // TODO: adjust based on previous login user
      let searchWorkQuery = `
      query FetchWorksSearch {
        targetWorks(targetWork:"${searchWord}") {
          id
          title
          summary
          user {
            name
          }
        }
      }`;
      const searchWork = http.post('http://localhost:3000/graphql?name=searchWorkQuery', JSON.stringify({ query: searchWorkQuery }), {
        headers,
      })
      // console.log(JSON.stringify(searchWork.body, null, 2));//DEBUG
      check(searchWork, {
        'is status 200': (r) => r.status === 200,
      });
      const workIDList = getFoundedWorkID(searchWork.body);
      for(const resultID of workIDList) {
        workID = resultID[1];
        group('browse the founded work ' + workID , function() {
          const searchedWorkPage = http.get(`http://localhost:3000/app/work/${workID}/0`);
          check(searchedWorkPage, {
            'is status 200': (r) => r.status === 200,
          });
          sleep(3);
          group('bookmark the work ' + workID , function() {
            let createBookmarkMutation = `
              mutation BookmarkCreate {
                createBookmark(userID:${userID}, workID:${workID})
              }`;
            const createBookmark = http.post('http://localhost:3000/graphql?name=createBookmark', JSON.stringify({ query: createBookmarkMutation }), {
              headers,
            })
            check(createBookmark, {
              'is status 200': (r) => r.status === 200,
            });
            bookmarkID = JSON.parse(createBookmark.body)["data"]["createBookmark"];//body = "{"data":{"createBookmark":14}} "
            // console.log(bookmarkID);//DEBUG
            group('the page will fetch bookmark again to update itself', function() {
              let fetchBookmarkQuery = `
              query FetchBookmark {
                bookmarks {
                  id
                  user {
                    id
                  }
                  work {
                    title
                    id
                  }
                }
              }`
              const fetchBookmark = http.post('http://localhost:3000/graphql?name=fetchBookmark', JSON.stringify({ query: fetchBookmarkQuery }), {
                headers,
              })

              check(fetchBookmark, {
                'is status 200': (r) => r.status === 200,
              });
            });
            group('go to "Bookmark" page', function() {
              const bookmarkPage = http.get('http://localhost:3000/app/bookmark');
              check(bookmarkPage, {
                'is status 200': (r) => r.status === 200,
              });
            });
            group('delete the bookmark', function() {
              let deleteBookmarkMutation = `
              mutation BookmarkDel {
                deleteBookmark(bookmarkID:${bookmarkID})
              }`;
              const deleteBookmark = http.post('http://localhost:3000/graphql?name=deleteBookmark', JSON.stringify({ query: deleteBookmarkMutation }), {
                headers,
              })
              check(deleteBookmark, {
                'is status 200': (r) => r.status === 200,
              });
            });
          });
        });
          break;//execute test over the first search result only
      }
    });
  });

}
// export default function () {
  // ---------- ORIGINAL CODE ------------
  // recordRates(
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
// }

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