import React from 'react';

const Banner = p => {
  return (
    <div
      className="banner-top bg-cover bg-overlay bg-fixed"
      style={{ backgroundImage: `url(${p.image})` }}
    >
      <div className="container py-5 text-white">
        <h2 className="blogs mb-0 text-center">{p.title}</h2>
        <div className={p.writer ? 'text-center mt-3' : 'text-center'}>
          {p.writer ? (
            <>
              <i className="fa fa-user mr-2" /> {p.writer}
            </>
          ) : (
              <></>
            )}
          {p.date ? (
            <>
              <i className="fa fa-calendar ml-3 mr-2" /> {p.date}
            </>
          ) : (
              <></>
            )}
          {p.category ? (
            <>
              <i className="fa fa-folder ml-3 mr-2" /> {p.category.name}
            </>
          ) : (
              <></>
            )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
