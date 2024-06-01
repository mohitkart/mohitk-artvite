import React, { useState, useEffect, useRef } from 'react';
import Banner from '../../components/Banner';
import Layout from '../../components/global/Layout';
import datepipeModel from '../../model/datepipemodel';
import firebaseModel from '../../firebase/firebase';
import methodModel from '../../model/method.model';
import { useNavigate } from 'react-router-dom';
import crendentialModel from '../../model/credentials';
import LineChart from "../../components/charts/LineChart";
import DateRangePicker from '../../components/DateRangePicker';
import Expenses from './Expenses';
const Dashboard = () => {
  const table = 'tasks'
  const user=crendentialModel.getUser()
  const history=useNavigate()
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilter] = useState({name:'',startDate:'',endDate:'',status:''});
  const [loader, setLoader] = useState();

  const gallaryData = () => {
    // window.scroll(0, 0);
    setLoader(true)
    const startDate = new Date(`${filters.startDate} 00:00`);
    const endDate = new Date(`${filters.endDate} 23:59`);
    console.log("startDate",startDate)
    console.log("endDate",endDate)
    firebaseModel.firestore().collection(table)
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    // .where("status", "==", filters?.status||'In Progress')
    .where("addedBy", "==", user?.id)
    .onSnapshot((snapshot) => {
      let rdata = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      rdata=rdata.map(itm=>{
        let endDate=itm.endDate
        if(!endDate) endDate=itm.date

        let prm={
          ...itm,
          order:itm.status=='In Progress'?0:itm.status=='Done'?1:2,
          date:datepipeModel.datetodatetime(itm.date.seconds*1000),
          endDate:datepipeModel.datetodatetime(endDate.seconds*1000),
        }

        let milliseconds=datepipeModel.gethrsminutes(prm.date,prm.endDate,'object')?.milliseconds

        prm={
          ...prm,
          hours:datepipeModel.millisecondsToHours(milliseconds),
          minutes:datepipeModel.millisecondsToMinutes(milliseconds),
          milliseconds:milliseconds
        }

        let minutes=Number(prm?.time)||0
        if(!minutes) minutes=prm.minutes
        prm.minutes=minutes
        prm.hours=datepipeModel.minutesToHours(minutes)
        return prm
      })
      rdata=rdata.sort((a,b)=>{
        return new Date(b.date) - new Date(a.date)
      })

      let barrAll = [...new Set([...rdata.map((itm) => datepipeModel.datetostring(itm.date))])];

      barrAll=barrAll.map(itm=>{
        return {
          date:itm,
          tasks:rdata.filter(ditm=>datepipeModel.datetostring(ditm.date)==itm)
        }
      })

      

      let t=barrAll.map(itm=>{
      
        let hours=0
        itm.tasks.map(itm=>{
          hours+=itm.hours
        })
        return {
          date:datepipeModel.date(itm.date),
          count:itm.tasks.length,
          hours:Number(hours.toFixed(2))
        }
      })

      console.log("rdata",rdata)
      console.log("barrAll",barrAll)
      console.log("t",t)
      setData([...rdata])
      setTasks([...t])
      setLoader(false)
    },err=>{
      console.log("err",err)
    });
  };

  const getCategories = () => {
    firebaseModel.firestore().collection('taskCategory')
    .where("addedBy", "==", user?.id)
    .onSnapshot((snapshot) => {
      let rdata = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // console.log("categorries",rdata)
      setCategories(rdata)
    });
  };


  useEffect(() => {
    methodModel.metaTitleUpdate({ title: `Mohitk-art | Tasks` })
    
    if(!user.id){
      history('/login')
    }else{
      getCategories();
      back()
    }
  }, []);

  useEffect(()=>{
    if(filters.startDate){
      gallaryData();
    }
  },[filters.startDate,filters.endDate])


  const back = () => {
    let date = new Date(filters.startDate || new Date())
    let year = date.getFullYear()
    let month = date.getMonth()
    if(!filters.startDate){
      month=month+1
    }

    if (month == 0) {
      year = year - 1
      month = 12
    }

    let endDate = new Date(`${year}-${month}-1`)
    endDate.setMonth(month)
    endDate.setDate(0)
    let startDate = datepipeModel.datetostring(`${year}-${month}-01`)
    endDate = datepipeModel.datetostring(endDate)
    setFilter({ ...filters, startDate: startDate, endDate })
  }


  const next = () => {
    let date = new Date(filters.startDate || new Date())
    let year = date.getFullYear()
    let month = date.getMonth() + 2

    if (month > 12) {
      year = year + 1
      month = 1
    }

    let endDate = new Date(`${year}-${month}-1`)
    endDate.setMonth(month)
    endDate.setDate(0)
    let startDate = datepipeModel.datetostring(`${year}-${month}-01`)
    endDate = datepipeModel.datetostring(endDate)
    setFilter({ ...filters, startDate: startDate, endDate })
  }


  const keyTotal=(key)=>{
    let value=0
    tasks.map(itm=>{
      value+=itm[key]
    })
    return Number(value.toFixed(2))
  }

  return (<>
    <Layout>
      <div className="container py-3">
      <div className='filterFlex mb-3 d-flex flex-wrap gap-2'>
        <button className='btn btn-primary' onClick={()=>back()}>Back</button>
        <DateRangePicker
        onChange={e=>setFilter({...filters,startDate:e.startDate,endDate:e.endDate})}
        value={{startDate:filters.startDate,endDate:filters.endDate}}
        />
        <button className='btn btn-primary' onClick={()=>next()}>Next</button>
      </div>
        <div className="row">
          <div className="col-md-12">
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <b>Tasks</b>
                <div>{keyTotal('count')}</div>
              </div>
              <div className="col-md-6 mb-3">
                <b>Hours</b>
                <div>{keyTotal('hours')}</div>
              </div>
            </div>
            <LineChart
            legends={[
              {label:'Total Task',key:'count'},
              {label:'Total Hours',key:'hours'}
            ]}
            data={tasks}
            />

          </div>
        </div>

        <Expenses filters={filters} />
      </div>
    </Layout>

  </>);

}

export default Dashboard;
