import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import Papa from 'papaparse';
import '../styles/housing.css';
import RandomForestPredictor from './RandomForestPrediction'; 
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ReactCSV = () => {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    fetch('Updated_Melbourne_housing_FULL.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data);
          },
        });
      })
      .catch(err => console.error('Error fetching CSV:', err));
  }, []);

  // Data processing functions
  const suburbData = data.reduce((acc, curr) => {
    const suburb = curr.Suburb;
    if (suburb) {
      acc[suburb] = (acc[suburb] || 0) + 1;
    }
    return acc;
  }, {});

  const priceRangeData = data.reduce((acc, curr) => {
    const price = parseInt(curr.Price);
    if (price) {
      const range = Math.floor(price / 250000) * 250000;
      const label = `$${(range / 1000000).toFixed(1)}M - $${((range + 250000) / 1000000).toFixed(1)}M`;
      acc[label] = (acc[label] || 0) + 1;
    }
    return acc;
  }, {});

  const roomsData = data.reduce((acc, curr) => {
    const rooms = curr.Rooms;
    if (rooms) {
      acc[rooms] = (acc[rooms] || 0) + 1;
    }
    return acc;
  }, {});

  const carData = data.reduce((acc, curr) => {
    const car = curr.Car;
    if (car) {
      acc[car] = (acc[car] || 0) + 1;
    }
    return acc;
  }, {});

  // Chart data formatting
  const suburbChartData = Object.keys(suburbData)
    .map(suburb => ({
      name: suburb,
      count: suburbData[suburb],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const priceChartData = Object.entries(priceRangeData)
    .map(([range, count]) => ({
      name: range,
      count: count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const roomsChartData = Object.entries(roomsData)
    .map(([rooms, count]) => ({
      name: `${rooms} Rooms`,
      value: count,
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const carChartData = Object.entries(carData)
    .map(([car, count]) => ({
      name: `${car} Cars`,
      value: count,
    }))
    .sort((a, b) => parseInt(a.name) - parseInt(b.name));

  const scatterData = data
    .filter(item => item.Price && item.Landsize)
    .map(item => ({
      price: parseInt(item.Price),
      landsize: parseInt(item.Landsize),
    }))
    .slice(0, 1000);

  return (


    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg mb-6 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Melbourne Housing Market Analysis
        </h1>
        
        <div className="space-x-4 mb-6">
          {['Overview', 'prediction'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        </div>
        <br></br>

        {activeTab === 'Overview' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Properties by Suburb (Top 15)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={suburbChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div><br></br>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Price Range Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div><br></br>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Room Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={roomsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roomsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div><br></br>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Car Distribution</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={carChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {carChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div><br></br>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Price vs Landsize Correlation</h2>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="landsize"
                    name="Land Size"
                    unit="m²"
                    type="number"
                  />
                  <YAxis
                    dataKey="price"
                    name="Price"
                    unit="$"
                    tickFormatter={value => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'price') return [`$${(value / 1000000).toFixed(2)}M`, 'Price'];
                      return [`${value}m²`, 'Land Size'];
                    }}
                  />
                  <Legend />
                  <Scatter name="Properties" data={scatterData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div><br></br>
          </div>
        )}

        {activeTab === 'prediction' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Property Price Prediction</h2>
            <RandomForestPredictor data={data} />
          </div>
        )}
      </div>
    
  );
};

export default ReactCSV;
