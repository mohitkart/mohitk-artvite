import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import loader from '../../components/Methods/loader';
import firebaseModel from '../../firebase/firebase';

const SingleStudyView = () => {
  const table = 'html'
  const [data, setData] = useState();
  const { id } = useParams();

  useEffect(() => {
    loader(true)
    firebaseModel.firestore().collection(table).doc(id).onSnapshot((snapshot) => {
      let data1 = snapshot.data()
      loader(false)
      setData(data1);
    });

  }, []);

  return (
    <>
      <style>{data && data.css}</style>
      <div dangerouslySetInnerHTML={{__html: data && data.html}}></div>
      <script>{data && data.js}</script>
    </>
  );
};

export default SingleStudyView;
