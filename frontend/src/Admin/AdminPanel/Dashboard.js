import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowTrendUp } from "react-icons/fa6";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WorldMap from "react-svg-worldmap";
import { GetBestSeller } from "../../Redux-Toolkit/ToolkitSlice/User/TopSellingSlice";
import { GetDashboardData, GetIncomeData, GetOrderSummaryData, GetRevenuebyLocation } from "../../Redux-Toolkit/ToolkitSlice/Admin/DashboardSlice";

const Dashboard = () => {
  const orderSummaryData = useSelector((state)=> state?.dashboard?.getOrderSummaryData)
  const donutColors = ["#A8C1E5", "#3F4A56", "#5CB1E5", "#72B9E5"];
  const totalOrders = (orderSummaryData || []).reduce((sum, item) => sum + item.total, 0);

  const data = (orderSummaryData || []).map((item, idx) => ({
    status: item.category,
    percentage: totalOrders ? Math.round((item.total / totalOrders) * 100) : 0,
    color: donutColors[idx % donutColors.length],
  }));

  const TopsellingData = useSelector((state) => state.topselling.allTopSellingData)
  console.log("TopsellingData",TopsellingData);
    
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(GetBestSeller())
  }, [])

  // Add new state for chart tooltip
  const [tooltipData, setTooltipData] = useState({
    active: false,
    payload: { income: 0, expense: 0 },
    label: "",
    coordinate: { x: 0, y: 0 },
  });

  // Get income and expense data from Redux
  const IncomeData = useSelector((state)=> state?.dashboard?.getIncomeData);

  // Helper to get month name
  const monthNames = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Prepare income and expense arrays from IncomeData
  const income = (IncomeData?.income || []);
  const expense = (IncomeData?.expense || []);

  // Merge income and expense by year+month
  const merged = {};

  income.forEach(item => {
    const key = `${item.year}-${item.month}`;
    merged[key] = {
      name: monthNames[item.month],
      income: item.totalIncome,
      expense: 0
    };
  });

  expense.forEach(item => {
    const key = `${item.year}-${item.month}`;
    if (!merged[key]) {
      merged[key] = {
        name: monthNames[item.month],
        income: 0,
        expense: item.totalExpense
      };
    } else {
      merged[key].expense = item.totalExpense;
    }
  });

  // Convert to array and sort by year/month
  const chartData = Object.entries(merged)
    .map(([key, value]) => value)
    .sort((a, b) => {
      // Sort by month order (assuming same year)
      return monthNames.indexOf(a.name) - monthNames.indexOf(b.name);
    });

  const size = 220;
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size / 2;
  const innerRadius = size / 3.2;

  const createDonutSegment = (
    startAngle,
    endAngle,
    innerRadius,
    outerRadius
  ) => {
    const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
    const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

    const startX1 = centerX + innerRadius * Math.cos(startAngleRad);
    const startY1 = centerY + innerRadius * Math.sin(startAngleRad);
    const endX1 = centerX + innerRadius * Math.cos(endAngleRad);
    const endY1 = centerY + innerRadius * Math.sin(endAngleRad);

    const startX2 = centerX + outerRadius * Math.cos(startAngleRad);
    const startY2 = centerY + outerRadius * Math.sin(startAngleRad);
    const endX2 = centerX + outerRadius * Math.cos(endAngleRad);
    const endY2 = centerY + outerRadius * Math.sin(endAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      `M ${startX1} ${startY1}`,
      `L ${startX2} ${startY2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX2} ${endY2}`,
      `L ${endX1} ${endY1}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startX1} ${startY1}`,
      "Z",
    ].join(" ");

    return d;
  };

  const renderDonutSegments = () => {
    let currentAngle = 0;

    return data.map((item, index) => {
      const angleSize = 3.6 * item.percentage;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSize;
      currentAngle = endAngle;

      return (
        <path
          key={index}
          d={createDonutSegment(startAngle, endAngle, innerRadius, outerRadius)}
          fill={item.color}
        />
      );
    });
  };

  // Add chart helper functions
  const formatYAxis = (value) => {
    if (value === 0) return "0";
    return `${value / 1000}0m`;
  };

  const handleMouseMove = (data) => {
    if (data && data.activePayload) {
      setTooltipData({
        active: true,
        payload: data.activePayload[0].payload,
        label: data.activeLabel,
        coordinate: { x: data.chartX, y: data.chartY },
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltipData({
      active: false,
      payload: { income: 0, expense: 0 },
      label: "",
      coordinate: { x: 0, y: 0 },
    });
  };

  // maps
  const data1 = [
    { country: "cn", value: 1389618778 },
    { country: "in", value: 1311559204 },
    { country: "us", value: 331883986 },
    { country: "id", value: 264935824 },
    { country: "pk", value: 210797836 },
    { country: "br", value: 210301591 },
    { country: "ng", value: 208679114 },
    { country: "bd", value: 161062905 },
    { country: "ru", value: 141944641 },
    { country: "mx", value: 127318112 },
  ];

  const dashboardData = useSelector((state)=> state?.dashboard?.getDashboardData)
  console.log("dashboardData",dashboardData);

  console.log("orderSummaryData",orderSummaryData);
  
  const RevenuebyLocationData = useSelector((state)=> state?.dashboard?.GetRevenuebyLocation)
  console.log("RevenuebyLocationData",RevenuebyLocationData);

  useEffect(()=>{
    dispatch(GetDashboardData())
    dispatch(GetOrderSummaryData())
    dispatch(GetIncomeData())
    dispatch(GetRevenuebyLocation())
  },[])

  // Dynamically build metrics array from dashboardData
  const metrics = [
    {
      title: "Total Sale",
      value: dashboardData?.totalSales ?? 0,
      trend: "+0%", // Update with real trend if available
      icon: <FaArrowTrendUp />,
      bg: "",
    },
    {
      title: "Total Products",
      value: dashboardData?.totalOrder ?? 0,
      trend: "+0%", // Update with real trend if available
      icon: <FaArrowTrendUp />,
      bg: "#E5ECF6",
    },
    {
      title: "Total Returns",
      value: dashboardData?.totalReturn ?? 0,
      trend: "+0%", // Update with real trend if available
      icon: <FaArrowTrendUp />,
      bg: "",
    },
    {
      title: "Active Users",
      value: dashboardData?.activeUser ?? 0,
      trend: "+0%", // Update with real trend if available
      icon: <FaArrowTrendUp />,
      bg: "#E5ECF6",
    },
  ];

  return (
    <div className="sp_height p-4 ">
      <h1 className="dashboard-title mb-0">Dashboard</h1>
      <div className="row">
        <div className="col-xxl-8 col-12">
          <div className=" metrics-container py-4  ">
            <div className="row gx-1 w-100">
              {metrics.map((item, idx) => (
                <div className="col-xxl-3 col-sm-6 p-2" key={idx}>
                  <div className="metric-card" style={item.bg ? { backgroundColor: item.bg } : {}}>
                    <div className="metric-header">
                      <div className="metric-title">{item.title}</div>
                      <div className="metric-icon">{item.icon}</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="metric-value">{item.value}</div>
                      <div className="metric-trend">{item.trend}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row gx-0">
            <div className="col-lg-6 p-2">
              <div className="bg-light p-lg-4 p-3 h-100 w-100">
                <h6 className=" fw-bold mb-4 text-dark">Order Summary</h6>

                <div className="row align-items-center">
                  <div className="col-md-6 mb-4 mb-md-0 d-flex justify-content-center">
                    <div
                      style={{
                        width: "12rem",
                        height: "12rem",
                        position: "relative",
                      }}
                    >
                      <svg
                        viewBox="0 0 220 220"
                        style={{ width: "100%", height: "100%" }}
                      >
                        {renderDonutSegments()}
                        <circle
                          cx={centerX}
                          cy={centerY}
                          r={innerRadius}
                          fill="white"
                        />

                        <foreignObject
                          x={centerX - 25}
                          y={centerY - 25}
                          width="50"
                          height="50"
                        >
                          <div className="d-flex justify-content-center align-items-center w-100 h-100">
                            <div style={{ position: "relative" }}>
                              <div
                                className="d-flex justify-content-center align-items-center rounded"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: "#60a5fa",
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ width: "24px", height: "24px" }}
                                >
                                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                              </div>
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-0.5rem",
                                  right: "-0.5rem",
                                  width: "24px",
                                  height: "24px",
                                  backgroundColor: "#fdba74",
                                  borderRadius: "0.5rem",
                                  transform: "rotate(12deg)",
                                }}
                              ></div>
                            </div>
                          </div>
                        </foreignObject>

                        {(() => {
                          let currentAngle = 0;
                          return data.map((item, index) => {
                            const angleSize = 3.6 * item.percentage;
                            const labelAngle = currentAngle + angleSize / 2;
                            currentAngle += angleSize;

                            const labelAngleRad =
                              ((labelAngle - 90) * Math.PI) / 180;
                            const labelRadius = (innerRadius + outerRadius) / 2;
                            const x =
                              centerX + labelRadius * Math.cos(labelAngleRad);
                            const y =
                              centerY + labelRadius * Math.sin(labelAngleRad);

                            return (
                              <text
                                key={index}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontWeight="bold"
                                fontSize="14"
                              >
                                {item.percentage}%
                              </text>
                            );
                          });
                        })()}
                      </svg>
                    </div>
                  </div>

                  <div className="col-md-6">
                    {(orderSummaryData || []).map((item, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-dark">{item.category}</span>
                          <span className="fw-bold">{item.total}</span>
                        </div>
                        <div
                          className="progress"
                          style={{ height: "4px", borderRadius: "1rem" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${item.total}%`,
                              backgroundColor: data[index].color,
                              borderRadius: "1rem",
                            }}
                            aria-valuenow={item.total}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 p-2 ">
              <div className="h-100 w-100">
                <div className="bg-light p-lg-4 p-3 rounded w-100">
                  <div className="align-items-center  mb-3 d-flex justify-content-between">
                    <h6 className="w-100 text-nowrap  fw-semibold mb-0 text-dark">
                      Income & Expence
                    </h6>
                    <div className="d-flex justify-content-between">
                      <div className=" d-flex justify-content-end align-items-center">
                        <div
                          className="me-2 rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#93C5FD",
                          }}
                        ></div>
                        <span className="text-secondary">Income</span>
                      </div>
                      <div className="d-flex align-items-center ms-3">
                        <div
                          className="me-2 rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: "#9CA3AF",
                          }}
                        ></div>
                        <span className="text-secondary">Expence</span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="position-relative"
                    style={{ width: "100%", height: "16rem" }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={chartData}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorIncome"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#93C5FD"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#93C5FD"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          vertical={false}
                          strokeDasharray="3 3"
                          strokeOpacity={0.2}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6B7280" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6B7280" }}
                          tickFormatter={formatYAxis}
                        />
                        <Tooltip content={() => null} />
                        <Area
                          type="monotone"
                          dataKey="expense"
                          stroke="#9CA3AF"
                          strokeWidth={2}
                          fill="transparent"
                        />
                        <Area
                          type="monotone"
                          dataKey="income"
                          stroke="#60A5FA"
                          strokeWidth={2}
                          fill="url(#colorIncome)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>

                    <div
                      className="position-absolute translate-middle"
                      style={{ left: "37%", top: "55%" }}
                    >
                      {/* <div className="bg-white shadow rounded px-3 py-1 text-center">
                        <span className="fw-bold text-dark">$28,000</span>
                        <div
                          className="mt-1 rounded-circle mx-auto"
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#000",
                          }}
                        ></div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xxl-4 col-12 py-4">
          <div style={{ backgroundColor: "#F7F9FB" }} className="h-100 p-3">
            <h5>Revenue by Location</h5>
            <div className="uWorldMap">
              <div className="d-flex justify-content-center">
                <WorldMap
                  backgroundColor="transparent"
                  color="#D9D9D9"
                  value-suffix="people"
                  size="md"
                  data={data1}
                />
              </div>

              {/* {data.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-dark">{item.status}</span>
                    <span className="fw-bold">{item.percentage}%</span>
                  </div>
                  <div
                    className="progress"
                    style={{ height: "4px", borderRadius: "1rem" }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                        borderRadius: "1rem",
                      }}
                      aria-valuenow={item.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              ))} */}

              {Array.isArray(RevenuebyLocationData) && RevenuebyLocationData.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-dark">{item.country}</span>
                    <span className="fw-bold">{item.revenuePercent}%</span>
                  </div>
                  <div
                    className="progress"
                    style={{ height: "4px", borderRadius: "1rem" }}
                  >
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${item.revenuePercent}%`,
                        backgroundColor: "#60a5fa",
                        borderRadius: "1rem",
                      }}
                      aria-valuenow={item.revenuePercent}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ backgroundColor: "#F7F9FB", margin: "20px 0px" }}
        className="overflow-x-auto"
      >
        <p style={{marginBottom: "0px", padding:"20px", fontWeight: "700"}}>Top Selling Product</p>
        <table className="udash_table w-100">
          <thead>
            <tr>
              <th>Id</th>
              <th>Main Category</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {TopsellingData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.mainCategoryData?.mainCategoryName}</td>
                <td>{item.categoryData?.categoryName}</td>
                <td>{item.subCategoryData?.subCategoryName}</td>
                <td>{item.productDetails?.productName}</td>
                <td>₹{item.productDetails?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
