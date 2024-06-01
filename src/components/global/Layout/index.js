import React, { useEffect } from 'react';
import Header from '../../Header';
import FireAPI from '../../../api';
import crendentialModel from '../../../model/credentials';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const user=crendentialModel.getUser()
  const history=useNavigate()
  useEffect(()=>{
    let browseload = localStorage.getItem('browseload')
    if(user.id){
      if (!browseload) {
        FireAPI.getSingle({payload:{id:user.id},table:'users'}).then(res=>{
          if(res.success){
            if(res.data.accessToken!=user.accessToken){
              crendentialModel.logout()
              history("/login")
            }else{
              let data={...res.data}
              crendentialModel.setUser(data)
              // firebaseModel.firestore().collection('roles').doc(data.role).get().then(res=>{
              //   data.roleDetail={...res.data(),id:res.id}
                
              // })
            }
            // localStorage.setItem('browseload', 'true')
          }
        })
      }
    }
    
  },[user])


  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
