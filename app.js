const editor = document.getElementById("editor");
const input = document.getElementById("input");
const rows = document.getElementById("rows");
var rowsouter = document.getElementById("rowsouter1");
var rowdiv = document.getElementById("row1")
var row = 1;
var column = 1;
var columnarray = [null]

function main()
{
    input.addEventListener("keydown", checkForDown);
    input.addEventListener("keyup", checkForUp);
}

function checkForDown(event)
{
    if(event.keyCode==32) //space
    {
        event.preventDefault();
        refractor(true);

        input.value="";
    }
    if(event.keyCode==13) //enter
    {
        event.preventDefault();
        refractor(false);
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

        input.focus();
    }
    if(event.keyCode==8) //backspace
    {
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

                    input.focus();
                }
            }
            else
            {
                event.preventDefault();

                let loadspan = document.getElementById(row + "_" + (column - 1));
                let splitarr = loadspan.innerHTML.split("&nbsp;")

                for(var i = 0; i < splitarr.length; i++)
                {
                    input.value += splitarr[i];
                }

                loadspan.parentNode.removeChild(loadspan);
                column--;
            }
        }
    }
    if(event.keyCode==9) //tab
    {
        event.preventDefault();
        input.value+="    ";
    }
    if(event.key=="{") //{
    {
        event.preventDefault();
        input.value+="{}";
    }
}

function checkForUp(event)
{
    
}

function makeSpan(HTML, type, space = true)
{
    let span = document.createElement("span");
    if(space)
    {
        span.innerHTML = HTML + "&nbsp";
    }
    else
    {
        span.innerHTML = HTML;
    }
    span.classList.add("textspan")
    span.classList.add(type)
    span.id = row + "_" + column;
    rowdiv.appendChild(span);
    column+=1;
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

function getType(variable)
{
    switch (variable)
    {
        case "var":
        case "int":
        case "bool":
        case "str":
        case "if":
        case "for":
        case "while":
        case "#include":
            return "keyword";
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            return "number";
        case "|":
        case ":":
        case "=":
        case "<":
        case ">":
            return "sign";
        default:
            return "textgnrc";
    }
}

main();