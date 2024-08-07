import React from 'react'

const FunnelCard = ({ getCountByStatus, getSiteLeftForNextStatus, status, duration }) => {
    return (
        <div className="bg-white w-[130px] flex flex-col justify-center items-center h-[130px] px-5 py-2 rounded-md">
            <div className="font-semibold text-yellow-600 text-sm ">
                <span>{getCountByStatus(status)} </span>
                <span>{getSiteLeftForNextStatus(status, duration) !== 0 && (
                    <span className="text-slate-800">
                        ({getSiteLeftForNextStatus(status, duration)})
                    </span>
                )}
                </span>
            </div>
            <p className="font-medium text-black  mt-2 capitalize">
                {status}
            </p>

        </div>
    )
}

export default FunnelCard