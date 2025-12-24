import React from "react";
import Chart from "react-apexcharts";

export default function SalesReport() {

  const kpiData = [
    { title: 'Total Customers', value: '15,400', icon: '👤', color: '#4CAF50' },
    { title: 'Total Sales', value: '$125,980', icon: '💰', color: '#2196F3' },
    { title: 'Total Profit', value: '$45,500', icon: '📈', color: '#FF9800' },
    { title: 'Out of Stock', value: '8 Items', icon: '⚠️', color: '#F44336' },
  ];

  const KPIBox = ({ title, value, icon, color }) => (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h4 style={{ marginBottom: "8px", fontSize: "16px" }}>{title}</h4>
        <p style={{ fontSize: "22px", fontWeight: "bold" }}>{value}</p>
      </div>
      <span style={{ fontSize: "32px", color }}>{icon}</span>
    </div>
  );

  // Donut Chart
  const categorySeries = [35, 45, 20];
  const categoryOptions = {
    labels: ['Burgers', 'Pizza', 'Drinks'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true },
  };

  // Radar Chart
  const regionSeries = [{ name: "Sales", data: [80, 60, 75, 50, 90] }];
  const regionOptions = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['Cairo', 'Giza', 'Alex', 'Mansoura', 'Aswan'] },
  };

  // Bar Chart
  const topSeries = [{ name: 'Orders', data: [120, 100, 85, 70, 60] }];
  const topOptions = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['Burger', 'Pizza', 'Fries', 'Soda', 'Pasta'] },
    plotOptions: { bar: { borderRadius: 6 } },
  };

  // Heatmap
  const heatmapSeries = [
    { name: 'Mon', data: [20, 50, 30, 70, 90, 60] },
    { name: 'Tue', data: [10, 40, 20, 60, 80, 55] },
    { name: 'Wed', data: [15, 35, 25, 65, 85, 50] },
    { name: 'Thu', data: [25, 45, 30, 75, 95, 65] },
    { name: 'Fri', data: [30, 50, 40, 80, 100, 70] },
  ];
  const heatmapOptions = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: ['10AM', '12PM', '2PM', '4PM', '6PM', '8PM'] },
  };

  return (
    <div
      style={{
        padding: "20px",
        margin: "120px auto 0",
        fontFamily: "Arial, sans-serif",
        width: "80%",
        backgroundColor: "#f4f7f9",
        borderRadius: "12px",
      }}
    >
      <h1>Sales Report</h1>

      {/* 🔹 KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          margin: "20px 0 40px",
        }}
      >
        {kpiData.map((kpi) => (
          <KPIBox key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* 🔹 CHARTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px" }}>
          <h2>Sales by Category</h2>
          <Chart type="donut" series={categorySeries} options={categoryOptions} width="100%" height="300" />
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px" }}>
          <h2>Region Performance</h2>
          <Chart type="radar" series={regionSeries} options={regionOptions} width="100%" height="300" />
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", gridColumn: "1 / -1" }}>
          <h2>Top Selling Items</h2>
          <Chart type="bar" series={topSeries} options={topOptions} width="100%" height="350" />
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", padding: "20px", gridColumn: "1 / -1" }}>
          <h2>Sales Heatmap</h2>
          <Chart type="heatmap" series={heatmapSeries} options={heatmapOptions} height="350" />
        </div>
      </div>
    </div>
  );
}
