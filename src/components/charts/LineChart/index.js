import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';
import colorsModel from '../../../model/colors.model';

const LineChart = ({
    data=[],
    legends=[],
    hideLegends=true}) => {
    const colors=colorsModel.list

    const [overtimeLoader, setOvertimeLoader] = useState(false)
    const [hiddenItem, setHiddenItem] = useState([])



    const legendClick=(itm)=>{
        let arr=hiddenItem
        if(arr.find(fitm=>fitm.key==itm.key)){
            arr=arr.filter(fitm=>fitm.key!=itm.key)
        }else{
            arr.push(itm)
        }
        console.log("arr",arr)
        setHiddenItem([...arr])
        setOvertimeLoader(true)
        setTimeout(() => {
            setOvertimeLoader(false)
        }, 100);
    }

    const performanceLegends = [...legends.filter(itm=>!itm?.hide).map(itm=>itm.label)]
    const performanceOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend:hideLegends?null:{
          data: [...performanceLegends]
          
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [
                    ...data.map(itm => itm.date)
                ]
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            ...legends.map((itm,i)=>{
                return {
                    name: itm.label,
                    key:itm.key,
                    type: 'line',
                    itemStyle: {normal: {areaStyle: {type: 'default'},color: colors?.[i]}},
                    data: [
                        ...data.map(ditm => Number(ditm[itm.key]||0)),
                    ]
                }
            }).filter(fitm=>{
                let ext=hiddenItem.find(eitm=>eitm.key==fitm.key||eitm.compare==fitm.key)
                let value=true
                if(ext){
                    value=false
                    if(ext?.compare==fitm.key){
                        value=false
                    }
                }
        
                return value
            })
        ]
    };

    useEffect(()=>{
        if(data?.length){
            setOvertimeLoader(true)
            setTimeout(()=>{
                setOvertimeLoader(false)
            },800)
            console.log("data",data)
        }
    },[data])

    return <>
        {overtimeLoader ? <>
            <div className='shine shineCard'></div>
        </> : <>
        <div>
            <div className='legends flex gap-2'>
                {legends.map((itm,i)=>{
                    if(!itm.hide)
                    return <>
                <div className={`legendItem flex ${hiddenItem.find(fitm=>fitm.key==itm.key)?'active':''}`} onClick={()=>legendClick(itm)}>
                    <div className='color' style={{background:colorsModel.list[i]}}></div>
                    {itm.label}</div>
                    </>
                })}
            </div>
            <ReactECharts
                option={performanceOption}
                style={{ height: 400 }}
            />
        </div>
        </>}
    </>
}

export default LineChart