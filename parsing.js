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
        case "string":
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
            if(variable[0]=="\"" && variable[variable.length]=="\"") {
                return "string";
            }
            if(variable[0]=="\'" && variable[variable.length]=="\'") {
                return "string";
            }
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
    let arr = [string];
    let temp = [];
    let result = [];
    let signs = ["(", ")", ";", "=", "<", ">", "#", "@", "|", ":", "&", "\"", "\'"];
    signs.forEach(sign => { // every sign
        for(var i = 0; i < arr.length; i++) { // every word
            let word = arr[i];
            switchBreak: {
                switch(sign) {
                    case "#":
                        if(word[0] == sign) {
                            result.push(word);
                            break switchBreak;
                        }
                    case "@":
                        if(word[0] == sign) {
                            result.push(word);
                            break switchBreak;
                        }
                    default:
                        temp = word.split(sign);
                        temp.forEach(j => {
                            result.push(j, sign);
                        });
                        result.pop();
                        temp = [];
                    case "\"":
                    case "\'":
                        for(var i = 0; i < arr.length; i++) { // every word
                            word = arr[i];
                            temp = word.split(sign);
                            temp.forEach(j => {
                                result.push(j, sign);
                            });
                            result.pop();
                            temp = [];
                            for(var i = 0; i < result.length; i++) {
                                if(result[i] == sign) {
                                    for(var j = i+1; j < result.length; j++) {
                                        if(result[j] == sign) {
                                            for(var k = i; k < j; k++) {
                                                result[i]+=result[i+1];
                                                result.splice(i+1, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                }
            }
        }
        // array
        for(var i = 0; i < result.length; i++) {
            if(result[i]=="") {
                result.splice(i, 1)
            }
        }
        arr = result;
        result = [];
    });
    result = arr;
    return result;
}