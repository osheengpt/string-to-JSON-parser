import "./styles.css";

const parseStringToJson = str => {
  const jsonObj = { and: {} }; //initial JSON Object
  let failed = false; //flag for invalid pattern
  //split to get key value pairs
  const keyValuePairs = str.split(",");

  //iterate over key value pairs
  keyValuePairs.forEach(keyValuePair => {
    let [key, value, wrong] = keyValuePair.split(":");
    const specialCharFormat = /[\W]+/g;

    //check for invalid pattern
    if (!key || specialCharFormat.test(key) || !value || wrong) {
      failed = true;
      return;
    }

    key = key.replace(/_/g, ".");

    if (key.includes("date")) {
      let [from, to] = value.split("--to--");
      const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

      //check for invalid date format
      if (!(dateFormat.test(from) && dateFormat.test(to))) {
        failed = true;
        return;
      }
      jsonObj.and[`${key}`] = {
        between: [`${from}T00:00:00`, `${to}T23:59:59`]
      };
    } else if (value.includes("|")) {
      jsonObj.and[`${key}`] = { inq: value.split("|") };
    } else {
      jsonObj.and[`${key}`] = { eq: value };
    }
  });

  //if invalid pattern found return null otherwise JSON
  return failed ? null : JSON.stringify(jsonObj);
};

console.log(
  parseStringToJson(
    "interview_attendance:P,interview_date:2019-04-15--to--2019-04-15,status:CAP"
  )
);
console.log(
  parseStringToJson(
    "status:all,applied_date:2019-04-15--to--2019-04-15,screen_status:SR|NS"
  )
);
console.log(
  parseStringToJson("location:mumbai|delhi|pune,list_type:S,min_education:1")
);
