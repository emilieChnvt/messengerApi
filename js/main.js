const api = "https://b1messenger.esdlyon.dev/login";
const apiMessage = "https://b1messenger.esdlyon.dev/api/messages";

const login = document.querySelector(".login");
const chat = document.querySelector(".chat");
const discussionsGroupePage = document.querySelector(".discussionsGroupePage");
const discussionsPrivePage = document.querySelector(".discussionsPrivePage");
const grp = document.querySelector(".grp");
const inputMessage = document.querySelector(".inputMessage");
const chatPrive = document.querySelector(".chatPrive");

let currentId = null;
let conversations = [];
let currentUser = null;

let token = null;
let freshener = null
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
                currentUser = username.value;
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
        let profil = `<div class="align-right">
                                 <span>${res.displayName}</span> 
                                 <img src=${res.imageUrl} alt="imgProfile" class=" photoProfil rounded-circle" >
                                
                            </div>`
        nav.innerHTML += profil;
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
        conversations = res

        res.forEach((item)=>{

            let conv = `<div class="grpPrive d-flex align-items-center justify-content-between borderOrange rounded-3 px-3 py-1" id="${item.id}">
                                    <div class=" d-flex align-items-center justify-content-center">
                                        <div class="nameGroupe rounded-circle photoProfil border border-1 me-3"></div>
                                        <p class="pt-3 me-2">${item.with.username}</p>
                                        <p class="size pt-3">${item.lastMessage.content}</p>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:14px"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
                               </div>`

            allConv.innerHTML += conv


        })
        toogleBtnToShowConvPrive()
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
    currentId = itemId //id conv

    const currentConv = conversations.find(conv =>conv.id === +itemId); //+ pour convertir en nombre (c'était une string)

    const recipientId = currentConv.with.id; // id utilisateur

    if(recipientId){
        discussionsPrivePage.classList.add("hidden");
        discussionsPrivePage.classList.remove("visible");

        chatPrive.classList.add("visible");
        chatPrive.classList.remove("hidden");
        displayArrowToGoBack();
        displayMessagesPrive(itemId);


    }


}
const displayMessagesPrive = (itemId) =>{
    const allMessagesPrives = document.querySelector(".allMessagesPrives");
    allMessagesPrives.innerHTML = "";  // Réinitialise la liste des messages privés
    currentId = itemId

    getConvPrive(itemId).then((res)=>{
        console.log(res);
        const author = res.with.username;
        const authorElement = document.querySelector(".authorName")
        authorElement.classList.add("visible");
        authorElement.innerHTML = author;
            res.privateMessages.forEach((msg)=>{
                addMessageToChat(msg, 'private')
            })
        addMessagePrive(itemId)

        const messages= document.querySelectorAll(".allMessagesPrives .aMessage .messagesDiv");
            messages.forEach((message)=>{
                const messageId = message.getAttribute("data-message-id");

                const reactionsButtons = message.querySelectorAll(".reactionButton");
                reactionsButtons.forEach((reaction)=>{
                    reaction.addEventListener("click", ()=>{
                        const reactionType = button.getAttribute("data-reaction-type");
                        addReactionPrivateMessage(messageId, reactionType);
                    })
                })
            })
    })

}
const addMessagePrive = (itemId) => {
    console.log(itemId);
    const btnMessagePrive = document.querySelector(".btnMessagePrive");

    btnMessagePrive.removeEventListener("click", handleSendMessage)
    btnMessagePrive.addEventListener("click", ()=>{handleSendMessage(itemId)})
}


