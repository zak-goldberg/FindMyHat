const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const charArray = [hat, hole, fieldCharacter];

/*
Pass a "field" array when creating a new instance of the class. Sample field array:
[
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]
*/
class Field {
    constructor(fieldInput) {
        this.fieldDefinition = fieldInput;
        // requirement: The player will begin in the upper-left of the field, and the player’s path is represented by *.
        // pathPosition[0] represents y axis coordinate; pathPosition[1] represents x axis coordinate
        this.pathPosition = [0, 0];
        this.maxXAxis = fieldInput[0].length - 1;
        this.maxYAxis = fieldInput.length - 1;
    }
    
    // method to print the current board
    print() {
        let fieldRows = this.fieldDefinition.length;
        for (let i = 0; i < fieldRows; i++) {
            console.log(this.fieldDefinition[i].join(''));
        }
    }

    getCharAtPosition(pathPositionInput) {
        try {
            return this.fieldDefinition[pathPositionInput[0]][pathPositionInput[1]];
        } catch {
            console.log('You fell off the board, you lose!');
            process.exit();
        }
    }

    setCharAtPosition(pathPositionInput, newChar) {
        this.fieldDefinition[pathPositionInput[0]][pathPositionInput[1]] = newChar;
    }
    
    // method to move the path character based on input provided by the user
    movePathChar(direction) {
        let newPathPosition = [];
        // update the newPathPosition array based on the user input and the last state of this.pathPosition
        // console.log(`direction: ${direction}`);
        switch(direction) {
            case 'u':
                newPathPosition[0] = this.pathPosition[0] - 1;
                newPathPosition[1] = this.pathPosition[1];
                break;
            case 'd':
                // console.log('I made it into d')
                // console.log(`this.pathPosition[0] + 1: ${this.pathPosition[0] + 1}`);
                //console.log(`this.pathPosition[1]: ${this.pathPosition[1]}`);
                newPathPosition[0] = this.pathPosition[0] + 1;
                newPathPosition[1] = this.pathPosition[1];
                break;
            case 'r':
                newPathPosition[0] = this.pathPosition[0];
                newPathPosition[1] = this.pathPosition[1] + 1;
                break;
            case 'l':
                newPathPosition[0] = this.pathPosition[0];
                newPathPosition[1] = this.pathPosition[1] - 1; 
                break;
        };
        // create a variable and store the value of the character at the new coordinates
        // console.log(`this.pathPosition: ${this.pathPosition}`);
        // console.log(`this.fieldDefinition[pathPosition[0]]: ${this.fieldDefinition[this.pathPosition[0]]}`);
        // console.log(`this.fieldDefinition[pathPosition[0]][pathPosition[1]]: ${this.fieldDefinition[this.pathPosition[0]][this.pathPosition[1]]}`);
        let newPathPositionChar = this.getCharAtPosition(newPathPosition);
        // console.log(`newPathPosition: ${newPathPosition}`);
        // console.log(`newPathPositionChar: ${newPathPositionChar}`);
        /* validate the move based on the value of the character at the new coordinate 
        requirements:
            This should continue until the user either:
            - Wins by finding their hat.
            - Loses by landing on (and falling in) a hole.
            - Attempts to move “outside” the field.
            When any of the above occur, let the user know and end the game.
        */
        // Validate that the new position is actually on the board
        // TO-DO: Remove? Should be handled by try...catch on line 35
        if (newPathPosition[0] > this.maxYAxis || newPathPosition[1] > this.maxXAxis ||
        newPathPosition[0] < 0 || newPathPosition[1] < 0) {
            console.log('You fell off the board. You lose!');
            process.exit();
        }
        // Take the appropriate action based on the character at the new coordinate
        // console.log('about to check which character is at the new path position')
        switch(newPathPositionChar) {
            case hat:
                console.log('You win!');
                process.exit();
                break;
            case hole:
                console.log('You fell down a hole. You lose!');
                process.exit();
                break;
            case fieldCharacter:
                // After entering an instruction, the user should see a printed result of their current field map with the tiles they have visited marked with *. They should be prompted for their next move.
                this.pathPosition = newPathPosition;
                this.setCharAtPosition(this.pathPosition, pathCharacter);
                console.log('Updated board:');
                this.print();
                console.log('Which direction would you like to move?\nu for up\nd for down\nr for right\nl for left\n');
                break;
            case pathCharacter:
                this.pathPosition = newPathPosition;
                this.setCharAtPosition(this.pathPosition, pathCharacter);
                console.log('Updated board:');
                this.print();
                console.log('Which direction would you like to move?\nu for up\nd for down\nr for right\nl for left\n');
                break;
            default:
                console.log('didn\'t match any of the cases');
        };
    }

