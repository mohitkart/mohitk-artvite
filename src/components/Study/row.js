import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudyRow = ({ title, html, css, scss, category, js, id }) => {
  const [Html, setHTML] = useState('');
  const [Css, setCSS] = useState('');
  const [Sass, setSass] = useState('');
  const [javas, setJs] = useState('');
  const [htmlorcss, setHtmlorCss] = useState('html');
  const [bigorsmall, setBigorsmall] = useState(false);

  const undomethod = () => {
    setCSS(css);
    setHTML(html);
    setSass(scss);
    setJs(js);
  };

  useEffect(() => {
    undomethod();
  }, []);

  const togglebig = () => {
    setBigorsmall(!bigorsmall);
  };

  return (
    <>
      <div className={bigorsmall ? 'col-md-12 mb-3' : 'col-md-6 mb-3'}>
        <h5 className="text-center mb-2">
          <Link to={`/study/${id}`}>{title}</Link>
        </h5>

        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <span>
              {category ? (
                <>
                  <i className="fa fa-folder mr-2" /> {category}
                </>
              ) : (
                  <></>
                )}
            </span>

            <div style={{ fontSize: '18px' }}>
              <Link title="view" to={`/study/${id}`} className="fa fa-file-code text-dark mr-3"></Link>
              <i
                title="Size"
                className="fas fa-sync-alt cursor-pointer"
                onClick={() => togglebig()}
              />
            </div>

          </div>
          <div className="card-body p-0">
            <iframe
              url={`/studyview/${id}`}
              width="100%"
              height="300px"
              id="myId"
              className="myClassname"
              display="block"
              position="relative"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </>
  );
};

export default StudyRow;
