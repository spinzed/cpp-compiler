const ed = new editor("editor_core");
ed.makeNewRow();

function checkForDown(event)
{
    switch(event.key) {
        case "Enter":
            event.preventDefault();
            ed.currentRowNode.update(false);
            ed.makeNewRow();
            let previousRowContent = ed.rows[ed.currentRow - 2].content;
            if (previousRowContent[previousRowContent.length - 1] == "{") {
                ed.currentRowValue += "    ";
                ed.makeNewRow();
                ed.currentRowValue += "}";
                ed.currentRowNode.update(false);
                ed.currentRow--;
            }
            for (let i = 0; i < ed.rows[ed.currentRow - 2].countTabs(); i++) {
                ed.currentRowValue += "    "; // inserts tab for every tab in row before
            }
            ed.currentRowNode.update(false);
            ed.rows[ed.currentRow - 2].update(false);
            break;
        case "Backspace":
            event.preventDefault();
            if(ed.currentRowValue == "" && ed.currentRow != 1) {
                ed.deleteLine();
            }
            else {
                let decoy = "";
                for(var i = 0; i < ed.currentRowValue.length; i++) {
                    if(i != ed.currentRowValue.length-1) {
                        decoy += ed.currentRowValue[i];
                    }
                }
                ed.currentRowValue = decoy;
                ed.currentRowNode.update(false);
            }
            ed.refreshInput();
            break;
        case "Delete":
            event.preventDefault();
            if(ed.remaining != "") {
                let decoy = "";
                for(var i = 0; i < ed.remaining.length; i++) {
                    if(i != 0) {
                        decoy += ed.remaining[i];
                    }
                }
                ed.remaining = decoy;
                ed.currentRowNode.update(false);
            }
            ed.refreshInput();
            break;
        case "Tab":
            event.preventDefault();
            ed.currentRowValue += "    ";
            ed.currentRowNode.update(true)
            break;
        case "ArrowLeft":
            if (ed.currentRowValue == "" && ed.currentRow != 1) {
                ed.currentRowValue = ed.remaining;
                ed.remaining = "";
                ed.currentRow--;
                ed.currentWord = ed.currentRowNode.words;
            }
            else if(ed.currentRowValue != "") {
                let decoy1 = "";
                let decoy2 = "";
                for(var i = 0; i < ed.currentRowValue.length; i++) {
                    if(i != ed.currentRowValue.length - 1) {
                        decoy1 += ed.currentRowValue[i];
                    }
                    else {
                        decoy2 += ed.currentRowValue[i];
                    }                }
                decoy2 +=
                 ed.remaining;
                ed.currentRowValue = decoy1;
                ed.remaining = decoy2;
                ed.currentRowNode.update(false);
            }
            ed.refreshInput();
            break;
        case "ArrowRight":
            if (ed.remaining == "" && ed.currentRow != ed.rows.length) {
                ed.currentRow++;
                ed.remaining = ed.currentRowValue;
                ed.currentRowValue = "";
                ed.currentWord = 0;
            }
            else {
                let decoy = "";
                for(var i = 0; i < ed.remaining.length; i++) {
                    if (i != 0) {
                        decoy += ed.remaining[i];
                    }
                    else {
                        ed.currentRowValue += ed.remaining[i];
                    }
                }
                ed.remaining = decoy;
                ed.currentRowNode.update(false);
            }
            ed.refreshInput();
            break;
        case "ArrowUp":
            if(ed.currentRow != 1) {
                let len = ed.currentRowValue.length;
                ed.currentRowValue = ed.currentRowValue + ed.remaining;
                ed.currentRow--;
                let decoy1 = "";
                let decoy2 = "";
                for(var i = 0; i < ed.currentRowValue.length; i++) {
                    if(i < len) {
                        decoy1 += ed.currentRowValue[i];
                    }
                    else {
                        decoy2 += ed.currentRowValue[i];
                    }
                }
                ed.currentRowValue = decoy1;
                ed.remaining = decoy2;
            }
            ed.currentRowNode.update(false);
            ed.refreshInput();
            break;
        case "ArrowDown":
            if(ed.currentRow != ed.rows.length) {
                let len = ed.currentRowValue.length;
                ed.currentRowValue = ed.currentRowValue + ed.remaining;
                ed.currentRow++;
                let decoy1 = "";
                let decoy2 = "";
                for (var i = 0; i < ed.currentRowValue.length; i++) {
                    if (i < len) {
                        decoy1 += ed.currentRowValue[i];
                    }
                    else {
                        decoy2 += ed.currentRowValue[i];
                    }
                }
                ed.currentRowValue = decoy1;
                ed.remaining = decoy2;
            }
            ed.currentRowNode.update(false);
            ed.refreshInput();
            break;
        default:
            if(event.ctrlKey && event.shiftKey) {
                // do nothing for now
            }
            else if (event.altKey) {

            }
            else if(" qwertzuiopasdfghjklyxcvbnm1234567890=+-*\\/_.,;:#@(){}[]<>|\"\'".includes(event.key.toLowerCase())) {
                event.preventDefault();
                ed.currentRowValue += event.key;
                ed.currentRowNode.update(true);
            }
    }
    ed.input.value = "";
    updatePointerPosition();
}