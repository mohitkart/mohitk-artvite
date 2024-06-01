const getImage=(model,name)=>{
    return `https://firebasestorage.googleapis.com/v0/b/mohitk-web.appspot.com/o/assets%2F${model}%2F${name}?alt=media`
}
const imageModel={getImage}
export default imageModel;
