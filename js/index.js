// const prompt = require('electron-prompt');
const ipcRenderer = require('electron').ipcRenderer;
const electron = require("electron")
const { dialog } = electron.remote
// const remote = electron.remote
// console.log(remote,BrowserWindow,ipcRenderer)
// const dialog = remote.require("dialog")
let id = ""
let myID = document.getElementById("myID");
let remoteID = document.getElementById("yourID")
let connectBtn = document.getElementById("connect")
const setPass = document.getElementById("setPass")
let obj = {}
let remoteConn = []
const fs = require("fs")
const os = require("os")
const rootPath = require("electron-root-path").rootPath
const path = require("path")
let uname = os.userInfo().username
let platform = os.platform();
var PeerServer  = require("peerjs");
const mypeer = new Peer();




//remote id file path for windows
let fpath = `C:\\Users\\${uname}\\AppData\\Local\\Creds.txt`
//remote id file path for mac
if (platform == "darwin") {
    fpath = path.join(rootPath, "Creds.txt")
}

    window.onload = function () {

        //to fetch the uuid for yourself
        let pass = localStorage.getItem("password")
        // console.log(pass)
        if (pass) {
            obj.password = typeof pass !== "string" ? "" : pass
        }
        if (localStorage.getItem("id")) {
            myID.value = localStorage.getItem("id");
            console.log("hello connecting")
            ipcRenderer.send("save-roomId", myID.value)
            connect(myID.value, pass)

        } else {
            console.log("no uuid");
            ipcRenderer.send("get-uuid", JSON.stringify(obj))
        }

        createCards()
        //on getting uuid put it in input
        ipcRenderer.on("uuid", (event, data) => {
            myID.value = data
            localStorage.setItem("id", data)
            // document.getElementById("code").innerHTML = data;
        })

        ipcRenderer.on("cant-share", (e, arg) => {
            alert("You cant share the file!")
        })


        //connect with remote screen on clicking thw connect button
        connectBtn.addEventListener("click", e => {
            e.preventDefault()

            let valid = validator("remoteID", remoteID.value)
            // document.getElementById("error").innerHTML = `${valid.msg}`
            if (valid.res) {
                document.getElementById("error").style.display = "inline"
                // document.getElementById("error").innerHTML = `${valid.msg}`

                bindValues(remoteID.value, myID.value)

            } else {
                // document.getElementById("error").style.display = "block"
                // document.getElementById("error").innerHTML = `${valid.msg}`
                // alert(valid.msg)
                dialog.showMessageBox({
                    title: "warning",


                    message: `${valid.msg}`,
                    type: "warning"
                }).then(res => {
                    console.log(res)
                })
            }



        })


        //when the password of remote screen is entered , if you know then connected directly otherwise send a acception screen
        ipcRenderer.on("password-given", (e, arg) => {
            console.log(arg)
            if (arg.r === "cancel") {
                ipcRenderer.send("request-to-connect", JSON.stringify(obj))
            } else if (arg.r !== null) {
                obj.password = arg.r
                ipcRenderer.send("request-to-connect", JSON.stringify(obj))
            }
        })



        //ask to share file to main process on pressing the share file button
        document.getElementById("shareFile").addEventListener("click", e => {
            e.preventDefault()
            // if (localStorage.getItem("status")) {
            ipcRenderer.send("file-share-dialog", JSON.stringify({ requester: myID.value }))
            // } else {
            // alert("Not connected to share files")
            // }
        })


        //send request to open the dialog of taking password
        setPass.addEventListener("click", e => {
            e.preventDefault()
            // let pass = document.getElementById("pass").value
           let getpass= localStorage.getItem("password")
            ipcRenderer.send("setPassword", {pass:getpass})

            // ipcRenderer.send("trigger-password",{})
        })

        //recive the password and save it in localstorage
        ipcRenderer.on("password-to-set", (e, arg) => {
            //console.log(arg)
            if (arg.r !== null) {
                localStorage.setItem("password", arg.r)
                connect(myID.value, arg.r)
            }
        })




    }

//copy the id by clicking on icon
const copyIt = () => {
    myID.select()
    document.execCommand("copy");
}

//making up the object
const bindValues = (remote, my) => {
    console.log(remote, my)
    obj = { remoteID: remote, myID: my }
    ipcRenderer.send("ask-for-pass", {})

}

//connect to own room
const connect = (ID, pass) => {
    // alert(id)
    console.log(id)
    let payload = {}
    if (pass !== null) {
        if (pass.length > 0) {
            payload.password = pass
        }
    }

    if (ID.trim().length > 0) {
        payload.id = ID
    }
    mypeer.on('open', (id) => {
        console.log("Peer: ", id)
        ipcRenderer.send("join-room", JSON.stringify(payload),id);
    })

}


//send request to file share
const shareFile = () => {
    if (id.trim().length < 1) {
        return alert("start sharing first")
    }
    ipcRenderer.send("file-share-dialog", { id })
}



