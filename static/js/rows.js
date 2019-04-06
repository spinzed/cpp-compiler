class Row {
    constructor(editor, id) {
        this.editor = editor;
        this.id = id;
        this.words = 0;
        this.content = "";
        this.node = document.createElement("div");
        this.node.id = "row" + this.id;
        this.node.classList.add("rows");
        this.editor.rowNode.appendChild(this.node);
        this.node.setAttribute("onclick", "ed.focusRow.call(this)")
    }

    update(space, forceRemaining = false) { // Parses input field and puts its content into spans
        let value = "";
        if (this.id == this.editor.currentRow || forceRemaining == true) {
            value = this.editor.rows[this.id - 1].content + this.editor.remaining;
        }
        else {
            value = this.editor.rows[this.id - 1].content;
        }
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.editor.rows[this.id - 1].words = 0;
        this.editor.column = 1;
        this.editor.currentWord = 1;
        let elements = parseToArray(value);
        for (var i = 0; i < elements.length; i++) {
            if (i == elements.length - 1) {
                this.editor.rows[this.id - 1].makeSpan(elements[i], space);
            }
            else {
                this.editor.rows[this.id - 1].makeSpan(elements[i], false);
            }
        }
        if (this.id == this.editor.currentRow) {
            this.editor.rows[this.id - 1].content = this.editor.currentRowValue;
        }
        else {
            this.editor.rows[this.id - 1].content = value;
        }
    }

    makeSpan(content, space) {
        let parsedContent = parseToHTML(content);
        let span = document.createElement("span");
        if (space) {
            span.innerHTML = parsedContent + "&nbsp;";
        }
        else {
            span.innerHTML = parsedContent;
        }
        span.classList.add("textspan");
        span.classList.add(getType(content));
        span.id = this.id + "_" + (this.words + 1);
        let rowdiv = document.getElementById("row" + this.id);
        rowdiv.appendChild(span);
        this.words++;
    }

    splitContent(index, includeRemaining = true) {
        let content = "";
        includeRemaining ? content = this.content + this.editor.remaining : content = this.content;
        let decoy1 = "";
        let decoy2 = "";
        for (var i = 0; i < content.length; i++) {
            i < index ? decoy1 += content[i] : decoy2 += content[i];
        }
        this.content = decoy1;
        this.editor.remaining = decoy2;
    }

    countTabs() {
        let content = this.content;
        let count = 0;
        while (content.substring(0, 4) == "    ") {
            content = content.substring(4, content.length);
            count++;
        }
        return count;
    }

    updateNode(newId) {
        this.id = newId;
        this.node.id = "row" + newId;
    }
}

class Word {
    constructor(content, row, id) {
        this.row = row;
        this.id = id;
        this.value = content;
    }
    get type() {
        return getType(this.value);
    }
    get hash() {
        return row + "_" + id;
    }
}

class LCounter {
    constructor(editor, id) {
        this.node = document.getElementById(id);
        this.editor = editor;
        this.rows = 0;
    }

    update() {
        let numOfRows = this.editor.rows.length;
        while(this.rows > numOfRows) {
            this.node.removeChild(this.node.lastChild);
            this.rows--;
        }
        while(this.rows < numOfRows) {
            let newr = document.createElement("div");
            newr.classList.add("rows");
            newr.classList.add("counter");
            newr.innerHTML = this.rows + 1;
            this.node.appendChild(newr);
            this.rows++;
        }
    }
}