let Accept = document.getElementById("accept");
let Reject = document.getElementById("reject");
const { ipcRenderer } = require("electron")
let passForm = document.querySelector("form")
let socket;
window.onload = () => {

    //when user click the accept button
    Accept.addEventListener("click", e => {
        ipcRenderer.send("accept-the-request", {})
        Accept.disabled = true
        Accept.style.backgroundColor = "#4d224e"
    })

    //when reject button is clicked
    Reject.addEventListener("click", e => {
        ipcRenderer.send("end-communication", { reject: true })
    })



    passForm.addEventListener("submit", e => {
        let pass = pasForm.pass.value
        if (pass) {
            ipcRenderer.send("check-pass", JSON.stringify({ pass }))
        }
    })
    ipcRenderer.on("wrong-pass", (e, arg) => {
        alert("unauthorized! Wrong Password")
    })
}