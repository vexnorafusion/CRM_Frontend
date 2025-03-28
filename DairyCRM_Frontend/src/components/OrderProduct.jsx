/* eslint-disable no-unused-vars */
import { useState,useEffect } from 'react';
import axios from 'axios';
import FirmOrderDashBoard from './firmOrderDashBoard';

const OrderProducts = () => {
  // States for form inputs
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  
  // State to hold the orders
  const [orders, setOrders] = useState([]);
  const [productList, setProductList] = useState([
      "Milk", "Mawa", "Paneer", "Chocolate"
    ]);

  useEffect(() => {
      fetchOrders();
    }, []);
  
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://api.crm.vexnorafusion.tech/api/orders');
        const ordersWithId = response.data.map(order => ({
          ...order,
          id: order._id  // Map _id to id
        }));
        setOrders(ordersWithId);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get('https://api.crm.vexnorafusion.tech/api/products');
            const fetchedProducts = response.data.map(product => product.productName);
            setProductList(prevProducts => [...new Set([...prevProducts, ...fetchedProducts])]);
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        };
      
        fetchProducts();
      }, []);
  

  // Handle form submission
  const handleOrderPlace = async () => {
    if (product && quantity && unit && price && status) {
      const newOrder = {
        product: product,
        quantity: quantity,
        unit: unit,
        price: price,
        paidMoney: parseFloat(paidAmount || 0),
        totalPrice: parseFloat(quantity) * parseFloat(price),
        dueAmount: parseFloat(quantity) * parseFloat(price) - (parseFloat(paidAmount)),
        status: status,
        date: new Date(),
        
      };
      // Add new order to the orders list
      setOrders([newOrder, ...orders]);

      try{


        await axios.post('https://api.crm.vexnorafusion.tech/api/orders', newOrder);
        alert('Customer Added Successfully');
      // Reset form inputs
      setProduct('');
      setQuantity('');
      setUnit('');
      setPrice('');
      setStatus('');
      setPaidAmount('');
      }catch(error){
        console.error('error adding orders:' , error)
      }
    }
  };

  const updateOrderStatus = async (orderId, orderIndex, newStatus) => {
    if (!orderId) {
      console.error("Error: Order ID is undefined");
      alert("Error: Order ID is missing.");
      return;
    }
  
    try {
      await axios.put(`https://api.crm.vexnorafusion.tech/api/orders/${orderId}/status`, { status: newStatus });
  
      // Update the UI after successful update
      setOrders((prevOrders) => 
    orders.map((order, index) =>
          index === orderIndex ? { ...order, status: newStatus } : order
        )
      );
  
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };
  

  const updatePaidAmount = async (orderId, newPaidAmount) => {
    if (!orderId) return;
    
    const order = orders.find(order => order.id === orderId);
    if (!order) return;
    
    const paidMoney = parseFloat(newPaidAmount) || 0;
    const dueAmount = Math.max(order.totalPrice - paidMoney, 0);

    try {
      await axios.put(`https://api.crm.vexnorafusion.tech/api/orders/${orderId}/payment`, {
        paidMoney,
        dueAmount,
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, paidMoney, dueAmount } : order
        )
      );
    } catch (error) {
      console.error("Error updating paid amount:", error.response?.data || error.message);
      alert("Failed to update paid amount.");
    }
  };
 

  return (
  
    <div className="p-6">
      <div>
        <FirmOrderDashBoard />
      </div>
      <h2 className="text-2xl font-semibold text-gray-700">Order Products</h2>

      {/* Order Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6 space-y-4">
       
        <select
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Product</option>
          {productList.map((prod, index) => (
            <option key={index} value={prod}>{prod}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Unit</option>
          <option value="kg">kg</option>
          <option value="pcs">pcs</option>
          <option value="liters">liters</option>
        </select>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <input
            type="number"
            placeholder="Total Paid Amount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          />

        <button
          onClick={handleOrderPlace}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Place Order
        </button>
      </div>

      {/* Orders Table */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-700">Orders</h3>
          <table className="w-full mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-600">Product</th>
                <th className="p-3 text-left text-gray-600">Quantity</th>
                <th className="p-3 text-left text-gray-600">Unit</th>
                <th className="p-3 text-left text-gray-600">Price</th>
                <th className="p-3 text-left text-gray-600">Status</th>
                <th className="p-3 text-left text-gray-600">Paid Amount</th>
                <th className="p-3 text-left text-gray-600">Due Amount</th>
                <th className="p-3 text-left text-gray-600">Total Price</th>
                
                <th className="p-3 text-left text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{order.product}</td>
                  <td className="p-3 text-gray-600">{order.quantity}</td>
                  <td className="p-3 text-gray-600">{order.unit}</td>
                  <td className="p-3 text-gray-600">₹{order.price}</td>
                  <td className="p-3 text-gray-600">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, index, e.target.value)} 
                    className="border rounded px-2 py-1">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  </td>
                  <td  className="py-2 px-4 border"><div className="flex items-center"><span className="mr-1">₹</span><input
                  type="number"
                  value={order.paidMoney? order.paidMoney: "0.00"}
                  onChange={(e) => updatePaidAmount(order._id, e.target.value)}
                  className="border p-1 w-full"
                /></div></td>
                  <td className="p-3 text-gray-600">₹{order.dueAmount?  order.dueAmount: "0.00"}</td>
                  <td className="p-3 text-gray-600">₹{order.totalPrice}</td>  
                  
                  <td className="p-3 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderProducts;
