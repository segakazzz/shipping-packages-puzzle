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
  { firstName: "Ellen", lastName: "Fairview", negate: false, function: applySimpleCondition },
  { relationship: "friend", firstName: "Ellen", negate: true, function: applySimpleCondition },
  { state: "Ohio", firstName: "Ellen", negate: true, function: applySimpleCondition },
  { event: "birthday", day: "Fri", negate: true, function: applySimpleCondition },
  { event: "birthday", firstName: "Rick", negate: true, function: applySimpleCondition },
  { event: "birthday", firstName: "Walter", negate: true, function: applySimpleCondition },
  // 2. -----------
  { firstName: "Rick", day: "Sat", negate: false, function: applySimpleCondition },
  { firstName: "Rick", lastName: "Bartley", negate: true, function: applySimpleCondition },
  // 3. -----------
  { relationship: "father", lastName: "Gray", negate: false, function: applySimpleCondition },
  { relationship: "father", event: "wedding", negate: true, function: applySimpleCondition },
  // 4. -----------
  { relationship: "friend", event: "house warming", negate: false, function: applySimpleCondition },
  { relationship: "friend", state: "Ohio", negate: true, function: applySimpleCondition },
  // 5. -----------
  { relationship: "cousin", event: "wedding", negate: false, function: applySimpleCondition },
  { firstName: "Heather", state: "Texas", negate: true, function: applySimpleCondition },
  { firstName: "Heather", relationship: "sister", negate: false, function: applySimpleCondition },
  { firstName: "Heather", day: "Wed", negate: true, function: applySimpleCondition },
  // 6. -----------
  { firstName: "Walter", lastName: "DeForest", negate: true, function: applySimpleCondition},
  { firstName: "Walter", state: "Washington", negate: true, function: applySimpleCondition},
  { lastName: "DeForest", state: "Washington", negate: true, function: applySimpleCondition},
  { event: "anniversary", state: "Montana", negate: false, function: applySimpleCondition},
  { firstName: "Walter", day: "Sat", negate: true, function: applySimpleCondition},
  { firstName: "Walter", day: "Wed", negate: true, function: applySimpleCondition},
  { state: "Washington", day: "Sat", negate: true, function: applySimpleCondition},
  { lastName: "DeForest", day: "Wed", negate: true, function: applySimpleCondition},
  // extras...
  { firstName: "Walter", lastName: "DeForest", state: "Washington", function:applyIsRightOrder}

  // { firstName: "Ellen", event: "wedding", negate: false, function: applySimpleCondition},
  // { firstName: "Heather", state: "Ohio", negate: false, function: applySimpleCondition},
  // { firstName: "Walter", day: "Fri", negate: false, function: applySimpleCondition},
  // { firstName: "Ellen", day: "Wed", negate: false, function: applySimpleCondition },
  // { firstName: "Ellen", state: "Washington", negate: false, function: applySimpleCondition },
  // { firstName: "Rick", lastName: "DeForest", negate: false, function: applySimpleCondition },
  // { firstName: "Walter", event: "anniversary", negate: false, function: applySimpleCondition },
];

conditions.forEach(function(cond) {
  Object.keys(cond).forEach(function(key) {
    try {
      if (key !== "negate" && key !== "function" && key !== "daysBetween" && data[key].indexOf(cond[key]) === -1) {
        throw new Error("error in " + key + " >>> " + JSON.stringify(cond));
      }
    } catch (e) {
      console.error(e);
    }
  });
  console.log("--------------------------");
  candidates = makeNewCandidates(candidates, cond);
  console.log(cond, candidates.length);
});
console.log("+++++++++++++++++++++++++++++");
// console.log(candidates)
console.log("+++++++++++++++++++++++++++++");
console.log("+++++++  summary  +++++++++++");
let summary = {}
candidates.forEach(function(candidate){
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

function applySimpleCondition(obj, condition) {
  let keyA = Object.keys(condition)[0]
  let keyB = Object.keys(condition)[1]
  let negate = condition[Object.keys(condition)[2]]
  if (negate) {
    return !(obj[keyA] === condition[keyA] && obj[keyB] === condition[keyB]);
  } else {
    return (obj[keyA] === condition[keyA]) === (obj[keyB] === condition[keyB]);
  }
}

function applyIsRightOrder(obj, condition, candidates) {
  let keyA = Object.keys(condition)[0]
  let keyB = Object.keys(condition)[1]
  let keyC = Object.keys(condition)[2]
  let candidateFound = false;
  if (obj[keyA] === condition[keyA]){
    candidates.forEach(function(cand){
      if (cand[keyA] === obj[keyA]){
        return
      } else {
        if (cand[keyB] === condition[keyB] && isPreviousDay(obj['day'], cand['day'])){
          candidates.forEach(function(cand2){
            if (cand2[keyA] === obj[keyA] || cand2[keyB] === cand[keyB]){
              return
            } else {
              if (cand2[keyC] === condition[keyC] && isAfter(obj['day'], cand2['day'])){
                candidateFound = true
              }
            }

          })
        }
      }
    })
  } else {
    return true
  }
  return candidateFound
}

function isPreviousDay(day1, day2){
  return data.day.indexOf(day1) === data.day.indexOf(day2) - 1
}

function isAfter(day1, day2){
  return data.day.indexOf(day1) > data.day.indexOf(day2)
}

function makeNewCandidates(candidates, condition) {
  let newCandidates = [];
  candidates.forEach(function(obj) {
    let func = condition.function
    if (func(obj, condition, candidates)) {
      newCandidates.push(obj);
    }
  });
  return newCandidates;
}
