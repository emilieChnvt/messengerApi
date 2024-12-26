const api = "https://b1messenger.esdlyon.dev/login";
const apiMessage = "https://b1messenger.esdlyon.dev/api/messages";

const login = document.querySelector(".login");
const chat = document.querySelector(".chat");
const discussionsGroupePage = document.querySelector(".discussionsGroupePage");
const discussionsPrivePage = document.querySelector(".discussionsPrivePage");


let token = null;
const toSignUp = document.querySelector(".toSignUp");
const toSignIn = document.querySelector(".toSignIn");
const loginPage = document.querySelector(".login");
const createAccount = document.querySelector(".createAccount");
toSignUp.addEventListener("click", () => {
    login.classList.add("hidden");
    login.classList.remove("visible");

    createAccount.classList.add("visible");
    createAccount.classList.remove("hidden");

})
toSignIn.addEventListener("click", () => {
    createAccount.classList.add("hidden");
    createAccount.classList.remove("visible");

    login.classList.add("visible");
    login.classList.remove("hidden");

})


const displayLoginForm = ()=>{

    const username = document.querySelector(".username");
    const password = document.querySelector(".password");
    const submit = document.querySelector(".submit");
    submit.addEventListener('click', ()=>{
        getToken(username.value, password.value).then((res)=>{
            if(res.token){

                displayHomeChat()
            }
        })
    })
}
const displayHomeChat = ()=> {
    login.style.display = "none";
    discussionsGroupePage.classList.add("visible");
    discussionsPrivePage.classList.add("hidden");

    chooseBtnConv()
    displayChatConv()

}
const chooseBtnConv = ()=> {
    const btnGroupe = document.querySelectorAll(".btnGroupe");
    const btnPrive = document.querySelectorAll(".btnPrive");

    btnGroupe.forEach((btn) => {
        btn.addEventListener("click", ()=>{
            discussionsGroupePage.classList.remove("hidden");
            discussionsGroupePage.classList.add("visible");

            discussionsPrivePage.classList.remove("visible");
            discussionsPrivePage.classList.add("hidden");
            displayChatConv()
        })

    })
    btnPrive.forEach((btn) => {
        btn.addEventListener("click", ()=>{
            discussionsGroupePage.classList.remove("visible");
            discussionsGroupePage.classList.add("hidden");

            discussionsPrivePage.classList.remove("hidden");
            discussionsPrivePage.classList.add("visible");
        })
    })
}





const displayChatConv=()=>{

    const chat = document.querySelector(".chat");
    chat.classList.add("visible");
    chat.classList.remove("hidden");


    discussionsGroupePage.classList.add("visible");
    discussionsGroupePage.classList.remove("hidden");

    discussionsPrivePage.classList.add("hidden");

    const grp = document.querySelector(".grp");

    grp.addEventListener("click", ()=>{
        console.log("grp");
        displayMessages()
    })

}
const displayMessages=()=>{
    getMessages().then(res=>{
        chat.classList.remove("hidden");
        chat.classList.add("visible");
        console.log(res)
    })
}
if(!token){
    displayLoginForm()
}else{
    displayHomeChat()
}

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

