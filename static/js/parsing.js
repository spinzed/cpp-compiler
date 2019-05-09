class Parsing {
    static getType(string) {
        let signs = [";", "=", "@", "!", "?", "|", ":", "&", "<", ">"];
        let keywords = ["#include", "using", "namespace", "int", "float", "bool", "char", "string", "do", "void", "if", "for", "do", "while", "var", "static", "inline", "return"];
        let digits = [];
        for (let i = 0; i < 10; i++) { digits.push(String(i)); }
        if (signs.includes(string)) {
            return "keyword";
        } else if (keywords.includes(string)) {
            return "sign";
        } else if (digits.includes(string)) {
            return "number";
        }
        if (string[0] == "\"" && string[string.length - 1] == "\"") {
            return "string";
        } else if (string[0] == "\'" && string[string.length - 1] == "\'") {
            return "string";
        }
        return "textgnrc";
    }

    static parseToHTML(value) {
        let result = value;
        result = this.replaceAll(result, " ", "&nbsp;");
        result = this.replaceAll(result, "<", "&lt;");
        result = this.replaceAll(result, ">", "&gt;");
        return result;
    }

    static parseFromHTML(value) {
        let result = value;
        result = this.replaceAll(result, "&nbsp;", " ");
        result = this.replaceAll(result, "<", "&lt;");
        result = this.replaceAll(result, "&gt;", ">");
        return result;
    }

    static replaceAll(string, oldValue, newValue) {
        let result = string;
        while (result.includes(oldValue)) {
            result = result.replace(oldValue, newValue)
        }
        return result;
    }

    static parseToArray(string) {
        let arr = [string];
        let signs = ["(", ")", ";", "=", "@", "!", "?", "|", ":", "&", "<", ">"];
        let keywords = ["#include", "using", "namespace", "int", "float", "bool", "char", "string", "do", "void", "if", "for", "do", "while", "var", "static", "inline", "return"];
        let digits = [];
        for (let i = 0; i < 10; i++) { digits.push(String(i)); } // digits
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
                let word = arr[i];
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
        if (arr.length > 2 && arr[0] == "#include") {
            if (arr[2] == "<" || arr[2][0] == "\"") {
                for (let i = 3; i < arr.length; i++) {
                    arr[2] += arr[i];
                }
                arr.splice(3, arr.length - 3);
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
            let decoyArray = normalParse(sign, resultArray);
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
}