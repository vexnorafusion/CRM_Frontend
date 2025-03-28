/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderProducts from './OrderProduct';
import axios from 'axios';




const FirmOrderDashBoard = () => {
  const [orders, setorders] = useState([]);
  const [orderName, setorderName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [productList, setProductList] = useState([
    "Milk", "Mawa", "Paneer", "Chocolate"
  ]);
  //const [orders, setOrders] = useState([]);
  const [addMoreProd, setAddMoreProd] = useState([]);
  const [firmDues, setFirmDues] = useState(0);
   const [status, setStatus] = useState('');


 

  
  

 
  useEffect(() => {
    const fetchorders = async () => {
      try {
        const response = await axios.get('https://api.crm.vexnorafusion.tech/api/orders');
        setorders(response.data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchorders();
  }, []);


  

 
  


  
  
   

    

   const totalOrders = orders.length;
   const todaySales = orders
    .filter((order) => {
      const orderDate = new Date(order.date);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    })
    .reduce((total, order) => total + order.totalPrice, 0) || 0;


  



  const weeklySales = orders
  .filter((order) => {
    const orderDate = new Date(order.date);
    const daysDifference = (new Date() - orderDate) / (1000 * 60 * 60 * 24);
    return daysDifference <= 7;
  })
  .reduce((total, order) => total + order.totalPrice, 0) || 0;

  const monthlySales = orders
  .filter(
    (order) => {
      const orderDate = new Date(order.date);
      return (new Date().getMonth() === orderDate.getMonth() && new Date().getFullYear() === orderDate.getFullYear());
    }
  )
  .reduce((total, order) => total + order.totalPrice, 0) || 0;

  const yearlySales = orders
    .filter((order) => {
      const orderDate = new Date(order.date);
      return new Date().getFullYear() === orderDate.getFullYear();
    })
    .reduce((total, order) => total + order.totalPrice, 0) || 0;


   

  useEffect(() => {
    fetchFirmDues();
  }, []);

  const fetchFirmDues = async () => {
    try {
      const response = await axios.get("https://api.crm.vexnorafusion.tech/api/orders"); // Change URL if needed
      const orders = response.data;
      orders.forEach(order => {
        console.log(`Status: ${order.status}, Total Cost: ${order.
          totalPrice}`);
      });
      

      const firmDuesPendingAmount = orders.reduce((total, order) => {
        if (order.status === "Pending") {
          return total + order.totalPrice; // Add totalAmount if status is Pending
        } else if (order.dueAmount > 0) {
          return total + order.dueAmount; // Add dueAmount if dueAmount > 0
        }
        return total;
      }, 0);
      

       


      setFirmDues(firmDuesPendingAmount);
    } catch (error) {
      console.error("Error fetching firm dues:", error);
    }
  };


 

  

  

  return (

    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-black-600 md:text-4xl lg:text-5xl">
  Shri Krishna Dairy Farm Keru
</h2>
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Order Dashboard</h2>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold">Total orders</p>
              <p className="font-bold text-2xl">{totalOrders}</p>
              <Link to="/total-orders">
                <button
                  className="mt-3 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center"> 
              <p className="text-2xl font-bold">Today Orders </p>
              <p className="font-bold text-2xl">₹{todaySales.toFixed(2)}</p>
              <Link to="/order-today-sales">
        <button
          className="mt-3 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
        >
          View More
        </button>
      </Link>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">Weekly Orders </p>
            <p className="font-bold text-2xl">₹{weeklySales.toFixed(2)}</p>
            <Link to="/order-weekly-sales">
        <button
          className="mt-3 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
        >
          View More
        </button>
      </Link>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold">Monthly Orders </p>
            <p className="font-bold text-2xl">₹{monthlySales.toFixed(2)}</p>
            <Link to="/order-monthly-sales">
        <button
          className="mt-3 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
        >
          View More
        </button>
      </Link>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
             <p className="text-2xl font-bold">Yearly Orders</p> 
             <p className="font-bold text-2xl">₹{yearlySales.toFixed(2)}</p>
             <Link to="/order-yearly-sales">
                <button
                  className="mt-3 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
             </div>
             <div className="bg-pink-100 p-4 rounded-lg text-center">
             <p className="text-2xl font-bold">Firm Dues</p> 
            <p className="font-bold text-2xl">
            ₹{firmDues.toFixed(2)}
           </p>
           <Link to="/firm-dues">
                <button
                  className="mt-3 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
             </div>
             
           
            
          </div>
          
          
        </div>

       
    </div>
    </div>
  );
};

export default FirmOrderDashBoard;