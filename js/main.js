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

    if (type === 'group') {
        allMessagesContainer = document.querySelector(".allMessages");
    } else if (type === 'private') {
        allMessagesContainer = document.querySelector(".allMessagesPrives");
    }
    const aMessage = document.createElement("div");
    aMessage.classList.add("aMessage");

    const messagesDiv = document.createElement("div");
    messagesDiv.classList.add("messagesDiv");

console.log(message)
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("contentContainer");

    const messageContent = document.createElement("span");
    messageContent.classList.add("messageContent");
    messageContent.textContent = message.content ;

    contentContainer.appendChild(messageContent);

    const photoProfil = document.createElement("img");
    photoProfil.classList.add("photoProfil");


    if (message.author.username !== "emiliech" && message.author.image && message.author.image.imageName) {
        const imageUrl = `https://example.com/uploads/${message.author.image.imageName}`;
        photoProfil.src = `url(${imageUrl})`;
    }

    if (message.id) {
        messagesDiv.setAttribute("data-message-id", message.id);
    }

    if (message.author.username === "emiliech") {
        messagesDiv.classList.add("marg");
        messagesDiv.classList.add("messagesDivByMe");
        messagesDiv.style.justifyContent = "flex-end"

        const trashElement = deleteElement(messagesDiv, message.id)
        messagesDiv.appendChild(trashElement);

        const pen = penToEdit(message)
        messagesDiv.prepend(pen);
    } else {
        messageContent.style.textAlign = "left";
        messagesDiv.style.justifyContent = "flex-start"

        const authorOfMessage = document.createElement("span");
        authorOfMessage.classList.add("authorOfMessage");
        authorOfMessage.textContent = message.author.username ;

        const  reactions = reactionDiv(message)
        contentContainer.appendChild(reactions)

        messagesDiv.appendChild(authorOfMessage)

    }



    messagesDiv.appendChild(contentContainer);
    aMessage.appendChild(photoProfil);
    aMessage.appendChild(messagesDiv);

    allMessagesContainer.appendChild(aMessage);

    //faire défiler pr voir new message
    allMessagesContainer.scrollTop = allMessagesContainer.scrollHeight;

}
const penToEdit=(message)=>{
    const pencil = document.createElement("span")
    pencil.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:20px; height:20px; padding:5px; background-color:#f0f0f0; border-radius:50%; cursor:pointer; position: absolute; left:-5px; bottom:50%"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>`
    pencil.addEventListener("click", ()=>{
        console.log("messageId avant l'appel:", message.id);

        editMessage(message, message.id)
    })
    return pencil
}
const editMessage = (message, messageId, ) => {
    const allMessagesContainer = document.querySelector(".allMessages");
    const messagesDiv = allMessagesContainer.querySelector(`[data-message-id="${messageId}"]`);


    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = message.content;

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";

    saveButton.addEventListener("click", ()=>{
        const newContent = editInput.value;

        if(newContent){
            updateMessage(message.id, newContent).then((res)=> {
                console.log(res)
                messagesDiv.querySelector(".messageContent").innerHTML = newContent;
                messagesDiv.removeChild(editInput);
                messagesDiv.removeChild(saveButton);

            })

        }

    })

    messagesDiv.appendChild(editInput);
    messagesDiv.appendChild(saveButton);

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
    const trash = document.createElement("span");
    trash.innerHTML = '🗑️'
    trash.classList.add("trash");

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

async function updateMessage(messageId, newContent){
    let params ={
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            content: newContent
        })
    }
    return await fetch (`https://b1messenger.esdlyon.dev/api/messages/${messageId}/edit`, params)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        return data
    })
}