const editor = document.getElementById("editor");
const input = document.getElementById("input");
const rows = document.getElementById("rows");
input.addEventListener("keydown", checkForDown);
var row = 1; // # of rows
var column = 1; // # of words in the current row
var currentRow = 1; // # of the active row
var currentColumn = 1; // # of the active word in a row
var columnArray = [null]
var rowValues = { 1: "" };
var currentRowValue = "";
var remaining = "";

function checkForDown(event)
{
    currentRowValue = rowValues[currentRow];

    switch(event.key) {
        case "Backspace":
            event.preventDefault();
            if(currentRowValue == "" && currentRow != 1) {
                deleteLine();
            }
            else {
                let decoy = "";
                for(var i = 0; i < currentRowValue.length; i++) {
                    if(i != currentRowValue.length-1) {
                        decoy += currentRowValue[i];
                    }
                }
                currentRowValue = decoy;
                refractorValue(false);
                rowValues[currentRow] = currentRowValue;
            }

            break;
        case "Enter":
            event.preventDefault();
            refractorValue(false);
            makeLine();
            if(currentRowValue[currentRowValue.length - 1] == "{") {
                currentRowValue = "    ";
                refractorValue(false);
                rowValues[currentRow] = currentRowValue;
            }
            break;
        case "Tab":
            event.preventDefault();
            currentRowValue += "    ";
            refractorValue(true)
            rowValues[currentRow] = currentRowValue;
            break;
        case "ArrowLeft":
            if(currentRowValue != "") {
                let decoy1 = "";
                let decoy2 = "";
                for (var i = 0; i < currentRowValue.length; i++) {
                    if (i != currentRowValue.length - 1) {
                        decoy1 += currentRowValue[i];
                    }
                    else {
                        decoy2 += currentRowValue[i];
                        decoy2 += remaining;
                    }
                }
                currentRowValue = decoy1;
                remaining = decoy2;
                refractorValue(false);
                rowValues[currentRow] = currentRowValue;
            }
            break;
        case "ArrowRight":
            let decoy = "";
            for (var i = 0; i < remaining.length; i++) {
                if (i != 0) {
                    decoy += remaining[i];
                }
                else {
                    currentRowValue += remaining[i];
                }
            }
            remaining = decoy;
            refractorValue(false);
            rowValues[currentRow] = currentRowValue;
            break;
        default:
            if (" qwertzuiopasdfghjklyxcvbnm1234567890=+-*\\/_.,;:#@(){}[]<>|".includes(event.key.toLowerCase())) {
                event.preventDefault();
                currentRowValue += event.key;
                refractorValue(true);
                rowValues[currentRow] = currentRowValue;
            }
    }
}

function refractorValue(space) { // Parses input field and puts its content into spans
    let value = currentRowValue + remaining;
    let activeRow = document.getElementById("row" + currentRow);
    while (activeRow.firstChild) {
        activeRow.removeChild(activeRow.firstChild);
    }
    column = 1;
    currentColumn = 1;

    let elements = parseToArray(value);
    for (var i = 0; i < elements.length; i++) {
        if (i == elements.length - 1) {
            makeSpan(elements[i], getType(elements[i]), space);
        }
        else {
            makeSpan(elements[i], getType(elements[i]), false);
        }
    }

    input.value = "";
}

function focusInput() {
    input.focus();
}

function updateTempSpan()
{

}