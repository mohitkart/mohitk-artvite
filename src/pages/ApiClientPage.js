import React, { useState, useEffect } from 'react';
import ApiClient from '../shared/ApiClient';
import FormControl from '../components/common/FormControl';

const ApiClientPage = () => {
  const [tab,setTab]=useState('get')
  const [loading,setLoader]=useState(false)
  const [form,setForm]=useState({url:'',payload:'',auth:''})
  const methods=[
    {id:'get',name:'Get'},
    {id:'post',name:'Post'},
    {id:'put',name:'Put'},
    {id:'delete',name:'Delete'},
  ]
  useEffect(() => {
    
  }, [])


  const tabChange=(t)=>{
    setTab(t)
  }

  const urlMatch=(str)=>{
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    return str?str.match(regex):null
  }

  function isJsonString(str) {
    if(!str) return true
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

  const send=(e)=>{
    e.preventDefault()
    if(isJsonString(form.payload) && urlMatch(form.url)){
      let payload=form.payload?JSON.parse(form.payload):{}
      setLoader(true)
      ApiClient.allApi(form.url,payload,tab,true,form.auth).then(res=>{
        // console.log("res",res)
        setForm({...form,response:JSON.stringify(res)})
        setLoader(false)
      })
    }
  }

  return <>
    <div className="container py-3">

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        {methods.map(itm=>{
          return <li className="nav-item" key={itm.id}>
          <a className={`nav-link ${itm.id==tab?'active':''}`} onClick={e=>tabChange(itm.id)}>{itm.name}</a>
        </li>
        })}
      </ul>
      <div className="tab-content py-3" id="myTabContent">
        <div className="tab-pane fade show active">
          <form onSubmit={send}>
          <div className='form-row'>
            <div className='col-md-12 mb-3'>
              <label>Url <small className="text-danger">{urlMatch(form.url)?'':'Invalid'}</small></label>
              <input type='text' placeholder='Enter Url' required value={form.url} onChange={e=>setForm({...form,url:e.target.value})} className={`form-control ${urlMatch(form.url)?'':'border border-danger'}`} />
            </div>
            <div className='col-md-12 mb-3'>
              <label>Authorization</label>
              <input type='text' placeholder='Authorization' value={form.auth} onChange={e=>setForm({...form,auth:e.target.value})} className={`form-control`} />
            </div>
            <div className='col-md-12 mb-3'>
              <label>Payload <small className="text-danger">{isJsonString(form.payload)?'':'Invalid'}</small></label>
              
                    <FormControl
                    type='code'
                    onChange={e=>{
                      setForm({...form,payload:e})
                    }}
                    value={form.payload}
                    />
            </div>
            <div className='col-md-12 mb-3 text-right'>
                <button className='btn btn-primary' disabled={loading}>Send {loading?<i className='fa fa-spinner fa-spin ml-2'></i>:<></>}</button>
            </div>
            <div className='col-md-12 mb-3'>
              <label>Response <small className="text-danger">{isJsonString(form.payload)?'':'Invalid'}</small></label>
              <FormControl
                    type='code'
                    onChange={e=>{
                      setForm({...form,response:e})
                    }}
                    />
            </div>
          </div>
          </form>
        </div>
      </div>


    </div>
  </>
}

export default ApiClientPage