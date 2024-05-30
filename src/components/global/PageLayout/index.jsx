import React, { useEffect, useState, Fragment } from "react";
import "./style.scss";
import { Link, useNavigate } from "react-router-dom";
import permissionModel from "../../../models/permisstion.model";
import ApiClient from "../../../methods/api/apiClient";
import { Menu, Disclosure, Transition } from "@headlessui/react";
import methodModel from "../../../methods/methods";
import { useDispatch, useSelector } from "react-redux";
import { login_success, logout } from "../../../actions/user";

const PageLayout = ({ children }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useNavigate();
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  console.log(user, "useruseruseruseruseruseruseruseruseruseruser");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!user.loggedIn) {
    } else {
      let permissions = user.roleDetail?.permissions?.[0];
      if (!permissionModel.urlAllow(permissions)) {
        // history("/profile")
      }
      let browseload = localStorage.getItem("browseload");
      if (!browseload) {
        ApiClient.get("user/profile", { id: user._id }).then(async (res) => {
          if (res.success) {
            let data = { ...user, ...res.data };
            dispatch(login_success(data));
          }
        });
      }
    }
  }, []);

  const menus = [
    { name: "Home", url: "/" },
    { name: "Projects", url: "/" },
    { name: "Market", url: "/" },
    { name: "About", url: "/" },
  ];

  const Logout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    history("/login");
  };

  const isLoggedIn = user?.loggedIn;

  const navigation = [
    { name: "My Journal", href: "/myjournal", current: true, isAuth: true },
    { name: "Discover", href: "/discover", current: false, isAuth: false },
    { name: "Support", href: "/support", current: false, isAuth: false },
    { name: "Resources", href: "#", current: false, isAuth: false },
    { name: "Blogs", href: "/blogs", current: false, isAuth: false },
    { name: "Candies", href: "#", current: false, isAuth: false },
    { name: "Capsules", href: "#", current: false, isAuth: false },
    { name: "Gummies", href: "#", current: false, isAuth: false },
    { name: "Drinks", href: "#", current: false, isAuth: false },
    { name: "Functional", href: "#", current: false, isAuth: false },
    { name: "Therapeutic", href: "#", current: false, isAuth: false },
    { name: "Health Benefit", href: "#", current: false, isAuth: false },
  ];

  const filteredMenu = isLoggedIn
    ? navigation
    : navigation.filter((item) => item.isAuth == false);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div component="page-layout">
        <header>
          <Disclosure as="nav" className="py-4">
            {({ open }) => (
              <>
                <div className=" px-2 sm:px-6 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className=" flex items-center md:hidden">
                        {/* Mobile menu button*/}
                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <span class="material-symbols-outlined block h-6 w-6">close</span>
                          ) : (
                            <span class="material-symbols-outlined block h-6 w-6">legend_toggle</span>
                          )}
                        </Disclosure.Button>
                      </div>
                      <div className="flex flex-shrink-0 items-center">
                        <Link to={"/"}>
                          <img
                            src="/assets/img/logo.png"
                            className="mr-3 h-10 lg:h-16 sm:h-10"
                            alt="Shroom Groove"
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex items-center justify-center ">
                        <form className="w-[150px] sm:w-[250px] lg:w-[400px] xl:w-[600px]">
                          <div className="border border-black/23 flex items-center h-12 rounded-[8px]">
                            <input
                              type="search"
                              className="w-full px-4 placeholder:text-gray-800"
                              placeholder="Explore Products, Mushrooms, Mexican, Italian Etc."
                            />
                            <div className="h-full rounded-r-lg	 w-12 bg-[#EB6A59] flex items-center justify-center">
                              <span class="material-symbols-outlined text-white text-2xl">search</span>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className=" flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      {user?.loggedIn ? (
                        <>
                          <Menu as="div" className="relative  ml-auto">
                            <div>
                              <div className="flex items-center">
                                <Link className="inline-flex" to={"/profile"}>
                                  <img
                                    alt="User Image"
                                    src={methodModel.userImg(user.image)}
                                    className="h-12 w-12 rounded-full object-cover border-2 border-[#EB6A59]"
                                  />
                                </Link>

                                <div className="ml-2 text-left hidden md:block">
                                  {/* <p className=" mb-0 text-capitalize text-[12px] font-semibold text-[#757575]">
                                        Userid
                                      </p> */}
                                  {/*  <b className="mb-0 text-capitalize text-[#424242] text-[14px] font-semibold">
                                        {user.fullName}
                                      </b> */}
                                </div>
                              </div>
                            </div>

                            {/* <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to="/profile"
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm flex items-center gap-2"
                                        )}
                                      >
                                        <LuUser2 />
                                        Profile
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to="/dashboard"
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm flex items-center gap-2"
                                        )}
                                      >
                                        <RxDashboard /> Dashboard
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to="/profile/change-password"
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block px-4 py-2 text-sm flex items-center gap-2"
                                        )}
                                      >
                                        <RiLockPasswordLine /> Change Password
                                      </Link>
                                    )}
                                  </Menu.Item>

                                  <Menu.Item className="divide-y-1 divide-gray-800 pt-1  mt-2">
                                    <p className="border-t"></p>
                                  </Menu.Item>

                                  <Menu.Item className="">
                                    {({ active }) => (
                                      <a
                                        type="submit"
                                        onClick={() => Logout()}
                                        className={classNames(
                                          active
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "block w-full px-4 py-2  text-sm flex items-center gap-2"
                                        )}
                                      >
                                        <IoLogOutOutline /> Logout
                                      </a>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition> */}
                          </Menu>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="inline-flex w-full justify-center gap-x-1.5 rounded-[19px] bg-[#EDEDED] px-4 py-2 mb-0 text-sm font-semibold text-gray-900"
                          >
                            Log in
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden block">
                  <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 font-bold text-white"
                            : "text-gray-300 font-bold hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-bold"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          <div className="headersides_names w-full bg-[#EB6A59] py-2  md:block hidden  px-6">
            <ul className="flex items-center justify-center flex-wrap">
              {filteredMenu.map((item) => {
                return (
                  <li>
                    <Link to={item.href}>
                      <a
                        key={item.name}
                        /*  href={item.href} */
                        className={classNames(
                          item.current
                            ? " text-white 	"
                            : "text-white  hover:text-gray-800",
                          "rounded-md px-3 py-2 text-[15px] font-bold"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </header>

        <main className="pageContent">{children}</main>

   
        <div className="text-center py-4 bg-[#232627]">
          <p className="font-regular text-[18px] text-[#C7C7C7]">
            {" "}
            2024. All rights reserved. Privacy Policy | Terms Of Use
          </p>
        </div>
      </div>
    </>
  );
};
export default PageLayout;
