const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

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

    getCharAtPosition(pathPosition) {
        return this.fieldDefinition[pathPosition[0]][pathPosition[1]]
    }

    setCharAtPosition(pathPosition, newChar) {
        this.fieldDefinition[pathPosition[0]][pathPosition[1]] = newChar;
    }
    
    // method to move the path character based on input provided by the user
    movePathChar(direction) {
        let newPathPosition = [];
        // update the newPathPosition array based on the user input and the last state of this.pathPosition
        switch(direction) {
            case 'u':
                newPathPosition[0] = this.pathPosition[0] - 1;
                newPathPosition[1] = this.pathPosition[1];
            case 'd':
                newPathPosition[0] = this.pathPosition[0] + 1;
                newPathPosition[1] = this.pathPosition[1];
            case 'r':
                newPathPosition[0] = this.pathPosition[0];
                newPathPosition[1] = this.pathPosition[1] + 1;
            case 'l':
                newPathPosition[0] = this.pathPosition[0];
                newPathPosition[1] = this.pathPosition[1] - 1; 
        };
        // create a variable and store the value of the character at the new coordinates
        let newPathPositionChar = this.getCharAtPosition(newPathPosition);
        console.log(`newPathPositionChar: ${newPathPositionChar}`);
        /* validate the move based on the value of the character at the new coordinate 
        requirements:
            This should continue until the user either:
            - Wins by finding their hat.
            - Loses by landing on (and falling in) a hole.
            - Attempts to move “outside” the field.
            When any of the above occur, let the user know and end the game.
        */
        // Validate that the new position is actually on the board
        if (newPathPosition[0] > this.maxYAxis || newPathPosition[1] > this.maxXAxis) {
            console.log('You fell off the board. You lose!');
            process.exit();
        }
        // Take the appropriate action based on the character at the new coordinate
        console.log('about to check which character is at the new path position')
        switch(newPathPositionChar) {
            case '^':
                console.log('You win!');
                process.exit();
            case '0':
                console.log('You fell down a hole. You lose!');
                process.exit();
            case '░':
                // After entering an instruction, the user should see a printed result of their current field map with the tiles they have visited marked with *. They should be prompted for their next move.
                this.setCharAtPosition(this.pathPosition) = pathCharacter;
                this.pathPosition = newPathPosition;
                console.log('Updated board:');
                this.print();
                console.log('Which direction would you like to move?\nu for up\nd for down\nr for right\nl for left\n');  
        };
        console.log('didn\'t match any of the cases');
    }
}

const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);

function validateInput(input){
    allowableResponses = ['r', 'l', 'u', 'd'];
    return allowableResponses.includes(input);
}

function handleUserInput(inputRaw){
    console.log('I made it inside handleUserInput');
    const input = inputRaw.toString().trim().toLowerCase();
    if (validateInput(input)) {
        console.log('I made it past validation.')
        myField.movePathChar(input);
    } else {
        console.log('Invalid input. Please try again.');
    }
}

console.log('Initial board:');
myField.print();
console.log('Which direction would you like to move?\nu for up\nd for down\nr for right\nl for left\n');
process.stdin.on('data', handleUserInput);