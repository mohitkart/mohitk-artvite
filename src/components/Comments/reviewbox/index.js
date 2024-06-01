import React from 'react';

const ReviewBox = ({ name, email, rating, message, date, time }) => {
  return (
    <>
      <div className="media comment-media shadow p-3 bg-white mb-3">
        <img className="mr-3" src="/img/unnamed.jpg" alt="user" />
        <div className="media-body">
          <h5 className="mt-0 mb-2">
            {name}

            <span className="rating-stars ml-2">
              {rating < 1 ? (
                <i className="far fa-star" />
              ) : (
                <i className="fa fa-star" />
              )}
              {rating < 2 ? (
                <i className="far fa-star" />
              ) : (
                <i className="fa fa-star" />
              )}
              {rating < 3 ? (
                <i className="far fa-star" />
              ) : (
                <i className="fa fa-star" />
              )}
              {rating < 4 ? (
                <i className="far fa-star" />
              ) : (
                <i className="fa fa-star" />
              )}
              {rating < 5 ? (
                <i className="far fa-star" />
              ) : (
                <i className="fa fa-star" />
              )}
            </span>
          </h5>
          {date ? <div className="mb-2">{`${date}, ${time}`}</div> : <></>}
          <div className="mb-1">
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          {message}
        </div>
      </div>
    </>
  );
};

export default ReviewBox;