const handleSendMessage = (itemId) => {
    const inputMessagePrive = document.querySelector(".inputMessagePrive");
    const currentConv = conversations.find(conv =>conv.id === +itemId); //+ pour convertir en nombre (c'était une string)

    console.log(conversations);
    const recipientId = currentConv.with.id; // id utilisateur
console.log(recipientId);
        newPrivateMessage(inputMessagePrive.value, recipientId).then((res)=>{
            console.log(res);
            addMessageToChat(
                {
                    content:inputMessagePrive.value,
                    author: { username: "emiliech"},
                },
                "private"
            );

            inputMessagePrive.value = "";
        })

}
const addReactionMessage = (messageId, reactionType) => {
    emojiReaction(messageId, reactionType).then((res)=>{
        const emoji = getEmojiForReaction(reactionType);
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if(!messageElement)return;
        let reactionContainer = messageElement.querySelector('.reactionExisting');

        if (!reactionContainer) {
            reactionContainer = document.createElement("div");
            reactionContainer.classList.add("reactionExisting");
            messageElement.querySelector(".contentContainer").appendChild(reactionContainer);
        }

        // Recherche du span correspondant à la réaction
        let reactionSpan = reactionContainer.querySelector(`[data-reaction="${reactionType}"]`);

        if (res.status === "unreacted") {
            // Si la réaction doit être supprimée
            if (reactionSpan) {
                const count = parseInt(reactionSpan.textContent.split(" ")[1]) || 0;
                if (count > 1) {
                    reactionSpan.textContent = `${emoji} ${count - 1}`;
                } else {
                    reactionSpan.remove();
                }
            }
        } else if (res.status === "reacted") {
            // Si la réaction doit être ajoutée
            if (!reactionSpan) {
                reactionSpan = document.createElement("span");
                reactionSpan.classList.add("reactionCount");
                reactionSpan.setAttribute("data-reaction", reactionType);
                reactionSpan.textContent = `${emoji} 1`;
                reactionContainer.appendChild(reactionSpan);
            } else {
                // Mise à jour du compteur
                const count = parseInt(reactionSpan.textContent.split(" ")[1]) || 0;
                reactionSpan.textContent = `${emoji} ${count + 1}`;
            }
            }
        })
}
const getEmojiForReaction =(reactionType) => {
    const reactions={
    "smile": "🙂",
        "happy": "😃",
    "sadd": "😭",
    "cryy": "😢",
    "vomi": "🤢"
    }
    return reactions[reactionType]
}

const displayChatConv=()=>{

    discussionsGroupePage.classList.add("visible");
    discussionsGroupePage.classList.remove("hidden");

    discussionsPrivePage.classList.add("hidden");
    removeArrowToGoBack()
    toogleBtnToShowConv()


}

//arrow to goBack on the page
const removeArrowToGoBack = ()=> {
    const arrow = document.querySelector(".arrowToGoBack");
    if(arrow){
        arrow.remove()
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


const goBackPrive = ()=>{
    discussionsPrivePage.classList.add("visible");
    discussionsPrivePage.classList.remove("hidden");

    chat.classList.add("hidden");
    chat.classList.remove("visible");

    chatPrive.classList.add("hidden");
    chatPrive.classList.remove("visible");

    const authorName = document.querySelector(".authorName");
    authorName.classList.add("hidden");
    authorName.classList.remove("visible");
    removeArrowToGoBack()



}
const displayArrowToGoBack = () => {
    const nav = document.querySelector(".nav");

    if(!document.querySelector(".arrowToGoBack")){
        const arrow = document.createElement("span");
        arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="width:20px; height:20px" class="arrowToGoBack"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>'
        nav.prepend(arrow);

        const arrowToGoBack = document.querySelector(".arrowToGoBack");
        arrowToGoBack.addEventListener("click", ()=>{
            if(chat.classList.contains("visible")){
                goBack();
            }else if (chatPrive.classList.contains("visible")){
                goBackPrive()
            }
        } );
    }

}

const toogleBtnToShowConv = () => {
    grp.addEventListener("click", ()=>{
        displayConv()
    })
}
const displayConv=()=>{
    discussionsGroupePage.classList.add("hidden");
    discussionsGroupePage.classList.remove("visible");
    displayArrowToGoBack()
   displayMessages()
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


        res.forEach(msg => {
            addMessageToChat(msg, 'group')
        })
    })
    displayInputMessage()
}

