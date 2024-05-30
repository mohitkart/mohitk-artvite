import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ links = [], currentPage = "" }) => {
  return (
    <>
      <div className="px-4 lg:px-10 mt-6">
        <div className="flex items-center gap-2 font-medium">
          {links.map((itm) => {
            return (
              <Link className="text-[#605F5F]" to={itm.link}>
                {" "}
                {itm.name}
              </Link>
            );
          })}
          <p>
          <span class="material-symbols-outlined">arrow_forward_ios</span>
          </p>
          <p className="text-black active">{currentPage}</p>
        </div>

        {/* <ol class="breadcrumb">
        {links.map(itm=>{
            return <li class="breadcrumb-item"><Link to={itm.link}>{itm.name}</Link></li>
        })}
        <li class="breadcrumb-item active" aria-current="page">{currentPage}</li>
    </ol> */}
      </div>
    </>
  );
};

export default Breadcrumb;
