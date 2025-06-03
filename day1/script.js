var submitButton = document.getElementsByClassName("submit-button")[0]

submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    
    var nameInput = document.getElementById("name-input")
    var commentsInput = document.getElementById("comments-input")
    var maleInput = document.getElementById("male-radio")
    var femaleInput = document.getElementById("female-radio")
    
    var errorMessage = document.getElementsByClassName("error-message")[0];

    if (nameInput.value.trim().length === 0) {
        console.log("name invalid")
        errorMessage.innerHTML = "Name field must not be empty"
        nameInput.focus()
        return false
    }
    
    if (commentsInput.value.trim().length === 0) {
        console.log("comments invalid")
        errorMessage.innerHTML = "Comment field must not be empty"
        commentsInput.focus()
        return false
    }
    
    if (maleInput.checked === false && femaleInput.checked === false) {
        console.log("Male invalid")
        errorMessage.innerHTML = "One of the gender must be selected."
        return false
    }

    errorMessage.innerHTML = ""
    return true
})
