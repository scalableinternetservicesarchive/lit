import http from 'k6/http'
import { sleep, group, check } from 'k6'
import { Counter, Rate } from 'k6/metrics'

//command for debugging default function the script
//k6 run script.js --http-debug="full" -i 1 -u 1
export const options = {
  scenarios: {
    anonymousUser_scenario: {
      exec: 'anonymousUser',//function to execute
      // startTime: '30s',//DEBUG
      // name of the executor to use
      executor: 'ramping-arrival-rate',
      // common scenario configuration
      startRate: '50',
      timeUnit: '1s',
      // executor-specific configuration
      preAllocatedVUs: 15,
      maxVUs: 15,
      stages: [
        { target: 10, duration: '30s' },
        { target: 0, duration: '1m' },
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
      preAllocatedVUs: 5,
      // setupTimeout: '90s',
      maxVUs: 5,
      stages: [
        { target: 3, duration: '30s' },
        { target: 0, duration: '1m' },
      ],
    },
    registeredReader_scenario: {
      exec: 'registeredReader',//function to execute
      // name of the executor to use
      // startTime: '30s',//DEBUG
      executor: 'ramping-arrival-rate',   //'constant-vus'
      // common scenario configuration
      startRate: '0',
      timeUnit: '1s',
      // executor-specific configuration
      preAllocatedVUs: 5,
      // setupTimeout: '90s',
      maxVUs: 5,
      stages: [
        { target: 3, duration: '30s' },
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
//util function for extracting desired 'authToken' from response header Set-Cookie
//sample Set-Cookie: authToken=7a014db4-048e-4c3d-9e2d-af7836775122; Max-Age=2592000; Path=/; Expires=xxx; HttpOnly
function getCookie(cookie, name) {
  const value = `; ${cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
//util function for extracting userid from response body
function getUserID(body) {
  const matchedStrings = body.match(/apolloState: {"User:(.+?)":/);
  if(matchedStrings === null) {
    console.log("kicked out");
  // console.log(matchedStrings);
    return 2;
  }
  return matchedStrings[1];
}

//util function for extracting workID from response body of a search query
function getFoundedWorkID(body) {
  const idList = body.matchAll(/{"id":(.+?),/);
  return idList;
}

export function anonymousUser() {
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
  group('user flow: anonymous user', function () {
    group('visit homepage', function () {
      http.get('http://localhost:3000/app/index');
      // http.get('http://localhost:3000');//returns different body
    });
    group('view most recent work', function () {
      //TODO: adjust link based on response
      const work = http.get('http://localhost:3000/app/work/1/0');
    });
    group('view serveral chapters', function () {
      http.get('http://localhost:3000/app/work/1/1');
      sleep(3);
      //TODO: Initialize the work with more chapters
      //TODO: get more chapters of the work
    });
  });
}
// export default function () {//DEBUG
export function registeredWriter() {
  var payload = JSON.stringify({
    email: 'test@gmail.com',
    password: 'password',
  });//TODO: log in with different users
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
    group('redirected to profile page as a loggedin user', function() {
      const profilePage = http.get('http://localhost:3000/app/profile');
      check(profilePage, {
        'is status 200': (r) => r.status === 200,
      });
      // const profilePage = http.get('http://localhost:3000/app/profile', { cookies });
      if(profilePage) {
        userID = getUserID(profilePage.body);
      } else {
        console.log("profilePage is null");
        userID = 2;
      }
    });
    group('post new work', function() {
      let createWorkMutation = `
        mutation WorkPost {
          createWork(workUserID:${userID}, workTitle:"new book", workSummary:"new work for load testing created by k6")
        }`;
      const createWork = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createWorkMutation }), {
        headers,
      })
      // console.log("createWork:")//DEBUG
      // console.log(JSON.stringify(createWork, null, 2));//DEBUG
      workID = JSON.parse(createWork.body)["data"]["createWork"];//body = "{"data":{"createWork":125}}"
    });
    group('go to the new work', function() {
      const newWorkPage = http.get(`http://localhost:3000/app/work/${workID}/0`, { cookies });
      sleep(3);
      group('create new chapters', function() {
        let createChapterMutation = `
          mutation ChapterPost {
            addChapter(workID:${workID}, chapterTitle:"new chapter", chapterText:"new chapter for load testing created by k6")
          }`;
        const createChapter = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createChapterMutation }), {
          headers, cookies})
      });
      group('delete the work', function() {
        let deleteWorkMutation = `
          mutation WorkDel {
            deleteWork(workID:${workID})
          }`;
        const deleteWork = http.post('http://localhost:3000/graphql', JSON.stringify({ query: deleteWorkMutation }), {
          headers, cookies});
        check(deleteWork, {
          'is status 200': (r) => r.status === 200,
        });

      });
    });

  });

}

// export default function () {//DEBUG
export function registeredReader() {
  var payload = JSON.stringify({
    email: 'reader@test.com',
    password: 'password',
  });//TODO: log in as different users
  var cookies, workID, userID, bookmarkID;
  group('user flow: Registered Reader', function () {
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
    });
    group('go to home page', function() {
      // const homePage = http.get('http://localhost:3000/app/index', {cookies});
      const homePage = http.get('http://localhost:3000/app/index');

      userID = getUserID(homePage.body);
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
      const searchWork = http.post('http://localhost:3000/graphql', JSON.stringify({ query: searchWorkQuery }), {
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
            const createBookmark = http.post('http://localhost:3000/graphql', JSON.stringify({ query: createBookmarkMutation }), {
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
              const fetchBookmark = http.post('http://localhost:3000/graphql', JSON.stringify({ query: fetchBookmarkQuery }), {
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
              const deleteBookmark = http.post('http://localhost:3000/graphql', JSON.stringify({ query: deleteBookmarkMutation }), {
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