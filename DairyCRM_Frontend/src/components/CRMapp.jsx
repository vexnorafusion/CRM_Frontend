/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderProducts from './OrderProduct';
import axios from 'axios';

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
    <div className="bg-white p-6 rounded-lg" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-2xl mb-4">{title}</h2>
      {children}
    </div>
  </div>
);


const CRMApp = () => {
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState('');
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
  const [orders, setOrders] = useState([]);
  const [addMoreProd, setAddMoreProd] = useState([]);
  const [firmDues, setFirmDues] = useState(0);
   const [status, setStatus] = useState('');
   const [customerSuggestions, setCustomerSuggestions] = useState([]); // To store filtered suggestions


  const addOrderItem = () => {
    setAddMoreProd([...addMoreProd, { product: '', quantity: '', price: '', unit: '', status: '' }]);
  };


  const handleOrderItemChange = (index, field, value) => {
    const updatedAddMoreProd = [...addMoreProd];
    updatedAddMoreProd[index][field] = value;
    setAddMoreProd(updatedAddMoreProd);
  };

  const deleteOrderItem = (index) => {
    const updatedAddMoreProd = addMoreProd.filter((_, i) => i !== index);
    setAddMoreProd(updatedAddMoreProd);
  };

 
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://api.crm.vexnorafusion.tech/api/customers');
        setCustomers(response.data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);


  const addCustomer = async () => {
    if (customerName && phoneNumber && addMoreProd.length > 0) {
      const customerOrder = addMoreProd.map(item => ({
        ...item,
        totalCost: parseFloat(item.quantity) * parseFloat(item.price)
        
      }));

      const newCustomer = {
        name: customerName,
        phone: phoneNumber,
        paidMoney: parseFloat(paidAmount || 0),
        orders: customerOrder,
        date: new Date(),
        grandTotal: customerOrder.reduce((sum, item) => sum + item.totalCost, 0),
        dueAmount: (customerOrder.reduce((sum, item) => sum + item.totalCost, 0) - parseFloat(paidAmount || 0)).toFixed(2),
        

      };

      setCustomers([newCustomer, ...customers]);
      try{

        await axios.post('https://api.crm.vexnorafusion.tech/api/customers', newCustomer);
        alert('Customer Added Successfully');
        setCustomerName('');
      setPhoneNumber('');
      setPaidAmount('');
      setAddMoreProd([]);
        
      } catch(error){
        console.error('error adding customer:' , error )
      }
      
      setShowForm(false);
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



  
  
   
      if (paymentStatus === 'Pending') {
        // Update dues if payment is pending
      }

      


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
    

   const totalCustomers = customers.length;
   const todaySales = customers
    .filter((customer) => {
      const customerDate = new Date(customer.date);
      const today = new Date();
      return customerDate.toDateString() === today.toDateString();
    })
    .reduce((total, customer) => total + customer.grandTotal, 0) || 0;


  const pendingPayments = customers

  .reduce((total, customer) => {
    const hasPendingOrders = customer.orders.some(order => order.status === "Pending");
    return total + ((hasPendingOrders || customer.dueAmount > 0) ? customer.dueAmount : 0);
  }, 0) || 0;


  const completedPayments = customers
  .reduce((total, customer) => {
    const hasCompleteOrders = customer.orders.some(order => order.status === "Completed");
    return total + ((hasCompleteOrders || customer.paidMoney > 0) ? customer.paidMoney : 0);
  }, 0) || 0;




  const weeklySales = customers
  .filter((customer) => {
    const customerDate = new Date(customer.date);
    const daysDifference = (new Date() - customerDate) / (1000 * 60 * 60 * 24);
    return daysDifference <= 7;
  })
  .reduce((total, customer) => total + customer.grandTotal, 0) || 0;

  const monthlySales = customers
  .filter(
    (customer) => {
      const customerDate = new Date(customer.date);
      return (new Date().getMonth() === customerDate.getMonth() && new Date().getFullYear() === customerDate.getFullYear());
    }
  )
  .reduce((total, customer) => total + customer.grandTotal, 0) || 0;

  const yearlySales = customers
    .filter((customer) => {
      const customerDate = new Date(customer.date);
      return new Date().getFullYear() === customerDate.getFullYear();
    })
    .reduce((total, customer) => total + customer.grandTotal, 0) || 0;


    const productTotals = customers.reduce((acc, customer) => {
      customer.orders.forEach(order => {
        if (order.status === "Pending") {
          acc.pending[order.product] = (acc.pending[order.product] || 0) + order.totalCost;
        } else if (order.status === "Completed") {
          acc.completed[order.product] = (acc.completed[order.product] || 0) + order.totalCost;
        }
        acc.total[order.product] = (acc.total[order.product] || 0) + order.totalCost;
        acc.quantity[order.product] = acc.quantity[order.product] || { quantity: 0, unit: order.unit };
        acc.quantity[order.product].quantity = (acc.quantity[order.product].quantity || 0) + Number(order.quantity);
       
      });
      return acc;
    }, { pending: {}, completed: {}, total: {}, quantity: {} });

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


  const addProduct = async () => {
    const newProd = {
       productName: newProduct

    }

    if (newProduct) {
     
      try{
           
        await axios.post('https://api.crm.vexnorafusion.tech/api/products', newProd);
      alert('Product Added Successfully');
      setProductList([...productList, newProduct]);
      setNewProduct('');
      } catch(error){

        console.error('Error adding customer:', error);
 
      }
      setShowProductForm(false);
    }
  };


  const closeModal = () => {
    setShowForm(false);
    setShowProductForm(false);
  };

  const deleteCustomer = async (customerId) => {
    try {
      await axios.delete(`https://api.crm.vexnorafusion.tech/api/customers/${customerId}`);
      setCustomers(customers.filter(customer => customer._id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
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

  // Function to filter customer names and phone numbers based on input
const handleCustomerNameChange = (e) => {
  const input = e.target.value;
  setCustomerName(input);

  if (input.length > 0) {
    const suggestions = customers.filter((customer) =>
      customer.name.toLowerCase().includes(input.toLowerCase()) ||
      customer.phone.includes(input)
    );
    setCustomerSuggestions(suggestions);
  } else {
    setCustomerSuggestions([]);
  }
};

// Function to select a suggestion (name and phone number)
const selectSuggestion = (name, phone) => {
  setCustomerName(name);
  setPhoneNumber(phone);
  setCustomerSuggestions([]); // Clear suggestions after selection
};
  
const updateCustomerDate = async (customerId, newDate) => {
  const updatedCustomers = customers.map((customer) => {
    if (customer._id === customerId) {
      return { ...customer, date: newDate };
    }
    return customer;
  });
  setCustomers(updatedCustomers);

  try {
    await axios.put(`https://api.crm.vexnorafusion.tech/api/customers/${customerId}`, { date: newDate });
  } catch (error) {
    console.error("Error updating customer date:", error);
  }
};
  

  return (
    <div className="p-6 grid gap-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-black-600 md:text-4xl lg:text-5xl">
  Shri Krishna Dairy Farm Keru
</h2>
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-700">Dashboard</h2>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <p className="text-lg font-bold">Total Customers</p>
              <p className="font-bold text-2xl">{totalCustomers}</p>
              <Link to="/total-customers">
                <button
                  className="mt-3 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center"> 
              <p className="text-lg font-bold">Today Sales </p>
              <p className="font-bold text-2xl">₹{todaySales.toFixed(2)}</p>
              <Link to="/today-sales">
        <button
          className="mt-3 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
        >
          View More
        </button>
      </Link>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">Weekly Sales </p>
            <p className="font-bold text-2xl">₹{weeklySales.toFixed(2)}</p>
            <Link to="/weekly-sales">
        <button
          className="mt-3 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
        >
          View More
        </button>
      </Link>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">Monthly Sales </p>
            <p className="font-bold text-2xl">₹{monthlySales.toFixed(2)}</p>
            <Link to="/monthly-sales">
        <button
          className="mt-3 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300"
        >
          View More
        </button>
      </Link>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
             <p className="text-lg font-bold">Yearly Sales</p> 
             <p className="font-bold text-2xl">₹{yearlySales.toFixed(2)}</p>
             <Link to="/yearly-sales">
                <button
                  className="mt-3 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
             </div>
             <div className="bg-pink-100 p-4 rounded-lg text-center">
             <p className="text-lg font-bold">Firm Dues</p> 
            <p className="font-bold text-2xl">
            ₹{firmDues}
           </p>
           <Link to="/firm-dues">
                <button
                  className="mt-3 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
             </div>
             <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">Pending Payments</p>
             <p className="font-bold text-2xl">₹{Number(pendingPayments).toFixed(2)}</p>
             <Link to="/pending-paynments">
                <button
                  className="mt-3 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300"
                >
                  View More
                </button>
              </Link>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-lg font-bold">Completed Payments</p>
             <p className="font-bold text-2xl">₹{completedPayments.toFixed(2)}</p>
             <Link to="/complete-paynments">
                <button
                  className="mt-3 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300">
                  View More
                </button>
              </Link>
            </div>
            
          </div>
          
          
        </div>

       
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
  <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">Product Totals</h3>
  <div className="mt-4 space-y-3">
  {Object.keys(productTotals.total).map(product => (
    <div key={product} className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
      <div>
        <span className="text-lg text-gray-700">{product}</span>
        <div className="text-sm text-gray-500">
          Total Quantity: {productTotals.quantity[product]?.quantity} {productTotals.quantity[product]?.unit}
        </div>
       
      </div>
      <div className="text-right">
        <div className="text-sm text-yellow-600">Pending: ₹{(productTotals.pending[product] || 0).toFixed(2)}</div>
        <div className="text-sm text-green-600">Completed: ₹{(productTotals.completed[product] || 0).toFixed(2)}</div>
        <div className="text-lg font-bold text-gray-900">Total: ₹{productTotals.total[product].toFixed(2)}</div>
        
      </div>
    </div>
  ))}
</div>

</div>

      </div>

     <div>
      <button
        onClick={() => {setShowForm(true);
          
        }}
        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Add Customer
      </button>
      <button
        onClick={() => {
          setShowProductForm(true);
          
        }}
        className="w-full sm:w-auto bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 mt-4 ml-5"
      >
        Add Product
      </button>

      {showForm && (
        <Modal title="Add Customer" onClose={closeModal}>
          <input
            type="text"
            placeholder="Customer Name or Phone"
            value={customerName}
            onChange={handleCustomerNameChange}
            className="block w-full mb-4 p-2 border rounded"
          />
          {/* Suggestions Dropdown */}
          {customerSuggestions.length > 0 && (
            <div className="bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
              {customerSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => selectSuggestion(suggestion.name, suggestion.phone)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  <p className="font-bold">{suggestion.name}</p>
                  <p className="text-sm text-gray-500">{suggestion.phone}</p>
                </div>
              ))}
            </div>
          )}
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          />

          {addMoreProd.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 mb-4">
                 <select
                    value={item.product}
                    onChange={(e) => handleOrderItemChange(index, 'product', e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="" disabled>Select Product</option>
                    {productList.map((product, index) => (
                      <option key={index} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Price"
                value={item.price}
                onChange={(e) => handleOrderItemChange(index, 'price', e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={item.unit}
                onChange={(e) => handleOrderItemChange(index, 'unit', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="" disabled>Select Unit</option>
                <option value="kg">kg</option>
                <option value="liter">liter</option>
                <option value="pcs">pcs</option>
              </select>
              <select
                value={item.status}
                onChange={(e) => handleOrderItemChange(index, 'status', e.target.value)}
                className="p-2 border rounded"
              >
                <option value="" disabled>Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              
              <button onClick={() => deleteOrderItem(index)} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
          ))}

{addMoreProd.length > 0 && (
        <div className="grid grid-cols-6 gap-4 mb-4">
          <input
            type="number"
            placeholder="Total Amount"
            value={addMoreProd.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
            readOnly
            className="block w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Total Paid Amount"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="block w-full mb-4 p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Total Pending Amount"
            value={((addMoreProd.reduce((total, item) => total + (item.price * item.quantity), 0)) - parseFloat(paidAmount || 0)).toFixed(2)}
            readOnly
            className="block w-full mb-4 p-2 border rounded"
          />
           
        </div>
      )}



          <button onClick={addOrderItem} className="bg-green-600 text-white px-4 py-2 rounded mb-4">Add More</button>
         
      
          

          <button onClick={addCustomer} className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">Add</button>
          <button onClick={closeModal} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg ml-4">Cancel</button>
        </Modal>
      )}
       
      {showProductForm && (
         <Modal title="Add Product" onClose={closeModal}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-4 mt-6">
          <h2 className="text-2xl font-semibold text-gray-700 ">Add Product</h2>
          <input
            type="text"
            placeholder="New Product Name"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end space-x-4">
            <button
              onClick={addProduct}
              className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
            >
              Add Product
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
        </Modal>
      )}
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-700">Customers</h2>
        <table className="w-full mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-600">Name</th>
              <th className="p-3 text-left text-gray-600">Phone</th>
              <th className="p-3 text-left text-gray-600">Product</th>
              <th className="p-3 text-left text-gray-600">Quantity</th>
              <th className="p-3 text-left text-gray-600">Unit</th>
              <th className="p-3 text-left text-gray-600">Price</th>
              <th className="p-3 text-left text-gray-600">Total</th>
              <th className="p-3 text-left text-gray-600">Payment Status</th>
              <th className="p-3 text-left text-gray-600">Date</th>
              <th className="p-3 text-left text-gray-600">Amount Paid</th>
              <th className="p-3 text-left text-gray-600">Amount Due</th>
              <th className="p-3 text-left text-gray-600">Total Amount</th>
              <th className='p-3 text-left text-gray-600'>Generate Bill</th>
              <th className='p-3 text-left text-gray-600'>Delete</th>
            </tr>
          </thead>
          <tbody>
  {customers.map((customer, index) =>
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
        <td className="py-2 px-4 border">{order.totalCost ? order.totalCost.toFixed(2) : '0.00'}</td>
        <td className="py-2 px-4 border">
          <select value={order.status} onChange={(e) => updateOrderStatus(customer._id, i, e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </td>
        <td className="py-2 px-4 border">
          <input
            type="date"
            value={new Date(customer.date).toISOString().split('T')[0]} // Format date as YYYY-MM-DD
            onChange={(e) => updateCustomerDate(customer._id, e.target.value)}
            className="border p-1 w-full"
          />
        </td>
        {i === 0 && (
          <>
            <td rowSpan={customer.orders.length} className="py-2 px-4 border">
              <div className="flex items-center">
                <span className="mr-1">₹</span>
                <input
                  type="number"
                  value={customer.paidMoney}
                  onChange={(e) => updatePaidAmount(customer._id, e.target.value)}
                  className="border p-1 w-full"
                />
              </div>
            </td>
            <td rowSpan={customer.orders.length} className="py-2 px-4 border">₹{customer.dueAmount}</td>
            <td rowSpan={customer.orders.length} className="py-2 px-4 border">₹{customer.grandTotal.toFixed(2)}</td>
            <td rowSpan={customer.orders.length} className="py-2 px-4 border">
              <button onClick={() => generateBill(customer)} className="bg-blue-500 text-white px-4 py-2 rounded">Generate Bill</button>
            </td>
            <td rowSpan={customer.orders.length} className="py-2 px-4 border">
              <button onClick={() => deleteCustomer(customer._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </td>
          </>
        )}
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
      <div>
      <Link to="/order-products">
        <button
          className="w-full sm:w-auto bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300 mt-4"
        >
          Firm Orders
        </button>
      </Link>


      <Link to="/firm-expenses">
        <button
          className="w-full sm:w-auto bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-700 transition duration-300 mt-4 ml-5"
        >
          Firm Expenses
        </button>
      </Link>
    </div>
    </div>
  );
};

export default CRMApp;