    static generateField (height, width, percentageHoles) {
        //TO-DO - add percentage argument to specify what percent of the field should be covered in holes.
        let newFieldFlat = [hat];
        let newField = [];
        let row = [];
        let hatPlaced = false;
        let numFieldChar = Math.ceil((height * width) * (1 - percentageHoles / 100));
        let numHoleChar = Math.floor((height * width) * (percentageHoles / 100));
        for (let k = 0; k < numFieldChar; k++) {
            newFieldFlat.push(fieldCharacter);
        }
        for (let l = 0; l < numHoleChar; l++) {
            newFieldFlat.push(hole);
        }
        // newFieldFlat = shuffleArray(newFieldFlat);
        // TO-DO - get a random char from newFieldFlat and the delete it from the array using the delete operator
        // https://sentry.io/answers/remove-specific-item-from-array/
        // loop through each row and append row to newField
        for (let i = 0; i < height; i++) {
            row = [];
            // generate each row
            for (let j = 0; j < width; j++) {
                // top left char should be path character
                if (i == 0 && j == 0) {
                    row.push(pathCharacter);
                } else {
                   // if hat has already been placed, pass hat character as the character to ignore to generateFieldChar
                    if (hatPlaced) {
                        row.push(generateFieldChar(hat));
                    } else {
                        let newChar = generateFieldChar();
                        row.push(newChar);
                        if (newChar == hat) hatPlaced = true;
                };
                }
            }
            newField.push(row);
        }
        return newField;
    }
}

// Hardcoded instance of field class before generateField method is created
const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);

// Helper function to valide that user input is one of the allowable letters during gameplay
  function validateInput(input){
    allowableResponses = ['r', 'l', 'u', 'd'];
    return allowableResponses.includes(input);
}

// Callback function to handle user input during gameplay
function handleUserInput(inputRaw){
    // console.log('I made it inside handleUserInput');
    const cleanInput = inputRaw.toString().trim().toLowerCase();
    if (validateInput(cleanInput)) {
        // console.log('I made it past validation.')
        myField.movePathChar(cleanInput);
    } else {
        console.log('Invalid input. Please try again.');
    }
}

// Callback function to end the process if the user types "quit"
function quitGameHandler(inputRaw){
    const cleanInput = inputRaw.toString().trim().toLowerCase();
    if (cleanInput == 'quit') {
        console.log('Thanks for playing! Goodbye.');
        process.exit();
    }
}

// Helper function to generate random characters in the field
// To do - make this a method of the class
function generateFieldChar(inputCharArray, ignoreChar) {
    let randNum = Math.floor(Math.random() * inputCharArray.length);
    // If user has provided a character to ignore, re-assign the random number in a loop so the ignored char is not returned
    if (ignoreChar) {
        while (inputCharArray[randNum] == ignoreChar) {
            randNum = Math.floor(Math.random() * inputCharArray.length);
        }
    }
    return charArray[randNum];
}

// Helper function to shuffle array using Fisher-Yates Sorting Algo
function shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

console.log('Initial board:');
myField.print();
console.log('Which direction would you like to move?\nu for up\nd for down\nr for right\nl for left\nquit to exit\n');
process.stdin.on('data', quitGameHandler);
process.stdin.on('data', handleUserInput);


/* testing commands for generateField static method
const testField = Field.generateField(6,6);
console.log(testField);
*/