import envirenment from "../envirenment"
import crendentialModel from "./credentials"

const list=[
    {name:'Free',id:'free'},
    {name:'Standard',id:'standard'},
    {name:'Premium',id:'premium'},
]

const name=(id)=>{
    let ext=list.find(itm=>itm.id==id)
    return ext?ext.name:'--'
}

const check=(dp,u='')=>{

    let up=''
    let user=u?u:crendentialModel.getUser()
    if(user){
        up=user&&user.package?user.package:'standard'
    }

    if(user.role==envirenment.adminRoleId) up='premium'

    let value=false
    if(up=='free' || !up){
        if(dp=='free') value=true
    }else if(up=='standard'){
        if(dp=='free' || dp=='standard') value=true
    }else if(up=='premium'){
        value=true
    }
    return value
}

const packageModel={list,name,check}
export default packageModel