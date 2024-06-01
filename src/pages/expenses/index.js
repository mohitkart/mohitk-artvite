import React, { useState, useEffect, useRef } from 'react';
import Banner from '../../components/Banner';
import Layout from '../../components/global/Layout';
import datepipeModel from '../../model/datepipemodel';
import firebaseModel from '../../firebase/firebase';
import methodModel from '../../model/method.model';
import { useNavigate } from 'react-router-dom';
import crendentialModel from '../../model/credentials';
import UploadImage from '../../components/UploadImage';
import pipeModel from '../../model/pipeModel';
import FormControl from '../../components/common/FormControl';

const Expenses = () => {
  const user = crendentialModel.getUser()
  const table = 'expenses'
  const catTable = 'expenseCategory'
  let ldata = localStorage.getItem(table)
  ldata = ldata && !user?.id ? JSON.parse(ldata) : []

  let lcategory = localStorage.getItem(catTable)
  lcategory = lcategory && !user?.id ? JSON.parse(lcategory) : []

  const history = useNavigate()
  const [data, setData] = useState([...ldata]);
  const [filterData, setFilterData] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([...lcategory]);
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilter] = useState({ name: '', startDate: '', endDate: '', status: '' });
  const [form, setForm] = useState({ name: '', price: '', type: '', id: '', date: '', status: '', category: '' });
  const [catform, setCatForm] = useState({ name: '', id: '' });
  const [image, setImage] = useState('');
  const imageModal = `tasks_${user?.id}`
  const loadArry = [1, 2, 3, 4, 5, 6]
  const [loader, setLoader] = useState();
  const [formLoader, setFormLoader] = useState(false);

  const gallaryData = () => {
    // window.scroll(0, 0);
    setLoader(true)
    const startDate = new Date(`${filters.startDate} 00:00`);
    const endDate = new Date(`${filters.endDate} 23:59`);
    console.log("startDate", startDate)
    console.log("endDate", endDate)
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
        rdata = rdata.map(itm => {
          let prm = {
            ...itm,
            date: datepipeModel.datetodatetime(itm.date.seconds * 1000),
          }

          return {
            ...prm,
          }
        })
        console.log("rdata", rdata)
        setData([...rdata])
        // setFilterData(rdata)
        // setTotal(rdata && rdata.length)
        setLoader(false)
      }, err => {
        console.log("err", err)
      });
  };


  useEffect(() => {
    searchKey(search)
  }, [data])

  const clear = e => {
    setFilter({ ...filters, status: '' })
    setCategory([])
    setSearch('')
  }

  const searchKey = (value=search, cat = category, status = filters.status) => {
    // window.scroll(0, 0);
    let matchingStrings = [];
    data.forEach((list) => {
      if ((list.name.toLocaleLowerCase().search(value.toLocaleLowerCase() || '') > -1
      || list.price.search(value|| '') > -1
      )
        && list.status.toLocaleLowerCase().search(status.toLocaleLowerCase() || '') > -1
        && (cat.includes(list.category) || !cat.length)) {
        matchingStrings.push(list)
      }
    })

    matchingStrings = dateFilter(matchingStrings)
    setTotal(matchingStrings.length)
    setFilterData(matchingStrings)
  }

  const filter = id => {
    let arr=category
    if(arr.includes(id)){
      arr=arr.filter(itm=>itm!=id)
    }else{
      arr.push(id)
    }
    setCategory([...arr]);
  };

  const getCategories = () => {
    firebaseModel.firestore().collection(catTable)
      .where("addedBy", "==", user?.id)
      .onSnapshot((snapshot) => {
        let rdata = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        rdata.push({id:'',name:'Unidentityfied'})
        // console.log("categorries",rdata)
        setCategories(rdata)
        setCategory(rdata.map(itm=>itm.id))
      });
  };

  const dateFilter = (data = []) => {
    let arr = [...data]
    const startDate = new Date(`${filters.startDate} 00:00`);
    const endDate = new Date(`${filters.endDate} 23:59`);
    arr = arr.filter(itm => new Date(itm.date) >= new Date(startDate) && new Date(itm.date) <= new Date(endDate))
    return arr
  }

  useEffect(() => {
    methodModel.metaTitleUpdate({ title: `Mohitk-art | Expenses` })

    if (!user.id) {
      // history('/login')
    } else {
      getCategories();
    }

    back()
  }, []);

  useEffect(() => {
    if (filters.startDate) {
      if (user.id) {
        gallaryData();
      } else {
        let arr = dateFilter(data)
        setFilterData([...arr])
      }
    }
  }, [filters.startDate, filters.endDate])

  useEffect(()=>{
    searchKey(search,category,filters.status)
  },[search,category,filters.status])

  const edit = (itm) => {
    document.getElementById('addEditTask').click()
    let payload = {
      time: '',
      ...itm,
      date: datepipeModel.datetodatetime(itm.date),
    }
    setForm({ ...payload })
    setImage(itm?.image || '')
  }

  const deleteTask = (id) => {
    if (window.confirm("Do You want to delete this")) {
      if (user?.id) {
        firebaseModel.firestore().collection(table).doc(id).delete().then(res => {
          console.log("deleted", res)
        })
      } else {
        let arr = data
        arr = arr.filter(itm => itm.id != id)
        setData([...arr])
        localStorage.setItem(table, JSON.stringify(arr))
      }
    }
  }

  const copyTask = (item) => {
    edit({
      time: '',
      ...item,
      id: '',
      name: `${item.name} - copy`,
      date: datepipeModel.datetodatetime(new Date()),
      status: 'Done',
      type: 'Give',
      price: ''
    })
    setImage('')
  }

  const addTask = () => {
    document.getElementById('addEditTask').click()
    setForm({
      id: '',
      name: '',
      date: datepipeModel.datetodatetime(new Date()),
      status: 'Done',
      type: 'Give',
      price: '',
      category: '',
    })
    setImage('')
  }

  const addCat = () => {
    document.getElementById('addEditCategory').click()
    setCatForm({
      id: '',
      name: '',
    })
  }

  const editCat = (itm) => {
    // console.log("catform",itm)
    document.getElementById('addEditCategory').click()
    setCatForm({ ...itm })
  }

  const formSubmit = (e) => {
    e.preventDefault()

    let payload = {
      ...form,
      image: image,
      date: new Date(form.date),
      addedBy: user.id
    }

    if (user?.id) {
      setFormLoader(true)
      if (payload.id) {
        payload.updatedAt = new Date()
        firebaseModel.firestore().collection(table).doc(payload.id).update(payload).then(res => {
          setFormLoader(false)
          document.getElementById('addEditTask').click()
          gallaryData()
        })
      } else {
        delete payload.id
        payload.createdAt = new Date()
        firebaseModel.firestore().collection(table).add(payload).then(res => {
          setFormLoader(false)
          document.getElementById('addEditTask').click()
          gallaryData()
        })
      }
    } else {
      payload.date = payload.date.toISOString()
      if (payload.id) {
        payload.updatedAt = new Date().toISOString()

        let arr = data.map((itm, i) => ({ id: itm.id, index: i }))
        let ext = arr.find(itm => itm.id == payload.id)
        if (ext) {
          data[ext.index] = { ...payload }
        }
      } else {
        payload.createdAt = new Date().toISOString()
        payload.id = String(new Date().getTime())
        data.push({ ...payload })
      }

      document.getElementById('addEditTask').click()
      setData([...data])
      localStorage.setItem(table, JSON.stringify(data))
    }


  }

  const catformSubmit = (e) => {
    e.preventDefault()
    console.log("date", catform)
    let table = catTable

    let payload = {
      ...catform,
      addedBy: user.id
    }


    if (user?.id) {
      setFormLoader(true)
      if (payload.id) {
        payload.updatedAt = new Date()
        firebaseModel.firestore().collection(table).doc(payload.id).update(payload).then(res => {
          setFormLoader(false)
          document.getElementById('addEditCategory').click()
        })
      } else {
        delete payload.id
        payload.createdAt = new Date()
        firebaseModel.firestore().collection(table).add(payload).then(res => {
          setFormLoader(false)
          document.getElementById('addEditCategory').click()
        })
      }
    } else {

      if (payload.id) {
        payload.updatedAt = new Date().toISOString()

        let arr = categories.map((itm, i) => ({ id: itm.id, index: i }))
        let ext = arr.find(itm => itm.id == payload.id)
        if (ext) {
          categories[ext.index] = { ...payload }
        }
      } else {
        payload.createdAt = new Date().toISOString()
        payload.id = String(new Date().getTime())
        categories.push({ ...payload })
      }

      document.getElementById('addEditCategory').click()
      setCategories([...categories])
      localStorage.setItem(catTable, JSON.stringify(categories))
    }


  }

  const deleteCat = (id) => {
    if (window.confirm("Do you want to delete this")) {
      if (user?.id) {
        firebaseModel.firestore().collection(catTable).doc(id).delete().then(res => {
          console.log("cat deleted", res)
        })
      } else {
        let arr = categories
        arr = arr.filter(itm => itm.id != id)
        setCategories([...arr])
        localStorage.setItem(catTable, JSON.stringify(arr))
      }
    }
  }


  const statusChange = (e) => {
    setForm({ ...form, status: e })
  }

  const setCurrentTime = (key) => {
    setForm({ ...form, [key]: datepipeModel.datetodatetime(new Date()) })
  }


  const status = [
    { name: 'Pending', id: 'Pending' },
    { name: 'Done', id: 'Done' },
  ]

  const types = [
    { name: 'Give', id: 'Give' },
    { name: 'Got', id: 'Got' },
  ]

  // drag
  const [startIndex, setStartIndex] = useState(-1);
  const [enterIndex, setEnterIndex] = useState(-1);
  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
    setStartIndex(position);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    setEnterIndex(position);
    const copyListItems = [...(filterData || [])];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
  };

  const drop = (e) => {
    setStartIndex(-1);
    setEnterIndex(-1);
    const copyListItems = [...(filterData || [])];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setFilterData([...copyListItems])
  };

  const arraySort = () => {
    return filterData
      .map(payload => {
        payload.order = payload.status == 'Pending' ? 0 : payload.status == 'Done' ? 1 : 2;
        return payload
      })
      .sort((a, b) => {
        return new Date(b.date) - new Date(a.date)
      })
      .sort((a, b) => a.order - b.order)
  }

  const totalPrice = (p='') => {
    let price = 0
    let give = 0
    let got = 0
    arraySort().map(itm => {
      if (itm.type == 'Give') {
        give = give + (Number(itm.price) || 0)
      } else {
        got = got + (Number(itm.price) || 0)
      }
    })

    if (p == 'give') price = give
    if (p == 'got') price = got
    if(!p) price = got - give

    return price
  }

  const back = () => {
    let date = new Date(filters.startDate || new Date())
    let year = date.getFullYear()
    let month = date.getMonth()
    if(!filters.startDate){
      month=month+1
    }

    if (month == 0) {
      year = year - 1
      month = 12
    }

    let endDate = new Date(`${year}-${month}-1`)
    endDate.setMonth(month)
    endDate.setDate(0)
    let startDate = datepipeModel.datetostring(`${year}-${month}-01`)
    endDate = datepipeModel.datetostring(endDate)
    setFilter({ ...filters, startDate: startDate, endDate })
  }

  const next = () => {
    let date = new Date(filters.startDate || new Date())
    let year = date.getFullYear()
    let month = date.getMonth() + 2

    if (month > 12) {
      year = year + 1
      month = 1
    }

    let endDate = new Date(`${year}-${month}-1`)
    endDate.setMonth(month)
    endDate.setDate(0)
    let startDate = datepipeModel.datetostring(`${year}-${month}-01`)
    endDate = datepipeModel.datetostring(endDate)
    setFilter({ ...filters, startDate: startDate, endDate })
  }



  const exportCat = () => {
    let fres = categories.map(itm => {
      return {
        ...itm,
        scrapId: itm.id
      }
    })

    const link = document.createElement("a");
    let jsondata = {
      table: 'expenses-cat',
      data: fres
    }

    const content = JSON.stringify(jsondata);
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    let datetime = new Date().toISOString()
    link.download = `mohitk-art-expenses-cat-${datetime}.backup`;
    link.click();
    URL.revokeObjectURL(link.href);

  }

  const exportData = () => {
    let fres = data.map(itm => {
      return {
        ...itm,
        scrapId: itm.id
      }
    })

    const link = document.createElement("a");
    let jsondata = {
      table: 'expenses',
      data: fres
    }

    const content = JSON.stringify(jsondata);
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    let datetime = new Date().toISOString()
    link.download = `mohitk-art-${table}-${datetime}.backup`;
    link.click();
    URL.revokeObjectURL(link.href);

  }

  const isAll=()=>{
    let arr=category
    let ext=categories.find(itm=>!arr.includes(itm.id))
    return ext?false:true
  }

  const allChange=(check)=>{
    if(check){
      setCategory([...categories.map(itm=>itm.id)])
    }else{
      setCategory([])
    }
  }

  return (<>
    <Layout>
      <Banner image="/img/blogs-banner.jpg" title="Expenses" />

      <div className="container py-3">
        <div className="row">
          <div className="col-md-9 order-2 order-sm-0">
            <div className="form-row">


              {loader && loadArry.map((item, i) => {
                return (
                  <div className="col-md-4 mb-3" key={i}>
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


              {!loader && arraySort()?.map((item, i) => {
                return (
                  <div
                    className={`col-md-4 mb-3 DragDrop ${startIndex == i ? "dragStart"
                      : ""
                      } ${enterIndex == i ? "dragEnter"
                        : ""
                      }`}
                    key={item.id}
                    onDragStart={(e) => dragStart(e, i, item)}
                    onDragEnter={(e) => dragEnter(e, i)}
                    onDragEnd={(e) => drop(e)}
                    draggable={true}

                  >
                    <div className={`px-3 py-2 shadow ${item.type == 'Give' ? 'alert-danger' : 'alert-success'}`}>
              
              <div className="date" onClick={e => edit(item)}>
                <i className="fa fa-calendar mr-2" />
                {/* {item.date} */}
                {datepipeModel.datetime(item.date)}
              </div>
              <div className="date" onClick={e => edit(item)}>
                <i className="fa fa-folder mr-2" />
                {/* {item.date} */}
                {categories.length > 0 && item.category ? (
              <>
                {categories &&
                  categories.map(citem => {
                    if (citem.id === item.category) {
                      return citem.name || 'No Category';
                    }
                  })}
              </>
            ) : (
              <></>
            )}
              </div>

              <a className="font-weight-bold h6" onClick={e => edit(item)}>
                {item.name}
              </a>
              <p onClick={e => edit(item)} className='mb-2 d-flex'>
                <span >{item.status}</span>
                <span className={`ml-auto font-weight-bold ${item.type == 'Give' ? 'text-danger' : 'text-success'}`}>{item.type == 'Give' ? '-' : ''}{pipeModel.currency(item.price)}</span>
              </p>
              <p className='text-right mb-0'>
                <i className='fa fa-trash pointer mr-2' onClick={() => deleteTask(item.id)}></i>
                <i className='fa fa-copy pointer' onClick={() => copyTask(item)}></i>
                <i class="fa fa-arrows ml-2"></i>

              </p>
            </div>
                  </div>
                );
              })}

              {!loader && !filterData.length ? <h3>Data Not Found</h3> : <></>}
            </div>

          </div>

          <div className="col-md-3">
            <div className="sticky-sidebar">
              <button className='btn btn-primary mb-3 mr-2' onClick={addTask}>Add Expense</button>
              <button className='btn btn-primary mb-3' onClick={exportData}>Export Expenses</button>
              <button className='btn btn-primary mb-3' onClick={exportCat}>Export Categories</button>
              {category.length || filters.status || search ? <>
                <button className='btn btn-primary mb-3 ml-2' onClick={clear}>Clear</button>
              </> : <></>}
              <div className="mb-3 font-weight-medium d-flex">
                <span>Total Expenses : {total}</span>
                <span className='ml-auto'>Total Balance : <span className={`${totalPrice() > 0 ? 'text-success' : 'text-danger'}`}>{pipeModel.currency(totalPrice())}</span></span>
              </div>

              <div className="mb-3 font-weight-medium d-flex">
                <span>Total Give : <span className={`text-danger`}>{pipeModel.currency(totalPrice('give'))}</span></span>
                <span className='ml-auto'>Total Got : <span className={`text-success`}>{pipeModel.currency(totalPrice('got'))}</span></span>
              </div>

              <div className="mb-3 searchForm">
                <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="form-control" />
                {search ? <i className="fa fa-times" onClick={() => clear()}></i> : <></>}
              </div>

              <label>Start Date - End Date</label>
              <div className='d-flex align-items-center mb-3'>
                <i className='fa fa-arrow-left pointer' onClick={back}></i>
                <input type="date" value={filters.startDate} onChange={e => setFilter({ ...filters, startDate: e.target.value, endDate: e.target.value })} className="form-control w-50" />
                {/* <i className='mx-2'>-</i> */}
                <input type="date" min={filters.startDate || ''} value={filters.endDate} onChange={e => setFilter({ ...filters, endDate: e.target.value })} className="form-control w-50" />
                <i className='fa fa-arrow-right pointer' onClick={next}></i>
              </div>

              <select className='form-control mb-3' value={filters.status}
                onChange={e => {
                  setFilter({ ...filters, status: e.target.value })
                }}>
                <option value="">All Status</option>
                {status.map(itm => {
                  return <option value={itm.id} key={itm.id}>{itm.name}</option>
                })}
              </select>


              <h4 className="mb-3 d-flex">Category
                <i className='fa fa-plus pointer ml-auto' onClick={addCat}></i>
              </h4>
              <div className="category-ul mb-3">
                <label>
                  <input
                    type="checkbox"
                    name="category"
                    id="allCat"
                    onChange={e=>allChange(e.target.checked)}
                    checked={isAll()}
                  />
                  All
                </label>
                {categories &&
                  categories.map(item => {
                    return (
                      <div className='d-flex' key={item.id}>
                        <label key={item.id}>
                          <input
                            type="checkbox"
                            name="category"
                            className='mr-2'
                            onChange={e => filter(e.target.value)}
                            value={item.id}
                            checked={category.includes(item.id) ? true : false}
                          />
                          {item.name}
                        </label>

                        <i className='fa fa-pencil pointer ml-auto' onClick={() => editCat(item)}></i>
                        <i className='fa fa-trash pointer ml-2' onClick={() => deleteCat(item.id)}></i>

                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>



    <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#addEditTaskModal" id="addEditTask"></button>
    <div className="modal fade taskModal" id="addEditTaskModal" tabIndex="-1" role="dialog" aria-labelledby="addEditTaskModal" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{form.id ? 'Edit' : 'Add'} Expense</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={formSubmit}>
            <div className="modal-body">
              <div className='form-row'>
                <div className='col-md-12 mb-3'>
                  <label>Detail</label>
                  <textarea className='form-control' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}></textarea>
                </div>


                <div className='col-md-6 mb-3'>
                  <label>Type</label>
                  <select className='form-control' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                    <option value="" disabled>Select</option>
                    {types.map(itm => {
                      return <option value={itm.id} key={itm.id}>{itm.name}</option>
                    })}
                  </select>
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Price</label>
                  <input type='number' className='form-control' maxLength="12" value={form.price} onChange={e => setForm({ ...form, price: methodModel.isNumber(e) })} required />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Category</label>
                  <FormControl
                  type='select'
                  theme='search'
                  value={form.category}
                  options={categories}
                  required
                  onChange={e=>{
                    setForm({...form,category:e})
                  }}
                  />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Status</label>
                  <FormControl
                  type='select'
                  theme='search'
                  value={form.status}
                  options={status}
                  required
                  onChange={e=>{
                    setForm({...form,status:e})
                  }}
                  />
                </div>
                <div className='col-md-6 mb-3'>
                  <label>Date <a onClick={() => setCurrentTime('date')} className='text-primary ml-2'>Set Current Time</a></label>
                  <input type='datetime-local' className='form-control' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                </div>
                {user?.id ? <>
                  <div className='col-md-12 mb-3'>
                    <label>Image</label>
                    <div>
                      <UploadImage
                        value={image}
                        modal={imageModal}
                        result={e => setImage(e)}
                      />
                    </div>
                  </div>
                </> : <></>}

              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" disabled={formLoader}>Save {formLoader ? <><i className='fa fa-spinner fa-spin'></i></> : <></>}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <button type="button" className="btn btn-primary d-none" data-toggle="modal" data-target="#addEditCategoryModal" id="addEditCategory"></button>
    <div className="modal fade" id="addEditCategoryModal" tabIndex="-1" role="dialog" aria-labelledby="addEditCategoryModal" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{catform.id ? 'Edit' : 'Add'} Category</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form onSubmit={catformSubmit}>
            <div className="modal-body">
              <div className='form-row'>
                <div className='col-md-12 mb-3'>
                  <label>Name</label>
                  <input type='text' className='form-control' value={catform.name} onChange={e => setCatForm({ ...catform, name: e.target.value })} required />
                </div>

              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" disabled={formLoader}>Save {formLoader ? <><i className='fa fa-spinner fa-spin'></i></> : <></>}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </>);

}

export default Expenses;
