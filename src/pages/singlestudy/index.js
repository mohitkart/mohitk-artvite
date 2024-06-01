import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import loader from '../../components/Methods/loader';
import firebaseModel from '../../firebase/firebase';
import methodModel from '../../model/method.model';
import FormControl from '../../components/common/FormControl';

const SingleStudy = p => {
  const table = 'html'
  const [Html, setHTML] = useState('');
  const [Css, setCSS] = useState('');
  const [Sass, setSass] = useState('');
  const [javas, setJs] = useState('');
  const [Html1, setHTML1] = useState('');
  const [Css1, setCSS1] = useState('');
  const [Sass1, setSass1] = useState('');
  const [javas1, setJs1] = useState('');

  const [htmlorcss, setHtmlorCss] = useState('html');
  const [bigorsmall, setBigorsmall] = useState(false);
  const [category, setCategory] = useState();
  const [data, setData] = useState();
  const { id } = useParams();

  const undomethod = () => {
    window.location.reload(false);
  };

  const applymethod = () => {
    setCSS(Css1);
    setHTML(Html1);
    setSass(Sass1);
    setJs(javas1);
  };

  const getCategory = (id) => {
    firebaseModel.firestore().collection('categories').doc(id).onSnapshot((snapshot) => {
      let data1 = snapshot.data()
      setCategory(data1)
    })
  };

  useEffect(() => {
    loader(true)
    window.scroll(0, 0);
    firebaseModel.firestore().collection(table).doc(id).onSnapshot((snapshot) => {
      let data1 = snapshot.data()
      loader(false)
      setData(data1);
      getCategory(data1 && data1.category);
      setCSS(data1 && data1.css);
      setHTML(data1 && data1.html);
      setSass(data1 && data1.scss);
      setJs(data1 && data1.js);
      setCSS1(data1 && data1.css);
      setHTML1(data1 && data1.html);
      setSass1(data1 && data1.scss);
      setJs1(data1 && data1.js);
      methodModel.metaTitleUpdate({ title: `Mohitk-art | ${data1.title}`, keywords: data1.title })
    });
  }, []);

  const togglebig = () => {
    setBigorsmall(!bigorsmall);
  };

  return (
    <>
      <div className="container mb-2" data-aos="flip-up">
        <Link
          className="h3 d-block text-center mb-3 mt-3"
          to={`/studyview/${id}`}
        >
          {data && data.title}
        </Link>

        {category ? (
          <div className="text-center mb-3">
            <i className="fa fa-folder mr-2" /> {category.name}
          </div>
        ) : (
          <></>
        )}

        <div className="row">
          <div className={bigorsmall ? 'col-md-12 mb-3' : 'col-md-6'}>
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <span> View</span>

                <div>
                  <Link className="fas fa-home cursor-pointer mr-3" to="/"></Link>
                  <a onClick={() => togglebig()}>
                    <i className="fas fa-sync-alt" />
                  </a>

                </div>
              </div>
              <div className="card-body p-0">
                <div className="html-space">
                  <style>{Css}</style>
                  <div dangerouslySetInnerHTML={{__html: Html}}></div>
                  <script>{javas}</script>
                </div>
              </div>
            </div>
          </div>

          <div className={bigorsmall ? 'col-md-12' : 'col-md-6'}>
            <div className="card">
              <ul className="nav nav-tabs bg-light">
                <li className="nav-item">
                  <span
                    className={
                      htmlorcss === 'html' ? 'nav-link active' : 'nav-link'
                    }
                    onClick={() => setHtmlorCss('html')}
                  >
                    Html
                  </span>
                </li>

                {
                  data && data.css ? <li className="nav-item">
                    <span
                      className={
                        htmlorcss === 'css' ? 'nav-link active' : 'nav-link'
                      }
                      onClick={() => setHtmlorCss('css')}
                    >
                      Css
                    </span>
                  </li> : <></>
                }


                {
                  data && data.scss ? <li className="nav-item">
                    <a
                      className={
                        htmlorcss === 'sass' ? 'nav-link active' : 'nav-link'
                      }
                      onClick={() => setHtmlorCss('sass')}
                    >
                      Scss
                    </a>
                  </li> : <></>
                }

                {data && data.js ? <li className="nav-item">
                  <a
                    className={
                      htmlorcss === 'js' ? 'nav-link active' : 'nav-link'
                    }
                    onClick={() => setHtmlorCss('js')}
                  >
                    Js
                  </a>
                </li> : <></>}





                <li className="nav-item ml-auto">
                  <a
                    onClick={() => applymethod()}
                    className="nav-link bg-primary text-white"
                  >
                    Apply
                  </a>
                </li>

                <li className="nav-item">
                  <a onClick={() => undomethod()} className="nav-link">
                    <i className="fas fa-undo-alt" />
                  </a>
                </li>
              </ul>
              <div className="card-body p-0">
                {htmlorcss === 'html' ? (
                  <>
                  <FormControl
                  type='code'
                  value={Html}
                  onChange={e=>{
                    setHTML1(e);
                  }}
                  />
                  </>
                ) : (
                  <></>
                )}
                {htmlorcss === 'css' ? (
                   <FormControl
                   type='code'
                   value={Css}
                   onChange={e=>{
                    setCSS1(e);
                   }}
                   />
                ) : (
                  <></>
                )}
                {htmlorcss === 'sass' ? (
                   <FormControl
                   type='code'
                   value={Sass}
                   onChange={e=>{
                    setSass1(e);
                   }}
                   />
                ) : (
                  <></>
                )}
                {htmlorcss === 'js' ? (
                   <FormControl
                   type='code'
                   value={javas}
                   onChange={e=>{
                    setJs1(e);
                   }}
                   />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleStudy;
