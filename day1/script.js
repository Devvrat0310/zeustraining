
var userForm = document.getElementsByClassName("user-form")[0]

var submitButton = document.getElementsByClassName("submit-button")[0]

var nameInput = document.getElementById("name-input")
var commentsInput = document.getElementById("comments-input")
var maleInput = document.getElementById("male-radio")
var femaleInput = document.getElementById("female-radio")

var errorMessage = document.getElementsByClassName("error-message")[0];

submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    console.log("Clicked submit direct")
    
    console.log(nameInput.value)
    console.log(commentsInput.value)
    console.log(maleInput.checked)
    console.log(femaleInput.checked)

    if (nameInput.value.length === 0) {
        console.log("name invalid")
        errorMessage.innerHTML = "Name field must not be empty"
        return
    }

    if (commentsInput.value.length === 0) {
        console.log("comments invalid")
        errorMessage.innerHTML = "Comment field must not be empty"
        return
    }
    
    if (maleInput.checked === false && femaleInput.checked === false) {
        console.log("Male invalid")
        errorMessage.innerHTML = "One of the gender must be selected."
        return
    }

    errorMessage.innerHTML = ""
})
