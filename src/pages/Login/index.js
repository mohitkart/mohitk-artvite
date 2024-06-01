import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import firebaseModel from '../../firebase/firebase';
import crendentialModel from '../../model/credentials';
import './style.scss'
import ApiClient from '../../shared/ApiClient';
import datepipeModel from '../../model/datepipemodel';
import cryptoModel from '../../model/crypto';
import { Link } from 'react-router-dom';
import FireAPI from '../../api';

const Login = () => {
  const history = useNavigate();
  const user=crendentialModel.getUser()
  const table='users'
  
  const [loading, setLoading] = useState(false);
  const [form, setform] = useState({ email: '', password: '' });

  const hendleSubmit = async(e) => {
    e.preventDefault()
    if(!form.email || !form.password) return
    setLoading(true)
    FireAPI.login({payload:{email:form.email.toLowerCase(),password:form.password}}).then(async res=>{
      setLoading(false)
      if(res.success){
        let data=res.data
        if(data.isVerified){
          crendentialModel.setUser({...data})
          history('/');
        }else{
          await ApiClient.post('send-verification',{to:data.email}).then(res=>{
            if(res.success){
              history('/verify?email='+data.email);
            }
            })
        }
      }
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
              <Link to="/">
              <img src="/img/logo.png" alt="" className="login-logo" />
              </Link>
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
                Login {loading?<i className='fa fa-spinner fa-spin'></i>:<></>}
              </button>
            </div>
            <div className='text-center mt-2'>
            <Link to="/forgot">Forgot password</Link>
            <br/>
              <Link to="/signup">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
