function makeLine() {
    columnsInRows[currentRow] = column;
    shiftRowsDown();
    
    let newRow = document.createElement("div");
    newRow.classList.add("rows");
    newRow.id = "row" + (currentRow + 1);
    rows.appendChild(newRow);
    rowValues[currentRow] = currentRowValue;

    //new row
    currentRow++;
    currentRowColumn = 1;
    currentRowValue = "";
    remaining = "";
    rowValues[currentRow] = "";
}

function deleteLine(targetedRow = currentRow) {
    let targetedRowDiv = document.getElementById("row" + targetedRow);
    rows.removeChild(targetedRowDiv);

    columnsInRows.splice(targetedRow, 1)
    rowValues.splice(targetedRow, 1)

    currentRow--;
    currentRowColumn = columnsInRows[currentRow];
    currentRowValue = rowValues[currentRow];
}

function makeSpan(content, targetedRow, space = true) {
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

    for (var i = column; i > currentRowColumn; i--) {
        let elem1 = document.getElementById(targetedRow + "_" + i);
        elem1.id = targetedRow + "_" + (i + 1);
    }

    let rowdiv = document.getElementById("row" + targetedRow)
    rowdiv.appendChild(span);
    columnsInRows[targetedRow] = columnsInRows[targetedRow] + 1;
}

function shiftRowsDown() {
    let newRow = document.createElement("div");
    newRow.classList.add("rows");
    newRow.id = "row" + (rowValues.length);;
    
    for(var i = currentRow; i < rowValues.length - 1; i++) {
        if(i == currentRow) {
            rows.appendChild(newRow);
            rowValues.splice(currentRow + 1, 0, "");
        }
        console.log(currentRow + "     " + (rowValues.length-1))
        refractorValue(false, i);
    }
}

function getDictLength(dict) {
    return Object.keys(dict).length;
}