/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import siteStoreIcon from "../assets/icons/landmark.png";
import toast, { Toaster } from "react-hot-toast";
// import { useParams } from "react-router-dom";
import Map from "./Map";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useActivity from "../hooks/useActivity";
const jsonData = [
  {
    Division: "Barisal",
    Zila: "Barguna",
    Upazila: "Amtali",
  },
  {
    Division: "Barisal",
    Zila: "Barguna",
    Upazila: "Bamna",
  },
  {
    Division: "Barisal",
    Zila: "Barguna",
    Upazila: "Barguna Sadar",
  },
  {
    Division: "Barisal",
    Zila: "Barguna",
    Upazila: "Betagi",
  },
  {
    Division: "Barisal",
    Zila: "Barguna",
    Upazila: "Patharghata",
  },
  {
    Division: "Barisal",
    Zila: "Barguna",
    Upazila: "Taltali",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Agailjhara",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Babuganj",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Bakerganj",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Banari Para",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Gaurnadi",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Hizla",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Barisal Sadar (Kotwali)",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Mhendiganj",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Muladi",
  },
  {
    Division: "Barisal",
    Zila: "Barisal",
    Upazila: "Wazirpur",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Bhola Sadar",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Burhanuddin",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Char Fasson",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Daulat Khan",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Lalmohan",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Manpura",
  },
  {
    Division: "Barisal",
    Zila: "Bhola",
    Upazila: "Tazumuddin",
  },
  {
    Division: "Barisal",
    Zila: "Jhalokati",
    Upazila: "Jhalokati Sadar",
  },
  {
    Division: "Barisal",
    Zila: "Jhalokati",
    Upazila: "Kanthalia",
  },
  {
    Division: "Barisal",
    Zila: "Jhalokati",
    Upazila: "Nalchity",
  },
  {
    Division: "Barisal",
    Zila: "Jhalokati",
    Upazila: "Rajapur",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Bauphal",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Dashmina",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Dumki",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Galachipa",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Kalapara",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Mirzaganj",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Patuakhali Sadar",
  },
  {
    Division: "Barisal",
    Zila: "Patuakhali",
    Upazila: "Rangabali",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Bhandaria",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Kawkhali",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Mathbaria",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Nazirpur",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Pirojpur Sadar",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Nesarabad (Swarupkati)",
  },
  {
    Division: "Barisal",
    Zila: "Pirojpur",
    Upazila: "Zianagar",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Alikadam",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Bandarban Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Lama",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Naikhongchhari",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Rowangchhari",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Ruma",
  },
  {
    Division: "Chittagong",
    Zila: "Bandarban",
    Upazila: "Thanchi",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Akhaura",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Banchharampur",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Bijoynagar",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Brahmanbaria Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Ashuganj",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Kasba",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Nabinagar",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Nasirnagar",
  },
  {
    Division: "Chittagong",
    Zila: "Brahmanbaria",
    Upazila: "Sarail",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Chandpur Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Faridganj",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Haim Char",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Hajiganj",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Kachua",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Matlab Dakshin",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Matlab Uttar",
  },
  {
    Division: "Chittagong",
    Zila: "Chandpur",
    Upazila: "Shahrasti",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Anowara",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Bayejid Bostami",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Banshkhali",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Bakalia",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Boalkhali",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Chandanaish",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Chandgaon",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Chittagong Port",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Double Mooring",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Fatikchhari",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Halishahar",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Hathazari",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Kotwali",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Khulshi",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Lohagara",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Mirsharai",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Pahartali",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Panchlaish",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Patiya",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Patenga",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Rangunia",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Raozan",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Sandwip",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Satkania",
  },
  {
    Division: "Chittagong",
    Zila: "Chittagong",
    Upazila: "Sitakunda",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Barura",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Brahman Para",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Burichang",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Chandina",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Chauddagram",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Comilla Sadar Dakshin",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Daudkandi",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Debidwar",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Homna",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Comilla Adarsha Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Laksam",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Manoharganj",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Meghna",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Muradnagar",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Nangalkot",
  },
  {
    Division: "Chittagong",
    Zila: "Comilla",
    Upazila: "Titas",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Chakaria",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Cox'S Bazar Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Kutubdia",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Maheshkhali",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Pekua",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Ramu",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Teknaf",
  },
  {
    Division: "Chittagong",
    Zila: "Cox'S Bazar",
    Upazila: "Ukhia",
  },
  {
    Division: "Chittagong",
    Zila: "Feni",
    Upazila: "Chhagalnaiya",
  },
  {
    Division: "Chittagong",
    Zila: "Feni",
    Upazila: "Daganbhuiyan",
  },
  {
    Division: "Chittagong",
    Zila: "Feni",
    Upazila: "Feni Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Feni",
    Upazila: "Fulgazi",
  },
  {
    Division: "Chittagong",
    Zila: "Feni",
    Upazila: "Parshuram",
  },
  {
    Division: "Chittagong",
    Zila: "Feni",
    Upazila: "Sonagazi",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Dighinala",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Khagrachhari Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Lakshmichhari",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Mahalchhari",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Manikchhari",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Matiranga",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Panchhari",
  },
  {
    Division: "Chittagong",
    Zila: "Khagrachari",
    Upazila: "Ramgarh",
  },
  {
    Division: "Chittagong",
    Zila: "Lakshmipur",
    Upazila: "Kamalnagar",
  },
  {
    Division: "Chittagong",
    Zila: "Lakshmipur",
    Upazila: "Lakshmipur Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Lakshmipur",
    Upazila: "Roypur",
  },
  {
    Division: "Chittagong",
    Zila: "Lakshmipur",
    Upazila: "Ramganj",
  },
  {
    Division: "Chittagong",
    Zila: "Lakshmipur",
    Upazila: "Ramgati",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Begumganj",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Chatkhil",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Companiganj",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Hatiya",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Kabirhat",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Senbagh",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Sonaimuri",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Subarnachar",
  },
  {
    Division: "Chittagong",
    Zila: "Noakhali",
    Upazila: "Noakhali Sadar",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Baghaichhari",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Barkal Upazila",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Kawkhali (Betbunia)",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Belai Chhari  Upazi",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Kaptai  Upazila",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Jurai Chhari Upazil",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Langadu  Upazila",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Naniarchar  Upazila",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Rajasthali  Upazila",
  },
  {
    Division: "Chittagong",
    Zila: "Rangamati",
    Upazila: "Rangamati Sadar  Up",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Adabor",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Badda",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Bangshal",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Biman Bandar",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Banani",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Cantonment",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Chak Bazar",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Dakshinkhan",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Darus Salam",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Demra",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Dhamrai",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Dhanmondi",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Dohar",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Bhasan Tek",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Bhatara",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Gendaria",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Gulshan",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Hazaribagh",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Jatrabari",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Kafrul",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Kadamtali",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Kalabagan",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Kamrangir Char",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Khilgaon",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Khilkhet",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Keraniganj",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Kotwali",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Lalbagh",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Mirpur",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Mohammadpur",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Motijheel",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Mugda Para",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Nawabganj",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "New Market",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Pallabi",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Paltan",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Ramna",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Rampura",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Sabujbagh",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Rupnagar",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Savar",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Shahjahanpur",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Shah Ali",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Shahbagh",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Shyampur",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Sher-E-Bangla Nagar",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Sutrapur",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Tejgaon",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Tejgaon Ind. Area",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Turag",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Uttara  Paschim",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Uttara  Purba",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Uttar Khan",
  },
  {
    Division: "Dhaka",
    Zila: "Dhaka",
    Upazila: "Wari",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Alfadanga",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Bhanga",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Boalmari",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Char Bhadrasan",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Faridpur Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Madhukhali",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Nagarkanda",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Sadarpur",
  },
  {
    Division: "Dhaka",
    Zila: "Faridpur",
    Upazila: "Saltha",
  },
  {
    Division: "Dhaka",
    Zila: "Gazipur",
    Upazila: "Gazipur Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Gazipur",
    Upazila: "Kaliakair",
  },
  {
    Division: "Dhaka",
    Zila: "Gazipur",
    Upazila: "Kaliganj",
  },
  {
    Division: "Dhaka",
    Zila: "Gazipur",
    Upazila: "Kapasia",
  },
  {
    Division: "Dhaka",
    Zila: "Gazipur",
    Upazila: "Sreepur",
  },
  {
    Division: "Dhaka",
    Zila: "Gopalganj",
    Upazila: "Gopalganj Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Gopalganj",
    Upazila: "Kashiani",
  },
  {
    Division: "Dhaka",
    Zila: "Gopalganj",
    Upazila: "Kotalipara",
  },
  {
    Division: "Dhaka",
    Zila: "Gopalganj",
    Upazila: "Muksudpur",
  },
  {
    Division: "Dhaka",
    Zila: "Gopalganj",
    Upazila: "Tungipara",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Bakshiganj",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Dewanganj",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Islampur",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Jamalpur Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Madarganj",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Melandaha",
  },
  {
    Division: "Dhaka",
    Zila: "Jamalpur",
    Upazila: "Sarishabari Upazila",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Austagram",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Bajitpur",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Bhairab",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Hossainpur",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Itna",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Karimganj",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Katiadi",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Kishoreganj Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Kuliar Char",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Mithamain",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Nikli",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Pakundia",
  },
  {
    Division: "Dhaka",
    Zila: "Kishoregonj",
    Upazila: "Tarail",
  },
  {
    Division: "Dhaka",
    Zila: "Madaripur",
    Upazila: "Kalkini",
  },
  {
    Division: "Dhaka",
    Zila: "Madaripur",
    Upazila: "Madaripur Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Madaripur",
    Upazila: "Rajoir",
  },
  {
    Division: "Dhaka",
    Zila: "Madaripur",
    Upazila: "Shibchar",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Daulatpur",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Ghior",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Harirampur",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Manikganj Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Saturia",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Shibalaya",
  },
  {
    Division: "Dhaka",
    Zila: "Manikganj",
    Upazila: "Singair",
  },
  {
    Division: "Dhaka",
    Zila: "Munshiganj",
    Upazila: "Gazaria",
  },
  {
    Division: "Dhaka",
    Zila: "Munshiganj",
    Upazila: "Lohajang",
  },
  {
    Division: "Dhaka",
    Zila: "Munshiganj",
    Upazila: "Munshiganj Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Munshiganj",
    Upazila: "Serajdikhan",
  },
  {
    Division: "Dhaka",
    Zila: "Munshiganj",
    Upazila: "Sreenagar",
  },
  {
    Division: "Dhaka",
    Zila: "Munshiganj",
    Upazila: "Tongibari",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Bhaluka",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Dhobaura",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Fulbaria",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Gaffargaon",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Gauripur",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Haluaghat",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Ishwarganj",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Mymensingh Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Muktagachha",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Nandail",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Phulpur",
  },
  {
    Division: "Dhaka",
    Zila: "Mymensingh",
    Upazila: "Trishal",
  },
  {
    Division: "Dhaka",
    Zila: "Narayanganj",
    Upazila: "Araihazar",
  },
  {
    Division: "Dhaka",
    Zila: "Narayanganj",
    Upazila: "Sonargaon",
  },
  {
    Division: "Dhaka",
    Zila: "Narayanganj",
    Upazila: "Bandar",
  },
  {
    Division: "Dhaka",
    Zila: "Narayanganj",
    Upazila: "Narayanganj Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Narayanganj",
    Upazila: "Rupganj",
  },
  {
    Division: "Dhaka",
    Zila: "Narsingdi",
    Upazila: "Belabo",
  },
  {
    Division: "Dhaka",
    Zila: "Narsingdi",
    Upazila: "Manohardi",
  },
  {
    Division: "Dhaka",
    Zila: "Narsingdi",
    Upazila: "Narsingdi Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Narsingdi",
    Upazila: "Palash",
  },
  {
    Division: "Dhaka",
    Zila: "Narsingdi",
    Upazila: "Roypura",
  },
  {
    Division: "Dhaka",
    Zila: "Narsingdi",
    Upazila: "Shibpur",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Atpara",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Barhatta",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Durgapur",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Khaliajuri",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Kalmakanda",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Kendua",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Madan",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Mohanganj",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Netrokona Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Netrakona",
    Upazila: "Purbadhala",
  },
  {
    Division: "Dhaka",
    Zila: "Rajbari",
    Upazila: "Baliakandi",
  },
  {
    Division: "Dhaka",
    Zila: "Rajbari",
    Upazila: "Goalanda",
  },
  {
    Division: "Dhaka",
    Zila: "Rajbari",
    Upazila: "Kalukhali",
  },
  {
    Division: "Dhaka",
    Zila: "Rajbari",
    Upazila: "Pangsha",
  },
  {
    Division: "Dhaka",
    Zila: "Rajbari",
    Upazila: "Rajbari Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Shariatpur",
    Upazila: "Bhedarganj",
  },
  {
    Division: "Dhaka",
    Zila: "Shariatpur",
    Upazila: "Damudya",
  },
  {
    Division: "Dhaka",
    Zila: "Shariatpur",
    Upazila: "Gosairhat",
  },
  {
    Division: "Dhaka",
    Zila: "Shariatpur",
    Upazila: "Naria",
  },
  {
    Division: "Dhaka",
    Zila: "Shariatpur",
    Upazila: "Shariatpur Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Shariatpur",
    Upazila: "Zanjira",
  },
  {
    Division: "Dhaka",
    Zila: "Sherpur",
    Upazila: "Jhenaigati",
  },
  {
    Division: "Dhaka",
    Zila: "Sherpur",
    Upazila: "Nakla",
  },
  {
    Division: "Dhaka",
    Zila: "Sherpur",
    Upazila: "Nalitabari",
  },
  {
    Division: "Dhaka",
    Zila: "Sherpur",
    Upazila: "Sherpur Sadar",
  },
  {
    Division: "Dhaka",
    Zila: "Sherpur",
    Upazila: "Sreebardi",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Basail",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Bhuapur",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Delduar",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Dhanbari",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Ghatail",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Gopalpur",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Kalihati",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Madhupur",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Mirzapur",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Nagarpur",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Sakhipur",
  },
  {
    Division: "Dhaka",
    Zila: "Tangail",
    Upazila: "Tangail Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Bagerhat Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Chitalmari",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Fakirhat",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Kachua",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Mollahat",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Mongla",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Morrelganj",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Rampal",
  },
  {
    Division: "Khulna",
    Zila: "Bagerhat",
    Upazila: "Sarankhola",
  },
  {
    Division: "Khulna",
    Zila: "Chuadanga",
    Upazila: "Alamdanga",
  },
  {
    Division: "Khulna",
    Zila: "Chuadanga",
    Upazila: "Chuadanga Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Chuadanga",
    Upazila: "Damurhuda",
  },
  {
    Division: "Khulna",
    Zila: "Chuadanga",
    Upazila: "Jiban Nagar",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Abhaynagar",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Bagher Para",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Chaugachha",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Jhikargachha",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Keshabpur",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Jessore Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Manirampur",
  },
  {
    Division: "Khulna",
    Zila: "Jashore",
    Upazila: "Sharsha",
  },
  {
    Division: "Khulna",
    Zila: "Jhenaidah",
    Upazila: "Harinakunda",
  },
  {
    Division: "Khulna",
    Zila: "Jhenaidah",
    Upazila: "Jhenaidah Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Jhenaidah",
    Upazila: "Kaliganj",
  },
  {
    Division: "Khulna",
    Zila: "Jhenaidah",
    Upazila: "Kotchandpur",
  },
  {
    Division: "Khulna",
    Zila: "Jhenaidah",
    Upazila: "Maheshpur",
  },
  {
    Division: "Khulna",
    Zila: "Jhenaidah",
    Upazila: "Shailkupa",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Batiaghata",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Dacope",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Daulatpur",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Dumuria",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Dighalia",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Khalishpur",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Khan Jahan Ali",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Khulna Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Koyra",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Paikgachha",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Phultala",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Rupsa",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Sonadanga",
  },
  {
    Division: "Khulna",
    Zila: "Khulna",
    Upazila: "Terokhada",
  },
  {
    Division: "Khulna",
    Zila: "Kushtia",
    Upazila: "Bheramara",
  },
  {
    Division: "Khulna",
    Zila: "Kushtia",
    Upazila: "Daulatpur",
  },
  {
    Division: "Khulna",
    Zila: "Kushtia",
    Upazila: "Khoksa",
  },
  {
    Division: "Khulna",
    Zila: "Kushtia",
    Upazila: "Kumarkhali",
  },
  {
    Division: "Khulna",
    Zila: "Kushtia",
    Upazila: "Kushtia Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Kushtia",
    Upazila: "Mirpur",
  },
  {
    Division: "Khulna",
    Zila: "Magura",
    Upazila: "Magura Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Magura",
    Upazila: "Mohammadpur",
  },
  {
    Division: "Khulna",
    Zila: "Magura",
    Upazila: "Shalikha",
  },
  {
    Division: "Khulna",
    Zila: "Magura",
    Upazila: "Sreepur",
  },
  {
    Division: "Khulna",
    Zila: "Meherpur",
    Upazila: "Gangni",
  },
  {
    Division: "Khulna",
    Zila: "Meherpur",
    Upazila: "Mujib Nagar",
  },
  {
    Division: "Khulna",
    Zila: "Meherpur",
    Upazila: "Meherpur Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Narail",
    Upazila: "Kalia",
  },
  {
    Division: "Khulna",
    Zila: "Narail",
    Upazila: "Lohagara",
  },
  {
    Division: "Khulna",
    Zila: "Narail",
    Upazila: "Narail Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Assasuni",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Debhata",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Kalaroa",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Kaliganj",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Satkhira Sadar",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Shyamnagar",
  },
  {
    Division: "Khulna",
    Zila: "Satkhira",
    Upazila: "Tala",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Adamdighi",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Bogra Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Dhunat",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Dhupchanchia",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Gabtali",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Kahaloo",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Nandigram",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Sariakandi",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Shajahanpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Sherpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Shibganj",
  },
  {
    Division: "Rajshahi",
    Zila: "Bogra",
    Upazila: "Sonatola",
  },
  {
    Division: "Rajshahi",
    Zila: "Joypurhat",
    Upazila: "Akkelpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Joypurhat",
    Upazila: "Joypurhat Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Joypurhat",
    Upazila: "Kalai",
  },
  {
    Division: "Rajshahi",
    Zila: "Joypurhat",
    Upazila: "Khetlal",
  },
  {
    Division: "Rajshahi",
    Zila: "Joypurhat",
    Upazila: "Panchbibi",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Atrai",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Badalgachhi",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Dhamoirhat",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Manda",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Mahadebpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Naogaon Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Niamatpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Patnitala",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Porsha",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Raninagar",
  },
  {
    Division: "Rajshahi",
    Zila: "Naogaon",
    Upazila: "Sapahar",
  },
  {
    Division: "Rajshahi",
    Zila: "Natore",
    Upazila: "Bagatipara",
  },
  {
    Division: "Rajshahi",
    Zila: "Natore",
    Upazila: "Baraigram",
  },
  {
    Division: "Rajshahi",
    Zila: "Natore",
    Upazila: "Gurudaspur",
  },
  {
    Division: "Rajshahi",
    Zila: "Natore",
    Upazila: "Lalpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Natore",
    Upazila: "Natore Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Natore",
    Upazila: "Singra",
  },
  {
    Division: "Rajshahi",
    Zila: "Chapai Nababganj",
    Upazila: "Bholahat",
  },
  {
    Division: "Rajshahi",
    Zila: "Chapai Nababganj",
    Upazila: "Gomastapur",
  },
  {
    Division: "Rajshahi",
    Zila: "Chapai Nababganj",
    Upazila: "Nachole",
  },
  {
    Division: "Rajshahi",
    Zila: "Chapai Nababganj",
    Upazila: "Chapai Nababganj Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Chapai Nababganj",
    Upazila: "Shibganj",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Atgharia",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Bera",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Bhangura",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Chatmohar",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Faridpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Ishwardi",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Pabna Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Santhia",
  },
  {
    Division: "Rajshahi",
    Zila: "Pabna",
    Upazila: "Sujanagar",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Bagha",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Baghmara",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Boalia",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Charghat",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Durgapur",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Godagari",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Matihar",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Mohanpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Paba",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Puthia",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Rajpara",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Shah Makhdum",
  },
  {
    Division: "Rajshahi",
    Zila: "Rajshahi",
    Upazila: "Tanore",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Belkuchi",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Chauhali",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Kamarkhanda",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Kazipur",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Royganj",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Shahjadpur",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Sirajganj Sadar",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Tarash",
  },
  {
    Division: "Rajshahi",
    Zila: "Sirajganj",
    Upazila: "Ullah Para",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Birampur",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Birganj",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Biral",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Bochaganj",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Chirirbandar",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Fulbari",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Ghoraghat",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Hakimpur",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Kaharole",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Khansama",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Dinajpur Sadar",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Nawabganj",
  },
  {
    Division: "Rangpur",
    Zila: "Dinajpur",
    Upazila: "Parbatipur",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Fulchhari",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Gaibandha Sadar",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Gobindaganj",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Palashbari",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Sadullapur",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Saghata",
  },
  {
    Division: "Rangpur",
    Zila: "Gaibandha",
    Upazila: "Sundarganj",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Bhurungamari",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Char Rajibpur",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Chilmari",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Phulbari",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Kurigram Sadar",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Nageshwari",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Rajarhat",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Raumari",
  },
  {
    Division: "Rangpur",
    Zila: "Kurigram",
    Upazila: "Ulipur",
  },
  {
    Division: "Rangpur",
    Zila: "Lalmonirhat",
    Upazila: "Aditmari",
  },
  {
    Division: "Rangpur",
    Zila: "Lalmonirhat",
    Upazila: "Hatibandha",
  },
  {
    Division: "Rangpur",
    Zila: "Lalmonirhat",
    Upazila: "Kaliganj",
  },
  {
    Division: "Rangpur",
    Zila: "Lalmonirhat",
    Upazila: "Lalmonirhat Sadar",
  },
  {
    Division: "Rangpur",
    Zila: "Lalmonirhat",
    Upazila: "Patgram",
  },
  {
    Division: "Rangpur",
    Zila: "Nilphamari",
    Upazila: "Dimla Upazila",
  },
  {
    Division: "Rangpur",
    Zila: "Nilphamari",
    Upazila: "Domar Upazila",
  },
  {
    Division: "Rangpur",
    Zila: "Nilphamari",
    Upazila: "Jaldhaka Upazila",
  },
  {
    Division: "Rangpur",
    Zila: "Nilphamari",
    Upazila: "Kishoreganj Upazila",
  },
  {
    Division: "Rangpur",
    Zila: "Nilphamari",
    Upazila: "Nilphamari Sadar Upaz",
  },
  {
    Division: "Rangpur",
    Zila: "Nilphamari",
    Upazila: "Saidpur Upazila",
  },
  {
    Division: "Rangpur",
    Zila: "Panchagarh",
    Upazila: "Atwari",
  },
  {
    Division: "Rangpur",
    Zila: "Panchagarh",
    Upazila: "Boda",
  },
  {
    Division: "Rangpur",
    Zila: "Panchagarh",
    Upazila: "Debiganj",
  },
  {
    Division: "Rangpur",
    Zila: "Panchagarh",
    Upazila: "Panchagarh Sadar",
  },
  {
    Division: "Rangpur",
    Zila: "Panchagarh",
    Upazila: "Tentulia",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Badarganj",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Gangachara",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Kaunia",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Rangpur Sadar",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Mitha Pukur",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Pirgachha",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Pirganj",
  },
  {
    Division: "Rangpur",
    Zila: "Rangpur",
    Upazila: "Taraganj",
  },
  {
    Division: "Rangpur",
    Zila: "Thakurgaon",
    Upazila: "Baliadangi",
  },
  {
    Division: "Rangpur",
    Zila: "Thakurgaon",
    Upazila: "Haripur",
  },
  {
    Division: "Rangpur",
    Zila: "Thakurgaon",
    Upazila: "Pirganj",
  },
  {
    Division: "Rangpur",
    Zila: "Thakurgaon",
    Upazila: "Ranisankail",
  },
  {
    Division: "Rangpur",
    Zila: "Thakurgaon",
    Upazila: "Thakurgaon Sadar",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Ajmiriganj",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Bahubal",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Baniachong",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Chunarughat",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Habiganj Sadar",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Lakhai",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Madhabpur",
  },
  {
    Division: "Sylhet",
    Zila: "Habiganj",
    Upazila: "Nabiganj",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Barlekha",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Juri",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Kamalganj",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Kulaura",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Maulvibazar Sadar",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Rajnagar",
  },
  {
    Division: "Sylhet",
    Zila: "Maulvibazar",
    Upazila: "Sreemangal",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Bishwambarpur",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Chhatak",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Dakshin Sunamganj",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Derai",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Dharampasha",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Dowarabazar",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Jagannathpur",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Jamalganj",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Sulla",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Sunamganj Sadar",
  },
  {
    Division: "Sylhet",
    Zila: "Sunamganj",
    Upazila: "Tahirpur",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Balaganj",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Beani Bazar",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Bishwanath",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Companiganj",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Dakshin Surma",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Fenchuganj",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Golapganj",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Gowainghat",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Jaintiapur",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Kanaighat",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Sylhet Sadar",
  },
  {
    Division: "Sylhet",
    Zila: "Sylhet",
    Upazila: "Zakiganj",
  },
];

