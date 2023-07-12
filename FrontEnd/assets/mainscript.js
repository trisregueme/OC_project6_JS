// Retrieving authToken & creating authString for admin actions
const authToken = localStorage.getItem("token")
const authString = `Bearer ${authToken}`
console.log(authString)

// Fetching Gallery's element from API
const reponse = await fetch('http://localhost:5678/api/works')
let galleryContent = await reponse.json()
console.log(galleryContent)

// Function generate the gallery with API
function generateMesProjets(array, target) {
// Creating gallery from the API request
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

// Displaying used filter
let selected_btn = document.getElementsByClassName("btn")[0]
selected_btn.classList.add("selected_button")
function changeSelectedBtn(id) {
    selected_btn.classList.remove("selected_button")
    selected_btn = document.getElementsByClassName("btn")[id]
    selected_btn.classList.add("selected_button")
}

// Function to filter elements by categories with filters
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

//Event Listeners for each filter button
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

//Function to show admin interface
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

// Declaring variables to keep focus in modals while using keyboard
const focussableSelectors = "button, a, input, textarea"
let focussables = []
let previouslyFocussedElement = null

// Function to open a modal
const openModal = function (e, target) {
    e.preventDefault()
    console.log("hello")
    let modal = document.querySelector(target)
    focussables = Array.from(modal.querySelectorAll(focussableSelectors))
    previouslyFocussedElement = document.querySelector(":focus")
    modal.classList.remove("display_none")
    modal.classList.add("modal")
    focussables[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", true)
    modal.addEventListener("click", () => {
        closeModal(e, target)
    })
}

// Function to close a modal
const closeModal = function (e, target) {
    let modal = document.querySelector(target)
    if (previouslyFocussedElement !== null) previouslyFocussedElement.focus()
    e.preventDefault()
    window.setTimeout(function () {
        modal.classList.add("display_none")
        modal.classList.remove("modal")
        modal = null
    }, 500)
    modal.removeAttribute("aria-modal")
    modal.setAttribute("aria-hidden", true)
    modal.removeEventListener("click", () => {
        closeModal(e, target)
    })
}

//Function to keep the focus in modal if user is using keyboard
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

//Stop the propagation on the event
const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", function (e) {
        openModal(e, "#modal-admin")
    })
})

/*
window.addEventListener("keydown", function (e, target) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeGalleryModal(e)
    }
    if (e.key === "Tab" & modal !== null) {
        focusInModal(e)
    }
})
*/

//Event listeners to stop propagation of modals
document.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
document.querySelector(".js-modal-stop2").addEventListener("click", stopPropagation)

// Event listeners to open modal-admin & modal-add-project
document.querySelector("#addPhoto").addEventListener("click", function (e, target) {
    closeModal(e, "#modal-admin")
})
document.querySelector("#addPhoto").addEventListener("click", function (e, target) {
    openModal(e, "#modal-add-project")
})

//Event listeners to close modal-admin & modal-add-project
document.querySelector(".js-modal-close").addEventListener("click", function (e, target) {
    closeModal(e, "#modal-admin")
})
document.querySelector(".js-modal-close2").addEventListener("click", function (e, target) {
    closeModal(e, "#modal-add-project")
})

//Event listeners to return to modal-admin & reset modal-add-project  
document.querySelector(".js-previous-modal").addEventListener("click", (e) => {
    openModal(e, "#modal-admin")
})
document.querySelector(".js-previous-modal").addEventListener("click", function (e, target) {
    closeModal(e, "#modal-add-project")
    document.getElementById("error-msg").innerHTML= ""
})

// Display gallery in modal
const modalGallery = document.querySelector("#modal-gallery")
function generateModal(array, target) {
// HTML creation with json from the API request
    const modal = target
    for (let i=0; i<array.length; i++) {
        // Creating a division for each project
        const divModalImage = document.createElement("div")

        // Creating modal's gallery from 
        const modalImage = document.createElement("img")
        modalImage.src = `${array[i].imageUrl}`
        modalImage.alt = `${array[i].title}`
        divModalImage.appendChild(modalImage)

        // Creating Button to delete projects
        const btnDeleteWork = document.createElement("i")
        btnDeleteWork.classList.add("fa-trash-can","fa-solid","fa-lg")
        btnDeleteWork.id = `${array[i].id}`
        divModalImage.appendChild(btnDeleteWork)
        btnDeleteWork.addEventListener("click", () => {
            deleteWork(btnDeleteWork.id)
        })

        // Creating fake button to move work
        const btnMoveWork = document.createElement("i")
        btnMoveWork.classList.add("fa-arrows-up-down-left-right","fa-solid","fa-lg")
        divModalImage.appendChild(btnMoveWork)

        // Creating fake button to edit
        const modalEdit = document.createElement("a")
        modalEdit.innerHTML = "éditer"
        divModalImage.appendChild(modalEdit)

        modal.appendChild(divModalImage)
        }
    }
