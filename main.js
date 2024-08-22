const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const charArray = [hat, hole, fieldCharacter];

class Field {
    constructor(fieldInput) {
        this.fieldDefinition = fieldInput;
        // requirement: The player will begin in the upper-left of the field, and the player’s path is represented by *.
        // pathPosition[0] represents y axis coordinate; pathPosition[1] represents x axis coordinate
        this.pathPosition = [0, 0];
    }
    
    // method to print the current board
    print() {
        let fieldRows = this.fieldDefinition.length;
        for (let i = 0; i < fieldRows; i++) {
            console.log(this.fieldDefinition[i].join(''));
        }
    }

    // method to get the character at a certain position in the field array
    getCharAtPosition(pathPositionInput) {
        try {
            return this.fieldDefinition[pathPositionInput[0]][pathPositionInput[1]];
        } catch {
            console.log('You fell off the board, you lose!');
            process.exit();
        }
    }

    // method to set the character at a certain position in the field array
    // TO-DO: add validation
    setCharAtPosition(pathPositionInput, newChar) {
        this.fieldDefinition[pathPositionInput[0]][pathPositionInput[1]] = newChar;
    }
    
    // method to move the path character based on input provided by the user
    movePathChar(direction) {
        let newPathPosition = [];
        // update the newPathPosition array based on the user input and the last state of this.pathPosition
        switch(direction) {
            case 'u':
                newPathPosition[0] = this.pathPosition[0] - 1;
                newPathPosition[1] = this.pathPosition[1];
                break;
            case 'd':
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
        let newPathPositionChar = this.getCharAtPosition(newPathPosition);
        /* validate the move based on the value of the character at the new coordinate 
        requirements:
            This should continue until the user either:
            - Wins by finding their hat.
            - Loses by landing on (and falling in) a hole.
            - Attempts to move “outside” the field.
            When any of the above occur, let the user know and end the game.
        */
        // Validate that the new position is actually on the board
        // Take the appropriate action based on the character at the new coordinate
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
        let newFieldFlat = [hat];
        let newField = [];
        let row = [];
        let numFieldChar = Math.ceil((height * width) * (1 - percentageHoles / 100));
        let numHoleChar = Math.floor((height * width) * (percentageHoles / 100));
        for (let k = 0; k < numFieldChar - 1; k++) {
            newFieldFlat.push(fieldCharacter);
        }
        for (let l = 0; l < numHoleChar - 1; l++) {
            newFieldFlat.push(hole);
        }
        // loop through each row and append row to newField
        for (let i = 0; i < height; i++) {
            row = [];
            // generate each row
            for (let j = 0; j < width; j++) {
                // top left char should be path character
                if (i == 0 && j == 0) {
                    row.push(pathCharacter);
                // get a random index of newFieldFlat, add to row, splice from newFieldFlat so we don't add again
                } else {
                //    console.log(`newFieldFlat: ${newFieldFlat}`);
                    let randIndex = Math.floor(Math.random() * newFieldFlat.length);
                    row.push(newFieldFlat[randIndex]);                    
                    newFieldFlat.splice(randIndex, 1);
                }
            }
            newField.push(row);
        }
        return newField;
    }
}

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

// Generate a random field
const testField = Field.generateField(6, 6, 30);
// Create an instance of the field class for the game
const myField = new Field(testField);
// Print out the initial board and start gameplay
console.log('Initial board:');
myField.print();
console.log('Which direction would you like to move?\nu for up\nd for down\nr for right\nl for left\nquit to exit\n');
// Event listeners for user input for gameplay and quitting the game
process.stdin.on('data', quitGameHandler);
process.stdin.on('data', handleUserInput);