import { React, useEffect, useState } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import styles from "./index.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { RiHome6Line } from "react-icons/ri";
import { TiArrowSortedDown } from "react-icons/ti";
import { SiPlanet, SiSuperuser } from "react-icons/si";
import {
  MdEventAvailable,
  MdOutlineEmojiEvents,
  MdOutlineEventAvailable,
} from "react-icons/md";
import { LuUser2 } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { LiaHistorySolid } from "react-icons/lia";
import environment from "../../../environment";
import ApiClient from "../../../methods/api/apiClient";
import { UserCircleIcon } from "@heroicons/react/20/solid";

const Html = ({ ListItemLink, tabclass, isAllow, route, isOpen, user }) => {
  const [activeplan, setActiveplan] = useState();
  // const user = useSelector((state) => state.user);
  console.log(user?.customerRole, "userrrrrrrrrrrrr");
  const role = user?.customerRole?.name === "Group Leader";
  const getactivePlan = () => {
    let filter = {};
    if (user?.subRole?.id == environment.SubRolePartner) {
      filter = { id: user.id || user?._id };
    } else {
      filter = {};
    }
    ApiClient.get("api/getMyPlan", filter).then((res) => {
      if (res.success) {
        setActiveplan(res?.data);
      }
    });
  };
  const location = useLocation();
  useEffect(() => {
    if (user?.customerRole?.name === "Group Leader") {
      getactivePlan();
    }
  }, []);

  const menus = [
    {
      name: "Main Menu",
    },
    {
      name: "Dashboard",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/dashboard",
      key: "",
    },
    /* {
      name: "Roles",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/roles",
      key: "",
    },
    {
      name: "Users",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/user",
      key: "",
    },
    {
      name: "Categories",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/category",
      key: "",
    },
    {
      name: "Products",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/product",
      key: "",
    },
    {
      name: "FAQ",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/faq",
      key: "",
    },
    {
      name: "Content",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/content",
      key: "",
    },
    {
      name: "Newsletter",
      icon: <RiHome6Line className="text-[#fff] shrink-0 text-lg" />,
      url: "/newsletter",
      key: "",
    }, */
  ];

  return (
    <>
      <div
        className={`px-[8px] ${isOpen && styles.sm_sidebar}`}
        component="siderbar"
      >
        <ul className="space-y-2 px-2">
          {menus.map((itm) => {
            return (
              <>
                {itm.icon ? (
                  <>
                    <li>
                      {itm.menu ? (
                        <>
                          <Disclosure as="div" defaultOpen={tabclass(itm.tab)}>
                            {({ open }) => (
                              <>
                                <tooltip placement="right" title={itm.name}>
                                  <Disclosure.Button className="w-full p-2.5 rounded-md flex items-center justify-between text-[#4A545E]  hover:!text-[#5577FF] gap-[12px] hover:bg-[#5577FF]/10 transition-all duration-300">
                                    <span className="text-sm font-normal text-inherit flex items-center gap-[12px] crm">
                                      {itm.icon}
                                      <span className=" text-inherit leading-none sidebar_text">
                                        {" "}
                                        {itm.name}
                                      </span>
                                    </span>
                                    <TiArrowSortedDown
                                      className={`${
                                        open ? "" : "-rotate-90 transform"
                                      } h-4 w-4 transition-all duration-500  text-[#7E8B99]`}
                                    />
                                  </Disclosure.Button>
                                </tooltip>
                                <Transition
                                  enter="transition duration-300 ease-in-out"
                                  enterFrom="transform scale-95 opacity-0"
                                  enterTo="transform scale-300 opacity-300"
                                  leave="transition duration-300 ease-in-out"
                                  leaveFrom="transform scale-300 opacity-300"
                                  leaveTo="transform scale-95 opacity-0"
                                >
                                  <Disclosure.Panel className="pl-[30px] mt-[4px] ">
                                    <ul className="space-y-2">
                                      {itm.menu.map((sitm) => {
                                        return (
                                          <>
                                            {isAllow(sitm.key) ? (
                                              <li>
                                                {" "}
                                                <NavLink
                                                  className={(isActive) =>
                                                    "p-2.5 rounded-md block text-sm font-normal text-[#4A545E] cursor-pointer hover:!text-[#5577FF] hover:bg-[#5577FF]/10 !no-underline transition-all " +
                                                    (location?.pathname ==
                                                      sitm.url &&
                                                      " !text-[#5577FF] !bg-[#5577FF]/10 !font-medium")
                                                  }
                                                  to={sitm.url}
                                                >
                                                  <span
                                                    className="text-inherit leading-none sidebar_text"
                                                    title={sitm.name}
                                                  >
                                                    {" "}
                                                    {sitm.name}
                                                  </span>
                                                </NavLink>
                                              </li>
                                            ) : null}
                                          </>
                                        );
                                      })}
                                    </ul>
                                  </Disclosure.Panel>
                                </Transition>
                              </>
                            )}
                          </Disclosure>
                        </>
                      ) : (
                        <>
                          {isAllow(itm.key) ? (
                            <>
                              <tooltip
                                placement="top"
                                color="#ef7a2b"
                                title={itm.name}
                              >
                                <NavLink
                                  to={itm.url}
                                  className={(isActive) =>
                                    "p-2.5 rounded-md flex items-center gap-[12px] text-sm font-normal text-[#fff] hover:!text-[#fff] hover:bg-[#00b884]/10 !no-underline transition-all " +
                                    (location?.pathname == itm.url &&
                                      " !text-[#fff] !bg-[#ef7a2b] !font-medium")
                                  }
                                >
                                  {itm.icon}
                                  <span className="text-inherit leading-none sidebar_text">
                                    {itm.name}
                                  </span>
                                </NavLink>
                              </tooltip>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <h6
                        className={`${
                          isOpen
                            ? "py-[12px] text-center"
                            : "p-[12px] text-center text-md"
                        } text-xs font-medium text-[#7E8B99] mt-[12px]`}
                      >
                        <span className=" sidebar_text text-center">
                          {" "}
                          {itm.name}{" "}
                        </span>
                      </h6>
                    </li>
                  </>
                )}
              </>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Html;
