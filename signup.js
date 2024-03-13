// Email
const emailError = document.querySelector("body > main > div > div > form > div:nth-child(2) > label > small")
const email = document.getElementById("email");

function validateEmail(label, emailError){
    const regex =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if(!label.value.match(regex)){
        emailError.style = "display: block"
        emailError.innerText = "L'adresse mail ne correspond pas"
        return false;
    }
    emailError.innerText = ""
    emailError.style = "display: none"
    return true;
}

//Password
const passwordError =  document.querySelector("body > main > div > div > form > div:nth-child(3) > label > small.error")
const password = document.getElementById("password")

const confirmPasswordError = document.querySelector("body > main > div > div > form > div:nth-child(4) > label > small")
const confirmPassword = document.getElementById("password-confirm")

function validatePassword(){
    if (password.value.length < 8) {
        passwordError.innerText = "Le mot de passe doît correspondre au motif"
        passwordError.style = "display: block"
        confirmPasswordError.innerText = ""
        confirmPasswordError.style = "display: none"
        return false;
    }
    else if (password.value !== confirmPassword.value){
        passwordError.innerText = ""
        passwordError.style = "display: none"
        confirmPasswordError.innerText = "Le mot de passe doît être le même"
        confirmPasswordError.style = "display: block"
        return false;
    }
    passwordError.innerText = ""
    passwordError.style = "display: none"
    confirmPasswordError.innerText = ""
    confirmPasswordError.style = "display: none"
    return true
}

// Terme
const termeError = document.querySelector("body > main > div > div > form > div.mb-3.form-check > label > small")
const terme = document.getElementById("terms")

function validateTerme(){
    if (!terme.checked){
        termeError.innerText = "Les termes et conditions doivent être acceptés"
        termeError.style = "display: block"
        return false;
    }
    termeError.innerText = ""
    termeError.style = "display: none"
    return true;
}

function validateForm () {
    let formGood = true
    if (!validateEmail(email, emailError)) {
        formGood = false;
    }
    if (!validatePassword()) {
        formGood = false;
    }    
    if (!validateTerme()) {
        formGood = false
    }
    return formGood
}

const form = document.querySelector("form")
form.addEventListener("submit", (event) => {
    if (!validateForm()) {
        event.preventDefault()}
});