// Original Data
let data = {
  firstName: ["Ellen", "Heather", "Rick", "Walter"],
  lastName: ["Bartley", "DeForest", "Fairview", "Gray"],
  state: ["Ohio", "Montana", "Texas", "Washington"],
  event: ["anniversary", "birthday", "house warming", "wedding"],
  relationship: ["cousin", "father", "friend", "sister"],
  day: ["Wed", "Thu", "Fri", "Sat"]
};

// Make candidates of combination
let candidates = [];

data.firstName.forEach(function(f) {
  data.lastName.forEach(function(l) {
    data.state.forEach(function(s) {
      data.event.forEach(function(e) {
        data.relationship.forEach(function(r) {
          data.day.forEach(function(d) {
            candidates.push({
              firstName: f,
              lastName: l,
              state: s,
              event: e,
              relationship: r,
              day: d
            });
          });
        });
      });
    });
  });
});

// Conditions
let conditions = [
  // 1.-----------
  {
    firstName: "Ellen",
    lastName: "Fairview",
    negate: false,
    function: applySimpleCondition
  },
  {
    relationship: "friend",
    firstName: "Ellen",
    negate: true,
    function: applySimpleCondition
  },
  {
    state: "Ohio",
    firstName: "Ellen",
    negate: true,
    function: applySimpleCondition
  },
  {
    event: "birthday",
    day: "Fri",
    negate: true,
    function: applySimpleCondition
  },
  {
    event: "birthday",
    firstName: "Rick",
    negate: true,
    function: applySimpleCondition
  },
  {
    event: "birthday",
    firstName: "Walter",
    negate: true,
    function: applySimpleCondition
  },
  // 2. -----------
  {
    firstName: "Rick",
    day: "Sat",
    negate: false,
    function: applySimpleCondition
  },
  {
    firstName: "Rick",
    lastName: "Bartley",
    negate: true,
    function: applySimpleCondition
  },
  // 3. -----------
  {
    relationship: "father",
    lastName: "Gray",
    negate: false,
    function: applySimpleCondition
  },
  {
    relationship: "father",
    event: "wedding",
    negate: true,
    function: applySimpleCondition
  },
  // 4. -----------
  {
    relationship: "friend",
    event: "house warming",
    negate: false,
    function: applySimpleCondition
  },
  {
    relationship: "friend",
    state: "Ohio",
    negate: true,
    function: applySimpleCondition
  },
  // 5. -----------
  {
    relationship: "cousin",
    event: "wedding",
    negate: false,
    function: applySimpleCondition
  },
  {
    firstName: "Heather",
    state: "Texas",
    negate: true,
    function: applySimpleCondition
  },
  {
    firstName: "Heather",
    relationship: "sister",
    negate: false,
    function: applySimpleCondition
  },
  {
    firstName: "Heather",
    day: "Wed",
    negate: true,
    function: applySimpleCondition
  },
  // 6. -----------
  {
    firstName: "Walter",
    lastName: "DeForest",
    negate: true,
    function: applySimpleCondition
  },
  {
    firstName: "Walter",
    state: "Washington",
    negate: true,
    function: applySimpleCondition
  },
  {
    lastName: "DeForest",
    state: "Washington",
    negate: true,
    function: applySimpleCondition
  },
  {
    event: "anniversary",
    state: "Montana",
    negate: false,
    function: applySimpleCondition
  },
  {
    firstName: "Walter",
    day: "Sat",
    negate: true,
    function: applySimpleCondition
  },
  {
    firstName: "Walter",
    day: "Wed",
    negate: true,
    function: applySimpleCondition
  },
  {
    state: "Washington",
    day: "Sat",
    negate: true,
    function: applySimpleCondition
  },
  {
    lastName: "DeForest",
    day: "Wed",
    negate: true,
    function: applySimpleCondition
  }
  // extras...
  // { firstName: "Ellen", event: "wedding", negate: false },
  // { firstName: "Heather", state: "Ohio", negate: false },
  // { firstName: "Walter", day: "Fri", negate: false },
  // { firstName: "Ellen", day: "Wed", negate: false },
  // { firstName: "Heather", event: "birthday", negate: false },
  // { firstName: "Ellen", state: "Washington", negate: false },
  //{ firstName: "Rick", lastName: "DeForest", negate: false },
  // { firstName: "Walter", event: "anniversary", negate: false },
];

