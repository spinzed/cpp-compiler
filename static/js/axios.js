const btn = document.getElementById("submit_code");
btn.addEventListener("mousedown", () => {
    console.log("sent")
    let result = "";
    for (let i = 0; i < ed.rows.length; i++) {
        result += ed.rows[i].content;
        result += " ";
    }
    axios.post("/", {
        kod: result
    });
})
