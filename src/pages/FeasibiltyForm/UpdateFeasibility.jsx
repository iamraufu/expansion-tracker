/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import funnelIcon from "../../assets/icons/fesForm.png";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useActivity from "../../hooks/useActivity";


const UpdateFeasibility = () => {
    const { user } = useAuth();
    let { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [fetchedData, setFetchedData] = useState([]);


    const api_url = process.env.REACT_APP_API_URL;


    // feasibilty form
    const [formData, setFormData] = useState({
        populationDensity: '',
        houseRent: '',
        marketProximity: '',
        avgSales: '',
        roadStatus: '',
        mosqueCount: '',
        schoolCount: '',
        bankCount: '',
        competitorSales: '',
        transportAvailability: '',
        frontFace: '',
        signboardVisibility: '',
        hotelCount: ''
    });

    const { createActivity } = useActivity();








    const weightage = {
        populationDensity: { weight: 21, scores: { High: 100, Medium: 70, Low: 50 } },
        houseRent: { weight: 15, scores: { A: 100, B: 70, C: 50 } },
        marketProximity: { weight: 10, scores: { 'Within Bazar': 100, 'Near Bazar': 80 } },
        avgSales: { weight: 9, scores: { '≥ 45000': 100, '35000 - 44999': 80, '25000 - 34999': 60, '15000 - 24999': 40, '0 - 14999': 20 } },
        roadStatus: { weight: 8, scores: { 'Main Road': 100, 'Support Road': 80, 'Block': 60 } },
        mosqueCount: { weight: 8, scores: { '≥ 2': 100, '1': 80, '0': 50 } },
        schoolCount: { weight: 5, scores: { '≥ 2': 100, '1': 80, '0': 50 } },
        bankCount: { weight: 5, scores: { '≥ 2': 100, '1': 80, '0': 50 } },
        frontFace: { weight: 4, scores: { '≥ 20': 100, '0 - 19': 80 } },
        competitorSales: { weight: 5, scores: { '≥ 45000': 100, '35000 - 44999': 80, '25000 - 34999': 60, '15000 - 24999': 40, '0 - 14999': 0 } },
        transportAvailability: { weight: 5, scores: { Yes: 100, No: 50 } },
        signboardVisibility: { weight: 3, scores: { High: 100, Medium: 80, Low: 60 } },
        hotelCount: { weight: 2, scores: { '≥ 3': 100, '2': 80, '0 - 1': 50 } }
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${api_url}/site/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        authorization: user.token,
                    },
                    //   body: JSON.stringify({  })
                });
                const json = await response.json();
                console.log(json);

                if (json.status) {
                    setFetchedData(json.site);
                    
                    if(json?.site?.feasibility.scroreBoard?.populationDensity?.value){
                        setFormData({
                            populationDensity: json?.site?.feasibility.scroreBoard?.populationDensity?.value,
                            houseRent: json?.site?.feasibility.scroreBoard?.houseRent?.value,
                            marketProximity: json?.site?.feasibility.scroreBoard?.marketProximity?.value,
                            avgSales: json?.site?.feasibility.scroreBoard?.avgSales?.value,
                            roadStatus: json?.site?.feasibility.scroreBoard?.roadStatus?.value,
                            mosqueCount: json?.site?.feasibility.scroreBoard?.mosqueCount?.value,
                            schoolCount: json?.site?.feasibility.scroreBoard?.schoolCount?.value,
                            bankCount: json?.site?.feasibility.scroreBoard?.bankCount?.value,
                            competitorSales: json?.site?.feasibility.scroreBoard?.competitorSales?.value,
                            transportAvailability: json?.site?.feasibility.scroreBoard?.transportAvailability?.value,
                            frontFace: json?.site?.feasibility.scroreBoard?.frontFace?.value,
                            signboardVisibility: json?.site?.feasibility.scroreBoard?.signboardVisibility?.value,
                            hotelCount: json?.site?.feasibility.scroreBoard?.hotelCount?.value
                        })
                    }
                    
                    setLoading(false)
                } else {
                    setFetchedData([]);
                    setLoading(false)
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false)
            }
            finally {
                setLoading(false)
            }
        };

        fetchData();

        // eslint-disable-next-line
    }, []);


    const handlefeasibiltyChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getScoreForValue = (key, value) => {
        const scores = weightage[key].scores;
        if (typeof scores === 'object') {
            if (isNaN(value)) {
                return scores[value];
            } else {
                const numericValue = parseInt(value);
                for (const range in scores) {
                    const [min, max] = range.split(' - ').map(Number);
                    if (range.includes('≥')) {
                        const minValue = parseInt(range.split('≥ ')[1]);
                        if (numericValue >= minValue) return scores[range];
                    } else if (numericValue >= min && numericValue <= max) {
                        return scores[range];
                    }
                }
            }
        }
        return 0;
    };

    const calculateScore = () => {
        let totalScore = 0;
        let scroreBoard = {}
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && weightage.hasOwnProperty(key)) {
                const value = formData[key];
                const score = getScoreForValue(key, value);
                scroreBoard = { ...scroreBoard, [key]: { value: value, score, weight: weightage[key].weight } }
                const weightedScore = (score / 100) * weightage[key].weight;
                // const weightedScore = (score) ;
                totalScore += weightedScore;
            }
        }
        // console.log({scroreBoard});
        return { scroreBoard, totalScore };
    };
    const handleFullSubmit = async (e) => {
        e.preventDefault();
        const finalData = calculateScore();
        // console.log(finalData.scroreBoard);

        const checkValues = finalData.scroreBoard
        for (const key in checkValues) {
            if (checkValues[key].value === '') {
                toast.error("All fields are required!");
                // console.log("Stopp");
                return;
            }
        }


        try {
            const response = await fetch(`${api_url}/site//update/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    authorization: user.token,
                },
                body: JSON.stringify({ feasibility: finalData }),
            });

            const responseData = await response.json();
            if (responseData.status) {
                await createActivity(
                    user._id,
                    "site_create",
                    `${user.name} created an site id: ${id}!`
                );
                console.log(responseData);
                toast.success(responseData.message);
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            } else {
                console.log(response);
                console.error("Failed to submit form");
                toast.error(responseData.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("There is a problem with the server!");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    console.log({formData});
    return (
        <form className="p-4 container mx-auto bg-white rounded-lg shadow-md" onSubmit={handleFullSubmit}>
            <div className="flex items-center mb-4">
                <Toaster position="top-right" reverseOrder={false} />
                {/* <IoIosArrowRoundBack className="w-10 h-10" /> */}
                <img src={funnelIcon} className="w-10 h-10" alt="funnel img" />
                <h2 className="p-4 text-lg font-medium ">Feasibility Questionnaire</h2>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Population Density/Residential Area</label>
                <select name="populationDensity" value={formData.populationDensity} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                    <option value="">Select</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">House Rent/Income Level</label>
                <select name="houseRent" value={formData.houseRent} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Select</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Market/Bazar/Shopping Mall/Other Brands</label>
                <select name="marketProximity" value={formData.marketProximity} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Select</option>
                    <option value="Within Bazar">Within Bazar</option>
                    <option value="Near Bazar">Near Bazar</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Avg. Sales of Departmental Stores</label>
                <input type="number" name="avgSales" value={formData.avgSales} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Road Status</label>
                <select name="roadStatus" value={formData.roadStatus} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Select</option>
                    <option value="Main Road">Main Road</option>
                    <option value="Support Road">Support Road</option>
                    <option value="Block">Block</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Mosque/Mandir/Girza</label>
                <input type="number" name="mosqueCount" value={formData.mosqueCount} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">School/College/University</label>
                <input type="number" name="schoolCount" value={formData.schoolCount} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Bank/Office/ATM BOOTH</label>
                <input type="number" name="bankCount" value={formData.bankCount} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Competitor Presence with Avg Sales</label>
                <input type="number" name="competitorSales" value={formData.competitorSales} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Front Face</label>
                <input type="number" name="frontFace" value={formData.frontFace} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">CNG, Bus, Train Station/ Pick & Drop</label>
                <select name="transportAvailability" value={formData.transportAvailability} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Signboard Visibility</label>
                <select name="signboardVisibility" value={formData.signboardVisibility} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="">Select</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">Hotel & Restaurant & Hospital/ Club</label>
                <input type="number" name="hotelCount" value={formData.hotelCount} onChange={handlefeasibiltyChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
            </div>

            <button type="submit" className="w-full bg-green-500 text-white py-2 px-4 rounded">Update</button>
        </form>


    );
};

export default UpdateFeasibility;
