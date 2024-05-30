import { Link } from "react-router-dom"

const AuthLayout=({children}:any)=>{
    return <>
     <div className='grid items-center grid-cols-12 bg_images'>
       
        <div className="col-span-12 md:col-span-5 lg:col-span-5 hidden md:block">
          <div className="relative flex flex-col items-center justify-center h-screen py-8 overflow-auto">
            
            <div className=" w-full max-w-md px-8 py-6 mx-auto overflow-y-auto rounded-lg">
            <Link to="/"><img src="/assets/img/logo.png" className="w-[35 0px] mb-6 mx-auto" alt="logo" /></Link>
            
            </div>

          </div>
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-7 ">
          <div className="relative w-full h-screen">
            <img src="/assets/img/login_Img.png" alt="bg-logon" width="auto" height="auto" className="object-center object-cover absolute inset-0 w-full h-full z-10" />
            <div className="flex items-center justify-center h-full  w-full  lg:pl-14 relative z-20">
                  {children}
            </div>
          </div>
        </div>
      </div>
    </>
}

export default AuthLayout