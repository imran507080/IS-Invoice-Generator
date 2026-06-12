/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { InvoiceData, InvoiceItem } from "../types";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  X,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard
} from "lucide-react";

interface InvoiceSheetProps {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  onFocusHint: (title: string, hint: string) => void;
  onBlurHint: () => void;
}

export default function InvoiceSheet({
  data,
  onChange,
  onFocusHint,
  onBlurHint
}: InvoiceSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to handle general property changes
  const handlePropChange = (key: keyof InvoiceData, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  // Helper to handle client info editing
  const handleClientChange = (key: keyof InvoiceData, value: string) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  // Helper to update specific row properties
  const handleItemChange = (index: number, key: keyof InvoiceItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: value
    };
    onChange({
      ...data,
      items: updatedItems
    });
  };

  // Remove a row
  const handleRemoveItem = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    onChange({
      ...data,
      items: updatedItems
    });
  };

  // Add empty row
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: "item-" + Date.now(),
      name: "New Product/Service",
      description: "Enter a detailed description here...",
      qty: 1,
      rate: 0
    };
    onChange({
      ...data,
      items: [...data.items, newItem]
    });
  };

  // Move row up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updatedItems = [...data.items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index - 1];
    updatedItems[index - 1] = temp;
    onChange({
      ...data,
      items: updatedItems
    });
  };

  // Move row down
  const handleMoveDown = (index: number) => {
    if (index === data.items.length - 1) return;
    const updatedItems = [...data.items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index + 1];
    updatedItems[index + 1] = temp;
    onChange({
      ...data,
      items: updatedItems
    });
  };

  // Calculate totals
  const subtotal = data.items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const discountAmount = data.visibleSections.discount ? (subtotal * (data.discountPercent / 100)) : 0;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = data.visibleSections.taxRow ? (taxableAmount * (data.taxPercent / 100)) : 0;
  const shippingCost = data.visibleSections.shippingRow ? Number(data.shipping) || 0 : 0;
  const total = taxableAmount + taxAmount + shippingCost;

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handlePropChange("logo", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file dialog
  const triggerLogoUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
      className="bg-white text-slate-800 shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-[850px] mx-auto min-h-[1100px] flex flex-col justify-between print-container"
      style={{ borderTop: `6px solid ${data.themeColor}` }}
      id="invoice-print-area"
    >
      {/* Upper Sheet Content */}
      <div>
        {/* LOGO & INVOICE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mb-8 no-print-border">
          {/* Logo container */}
          <div className="flex flex-col items-start gap-2">
            {data.visibleSections.showLogo && (
              <div 
                className="group relative border-2 border-dashed border-slate-200 rounded-lg p-2 hover:border-blue-400 transition-all cursor-pointer no-print-bg"
                onClick={triggerLogoUpload}
                onMouseEnter={() => onFocusHint("Brand Logo", "Click to upload your custom PNG, JPG, or SVG company logo. Toggles instantly in the sidebar.")}
                onMouseLeave={onBlurHint}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleLogoUpload} 
                />
                {data.logo ? (
                  <div className="relative">
                    <img 
                      src={data.logo} 
                      alt="Brand Logo" 
                      className="max-h-20 max-w-[200px] object-contain "
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePropChange("logo", "");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow no-print"
                      title="Remove Logo"
                    >
                      <X className="w-3.5 height-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                    <Upload className="w-6 h-6 stroke-slate-300" />
                    <span>Upload Logo</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title and ID */}
          <div className="text-right flex flex-col items-end md:ml-auto">
            <h1 
              className="text-4xl font-extrabold tracking-tight text-slate-900 transition-all font-sans"
              style={{ color: data.themeColor }}
            >
              INVOICE
            </h1>
            <div className="mt-2 flex items-center justify-end border border-slate-200 rounded-md py-1 px-3 bg-slate-50 relative no-print-border focus-within:ring-2 focus-within:ring-blue-500">
              <span className="text-slate-400 font-mono text-sm mr-1.5 font-bold">#</span>
              <input
                type="text"
                value={data.invoiceNo}
                onChange={(e) => handlePropChange("invoiceNo", e.target.value)}
                className="text-right text-base text-slate-800 font-bold bg-transparent border-none outline-none font-mono max-w-[120px]"
                onFocus={() => onFocusHint("Invoice Name & number", "Specify a unique invoice document sequence code matching your record index (e.g., INV0001).")}
                onBlur={onBlurHint}
                placeholder="INV0001"
              />
            </div>
          </div>
        </div>

        {/* BILL TO & DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Bill To Info */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 no-print-bg no-print-border">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bill To:</p>
            
            <input
              type="text"
              value={data.clientName}
              onChange={(e) => handleClientChange("clientName", e.target.value)}
              className="w-full text-lg font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 py-0.5 outline-none font-sans mb-1.5"
              onFocus={() => onFocusHint("Client Company or Name", "Change the business or individual name of the customer receiving this invoice.")}
              onBlur={onBlurHint}
              placeholder="Josh Wings"
            />
            
            {data.visibleSections.clientAddress && (
              <textarea
                value={data.clientAddress}
                onChange={(e) => handleClientChange("clientAddress", e.target.value)}
                rows={3}
                className="w-full text-sm text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 py-0.5 outline-none resize-none font-sans leading-tight mb-1"
                onFocus={() => onFocusHint("Client Bill Address", "Enter client street credentials, zip codes, physical address structures, and office suites.")}
                onBlur={onBlurHint}
                placeholder="789 Pine Ave&#10;90210, Los Angeles"
              />
            )}

            <div className="space-y-1 mt-1 text-xs">
              {data.visibleSections.clientContact && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={data.clientEmail}
                    onChange={(e) => handleClientChange("clientEmail", e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                    placeholder="client@email.com"
                    onFocus={() => onFocusHint("Client Email Contact", "Specify the direct email for sending payments confirmation and accounting communications.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}
              {data.visibleSections.clientContact && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <input
                    type="text"
                    value={data.clientPhone}
                    onChange={(e) => handleClientChange("clientPhone", e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                    placeholder="+1-310-555-0199"
                    onFocus={() => onFocusHint("Client Telephone Contact", "Provide customer billing division telephone number for follow ups.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Metadata Dates / Net terms */}
          <div className="flex flex-col gap-3 justify-center">
            {/* Term block */}
            {data.visibleSections.paymentTerms && (
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-100 no-print-bg no-print-border">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Terms</span>
                <input
                  type="text"
                  value={data.paymentTerms}
                  onChange={(e) => handlePropChange("paymentTerms", e.target.value)}
                  className="text-right text-sm font-semibold text-slate-800 bg-transparent border-none outline-none max-w-[120px]"
                  placeholder="Net 7"
                  onFocus={() => onFocusHint("Transaction Terms", "Enter agreement bounds for payment windows from issuance (e.g. Net 7, Net 30, Due On Receipt).")}
                  onBlur={onBlurHint}
                />
              </div>
            )}

            {/* Date Block */}
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-100 no-print-bg no-print-border">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </span>
              <input
                type="date"
                value={data.date}
                onChange={(e) => handlePropChange("date", e.target.value)}
                className="text-right text-xs font-semibold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
                onFocus={() => onFocusHint("Invoice Date", "Specify the direct actual invoice generation/issuing day.")}
                onBlur={onBlurHint}
              />
            </div>

            {/* Due Date Block */}
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-100 no-print-bg no-print-border">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due Date
              </span>
              <input
                type="date"
                value={data.dueDate}
                onChange={(e) => handlePropChange("dueDate", e.target.value)}
                className="text-right text-xs font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer"
                style={{ color: data.themeColor }}
                onFocus={() => onFocusHint("Payment Target Date", "Indicate the strict deadline after which fees are considered overdue or late payment structures arise.")}
                onBlur={onBlurHint}
              />
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr 
                className="border-b-2 text-xs font-bold uppercase tracking-wider text-slate-400 py-3 text-sans font-medium"
                style={{ borderBottomColor: data.themeColor }}
              >
                <th className="py-2.5 w-12 no-print"></th>
                <th className="py-2.5 pl-2">Item</th>
                <th className="py-2.5 w-20 text-center">Qty</th>
                <th className="py-2.5 w-28 text-right">Rate</th>
                <th className="py-2.5 w-32 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {data.items.map((item, idx) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors no-print-hover-reset">
                  {/* drag / move / delete handles */}
                  <td className="py-3 text-slate-300 group-hover:text-slate-500 transition-colors no-print">
                    <div className="flex items-center gap-1">
                      <GripVertical className="w-4 h-4 cursor-grab mr-1" title="Row grab-handle" />
                      <div className="flex flex-col">
                        <button 
                          type="button" 
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 disabled:opacity-25"
                          title="Move row up"
                        >
                          <ArrowUp className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === data.items.length - 1}
                          className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 disabled:opacity-25"
                          title="Move row down"
                        >
                          <ArrowDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Item credentials */}
                  <td className="py-3 pl-2 max-w-[280px]">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      className="w-full text-slate-900 font-semibold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 py-0.5 outline-none shrink"
                      placeholder="Product/Service"
                      onFocus={() => onFocusHint("Invoice Item Name", "Enter a title for the goods supplied or consulting role executed.")}
                      onBlur={onBlurHint}
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                      rows={1}
                      className="w-full text-xs text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none resize-none overflow-hidden h-auto mt-0.5 block leading-relaxed"
                      placeholder="Describe the product or project milestones..."
                      onFocus={() => onFocusHint("Item Technical Description", "Provide granular context like hours worked, features completed, sizes, or shipment details.")}
                      onBlur={onBlurHint}
                    />
                  </td>

                  {/* Quantity */}
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, "qty", parseInt(e.target.value) || 0)}
                      className="w-16 text-center font-mono text-sm inline-block bg-slate-50 hover:bg-slate-100 focus:bg-white border hover:border-slate-300 focus:border-blue-500 rounded py-1 outline-none no-print-bg no-print-border"
                      min="1"
                      onFocus={() => onFocusHint("Item Quantity", "Change the quantity of item packages, billable days, or creative hours.")}
                      onBlur={onBlurHint}
                    />
                  </td>

                  {/* Rate */}
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1 font-mono text-sm">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleItemChange(idx, "rate", parseFloat(e.target.value) || 0)}
                        className="w-24 text-right bg-slate-50 hover:bg-slate-100 focus:bg-white border hover:border-slate-300 focus:border-blue-500 rounded py-1 pl-1 pr-1.5 outline-none no-print-bg no-print-border"
                        min="0"
                        step="any"
                        onFocus={() => onFocusHint("Item Rate / Price", "Specify the unit hourly pricing or modular price for one single quantity.")}
                        onBlur={onBlurHint}
                      />
                    </div>
                  </td>

                  {/* Sub-Amount */}
                  <td className="py-3 text-right font-semibold text-slate-900 font-mono text-sm">
                    <div className="flex items-center justify-end gap-1 group relative">
                      <span>{(item.qty * item.rate).toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{data.currency}</span>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="absolute -right-3 -top-1 p-1 bg-red-50 hover:bg-red-100 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all no-print ml-2"
                        title="Delete line item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD ITEM ACTION ROW */}
        <div className="mb-8 no-print">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 border-2 border-dashed border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/20 rounded-lg transition-all text-sm font-semibold"
            onMouseEnter={() => onFocusHint("Add Line Item", "Append a blank customizable product row with dynamic sum calculations.")}
            onMouseLeave={onBlurHint}
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {/* FINANCIAL SUMMARY & SUBTOTAL BLOCK */}
        <div className="flex flex-col items-end border-t border-slate-100 pt-6 font-sans">
          <div className="w-full max-w-[360px] space-y-3.5 text-sm text-slate-600">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-slate-500 font-sans">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-800">
                {subtotal.toFixed(2)} {data.currency}
              </span>
            </div>

            {/* Discount Row */}
            {data.visibleSections.discount && (
              <div className="flex justify-between items-center text-slate-500">
                <span className="flex items-center gap-1">
                  Discount (
                  <span className="font-semibold text-orange-600 focus-within:underline">
                    {data.discountPercent}
                  </span>
                  %):
                </span>
                <span className="font-mono text-red-600 font-semibold">
                  - {discountAmount.toFixed(2)} {data.currency}
                </span>
              </div>
            )}

            {/* Tax Row */}
            {data.visibleSections.taxRow && (
              <div className="flex justify-between items-center text-slate-500">
                <span className="flex items-center gap-1">
                  Tax (
                  <span className="font-semibold text-slate-800">
                    {data.taxPercent}
                  </span>
                  %):
                </span>
                <span className="font-mono text-slate-800 font-semibold">
                  + {taxAmount.toFixed(2)} {data.currency}
                </span>
              </div>
            )}

            {/* Shipping Cost */}
            {data.visibleSections.shippingRow && (
              <div className="flex justify-between items-center text-slate-500">
                <span>Shipping:</span>
                <span className="font-mono text-slate-800 font-semibold">
                  + {shippingCost.toFixed(2)} {data.currency}
                </span>
              </div>
            )}

            {/* Total Block */}
            <div 
              className="flex justify-between items-center pt-3 border-t-2 text-base"
              style={{ borderTopColor: data.themeColor }}
            >
              <span className="text-slate-900 font-extrabold text-lg">Total:</span>
              <span 
                className="font-mono font-black text-xl tracking-tight"
                style={{ color: data.themeColor }}
              >
                {total.toFixed(2)} {data.currency}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER FOOTER ELEMENT */}
      <div className="border-t border-slate-100 pt-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-400 no-print-border">
        {/* Company profile left side */}
        <div className="space-y-2">
          <input
            type="text"
            value={data.coName}
            onChange={(e) => handlePropChange("coName", e.target.value)}
            className="w-full text-sm font-extrabold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none py-0.5 tracking-tight font-sans"
            placeholder="Your Company Name"
            onFocus={() => onFocusHint("Your Corporate Entity Name", "Enter the exact name of your business or freelancing name.")}
            onBlur={onBlurHint}
          />
          {data.visibleSections.coAddress && (
            <textarea
              value={data.coAddress}
              onChange={(e) => handlePropChange("coAddress", e.target.value)}
              rows={3}
              className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none resize-none text-slate-500 font-sans leading-relaxed mb-0.5"
              placeholder="Your Business Street Address&#10;Kathmandu, Nepal"
              onFocus={() => onFocusHint("Company Physical Address", "Provide your business headquarters contact street line, state and zip.")}
              onBlur={onBlurHint}
            />
          )}
          <div className="space-y-1 mt-1 text-slate-500">
            {data.visibleSections.coContact && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={data.coEmail}
                  onChange={(e) => handlePropChange("coEmail", e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                  placeholder="co@example.com"
                  onFocus={() => onFocusHint("Company Support Email", "Corporate email address displayed for client communication.")}
                  onBlur={onBlurHint}
                />
              </div>
            )}
            {data.visibleSections.coContact && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={data.coPhone}
                  onChange={(e) => handlePropChange("coPhone", e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                  placeholder="+977-9876543210"
                  onFocus={() => onFocusHint("Company Contact Phone", "Business line phone routing format on invoices.")}
                  onBlur={onBlurHint}
                />
              </div>
            )}
            {data.visibleSections.coContact && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={data.coWebsite}
                  onChange={(e) => handlePropChange("coWebsite", e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none"
                  placeholder="www.mybusiness.com"
                  onFocus={() => onFocusHint("Company Portfolio Website URL", "Corporate web-page destination printed for billing transparency.")}
                  onBlur={onBlurHint}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bank details right side */}
        <div className="space-y-2">
          {data.visibleSections.bankBlock && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 no-print-bg no-print-border space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-slate-400" />
                Direct Bank Transfer
              </p>

              {data.visibleSections.bankName && (
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Bank:</span>
                  <input
                    type="text"
                    value={data.bankName}
                    onChange={(e) => handlePropChange("bankName", e.target.value)}
                    className="text-right font-medium text-slate-700 bg-transparent border-none outline-none max-w-[150px]"
                    placeholder="Bank Inc."
                    onFocus={() => onFocusHint("Receipt Bank Entity", "Name of the monetary institution receiving clearing transfers.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}

              {data.visibleSections.accountName && (
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Account:</span>
                  <input
                    type="text"
                    value={data.bankAccountName}
                    onChange={(e) => handlePropChange("bankAccountName", e.target.value)}
                    className="text-right font-medium text-slate-700 bg-transparent border-none outline-none max-w-[150px]"
                    placeholder="KB Karki"
                    onFocus={() => onFocusHint("Bank Account Title Holder", "Specify the name registered under this bank system profile.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}

              {data.visibleSections.acNumber && (
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>IBAN:</span>
                  <input
                    type="text"
                    value={data.bankAccountNumber}
                    onChange={(e) => handlePropChange("bankAccountNumber", e.target.value)}
                    className="text-right font-mono text-slate-700 bg-transparent border-none outline-none max-w-[150px]"
                    placeholder="PK54NBPK0123... or A/C No"
                    onFocus={() => onFocusHint("Bank IBAN / Account Number", "Type international IBAN or general checking account numbers here.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}

              {data.visibleSections.bankSwift && (
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Raast ID:</span>
                  <input
                    type="text"
                    value={data.bankSwift}
                    onChange={(e) => handlePropChange("bankSwift", e.target.value)}
                    className="text-right font-mono text-slate-700 bg-transparent border-none outline-none max-w-[150px]"
                    placeholder="Raast ID or SWIFT"
                    onFocus={() => onFocusHint("Raast ID / SWIFT BIC Code", "Enter your Raast mobile payment ID, or SWIFT/BIC code for clearing wire transfers.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}

              {data.visibleSections.bankRouting && (
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>Routing:</span>
                  <input
                    type="text"
                    value={data.bankRouting}
                    onChange={(e) => handlePropChange("bankRouting", e.target.value)}
                    className="text-right font-mono text-slate-700 bg-transparent border-none outline-none max-w-[150px]"
                    placeholder="123456789"
                    onFocus={() => onFocusHint("Bank ABA / Transit Routing ID", "Enter routing transit sequence associated mostly for domestic clearings.")}
                    onBlur={onBlurHint}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Global italicised note at the bottom */}
        {data.visibleSections.addNotes && (
          <div className="md:col-span-2 text-center pt-4 border-t border-slate-50 mt-1 no-print-border">
            <input
              type="text"
              value={data.notes}
              onChange={(e) => handlePropChange("notes", e.target.value)}
              className="w-full text-center italic text-slate-500 bg-transparent border-none outline-none font-sans text-sm focus:underline"
              placeholder="Thank you for your business!"
              onFocus={() => onFocusHint("Client Appreciation Memo / Sign-off", "Personal sign-off gratitude motto printed right in bottom margin.")}
              onBlur={onBlurHint}
            />
          </div>
        )}
      </div>
    </div>
  );
}
