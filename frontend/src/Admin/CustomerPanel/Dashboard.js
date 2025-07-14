import React, { useState } from "react";
import { FaArrowTrendUp } from "react-icons/fa6";

const Dashboard = () => {
  const [data, setData] = useState([
    { status: "On delivery", percentage: 10, color: "#A8C1E5" },
    { status: "Pending", percentage: 20, color: "#3F4A56" },
    { status: "Delivered", percentage: 30, color: "#5CB1E5" },
    { status: "Cancelled", percentage: 40, color: "#72B9E5" },
  ]);

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
  return (
    <div className="sp_height">
      <div className="metrics-container py-4  ">
        <div className="row gx-1 w-100 px-3">
          <div className="col-xxl-3 col-sm-6 p-2">
            <div className="metric-card ">
              <div className="metric-header">
                <div className="metric-title">Total Sale</div>
                <div className="metric-icon">
                  <FaArrowTrendUp />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="metric-value">3,781</div>
                <div className="metric-trend">+22%</div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-sm-6 p-2">
            <div
              className="metric-card "
              style={{ backgroundColor: "#E5ECF6" }}
            >
              <div className="metric-header">
                <div className="metric-title">Total Products</div>
                <div className="metric-icon">
                  <FaArrowTrendUp />
                </div>
              </div>
              <div className="d-flex  justify-content-between align-items-center">
                <div className="metric-value">3,781</div>
                <div className="metric-trend">+22%</div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-sm-6 p-2">
            <div className="metric-card ">
              <div className="metric-header">
                <div className="metric-title">Total Returns</div>
                <div className="metric-icon">
                  <FaArrowTrendUp />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="metric-value">1200</div>
                <div className="metric-trend">+22%</div>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-sm-6 p-2">
            <div
              className="metric-card "
              style={{ backgroundColor: "#E5ECF6" }}
            >
              <div className="metric-header">
                <div className="metric-title">Active Users</div>
                <div className="metric-icon">
                  <FaArrowTrendUp />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="metric-value">3,781</div>
                <div className="metric-trend">+22%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex" style={{gap:"20px",padding:"20px"}}>
        <div className="w-50">
          <div className="bg-light p-lg-4 p-3 h-100 w-100">
            <h6 className=" fw-bold mb-4 text-dark">Order Summary</h6>

            <div className="row flex-column align-items-center">
              <div className="col-md-6 w-100 mb-4 mb-md-0 d-flex justify-content-center">
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

              <div className="col-md-6 w-100">
                {data.map((item, index) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ backgroundColor: "#F7F9FB" }}
          className="overflow-x-auto w-100"
        >
          <table className="udash_table w-100">
            <tr>
              <th>Id</th>
              <th>Main Category</th>
              <th>Category</th>
            </tr>
            <tr>
              <td>01</td>
              <td>Single Head</td>
              <td>Essential Sp....</td>
            </tr>
            <tr>
              <td>02</td>
              <td>Single Head</td>
              <td>Essential Sp....</td>
            </tr>
            <tr>
              <td>03</td>
              <td>Single Head</td>
              <td>Essential Sp....</td>
            </tr>
            <tr>
              <td>04</td>
              <td>Single Head</td>
              <td>Essential Sp....</td>
            </tr>
            <tr>
              <td>05</td>
              <td>Single Head</td>
              <td>Essential Sp....</td>
            </tr>
            <tr>
              <td>06</td>
              <td>Single Head</td>
              <td>Essential Sp....</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