const displayInputMessage = (messageId, reactionType) => {

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
                    emojiReaction(messageId, reactionType)
                })

            })
            inputMessage.value = "";
        }


    })
}
const addMessageToChat = (message, type) => {
    console.log('its here', message)
    let allMessagesContainer = (type === 'group') ? document.querySelector('.allMessages'): document.querySelector('.allMessagesPrives')

    const {aMessage, messagesDiv, contentContainer, messageContent} = createMessageContainer(message)
    const photoProfil = addProfileImg(message, messagesDiv);

    authorAction(message, messagesDiv);
    addMessageId(message, messagesDiv);

    if (type === 'private') {
        addReactions(message, contentContainer);
    }


    const responseButton = createResponseButton(message);
    messagesDiv.appendChild(responseButton)

    const responseContainer= createResponseContainer(message)
    messagesDiv.appendChild(responseContainer)

    if(photoProfil){
        aMessage.appendChild(photoProfil);

    }
    aMessage.appendChild(messagesDiv);
    allMessagesContainer.appendChild(aMessage);

    //faire défiler pr voir new message
    allMessagesContainer.scrollTop = allMessagesContainer.scrollHeight;

}
const addMessageId=(message, messagesDiv)=>{
    if (message.id) {
        messagesDiv.setAttribute("data-message-id", message.id);
        console.log("Private Message ID:", message.id);
    }
}
const addReactions=(message, contentContainer)=>{
    const  reactions = reactionDiv(message)
    contentContainer.appendChild(reactions);





}
const createMessageContainer=(message)=>{
    const aMessage = document.createElement("div");
    aMessage.classList.add("aMessage");

    const messagesDiv = document.createElement("div");
    messagesDiv.classList.add("messagesDiv");

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("contentContainer");

    const messageContent = document.createElement("span");
    messageContent.classList.add("messageContent");
    messageContent.textContent = message.content ;

    contentContainer.appendChild(messageContent);
    messagesDiv.appendChild(contentContainer);

    return { aMessage, messagesDiv, contentContainer, messageContent }; // pour retourner plusierus choses
}
const addProfileImg=(message)=>{
    console.log(message.author.image)

    if(message.author.username === "emiliech") return null;
    if(!message.author.image || !message.author.image.imageName) return null
    const photoProfil = document.createElement("img");
    photoProfil.classList.add("photoProfil");

    const imageUrl = `https://example.com/uploads/${message.author.image.imageName}`;

    photoProfil.src = imageUrl;
    return photoProfil;
}
const authorAction = (message, messagesDiv, )=>{
    console.log(currentUser)
    if (message.author.username === currentUser) {
        console.log(currentUser)
        messagesDiv.classList.add("marg");
        messagesDiv.classList.add("messagesDivByMe");
        messagesDiv.style.justifyContent = "flex-end"

        const trashElement = deleteElement(messagesDiv, message.id)
        messagesDiv.appendChild(trashElement);

        const pen = penToEdit(message)
        messagesDiv.prepend(pen);
    } else {
        const authorOfMessage = document.createElement("span");
        authorOfMessage.classList.add("authorOfMessage");
        authorOfMessage.textContent = message.author.username;
        messagesDiv.appendChild(authorOfMessage);
        messagesDiv.style.justifyContent = "flex-start"

    }
}
const createResponseButton=(message)=>{
    const responseButton = document.createElement("button");
    responseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:15px; height:15px"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2l0 64 112 0c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96l-96 0 0 64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg>`;

    responseButton.classList.add("responseButton");
    responseButton.addEventListener("click", ()=>toggleMessageToAddResponse(message));

    return responseButton
}
const createResponseContainer=(message)=>{
    const responseContainer = document.createElement("div");
    if(message.responses &&message.responses.length > 0){
        message.responses.forEach(response=>{
            const eachResponse = createResponse(response);
            responseContainer.appendChild(eachResponse);
        })
    }
    return responseContainer;
}
const createResponse=(message)=>{
    const eachResponse = document.createElement("div");
    eachResponse.classList.add("eachResponse");

    const responseAuthor = document.createElement("span");
    responseAuthor.classList.add("responseAuthor");
    responseAuthor.textContent = message.author.username;

    const responseContent = document.createElement("span");
    responseContent.classList.add("responseContent");
    responseContent.textContent = message.content;

    eachResponse.appendChild(responseAuthor);
    eachResponse.appendChild(responseContent);

    return eachResponse;
}


const toggleMessageToAddResponse = (message ) => {
    const responseDiv = document.createElement("div");
    responseDiv.classList.add("responseDiv");
    responseDiv.setAttribute("data-message-id", message.id);

    const responseInput = document.createElement("input");
    responseInput.classList.add("responseInput");

    const sendResponse=document.createElement("button");
    sendResponse.classList.add("sendResponse");
    sendResponse.textContent = "envoyer";


    sendResponse.addEventListener("click", ()=>{
        const content = responseInput.value;
        console.log("Contenu envoyé :", content);  // Vérifie la valeur de content

        response(message.id, content).then((res)=>{
            displayResponse(message.id, res, content);
            responseInput.remove()
            sendResponse.remove();
        })

    })
    responseDiv.appendChild(responseInput);
    responseDiv.appendChild(sendResponse);

    const messageDiv = document.querySelector(`.messagesDiv[data-message-id="${message.id}"]`);
    messageDiv.appendChild(responseDiv);

}

