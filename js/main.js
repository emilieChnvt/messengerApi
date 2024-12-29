const api = "https://b1messenger.esdlyon.dev/login";
const apiMessage = "https://b1messenger.esdlyon.dev/api/messages";

const login = document.querySelector(".login");
const chat = document.querySelector(".chat");
const discussionsGroupePage = document.querySelector(".discussionsGroupePage");
const discussionsPrivePage = document.querySelector(".discussionsPrivePage");
const grp = document.querySelector(".grp");
const inputMessage = document.querySelector(".inputMessage");
const chatPrive = document.querySelector(".chatPrive");



let token = null;
const toSignUp = document.querySelector(".toSignUp");
const toSignIn = document.querySelector(".toSignIn");
const loginPage = document.querySelector(".login");
const createAccountPage = document.querySelector(".createAccount");

const createAccount=()=>{
    const username = document.querySelector(".usernameAccount");
    const password = document.querySelector(".passwordAccount");
    const submit = document.querySelector(".submitAccount");
    submit.addEventListener("click", (e) => {
        e.preventDefault();
        register(username.value, password.value)
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    createAccountPage.classList.add("hidden");
                    createAccountPage.classList.remove("visible");

                    login.classList.remove("hidden");
                    login.classList.add("visible");
                }
            })
    })
    toSignIn.addEventListener("click", () => {
        createAccountPage.classList.add("hidden");
        createAccountPage.classList.remove("visible");

        login.classList.add("visible");
        login.classList.remove("hidden");

    })

}
const displayLoginForm = ()=>{

    const username = document.querySelector(".username");
    const password = document.querySelector(".password");
    const submit = document.querySelector(".submit");

    submit.addEventListener('click', (e)=>{
        e.preventDefault()
        getToken(username.value, password.value).then((res)=>{
            if(res.token){
                displayHomeChat()
            }
        })
    })
    toSignUp.addEventListener("click", () => {
        login.classList.add("hidden");
        login.classList.remove("visible");

        createAccountPage.classList.add("visible");
        createAccountPage.classList.remove("hidden");

        createAccount()
    })
}
const displayHomeChat = ()=> {
    login.style.display = "none";
    discussionsGroupePage.classList.add("visible");
    discussionsPrivePage.classList.add("hidden");

    whoAmIDiv()

    chooseBtnConv()
    displayChatConv()

}
const whoAmIDiv = () => {
    const nav = document.querySelector(".nav");
    whoami().then((res)=>{
        console.log(res);
        let profil = `<div class="align-right">
                                 <span>${res.displayName}</span> 
                                 <img src=${res.imageUrl} alt="imgProfile" class=" photoProfil rounded-circle" >
                                
                            </div>`
        nav.innerHTML = profil;
    })
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
            removeArrowToGoBack()
            displayChatConv()
        })

    })
    btnPrive.forEach((btn) => {
        btn.addEventListener("click", ()=>{
            discussionsGroupePage.classList.remove("visible");
            discussionsGroupePage.classList.add("hidden");

            discussionsPrivePage.classList.remove("hidden");
            discussionsPrivePage.classList.add("visible");
            removeArrowToGoBack()
            displayChatConvPrive()
        })
    })
}

const displayChatConvPrive = ()=>{

    const allConv = document.querySelector(".allConvPrives");
    allConv.innerHTML = "";

    convsPrive().then((res)=>{
        res.forEach((item)=>{
            console.log(item);
            let conv = `<div class="grpPrive d-flex align-items-center justify-content-between border rounded-3 px-3 py-1" id="${item.id}">
                                    <div class=" d-flex align-items-center justify-content-center">
                                        <div class="nameGroupe rounded-circle photoProfil border border-1 me-3"></div>
                                        <p class="pt-3 me-2">${item.with.username}</p>
                                        <p class="size pt-3">${item.lastMessage.content}</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:14px"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                               </div>`

            allConv.innerHTML += conv
            toogleBtnToShowConvPrive()

        })
    })
    removeArrowToGoBack()


}
const toogleBtnToShowConvPrive = () => {
    const grp = document.querySelectorAll(".grpPrive");
    grp.forEach((item)=> {
        item.addEventListener('click', () => {
            displayConvPrive(item.id);

        })

    })
}
const displayConvPrive = (itemId) =>{
    discussionsPrivePage.classList.add("hidden");
    discussionsPrivePage.classList.remove("visible");

    chatPrive.classList.add("visble");
    chatPrive.classList.remove("hidden");
    displayArrowToGoBack()
    displayMessagesPrive(itemId)
}
const displayMessagesPrive = (itemId) =>{
    const allMessagesPrives = document.querySelector(".allMessagesPrives");
    allMessagesPrives.innerHTML = "";  // Réinitialise la liste des messages privés

    getConvPrive(itemId).then((res)=>{
            res.privateMessages.forEach((msg)=>{
                addMessageToChat(msg, 'private')
            })
        addMessagePrive(itemId)
        addReactionPrivateMessage()
    })

}
const addMessagePrive = (itemId) => {
    const inputMessagePrive = document.querySelector(".inputMessagePrive");
    const btnMessagePrive = document.querySelector(".btnMessagePrive");
    btnMessagePrive.addEventListener("click", ()=>{
        newPrivateMessage(inputMessagePrive.value, itemId).then((res)=>{
           addMessageToChat(
               {
                   content:inputMessagePrive.value,
                   author: { username: "emiliech"},
               },
               "private"
           );
           inputMessagePrive.value = "";
        })
    })
}
const addReactionPrivateMessage = (messageId, reactionType) => {
        emojiReaction(messageId, reactionType).then((res)=>{
            console.log(res)
        })
}

