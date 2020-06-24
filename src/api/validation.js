//Validate emails
const validateEmail = (input) => {    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(input);
}

//Validate name
const validateName = (input) => {
    const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
    return regex.test(input) && input.length>0 && input.length<100;
}


//Validate message
const validateMessage = (input) => {
    return input.length > 0 && input.length <= 1000;
}

//Request validation - email, name, message

const validateInput = (inputType, inputValue) => {
    if(inputType === "name"){
        return validateName(inputValue)
    }
    else if(inputType === "email"){
        return validateEmail(inputValue)
    }
    else if(inputType === "message"){
        return validateMessage(inputValue)
    } else {
        return false
    }
}

export default  validateInput