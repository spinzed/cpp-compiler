const editor = document.getElementById("editor");
const input = document.getElementById("input");
const rows = document.getElementById("rows");
var rowsouter = document.getElementById("rowsouter1");
var rowdiv = document.getElementById("row1")
var row = 1;
var column = 1;
var currentRow = 1;
var currentColumn = 1;
var columnarray = [null]

function main()
{
    input.addEventListener("keydown", checkForDown);
}

function checkForDown(event)
{
    switch(event.key)
    {
        case "Space": //space
            event.preventDefault();
            refractor(true);
            input.value="";
            break;
        case "Enter":  //enter
            event.preventDefault();
            if(input.value != "")
            {
                refractor(false);
            }

            makeLine();
            input.focus();
            break;
        case "Backspace": //backspace
            if(input.value=="")
            {
                if(column == 1)
                {   if(row != 1)
                    {
                        row--;
                        column = columnarray[row]
                        rowsouter.parentNode.removeChild(rowsouter);
                        rowdiv = document.getElementById("row" + row);
                        rowsouter = document.getElementById("rowsouter" + row);
                        rowsouter.appendChild(input);
                        if(column != 1)
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
            input.value+="    ";
            break;
        case "{": //{
            event.preventDefault();
            input.value+="{}";
            break;
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
    rowsouter = newouterrow;
    rowdiv = newrow;
    row++;
}

function refractor(space)
{
    var parts = input.value.split("(")
    if(parts.length == 1)
    {
        makeSpan(parts[0], getType(parts[0]), space)
    }
    else
    {
        makeSpan(parts[0], getType(parts[0]), false)
        for(let i = 1; i < parts.length; i++)
        {
            if(i == parts.length - 1)
            {
                makeSpan("(" + parts[i], getType(parts[i]))
            }
            else
            {
                makeSpan("(" + parts[i], getType(parts[i]), false)
            }
        }
    }
}

function changeActiveSpan()
{
    
}

function makeSpan(content, type, space = true)
{
    parsedContent = parseToHTML(content);
    let span = document.createElement("span");
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
    span.id = row + "_" + column;
    span.setAttribute("onclick", "changeActiveSpan.call(this)")
    rowdiv.appendChild(span);
    column++;
}

function deleteLastSpan(event)
{
    event.preventDefault();

    let loadspan = document.getElementById(row + "_" + (column - 1));

    input.value = loadspan.innerHTML;
    input.value = parseFromHTML(input.value);

    loadspan.parentNode.removeChild(loadspan);
    column--;
}

main();