const displayChatConv=()=>{

    discussionsGroupePage.classList.add("visible");
    discussionsGroupePage.classList.remove("hidden");

    discussionsPrivePage.classList.add("hidden");
    removeArrowToGoBack()
    toogleBtnToShowConv()


}
const removeArrowToGoBack = ()=> {
    const arrow = document.querySelector(".arrowToGoBack");
    console.log(arrow);
    if(arrow){
        arrow.remove()
    }
}
const toogleBtnToShowConv = () => {
    grp.addEventListener("click", ()=>{
        console.log("grp");
        displayConv()
    })
}
const displayConv=()=>{
    discussionsGroupePage.classList.add("hidden");
    discussionsGroupePage.classList.remove("visible");
    displayArrowToGoBack()
   displayMessages()
}
const displayArrowToGoBack = () => {
    const nav = document.querySelector(".nav");

    if(!document.querySelector(".arrowToGoBack")){
        const arrow = document.createElement("span");
        arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:20px; height:20px" class="arrowToGoBack"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>'
        nav.prepend(arrow);

        const arrowToGoBack = document.querySelector(".arrowToGoBack");
        arrowToGoBack.addEventListener("click", goBack);
    }

}
const goBack = () => {
    discussionsGroupePage.classList.add("visible");
    discussionsGroupePage.classList.remove("hidden");

    chat.classList.add("hidden");
    chat.classList.remove("visible");

    chatPrive.classList.add("hidden");
    chatPrive.classList.remove("visible");
    removeArrowToGoBack()
}
const displayMessages = () => {
    const allMessages = document.querySelector(".allMessages");
    allMessages.innerHTML = "";  // Réinitialise la liste des messages

    const chat = document.querySelector(".chat");

    chat.classList.add("visible");
    chat.classList.remove("hidden");

    getMessages().then(res => {
        chat.classList.remove("hidden");
        chat.classList.add("visible");

        console.log(res)

        res.forEach(msg => {
            addMessageToChat(msg, 'group')
        })
    })



    displayInputMessage()
}
const displayInputMessage = () => {

    const btnMessage = document.querySelector(".btnMessage");
    btnMessage.addEventListener("click", ()=>{
        const message = inputMessage.value;
        if(message){
            newMessage(message).then((res)=> {
                console.log(res);
                //pour récupérer les messages et les id
                getMessages().then(res => {
                    // Le dernier message ajouté est généralement le plus récent
                    const newMessage = res[res.length - 1];
                    addMessageToChat({
                        content:message,
                        author:{ username:'emiliech'},
                        id: newMessage.id,
                    }, 'group')
                })

            })
            inputMessage.value = "";
        }


    })
}
const addMessageToChat = (message, type) => {
    let allMessagesContainer;

    if(type === 'group'){
        allMessagesContainer = document.querySelector(".allMessages");
    }else if (type === 'private'){
        allMessagesContainer = document.querySelector(".allMessagesPrives");
    }

    const messagesDiv = document.createElement("div");
    messagesDiv.classList.add("d-flex", "border", "border-1", "my-2");
    messagesDiv.style.width = "100%"

    const messageContent = document.createElement("span");
    messageContent.textContent = message.content;

    if(message.id){
        messagesDiv.setAttribute("data-message-id", message.id);
    }
    console.log(message)
    if(message.author.username === "emiliech"){
        const trashElement = deleteElement(messagesDiv, message.id)
        messagesDiv.appendChild(trashElement);
    }
    if(message.author.username === "emiliech"){
        messagesDiv.style.justifyContent = "flex-end"
        messageContent.style.textAlign = "right";
    }else{
        messageContent.style.textAlign = "left";
        messagesDiv.style.justifyContent = "flex-start"
    }

    let reactions = reactionDiv(message)

    messagesDiv.appendChild(messageContent);
    messagesDiv.appendChild(reactions);

    allMessagesContainer.appendChild(messagesDiv);

    //faire défiler pr voir new message
    allMessagesContainer.scrollTop = allMessagesContainer.scrollHeight;

}
const reactionDiv = (message)=> {
    const reactionContainer = document.createElement("div");
    reactionContainer.classList.add("reactionContainer");
    reactionContainer.style.marginLeft = "10px";
    reactionContainer.style.position="relative";

    //btn pour afficher réactions
    const reactionButton = document.createElement("span");
    reactionButton.innerHTML= "+"
    reactionButton.style.cursor = "pointer";

    const reactionMenu = document.createElement("div");
    reactionMenu.classList.add("reactionMenu");

    const reactions = [
        { type:"happy", emoji:"🙂"},
        { type:"sadd", emoji:"😭"},
        { type:"cryy", emoji:"😢"},
        { type:"vomi", emoji:"🤢"},
    ]
   reactions.forEach(reaction => {
       const reactionOption = document.createElement("span");
       reactionOption.classList.add("reactionOption");
       reactionOption.setAttribute("data-reaction", reaction.type)
       reactionOption.textContent = reaction.emoji;
       reactionMenu.appendChild(reactionOption);
   })
    reactionButton.addEventListener("click", ()=>{
        reactionMenu.style.display = reactionMenu.style.display = "none" ? "block" : "none";
    })
    reactionMenu.addEventListener("click", (e)=>{
        if(e.target.classList.contains("reactionOption")){
            const reactionType = e.target.getAttribute("data-reaction");
            addReactionPrivateMessage(message.id, reactionType)
            reactionMenu.style.display = "none";
            console.log("Reaction Type:", reactionType);
            console.log("Message ID:", message.id);
        }
    })
    reactionContainer.appendChild(reactionButton);
    reactionContainer.appendChild(reactionMenu);

    return reactionContainer;
}
const deleteElement=(messagesDiv, messageId)=>{
    const trash = document.createElement("p");
    trash.innerHTML = '🗑️'
    trash.style.cursor = "pointer";

    trash.addEventListener("click", ()=>{
        if(messageId){
            deleteMessage(messageId).then((res)=> {
                messagesDiv.remove()
            })
        }

    })
    return trash
}

