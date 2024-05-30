import React from "react";
import './style.scss';
import Select from "react-select";

const Html = ({ options,selectedValues,handleChange,displayValue,id}) => {
    return <>
        <div className="selectDropdown">
             <Select
    defaultValue={displayValue}
    isMulti
    value={selectedValues||[]}
    options={options?.map(itm => { return { value: itm.id, label: itm[displayValue] } }) || []}
    className="basic-multi-select"
    classNamePrefix="select"
    onChange={e => handleChange(e)}
  />
        </div>
    </>
}

export default Html