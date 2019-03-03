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
    let result = [];
    let signs = ["(", ")", ";", "=", "<", ">", "#", "@", "|", ":", "&", "\"", "\'"];
    signs.forEach(sign => { // every sign
        for(var j = 0; j < arr.length; j++) { // every word
            let word = arr[j];
            switchBreak: {
                switch(sign) {
                    case "#":
                        if(word[0] == sign) {
                            result.push(word);
                            break switchBreak;
                        }
                        result = defaultParse(word, sign, result);
                        break switchBreak;
                    case "@":
                        if(word[0] == sign) {
                            result.push(word);
                            break switchBreak;
                        }
                        result = defaultParse(word, sign, result);
                        break switchBreak;
                    case "\"":
                    case "\'":
                        result = defaultParse(word, sign, result);
                        for(var k = 0; k < result.length; k++) { // first "
                            if(result[k] == sign) {
                                for(var l = k + 1; l < result.length; l++) { // second "
                                    if(result[l] == sign) {
                                        for(var m = k; m < l; m++) {
                                            result[k]+=result[k + 1];
                                            result.splice(k + 1, 1);
                                        }
                                    }
                                }
                            }
                        }
                        break switchBreak;
                    default:
                        result = defaultParse(word, sign, result);
                        break switchBreak;
                }
            }
        }
        // array
        for(var j = 0; j < result.length; j++) {
            if(result[j]=="") {
                result.splice(j, 1)
            }
        }
        arr = result;
        console.log(result)
        result = [];
    });
    result = arr;
    return result;

    function defaultParse(word, sign, resultArray) {
        let tempArr = word.split(sign);
        tempArr.forEach(j => {
            resultArray.push(j, sign);
        });
        resultArray.pop();
        return resultArray;
    }
}