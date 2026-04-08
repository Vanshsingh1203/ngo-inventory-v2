import { CalendarDays } from "lucide-react";
import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { LogOut, Package, Warehouse, Truck, DollarSign, BarChart3, FileText, Menu, HelpCircle, Globe, Trash2, AlertTriangle, CheckCircle, Users, User, Home, Plus, Search, ArrowRight, Download, Eye, EyeOff, Shield, ClipboardList, Moon, Sun, CreditCard, Building2, Mail, Phone, Tag, ShoppingCart, Heart, Gift, Box, Minus, X, Star, Award, UserPlus, RefreshCw } from "lucide-react";
import { supabase } from "./supabaseClient";
import * as XLSX from "xlsx";

// ============================================
// GLOBAL STYLES - CSS Animations & Effects
// ============================================
function GlobalStyles() {
  return (
    <style>{`
      /* ── Neumorphic Design System ── */

      /* Keyframe Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }

      /* Typography */
      h1, h2, h3, h4 {
        font-family: 'Plus Jakarta Sans', 'DM Sans', sans-serif !important;
      }

      /* Animation Classes */
      .fade-in { animation: fadeIn 0.3s ease-out forwards; }
      .slide-up { animation: slideUp 0.4s ease-out forwards; }
      .slide-in { animation: slideIn 0.3s ease-out forwards; }
      .scale-in { animation: scaleIn 0.25s ease-out forwards; }
      .float { animation: float 3s ease-in-out infinite; }

      /* Staggered Animations */
      .stagger-1 { animation-delay: 0.05s; opacity: 0; }
      .stagger-2 { animation-delay: 0.1s; opacity: 0; }
      .stagger-3 { animation-delay: 0.15s; opacity: 0; }
      .stagger-4 { animation-delay: 0.2s; opacity: 0; }
      .stagger-5 { animation-delay: 0.25s; opacity: 0; }
      .stagger-6 { animation-delay: 0.3s; opacity: 0; }

      /* Hover – Neumorphic Lift */
      .hover-lift {
        transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
      }
      .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6) !important;
      }
      .hover-scale {
        transition: transform 0.15s ease;
      }
      .hover-scale:hover {
        transform: scale(1.02);
      }
      .hover-glow {
        transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
      }
      .hover-glow:hover {
        transform: translateY(-2px);
        box-shadow: 12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6) !important;
      }

      /* Button – Neumorphic Press */
      .btn-hover {
        transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
        position: relative;
        overflow: hidden;
      }
      .btn-hover:hover {
        transform: translateY(-1px);
      }
      .btn-hover:active {
        transform: translateY(0.5px) !important;
        box-shadow: inset 3px 3px 6px rgb(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5) !important;
      }

      /* Card – Neumorphic Lift on Hover */
      .card-hover {
        transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
      }
      .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 12px 12px 20px rgb(163,177,198,0.7), -12px -12px 20px rgba(255,255,255,0.6) !important;
      }

      /* Row Hover */
      .row-hover {
        transition: background-color 0.15s ease;
        border-radius: 12px;
      }
      .row-hover:hover {
        background-color: rgba(108,99,255,0.05) !important;
      }

      /* Icon Hover */
      .icon-hover {
        transition: transform 0.2s ease, color 0.2s ease;
      }
      .icon-hover:hover {
        transform: scale(1.1);
      }

      /* Skeleton – Neumorphic shimmer */
      .skeleton {
        background: linear-gradient(90deg, #d5dae5 25%, #e4e9f2 50%, #d5dae5 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 12px;
      }
      .skeleton-dark {
        background: linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 12px;
      }

      /* Pulse Animation */
      .pulse {
        animation: pulse 2s ease-in-out infinite;
      }

      /* Spin Animation */
      .spin {
        animation: spin 1s linear infinite;
      }

      /* Responsive Grid */
      .grid-responsive {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      @media (max-width: 900px) {
        .grid-responsive {
          grid-template-columns: 1fr;
        }
      }

      /* Mobile Utilities */
      @media (max-width: 768px) {
        .hide-mobile { display: none !important; }
        .full-width-mobile { width: 100% !important; }
        .stack-mobile { flex-direction: column !important; }
        .text-center-mobile { text-align: center !important; }
      }
      @media (max-width: 600px) {
        .flex-col-mobile { flex-direction: column !important; }
      }

      /* Transitions */
      .transition-all {
        transition: all 0.3s ease-out;
      }
      .transition-colors {
        transition: color 0.15s ease, background-color 0.15s ease;
      }

      /* Custom Scrollbar – Neumorphic */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track {
        background: #E0E5EC;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: rgb(163,177,198,0.7);
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgb(163,177,198,0.9);
      }

      /* Focus States – Neumorphic Accent Ring */
      input:focus, select:focus, textarea:focus {
        outline: none;
        box-shadow: inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6), 0 0 0 2px rgba(108,99,255,0.25) !important;
      }
      button:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px #E0E5EC, 0 0 0 4px rgba(108,99,255,0.5) !important;
      }

      /* Toast Animation */
      .toast-enter {
        animation: slideUp 0.3s ease-out forwards;
      }

      /* ══════════════════════════════════════
         RESPONSIVE LAYOUT — Tablet & Mobile
         ══════════════════════════════════════ */

      /* Distribute view: main content + 380px cart sidebar */
      .distribute-grid {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 20px;
      }
      @media (max-width: 1024px) {
        .distribute-grid { grid-template-columns: 1fr; }
      }

      /* Calendar view: main calendar + 320px detail panel */
      .calendar-grid {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 20px;
      }
      @media (max-width: 900px) {
        .calendar-grid { grid-template-columns: 1fr; }
      }

      /* 3-column form fields (qty / condition / cost) */
      .form-3col {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 12px;
      }
      @media (max-width: 580px) {
        .form-3col { grid-template-columns: 1fr; }
      }

      /* 2-column form fields (email / phone) */
      .form-2col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      @media (max-width: 580px) {
        .form-2col { grid-template-columns: 1fr; }
      }

      /* Inventory table: hide verbose columns on mobile */
      @media (max-width: 768px) {
        /* Hide: ID(1), Subcategory(3), Condition(5), Donor(6), Location(8), Date(9) */
        .inventory-table th:nth-child(1),
        .inventory-table td:nth-child(1),
        .inventory-table th:nth-child(3),
        .inventory-table td:nth-child(3),
        .inventory-table th:nth-child(5),
        .inventory-table td:nth-child(5),
        .inventory-table th:nth-child(6),
        .inventory-table td:nth-child(6),
        .inventory-table th:nth-child(8),
        .inventory-table td:nth-child(8),
        .inventory-table th:nth-child(9),
        .inventory-table td:nth-child(9) {
          display: none;
        }
      }

      /* Stat card row: enforce 2-up on small mobile */
      @media (max-width: 480px) {
        .stat-cards-row {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
        }
        .stat-cards-row > * {
          flex: none !important;
          min-width: unset !important;
        }
      }

      /* Main page padding: tighter on mobile */
      @media (max-width: 640px) {
        #page-content { padding: 14px !important; }
      }

      /* Header: hide lang button text label on tiny screens */
      @media (max-width: 400px) {
        .lang-text { display: none; }
      }

      /* Minimum touch targets on mobile */
      @media (max-width: 768px) {
        button { min-height: 40px; }
        .btn-hover { min-height: 40px; }
      }

      /* Cards: slightly less padding on mobile */
      @media (max-width: 640px) {
        .neu-card { padding: 18px !important; }
      }
    `}</style>
  );
}

// ============================================
// SKELETON COMPONENTS
// ============================================
function SkeletonCard({ dark }) {
  const cls = dark ? "skeleton-dark" : "skeleton";
  return (
    <div style={{ padding: 20, borderRadius: dark ? 14 : 32, background: dark ? "#0a0a0a" : "#E0E5EC", boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.4)" : "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)" }}>
      <div className={cls} style={{ width: 40, height: 40, borderRadius: 12, marginBottom: 14 }} />
      <div className={cls} style={{ width: "60%", height: 24, marginBottom: 10, borderRadius: 8 }} />
      <div className={cls} style={{ width: "40%", height: 14, borderRadius: 8 }} />
    </div>
  );
}

function SkeletonText({ dark, width = "100%", height = 14 }) {
  return <div className={dark ? "skeleton-dark" : "skeleton"} style={{ width, height }} />;
}

function SkeletonRow({ dark, cols = 5 }) {
  const cls = dark ? "skeleton-dark" : "skeleton";
  return (
    <div style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: `1px solid ${dark ? "#141414" : "#f0f0f0"}` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className={cls} style={{ flex: i === 0 ? "0 0 80px" : 1, height: 16 }} />
      ))}
    </div>
  );
}

function SkeletonTable({ dark, rows = 5, cols = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} dark={dark} cols={cols} />
      ))}
    </div>
  );
}

function SkeletonDashboard({ dark }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{ flex: "1 1 140px", minWidth: 140 }}>
            <SkeletonCard dark={dark} />
          </div>
        ))}
      </div>
      <div className="grid-responsive" style={{ gap: 12 }}>
        <div style={{ padding: 18, borderRadius: dark ? 10 : 24, background: dark ? "#0a0a0a" : "#E0E5EC", boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)" }}>
          <SkeletonText dark={dark} width="40%" height={18} />
          <div style={{ marginTop: 20 }}>
            <SkeletonText dark={dark} width="100%" height={180} />
          </div>
        </div>
        <div style={{ padding: 18, borderRadius: dark ? 10 : 24, background: dark ? "#0a0a0a" : "#E0E5EC", boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)" }}>
          <SkeletonText dark={dark} width="40%" height={18} />
          <div style={{ marginTop: 20 }}>
            <SkeletonText dark={dark} width="100%" height={180} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner({ size = 20, color = "#2563eb" }) {
  return (
    <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" opacity="0.3" />
      <path d="M12 2v4" />
    </svg>
  );
}

// ============================================
// EMPTY STATE WITH SVG ILLUSTRATIONS
// ============================================
function EmptyStateIllustration({ type = "box", size = 80, color = "#a3a3a3" }) {
  const illustrations = {
    box: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <rect x="15" y="25" width="50" height="40" rx="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M15 35 L40 45 L65 35" stroke={color} strokeWidth="2" fill="none" />
        <path d="M40 45 L40 65" stroke={color} strokeWidth="2" />
        <path d="M25 20 L40 10 L55 20" stroke={color} strokeWidth="2" fill="none" />
        <path d="M25 20 L25 25" stroke={color} strokeWidth="2" />
        <path d="M55 20 L55 25" stroke={color} strokeWidth="2" />
      </svg>
    ),
    cart: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <circle cx="30" cy="65" r="5" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="55" cy="65" r="5" stroke={color} strokeWidth="2" fill="none" />
        <path d="M10 15 L20 15 L28 50 L60 50 L68 25 L25 25" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35 35 L50 35" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M33 42 L52 42" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <circle cx="35" cy="35" r="18" stroke={color} strokeWidth="2" fill="none" />
        <path d="M48 48 L62 62" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M28 30 L32 34" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M35 27 L35 32" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <rect x="12" y="20" width="56" height="48" rx="4" stroke={color} strokeWidth="2" fill="none" />
        <path d="M12 32 L68 32" stroke={color} strokeWidth="2" />
        <path d="M25 12 L25 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M55 12 L55 24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <rect x="22" y="40" width="8" height="8" rx="1" fill={color} opacity="0.3" />
        <rect x="36" y="40" width="8" height="8" rx="1" fill={color} opacity="0.3" />
        <rect x="50" y="40" width="8" height="8" rx="1" fill={color} opacity="0.3" />
        <rect x="22" y="52" width="8" height="8" rx="1" fill={color} opacity="0.3" />
        <rect x="36" y="52" width="8" height="8" rx="1" fill={color} opacity="0.3" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="28" r="12" stroke={color} strokeWidth="2" fill="none" />
        <path d="M20 65 C20 50 30 42 40 42 C50 42 60 50 60 65" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="30" r="8" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M62 45 C68 48 72 55 72 62" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <path d="M15 60 L15 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M15 60 L65 60" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <rect x="22" y="35" width="10" height="25" rx="2" fill={color} opacity="0.3" />
        <rect x="37" y="25" width="10" height="35" rx="2" fill={color} opacity="0.5" />
        <rect x="52" y="40" width="10" height="20" rx="2" fill={color} opacity="0.3" />
      </svg>
    ),
    truck: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <rect x="8" y="30" width="40" height="25" rx="3" stroke={color} strokeWidth="2" fill="none" />
        <path d="M48 40 L60 40 L68 50 L68 55 L48 55 L48 40" stroke={color} strokeWidth="2" fill="none" strokeLinejoin="round" />
        <circle cx="22" cy="58" r="6" stroke={color} strokeWidth="2" fill="none" />
        <circle cx="58" cy="58" r="6" stroke={color} strokeWidth="2" fill="none" />
        <path d="M28 55 L48 55" stroke={color} strokeWidth="2" />
      </svg>
    ),
    default: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="25" stroke={color} strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <path d="M40 28 L40 45" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="52" r="2" fill={color} />
      </svg>
    )
  };
  return illustrations[type] || illustrations.default;
}

function EmptyState({ icon = "box", title, description, action, onAction, dark }) {
  const c = dark ? { text: "#fafafa", muted: "#a3a3a3", faint: "#525252" } : { text: "#1a1a1a", muted: "#737373", faint: "#a3a3a3" };
  return (
    <div className="fade-in" style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ marginBottom: 16, opacity: 0.6 }}>
        <EmptyStateIllustration type={icon} size={72} color={c.faint} />
      </div>
      {title && <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: c.text }}>{title}</h3>}
      {description && <p style={{ margin: "0 0 20px", fontSize: 13, color: c.muted, maxWidth: 280, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>{description}</p>}
      {action && onAction && (
        <button onClick={onAction} className="btn-hover" style={{ padding: "10px 22px", background: "#6C63FF", color: "#fff", border: "none", borderRadius: 16, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "5px 5px 10px rgb(163,177,198,0.5), -5px -5px 10px rgba(255,255,255,0.4)" }}>
          <Plus size={16} /> {action}
        </button>
      )}
    </div>
  );
}

// ============================================
// THEMES & TRANSLATIONS
// ============================================
const LIGHT = {
  bg:"#E0E5EC",card:"#E0E5EC",cardBorder:"transparent",
  text:"#3D4852",textSec:"#3D4852",textMuted:"#6B7280",textFaint:"#9CA3AF",
  input:"#E0E5EC",inputBorder:"transparent",
  headerBg:"rgba(224,229,236,0.92)",headerBorder:"transparent",
  tableBg:"#E0E5EC",tableRowBorder:"rgba(163,177,198,0.25)",
  tagBg:"rgba(108,99,255,0.1)",modalBg:"#E0E5EC",overlayBg:"rgba(0,0,0,.4)",
  confirmBg:"#E0E5EC",urgentBg:"rgba(239,68,68,0.08)",
  sidebarBg:"#E0E5EC",pillBg:"#E0E5EC",pillActive:"#E0E5EC",
  accent:"#6C63FF",accentLight:"rgba(108,99,255,0.12)",accentDark:"#5A52D5",
  // Neumorphic shadow tokens
  cardShadow:"9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)",
  cardShadowSm:"5px 5px 10px rgb(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)",
  inputShadow:"inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)",
  inputShadowDeep:"inset 10px 10px 20px rgb(163,177,198,0.7), inset -10px -10px 20px rgba(255,255,255,0.6)",
  insetSm:"inset 3px 3px 6px rgb(163,177,198,0.6), inset -3px -3px 6px rgba(255,255,255,0.5)",
  cardRadius:32,inputRadius:16,btnRadius:16,
};

const DARK = {
  bg:"#000",card:"#0a0a0a",cardBorder:"rgba(255,255,255,.03)",
  text:"#fafafa",textSec:"#d4d4d4",textMuted:"#a3a3a3",textFaint:"#525252",
  input:"#141414",inputBorder:"#1f1f1f",
  headerBg:"rgba(0,0,0,.8)",headerBorder:"#141414",
  tableBg:"#0a0a0a",tableRowBorder:"#141414",
  tagBg:"#141414",modalBg:"#0a0a0a",overlayBg:"rgba(0,0,0,.8)",
  confirmBg:"#0a0a0a",urgentBg:"#1c0a0a",
  sidebarBg:"#000",pillBg:"#141414",pillActive:"#1a1a1a",
  accent:"#8B84FF",accentLight:"#1e1a4f",accentDark:"#6C63FF",
  // Dark-mode shadow fallbacks (standard shadows, not neumorphic)
  cardShadow:"0 2px 12px rgba(0,0,0,0.4)",
  cardShadowSm:"0 1px 6px rgba(0,0,0,0.3)",
  inputShadow:"inset 0 2px 4px rgba(0,0,0,0.3)",
  inputShadowDeep:"inset 0 4px 8px rgba(0,0,0,0.4)",
  insetSm:"inset 0 1px 3px rgba(0,0,0,0.3)",
  cardRadius:14,inputRadius:10,btnRadius:8,
};

