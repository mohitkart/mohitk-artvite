import React, { useState } from 'react';
import Pagination from "react-pagination-js";

const Table = ({ className = '', data = [], theme = 'table', ListHtml = (e) => { }, rowClass = '', columns = [], topHead = [], count = 50, total = 0, page = 1, result = (e) => { }, nodata = 'Data Not Found' }) => {
    const [pageSize, setPageSize] = useState(count);

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        result({ event: 'count', value: parseInt(e.target.value) });
    };

    const handlePaginate = (e) => {
        result({ event: 'page', value: e })
    }

    const view = (row) => {
        result({ event: 'row', row: row })
    }

    const headclick = (itm) => {
        if (itm.sort) {
            result({ event: 'sort', value: itm.key })
        }
    }

    // Generate options array based on the total value
    const generateOptions = () => {
        const options = [];
        for (let i = 10; i <= total; i += 10) {
            options.push(i);
        }
        return options;
    };

    return (
        <>
            <div className={`${className}`}>
                {total ? (
                    <>
                        {/* Table view */}
                        {theme === 'table' && (
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 capitalize bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        {/* Top header */}
                                        {topHead?.length ? (
                                            <tr className="bg-gray-200 border-b border-black">
                                                {topHead.map((itm, i) => (
                                                    <th scope="col" className={`px-6 py-3 text-center ${(topHead.length - 1) === i ? '' : 'border-r border-black'}`} colSpan={itm?.colSpan || 0} key={i}>
                                                        {itm.name}
                                                    </th>
                                                ))}
                                            </tr>
                                        ) : null}
                                        {/* Main header */}
                                        <tr>
                                            {columns.map(itm => (
                                                <th scope="col" className={`px-6 py-3 ${itm.sort ? 'cursor-pointer' : ''}`} onClick={() => headclick(itm)} key={itm.key}>
                                                    {itm.name} {itm.sort ? (
                                                        <span className='ml-2'>
                                                            <span class="material-symbols-outlined shrink-0 inline text-sm">arrow_downward_alt</span>
                                                           </span>
                                                    ) : null}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Table data */}
                                        {data.map((itm) => (
                                            <tr onClick={() => view(itm)} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={itm.id}>
                                                {columns.map(citm => (
                                                    <td className="px-6 py-4" key={citm.key}>
                                                        {citm.render(itm) || '--'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* List view */}
                        {theme === 'list' && (
                            <div className={`rowClass ${rowClass}`}>
                                {data.map((itm, index) => (
                                    <ListHtml key={index} row={itm} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {count < total && (
                            <div className='paginationWrapper flex items-center justify-between mt-15 px-4'>
                                <p className="w-96 text-sm text-gray-500">Show{' '}
                                    <select value={pageSize} onChange={handlePageSizeChange} className="border rounded-md px-2 py-1">
                                        {/* Dynamically generated options */}
                                        {generateOptions().map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>{' '}
                                    from {total} data
                                </p>
                                <Pagination
                                    currentPage={page}
                                    totalSize={total}
                                    sizePerPage={pageSize}
                                    changeCurrentPage={handlePaginate}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className='p-4 text-center'>
                        {nodata}
                    </div>
                )}
            </div>
        </>
    );
}

export default Table;