if(!token){
    displayLoginForm()
}else{
    displayHomeChat()
}

async function register(username, password){
    let params={
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password:password,
        })
    }
    return await fetch('https://b1messenger.esdlyon.dev/register', params)
    .then(res => res.json())
    .then(data => {
        return data
    })
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

async function whoami(){
    let params ={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    return await fetch("https://b1messenger.esdlyon.dev/api/whoami", params)
        .then(res => res.json())
        .then(data => {
            return data
        })
}
async function newMessage(inputMessage){
    let params ={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
       body: JSON.stringify({
           content: inputMessage
       })
    }
    return await fetch('https://b1messenger.esdlyon.dev/api/messages/new', params)
        .then(res => res.json())
        .then(data => {
console.log(data)
            return data
        })

}
async function deleteMessage(id){
    let params ={
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    return await fetch(`https://b1messenger.esdlyon.dev/api/messages/delete/${id}`, params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data

        })
}

async function convsPrive(){
    let params ={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    return await fetch('https://b1messenger.esdlyon.dev/api/private/conversations', params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })
}
async function getConvPrive(itemId){
    let params ={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    return await fetch(`https://b1messenger.esdlyon.dev/api/private/conversation/${itemId}`, params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })
}
async function newPrivateMessage(inputMessagePrive, itemId){
    let params ={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            content: inputMessagePrive
        })
    }
    return await fetch(`https://b1messenger.esdlyon.dev/api/private/message/${itemId}`, params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })
}
async function emojiReaction(messageId, reactionType){
    let params ={
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        }

    }
    return await fetch(`https://b1messenger.esdlyon.dev/api/private/message/${messageId}/${reactionType}`, params)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        return data
    })
}

