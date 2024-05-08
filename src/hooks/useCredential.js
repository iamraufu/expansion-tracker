import { useEffect, useState } from "react";
import userDetails from '../data/user.json'

const useCredential = () => {

    const id = localStorage.getItem('uId')
    const [user, setUser] = useState({});

    // getting userInfo from localStorage id and backend API
    const userData = () => {
        const fetchData = async () => {
            try {
                const tempUser = userDetails.find(u => u._id === id) || {}
                setUser(tempUser)
            } catch (error) {
                fetchData();
            }
        };
        fetchData();
    }

    // persist login
    useEffect(() => {
        if (id) {
            userData()
        } else {
            setUser({})
        }
        //eslint-disable-next-line
    }, [])

    // email
    const logOut = () => {
        localStorage.removeItem('uId')
        setUser({})
    }

    return {
        user,
        setUser,
        logOut
    }
};

export default useCredential;