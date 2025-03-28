import { useEffect, useState } from "react";
import axios from "axios";

const OrderYearlySales = () => {
  const [orders, setorders] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());


  useEffect(() => {
    const fetchYearlySales = async () => {
      try {
        const response = await axios.get(`https://api.crm.vexnorafusion.tech/api/orders/order-yearly-sales?year=${year}`);
        setorders(response.data);
      } catch (error) {
        console.error("Error fetching yearly sales:", error);
      }
    };

    fetchYearlySales();
  }, [year]);


  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId) {
      console.error("Error: Order ID is undefined");
      alert("Error: Order ID is missing.");
      return;
    }

    try {
      await axios.put(`https://api.crm.vexnorafusion.tech/api/orders/${orderId}/status`, { status: newStatus });

      // ✅ Update state immediately
      setorders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
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

      setorders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, paidMoney, dueAmount } : order
        )
      );
    } catch (error) {
      console.error("Error updating paid amount:", error.response?.data || error.message);
      alert("Failed to update paid amount.");
    }
  };








  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Yearly Orders</h2>
      <div className="mb-4">
        <label htmlFor="year" className="mr-2">Select Year:</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded">
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      

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
          {orders.map((order) => (
            <tr key={order._id || order.id} className="border-t">
              <td className="p-3">{order.product}</td>
              <td className="p-3">{order.quantity}</td>
              <td className="p-3">{order.unit}</td>
              <td className="p-3">₹{order.price}</td>

              <td className="p-3 text-gray-600">
              
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id , e.target.value)}
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
                    onChange={(e) => updatePaidAmount(order._id, e.target.value)}
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

export default OrderYearlySales;
