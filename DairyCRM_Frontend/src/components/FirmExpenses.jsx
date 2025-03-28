/* eslint-disable no-unused-vars */
import { useState,useEffect } from 'react';
import axios from 'axios';

const FirmExpenses = () => {
  // States for form inputs
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  
  
  // State to hold the orders
  const [items, setItems] = useState([]);
  

  useEffect(() => {
      fetchItems();
    }, []);
  
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://api.crm.vexnorafusion.tech/api/expenses');
        const expenseWithId = response.data.map(expense => ({
          ...expense,
          id: expense._id  // Map _id to id
        }));
        setItems(expenseWithId);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    

  // Handle form submission
  const handleExpenseItem = async () => {
    if (product && quantity && unit && price ) {
      const newItem = {
        product: product,
        quantity: quantity,
        unit: unit,
        price: price,
       
        totalPrice: parseFloat(quantity) * parseFloat(price),
       
        date: new Date(),
        
      };
      // Add new order to the orders list
      setItems([newItem, ...items]);

      try{


        await axios.post('https://api.crm.vexnorafusion.tech/api/expenses', newItem);
        alert('Item Added Successfully');
      // Reset form inputs
      setProduct('');
      setQuantity('');
      setUnit('');
      setPrice('');
      
      }catch(error){
        console.error('error adding Item:' , error)
      }
    }
  };

 

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700">Add Items</h2>

      {/* Order Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6 space-y-4">

      <input
          type="String"
          placeholder="Item"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
       
        
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
       

       

        <button
          onClick={handleExpenseItem}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Place Order
        </button>
      </div>

      {/* Orders Table */}
      {items.length > 0 && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 mt-6">
          <h3 className="text-xl font-semibold text-gray-700">Orders</h3>
          <table className="w-full mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-gray-600">Product</th>
                <th className="p-3 text-left text-gray-600">Quantity</th>
                <th className="p-3 text-left text-gray-600">Unit</th>
                <th className="p-3 text-left text-gray-600">Price</th>
                
                <th className="p-3 text-left text-gray-600">Total Price</th>
                
                <th className="p-3 text-left text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{item.product}</td>
                  <td className="p-3 text-gray-600">{item.quantity}</td>
                  <td className="p-3 text-gray-600">{item.unit}</td>
                  <td className="p-3 text-gray-600">₹{item.price}</td>
                  <td className="p-3 text-gray-600">₹{item.totalPrice}</td>
                  <td className="p-3 text-gray-600">{ new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FirmExpenses;
