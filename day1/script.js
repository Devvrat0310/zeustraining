var submitButton = document.getElementsByClassName("submit-button")[0]

var form = document.getElementsByClassName("user-form")[0]

submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    
    var nameInput = document.getElementById("name-input")
    var commentsInput = document.getElementById("comments-input")
    var maleInput = document.getElementById("male-radio")
    var femaleInput = document.getElementById("female-radio")
    
    var errorMessage = document.getElementsByClassName("error-message");

    for (var i = 0; i < errorMessage.length; i++){
        errorMessage[i].innerHTML = "";
    }

    var isValidated = true;

    if (nameInput.value.trim().length === 0) {
        console.log("name invalid")
        errorMessage[0].innerHTML = "Name field must not be empty"
        nameInput.focus()
        isValidated = false
    }
    
    if (isValidated) errorMessage[0].innerHTML = "";

    if (commentsInput.value.trim().length === 0) {
        console.log("comments invalid")
        errorMessage[1].innerHTML = "Comment field must not be empty"

        if (isValidated) commentsInput.focus()
        isValidated = false
    }
    
    if (isValidated) errorMessage[1].innerHTML = "";
    
    if (maleInput.checked === false && femaleInput.checked === false) {
        console.log("Male invalid")
        errorMessage[2].innerHTML = "One of the gender must be selected."
        isValidated = false
    }
    
    if (isValidated) errorMessage[2].innerHTML = "";
    
    if (!isValidated) return false;
    
    alert("Data submitted successfully")

    for (var i = 0; i < errorMessage.length; i++){
        errorMessage[i].innerHTML = "";
    }

    return true;
})
