import React, { useEffect, useRef, useState } from "react";
import ApiClient from "../../../methods/api/apiClient";
import Html from "./html";
import './style.scss';
import loader from "../../../methods/loader";

const ImageUpload = ({ model, result, value, multiple ,required,err,label=''}) => {
    const inputElement = useRef();
    const [img, setImg] = useState('')
    const [loading, setLoader] = useState(false)
    const uploadImage = async (e) => {
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        let images = []
        if (img) images = img
        setLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            console.log("i", i)
            console.log("file", file)
            const res = await ApiClient.multiImageUpload('upload/image',files)
            if (res.fileName) {
                let image = res.fileName
                if (!multiple) {
                    setImg(image)
                    result({ event: 'value', value: image })
                } else {
                    images.push(image)
                }
            }
            i++
        }
        setLoader(false)
        if(multiple){
            setImg(images) 
            result({ event: 'value', value: images })
        }
    }

    const remove = (index) => {
        if (multiple) {
            let images = img.filter((itm, idx) => idx !== index);
            result({ event: "remove", value: images });
            setImg(images);
          } else {
            result({ event: "remove", value: "" });
            setImg("");
          }
    }

    useEffect(() => {
        setImg(value)
    }, [value])

    return <><Html
    label={label}
        multiple={multiple}
        inputElement={inputElement}
        uploadImage={uploadImage}
        img={img}
        model={model}
        required={required}
        loader={loading}
        err={err}
        remove={remove}
    /></>
}
export default ImageUpload