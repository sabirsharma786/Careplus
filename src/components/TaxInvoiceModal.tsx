import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { appStore } from '../services/store';

export const TaxInvoiceModal: React.FC = () => {
  const order = appStore.getTaxInvoiceOrder();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    appStore.setTaxInvoiceOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between no-print flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              Tax Invoice Generated & Confirmed
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#176B51] text-white text-xs font-semibold rounded-lg hover:bg-[#12543f] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print A4 Invoice</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Container */}
        <div className="p-6 sm:p-8 overflow-y-auto text-stone-900 font-sans space-y-6" id="printable-tax-invoice">
          {/* Header */}
          <div className="text-center border-b pb-4 border-stone-300">
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">
              Government of Nepal · Inland Revenue Department (IRD)
            </span>
            <h1 className="text-xl font-bold font-serif text-[#176B51] mt-0.5">
              CAREPLUS NEPAL PVT. LTD.
            </h1>
            <p className="text-xs text-stone-600">
              Baluwatar-04, Kathmandu, Nepal · Tel: +977-1-4428900
            </p>
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-stone-800 mt-1">
              <span>PAN / VAT Reg No: <strong className="font-mono">600123987</strong></span>
              <span>·</span>
              <span>DDA Reg: <strong className="font-mono">AYU-78-019</strong></span>
            </div>
            <div className="mt-2 inline-block px-3 py-0.5 border border-stone-400 font-bold text-xs uppercase tracking-wider rounded">
              TAX INVOICE (कर बिजक)
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p><strong className="text-stone-600">Invoice No:</strong> <span className="font-mono font-bold">{order.invoiceNumber}</span></p>
              <p><strong className="text-stone-600">Order ID:</strong> <span className="font-mono">{order.orderNumber}</span></p>
              <p><strong className="text-stone-600">Date:</strong> {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong className="text-stone-600">Mode:</strong> <span className="uppercase font-semibold">{order.paymentMethod} ({order.paymentStatus})</span></p>
            </div>
            <div className="space-y-1 text-right">
              <p><strong className="text-stone-600">Buyer Name:</strong> <span className="font-bold">{order.customerName}</span></p>
              <p><strong className="text-stone-600">Mobile:</strong> <span className="font-mono">{order.customerPhone}</span></p>
              <p><strong className="text-stone-600">Destination:</strong> {order.shippingAddress.municipality}, Ward {order.shippingAddress.ward}</p>
              <p className="text-[11px] text-stone-500">{order.shippingAddress.province}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs text-left border border-stone-200">
            <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Description of Goods</th>
                <th className="p-2 text-center">Pack Size</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Rate (NPR)</th>
                <th className="p-2 text-right">Amount (NPR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2 text-stone-500 font-mono">{idx + 1}</td>
                  <td className="p-2 font-medium">
                    {item.productName}
                    {item.batchNumber && (
                      <span className="block text-[10px] text-stone-400 font-mono">
                        Batch: {item.batchNumber}
                      </span>
                    )}
                  </td>
                  <td className="p-2 text-center text-stone-500">{item.packSize}</td>
                  <td className="p-2 text-right tabular-nums font-bold">{item.quantity}</td>
                  <td className="p-2 text-right tabular-nums">{item.unitPrice.toLocaleString()}</td>
                  <td className="p-2 text-right tabular-nums font-semibold">{item.lineTotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Calculation */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5 border-t border-stone-300 pt-2">
              <div className="flex justify-between">
                <span className="text-stone-600">Subtotal:</span>
                <span className="font-bold tabular-nums">NPR {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Loyalty Points Discount:</span>
                  <span className="font-bold tabular-nums">- NPR {order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-600">Taxable Amount:</span>
                <span className="font-bold tabular-nums">
                  NPR {(order.subtotal - order.discountAmount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">13% VAT (Nepal):</span>
                <span className="font-bold tabular-nums">NPR {order.taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Shipping Delivery Charge:</span>
                <span className="font-bold tabular-nums">
                  {order.shippingFee === 0 ? 'FREE' : `NPR ${order.shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-2 text-sm font-bold text-[#176B51]">
                <span>Grand Total:</span>
                <span className="tabular-nums">NPR {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Courier & Tracking Notice */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-stone-500 block">Courier Fulfillment:</span>
              <strong className="text-stone-800">{order.courierName}</strong>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">Tracking Number:</span>
              <strong className="font-mono text-[#176B51]">{order.trackingNumber}</strong>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="text-[11px] text-stone-500 text-center border-t pt-3 border-stone-200 space-y-0.5">
            <p>This is a computer-generated tax invoice verified under Nepal Inland Revenue rules.</p>
            <p>Thank you for choosing CarePlus Nepal — Pure Ayurvedic Wellness.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
