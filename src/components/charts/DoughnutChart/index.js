import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import pipeModel from '../../../models/pipeModel';
import { useSelector } from 'react-redux';

const DoughnutChart = ({
    data = [],
    legends = [
        { label: 'Total Sales', key: 'totalSale',pipe:'currency',extrakey:['sum']},
        { label: 'Orders', key: 'totalOrders',extrakey:['numberOfOrders'] },
        { label: 'Total Pax', key: 'totalPax' },
        { label: 'AOV', key: 'avgOrderValue',extrakey:['avgorderValue'] },
        { label: 'Lead Times', key: 'leadTime' },
    ]
}) => {
    const user = useSelector((state) => state.user);
    const [overtimeLoader, setOvertimeLoader] = useState(false)

    useEffect(() => {
        if (data?.length) {
            // setOvertimeLoader(true)
            // setTimeout(() => {
            //     setOvertimeLoader(false)
            // }, 300)
        }
        console.log("data pie", data)
    }, [data, legends])


    const setValue=(itm,data)=>{
        let value=data?.[itm.key]
        if(itm?.extrakey && !value){
            itm?.extrakey.map(eitm=>{
                if(data?.[eitm])value=data?.[eitm]
            })
        }
        if(itm.pipe){
            if(itm.pipe=='currency') value=pipeModel.currency(value, "", user.companyCurrencyFormat)
            else value=pipeModel.number(value)
        }else{
            value=pipeModel.number(value)
        }
        return value
    }

    const customTooltip = {
        trigger: 'item',
        formatter: function (params) {
            let data = params.data
            let html = `<b>${data?.name}</b><br/>`
            legends.map(itm => {
                html += `${itm.label}: ${setValue(itm,data)}<br/>`
            })
            return html
        }
    }

    const SalesPaymentMethodPieChart = {
        tooltip: customTooltip,
        legend: {
            orient: "horizontal",
            right: 0,
            top: 0,
        },
        series: [
            {
                type: "pie",
                radius: "70%",
                label: {
                    show: true,
                    formatter: '{b} : ${c} ({d}%)',
                },
                labelLine: {
                    show: true,
                    formatter: '<b>{a}</b> <br/>{b} : ${c} ({d}%)',
                },
                data: [
                    // { value: 35, name: "Paypal", sales: 1 },
                    ...data
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
                color: ["#F9B1E3", "#A0C3FF", "#92E7D4", "#FACD6D", "#F9B1B1"],
            },
        ],
    };

    const SalesCurrencyDoughnutChart = {
        tooltip: customTooltip,
        legend: {
          orient: "scroll",
          right: 10,
          top: 80,
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "80%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            color: ["#F9B1E3", "#A0C3FF", "#92E7D4", "#FACD6D", "#F9B1B1"],
            labelLine: {
              show: false,
            },
            data: [
               // { value: 35, name: "Paypal", sales: 1 },
               ...data
            ],
          },
        ],
      };

    return <>
        {overtimeLoader ? <>
            <div className='shine shineCard'></div>
        </> : <>
            <ReactECharts
                option={SalesCurrencyDoughnutChart}
                style={{ height: 400 }}
            />
        </>}
    </>
}

export default DoughnutChart