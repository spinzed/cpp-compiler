class editor {
    constructor(id) {
        this.id = id;
        this.node = document.getElementById(id);
        this.core = document.getElementById("editor_core");
        this.input = document.getElementById("input");
        this.rowNode = document.getElementById("rows");
        this.input.addEventListener("keydown", this.checkForDown.bind(this));
        this.counter = new lcounter(this, "rowline");
        this.rows = [];
        this.currentRow = 0; // id of the active row
        this.currentWord = 0; // id of the active word in a row
        this.apparentLetter = 0; // this is used when going up and down rows by arrow keys
        this.remaining = "";
        this.makeNewRow(); // init first row
        this.counter.update();
    }

    checkForDown(event) {
        switch (event.key) {
            case "Enter":
                event.preventDefault();
                this.makeNewRow();
                let lastLetterInPrevRow = this.rows[this.currentRow - 2].content[this.rows[this.currentRow - 2].content.length - 1];
                let pair = "";
                lastLetterInPrevRow == "(" ? pair = ")" : lastLetterInPrevRow == "[" ? pair = "]" : lastLetterInPrevRow == "{" ? pair = "}" : pair = "other";
                if (ed.remaining == pair && pair != "other") {
                    this.currentRowValue += "    ";
                    this.makeNewRow();
                    for (let i = 0; i < this.rows[this.currentRow - 3].countTabs(); i++) {
                        this.currentRowValue += "    "; // inserts tab for every tab in row before
                    }
                    this.currentRowValue += pair;
                    this.remaining = "";
                    this.currentRow--;
                }
                for (let i = 0; i < this.rows[this.currentRow - 2].countTabs(); i++) {
                    this.currentRowValue += "    "; // inserts tab for every tab in row before
                }
                this.updateApparentLetter();
                break;
            case "Backspace":
                event.preventDefault();
                if (this.currentRowValue == "" && this.currentRow != 1) {
                    this.deleteLine();
                }
                else {
                    let decoy = "";
                    for (var i = 0; i < this.currentRowValue.length; i++) {
                        if (i != this.currentRowValue.length - 1) {
                            decoy += this.currentRowValue[i];
                        }
                    }
                    this.currentRowValue = decoy;
                }
                this.updateApparentLetter();
                break;
            case "Delete":
                event.preventDefault();
                if (this.remaining != "") {
                    let decoy = "";
                    for (var i = 0; i < this.remaining.length; i++) {
                        if (i != 0) {
                            decoy += this.remaining[i];
                        }
                    }
                    this.remaining = decoy;
                }
                else if (this.rows.length != this.currentRow) {
                    this.remaining = this.rows[ed.currentRow].content;
                    ed.currentRow++;
                    this.deleteLine();
                }
                this.updateApparentLetter();
                break;
            case "Tab":
                event.preventDefault();
                this.currentRowValue += "    ";
                this.updateApparentLetter();
                break;
            case "(":
            case "[":
            case "{":
                event.preventDefault();
                let decoy = this.remaining;
                this.currentRowValue += event.key;
                let other = "";
                event.key == "(" ? other = ")" : event.key == "[" ? other = "]" : other = "}";
                this.remaining = other + decoy;
                this.updateApparentLetter();
                break;
            case "ArrowLeft":
                if (this.currentRowValue == "" && this.currentRow != 1) { // if its start of the row
                    this.currentRowValue = this.remaining;
                    this.remaining = "";
                    this.currentRow--;
                    this.currentWord = this.currentRowNode.words;
                }
                else if (this.currentRowValue != "") { // takes last letter from content and puts to remaining
                    let decoy1 = "";
                    let decoy2 = "";
                    for (var i = 0; i < this.currentRowValue.length; i++) {
                        if (i != this.currentRowValue.length - 1) {
                            decoy1 += this.currentRowValue[i];
                        }
                        else {
                            decoy2 += this.currentRowValue[i];
                        }
                    }
                    decoy2 +=
                        this.remaining;
                    this.currentRowValue = decoy1;
                    this.remaining = decoy2;
                }
                this.updateApparentLetter();
                break;
            case "ArrowRight":
                if (this.remaining == "" && this.currentRow != this.rows.length) {
                    this.currentRow++;
                    this.remaining = this.currentRowValue;
                    this.currentRowValue = "";
                    this.currentWord = 0;
                }
                else {
                    let decoy = "";
                    for (var i = 0; i < this.remaining.length; i++) {
                        if (i != 0) {
                            decoy += this.remaining[i];
                        }
                        else {
                            this.currentRowValue += this.remaining[i];
                        }
                    }
                    this.remaining = decoy;
                }
                this.updateApparentLetter();
                break;
            case "ArrowUp":
                if (this.currentRow != 1) {
                    // let len = this.currentRowValue.length;
                    this.currentRowValue = this.currentRowValue + this.remaining;
                    this.currentRow--;
                    let decoy1 = "";
                    let decoy2 = "";
                    for (var i = 0; i < this.currentRowValue.length; i++) {
                        if (i < this.apparentLetter) {
                            decoy1 += this.currentRowValue[i];
                        }
                        else {
                            decoy2 += this.currentRowValue[i];
                        }
                    }
                    this.currentRowValue = decoy1;
                    this.remaining = decoy2;
                }
                break;
            case "ArrowDown":
                if (this.currentRow != this.rows.length) {
                    // let len = this.currentRowValue.length;
                    this.currentRowValue = this.currentRowValue + this.remaining;
                    this.currentRow++;
                    let decoy1 = "";
                    let decoy2 = "";
                    for (var i = 0; i < this.currentRowValue.length; i++) {
                        if (i < this.apparentLetter) {
                            decoy1 += this.currentRowValue[i];
                        }
                        else {
                            decoy2 += this.currentRowValue[i];
                        }
                    }
                    this.currentRowValue = decoy1;
                    this.remaining = decoy2;
                }
                break;
            default:
                if (event.ctrlKey && event.shiftKey) { // gotta make this more proffesional
                    
                }
                else if (event.altKey) {

                }
                else if (" qwertzuiopasdfghjklyxcvbnm1234567890=+-*\\/_.,;:#@!?}<>|\"\'".includes(event.key.toLowerCase())) {
                    this.currentRowValue += event.key;
                    this.updateApparentLetter();
                    event.preventDefault();
                }
                else {
                    this.updateApparentLetter();
                    event.preventDefault();
                }
        }
        this.refreshInput();
        this.updateAll();
        this.counter.update();
        updatePointerPosition();
        this.updateCore();
    }

    makeNewRow() {
        this.shiftRowsDown(); // this will take care of everything if the row isnt the last one

        if (this.rows.length == this.currentRow) { // it will do this is this is the last row
            let newRow = new row(this, this.currentRow + 1);
            this.rows.push(newRow);
        }

        this.currentRow++;
    }

    deleteLine(targetedRow = this.currentRow) {
        let targetedRowDiv = document.getElementById("row" + targetedRow);
        rows.removeChild(targetedRowDiv);

        this.rows.splice(targetedRow - 1, 1)

        this.currentRow--;
        this.currentWord = this.currentRowNode.words;
        this.shiftRowsUp();
    }

    shiftRowsUp() {
        for (var i = this.currentRow; i < this.rows.length; i++) {
            this.rows[i].updateNode(i + 1);
        }
    }

    shiftRowsDown() {
        for (var i = this.rows.length; i > this.currentRow; i--) { // will not go through if currentrow = rows.length
            if (i == this.rows.length) {
                let newRow = new row(this, this.rows.length + 1);
                this.rows.push(newRow);
                this.rows[i].content = this.rows[i - 1].content;
            }
            if (i > this.currentRow + 1) {  // skips at first row creation
                this.rows[i - 1].content = this.rows[i - 2].content;
            }
            if (i == this.currentRow + 1) {
                this.rows[i - 1].content = "";
            }
        }
    }

    updateApparentLetter() { // this is used for going up and down rows using arrow keys
        this.apparentLetter = this.currentRowNode.content.length;
    }

    updateCore() { // note: small visual bug still present
        let inner = document.getElementById("editor_inner");
        if (this.rows.length * 20 >= $(document.getElementById("editor")).height()) {
            inner.style.height = (20 * this.rows.length) + "px";
        }
        else {
            inner.style.height = "";
        }
    }

    updateAll() {
        this.rows.forEach(row => {
            let inner = "";
            let rwdiv = document.getElementById("row" + row.id)
            for (let i = 0; i < rwdiv.children.length; i++) {
                inner += rwdiv.children[i].innerHTML;
            }
            if (row == this.currentRowNode) {
                inner += this.remaining;
            }
            if(parseToHTML(row.content) != inner) {
                row.update(false);
            }
        });
    }

    focusInput() {
        this.input.focus();
    }

    refreshInput() {
        this.core.removeChild(this.input);
        this.core.appendChild(this.input);
        this.input.focus();
    }
    
    get currentRowValue() {
        return this.rows[this.currentRow - 1].content;
    }

    set currentRowValue(value) {
        this.rows[this.currentRow - 1].content = value;
        return this.rows[this.currentRow - 1].content;
    }

    get currentRowNode() {
        return this.rows[this.currentRow - 1];
    }

    set currentRowNode(value) {
        this.rows[this.currentRow - 1] = value;
        return this.rows[this.currentRow - 1];
    }

    get getRowCount() {
        return this.rows.length;
    }
}