function getType(variable)     // simplify this?
{
    switch (variable)
    {
        case "void":
        case "var":
        case "int":
        case "char":
        case "bool":
        case "if":
        case "for":
        case "while":
        case "do":
        case "using":
        case "namespace":
        case "#include":
        case "float":
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
        case ";":
        case "=":
        case "<":
        case ">":
            return "sign";
        default:
            if(variable[0]=="\"" && variable[variable.length - 1]=="\"") {
                return "string";
            }
            if(variable[0]=="\'" && variable[variable.length - 1]=="\'") {
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
    }
    return result;
}

function parseToArray(string) {
    let arr = [string];
    let result = [];
    let signs = ["(", ")", ";", "=", "#", "@", "|", ":", "&", "<", ">"];
    let keywords = ["#include", "using", "namespace", "int", "float", "bool", "char", "do", "void", "if", "for", "do", "while", "var"];
    let special = ["\"", "'"];
    let finalcheck = [];
    for(var i = 0; i < 10; i++) { // digits
        finalcheck.push(String(i));
    }
    finalcheck = finalcheck.concat(signs).concat(keywords).concat(special)
    finalcheck.forEach(sign => { // every sign
        for(var j = 0; j < arr.length; j++) { // every word
            let word = arr[j];
            switchBreak: {      // js is bullshit
                switch(sign) {
                    case "#":
                        if(word[0] == sign) {
                            result.push(word);
                            break switchBreak;
                        }
                        result = defaultParse(word, sign, result);  //will ship this for per ex #include
                        break switchBreak;
                    case "@":
                        if(word[0] == sign) {
                            result.push(word);
                            break switchBreak;
                        }
                        result = defaultParse(word, sign, result);
                        break switchBreak;
                    case "<":
                        result = defaultParse(word, sign, result);
                        break switchBreak;
                    case ">":    // simplify using arrows?
                        result = defaultParse(word, sign, result);
                        for(var k = 0; k < result.length; k++) { // first "
                            if(result[k] == "<") {
                                for(var l = k + 1; l < result.length; l++) { // second "
                                    if(result[l] == ">") {
                                        for(var m = k; m < l; m++) {
                                            result[k]+=result[k + 1];
                                            result.splice(k + 1, 1);
                                        }
                                    }
                                }
                            }
                        }
                        break switchBreak;
                    case "\"":
                    case "\'":    // simplify? ( and fix preferably)
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
        result = [];
    });
    result = arr;
    return result;

    function defaultParse(word, sign, resultArray) { // just isolates the sign
        let tempArr = word.split(sign);
        tempArr.forEach(j => {
            resultArray.push(j, sign);
        });
        resultArray.pop();
        return resultArray;
    }
}