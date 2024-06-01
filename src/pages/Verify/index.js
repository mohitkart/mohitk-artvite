import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import firebaseModel from '../../firebase/firebase';
import crendentialModel from '../../model/credentials';
import './style.scss'
import { Link } from 'react-router-dom';
import methodModel from "../../model/method.model";
import { toast } from 'react-toastify';
const ToastsStore=toast
const Verify = () => {
  const history = useNavigate();
  const user=crendentialModel.getUser()
  const table='users'

  const [loading, setLoading] = useState(false);
  const [form, setform] = useState({ email: methodModel.getPrams('email'), code: '' });

  const hendleSubmit = async(e) => {
    e.preventDefault()
    if(!form.email || !form.code) return
    let payload={...form,email:form.email.toLowerCase()}
    // console.log("payload",payload)
    setLoading(true)
    await firebaseModel.firestore().collection(table)
  .where('email','==',payload.email)
  .where('verificationCode','==',Number(payload.code))
  .get().then(async gres=>{
    let fres=gres.docs.map(itm=>{
      return {...itm.data(),id:itm.id}
    })
    if(!fres.length){
      ToastsStore.error('Invalid Verification Code')
    }else{
      let data={...fres[0],isVerified:true,lastLogin:new Date().toISOString(),verificationCode:''}
      console.log("data",data)
      await firebaseModel.firestore().collection(table).doc(data.id).update(data).then(async ures=>{
        crendentialModel.setUser(data)
        history('/')
      })
    }
    setLoading(false)
  },err=>{
    ToastsStore.error(err)
    setLoading(false)
  })
  };

  useEffect(() => {
    if (user) {
      history('/');
    }
  }, [])

  return (
    <>
      <div className="login-wrapper">
        <div className="container">
          <form
            className="p-3 rounded shadow"
            onSubmit={hendleSubmit}
          >
            <div className="text-center mb-3">
              <h3 className='mb-3'>Verify</h3>
              <Link to="/">
              <img src="/img/logo.png" alt="" className="login-logo" />
              </Link>
            </div>

            <label>Code</label>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-0"
                value={form.code}
                required
                maxLength="6"
                onChange={e => setform({ ...form, code: e.target.value })}
              />
            </div>

            <div className="text-right">
              <button disabled={loading} type="submit" className="btn btn-primary">
                Verify {loading?<i className='fa fa-spinner fa-spin'></i>:<></>}
              </button>
            </div>
            <div className='text-center mt-2'>
              <Link to="/login">Already have an account</Link>
            </div>
          </form>
        </div>
      </div>
     
    </>
  );
};

export default Verify;
