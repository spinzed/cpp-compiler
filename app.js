const editor = document.getElementById("editor");
const input = document.getElementById("input");
const text = document.getElementById("text");
var ric = 1;

function main()
{
    input.addEventListener("keydown", checkForDown)
    input.addEventListener("keyup", checkForUp)
}

function checkForDown(event)
{
    if(event.keyCode==32)
    {
        event.preventDefault();
        refractor();

        input.value="";
    }
    if(event.keyCode==8)
    {
        if(input.value=="")
        {
            event.preventDefault();
            let loadspan = document.getElementById(ric - 1);
            let splitarr = loadspan.innerHTML.split("&nbsp;")
            for(var i = 0; i < splitarr.length; i++)
            {
                input.value+=splitarr[i];
            }
            loadspan.parentNode.removeChild(loadspan);
            ric--;
        }
    }
}

function checkForUp(event)
{
    if(event.which==66)
    {
        input.value+="}";
    }
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
    span.id = ric;
    text.appendChild(span);
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