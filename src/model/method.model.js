const getPrams = (p) => {
    const params = new URLSearchParams(window.location.search)
    return params.get(p)
}


const metaTitleUpdate = (p = {}) => {
    let data = {
        title: 'Hapini | RO or Water Purifier, Beauty and Washing Machine Repair',
        keywords: 'RO or Water Purifier Repair, Beauty service, Washing Machine Repair',
        descrption: 'Looking for an affordable and reliable RO or water purifier repair service in Hapini? We also offer beauty and washing machine repair services. Call us today!',
        ...p
    }

    if (data.title) document.getElementById('titleJS').innerHTML = data.title
    if (data.descrption) document.getElementById('descriptionJS').setAttribute('content', data.descrption)
    if (data.keywords) document.getElementById('keywordsJS').setAttribute('content', data.descrption)

}

const isNumber = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const emailRequiredFor = (role) => {
    let value = false
    if (role == 'Clinic Admin' || role == 'Counsellor' || role == 'Owner' || role == 'admin') value = true
    return value
}

const isRatio = (e) => {
    let key = e.target;
    let maxlength = key.maxLength ? key.maxLength : 1;

    let max = Number(key.max ? key.max : key.value);
    if (Number(key.value) > max) key.value = max;

    // let min = key.min;
    // if (min && Number(key.value)<Number(min)) key.value = min;

    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
    key.value = key.value.replace(/[^0-9.>]/g, '').replace(/(\..*?)\..*/g, '$1');

    return key.value
}

const passwordMatch = (val) => {
    let value = false
    value = val.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*({:;,.></?"'})+=_-])[a-zA-Z0-9~`!@#$%^&*({:;,.></?"'})+=_-]{8,20}$/)

    // if (!value) {
    //     let oV = val.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9~]{8,50}$/)
    //     if (oV) {
    //         if (val.includes('[') || val.includes(']')) {
    //             value = true
    //         }
    //     }
    // }
    return value
}


const find = (arr, key) => {
    let ext = arr.find(itm => itm.key == key)
    return ext
}


/* ###################### Form Methods #########################  */

/* ###################### Form Methods #########################  */

// get Single field error
const getError = (key, fvalue, formValidation) => {
    let ext = find(formValidation, key)
    if(!ext){
        console.error(`${key} is not added into form validation array`)
    }
    let res = matchError(ext, fvalue)
    return res
}


const validateUsername = (val) => {
    return /^(?=[a-zA-Z0-9._-]{8,20}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/.test(val);
}

const dialMatch = (val) => {
    let value = false
    value = val.match(/^(?=.*[0-9])(?=.*[+])[0-9+]{2,5}$/)
    return value
}
const emailvalidation = (val) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
        return true
    }
    return false
}
// match errors for fields
const matchError = (ext, fValue) => {

    let invalid = false
    let value = { minLength: false, maxLength: false, confirmMatch: false ,required:false}
    if(!ext){
        return { invalid: invalid, err: value,message:'' }
    }
    
    let kValue = fValue[ext.key]
    kValue=kValue?String(kValue):''
    let message=ext?.message||''
    
    if (ext.required) {
        if (!kValue || (!kValue.length && typeof kValue!='object')){
            invalid = true
        }
    }
    if (ext.minLength && kValue) {
        if (kValue.length < ext.minLength){
            value.minLength = true
            message=`Minlength is ${ext.minLength}`
        }
    }
    if (ext.maxLength && kValue) {
        if (kValue.length > ext.maxLength){
            value.maxLength = true
            message=`Maxlength is ${ext.maxLength}`
        } 
    }
    if (ext.dialCode && kValue) {
        if (dialMatch(kValue)) {
            kValue.indexOf("+");
            if (kValue.indexOf("+") != 0) {
                value.dialCode = true
                message=`Dial Code is Invalid`
            }

        } else {
            value.dialCode = true
            message=`Dial Code is Invalid`
        }
    }

    if (ext.username && kValue) {
        if (!validateUsername(kValue)){
            value.username = true
            message=`Username is Invalid`
        } 
    }

    if (ext.confirmMatch && kValue) {
        if (fValue[ext.confirmMatch[0]] != fValue[ext.confirmMatch[1]]){
            value.confirmMatch = true
            message=`Fields are not matched`
        } 

    }

    let vArr = Object.keys(value)
    vArr.map(itm => {
        if (value[itm]) invalid = true
    })

    let res = { invalid: invalid, err: value,message:invalid?message:'' }
    return res
}

// get form error (All Fields)
const getFormError = (formValidation, fvalue) => {
    let invalid = false
    formValidation.map(ext => {
        if (matchError(ext, fvalue).invalid) {
            console.log("getFormError",ext)
            invalid = true
        }
    })

    return invalid
}

/* ###################### Form Methods end #########################  */



const singleAddress = (list = [], keyv) => {
    let value = ''
    let ext = list.find(itm => itm.name == keyv)
    if (ext) value = ext.isoCode
    return value
}

const methodModel = { isNumber, metaTitleUpdate, isRatio, find, getError, getFormError, getPrams, passwordMatch, emailRequiredFor, singleAddress }
export default methodModel