import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebaseModel from '../../firebase/firebase';
import crendentialModel from '../../model/credentials';
import './style.scss'
import ApiClient from '../../shared/ApiClient';
import datepipeModel from '../../model/datepipemodel';
import cryptoModel from '../../model/crypto';
import { Link } from 'react-router-dom';
import methodModel from "../../model/method.model";

const Forgot = () => {
  const history = useNavigate();
  const user=crendentialModel.getUser()

  const [loading, setLoading] = useState(false);
  const [form, setform] = useState({ email: methodModel.getPrams('email')});

  const hendleSubmit = async(e) => {
    e.preventDefault()
    if(!form.email) return
    let payload={...form,email:form.email.toLowerCase()}
    // console.log("payload",payload)
    setLoading(true)
    ApiClient.post('send-verification',{to:payload.email}).then(res=>{
      if(res.success){
        history('/reset?email='+payload.email)
      }
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
              <h3 className='mb-3'>Forgot</h3>
              <Link to="/">
              <img src="/img/logo.png" alt="" className="login-logo" />
              </Link>
            </div>

            <label>Email</label>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-0"
                value={form.email}
                required
                autoComplete='off'
                onChange={e => setform({ ...form, email: e.target.value })}
              />
            </div>

            <div className="text-right">
              <button disabled={loading} type="submit" className="btn btn-primary">
                Submit {loading?<i className='fa fa-spinner fa-spin'></i>:<></>}
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

export default Forgot;
