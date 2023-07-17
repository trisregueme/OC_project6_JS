//Function to submit the form and login in the website
const loginSubmit = document.querySelector("#login form")
loginSubmit.addEventListener("submit", async (event) => {
    event.preventDefault();
    //Retrieving infos from the for and placing it in a const
    const loginInfos = {
        email: event.target.querySelector("[name=loginemail]").value,
        password: event.target.querySelector("[name=loginpassword]").value
    }
    //Transforming login infos in json to use it
    const userLoginInfos = JSON.stringify(loginInfos)
    //Sending form's information to login
    await fetch("http://localhost:5678/api/users/login", {
        method : 'POST',
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: userLoginInfos,
    })
    //If fetch is successfull stores the token from API and loads the homepage
    .then(async function(response) {
        if (response.ok) {
            const res = await response.json()
            localStorage.setItem('token', `${res.token}`)
            window.location.replace("../../index.html")
        } else { 
            window.alert(`Combinaison e-mail / mot de passe invalide`)
        }
    })
});