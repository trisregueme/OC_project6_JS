const reponse = await fetch('http://localhost:5678/api/works')
let galleryContent = await reponse.json()
console.log(galleryContent)

function generateMesProjets(array, target) {
// HTML creation with json from the API request
    let gallery = target
    for (let i=0; i<array.length; i++) {
        const galleryElement = document.createElement("figure")

        const galleryImage = document.createElement("img")
        galleryImage.src = `${array[i].imageUrl}`
        galleryImage.alt = `${array[i].title}`
        galleryElement.appendChild(galleryImage)

        const galleryCaption = document.createElement("figcaption")
        galleryCaption.innerHTML = `${array[i].title}`
        galleryElement.appendChild(galleryCaption)

        gallery.appendChild(galleryElement)
    }
}
const projets = document.querySelector(".gallery")
generateMesProjets(galleryContent, projets)

// Filter buttons
let selected_btn = document.getElementsByClassName("btn")[0]
selected_btn.classList.add("selected_button")

function changeSelectedBtn(id) {
    selected_btn.classList.remove("selected_button")
    selected_btn = document.getElementsByClassName("btn")[id]
    selected_btn.classList.add("selected_button")
}

function filterWorks(id) {
    changeSelectedBtn(id)
    if (id === 0) {
        projets.innerHTML = '';
        generateMesProjets(galleryContent,projets)
    } else {
        let filterContent = []
        for (let i=0; i<galleryContent.length; i++) {
            if (galleryContent[i].categoryId === id) {
                filterContent.push(galleryContent[i])
            }
        }
        projets.innerHTML = '';
        generateMesProjets(filterContent,projets);
    }
}

const buttonTous = document.getElementsByClassName("btn")[0]
buttonTous.addEventListener('click', () => {
    filterWorks(0)
})

const buttonObj = document.getElementsByClassName("btn")[1]
buttonObj.addEventListener('click', () => {
    filterWorks(1)
})

const buttonAppt = document.getElementsByClassName("btn")[2]
buttonAppt.addEventListener('click', () => {
    filterWorks(2)
})

const buttonHetr = document.getElementsByClassName("btn")[3]
buttonHetr.addEventListener('click', () => {
    filterWorks(3)
})

// Logged in interface
const authToken = localStorage.getItem("token")
const authString = `Bearer ${authToken}`
console.log(authString)

//creer une fonction show admin interface - true / false
function showAdminInterface() {
    document.querySelector("body > div").classList.remove("display_none")
    document.querySelector("#introduction figure a").classList.remove("display_none")
    document.querySelector("#introduction article a").classList.remove("display_none")
    document.querySelector("#projets a").classList.remove("display_none")
    document.querySelector(".filters").classList.add("display_none")
}

if (authToken !== null) {
    showAdminInterface()
}



// Admin's Modal Generation 
let modal = null
const focussableSelectors = "button, a, input, textarea"
let focussables = []
let previouslyFocussedElement = null

const openModal = function (e) {
    e.preventDefault()
    //sélectionne l'élément correspondant à #modal1
    modal = document.querySelector("#modal-admin")
    focussables = Array.from(modal.querySelectorAll(focussableSelectors))
    previouslyFocussedElement = document.querySelector(":focus")
    modal.classList.remove("display_none")
    modal.classList.add("modal")
    focussables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", true)
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    if (previouslyFocussedElement !== null) previouslyFocussedElement.focus()
    e.preventDefault()
    window.setTimeout(function () {
        modal.classList.add("display_none")
        modal.classList.remove("modal")
        modal = null
    }, 500)
    modal.removeAttribute("aria-modal")
    modal.setAttribute("aria-hidden", true)
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
}

const focusInModal = function (e) {
    e.preventDefault()
    let index = focussables.findIndex(f => f === modal.querySelector(":focus"))
    if(e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focussables.length) {
        index = 0
    }
    if (index < 0) {
        index = focussables.length -1
    }
    focussables[index].focus()
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" & modal !== null) {
        focusInModal(e)
    }
})

// Gallery in modal
const modalGalery = document.querySelector("#modal-galery")
function generateModal(array, target) {
// HTML creation with json from the API request
    const modal = target
    for (let i=0; i<array.length; i++) {
        const divModalImage = document.createElement("div")
        // Creating modal's gallery
        const modalImage = document.createElement("img")
        modalImage.src = `${array[i].imageUrl}`
        modalImage.alt = `${array[i].title}`
        divModalImage.appendChild(modalImage)
        // Creating modal's elements
        // Button "delete work"
        const btnDeleteWork = document.createElement("i")
        btnDeleteWork.classList.add("fa-trash-can","fa-solid","fa-lg")
        btnDeleteWork.id = `${array[i].id}`
        divModalImage.appendChild(btnDeleteWork)
        btnDeleteWork.addEventListener("click", () => {
            deleteWork(btnDeleteWork.id)
        })
        // Button "move work"
        const btnMoveWork = document.createElement("i")
        btnMoveWork.classList.add("fa-arrows-up-down-left-right","fa-solid","fa-lg")
        divModalImage.appendChild(btnMoveWork)
        // Button "éditer"
        const modalEdit = document.createElement("a")
        modalEdit.innerHTML = "éditer"
        divModalImage.appendChild(modalEdit)

        modal.appendChild(divModalImage)
        }
    }
generateModal(galleryContent, modalGalery)

function deleteWork(id) {
    /*
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": authString
        }
    })
    .then(function(response) {
        if (response.ok) {
            // reset works in gallery & modal
            projets.innerHTML = ""
            modalGalery.innerHTML = ""
            // displays works in gallery & modal
            generateMesProjets(galleryContent, projets)
            generateModal(galleryContent, modalGalery)
        } else {
            window.alert(`Erreur lors de la suppression du projet`)
        }
    })
    */
}