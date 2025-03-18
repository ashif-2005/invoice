import logo from "./assets/logo.png";
import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";

const Invoice = () => {
  const contentRef = useRef(null);
  const location = useLocation();
  const data = location.state;

  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const content = contentRef.current;

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    return doc;
  };

  const previewPDF = async () => {
    const doc = await generatePDF();
    window.open(doc.output("bloburl"), "_blank");
  };

  const downloadPDF = async () => {
    const doc = await generatePDF();
    doc.save("template.pdf");
  };

  const sgst = data?.totalAmount *0.09
  const cgst = data?.totalAmount * 0.09

  function numberToWords(num) {
    const belowTwenty = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", 
        "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const aboveThousand = ["", "Thousand", "Lakh", "Crore"];

    if (num === 0) return "Zero";

    function convertToWords(n) {
        if (n < 20) {
            return belowTwenty[n];
        } else if (n < 100) {
            return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + belowTwenty[n % 10] : "");
        } else if (n < 1000) {
            return belowTwenty[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convertToWords(n % 100) : "");
        }
        return "";
    }

    let parts = [];
    let units = [10000000, 100000, 1000, 1];
    let unitNames = ["Crore", "Lakh", "Thousand", ""];

    for (let i = 0; i < units.length; i++) {
        let divisor = units[i];
        if (num >= divisor) {
            let part = Math.floor(num / divisor);
            num %= divisor;
            if (part > 0) {
                parts.push(convertToWords(part) + (unitNames[i] ? " " + unitNames[i] : ""));
            }
        }
    }

    return parts.join(" ").trim();
  }

  function adjustToNearestWhole(amount) {
    const rounded = Math.round(amount); 
    const difference = (rounded - amount).toFixed(2); 
    
    return {
        roundedTotal: rounded,
        adjustment: difference > 0 ? `+${difference}` : difference,
    };
  }

  let totalQuantity = 0

  data?.items.forEach((item) => {
    totalQuantity += parseInt(item.quantity)
  });

  const totalAdjusted = adjustToNearestWhole(data?.totalAmount + sgst + cgst)
  const amountInWords = numberToWords(totalAdjusted.roundedTotal)

  return (
    <div>
      <div ref={contentRef} className="bg-white">
        <div className="border-2 border-black">
          <div className="flex">
            <div className="flex justify-center w-[30%] border-2 border-black">
              <img src={logo} alt="LOGO" className="h-50 w-50" />
            </div>
            <div className="flex flex-col justify-center w-full border-2 border-black">
              <h1 className="font-bold text-5xl mb-3">FRIENDS PACKS</h1>
              <p className="text-lg mt-3 font-semibold">
                6-A Jeeva Colony(Extn.), A V P LAYOUT 3rd STREET, GANDHINAGAR
                (PO), TIRUPUR-641603
              </p>
              <p className="text-lg font-semibold">
                Email: friendspacks74@gmail.com, PHONE: 0421 4333524, MOBILE:
                9443373524
              </p>
              <p className="text-lg font-semibold">
                GSTIN: 33AGGPR1091N1Z3, STATE: TAMIL NADU, STATE CODE: 33
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col w-[50%] border-2 border-black p-3">
              <h1 className="flex font-bold text-3xl ml-3">To</h1>
              <p className="flex ml-10 mt-1 font-bold text-2xl">
                M/s: {data?.companyName}
              </p>
              <p className="flex ml-10 mt-1 text-xl">{data?.address}</p>
              <p className="flex ml-10 mt-1 text-xl"> {data?.city}</p>
              <p className="flex ml-10 mt-1 text-xl">{data?.state}</p>
              <div className="flex justify-between mt-3">
                <p className="flex ml-10 font-bold text-xl">
                  GSTIN: {data?.gstno}
                </p>
                <p className="flex text-xl font-bold">STATE CODE: 33</p>
              </div>
            </div>
            <div className="w-[50%] border-2 border-black">
              <div className="flex justify-center items-center border-2 border-black p-1">
                <h1 className="text-lg font-bold">TAX INVOICE</h1>
              </div>
              <div className="flex justify-center items-center border-2 border-black p-1">
                <h1 className="text-lg font-semibold">
                  Tax is payable on reverse change: Yes / No
                </h1>
              </div>
              <div className="flex">
                <div className="w-[50%] flex flex-col justify-center items-start border-2 border-black p-2">
                  <p className="font-semibold text-lg">
                    INVOICE NO:{" "}
                    <span className="font-bold text-3xl">
                      {data?.invoiceNo}
                    </span>
                  </p>
                  <p className="font-semibold text-lg">
                    INVOICE DATE:{" "}
                    <span className="font-bold">{data?.invoiceDate}</span>
                  </p>
                </div>
                <div className="w-[50%] flex flex-col justify-center items-start border-2 border-black p-2">
                  <p className="font-semibold text-lg">
                    PO NO:{" "}
                    <span className="font-bold text-xl">{data?.poNumber}</span>
                  </p>
                  <p className="font-semibold text-lg">
                    PO DATE: <span className="font-bold">{data?.poDate}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center items-start p-3 border-2 border-black">
                <p className="font-semibold text-lg ">
                  Transpotation Mode: {data?.transport}
                </p>
                <p className="font-semibold text-lg">
                  Place Of Supply: {data?.place}
                </p>
              </div>
            </div>
          </div>
          <div>
            <table className="w-full border-2 border-black">
              <thead>
                <tr>
                  <th className="w-[5%] border-2 border-black p-2">S.No</th>
                  <th className="w-[5%] border-2 border-black p-2">HSN Code</th>
                  <th className="w-[5%] border-2 border-black p-2">DC No</th>
                  <th className="w-[60%] border-2 border-black p-2">
                    Description
                  </th>
                  <th className="w-[5%] border-2 border-black p-2">
                    Quantity (Kgs/Nos)
                  </th>
                  <th className="w-[5%] border-2 border-black p-2">Rate</th>
                  <th className="w-[10%] border-2 border-black p-2">Amount</th>
                </tr>
              </thead>
              <tbody className="text-lg font-semibold">
                {data?.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border-r-2 border-black p-2">{index + 1}</td>
                    <td className="border-r-2 border-black p-2">
                      {item.hsnCode}
                    </td>
                    <td className="border-r-2 border-black p-2">
                      {item.dcNumber}
                    </td>
                    <td className="border-r-2 border-black p-2">{item.name}</td>
                    {item.quantity ? (
                      <td className="border-r-2 border-black p-2">
                        {item.quantity}
                      </td>
                    ) : (
                      <td className="border-r-2 border-black p-2"></td>
                    )}
                    {item.price ? (
                      <td className="border-r-2 border-black p-2">
                        {parseFloat(item.price).toFixed(2)}
                      </td>
                    ) : (
                      <td className="border-r-2 border-black p-2"></td>
                    )}
                    {item.price * item.quantity ? (
                      <td className="border-r-2 border-black p-2">
                        {(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                      </td>
                    ) : (
                      <td className="border-r-2 border-black p-2"></td>
                    )}
                  </tr>
                ))}
                {Array.from({ length: 15 - data?.items.length }, (_, index) => (
                  <tr key={index}>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                    <td className="border-r-2 border-black p-2">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex">
            <div className="w-[77%] flex justify-between border-2 border-black p-2 font-bold">
              <p>BANK RTGS DETAILS</p>
              <p>TOTAL</p>
            </div>
            <div className="w-[23%] flex justify-between border-2 border-black font-bold p-2 text-lg">
              <p>{totalQuantity}</p>
              <p>{parseFloat(data?.totalAmount).toFixed(2)}</p>
            </div>
          </div>
          <div className="flex">
            <div className="w-[77%] flex flex-col justify-between items-start border-2 border-black p-2 font-semibold text-lg">
              <p>
                Bank Name: <span className="font-bold">HDFC BANK LTD,</span>
              </p>
              <p>Account No: 50200014924572,</p>
              <p>IFSC Code: HDFC0002408,</p>
              <p>Branch: INDIRA NAGAR BRANCH, TIRUPPUR.</p>
            </div>
            <div className="w-[23%] border-2 border-black font-semibold p-2 text-lg">
              <div className="w-full flex justify-between">
                <p>SGST @9%:</p>
                <p>{parseFloat(cgst).toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between">
                <p>CGST @9%:</p>
                <p>{parseFloat(cgst).toFixed(2)}</p>
              </div>
              <div className="w-full flex justify-between">
                <p>IGST @9%:</p>
                <p>0.00</p>
              </div>
              <div className="w-full flex justify-between">
                <p>Round Off:</p>
                <p>{totalAdjusted.adjustment}</p>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-[77%] flex flex-col items-start border-2 border-black p-2 font-semibold">
              <p>AMOUNT IN WORDS</p>
              <p className="text-xl font-bold">{amountInWords} only</p>
            </div>
            <div className="w-[23%] flex justify-between border-2 border-black font-bold p-2 text-xl">
              <p>GRAND TOTAL:</p>
              <p>{parseFloat(totalAdjusted.roundedTotal).toFixed(2)}</p>
            </div>
          </div>
          <div className=" flex font-semibold">
            <div className="w-[18%] flex justify-center items-end border-2 border-black p-2 font-bold">
              <p>Receiver Signature</p>
            </div>
            <div className="w-[59%] border-2 border-black flex flex-col items-start justify-center p-2">
              <p>Terms & Condition:</p>
              <p>* Goods once sold cannot be taken back</p>
              <p>
                * The payment should be made only way of crossed Draft/ Cheque
                in favour of FRIENDS PACKS.
              </p>
              <p className="mb-10">
                * All disputes subject to tirupur jurisdiction only.
              </p>
            </div>
            <div className="w-[23%] flex flex-col justify-between border-2 border-black p-2 font-bold">
              <p className="">For FRIENDS PACKS</p>
              <p>Authorised Signature</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={previewPDF}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Print Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Invoice;
