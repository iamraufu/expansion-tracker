import React, { useState } from "react";
// eslint-disable-next-line
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { TbCurrentLocation } from "react-icons/tb";

import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const customIcon = new Icon({
  // iconUrl: "https://cdn-icons-png.flaticon.com/512/7987/7987463.png",
  iconUrl: require("../assets/icons/marker.png"),
  iconSize: [30, 38],
});

const Map = ({ handleMapModal , setFormCoordinates, formCoordinates }) => {
  const [location, setLocation] = useState("");
  // eslint-disable-next-line
  const [siteName, setSiteName] = useState("");
  const [coordinates, setCoordinates] = useState(formCoordinates? formCoordinates : {
    latitude: 23.7644025,
    longitude: 90.389015,
  });
  // eslint-disable-next-line
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState(formCoordinates?[formCoordinates.latitude, formCoordinates.longitude]:[23.7644025, 90.389015]);

  const handleInputChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(
      `https://nominatim.openstreetmap.org/search?q=${location}&format=json`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const { lat, lon, name } = data[0];
          console.log(data);
          console.log({ latitude: lat, longitude: lon });
          setSiteName(name);
          setCoordinates({ latitude: lat, longitude: lon });
          setMapCenter([lat, lon]); // Update map center
          setError("");
        } else {
          setError("Location not found");
        }
      })
      .catch((error) => {
        setError("Error fetching data");
      });
  };

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        // setState your coords here
        // coords exist in "e.latlng.lat" and "e.latlng.lng"
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
        setCoordinates({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        setMapCenter([e.latlng.lat, e.latlng.lng])
      },
    });
    return false;
  }

  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current Latitude:", latitude);
          console.log("Current Longitude:", longitude);
          setCoordinates({
            latitude: latitude,
            longitude: longitude,
          })
          setMapCenter([latitude, longitude])
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSave = () => {
    setFormCoordinates(coordinates)
    handleMapModal()
  }


  return (
    <div className="w-full h-screen bg-white rounded text-sm relative overscroll-none">
      <div className="flex absolute z-40 w-full bg-white top-0 left-0 justify-between items-center ">
        <div className="flex justify-center items-center">   
          <form onSubmit={handleSubmit}>
            <input
              className="border border-slate-400 m-2 p-2 rounded"
              type="search"
              value={location}
              onChange={handleInputChange}
              placeholder="Search Location"
            />
              {/* {error && <p className="px-2">{error}</p>} */}
            {/* <button type="submit">Search</button> */}
          </form>
          <TbCurrentLocation onClick={getCurrentLocation} className="w-5 h-5 box-content  p-2 border bg-red-600 text-white rounded-md" />
        </div>
        <button className="mr-2 rounded-full bg-rose-500 p-[2px] text-white" onClick={() => handleMapModal()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      
        {/* {coordinates && (
          <p>
            Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
          </p>
        )} */}
      </div>
      <div className="w-full absolute  z-40   bottom-2 left-0 flex justify-center items-center">
        <button onClick={()=>handleSave()} className=" mr-3 py-3 w-11/12 rounded bg-blue-600 text-white font-poppins font-medium mx-2">Save Marker Coordinates</button>
      </div>
      {coordinates && (
        <MapContainer
          //   center={[coordinates.latitude, coordinates.longitude]}
          zoomControl={false}
          center={mapCenter}
          zoom={30}
          scrollWheelZoom={true}
          touchZoom={true}
          onClick={(e) => {
            console.log("sdsd");
            console.log("Latitude:", e.latlng.lat);
            console.log("Longitude:", e.latlng.lng);
          }}
        >
          <ChangeView center={mapCenter} zoom={30} />
          <MapEvents />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[coordinates.latitude, coordinates.longitude]}
            icon={customIcon}
          >
            {/* <Popup>{siteName}</Popup> */}
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
