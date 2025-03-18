import "./App.css";
import { Routes, Route } from "react-router-dom";
import InvoiceForm from "./InvoiceForm";
import Invoice from "./Invoice";

function App() {
  return (
    <Routes>
      <Route path="/" element={<InvoiceForm />} />
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  );
}

export default App;
