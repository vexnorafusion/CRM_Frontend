
import CRMapp from "./components/CRMapp"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderProduct from "./components/OrderProduct";
import Login from "./components/Login"
import WeeklySales from "./components/WeeklySales";
import MonthlySales from "./components/MonthlySales";
import TodaySales from "./components/TodaySales";
import YearlySales from "./components/YearlySales";
import TotalCustomer from "./components/TotalCustomer";
import CompletedPayments from "./components/CompletePaynments";
import PendingPayments from "./components/PendingPaynments";
import FirmDues from "./components/FirmDues";
import FirmExpenses from "./components/FirmExpenses";
import OrderMonthlySales from "./components/OrderMonthlySales";
import OrderWeeklySales from "./components/OrderWeeklySales";
import OrderTodaySales from "./components/OrderTodaySales";
import OrderYearlySales from "./components/OrderYearlySales";
//import AddCustomer from "./components/AddCustomer"

const App = () => {
  return (
    <div>
      <Router>
      <Routes>
     
       <Route path="/" element={<Login/>}/>
        <Route path="/Dashboard" element={<CRMapp />} />
        <Route path="/order-products" element={<OrderProduct />} />
        <Route path="/weekly-sales" element={<WeeklySales />} />
        <Route path="/monthly-sales" element={<MonthlySales />} />
        <Route path="/today-sales" element={<TodaySales />} />
        <Route path="/yearly-sales" element={<YearlySales />} />
        <Route path="/total-customers" element={<TotalCustomer />} />
        <Route path="/complete-paynments" element={<CompletedPayments />} />
        <Route path="/pending-paynments" element={<PendingPayments />} />
        <Route path="/firm-dues" element={<FirmDues />} />
        <Route path="/firm-expenses" element={<FirmExpenses />} />
        <Route path="/order-monthly-sales" element={<OrderMonthlySales />} />
        <Route path="/order-weekly-sales" element={<OrderWeeklySales />} />
        <Route path="/order-today-sales" element={<OrderTodaySales />} />
        <Route path="/order-yearly-sales" element={<OrderYearlySales />} />

        
      </Routes>
    </Router>
    
    </div>
  )
}

export default App