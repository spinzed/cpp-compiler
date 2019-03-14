function nextLine() {
    columnsInRows[currentRow] = column;
    rowValues[currentRow] = currentRowValue;
    shiftRowsDown();

    if(getRowCount() == currentRow) {
        let newRow = document.createElement("div");
        newRow.classList.add("rows");
        newRow.id = "row" + (currentRow + 1);
        rows.appendChild(newRow);
    }

    currentRow++;
    currentRowColumn = 1;
    currentRowValue = "";
    rowValues[currentRow] = "";
    refractorValue(false, currentRow - 1) // this is needed because remaining value is transfered to another line
}

function deleteLine(targetedRow = currentRow) {
    let targetedRowDiv = document.getElementById("row" + targetedRow);
    rows.removeChild(targetedRowDiv);

    columnsInRows.splice(targetedRow, 1)
    rowValues.splice(targetedRow, 1)

    currentRow--;
    currentRowColumn = columnsInRows[currentRow];
    currentRowValue = rowValues[currentRow];
    shiftRowsUp();
}

function makeSpan(content, targetedRow, space = true) {
    columnsInRows[targetedRow] = columnsInRows[targetedRow] + 1;
    let parsedContent = parseToHTML(content);
    let span = document.createElement("span");
    if(space) {
        span.innerHTML = parsedContent + "&nbsp;";
    }
    else {
        span.innerHTML = parsedContent;
    }
    span.classList.add("textspan");
    span.classList.add(getType(content));
    span.id = targetedRow + "_" + columnsInRows[targetedRow];
    span.setAttribute("onclick", "changeActiveSpan.call(this)") // currently does nothing

    for(var i = column; i > currentRowColumn; i--) {
        let elem1 = document.getElementById(targetedRow + "_" + i);
        elem1.id = targetedRow + "_" + (i + 1);
    }

    let rowdiv = document.getElementById("row" + targetedRow)
    rowdiv.appendChild(span);
}

function shiftRowsDown() {
    let newRow = document.createElement("div");
    newRow.classList.add("rows");
    newRow.id = "row" + (rowValues.length);
    
    for(var i = currentRow; i <= getRowCount(); i++) {
        if(i == currentRow) {
            rows.appendChild(newRow);
            rowValues.splice(currentRow + 1, 0, "");
        }
        refractorValue(false, i);
    }
}

function shiftRowsUp() {
    for(var i = currentRow + 2; i < getRowCount() + 2; i++) {
        let tempRow = document.getElementById("row" + i);
        tempRow.id = "row" + (i - 1);
    }
}

function getDictLength(dict) {
    return Object.keys(dict).length;
}

function getRowCount() {
    return rowValues.length - 1;
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

function updateTempSpan() {

}