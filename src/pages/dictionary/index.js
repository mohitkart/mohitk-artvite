import React, { useState, useEffect } from 'react';
import Layout from '../../components/global/Layout';
import './style.scss';
import firebaseModel from '../../firebase/firebase';

const Dictionary = () => {
    const table = 'dictionary'
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState();
    const [filterData, setFilterData] = useState([]);
    const [total, setTotal] = useState();
    const [search, setSearch] = useState('');
    const loadArry = [1, 2, 3, 4, 5, 6, 7, 8]

    const gallaryData = () => {
        window.scroll(0, 0);
        setLoader(true)
        firebaseModel.firestore().collection(table).onSnapshot((snapshot) => {
            let rdata = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }))
            setData(rdata)
            setFilterData(rdata)
            setTotal(rdata && rdata.length)
            setLoader(false)
        });
    };

    const clear = e => {
        searchKey('')
    }

    const searchKey = (value) => {
        setSearch(value)
        window.scroll(0, 0);
        let matchingStrings = [];
        data.forEach((list) => {
            if (list.english.toLocaleLowerCase().search(value.toLocaleLowerCase()) > -1 ||
                list.hindi.toLocaleLowerCase().search(value.toLocaleLowerCase()) > -1) {
                matchingStrings.push(list)
            }
        })

        setTotal(matchingStrings.length)
        setFilterData(matchingStrings)

    }




    useEffect(() => {
        gallaryData();
    }, []);

    return (<>
        <Layout>
            <div className='container py-3'>

                <div className="mb-2 searchForm stickySearch">
                    <input type="text" placeholder="Search" value={search} onChange={e => searchKey(e.target.value)} className="form-control" />
                    {search ? <i className="fa fa-times" onClick={() => clear()}></i> : <></>}
                </div>

                {loader ? <>
                    {loadArry.map((item, i) => {
                        return <div className='card p-2 shadow mb-2' key={i}>
                            <strong className='shine'></strong>
                            <p className='mb-2 mt-1 shine'></p>
                            <p className='mb-0 shine'></p>
                        </div>
                    })}
                </> : <></>}



                {filterData && filterData.map((item) => {
                    return <div className='card p-2 shadow mb-2' key={item.id}>
                        <strong>{item.english}</strong>
                        <p className='mb-2 mt-1'>{item.hindi}</p>
                        <p>{item.description ? item.description : ''}</p>

                    </div>
                })}

            </div>
        </Layout>
    </>);

}

export default Dictionary;