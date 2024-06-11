import { useState } from 'react';
import useAuth from './useAuth';

const useActivity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const api_url = process.env.REACT_APP_API_URL;
    const { user } = useAuth();
    
    const createActivity = async (userId, type, activity) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${api_url}/activity/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: user.token,
                },
                body: JSON.stringify({ user: userId, type: type, activity: activity }),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("value recorded");
                console.log(responseData);
                // You can return responseData here if needed
            } else {
                console.error('Failed to submit form');
                setError('There is a problem with the server!');
            }
        } catch (error) {
            console.error(error);
            setError('There is a problem with the server!');
        } finally {
            setLoading(false);
        }
    };

    return { createActivity, loading, error };
};

export default useActivity;
