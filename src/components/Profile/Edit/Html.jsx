import React from "react";
import "./style.scss";
import PhoneInput from "react-phone-input-2";
import SelectDropdown from "../../common/SelectDropdown";

import ImageUpload from "../../common/ImageUpload";

import FormControl from "../../common/FormControl";

const Html = ({
  handleSubmit,
  setForm,
  form,
  getError,
  imageResult,
  images,
  uploadImage,
  submitted,
}) => {
  return (
    <>
      <div className="wrapper_section">
        <div className="flex items-center  justify-between">
          <h3 className="text-2xl font-semibold text-[#111827]">
            Edit Profile
          </h3>
        </div>

        <form name="profileForm" className="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 mb-4 gap-4 mt-6 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FormControl
                type="text"
                label="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e })}
                required
              />
            </div>

            {/*  <div className="col-span-12 md:col-span-6">
              <FormControl
                type="text"
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e })}
                required
              />
            </div> */}

            <div className="col-span-12 md:col-span-6">
              <label className="mb-2 inline-flex">
                Mobile No<span className="star">*</span>
              </label>
              <PhoneInput
                country={"us"}
                value={form.mobileNo}
                enableSearch={true}
                limitMaxLength
                required
                onChange={(e) => setForm({ ...form, mobileNo: e })}
                countryCodeEditable={true}
                minlegth="10"
              />
              {submitted && getError("mobileNo").invalid ? (
                <div className="invalid-feedback d-block">Min Length is 10</div>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-2 inline-flex">Email</label>
              <input
                type="email"
                className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2"
                value={form.email}
                autoComplete="false"
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                }}
                required
                disabled
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="mb-2 inline-flex">Image</label>
              <br></br>
              <ImageUpload
                model="users"
                result={(e) => imageResult(e, "image")}
                value={images.image || form.image}
                multiple={false}
              />
            </div>

            {/* <div className="col-span-12 md:col-span-6">
              <label>Customer Role<span className="star">*</span></label>
              <SelectDropdown
                id="statusDropdown"
                displayValue="name"
                placeholder="Select Customer Role"
                intialValue={form.customerRole}
                result={e => { setForm({ ...form, customerRole: e.value,skills:[] }) }}
                options={roles}
                theme="search"
                disabled
              />
              {submitted && !form.customerRole ? <div className="invalid-feedback d-block">Customer Role is Required</div> : <></>}
            </div> */}
          </div>
          <div className="text-right mt-3">
            <button className="me-3 text-white bg-gray-400 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Cancel
            </button>
            <button className="text-white bg-orange-400 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Html;
