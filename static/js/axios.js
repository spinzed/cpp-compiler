const btn = document.getElementById("submit_code");
btn.addEventListener("mousedown", () => {
    console.log("sending")
    let result = ``;
    for (let i = 0; i < ed.rows.length; i++) {
        i != 0 ? result += "\n" : null;
        result += ed.rows[i].content;
    }
    axios.post("/", {
        kod: result
    })
    .then(response => console.log(response.data))
    .catch(err => console.error(err));
})
