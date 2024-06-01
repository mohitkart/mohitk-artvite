import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Banner from '../../components/Banner';
import ReviewBox from '../../components/Comments/reviewbox';
import Layout from '../../components/global/Layout';
import DateTime from '../../components/Methods/DateTime';
import loader from '../../components/Methods/loader';
import datepipeModel from '../../model/datepipemodel';
import firebaseModel from '../../firebase/firebase';
import methodModel from '../../model/method.model';
import { toast } from 'react-toastify';
const ToastsStore=toast

const SingleBlog = () => {
  const table = 'blogs'
  const [data, setData] = useState();
  const [commentsdata, setCommentsData] = useState();
  const { id } = useParams();
  const [category, setCategory] = useState();

  // Comment Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);

  const resetMethod = () => {
    setName('');
    setEmail('');
    setMessage('');
    setRating(0);
  };

  const allComment = () => {
    firebaseModel.firestore().collection('Comments').onSnapshot((snapshot) => {
      let rdata = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
      }))
      setCommentsData(rdata)
    });
  };

  const getCategory = (catid) => {
    firebaseModel.firestore().collection('categories').doc(catid).onSnapshot((snapshot) => {
      let data1 = snapshot.data()
      setCategory(data1);
    });
  };


  const commentsubmit = e => {
    e.preventDefault();
    const adata = {
      name,
      email,
      blogid: id,
      rating,
      message,
      date: DateTime.date,
      time: DateTime.time
    };
    loader(true)
    firebaseModel.firestore().collection('Comments').add(adata).then(res => {
      console.log("add res", res)
      ToastsStore.success('Message Send Successfully');
      resetMethod();
      loader(false)
    })
    // ApiClient.post(url, adata).then(res => {
    //   if (res.status === 200) {
    //     allComment();
    //   }
    // })
  };

  useEffect(() => {
    window.scroll(0, 0);
    loader(true)
    firebaseModel.firestore().collection(table).doc(id).onSnapshot((snapshot) => {
      let data1 = snapshot.data()
      loader(false)
      setData(data1);
      methodModel.metaTitleUpdate({ title: `Mohitk-art | ${data1.title}`, keywords: data1.title })
      getCategory(data1.category);
    });

    allComment();
  }, []);

  return (
    <>
      <Layout>
        <Banner
          image={data && data.image}
          title={data && data.title}
          writer={data && data.writer?.name}
          date={datepipeModel.datetime(data && data.date)}
          category={category}
        />
        <div className="py-3 container">
          <h2 className="mb-3">{data && data.title}</h2>

          <div className="contant">
          <div dangerouslySetInnerHTML={{__html: data && data.description}}></div>
          </div>

          <div className="comment p-3 bg-light">
            <h3 className="mb-3">Comment</h3>

            <form className="form-row" onSubmit={commentsubmit}>
              <div className="col-md-12 mb-3">
                <label>Rating</label>
                <br />

                <div className="rate-div mb-0 clearfix">
                  <input
                    type="radio"
                    id="5-star"
                    name="crating"
                    value="5"
                    onChange={e => setRating(e.target.value)}
                  />
                  <label htmlFor="5-star" title="Amazing">
                    5 stars
                  </label>
                  <input
                    type="radio"
                    id="4-star"
                    name="crating"
                    value="4"
                    onChange={e => setRating(e.target.value)}
                  />
                  <label htmlFor="4-star" title="Good">
                    4 stars
                  </label>
                  <input
                    type="radio"
                    id="3-star"
                    name="crating"
                    value="3"
                    onChange={e => setRating(e.target.value)}
                  />
                  <label htmlFor="3-star" title="Average">
                    3 stars
                  </label>
                  <input
                    type="radio"
                    id="2-star"
                    name="crating"
                    value="2"
                    onChange={e => setRating(e.target.value)}
                  />
                  <label htmlFor="2-star" title="Not Good">
                    2 stars
                  </label>
                  <input
                    type="radio"
                    id="1-star"
                    name="crating"
                    value="1"
                    onChange={e => setRating(e.target.value)}
                    aria-required="true"
                    required=""
                  />
                  <label htmlFor="1-star" title="Bad">
                    1 star
                  </label>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <textarea
                  className="form-control"
                  placeholder="Message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-12 mb-3 text-right">
                <input type="submit" className="btn btn-primary" />
              </div>
            </form>

            <div>
              {commentsdata &&
                commentsdata.map(item => {
                  if (item.data.blogid == id)
                    return (
                      <ReviewBox
                        key={item.id}
                        name={item.data.name}
                        email={item.data.email}
                        message={item.data.message}
                        rating={item.data.rating}
                        date={item.data.date}
                        time={item.data.time}
                      />
                    );
                })}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SingleBlog;
