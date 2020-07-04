const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(emailRegEx)) return true;
    else return false;
}

const isEmpty = ( string ) => {
    if(string.trim() === '') return true;
    else return false;
}

exports.validateSignUpData = (data) => {
    let errors = {};

    if(isEmpty(data.email)){
        errors.email = 'Emails must not be empty'
    } else if(!isEmail(data.email)){
        errors.email = 'Email must be a Vaild Email'
    }

    if(isEmpty(data.password)) errors.password = "Password shouldn't be Empty";
    if(data.password !== data.confirmPassword) errors.confirmPassword = "Passwords must match";
    if(isEmpty(data.handle)) errors.handle = "Handle shouldn't be Empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateLoginData = (data) => {
    let errors = {};

    if(isEmpty(data.email)){
        errors.email = 'Emails must not be empty'
    } else if(!isEmail(data.email)){
        errors.email = 'Email must be a Vaild Email'
    }
    
    if(isEmpty(data.password)) errors.password = "Password shouldn't be Empty"

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }   
}

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;
    if(!isEmpty(data.website.trim())){
        if(data.website.trim().substring(0,4) !== 'http'){
            userDetails.website =  `http://${data.website}`;
        } else {
            userDetails.website = data.website;
        }
    }

    return userDetails;
}