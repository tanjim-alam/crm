import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getAllLeads, getLeadsByUserId, updateLeadAssign, updateLeadStatus } from '../redux/slices/leadSlice';
import { getAllUsers, getUserProfile } from '../redux/slices/userSlice';
import dateFormeter from '../helper/dateFormeter';
import { getAuthProfile } from '../redux/slices/authSlice';

function Leads() {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(["Not Responed", "Pending", "Done"]);
    const [selectId, setSelectId] = useState([]);
    const [leadsData, setLeadsData] = useState([]);
    console.log(leadsData)
    //==========================

    const { authData } = useSelector((state) => state.auth);
    const getAuthId = localStorage.getItem("authId");
    const authId = JSON.parse(getAuthId)
    // console.log(authId)

    const { userData } = useSelector((state) => state.user);
    const getUserId = localStorage.getItem("userId");
    const userId = JSON.parse(getUserId)
    // console.log(userId)

    async function fetchAuthData() {
        await dispatch(getAuthProfile(authId))
    }

    async function fetchUserData() {
        await dispatch(getUserProfile(userId))
    }

    useEffect(() => {
        if (authId) {
            fetchAuthData();
        }
        else if (userId) {
            fetchUserData()
        }
    }, [])

    //==========================
    const { leads } = useSelector((state) => state.lead);
    async function fetchLeadData() {
        const res = await dispatch(getAllLeads());
        setLeadsData(res?.payload?.data);
    };

    async function fetchLeadByUserId() {
        const res = await dispatch(getLeadsByUserId(userId));
        console.log(res)
        setLeadsData(res?.payload?.data);
    }

    const { allUserData } = useSelector((state) => state.user);
    // console.log(allUserData)
    const assignUserData = allUserData.filter((user) => user.role !== "Hr" && user.role !== "Team Leader");
    // console.log(assignUserData);
    async function fetchUserData() {
        await dispatch(getAllUsers())
    }
    console.log("authData", authData)
    useEffect(() => {
        fetchUserData();
        if (userId) {
            fetchLeadByUserId()
        }
        if (authId) {
            fetchLeadData();
        }
    }, []);

    async function handleChange(lid, value) {
        await dispatch(updateLeadStatus([lid, value]))
    }
    function handleSelectId(id) {
        if (selectId.includes(id)) {
            setSelectId(selectId.filter(item => item !== id));
        } else {
            setSelectId([...selectId, id]);
        }
    }

    async function handleAssignChange(value) {
        await dispatch(updateLeadAssign([selectId, value]));
    }
    return (
        <Layout>
            <div className='w-100 bg-white p-4 flex flex-col gap-3 relative' >
                {selectId.length >= 1 ? (
                    <div className='flex gap-2 items-center'>
                        <span>Assign To</span>
                        <select name="" id="" onChange={(e) => handleAssignChange(e.target.value)} className='bg-green-800 text-white px-4 py-1 flex items-center gap-1'>
                            {assignUserData && assignUserData?.map((user, i) => (
                                <>
                                    <option key={i} value={user._id}>{user.name}</option>

                                </>
                            ))}
                        </select>
                    </div>
                ) : null}
                <div className="overflow-x-auto">
                    <table className="min-w-full border text-center text-sm font-light dark:border-neutral-500">
                        {/* head */}
                        <thead className="border-b font-medium bg-teal-100">
                            <tr >
                                {/* <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th> */}
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Mark</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">No.</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Name</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Email</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Phone</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Project Name</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Date</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Status</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Assigned</th>
                                <th scope="col"
                                    className="border-r px-6 py-4 dark:border-neutral-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="border-b font-medium bg-white">
                            {/* row 1 */}
                            {
                                leadsData && leadsData.map((lead, i) => (
                                    <tr key={i} className="border-b dark:border-neutral-500 even:bg-slate-100">
                                        <th className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            <label>
                                                <input type="checkbox" value={lead._id} onClick={(e) => handleSelectId(e.target.value)} className="" />
                                            </label>
                                        </th>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {i + 1}
                                        </td>

                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {lead.name}
                                        </td>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {lead.email}
                                        </td>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {lead.phone}
                                        </td>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {lead.projectName}
                                        </td>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {dateFormeter(lead?.createdAt)}
                                        </td>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            <select name="" bordered={false} defaultValue={lead.status} onChange={(event) => handleChange(lead._id, event.target.value)} id="" className=' bg-transparent'>
                                                {status && status.map((s, i) => (
                                                    <option key={i} value={s}>
                                                        {s}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            {/* <select defaultValue={lead.assingTo?.name || "John"} onChange={(event) => handleAssignChange(lead._id, event.target.value)} name="" id="">
                                                {allUserData && allUserData?.map((user, i) => (
                                                    <>
                                                        <option key={i} value={user._id}>{user.name}</option>

                                                    </>
                                                ))}
                                            </select> */}
                                            {/* <span >{lead.assingTo?.name}</span> */}
                                            {lead.assingTo?.name || "Not Assign"}
                                        </td>

                                        <td className="whitespace-nowrap border-r px-6 py-4 font-medium dark:border-neutral-500">
                                            <div className='flex gap-2 items-center justify-center'>
                                                <button className=' bg-green-500 px-2 py-1 text-white rounded-md'>
                                                    <MdOutlineModeEditOutline />
                                                </button>
                                                <button className=' bg-red-500 px-2 py-1 text-white rounded-md'>
                                                    <FaRegTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}

export default Leads