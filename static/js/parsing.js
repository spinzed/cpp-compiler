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
        case "!":
        case "?":
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
    let digits = [];
    for (let i = 0; i < 10; i++) { digits.push(String(i)); } // digits
    let signs = ["(", ")", ";", "=", "@", "!", "?", "|", ":", "&", ">"];
    let keywords = ["#include", "using", "namespace", "int", "float", "bool", "char", "string", "do", "void", "if", "for", "do", "while", "var", "static", "inline"];
    let special = ["\"", "'"];
    keywords.forEach(sign => {
        arr = keywordParse(sign, arr);
    });
    signs.concat(digits).forEach(sign => {
        arr = normalParse(sign, arr);
    });
    special.forEach(sign => {
        arr = normalParse(sign, arr);
        for (let i = 0; i < arr.length; i++) {
            word = arr[i];
            if (word == sign) {
                if (i < arr.length) {
                    while (i < arr.length - 1) {
                        arr[i] += arr[i + 1];
                        arr.splice(i + 1, 1);
                        word = arr[i];
                        if (word[word.length - 1] == sign) {
                            break;
                        }
                    }
                }
            }
        }
    });
    if (arr.length > 1 && arr[0] == "#include") {
        if (arr[1][1] == "<" || arr[1][1] == "\"") {
            for (let i = 2; i < arr.length; i++) {
                arr[1] += arr[i];
            }
            arr.splice(2, arr.length - 2);
        }
    }

    return arr; // returns result

    function normalParse(sign, arr) { // just casually splits the array by the given sign
        let result = [];
        arr.forEach(element => {
            let decoyarr = element.split(sign);
            decoyarr.forEach(elementinner => {
                result.push(elementinner, sign);
            });
            result.pop();
        });
        result = clean(result);
        return result;
    }
    function keywordParse(sign, resultArray) { // optimize myb?
        decoyArray = normalParse(sign, resultArray);
        let timer = 0;
        decoyArray.forEach(y => {
            if (y == sign) {
                let letterOfPrev = "";
                let letterOfNext = "";
                timer != 0 ? letterOfPrev = decoyArray[timer - 1][decoyArray[timer - 1].length - 1] : null;
                timer != decoyArray.length - 1 ? letterOfNext = decoyArray[timer + 1][0] : null;
                if (decoyArray.length != 1) {
                    if (timer == 0) {
                        if (letterOfNext != " " && letterOfNext != "(") {
                            decoyArray[timer] = sign + decoyArray[timer + 1];
                            decoyArray.splice(timer + 1, 1);
                        }
                    }
                    else if (timer == decoyArray.length - 1) {
                        if (decoyArray.length - 1 && letterOfPrev != " ") {
                            decoyArray[timer] = decoyArray[timer - 1] + sign;
                            decoyArray.splice(timer - 1, 1);
                        }
                    }
                    else if (letterOfPrev != " " || letterOfNext != " " && letterOfNext != "(") {
                        decoyArray[timer] = decoyArray[timer - 1] + sign + decoyArray[timer + 1];
                        decoyArray.splice(timer - 1, 1);
                        decoyArray.splice(timer, 1);
                    }
                }
            }
            timer++;
        });
        return decoyArray;
    }
    function clean(array) {
        for (var j = 0; j < array.length; j++) { // cleans the array of empty strings
            if (array[j] == "") {
                array.splice(j, 1)
            }
        }
        return array;
    }
}