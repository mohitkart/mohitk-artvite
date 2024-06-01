import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCzbxPrywBs-awh0IYEpT60Ur1KeJ-E_gc',
  authDomain: 'fir-node-1bf4a.firebaseapp.com',
  databaseURL: 'https://fir-node-1bf4a.firebaseio.com',
  projectId: 'fir-node-1bf4a',
  storageBucket: 'fir-node-1bf4a.appspot.com',
  messagingSenderId: '862877386166'
}

// const firebaseConfig2={
//   apiKey: 'AIzaSyCPgsEuQGDEMu5noCjXoeYx3o8CGKhL9qY',
//   authDomain: 'mohitk-art.firebaseapp.com',
//   databaseURL: 'https://mohitk-art.firebaseio.com',
//   projectId: 'mohitk-art',
//   storageBucket: 'mohitk-art.appspot.com',
//   messagingSenderId: '720863554288'
// }

var firebaseConfig2 = {
  apiKey: 'AIzaSyC4LHkBhYOxh5dV7oT1gkK1dOjwcIRcg80',
  authDomain: 'mohitk-web.firebaseapp.com',
  databaseURL: 'https://mohitk-web.firebaseio.com',
  projectId: 'mohitk-web',
  storageBucket: 'mohitk-web.appspot.com',
  messagingSenderId: '99547249930'
};

let hapiniconfig={
  apiKey: "AIzaSyBT3UUMe9pCOwZuB6V0RSil0EIE8h0hZ78",
  authDomain: "hapini-30e8c.firebaseapp.com",
  databaseURL: "https://hapini-30e8c-default-rtdb.firebaseio.com",
  projectId: "hapini-30e8c",
  storageBucket: "hapini-30e8c.appspot.com",
  messagingSenderId: "1052701045482",
  appId: "1:1052701045482:web:3a7e80f3e4909d75fc5d93",
  measurementId: "G-HT6N1TSNKN",
  cmKey: 'BLmDQRKWgpEB3jUqJ7yvsEwc9yG69tjGy48utw-AwY2dWURJiwi3nL3tMfkvOB86MjTBW0cpFR4RMZ149a69oK8'
}


let fireconfig=firebaseConfig2
let firesession=sessionStorage.getItem('fireConfig')
if(firesession){
  if(firesession==1) fireconfig=firebaseConfig
}else{
  sessionStorage.setItem('fireConfig','')
}


let url=window.location.href
if(url.includes('hapinicreds')){
  fireconfig=hapiniconfig
}

// var firebaseConfig = {
//   apiKey: 'AIzaSyCPgsEuQGDEMu5noCjXoeYx3o8CGKhL9qY',
//   authDomain: 'mohitk-art.firebaseapp.com',
//   databaseURL: 'https://mohitk-art.firebaseio.com',
//   projectId: 'mohitk-art',
//   storageBucket: 'mohitk-art.appspot.com',
//   messagingSenderId: '720863554288'
//   // appId: 'GvPD0Mqp02g9s2EyshXSdK1mRmxuPAnsUEOWeWZR',
//   // measurementId: 'GvPD0Mqp02g9s2EyshXSdK1mRmxuPAnsUEOWeWZR'
// };

// Initialize Firebase
firebase.initializeApp(fireconfig)

const firebaseModel = firebase
export default firebaseModel
