// spiludregninger

let values = []
let throwCount = 0


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

// If your dice images are mixed like dice1.png, dice2.png.jpg, etc.
const diceFiles = [
  "images/dice1.png",
  "images/dice2.png",
  "images/dice3.png",
  "images/dice4.png",
  "images/dice5.png",
  "images/dice6.png"
];

// Create 5 dice slots
function createDiceSlots() {
  for (let i = 0; i < 5; i++) {
    const img = document.createElement("img");
    img.classList.add("dice");
    img.src = diceFiles[0]; // start with dice1 as placeholder
    img.dataset.index = i;
    diceContainer.appendChild(img);
  }
}

// Roll all dice
function rollDice() {
  const diceImages = document.querySelectorAll(".dice");

  diceImages.forEach((img, index) => {
    const value = Math.floor(Math.random() * 6); // 0-5 for index
    values[index] = value + 1; // store 1-6
    img.src = diceFiles[value];    // assign correct image
  });


const rowContainer = document.querySelector(".row");
const inputs = rowContainer.querySelectorAll("input");
const results = getResults();
for (let i = 0; i < results.length && i < inputs.length; i++) {
    inputs[i].value = results[i];   

}

  console.log("Dice values:", values);
}

rollButton.addEventListener("click", rollDice);

createDiceSlots();

const rowContainer = document.querySelector(".row");
const inputs = rowContainer.querySelectorAll("input");
inputs.forEach((input) => {
    input.addEventListener("click", () => {
        if (!input.disabled) {
            // Lock the input when clicked
            input.disabled = true;
            // Optional: highlight it so the player knows it's locked
            input.style.backgroundColor = "#bafa4b";  
        }
    });
});
