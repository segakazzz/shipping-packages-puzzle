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
  { firstName: "Ellen", lastName: "Fairview", negate: false },
  { relationship: "friend", firstName: "Ellen", negate: true },
  { state: "Ohio", firstName: "Ellen", negate: true },
  { event: "birthday", day: "Fri", negate: true },
  { event: "birthday", firstName: "Rick", negate: true },
  { event: "birthday", firstName: "Walter", negate: true },
  // 2. -----------
  { firstName: "Rick", day: "Sat", negate: false },
  { firstName: "Rick", lastName: "Bartley", negate: true },
  // 3. -----------
  { relationship: "father", lastName: "Gray", negate: false },
  { relationship: "father", event: "wedding", negate: true },
  // 4. -----------
  { relationship: "friend", event: "house warming", negate: false },
  { relationship: "friend", state: "Ohio", negate: true },
  // 5. -----------
  { relationship: "cousin", event: "wedding", negate: false },
  { firstName: "Heather", state: "Texas", negate: true },
  { firstName: "Heather", relationship: "sister", negate: false },
  { firstName: "Heather", day: "Wed", negate: true },
  // 6. -----------
  { firstName: "Walter", lastName: "DeForest", negate: true },
  { firstName: "Walter", state: "Washington", negate: true },
  { lastName: "DeForest", state: "Washington", negate: true },
  { event: "anniversary", state: "Montana", negate: false },
  { firstName: "Walter", day: "Sat", negate: true },
  { firstName: "Walter", day: "Wed", negate: true },
  { state: "Washington", day: "Sat", negate: true },
  { lastName: "DeForest", day: "Wed", negate: true },
  // extras...
  // { firstName: "Ellen", event: "wedding", negate: false },
  // { firstName: "Heather", state: "Ohio", negate: false },
  // { firstName: "Walter", day: "Fri", negate: false },
  // { firstName: "Ellen", day: "Wed", negate: false },
  // { firstName: "Heather", event: "birthday", negate: false },
  // { firstName: "Ellen", state: "Washington", negate: false },
  // { firstName: "Rick", lastName: "DeForest", negate: false },
  // { firstName: "Walter", event: "anniversary", negate: false },
];

candidates = generateNewCanditates(candidates, conditions)
// console.log(generateExtraConditions(candidates))
let newCandidates = generateNewCanditates(candidates, generateExtraConditions(candidates))
// console.log(newCandidates)
newCandidates = generateNewCanditates(newCandidates, generateExtraConditions(newCandidates))
newCandidates = generateNewCanditates(newCandidates, generateExtraConditions(newCandidates))

//console.log(newCandidates, newCandidates.length) 
console.log("+++++++  summary  +++++++++++");
let summary = {}
newCandidates.forEach(function(candidate){
    let obj = {
        lastName: [],
        state: [],
        event: [],
        relationship: [],
        day: []
    }
    if (Object.keys(summary).indexOf(candidate.firstName) !== -1){
        obj = summary[candidate.firstName]
    }
    Object.keys(obj).forEach(function(key){
        if (obj[key].indexOf(candidate[key]) === -1 ){
            obj[key].push(candidate[key])
        }    
    })
    summary[candidate.firstName] = obj
})
console.log(summary)

function generateNewCanditates(candidates, conditions){
    conditions.forEach(function(cond) {
      Object.keys(cond).forEach(function(key) {
        try {
          if (key !== "negate" && data[key].indexOf(cond[key]) === -1) {
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
  return candidates  
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
      if (i !== j){
        Object.keys(checkOthers).forEach(function(key) {
          if (
            candidates[i].firstName !== candidates[j].firstName &&
            candidates[i][key] === candidates[j][key]
          ) {
            checkOthers[key]++;
          } else if ( candidates[i].firstName === candidates[j].firstName &&
            candidates[i][key] !== candidates[j][key]){
              checkSelf[key]++;
            }
        });  
      }
    }
    console.log(candidates[i], checkOthers)
    Object.keys(checkOthers).forEach(function(key) {
      if (checkOthers[key] === 0) {
        let condition = {};
        condition["firstName"] = candidates[i].firstName;
        condition[key] = candidates[i][key];
        condition["negate"] = false;
        newConditions.push(condition);
      }
      if (checkSelf[key] === 0) {
        let condition = {};
        condition["firstName"] = candidates[i].firstName;
        condition[key] = candidates[i][key];
        condition["negate"] = false;
        newConditions.push(condition);
      }
    })
  }
  return newConditions
}


function checkMaybe(obj, condition) {
  let keyA = Object.keys(condition)[0];
  let keyB = Object.keys(condition)[1];
  let negate = condition[Object.keys(condition)[2]];
  if (negate) {
    return !(obj[keyA] === condition[keyA] && obj[keyB] === condition[keyB]);
  } else {
    return (obj[keyA] === condition[keyA]) === (obj[keyB] === condition[keyB]);
  }
}

function makeNewCandidates(candidates, conditions) {
  let newCandidates = [];
  candidates.forEach(function(obj) {
    if (checkMaybe(obj, conditions)) {
      newCandidates.push(obj);
    }
  });
  return newCandidates;
}
