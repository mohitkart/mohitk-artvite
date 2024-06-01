function currency(num,c='rs.',companyCurrencyFormat=',') {
   // let currency=c
   let cf=companyCurrencyFormat
    let value='0'
    if(num){
      value=Number(num).toFixed(2)
      value=Number(value)
      value=String(value)
      // if(value.split('.')[1]=='00'){
      //    value=value.split('.')[0]
      // }
      if(cf==','){
         value=value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }else if(cf=='.'){
         value=value.replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      } else{
         value=value.replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
      }
    } 
    
    return `${c}${value}`
 }

 function number(num,nofloat=false) {
    let value=''
    if(num){
      value=Number(num).toFixed(2)
      if(value.split('.')[1]=='00'){
         value=value.split('.')[0]
      }
      value=String(value).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
   
    return value||'0'
 }

 function NoFloatnumber(num,nofloat=false) {
   let value=''
   if(num){
     if(nofloat==false){
        value=String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }else{
        value=Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }
   }
  
   return value||'0'
}

 const capitalizeFirstLetter=(str)=> {
   return str.charAt(0).toUpperCase() + str.slice(1);
 }

 const card=(value)=>{
   let inputValue = value.replace(/\s/g, '').replace(/[^0-9]/g, ''); // Remove existing spaces
   let formattedValue = '';

   for (let i = 0; i < inputValue.length; i++) {
     if (i > 0 && i % 4 === 0) {
       formattedValue += ' '; // Add a space after every four digits
     }
     formattedValue += inputValue[i];
   }
   return formattedValue
 }

 const cardToNumber=(value)=>{
   let inputValue = value?.replaceAll(' ', '')
   return Number(inputValue||0)
 }

 const pipeModel={currency,number,capitalizeFirstLetter,NoFloatnumber,card,cardToNumber}
 export default pipeModel