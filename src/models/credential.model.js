import cryptoModel from "./crypto"

const KEY = 'persist'

const setUser = (p) => {
    if (p) {
        let str=JSON.stringify(p)
        let crypto=cryptoModel.encrypt(str)
        localStorage.setItem(KEY, crypto)
    } else {
        localStorage.removeItem(KEY)
    }
}

const authLogin = (p) => {
    if (p) {
        let str=p
        let crypto=cryptoModel.encrypt(str)
        localStorage.setItem(KEY, crypto)
    }
}

const getUser = () => {
    let value = {}
    let user = localStorage.getItem(KEY)
    if (user){
        let crypto=cryptoModel.decrypt(user)
        value = crypto?JSON.parse(crypto):''
        if(value) value.loggedIn=true
    } else{
        value = ''
    }
    return value
}

const logout=()=>{
    localStorage.removeItem(KEY)
}

const crendentialModel = {
    setUser, getUser,logout,authLogin
};

export default crendentialModel;
