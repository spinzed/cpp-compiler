function parseID(id)
{
    let idarr = [];
    idarr = id.split("_");
    currentRow = idarr[0];
    currentColumn = idarr[1];
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
        case "using":
        case "namespace":
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

function parseToHTML(value)
{
    let result = value;
    result = replaceAll(result, " ", "&nbsp;");
    result = result.replace("<", "&lt;");
    result = result.replace(">", "&gt;");
    return result;
}

function parseFromHTML(value)
{
    let result = value;
    result = replaceAll(result, "&nbsp;", " ");
    result = result.replace("&lt;", "<");
    result = result.replace("&gt;", ">");
    return result;
}

function replaceAll(string, oldValue, newValue)
{
    let result = string;
    while(result.includes(oldValue))
    {
        result = result.replace(oldValue, newValue)
        console.log(result)
    }
    return result;
}

function parseToArray(string)
{
    pop = false;
    let arr = [string];
    let temp = [];
    let result = [];
    let signs = ["(", ")", ";", "=", "<", ">", "|", ":"];
    signs.forEach(sign => {
        arr.forEach(i => {
            let len = arr.length - 1;
            if(arr[len][arr[len].length-1] == sign)
            {
                pop = true;
            }
            temp = i.split(sign);
            temp.forEach(j => {
                result.push(j, sign);
            });
            result.pop();
            temp = [];
        });
        if(pop)
        {
            result.pop();
            pop = false;
        }
        arr = result;
        result = [];
    });
    result = arr;
    return result;
}