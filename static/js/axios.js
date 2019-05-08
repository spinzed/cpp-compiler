const btn = document.getElementById("submit_code");
btn.addEventListener("mousedown", () => {
    console.log("sent")
    let result = ``;
    for (let i = 0; i < ed.rows.length; i++) {
        i != 0 ? result += "\n" : null;
        result += ed.rows[i].content;
    }
    axios.post("/", {
        kod: result
    });
})