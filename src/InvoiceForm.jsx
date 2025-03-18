import dayjs from "dayjs";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InvoiceForm = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [gstno, setGstno] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [poNumber, setPoNumber] = useState("");
  const [poDate, setPoDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [invoiceDate, setInvoiceDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [transport, setTransport] = useState("");
  const [place, setPlace] = useState("");
  const [items, setItems] = useState([
    { hsnCode: "", dcNumber: "", name: "", quantity: 0, price: 0},
  ]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { hsnCode: "", dcNumber: "", name: "", quantity: "", price: "" },
    ]);
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) =>
        sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0),
      0
    );
    setTotalAmount(total);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/invoice`, { state: { companyName, address, city, state, gstno, stateCode, invoiceNo, poNumber, poDate, invoiceDate, transport, place, items, totalAmount } });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-yellow-50 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Friends Packs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="GST Number"
          value={gstno}
          onChange={(e) => setGstno(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Invoice Number"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="PO Number"
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="State Cede"
          value={stateCode}
          onChange={(e) => setStateCode(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Transport"
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border rounded"
          placeholder="Place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={poDate}
          onChange={(e) => setPoDate(e.target.value)}
        />
      </div>

      <h3 className="mt-6 font-semibold">Items:</h3>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-7 gap-2 mt-2">
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="HSN Code"
            value={item.hsnCode}
            onChange={(e) => handleItemChange(index, "hsnCode", e.target.value)}
          />
          <input
            type="text"
            className="p-2 border rounded"
            placeholder="DC Number"
            value={item.dcNumber}
            onChange={(e) => handleItemChange(index, "dcNumber", e.target.value)}
          />
          <input
            type="text"
            className="p-2 border rounded col-span-3"
            placeholder="Item Name"
            value={item.name}
            onChange={(e) => handleItemChange(index, "name", e.target.value)}
          />
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
          />
          <input
            type="number"
            className="p-2 border rounded"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", e.target.value)}
          />
        </div>      
      ))}

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={addItem}
      >
        Add Item
      </button>
      <h3 className="mt-4 font-semibold">
        Total Amount: {totalAmount.toFixed(2)}
      </h3>

      <div className="mt-6 flex justify-between">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSubmit}
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}

export default InvoiceForm