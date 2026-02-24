// spiludregninger

let values = []
let throwCount = 0

const maxThrows = 3;

let holdStatus = [false, false, false, false, false];

const sumInput = document.querySelector("#row2 .containerSumBonus input:nth-of-type(1)");
const bonusInput = document.querySelector("#row2 .containerSumBonus input:nth-of-type(2)");
const totalInput = document.querySelector("#containerTotal input");


function numberGenerator() {
    return Math.floor(Math.random() * 6) + 1
}

function throwDice(holdStatus) {
    for (let i = 0; i < 5; i++) {
        if (!holdStatus[i]) {
            values[i] = numberGenerator()
        }
    }
}

function frequency() {
    let freq = new Array(7).fill(0)
    for (let i = 0; i < values.length; i++) {
        let dieValue = values[i]
        if (dieValue >= 1 && dieValue <= 6) {
            freq[dieValue]++
        }
    }
    return freq
}

function getResults() {
    let results = new Array(15);

    for (let i = 0; i <= 5; i++) {
        results[i] = sameValuePoints(i + 1);
    }

    results[6] = onePairPoints();
    results[7] = twoPairPoints();
    results[8] = threeSamePoints();
    results[9] = fourSamePoints();
    results[10] = fullHousePoints();
    results[11] = smallStraightPoints();
    results[12] = largeStraightPoints();
    results[13] = chancePoints();
    results[14] = yatzyPoints();

    return results;
}

function sameValuePoints(value) {
    let sum = 0
    for (let die of values) {
        if (die === value) {
            sum += die
        }
    }
    return sum
}

function onePairPoints() {
    let sum = 0
    let freq = frequency()
    for (let i = 6; i >= 1; i--) {
        if (freq[i] >= 2) {
            sum = i * 2
            return sum
        }
    }
    return sum
}

function twoPairPoints() {
    let sum = 0
    let pairCount = 0
    let freq = frequency()
    for (let i = 6; i >= 1; i--) {
        if (freq[i] >= 2) {
            sum += i * 2
            pairCount++
            if (pairCount === 2) {
                return pairCount === 2 ? sum : 0
            }
        }
    }
    return 0
}

function threeSamePoints() {
    let freq = frequency()
    for (let i = 1; i <= 6; i++) {
        if (freq[i] >= 3) {
            return i * 3
        }
    }
    return 0
}

function fourSamePoints() {
    let freq = frequency()
    for (let i = 1; i <= 6; i++) {
        if (freq[i] >= 4) {
            return i * 4
        }
    }
    return 0
}

function fullHousePoints() {
    let onePairValue = 0
    let threeSameValue = 0
    let freq = frequency()
    let onePair = false
    let threeSame = false
    for (let i = 1; i <= 6; i++) {
        if (freq[i] === 3) {
            threeSame = true
            threeSameValue = i
        }

        if (freq[i] === 2) {
            onePair = true
            onePairValue = i
        }
    }
    if (onePair && threeSame) {
        return (onePairValue * 2) + (threeSameValue * 3)
    }
    return 0
}

function smallStraightPoints() {
    let freq = frequency()
    if (freq[1] > 0 && freq[2] > 0 && 
        freq[3] > 0 && freq[4] > 0 && 
        freq[5] > 0) {
        return 15
    }
    return 0
}

function largeStraightPoints() {
    let freq = frequency();
    if (freq[2] > 0 && freq[3] > 0 && 
        freq[4] > 0 && freq[5] > 0 && 
        freq[6] > 0) {
        return 20
    }
    return 0
}

function chancePoints() {
    let sum = 0;
    for (let die of values) {
        sum += die
    }
    return sum
}

function yatzyPoints() {
    let freq = frequency();
    for (let i = 1; i <= 6; i++) {
        if (freq[i] == 5) {
            return 50
        }
    }
    return 0
}

// gui
const diceContainer = document.getElementById("containerDice"); 
const rollButton = document.getElementById("roll-btn");

let diceValues = new Array(5).fill(null);

const diceFiles = [
  "images/dice1.png",
  "images/dice2.png",
  "images/dice3.png",
  "images/dice4.png",
  "images/dice5.png",
  "images/dice6.png"
];

// Lav 5 slots terninger er i uden billede
function createDiceSlots() {
  for (let i = 0; i < 5; i++) {
    const img = document.createElement("img");
    img.classList.add("dice");
    img.src = diceFiles[0];
    img.dataset.index = i;

    // Klik på terning for at holde den eller ikke holde den
    img.addEventListener("click", () => {
      const index = img.dataset.index;

      // Kan kun holde hvis man har slået 1 gang
      if (throwCount === 0) return;

      holdStatus[index] = !holdStatus[index];

      //ændrer farven hvis terningen er holdt
      if (holdStatus[index]) {
        img.style.border = "4px solid red";   // holdt
      } else {
        img.style.border = "4px solid rgb(89, 128, 246)"; // normal
      }
    });

    diceContainer.appendChild(img);
  }
}

createDiceSlots();

// Rull terninger
function rollDice() {

  if (throwCount >= maxThrows) {
    alert("Du har brugt 3 kast. Vælg en score.");
    return;
  }

  const diceImages = document.querySelectorAll(".dice");

  diceImages.forEach((img, index) => {

    if (!holdStatus[index]) {   // KUN rul hvis IKKE holdt
      const value = Math.floor(Math.random() * 6);
      values[index] = value + 1;
      img.src = diceFiles[value];
    }

  });

  throwCount++;

  if (throwCount === maxThrows) {
    rollButton.disabled = true;
  }


//opdatere score hver gang man slår
 updateScorePreview();
}
function updateScorePreview() {
  const rowContainer = document.querySelector(".row");
  const inputs = rowContainer.querySelectorAll("input");
  const results = getResults();

  for (let i = 0; i < results.length && i < inputs.length; i++) {
    if (!inputs[i].disabled) {
      inputs[i].value = results[i];
    }
  }
}


rollButton.addEventListener("click", rollDice);



const rowContainer = document.querySelector(".row");
const inputs = rowContainer.querySelectorAll("input");
inputs.forEach((input) => {
    input.addEventListener("click", () => {

        if (throwCount === 0) {
            alert("Du skal rulle mindst 1 gang makker!");
            return;
        }

        if (!input.disabled) {

            input.disabled = true;
            input.style.backgroundColor = "#8befffdf";

            updateTotals();

            startNewRound();
        }
    });
});

function updateTotals() {

    const rowContainer = document.querySelector(".row");
    const inputs = rowContainer.querySelectorAll("input");

    let upperSum = 0;
    let lowerSum = 0;

    inputs.forEach((input, index) => {

        if (input.disabled && input.value !== "") {

            const value = parseInt(input.value);

            if (index <= 5) {
                upperSum += value;   // 1s–6s
            } else {
                lowerSum += value;   // rest
            }
        }
    });

    // Update SUM
    sumInput.value = upperSum;

    // BONUS
    let bonus = upperSum >= 63 ? 50 : 0;
    bonusInput.value = bonus;

    // TOTAL
    totalInput.value = upperSum + lowerSum + bonus;
}

//bliver kaldt når man vælger et felt
function startNewRound() {

  throwCount = 0;
  rollButton.disabled = false;

  holdStatus = [false, false, false, false, false];
  values = [];

  const diceImages = document.querySelectorAll(".dice");

  diceImages.forEach((img) => {
    img.src = diceFiles[0];
    img.style.border = "4px solid rgb(89, 128, 246)";
  });

}

function updateSumTotalBonus () {

}