const editor = document.getElementById("editor");
const input = document.getElementById("input");
const rows = document.getElementById("rows");
var rowsouter = document.getElementById("rowsouter1");
var rowdiv = document.getElementById("row1")
input.addEventListener("keydown", checkForDown);
var row = 1; // # of rows
var column = 1; // # of words in the current row
var currentRow = 1; // # of the active row
var currentColumn = 1; // # of the active word in a row
var columnArray = [null]
var rowValuesPre = { 1: "" };
var rowValuesPost = { 1: "" };

function checkForDown(event)
{
    let currentRowValue = rowValuesPre[currentRow];

    switch(event.key) {
        case "Backspace":
            event.preventDefault();
            let decoy = "";
            for(var i = 0; i < currentRowValue.length; i++) {
                if(i != currentRowValue.length-1) {
                    decoy += currentRowValue[i];
                }
            }
            currentRowValue = decoy;
            refractorValue(currentRowValue, false);
            break;
        case "Enter":
            event.preventDefault();
            refractorValue(currentRowValue, false);
            makeLine();
            break;
        default:
            if (" qwertzuiopasdfghjklyxcvbnm1234567890=+-*\\/_.,;:#@(){}[]|".includes(event.key.toLowerCase())) {
                currentRowValue += event.key;
                refractorValue(currentRowValue, true);
                event.preventDefault();
            }
    }
    
    rowValuesPre[currentRow] = currentRowValue;
}

function refractorValue(value, space) // Parses input field and puts its content into spans
{
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