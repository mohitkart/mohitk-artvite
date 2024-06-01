import React, { useEffect, useRef } from "react";

import firebaseModel from "../../firebase/firebase";
import { useState } from "react";
import "./style.scss";
import imageModel from "../../model/image.model";
import loader from "../../components/Methods/loader";
import { toast } from "react-toastify";
const ToastsStore=toast
export default ({ multiple = false, modal = 'default', label = 'Upload', value = '', result = () => { } }) => {
    const [image, setImage] = useState()
    const [loading, setLoader] = useState(false)
    const storage = firebaseModel.storage()
    const inputElement = useRef()
    const uploadImage = (e) => {
        let files = e.target.files
        let imageAsFile = files.item(0)
        console.log("imageAsFile", imageAsFile)
        const date = new Date();
        let name = date.getTime() + imageAsFile.name
        name = name.replaceAll(' ', '_')
        let path = `assets/${modal}`
        setLoader(true)
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
                setImage(data)
                result(data)
                setLoader(false);
                ToastsStore.success("Image Uploaded Successfully");

            }
        );
    }

    const remove = () => {
        let path = `assets/${modal}`
        let name = image.name
        const desertRef = storage.ref(path).child(name);

        loader(true)
        // Delete the file
        desertRef
            .delete()
            .then(function () {
                setImage('')
                result('')
                ToastsStore.success('Delete Successfully');
                loader(false)
            })
            .catch(function (error) {
                loader(false)
                setImage('')
                result('')
                ToastsStore.error('Deleting image an Error Ocurr');
            });
    }

    useEffect(() => {
        setImage(value)
    }, [value])

    return <>
        <label className={`btn btn-primary ${image && !multiple ? 'd-none' : ''}`}>
            <input type="file" className="d-none" ref={inputElement} accept="image/*" multiple={multiple ? true : false} disabled={loading} onChange={(e) => { uploadImage(e); }} />
            {label || 'Upload Image'}
        </label>
        {loading ? <div className="text-success">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}
        {multiple ? <>
            <div className="imagesRow">
                {image && image.map((itm, i) => {
                    return <div className="imagethumbWrapper">
                        <img src={itm?.url} className="thumbnail" />
                        <i className="fa fa-times" title="Remove" onClick={e => remove(i)}></i>
                    </div>
                })}
            </div>
        </> : <>
            {image ? <div className="imagethumbWrapper">
                <img src={image?.url} className="thumbnail" />
                <i className="fa fa-times" title="Remove" onClick={e => remove()}></i>
                <a href={image?.url} className="d-block" target="_blank">View and download</a>
            </div> : <></>}
        </>}
    </>
}