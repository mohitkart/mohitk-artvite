import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebaseModel from '../../firebase/firebase';
import crendentialModel from '../../model/credentials';
import './style.scss'
import { Link } from 'react-router-dom';
import methodModel from "../../model/method.model";
import { toast } from 'react-toastify';
const ToastsStore=toast
const Reset = () => {
  const history = useNavigate();
  const user=crendentialModel.getUser()
  const table='users'

  const [loading, setLoading] = useState(false);
  const [form, setform] = useState({ email: methodModel.getPrams('email'), code: '',password:'', confirmPassword:'' });

  const hendleSubmit = async(e) => {
    e.preventDefault()
    if(!form.email || !form.code) return

    if(form.password!=form.confirmPassword){
      ToastsStore.error("Confirm password is not matched")
      return
    }

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
      let data={...fres[0],password:payload.password}
      await firebaseModel.firestore().collection(table).doc(data.id).update(data).then(async ures=>{
        history('/login')
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
            autoComplete='off'
          >
            <div className="text-center mb-3">
              <h3 className='mb-3'>Reset</h3>
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
                autoComplete='off'
                onChange={e => setform({ ...form, code: e.target.value })}
              />
            </div>

            <label>Password</label>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-0"
                value={form.password}
                required
                autoComplete='off'
                onChange={e => setform({ ...form, password: e.target.value })}
              />
            </div>

            <label>Confirm Password</label>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-0"
                value={form.confirmPassword}
                required
                autoComplete='off'
                onChange={e => setform({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            <div className="text-right">
              <button disabled={loading} type="submit" className="btn btn-primary">
                Reset {loading?<i className='fa fa-spinner fa-spin'></i>:<></>}
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

export default Reset;
