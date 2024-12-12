let apiRegister = "https://b1messenger.esdlyon.dev/login"



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
fetch(apiRegister, params)
    .then(response => response.json())
    .then(data => {
        console.log(data.token)
    })