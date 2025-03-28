import { useEffect, useState } from "react";
import axios from "axios";

const YearlySales = () => {
  const [customers, setCustomers] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
    const [summary, setSummary] = useState(null); // State to store the grouped summary of the searched customer
  

  useEffect(() => {
    const fetchYearlySales = async () => {
      try {
        const response = await axios.get(`https://api.crm.vexnorafusion.tech/api/customers/yearly-sales?year=${year}`);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching yearly sales:", error);
      }
    };

    fetchYearlySales();
  }, [year]);


  const groupOrdersByCustomer = (filteredCustomers) => {
    const grouped = {};

    filteredCustomers.forEach((customer) => {
      customer.orders.forEach((order) => {
        const key = `${customer.name}-${customer.phone}-${order.product}`;
        if (!grouped[key]) {
          grouped[key] = {
            name: customer.name,
            phone: customer.phone,
            product: order.product,
            totalQuantity: 0,
            totalPrice: 0,
          };
        }
        grouped[key].totalQuantity += order.quantity;
        grouped[key].totalPrice += order.price * order.quantity;
      });
    });

    return Object.values(grouped);
  };

  // Function to handle search and generate grouped summary
  const handleSearch = () => {
    const filteredCustomers = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    if (filteredCustomers.length > 0) {
      const groupedOrders = groupOrdersByCustomer(filteredCustomers);
      const totalAmount = groupedOrders.reduce((sum, order) => sum + order.totalPrice, 0);

      setSummary({
        groupedOrders,
        totalAmount,
      });
    } else {
      setSummary(null); // Clear summary if no customer matches
    }
  };

  const updateOrderStatus = async (customerId, orderIndex, newStatus) => {
    try {
      // Optimistically update the state
      const updatedCustomers = customers.map(customer => {
        if (customer._id === customerId) {
          const updatedOrders = customer.orders.map((order, index) => {
            if (index === orderIndex) {
              return { ...order, status: newStatus };
            }
            return order;
          });
          return { ...customer, orders: updatedOrders };
        }
        return customer;
      });
      setCustomers(updatedCustomers);

      // Send API request to backend using the array index
      await axios.put(`https://api.crm.vexnorafusion.tech/api/customers/${customerId}/orders/${orderIndex}/status`, { status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };


  
  const generateBill = (customer) => {
    const billContent = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2 style="color: #4A90E2;">Customer Invoice</h2>
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Unit</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            ${customer.orders.map(order => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.product}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${order.unit}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">₹${order.price}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">₹${order.totalCost.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h3 style="margin-top: 20px;">Grand Total: ₹${customer.grandTotal.toFixed(2)}</h3>
      </div>
    `;

    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write(billContent);
    newWindow.print();
    newWindow.close();
  };

  const updatePaidAmount = async (customerId, newPaidAmount) => {
    const updatedCustomers = customers.map(customer => {
      if (customer._id === customerId) {
        const updatedPaidMoney = parseFloat(newPaidAmount);
        const updatedDueAmount = customer.grandTotal - updatedPaidMoney;
        return { ...customer, paidMoney: updatedPaidMoney, dueAmount: updatedDueAmount };
      }
      return customer;
    });
    setCustomers(updatedCustomers);

    try {
      await axios.put(`https://api.crm.vexnorafusion.tech/api/customers/${customerId}`, { paidMoney: newPaidAmount });
    } catch (error) {
      console.error("Error updating paid amount:", error);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );


  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(`https://api.crm.vexnorafusion.tech/api/customers/${customerId}`);
      setCustomers(customers.filter(customer => customer._id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Yearly Sales</h2>
      <div className="mb-4">
        <label htmlFor="year" className="mr-2">Select Year:</label>
        <select id="year" value={year} onChange={(e) => setYear(e.target.value)} className="p-2 border rounded">
          {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Search by name or phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <button
        onClick={handleSearch}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>

      {summary && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Summary for {searchTerm}
          </h3>
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Total Quantity</th>
                <th className="p-3 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {summary.groupedOrders.map((order, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{order.name}</td>
                  <td className="py-2 px-4 border">{order.phone}</td>
                  <td className="py-2 px-4 border">{order.product}</td>
                  <td className="py-2 px-4 border">{order.totalQuantity}</td>
                  <td className="py-2 px-4 border">₹{order.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="py-2 px-4 border" colSpan="4">Grand Total</td>
                <td className="py-2 px-4 border">₹{summary.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
          <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Product</th>
            <th className="p-3 text-left">Quantity</th>
            <th className="p-3 text-left">Unit</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Payment Status</th>
            <th className="p-3 text-left">Amount Paid</th>
            <th className="p-3 text-left">Amount Due</th>
            <th className="p-3 text-left">Total Amount</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Generate Bill</th>
            <th className="p-3 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) =>
            customer.orders.map((order, i) => (
              <tr key={`${index}-${i}`}>
                {i === 0 && (
                  <>
                    <td rowSpan={customer.orders.length} className="py-2 px-4 border">{customer.name}</td>
                    <td rowSpan={customer.orders.length} className="py-2 px-4 border">{customer.phone}</td>
                  </>
                )}
                <td className="py-2 px-4 border">{order.product}</td>
                <td className="py-2 px-4 border">{order.quantity}</td>
                <td className="py-2 px-4 border">{order.unit}</td>
                <td className="py-2 px-4 border">{order.price}</td>
                <td className="py-2 px-4 border">{order.totalCost ? order.totalCost.toFixed(2) : "0.00"}</td>
                <td className="py-2 px-4 border">
                <select value={order.status} onChange={(e) => updateOrderStatus(customer._id, i, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                {i === 0 && <td rowSpan={customer.orders.length} className="py-2 px-4 border"><div className="flex items-center"><span className="mr-1">₹</span><input
                  type="number"
                  value={customer.paidMoney}
                  onChange={(e) => updatePaidAmount(customer._id, e.target.value)}
                  className="border p-1 w-full"
                /></div></td>}
                {i === 0 && <td rowSpan={customer.orders.length} className="py-2 px-4 border">₹{customer.dueAmount.toFixed(2) ? customer.dueAmount:0.0}</td>}
                {i === 0 && <td rowSpan={customer.orders.length} className="py-2 px-4 border">₹{customer.grandTotal.toFixed(2)}</td>}
                <td className="py-2 px-4 border">{new Date(customer.date).toLocaleDateString()}</td>
               
                {i === 0 && (
                  <td rowSpan={customer.orders.length} className="py-2 px-4 border">
                    <button onClick={() => generateBill(customer)} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Generate Bill
                    </button>
                  </td>
                )}

                  {i === 0 && ( <td rowSpan={customer.orders.length} className="py-2 px-4 border">
                   <button onClick={() => deleteCustomer(customer._id)} className="bg-red-500 text-white px-4 py-2 rounded">
                     Delete
                   </button>
                 </td>
                 )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default YearlySales;
