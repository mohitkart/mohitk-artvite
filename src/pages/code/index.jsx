import React, { useState, useEffect } from 'react';
import Layout from '../../components/global/Layout';
import CodeCard from "../../components/code/codeCard"
import './study.scss';
import { useNavigate } from 'react-router-dom';
import firebaseModel from '../../firebase/firebase';
import methodModel from '../../model/method.model';
import datepipeModel from '../../model/datepipemodel';
import crendentialModel from '../../model/credentials';
import { toast } from 'react-toastify';

const Code = () => {
    const user=crendentialModel.getUser()
    const table = 'code'
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [total, setTotal] = useState();
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState(false);

    const loadArry = [1, 2, 3]
    const [loader, setLoader] = useState();

    const history = useNavigate();

    const gallaryData = () => {
        window.scroll(0, 0);
        setLoader(true)
        firebaseModel.firestore().collection(table).onSnapshot((snapshot) => {
            let rdata = []
            snapshot.docs.map((doc) => {
                let ddata = doc.data()
                let code = []
                if (ddata.code) code = JSON.parse(ddata.code)
                let value = { id: doc.id, ...ddata, code }
                rdata.push(value)
            })

            let id = methodModel.getPrams('id')
            if (id) {
                let ext = rdata.find(itm => itm.id == id)
                if (ext) openModal(ext)
            }

            rdata=rdata.sort((a,b)=>{
                return new Date(b.date) - new Date(a.date)
            })
            setData(rdata)
            setFilterData(rdata)
            setTotal(rdata && rdata.length)
            setLoader(false)
        });

        // ApiClient.get(url, {}, base).then(res => {
        //     if (res.status == 200) {
        //         setLoader(false)
        //         setData(res.data)
        //         setFilterData(res.data)
        //         setTotal(res.data && res.data.length)

        //         let url = window.location.href
        //         console.log("url", url)

        //         if (url.includes('?id=')) {
        //             let uurl = url.split('?id=')
        //             console.log("url", uurl)

        //             setTimeout(() => {
        //                 scrollId(`title${uurl[1]}`)
        //             }, 500)

        //         }
        //     }
        // }, err => {
        //     setLoader(false)
        // })
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

    const searchForm=(e)=>{
        e.preventDefault()
        searchKey(search)
    }

    const filter = id => {
        setCategory(id);
        window.scroll(0, 0);
        let array = data.filter(el => el.category == id);
        setFilterData(array)
        setTotal(array.length)
    };


    const openModal = (mdata) => {
        let accessToken=methodModel.getPrams('accessToken')
        if(accessToken){
            history(`/code?id=${mdata.id}&accessToken=${accessToken}`)
        }else{
            history(`/code?id=${mdata.id}`)
        }
        
        methodModel.metaTitleUpdate({ title: `Mohitk-art | ${mdata.title}`, keywords: `${mdata.title}` })
        setModal(true)
        setModalData(mdata)
    }


    useEffect(() => {
        gallaryData();
        getCategories();
        methodModel.metaTitleUpdate({ title: `Mohitk-art | Code Heping` })
    }, []);

    const closeModal=()=>{
        setModal(false)
        history('/code')
    }

    const copy=()=>{
        let url = `https://mohitk-web.web.app/code?id=${modalData.id}&accessToken=${user.accessToken}`
        navigator.clipboard.writeText(url);
        toast.success('Url Copyed')
    }

    return (
        <>
            <Layout>
                <div className="container py-3">
                    <div className="row">
                        <div className="col-md-9 order-2 order-sm-0">
                            <div className="row">


                                {loader && loadArry.map((item, i) => {
                                    return (
                                        <div className="col-md-12 mb-3" key={i}>
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
                                            <div className="col-md-12 mb-3" key={i}>
                                                <div className="card p-3">
                                                <h4 className='mb-2 text-center cursor-pointer' id={`title${lis.id}`} onClick={() => openModal(lis)}>{lis.title}</h4>
                                                <div className='mb-3 text-center badgesL'>
                                                    <span className="badge">
                                                    <i className='fa fa-folder mr-2'></i>
                                                    {
                                                        categories &&
                                                        categories.map(citem => {
                                                            if (citem.id == lis.category) {
                                                                return citem.name || 'No Category';
                                                            }
                                                        })
                                                    }
                                                    </span>
                                                    <span className="badge">
                                                    <i className='fa fa-calendar mr-2'></i>
                                                    {datepipeModel.datetime(lis.date)}
                                                    </span>
                                                </div>
                                                {/* <CodeCard data={lis} /> */}
                                                </div>
                                            </div>
                                        );
                                    }) : loader ? <></> : <h3>Data Not Found</h3>}

                            </div>
                        </div>
                        <div className="col-md-3">


                            <div className="sticky-sidebar">
                                <div className="mb-3 font-weight-medium">
                                    Total : {total}
                                </div>

                                <form className="mb-3 searchForm" onSubmit={searchForm}>
                                    <input type="text" placeholder="Search" value={search} onChange={e => searchKey(e.target.value)} className="form-control" />
                                    {search ? <i className="fa fa-times" onClick={() => clear()}></i> : <></>}
                                </form>

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

            {modal ? <div className="modal d-block codeModal">
                <div className='modal-overlay' onClick={() => closeModal()}></div>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalData && modalData.title}</h5>
                            <button type="button" className="close" onClick={() => closeModal()}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {user?<>
                                <div className='mb-3 text-right'>
                                <button onClick={copy} className='btn btn-primary'>Copy Link</button>
                            </div>
                            </>:<></>}
                           
                            <CodeCard data={modalData} />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => closeModal()}>Close</button>
                        </div>
                    </div>
                </div>
            </div> : <></>
            }


        </>
    );
};

export default Code;
