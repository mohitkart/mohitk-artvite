import firebaseModel from "../../firebase/firebase";
import crendentialModel from "../../model/credentials";
import "./style.scss";
import React, { useEffect, useRef, useState } from "react";
import envirenment from "../../envirenment";
import datepipeModel from "../../model/datepipemodel";
import methodModel from "../../model/method.model";
import { Link } from "react-router-dom";
import imageModel from "../../model/image.model";
import { toast } from "react-toastify";
const ToastsStore=toast
export default function Chat() {
    const user = crendentialModel.getUser()
    const table = 'chat'
    const [loading, setLoader] = useState(false)
    const [data1, setData1] = useState([])
    const [data2, setData2] = useState([])
    const [data, setData] = useState([])
    const sender = methodModel.getPrams('sendTo') || envirenment.adminId
    const [sendTo, setSendTo] = useState()
    const [userId, setUserId] = useState(methodModel.getPrams('userId')|| user?.id||'')
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')


    const [uploading, setUploading] = useState(false)
    const modal = `chat_${user?.id}`
    const storage = firebaseModel.storage()

    const getMessages = async (sender,u=userId) => {
        console.log("sender",sender)
        console.log("u",u)
        setLoader(true)
        let groupId = `${sender}-${u}`
        let groupId2 = `${u}-${sender}`
        const messagesRef = firebaseModel.firestore().collection(table)
        var query1 = messagesRef
            .where('groupId', 'in', [groupId, groupId2])
        query1.onSnapshot(snapshot => {
            let rdata = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            }))
            setData1(rdata)
            setLoader(false)
        }, err => {
            setLoader(false)
        })

    }


    const userClick = (sender) => {
        getMessages(sender.id)
        setSendTo(sender)
    }

    useEffect(() => {
        if (userId) {
            if(methodModel.getPrams('userId')){
                firebaseModel.firestore().collection('users').where('userId','==',methodModel.getPrams('userId')).get().then(res=>{
                    let fres = res.docs.map(itm => {
                        return { ...itm.data(), id: itm.id }
                      })

                      if(fres.length){
                        let id=fres[0].id
                        setUserId(id)
                        getMessages(sender,id)
                      }else{
                        let payload={
                            name:'',
                            date:new Date().toISOString(),
                            userId:methodModel.getPrams('userId'),
                            ip:methodModel.getPrams('ip'),
                            location:methodModel.getPrams('location'),
                        }
                        firebaseModel.firestore().collection('users').add(payload).then(res=>{
                            setUserId(res.id)
                            getMessages(sender,res.id)
                        }).catch(err=>{
                            console.error("err",err)
                        })
                      }
                })
            }else{
            getMessages(sender)
            }
            firebaseModel.firestore().collection('users').doc(sender).onSnapshot(res => {
                let detail = res.data()
                setSendTo(detail)
            })
            if (user?.role == envirenment.adminRoleId) {
                firebaseModel.firestore().collection('users').onSnapshot(snapshot => {
                    let rdata = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id
                    }))
                    setUsers(rdata)
                })
            }
        }
    }, [])

    useEffect(() => {
        let arr = [...data1, ...data2].sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
        })
        setData(arr)
        console.log("arr", arr)
        scrollMe()
    }, [data1, data2])

    const scrollMe = () => {
        let el = document.getElementById("scrollMe")
        if (el) {
            setTimeout(() => {
                el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
            }, 100);
        }
    }

    const sendMessage = (p = {}) => {
        let date = new Date().toISOString()
        if (message || p.text) {
            let sender = sendTo.id
            let payload = {
                sendBy: userId,
                sendTo: sender,
                members: [sender, userId],
                groupId: `${sender}-${userId}`,
                date: date,
                text: message,
                ...p
            }
            const messagesRef = firebaseModel.firestore().collection(table)
            messagesRef.add(payload).then(res => {
                // scrollMe()

            })
            setMessage('')
            console.log("payload", payload)
        }
    }

    const deleteMessage = (id,name='') => {
        if (window.confirm("Do you want to delete")) {
            firebaseModel.firestore().collection(table).doc(id).delete().then(res => { })
            if(name) removeImage(name)
        }
    }

    const removeImage=(name)=>{
        let path=`assets/${modal}`
        const desertRef = storage.ref(path).child(name);
        // Delete the file
        desertRef
            .delete()
            .then(function (res) {
                console.log("delete",res)
            })
            .catch(function (error) {
                console.log("error",error)
            });
    }

    const inputElement = useRef()
    const uploadImage = (e) => {
        let files = e.target.files
        let imageAsFile = files.item(0)
        console.log("imageAsFile", imageAsFile)
        const date = new Date();
        let name = date.getTime() + imageAsFile.name
        let path = `assets/${modal}`
        setUploading(true)
     
        const uploadTask = storage
            .ref(`/${path}/${name}`)
            .put(imageAsFile);
        // initiates the firebase side uploading
        uploadTask.on(
            'state_changed',
            snapShot => {
                inputElement.current.value = ''
                // takes a snap shot of the process as it is happening
                console.log('Snapshort : ', snapShot);
                ToastsStore.success('Snapshort');
            },
            err => {
                // catches the errors
                console.log('err : ', err);
                ToastsStore.error("Error");
                inputElement.current.value = ''
            },
            () => {
                // gets the functions from storage refences the image storage in firebase by the children
                // gets the download url then sets the image from firebase as the value for the imgUrl key:
                let data = {
                    url: imageModel.getImage(modal, name),
                    name: name,
                    modal: modal
                }
                sendMessage({text:name,image:data})
                setUploading(false);

            }
        );
    }

    return <>
        <div className="root">
            {users.length?<>
                <div className="usersSidebar">
                {users.map(itm => {
                    return <div className={`pointer p-2 ${sendTo.id == itm.id ? 'text-primary' : ''}`} onClick={e => userClick(itm)}>{itm.name||'Visitor'}</div>
                })}
            </div>
            </>:<></>}
            
            <section className={`msger ${methodModel.getPrams('userId')?'msger-full':''}`}>
                <header className="msger-header">
                    <div className="msger-header-title">
                        {!methodModel.getPrams('userId')?<>
                        <Link to="/"><i className="fas fa-arrow-left"></i></Link> 
                        </>:<></>}
                        {sendTo?.name}
                    </div>
                    <div className="msger-header-options">
                        <span><i className="fas fa-cog"></i></span>
                    </div>
                </header>

                <main className="msger-chat" id="scrollMe">

                    {!loading && data.map(itm => {
                        return <>
                            {itm.sendBy == userId ? <>
                                <div className="msg right-msg" key={itm.id}>
                                    <div
                                        className="msg-img"
                                        style={{ backgroundImage: `url(https://image.flaticon.com/icons/svg/145/145867.svg)` }}
                                    ></div>

                                    <div className="msg-bubble">
                                        <div className="msg-info">
                                            <div className="msg-info-name">{user?.name||'Visitor'}</div>
                                            <div className="msg-info-time">{datepipeModel.datetime(itm.date)}</div>
                                        </div>

                                        <div className="msg-text">
                                            {itm.text}
                                            {itm.image?<>
                                            <a href={itm.image.url} target="_blank"><img src={itm.image.url} className="msgImg" /></a>
                                            
                                            </>:<></>}
                                            <div className="text-right mt-2">
                                                <i className="fa fa-trash" onClick={e => deleteMessage(itm.id,itm?.image?.name)}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </> : <>

                                <div className="msg left-msg" key={itm.id}>
                                    <div
                                        className="msg-img"
                                        style={{ backgroundImage: 'url(https://image.flaticon.com/icons/svg/145/145867.svg)' }}

                                    ></div>

                                    <div className="msg-bubble">
                                        <div className="msg-info">
                                            <div className="msg-info-name">{sendTo?.name}</div>
                                            <div className="msg-info-time">{datepipeModel.datetime(itm.date)}</div>
                                        </div>

                                        <div className="msg-text">
                                            {itm.text}
                                            {itm.image?<>
                                                <a href={itm.image.url} target="_blank"><img src={itm.image.url} className="msgImg" /></a>
                                            </>:<></>}
                                        </div>
                                    </div>
                                </div>
                            </>}
                        </>
                    })}

                    {loading ? <>
                        <div className="py-4">loading... <i className="fa fa-spinner fa-spin"></i></div>
                    </> : <></>}

                </main>

                <form className="msger-inputarea" onSubmit={e => { e.preventDefault(); sendMessage() }}>
                    <input
                        type="text"
                        className="msger-input"
                        placeholder="Enter your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <label className={`m-0 p-0`}>
                        <input type="file" className="d-none" ref={inputElement} accept="image/*" multiple={false} disabled={uploading} onChange={(e) => { uploadImage(e); }} />

                        {uploading ? <>
                            <i className="fa fa-spin fa-spinner"></i>
                        </> : <>
                            <i className="fa fa-image"></i>
                        </>}
                    </label>
                    <button type="submit" className="msger-send-btn">Send</button>
                </form>
            </section>
        </div>
    </>
}