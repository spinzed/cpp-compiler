const editor = document.getElementById("editor");
const input = document.getElementById("input");
const rows = document.getElementById("rows");
input.addEventListener("keydown", checkForDown);
var column = 1; // # of words in the current row
var currentRow = 1; // # of the active row
var currentColumn = 1; // # of the active word in a row
var columnArray = [null]
var rowValues = { 1: "" };
var currentRowValue = "";
var remaining = "";

function checkForDown(event)
{
    currentRowValue = rowValues[currentRow]; // just in case

    switch(event.key) {
        case "Enter":
            event.preventDefault();
            refractorValue(false);
            makeLine();
            let previousRowValue = rowValues[currentRow-1]
            if(previousRowValue[previousRowValue.length - 1] == "{") {
                currentRowValue = "    ";
                refractorValue(false);
            }
            break;
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
            }
            break;
        case "Delete":
            event.preventDefault();
            if(remaining != "") {
                let decoy = "";
                for(var i = 0; i < remaining.length; i++) {
                    if(i != 0) {
                        decoy += remaining[i];
                    }
                }
                remaining = decoy;
                refractorValue(false);
            }
            break;
        case "Tab":
            event.preventDefault();
            currentRowValue += "    ";
            refractorValue(true)
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
            }
            refreshInput();
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
            refreshInput();
            break;
        case "ArrowUp":
            if(currentRow != 1) {
                let len = currentRowValue.length;
                rowValues[currentRow] = currentRowValue + remaining;
                currentRow--;
                currentRowValue = rowValues[currentRow];
                let decoy1 = "";
                let decoy2 = "";
                for(var i = 0; i < currentRowValue.length; i++) {
                    if(i < len) {
                        decoy1 += currentRowValue[i];
                    }
                    else {
                        decoy2 += currentRowValue[i];
                    }
                }
                currentRowValue = decoy1;
                remaining = decoy2;
            }
            refractorValue(false);
            refreshInput();
            break;
        case "ArrowDown":
            if(currentRow != columnArray.length) {
                let len = currentRowValue.length;
                rowValues[currentRow] = currentRowValue + remaining;
                currentRow++;
                currentRowValue = rowValues[currentRow];
                let decoy1 = "";
                let decoy2 = "";
                for (var i = 0; i < currentRowValue.length; i++) {
                    if (i < len) {
                        decoy1 += currentRowValue[i];
                    }
                    else {
                        decoy2 += currentRowValue[i];
                    }
                }
                currentRowValue = decoy1;
                remaining = decoy2;
            }
            refractorValue(false);
            refreshInput();
            break;
        default:
            if(" qwertzuiopasdfghjklyxcvbnm1234567890=+-*\\/_.,;:#@(){}[]<>|\"\'".includes(event.key.toLowerCase())) {
                event.preventDefault();
                currentRowValue += event.key;
                refractorValue(true);
            }
    }
    input.setAttribute("style", "left: " + (390 + (8.8 * currentRowValue.length)) + "px; top: " + ((currentRow - 1) * 20) + "px");
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
    rowValues[currentRow] = currentRowValue;
}

function refreshInput() {
    let sidebar = document.getElementById("sidebar");
    sidebar.removeChild(input);
    sidebar.appendChild(input);
    input.focus();
}

function focusInput() {
    input.focus();
}

function updateTempSpan()
{

}