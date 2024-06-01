import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';

const BarChart = ({data=[],legends=[],hideLegends=false}) => {
    const [overtimeLoader, setOvertimeLoader] = useState(false)

    useEffect(()=>{
        if(data?.length){
            setOvertimeLoader(true)
            setTimeout(()=>{
                setOvertimeLoader(false)
            },500)
            // console.log("data",data)
        }
    },[data,legends])

    const performanceLegends = [...legends.map(itm=>itm.label)]
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
          ...legends.map(itm=>{
              return {
                  name: itm.label,
                  type: 'bar',
                  areaStyle: { normal: {} },
                  data: [
                      ...data.map(ditm => Number(ditm[itm.key]||0)),
                  ]
              }
          })
          
      ]
  };

   const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [...performanceLegends]
        },
        xAxis: [
          {
            type: 'category',
            data: [...data.map(itm => itm.date)]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
            ...legends.map(itm=>{
                return {
                    name: itm.label,
                    type: 'bar',
                    data: [
                        ...data.map(ditm => Number(ditm[itm.key]||0)),
                    ],
                  }
            })
        ]
      };

    return <>
        {overtimeLoader ? <>
            <div className='shine shineCard'></div>
        </> : <>
            <ReactECharts
                option={option}
                style={{ height: 400 }}
            />
        </>}
    </>
}

export default BarChart