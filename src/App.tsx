/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { InvoiceData, PresetDraft } from "./types";
import { 
  DEFAULT_INVOICE_DATA, 
  INITIAL_PRESETS 
} from "./initialData";
import InvoiceSheet from "./components/InvoiceSheet";
import Sidebar from "./components/Sidebar";
import { 
  Receipt, 
  FileDown, 
  FileUp, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  X,
  Sparkles,
  Info
} from "lucide-react";

export default function App() {
  // Main states
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(DEFAULT_INVOICE_DATA);
  const [presets, setPresets] = useState<PresetDraft[]>([]);
  const [activePresetId, setActivePresetId] = useState<string>("preset-citystyle");
  
  // Custom Toast notifications (Non-blocking, iframe-safe alternative to window.alert)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Dynamic contextual hints inside the sidebar
  const [hintTitle, setHintTitle] = useState("Getting Started");
  const [hintBody, setHintBody] = useState("Click on any label, address text line, bank block, or rates directly in the invoice sheet template to start editing in-place!");

  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedPresets = localStorage.getItem("kb_invoice_presets");
    const savedActiveData = localStorage.getItem("kb_invoice_active_data");
    const savedActiveId = localStorage.getItem("kb_invoice_active_id");

    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        setPresets(INITIAL_PRESETS);
      }
    } else {
      setPresets(INITIAL_PRESETS);
      localStorage.setItem("kb_invoice_presets", JSON.stringify(INITIAL_PRESETS));
    }

    if (savedActiveData) {
      try {
        setInvoiceData(JSON.parse(savedActiveData));
      } catch (e) {
        setInvoiceData(DEFAULT_INVOICE_DATA);
      }
    }

    if (savedActiveId) {
      setActivePresetId(savedActiveId);
    }
  }, []);

  // Save current states to local storage on changes
  useEffect(() => {
    if (presets.length > 0) {
      localStorage.setItem("kb_invoice_presets", JSON.stringify(presets));
    }
  }, [presets]);

  useEffect(() => {
    localStorage.setItem("kb_invoice_active_data", JSON.stringify(invoiceData));
  }, [invoiceData]);

  // Helper triggering custom toasts
  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Change active invoice data updates
  const handleInvoiceChange = (updated: InvoiceData) => {
    // Automatically keep invoiceNo in sync with date and format adjustments
    const oldDate = invoiceData.date;
    const oldFormat = invoiceData.invoiceFormat || "INV-YYYYMMDD-1001";
    const oldSeq = invoiceData.seqCounter || "1001";
    
    const newDate = updated.date;
    const newFormat = updated.invoiceFormat || "INV-YYYYMMDD-1001";
    const newSeq = updated.seqCounter || "1001";
    
    if (oldDate !== newDate || oldFormat !== newFormat || oldSeq !== newSeq) {
      const parts = (newDate || "2026-06-11").split('-');
      const yyyy = parts[0] || "2026";
      const mm = parts[1] || "06";
      const dd = parts[2] || "11";
      
      let formattedNo = newFormat;
      formattedNo = formattedNo.replace(/YYYY/g, yyyy);
      formattedNo = formattedNo.replace(/MM/g, mm);
      formattedNo = formattedNo.replace(/DD/g, dd);
      
      if (formattedNo.includes("1001")) {
        formattedNo = formattedNo.replace("1001", newSeq);
      } else if (formattedNo.includes("0001")) {
        const paddedVal = String(parseInt(newSeq) || 1).padStart(4, '0');
        formattedNo = formattedNo.replace("0001", paddedVal);
      }
      
      updated.invoiceNo = formattedNo;
    }
    
    setInvoiceData(updated);
  };

  // Update contextual hints callbacks
  const handleFocusHint = (title: string, body: string) => {
    setHintTitle(title);
    setHintBody(body);
  };

  const handleBlurHint = () => {
    // Keep last focused hint active to offer persistent benefit
  };

  // Preset interactions
  const handleSelectPreset = (id: string) => {
    const found = presets.find(p => p.id === id);
    if (found) {
      setInvoiceData({ ...found.data });
      setActivePresetId(id);
      localStorage.setItem("kb_invoice_active_id", id);
      triggerToast(`Loaded "${found.name}" draft preset`, "success");
    }
  };

  const handleSavePreset = (name: string) => {
    const existingIdx = presets.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
    const newPresetId = "user-preset-" + Date.now();
    const newPreset: PresetDraft = {
      id: newPresetId,
      name,
      data: { ...invoiceData }
    };

    let updatedPresets = [...presets];
    if (existingIdx !== -1) {
      // Overwrite
      updatedPresets[existingIdx] = {
        ...updatedPresets[existingIdx],
        data: { ...invoiceData }
      };
      triggerToast(`Overwrote draft preset "${name}"`, "success");
    } else {
      updatedPresets.push(newPreset);
      setActivePresetId(newPresetId);
      localStorage.setItem("kb_invoice_active_id", newPresetId);
      triggerToast(`Saved new preset "${name}"`, "success");
    }
    setPresets(updatedPresets);
  };

  const handleDeletePreset = (id: string) => {
    const presetToDelete = presets.find(p => p.id === id);
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    setActivePresetId("");
    localStorage.setItem("kb_invoice_active_id", "");
    triggerToast(`Removed preset "${presetToDelete?.name || 'Draft'}"`, "info");
  };

  // Reset current layout entirely back to pristine default template
  const handleResetToDefault = () => {
    setInvoiceData({ ...DEFAULT_INVOICE_DATA });
    triggerToast("Reset invoice sheet to default layout", "info");
  };

  // Export current configuration into download-ready JSON backup file
  const handleExportBackup = () => {
    const backupPayload = {
      invoiceData,
      presets,
      activePresetId,
      version: "1.0.0"
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kb-invoice-backup-${invoiceData.invoiceNo || 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast("Invoice backup JSON downloaded successfully!", "success");
  };

  // Trigger JSON file input click
  const triggerImportFile = () => {
    importFileInputRef.current?.click();
  };

  // Custom import backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.invoiceData && Array.isArray(parsed.presets)) {
          setInvoiceData(parsed.invoiceData);
          setPresets(parsed.presets);
          if (parsed.activePresetId) {
            setActivePresetId(parsed.activePresetId);
          }
          triggerToast("All presets and working draft loaded from Backup!", "success");
        } else if (parsed.items && parsed.invoiceNo) {
          // Individual invoice data format
          setInvoiceData({
            ...DEFAULT_INVOICE_DATA,
            ...parsed
          });
          triggerToast("Single working invoice imported successfully!", "success");
        } else {
          triggerToast("Invalid JSON file template schema.", "error");
        }
      } catch (err) {
        triggerToast("Failed to compile or parse backup settings file.", "error");
      }
    };
    reader.readAsText(file);
    // Clear input
    e.target.value = "";
  };

  // Trigger high-fidelity browser print dialog representing the A4 page layout
  const handleExportPDF = () => {
    // Provide visual clue
    triggerToast("Generating print layouts... Select 'Save as PDF' inside your browser dialog.", "info");
    
    // Slight timeout to let DOM updates reflect cleanly
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#080d19] font-sans text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* APP HEADER TOOLBAR BRAND (no-print) */}
      <header className="no-print bg-[#0e1626]/90 backdrop-blur sticky top-0 z-40 border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md">
        
        {/* Brand Label */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <Receipt className="w-5.5 h-5.5 stroke-[2.2px]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white leading-none">
              KB Invoice Generator
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5 uppercase">
              Production Designer
            </span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Reset Defaults button */}
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#162135] text-slate-300 hover:text-white hover:bg-[#1f2d48] border border-slate-800/80 transition-all cursor-pointer"
            title="Wipe sheet clean with standard layout"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Templates</span>
          </button>

          {/* Import Backup */}
          <input
            type="file"
            ref={importFileInputRef}
            className="hidden"
            accept=".json"
            onChange={handleImportBackup}
          />
          <button
            onClick={triggerImportFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#162135] text-slate-300 hover:text-white hover:bg-[#1f2d48] border border-slate-800/80 transition-all cursor-pointer"
            title="Import saved working sheets"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Import Backup</span>
          </button>

          {/* Export Backup JSON */}
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#162135] text-slate-300 hover:text-white hover:bg-[#1f2d48] border border-slate-800/80 transition-all cursor-pointer"
            title="Download full draft backups"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>

          {/* PRINT PDF (Primary Action Accent) */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg transition-all cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/10 active:scale-95"
            style={{ shadowColor: invoiceData.themeColor }}
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>

        </div>
      </header>

      {/* STAGE & WORKSPACE VIEWPORT */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-0 gap-6 lg:gap-0">
        
        {/* LEFT / CENTER: THE PRINT PAPER CANVAS */}
        <div className="flex-1 flex justify-center items-start lg:py-10 lg:px-6 overflow-y-auto no-print-bg">
          <InvoiceSheet
            data={invoiceData}
            onChange={handleInvoiceChange}
            onFocusHint={handleFocusHint}
            onBlurHint={handleBlurHint}
          />
        </div>

        {/* RIGHT SIDEBAR PANEL */}
        <div className="lg:w-[350px] flex-shrink-0">
          <Sidebar
            data={invoiceData}
            onChange={handleInvoiceChange}
            presets={presets}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            onSavePreset={handleSavePreset}
            onDeletePreset={handleDeletePreset}
            hintTitle={hintTitle}
            hintBody={hintBody}
          />
        </div>

      </main>

      {/* SYSTEM PRINT & DESIGN NOTIFICATION TOAST (no-print) */}
      {toast && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800/80 shadow-2xl rounded-xl py-3 px-4 flex items-center gap-3 animate-fade-in z-50 max-w-sm">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : toast.type === "error" ? (
            <X className="w-5 h-5 text-red-400 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
          )}
          <span className="text-xs text-slate-200 mt-0.5 leading-tight font-medium">
            {toast.message}
          </span>
          <button 
            type="button" 
            onClick={() => setToast(null)} 
            className="text-slate-500 hover:text-slate-300 pl-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
