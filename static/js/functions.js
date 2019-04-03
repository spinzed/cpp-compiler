function updatePointerPosition() {
    ed.input.style.left = (10 + (8.8 * ed.currentRowValue.length)) + "px";
    ed.input.style.top = ((ed.currentRow - 1) * 20) + "px";
}

function focusRow() {
    ed.currentRowNode.content += ed.remaining;
    ed.remaining = "";
    let id = this.id.split("row")[1];
    ed.currentRow = parseInt(id);
    updatePointerPosition();
}

// todo: move this leftover pile of uselessness to classes