generateModal(galleryContent, modalGallery)

function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": authString
        }
    })
    .then((res) => res.json())/*
        if (response.ok) {
            // reset works in gallery & modal
            projets.innerHTML = ""
            modalGallery.innerHTML = ""
            generateMesProjets(galleryContent, projets)
            generateModal(galleryContent, modalGallery)
            // update gallery content
            /*
            async () => {
                const request = await fetch('http://localhost:5678/api/works')
                galleryContent = await request.json()
                console.log(galleryContent)
                displays works in gallery & modal
                generateMesProjets(galleryContent, projets)
                generateModal(galleryContent, modalGallery)
            }
            
        } else {
            window.alert(`Erreur lors de la suppression du projet`)
        }
    })*/
}


// display uploaded image
document.querySelector("#new-img").addEventListener("change", () => {
    let file = document.getElementById("new-img").files[0]
    console.log(file.size)
    let reader = new FileReader()
    reader.onload = function (e) {
        let image = document.createElement("img")
        image.src = e.target.result
        document.getElementById("js-show-uploaded-image").appendChild(image)
        document.querySelector(".upload-img").classList.add("display_none")
        document.getElementById("error-msg").innerHTML= ""
        if (file !== null) {
            document.getElementById("js-show-uploaded-image").classList.remove("display_none")
            document.querySelector(".js-previous-modal").addEventListener("click", () => {
                removeUploadedImg()
            })
        }
    }
    reader.readAsDataURL(file)
})

//remove uploaded image on leaving
function removeUploadedImg() {
    document.getElementById("js-show-uploaded-image").classList.add("display_none")
    document.getElementById("js-show-uploaded-image").innerHTML= ""
    document.querySelector(".upload-img").classList.remove("display_none")
}

////////// ADD A PROJECT TO THE WEBSITE
document.getElementById("add-project").addEventListener("submit", (e) => {
    e.preventDefault()

    //Fetching form's elements
    const photo = document.getElementById("new-img")
    const title = document.getElementById("new-title")
    const category = document.getElementById("new-category")

    //Checking form's completion
    const errorMsg = document.getElementById("error-msg")
    if (photo.value === "" || title.value === "" || category.value === "") {
        errorMsg.innerHTML = "Informations manquantes pour l'ajout d'un projet"
    } else {
        errorMsg.innerHTML = ""
    }

    //Retrieving categories from API
    fetch("http://localhost:5678/api/categories").then((response) => {
        console.log(response)
        if (response.ok) {
            response.json().then((categorydata) => {
                //Associating categories from the form to an id
                for (let i = 0; i <= categorydata.length - 1; i++) {
                    if (category.value === categorydata[i].name) {
                        categorydata[i].name = categorydata[i].id;
                        console.log(categorydata[i].id);
                        console.log(category.value);

                        //Retrieving photo&title 
                        let image = document.getElementById("new-img").files[0]
                        let imagetitle = document.getElementById("new-title").value;
                        // authString

                        //Checking photo's weight (has to be <4mo)
                        if (image.size < 4 * 1000001) { 
                            const formData = new FormData()
                            formData.append("image", image)
                            formData.append("title", imagetitle)
                            formData.append("category", categorydata[i].id)
                            
                            //Sending datas to API
                            const creatingNewProject = async (data) => {
                                const request = await fetch("http://localhost:5678/api/works", {
                                    method: "POST",
                                    headers: {
                                        "Authorization": authString,
                                        "accept": "application/json"
                                    },
                                    body: data,
                                })
                                //Checking request's status & displaying galleries
                                if (request.status === 201) {
                                    projets.innerHTML = ""
                                    modalGallery.innerHTML = ""
                                    generateMesProjets(galleryContent, projets)
                                    generateModal(galleryContent, modalGallery)
                                } else {
                                    window.alert(`Un problème est survenu lors de l'ajout du projet`)
                                }
                            }
                            creatingNewProject(formData)
                        } else {
                            errorMsg.innerHTML = "La photo est trop volumineuse (>4Mo)."
                            photo.value = null
                            document.getElementById("js-show-uploaded-image").classList.add("display_none")
                            document.querySelector(".upload-img").classList.remove("display_none")
                            document.querySelector("#js-show-uploaded-image").innerHTML=""
                        }
                    }
                }
            })
        }
    })
})