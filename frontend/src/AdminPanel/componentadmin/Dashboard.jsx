import React from 'react';
import Chart from 'react-apexcharts';

export default function Dashboard() {

  const pieChartSeries = [44, 55, 41];
  const pieChartOptions = {
    labels: ['VIP Customers', 'Returning', 'New Users'],
    legend: { position: 'bottom' }
  };

  const miniChartSeries = [{ data: [44, 55, 41] }];
  const miniChartOptions = {
    chart: { toolbar: { show: false }, sparkline: { enabled: true } },
    plotOptions: { bar: { borderRadius: 4 } },
    xaxis: { categories: ['VIP', 'Return', 'New'] }
  };

  const tsChartSeries = [{
    name: "Orders",
    data: [10, 40, 20, 50, 80, 60, 100],
  }];

  const tsChartOptions = {
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    stroke: { curve: 'smooth' },
    fill: { opacity: 0.3 }
  };

  return (
    <div
      style={{
        padding: '20px',
        margin: '120px auto 0',
        fontFamily: 'Arial, sans-serif',
        width: '80%',
        backgroundColor: '#f4f7f9',
        borderRadius: '12px',
      }}
    >
      <h1 className='mb-4'  >Food Order System Admin Dashboard</h1>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}
      >

        {/* Customer Segmentation */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2>Customer Segmentation</h2>
            <div style={{ width: '140px', height: '80px' }}>
              <Chart
                options={miniChartOptions}
                series={miniChartSeries}
                type="bar"
                width="100%"
                height="100%"
              />
            </div>
          </div>

          <Chart
            options={pieChartOptions}
            series={pieChartSeries}
            type="pie"
            width="100%"
            height="300"
          />
        </div>

        {/* Orders Overview */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
          }}
        >
          <h2>Orders Overview</h2>
          <Chart
            options={miniChartOptions}
            series={miniChartSeries}
            type="bar"
            width="100%"
            height="350"
          />
        </div>

        {/* Time Series Chart */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            padding: '20px',
            gridColumn: '1 / -1',
          }}
        >
          <Chart
            options={tsChartOptions}
            series={tsChartSeries}
            type="area"
            width="100%"
            height="350"
          />
        </div>
      </div>
    </div>
  );
}
