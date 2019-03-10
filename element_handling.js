function makeLine() {
    columnArray[row] = column;

    let newOuterRow = document.createElement("div");
    newOuterRow.classList.add("rowsouter");
    newOuterRow.id = "rowsouter" + (row + 1);

    let newRow = document.createElement("div");
    newRow.classList.add("rows");
    newRow.id = "row" + (row + 1);

    rows.appendChild(newOuterRow);
    newOuterRow.appendChild(newRow);

    column = 1;
    currentColumn = 1;
    rowsouter = newOuterRow;
    row++;
    currentRow++;
    currentRowValue = "";
    remaining = "";

    rowValues[currentRow] = "";
}

function deleteLine() {
    rowsouter = document.getElementById("rowsouter" + currentRow);
    rowsouter.parentNode.removeChild(rowsouter);

    row--;
    currentRow--;
    column = columnArray[row];
    currentColumn = columnArray[row];
}

function makeSpan(content, type, space = true) {
    let parsedContent = parseToHTML(content);
    let span = document.createElement("span");
    span.setAttribute("contenteditable", "true")
    if (space) {
        span.innerHTML = parsedContent + "&nbsp;";
    }
    else {
        span.innerHTML = parsedContent;
    }
    span.classList.add("textspan");
    span.classList.add(type);
    span.id = currentRow + "_" + currentColumn;
    span.setAttribute("onclick", "changeActiveSpan.call(this)")

    for (var i = column; i > currentColumn; i--) {
        let elem1 = document.getElementById(currentRow + "_" + i);
        elem1.id = currentRow + "_" + (i + 1);
    }

    let rowdiv = document.getElementById("row" + currentRow)
    rowdiv.appendChild(span);

    column++;
    currentColumn++;
}

function deleteLastSpan(event) {
    event.preventDefault();

    let loadspan = document.getElementById(currentRow + "_" + (currentColumn - 1));

    input.value = loadspan.innerHTML;
    input.value = parseFromHTML(input.value);

    loadspan.parentNode.removeChild(loadspan);
    column--;
    currentColumn--;
}