while(candidates.length > 4){
  let beginLength = candidates.length 
  candidates = generateNewCanditates(candidates, conditions);
  // console.log(generateExtraConditions(candidates))
  
  candidates = generateNewCanditates(
    candidates,
    generateExtraConditionWithNextDay(candidates)
  );
  
  candidates = generateNewCanditates(
    candidates,
    generateExtraConditions(candidates)
  );
  if (candidates.length === beginLength){
    console.log('break!!!')
    break;
  }
}

console.log("+++++++  summary  +++++++++++");
let summary = {};
candidates.forEach(function(candidate) {
  let obj = {
    lastName: [],
    state: [],
    event: [],
    relationship: [],
    day: []
  };
  if (Object.keys(summary).indexOf(candidate.firstName) !== -1) {
    obj = summary[candidate.firstName];
  }
  Object.keys(obj).forEach(function(key) {
    if (obj[key].indexOf(candidate[key]) === -1) {
      obj[key].push(candidate[key]);
    }
  });
  summary[candidate.firstName] = obj;
});
console.log(summary);

function generateNewCanditates(candidates, conditions) {
  if(conditions){
    conditions.forEach(function(cond) {
      Object.keys(cond).forEach(function(key) {
        try {
          if (
            key !== "negate" &&
            key !== "function" &&
            data[key].indexOf(cond[key]) === -1
          ) {
            throw new Error("error" + JSON.stringify(cond));
          }
        } catch (e) {
          console.error(e);
        }
      });
      console.log("--------------------------");
      candidates = makeNewCandidates(candidates, cond);
      console.log(cond, candidates.length);
    });  
  }
  return candidates;
}

function generateExtraConditions(candidates) {
  let newConditions = [];
  for (let i = 0; i < candidates.length; i++) {
    let checkOthers = {
      lastName: 0,
      state: 0,
      event: 0,
      relationship: 0,
      day: 0
    };
    let checkSelf = {
      lastName: 0,
      state: 0,
      event: 0,
      relationship: 0,
      day: 0
    };

    for (let j = 0; j < candidates.length; j++) {
      if (i !== j) {
        Object.keys(checkOthers).forEach(function(key) {
          if (
            candidates[i].firstName !== candidates[j].firstName &&
            candidates[i][key] === candidates[j][key]
          ) {
            checkOthers[key]++;
          } else if (
            candidates[i].firstName === candidates[j].firstName &&
            candidates[i][key] !== candidates[j][key]
          ) {
            checkSelf[key]++;
          }
        });
      }
    }
    // console.log(candidates[i], checkOthers);
    Object.keys(checkOthers).forEach(function(key) {
      if (checkOthers[key] === 0 || checkSelf[key] === 0) {
        let condition = {};
        condition["firstName"] = candidates[i].firstName;
        condition[key] = candidates[i][key];
        condition["negate"] = false;
        condition["function"] = applySimpleCondition;
        newConditions.push(condition);
      }
    });
  }
  return newConditions;
}

function applySimpleCondition(obj, condition) {
  let keyA = Object.keys(condition)[0];
  let keyB = Object.keys(condition)[1];
  let negate = condition[Object.keys(condition)[2]];
  if (negate) {
    return !(obj[keyA] === condition[keyA] && obj[keyB] === condition[keyB]);
  } else {
    return (obj[keyA] === condition[keyA]) === (obj[keyB] === condition[keyB]);
  }
}

function generateExtraConditionWithNextDay(candidates) {
  let extraConditions = [];
  let possibleCandidates = [];
  let indexTaken = [];
  for (let i = 0; i < candidates.length; i++) {
    if (candidates[i]["firstName"] === "Walter") {
      let nextDay = getNextDay(candidates[i]["day"]);
      for (let j = 0; j < candidates.length; j++) {
        if (
          candidates[j]["day"] === nextDay &&
          candidates[j]["lastName"] === "DeForest" && indexTaken.indexOf(j) === -1
        ) {
          possibleCandidates.push(candidates[j]);
          indexTaken.push(j)
        }
      }
    }
  }
  if (possibleCandidates.length === 1) {
    Object.keys(possibleCandidates[0]).forEach(function(key) {
      if (key !== "firstName") {
        let condition = {};
        condition["firstName"] = possibleCandidates[0].firstName;
        condition[key] = possibleCandidates[0][key];
        condition["negate"] = false;
        condition["function"] = applySimpleCondition;
        extraConditions.push(condition);
      }
    });
    return extraConditions;
  }

}

function getNextDay(day) {
  return data.day[data.day.indexOf(day) + 1];
}


function makeNewCandidates(candidates, condition) {
  let newCandidates = [];
  candidates.forEach(function(obj) {
    let func = condition.function;
    if (func(obj, condition, candidates)) {
      newCandidates.push(obj);
    }
  });
  return newCandidates;
}
