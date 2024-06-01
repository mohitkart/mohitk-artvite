import React from 'react';
import { BrowserRouter, Route,Routes,Navigate } from 'react-router-dom';
import './scss/style.scss';
import Loader from './components/Loader';
import ApiClientPage from './pages/ApiClientPage';
import Tasks from './pages/tasks';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import Chat from './pages/Chat';
import Dashboard from './pages/dashboard';
import Expenses from './pages/expenses';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Study = React.lazy(() => import('./pages/study'));
const Code = React.lazy(() => import('./pages/code'));
const Dictionary = React.lazy(() => import('./pages/dictionary'));
const Blogs = React.lazy(() => import('./pages/blogs'));
const SingleBlog = React.lazy(() => import('./pages/singleblog'));
const SingleStudy = React.lazy(() => import('./pages/singlestudy'));
const Login = React.lazy(() => import('./pages/Login'));
const SingleStudyView = React.lazy(() => import('./pages/singlestudyview'));
const HapiniCreds = React.lazy(() => import('./pages/HapiniCreds'));


const loading = () => <Loader />;


const routes=[
  {url:'/study',element:<Study />},
  {url:'/dashboard',element:<Dashboard />},
  {url:'/chat',element:<Chat />},
  {url:'/login',element:<Login />},
  {url:'/signup',element:<Signup />},
  {url:'/verify',element:<Verify />},
  {url:'/forgot',element:<Forgot />},
  {url:'/reset',element:<Reset />},
  {url:'/code',element:<Code />},
  {url:'/apiclient',element:<ApiClientPage />},
  {url:'/hapinicreds',element:<HapiniCreds />},
  {url:'/blogs',element:<Blogs />},
  {url:'/tasks',element:<Tasks />},
  {url:'/expenses',element:<Expenses />},
  {url:'/dictionary',element:<Dictionary />},
  {url:'/blog/:id',element:<SingleBlog />},
  {url:'/study/:id',element:<SingleStudy />},
  {url:'/studyview/:id',element:<SingleStudyView />},
  {url:'/',element:<Navigate to="/code" />},
]

function Routing() {
  return (
    <>
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Routes>
          {routes.map(itm=>{
          return <Route path={itm.url} element={itm.element} />
        })}

          </Routes>
        </React.Suspense>
      </BrowserRouter>
      <Loader />
      <ToastContainer />
    </>
  );
}
export default Routing
