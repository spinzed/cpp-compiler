class row {
    constructor(id, editor) {
        this.id = id;
        this.words = 0;
        this.content = "";
        this.node = document.createElement("div");
        this.node.id = "row" + this.id;
        this.node.classList.add("rows");
        this.editor = editor;
        this.editor.rowNode.appendChild(this.node);
        this.node.setAttribute("onclick", "focusRow.call(this)")
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
        // console.log(content)
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
        // for (var i = this.words; i > parseToArray(this.content).length; i--) {
        //     let elem1 = document.getElementById(this.id + "_" + i);
        //     elem1.id = this.id + "_" + (i + 1);
        // }

        let rowdiv = document.getElementById("row" + this.id);
        rowdiv.appendChild(span);
        this.words++;
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

class word {
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