const T = {
  en: {
    appName:"NGO Inventory Manager",appDesc:"Donation Tracking & Distribution System",
    login:"Sign In",logout:"Sign Out",email:"Email",password:"Password",
    signingIn:"Signing in...",loginError:"Invalid email or password",welcome:"Welcome back",
    dashboard:"Dashboard",receive:"Receive",inventory:"Inventory",
    distribute:"Distribute",giftCards:"Gift Cards",reports:"Reports",
    admin:"Administrator",reception:"Reception",distribution:"Distribution",inventoryRole:"Inventory",
    totalReceived:"Total Items Received",inStorage:"Currently In Storage",
    distributed:"Items Distributed",giftCardTotal:"Gift Card Donations",
    urgentItems:"Urgent Items",peopleServed:"People Served",totalSales:"Total Sales",
    inventoryByCategory:"Inventory by Category",statusBreakdown:"Status Breakdown",
    trendsOverTime:"Donation Trends Over Time",monthly:"Monthly",yearly:"Yearly",
    receiveNew:"Receive New Donation",category:"Category",subcategory:"Subcategory",
    quantity:"Quantity",condition:"Condition",donorName:"Donor Name",
    notes:"Notes",markUrgent:"Mark as Urgent / Perishable",
    selectCategory:"Select Category",selectSub:"Select Subcategory",
    anonymous:"Leave blank for Anonymous",anyNotes:"Any special notes...",
    receiveBtn:"Receive Donation",logGiftCard:"Log Gift Card",
    lastEntry:"Last Entry",submitEntry:"Submit an entry to see details here",
    amount:"Amount",type:"Type",purpose:"Purpose",generalFund:"General Fund",
    fullInventory:"Full Inventory",searchPlaceholder:"Search by ID, donor, category...",
    allCategories:"All Categories",allStatuses:"All Statuses",
    showing:"Showing",of:"of",items:"items",
    moveToStorage:"Move to Storage",shelfLocation:"Shelf Location",
    enterLocation:"Enter shelf location (e.g. Shelf A3, Back rack)...",
    locationRequired:"Location is required",
    distributeItems:"Distribute Items",lookUp:"Look Up",
    enterBarcode:"Enter item ID or search...",itemFound:"Item Found",
    itemNotFound:"Item not found in storage. Check the ID or it may already be distributed.",
    qtyAvailable:"Qty Available",distributeBtn:"Distribute",
    availableForDist:"Available for Distribution",noItemsStorage:"No items in storage",
    recipientType:"Recipient Type",individual:"Individual",family:"Family",
    familySize:"How many people in the family?",peopleCount:"People count",
    qtyExceeds:"Quantity exceeds available stock",
    giftCardDonations:"Gift Card Donations",totalGiftCards:"Total Gift Card Value",
    transactions:"transactions",byCompany:"By Company",
    yearEndReport:"Year-End Report",generated:"Generated",
    executiveSummary:"Executive Summary",itemsReceived:"Items Received",
    itemsDistributed:"Items Distributed",currentlyInStock:"Currently In Stock",
    giftCardsReceived:"Gift Cards Received",uniqueDonors:"Unique Donors",
    distributionRate:"Distribution Rate",totalPeopleServed:"Total People Served",
    familiesServed:"Families Served",individualsServed:"Individuals Served",
    catBreakdown:"Category Breakdown: Received vs Distributed",
    unusableWarning:"items were received in unusable condition and could not be distributed.",
    downloadExcel:"Download Excel Report",reportNote:"This report is auto-generated from live inventory records.",
    confirmSubmit:"Confirm Submission",confirmSubmitMsg:"Please review the details below before submitting.",
    confirm:"Confirm",cancel:"Cancel",
    confirmDelete:"Confirm Deletion",confirmDeleteMsg:"This will remove this entry. This action cannot be undone.",
    delete:"Delete",
    tutSkip:"Skip Tutorial",tutNext:"Next",tutBack:"Back",tutDone:"Got It!",
    noData:"No data to display",date:"Date",status:"Status",location:"Location",
    action:"Action",donor:"Donor",id:"ID",qty:"Qty",
    new:"New",gentlyUsed:"Gently Used",worn:"Worn",unusable:"Unusable",
    received:"Received",inStorageStatus:"In Storage",sold:"Sold",help:"Help",
    donorType:"Donor Type",organization:"Organization",
    donorInfo:"Donor Information",orgName:"Organization Name",
    phone:"Phone",estimatedCost:"Estimated Cost ($)",
    giftCard:"Gift Card",company:"Company",
    sell:"Sell",sellItem:"Sell Item",salePrice:"Sale Price ($)",
    confirmSale:"Confirm Sale",salePriceRequired:"Sale price is required",
    itemSold:"Item marked as sold!",
    donorEmail:"Donor Email",donorPhone:"Donor Phone",
    receiptWillBeSent:"Receipt will be sent to donor's email",
    costPerItem:"Cost per item",totalEstValue:"Total Est. Value",
    salesRevenue:"Sales Revenue",itemsSold:"Items Sold",
  },
  es: {
    appName:"Gestor de Inventario ONG",appDesc:"Sistema de Seguimiento de Donaciones y Distribución",
    login:"Iniciar Sesión",logout:"Cerrar Sesión",email:"Correo",password:"Contraseña",
    signingIn:"Iniciando sesión...",loginError:"Correo o contraseña inválidos",welcome:"Bienvenido de nuevo",
    dashboard:"Panel",receive:"Recibir",inventory:"Inventario",
    distribute:"Distribuir",giftCards:"Tarjetas Regalo",reports:"Informes",
    admin:"Administrador",reception:"Recepción",distribution:"Distribución",inventoryRole:"Inventario",
    totalReceived:"Total de Artículos Recibidos",inStorage:"Actualmente en Almacén",
    distributed:"Artículos Distribuidos",giftCardTotal:"Donaciones en Tarjetas",
    urgentItems:"Artículos Urgentes",peopleServed:"Personas Atendidas",totalSales:"Ventas Totales",
    inventoryByCategory:"Inventario por Categoría",statusBreakdown:"Desglose por Estado",
    trendsOverTime:"Tendencias de Donaciones",monthly:"Mensual",yearly:"Anual",
    receiveNew:"Recibir Nueva Donación",category:"Categoría",subcategory:"Subcategoría",
    quantity:"Cantidad",condition:"Estado",donorName:"Nombre del Donante",
    notes:"Notas",markUrgent:"Marcar como Urgente / Perecedero",
    selectCategory:"Seleccionar Categoría",selectSub:"Seleccionar Subcategoría",
    anonymous:"Dejar en blanco para Anónimo",anyNotes:"Notas especiales...",
    receiveBtn:"Recibir Donación",logGiftCard:"Registrar Tarjeta Regalo",
    lastEntry:"Última Entrada",submitEntry:"Envíe una entrada para ver detalles aquí",
    amount:"Monto",type:"Tipo",purpose:"Propósito",generalFund:"Fondo General",
    fullInventory:"Inventario Completo",searchPlaceholder:"Buscar por ID, donante, categoría...",
    allCategories:"Todas las Categorías",allStatuses:"Todos los Estados",
    showing:"Mostrando",of:"de",items:"artículos",
    moveToStorage:"Mover a Almacén",shelfLocation:"Ubicación del Estante",
    enterLocation:"Ingrese ubicación (ej. Estante A3, Rack trasero)...",
    locationRequired:"La ubicación es obligatoria",
    distributeItems:"Distribuir Artículos",lookUp:"Buscar",
    enterBarcode:"Ingrese ID del artículo o busque...",itemFound:"Artículo Encontrado",
    itemNotFound:"Artículo no encontrado en almacén. Verifique el ID.",
    qtyAvailable:"Cant. Disponible",distributeBtn:"Distribuir",
    availableForDist:"Disponible para Distribución",noItemsStorage:"No hay artículos en almacén",
    recipientType:"Tipo de Destinatario",individual:"Individual",family:"Familia",
    familySize:"¿Cuántas personas en la familia?",peopleCount:"Cantidad de personas",
    qtyExceeds:"Cantidad excede el inventario disponible",
    giftCardDonations:"Donaciones en Tarjetas Regalo",totalGiftCards:"Valor Total de Tarjetas",
    transactions:"transacciones",byCompany:"Por Empresa",
    yearEndReport:"Informe Anual",generated:"Generado",
    executiveSummary:"Resumen Ejecutivo",itemsReceived:"Artículos Recibidos",
    itemsDistributed:"Artículos Distribuidos",currentlyInStock:"En Stock Actualmente",
    giftCardsReceived:"Tarjetas Recibidas",uniqueDonors:"Donantes Únicos",
    distributionRate:"Tasa de Distribución",totalPeopleServed:"Total Personas Atendidas",
    familiesServed:"Familias Atendidas",individualsServed:"Individuos Atendidos",
    catBreakdown:"Desglose por Categoría: Recibido vs Distribuido",
    unusableWarning:"artículos fueron recibidos en condición inutilizable.",
    downloadExcel:"Descargar Informe Excel",reportNote:"Este informe se genera automáticamente desde los registros en vivo.",
    confirmSubmit:"Confirmar Envío",confirmSubmitMsg:"Revise los detalles antes de enviar.",
    confirm:"Confirmar",cancel:"Cancelar",
    confirmDelete:"Confirmar Eliminación",confirmDeleteMsg:"Esto eliminará esta entrada. Esta acción no se puede deshacer.",
    delete:"Eliminar",
    tutSkip:"Omitir Tutorial",tutNext:"Siguiente",tutBack:"Atrás",tutDone:"¡Entendido!",
    noData:"No hay datos",date:"Fecha",status:"Estado",location:"Ubicación",
    action:"Acción",donor:"Donante",id:"ID",qty:"Cant.",
    new:"Nuevo",gentlyUsed:"Poco Usado",worn:"Gastado",unusable:"Inutilizable",
    received:"Recibido",inStorageStatus:"En Almacén",sold:"Vendido",help:"Ayuda",
    donorType:"Tipo de Donante",organization:"Organización",
    donorInfo:"Información del Donante",orgName:"Nombre de Organización",
    phone:"Teléfono",estimatedCost:"Costo Estimado ($)",
    giftCard:"Tarjeta Regalo",company:"Empresa",
    sell:"Vender",sellItem:"Vender Artículo",salePrice:"Precio de Venta ($)",
    confirmSale:"Confirmar Venta",salePriceRequired:"El precio de venta es obligatorio",
    itemSold:"¡Artículo marcado como vendido!",
    donorEmail:"Email del Donante",donorPhone:"Teléfono del Donante",
    receiptWillBeSent:"Se enviará recibo al email del donante",
    costPerItem:"Costo por artículo",totalEstValue:"Valor Est. Total",
    salesRevenue:"Ingresos por Ventas",itemsSold:"Artículos Vendidos",
  },
};

const TUTORIAL_STEPS = {
  en:[{target:"sidebar-btn",title:"Menu",desc:"Open this menu to navigate between sections. Each role sees different tabs.",position:"right"},{target:"lang-btn",title:"Language",desc:"Switch between English and Spanish instantly.",position:"left"},{target:"theme-btn",title:"Dark Mode",desc:"Toggle between light and dark themes for comfortable viewing.",position:"left"},{target:"help-btn",title:"Help",desc:"Click here anytime to replay this tutorial.",position:"left"},{target:"page-content",title:"Your Workspace",desc:"This is where all the action happens. Receive donations, manage inventory, distribute items, and view reports.",position:"top"}],
  es:[{target:"sidebar-btn",title:"Menú",desc:"Abra este menú para navegar entre secciones. Cada rol ve diferentes pestañas.",position:"right"},{target:"lang-btn",title:"Idioma",desc:"Cambie entre inglés y español al instante.",position:"left"},{target:"theme-btn",title:"Modo Oscuro",desc:"Alterne entre temas claro y oscuro para una visualización cómoda.",position:"left"},{target:"help-btn",title:"Ayuda",desc:"Haga clic aquí en cualquier momento para repetir este tutorial.",position:"left"},{target:"page-content",title:"Su Espacio de Trabajo",desc:"Aquí es donde ocurre toda la acción. Reciba donaciones, gestione inventario, distribuya artículos y vea informes.",position:"top"}],
};

const CATEGORIES = [
  {code:"CLO",name:"Clothing",nameEs:"Ropa",subs:["Men's","Women's","Children's","Winter Wear"],subsEs:["Hombres","Mujeres","Niños","Ropa de Invierno"]},
  {code:"FOO",name:"Footwear",nameEs:"Calzado",subs:["Men's","Women's","Children's"],subsEs:["Hombres","Mujeres","Niños"]},
  {code:"TOI",name:"Toiletries",nameEs:"Artículos de Higiene",subs:["Hygiene Kits","Soap/Shampoo","Dental","Feminine Products"],subsEs:["Kits de Higiene","Jabón/Champú","Dental","Productos Femeninos"]},
  {code:"HOU",name:"Household",nameEs:"Hogar",subs:["Bedding","Kitchenware","Cleaning Supplies"],subsEs:["Ropa de Cama","Utensilios","Limpieza"]},
  {code:"FOD",name:"Food",nameEs:"Alimentos",subs:["Canned","Dry Goods","Perishable"],subsEs:["Enlatados","Secos","Perecederos"]},
  {code:"GFT",name:"Gift Card",nameEs:"Tarjeta Regalo",subs:["Retail","Grocery","Gas","Restaurant","Other"],subsEs:["Tienda","Supermercado","Gasolina","Restaurante","Otro"]},
  {code:"MIS",name:"Miscellaneous",nameEs:"Misceláneo",subs:["Books","Toys","Electronics","Other"],subsEs:["Libros","Juguetes","Electrónicos","Otro"]},
];

const CONDITIONS=["New","Gently Used","Worn","Unusable"];
const COLORS=["#2563eb","#10b981","#f59e0b","#ef4444","#8b5cf6","#0ea5e9","#ec4899"];
const STATUS_CLR={Received:"#f59e0b","In Storage":"#2563eb",Distributed:"#10b981",Sold:"#8b5cf6"};
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const genId=(cat,list)=>{const d=new Date();const ds=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;const n=(list||[]).filter(i=>i.id?.startsWith(`${cat}-${ds}`)).length;return`${cat}-${ds}-${String(n+1).padStart(4,"0")}`;};

const AppContext=createContext();
const useApp=()=>useContext(AppContext);

