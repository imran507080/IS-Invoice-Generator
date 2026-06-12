/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvoiceData } from "./types";

// A beautiful default base64 SVG logo (a elegant double circle design matching professional logos)
export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="%232563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m8 10 4 4 4-4"/></svg>`;

export const DEFAULT_INVOICE_DATA: InvoiceData = {
  invoiceNo: "INV-20260611-1001",
  date: "2026-06-11",
  dueDate: "2026-06-18",
  paymentTerms: "Net 7",
  
  clientName: "Josh Wings",
  clientAddress: "789 Pine Ave\n90210, Los Angeles\nUSA",
  clientEmail: "joshwings@client.com",
  clientPhone: "+1-310-555-0199",
  
  coName: "KB Karki",
  coAddress: "Kathmandu\n44600\nNepal",
  coEmail: "kbkarki@example.com",
  coPhone: "+977-9876543210",
  coWebsite: "www.kbkarki.com",
  
  bankName: "Bank Inc.",
  bankAccountName: "KB Karki",
  bankAccountNumber: "445566998877",
  bankSwift: "BINKNPKAXXX",
  bankRouting: "123456789",
  
  items: [
    {
      id: "item-1",
      name: "Product A",
      description: "Description of Product A",
      qty: 2,
      rate: 50,
    },
    {
      id: "item-2",
      name: "Consultation Services",
      description: "UX/UI strategy workshop",
      qty: 5,
      rate: 120,
    },
  ],
  notes: "Thank you for your business!",
  logo: DEFAULT_LOGO_SVG,
  
  currency: "USD",
  discountPercent: 5,
  taxPercent: 15,
  shipping: 5,
  
  themeColor: "#1e3a8a", // Dark navy blue matching the screenshot
  
  invoiceFormat: "INV-YYYYMMDD-1001",
  seqCounter: "1001",
  
  visibleSections: {
    showLogo: true,
    coAddress: true,
    coContact: true,
    clientAddress: true,
    clientContact: true,
    discount: true,
    taxRow: true,
    shippingRow: true,
    paymentTerms: true,
    bankBlock: true,
    bankName: true,
    accountName: true,
    acNumber: true,
    bankSwift: true,
    bankRouting: true,
    addNotes: true,
  }
};

export const INITIAL_PRESETS = [
  {
    id: "preset-citystyle",
    name: "CityStyle",
    data: { ...DEFAULT_INVOICE_DATA }
  },
  {
    id: "preset-minimalist",
    name: "Minimalist Dark",
    data: {
      ...DEFAULT_INVOICE_DATA,
      invoiceNo: "INV0002",
      themeColor: "#111827", // charcoal
      coName: "Studio Minimal",
      coAddress: "Tokyo, Japan",
      clientName: "Sato Corp",
      clientAddress: "Kyoto, Japan",
      discountPercent: 0,
      taxPercent: 10,
      shipping: 0,
      items: [
        {
          id: "item-min-1",
          name: "Design Retainer",
          description: "Monthly brand consultation",
          qty: 1,
          rate: 2500,
        }
      ],
      visibleSections: {
        ...DEFAULT_INVOICE_DATA.visibleSections,
        discount: false,
        shippingRow: false,
        bankRouting: false,
      }
    }
  },
  {
    id: "preset-creative",
    name: "Amber Creative",
    data: {
      ...DEFAULT_INVOICE_DATA,
      invoiceNo: "INV0003",
      themeColor: "#f59e0b", // Amber warm color
      coName: "Creative Labs",
      coAddress: "San Francisco, CA, USA",
      clientName: "Alex Mercer",
      clientAddress: "Oakland, CA, USA",
      discountPercent: 10,
      taxPercent: 8.5,
      shipping: 15,
      items: [
        {
          id: "item-cr-1",
          name: "3D Rendering Asset",
          description: "Visualizations for landing page mockup",
          qty: 3,
          rate: 450,
        },
        {
          id: "item-cr-2",
          name: "Typography License",
          description: "Web fonts and branding materials bundle",
          qty: 1,
          rate: 180,
        }
      ]
    }
  }
];

export const PRESET_THEME_COLORS = [
  { name: "Navy Blue", value: "#1e3a8a" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Cyan", value: "#0ea5e9" },
  { name: "Teal", value: "#0d9488" },
  { name: "Emerald", value: "#10b981" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Charcoal", value: "#1f2937" }
];
