/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import axios from "axios";

const FirmDues = () => {
  const [firmDues, setFirmDues] = useState([]);

  useEffect(() => {
    fetchDueOrders();
  }, []);

  const fetchDueOrders = async () => {
    try {
      const response = await axios.get('https://api.crm.vexnorafusion.tech/api/orders');
      const ordersWithId = response.data.map(order => ({
        ...order,
        id: order._id, // Ensure _id is mapped to id
      }));
      setFirmDues(ordersWithId);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId) {
      console.error("Error: Order ID is undefined");
      alert("Error: Order ID is missing.");
      return;
    }

    try {
      await axios.put(`https://api.crm.vexnorafusion.tech/api/orders/${orderId}/status`, { status: newStatus });

      // ✅ Update state immediately
      setFirmDues((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
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
    
    const order = firmDues.find(order => order.id === orderId);
    if (!order) return;
    
    const paidMoney = parseFloat(newPaidAmount) || 0;
    const dueAmount = Math.max(order.totalPrice - paidMoney, 0);

    try {
      await axios.put(`https://api.crm.vexnorafusion.tech/api/orders/${orderId}/payment`, {
        paidMoney,
        dueAmount,
      });

      setFirmDues((prevOrders) =>
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
      <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
        <h3 className="text-xl font-semibold">
          Total Pending Payments: ₹{firmDues.reduce((total, order) => total + (order.dueAmount || 0), 0).toFixed(2)}
        </h3>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Payments List</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Unit</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Payment Status</th>
            <th className="p-3 text-left">Paid Amount</th>
            <th className="p-3 text-left">Due Amount</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {firmDues.map((order) => (
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.product}</td>
              <td className="p-3">{order.quantity}</td>
              <td className="p-3">{order.unit}</td>
              <td className="p-3">₹{order.price}</td>

              <td className="p-3 text-gray-600">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>

              <td className="p-3">
                <div className="flex items-center">
                  <span className="mr-1">₹</span>
                  <input
                    type="number"
                    value={order.paidMoney || 0}
                    onChange={(e) => updatePaidAmount(order.id, e.target.value)}
                    className="border p-1 w-full"
                  />
                </div>
              </td>

              <td className="p-3">₹{order.dueAmount}</td>
              <td className="p-3">₹{order.totalPrice}</td>
              <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FirmDues;