const displayResponse=( messageId, responseData )=>{// response(message.id, content)
    const messageDiv = document.querySelector(`.messagesDiv[data-message-id="${messageId}"]`);

    let responseContainer = document.querySelector(".responseContainer");

    if(!responseContainer){
        responseContainer = document.createElement("div");
        responseContainer.classList.add("responseContainer");
        messageDiv.appendChild(responseContainer);
    }
    const eachResponse= document.createElement('div');
    eachResponse.classList.add("eachResponse");


    //auteur
    const responseAuthor = document.createElement("span");
    responseAuthor.classList.add("responseAuthor");
    responseAuthor.innerHTML = "emiliech";

    //contenu
    const responseContent = document.createElement("span");
    responseContent.classList.add("responseContent");
    responseContent.textContent = responseData.content;

    eachResponse.appendChild(responseAuthor);
    eachResponse.appendChild(responseContent);

    responseContainer.appendChild(eachResponse);

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
const reactionDiv = (message, messageId, type)=> {
    console.log(message)
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

    const reactions = ["happy", "sadd", "cryy", "vomi"]
   reactions.forEach(type => {
       const reactionOption = document.createElement("span");
       reactionOption.classList.add("reactionOption");
       reactionOption.setAttribute("data-reaction", type)
       reactionOption.textContent = getEmojiForReaction(type);
       reactionMenu.appendChild(reactionOption);
   })
    reactionButton.addEventListener("click", ()=>{
        reactionMenu.style.display = reactionMenu.style.display === "none" ? "block" : "none";
    })
    reactionMenu.addEventListener("click", (e)=>{
        if(e.target.classList.contains("reactionOption")){
            const reactionType = e.target.getAttribute("data-reaction");
            addReactionMessage(message.id, reactionType)
            reactionMenu.style.display = "none";

        }
    })


    const reactionCount = {
        happy: 0,
        sadd: 0,
        cryy: 0,
        vomi: 0,
    };

    if(message.reactions && message.reactions.length >0){
        message.reactions.forEach((reaction) => {
            if (reactionCount[reaction.type] !== undefined) {
                reactionCount[reaction.type]++;
            }
        });
    }


    const reactionExisting = document.createElement("div");
    reactionExisting.classList.add("reactionExisting");


    if(message.reactions && message.reactions.length >0){
        message.reactions.forEach((reaction) => {
        const emoji = getEmojiForReaction(reaction.type);
        const reactionSpan = document.createElement("span");
        reactionSpan.classList.add("reactionCount");
        reactionSpan.setAttribute("data-reaction", reaction.type);

        reactionSpan.textContent = `${emoji} ${reactionCount[reaction.type]}`; //emoji + nb
        console.log("vhgvjh", message.reactions);


        reactionSpan.addEventListener("click", () => {

            console.log("Click détecté sur :", reactionSpan.textContent);
            console.log("Message ID:", messageId);
            console.log("Reaction Type:", type);

            addReactionMessage(messageId, type);
        });
        reactionExisting.appendChild(reactionSpan);

    })
    }


        reactionContainer.appendChild(reactionExisting);

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
const addImageToChat=(imageUrl)=>{
    const allMessagesContainer = document.querySelector(".allMessages");
    const messageElement=document.createElement("div");
    messageElement.classList.add("message");

    //img
    const imageElement=document.createElement("img");
    imageElement.src=imageUrl;
    imageElement.style.maxWidth="300px";

    messageElement.appendChild(imageElement);
   allMessagesContainer.appendChild(messageElement);
}
document.querySelectorAll(".sendImageButton").forEach((el)=>{
    el.addEventListener("click", () => {

        const imageInput = document.querySelector(".imageUpload");
        const imageFile = imageInput.files[0];  // Récupère le fichier image sélectionné par l'utilisateur


            privatePhoto(imageFile).then((res)=>{
                console.log(res)

                sendMessageWithImage(imageId,'hicds').then((res)=> {
                    const imageUrl = res.imageUrl || res.imageUrl;
                    addImageToChat(imageUrl)


                })

            });
})

});

const refreshAutomatic =()=>{
    setInterval(()=>{
        console.log("Refreshing automatic...");
        refresh();
    }, 57 * 60 * 1000); //toutes les 57 minutes
}

if(!token){
    displayLoginForm();
}else{
    displayHomeChat();
    refreshAutomatic();
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
            freshener = data.freshener;
            refreshAutomatic();
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
async function newPrivateMessage(inputMessagePrive, userId){
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
    return await fetch(`https://b1messenger.esdlyon.dev/api/private/message/${userId}`, params)
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
async function response(itemId, content){
    let params ={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            content
        })
    }
    return await fetch(`https://b1messenger.esdlyon.dev/api/responses/${itemId}/new`, params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            return data
        })
}


async function privatePhoto(imageFile){

        const formData = new FormData();
        formData.append("image", imageFile);

        let params ={
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    }
    return await fetch('https://b1messenger.esdlyon.dev/api/private/image', params)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        return data
    })
}
async function sendMessageWithImage(imageId, content){


    let params ={
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: content,
            associatedImages:[imageId]
        })
    }
    return await fetch('https://b1messenger.esdlyon.dev/api/message/new', params)
        .then(res => res.json())
        .then(data => {

            return data
        })
}

async function refresh(){
    let params={
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ freshener})
    }
    return await fetch('https://b1messenger.esdlyon.dev/refreshthistoken',params)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            token = data.token;
            freshener = data.freshener;
            return data
        })

}
