import React, { useState } from "react";
import partnerAcquisitionIcon from "../assets/icons/partnerAcquisitionIcon.png";
import toast, { Toaster } from 'react-hot-toast';

import Map from "./Map";
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';


const AddLandlord = () => {
  const { user } = useAuth();
  const initialValues = {
   
    name: "",
    email: "",
    phone: "",
    age: "",
    dob: "",
    gender: "",
    // profession: "",
    // education: "",
    // investmentBudget: "",
    // possibleInvestmentDate: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    createdBy: user._id,
    location: [],
  };
  const api_url = process.env.REACT_APP_API_URL;
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [values, setValues] = useState(initialValues);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [missingFields, setMissingFields] = useState([]);


  const navigate = useNavigate();
  

  const [formCoordinates, setFormCoordinates] = useState(null);

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  


  const divisionOptions = [
    { label: "Barisal", value: "barisal" },
    { label: "Chittagong", value: "chittagong" },
    { label: "Dhaka", value: "dhaka" },
    { label: "Khulna", value: "khulna" },
    { label: "Rajshahi", value: "rajshahi" },
    { label: "Rangpur", value: "rangpur" },
    { label: "Sylhet", value: "sylhet" },
  ];

  // const divisionOptions = [
  //   { 
  //     label: "Barisal", 
  //   division: "barisal" 
  // },
  //   { 
  //     label: "Chittagong", 
  //     division: "chittagong" 
  //   },
  //   { 
  //     label: "Dhaka",
  //      division: "dhaka" 
  //     },
  //   { 
      
  //     label: "Khulna", 
  //     division: "khulna" 
  //   },
  //   { label: "Rajshahi", division: "rajshahi" },
  //   { label: "Rangpur", division: "rangpur" },
  //   { label: "Sylhet", division: "sylhet" },
  // ];

  const districtOptionsLabels = [
    "Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur",
    "Bandarban", "Brahmanbaria", "Chandpur", "Chittagong", "Comilla", "Cox's Bazar",
    "Feni", "Khagrachari", "Lakshmipur", "Noakhali", "Rangamati", "Dhaka",
    "Faridpur", "Gazipur", "Gopalganj", "Jamalpur", "Kishoreganj", "Madaripur",
    "Manikganj", "Munshiganj", "Mymensingh", "Narayanganj", "Narsingdi", "Netrakona",
    "Rajbari", "Shariatpur", "Sherpur", "Tangail", "Bagerhat", "Chuadanga", "Jashore",
    "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira",
    "Bogra", "Joypurhat", "Naogaon", "Natore", "Chapai Nababganj", "Pabna", "Rajshahi",
    "Sirajganj", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari",
    "Panchagarh", "Rangpur", "Thakurgaon", "Habiganj", "Maulvibazar", "Sunamganj", "Sylhet"
  ];
  

  const districtOptions = districtOptionsLabels.map(district => ({
    label: district,
    value: district.toLowerCase().replace(/ /g, "_")
  })).sort((a, b) => a.label.localeCompare(b.label));;


  const upazilaOptionsLabels = [
    "Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali",
    "Agailjhara", "Babuganj", "Bakerganj", "Banari Para", "Gaurnadi", "Hizla",
    "Barisal Sadar (Kotwali)", "Mhendiganj", "Muladi", "Wazirpur",
    "Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulat Khan", "Lalmohan",
    "Manpura", "Tazumuddin", "Jhalokati Sadar", "Kanthalia", "Nalchity",
    "Rajapur", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara",
    "Mirzaganj", "Patuakhali Sadar", "Rangabali", "Bhandaria", "Kawkhali",
    "Mathbaria", "Nazirpur", "Pirojpur Sadar", "Nesarabad (Swarupkati)",
    "Zianagar", "Alikadam", "Bandarban Sadar", "Lama", "Naikhongchhari",
    "Rowangchhari", "Ruma", "Thanchi", "Akhaura", "Banchharampur", "Bijoynagar",
    "Brahmanbaria Sadar", "Ashuganj", "Kasba", "Nabinagar", "Nasirnagar",
    "Sarail", "Chandpur Sadar", "Faridganj", "Haim Char", "Hajiganj",
    "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti", "Anowara",
    "Bayejid Bostami", "Banshkhali", "Bakalia", "Boalkhali", "Chandanaish",
    "Chandgaon", "Chittagong Port", "Double Mooring", "Fatikchhari", "Halishahar",
    "Hathazari", "Kotwali", "Khulshi", "Lohagara", "Mirsharai", "Pahartali",
    "Panchlaish", "Patiya", "Patenga", "Rangunia", "Raozan", "Sandwip", "Satkania",
    "Sitakunda", "Barura", "Brahman Para", "Burichang", "Chandina",
    "Chauddagram", "Comilla Sadar Dakshin", "Daudkandi", "Debidwar", "Homna",
    "Comilla Adarsha Sadar", "Laksam", "Manoharganj", "Meghna", "Muradnagar",
    "Nangalkot", "Titas", "Chakaria", "Cox'S Bazar Sadar", "Kutubdia",
    "Maheshkhali", "Pekua", "Ramu", "Teknaf", "Ukhia", "Chhagalnaiya",
    "Daganbhuiyan", "Feni Sadar", "Fulgazi", "Parshuram", "Sonagazi",
    "Dighinala", "Khagrachhari Sadar", "Lakshmichhari", "Mahalchhari",
    "Manikchhari", "Matiranga", "Panchhari", "Ramgarh", "Kamalnagar",
    "Lakshmipur Sadar", "Roypur", "Ramganj", "Ramgati", "Begumganj", "Chatkhil",
    "Companiganj", "Hatiya", "Kabirhat", "Senbagh", "Sonaimuri", "Subarnachar",
    "Noakhali Sadar", "Baghaichhari", "Barkal Upazila", "Kawkhali (Betbunia)",
    "Belai Chhari  Upazi", "Kaptai  Upazila", "Jurai Chhari Upazil",
    "Langadu  Upazila", "Naniarchar  Upazila", "Rajasthali  Upazila",
    "Rangamati Sadar  Up", "Adabor", "Badda", "Bangshal", "Biman Bandar",
    "Banani", "Cantonment", "Chak Bazar", "Dakshinkhan", "Darus Salam",
    "Demra", "Dhamrai", "Dhanmondi", "Dohar", "Bhasan Tek", "Bhatara",
    "Gendaria", "Gulshan", "Hazaribagh", "Jatrabari", "Kafrul", "Kadamtali",
    "Kalabagan", "Kamrangir Char", "Khilgaon", "Khilkhet", "Keraniganj",
    "Lalbagh", "Mirpur", "Mohammadpur", "Motijheel", "Mugda Para", "Nawabganj",
    "New Market", "Pallabi", "Paltan", "Ramna", "Rampura", "Sabujbagh",
    "Rupnagar", "Savar", "Shahjahanpur", "Shah Ali", "Shahbagh", "Shyampur",
    "Sher-E-Bangla Nagar", "Sutrapur", "Tejgaon", "Tejgaon Ind. Area", "Turag",
    "Uttara  Paschim", "Uttara  Purba", "Uttar Khan", "Wari", "Alfadanga",
    "Bhanga", "Boalmari", "Char Bhadrasan", "Faridpur Sadar", "Madhukhali",
    "Nagarkanda", "Sadarpur", "Saltha", "Gazipur Sadar", "Kaliakair", "Kaliganj",
    "Kapasia", "Sreepur", "Gopalganj Sadar", "Kashiani", "Kotalipara",
    "Muksudpur", "Tungipara", "Bakshiganj", "Dewanganj", "Islampur",
    "Jamalpur Sadar", "Madarganj", "Melandaha", "Sarishabari Upazila",
    "Austagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj",
    "Katiadi", "Kishoreganj Sadar", "Kuliar Char", "Mithamain", "Nikli",
    "Pakundia", "Tarail", "Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar",
    "Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar", "Saturia",
    "Shibalaya", "Singair", "Gazaria", "Lohajang", "Munshiganj Sadar",
    "Serajdikhan", "Sreenagar", "Tongibari", "Bhaluka", "Dhobaura", "Fulbaria",
    "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Mymensingh Sadar",
    "Muktagachha", "Nandail", "Phulpur", "Trishal", "Araihazar", "Sonargaon",
    "Bandar", "Narayanganj Sadar", "Rupganj", "Belabo", "Manohardi",
    "Narsingdi Sadar", "Palash", "Roypura", "Shibpur", "Atpara", "Barhatta",
    "Durgapur", "Khaliajuri", "Kalmakanda", "Kendua", "Madan", "Mohanganj",
    "Netrokona Sadar", "Purbadhala", "Baliakandi", "Goalanda", "Kalukhali",
    "Pangsha", "Rajbari Sadar", "Bhedarganj", "Damudya", "Gosairhat", "Naria",
    "Shariatpur Sadar", "Zanjira", "Jhenaigati", "Nakla", "Nalitabari",
    "Sherpur Sadar", "Sreebardi", "Basail", "Bhuapur", "Delduar", "Dhanbari",
    "Ghatail", "Gopalpur", "Kalihati", "Madhupur", "Mirzapur", "Nagarpur",
    "Sakhipur", "Tangail Sadar", "Bagerhat Sadar", "Chitalmari", "Fakirhat",
    "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola", "Alamdanga",
    "Chuadanga Sadar", "Damurhuda", "Jiban Nagar", "Abhaynagar", "Bagher Para",
    "Chaugachha", "Jhikargachha", "Keshabpur", "Jessore Sadar", "Manirampur",
    "Sharsha", "Harinakunda", "Jhenaidah Sadar", "Kotchandpur", "Maheshpur",
    "Shailkupa", "Batiaghata", "Dacope", "Dumuria", "Dighalia", "Khalishpur",
    "Khan Jahan Ali", "Khulna Sadar", "Koyra", "Paikgachha", "Phultala",
    "Rupsa", "Sonadanga", "Terokhada", "Bheramara", "Khoksa", "Kumarkhali",
    "Kushtia Sadar", "Magura Sadar", "Shalikha", "Gangni", "Mujib Nagar",
    "Meherpur Sadar", "Kalia", "Narail Sadar", "Assasuni", "Debhata",
    "Kalaroa", "Satkhira Sadar", "Shyamnagar", "Tala", "Adamdighi", "Bogra Sadar",
    "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi",
    "Shajahanpur", "Sherpur", "Shibganj", "Sonatola", "Akkelpur", "Joypurhat Sadar",
    "Kalai", "Khetlal", "Panchbibi", "Atrai", "Badalgachhi", "Dhamoirhat",
    "Manda", "Mahadebpur", "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha",
    "Raninagar", "Sapahar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur",
    "Natore Sadar", "Singra", "Bholahat", "Gomastapur", "Nachole",
    "Chapai Nababganj Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar",
    "Faridpur", "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar", "Bagha",
    "Baghmara", "Boalia", "Charghat", "Godagari", "Matihar", "Mohanpur", "Paba",
    "Puthia", "Rajpara", "Shah Makhdum", "Tanore", "Belkuchi", "Chauhali",
    "Kamarkhanda", "Kazipur", "Royganj", "Shahjadpur", "Sirajganj Sadar",
    "Tarash", "Ullah Para", "Birampur", "Birganj", "Biral", "Bochaganj",
    "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama",
    "Dinajpur Sadar", "Parbatipur", "Fulchhari", "Gaibandha Sadar",
    "Gobindaganj", "Palashbari", "Sadullapur", "Saghata", "Sundarganj",
    "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Kurigram Sadar",
    "Nageshwari", "Rajarhat", "Raumari", "Ulipur", "Aditmari", "Hatibandha",
    "Lalmonirhat Sadar", "Patgram", "Dimla Upazila", "Domar Upazila",
    "Jaldhaka Upazila", "Kishoreganj Upazila", "Nilphamari Sadar Upaz",
    "Saidpur Upazila", "Atwari", "Boda", "Debiganj", "Panchagarh Sadar",
    "Tentulia", "Badarganj", "Gangachara", "Kaunia", "Rangpur Sadar",
    "Mitha Pukur", "Pirgachha", "Pirganj", "Taraganj", "Baliadangi", "Haripur",
    "Ranisankail", "Thakurgaon Sadar", "Ajmiriganj", "Bahubal", "Baniachong",
    "Chunarughat", "Habiganj Sadar", "Lakhai", "Madhabpur", "Nabiganj",
    "Barlekha", "Juri", "Kamalganj", "Kulaura", "Maulvibazar Sadar",
    "Rajnagar", "Sreemangal", "Bishwambarpur", "Chhatak", "Dakshin Sunamganj",
    "Derai", "Dharampasha", "Dowarabazar", "Jagannathpur", "Jamalganj",
    "Sulla", "Sunamganj Sadar", "Tahirpur", "Balaganj", "Beani Bazar",
    "Bishwanath", "Dakshin Surma", "Fenchuganj", "Golapganj", "Gowainghat",
    "Jaintiapur", "Kanaighat", "Sylhet Sadar", "Zakiganj"
  ];
  
  const upazilaOptions = upazilaOptionsLabels.map(upazila => ({
    label: upazila,
    value: upazila.toLowerCase().replace(/ /g, "_")
  })).sort((a, b) => a.label.localeCompare(b.label));

  const toggleScroll = () => {
    setScrollEnabled(!scrollEnabled);
    document.body.style.overflow = scrollEnabled ? "hidden" : "auto";
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });

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


  const handleSubmit = async (e) => {
    e.preventDefault();

        // Basic validation
        // Reset missingFields array
        setMissingFields([]);

        // Basic validation
        const requiredFields = [
            "name",
            "email",
            "phone",
            "age",
            "dob",
            "gender",
           
            "division",
            "district",
            "upazila",
            // "thana",
            "address",
            "location",
        ];
        console.log(values);
        const missing = requiredFields.filter(field => !values[field]);
        console.log({missing});
        if (missing.length > 0) {
            setMissingFields(missing);
            toast.error('Please fill in all required fields.');
            return;
        }
    
    try {

        const response = await fetch(`${api_url}/Landlord/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: user.token,
            },
            body: JSON.stringify({...values, location:formCoordinates}),
        });

        const responseData = await response.json();
        if (responseData.status) {

            console.log(responseData);
            navigate(-1);


        } else {
            console.log(response);
            console.error('Failed to submit form');
            toast.error(responseData.message)
        }

    } catch (error) {
        console.log(error);
        toast.error('There is a problem with the server!')
    }

};


console.log(missingFields);

const isFieldMissing = (fieldName) => {
  return missingFields.includes(fieldName);
};



  return (
    <section className="addInvestor   padding-x">
      <div className="page-title pb-3 border-b-2 border-b-slate-700  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
        <img
          src={partnerAcquisitionIcon}
          alt="partner Acquisition Icon"
          className="md:w-8 md:h-8 w-6 h-6"
        />
        <p className="text-sm md:text-base font-semibold ">
          Partner Acquisition - Add Landlord
        </p>
      </div>

      <form className="w-full max-w-lg mx-auto my-4 text-sm ">
        <div className="grid grid-cols-1 gap-4">
          {/* type */}
          <div className="flex items-center">
            <label htmlFor="type" className="mr-2">
              Type:
            </label>
            <p className=" py-1  rounded  w-full">Landlord</p>
          </div>
          {/* name */}
          <div className="flex items-center">
            <label htmlFor="name" className="mr-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Name"
              className={`input-field ${isFieldMissing('name') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            />
          </div>
          {/* email */}
          <div className="flex items-center">
            <label htmlFor="name" className="mr-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Email"
              className={`input-field ${isFieldMissing('email') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            />
          </div>
          {/* phone */}
          <div className="flex items-center">
            <label htmlFor="phone" className="mr-2">
              Phone:
            </label>
            <input
              type="number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={`input-field ${isFieldMissing('phone') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            />
          </div>
          {/* age */}
          <div className="flex items-center">
            <label htmlFor="age" className="mr-2">
              Age:
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={values.age}
              onChange={handleChange}
              placeholder="Age"
              className={`input-field ${isFieldMissing('age') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            />
          </div>
          {/* dob */}
          <div className="flex items-center">
            <label htmlFor="dob" className="mr-2">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              value={values.dob}
              onChange={handleChange}
              placeholder="dob"
              className={`input-field ${isFieldMissing('dob') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            />
          </div>
          {/* gender */}
          <div className="flex items-center">
            <label htmlFor="gender" className="mr-2">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              className={`input-field ${isFieldMissing('gender') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


          {/* division */}
          <div className="flex items-center">
            <label htmlFor="division" className="mr-2">
              Division:
            </label>
            <select
              name="division"
              value={values.division}
              onChange={handleChange}
              className={`input-field ${isFieldMissing('division') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            >
              <option value="">Select Division</option>
              {divisionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              onChange={handleChange}
              className={`input-field ${isFieldMissing('district') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            >
              <option value="">Select District</option>
              {districtOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              onChange={handleChange}
              className={`input-field ${isFieldMissing('upazila') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            >
              <option value="">Select Upazila/Thana</option>
              {upazilaOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
              className={`input-field ${isFieldMissing('address') ? 'border-red-500' : 'border-[#8D8D8D] '}`}
            />
          </div>
          <div
            onClick={() => handleMapModal()}
            className="flex items-center cursor-pointer"
          >
            <label htmlFor="location" className="mr-2">
              Location:
            </label>
            <div className="flex items-center justify-center rounded text-white gap-1 bg-green-500 w-full p-2">
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

              <p>Set Location on Map</p>
            </div>
          </div>
          <button onClick={(e) => handleSubmit(e)} className="bg-primary text-white p-3 font-medium rounded">
            Save & Continue
          </button>
          <Toaster
                    position="top-right"
                    reverseOrder={false}
                />
        </div>
      </form>

      {/* <div id="map"></div> */}
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
  );
};

export default AddLandlord;
