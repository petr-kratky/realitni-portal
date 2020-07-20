const FormData = require("form-data");
const fetch = require("node-fetch");

const prepareBody = (loopCount, filesAtOnce = 1, text) => {
  const body = new FormData();
  body.append(
    "operations",
    JSON.stringify({
      query:`
mutation($fileInput: Upload!) {
fileUpload(fileInput: $fileInput) {
uploaded
}
}
`,
      variables: {
        file: null,
      },
    })
  );

  // create x-files in one request
  const filesObj = {};
  for (let k = 1; k <= filesAtOnce; k += 1) {
    filesObj[k] = [`variables.fileInput.${k - 1}`];
  }
  body.append("map", JSON.stringify(filesObj));
  for (let k = 1; k <= filesAtOnce; k += 1) {
    body.append(`${k}`, `${text} - ${loopCount}\n`, { filename: `${k}.txt` });
  }
  return body;
};

// https://github.com/jaydenseric/graphql-upload/issues/125
(async () => {
  // test seqentially with timeout
//   for (let i = 0; i < 100; i += 1) {
//     console.log(`looping with wait ${i}`);
//     const body = prepareBody(i, 20, "loop with await");
//     const response = await fetch("http://localhost:3001/api", {
//       method: "POST",
//       body,
//       headers: {
//         cookie: "_csrf=R4BMLZ2hAGtwZwLrHISBefl3",
//         "x-csrf-token": "Moj0HagC-_t-E1zNSduETuMSHcAQMOOKdUI8",
//       },
//     });
//     await new Promise((resolve) => {
//       setTimeout(resolve, 100);
//     });
//   }

//   // test paralelly
//   const requests = [];
//   for (let i = 0; i < 100; i += 1) {
//     console.log(`paralel ${i}`);
//     const body = prepareBody(i, 20, "parallel");
//     requests.push(
//       fetch("http://localhost:3001/api", {
//         method: "POST",
//         body,
//         headers: {
//           cookie: "_csrf=R4BMLZ2hAGtwZwLrHISBefl3",
//           "x-csrf-token": "Moj0HagC-_t-E1zNSduETuMSHcAQMOOKdUI8",
//         },
//       })
//     );
//   }
//   const responses = await Promise.all(requests);

  // test seqentially without timeout
//   for (let i = 0; i < 100; i += 1) {
    console.log(`looping without wait ${1}`);
    const body = prepareBody(1, 20, "loop without await");
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      body,
      headers: {
        cookie: "_csrf=R4BMLZ2hAGtwZwLrHISBefl3",
        "x-csrf-token": "Moj0HagC-_t-E1zNSduETuMSHcAQMOOKdUI8",
      },
    });
    const bodyb = await res.json()
    console.log(bodyb)
//   }
})();