// ============================================
// MODAL (Enhanced with animation)
// ============================================
function Modal({open,onClose,children}){
  const{c}=useApp();
  if(!open)return null;
  return(
    <div className="fade-in" style={{position:"fixed",inset:0,background:c.overlayBg,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div className="scale-in" style={{background:c.modalBg,borderRadius:c.cardRadius,maxWidth:420,width:"100%",padding:28,boxShadow:c.cardShadow}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ============================================
// TUTORIAL (Enhanced with animation)
// ============================================
function Tutorial({onComplete,lang}){
  const steps=TUTORIAL_STEPS[lang]||TUTORIAL_STEPS.en;const sk=lang==="es"?"Omitir":"Skip";const nx=lang==="es"?"Siguiente":"Next";const bk=lang==="es"?"Atrás":"Back";const dn=lang==="es"?"¡Entendido!":"Got It!";
  const[step,setStep]=useState(0);const[pos,setPos]=useState({top:100,left:100,width:100,height:40});
  useEffect(()=>{const el=document.getElementById(steps[step]?.target);if(el){const r=el.getBoundingClientRect();setPos({top:r.top,left:r.left,width:r.width,height:r.height});}},[step,steps]);
  const s=steps[step];const ts=(()=>{const base={position:"fixed",background:"#fff",borderRadius:12,padding:"20px 24px",boxShadow:"0 16px 48px rgba(0,0,0,.2)",zIndex:2002,maxWidth:320,width:"90vw"};if(s.position==="right")return{...base,top:pos.top-10,left:pos.left+pos.width+12};if(s.position==="left")return{...base,top:pos.top-10,right:window.innerWidth-pos.left+12};return{...base,top:pos.top+pos.height+12,left:Math.max(16,pos.left-100)};})();
  return(
    <div style={{position:"fixed",inset:0,zIndex:2000}}>
      <div className="fade-in" style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)"}}/>
      <div style={{position:"fixed",top:pos.top-4,left:pos.left-4,width:pos.width+8,height:pos.height+8,border:"2px solid #2563eb",borderRadius:10,zIndex:2001,boxShadow:"0 0 0 4000px rgba(0,0,0,.5)",pointerEvents:"none",transition:"all .2s ease"}}/>
      <div className="scale-in" style={ts}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:11,color:"#a3a3a3",fontWeight:600}}>{step+1}/{steps.length}</span>
          <button onClick={onComplete} className="btn-hover" style={{background:"none",border:"none",color:"#a3a3a3",cursor:"pointer",fontSize:12}}>{sk}</button>
        </div>
        <h3 style={{margin:"0 0 6px",fontSize:15,fontWeight:600,color:"#1a1a1a"}}>{s.title}</h3>
        <p style={{margin:"0 0 16px",fontSize:13,color:"#737373",lineHeight:1.5}}>{s.desc}</p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          {step>0&&<button onClick={()=>setStep(step-1)} className="btn-hover" style={{padding:"7px 14px",background:"#f5f5f5",color:"#525252",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>{bk}</button>}
          <button onClick={()=>step<steps.length-1?setStep(step+1):onComplete()} className="btn-hover" style={{padding:"7px 16px",background:"#2563eb",color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"}}>{step<steps.length-1?nx:dn}</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOGIN PAGE (Enhanced with animations)
// ============================================
function LoginPage({dark,toggleDark}){
  const[em,setEm]=useState("");const[pw,setPw]=useState("");const[showPw,setShowPw]=useState(false);const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const c=dark?DARK:LIGHT;
  const submit=async(e)=>{e.preventDefault();setLoading(true);setErr("");const{error}=await supabase.auth.signInWithPassword({email:em,password:pw});if(error){setErr("Invalid email or password");setLoading(false);}};
  const inp = {width:"100%",padding:"12px 14px",border:"none",borderRadius:c.inputRadius,fontSize:14,outline:"none",boxSizing:"border-box",background:c.input,color:c.text,boxShadow:c.inputShadow};
  return(
    <div className="fade-in" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:c.bg,padding:20}}>
      <button onClick={toggleDark} className="btn-hover" style={{position:"fixed",top:16,right:16,background:c.card,border:"none",borderRadius:c.btnRadius,padding:"8px 12px",cursor:"pointer",color:c.textMuted,display:"flex",alignItems:"center",gap:6,fontSize:12,boxShadow:c.cardShadowSm}}>{dark?<Sun size={14}/>:<Moon size={14}/>}</button>
      <div className="slide-up" style={{width:"100%",maxWidth:380}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          {/* Extruded icon, then deep inset inner well */}
          <div style={{width:72,height:72,borderRadius:20,background:c.card,boxShadow:c.cardShadow,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <div style={{width:48,height:48,borderRadius:14,background:c.card,boxShadow:c.inputShadow,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Package size={22} color={c.accent}/>
            </div>
          </div>
          <h1 style={{margin:0,fontSize:24,fontWeight:800,color:c.text,fontFamily:"'Plus Jakarta Sans', sans-serif",letterSpacing:"-0.5px"}}>NGO Inventory</h1>
          <p style={{margin:"6px 0 0",fontSize:13,color:c.textMuted,fontWeight:500}}>Donation Tracking & Distribution</p>
        </div>
        <div className="card-hover" style={{background:c.card,borderRadius:c.cardRadius,padding:32,boxShadow:c.cardShadow}}>
          <h2 style={{margin:"0 0 24px",fontSize:16,fontWeight:700,color:c.text,fontFamily:"'Plus Jakarta Sans', sans-serif"}}>Sign in to your account</h2>
          {err&&<div className="slide-up" style={{padding:"10px 14px",background:"rgba(239,68,68,0.08)",borderRadius:12,color:"#ef4444",fontSize:13,marginBottom:18,display:"flex",alignItems:"center",gap:6,boxShadow:c.insetSm}}><AlertTriangle size={14}/> {err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:c.textMuted,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Email</label>
              <input type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="you@example.com" className="transition-all" style={inp}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:c.textMuted,display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Password</label>
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter your password" className="transition-all" style={{...inp,paddingRight:44}} onKeyDown={e=>e.key==="Enter"&&submit(e)}/>
                <button onClick={()=>setShowPw(!showPw)} className="icon-hover" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:c.textFaint}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
              </div>
            </div>
            <button onClick={submit} disabled={loading} className="btn-hover" style={{padding:"13px",background:loading?"#9CA3AF":c.accent,color:"#fff",border:"none",borderRadius:c.btnRadius,fontSize:14,fontWeight:700,cursor:loading?"not-allowed":"pointer",marginTop:4,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:loading?"none":"5px 5px 10px rgb(163,177,198,0.5), -5px -5px 10px rgba(255,255,255,0.4)",letterSpacing:"0.02em"}}>
              {loading?<><LoadingSpinner size={16} color="#fff"/> Signing in...</>:"Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STAT CARD (Enhanced with animations)
// ============================================
function StatCard({icon,label,value,color,trend,delay=0}){
  const{c}=useApp();
  const delayClass = delay > 0 ? `stagger-${Math.min(delay, 6)}` : '';
  return(
    <div
      className={`hover-lift slide-up ${delayClass}`}
      style={{
        background:c.card,
        borderRadius:c.cardRadius,
        padding:"18px 20px",
        flex:"1 1 140px",
        minWidth:140,
        boxShadow:c.cardShadow,
        display:"flex",
        flexDirection:"column",
        gap:8,
        cursor:"default"
      }}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        {/* Deep-inset icon well — drilled into the surface */}
        <div style={{
          width:40,height:40,borderRadius:12,
          background:c.card,
          boxShadow:c.inputShadow,
          display:"flex",alignItems:"center",justifyContent:"center",
          color
        }}>{icon}</div>
        {trend !== undefined && (
          <span style={{fontSize:10,fontWeight:700,color:trend>0?"#10b981":"#ef4444",display:"flex",alignItems:"center",gap:2,background:trend>0?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)",padding:"3px 7px",borderRadius:20}}>
            {trend>0?"↑":"↓"}{Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{fontSize:24,fontWeight:700,color:c.text,letterSpacing:"-0.5px",fontFamily:"'Plus Jakarta Sans', sans-serif"}}>{value}</div>
      <div style={{fontSize:11,color:c.textMuted,fontWeight:500,letterSpacing:"0.02em",textTransform:"uppercase"}}>{label}</div>
    </div>
  );
}

// ============================================
// PART 2 - Constants, Helpers, Dashboard, ReceiveForm, InventoryView
// ============================================

// ============================================
// STORAGE ZONES
// ============================================
const ZONES = [
  {id:"A",name:"Clothing",nameEs:"Ropa",color:"#2563eb",bg:"#dbeafe",locations:["A1","A2","A3","A4"]},
  {id:"B",name:"Food",nameEs:"Alimentos",color:"#10b981",bg:"#d1fae5",locations:["B1","B2","B3","B4"]},
  {id:"C",name:"Household",nameEs:"Hogar",color:"#f59e0b",bg:"#fef3c7",locations:["C1","C2","C3","C4"]},
  {id:"D",name:"Toiletries",nameEs:"Higiene",color:"#ec4899",bg:"#fce7f3",locations:["D1","D2","D3","D4"]},
  {id:"E",name:"Footwear",nameEs:"Calzado",color:"#8b5cf6",bg:"#ede9fe",locations:["E1","E2","E3","E4"]},
  {id:"F",name:"Miscellaneous",nameEs:"Misceláneo",color:"#525252",bg:"#e5e5e5",locations:["F1","F2","F3","F4"]}
];

// ============================================
// HELPER FUNCTIONS
// ============================================
function daysSince(dateStr) {
  if (!dateStr) return 999;
  const date = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

function getDonorTier(totalValue) {
  if (totalValue >= 5000) return { label: "Gold", color: "#f59e0b" };
  if (totalValue >= 1000) return { label: "Silver", color: "#6b7280" };
  if (totalValue >= 250) return { label: "Bronze", color: "#cd7f32" };
  return { label: "Supporter", color: "#8b5cf6" };
}

const DEFAULT_KITS = [
  { id: "hygiene", name: "Hygiene Kit", nameEs: "Kit de Higiene", categories: ["TOI"] },
  { id: "winter", name: "Winter Bundle", nameEs: "Paquete de Invierno", categories: ["CLO", "FOO"] },
  { id: "family", name: "Family Pack", nameEs: "Paquete Familiar", categories: ["CLO", "FOO", "HOU", "TOI"] },
  { id: "food", name: "Food Box", nameEs: "Caja de Alimentos", categories: ["FOD"] }
];

const CHART_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#ec4899"];

// ============================================
// BADGE COMPONENT
// ============================================
function Badge({ children, color, bg }) {
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: bg || (color ? color + "15" : "rgba(107,114,128,0.1)"),
      color: color || "#6B7280",
      display: "inline-block",
      letterSpacing: "0.02em"
    }}>
      {children}
    </span>
  );
}

// ============================================
// TOAST COMPONENT
// ============================================
function Toast({ message, type = "success" }) {
  const icons = {
    success: <CheckCircle size={18} color="#10b981" />,
    error: <AlertTriangle size={18} color="#ef4444" />,
    warning: <AlertTriangle size={18} color="#f59e0b" />,
    info: <Package size={18} color="#6C63FF" />
  };
  const accent = { success:"#10b981", error:"#ef4444", warning:"#f59e0b", info:"#6C63FF" };
  const col = accent[type] || accent.success;
  return (
    <div className="slide-up" style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      background: "#E0E5EC",
      borderLeft: `4px solid ${col}`,
      color: "#3D4852",
      padding: "14px 22px", borderRadius: 20, fontWeight: 600, zIndex: 3000,
      boxShadow: "9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)",
      fontSize: 14,
      display: "flex", alignItems: "center", gap: 10, maxWidth: "90vw",
      whiteSpace: "nowrap"
    }}>
      {icons[type]}{message}
    </div>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard({ items, giftCards, distributions }) {
  const { t, c, lang } = useApp();
  const dark = c.bg === "#000";
  const [view, setView] = useState("monthly");

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const inStock = items.filter(i => i.status === "In Storage").reduce((s, i) => s + i.qty, 0);
  const dist = items.filter(i => i.status === "Distributed").reduce((s, i) => s + i.qty, 0);
  const totalGiftCards = giftCards.reduce((s, g) => s + g.amount, 0);
  const urgent = items.filter(i => i.urgent && i.status !== "Distributed" && i.status !== "Sold").length;
  const pplServed = distributions.reduce((s, d) => s + (d.people_count || 0), 0);
  const totalSales = items.filter(i => i.status === "Sold").reduce((s, i) => s + (i.sale_price || 0), 0);

  const catData = CATEGORIES.filter(cc => cc.code !== "GFT").map(cc => ({
    name: lang === "es" ? cc.nameEs : cc.name,
    qty: items.filter(i => i.cat === cc.code).reduce((s, i) => s + i.qty, 0)
  })).filter(d => d.qty > 0);

  const statusData = Object.entries(items.reduce((a, i) => {
    a[i.status] = (a[i.status] || 0) + i.qty;
    return a;
  }, {})).map(([name, value]) => ({ name, value }));

  const trendData = useMemo(() => {
    if (view === "monthly") {
      const d = {};
      items.forEach(i => {
        const m = i.date?.substring(0, 7);
        if (m) d[m] = (d[m] || 0) + i.qty;
      });
      return Object.entries(d).sort().slice(-12).map(([k, v]) => ({
        name: MONTHS[parseInt(k.split("-")[1]) - 1] + " " + k.split("-")[0].slice(2),
        qty: v
      }));
    } else {
      const d = {};
      items.forEach(i => {
        const y = i.date?.substring(0, 4);
        if (y) d[y] = (d[y] || 0) + i.qty;
      });
      return Object.entries(d).sort().map(([k, v]) => ({ name: k, qty: v }));
    }
  }, [items, view]);

  const card = { background: c.card, borderRadius: c.cardRadius, padding: 24, boxShadow: c.cardShadow };

  if (items.length === 0 && giftCards.length === 0) {
    return <SkeletonDashboard dark={dark} />;
  }

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className="stat-cards-row" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard icon={<Package size={16} />} label={t.totalReceived} value={totalQty} color="#2563eb" delay={1} />
        <StatCard icon={<Warehouse size={16} />} label={t.inStorage} value={inStock} color="#0ea5e9" delay={2} />
        <StatCard icon={<Truck size={16} />} label={t.distributed} value={dist} color="#10b981" delay={3} />
        <StatCard icon={<CreditCard size={16} />} label={t.giftCardTotal} value={`$${totalGiftCards.toLocaleString()}`} color="#f59e0b" delay={4} />
        <StatCard icon={<Users size={16} />} label={t.peopleServed} value={pplServed} color="#8b5cf6" delay={5} />
        <StatCard icon={<ShoppingCart size={16} />} label={t.totalSales} value={`$${totalSales.toLocaleString()}`} color="#ec4899" delay={6} />
        {urgent > 0 && <StatCard icon={<AlertTriangle size={16} />} label={t.urgentItems} value={urgent} color="#ef4444" delay={7} />}
      </div>

      <div className="grid-responsive" style={{ gap: 12 }}>
        <div className="card-hover" style={card}>
          <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: c.text }}>{t.inventoryByCategory}</h3>
          {catData.length === 0 ? (
            <EmptyState icon="chart" title={t.noData} dark={dark} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={catData}>
                <XAxis dataKey="name" fontSize={10} tick={{ fill: c.textMuted }} />
                <YAxis fontSize={10} tick={{ fill: c.textMuted }} />
                <Tooltip contentStyle={{ background: c.card, border: `1px solid ${c.inputBorder}`, borderRadius: 6, color: c.text, fontSize: 12 }} />
                <Bar dataKey="qty" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card-hover" style={card}>
          <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: c.text }}>{t.statusBreakdown}</h3>
          {statusData.length === 0 ? (
            <EmptyState icon="chart" title={t.noData} dark={dark} />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={10}>
                  {statusData.map((e, i) => <Cell key={i} fill={STATUS_CLR[e.name] || COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: c.card, border: `1px solid ${c.inputBorder}`, borderRadius: 6, color: c.text, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="card-hover" style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: c.text }}>{t.trendsOverTime}</h3>
          <div style={{ display: "flex", background: c.pillBg, borderRadius: 14, padding: 4, boxShadow: c.insetSm }}>
            {["monthly", "yearly"].map(v => (
              <button key={v} onClick={() => setView(v)} className="transition-colors btn-hover" style={{
                padding: "6px 14px", borderRadius: 10, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer",
                background: view === v ? c.card : "transparent",
                color: view === v ? c.accent : c.textMuted,
                boxShadow: view === v ? c.cardShadowSm : "none"
              }}>
                {v === "monthly" ? t.monthly : t.yearly}
              </button>
            ))}
          </div>
        </div>
        {trendData.length === 0 ? (
          <EmptyState icon="chart" title={t.noData} dark={dark} />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.tableRowBorder} />
              <XAxis dataKey="name" fontSize={10} tick={{ fill: c.textMuted }} />
              <YAxis fontSize={10} tick={{ fill: c.textMuted }} />
              <Tooltip contentStyle={{ background: c.card, border: `1px solid ${c.inputBorder}`, borderRadius: 6, color: c.text, fontSize: 12 }} />
              <Bar dataKey="qty" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ============================================
// RECEIVE FORM
// ============================================
function ReceiveForm({ items, giftCards, addItem, addGiftCard, addDonor, showToast }) {
  const { t, lang, profile, c } = useApp();
  const dark = c.bg === "#000";

  const [cat, setCat] = useState("");
  const [sub, setSub] = useState("");
  const [qty, setQty] = useState("");
  const [cond, setCond] = useState("New");
  const [notes, setNotes] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [estCost, setEstCost] = useState("");
  const [donorType, setDonorType] = useState("individual");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [orgName, setOrgName] = useState("");
  const [gcAmount, setGcAmount] = useState("");
  const [gcCompany, setGcCompany] = useState("");
  const [lastEntry, setLastEntry] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isGiftCard = cat === "GFT";
  const catObj = CATEGORIES.find(cc => cc.code === cat);
  const catName = catObj ? (lang === "es" ? catObj.nameEs : catObj.name) : "";
  const subs = catObj ? (lang === "es" ? catObj.subsEs : catObj.subs) : [];

  const reset = () => {
    setSub("");
    setQty("");
    setCond("New");
    setNotes("");
    setUrgent(false);
    setEstCost("");
    setGcAmount("");
    setGcCompany("");
  };

  const saveDonor = async () => {
    if (!donorName && !orgName) return null;
    if (donorEmail) {
      const { data: existing } = await supabase.from("donors").select("*").eq("email", donorEmail).single();
      if (existing) return existing;
    }
    const donorData = {
      type: donorType,
      name: donorType === "individual" ? donorName : (orgName || donorName),
      email: donorEmail || null,
      phone: donorPhone || null,
      organization_name: donorType === "organization" ? orgName : null,
      first_donation_date: new Date().toISOString().split("T")[0],
      last_donation_date: new Date().toISOString().split("T")[0],
      donation_count: 1
    };
    const { data, error } = await supabase.from("donors").insert(donorData).select().single();
    if (error) return null;
    return data;
  };

 const submit = async () => {
  setSaving(true);
  setShowConfirm(false);

  const donor = await saveDonor();
  const displayName = donorType === "organization" ? (orgName || donorName) : (donorName || "Anonymous");
  const receiptId = `RCP-${Date.now().toString(36).toUpperCase()}`;

  if (isGiftCard) {
    const entry = {
      id: genId("GFT", giftCards),
      amount: parseFloat(gcAmount),
      company: gcCompany || sub,
      donor_id: donor?.id || null,
      donor_name: displayName,
      date: new Date().toISOString().split("T")[0],
      notes
    };
    const ok = await addGiftCard(entry);
    if (ok) {
      setLastEntry({ ...entry, isGiftCard: true, donorEmail, donorPhone, donorType });
      showToast(lang === "es" ? "Tarjeta registrada" : "Gift card logged!");

      // Send receipt email if donor email exists
      if (donorEmail) {
        try {
          await fetch("https://kihtaffmfqbeukctceyk.supabase.co/functions/v1/send-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              donorName: displayName,
              donorEmail,
              donorType,
              orgName: orgName || null,
              items: [],
              giftCard: { company: gcCompany || sub, amount: parseFloat(gcAmount) },
              date: new Date().toLocaleDateString(),
              receiptId
            })
          });
          showToast(lang === "es" ? "Recibo enviado" : "Receipt sent!", "info");
        } catch (e) {
          console.error("Email error:", e);
        }
      }
    }
  } else {
    const totalEstCost = estCost ? parseFloat(estCost) * parseInt(qty) : null;
    const entry = {
      id: genId(cat, items),
      cat,
      catName: catObj.name,
      sub: catObj.subs[subs.indexOf(sub)] || sub,
      qty: parseInt(qty),
      condition: cond,
      donor: displayName,
      donor_id: donor?.id || null,
      donor_email: donorEmail || null,
      donor_phone: donorPhone || null,
      estimated_cost: totalEstCost,
      status: "Received",
      date: new Date().toISOString().split("T")[0],
      notes,
      urgent,
      location: "",
      created_by: profile?.id
    };
    const ok = await addItem(entry);
    if (ok) {
      setLastEntry({ ...entry, estCostPerItem: estCost, donorType, orgName });
      showToast(lang === "es" ? `${catName} recibido` : `${catName} received!`);

      // Send receipt email if donor email exists
      if (donorEmail) {
        try {
          await fetch("https://kihtaffmfqbeukctceyk.supabase.co/functions/v1/send-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              donorName: displayName,
              donorEmail,
              donorType,
              orgName: orgName || null,
              items: [{
                category: catObj.name,
                subcategory: catObj.subs[subs.indexOf(sub)] || sub,
                quantity: parseInt(qty),
                estimatedValue: totalEstCost
              }],
              giftCard: null,
              date: new Date().toLocaleDateString(),
              receiptId
            })
          });
          showToast(lang === "es" ? "Recibo enviado" : "Receipt sent!", "info");
        } catch (e) {
          console.error("Email error:", e);
        }
      }
    }
  }
  reset();
  setSaving(false);
};

  const trySubmit = () => {
    if (!cat) return;
    if (isGiftCard && (!gcAmount || isNaN(gcAmount) || (!gcCompany && !sub))) return;
    if (!isGiftCard && (!sub || !qty || isNaN(qty))) return;
    setShowConfirm(true);
  };

  const inp = { width: "100%", padding: "12px 14px", border: "none", borderRadius: c.inputRadius, fontSize: 14, boxSizing: "border-box", outline: "none", background: c.input, color: c.text, boxShadow: c.inputShadow };
  const lbl = { fontSize: 12, fontWeight: 600, color: c.textMuted, marginBottom: 8, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };
  const card = { background: c.card, borderRadius: c.cardRadius, padding: 28, boxShadow: c.cardShadow };

  return (
    <>
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#4f46e5" }}>
            <ClipboardList size={24} />
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.text }}>{t.confirmSubmit}</h3>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: c.textMuted }}>{t.confirmSubmitMsg}</p>
        </div>
        <div style={{ background: c.confirmBg, borderRadius: 10, padding: 16, fontSize: 13, color: c.textSec, lineHeight: 2, marginBottom: 20 }}>
          {isGiftCard ? (
            <>
              <b>{t.giftCard}:</b> {gcCompany || sub}<br />
              <b>{t.amount}:</b> ${gcAmount}<br />
            </>
          ) : (
            <>
              <b>{t.category}:</b> {catName}<br />
              <b>{t.subcategory}:</b> {sub}<br />
              <b>{t.quantity}:</b> {qty}<br />
              <b>{t.condition}:</b> {cond}<br />
              {estCost && <><b>{t.estimatedCost}:</b> ${(parseFloat(estCost) * parseInt(qty)).toFixed(2)}<br /></>}
            </>
          )}
          <b>{t.donorType}:</b> {donorType === "individual" ? t.individual : t.organization}<br />
          <b>{t.donorName}:</b> {donorType === "organization" ? (orgName || donorName) : (donorName || "Anonymous")}<br />
          {donorEmail && <><b>{t.email}:</b> {donorEmail}<br /></>}
          {donorPhone && <><b>{t.phone}:</b> {donorPhone}<br /></>}
        </div>
        {donorEmail && (
          <div style={{ background: "#ecfdf5", borderRadius: 8, padding: 10, fontSize: 12, color: "#166534", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={14} /> {t.receiptWillBeSent}
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setShowConfirm(false)} className="btn-hover" style={{ flex: 1, padding: "12px", background: c.card, color: c.textMuted, border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: c.cardShadowSm }}>{t.cancel}</button>
          <button onClick={submit} disabled={saving} className="btn-hover" style={{ flex: 1, padding: "12px", background: c.accent, color: "#fff", border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "5px 5px 10px rgb(163,177,198,0.5), -5px -5px 10px rgba(255,255,255,0.4)" }}>
            {saving && <LoadingSpinner size={16} color="#fff" />}
            {saving ? "..." : t.confirm}
          </button>
        </div>
      </Modal>

      <div className="fade-in grid-responsive" style={{ gap: 20 }}>
        <div className="card-hover" style={card}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: c.text, display: "flex", alignItems: "center", gap: 10 }}>
            <Package size={20} color="#4f46e5" /> {t.receiveNew}
          </h2>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>{t.donorType}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["individual", "organization"].map(dt => (
                <button key={dt} onClick={() => setDonorType(dt)} className="btn-hover" style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: donorType === dt ? "2px solid #4f46e5" : `1px solid ${c.inputBorder}`,
                  background: donorType === dt ? c.tagBg : c.card,
                  color: donorType === dt ? "#4f46e5" : c.textMuted,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}>
                  {dt === "individual" ? <User size={16} /> : <Building2 size={16} />}
                  {dt === "individual" ? t.individual : t.organization}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: c.confirmBg, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: c.text, display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={16} /> {t.donorInfo}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {donorType === "organization" && (
                <div>
                  <label style={{ ...lbl, marginBottom: 4 }}>{t.orgName}</label>
                  <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Acme Corporation" style={inp} />
                </div>
              )}
              <div>
                <label style={{ ...lbl, marginBottom: 4 }}>{donorType === "organization" ? "Contact Name" : t.donorName}</label>
                <input value={donorName} onChange={e => setDonorName(e.target.value)} placeholder={t.anonymous} style={inp} />
              </div>
              <div className="form-2col">
                <div>
                  <label style={{ ...lbl, marginBottom: 4 }}><Mail size={12} style={{ marginRight: 4 }} />{t.email}</label>
                  <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)} placeholder="email@example.com" style={inp} />
                </div>
                <div>
                  <label style={{ ...lbl, marginBottom: 4 }}><Phone size={12} style={{ marginRight: 4 }} />{t.phone}</label>
                  <input type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)} placeholder="(555) 123-4567" style={inp} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={lbl}>{t.category} *</label>
              <select value={cat} onChange={e => { setCat(e.target.value); setSub(""); }} style={inp}>
                <option value="">— {t.selectCategory} —</option>
                {CATEGORIES.map(cc => <option key={cc.code} value={cc.code}>{cc.code} — {lang === "es" ? cc.nameEs : cc.name}</option>)}
              </select>
            </div>

            {isGiftCard && (
              <>
                <div className="flex-col-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={lbl}>{t.company} *</label>
                    <input value={gcCompany} onChange={e => setGcCompany(e.target.value)} placeholder="Amazon, Target..." style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>{t.amount} ($) *</label>
                    <input type="number" min="0" step="0.01" value={gcAmount} onChange={e => setGcAmount(e.target.value)} placeholder="50.00" style={inp} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>{t.type}</label>
                  <select value={sub} onChange={e => setSub(e.target.value)} style={inp}>
                    <option value="">— {t.selectSub} —</option>
                    {subs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}

            {cat && !isGiftCard && (
              <>
                <div>
                  <label style={lbl}>{t.subcategory} *</label>
                  <select value={sub} onChange={e => setSub(e.target.value)} style={inp}>
                    <option value="">— {t.selectSub} —</option>
                    {subs.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-3col">
                  <div>
                    <label style={lbl}>{t.quantity} *</label>
                    <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="25" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>{t.condition}</label>
                    <select value={cond} onChange={e => setCond(e.target.value)} style={inp}>
                      {CONDITIONS.map(cc => <option key={cc}>{cc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}><Tag size={12} style={{ marginRight: 4 }} />{t.costPerItem}</label>
                    <input type="number" min="0" step="0.01" value={estCost} onChange={e => setEstCost(e.target.value)} placeholder="15.00" style={inp} />
                  </div>
                </div>
                {estCost && qty && (
                  <div className="slide-in" style={{ background: c.tagBg, borderRadius: 8, padding: 10, fontSize: 13, color: "#4f46e5", fontWeight: 600 }}>
                    {t.totalEstValue}: ${(parseFloat(estCost) * parseInt(qty)).toFixed(2)}
                  </div>
                )}
              </>
            )}

            {cat && (
              <>
                <div>
                  <label style={lbl}>{t.notes}</label>
                  <input value={notes} onChange={e => setNotes(e.target.value)} placeholder={t.anyNotes} style={inp} />
                </div>
                {!isGiftCard && (
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", color: urgent ? "#e11d48" : c.textMuted, fontWeight: 500 }}>
                    <input type="checkbox" checked={urgent} onChange={e => setUrgent(e.target.checked)} style={{ accentColor: "#e11d48" }} /> {t.markUrgent}
                  </label>
                )}
                <button onClick={trySubmit} disabled={saving} className="btn-hover" style={{
                  padding: "13px", background: saving ? "#9CA3AF" : c.accent, color: "#fff",
                  border: "none", borderRadius: c.btnRadius, fontSize: 15, fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: saving ? "none" : "5px 5px 10px rgb(163,177,198,0.5), -5px -5px 10px rgba(255,255,255,0.4)",
                  letterSpacing: "0.02em"
                }}>
                  {saving ? <LoadingSpinner size={18} color="#fff" /> : <><Plus size={18} /> {isGiftCard ? t.logGiftCard : t.receiveBtn}</>}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card-hover" style={card}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: c.text, display: "flex", alignItems: "center", gap: 10 }}>
            <ClipboardList size={20} color="#4f46e5" /> {t.lastEntry}
          </h2>
          {lastEntry ? (
            <div className="slide-in" style={{ background: c.confirmBg, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, color: c.textSec, lineHeight: 2.2 }}>
                <b>{t.id}:</b> <span style={{ fontFamily: "monospace", background: c.tagBg, padding: "2px 8px", borderRadius: 6, fontSize: 12 }}>{lastEntry.id}</span><br />
                {lastEntry.isGiftCard ? (
                  <>
                    <b>{t.giftCard}:</b> {lastEntry.company}<br />
                    <b>{t.amount}:</b> ${lastEntry.amount}<br />
                  </>
                ) : (
                  <>
                    <b>{t.category}:</b> {lastEntry.catName} → {lastEntry.sub}<br />
                    <b>{t.quantity}:</b> {lastEntry.qty}<br />
                    <b>{t.condition}:</b> {lastEntry.condition}<br />
                    {lastEntry.estimated_cost && <><b>{t.estimatedCost}:</b> ${lastEntry.estimated_cost.toFixed(2)}<br /></>}
                  </>
                )}
                <b>{t.donorType}:</b> {lastEntry.donorType === "organization" ? t.organization : t.individual}<br />
                <b>{t.donor}:</b> {lastEntry.donor || lastEntry.donor_name}<br />
                {lastEntry.donorEmail && <><b>{t.email}:</b> {lastEntry.donorEmail}<br /></>}
                {lastEntry.donorPhone && <><b>{t.phone}:</b> {lastEntry.donorPhone}<br /></>}
                <b>{t.date}:</b> {lastEntry.date}
              </div>
            </div>
          ) : (
            <EmptyState icon="box" title={t.noData} description={t.submitEntry} dark={dark} />
          )}
        </div>
      </div>
    </>
  );
}

function FloorPlan2D({ items, onZoneClick, selectedZone, c, lang, highlightShelf }) {
  const getZoneCount = (zoneId) => {
    const zone = ZONES.find(z => z.id === zoneId);
    if (!zone) return 0;
    return items.filter(i => i.status === "In Storage" && zone.locations.some(loc => i.location?.toUpperCase().startsWith(loc))).reduce((s, i) => s + i.qty, 0);
  };
  
  const getShelfCount = (shelf) => {
    return items.filter(i => i.status === "In Storage" && i.location?.toUpperCase() === shelf).reduce((s, i) => s + i.qty, 0);
  };
  
  const isShelfHighlighted = (shelf) => highlightShelf?.toUpperCase() === shelf;

  return (
    <svg viewBox="0 0 480 420" style={{ width: "100%", height: "auto" }}>
      <rect width="480" height="420" fill={c.bg} />
      {/* Main room */}
      <rect x="20" y="20" width="300" height="220" fill={c.card} stroke={c.text} strokeWidth="2" />
      {/* Extension room */}
      <rect x="320" y="120" width="140" height="160" fill={c.card} stroke={c.text} strokeWidth="2" />
      <line x1="320" y1="120" x2="320" y2="240" stroke={c.card} strokeWidth="3" />
      
      {/* Entry */}
      <rect x="40" y="237" width="50" height="5" fill={c.card} />
      <text x="65" y="255" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="500">ENTRY</text>
      
      {/* Zone A - Clothing */}
      <g onClick={() => onZoneClick?.("A")} style={{ cursor: "pointer" }}>
        <rect x="25" y="25" width="90" height="75" fill={selectedZone === "A" ? "#c7d2fe" : "#eef2ff"} stroke="#6366f1" strokeWidth={selectedZone === "A" ? 2 : 1} rx="4" />
        <text x="70" y="42" textAnchor="middle" fontSize="11" fill="#4338ca" fontWeight="700">A · {lang === "es" ? "Ropa" : "Clothing"}</text>
        <g transform="translate(30, 48)">
          {["A1","A2","A3","A4"].map((s,i) => (
            <g key={s} transform={`translate(${i*20}, 0)`}>
              <rect width="18" height="22" fill={isShelfHighlighted(s) ? "#4f46e5" : "#a5b4fc"} stroke="#6366f1" rx="2" />
              <text x="9" y="12" textAnchor="middle" fontSize="7" fill={isShelfHighlighted(s) ? "#fff" : "#3730a3"} fontWeight="600">{s}</text>
              <text x="9" y="20" textAnchor="middle" fontSize="6" fill={isShelfHighlighted(s) ? "#c7d2fe" : "#6366f1"}>{getShelfCount(s)}</text>
            </g>
          ))}
        </g>
        <rect x="55" y="78" width="30" height="12" fill="#6366f1" rx="6" />
        <text x="70" y="87" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{getZoneCount("A")}</text>
      </g>
      
      {/* Zone B - Food */}
      <g onClick={() => onZoneClick?.("B")} style={{ cursor: "pointer" }}>
        <rect x="125" y="25" width="90" height="75" fill={selectedZone === "B" ? "#a7f3d0" : "#ecfdf5"} stroke="#10b981" strokeWidth={selectedZone === "B" ? 2 : 1} rx="4" />
        <text x="170" y="42" textAnchor="middle" fontSize="11" fill="#047857" fontWeight="700">B · {lang === "es" ? "Alimentos" : "Food"}</text>
        <g transform="translate(130, 48)">
          {["B1","B2","B3","B4"].map((s,i) => (
            <g key={s} transform={`translate(${i*20}, 0)`}>
              <rect width="18" height="22" fill={isShelfHighlighted(s) ? "#059669" : "#6ee7b7"} stroke="#10b981" rx="2" />
              <text x="9" y="12" textAnchor="middle" fontSize="7" fill={isShelfHighlighted(s) ? "#fff" : "#065f46"} fontWeight="600">{s}</text>
              <text x="9" y="20" textAnchor="middle" fontSize="6" fill={isShelfHighlighted(s) ? "#a7f3d0" : "#10b981"}>{getShelfCount(s)}</text>
            </g>
          ))}
        </g>
        <rect x="155" y="78" width="30" height="12" fill="#10b981" rx="6" />
        <text x="170" y="87" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{getZoneCount("B")}</text>
      </g>
      
      {/* Fridge */}
      <rect x="225" y="25" width="35" height="45" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" rx="3" />
      <text x="242" y="50" textAnchor="middle" fontSize="8" fill="#1e40af" fontWeight="600">FRIDGE</text>
      
      {/* Zone C - Household */}
      <g onClick={() => onZoneClick?.("C")} style={{ cursor: "pointer" }}>
        <rect x="25" y="110" width="130" height="75" fill={selectedZone === "C" ? "#fde68a" : "#fffbeb"} stroke="#f59e0b" strokeWidth={selectedZone === "C" ? 2 : 1} rx="4" />
        <text x="90" y="127" textAnchor="middle" fontSize="11" fill="#b45309" fontWeight="700">C · {lang === "es" ? "Hogar" : "Household"}</text>
        <g transform="translate(30, 133)">
          {["C1","C2","C3","C4"].map((s,i) => (
            <g key={s} transform={`translate(${i*28}, 0)`}>
              <rect width="26" height="22" fill={isShelfHighlighted(s) ? "#d97706" : "#fcd34d"} stroke="#f59e0b" rx="2" />
              <text x="13" y="12" textAnchor="middle" fontSize="7" fill={isShelfHighlighted(s) ? "#fff" : "#78350f"} fontWeight="600">{s}</text>
              <text x="13" y="20" textAnchor="middle" fontSize="6" fill={isShelfHighlighted(s) ? "#fde68a" : "#b45309"}>{getShelfCount(s)}</text>
            </g>
          ))}
        </g>
        <rect x="75" y="163" width="30" height="12" fill="#f59e0b" rx="6" />
        <text x="90" y="172" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{getZoneCount("C")}</text>
      </g>
      
      {/* Zone D - Toiletries */}
      <g onClick={() => onZoneClick?.("D")} style={{ cursor: "pointer" }}>
        <rect x="165" y="110" width="130" height="75" fill={selectedZone === "D" ? "#fbcfe8" : "#fdf2f8"} stroke="#ec4899" strokeWidth={selectedZone === "D" ? 2 : 1} rx="4" />
        <text x="230" y="127" textAnchor="middle" fontSize="11" fill="#be185d" fontWeight="700">D · {lang === "es" ? "Higiene" : "Toiletries"}</text>
        <g transform="translate(170, 133)">
          {["D1","D2","D3","D4"].map((s,i) => (
            <g key={s} transform={`translate(${i*28}, 0)`}>
              <rect width="26" height="22" fill={isShelfHighlighted(s) ? "#db2777" : "#f9a8d4"} stroke="#ec4899" rx="2" />
              <text x="13" y="12" textAnchor="middle" fontSize="7" fill={isShelfHighlighted(s) ? "#fff" : "#9d174d"} fontWeight="600">{s}</text>
              <text x="13" y="20" textAnchor="middle" fontSize="6" fill={isShelfHighlighted(s) ? "#fbcfe8" : "#be185d"}>{getShelfCount(s)}</text>
            </g>
          ))}
        </g>
        <rect x="215" y="163" width="30" height="12" fill="#ec4899" rx="6" />
        <text x="230" y="172" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="600">{getZoneCount("D")}</text>
      </g>
      
      {/* Aisle */}
      <rect x="25" y="195" width="270" height="14" fill={c.pillBg} stroke={c.inputBorder} strokeWidth="1" strokeDasharray="3" rx="3" />
      <text x="160" y="205" textAnchor="middle" fontSize="7" fill={c.textMuted}>← MAIN AISLE →</text>
      
      {/* Zone E - Footwear */}
      <g onClick={() => onZoneClick?.("E")} style={{ cursor: "pointer" }}>
        <rect x="395" y="125" width="60" height="150" fill={selectedZone === "E" ? "#ddd6fe" : "#f5f3ff"} stroke="#8b5cf6" strokeWidth={selectedZone === "E" ? 2 : 1} rx="4" />
        <text x="425" y="142" textAnchor="middle" fontSize="10" fill="#6d28d9" fontWeight="700">E</text>
        <text x="425" y="154" textAnchor="middle" fontSize="8" fill="#8b5cf6">{lang === "es" ? "Calzado" : "Footwear"}</text>
        <g transform="translate(400, 160)">
          {["E1","E2","E3","E4"].map((s,i) => (
            <g key={s} transform={`translate(0, ${i*26})`}>
              <rect width="50" height="22" fill={isShelfHighlighted(s) ? "#7c3aed" : "#c4b5fd"} stroke="#8b5cf6" rx="2" />
              <text x="15" y="14" textAnchor="middle" fontSize="8" fill={isShelfHighlighted(s) ? "#fff" : "#5b21b6"} fontWeight="600">{s}</text>
              <text x="38" y="14" textAnchor="middle" fontSize="8" fill={isShelfHighlighted(s) ? "#ddd6fe" : "#7c3aed"}>{getShelfCount(s)}</text>
            </g>
          ))}
        </g>
      </g>
      
      {/* Zone F - Misc */}
      <g onClick={() => onZoneClick?.("F")} style={{ cursor: "pointer" }}>
        <rect x="325" y="175" width="65" height="100" fill={selectedZone === "F" ? "#cbd5e1" : "#f1f5f9"} stroke="#64748b" strokeWidth={selectedZone === "F" ? 2 : 1} rx="4" />
        <text x="357" y="192" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="700">F · Misc</text>
        <g transform="translate(330, 198)">
          {["F1","F2","F3","F4"].map((s,i) => (
            <g key={s} transform={`translate(${(i%2)*28}, ${Math.floor(i/2)*26})`}>
              <rect width="26" height="22" fill={isShelfHighlighted(s) ? "#475569" : "#cbd5e1"} stroke="#64748b" rx="2" />
              <text x="13" y="12" textAnchor="middle" fontSize="7" fill={isShelfHighlighted(s) ? "#fff" : "#374151"} fontWeight="600">{s}</text>
              <text x="13" y="20" textAnchor="middle" fontSize="6" fill={isShelfHighlighted(s) ? "#cbd5e1" : "#64748b"}>{getShelfCount(s)}</text>
            </g>
          ))}
        </g>
      </g>
      
      {/* Desk */}
      <rect x="325" y="130" width="55" height="22" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" rx="3" />
      <text x="352" y="144" textAnchor="middle" fontSize="8" fill="#92400e" fontWeight="500">Desk</text>
      
      {/* Legend */}
      <rect x="20" y="290" width="440" height="120" fill={c.confirmBg} stroke={c.inputBorder} rx="6" />
      <text x="35" y="310" fontSize="11" fill={c.text} fontWeight="600">{lang === "es" ? "Zonas de almacenamiento" : "Storage Zones"}</text>
      {ZONES.map((z, i) => (
        <g key={z.id} transform={`translate(${35 + (i % 3) * 145}, ${325 + Math.floor(i / 3) * 40})`}>
          <rect width="12" height="12" fill={z.color} rx="2" />
          <text x="18" y="10" fontSize="10" fill={c.text} fontWeight="600">{z.id}</text>
          <text x="30" y="10" fontSize="9" fill={c.textMuted}>{lang === "es" ? z.nameEs : z.name}</text>
          <text x="0" y="24" fontSize="8" fill={c.textFaint}>{z.locations.join(" · ")}</text>
        </g>
      ))}
    </svg>
  );
}

// ============================================
// INVENTORY VIEW
// ============================================
function InventoryView({ items, updateItem, deleteItem, showToast }) {
  const { t, lang, profile, c } = useApp();
  const dark = c.bg === "#000";

  const [search, setSearch] = useState("");
  const [fCat, setFCat] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [locInput, setLocInput] = useState({});
  const [delModal, setDelModal] = useState(null);
  const [sellModal, setSellModal] = useState(null);
  const [salePrice, setSalePrice] = useState("");
  const [highlightShelf, setHighlightShelf] = useState("");

  const pendingItems = items.filter(i => i.status === "Received");
  const filtered = items.filter(i => {
    if (search) {
      const q = search.toLowerCase();
      if (!i.id.toLowerCase().includes(q) && !i.donor?.toLowerCase().includes(q) && !i.catName?.toLowerCase().includes(q)) return false;
    }
    if (fCat && i.cat !== fCat) return false;
    if (fStatus && i.status !== fStatus) return false;
    return true;
  });

  const moveToStorage = async (id) => {
    const loc = locInput[id];
    if (!loc) { showToast(t.locationRequired); return; }
    const ok = await updateItem(id, { status: "In Storage", location: loc.toUpperCase() });
    if (ok) {
      showToast(t.moveToStorage + " ✓");
      setLocInput(p => ({ ...p, [id]: "" }));
      setHighlightShelf("");
    }
  };

  const confirmDelete = async () => {
    if (!delModal) return;
    await deleteItem(delModal);
    setDelModal(null);
    showToast(t.delete + " ✓");
  };

  const confirmSell = async () => {
    if (!sellModal) return;
    if (!salePrice || isNaN(salePrice)) { showToast(t.salePriceRequired); return; }
    const ok = await updateItem(sellModal, {
      status: "Sold",
      sale_price: parseFloat(salePrice),
      sold_date: new Date().toISOString().split("T")[0]
    });
    if (ok) {
      showToast(t.itemSold);
      setSellModal(null);
      setSalePrice("");
    }
  };

  const inp = { padding: "10px 14px", border: "none", borderRadius: c.inputRadius, fontSize: 13, outline: "none", background: c.input, color: c.text, boxShadow: c.inputShadow };
  const isAdmin = profile?.role === "admin";
  const card = { background: c.card, borderRadius: c.cardRadius, padding: 20, boxShadow: c.cardShadow };
  const getShelfZone = (shelf) => ZONES.find(z => z.locations.includes(shelf?.toUpperCase()));

  return (
    <div className="fade-in">
      <Modal open={!!delModal} onClose={() => setDelModal(null)}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#e11d48" }}>
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: c.text }}>{t.confirmDelete}</h3>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: c.textMuted }}>{t.confirmDeleteMsg}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setDelModal(null)} className="btn-hover" style={{ flex: 1, padding: "12px", background: c.card, color: c.textMuted, border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: c.cardShadowSm }}>{t.cancel}</button>
            <button onClick={confirmDelete} className="btn-hover" style={{ flex: 1, padding: "12px", background: "#e11d48", color: "#fff", border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "4px 4px 8px rgba(225,29,72,0.3)" }}>{t.delete}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!sellModal} onClose={() => { setSellModal(null); setSalePrice(""); }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#8b5cf6" }}>
            <ShoppingCart size={24} />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: c.text }}>{t.sellItem}</h3>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: c.textMuted }}>
            {items.find(i => i.id === sellModal)?.catName} — {items.find(i => i.id === sellModal)?.sub}
          </p>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: c.textSec, display: "block", marginBottom: 6 }}>{t.salePrice} *</label>
          <input type="number" min="0" step="0.01" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="25.00" style={{ ...inp, width: "100%", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => { setSellModal(null); setSalePrice(""); }} className="btn-hover" style={{ flex: 1, padding: "12px", background: c.card, color: c.textMuted, border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: c.cardShadowSm }}>{t.cancel}</button>
          <button onClick={confirmSell} className="btn-hover" style={{ flex: 1, padding: "12px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "4px 4px 8px rgba(139,92,246,0.3)" }}>{t.confirmSale}</button>
        </div>
      </Modal>

      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: c.text, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.3px" }}>
        <Warehouse size={20} color={c.accent} /> {t.fullInventory}
      </h2>

      <div className="grid-responsive" style={{ gap: 20, marginBottom: 20 }}>
        <div className="card-hover" style={card}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
            <Home size={18} /> {lang === "es" ? "Mapa de Almacén" : "Storage Map"}
          </h3>
          <FloorPlan2D items={items} c={c} lang={lang} highlightShelf={highlightShelf} />
        </div>

        <div className="card-hover" style={card}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
            <Package size={18} /> {lang === "es" ? "Asignar Ubicación" : "Assign Location"}
            {pendingItems.length > 0 && <span className="pulse" style={{ background: "#f59e0b", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{pendingItems.length}</span>}
          </h3>
          {pendingItems.length === 0 ? (
            <EmptyState icon="box" title={lang === "es" ? "Todos asignados" : "All assigned"} dark={dark} />
          ) : (
            <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingItems.map((i, idx) => {
                const selectedZone = getShelfZone(locInput[i.id]);
                return (
                  <div key={i.id} className="slide-up row-hover" style={{
                    padding: 14, background: c.confirmBg, borderRadius: 10,
                    borderLeft: `4px solid ${i.urgent ? "#e11d48" : "#f59e0b"}`,
                    animationDelay: `${idx * 0.05}s`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{i.catName} — {i.sub}</div>
                        <div style={{ fontSize: 11, color: c.textMuted, marginTop: 2 }}>
                          <span style={{ fontFamily: "monospace", background: c.tagBg, padding: "1px 5px", borderRadius: 4 }}>{i.id}</span>
                          <span style={{ marginLeft: 8 }}>×{i.qty}</span>
                          {i.urgent && <span style={{ marginLeft: 8, color: "#e11d48", fontWeight: 600 }}>⚠ Urgent</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <select
                        value={locInput[i.id] || ""}
                        onChange={e => { setLocInput(p => ({ ...p, [i.id]: e.target.value })); setHighlightShelf(e.target.value); }}
                        style={{
                          ...inp, flex: 1, padding: "8px 12px",
                          background: selectedZone ? selectedZone.bg : c.input,
                          borderColor: selectedZone ? selectedZone.color : c.inputBorder
                        }}
                      >
                        <option value="">{lang === "es" ? "Seleccionar..." : "Select shelf..."}</option>
                        {ZONES.map(z => (
                          <optgroup key={z.id} label={`${z.id} — ${lang === "es" ? z.nameEs : z.name}`}>
                            {z.locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                          </optgroup>
                        ))}
                      </select>
                      <button
                        onClick={() => moveToStorage(i.id)}
                        disabled={!locInput[i.id]}
                        className="btn-hover"
                        style={{
                          padding: "8px 16px",
                          background: locInput[i.id] ? c.accent : "#9CA3AF",
                          color: "#fff", border: "none", borderRadius: c.btnRadius,
                          fontSize: 12, cursor: locInput[i.id] ? "pointer" : "not-allowed",
                          fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
                          boxShadow: locInput[i.id] ? "4px 4px 8px rgb(163,177,198,0.5), -4px -4px 8px rgba(255,255,255,0.4)" : "none"
                        }}
                      >
                        <ArrowRight size={14} /> {lang === "es" ? "Asignar" : "Assign"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card-hover" style={card}>
        <div className="stack-mobile" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.textFaint }} />
            <input placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, width: "100%", paddingLeft: 36, boxSizing: "border-box" }} />
          </div>
          <select value={fCat} onChange={e => setFCat(e.target.value)} style={inp}>
            <option value="">{t.allCategories}</option>
            {CATEGORIES.filter(cc => cc.code !== "GFT").map(cc => <option key={cc.code} value={cc.code}>{cc.name}</option>)}
          </select>
          <select value={fStatus} onChange={e => setFStatus(e.target.value)} style={inp}>
            <option value="">{t.allStatuses}</option>
            <option value="Received">{t.received}</option>
            <option value="In Storage">{t.inStorageStatus}</option>
            <option value="Distributed">{t.distributed}</option>
            <option value="Sold">{t.sold}</option>
          </select>
        </div>

        <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 10 }}>
          {t.showing} {filtered.length} {t.of} {items.length} {t.items}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="inventory-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: c.tableBg, borderBottom: `2px solid ${c.headerBorder}` }}>
                {[t.id, t.category, t.subcategory, t.qty, t.condition, t.donor, t.status, t.location, t.date, t.action].map(h => (
                  <th key={h} style={{ padding: "12px 8px", textAlign: "left", color: c.textSec, fontWeight: 600, whiteSpace: "nowrap", fontSize: 12 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const locZone = getShelfZone(i.location);
                return (
                  <tr key={i.id} className="row-hover" style={{
                    borderBottom: `1px solid ${c.tableRowBorder}`,
                    background: i.urgent && i.status !== "Distributed" && i.status !== "Sold" ? c.urgentBg : "transparent"
                  }}>
                    <td style={{ padding: "12px 8px", fontFamily: "monospace", fontSize: 11, color: c.textMuted }}>{i.id}</td>
                    <td style={{ padding: "12px 8px", color: c.text }}>{i.catName}</td>
                    <td style={{ padding: "12px 8px", color: c.text }}>{i.sub}</td>
                    <td style={{ padding: "12px 8px", fontWeight: 700, color: c.text }}>{i.qty}</td>
                    <td style={{ padding: "12px 8px", color: c.text }}>{i.condition}</td>
                    <td style={{ padding: "12px 8px", color: c.text }}>{i.donor}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <span style={{
                        padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: (STATUS_CLR[i.status] || "#94a3b8") + "18",
                        color: STATUS_CLR[i.status] || "#94a3b8"
                      }}>
                        {i.status}{i.status === "Sold" && i.sale_price ? ` ($${i.sale_price})` : ""}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      {i.location ? (
                        <span style={{
                          padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          background: locZone?.bg || c.pillBg,
                          color: locZone?.color || c.textMuted
                        }}>{i.location}</span>
                      ) : "—"}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: 12, color: c.textMuted }}>{i.date}</td>
                    <td style={{ padding: "12px 8px", whiteSpace: "nowrap" }}>
                      {i.status === "In Storage" && (
                        <button onClick={() => setSellModal(i.id)} className="btn-hover" style={{
                          padding: "6px 12px", background: "#8b5cf6", color: "#fff",
                          border: "none", borderRadius: 8, fontSize: 11, cursor: "pointer",
                          fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, marginRight: 4
                        }}>
                          <ShoppingCart size={14} /> {t.sell}
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => setDelModal(i.id)} className="icon-hover" style={{
                          padding: "6px", background: "none", border: "none",
                          cursor: "pointer", color: "#e11d48", marginLeft: 4
                        }}>
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <EmptyState icon="search" title={t.noData} dark={dark} />}
      </div>
    </div>
  );
}

// ============================================
// END OF PART 2
// Part 3 should contain: DistributeView, GiftCardsView, ReportsView, CalendarView, App
// ============================================
// ============================================
// PART 3 - DistributeView, GiftCardsView, ReportsView, CalendarView, App
// ============================================

// ============================================
// DISTRIBUTE VIEW
// ============================================
function DistributeView({ items, addItem, updateItem, addDistribution, showToast }) {
  const { t, lang, profile, c } = useApp();
  const dark = c.bg === "#000";

  const [cart, setCart] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [recipientMode, setRecipientMode] = useState("existing");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [recipientSearch, setRecipientSearch] = useState("");
  const [newRecipient, setNewRecipient] = useState({ name: "", phone: "", type: "individual", family_size: 1 });
  const [showConfirm, setShowConfirm] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRecipients = async () => {
      const { data } = await supabase.from("recipients").select("*").order("last_visit", { ascending: false });
      setRecipients(data || []);
    };
    fetchRecipients();
    const channel = supabase.channel("recipients-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "recipients" }, () => fetchRecipients())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const available = items.filter(i => i.status === "In Storage");
  const filteredAvailable = filterCat ? available.filter(i => i.cat === filterCat) : available;
  const filteredRecipients = recipients.filter(r => {
    if (!recipientSearch) return true;
    const q = recipientSearch.toLowerCase();
    return r.name?.toLowerCase().includes(q) || r.phone?.includes(q);
  });

  const addToCart = (item) => {
    const existing = cart.find(c => c.itemId === item.id);
    if (existing) {
      if (existing.qty < item.qty) {
        setCart(cart.map(c => c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c));
      }
    } else {
      setCart([...cart, { itemId: item.id, qty: 1, item }]);
    }
  };

  const removeFromCart = (itemId) => setCart(cart.filter(c => c.itemId !== itemId));

  const updateCartQty = (itemId, qty) => {
    const item = cart.find(c => c.itemId === itemId)?.item;
    if (!item) return;
    if (qty <= 0) removeFromCart(itemId);
    else if (qty <= item.qty) setCart(cart.map(c => c.itemId === itemId ? { ...c, qty } : c));
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, c) => sum + c.qty, 0);

  const recentVisitWarning = (recipient) => {
    if (!recipient?.last_visit) return false;
    const lastVisit = new Date(recipient.last_visit);
    const days = Math.floor((new Date() - lastVisit) / (1000 * 60 * 60 * 24));
    return days <= 7;
  };

  const createRecipient = async () => {
    if (!newRecipient.name.trim()) return null;
    const { data, error } = await supabase.from("recipients").insert({
      name: newRecipient.name.trim(),
      phone: newRecipient.phone || null,
      type: newRecipient.type,
      family_size: newRecipient.type === "family" ? newRecipient.family_size : 1,
      first_visit: new Date().toISOString().split("T")[0],
      last_visit: new Date().toISOString().split("T")[0],
      visit_count: 0,
      total_items_received: 0
    }).select().single();
    if (error) { console.error(error); return null; }
    return data;
  };

  const completeDistribution = async () => {
    if (cart.length === 0) return;
    setSaving(true);

    let recipient = selectedRecipient;
    if (recipientMode === "new") {
      recipient = await createRecipient();
      if (!recipient) {
        showToast(lang === "es" ? "Error creando destinatario" : "Error creating recipient");
        setSaving(false);
        return;
      }
    }

    const today = new Date().toISOString().split("T")[0];
    const peopleCount = recipient?.type === "family" ? (recipient.family_size || 1) : 1;
    let totalDistributed = 0;

    for (const cartItem of cart) {
      const item = items.find(i => i.id === cartItem.itemId);
      if (!item) continue;

      if (cartItem.qty >= item.qty) {
        await updateItem(item.id, { status: "Distributed", location: "" });
      } else {
        await updateItem(item.id, { qty: item.qty - cartItem.qty });
        await addItem({
          id: item.id + "-D" + Date.now(),
          cat: item.cat, catName: item.catName, sub: item.sub,
          qty: cartItem.qty, condition: item.condition, donor: item.donor,
          status: "Distributed", date: today, notes: `Partial from ${item.id}`,
          urgent: false, location: "",
          estimated_cost: item.estimated_cost ? (item.estimated_cost / item.qty) * cartItem.qty : null
        });
      }

      await addDistribution({
        id: `DIST-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        item_id: item.id, quantity: cartItem.qty, distribution_type: recipient?.type || "individual",
        people_count: peopleCount, recipient_id: recipient?.id || null,
        distributed_by: profile?.id, date: today, notes: ""
      });

      totalDistributed += cartItem.qty;
    }

    if (recipient) {
      await supabase.from("recipients").update({
        last_visit: today,
        visit_count: (recipient.visit_count || 0) + 1,
        total_items_received: (recipient.total_items_received || 0) + totalDistributed
      }).eq("id", recipient.id);
    }

    showToast(lang === "es" ? `${totalDistributed} artículos distribuidos` : `${totalDistributed} items distributed!`);
    setCart([]);
    setSelectedRecipient(null);
    setNewRecipient({ name: "", phone: "", type: "individual", family_size: 1 });
    setRecipientMode("existing");
    setShowConfirm(false);
    setSaving(false);
  };

  const inp = { padding: "10px 14px", border: "none", borderRadius: c.inputRadius, fontSize: 14, outline: "none", background: c.input, color: c.text, width: "100%", boxSizing: "border-box", boxShadow: c.inputShadow };
  const card = { background: c.card, borderRadius: c.cardRadius, padding: 24, boxShadow: c.cardShadow };

  return (
    <div className="fade-in">
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#10b981" }}>
            <Truck size={24} />
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.text }}>{lang === "es" ? "Confirmar Distribución" : "Confirm Distribution"}</h3>
        </div>

        <div style={{ background: c.confirmBg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 4 }}>{lang === "es" ? "Destinatario" : "Recipient"}</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: c.text }}>{recipientMode === "new" ? newRecipient.name : selectedRecipient?.name || "Walk-in"}</div>
          {(recipientMode === "new" ? newRecipient.type : selectedRecipient?.type) === "family" && (
            <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>{lang === "es" ? "Familia de" : "Family of"} {recipientMode === "new" ? newRecipient.family_size : selectedRecipient?.family_size}</div>
          )}
          {selectedRecipient && recentVisitWarning(selectedRecipient) && (
            <div style={{ marginTop: 8, padding: "6px 10px", background: "#fef3c7", borderRadius: 6, fontSize: 11, color: "#b45309", display: "flex", alignItems: "center", gap: 4 }}>
              <AlertTriangle size={12} /> {lang === "es" ? "Visitó en los últimos 7 días" : "Visited within last 7 days"}
            </div>
          )}
        </div>

        <div style={{ background: c.confirmBg, borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: c.textMuted, marginBottom: 8 }}>{lang === "es" ? "Artículos" : "Items"} ({cartTotal})</div>
          {cart.map(cartItem => (
            <div key={cartItem.itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: c.text }}>
              <span>{cartItem.item.catName} — {cartItem.item.sub}</span>
              <span style={{ fontWeight: 600 }}>×{cartItem.qty}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setShowConfirm(false)} className="btn-hover" style={{ flex: 1, padding: 12, background: c.pillBg, color: c.textSec, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t.cancel}</button>
          <button onClick={completeDistribution} disabled={saving} className="btn-hover" style={{ flex: 1, padding: 12, background: "#10b981", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {saving && <LoadingSpinner size={16} color="#fff" />}
            {saving ? "..." : t.confirm}
          </button>
        </div>
      </Modal>

      <div className="distribute-grid">
        <div className="card-hover" style={card}>
          <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.text, display: "flex", alignItems: "center", gap: 10 }}>
              <Warehouse size={20} color="#4f46e5" /> {t.availableForDist}
              <span style={{ background: "#2563eb", color: "#fff", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>{available.length}</span>
            </h2>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inp, width: "auto", padding: "8px 12px" }}>
              <option value="">{t.allCategories}</option>
              {CATEGORIES.filter(cc => cc.code !== "GFT").map(cc => (<option key={cc.code} value={cc.code}>{lang === "es" ? cc.nameEs : cc.name}</option>))}
            </select>
          </div>

          {filteredAvailable.length === 0 ? (
            <EmptyState icon="box" title={t.noItemsStorage} description={lang === "es" ? "Mueva artículos al almacén primero" : "Move items to storage first"} dark={dark} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, maxHeight: 500, overflowY: "auto" }}>
              {filteredAvailable.map((item, idx) => {
                const inCart = cart.find(c => c.itemId === item.id);
                const zone = ZONES.find(z => z.locations.includes(item.location?.toUpperCase()));
                return (
                  <div key={item.id} className="slide-up hover-scale" style={{
                    padding: 14, background: inCart ? "#ecfdf5" : c.confirmBg, borderRadius: 10,
                    border: inCart ? "2px solid #10b981" : `1px solid ${c.inputBorder}`,
                    cursor: "pointer", animationDelay: `${idx * 0.02}s`
                  }} onClick={() => !inCart && addToCart(item)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{item.catName}</div>
                        <div style={{ fontSize: 12, color: c.textMuted }}>{item.sub}</div>
                      </div>
                      {item.urgent && <AlertTriangle size={16} color="#e11d48" />}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: zone?.bg || c.pillBg, color: zone?.color || c.textMuted }}>{item.location}</span>
                        <span style={{ fontSize: 12, color: c.textMuted }}>×{item.qty}</span>
                      </div>
                      {inCart ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={e => e.stopPropagation()}>
                          <button onClick={() => updateCartQty(item.id, inCart.qty - 1)} className="btn-hover" style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "#d1fae5", color: "#059669", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>−</button>
                          <input type="number" min="1" max={item.qty} value={inCart.qty} onChange={e => updateCartQty(item.id, parseInt(e.target.value) || 0)} onClick={e => e.stopPropagation()} style={{ width: 44, textAlign: "center", padding: "4px 2px", border: "1px solid #10b981", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#059669", background: "#ecfdf5", outline: "none" }} />
                          <button onClick={() => updateCartQty(item.id, inCart.qty + 1)} disabled={inCart.qty >= item.qty} className="btn-hover" style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: inCart.qty >= item.qty ? "#e5e5e5" : "#d1fae5", color: inCart.qty >= item.qty ? "#a3a3a3" : "#059669", cursor: inCart.qty >= item.qty ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700 }}>+</button>
                        </div>
                      ) : (
                        <div style={{ padding: "4px 10px", background: "#2563eb", color: "#fff", borderRadius: 6, fontSize: 11, fontWeight: 600 }}>+ Add</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card-hover" style={card}>
            <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={18} color="#4f46e5" /> {lang === "es" ? "Destinatario" : "Recipient"}
            </h3>

            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {["existing", "new"].map(mode => (
                <button key={mode} onClick={() => { setRecipientMode(mode); setSelectedRecipient(null); }} className="btn-hover" style={{
                  flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: recipientMode === mode ? "2px solid #4f46e5" : `1px solid ${c.inputBorder}`,
                  background: recipientMode === mode ? c.tagBg : c.card,
                  color: recipientMode === mode ? "#4f46e5" : c.textMuted
                }}>
                  {mode === "existing" ? (lang === "es" ? "Existente" : "Existing") : (lang === "es" ? "Nuevo" : "New")}
                </button>
              ))}
            </div>

            {recipientMode === "existing" ? (
              <>
                {selectedRecipient ? (
                  <div className="slide-in" style={{ padding: 14, background: c.confirmBg, borderRadius: 10, border: "2px solid #10b981" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: c.text }}>{selectedRecipient.name}</div>
                        <div style={{ fontSize: 12, color: c.textMuted, marginTop: 2 }}>
                          {selectedRecipient.type === "family" ? `${lang === "es" ? "Familia" : "Family"} (${selectedRecipient.family_size})` : (lang === "es" ? "Individual" : "Individual")}
                          {selectedRecipient.phone && ` · ${selectedRecipient.phone}`}
                        </div>
                        <div style={{ fontSize: 11, color: c.textFaint, marginTop: 4 }}>{selectedRecipient.visit_count || 0} {lang === "es" ? "visitas" : "visits"} · {selectedRecipient.total_items_received || 0} {lang === "es" ? "artículos" : "items"}</div>
                      </div>
                      <button onClick={() => setSelectedRecipient(null)} className="icon-hover" style={{ background: "none", border: "none", color: c.textMuted, cursor: "pointer", padding: 4 }}>✕</button>
                    </div>
                    {recentVisitWarning(selectedRecipient) && (
                      <div style={{ marginTop: 10, padding: "6px 10px", background: "#fef3c7", borderRadius: 6, fontSize: 11, color: "#b45309", display: "flex", alignItems: "center", gap: 4 }}>
                        <AlertTriangle size={12} /> {lang === "es" ? "Visitó recientemente" : "Recent visit"}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div style={{ position: "relative", marginBottom: 10 }}>
                      <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: c.textFaint }} />
                      <input placeholder={lang === "es" ? "Buscar por nombre o teléfono..." : "Search by name or phone..."} value={recipientSearch} onChange={e => setRecipientSearch(e.target.value)} style={{ ...inp, paddingLeft: 38 }} />
                    </div>
                    <div style={{ maxHeight: 180, overflowY: "auto" }}>
                      {filteredRecipients.length === 0 ? (
                        <EmptyState icon="users" title={lang === "es" ? "Sin destinatarios" : "No recipients"} dark={dark} />
                      ) : (
                        filteredRecipients.slice(0, 10).map((r, idx) => (
                          <div key={r.id} onClick={() => setSelectedRecipient(r)} className="row-hover slide-up" style={{
                            padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 6,
                            background: c.confirmBg, border: `1px solid ${c.inputBorder}`,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            animationDelay: `${idx * 0.03}s`
                          }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{r.name}</div>
                              <div style={{ fontSize: 11, color: c.textMuted }}>{r.type === "family" ? `Family (${r.family_size})` : "Individual"}{r.phone && ` · ${r.phone}`}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 10, color: c.textFaint }}>{r.visit_count || 0} visits</div>
                              {recentVisitWarning(r) && <AlertTriangle size={12} color="#f59e0b" style={{ marginTop: 2 }} />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input placeholder={lang === "es" ? "Nombre *" : "Name *"} value={newRecipient.name} onChange={e => setNewRecipient({ ...newRecipient, name: e.target.value })} style={inp} />
                <input placeholder={lang === "es" ? "Teléfono" : "Phone"} value={newRecipient.phone} onChange={e => setNewRecipient({ ...newRecipient, phone: e.target.value })} style={inp} />
                <div style={{ display: "flex", gap: 8 }}>
                  {["individual", "family"].map(type => (
                    <button key={type} onClick={() => setNewRecipient({ ...newRecipient, type })} className="btn-hover" style={{
                      flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      border: newRecipient.type === type ? "2px solid #4f46e5" : `1px solid ${c.inputBorder}`,
                      background: newRecipient.type === type ? c.tagBg : c.card,
                      color: newRecipient.type === type ? "#4f46e5" : c.textMuted,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4
                    }}>
                      {type === "individual" ? <User size={14} /> : <Users size={14} />}
                      {type === "individual" ? t.individual : t.family}
                    </button>
                  ))}
                </div>
                {newRecipient.type === "family" && (
                  <input type="number" min="1" placeholder={t.familySize} value={newRecipient.family_size} onChange={e => setNewRecipient({ ...newRecipient, family_size: parseInt(e.target.value) || 1 })} style={inp} />
                )}
              </div>
            )}
          </div>

          <div className="card-hover" style={{ ...card, flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
                <ShoppingCart size={18} color="#4f46e5" /> Cart
                {cartTotal > 0 && <span className="pulse" style={{ background: "#10b981", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{cartTotal}</span>}
              </h3>
              {cart.length > 0 && (<button onClick={clearCart} className="transition-colors" style={{ background: "none", border: "none", color: "#e11d48", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>{lang === "es" ? "Vaciar" : "Clear"}</button>)}
            </div>

            {cart.length === 0 ? (
              <EmptyState icon="cart" title={lang === "es" ? "Carrito vacío" : "Empty cart"} description={lang === "es" ? "Agregar artículos del inventario" : "Add items from inventory"} dark={dark} />
            ) : (
              <>
                <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 14 }}>
                  {cart.map((cartItem, idx) => (
                    <div key={cartItem.itemId} className="slide-in row-hover" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${c.inputBorder}`, animationDelay: `${idx * 0.03}s` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: c.text }}>{cartItem.item.catName}</div>
                        <div style={{ fontSize: 11, color: c.textMuted }}>{cartItem.item.sub}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button onClick={() => updateCartQty(cartItem.itemId, cartItem.qty - 1)} style={{ width: 22, height: 22, borderRadius: 5, border: "none", background: c.pillBg, color: c.textSec, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>−</button>
                        <input type="number" min="1" max={cartItem.item.qty} value={cartItem.qty} onChange={e => updateCartQty(cartItem.itemId, parseInt(e.target.value) || 0)} style={{ width: 40, textAlign: "center", padding: "3px 2px", border: `1px solid ${c.inputBorder}`, borderRadius: 5, fontSize: 13, fontWeight: 600, color: c.text, background: c.input, outline: "none" }} />
                        <button onClick={() => updateCartQty(cartItem.itemId, cartItem.qty + 1)} disabled={cartItem.qty >= cartItem.item.qty} style={{ width: 22, height: 22, borderRadius: 5, border: "none", background: cartItem.qty >= cartItem.item.qty ? c.pillBg : "#dbeafe", color: cartItem.qty >= cartItem.item.qty ? c.textFaint : "#2563eb", cursor: cartItem.qty >= cartItem.item.qty ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700 }}>+</button>
                        <button onClick={() => removeFromCart(cartItem.itemId)} className="icon-hover" style={{ background: "none", border: "none", color: "#e11d48", cursor: "pointer", padding: 2 }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setShowConfirm(true)} disabled={cart.length === 0 || (recipientMode === "new" && !newRecipient.name.trim())} className="btn-hover" style={{
                  width: "100%", padding: 14, background: (cart.length === 0 || (recipientMode === "new" && !newRecipient.name.trim())) ? "#9CA3AF" : "#10b981",
                  color: "#fff", border: "none", borderRadius: c.btnRadius, fontSize: 15, fontWeight: 700,
                  cursor: (cart.length === 0 || (recipientMode === "new" && !newRecipient.name.trim())) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: (cart.length === 0 || (recipientMode === "new" && !newRecipient.name.trim())) ? "none" : "5px 5px 10px rgb(163,177,198,0.5), -5px -5px 10px rgba(255,255,255,0.4)"
                }}>
                  <Truck size={18} /> {lang === "es" ? "Distribuir" : "Distribute"} ({cartTotal})
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// GIFT CARDS VIEW
// ============================================
function GiftCardsView({ giftCards }) {
  const { t, c, lang } = useApp();
  const dark = c.bg === "#000";

  const total = giftCards.reduce((s, g) => s + g.amount, 0);
  const byCompany = useMemo(() => {
    const d = {};
    giftCards.forEach(g => { d[g.company] = (d[g.company] || 0) + g.amount; });
    return Object.entries(d).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [giftCards]);

  const card = { background: c.card, borderRadius: c.cardRadius, padding: 24, boxShadow: c.cardShadow };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card-hover hover-glow" style={{ ...card }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#f59e0b15", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CreditCard size={28} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: c.text, letterSpacing: "-1px" }}>${total.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: c.textMuted, fontWeight: 500 }}>{t.totalGiftCards} · {giftCards.length} {t.transactions}</div>
          </div>
        </div>
      </div>

      <div className="grid-responsive" style={{ gap: 20 }}>
        <div className="card-hover" style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: c.text }}>{t.byCompany}</h3>
          {byCompany.length === 0 ? (
            <EmptyState icon="chart" title={t.noData} dark={dark} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={byCompany} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                  {byCompany.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `$${v}`} contentStyle={{ background: c.card, border: `1px solid ${c.inputBorder}`, borderRadius: 6, color: c.text, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card-hover" style={card}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: c.text }}>{t.transactions}</h3>
          {giftCards.length === 0 ? (
            <EmptyState icon="box" title={t.noData} dark={dark} />
          ) : (
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {giftCards.slice().reverse().map((g, idx) => (
                <div key={g.id} className="slide-up row-hover" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${c.tableRowBorder}`, animationDelay: `${idx * 0.03}s` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{g.company}</div>
                    <div style={{ fontSize: 11, color: c.textMuted }}>{g.donor_name || "Anonymous"} · {g.date}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b" }}>${g.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// REPORTS VIEW
// ============================================
function ReportsView({ items, giftCards, distributions }) {
  const { t, c, lang } = useApp();
  const dark = c.bg === "#000";

  const totalRec = items.reduce((s, i) => s + i.qty, 0);
  const totalDist = items.filter(i => i.status === "Distributed").reduce((s, i) => s + i.qty, 0);
  const inStock = items.filter(i => i.status === "In Storage").reduce((s, i) => s + i.qty, 0);
  const totalGC = giftCards.reduce((s, g) => s + g.amount, 0);
  const uniqueDonors = new Set(items.map(i => i.donor).filter(d => d && d !== "Anonymous")).size;
  const distRate = totalRec > 0 ? ((totalDist / totalRec) * 100).toFixed(1) : 0;
  const totalPpl = distributions.reduce((s, d) => s + (d.people_count || 0), 0);
  const families = distributions.filter(d => d.distribution_type === "family").length;
  const individuals = distributions.filter(d => d.distribution_type === "individual").length;
  const unusable = items.filter(i => i.condition === "Unusable").reduce((s, i) => s + i.qty, 0);
  const totalSales = items.filter(i => i.status === "Sold").reduce((s, i) => s + (i.sale_price || 0), 0);
  const itemsSold = items.filter(i => i.status === "Sold").reduce((s, i) => s + i.qty, 0);
  const estValue = items.reduce((s, i) => s + (i.estimated_cost || 0), 0);

  const catBreakdown = CATEGORIES.filter(cc => cc.code !== "GFT").map(cc => {
    const rec = items.filter(i => i.cat === cc.code).reduce((s, i) => s + i.qty, 0);
    const dist = items.filter(i => i.cat === cc.code && i.status === "Distributed").reduce((s, i) => s + i.qty, 0);
    return { name: cc.name, received: rec, distributed: dist };
  }).filter(d => d.received > 0);

  const downloadExcel = () => {
    const summaryData = [
      { Metric: t.itemsReceived, Value: totalRec },
      { Metric: t.itemsDistributed, Value: totalDist },
      { Metric: t.currentlyInStock, Value: inStock },
      { Metric: t.giftCardsReceived, Value: `$${totalGC}` },
      { Metric: t.uniqueDonors, Value: uniqueDonors },
      { Metric: t.distributionRate, Value: `${distRate}%` },
      { Metric: t.totalPeopleServed, Value: totalPpl },
      { Metric: t.familiesServed, Value: families },
      { Metric: t.individualsServed, Value: individuals },
      { Metric: t.salesRevenue, Value: `$${totalSales}` },
      { Metric: t.itemsSold, Value: itemsSold },
      { Metric: t.totalEstValue, Value: `$${estValue.toFixed(2)}` }
    ];
    const itemsData = items.map(i => ({ ID: i.id, Category: i.catName, Subcategory: i.sub, Quantity: i.qty, Condition: i.condition, Donor: i.donor, DonorEmail: i.donor_email || "", DonorPhone: i.donor_phone || "", EstimatedCost: i.estimated_cost || "", Status: i.status, Location: i.location, Date: i.date, SalePrice: i.sale_price || "" }));
    const giftCardsData = giftCards.map(g => ({ ID: g.id, Company: g.company, Amount: g.amount, Donor: g.donor_name, Date: g.date }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summaryData), "Summary");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(itemsData), "Items");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(giftCardsData), "Gift Cards");
    XLSX.writeFile(wb, `NGO_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const card = { background: c.card, borderRadius: c.cardRadius, padding: 24, boxShadow: c.cardShadow };
  const stat = { padding: "20px 16px", background: c.card, borderRadius: dark ? 12 : 20, textAlign: "center", boxShadow: c.cardShadowSm };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card-hover" style={card}>
        <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: c.text }}>{t.yearEndReport}</h2>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: c.textMuted }}>{t.generated}: {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={downloadExcel} className="btn-hover" style={{ padding: "11px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: c.btnRadius, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "4px 4px 8px rgba(16,185,129,0.3)" }}>
            <Download size={16} /> {t.downloadExcel}
          </button>
        </div>

        <div className="card-hover" style={{ background: c.card, borderRadius: dark ? 12 : 24, padding: 20, marginBottom: 20, boxShadow: c.insetSm }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: c.accent, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.executiveSummary}</h3>
          <div className="grid-responsive stack-mobile" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {[
              { label: t.itemsReceived, value: totalRec, color: "#2563eb" },
              { label: t.itemsDistributed, value: totalDist, color: "#10b981" },
              { label: t.currentlyInStock, value: inStock, color: "#0ea5e9" },
              { label: t.giftCardsReceived, value: `$${totalGC.toLocaleString()}`, color: "#f59e0b" },
              { label: t.uniqueDonors, value: uniqueDonors, color: "#8b5cf6" },
              { label: t.distributionRate, value: `${distRate}%`, color: "#ec4899" },
              { label: t.salesRevenue, value: `$${totalSales.toLocaleString()}`, color: "#14b8a6" },
              { label: t.totalEstValue, value: `$${estValue.toFixed(0)}`, color: "#6366f1" }
            ].map((s, idx) => (
              <div key={s.label} className="slide-up" style={{ ...stat, animationDelay: `${idx * 0.05}s` }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: c.textMuted, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-responsive" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div className="slide-up" style={{ ...stat, animationDelay: "0.1s" }}>
            <Users size={24} color="#8b5cf6" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 800, color: c.text }}>{totalPpl}</div>
            <div style={{ fontSize: 12, color: c.textMuted }}>{t.totalPeopleServed}</div>
          </div>
          <div className="slide-up" style={{ ...stat, animationDelay: "0.15s" }}>
            <Home size={24} color="#10b981" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 800, color: c.text }}>{families}</div>
            <div style={{ fontSize: 12, color: c.textMuted }}>{t.familiesServed}</div>
          </div>
          <div className="slide-up" style={{ ...stat, animationDelay: "0.2s" }}>
            <User size={24} color="#0ea5e9" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 800, color: c.text }}>{individuals}</div>
            <div style={{ fontSize: 12, color: c.textMuted }}>{t.individualsServed}</div>
          </div>
        </div>

        <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: c.text }}>{t.catBreakdown}</h3>
        {catBreakdown.length === 0 ? (
          <EmptyState icon="chart" title={t.noData} dark={dark} />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={c.tableRowBorder} />
              <XAxis type="number" fontSize={10} tick={{ fill: c.textMuted }} />
              <YAxis dataKey="name" type="category" width={80} fontSize={10} tick={{ fill: c.textMuted }} />
              <Tooltip contentStyle={{ background: c.card, border: `1px solid ${c.inputBorder}`, borderRadius: 6, color: c.text, fontSize: 12 }} />
              <Legend />
              <Bar dataKey="received" fill="#2563eb" name={t.received} radius={[0, 4, 4, 0]} />
              <Bar dataKey="distributed" fill="#10b981" name={t.distributed} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {unusable > 0 && (
          <div className="slide-in" style={{ marginTop: 16, padding: 12, background: c.urgentBg, borderRadius: 10, borderLeft: "4px solid #e11d48", fontSize: 13, color: "#e11d48", fontWeight: 500 }}>
            <AlertTriangle size={14} style={{ marginRight: 6, verticalAlign: "middle" }} /> {unusable} {t.unusableWarning}
          </div>
        )}

        <p style={{ margin: "20px 0 0", fontSize: 11, color: c.textFaint, fontStyle: "italic" }}>{t.reportNote}</p>
      </div>
    </div>
  );
}

// ============================================
// CALENDAR VIEW
// ============================================
function CalendarView({ items, distributions, giftCards }) {
  const { t, c, lang } = useApp();
  const dark = c.bg === "#000";

  const today = new Date().toISOString().split("T")[0];
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); };

  const getDateStr = (day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const getDayData = (day) => {
    const dateStr = getDateStr(day);
    const dayItems = items.filter(i => i.date === dateStr);
    const dayDist = distributions.filter(d => d.date === dateStr);
    const dayGC = giftCards.filter(g => g.date === dateStr);
    return {
      received: dayItems.reduce((s, i) => s + i.qty, 0),
      distributed: dayDist.reduce((s, d) => s + d.quantity, 0),
      giftCards: dayGC.reduce((s, g) => s + g.amount, 0),
      items: dayItems,
      distributions: dayDist,
      giftCardsList: dayGC
    };
  };

  const dayNames = lang === "es" ? ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = lang === "es" ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const card = { background: c.card, borderRadius: c.cardRadius, padding: 20, boxShadow: c.cardShadow };
  const selectedData = selectedDate ? getDayData(selectedDate) : null;

  return (
    <div className="fade-in calendar-grid">
      <div className="card-hover" style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={prevMonth} className="btn-hover" style={{ padding: "8px 14px", background: c.card, border: "none", borderRadius: c.btnRadius, cursor: "pointer", color: c.text, fontSize: 14, boxShadow: c.cardShadowSm }}>←</button>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{monthNames[month]} {year}</h2>
          <button onClick={nextMonth} className="btn-hover" style={{ padding: "8px 14px", background: c.card, border: "none", borderRadius: c.btnRadius, cursor: "pointer", color: c.text, fontSize: 14, boxShadow: c.cardShadowSm }}>→</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {dayNames.map(d => <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: c.textMuted, padding: 8 }}>{d}</div>)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const ds = getDateStr(day);
            const data = getDayData(day);
            const isToday = ds === today;
            const isSelected = selectedDate === day;
            const hasActivity = data.received > 0 || data.distributed > 0 || data.giftCards > 0;

            return (
              <div
                key={day}
                onClick={() => setSelectedDate(day)}
                className="hover-scale"
                style={{
                  padding: 8, borderRadius: dark ? 10 : 16, cursor: "pointer",
                  background: c.card,
                  boxShadow: isSelected
                    ? `inset 6px 6px 10px rgb(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5), 0 0 0 2px ${c.accent}`
                    : isToday
                    ? c.cardShadowSm
                    : hasActivity
                    ? c.cardShadowSm
                    : "none",
                  minHeight: 70, display: "flex", flexDirection: "column",
                  outline: isToday && !isSelected ? `2px solid ${c.accent}` : "none",
                  outlineOffset: "-2px"
                }}
              >
                <div style={{ fontSize: 13, fontWeight: isToday || isSelected ? 700 : 500, color: isSelected ? c.accent : c.text, marginBottom: 4 }}>{day}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {data.received > 0 && <div style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: isSelected ? "rgba(255,255,255,0.2)" : "#2563eb20", color: isSelected ? "#fff" : "#2563eb", fontWeight: 600 }}>+{data.received}</div>}
                  {data.distributed > 0 && <div style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: isSelected ? "rgba(255,255,255,0.2)" : "#10b98120", color: isSelected ? "#fff" : "#10b981", fontWeight: 600 }}>↑{data.distributed}</div>}
                  {data.giftCards > 0 && <div style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: isSelected ? "rgba(255,255,255,0.2)" : "#f59e0b20", color: isSelected ? "#fff" : "#f59e0b", fontWeight: 600 }}>${data.giftCards}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-hover slide-in" style={card}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: c.text, display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarDays size={18} /> {selectedDate ? `${monthNames[month]} ${selectedDate}, ${year}` : (lang === "es" ? "Seleccionar día" : "Select a day")}
        </h3>

        {!selectedDate ? (
          <EmptyState icon="calendar" title={lang === "es" ? "Sin selección" : "No selection"} description={lang === "es" ? "Haga clic en un día" : "Click on a day to see details"} dark={dark} />
        ) : selectedData && (selectedData.received === 0 && selectedData.distributed === 0 && selectedData.giftCards === 0) ? (
          <EmptyState icon="box" title={lang === "es" ? "Sin actividad" : "No activity"} dark={dark} />
        ) : selectedData && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div className="hover-lift" style={{ flex: 1, minWidth: 80, padding: 12, background: c.confirmBg, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#2563eb" }}>{selectedData.received}</div>
                <div style={{ fontSize: 10, color: c.textMuted }}>{t.received}</div>
              </div>
              <div className="hover-lift" style={{ flex: 1, minWidth: 80, padding: 12, background: c.confirmBg, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>{selectedData.distributed}</div>
                <div style={{ fontSize: 10, color: c.textMuted }}>{t.distributed}</div>
              </div>
              <div className="hover-lift" style={{ flex: 1, minWidth: 80, padding: 12, background: c.confirmBg, borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b" }}>${selectedData.giftCards}</div>
                <div style={{ fontSize: 10, color: c.textMuted }}>{t.giftCards}</div>
              </div>
            </div>

            {selectedData.items.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: c.textSec }}>{t.received}</h4>
                {selectedData.items.map((i, idx) => (
                  <div key={i.id} className="slide-up row-hover" style={{ padding: 8, background: c.confirmBg, borderRadius: 8, marginBottom: 6, fontSize: 12, animationDelay: `${idx * 0.03}s` }}>
                    <div style={{ fontWeight: 600, color: c.text }}>{i.catName} — {i.sub}</div>
                    <div style={{ color: c.textMuted }}>×{i.qty} · {i.donor}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedData.distributions.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: c.textSec }}>{t.distributed}</h4>
                {selectedData.distributions.map((d, idx) => (
                  <div key={d.id} className="slide-up row-hover" style={{ padding: 8, background: c.confirmBg, borderRadius: 8, marginBottom: 6, fontSize: 12, animationDelay: `${idx * 0.03}s` }}>
                    <div style={{ fontWeight: 600, color: c.text }}>×{d.quantity} {lang === "es" ? "artículos" : "items"}</div>
                    <div style={{ color: c.textMuted }}>{d.distribution_type} · {d.people_count} {lang === "es" ? "personas" : "people"}</div>
                  </div>
                ))}
              </div>
            )}

            {selectedData.giftCardsList.length > 0 && (
              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 600, color: c.textSec }}>{t.giftCards}</h4>
                {selectedData.giftCardsList.map((g, idx) => (
                  <div key={g.id} className="slide-up row-hover" style={{ padding: 8, background: c.confirmBg, borderRadius: 8, marginBottom: 6, fontSize: 12, animationDelay: `${idx * 0.03}s` }}>
                    <div style={{ fontWeight: 600, color: c.text }}>{g.company}</div>
                    <div style={{ color: c.textMuted }}>${g.amount} · {g.donor_name}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================
// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [items, setItems] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const c = dark ? DARK : LIGHT;
  const t = T[lang];

  // Keep html/body background in sync with theme so no white edges ever show
  useEffect(() => {
    document.documentElement.style.background = c.bg;
    document.body.style.background = c.bg;
  }, [c.bg]);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (!session) setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
      if (!session) setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(data);
      if (data && !localStorage.getItem("tutorial_done")) {
        setShowTutorial(true);
        localStorage.setItem("tutorial_done", "1");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  // ============================================
  // FETCH DATA WITH PROPER COLUMN MAPPING
  // ============================================
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [{ data: itemsData }, { data: gcData }, { data: distData }] = await Promise.all([
        supabase.from("items").select("*").eq("deleted", false).order("date", { ascending: false }),
        supabase.from("gift_cards").select("*").order("date", { ascending: false }),
        supabase.from("distributions").select("*").order("date", { ascending: false })
      ]);
      
      // Map Supabase columns to internal property names
      const mappedItems = (itemsData || []).map(item => ({
        ...item,
        cat: item.category || "",
        catName: item.category_name || "",
        sub: item.subcategory || "",
        qty: parseInt(item.quantity) || 0
      }));
      
      setItems(mappedItems);
      setGiftCards(gcData || []);
      setDistributions(distData || []);
    };
    fetchData();
    
    const channel = supabase.channel("db-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "items" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "gift_cards" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "distributions" }, () => fetchData())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  // ============================================
  // CRUD FUNCTIONS WITH PROPER COLUMN NAMES
  // ============================================
  const addItem = async (item) => {
    const dbItem = {
      id: item.id,
      category: item.cat,
      category_name: item.catName,
      subcategory: item.sub,
      quantity: item.qty,
      condition: item.condition,
      donor: item.donor,
      donor_id: item.donor_id || null,
      donor_email: item.donor_email || null,
      donor_phone: item.donor_phone || null,
      estimated_cost: item.estimated_cost || null,
      status: item.status,
      date: item.date,
      notes: item.notes || "",
      urgent: item.urgent || false,
      location: item.location || "",
      created_by: item.created_by || null,
      deleted: false
    };
    const { error } = await supabase.from("items").insert(dbItem);
    return !error;
  };

  const updateItem = async (id, updates) => {
    const dbUpdates = {};
    if (updates.qty !== undefined) dbUpdates.quantity = updates.qty;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.sale_price !== undefined) dbUpdates.sale_price = updates.sale_price;
    if (updates.sold_date !== undefined) dbUpdates.sold_date = updates.sold_date;
    
    const { error } = await supabase.from("items").update(dbUpdates).eq("id", id);
    return !error;
  };

  const deleteItem = async (id) => {
    // Soft delete
    const { error } = await supabase.from("items").update({ deleted: true }).eq("id", id);
    return !error;
  };

  const addGiftCard = async (gc) => {
    const { error } = await supabase.from("gift_cards").insert(gc);
    return !error;
  };

  const addDistribution = async (dist) => {
    const { error } = await supabase.from("distributions").insert(dist);
    return !error;
  };

  const addDonor = async (donor) => {
    const { data, error } = await supabase.from("donors").insert(donor).select().single();
    return error ? null : data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setPage("dashboard");
  };

  const pages = [
    { id: "dashboard", icon: <BarChart3 size={18} />, label: t.dashboard, roles: ["admin", "reception", "distribution", "inventory"] },
    { id: "receive", icon: <Package size={18} />, label: t.receive, roles: ["admin", "reception"] },
    { id: "inventory", icon: <Warehouse size={18} />, label: t.inventory, roles: ["admin", "inventory"] },
    { id: "distribute", icon: <Truck size={18} />, label: t.distribute, roles: ["admin", "distribution"] },
    { id: "giftcards", icon: <CreditCard size={18} />, label: t.giftCards, roles: ["admin", "reception"] },
    { id: "reports", icon: <FileText size={18} />, label: t.reports, roles: ["admin"] },
    { id: "calendar", icon: <CalendarDays size={18} />, label: lang === "es" ? "Calendario" : "Calendar", roles: ["admin", "reception", "distribution", "inventory"] }
  ];
  const visiblePages = pages.filter(p => p.roles.includes(profile?.role || "admin"));

  if (loading) return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: c.bg }}><LoadingSpinner size={40} /></div>);
  if (!user) return <LoginPage dark={dark} toggleDark={() => setDark(!dark)} />;

  const roleLabels = { admin: t.admin, reception: t.reception, distribution: t.distribution, inventory: t.inventoryRole };

  return (
    <AppContext.Provider value={{ t, lang, profile, c }}>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: c.bg }}>
        {showTutorial && <Tutorial onComplete={() => setShowTutorial(false)} lang={lang} />}
        {toast && <Toast message={toast.message} type={toast.type} />}

        {sidebarOpen && <div className="fade-in" style={{ position: "fixed", inset: 0, background: c.overlayBg, zIndex: 998 }} onClick={() => setSidebarOpen(false)} />}
        {/* Sidebar — same #E0E5EC material in light mode, extruded panel */}
        <div style={{ position: "fixed", top: 0, left: sidebarOpen ? 0 : -290, width: 268, height: "100vh", background: c.sidebarBg, zIndex: 999, transition: "left .3s ease-out", padding: "28px 18px", boxSizing: "border-box", display: "flex", flexDirection: "column", boxShadow: dark ? "4px 0 24px rgba(0,0,0,0.6)" : "12px 0 32px rgb(163,177,198,0.5)" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 36, paddingLeft: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: c.sidebarBg, boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.4)" : c.cardShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: c.sidebarBg, boxShadow: dark ? "inset 0 2px 4px rgba(0,0,0,0.3)" : c.inputShadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={16} color={c.accent} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: dark ? "#fff" : c.text, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.3px" }}>{t.appName.split(" ")[0]}</div>
              <div style={{ fontSize: 10, color: c.textMuted, fontWeight: 500 }}>{t.appDesc.split(" ").slice(0, 2).join(" ")}</div>
            </div>
          </div>

          {/* Nav items */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {visiblePages.map(p => (
              <button key={p.id} onClick={() => { setPage(p.id); setSidebarOpen(false); }} className="btn-hover" style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
                background: c.sidebarBg,
                boxShadow: page === p.id ? (dark ? "inset 0 2px 4px rgba(0,0,0,0.3)" : c.insetSm) : "none",
                color: page === p.id ? c.accent : (dark ? "#a3a3a3" : c.textMuted),
                border: "none", borderRadius: dark ? 10 : 16, cursor: "pointer",
                fontSize: 13, fontWeight: page === p.id ? 700 : 500, textAlign: "left", width: "100%"
              }}>
                {p.icon}{p.label}
              </button>
            ))}
          </div>

          {/* User + logout */}
          <div style={{ borderTop: dark ? "1px solid #262626" : "none", paddingTop: dark ? 16 : 0, marginTop: 8 }}>
            {!dark && <div style={{ height: 1, background: "rgba(163,177,198,0.3)", marginBottom: 16 }} />}
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: c.sidebarBg, boxShadow: dark ? "inset 0 2px 4px rgba(0,0,0,0.3)" : c.insetSm, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} color={c.textMuted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: dark ? "#fff" : c.text }}>{profile?.full_name || user?.email?.split("@")[0]}</div>
                <div style={{ fontSize: 10, color: c.textMuted }}>{roleLabels[profile?.role] || profile?.role}</div>
              </div>
            </div>
            <button onClick={logout} className="btn-hover" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "transparent", color: "#ef4444", border: "none", borderRadius: dark ? 8 : 14, cursor: "pointer", fontSize: 12, fontWeight: 600, width: "100%", marginTop: 4 }}>
              <LogOut size={16} /> {t.logout}
            </button>
          </div>
        </div>

        {/* Header — neumorphic extruded bar */}
        <header style={{ position: "sticky", top: 0, background: c.headerBg, backdropFilter: "blur(16px)", borderBottom: dark ? `1px solid ${c.headerBorder}` : "none", boxShadow: dark ? "none" : "0 4px 12px rgb(163,177,198,0.35)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
          <button id="sidebar-btn" onClick={() => setSidebarOpen(true)} className="icon-hover btn-hover" style={{ padding: 10, background: c.card, border: "none", borderRadius: dark ? 8 : 14, cursor: "pointer", color: c.text, boxShadow: c.cardShadowSm }}><Menu size={18} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button id="lang-btn" onClick={() => setLang(lang === "en" ? "es" : "en")} className="btn-hover" style={{ padding: "7px 12px", background: c.card, border: "none", borderRadius: dark ? 8 : 14, cursor: "pointer", color: c.textMuted, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, boxShadow: c.cardShadowSm }}><Globe size={14} /><span className="lang-text">{lang.toUpperCase()}</span></button>
            <button id="theme-btn" onClick={() => setDark(!dark)} className="icon-hover btn-hover" style={{ padding: 10, background: c.card, border: "none", borderRadius: dark ? 8 : 14, cursor: "pointer", color: c.textMuted, boxShadow: c.cardShadowSm }}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
            <button id="help-btn" onClick={() => setShowTutorial(true)} className="icon-hover btn-hover" style={{ padding: 10, background: c.card, border: "none", borderRadius: dark ? 8 : 14, cursor: "pointer", color: c.textMuted, boxShadow: c.cardShadowSm }}><HelpCircle size={16} /></button>
          </div>
        </header>

        <main id="page-content" style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
          {page === "dashboard" && <Dashboard items={items} giftCards={giftCards} distributions={distributions} />}
          {page === "receive" && <ReceiveForm items={items} giftCards={giftCards} addItem={addItem} addGiftCard={addGiftCard} addDonor={addDonor} showToast={showToast} />}
          {page === "inventory" && <InventoryView items={items} updateItem={updateItem} deleteItem={deleteItem} showToast={showToast} />}
          {page === "distribute" && <DistributeView items={items} addItem={addItem} updateItem={updateItem} addDistribution={addDistribution} showToast={showToast} />}
          {page === "giftcards" && <GiftCardsView giftCards={giftCards} />}
          {page === "reports" && <ReportsView items={items} giftCards={giftCards} distributions={distributions} />}
          {page === "calendar" && <CalendarView items={items} distributions={distributions} giftCards={giftCards} />}
        </main>

        <footer style={{ textAlign: "center", padding: "24px", fontSize: 11, color: c.textFaint, letterSpacing: "0.04em", fontWeight: 500 }}>NGO Inventory Manager v2.4 · © 2026</footer>
      </div>
    </AppContext.Provider>
  );
}

export default App;