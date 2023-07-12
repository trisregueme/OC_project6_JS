const loginSubmit = document.querySelector("#login form")
loginSubmit.addEventListener("submit", async (event) => {
    event.preventDefault();
    const loginInfos = {
        email: event.target.querySelector("[name=loginemail]").value,
        password: event.target.querySelector("[name=loginpassword]").value
    }
    const userLoginInfos = JSON.stringify(loginInfos)
    await fetch("http://localhost:5678/api/users/login", {
        method : 'POST',
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: userLoginInfos,
    }).then(async function(response) {
        if (response.ok) {
            const res = await response.json()
            localStorage.setItem('token', `${res.token}`)
            window.location.replace("../../index.html")
        } else { 
            window.alert(`Combinaison e-mail / mot de passe invalide`)
        }
    })
});
/*
email: sophie.bluel@test.tld
password: S0phie
*/