/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  qty: number;
  rate: number;
}

export interface VisibleSections {
  showLogo: boolean;
  coAddress: boolean;
  coContact: boolean;
  clientAddress: boolean;
  clientContact: boolean;
  discount: boolean;
  taxRow: boolean;
  shippingRow: boolean;
  paymentTerms: boolean;
  bankBlock: boolean;
  bankName: boolean;
  accountName: boolean;
  acNumber: boolean;
  bankSwift: boolean;
  bankRouting: boolean;
  addNotes: boolean;
}

export interface InvoiceData {
  invoiceNo: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  
  // Billing
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  
  // Company Details
  coName: string;
  coAddress: string;
  coEmail: string;
  coPhone: string;
  coWebsite: string;
  
  // Bank Info
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankSwift: string;
  bankRouting: string;
  
  // Lists & Notes
  items: InvoiceItem[];
  notes: string;
  logo: string; // Base64 or standard logo URL
  
  // Financial Adjustment overrides
  currency: string;
  discountPercent: number;
  taxPercent: number;
  shipping: number;
  
  // Accent color hex
  themeColor: string;
  
  // Format info
  invoiceFormat?: string;
  seqCounter?: string;
  
  // Toggles
  visibleSections: VisibleSections;
}

export interface PresetDraft {
  id: string;
  name: string;
  data: InvoiceData;
}
