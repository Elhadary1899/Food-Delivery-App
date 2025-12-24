import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function ChartComponent() {
  const [chartData] = useState({
    series: [
      {
        name: "Orders",
        data: [10, 40, 25, 50, 49, 60],
      },
    ],
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
    },
  });

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        width="500"
      />
    </div>
  );
}
