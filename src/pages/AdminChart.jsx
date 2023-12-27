import React, { useState, useEffect } from 'react'
import {
  Chart as ChartJS,

  BarElement,

} from 'chart.js';

import { Line } from 'react-chartjs-2';
import {CategoryScale} from 'chart.js'; 
import { Chart, registerables } from 'chart.js';
import axiosInstanceAdmin from '../utils/axiosInstanceAdmin';
import { baseUrl } from '../utils/constants';
import AdminNav from '../components/AdminNav';
import AdminSide from '../components/AdminSide';

Chart.register(...registerables);

ChartJS.register(
  BarElement,CategoryScale
);


const BarChart = () => {
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
       
        const response = await axiosInstanceAdmin.get(`${baseUrl}myadmin/graph`);
        if (response.status === 200) {
          setChartData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
      }
      setLoading(false);
    };

    fetchChartData();
  }, []);




  var data = {
    labels: chartData.map((item) => item.joining_month),
    datasets: [{
      label: 'User Count',
      data: chartData.map((item) => item.user_count),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',  
      borderWidth: 2,
    }]
  };

  var options = {
    maintainAspectRatio: false,
    scales: {},
    legend: {
      labels: {
        fontSize: 25,
      },
    },
    responsive: true, 
    maintainAspectRatio: false,
   
    plugins: {
      legend: {
        position: 'top', 
      },
    },
  };
  return (
    <div>
    <AdminSide/>
    <AdminNav/>
   
    
      
       
        {loading ?
         (
          <p className="text-center">Loading...</p>
        ) : (
          <div>
          <h3 style={{marginLeft:'30%',marginTop:'4%'}}>User Joining Month Statistics</h3>
          <div className="bg-white p-5 rounded-lg" style={{ maxWidth: '600px', margin: 'auto',border:'2px solid #D0D4D5' }}>
            <Line data={data} height={400} options={options} />
          </div>
          </div>
        )}
  
    </div>
  )
}

export default BarChart