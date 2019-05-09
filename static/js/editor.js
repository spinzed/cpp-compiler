class Editor {
    constructor(id) {
        this.id = id;
        this.node = document.getElementById(this.id);
        this.core = document.getElementById(this.id + "_core");
        this.rowNode = document.getElementById(this.id + "_rows");
        this.counter = new LCounter(this);
        this.caret = new Caret(this);
        this.caret.input.addEventListener("keydown", this.checkForDown.bind(this));
        $(window).resize(() => { this.updateCoreSize(); }); // updates the window on editor resize, gotta tweak it
        $(this.core).on('mousedown', this.detectEvent.bind(this));
        this.rows = [];
        this.currentRow = 0; // id of the active row
        this.apparentLetter = 0; // this is used when going up and down rows by arrow keys
        this.remaining = "";

        // VVV initialize editor for use
        this.makeRow(); // init first row
        this.counter.update();
    }

    detectEvent(event) { // depending on click event, configures eventListeners for input
        setTimeout(() => this.clickRow(event, false), 0);
        this.boundCheckDown = this.eventCheckDown.bind(this); // had to put the function in a var so I can remove eventListener
        document.addEventListener("keydown", this.boundCheckDown);
        let elm = $(this.core);
        this.xPosFormer = event.pageX - elm.offset().left;
        this.yPosFormer = event.pageY - elm.offset().top;
        // ^^ this code above is executed once on mousedown event

        $(document).on('mouseup mousemove', (event) => {
            if (event.type == 'mouseup') {
                this.xPosNew = event.pageX - elm.offset().left;
                this.yPosNew = event.pageY - elm.offset().top;
                this.xPosNew < 0 ? this.xPosNew = 0 : null;
                this.yPosNew < 0 ? this.yPosNew = 0 : null;
                $(document).off('mouseup mousemove');
                document.removeEventListener("keydown", this.boundCheckDown);
                // this.caret.input.focus();
                // ^^ this code above is executed once on mousedown event
            } else {
                this.xPosNew = event.pageX - elm.offset().left;
                this.yPosNew = event.pageY - elm.offset().top;
                this.xPosNew < 0 ? this.xPosNew = 0 : null;
                this.yPosNew < 0 ? this.yPosNew = 0 : null;
                setTimeout(() => this.clickRow(event, false), 0);
                // ^^ this code above is executed once on mousedown event
            }
            //console.log(event.type)
        });
    }

    eventCheckDown(event) {
        let startx = Math.ceil((this.xPosFormer) / 8.8);
        let endx = Math.ceil((this.xPosNew) / 8.8);
        let starty = Math.ceil((this.yPosFormer) / 20);
        let endy = Math.ceil((this.yPosNew) / 20);
        //console.log(starty, endy)
        let maxx, minx, maxy, miny;
        startx >= endx ? maxx = startx : minx = startx;
        endx > startx ? maxx = endx : minx = endx;
        starty >= endy ? maxy = starty : miny = starty;
        endy > starty ? maxy = endy : miny = endy;

        let oldRem = this.remaining;
        this.currentRowValue += this.remaining;
        for (let i = miny + 1; i <= maxy; i++) {
            this.deleteRow(miny + 1);
        }
        this.focusRow(miny);
        this.currentRowNode.splitContent(startx);
        this.remaining = oldRem;
        this.checkForDown(event);

        // VV Deinit this stuff
        this.xPosFormer = undefined;
        this.yPosFormer = undefined;
        this.xPosNew = undefined;
        this.yPosNew = undefined;
        $(document).off('mouseup mousemove');
        document.removeEventListener("keydown", this.boundCheckDown);
        this.checkForDown(event);
        this.caret.input.focus();
        this.postInit();
    }

    checkForDown(event) {
        let updateApparent = true;
        let prevent = true; // for event.preventDefault()
        switch (event.key) {
            case "Enter":
                this.makeRow();
                let lastInPrev = this.rows[this.currentRow - 2].content[this.rows[this.currentRow - 2].content.length - 1];
                let pair = "";
                lastInPrev == "(" ? pair = ")" : lastInPrev == "[" ? pair = "]" : lastInPrev == "{" ? pair = "}" : pair = "other";
                if (this.remaining[0] == pair && pair != "other") { // it will run if theres a backet pair in row before
                    this.makeRow();
                    for (let i = 0; i < this.rows[this.currentRow - 3].countTabs(); i++) {
                        this.currentRowValue += "    "; // inserts tab for every tab in row before
                    }
                    this.currentRowValue += this.remaining;
                    this.remaining = "";
                    this.currentRow--;
                }
                // VVV add additional stuff to current row
                for (let i = 0; i < this.rows[this.currentRow - 2].countTabs(); i++) {
                    this.currentRowValue += "    "; // inserts tab for every tab in row before
                }
                "([{".includes(lastInPrev) ? this.currentRowValue += "    " : null;
                //  ^^ will add a tab if theres bracet in row before, it will alwazs work
                break;
            case "Backspace":
                if (this.currentRowValue == "" && this.currentRow != 1) {
                    this.deleteRow();
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
                break;
            case "Delete":
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
                    this.deleteRow();
                }
                break;
            case "Tab":
                this.currentRowValue += "    ";
                break;
            case "(":
            case "[":
            case "{":
                let decoy = this.remaining;
                this.currentRowValue += event.key;
                let other = "";
                event.key == "(" ? other = ")" : event.key == "[" ? other = "]" : other = "}";
                this.remaining = other + decoy;
                break;
            case ")":
            case "]":
            case "}":
                if (this.remaining[0] == event.key) {
                    this.currentRowNode.splitContent(this.currentRowValue.length + 1);
                }
                else {
                    this.currentRowValue += event.key;
                }
                break;
            case "\"":
            case "\'":
                if (this.remaining[0] == event.key) {
                    this.currentRowNode.splitContent(this.currentRowValue.length + 1);
                }
                else {
                    event.key == "\"" ? this.currentRowValue += "\"\"" : this.currentRowValue += "\'\'";
                    this.currentRowNode.splitContent(this.currentRowValue.length - 1);
                }
                break;
            case "ArrowLeft":
                if (this.currentRowValue == "" && this.currentRow != 1) { // if its start of the row
                    this.previousRow();
                }
                else if (this.currentRowValue != "") { // takes last letter from content and puts to remaining
                    this.currentRowNode.splitContent(this.currentRowValue.length - 1);
                }
                break;
            case "ArrowRight":
                if (this.remaining == "" && this.currentRow != this.rows.length) {
                    this.currentRow++;
                    this.remaining = this.currentRowValue;
                    this.currentRowValue = "";
                }
                else {
                    this.currentRowNode.splitContent(this.currentRowValue.length + 1);
                }
                break;
            case "ArrowUp":
                if (this.currentRow != 1) {
                    this.previousRow();
                    this.currentRowNode.splitContent(this.apparentLetter);
                }
                updateApparent = false;
                break;
            case "ArrowDown":
                if (this.currentRow != this.rows.length) {
                    this.nextRow();
                    this.currentRowNode.splitContent(this.apparentLetter);
                }
                updateApparent = false;
                break;
            default:
                if (event.ctrlKey && event.shiftKey) { // gotta make this more proffesional
                    switch(event.key) {
                        case "K":
                            this.deleteRow()
                            this.remaining = "";
                            break;
                        default:
                            prevent = false;
                    }
                }
                else if (event.altKey) {
                    prevent = false;
                }
                else if (" qwertzuiopasdfghjklyxcvbnm1234567890=+-*\\/_.,;:#@!?<>|".includes(event.key.toLowerCase())) {
                    this.currentRowValue += event.key;
                }
        }
        prevent ? event.preventDefault() : null;
        this.postInit(updateApparent); // refreshes the editor, must be run after every change in the editor
    }

    makeRow() {
        this.shiftRowsDown(); // this will take care of everything if the row isnt the last one

        if (this.rows.length == this.currentRow) { // it will do this is this is the last row
            let newRow = new Row(this, this.currentRow + 1);
            this.rows.push(newRow);
        }

        this.currentRow++;
    }

    deleteRow(targetedRow = this.currentRow) {
        let targetedRowDiv = document.getElementById("row" + targetedRow);
        this.rowNode.removeChild(targetedRowDiv);
        this.rows.splice(targetedRow - 1, 1)
        this.currentRow = targetedRow - 1;
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
                let newRow = new Row(this, this.rows.length + 1);
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

    focusRow(id) {
        this.currentRowValue = this.currentRowValue + this.remaining;
        this.remaining = "";
        this.currentRow = id;
    }

    nextRow() { //updates row before switching, may need to rework it
        this.currentRowValue = this.currentRowValue + this.remaining;
        this.remaining = "";
        this.currentRow++;
    }

    previousRow() {  //updates row before switching, may need to rework it
        this.currentRowValue = this.currentRowValue + this.remaining;
        this.remaining = "";
        this.currentRow--;
    }

    updateApparentLetter() { // this is used for going up and down rows using arrow keys
        this.apparentLetter = this.currentRowNode.content.length;
    }

    clickRow(event, focus = true) {
        let elm = $(this.core);
        let xPos = event.pageX - elm.offset().left;
        let yPos = event.pageY - elm.offset().top;
        // ^^ gotta figure out how that works

        if (yPos > this.rows.length * 20) {
            this.rows[this.rows.length - 1].focus(this.rows[this.rows.length - 1].content.length);
        }
        else {
            let row_id;
            yPos == 0 ? row_id = 0 : row_id = Math.floor((yPos - 1) / 20);
            row_id < 0 ? row_id = 0 : null;
            let row = this.rows[row_id];
            row.focus(Math.round(xPos / 8.8) - 1);
        }
        this.caret.blink();
        focus ? this.caret.input.focus() : null;
    }

    detectEvent(event) { // depending on click event, configures eventListeners for input
        setTimeout(() => this.clickRow(event, false), 0);
        let functionvar = this.checkForDown.bind(this); // had to put the function in a var so I can remove eventListener
        document.addEventListener("keydown", functionvar);
        $(document).on('mouseup mousemove', (event) => {
            if (event.type == 'mouseup') {
                $(document).off('mouseup mousemove');
                document.removeEventListener("keydown", functionvar);
                this.caret.input.focus();
            } else {
                setTimeout(() => this.clickRow(event, false), 0);
            }
            //console.log(event.type)
        });
    }

    updateCoreSize() { // note: small visual bug still present
        let inner = document.getElementById("editor_inner");
        let height = $(this.node).height();
        if (this.rows.length * 20 + height - 20 >= height) {
            inner.style.height = (this.rows.length * 20 + height - 20) + "px";
        }
        else {
            inner.style.height = "";
        }
    }

    updateAll() { // updates content in rows of the editor, without row counter => this.counter.update()
        this.rows.forEach(row => {
            let inner = "";
            let check = row.content;
            let rwdiv = document.getElementById("row" + row.id)
            for (let i = 0; i < rwdiv.children.length; i++) {
                inner += rwdiv.children[i].innerHTML;
            }
            if (row == this.currentRowNode) {
                check += this.remaining;
            }
            if(Parsing.parseToHTML(check) != inner) {
                row.update();
            }
        });
    }

    packData() {
        let result = ``;
        for (let i = 0; i < this.rows.length; i++) {
            i != 0 ? result += "\n" : null;
            result += this.rows[i].content;
            this.rows[i].id == this.currentRow ? result += this.remaining : null;
        }
        return result;
    }

    postInit(updateApparent = true) { // must be run after every change in editor
        updateApparent ? this.updateApparentLetter() : null;
        this.caret.blink();
        this.updateAll();
        this.counter.update();
        this.caret.updatePosition();
        this.updateCoreSize(); // updates rows of editor to correctly render on screen
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