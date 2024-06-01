import firebaseModel from "../firebase/firebase"
import crendentialModel from "../model/credentials";
import cryptoModel from "../model/crypto";
import { toast } from "react-toastify";

class FireAPI {

  static login(p) {
    const { payload } = p
    const table = 'users'
    return new Promise(async function (fulfill, reject) {

      await firebaseModel.firestore().collection(table)
        .where('email', '==', payload.email.toLowerCase())
        .where('password', '==', payload.password)
        .get().then(async gres => {
          let fres = gres.docs.map(itm => {
            return { ...itm.data(), id: itm.id }
          })
          if (!fres.length) {
            let message = 'Credentials are not matched'
            fulfill({ success: false, message: message });
            toast.error(message)
          } else {
            let data = { ...fres[0], lastLogin: new Date().toISOString()}
            let accessToken=cryptoModel.encrypt(JSON.stringify({email:data.email,id:data.id,lastLogin:data.lastLogin}))
              await firebaseModel.firestore().collection(table).doc(data.id).update({ ...data, accessToken })

              data = { ...data, accessToken}
              delete data.password

              await firebaseModel.firestore().collection('roles').doc(data.role).get().then(res=>{
                  data.roleDetail={...res.data(),id:res.id}
              })
              
              fulfill({ success: true, data: data });
          }
        }, err => {
          toast.error(err)
          fulfill({ success: false, message: err });
        })
    });
  }

  static changePassword(p) {
    const { payload } = p
    const table = 'users'
    return new Promise(async function (fulfill, reject) {

      await firebaseModel.firestore().collection(table).doc(payload.userId)
        .get().then(async gres => {
          let data={...gres.data(),id:gres.id}
          if (data.password==payload.currentPassword) {
            await firebaseModel.firestore().collection(table).doc(data.id).update({ ...data,password:payload.newPassword,accessToken:''}).then(res=>{
              let message='password updated'
              fulfill({ success: true, message: message });
            },err=>{
              toast.error(err)
              fulfill({ success: false, message: err });
            })
          } else {
            let message = 'wrong password'
            fulfill({ success: false, message: message });
            toast.error(message)
          }
        }, err => {
          toast.error(err)
          fulfill({ success: false, message: err });
        })
    });
  }

  static resetPassword(p) {
    const { payload } = p
    const table = 'users'
    return new Promise(async function (fulfill, reject) {
      console.log("payload",payload)
      await firebaseModel.firestore().collection(table)
      .where('email','==',payload.email)
      .where('verificationCode','==',Number(payload.code))
      .get().then(async gres=>{
        let fres=gres.docs.map(itm=>{
          return {...itm.data(),id:itm.id}
        })
        if(!fres.length){
          let message='Invalid Verification Code'
          toast.error(message)
          fulfill({ success: false, message:message });
        }else{
          let data={...fres[0],password:payload.password,accessToken:''}
          await firebaseModel.firestore().collection(table).doc(data.id).update(data).then(async ures=>{
            fulfill({ success: true, message:'Password Reset successfully' });
          },err=>{
            toast.error(err)
            fulfill({ success: false, message:err });
          })
        }
      },err=>{
        toast.error(err)
        fulfill({ success: false, message:err });
      })
    });
  }

  static getSingle(p) {
    const { payload, table } = p
    return new Promise(async function (fulfill, reject) {
      await firebaseModel.firestore().collection(table).doc(payload.id).onSnapshot((snapshot) => {
        let rdata = { ...snapshot.data(), id: payload.id };
        let message = 'Successfully'
        fulfill({ success: true, message: message, data: rdata });
      }, err => {
        toast.error(err)
        fulfill({ success: false, message: err });
      });
    });
  }

  static getAll(p) {
    const { payload, table } = p
    return new Promise(async function (fulfill, reject) {
      let query = firebaseModel.firestore().collection(table)
      let totalCount=0
      let sortBy=payload.sortBy||''
      for (const key in payload) {
        if (payload[key] && key != 'page' && key != 'count' 
        && key != 'sortBy'
        && key != 'sorder'
        && key != 'key'
        && key != 'search'
        ) {
          // let endBound=payload[key] + '\uf8ff';
          // query = query.where(key, '>=', payload[key]).where(key,'<=',endBound);
          query = query.where(key, '==', payload[key]);
        }
      }
      if(sortBy){
        let key=sortBy.split(' ')[0]
        let order=sortBy.split(' ')[1]
        query=query.orderBy(key,order)
      }

      await query.get()
      .then((querySnapshot) => {
          totalCount = querySnapshot.size;
      })
      .catch((error) => {
          console.error('Error getting documents', error);
          toast.error("Error")
      });
      


      let pageNumber = payload.page || 1
      let pageSize = payload.count || 1000
      // Calculate startAfter document based on page number and page size
      if (pageNumber > 1) {
        const startAfterSnapshot = await query.limit((pageNumber - 1) * pageSize).get();
        const lastVisible = startAfterSnapshot.docs[startAfterSnapshot.docs.length - 1];
        query = query.startAfter(lastVisible);
      }


      query.limit(pageSize).onSnapshot(async gres => {
        let fres = gres.docs.map(itm => {
          return { ...itm.data(), id: itm.id }
        })
        // console.log("fres",fres)
        if (!fres.length) {
          let message = 'data not found'
          fulfill({ success: true, data: [], total: 0, message: message });
          // toast.error(message)
        } else {
          fulfill({ success: true, data: fres, total: totalCount });
        }
      }, err => {
        toast.error(err)
        fulfill({ success: false, message: err });
      })
    });
  }

  static put(p) {
    const user=crendentialModel.getUser()
    const { payload, table } = p
    return new Promise(async function (fulfill, reject) {
      let updatedAt = new Date().getTime()
      let body={...payload}
      delete body.id
      let updatedBy=user.id
      await firebaseModel.firestore().collection(table).doc(payload.id).update({ ...body, updatedAt,updatedBy }).then(res => {
        fulfill({ success: true, message: 'Successfully' })
      }, err => {
        fulfill({ success: false, message: err })
      })
    });
  }

  static post(p) {
    const user=crendentialModel.getUser()
    const { payload, table } = p
    return new Promise(async function (fulfill, reject) {
      let createdAt = new Date().getTime()
      let addedBy=user.id
      await firebaseModel.firestore().collection(table).add({ ...payload, createdAt,addedBy}).then(res => {
        fulfill({ success: true, message: 'Successfully', data: res.id })
      }, err => {
        fulfill({ success: false, message: err })
      })
    });
  }
  
  static delete(p) {
    const { payload, table } = p
    return new Promise(async function (fulfill, reject) {
      await firebaseModel.firestore().collection(table).doc(payload.id).delete().then(res => {
        fulfill({ success: true, message: 'Successfully' })
      }, err => {
        fulfill({ success: false, message: err })
      })
    });
  }

  static allApi(p) {
    const { method } = p
    if (method == 'post') return this.post(p)
    if (method == 'put') return this.put(p)
    if (method == 'getSingle') return this.getSingle(p)
    if (method == 'getAll') return this.getAll(p)
    if (method == 'delete') return this.delete(p)
  }

}

export default FireAPI;