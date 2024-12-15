const api = "https://b1messenger.esdlyon.dev/login";
const apiMessage = "https://b1messenger.esdlyon.dev/api/messages";

const login = document.querySelector(".login");
const chat = document.querySelector(".chat");

let token = null;

async function getToken(username, password) {
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username:username,
            password:password,
        })
    }
    return await fetch(api, params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            token = data.token;
            return data
        })
}


async function getMessages() {
    let parameters = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }

    }
    return await fetch(apiMessage, parameters)
        .then(res => res.json())
        .then(data => {
            return data
        })
}


function displayLoginForm(){
    login.style.display = "flex";
    const username = document.querySelector(".username");
    const password = document.querySelector(".password");
    const submit = document.querySelector(".submit");
    submit.addEventListener('click', ()=>{
        getToken(username.value, password.value).then((res)=>{
            if(res.token){

                displayChat()
            }
        })
    })
}
function displayChat(){
    login.style.display = "none";
    chat.style.display = "flex";
    getMessages().then((res)=>{console.log(res)})
}
if(!token){
    displayLoginForm()
}else{
    displayChat()
}