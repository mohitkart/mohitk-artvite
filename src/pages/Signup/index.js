import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import firebaseModel from '../../firebase/firebase';
import crendentialModel from '../../model/credentials';
import './style.scss'
import ApiClient from '../../shared/ApiClient';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const ToastsStore=toast

const Signup = () => {
  const history = useNavigate();
  const user=crendentialModel.getUser()
  const table='users'
  
  const [loading, setLoading] = useState(false);
  const [form, setform] = useState({ email: '', password: '' });

  const hendleSubmit = async(e) => {
    e.preventDefault()
    if(!form.email || !form.password) return
    let payload={...form,email:form.email.toLowerCase(),createdAt:new Date().toISOString(),role:'User'}

    setLoading(true)
    await firebaseModel.firestore().collection(table)
  .where('email','==',payload.email.toLowerCase())
  .get().then(async gres=>{
    let fres=gres.docs.map(itm=>{
      return {...itm.data(),id:itm.id}
    })
    if(fres.length){
      ToastsStore.error('Email Already Exist')
    }else{
      // history('/');
      await firebaseModel.firestore().collection(table).add(payload).then(async fres=>{
      await ApiClient.post('send-verification',{to:payload.email}).then(res=>{
        if(res.success){
          history('/verify?email='+payload.email);
        }
        })
        console.log("payload",payload)
      })
    
    }
    setLoading(false)
  },err=>{
    ToastsStore.error(err)
    setLoading(false)
  })
    
  // setLoading(true)
  //   ApiClient.post('login',form).then(res=>{
  //     setLoading(false)
  //     if(res.success){
  //       crendentialModel.setUser({...res.data,loginDate:new Date().toISOString()})
  //       history('/');
  //     }
  //   })
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
            autoComplete='off'
          >
            <div className="text-center mb-3">
              <h3 className='mb-3'>Signup</h3>
              <Link to="/">
              <img src="/img/logo.png" alt="" className="login-logo" />
              </Link>
            </div>

            <label>Name</label>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-0"
                value={form.name}
                required
                autoComplete='off'
                onChange={e => setform({ ...form, name: e.target.value })}
              />
            </div>

            <label>Email</label>
            <div className="mb-3">
              <input
                type="email"
                className="form-control mb-0"
                value={form.email}
                required
                autoComplete='off'
                onChange={e => setform({ ...form, email: e.target.value })}
              />
            </div>

            <label>Password</label>

            <div className="mb-3">
              <input
                type="password"
                className="form-control mb-0"
                value={form.password}
                required
                autoComplete='off'
                onChange={e => setform({ ...form, password: e.target.value })}
              />
            </div>
            <div className="text-right">
              <button disabled={loading} type="submit" className="btn btn-primary">
                Signup {loading?<i className='fa fa-spinner fa-spin'></i>:<></>}
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

export default Signup;
