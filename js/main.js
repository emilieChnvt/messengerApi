let apiRegister = "https://b1messenger.esdlyon.dev/login"
let apiMessage = "https://b1messenger.esdlyon.dev/api/messages"

let token = null

async function getToken() {
    let params={
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body:JSON.stringify({
        username: "emiliech",
        password: "ghjklmwx",
    })
}
    await fetch(apiRegister, params)
        .then(response => response.json())
        .then(data => {
            console.log(data.token)
            token = data.token

        })}




async function logMessage() {
    let parameters={
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },

    }

    await fetch(apiMessage, parameters)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
}

(async () => {
    await getToken(); // Récupérer d'abord le token
    await logMessage(); // Puis récupérer les messages
})();

