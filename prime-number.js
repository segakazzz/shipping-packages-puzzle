let numberArray = [...Array(100000).keys()]
let primeNumber = []

numberArray.forEach(function(num){
    let result = []
    for(let ind=1; ind <= Math.floor(num/2); ind++){
        if (num % ind === 0) {
            result.push(ind)
        }
    }
    if (result.length === 1){
        primeNumber.push(num)
    }
});
console.log(primeNumber)
console.log(primeNumber.length + ' prime numbers are found.')