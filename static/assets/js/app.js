const ed = new editor("editor_core");
ed.makeNewRow();

function checkForDown(event)
{
    switch(event.key) {
        case "Enter":
            event.preventDefault();
            ed.currentRowNode.updateRow(false);
            ed.makeNewRow();
            let previousRowValue = ed.rows[ed.currentRow - 1]
            if(previousRowValue[previousRowValue.length - 1] == "{") {
                ed.currentRowValue += "    ";
            }
            ed.currentRowNode.updateRow(false);
            ed.rows[ed.currentRow - 2].updateRow(false);
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
                ed.currentRowNode.updateRow(false);
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
                ed.currentRowNode.updateRow(false);
            }
            ed.refreshInput();
            break;
        case "Tab":
            event.preventDefault();
            ed.currentRowValue += "    ";
            ed.currentRowNode.updateRow(true)
            break;
        case "ArrowLeft":
            if(ed.currentRowValue != "") {
                let decoy1 = "";
                let decoy2 = "";
                for(var i = 0; i < ed.currentRowValue.length; i++) {
                    if(i != ed.currentRowValue.length - 1) {
                        decoy1 += ed.currentRowValue[i];
                    }
                    else {
                        decoy2 += ed.currentRowValue[i];
                    }
                }
                decoy2 += ed.remaining;
                ed.currentRowValue = decoy1;
                ed.remaining = decoy2;
                ed.currentRowNode.updateRow(false);
            }
            ed.refreshInput();
            break;
        case "ArrowRight":
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
            ed.currentRowNode.updateRow(false);
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
            ed.currentRowNode.updateRow(false);
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
            ed.currentRowNode.updateRow(false);
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
                ed.currentRowNode.updateRow(true);
            }
    }
    input.value = "";
    input.setAttribute("style", "left: " + (10 + (8.8 * ed.currentRowValue.length)) + "px; top: " + ((ed.currentRow - 1) * 20) + "px");
}