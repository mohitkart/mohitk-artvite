import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../Pages/actions/user";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";

const ChangePassword = (p) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [form, setForm] = useState({
    confirmPassword: "",
    currentPassword: "",
    newPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const formValidation = [
    {
      key: "confirmPassword",
      minLength: 8,
      confirmMatch: ["confirmPassword", "newPassword"],
    },
    { key: "currentPassword", minLength: 8 },
    { key: "newPassword", minLength: 8 },
  ];
  const [eyes, setEyes] = useState({
    password: false,
    confirmPassword: false,
    currentPassword: false,
  });
  const getError = (key) => {
    return methodModel.getError(key, form, formValidation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    let invalid = methodModel.getFormError(formValidation, form);
    if (invalid) return;

    loader(true);
    let payload = {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
      userId: user._id,
    };
    ApiClient.put("user/change/password", payload).then((res) => {
      if (res.success) {
        dispatch(logout());
        toast.success(res.message);
        localStorage.removeItem("token");
        localStorage.removeItem("persist:admin-app");
        history("/login");
      }
      loader(false);
    });
  };

  return (
    <>
      <div className="wrapper_section">
        <div className="input_form   overflow-hidden rounded-lg bg-white grid grid-cols-12">
          <div className="col-span-12 md:col-span-12">
          <h3 class="text-2xl font-semibold text-[#111827] mb-8">Change Password</h3>
            <form onSubmit={handleSubmit}>
              <div className="items-center ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col  gap-4 ">
                    <label className="text-typo text-base font-medium w-96">
                      Current Password<span className="start">*</span>
                    </label>
                    <div className="w-full">
                      <div className="relative ">
                        <input
                          type={eyes.currentPassword ? "text" : "password"}
                          className="shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary"
                          value={form.currentPassword}
                          maxLength="20"
                          placeholder="Enter current password"
                          onChange={(e) =>
                            setForm({
                              ...form,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                        <div className="absolute right-2 top-3 cursor-pointer text-grey-500 text-sm">
                          <p
                            className={
                              eyes.currentPassword ? "eye-open" : "eye-closed"
                            }
                            onClick={() =>
                              setEyes({
                                ...eyes,
                                currentPassword: !eyes.currentPassword,
                              })
                            }
                          >
                            {eyes.currentPassword ? (
                              <FiEye className="text-gray-400" />
                            ) : (
                              <FiEyeOff className="text-gray-400" />
                            )}
                          </p>
                        </div>
                      </div>
                      {submitted && getError("currentPassword").invalid ? (
                        <div className="invalid-feedback d-block">
                          Min Length must be 8 characters long
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col  gap-4  ">
                    <label className="text-typo text-base font-medium w-96">
                      New Password<span className="start">*</span>
                    </label>

                    <div className=" w-full">
                      <div className="relative ">
                        <input
                          type={eyes.password ? "text" : "password"}
                          className="shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary"
                          value={form.newPassword}
                          placeholder="Enter new password"
                          minLength={9}
                          maxLength={16}
                          onChange={(e) =>
                            setForm({ ...form, newPassword: e.target.value })
                          }
                          required
                        />
                        <div className="absolute right-2 top-3 cursor-pointer text-grey-500 text-sm">
                          <p
                            className={
                              eyes.currentPassword ? "eye-open" : "eye-closed"
                            }
                            onClick={() =>
                              setEyes({
                                ...eyes,
                                password: !eyes.password,
                              })
                            }
                          >
                            {eyes.password ? (
                              <FiEye className="text-gray-400" />
                            ) : (
                              <FiEyeOff className="text-gray-400" />
                            )}
                          </p>
                        </div>
                      </div>
                      {submitted && getError("newPassword").invalid ? (
                        <div className="invalid-feedback d-block">
                          Min Length must be 9 characters long
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col  gap-4 ">
                    <label className="text-typo text-base font-medium w-96">
                      Confirm Password<span className="start">*</span>
                    </label>

                    <div className="relative w-full ">
                      <input
                        type={eyes.confirmPassword ? "text" : "password"}
                        className="shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary"
                        placeholder="Enter Confirm Password"
                        value={form.confirmPassword}
                        minLength={9}
                        maxLength={16}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                        required
                      />
                      <div className="absolute right-2 top-3 cursor-pointer text-grey-500 text-sm">
                        <p
                          className={
                            eyes.currentPassword ? "eye-open" : "eye-closed"
                          }
                          onClick={() =>
                            setEyes({
                              ...eyes,
                              confirmPassword: !eyes.confirmPassword,
                            })
                          }
                        >
                          {eyes.confirmPassword ? (
                            <FiEye className="text-gray-400" />
                          ) : (
                            <FiEyeOff className="text-gray-400" />
                          )}
                        </p>
                      </div>
                      {submitted && getError("confirmPassword").invalid ? (
                        <>
                          {getError("confirmPassword").err.confirmMatch ? (
                            <div className="invalid-feedback d-block">
                              Confirm Password is not matched with New Password
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>

                  <div className="flex items-end justify-end">
                    <button
                      type="submit"
                      className="text-white bg-[#EB6A59]  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2.5 text-center  mb-2 cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