//read the ids from file and make cards 
const createCards = () => {

    fs.open(fpath, 'r', (err, fd) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('myfile does not exist');
                switcher(true)
            }
            // throw err;
        } else {
            console.log(fd, "file data")
            fs.readFile(fpath, 'utf8', (err, data) => {
                if (err) {
                    console.log(err)

                } else {
                    console.log(data)
                    let arr = data.split(",")
                    if (arr.length > 0 && arr[0] !== "") {
                        console.log(arr)
                        switcher(false)
                        ipcRenderer.send("check-remote-status", JSON.stringify({ remoteArray: arr }))
                        ipcRenderer.on("remote-status-array", (e, arg) => {
                            console.log(arg)
                            document.getElementById("up-cards").innerHTML = ""
                            console.log(typeof arg)
                            arg = JSON.parse(arg)
                            Object.keys(arg).forEach((item, i) => {
                                document.getElementById("up-cards").innerHTML += `<div id=${item} ondblclick="bindValues('${item}','${myID.value}')"   style="display: flex; flex-direction: column; width: 200px;height: 220px; margin:0px 30px 30px 0px; border:1px solid #321633
                                ;">
                                                            <div style="height:78%; background-color: white;">
                                    
                                                            </div>
                                                            <div style="display: flex; height:22%; background-color: #321633; padding: 10px 2px 0 5px; align-content: space-around;">
                                                                <div>
                                                                    <i class="fas fa-square-full ${arg[item] ? 'iconactive' : 'iconinactive'}" style="size: 2px;font-size:10px; }"></i>
                                    
                                                                </div>
                                                                <div style="margin-left: 10px; " class="text-color">
                                                                    <h6 style="top:0;line-height:90%;margin:0;">Remote ${i + 1}</h6>
                                                                    <small style="text-overflow:ellipsis;">id-${item.slice(0, 15)}...</small>
                                                                </div>
                                                                <div style="margin-left: 35px; margin-top: 5px; color:white">
                                                                
                                                                <a class = "dropdown-trigger "  data-target='dropdown${i}' href="#">  <i class="fas fa-ellipsis-v "   ></i></a>
                
                
                
                                                                <ul id='dropdown${i}' class='dropdown-content'>
                                                                <li><a href="#!" onclick="bindValues('${item}','${myID.value}')">Connect</a></li>
                                                                <li><a href="#!" onclick="remove('${item}')">Remove</a></li>
                                                              
                                                              </ul>
                                                                                                  </div>
                                                                                                  
                                                               
                                                            </div>
                                                        </div>
                                                      `
                            })
                            var elems = document.querySelectorAll('.dropdown-trigger');
                            var instances = M.Dropdown.init(elems);
                        })



                    } else {

                        switcher(true)


                    }
                }

            })
        }

    });



}


//to validate the remote id
let re = new RegExp('^[0-9+]{4,6}-[0-9+]{2,3}$');
const validator = (type, val) => {
    let res;
    switch (type) {
        case "remoteID":
            if (val.length == 0) {
                return {
                    msg: "You havent entered any id , please enter the remote id",
                    res: false
                }
            }
            else if (val.length > 0 && val.length <= 10) {
                res = re.test(val)

                return res ? {
                    msg: "",
                    res
                } : {
                    msg: "Invalid Remote Id",
                    res
                };
            } else {
                return {
                    msg: "Not a valid length of id",
                    res: false
                }
            }

    }

}

const switcher = (s) => {
    console.log(s)
    if (s) {
        document.getElementById("content").style.display = "none"
        document.getElementById("banner").style.display = "block";
        document.getElementById("right-div").style.marginLeft = '0px'

    } else {
        document.getElementById("content").style.display = "block"
        document.getElementById("banner").style.display = "none";
        document.getElementById("right-div").style.marginLeft = '20px'
    }
}

const remove = (id) => {
    console.log(id)

    fs.open(fpath, 'r', (err, fd) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('myfile does not exist');
                switcher(true)
            }
            // throw err;
        } else {
            console.log(fd, "file data")
            fs.readFile(fpath, 'utf8', (err, data) => {
                if (err) {
                    console.log(err)

                } else {
                    console.log(data)
                    let arr = data.split(",")
                    let newArr = arr.filter(el => el !== id)
                    if (arr.length > 0) {
                        switcher(false)
                        fs.writeFile(fpath, newArr.join(","), (err) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                        createCards()
                    } else {

                        switcher(true)


                    }
                }

            })
        }
    })

}



const extractID = (e) => {
    console.log(e.parentElement.parentElement.parentElement.id)
    remoteID.value = e.parentElement.parentElement.parentElement.id
}

const closeDropDown = (e) => {
    console.log(e.classList)
    if (!e.classList.contains('.dropbtn')) {
        var myDropdown = document.getElementById("myDropdown");
        if (myDropdown.classList.contains('show')) {
            myDropdown.classList.remove('show');
        }
    }
}

function show() {
    console.log(document.getElementById("myDropdown").classList)
    document.getElementById("myDropdown").classList.toggle("show");
}


