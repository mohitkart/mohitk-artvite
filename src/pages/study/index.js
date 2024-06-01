import React, { useState, useEffect } from 'react';
import Layout from '../../components/global/Layout';
import StudyRow from '../../components/Study/row';
import './study.scss';
import firebaseModel from '../../firebase/firebase';
import methodModel from '../../model/method.model';

const Study = () => {
  const table = 'html'
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [total, setTotal] = useState();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const loadArry = [1, 2, 3, 4]
  const [loader, setLoader] = useState();

  const gallaryData = () => {
    window.scroll(0, 0);
    setLoader(true)

    firebaseModel.firestore().collection(table).onSnapshot((snapshot) => {
      let rdata = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      rdata=rdata.sort((a,b)=>{
        return new Date(b.date)-new Date(a.date)
      })
      setData(rdata)
      setFilterData(rdata)
      setTotal(rdata && rdata.length)
      setLoader(false)
    });
  };



  const getCategories = () => {
    firebaseModel.firestore().collection('categories').onSnapshot((snapshot) => {
      let rdata = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setCategories(rdata)
    });
  };

  const clear = e => {
    document.getElementById('allCat').click()
    setCategory('')
    searchKey('', '')
  }

  const searchKey = (value, cat = category) => {
    setSearch(value)
    window.scroll(0, 0);
    let matchingStrings = [];
    let matchingCatStrings = [];
    data.forEach((list) => {
      if (list.title.toLocaleLowerCase().search(value.toLocaleLowerCase()) > -1) {
        matchingStrings.push(list)
        if (list.category == cat) {
          matchingCatStrings.push(list)
        }
      }
    })

    if (cat) {
      setTotal(matchingCatStrings.length)
      setFilterData(matchingCatStrings)
    } else {
      setTotal(matchingStrings.length)
      setFilterData(matchingStrings)
    }

  }

  const filter = id => {
    setCategory(id);
    window.scroll(0, 0);
    let array = data.filter(el => el.category == id);
    setFilterData(array)
    setTotal(array.length)
  };




  useEffect(() => {
    gallaryData();
    getCategories();
    methodModel.metaTitleUpdate({ title: `Mohitk-art | Code Heping` })
  }, []);

  return (
    <>
      <Layout>
        <div className="container py-3">
          <div className="row">
            <div className="col-md-9 order-2 order-sm-0">
              <div className="row">


                {loader && loadArry.map((item, i) => {
                  return (
                    <div className="col-md-6 mb-3" key={i}>
                      <div className="blog-card" data-aos="flip-left">

                        <div className='img shine'></div>

                        <div className="category shine"></div>

                        <div className="content px-3 py-2 shadow bg-white">
                          <div className="date shine">

                          </div>

                          <a className="title shine">
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}



                {
                  filterData.length > 0 ? filterData.map((lis, i) => {
                    return (
                      <StudyRow
                        key={i}
                        title={lis.title}
                        category={
                          categories &&
                          categories.map(citem => {
                            if (citem.id == lis.category) {
                              return citem.name || 'No Category';
                            }
                          })
                        }
                        id={lis.id}
                        html={lis.html}
                        css={lis.css}
                        scss={lis.scss}
                        js={lis.js}
                      />
                    );
                  }) : loader ? <></> : <h3>Data Not Found</h3>}

              </div>
            </div>
            <div className="col-md-3">


              <div className="sticky-sidebar">
                <div className="mb-3 font-weight-medium">
                  Total : {total}
                </div>

                <div className="mb-3 searchForm">
                  <input type="text" placeholder="Search" value={search} onChange={e => searchKey(e.target.value)} className="form-control" />
                  {search ? <i className="fa fa-times" onClick={() => clear()}></i> : <></>}
                </div>

                <h4 className="mb-3">Categories</h4>
                <div className="category-ul mb-3">
                  <label>
                    <input
                      type="radio"
                      id="allCat"
                      name="category"
                      onChange={() => {
                        clear()
                      }}
                      value=""
                    />
                    All
                  </label>
                  {categories &&
                    categories.map((item, i) => {
                      if (item.type == 'code')
                        return (
                          <label key={i}>
                            <input
                              type="radio"
                              name="category"
                              onChange={e => filter(e.target.value)}
                              value={item.id}
                            />
                            {item.name}
                          </label>
                        );
                    })}
                </div>


              </div>
            </div>
          </div>
        </div>
      </Layout>

    </>
  );
};

export default Study;
