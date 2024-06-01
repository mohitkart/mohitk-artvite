import { toast } from 'react-toastify';
const ToastsStore=toast

const getAllDataMethod = ({
  setIsempty,
  setData,
  setCategory,
  setWriter,
  setLoader,
  setTotal,
  url
}) => {
  setLoader(true);
  // Left Image section
  fetch(url)
    .then(results => {
      if (results.status === 400) {
        if (setIsempty) {
          setIsempty(true);
        }
        setData();
        ToastsStore.error('Data Not Found');
        setLoader(false);
      } else if (results.status === 500) {
        if (setIsempty) {
          setIsempty(true);
        }
        setData();
        ToastsStore.error('Error');
        return false;
      } else if (results.status === 200) {
        ToastsStore.success('Data Suceess');
        return results.json();
      } else {
        setLoader(false);
        ToastsStore.error('Data Error');
      }
    })
    .then(data => {
      if (!data) {
        if (setIsempty) {
          setIsempty(true);
        }
        setLoader(false);
      } else {
        if (setData) {
          setData(data.data);
        }

        if (setTotal) {
          setTotal(data.total)
        }

        if (setCategory) {
          setCategory(data && data.category);
        }

        if (setWriter) {
          setWriter(data && data.writer);
        }

        if (setIsempty) {
          setIsempty(false);
        }
        setLoader(false);
      }
    },
      error => {
        setLoader(false);
        ToastsStore.error('Server Error');
        // console.log("response error", error);
      });
};

export default getAllDataMethod;