const CreateSite = () => {
  const [landlords, setLandlords] = useState([]);
  const [missingFields, setMissingFields] = useState([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [formCoordinates, setFormCoordinates] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    sqft: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
    status: "site found",
    landlords: landlords,
    siteHistory: [
      { status: "site found", startTime: new Date(), endTime: new Date() },
    ],
    createdBy: user._id,
    location: [],
  };

  //   let { id } = useParams();
  const [data, setData] = useState(null);
  const api_url = process.env.REACT_APP_API_URL;
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  // eslint-disable-next-line
  const [selectedUpazila, setSelectedUpazila] = useState("");
  const { createActivity } = useActivity();


  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
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


  const filter = user.role === "admin"? {} : user.role !== "manager"?{ createdBy: user._id} :  {createdBy:user.employees}
  //   console.log(data);

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
      "askingAdvance",
      "askingRent",
      "premisesStructure",
      "estimatedHandoverDate",
      "division",
      "district",
      "upazila",
      // "thana",
      "address",
      //   "location",
    ];
    // console.log(values);
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

    try {
      const response = await fetch(`${api_url}/site/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: user.token,
        },
        body: JSON.stringify({ ...values, location: formCoordinates }),
      });

      const responseData = await response.json();
      if (responseData.status) {
        await createActivity(
          user._id,
          "site_create",
          `${user.name} created an site named: ${values.name}!`
        );
        console.log(responseData);
        navigate(-1);
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

  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <section className="padding-x">
      <div className="addInvestor font-poppins max-container">
        <div className="page-title pb-3 border-b-2 border-b-slate-500  flex justify-start items-center font-medium text-base font-poppins mt-5 gap-3">
          <img
            src={siteStoreIcon}
            alt="partner Acquisition Icon"
            className="md:w-8 md:h-8 w-6 h-6"
          />
          <p className="text-sm md:text-base font-semibold ">Create Site</p>
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
                value={values.landlords.length > 0 ? values.landlords[0] : ""}
                onChange={handleChange}
                className={`input-field ${
                  isFieldMissing("landlords")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              >
                <option value="">Select Landlord</option>
                {data.map((option) => (
                  <option
                    className="capitalize"
                    key={option.name}
                    value={option._id}
                  >
                    {option.customId} - {option.name}
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
              <label htmlFor="askingAdvance" className="mr-2">
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
              <label htmlFor="askingRent" className="mr-2">
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
            {/* premisesStructure */}
            <div className="flex items-center">
              <label htmlFor="premisesStructure" className="mr-2">
                Premises Structure
              </label>
              <input
                type="text"
                name="premisesStructure"
                value={values.premisesStructure}
                onChange={handleChange}
                placeholder="Premises Structure"
                className={`input-field ${
                  isFieldMissing("premisesStructure")
                    ? "border-red-500"
                    : "border-[#8D8D8D] "
                }`}
              />
            </div>
            {/* investmentBudget */}
            <div className="flex items-center">
              <label htmlFor="estimatedHandoverDate" className="mr-2">
                Estimated Handover Date
              </label>
              <input
                type="date"
                name="estimatedHandoverDate"
                value={values.estimatedHandoverDate}
                onChange={handleChange}
                placeholder="Estimated Handover Date"
                className={`input-field ${
                  isFieldMissing("estimatedHandoverDate")
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
                <option value="">Select Division</option>
                {/* {divisionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
                {Array.from(new Set(jsonData.map((item) => item.Division))).map(
                  (division, index) => (
                    <option key={index} value={division}>
                      {division}
                    </option>
                  )
                )}
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
                <option value="">Select District</option>
                {/* {districtOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
                {Array.from(
                  new Set(filteredDistricts.map((item) => item.Zila))
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
                <option value="">Select Upazila/Thana</option>
                {Array.from(
                  new Set(filteredUpazilas.map((item) => item.Upazila))
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
                  isFieldMissing("location") ? "border border-red-500" : ""
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

                <p> {formCoordinates
                  ? `Long ${formCoordinates?.longitude
                      ?.toString()
                      .slice(0, 7)}... Lat 
                      ${formCoordinates.latitude
                         ?.toString()
                      .slice(0, 7)}...
                      `
                  : "Set Location on Map"}</p>
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
                onChange={(e)=>setFormCoordinates({...formCoordinates, latitude:e.target.value})}
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
                onChange={(e)=>setFormCoordinates({...formCoordinates, longitude:e.target.value})}
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
            <Toaster position="top-right" reverseOrder={false} />
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
  );
};

export default CreateSite;
