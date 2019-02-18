const text = document.getElementById("input");

function main()
{
    text.addEventListener("keydown", checkForEnter)
}
function checkForEnter(event)
{
    if(event.keyCode==13)
    {
        console.log("gae");
        text.value="";
    }
}
main();