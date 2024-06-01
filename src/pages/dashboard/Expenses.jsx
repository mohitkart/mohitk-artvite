import React, { useEffect, useState } from "react"
import datepipeModel from "../../model/datepipemodel";
import firebaseModel from "../../firebase/firebase";
import crendentialModel from "../../model/credentials";
import LineChart from "../../components/charts/LineChart";
import pipeModel from "../../model/pipeModel";

const Expenses=({filters})=>{
    const [loader, setLoader] = useState();
    const [data,setData]=useState([])
    const [chartData,setChartData]=useState([])
    const [categories, setCategories] = useState([]);
    const [catChart, setCatChart] = useState([]);
    const table='expenses';
    const catTable = 'expenseCategory';
    const user = crendentialModel.getUser();
    

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
              date:datepipeModel.datetodatetime(itm.date.seconds*1000),
            }
    
            prm={
              ...prm,
            }
            return prm
          })
          rdata=rdata.sort((a,b)=>{
            return new Date(b.date) - new Date(a.date)
          })
    
          let barrAll = [...new Set([...rdata.map((itm) => datepipeModel.datetostring(itm.date))])];
    

          const typeTotal=(type='',date='')=>{
            let arr=rdata.filter(ditm=>datepipeModel.datetostring(ditm.date)==date)
            let total=0
            arr.map(itm=>{
                if(itm.type==type){
                    total+=Number(itm.price)
                }
            })

            return total
          }

          barrAll=barrAll.map(itm=>{
            return {
              date:datepipeModel.date(itm),
              give:typeTotal('Give',itm),
              got:typeTotal('Got',itm),
            }
          })

          setChartData([...barrAll])
          setData([...rdata])
          setLoader(false)
        },err=>{
          console.log("err",err)
        });
      };


      const typeTotal=(type='')=>{
        let arr=data.filter(ditm=>ditm.type==type)
        let total=0
        arr.map(itm=>{
            total+=Number(itm.price)
        })

        return total
      }

      const catTotal=(cat='',type='Give')=>{
        let arr=data.filter(ditm=>ditm.type==type&&ditm.category==cat)
        let total=0
        arr.map(itm=>{
            total+=Number(itm.price)
        })

        return total
      }

      const getCategories = () => {
        firebaseModel.firestore().collection(catTable)
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

      useEffect(()=>{
        if(filters.startDate){
            gallaryData()
        }
      },[filters])

      useEffect(()=>{
        getCategories()
      },[])

      useEffect(()=>{
        if(data.length&&categories.length){
            let barrAll = [...new Set([...data.map((itm) => datepipeModel.datetostring(itm.date))])];


            const catPrice=(cat,date,type)=>{
                let arr=data.filter(ditm=>datepipeModel.datetostring(ditm.date)==date&&ditm.type==type&&ditm.category==cat)
                let total=0
                arr.map(itm=>{
                    total+=Number(itm.price)
                })
    
                return total
            }


            barrAll=barrAll.map(itm=>{
                let prm={
                    date:datepipeModel.date(itm)
                }

                categories.map(citm=>{
                    prm[`give_${citm.id}`]=catPrice(citm.id,itm,'Give')
                    prm[`got_${citm.id}`]=catPrice(citm.id,itm,'Got')
                })


                return prm
            })

            console.log("barrAll cat",barrAll)
            setCatChart([...barrAll])

        }else{
          setCatChart([])
        }
      },[categories,data])

    return <>
    <div className="">
    <h3 className="nb-3">Expenses</h3>
    <div className="row">
        <div className="col-md-6 mb-3">
            <h4>Give and Got</h4>
        <LineChart
            legends={[
              {label:`Total Give (${pipeModel.currency(typeTotal('Give'))})`,key:'give'},
              {label:`Total Got (${pipeModel.currency(typeTotal('Got'))})`,key:'got'}
            ]}
            data={chartData}
            />
        </div>
        <div className="col-md-6 mb-3">
            <h4>Gives Categories</h4>
        <LineChart
            legends={
                categories.map(itm=>{
                    return {label:`${itm.name} (${pipeModel.currency(catTotal(itm.id))})`,key:`give_${itm.id}`}
                })
            }
            data={catChart}
            />
        </div>
    </div>
    
    </div>
    </>
}

export default Expenses