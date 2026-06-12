/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { InvoiceData, PresetDraft } from "../types";
import { PRESET_THEME_COLORS } from "../initialData";
import { 
  Check, 
  HelpCircle, 
  Sparkles, 
  Trash2, 
  Save, 
  Lightbulb, 
  X, 
  Settings, 
  Eye, 
  Cloud 
} from "lucide-react";

interface SidebarProps {
  data: InvoiceData;
  onChange: (updated: InvoiceData) => void;
  presets: PresetDraft[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onSavePreset: (name: string) => void;
  onDeletePreset: (presetId: string) => void;
  hintTitle: string;
  hintBody: string;
}

export default function Sidebar({
  data,
  onChange,
  presets,
  activePresetId,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
  hintTitle,
  hintBody
}: SidebarProps) {
  const [draftName, setDraftName] = useState("");

  const handleVisibleSectionToggle = (key: keyof InvoiceData["visibleSections"]) => {
    onChange({
      ...data,
      visibleSections: {
        ...data.visibleSections,
        [key]: !data.visibleSections[key]
      }
    });
  };

  const handleAdjustmentChange = (key: keyof InvoiceData, value: any) => {
    onChange({
      ...data,
      [key]: value
    });
  };

  const handleSaveClick = () => {
    if (!draftName.trim()) return;
    onSavePreset(draftName.trim());
    setDraftName("");
  };

  const currentThemeHex = data.themeColor || "#1e3a8a";

  return (
    <div className="w-full lg:w-[350px] bg-[#0c1424] text-slate-200 p-6 flex flex-col gap-6 max-h-none overflow-y-auto border-l border-slate-800 no-print rounded-xl lg:rounded-none h-fit lg:min-h-screen">
      
      {/* 2. INVOICE ADJUSTMENTS */}
      <div>
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
          INVOICE ADJUSTMENTS
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Currency */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Currency</label>
            <select
              value={data.currency}
              onChange={(e) => handleAdjustmentChange("currency", e.target.value)}
              className="bg-[#161f30] border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded px-3 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="PKR">PKR (Rs)</option>
              <option value="INR">INR (₹)</option>
              <option value="NPR">NPR (Rs)</option>
              <option value="AUD">AUD ($)</option>
              <option value="CAD">CAD ($)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="AED">AED (Dh)</option>
              <option value="SAR">SAR (SR)</option>
            </select>
          </div>

          {/* Discount % */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Discount (%)</label>
            <input
              type="number"
              value={data.discountPercent}
              onChange={(e) => handleAdjustmentChange("discountPercent", Math.max(0, parseInt(e.target.value) || 0))}
              className="bg-[#161f30] border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded px-3 py-1.5 text-xs text-slate-200 outline-none"
              min="0"
              max="100"
            />
          </div>

          {/* Tax % */}
          <div className="flex flex-col gap-1 col-span-1">
            <label className="text-[11px] font-medium text-slate-400">Tax (%)</label>
            <input
              type="number"
              value={data.taxPercent}
              onChange={(e) => handleAdjustmentChange("taxPercent", Math.max(0, parseFloat(e.target.value) || 0))}
              className="bg-[#161f30] border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded px-3 py-1.5 text-xs text-slate-200 outline-none"
              min="0"
              max="100"
              step="any"
            />
          </div>

          {/* Shipping Value */}
          <div className="flex flex-col gap-1 col-span-1">
            <label className="text-[11px] font-medium text-slate-400">Shipping ({data.currency})</label>
            <input
              type="number"
              value={data.shipping}
              onChange={(e) => handleAdjustmentChange("shipping", Math.max(0, parseFloat(e.target.value) || 0))}
              className="bg-[#161f30] border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded px-3 py-1.5 text-xs text-slate-200 outline-none"
              min="0"
              step="any"
            />
          </div>
        </div>
      </div>

      {/* 3. BRAND THEME COLOR */}
      <div>
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
          BRAND THEME COLOR
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_THEME_COLORS.map((col) => {
            const isSelected = data.themeColor.toLowerCase() === col.value.toLowerCase();
            return (
              <button
                key={col.value}
                onClick={() => handleAdjustmentChange("themeColor", col.value)}
                className={`w-7 h-7 rounded-full border-2 transition-all duration-250 cursor-pointer flex items-center justify-center`}
                style={{ 
                  backgroundColor: col.value, 
                  borderColor: isSelected ? "#ffffff" : "transparent",
                  boxShadow: isSelected ? `0 0 10px ${col.value}` : "none"
                }}
                title={col.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />}
              </button>
            );
          })}
          {/* Custom color manual input for power users */}
          <input 
            type="color" 
            value={data.themeColor} 
            onChange={(e) => handleAdjustmentChange("themeColor", e.target.value)} 
            className="w-7 h-7 border bg-transparent p-0 rounded-full overflow-hidden cursor-pointer flex-shrink-0"
            title="Custom Hex Color"
          />
        </div>
      </div>

      {/* 4. INVOICE LOGO PANEL */}
      <div>
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">
          INVOICE LOGO
        </h3>
        <div className="flex gap-2">
          <input
            type="file"
            id="sidebar-logo-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    handleAdjustmentChange("logo", event.target.result as string);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <label
            htmlFor="sidebar-logo-upload"
            className="flex-1 bg-[#161f30] text-center border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium py-2 rounded-lg cursor-pointer hover:bg-[#1a2538] transition-all"
          >
            Upload Logo
          </label>
          {data.logo && (
            <button
              onClick={() => handleAdjustmentChange("logo", "")}
              className="bg-red-950/40 text-red-400 hover:bg-red-900/50 p-2 text-xs rounded-lg hover:text-red-200 transition-all border border-red-900/40"
              title="Clear Active Logo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 5. VISIBLE SECTIONS */}
      <div>
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3 flex items-center justify-between">
          <span>VISIBLE SECTIONS</span>
          <Eye className="w-3.5 h-3.5 text-slate-500" />
        </h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium">
          {/* Col 1 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.showLogo}
                onChange={() => handleVisibleSectionToggle("showLogo")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Show Logo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.coContact}
                onChange={() => handleVisibleSectionToggle("coContact")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Co. Contact</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.clientContact}
                onChange={() => handleVisibleSectionToggle("clientContact")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Client Contact</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.taxRow}
                onChange={() => handleVisibleSectionToggle("taxRow")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Tax Row</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.paymentTerms}
                onChange={() => handleVisibleSectionToggle("paymentTerms")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Payment Terms</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.bankName}
                onChange={() => handleVisibleSectionToggle("bankName")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Bank Name</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.acNumber}
                onChange={() => handleVisibleSectionToggle("acNumber")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>A/C Number</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.bankRouting}
                onChange={() => handleVisibleSectionToggle("bankRouting")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Bank Routing</span>
            </label>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.coAddress}
                onChange={() => handleVisibleSectionToggle("coAddress")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Co. Address</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.clientAddress}
                onChange={() => handleVisibleSectionToggle("clientAddress")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Client Address</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.discount}
                onChange={() => handleVisibleSectionToggle("discount")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Discount</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.shippingRow}
                onChange={() => handleVisibleSectionToggle("shippingRow")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Shipping Row</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.bankBlock}
                onChange={() => handleVisibleSectionToggle("bankBlock")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Bank Block</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.accountName}
                onChange={() => handleVisibleSectionToggle("accountName")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Account Name</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.bankSwift}
                onChange={() => handleVisibleSectionToggle("bankSwift")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Bank SWIFT</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={data.visibleSections.addNotes}
                onChange={() => handleVisibleSectionToggle("addNotes")}
                className="rounded accent-blue-500 w-3.5 h-3.5 bg-slate-800 border-slate-700"
              />
              <span>Add. Notes</span>
            </label>
          </div>
        </div>
      </div>

      {/* 6. PRESETS & DRAFTS */}
      <div>
        <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-3 flex items-center justify-between">
          <span>PRESETS & DRAFTS</span>
          <Settings className="w-3.5 h-3.5 text-slate-500" />
        </h3>
        
        <div className="flex flex-col gap-2.5">
          {/* Save active config to drafts array */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Draft Name..."
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className="flex-1 bg-[#161f30] border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none placeholder:text-slate-500 h-9"
            />
            <button
              onClick={handleSaveClick}
              disabled={!draftName.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded px-3.5 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all h-9 whitespace-nowrap"
            >
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>

          {/* Selector matching screenshot style */}
          <div className="flex items-center gap-2 bg-[#161f30] border border-slate-800 rounded px-2.5 py-1.5 justify-between">
            <select
              value={activePresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#121a28]">Choose Preset...</option>
              {presets.map((pr) => (
                <option key={pr.id} value={pr.id} className="bg-[#121a28]">
                  {pr.name}
                </option>
              ))}
            </select>
            {activePresetId && (
              <button
                onClick={() => onDeletePreset(activePresetId)}
                className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/30 transition-all border border-transparent"
                title="Delete this template draft"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 7. CONTEXTUAL HELP HINT */}
      <div 
        className="mt-2 text-xs rounded-xl p-4 transition-all duration-300 leading-relaxed border flex flex-col gap-2 relative shadow-inner overflow-hidden"
        style={{ 
          backgroundColor: "#161c28",
          borderColor: "#223048",
          boxShadow: `inset 0 0 15px rgba(0,0,0,0.1)`
        }}
      >
        <div className="flex items-center gap-2 text-amber-400 font-bold tracking-tight">
          <Lightbulb className="w-4 h-4 text-amber-400 fill-amber-400/20 stroke-[2px]" />
          <span className="uppercase text-[10px] tracking-wide">
            {hintTitle || "CONTEXTUAL HELP HINT"}
          </span>
        </div>
        <p className="text-slate-300 text-xs">
          {hintBody || "💡 Tap or hover/focus on any text lines, parameters, or blocks inside the white invoice sheet layout directly to make fast in-place modifications! The calculations adjust automatically."}
        </p>
      </div>

      {/* Bottom hint of sidebar */}
      <span className="text-[10px] text-slate-500 font-medium text-center block mt-3 select-none">
        Tip: Press <kbd className="font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800">Ctrl + P</kbd> or click <b>Export PDF</b> to print.
      </span>

    </div>
  );
}
