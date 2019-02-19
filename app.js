const editor = document.getElementById("editor");
const input = document.getElementById("input");
const text = document.getElementById("text")
var ric = 1;

function main()
{
    input.addEventListener("keydown", checkForEnter)
    input.addEventListener("keyup", checkForComplete)
}

function checkForEnter(event)
{
    if(event.keyCode==32)
    {
        event.preventDefault();
        refractor();

        input.value="";
    }
}
function checkForComplete(event)
{
    if(event.which==66)
    {
        input.value+="}";
    }
}

function makeSpan(HTML, type, space = true)
{
    var blaa = document.createElement("span");
    if(space)
    {
        blaa.innerHTML = HTML + "&nbsp";
    }
    else
    {
        blaa.innerHTML = HTML;
    }
    blaa.classList.add("textspan")
    blaa.classList.add(type)
    blaa.id = ric;
    text.appendChild(blaa);
    ric+=1;
}

function refractor()
{
    var parts = input.value.split("(")
    if(parts.length == 1)
    {
        makeSpan(parts[0], getType(parts[0]))
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
        case "int":
        case "bool":
        case "str":
        case "if":
        case "for":
        case "while":
        case "#include":
            return "keyword";
        default:
            return "textgnrc";
    }
}

main();