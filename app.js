const editor = document.getElementById("editor");
const input = document.getElementById("input");
const rows = document.getElementById("rows");
var rowsouter = document.getElementById("rowsouter1");
var rowdiv = document.getElementById("row1")
var row = 1; // # of rows
var column = 1; // # of words in the current row
var currentRow = 1; // # of the active row
var currentColumn = 1; // # of the active word in a row
var columnarray = [null]

function main()
{
    input.addEventListener("keydown", checkForDown);
}

function checkForDown(event)
{
    switch(event.key)
    {
        case " ": //space
            event.preventDefault();
            refractorInputField(true);
            break;
        case "Enter":  //enter
            event.preventDefault();
            if(input.value != "")
            {
                refractorInputField(false);
            }

            makeLine();
            input.focus();
            break;
        case "Backspace": //backspace
            if(input.value=="")
            {
                if(currentColumn == 1)
                {   if(row != 1)
                    {
                        row--;
                        currentRow--;
                        currentColumn = columnarray[row]
                        rowsouter.parentNode.removeChild(rowsouter);
                        rowdiv = document.getElementById("row" + currentRow);
                        rowsouter = document.getElementById("rowsouter" + currentRow);
                        rowsouter.appendChild(input);
                        if(currentColumn != 1)
                        {
                            deleteLastSpan(event);
                        }
                        input.focus();
                    }
                }
                else
                {
                    deleteLastSpan(event);
                    input.value = input.value.replace(" ", "");
                }
            }
            break;
        case "Tab": //tab
            event.preventDefault();
            refractorInputField(false);
            input.value += "    ";
            refractorInputField(false);
            break;
        case "{": //{
            event.preventDefault();
            input.value += "{}";
            break;
        default:
            console.log(input.value);
            updateTempSpan();
    }
}

function makeLine()
{
    input.value="";

    columnarray[row] = column;

    let newouterrow = document.createElement("div");
    newouterrow.classList.add("rowsouter");
    newouterrow.id = "rowsouter" + (row + 1);

    let newrow = document.createElement("div");
    newrow.classList.add("rows");
    newrow.id = "row" + (row + 1);

    rows.appendChild(newouterrow);
    newouterrow.appendChild(newrow);

    input.parentNode.removeChild(input);
    newouterrow.appendChild(input);

    column = 1;
    currentColumn = 1;
    rowsouter = newouterrow;
    rowdiv = newrow;
    row++;
    currentRow++;
}

function refractorInputField(space) // Parses input field and puts its content int spans
{
    let elements = parseToArray(input.value);
    for(var i = 0; i < elements.length; i++)
    {
        if(i == elements.length-1)
        {
            makeSpan(elements[i], getType(elements[i]));
        }
        else
        {
            makeSpan(elements[i], getType(elements[i]), false);
        }
    }

    input.value = "";
}

function updateTempSpan()
{
    
}

function makeSpan(content, type, space = true)
{
    let parsedContent = parseToHTML(content);
    let span = document.createElement("span");
    span.setAttribute("contenteditable", "true")
    if(space)
    {
        span.innerHTML = parsedContent + "&nbsp";
    }
    else
    {
        span.innerHTML = parsedContent;
    }
    span.classList.add("textspan")
    span.classList.add(type)
    span.id = currentRow + "_" + currentColumn;
    span.setAttribute("onclick", "changeActiveSpan.call(this)")

    for(var i = column; i > currentColumn; i--)
    {
        let elem1 = document.getElementById(currentRow + "_" + i);
        elem1.id = currentRow + "_" + (i + 1);
    }
        
    console.log("dfsdf")
    rowdiv.appendChild(span);

    column++;
    currentColumn++;
}

function deleteLastSpan(event)
{
    event.preventDefault();

    let loadspan = document.getElementById(currentRow + "_" + (currentColumn - 1));

    input.value = loadspan.innerHTML;
    input.value = parseFromHTML(input.value);

    loadspan.parentNode.removeChild(loadspan);
    column--;
    currentColumn--;
}

function focusInput()
{
    input.focus();
}

main();