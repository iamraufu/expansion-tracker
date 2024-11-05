/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import siteStoreIcon from "../assets/icons/landmark.png";
import funnelIcon from "../assets/icons/fesForm.png";
import toast, { Toaster } from "react-hot-toast";
// import { IoIosArrowRoundBack } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
// import { useParams } from "react-router-dom";
import Map from "./Map";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useActivity from "../hooks/useActivity";
import jsonData from "../data/Locations.json";
import { TbCross } from "react-icons/tb";

const CreateSite = () => {
    const [togglefeasibiltyForm, setTogglefeasibiltyForm] = useState(false);
    const [landlords, setLandlords] = useState([]);
    const [missingFields, setMissingFields] = useState([]);
    const [finalData, setFinalData] = useState([]);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [formCoordinates, setFormCoordinates] = useState(null);
    const [siteData, setSideData] = useState([]);
    const [shwapnoMPBT, setshwapnoMPBT] = useState(0);
    const [partnerMPBT, setPartnerMPBT] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const initialValues = {
        name: "",
        sqft: "",
        division: "",
        district: "",
        upazila: "",
        address: "",
        locationType: "",
        civilWorkType: "",
        status: "site found",
        landlords: landlords,
        siteHistory: [
            {
                status: "site found",
                startTime: new Date(),
                endTime: new Date(),
            },
        ],
        createdBy: user._id,
        location: [],
    };

    //   let { id } = useParams();
    const [data, setData] = useState(null);
    const api_url = process.env.REACT_APP_API_URL;
    const [selectedDivision, setSelectedDivision] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [totalIncome,setTotalIncome] = useState("")
    // eslint-disable-next-line
    const [selectedUpazila, setSelectedUpazila] = useState("");
    const [clusterCode, setClusterCode] = useState();
    const [benchMarkSite, setBenchMarkSite] = useState(null);
    // feasibilty form
    const [formData, setFormData] = useState({
        populationDensity: "",
        houseRent: "",
        marketProximity: "",
        avgSales: "",
        roadStatus: "",
        mosqueCount: "",
        schoolCount: "",
        bankCount: "",
        competitorSales: "",
        transportAvailability: "",
        frontFace: "",
        signboardVisibility: "",
        hotelCount: "",
    });

    const { createActivity } = useActivity();

    const [isOpen, setIsOpen] = useState(false);

    const modalOpen = async (e) => {
        setBenchMarkSite(null);
        e.preventDefault();
        const finalData = calculateScore();
        // console.log(finalData.scroreBoard);

        const checkValues = finalData.scroreBoard;
        for (const key in checkValues) {
            if (checkValues[key].value === "") {
                toast.error("All fields are required!");
                // console.log("Stopp");
                return;
            }
        }

        console.log({ finalData });

        const code = generateCode(siteData, finalData);
        setClusterCode(code);
        setFinalData(finalData);
        setIsOpen(true);

        try {
            const response = await fetch(
                `${api_url}/benchmarkOutlets/cluster`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        authorization: user.token,
                    },
                    body: JSON.stringify({ clusterCode: code }),
                }
            );
            const json = await response.json();
            // console.log({ json });
            // console.log(json.message);
            if (json.status) {
                // Monthly Forecasted Sales
                const sales = (parseFloat(benchMarkSite?.maxSales)*(parseFloat(finalData.totalScore)/100));
                // console.log({sales});
                const GPV =
                    sales *
                    (json.outlet.pnp.toLowerCase() === "pnp" ? 0.15 : 0.136);
                const otherIncome = sales * 0.03;
                const totalIncome = GPV + otherIncome;
                setTotalIncome(totalIncome)
                console.log({sales,GPV,otherIncome,totalIncome});
                // Monthly Forecasted Partner Expense
                // decoration
                const decorationCost =
                    parseFloat(values.sqft) * 1100 +
                    (json.outlet.pnp.toLowerCase() === "pnp" ? 1500000 : 0);
                console.log({ decorationCost });
                // expense
                const rent = parseFloat(values.askingRent);
                const rentVat = parseFloat(values.askingRent) * 0.08;
                const electricity = parseFloat(values.sqft) * 13;
                const depreciation = (decorationCost * 0.8) / 60;
                const financing = (decorationCost * 0.06) / 12;
                const maintenance = 1000;
                const generator = 4000;

                const partnerExpense =
                    rent +
                    rentVat +
                    electricity +
                    depreciation +
                    financing +
                    maintenance +
                    generator;

                // console.log({rent , rentVat , electricity , depreciation , financing , maintenance , generator});

                const partnerCommission = totalIncome * 0.4;
                const partnerMonthlyPBT = partnerCommission - partnerExpense;

                const monthlyForcastedShwapnoExpense =
                    sales *
                    (json.outlet.pnp.toLowerCase() === "pnp" ? 0.1604 : 0.16);

                const shwapnoMonthlyPBT =
                    totalIncome - monthlyForcastedShwapnoExpense;
                setPartnerMPBT(partnerMonthlyPBT);
                setshwapnoMPBT(shwapnoMonthlyPBT);

                // console.log({sales,GPV,otherIncome,totalIncome});
                // console.log({rent});
                // console.log({partnerExpense , partnerCommission,partnerMonthlyPBT,shwapnoMonthlyPBT});
                setBenchMarkSite(json.outlet);
            } else {
                setBenchMarkSite([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    function getSftRange(value) {
        if (value > 0 && value <= 1000) {
            return "0-1000";
        } else if (value > 1000 && value <= 1500) {
            return "1001-1500";
        } else if (value > 1500 && value <= 2000) {
            return "1501-2000";
        } else if (value > 2000 && value <= 2500) {
            return "2001-2500";
        } else if (value > 2500 && value <= 3000) {
            return "2501-3000";
        } else if (value > 3000 && value <= 3500) {
            return "3001-3500";
        } else if (value > 3500) {
            return "3501+";
        } else {
            return "Invalid value";
        }
    }

    // Example usage:
    let value = 1800;
    // console.log(getSftRange(value)); // Output: 'Range A4'

    const generateCode = (siteData, finalData) => {
        console.log({ siteData, finalData });
        const division = siteData.division;
        const size = getSftRange(parseFloat(siteData.sqft));
        const populationDensity =
            finalData.scroreBoard.populationDensity.value.slice(0, 1);
        const houseRent = finalData.scroreBoard.houseRent.value.slice(0, 1);
        return (
            division + " " + populationDensity + " " + houseRent + " " + size
        );
    };

    const modalClose = () => {
        setIsOpen(false);
    };

    const [values, setValues] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // console.log({name,value});
        if (name === "landlords") {
            setValues({
                ...values,
                [name]: [value],
            });
        } else {
            setValues({
                ...values,
                [name]: value,
            });
        }

        if (name === "frontFace") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const isFieldMissing = (fieldName) => {
        return missingFields.includes(fieldName);
    };

    const toggleScroll = () => {
        setScrollEnabled(!scrollEnabled);
        document.body.style.overflow = scrollEnabled ? "hidden" : "auto";
    };

    const handleMapModal = () => {
        console.log("clicked");
        scrollToTop();
        toggleScroll();
        setIsMapOpen(!isMapOpen);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "instant",
        });
    };

    const filter =
        user.role === "admin"
            ? {}
            : user.role !== "manager"
            ? { createdBy: user._id }
            : { createdBy: user.employees };

    // console.log(data);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${api_url}/landlord`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        authorization: user.token,
                    },
                    body: JSON.stringify(filter),
                });
                const json = await response.json();
                console.log(json);
                if (json.status) {
                    setData(json.landlords);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        // eslint-disable-next-line
    }, []);

    // Filter districts based on selected division
    const filteredDistricts = jsonData.filter(
        (item) => item.Division === selectedDivision
    );

    // Filter upazilas based on selected district
    const filteredUpazilas = jsonData.filter(
        (item) => item.Zila === selectedDistrict
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMissingFields([]);

        // // Basic validation
        const requiredFields = [
            "name",
            //   "email",
            "landlords",
            "sqft",
            "frontFace",
            "locationType",
            "askingAdvance",
            "askingRent",
            "premisesStructure",
            "civilWorkType",
            "estimatedHandoverDate",
            "division",
            "district",
            "upazila",
            // "thana",
            "address",
            //   "location",
        ];
        let missing = requiredFields.filter((field) => !values[field]);
        // || values[field]?.length === 0 || !formCoordinates
        if (values["landlords"]?.length === 0) {
            missing.push("landlords");
        }
        if (!formCoordinates) {
            missing.push("location");
        }

        // console.log({ missing });
        if (missing.length > 0) {
            setMissingFields(missing);
            toast.error("Please fill in all required fields.");
            return;
        }

        const outletData = { ...values, location: formCoordinates };

        console.log({ outletData });

        setSideData(outletData);

        setTogglefeasibiltyForm(true);
    };

    const weightage = {
        populationDensity: {
            weight: 21,
            scores: { High: 100, Medium: 70, Low: 50 },
        },
        houseRent: { weight: 15, scores: { A: 100, B: 70, C: 50 } },
        marketProximity: {
            weight: 10,
            scores: { "Within Bazar": 100, "Near Bazar": 80 },
        },
        avgSales: {
            weight: 9,
            scores: {
                "≥ 45000": 100,
                "35000 - 44999": 80,
                "25000 - 34999": 60,
                "15000 - 24999": 40,
                "0 - 14999": 20,
            },
        },
        roadStatus: {
            weight: 8,
            scores: { "Main Road": 100, "Support Road": 80, Block: 60 },
        },
        mosqueCount: { weight: 8, scores: { "≥ 2": 100, 1: 80, 0: 50 } },
        schoolCount: { weight: 5, scores: { "≥ 2": 100, 1: 80, 0: 50 } },
        bankCount: { weight: 5, scores: { "≥ 2": 100, 1: 80, 0: 50 } },
        frontFace: { weight: 4, scores: { "≥ 20": 100, "0 - 19": 80 } },
        competitorSales: {
            weight: 5,
            scores: {
                "≥ 45000": 100,
                "35000 - 44999": 80,
                "25000 - 34999": 60,
                "15000 - 24999": 40,
                "0 - 14999": 0,
            },
        },
        transportAvailability: { weight: 5, scores: { Yes: 100, No: 50 } },
        signboardVisibility: {
            weight: 3,
            scores: { High: 100, Medium: 80, Low: 60 },
        },
        hotelCount: { weight: 2, scores: { "≥ 3": 100, 2: 80, "0 - 1": 50 } },
    };

    const handlefeasibiltyChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const getScoreForValue = (key, value) => {
        const scores = weightage[key].scores;
        if (typeof scores === "object") {
            if (isNaN(value)) {
                return scores[value];
            } else {
                const numericValue = parseInt(value);
                for (const range in scores) {
                    const [min, max] = range.split(" - ").map(Number);
                    if (range.includes("≥")) {
                        const minValue = parseInt(range.split("≥ ")[1]);
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
        let scroreBoard = {};
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && weightage.hasOwnProperty(key)) {
                const value = formData[key];
                const score = getScoreForValue(key, value);
                scroreBoard = {
                    ...scroreBoard,
                    [key]: {
                        value: value,
                        score,
                        weight: weightage[key].weight,
                    },
                };
                const weightedScore = (score / 100) * weightage[key].weight;
                // const weightedScore = (score) ;
                totalScore += weightedScore;
            }
        }
        // console.log({scroreBoard});
        return { scroreBoard, totalScore };
    };

    const handleFullSubmit = async () => {
        // e.preventDefault();
        const finalData = calculateScore();
        // console.log(finalData.scroreBoard);

        const checkValues = finalData.scroreBoard;
        for (const key in checkValues) {
            if (checkValues[key].value === "") {
                toast.error("All fields are required!");
                // console.log("Stopp");
                return;
            }
        }

        try {
            const response = await fetch(`${api_url}/site/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: user.token,
                },
                body: JSON.stringify({ ...siteData, feasibility: finalData }),
            });

            const responseData = await response.json();
            if (responseData.status) {
                await createActivity(
                    user._id,
                    "site_create",
                    `${user.name} created an site named: ${values.name}!`
                );
                // console.log(responseData);
                navigate(-1);
            } else {
                // console.log(response);
                console.error("Failed to submit form");
                toast.error(responseData.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("There is a problem with the server!");
        }
    };

    if (!data) {
        return <p>Loading...</p>;
    }
    return (
        <>
            {!togglefeasibiltyForm ? (
                <section className="padding-x">
                    <div className="addInvestor font-poppins max-container">
                        <div className="page-title pb-3 border-b-2 border-b-slate-500  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
                            <img
                                src={siteStoreIcon}
                                alt="partner Acquisition Icon"
                                className="md:w-8 md:h-8 w-6 h-6"
                            />
                            <p className="text-sm md:text-base font-semibold ">
                                Create Site
                            </p>
                        </div>

                        <form className="w-full max-w-lg mx-auto my-4 text-xs ">
                            <div className="grid grid-cols-1 gap-4">
                                {/* landlord */}
                                <div className="flex items-center">
                                    <label htmlFor="landlords" className="mr-2">
                                        Landlord:
                                    </label>
                                    <select
                                        id="landlords"
                                        name="landlords"
                                        value={
                                            values.landlords.length > 0
                                                ? values.landlords[0]
                                                : ""
                                        }
                                        onChange={handleChange}
                                        className={`input-field ${
                                            isFieldMissing("landlords")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select Landlord
                                        </option>
                                        {data.map((option) => (
                                            <option
                                                className="capitalize"
                                                key={option._id}
                                                value={option._id}
                                            >
                                                {option.customId} -{" "}
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* name */}
                                <div className="flex items-center">
                                    <label htmlFor="name" className="mr-2">
                                        Site Name:
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        placeholder="Name"
                                        className={`input-field ${
                                            isFieldMissing("name")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                {/* lcation type */}
                                <div className="flex items-center">
                                    <label htmlFor="name" className="mr-2">
                                        Location Type:
                                    </label>
                                    <select
                                        onChange={handleChange}
                                        value={values?.locationType}
                                        name="locationType"
                                        className={`input-field ${
                                            isFieldMissing("locationType")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select Location
                                        </option>
                                        <option value="Commercial Hub">
                                            Commercial Hub
                                        </option>
                                        <option value="Gated Community">
                                            Gated Community
                                        </option>
                                        <option value="High Street">
                                            High Street
                                        </option>
                                        <option value="High Street W Institutions">
                                            High Street W Institutions
                                        </option>
                                        <option value="High Street W Residential Block">
                                            High Street W Residential Block
                                        </option>
                                        <option value="Industrial">
                                            Industrial
                                        </option>
                                        <option value="Inside the Mall">
                                            Inside the Mall
                                        </option>
                                        <option value="Within the Mahalla">
                                            Within the Mahalla
                                        </option>
                                    </select>
                                </div>
                                {/* premisesStructure */}
                                <div className="flex items-center">
                                    <label htmlFor="name" className="mr-2">
                                        Premises Structure:
                                    </label>
                                    <select
                                        onChange={handleChange}
                                        name="premisesStructure"
                                        value={values?.premisesStructure}
                                        className={`input-field ${
                                            isFieldMissing("premisesStructure")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select Premises Structure
                                        </option>

                                        <option value="tin shed">
                                            Tin Shed
                                        </option>
                                        <option value="RCC building">
                                            RCC Building
                                        </option>
                                        <option value="green field">
                                            Green Field
                                        </option>
                                        <option value="mix">Mix</option>
                                    </select>
                                </div>
                                {/* civilWorkType */}
                                <div className="flex items-center">
                                    <label htmlFor="name" className="mr-2">
                                        Civil Work Type:
                                    </label>
                                    <select
                                        onChange={handleChange}
                                        name="civilWorkType"
                                        value={values?.civilWorkType}
                                        className={`input-field ${
                                            isFieldMissing("civilWorkType")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select Civil Work Type
                                        </option>

                                        <option value="Ready Made">
                                            Ready Made
                                        </option>
                                        <option value="Semi-Ready">
                                            Semi-Ready
                                        </option>
                                        <option value="Vacant">Vacant</option>
                                        <option value="Occupied Space">
                                            Occupied Space
                                        </option>
                                    </select>
                                </div>
                                {/* sqft */}
                                <div className="flex items-center">
                                    <label htmlFor="sqft" className="mr-2">
                                        Sqft:
                                    </label>
                                    <input
                                        type="number"
                                        id="sqft"
                                        name="sqft"
                                        value={values.sqft}
                                        onChange={handleChange}
                                        placeholder="Sqft"
                                        className={`input-field ${
                                            isFieldMissing("sqft")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                {/* frontFace */}
                                <div className="flex items-center">
                                    <label htmlFor="frontFace" className="mr-2">
                                        Front face:
                                    </label>
                                    <input
                                        type="number"
                                        name="frontFace"
                                        value={values.frontFace}
                                        onChange={handleChange}
                                        placeholder="Front Face"
                                        className={`input-field ${
                                            isFieldMissing("frontFace")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                {/* askingAdvance */}
                                <div className="flex items-center">
                                    <label
                                        htmlFor="askingAdvance"
                                        className="mr-2"
                                    >
                                        Asking Advance
                                    </label>
                                    <input
                                        type="number"
                                        name="askingAdvance"
                                        value={values.askingAdvance}
                                        onChange={handleChange}
                                        placeholder="Asking advance"
                                        className={`input-field ${
                                            isFieldMissing("askingAdvance")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                {/* askingRent */}
                                <div className="flex items-center">
                                    <label
                                        htmlFor="askingRent"
                                        className="mr-2"
                                    >
                                        Asking Rent
                                    </label>
                                    <input
                                        type="number"
                                        name="askingRent"
                                        value={values.askingRent}
                                        onChange={handleChange}
                                        placeholder="Asking Rent"
                                        className={`input-field ${
                                            isFieldMissing("askingRent")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                {/* investmentBudget */}
                                <div className="flex items-center">
                                    <label
                                        htmlFor="estimatedHandoverDate"
                                        className="mr-2"
                                    >
                                        Estimated Handover Date
                                    </label>
                                    <input
                                        type="date"
                                        name="estimatedHandoverDate"
                                        value={values.estimatedHandoverDate}
                                        onChange={handleChange}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        placeholder="Estimated Handover Date"
                                        className={`input-field ${
                                            isFieldMissing(
                                                "estimatedHandoverDate"
                                            )
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                {/* division */}
                                <div className="flex items-center">
                                    <label htmlFor="division" className="mr-2">
                                        Division:
                                    </label>
                                    <select
                                        name="division"
                                        value={values.division}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedDivision(e.target.value);
                                        }}
                                        className={`input-field ${
                                            isFieldMissing("division")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select Division
                                        </option>

                                        {Array.from(
                                            new Set(
                                                jsonData.map(
                                                    (item) => item.Division
                                                )
                                            )
                                        ).map((division, index) => (
                                            <option
                                                key={index}
                                                value={division}
                                            >
                                                {division}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* district */}
                                <div className="flex items-center">
                                    <label htmlFor="district" className="mr-2">
                                        District:
                                    </label>
                                    <select
                                        name="district"
                                        value={values.district}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedDistrict(e.target.value);
                                        }}
                                        className={`input-field ${
                                            isFieldMissing("district")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select District
                                        </option>
                                        {Array.from(
                                            new Set(
                                                filteredDistricts.map(
                                                    (item) => item.Zila
                                                )
                                            )
                                        ).map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* upazila */}
                                <div className="flex items-center">
                                    <label htmlFor="upazila" className="mr-2">
                                        Upazila/Thana:
                                    </label>
                                    <select
                                        name="upazila"
                                        value={values.upazila}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setSelectedUpazila(e.target.value);
                                        }}
                                        className={`input-field ${
                                            isFieldMissing("upazila")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    >
                                        <option value="">
                                            Select Upazila/Thana
                                        </option>
                                        {Array.from(
                                            new Set(
                                                filteredUpazilas.map(
                                                    (item) => item.Upazila
                                                )
                                            )
                                        ).map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <label htmlFor="address" className="mr-2">
                                        Address:
                                    </label>
                                    <textarea
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                        placeholder="Address"
                                        className={`input-field ${
                                            isFieldMissing("address")
                                                ? "border-red-500"
                                                : "border-[#8D8D8D] "
                                        }`}
                                    />
                                </div>
                                <div
                                    onClick={() => handleMapModal()}
                                    className={`flex items-center cursor-pointer `}
                                >
                                    <label htmlFor="location" className="mr-2">
                                        Location:
                                    </label>
                                    <div
                                        className={`flex items-center justify-center rounded text-white gap-1 bg-green-500 w-full p-2 ${
                                            isFieldMissing("location")
                                                ? "border border-red-500"
                                                : ""
                                        }`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                            />
                                        </svg>

                                        <p>
                                            {" "}
                                            {formCoordinates
                                                ? `Long ${formCoordinates?.longitude
                                                      ?.toString()
                                                      .slice(0, 7)}... Lat 
                        ${formCoordinates.latitude?.toString().slice(0, 7)}...
                        `
                                                : "Set Location on Map"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <label htmlFor="name" className="mr-2">
                                        Latitude:
                                    </label>
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={formCoordinates?.latitude}
                                        onChange={(e) =>
                                            setFormCoordinates({
                                                ...formCoordinates,
                                                latitude: e.target.value,
                                            })
                                        }
                                        placeholder="latitude"
                                        className={`input-field border-[#8D8D8D]`}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <label htmlFor="name" className="mr-2">
                                        Longitude:
                                    </label>
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={formCoordinates?.longitude}
                                        onChange={(e) =>
                                            setFormCoordinates({
                                                ...formCoordinates,
                                                longitude: e.target.value,
                                            })
                                        }
                                        placeholder="longitude"
                                        className={`input-field border-[#8D8D8D]`}
                                    />
                                </div>

                                <button
                                    onClick={(e) => handleSubmit(e)}
                                    className="bg-primary text-white p-3 font-medium rounded"
                                >
                                    Save & Continue
                                </button>
                                <Toaster
                                    position="top-right"
                                    reverseOrder={false}
                                />
                            </div>
                        </form>
                    </div>
                    {isMapOpen && (
                        <div className="flex absolute top-0 left-0 w-full  justify-center items-center h-screen">
                            <div className=" w-full h-screen   bg-black/30 z-50">
                                <Map
                                    handleMapModal={handleMapModal}
                                    setFormCoordinates={setFormCoordinates}
                                    formCoordinates={formCoordinates}
                                />
                            </div>
                        </div>
                    )}
                </section>
            ) : (
                <form
                    className="p-4 container mx-auto bg-white rounded-lg shadow-md"
                    // onSubmit={handleFullSubmit}
                >
                    {isOpen && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 bg-black opacity-50 z-40 p-3"
                                onClick={modalClose}
                            ></div>

                            {/* Modal content */}
                            <div className="fixed inset-0 flex items-center justify-center z-50 p-3">
                                <div className=" bg-white p-6 rounded shadow-lg max-w-md w-full">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col items-start justify-start">
                                            <p className="text-base font-medium text-teal-700">
                                                Feasibilty Report
                                            </p>
                                        </div>
                                        <button
                                            className="text-gray-600 hover:text-gray-900"
                                            onClick={modalClose}
                                        >
                                            <RxCross2 />
                                        </button>
                                    </div>
                                   {benchMarkSite &&
                                        benchMarkSite?.length !== 0  && <p className="mt-4 px-1 font-bold text-sm">Benchmark Data</p>}
                                    <div className="flex flex-col  items-start justify-between gap-2  my-2 bg-blue-50 p-3 shadow rounded">

                                        {
                                            benchMarkSite &&
                                            benchMarkSite?.length !== 0  &&
                                            <>
                                            <div className="flex items-center justify-center gap-2">
                                            <p className="font-medium text-sm">
                                                Cluster:
                                            </p>

                                            <p className="text-sm font-medium text-blue-900">
                                                {clusterCode}
                                            </p>
                                        </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <h1 className="font-medium text-sm">
                                                    Outlet:
                                                </h1>
                                                <p className="text-sm font-medium text-blue-900">
                                                    {benchMarkSite?.name}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center justify-center gap-2">
                                                <h1 className="font-medium text-sm">
                                                    Avg Sales:
                                                </h1>
                                                <p className="text-sm font-medium text-blue-900">
                                                    {benchMarkSite?.maxSales}
                                                </p>
                                            </div>
                                        </>}
                                        
                                        <div className="flex items-center justify-center gap-2">
                                            <p className="font-medium text-sm">
                                                Score:
                                            </p>

                                            <p className="text-sm font-medium text-blue-900">
                                                {finalData.totalScore.toFixed(
                                                    2
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                   {benchMarkSite &&
                                        benchMarkSite?.length !== 0 && <p className="mt-4 px-1 font-bold text-sm">Forcasting Data</p>}
                                    {benchMarkSite &&
                                        benchMarkSite?.length !== 0 && (
                                            <>
                                                <div className={`flex flex-col  items-start justify-between gap-2  my-2 ${ (shwapnoMPBT <= 0 || partnerMPBT <= 0) ? "bg-rose-50" : "bg-green-50"} p-3 shadow rounded`}>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <h1 className="font-medium text-sm">
                                                            Monthly Sales:
                                                        </h1>
                                                        <p className="text-base font-medium text-slate-900">
                                                        {(parseFloat(benchMarkSite?.maxSales)*(parseFloat(finalData.totalScore)/100)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <h1 className="font-medium text-sm">
                                                            Total Income:
                                                        </h1>
                                                        <p className="text-base font-medium text-slate-900">
                                                        {parseFloat(totalIncome).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <h1 className="font-medium text-sm">
                                                            Shwapno’s Profit:
                                                        </h1>
                                                        <p className={`text-base font-medium ${ (shwapnoMPBT <= 0) ?"text-red-500": "text-green-500"}`}>
                                                            {shwapnoMPBT.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <h1 className="font-medium text-sm">
                                                            Investor Profit:
                                                        </h1>
                                                        <p className={`text-base font-medium ${ (partnerMPBT <= 0) ?"text-red-500": "text-green-500"}`}>
                                                            {partnerMPBT.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    
                                                    
                                                </div>
                                                   { (shwapnoMPBT <= 0 || partnerMPBT <= 0) &&<div
                                                        id="alert-border-4"
                                                        className="flex shadow items-center p-3 my-4 text-red-800 border-t-4 border-red-300 bg-red-50"
                                                        role="alert"
                                                    >
                                                        <svg
                                                            className="flex-shrink-0 w-4 h-4"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                                        </svg>
                                                        <div className="ms-3 text-sm font-medium">
                                                            Your site does not meet
                                                            the standard feasibility
                                                        </div>
                                                    </div>}
                                            
                                            </>
                                        )}
                                    <button
                                        onClick={() => handleFullSubmit()}
                                        className="w-full bg-green-500 text-white py-2 px-4 rounded"
                                    >
                                        Submit Site
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex items-center mb-4">
                        <Toaster position="top-right" reverseOrder={false} />
                        {/* <IoIosArrowRoundBack className="w-10 h-10" /> */}
                        <img
                            src={funnelIcon}
                            className="w-8 h-8"
                            alt="funnel img"
                        />
                        <h2 className="p-2 text-base font-medium ">
                            Feasibility Questionnaire
                        </h2>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Population Density/Residential Area
                        </label>
                        <select
                            name="populationDensity"
                            value={formData.populationDensity}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        >
                            <option value="">Select</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            House Rent/Income Level
                        </label>
                        <select
                            name="houseRent"
                            value={formData.houseRent}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Select</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Market/Bazar/Shopping Mall/Other Brands
                        </label>
                        <select
                            name="marketProximity"
                            value={formData.marketProximity}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Select</option>
                            <option value="Within Bazar">Within Bazar</option>
                            <option value="Near Bazar">Near Bazar</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Avg. Sales of Departmental Stores
                        </label>
                        <input
                            type="number"
                            name="avgSales"
                            value={formData.avgSales}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Road Status
                        </label>
                        <select
                            name="roadStatus"
                            value={formData.roadStatus}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Select</option>
                            <option value="Main Road">Main Road</option>
                            <option value="Support Road">Support Road</option>
                            <option value="Block">Block</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Mosque/Mandir/Girza
                        </label>
                        <input
                            type="number"
                            name="mosqueCount"
                            value={formData.mosqueCount}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            School/College/University
                        </label>
                        <input
                            type="number"
                            name="schoolCount"
                            value={formData.schoolCount}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Bank/Office/ATM BOOTH
                        </label>
                        <input
                            type="number"
                            name="bankCount"
                            value={formData.bankCount}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Competitor Presence with Avg Sales
                        </label>
                        <input
                            type="number"
                            name="competitorSales"
                            value={formData.competitorSales}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Front Face
                        </label>
                        <input
                            type="number"
                            name="frontFace"
                            value={formData.frontFace}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            CNG, Bus, Train Station/ Pick & Drop
                        </label>
                        <select
                            name="transportAvailability"
                            value={formData.transportAvailability}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Signboard Visibility
                        </label>
                        <select
                            name="signboardVisibility"
                            value={formData.signboardVisibility}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        >
                            <option value="">Select</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
                            Hotel & Restaurant & Hospital/ Club
                        </label>
                        <input
                            type="number"
                            name="hotelCount"
                            value={formData.hotelCount}
                            onChange={handlefeasibiltyChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div
                        onClick={() => setTogglefeasibiltyForm(false)}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded text-center my-4"
                    >
                        Go Back
                    </div>
                    <button
                        onClick={modalOpen}
                        className="w-full bg-green-500 text-white py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            )}
        </>
    );
};

export default CreateSite;
