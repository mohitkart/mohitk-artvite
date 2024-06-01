import React, { useEffect, useState } from 'react';
import packageModel from '../../model/package';
import { Link } from 'react-router-dom';
import crendentialModel from "../../model/credentials"
import methodModel from '../../model/method.model';
import firebaseModel from "../../firebase/firebase";
import FormControl from '../common/FormControl';

const CodeCard = ({ data }) => {
    const cuser=crendentialModel.getUser()
    const [user,setUser]=useState(cuser)
    const qToken=methodModel.getPrams('accessToken')

    const [tab, setTab] = useState('tab0');
    const ext = (p) => {
        let value = 'xml'
        if (p == '.js') value = 'javascript'
        if (p == '.ts') value = 'javascript'
        if (p == '.css') value = 'css'
        if (p == '.scss') value = 'scss'
        return value
    }

    useEffect(()=>{
        if(qToken){
            let token=qToken.replaceAll(' ','+')
            // console.log("accessToken",token)
          firebaseModel.firestore().collection('users').where('accessToken','==',token).get().then(res=>{
            let fres=res.docs.map(itm=>{
              return {...itm.data(),id:itm.id}
            })
            if(fres.length){
                let data={...fres[0],lastLogin:new Date().toISOString(),password:'********'}
                setUser(data)
                // console.log("data",data)
            }
            // console.log("fres",fres)
          })
          
        }
      },[])

   const packageCheck=()=>{
        return packageModel.check(data.package,user)
    }

    return <>
        <div className="card" key={data.id}>
            <ul className="nav nav-tabs bg-light">
                {data && data.code.map((itm, i) => {
                    return <li className="nav-item" key={i}>
                        <span
                            className={
                                tab === `tab${i}` ? 'nav-link active' : 'nav-link'
                            }
                            onClick={() => setTab(`tab${i}`)}
                        >
                            {itm.name + itm.ext}
                        </span>
                    </li>
                })}


                {/* <li className="nav-item">
                    <a className="nav-link">
                        <i className="fas fa-undo-alt" />
                    </a>
                </li> */}
            </ul>
            <div className="card-body p-0">
                {packageCheck()?<>
                    {data && data.code.map((itm, i) => {
                    return <div key={i}>
                        {tab === `tab${i}` ? (
                            <div>
                                <FormControl
                                type='code'
                                value={itm.code}
                                />
                            </div>
                        ) : (
                                <></>
                            )}
                    </div>
                })}
                </>:<>
                
                <div className="py-3 text-center">
                {user?<>
                    Premium Package
                </>:<>
                Login to view <Link to="/login">Login</Link>
                </>}
                    </div>
                </>}
               

            </div>
        </div>
    </>
}

export default CodeCard;