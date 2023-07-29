// Retrieving authToken & creating authString for admin actions
const authToken = localStorage.getItem("token")
const authString = `Bearer ${authToken}`
console.log(authString)

////////// GENERATING PROJECTS FROM API
//Creating a global variable to place projects' datas
let galleryContent = []

// Function to fetch datas from API, place it the previous variable and generate gallery/modal
async function displayingProjects() {
    //Fetching datas from API
    let response = await fetch('http://localhost:5678/api/works')
    //Converting datas in json and placing it in a variable
    galleryContent = await response.json()
    generateMesProjets(galleryContent)
    generateModal(galleryContent)
}
displayingProjects()

// Function to generate the gallery
function generateMesProjets(array) {
    let gallery = document.querySelector(".gallery")
    // Creating an html element "figure" for every element in the array
    for (let i=0; i<array.length; i++) {
        const galleryElement = document.createElement("figure")
        //Creating an img element from the array
        const galleryImage = document.createElement("img")
        galleryImage.src = `${array[i].imageUrl}`
        galleryImage.alt = `${array[i].title}`
        galleryElement.appendChild(galleryImage)
        //Creating figcaption element from the array
        const galleryCaption = document.createElement("figcaption")
        galleryCaption.innerHTML = `${array[i].title}`
        galleryElement.appendChild(galleryCaption)
        
        gallery.appendChild(galleryElement)
    }
}

// Function to generate the modal
function generateModal(array) {
    let modal = document.querySelector("#modal-gallery")
    for (let i=0; i<array.length; i++) {
        // Creating a division for every project in the array
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

////////// Function to delete a project of the website
async function deleteWork(id) {
    let response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": authString
        }
    })
    if (response.ok) {
        // reset works in gallery & modal
        document.querySelector(".gallery").innerHTML = ""
        document.querySelector("#modal-gallery").innerHTML = ""
        displayingProjects()
    } else {
        window.alert(`Erreur lors de la suppression du projet`)
    }
}

////////// FILTERS
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
        document.querySelector(".gallery").innerHTML = ""
        generateMesProjets(galleryContent)
    } else {
        //Creating an new array containing elements by ids
        let filterContent = []
        for (let i=0; i<galleryContent.length; i++) {
            if (galleryContent[i].categoryId === id) {
                filterContent.push(galleryContent[i])
            }
        }
        document.querySelector(".gallery").innerHTML = ""
        generateMesProjets(filterContent)
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

////////// ADMIN INTERFACE
//Shows admin interface if admin token is detected
function showAdminInterface() {
    document.querySelector("body > div").classList.remove("display_none")
    document.querySelector("#introduction figure a").classList.remove("display_none")
    document.querySelector("#introduction article a").classList.remove("display_none")
    document.querySelector("#projets a").classList.remove("display_none")
    document.querySelector("#logout").classList.remove("display_none")
    document.querySelector(".filters").classList.add("display_none")
}
if (authToken !== null) {
    showAdminInterface()
}

//Resets local storage and reload url
document.querySelector("#logout").addEventListener("click", () => {
    localStorage.clear()
    location.reload()
})

///////////// MODALS
// Declaring variables to keep focus in modals while using keyboard
const focussableSelectors = "button, a, input, textarea"
let focussables = []
let previouslyFocussedElement = null

// Function to open a modal
const openModal = function (e, target) {
    e.preventDefault()
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

//Stop the propagation on the event
const stopPropagation = function (e) {
    e.stopPropagation()
}

//Placing an event listener on each "modifier" button
document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", function (e) {
        openModal(e, "#modal-admin")
    })
})

//Placing an event listener to close modals with escape
window.addEventListener("keydown", function (e, target) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e, "#modal-admin")
        closeModal(e, "#modal-add-project")
    }
})

////////// EVENT LISTENERS FOR MODALS
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
document.querySelector(".js-previous-modal").addEventListener("click", function (e, target) {
    openModal(e, "#modal-admin")
})
document.querySelector(".js-previous-modal").addEventListener("click", function (e, target) {
    closeModal(e, "#modal-add-project")
    document.getElementById("error-msg").innerHTML= ""
})

////////// MODAL TO ADD A PROJECT TO THE WEBSITE
// display the uploaded image in the modal
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

////////// FUNCTION TO ADD A PROJECT TO THE WEBSITE
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
            response.json().then(async(categorydata) => {
                //Associating categories from the form to an id
                for (let i = 0; i <= categorydata.length - 1; i++) {
                    if (category.value === categorydata[i].name) {
                        categorydata[i].name = categorydata[i].id;
                        console.log(categorydata[i].id);
                        console.log(category.value);

                        //Retrieving photo&title 
                        let image = document.getElementById("new-img").files[0]
                        let imagetitle = document.getElementById("new-title").value;

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
                                    // reset works in gallery & modal
                                    document.querySelector(".gallery").innerHTML = ""
                                    document.querySelector("#modal-gallery").innerHTML = ""
                                    displayingProjects()
                                } else {
                                    window.alert(`Un problème est survenu lors de l'ajout du projet`)
                                }
                            }
                            await creatingNewProject(formData)
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