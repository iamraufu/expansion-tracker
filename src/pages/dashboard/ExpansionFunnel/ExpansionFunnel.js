/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import funnelIcon from "../../../assets/icons/funnel.png";
import FunnelCard from "../../../components/Funnel/FunnelCard";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ExpansionFunnel = () => {
  const [, setData] = useState([]);
  const [siteData, setSiteData] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [funnledFinalData, setFunnledFinalData] = useState([]);
  const [activeFunnelData, setActiveFunnelData] = useState([]);
  const api_url = process.env.REACT_APP_API_URL;
  const [funnelDays, setfunnelDays] = useState([
    {
      level: 1,
      status: "site found",
      totalDays: 20 + 15 + 15 + 3 + 1 + 10 + 3 + 2 + 15 + 20 + 6 + 1,
      days: 20,
      percentage: 85,
    },
    {
      level: 2,
      status: "site negotiation",
      totalDays: 15 + 15 + 3 + 1 + 10 + 3 + 2 + 15 + 20 + 6 + 1,
      days: 15,
      percentage: 70,
    },
    {
      level: 3,
      status: "investor and site confirmation",
      totalDays: 15 + 3 + 1 + 10 + 3 + 2 + 15 + 20 + 6 + 1,
      days: 15,
      percentage: 50,
    },
    {
      level: 4,
      status: "feasibility study",
      totalDays: 3 + 1 + 10 + 3 + 2 + 15 + 20 + 6 + 1,
      days: 3,
      percentage: 90,
    },
    {
      level: 5,
      status: "RMIA validation",
      totalDays: 1 + 10 + 3 + 2 + 15 + 20 + 6 + 1,
      days: 1,
      percentage: 100,
    },

    {
      level: 6,
      status: "GMD approval",
      totalDays: 10 + 3 + 2 + 15 + 20 + 6 + 1,
      days: 10,
      percentage: 80,
    },
    {
      level: 7,
      status: "premises agreement",
      totalDays: 3 + 2 + 15 + 20 + 6 + 1,
      days: 3,
      percentage: 95,
    },
    {
      level: 8,
      status: "docs collected",
      totalDays: 3 + 2 + 15 + 20 + 6 + 1,
      days: 3,
      percentage: 95,
    },

    {
      level: 9,
      status: "layout approved",
      totalDays: 2 + 15 + 20 + 6 + 1,
      days: 2,
      percentage: 100,
    },
    {
      level: 10,
      status: "franchise agreement",
      totalDays: 15 + 20 + 6 + 1,
      days: 15,
      percentage: 95,
    },

    {
      level: 11,
      status: "civil work",
      totalDays: 20 + 6 + 1,
      days: 20,
      percentage: 100,
    },
    {
      level: 12,
      status: "equipment order",
      totalDays: 20 + 6 + 1,
      days: 20,
      percentage: 100,
    },
    {
      level: 13,
      status: "equipment installation",
      totalDays: 6 + 1,
      days: 6,
      percentage: 100,
    },
    {
      level: 14,
      status: "hr ready",
      totalDays: 1,
      days: 1,
      percentage: 100,
    },
    {
      level: 15,
      status: "product receiving",
      totalDays: 1,
      days: 1,
      percentage: 100,
    },
    {
      level: 16,
      status: "merchandising",
      totalDays: 1,
      days: 1,
      percentage: 100,
    },
    {
      level: 17,
      status: "branding",
      totalDays: 1,
      days: 1,
      percentage: 100,
    },
    {
      level: 18,
      status: "inauguration",
      totalDays: 0,
    },
    // {
    //   level: 19,
    //   status: "site complete",
    // },
  ]);
  const [individualSiteOpenings, setIndividualSiteOpenings] = useState([]);
  const [siteOpenings, setSiteOpenings] = useState([]);
  const [totalInv, setTotalInv] = useState(null);
  const [InvLed, setInvLed] = useState(null);
  const { user } = useAuth();

  // console.log(user);

  const filter =
    user.role === "admin"
      ? {}
      : user.role !== "manager"
      ? { createdBy: [user._id] }
      : { createdBy: user.employees };

  const fetchData = async () => {
    try {
      const response = await fetch(`${api_url}/services/statusCount`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: user.token,
        },
        body: JSON.stringify(filter),
      });
      const json = await response.json();
      // console.log(json);
      if (json.status) {
        setData(json.data);
        setFunnelData(json.funnelData);
        setActiveFunnelData(json.onlyFunnelData);
        setSiteData(json.allSites);
        setTotalInv(json.allIvestors);
        setInvLed(json.aggreedInvestors);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function getCountByStatus(status) {
    // console.log({ funnelData });
    const item = funnelData.find((entry) => entry.status === status);
    return item ? item.count : null; // Return null if status is not found
  }
  function getCountByStatusActive(status) {
    // console.log({ activeFunnelData });
    const item = activeFunnelData.find((entry) => entry.status === status);
    return item ? item.count : null; // Return null if status is not found
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // console.log({ funnelData });

  const blockDays = [
    {
      block: 1,
      days: 20,
      percentage: 85,
    },
    {
      block: 2,
      days: 15,
      percentage: 70,
    },
    {
      block: 3,
      days: 15,
      percentage: 50,
    },
    {
      block: 4,
      days: 3,
      percentage: 90,
    },
    {
      block: 5,
      days: 1,
      percentage: 100,
    },
    {
      block: 6,
      days: 10,
      percentage: 80,
    },
    {
      block: 7,
      days: 3,
      percentage: 95,
    },
    {
      block: 8,
      days: 2,
      percentage: 100,
    },
    {
      block: 9,
      days: 15,
      percentage: 95,
    },
    {
      block: 10,
      days: 20,
      percentage: 100,
    },
    {
      block: 11,
      days: 6,
      percentage: 100,
    },
    {
      block: 12,
      days: 1,
      percentage: 100,
    },
  ];

  useEffect(() => {
    if (siteData !== null) {
      const funnelFinal = (status, totalDays) => {
        if (status === "site found") {
          const sites = siteData.filter((item) => item.status === status);
          const statusWiseSites = sites.map((item) => {
            let hasPastOrgDate = false;
            // Add totalDays to statDate
            // Add totalDays to statDate
            const newDate = new Date(item.createdAt);
            // console.log({newDate});
            // newDate.setDate(newDate.getDate() + totalDays);
            // console.log({newDate});

            // Check if the newDate is in the past
            const currentDate = new Date();
            if (newDate < currentDate) {
              newDate.setTime(currentDate.getTime());
              hasPastOrgDate = true;
            }

            newDate.setDate(newDate.getDate() + totalDays);

            return {
              name: item.name,
              status: item.status,
              createdAt: item.createdAt,
              openingDate: newDate,
              hasPastOrgDate,
            };
          });

          

          return statusWiseSites;
        } else {
          let hasPastOrgDate = false;
          const sites = siteData.filter((item) => item.status === status);
          // console.log({sites});
          const statusWiseSites = sites.map((item) => {
            const stat = item.statusDetails.find(
              (item) => item.status === status
            );
            // Add totalDays to statDate
            const newDate = new Date(stat.updatedAt);
            if(status === "civil work"){
              console.log({old:newDate});
            }
            if(status === "civil work"){
              console.log({old:newDate});
            }
            // newDate.setDate(newDate.getDate() + totalDays);
            // console.log({newDate});
            // Check if the newDate is in the past
            const currentDate = new Date();
            if (newDate < currentDate) {
              newDate.setTime(currentDate.getTime());
              hasPastOrgDate = true;
            }

            newDate.setDate(newDate.getDate() + totalDays);

            return {
              name: item.name,
              status: item.status,
              createdAt: item.createdAt,
              openingDate: newDate,
              hasPastOrgDate,
            };
          });

          console.log({status,statusWiseSites});

          return statusWiseSites;
        }
      };

      let finalFunnelData = [];

      // console.log({ funnelDays });

      funnelDays.forEach((item) => {
        if (item.status !== "site complete") {
          finalFunnelData.push(funnelFinal(item.status, item.totalDays));
        }
      });


      function updateStatusCountsByMonth(monthData) {
        const statusLevels = {};

        // Build statusLevels map for quick lookup
        funnelDays.forEach((entry) => {
          statusLevels[entry.status] = entry.percentage;
        });

        function processStatus(status, count) {
          let currentStatus = status;
          let currentCount = count;

          while (currentStatus !== "inauguration") {
            // eslint-disable-next-line no-loop-func
            const level = funnelDays.find(
              // eslint-disable-next-line no-loop-func
              (entry) => entry.status === currentStatus
            );
            if (!level) break;

            const percentage = level.percentage;
            currentCount = currentCount * (percentage / 100);

            const nextLevelIndex = funnelDays.indexOf(level) + 1;
            if (nextLevelIndex >= funnelDays.length) break;

            currentStatus = funnelDays[nextLevelIndex].status;
          }

          return Math.round(currentCount);
        }

        const result = {};

        for (const [month, statuses] of Object.entries(monthData)) {
          result[month] = statuses.map(({ status, count }) => ({
            status,
            count: processStatus(status, count),
          }));
        }

        // console.log({ result });
        setFunnledFinalData(result);
      }

      const getMonthlySiteOpenings = (siteData) => {
        setIndividualSiteOpenings(siteData);

        // Function to group sites by opening month
        const groupByOpeningMonth = (sites) => {
          return sites.reduce((groups, site) => {
            const date = new Date(site.openingDate);
            const options = { year: "2-digit", month: "long" };
            const openingMonth = date.toLocaleDateString("en-US", options); // Format as 'Month Year'
            if (!groups[openingMonth]) {
              groups[openingMonth] = [];
            }
            groups[openingMonth].push(site);
            return groups;
          }, {});
        };

        const groupedSites = groupByOpeningMonth(siteData);
        // console.log({ groupedSites });

        const transformedData = {};

        for (const [month, sites] of Object.entries(groupedSites)) {
          const statusCounts = {};

          sites.forEach((site) => {
            const status = site.status;
            if (!statusCounts[status]) {
              statusCounts[status] = 0;
            }
            statusCounts[status]++;
          });

          transformedData[month] = Object.entries(statusCounts).map(
            ([status, count]) => ({
              status,
              count,
            })
          );
        }

        // console.log({ transformedData });

        updateStatusCountsByMonth(transformedData);

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const monthlyOpenings = {};

        siteData.forEach((item) => {
          if (item.openingDate) {
            const openingDate = new Date(item.openingDate);
            const month = openingDate.getUTCMonth();
            const year = openingDate.getUTCFullYear() % 100;
            const monthKey = `${monthNames[month]} ${year}`;

            // console.log({openingDate, month,monthKey});

            if (!monthlyOpenings[monthKey]) {
              monthlyOpenings[monthKey] = 0;
            }
            monthlyOpenings[monthKey]++;
          }
        });

        // console.log({monthlyOpenings});

        const result = Object.keys(monthlyOpenings).map((month) => ({
          month: month,
          totalSites: monthlyOpenings[month],
        }));

        return result;
      };

      console.log({finalFunnelData});
      console.log({finalFunnelData:  finalFunnelData.flat(Infinity)});

      const monthlySiteOpenings = getMonthlySiteOpenings(
        finalFunnelData.flat(Infinity)
      );


      console.log({monthlySiteOpenings});
      setSiteOpenings(monthlySiteOpenings);
    }
  }, [funnelDays, siteData]);

  function getTotalCountForMonth(month) {
    // console.log(month);
    // console.log(funnledFinalData);
    const monthData = funnledFinalData[month];
    if (!monthData) {
      return `No data available for month: ${month}`;
    }

    const totalCount = monthData.reduce((sum, item) => sum + item.count, 0);
    return totalCount;
  }

  if (siteData === null) {
    return <p>Loading...</p>;
  }

  // console.log({ siteOpenings });

  const getSiteLeftForNextStatus = (status, days, sendData = false) => {
    let siteLeftAfterTimeOver = 0;
    const currentDate = new Date();
    const stucksites = [];
    if (status !== "site found") {
      const sites = siteData.filter((item) => item.status === status);
      sites.forEach((item) => {
        const stat = item.statusDetails.find((item) => item.status === status);

        const statDate = new Date(stat.createdAt);
        const timeDifference = currentDate - statDate;
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );
        // console.log({ daysDifference, days });
        if (daysDifference > days) {
          // console.log("bartise");
          stucksites.push(item);
          siteLeftAfterTimeOver = siteLeftAfterTimeOver + 1;
        }
      });
      // console.log({ siteLeftAfterTimeOver });
    } else {
      const sites = siteData.filter((item) => item.status === status);
      // console.log({ status, sites });

      sites.forEach((item) => {
        const statDate = new Date(item.createdAt);
        const timeDifference = currentDate - statDate;
        const daysDifference = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );
        // console.log({ daysDifference, days });
        if (daysDifference > days) {
          // console.log("bartise");
          stucksites.push(item);
          siteLeftAfterTimeOver = siteLeftAfterTimeOver + 1;
        }
      });
    }

    // console.log("clicked");
    if (sendData) {
      console.log(stucksites);
      exportToExcel(
        stucksites,
        ["customId", "name", "division", "district", "address"],
        `stuck-list-for-${status}`
      );
      return stucksites;
    } else {
      return siteLeftAfterTimeOver;
    }
  };

  const getArrowValues = (blockNum) => {
    return blockDays.find((block) => block.block === blockNum) || null;
  };

  function parseMonth(monthString) {
    const [month, year] = monthString.split(" ");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthIndex = monthNames.indexOf(month);
    return new Date(parseInt(year, 10), monthIndex);
  }

  // Sort the siteOpenings array by month
  const sortedSiteOpenings = siteOpenings.sort(
    (a, b) => parseMonth(a.month) - parseMonth(b.month)
  );

  const exportToExcel = (jsonData, headers, fileName) => {
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Filter the JSON data based on the selected headers
    const filteredData = jsonData.map((item) =>
      headers.reduce((obj, header) => {
        obj[header] = item[header];
        return obj;
      }, {})
    );

    // Convert filtered data to worksheet
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Write workbook and create a Blob
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    // Save file
    saveAs(blob, `${fileName}.xlsx`);
  };

  const dynamicPercentage = (secondVal, firstVal) => {
    return (
      (getCountByStatus(secondVal) / getCountByStatus(firstVal)) *
      100
    ).toFixed(2);
  };

  // const findCommonCustomIds = (data, status1, status2) => {
  //   // Find the two objects based on the status
  //   const obj1 = data.find(item => item.status === status1);
  //   const obj2 = data.find(item => item.status === status2);

  //   if (!obj1 || !obj2) {
  //     return 0; // Return 0 if either status is not found
  //   }

  //   // Extract customIds from both 'sites' arrays
  //   const customIds1 = obj1.sites.map(site => site.customId);
  //   const customIds2 = obj2.sites.map(site => site.customId);

  //   // Find the common customIds
  //   const commonCustomIds = customIds1.filter(id => customIds2.includes(id));

  //   // Return the count of common customIds
  //   return commonCustomIds.length;
  // };

  const findAverageDaysBetweenStatuses = (data, status1, status2) => {
    const obj1 = data.find((item) => item.status === status1);
    const obj2 = data.find((item) => item.status === status2);

    if (!obj1 || !obj2) {
      return 0; // Return 0 if either status is not found
    }

    // Helper function to calculate difference in days
    const getDaysDifference = (date1, date2) => {
      const diffTime = Math.abs(new Date(date2) - new Date(date1));
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert time difference to days
    };

    // Collect all day differences for matching customIds
    const daysDifferences = obj1.sites.reduce((acc, site1) => {
      const site2 = obj2.sites.find((site) => site.customId === site1.customId);

      if (site2) {
        let status1CreatedAt;

        // Special case: If status1 is "site found", use createdAt from site1 directly
        if (status1 === "site found") {
          status1CreatedAt = site1.createdAt;
        } else {
          // Find status1 in statusDetails
          const status1Detail = site1.statusDetails.find(
            (detail) => detail.status === status1
          );
          if (status1Detail) {
            status1CreatedAt = status1Detail.createdAt;
          }
        }

        if (status1CreatedAt) {
          // Find createdAt for status2 from statusDetails in site2
          const status2Detail = site2.statusDetails.find(
            (detail) => detail.status === status2
          );
          if (status2Detail) {
            const status2CreatedAt = status2Detail.createdAt;
            const daysDifference = getDaysDifference(
              status1CreatedAt,
              status2CreatedAt
            );
            acc.push(daysDifference); // Add to the accumulator
          }
        }
      }

      return acc;
    }, []);

    // Calculate the average of days differences
    const averageDays =
      daysDifferences.reduce((sum, days) => sum + days, 0) /
      daysDifferences.length;

    return Math.ceil(averageDays) || 0; // Return 0 if no matching customIds
  };

  // console.log(findAverageDaysBetweenStatuses(funnelData, "site found","site negotiation"));

  return (
    <div className="p-4 px-5 font-poppins mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={funnelIcon} className="w-10 h-10" alt="funnel img" />
          <h2 className="p-4 text-xl font-medium">Expansion Funnel</h2>
        </div>
        <ul className=" p-4 ml-2 capitalize flex justify-center items-center gap-6">
          <li className="flex text-rose-600 font-semibold  justify-start items-center gap-4">
            <p className="w-2 h-2 rounded-full bg-rose-900"></p>
            <p>Lead Time</p>
          </li>
          <li className="flex font-semibold  justify-start items-center gap-2">
            <p className="w-2 h-2 bg-slate-950 rounded-full"></p>
            <p>Conversion Rate (%)</p>
          </li>
          <li className="flex font-semibold  justify-start items-center gap-2">
            <p className="w-2 h-2 bg-violet-700 rounded-full"></p>
            <p className="text-violet-600 font-bold">Dynamic Values</p>
          </li>
        </ul>
      </div>
      <hr className="mb-4 mt-2" />

      <section className="partner-accuisition overflow-auto p-4 px-5  bg-slate-50 text-sm  ">
        <div className="flex justify-between gap-3">
          {/* col 1 */}
          <div className="flex flex-col gap-4 uppercase">
            {/* card one investor lead to agreed invesotors */}
            <div className="inline-block p-4 bg-blue-100">
              <div className="flex  text-center justify-center gap-4">
                {/* start card */}
                <div className="bg-gray-400 w-full flex flex-col justify-center items-center px-5 py-2 rounded-md">
                  <p className="font-medium text-base text-yellow-300">
                    {totalInv}
                  </p>
                  <p className="font-medium text-white my-4">
                    Investor <br /> Lead
                  </p>
                </div>

                {/* arrow */}
                <div className="flex flex-col justify-center items-center">
                  <p className="font-semibold text-base text-rose-600">20</p>
                  <svg
                    width="70"
                    height="50"
                    viewBox="0 0 161 70"
                    fill="none"
                    className="rotate-180 w-12 h-12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="customArrow">
                      <rect
                        id="tail"
                        x="46"
                        y="24"
                        width="115"
                        height="23"
                        fill="#9CA3AF"
                      />
                      <path
                        id="head"
                        d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                        fill="#9CA3AF"
                      />
                    </g>
                  </svg>

                  <p className="font-semibold text-base">75%</p>
                </div>
                {/* end card */}
                <div className="bg-gray-400 w-full flex flex-col justify-center items-center px-5 py-6 rounded-md">
                  <p className="font-medium text-base text-yellow-300">
                    {InvLed}
                  </p>
                  <p className="font-medium text-white my-4">
                    Agreed <br />
                    Investors
                  </p>
                </div>
              </div>
            </div>

            {/* card two */}
            <div className="inline-block p-4 bg-blue-100">
              <div className="flex  text-center justify-center gap-4">
                {/* start card */}
                <div className="bg-gray-400 w-full flex flex-col justify-center items-center px-5 py-2 rounded-md">
                  <p className="font-medium text-yellow-300 text-base">
                    {getCountByStatusActive("site found")}
                    {getSiteLeftForNextStatus("site found", 20) !== 0 && (
                      <span
                        className="text-slate-800 cursor-pointer mx-1"
                        onClick={() =>
                          getSiteLeftForNextStatus("site found", 10, true)
                        }
                      >
                        ({getSiteLeftForNextStatus("site found", 10)})
                      </span>
                    )}
                  </p>
                  <p className="font-medium text-white my-4">
                    Site <br /> Found
                  </p>
                  {/* <p className="invisible ">Site Found</p> */}
                </div>

                {/* arrow */}
                <div className="flex flex-col justify-center items-center">
                  <p className="font-semibold text-base text-rose-600">
                    {getArrowValues(1).days}
                    <span className="text-violet-700 mx-1">
                      (
                      {findAverageDaysBetweenStatuses(
                        funnelData,
                        "site found",
                        "site negotiation"
                      )}
                      )
                    </span>
                  </p>
                  <svg
                    width="70"
                    height="50"
                    viewBox="0 0 161 70"
                    fill="none"
                    className="rotate-180 w-12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="customArrow">
                      <rect
                        id="tail"
                        x="46"
                        y="24"
                        width="115"
                        height="23"
                        fill="#9CA3AF"
                      />
                      <path
                        id="head"
                        d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                        fill="#9CA3AF"
                      />
                    </g>
                  </svg>

                  <p className="font-semibold text-base">
                    {getArrowValues(1).percentage}%
                  </p>
                  <span className="text-violet-700 mx-1 font-semibold text-base">
                    ({dynamicPercentage("site negotiation", "site found")})
                  </span>
                </div>
                {/* end card */}
                <div className="bg-gray-400 flex flex-col justify-center items-center px-5 py-6 rounded-md w-full">
                  <p className="font-medium text-yellow-300 text-base">
                    {getCountByStatusActive("site negotiation")}
                    {getSiteLeftForNextStatus("site negotiation", 15) !== 0 && (
                      <span
                        className="text-slate-800 cursor-pointer mx-1"
                        onClick={() =>
                          getSiteLeftForNextStatus("site negotiation", 15, true)
                        }
                      >
                        ({getSiteLeftForNextStatus("site negotiation", 15)})
                      </span>
                    )}
                  </p>
                  <p className="font-medium text-white my-4">
                    Site <br /> Negotiation
                  </p>
                </div>
              </div>
            </div>
            <p className="text-slate-900 font-medium text-base mt-4 capitalize">
              Upcoming Months Projection:
            </p>
            <div className="bg-emerald-700 p-3">
              <table className="table-fixed  ">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="px-4 py-4 whitespace-nowrap border border-x-slate-300">
                      Month
                    </th>
                    <th className="px-4 py-4 border border-x-slate-300  whitespace-nowrap">
                      Actual Sites
                    </th>
                    <th className="px-4 py-4  border  border-x-slate-300 whitespace-nowrap">
                      Projected Sites
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSiteOpenings.map((item, index) => (
                    <tr
                      key={index}
                      className="ml-2 justify-start bg-white items-center gap-3 font-medium text-slate-800 text-center"
                    >
                      <td className="border px-4 py-2 font-semibold uppercase whitespace-nowrap">
                        {item.month}
                      </td>
                      <td className="border px-4 py-2 text-red-500 font-semibold">
                        {item.totalSites.toString().padStart(2, "0")}
                      </td>
                      <td className="border px-4 py-2 text-red-500 font-semibold">
                        {getTotalCountForMonth(item.month)
                          .toString()
                          .padStart(2, "0")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="middleArrow self-center mb-44">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-base text-rose-600">
                {getArrowValues(2).days}
                <span className="text-violet-700 mx-1">
                  (
                  {findAverageDaysBetweenStatuses(
                    funnelData,
                    "site negotiation",
                    "investor and site confirmation"
                  )}
                  )
                </span>
              </p>
              <svg
                width="70"
                height="50"
                viewBox="0 0 161 70"
                fill="none"
                className="rotate-180 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="customArrow">
                  <rect
                    id="tail"
                    x="46"
                    y="24"
                    width="115"
                    height="23"
                    fill="#9CA3AF"
                  />
                  <path
                    id="head"
                    d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                    fill="#9CA3AF"
                  />
                </g>
              </svg>

              <p className="font-semibold text-base">
                {getArrowValues(2).percentage}%
              </p>
              <span className="text-violet-700 font-semibold text-base mx-1">
                (
                {dynamicPercentage(
                  "investor and site confirmation",
                  "site negotiation"
                )}
                )
              </span>
            </div>
          </div>
          {/* col 2 */}
          <div className="bg-lime-100 shadow text-center flex flex-col justify-center items-center px-5 py-2 rounded-xl">
            <p className="font-bold text-yellow-700">
              {getCountByStatusActive("investor and site confirmation")}
              {getSiteLeftForNextStatus(
                "investor and site confirmation",
                15
              ) !== 0 && (
                <span
                  className="text-slate-800 cursor-pointer mx-1"
                  onClick={() =>
                    getSiteLeftForNextStatus(
                      "investor and site confirmation",
                      15,
                      true
                    )
                  }
                >
                  (
                  {getSiteLeftForNextStatus(
                    "investor and site confirmation",
                    15
                  )}
                  )
                </span>
              )}
            </p>
            <p className=" text-slate-900 my-4 uppercase font-semibold">
              Investor <br /> & Site <br /> Confirmation
            </p>
            <p className="invisible ">Investor Lead</p>
          </div>

          <div className="middleArrow self-center">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-base text-rose-600">
                {getArrowValues(3).days}
                <span className="text-violet-700 mx-1">
                  (
                  {findAverageDaysBetweenStatuses(
                    funnelData,
                    "investor and site confirmation",
                    "feasibility study"
                  )}
                  )
                </span>
              </p>
              <svg
                width="70"
                height="50"
                viewBox="0 0 161 70"
                fill="none"
                className="rotate-180 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="customArrow">
                  <rect
                    id="tail"
                    x="46"
                    y="24"
                    width="115"
                    height="23"
                    fill="#9CA3AF"
                  />
                  <path
                    id="head"
                    d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                    fill="#9CA3AF"
                  />
                </g>
              </svg>
              <p className="font-semibold text-base">
                {getArrowValues(3).percentage}%
              </p>
              <span className="text-violet-700 mx-1 text-sm font-semibold">
                (
                {dynamicPercentage(
                  "feasibility study",
                  "investor and site confirmation"
                )}
                )
              </span>
            </div>
          </div>
          {/* col 3 */}
          <div className="bg-slate-300 flex flex-col justify-between rounded-xl text-center p-4">
            {/* small card 1 */}
            <FunnelCard
              duration={3}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"feasibility study"}
            />
            {/* middle arrow */}
            <div className="middleArrow self-center">
              <div className="flex justify-center items-center">
                <p className="font-semibold text-base text-rose-900 mr-2">
                  {getArrowValues(4).days}
                  <span className="text-violet-700 mx-1">
                    (
                    {findAverageDaysBetweenStatuses(
                      funnelData,
                      "feasibility study",
                      "RMIA validation"
                    )}
                    )
                  </span>
                </p>
                <svg
                  width="70"
                  height="50"
                  viewBox="0 0 161 70"
                  fill="none"
                  className="-rotate-90 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="customArrow">
                    <rect
                      id="tail"
                      x="46"
                      y="24"
                      width="115"
                      height="23"
                      fill="#638D67"
                    />
                    <path
                      id="head"
                      d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                      fill="#638D67"
                    />
                  </g>
                </svg>

                <p className="font-semibold text-base">
                  {getArrowValues(4).percentage}%
                  <div className="text-violet-700 mx-1 text-sm">
                    ({dynamicPercentage("RMIA validation", "feasibility study")}
                    )
                  </div>
                </p>
              </div>
            </div>
            {/* small card 2 */}
            <FunnelCard
              duration={1}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"RMIA validation"}
            />
            {/* middle arrow */}
            <div className="middleArrow self-center">
              <div className="flex justify-center items-center">
                <p className="font-semibold text-base text-rose-800 mr-2">
                  {getArrowValues(5).days}
                  <span className="text-violet-700 mx-1">
                    (
                    {findAverageDaysBetweenStatuses(
                      funnelData,
                      "RMIA validation",
                      "GMD approval"
                    )}
                    )
                  </span>
                </p>
                <svg
                  width="70"
                  height="50"
                  viewBox="0 0 161 70"
                  fill="none"
                  className="-rotate-90 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="customArrow">
                    <rect
                      id="tail"
                      x="46"
                      y="24"
                      width="115"
                      height="23"
                      fill="#638D67"
                    />
                    <path
                      id="head"
                      d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                      fill="#638D67"
                    />
                  </g>
                </svg>

                <p className="font-semibold text-base">
                  {getArrowValues(5).percentage}%
                  <div className="text-violet-700 mx-1 text-sm">
                    ({dynamicPercentage("GMD approval", "RMIA validation")})
                  </div>
                </p>
              </div>
            </div>
            {/* small card 3 */}
            <FunnelCard
              duration={10}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"GMD approval"}
            />
          </div>

          <div className="middleArrow self-center">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-base text-rose-600">
                {getArrowValues(6).days}
                <span className="text-violet-700 mx-1">
                  (
                  {findAverageDaysBetweenStatuses(
                    funnelData,
                    "GMD approval",
                    "premises agreement"
                  )}
                  )
                </span>
              </p>
              <svg
                width="70"
                height="50"
                viewBox="0 0 161 70"
                fill="none"
                className="rotate-180 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="customArrow">
                  <rect
                    id="tail"
                    x="46"
                    y="24"
                    width="115"
                    height="23"
                    fill="#9CA3AF"
                  />
                  <path
                    id="head"
                    d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                    fill="#9CA3AF"
                  />
                </g>
              </svg>
              <p className="font-semibold text-base">
                {getArrowValues(6).percentage}%
              </p>
              <div className="text-violet-700 mx-1 text-sm font-semibold">
                ({dynamicPercentage("premises agreement", "GMD approval")})
              </div>
            </div>
          </div>
          {/* col 4 */}
          <div className="bg-slate-300 flex flex-col justify-between gap-2 rounded-xl text-center p-4">
            {/* small card 1 */}
            <FunnelCard
              duration={0}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"premises agreement"}
            />

            <FunnelCard
              duration={3}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"docs collected"}
            />
            {/* middle arrow */}
            <div className="middleArrow self-center">
              <div className="flex justify-center items-center my-3">
                <p className="font-semibold text-base  text-rose-900 mr-2">
                  {getArrowValues(7).days}
                  <span className="text-violet-700 mx-1">
                    (
                    {findAverageDaysBetweenStatuses(
                      funnelData,
                      "docs collected",
                      "layout approved"
                    )}
                    )
                  </span>
                </p>
                <svg
                  width="70"
                  height="50"
                  viewBox="0 0 161 70"
                  fill="none"
                  className="-rotate-90 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="customArrow">
                    <rect
                      id="tail"
                      x="46"
                      y="24"
                      width="115"
                      height="23"
                      fill="#638D67"
                    />
                    <path
                      id="head"
                      d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                      fill="#638D67"
                    />
                  </g>
                </svg>

                <p className="font-semibold text-base">
                  {getArrowValues(7).percentage}%
                  <div className="text-violet-700 mx-1 text-sm font-semibold">
                    ({dynamicPercentage("layout approved", "docs collected")})
                  </div>
                </p>
              </div>
            </div>
            {/* small card 2 */}
            <FunnelCard
              duration={2}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"layout approved"}
            />

            {/* middle arrow */}
            <div className="middleArrow self-center mt-2">
              <div className="flex justify-center items-center my-3">
                <p className="font-semibold text-base text-rose-900 mr-2">
                  {getArrowValues(8).days}
                  <span className="text-violet-700 mx-1">
                    (
                    {findAverageDaysBetweenStatuses(
                      funnelData,
                      "layout approved",
                      "franchise agreement"
                    )}
                    )
                  </span>
                </p>
                <svg
                  width="70"
                  height="50"
                  viewBox="0 0 161 70"
                  fill="none"
                  className="-rotate-90 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="customArrow">
                    <rect
                      id="tail"
                      x="46"
                      y="24"
                      width="115"
                      height="23"
                      fill="#638D67"
                    />
                    <path
                      id="head"
                      d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                      fill="#638D67"
                    />
                  </g>
                </svg>

                <p className="font-semibold text-base">
                  {getArrowValues(8).percentage}%
                  <div className="text-violet-700 mx-1 text-sm font-semibold">
                    (
                    {dynamicPercentage(
                      "franchise agreement",
                      "layout approved"
                    )}
                    )
                  </div>
                </p>
              </div>
            </div>
            {/* small card 3 */}
            <FunnelCard
              duration={15}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"franchise agreement"}
            />
          </div>

          <div className="middleArrow self-start mt-20">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-base text-rose-600">
                {getArrowValues(9).days}
                <span className="text-violet-700 mx-1">
                  (
                  {findAverageDaysBetweenStatuses(
                    funnelData,
                    "franchise agreement",
                    "civil work"
                  )}
                  )
                </span>
              </p>
              <svg
                width="70"
                height="50"
                viewBox="0 0 161 70"
                fill="none"
                className="rotate-180 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="customArrow">
                  <rect
                    id="tail"
                    x="46"
                    y="24"
                    width="115"
                    height="23"
                    fill="#9CA3AF"
                  />
                  <path
                    id="head"
                    d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                    fill="#9CA3AF"
                  />
                </g>
              </svg>
              <p className="font-semibold text-base">
                {getArrowValues(9).percentage}%
              </p>
              <div className="text-violet-700 mx-1 text-sm font-semibold">
                ({dynamicPercentage("civil work", "franchise agreement")})
              </div>
            </div>
          </div>

          {/* col 5 */}
          <div className="flex flex-col  justify-between h-full gap-4">
            <div className="bg-slate-300 flex flex-col  rounded-xl text-center p-4 gap-2">
              {/* small card 1 */}
              <FunnelCard
                duration={20}
                getCountByStatus={getCountByStatusActive}
                getSiteLeftForNextStatus={getSiteLeftForNextStatus}
                status={"civil work"}
              />

              {/* small card 2 */}
              <FunnelCard
                duration={20}
                getCountByStatus={getCountByStatusActive}
                getSiteLeftForNextStatus={getSiteLeftForNextStatus}
                status={"equipment order"}
              />
            </div>

            {/* middle arrow */}
            <div className="middleArrow self-center">
              <div className="flex justify-center items-center ">
                <p className="font-semibold text-base text-rose-900 mr-2">
                  {getArrowValues(10).days}
                  <span className="text-violet-700 mx-1">
                    (
                    {findAverageDaysBetweenStatuses(
                      funnelData,
                      "equipment order",
                      "equipment installation"
                    )}
                    )
                  </span>
                </p>
                <svg
                  width="70"
                  height="50"
                  viewBox="0 0 161 70"
                  fill="none"
                  className="-rotate-90 w-12 h-12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="customArrow">
                    <rect
                      id="tail"
                      x="46"
                      y="24"
                      width="115"
                      height="23"
                      fill="#638D67"
                    />
                    <path
                      id="head"
                      d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                      fill="#638D67"
                    />
                  </g>
                </svg>
                <div>
                  <p className="font-semibold text-base">
                    {getArrowValues(10).percentage}%
                  </p>
                  <span className="text-violet-700 text-sm font-semibold">
                    (
                    {dynamicPercentage(
                      "equipment installation",
                      "equipment order"
                    )}
                    )
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-slate-300 flex flex-col self-end rounded-xl text-center p-4">
              {/* small card 1 */}

              <FunnelCard
                duration={6}
                getCountByStatus={getCountByStatusActive}
                getSiteLeftForNextStatus={getSiteLeftForNextStatus}
                status={"equipment installation"}
              />
            </div>
          </div>

          <div className="middleArrow self-end mb-72">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-base text-rose-600">
                {getArrowValues(11).days}
                <span className="text-violet-700 mx-1">
                  (
                  {findAverageDaysBetweenStatuses(
                    funnelData,
                    "equipment installation",
                    "hr ready"
                  )}
                  )
                </span>
              </p>
              <svg
                width="70"
                height="50"
                viewBox="0 0 161 70"
                fill="none"
                className="rotate-180 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="customArrow">
                  <rect
                    id="tail"
                    x="46"
                    y="24"
                    width="115"
                    height="23"
                    fill="#9CA3AF"
                  />
                  <path
                    id="head"
                    d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                    fill="#9CA3AF"
                  />
                </g>
              </svg>
              <p className="font-semibold text-base">
                {getArrowValues(11).percentage}%
                <div className="text-violet-700 text-sm font-semibold">
                  ({dynamicPercentage("hr ready", "equipment installation")})
                </div>
              </p>
            </div>
          </div>

          {/* col 6 */}
          <div className="bg-slate-300 flex flex-col justify-between rounded-xl text-center p-4">
            {/* small card 0 */}
            <FunnelCard
              duration={1}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"hr ready"}
            />
            {/* small card 1 */}
            <FunnelCard
              duration={1}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"product receiving"}
            />
            {/* small card 2 */}
            <FunnelCard
              duration={1}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"merchandising"}
            />
            {/* small card 3 */}
            <FunnelCard
              duration={1}
              getCountByStatus={getCountByStatusActive}
              getSiteLeftForNextStatus={getSiteLeftForNextStatus}
              status={"branding"}
            />
          </div>
          <div className="middleArrow self-center mr-3">
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold text-base text-rose-600">
                {getArrowValues(12).days}
                <span className="text-violet-700 mx-1">
                  (
                  {findAverageDaysBetweenStatuses(
                    funnelData,
                    "branding",
                    "inauguration"
                  )}
                  )
                </span>
              </p>
              <svg
                width="70"
                height="50"
                viewBox="0 0 161 70"
                fill="none"
                className="rotate-180 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="customArrow">
                  <rect
                    id="tail"
                    x="46"
                    y="24"
                    width="115"
                    height="23"
                    fill="#9CA3AF"
                  />
                  <path
                    id="head"
                    d="M-1.5299e-06 35L52.5 4.68911L52.5 65.3109L-1.5299e-06 35Z"
                    fill="#9CA3AF"
                  />
                </g>
              </svg>
              <p className="font-semibold text-base">
                {getArrowValues(12).percentage}%
                <div className="text-violet-700 text-sm font-semibold">
                  ({dynamicPercentage("branding", "inauguration")})
                </div>
              </p>
            </div>
          </div>
          <div className="flex  justify-center items-center">
            {/* <div className=" self-center flex flex-col justify-center items-center rotate-90 uppercase font-medium text-lime-600 text-lg">
              <p className="font-semibold text-yellow-600 text-base">
                {getCountByStatus("inauguration")}
                {getSiteLeftForNextStatus("branding", 1) !== 0 && (
                  <span className="text-slate-800">
                    {" "}
                    ({getSiteLeftForNextStatus("branding", 1)})
                  </span>
                )}
              </p>
              <p>inauguration</p>
            </div> */}
            <div className="bg-slate-300 flex flex-col justify-between rounded-xl text-center p-4">
              <FunnelCard
                duration={1}
                getCountByStatus={getCountByStatusActive}
                getSiteLeftForNextStatus={getSiteLeftForNextStatus}
                status={"inauguration"}
              />
            </div>
          </div>
        </div>
      </section>
      {user.role === "admin" && (
        <section className="my-8">
          <h2 className="p-4 text-xl font-medium">
            Expected Site Opening Date
          </h2>
          <hr className="mb-4 mt-2" />
          <div className="overflow-auto h-[80dvh] border rounded-md border-slate-300">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-emerald-600 text-white sticky top-0 left-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Target Date Crossed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Opening Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {individualSiteOpenings.map((site, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {site.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.hasPastOrgDate ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(site.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(site.openingDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default ExpansionFunnel;
