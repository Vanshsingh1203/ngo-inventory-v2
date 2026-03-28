import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from "recharts";
import { LogOut, Package, Warehouse, Truck, DollarSign, BarChart3, FileText, Menu, HelpCircle, Globe, Trash2, AlertTriangle, CheckCircle, Users, User, Home, Plus, Search, ArrowRight, Download, Eye, EyeOff, Shield, ClipboardList, Moon, Sun, CreditCard, Building2, Mail, Phone, Tag, ShoppingCart } from "lucide-react";
import { supabase } from "./supabaseClient";
import * as XLSX from "xlsx";

const LIGHT = { bg:"#f8fafc",card:"#fff",cardBorder:"rgba(0,0,0,.05)",text:"#0f172a",textSec:"#475569",textMuted:"#64748b",textFaint:"#94a3b8",input:"#fff",inputBorder:"#d1d5db",headerBg:"#fff",headerBorder:"#e2e8f0",tableBg:"#f8fafc",tableRowBorder:"#f1f5f9",tagBg:"#eef2ff",modalBg:"#fff",overlayBg:"rgba(0,0,0,.5)",confirmBg:"#f8fafc",urgentBg:"#fef2f2",sidebarBg:"#0f172a",pillBg:"#f1f5f9",pillActive:"#fff" };
const DARK = { bg:"#0f172a",card:"#1e293b",cardBorder:"rgba(255,255,255,.06)",text:"#f1f5f9",textSec:"#cbd5e1",textMuted:"#94a3b8",textFaint:"#64748b",input:"#334155",inputBorder:"#475569",headerBg:"#1e293b",headerBorder:"#334155",tableBg:"#334155",tableRowBorder:"#334155",tagBg:"#334155",modalBg:"#1e293b",overlayBg:"rgba(0,0,0,.7)",confirmBg:"#0f172a",urgentBg:"#451a1a",sidebarBg:"#020617",pillBg:"#334155",pillActive:"#475569" };

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
    // New translations
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
    // New translations
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
const COLORS=["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#3b82f6","#ec4899"];
const STATUS_CLR={Received:"#f59e0b","In Storage":"#6366f1",Distributed:"#10b981",Sold:"#8b5cf6"};
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const genId=(cat,list)=>{const d=new Date();const ds=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;const n=(list||[]).filter(i=>i.id?.startsWith(`${cat}-${ds}`)).length;return`${cat}-${ds}-${String(n+1).padStart(4,"0")}`;};

const AppContext=createContext();
const useApp=()=>useContext(AppContext);

function Modal({open,onClose,children}){const{c}=useApp();if(!open)return null;return(<div style={{position:"fixed",inset:0,background:c.overlayBg,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}><div style={{background:c.modalBg,borderRadius:16,maxWidth:480,width:"100%",padding:28,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>{children}</div></div>);}

function Tutorial({onComplete,lang}){
  const steps=TUTORIAL_STEPS[lang]||TUTORIAL_STEPS.en;const sk=lang==="es"?"Omitir":"Skip";const nx=lang==="es"?"Siguiente":"Next";const bk=lang==="es"?"Atrás":"Back";const dn=lang==="es"?"¡Entendido!":"Got It!";
  const[step,setStep]=useState(0);const[pos,setPos]=useState({top:100,left:100,width:100,height:40});
  useEffect(()=>{const el=document.getElementById(steps[step]?.target);if(el){const r=el.getBoundingClientRect();setPos({top:r.top,left:r.left,width:r.width,height:r.height});}},[step,steps]);
  const s=steps[step];const ts=(()=>{const base={position:"fixed",background:"#fff",borderRadius:16,padding:"24px 28px",boxShadow:"0 20px 60px rgba(0,0,0,.3)",zIndex:2002,maxWidth:340,width:"90vw"};if(s.position==="right")return{...base,top:pos.top-10,left:pos.left+pos.width+16};if(s.position==="left")return{...base,top:pos.top-10,right:window.innerWidth-pos.left+16};return{...base,top:pos.top+pos.height+16,left:Math.max(16,pos.left-100)};})();
  return(<div style={{position:"fixed",inset:0,zIndex:2000}}><div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.7)"}}/><div style={{position:"fixed",top:pos.top-6,left:pos.left-6,width:pos.width+12,height:pos.height+12,border:"3px solid #4f46e5",borderRadius:12,zIndex:2001,boxShadow:"0 0 0 4000px rgba(15,23,42,.6)",pointerEvents:"none",transition:"all .3s ease"}}/><div style={ts}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><span style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>{step+1}/{steps.length}</span><button onClick={onComplete} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",fontSize:13}}>{sk}</button></div><h3 style={{margin:"0 0 8px",fontSize:17,fontWeight:700,color:"#0f172a"}}>{s.title}</h3><p style={{margin:"0 0 20px",fontSize:14,color:"#64748b",lineHeight:1.6}}>{s.desc}</p><div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>{step>0&&<button onClick={()=>setStep(step-1)} style={{padding:"8px 18px",background:"#f1f5f9",color:"#475569",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer"}}>{bk}</button>}<button onClick={()=>step<steps.length-1?setStep(step+1):onComplete()} style={{padding:"8px 22px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer"}}>{step<steps.length-1?nx:dn}</button></div></div></div>);
}

function LoginPage({dark,toggleDark}){
  const[em,setEm]=useState("");const[pw,setPw]=useState("");const[showPw,setShowPw]=useState(false);const[loading,setLoading]=useState(false);const[err,setErr]=useState("");
  const c=dark?DARK:LIGHT;
  const submit=async(e)=>{e.preventDefault();setLoading(true);setErr("");const{error}=await supabase.auth.signInWithPassword({email:em,password:pw});if(error){setErr("Invalid email or password");setLoading(false);}};
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:dark?"linear-gradient(135deg,#020617 0%,#0f172a 50%,#020617 100%)":"linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)",padding:20}}>
      <button onClick={toggleDark} style={{position:"fixed",top:20,right:20,background:"rgba(255,255,255,.1)",border:"none",borderRadius:10,padding:"8px 12px",cursor:"pointer",color:"#94a3b8",display:"flex",alignItems:"center",gap:6,fontSize:13}}>{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:36}}><div style={{width:56,height:56,borderRadius:14,background:"#4f46e5",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Package size={28} color="#fff"/></div><h1 style={{margin:0,fontSize:24,fontWeight:700,color:"#fff"}}>NGO Inventory</h1><p style={{margin:"6px 0 0",fontSize:14,color:"#94a3b8"}}>Donation Tracking & Distribution System</p></div>
        <div style={{background:c.card,borderRadius:16,padding:32,boxShadow:"0 20px 60px rgba(0,0,0,.3)"}}>
          <h2 style={{margin:"0 0 24px",fontSize:18,fontWeight:600,color:c.text}}>Sign in to your account</h2>
          {err&&<div style={{padding:"10px 14px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,color:"#dc2626",fontSize:13,marginBottom:16,display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={16}/> {err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label style={{fontSize:13,fontWeight:600,color:c.textSec,display:"block",marginBottom:6}}>Email</label><input type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="you@example.com" style={{width:"100%",padding:"11px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",background:c.input,color:c.text}}/></div>
            <div><label style={{fontSize:13,fontWeight:600,color:c.textSec,display:"block",marginBottom:6}}>Password</label><div style={{position:"relative"}}><input type={showPw?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Enter your password" style={{width:"100%",padding:"11px 42px 11px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:14,outline:"none",boxSizing:"border-box",background:c.input,color:c.text}} onKeyDown={e=>e.key==="Enter"&&submit(e)}/><button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:c.textFaint}}>{showPw?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></div>
            <button onClick={submit} disabled={loading} style={{padding:"12px",background:loading?"#94a3b8":"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:loading?"not-allowed":"pointer",marginTop:4}}>{loading?"Signing in...":"Sign In"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({icon,label,value,color}){const{c}=useApp();return(<div style={{background:c.card,borderRadius:14,padding:"18px 20px",flex:"1 1 160px",minWidth:160,boxShadow:`0 1px 3px ${c.cardBorder}`,borderBottom:`3px solid ${color}`,display:"flex",flexDirection:"column",gap:8}}><div style={{width:36,height:36,borderRadius:10,background:color+"15",display:"flex",alignItems:"center",justifyContent:"center",color}}>{icon}</div><div style={{fontSize:24,fontWeight:700,color:c.text}}>{value}</div><div style={{fontSize:12,color:c.textMuted,fontWeight:500}}>{label}</div></div>);}

function Dashboard({items,giftCards,distributions}){
  const{t,c}=useApp();const[view,setView]=useState("monthly");
  const totalQty=items.reduce((s,i)=>s+i.qty,0);const inStock=items.filter(i=>i.status==="In Storage").reduce((s,i)=>s+i.qty,0);
  const dist=items.filter(i=>i.status==="Distributed").reduce((s,i)=>s+i.qty,0);const totalGiftCards=giftCards.reduce((s,g)=>s+g.amount,0);
  const urgent=items.filter(i=>i.urgent&&i.status!=="Distributed"&&i.status!=="Sold").length;const pplServed=distributions.reduce((s,d)=>s+d.people_count,0);
  const totalSales=items.filter(i=>i.status==="Sold").reduce((s,i)=>s+(i.sale_price||0),0);
  const catData=CATEGORIES.filter(cc=>cc.code!=="GFT").map(cc=>({name:cc.name,qty:items.filter(i=>i.cat===cc.code).reduce((s,i)=>s+i.qty,0)})).filter(d=>d.qty>0);
  const statusData=Object.entries(items.reduce((a,i)=>{a[i.status]=(a[i.status]||0)+i.qty;return a;},{})).map(([name,value])=>({name,value}));
  const trendData=useMemo(()=>{if(view==="monthly"){const d={};items.forEach(i=>{const m=i.date?.substring(0,7);if(m)d[m]=(d[m]||0)+i.qty;});return Object.entries(d).sort().slice(-12).map(([k,v])=>({name:MONTHS[parseInt(k.split("-")[1])-1]+" "+k.split("-")[0],qty:v}));}else{const d={};items.forEach(i=>{const y=i.date?.substring(0,4);if(y)d[y]=(d[y]||0)+i.qty;});return Object.entries(d).sort().map(([k,v])=>({name:k,qty:v}));}},[items,view]);
  const card={background:c.card,borderRadius:14,padding:24,boxShadow:`0 1px 3px ${c.cardBorder}`};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <StatCard icon={<Package size={18}/>} label={t.totalReceived} value={totalQty} color="#6366f1"/>
        <StatCard icon={<Warehouse size={18}/>} label={t.inStorage} value={inStock} color="#3b82f6"/>
        <StatCard icon={<Truck size={18}/>} label={t.distributed} value={dist} color="#10b981"/>
        <StatCard icon={<CreditCard size={18}/>} label={t.giftCardTotal} value={`$${totalGiftCards.toLocaleString()}`} color="#f59e0b"/>
        <StatCard icon={<Users size={18}/>} label={t.peopleServed} value={pplServed} color="#8b5cf6"/>
        <StatCard icon={<ShoppingCart size={18}/>} label={t.totalSales} value={`$${totalSales.toLocaleString()}`} color="#ec4899"/>
        {urgent>0&&<StatCard icon={<AlertTriangle size={18}/>} label={t.urgentItems} value={urgent} color="#e11d48"/>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(340px, 1fr))",gap:16}}>
        <div style={card}><h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:c.text}}>{t.inventoryByCategory}</h3><ResponsiveContainer width="100%" height={220}><BarChart data={catData}><XAxis dataKey="name" fontSize={11} tick={{fill:c.textMuted}}/><YAxis fontSize={11} tick={{fill:c.textMuted}}/><Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}}/><Bar dataKey="qty" fill="#6366f1" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
        <div style={card}><h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:600,color:c.text}}>{t.statusBreakdown}</h3><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} fontSize={11}>{statusData.map((e,i)=><Cell key={i} fill={STATUS_CLR[e.name]||COLORS[i]}/>)}</Pie><Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}}/></PieChart></ResponsiveContainer></div>
      </div>
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:600,color:c.text}}>{t.trendsOverTime}</h3>
          <div style={{display:"flex",background:c.pillBg,borderRadius:10,padding:3}}>{["monthly","yearly"].map(v=>(<button key={v} onClick={()=>setView(v)} style={{padding:"6px 16px",borderRadius:8,border:"none",fontSize:13,fontWeight:600,cursor:"pointer",background:view===v?c.pillActive:"transparent",color:view===v?"#4f46e5":c.textMuted,boxShadow:view===v?"0 1px 3px rgba(0,0,0,.1)":"none"}}>{v==="monthly"?t.monthly:t.yearly}</button>))}</div>
        </div>
        <ResponsiveContainer width="100%" height={220}><BarChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke={c.tableRowBorder}/><XAxis dataKey="name" fontSize={11} tick={{fill:c.textMuted}}/><YAxis fontSize={11} tick={{fill:c.textMuted}}/><Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}}/><Bar dataKey="qty" fill="#6366f1" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>
      </div>
    </div>
  );
}

function ReceiveForm({items,giftCards,addItem,addGiftCard,addDonor,showToast}){
  const{t,lang,profile,c}=useApp();
  // Category & item fields
  const[cat,setCat]=useState("");const[sub,setSub]=useState("");const[qty,setQty]=useState("");const[cond,setCond]=useState("New");
  const[notes,setNotes]=useState("");const[urgent,setUrgent]=useState(false);const[estCost,setEstCost]=useState("");
  // Donor fields
  const[donorType,setDonorType]=useState("individual");const[donorName,setDonorName]=useState("");
  const[donorEmail,setDonorEmail]=useState("");const[donorPhone,setDonorPhone]=useState("");const[orgName,setOrgName]=useState("");
  // Gift card fields
  const[gcAmount,setGcAmount]=useState("");const[gcCompany,setGcCompany]=useState("");
  // UI state
  const[lastEntry,setLastEntry]=useState(null);const[saving,setSaving]=useState(false);const[showConfirm,setShowConfirm]=useState(false);
  
  const isGiftCard=cat==="GFT";const catObj=CATEGORIES.find(cc=>cc.code===cat);const catName=catObj?(lang==="es"?catObj.nameEs:catObj.name):"";const subs=catObj?(lang==="es"?catObj.subsEs:catObj.subs):[];
  
  const reset=()=>{setSub("");setQty("");setCond("New");setNotes("");setUrgent(false);setEstCost("");setGcAmount("");setGcCompany("");};
  const resetDonor=()=>{setDonorName("");setDonorEmail("");setDonorPhone("");setOrgName("");setDonorType("individual");};
  
  const sendReceipt=async(receiptData)=>{
    if(!receiptData.donorEmail)return;
    try{
      const{data,error}=await supabase.functions.invoke("send-receipt",{
        body:receiptData
      });
      if(!error){
        showToast(lang==="es"?"Recibo enviado por email":"Receipt sent to donor!");
      }else{
        console.error("Email send error:",error);
      }
    }catch(err){
      console.error("Email send error:",err);
    }
  };
  
  const saveDonor=async()=>{
    if(!donorName&&!orgName)return null;
    // Check if donor with same email exists
    if(donorEmail){
      const{data:existing}=await supabase.from("donors").select("*").eq("email",donorEmail).single();
      if(existing)return existing;
    }
    const donorData={
      type:donorType,
      name:donorType==="individual"?donorName:(orgName||donorName),
      email:donorEmail||null,
      phone:donorPhone||null,
      organization_name:donorType==="organization"?orgName:null,
    };
    const{data,error}=await supabase.from("donors").insert(donorData).select().single();
    if(error){console.error("Donor save error:",error);return null;}
    return data;
  };
  
  const submit=async()=>{
    setSaving(true);setShowConfirm(false);
    // Save donor first
    const donor=await saveDonor();
    const displayName=donorType==="organization"?(orgName||donorName):(donorName||"Anonymous");
    
    if(isGiftCard){
      const entry={
        id:genId("GFT",giftCards),
        amount:parseFloat(gcAmount),
        company:gcCompany||sub,
        donor_id:donor?.id||null,
        donor_name:displayName,
        date:new Date().toISOString().split("T")[0],
        notes
      };
      const ok=await addGiftCard(entry);
      if(ok){
        setLastEntry({...entry,isGiftCard:true,donorEmail,donorPhone,donorType});
        showToast(lang==="es"?"Tarjeta regalo registrada":"Gift card logged!");
        // Send email receipt if donor email provided
        if(donorEmail){
          await sendReceipt({
            donorName:displayName,
            donorEmail,
            donationType:"gift card",
            giftCard:{amount:parseFloat(gcAmount),company:gcCompany||sub},
            date:entry.date
          });
        }
      }
    }else{
      const totalEstCost=estCost?parseFloat(estCost)*parseInt(qty):null;
      const entry={
        id:genId(cat,items),
        cat,catName:catObj.name,
        sub:catObj.subs[subs.indexOf(sub)]||sub,
        qty:parseInt(qty),
        condition:cond,
        donor:displayName,
        donor_id:donor?.id||null,
        donor_email:donorEmail||null,
        donor_phone:donorPhone||null,
        estimated_cost:totalEstCost,
        status:"Received",
        date:new Date().toISOString().split("T")[0],
        notes,urgent,location:"",
        created_by:profile?.id
      };
      const ok=await addItem(entry);
      if(ok){
        setLastEntry({...entry,estCostPerItem:estCost,donorType,orgName});
        showToast(lang==="es"?`${catName} recibido`:`${catName} — ${sub} (x${qty}) received!`);
        // Send email receipt if donor email provided
        if(donorEmail){
          await sendReceipt({
            donorName:displayName,
            donorEmail,
            donationType:"item donation",
            items:[{
              category:catObj.name,
              subcategory:catObj.subs[subs.indexOf(sub)]||sub,
              quantity:parseInt(qty),
              condition:cond,
              estimatedCost:totalEstCost
            }],
            date:entry.date
          });
        }
      }
    }
    reset();setSaving(false);
  };
  
  const trySubmit=()=>{
    if(!cat)return;
    if(isGiftCard&&(!gcAmount||isNaN(gcAmount)||!gcCompany&&!sub))return;
    if(!isGiftCard&&(!sub||!qty||isNaN(qty)))return;
    setShowConfirm(true);
  };
  
  const inp={width:"100%",padding:"11px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:14,boxSizing:"border-box",outline:"none",background:c.input,color:c.text};
  const lbl={fontSize:13,fontWeight:600,color:c.textSec,marginBottom:6,display:"block"};
  const card={background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`};
  
  return(
    <>
      <Modal open={showConfirm} onClose={()=>setShowConfirm(false)}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:48,height:48,borderRadius:12,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#4f46e5"}}><ClipboardList size={24}/></div>
          <h3 style={{margin:0,fontSize:18,fontWeight:700,color:c.text}}>{t.confirmSubmit}</h3>
          <p style={{margin:"6px 0 0",fontSize:13,color:c.textMuted}}>{t.confirmSubmitMsg}</p>
        </div>
        <div style={{background:c.confirmBg,borderRadius:10,padding:16,fontSize:13,color:c.textSec,lineHeight:2,marginBottom:20}}>
          {isGiftCard?(
            <>
              <b>{t.giftCard}:</b> {gcCompany||sub}<br/>
              <b>{t.amount}:</b> ${gcAmount}<br/>
            </>
          ):(
            <>
              <b>{t.category}:</b> {catName}<br/>
              <b>{t.subcategory}:</b> {sub}<br/>
              <b>{t.quantity}:</b> {qty}<br/>
              <b>{t.condition}:</b> {cond}<br/>
              {estCost&&<><b>{t.estimatedCost}:</b> ${estCost} × {qty} = ${(parseFloat(estCost)*parseInt(qty)).toFixed(2)}<br/></>}
            </>
          )}
          <b>{t.donorType}:</b> {donorType==="individual"?t.individual:t.organization}<br/>
          <b>{t.donorName}:</b> {donorType==="organization"?(orgName||donorName):(donorName||"Anonymous")}<br/>
          {donorEmail&&<><b>{t.email}:</b> {donorEmail}<br/></>}
          {donorPhone&&<><b>{t.phone}:</b> {donorPhone}<br/></>}
        </div>
        {donorEmail&&<div style={{background:"#ecfdf5",borderRadius:8,padding:10,fontSize:12,color:"#166534",marginBottom:16,display:"flex",alignItems:"center",gap:6}}><Mail size={14}/> {t.receiptWillBeSent}</div>}
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>setShowConfirm(false)} style={{flex:1,padding:"11px",background:c.pillBg,color:c.textSec,border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.cancel}</button>
          <button onClick={submit} disabled={saving} style={{flex:1,padding:"11px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{saving?"...":t.confirm}</button>
        </div>
      </Modal>
      
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))",gap:20}}>
        <div style={card}>
          <h2 style={{margin:"0 0 24px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><Package size={20} color="#4f46e5"/> {t.receiveNew}</h2>
          
          {/* Donor Type Selector */}
          <div style={{marginBottom:20}}>
            <label style={lbl}>{t.donorType}</label>
            <div style={{display:"flex",gap:8}}>
              {["individual","organization"].map(dt=>(
                <button key={dt} onClick={()=>setDonorType(dt)} style={{flex:1,padding:"10px",borderRadius:10,border:donorType===dt?"2px solid #4f46e5":`1px solid ${c.inputBorder}`,background:donorType===dt?c.tagBg:c.card,color:donorType===dt?"#4f46e5":c.textMuted,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  {dt==="individual"?<User size={16}/>:<Building2 size={16}/>}
                  {dt==="individual"?t.individual:t.organization}
                </button>
              ))}
            </div>
          </div>
          
          {/* Donor Info Section */}
          <div style={{background:c.confirmBg,borderRadius:12,padding:16,marginBottom:20}}>
            <h4 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:c.text,display:"flex",alignItems:"center",gap:6}}><Users size={16}/> {t.donorInfo}</h4>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {donorType==="organization"&&(
                <div><label style={{...lbl,marginBottom:4}}>{t.orgName}</label><input value={orgName} onChange={e=>setOrgName(e.target.value)} placeholder="Acme Corporation" style={inp}/></div>
              )}
              <div><label style={{...lbl,marginBottom:4}}>{donorType==="organization"?"Contact Name":t.donorName}</label><input value={donorName} onChange={e=>setDonorName(e.target.value)} placeholder={t.anonymous} style={inp}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label style={{...lbl,marginBottom:4}}><Mail size={12} style={{marginRight:4}}/>{t.email}</label><input type="email" value={donorEmail} onChange={e=>setDonorEmail(e.target.value)} placeholder="email@example.com" style={inp}/></div>
                <div><label style={{...lbl,marginBottom:4}}><Phone size={12} style={{marginRight:4}}/>{t.phone}</label><input type="tel" value={donorPhone} onChange={e=>setDonorPhone(e.target.value)} placeholder="(555) 123-4567" style={inp}/></div>
              </div>
            </div>
          </div>
          
          {/* Category Selection */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label style={lbl}>{t.category} *</label><select value={cat} onChange={e=>{setCat(e.target.value);setSub("");}} style={inp}><option value="">— {t.selectCategory} —</option>{CATEGORIES.map(cc=><option key={cc.code} value={cc.code}>{cc.code} — {lang==="es"?cc.nameEs:cc.name}</option>)}</select></div>
            
            {/* Gift Card Fields */}
            {isGiftCard&&(
              <>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  <div><label style={lbl}>{t.company} *</label><input value={gcCompany} onChange={e=>setGcCompany(e.target.value)} placeholder="Amazon, Target, Visa..." style={inp}/></div>
                  <div><label style={lbl}>{t.amount} ($) *</label><input type="number" min="0" step="0.01" value={gcAmount} onChange={e=>setGcAmount(e.target.value)} placeholder="50.00" style={inp}/></div>
                </div>
                <div><label style={lbl}>{t.type}</label><select value={sub} onChange={e=>setSub(e.target.value)} style={inp}><option value="">— {t.selectSub} —</option>{subs.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </>
            )}
            
            {/* Regular Item Fields */}
            {cat&&!isGiftCard&&(
              <>
                <div><label style={lbl}>{t.subcategory} *</label><select value={sub} onChange={e=>setSub(e.target.value)} style={inp}><option value="">— {t.selectSub} —</option>{subs.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                  <div><label style={lbl}>{t.quantity} *</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} placeholder="25" style={inp}/></div>
                  <div><label style={lbl}>{t.condition}</label><select value={cond} onChange={e=>setCond(e.target.value)} style={inp}>{CONDITIONS.map(cc=><option key={cc}>{cc}</option>)}</select></div>
                  <div><label style={lbl}><Tag size={12} style={{marginRight:4}}/>{t.costPerItem}</label><input type="number" min="0" step="0.01" value={estCost} onChange={e=>setEstCost(e.target.value)} placeholder="15.00" style={inp}/></div>
                </div>
                {estCost&&qty&&<div style={{background:c.tagBg,borderRadius:8,padding:10,fontSize:13,color:"#4f46e5",fontWeight:600}}>{t.totalEstValue}: ${(parseFloat(estCost)*parseInt(qty)).toFixed(2)}</div>}
              </>
            )}
            
            {cat&&(
              <>
                <div><label style={lbl}>{t.notes}</label><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t.anyNotes} style={inp}/></div>
                {!isGiftCard&&<label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",color:urgent?"#e11d48":c.textMuted,fontWeight:500}}><input type="checkbox" checked={urgent} onChange={e=>setUrgent(e.target.checked)} style={{accentColor:"#e11d48"}}/> {t.markUrgent}</label>}
                <button onClick={trySubmit} disabled={saving} style={{padding:"12px",background:saving?"#94a3b8":"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  {saving?"...":<><Plus size={18}/> {isGiftCard?t.logGiftCard:t.receiveBtn}</>}
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Last Entry Card */}
        <div style={card}>
          <h2 style={{margin:"0 0 24px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><ClipboardList size={20} color="#4f46e5"/> {t.lastEntry}</h2>
          {lastEntry?(
            <div style={{background:c.confirmBg,borderRadius:12,padding:20}}>
              <div style={{fontSize:13,color:c.textSec,lineHeight:2.2}}>
                <b>{t.id}:</b> <span style={{fontFamily:"monospace",background:c.tagBg,padding:"2px 8px",borderRadius:6,fontSize:12}}>{lastEntry.id}</span><br/>
                {lastEntry.isGiftCard?(
                  <>
                    <b>{t.giftCard}:</b> {lastEntry.company}<br/>
                    <b>{t.amount}:</b> ${lastEntry.amount}<br/>
                  </>
                ):(
                  <>
                    <b>{t.category}:</b> {lastEntry.catName} → {lastEntry.sub}<br/>
                    <b>{t.quantity}:</b> {lastEntry.qty}<br/>
                    <b>{t.condition}:</b> {lastEntry.condition}<br/>
                    {lastEntry.estimated_cost&&<><b>{t.estimatedCost}:</b> ${lastEntry.estimated_cost.toFixed(2)}<br/></>}
                  </>
                )}
                <b>{t.donorType}:</b> {lastEntry.donorType==="organization"?t.organization:t.individual}<br/>
                <b>{t.donor}:</b> {lastEntry.donor||lastEntry.donor_name}<br/>
                {lastEntry.donorEmail&&<><b>{t.email}:</b> {lastEntry.donorEmail}<br/></>}
                {lastEntry.donorPhone&&<><b>{t.phone}:</b> {lastEntry.donorPhone}<br/></>}
                <b>{t.date}:</b> {lastEntry.date}
              </div>
            </div>
          ):(
            <div style={{textAlign:"center",color:c.textFaint,padding:48,fontSize:14}}>
              <ClipboardList size={40} style={{marginBottom:12,opacity:.4}}/><br/>{t.submitEntry}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Storage Zones Configuration - 4 shelves each
const ZONES = [
  { id: "A", name: "Clothing", nameEs: "Ropa", color: "#6366f1", bg: "#eef2ff", locations: ["A1", "A2", "A3", "A4"] },
  { id: "B", name: "Food", nameEs: "Alimentos", color: "#10b981", bg: "#ecfdf5", locations: ["B1", "B2", "B3", "B4"] },
  { id: "C", name: "Household", nameEs: "Hogar", color: "#f59e0b", bg: "#fffbeb", locations: ["C1", "C2", "C3", "C4"] },
  { id: "D", name: "Toiletries", nameEs: "Higiene", color: "#ec4899", bg: "#fdf2f8", locations: ["D1", "D2", "D3", "D4"] },
  { id: "E", name: "Footwear", nameEs: "Calzado", color: "#8b5cf6", bg: "#f5f3ff", locations: ["E1", "E2", "E3", "E4"] },
  { id: "F", name: "Miscellaneous", nameEs: "Misceláneo", color: "#64748b", bg: "#f1f5f9", locations: ["F1", "F2", "F3", "F4"] },
];

// All shelf locations for dropdown
const ALL_SHELVES = ZONES.flatMap(z => z.locations);

// Compact Floor Plan 2D Component for side-by-side view
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

function ZoneItemsPanel({ zone, items, onBack, onSell, c, t, lang }) {
  const zoneData = ZONES.find(z => z.id === zone);
  const zoneItems = items.filter(i => i.status === "In Storage" && zoneData?.locations.some(loc => i.location?.toUpperCase().startsWith(loc)));
  return (
    <div style={{ background: c.card, borderRadius: 14, padding: 24, boxShadow: `0 1px 3px ${c.cardBorder}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: zoneData?.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={20} color={zoneData?.color} /></div>
          <div><h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.text }}>{lang === "es" ? "Zona" : "Zone"} {zone}</h3><p style={{ margin: "2px 0 0", fontSize: 13, color: zoneData?.color, fontWeight: 600 }}>{lang === "es" ? zoneData?.nameEs : zoneData?.name}</p></div>
        </div>
        <button onClick={onBack} style={{ padding: "8px 16px", background: c.pillBg, color: c.textSec, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> {lang === "es" ? "Volver" : "Back"}</button>
      </div>
      {zoneItems.length === 0 ? (<div style={{ textAlign: "center", padding: 48, color: c.textFaint }}><Package size={40} style={{ marginBottom: 12, opacity: 0.4 }} /><p>{t.noData}</p></div>) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{zoneItems.map(item => (
          <div key={item.id} style={{ padding: 16, background: c.confirmBg, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${zoneData?.color}` }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{item.catName} — {item.sub}</div><div style={{ fontSize: 12, color: c.textMuted, marginTop: 4 }}><span style={{ fontFamily: "monospace", background: c.tagBg, padding: "2px 6px", borderRadius: 4, marginRight: 8 }}>{item.id}</span>{t.location}: <b>{item.location}</b> · {t.qty}: <b>{item.qty}</b></div></div>
            <button onClick={() => onSell(item.id)} style={{ padding: "6px 12px", background: "#8b5cf6", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><ShoppingCart size={14} /> {t.sell}</button>
          </div>
        ))}</div>
      )}
    </div>
  );
}

function InventoryView({items,updateItem,deleteItem,showToast}){
  const{t,lang,profile,c}=useApp();
  const[search,setSearch]=useState("");const[fCat,setFCat]=useState("");const[fStatus,setFStatus]=useState("");
  const[locInput,setLocInput]=useState({});const[delModal,setDelModal]=useState(null);
  const[sellModal,setSellModal]=useState(null);const[salePrice,setSalePrice]=useState("");
  const[highlightShelf,setHighlightShelf]=useState("");
  
  // Filter to show only "Received" items that need to be assigned a location
  const pendingItems = items.filter(i => i.status === "Received");
  const filtered=items.filter(i=>{
    if(search){const q=search.toLowerCase();if(!i.id.toLowerCase().includes(q)&&!i.donor.toLowerCase().includes(q)&&!i.catName.toLowerCase().includes(q))return false;}
    if(fCat&&i.cat!==fCat)return false;
    if(fStatus&&i.status!==fStatus)return false;
    return true;
  });
  
  const moveToStorage=async(id)=>{
    const loc=locInput[id];
    if(!loc){showToast(t.locationRequired);return;}
    const ok=await updateItem(id,{status:"In Storage",location:loc.toUpperCase()});
    if(ok){showToast(t.moveToStorage+" ✓");setLocInput(p=>({...p,[id]:""}));setHighlightShelf("");}
  };
  
  const confirmDelete=async()=>{if(!delModal)return;await deleteItem(delModal);setDelModal(null);showToast(t.delete+" ✓");};
  
  const confirmSell=async()=>{
    if(!sellModal)return;
    if(!salePrice||isNaN(salePrice)){showToast(t.salePriceRequired);return;}
    const ok=await updateItem(sellModal,{status:"Sold",sale_price:parseFloat(salePrice),sold_date:new Date().toISOString().split("T")[0]});
    if(ok){showToast(t.itemSold);setSellModal(null);setSalePrice("");}
  };
  
  const inp={padding:"10px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:13,outline:"none",background:c.input,color:c.text};
  const isAdmin=profile?.role==="admin";
  const card={background:c.card,borderRadius:14,padding:20,boxShadow:`0 1px 3px ${c.cardBorder}`};
  
  // Get zone color for shelf
  const getShelfZone = (shelf) => ZONES.find(z => z.locations.includes(shelf?.toUpperCase()));
  
  return(
    <>
      {/* Delete Modal */}
      <Modal open={!!delModal} onClose={()=>setDelModal(null)}>
        <div style={{textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:12,background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#e11d48"}}><AlertTriangle size={24}/></div>
          <h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:700,color:c.text}}>{t.confirmDelete}</h3>
          <p style={{margin:"0 0 24px",fontSize:13,color:c.textMuted}}>{t.confirmDeleteMsg}</p>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>setDelModal(null)} style={{flex:1,padding:"11px",background:c.pillBg,color:c.textSec,border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.cancel}</button>
            <button onClick={confirmDelete} style={{flex:1,padding:"11px",background:"#e11d48",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.delete}</button>
          </div>
        </div>
      </Modal>
      
      {/* Sell Modal */}
      <Modal open={!!sellModal} onClose={()=>{setSellModal(null);setSalePrice("");}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{width:48,height:48,borderRadius:12,background:"#f3e8ff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#8b5cf6"}}><ShoppingCart size={24}/></div>
          <h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:700,color:c.text}}>{t.sellItem}</h3>
          <p style={{margin:"0 0 16px",fontSize:13,color:c.textMuted}}>{items.find(i=>i.id===sellModal)?.catName} — {items.find(i=>i.id===sellModal)?.sub}</p>
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:13,fontWeight:600,color:c.textSec,display:"block",marginBottom:6}}>{t.salePrice} *</label>
          <input type="number" min="0" step="0.01" value={salePrice} onChange={e=>setSalePrice(e.target.value)} placeholder="25.00" style={{...inp,width:"100%",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{setSellModal(null);setSalePrice("");}} style={{flex:1,padding:"11px",background:c.pillBg,color:c.textSec,border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.cancel}</button>
          <button onClick={confirmSell} style={{flex:1,padding:"11px",background:"#8b5cf6",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.confirmSale}</button>
        </div>
      </Modal>
      
      <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><Warehouse size={20} color="#4f46e5"/> {t.fullInventory}</h2>
      
      {/* Side-by-side layout: Floor Plan + Pending Items */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        {/* Floor Plan */}
        <div style={card}>
          <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:600,color:c.text,display:"flex",alignItems:"center",gap:8}}><Home size={18}/> {lang==="es"?"Mapa de Almacén":"Storage Map"}</h3>
          <FloorPlan2D items={items} c={c} lang={lang} highlightShelf={highlightShelf}/>
        </div>
        
        {/* Pending Items to Assign Location */}
        <div style={card}>
          <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:600,color:c.text,display:"flex",alignItems:"center",gap:8}}>
            <Package size={18}/> {lang==="es"?"Asignar Ubicación":"Assign Location"}
            {pendingItems.length>0&&<span style={{background:"#f59e0b",color:"#fff",padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{pendingItems.length}</span>}
          </h3>
          
          {pendingItems.length===0?(
            <div style={{textAlign:"center",padding:40,color:c.textFaint}}>
              <CheckCircle size={36} style={{marginBottom:8,opacity:.4}}/>
              <p style={{margin:0,fontSize:13}}>{lang==="es"?"Todos los artículos asignados":"All items assigned"}</p>
            </div>
          ):(
            <div style={{maxHeight:360,overflowY:"auto",display:"flex",flexDirection:"column",gap:10}}>
              {pendingItems.map(i=>{
                const selectedZone = getShelfZone(locInput[i.id]);
                return(
                  <div key={i.id} style={{padding:14,background:c.confirmBg,borderRadius:10,borderLeft:`4px solid ${i.urgent?"#e11d48":"#f59e0b"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:c.text}}>{i.catName} — {i.sub}</div>
                        <div style={{fontSize:11,color:c.textMuted,marginTop:2}}>
                          <span style={{fontFamily:"monospace",background:c.tagBg,padding:"1px 5px",borderRadius:4}}>{i.id}</span>
                          <span style={{marginLeft:8}}>×{i.qty}</span>
                          {i.urgent&&<span style={{marginLeft:8,color:"#e11d48",fontWeight:600}}>⚠ Urgent</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <select 
                        value={locInput[i.id]||""} 
                        onChange={e=>{setLocInput(p=>({...p,[i.id]:e.target.value}));setHighlightShelf(e.target.value);}}
                        style={{...inp,flex:1,padding:"8px 12px",background:selectedZone?selectedZone.bg:c.input,borderColor:selectedZone?selectedZone.color:c.inputBorder}}
                      >
                        <option value="">{lang==="es"?"Seleccionar estante...":"Select shelf..."}</option>
                        {ZONES.map(z=>(
                          <optgroup key={z.id} label={`${z.id} — ${lang==="es"?z.nameEs:z.name}`}>
                            {z.locations.map(loc=>(
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <button 
                        onClick={()=>moveToStorage(i.id)} 
                        disabled={!locInput[i.id]}
                        style={{padding:"8px 14px",background:locInput[i.id]?"#4f46e5":"#94a3b8",color:"#fff",border:"none",borderRadius:8,fontSize:12,cursor:locInput[i.id]?"pointer":"not-allowed",fontWeight:600,display:"flex",alignItems:"center",gap:4}}
                      >
                        <ArrowRight size={14}/> {lang==="es"?"Asignar":"Assign"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Full Inventory Table */}
      <div style={card}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
          <div style={{flex:"1 1 220px",position:"relative"}}><Search size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:c.textFaint}}/><input placeholder={t.searchPlaceholder} value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:"100%",paddingLeft:36,boxSizing:"border-box"}}/></div>
          <select value={fCat} onChange={e=>setFCat(e.target.value)} style={inp}><option value="">{t.allCategories}</option>{CATEGORIES.filter(cc=>cc.code!=="GFT").map(cc=><option key={cc.code} value={cc.code}>{cc.name}</option>)}</select>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={inp}><option value="">{t.allStatuses}</option><option value="Received">{t.received}</option><option value="In Storage">{t.inStorageStatus}</option><option value="Distributed">{t.distributed}</option><option value="Sold">{t.sold}</option></select>
        </div>
        <div style={{fontSize:12,color:c.textMuted,marginBottom:10}}>{t.showing} {filtered.length} {t.of} {items.length} {t.items}</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:c.tableBg,borderBottom:`2px solid ${c.headerBorder}`}}>
                {[t.id,t.category,t.subcategory,t.qty,t.condition,t.donor,t.status,t.location,t.date,t.action].map(h=><th key={h} style={{padding:"12px 8px",textAlign:"left",color:c.textSec,fontWeight:600,whiteSpace:"nowrap",fontSize:12}}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(i=>{
                const locZone = getShelfZone(i.location);
                return(
                  <tr key={i.id} style={{borderBottom:`1px solid ${c.tableRowBorder}`,background:i.urgent&&i.status!=="Distributed"&&i.status!=="Sold"?c.urgentBg:"transparent"}}>
                    <td style={{padding:"12px 8px",fontFamily:"monospace",fontSize:11,color:c.textMuted}}>{i.id}</td>
                    <td style={{padding:"12px 8px",color:c.text}}>{i.catName}</td>
                    <td style={{padding:"12px 8px",color:c.text}}>{i.sub}</td>
                    <td style={{padding:"12px 8px",fontWeight:700,color:c.text}}>{i.qty}</td>
                    <td style={{padding:"12px 8px",color:c.text}}>{i.condition}</td>
                    <td style={{padding:"12px 8px",color:c.text}}>{i.donor}</td>
                    <td style={{padding:"12px 8px"}}><span style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,background:(STATUS_CLR[i.status]||"#94a3b8")+"18",color:STATUS_CLR[i.status]||"#94a3b8"}}>{i.status}{i.status==="Sold"&&i.sale_price?` ($${i.sale_price})`:""}</span></td>
                    <td style={{padding:"12px 8px"}}>{i.location?<span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,background:locZone?.bg||c.pillBg,color:locZone?.color||c.textMuted}}>{i.location}</span>:"—"}</td>
                    <td style={{padding:"12px 8px",fontSize:12,color:c.textMuted}}>{i.date}</td>
                    <td style={{padding:"12px 8px",whiteSpace:"nowrap"}}>
                      {i.status==="In Storage"&&(
                        <button onClick={()=>setSellModal(i.id)} style={{padding:"6px 12px",background:"#8b5cf6",color:"#fff",border:"none",borderRadius:8,fontSize:11,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4,marginRight:4}}><ShoppingCart size={14}/> {t.sell}</button>
                      )}
                      {isAdmin&&<button onClick={()=>setDelModal(i.id)} style={{padding:"6px",background:"none",border:"none",cursor:"pointer",color:"#e11d48",marginLeft:4}}><Trash2 size={15}/></button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:48,color:c.textFaint}}>{t.noData}</div>}
      </div>
    </>
  );
}

function DistributeView({items,addItem,updateItem,addDistribution,showToast}){
  const{t,lang,profile,c}=useApp();const[scanId,setScanId]=useState("");const[distQty,setDistQty]=useState("");const[found,setFound]=useState(null);const[recipientType,setRecipientType]=useState("individual");const[familySize,setFamilySize]=useState("");const[showConfirm,setShowConfirm]=useState(false);
  const lookup=()=>{const item=items.find(i=>i.id.toLowerCase()===scanId.toLowerCase()&&i.status==="In Storage");setFound(item||"not_found");};
  const distribute=async()=>{if(!found||found==="not_found")return;setShowConfirm(false);const q=parseInt(distQty)||found.qty;if(q>found.qty){showToast(t.qtyExceeds);return;}const ppl=recipientType==="family"?parseInt(familySize)||1:1;if(q>=found.qty){await updateItem(found.id,{status:"Distributed",location:""});}else{await updateItem(found.id,{qty:found.qty-q});await addItem({id:found.id+"-D"+Date.now(),cat:found.cat,catName:found.catName,sub:found.sub,qty:q,condition:found.condition,donor:found.donor,status:"Distributed",date:new Date().toISOString().split("T")[0],notes:`Partial from ${found.id}`,urgent:false,location:"",estimated_cost:found.estimated_cost?(found.estimated_cost/found.qty)*q:null});}await addDistribution({id:`DIST-${Date.now()}`,item_id:found.id,quantity:q,distribution_type:recipientType,people_count:ppl,distributed_by:profile?.id,date:new Date().toISOString().split("T")[0],notes:""});showToast(lang==="es"?"Artículos distribuidos":"Items distributed successfully!");setScanId("");setDistQty("");setFound(null);setRecipientType("individual");setFamilySize("");};
  const available=items.filter(i=>i.status==="In Storage");const inp={padding:"11px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:14,outline:"none",background:c.input,color:c.text};const card={background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`};
  return(
    <>
      <Modal open={showConfirm} onClose={()=>setShowConfirm(false)}><div style={{textAlign:"center",marginBottom:20}}><div style={{width:48,height:48,borderRadius:12,background:"#ecfdf5",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#10b981"}}><Truck size={24}/></div><h3 style={{margin:0,fontSize:18,fontWeight:700,color:c.text}}>{t.confirmSubmit}</h3></div><div style={{background:c.confirmBg,borderRadius:10,padding:16,fontSize:13,color:c.textSec,lineHeight:2,marginBottom:20}}><b>{t.category}:</b> {found?.catName} → {found?.sub}<br/><b>{t.qty}:</b> {distQty||found?.qty}<br/><b>{t.recipientType}:</b> {recipientType==="family"?t.family:t.individual}<br/>{recipientType==="family"&&<><b>{t.peopleCount}:</b> {familySize||1}<br/></>}</div><div style={{display:"flex",gap:12}}><button onClick={()=>setShowConfirm(false)} style={{flex:1,padding:"11px",background:c.pillBg,color:c.textSec,border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.cancel}</button><button onClick={distribute} style={{flex:1,padding:"11px",background:"#10b981",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.confirm}</button></div></Modal>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))",gap:20}}>
        <div style={card}>
          <h2 style={{margin:"0 0 24px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><Truck size={20} color="#4f46e5"/> {t.distributeItems}</h2>
          <div style={{display:"flex",gap:10,marginBottom:20}}><input placeholder={t.enterBarcode} value={scanId} onChange={e=>setScanId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&lookup()} style={{...inp,flex:1}}/><button onClick={lookup} style={{padding:"11px 20px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Search size={16}/> {t.lookUp}</button></div>
          {found==="not_found"&&<div style={{padding:16,background:c.urgentBg,border:"1px solid #fecaca",borderRadius:12,color:"#dc2626",fontSize:13,display:"flex",alignItems:"center",gap:10}}><AlertTriangle size={18}/> {t.itemNotFound}</div>}
          {found&&found!=="not_found"&&(<div style={{border:"1px solid #d1fae5",borderRadius:12,padding:20,background:"#f0fdf410"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,color:"#166534",fontWeight:600,fontSize:14}}><CheckCircle size={18}/> {t.itemFound}</div><div style={{fontSize:13,color:c.textSec,lineHeight:1.8,marginBottom:16}}><b>{found.catName}</b> → {found.sub}<br/>{t.qtyAvailable}: <b>{found.qty}</b> | {t.location}: {found.location}</div><div style={{display:"flex",flexDirection:"column",gap:12}}><input type="number" min="1" max={found.qty} placeholder={`${t.qty} (max ${found.qty})`} value={distQty} onChange={e=>setDistQty(e.target.value)} style={inp}/><div><label style={{fontSize:13,fontWeight:600,color:c.textSec,display:"block",marginBottom:8}}>{t.recipientType}</label><div style={{display:"flex",gap:8}}>{["individual","family"].map(rt=>(<button key={rt} onClick={()=>setRecipientType(rt)} style={{flex:1,padding:"10px",borderRadius:10,border:recipientType===rt?"2px solid #4f46e5":`1px solid ${c.inputBorder}`,background:recipientType===rt?c.tagBg:c.card,color:recipientType===rt?"#4f46e5":c.textMuted,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{rt==="individual"?<User size={16}/>:<Users size={16}/>} {rt==="individual"?t.individual:t.family}</button>))}</div></div>{recipientType==="family"&&<input type="number" min="1" placeholder={t.familySize} value={familySize} onChange={e=>setFamilySize(e.target.value)} style={inp}/>}<button onClick={()=>setShowConfirm(true)} style={{padding:"12px",background:"#10b981",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Truck size={18}/> {t.distributeBtn}</button></div></div>)}
        </div>
        <div style={card}>
          <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><ClipboardList size={20} color="#4f46e5"/> {t.availableForDist}</h2>
          <div style={{maxHeight:460,overflowY:"auto"}}>{available.map(i=>(<div key={i.id} onClick={()=>{setScanId(i.id);setFound(i);}} style={{padding:"14px 16px",borderBottom:`1px solid ${c.tableRowBorder}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}><div><b style={{color:c.text}}>{i.catName}</b> <span style={{color:c.textMuted}}>— {i.sub}</span><div style={{fontSize:11,color:c.textFaint,fontFamily:"monospace",marginTop:2}}>{i.id}</div></div><div style={{textAlign:"right"}}><div style={{fontWeight:700,color:c.text}}>×{i.qty}</div><div style={{fontSize:11,color:c.textFaint}}>{i.location}</div></div></div>))}{available.length===0&&<div style={{textAlign:"center",padding:48,color:c.textFaint}}>{t.noItemsStorage}</div>}</div>
        </div>
      </div>
    </>
  );
}

function GiftCardsView({giftCards}){
  const{t,c}=useApp();const total=giftCards.reduce((s,g)=>s+g.amount,0);
  const companyData=Object.entries(giftCards.reduce((a,g)=>{a[g.company]=(a[g.company]||0)+g.amount;return a;},{})).map(([name,value])=>({name,value}));
  const card={background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`};
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))",gap:20}}>
      <div style={card}>
        <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><CreditCard size={20} color="#4f46e5"/> {t.giftCardDonations}</h2>
        <div style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:14,padding:24,color:"#fff",marginBottom:20}}>
          <div style={{fontSize:13,opacity:.9}}>{t.totalGiftCards}</div>
          <div style={{fontSize:36,fontWeight:700,marginTop:4}}>${total.toLocaleString()}</div>
          <div style={{fontSize:13,opacity:.9,marginTop:4}}>{giftCards.length} {t.transactions}</div>
        </div>
        {giftCards.map(g=>(
          <div key={g.id} style={{padding:"14px 0",borderBottom:`1px solid ${c.tableRowBorder}`,display:"flex",justifyContent:"space-between",fontSize:13}}>
            <div>
              <b style={{color:c.text}}>${g.amount.toLocaleString()}</b> <span style={{color:c.textMuted}}>— {g.company}</span><br/>
              <span style={{fontSize:12,color:c.textFaint}}>{g.donor_name}</span>
            </div>
            <div style={{fontSize:12,color:c.textFaint}}>{g.date}</div>
          </div>
        ))}
        {giftCards.length===0&&<div style={{textAlign:"center",padding:48,color:c.textFaint}}>{t.noData}</div>}
      </div>
      <div style={card}>
        <h3 style={{margin:"0 0 20px",fontSize:15,fontWeight:600,color:c.text}}>{t.byCompany}</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={companyData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,value})=>`${name}: $${value}`} fontSize={12}>
              {companyData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
            </Pie>
            <Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}} formatter={v=>`$${v}`}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ReportsView({items,giftCards,distributions}){
  const{t,c}=useApp();
  const totalRec=items.reduce((s,i)=>s+i.qty,0);
  const totalDist=items.filter(i=>i.status==="Distributed").reduce((s,i)=>s+i.qty,0);
  const totalStock=items.filter(i=>i.status==="In Storage").reduce((s,i)=>s+i.qty,0);
  const totalGiftCards=giftCards.reduce((s,g)=>s+g.amount,0);
  const unusable=items.filter(i=>i.condition==="Unusable").reduce((s,i)=>s+i.qty,0);
  const donors=new Set([...items.map(i=>i.donor),...giftCards.map(g=>g.donor_name)]).size;
  const pplServed=distributions.reduce((s,d)=>s+d.people_count,0);
  const families=distributions.filter(d=>d.distribution_type==="family").length;
  const individuals=distributions.filter(d=>d.distribution_type==="individual").length;
  const totalSales=items.filter(i=>i.status==="Sold").reduce((s,i)=>s+(i.sale_price||0),0);
  const itemsSold=items.filter(i=>i.status==="Sold").reduce((s,i)=>s+i.qty,0);
  const totalEstValue=items.reduce((s,i)=>s+(i.estimated_cost||0),0);
  
  const catBreakdown=CATEGORIES.filter(cc=>cc.code!=="GFT").map(cc=>{
    const ci=items.filter(i=>i.cat===cc.code);
    return{name:cc.name,received:ci.reduce((s,i)=>s+i.qty,0),distributed:ci.filter(i=>i.status==="Distributed").reduce((s,i)=>s+i.qty,0)};
  }).filter(d=>d.received>0);
  
  const downloadExcel=()=>{
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(items.map(i=>({ID:i.id,Category:i.catName,Subcategory:i.sub,Quantity:i.qty,Condition:i.condition,Donor:i.donor,DonorEmail:i.donor_email||"",DonorPhone:i.donor_phone||"",Status:i.status,EstimatedCost:i.estimated_cost||"",SalePrice:i.sale_price||"",Location:i.location,Date:i.date,Notes:i.notes,Urgent:i.urgent?"Yes":"No"}))),"Items");
    XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(giftCards.map(g=>({ID:g.id,Amount:g.amount,Company:g.company,Donor:g.donor_name,Date:g.date,Notes:g.notes}))),"GiftCards");
    XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(distributions.map(d=>({ID:d.id,ItemID:d.item_id,Quantity:d.quantity,Type:d.distribution_type,PeopleServed:d.people_count,Date:d.date}))),"Distributions");
    XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet([
      {Metric:"Total Items Received",Value:totalRec},
      {Metric:"Total Distributed",Value:totalDist},
      {Metric:"In Stock",Value:totalStock},
      {Metric:"Items Sold",Value:itemsSold},
      {Metric:"Sales Revenue",Value:`$${totalSales}`},
      {Metric:"Gift Cards Total",Value:`$${totalGiftCards}`},
      {Metric:"Estimated Donation Value",Value:`$${totalEstValue.toFixed(2)}`},
      {Metric:"Unique Donors",Value:donors},
      {Metric:"People Served",Value:pplServed},
      {Metric:"Families Served",Value:families},
      {Metric:"Distribution Rate",Value:totalRec?`${Math.round(totalDist/totalRec*100)}%`:"0%"}
    ]),"Summary");
    XLSX.writeFile(wb,`NGO_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
  };
  
  const stats=[
    {l:t.itemsReceived,v:totalRec},
    {l:t.itemsDistributed,v:totalDist},
    {l:t.currentlyInStock,v:totalStock},
    {l:t.itemsSold,v:itemsSold},
    {l:t.salesRevenue,v:`$${totalSales.toLocaleString()}`},
    {l:t.giftCardsReceived,v:`$${totalGiftCards.toLocaleString()}`},
    {l:t.totalEstValue,v:`$${totalEstValue.toFixed(0)}`},
    {l:t.uniqueDonors,v:donors},
    {l:t.distributionRate,v:totalRec?`${Math.round(totalDist/totalRec*100)}%`:"0%"},
    {l:t.totalPeopleServed,v:pplServed},
    {l:t.familiesServed,v:families},
    {l:t.individualsServed,v:individuals}
  ];
  
  return(
    <div style={{background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><FileText size={20} color="#4f46e5"/> {t.yearEndReport}</h2>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{fontSize:12,color:c.textFaint}}>{t.generated}: {new Date().toLocaleDateString()}</span>
          <button onClick={downloadExcel} style={{padding:"9px 18px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Download size={16}/> {t.downloadExcel}</button>
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:14,padding:28,color:"#fff",marginBottom:24}}>
        <h3 style={{margin:"0 0 18px",fontSize:16,fontWeight:600}}>{t.executiveSummary}</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(100px, 1fr))",gap:12}}>
          {stats.map((s,i)=><div key={i} style={{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"14px 12px"}}><div style={{fontSize:20,fontWeight:700}}>{s.v}</div><div style={{fontSize:10,opacity:.7,marginTop:4}}>{s.l}</div></div>)}
        </div>
      </div>
      <h3 style={{fontSize:15,fontWeight:600,color:c.text,margin:"0 0 14px"}}>{t.catBreakdown}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={catBreakdown}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.tableRowBorder}/>
          <XAxis dataKey="name" fontSize={11} tick={{fill:c.textMuted}}/>
          <YAxis fontSize={11} tick={{fill:c.textMuted}}/>
          <Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}}/>
          <Legend/>
          <Bar dataKey="received" fill="#6366f1" name={t.received} radius={[6,6,0,0]}/>
          <Bar dataKey="distributed" fill="#10b981" name={t.distributed} radius={[6,6,0,0]}/>
        </BarChart>
      </ResponsiveContainer>
      {unusable>0&&<div style={{background:c.urgentBg,borderRadius:10,padding:14,marginTop:16,fontSize:13,color:"#991b1b",display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={16}/> <b>{unusable}</b> {t.unusableWarning}</div>}
      <div style={{marginTop:24,padding:16,background:c.confirmBg,borderRadius:10,fontSize:12,color:c.textFaint,textAlign:"center"}}>{t.reportNote}</div>
    </div>
  );
}

export default function App(){
  const[session,setSession]=useState(null);const[profile,setProfile]=useState(null);const[lang,setLang]=useState("en");
  const[dark,setDark]=useState(()=>{try{return localStorage.getItem("ngo-dark")==="true";}catch(e){return false;}});
  const[page,setPage]=useState("dashboard");const[items,setItems]=useState([]);const[giftCards,setGiftCards]=useState([]);
  const[distributions,setDistributions]=useState([]);const[loading,setLoading]=useState(true);const[toast,setToast]=useState(null);
  const[showTutorial,setShowTutorial]=useState(false);const[sidebarOpen,setSidebarOpen]=useState(false);
  const t=T[lang];const c=dark?DARK:LIGHT;const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
  const toggleDark=()=>{setDark(p=>{const n=!p;try{localStorage.setItem("ngo-dark",n);}catch(e){}return n;});};

  useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>setSession(session));const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setSession(session));return()=>subscription.unsubscribe();},[]);
  useEffect(()=>{if(!session?.user){setProfile(null);setLoading(false);return;}const lp=async()=>{const{data}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();if(data){setProfile(data);setLang(data.language||"en");if(!data.tutorial_completed)setShowTutorial(true);}setLoading(false);};lp();},[session]);
  
  const fetchData=useCallback(async()=>{
    if(!session)return;
    const[iR,gR,dR]=await Promise.all([
      supabase.from("items").select("*").eq("deleted",false).order("created_at",{ascending:false}),
      supabase.from("gift_cards").select("*").eq("deleted",false).order("created_at",{ascending:false}),
      supabase.from("distributions").select("*").order("created_at",{ascending:false})
    ]);
    setItems((iR.data||[]).map(r=>({
      id:r.id,cat:r.category,catName:r.category_name,sub:r.subcategory,qty:r.quantity,condition:r.condition,
      donor:r.donor,donor_id:r.donor_id,donor_email:r.donor_email,donor_phone:r.donor_phone,
      estimated_cost:r.estimated_cost?parseFloat(r.estimated_cost):null,
      sale_price:r.sale_price?parseFloat(r.sale_price):null,sold_date:r.sold_date,
      status:r.status,date:r.date,notes:r.notes||"",urgent:r.urgent||false,location:r.location||"",created_by:r.created_by
    })));
    setGiftCards((gR.data||[]).map(r=>({
      id:r.id,amount:parseFloat(r.amount),company:r.company,donor_id:r.donor_id,donor_name:r.donor_name,
      date:r.date,notes:r.notes||""
    })));
    setDistributions(dR.data||[]);
  },[session]);
  
  useEffect(()=>{if(session)fetchData();},[session,fetchData]);
  useEffect(()=>{if(!session)return;const ch=supabase.channel("all-changes").on("postgres_changes",{event:"*",schema:"public",table:"items"},()=>fetchData()).on("postgres_changes",{event:"*",schema:"public",table:"gift_cards"},()=>fetchData()).on("postgres_changes",{event:"*",schema:"public",table:"distributions"},()=>fetchData()).subscribe();return()=>supabase.removeChannel(ch);},[session,fetchData]);

  const addItem=async(e)=>{
    const{error}=await supabase.from("items").insert({
      id:e.id,category:e.cat,category_name:e.catName,subcategory:e.sub,quantity:e.qty,condition:e.condition,
      donor:e.donor,donor_id:e.donor_id,donor_email:e.donor_email,donor_phone:e.donor_phone,
      estimated_cost:e.estimated_cost,status:e.status,date:e.date,notes:e.notes,urgent:e.urgent,location:e.location,created_by:profile?.id
    });
    if(error){console.error(error);showToast("Error");return false;}return true;
  };
  
  const updateItem=async(id,u)=>{
    const d={};
    if(u.status!==undefined)d.status=u.status;
    if(u.location!==undefined)d.location=u.location;
    if(u.qty!==undefined)d.quantity=u.qty;
    if(u.sale_price!==undefined)d.sale_price=u.sale_price;
    if(u.sold_date!==undefined)d.sold_date=u.sold_date;
    const{error}=await supabase.from("items").update(d).eq("id",id);
    if(error){showToast("Error");return false;}return true;
  };
  
  const deleteItem=async(id)=>{await supabase.from("items").update({deleted:true}).eq("id",id);};
  
  const addGiftCard=async(e)=>{
    const{error}=await supabase.from("gift_cards").insert({
      id:e.id,amount:e.amount,company:e.company,donor_id:e.donor_id,donor_name:e.donor_name,
      date:e.date,notes:e.notes,created_by:profile?.id
    });
    if(error){console.error(error);showToast("Error");return false;}return true;
  };
  
  const addDonor=async(d)=>{
    const{data,error}=await supabase.from("donors").insert(d).select().single();
    if(error){console.error(error);return null;}return data;
  };
  
  const addDistribution=async(e)=>{await supabase.from("distributions").insert(e);};
  const completeTutorial=async()=>{setShowTutorial(false);if(profile)await supabase.from("profiles").update({tutorial_completed:true}).eq("id",profile.id);};
  const toggleLang=async()=>{const nl=lang==="en"?"es":"en";setLang(nl);if(profile)await supabase.from("profiles").update({language:nl}).eq("id",profile.id);};
  const signOut=async()=>{await supabase.auth.signOut();setSession(null);setProfile(null);};

  const role=profile?.role||"reception";
  const navItems=[
    {id:"dashboard",icon:<BarChart3 size={20}/>,label:t.dashboard,roles:["admin"]},
    {id:"receive",icon:<Package size={20}/>,label:t.receive,roles:["reception","admin"]},
    {id:"inventory",icon:<Warehouse size={20}/>,label:t.inventory,roles:["inventory","admin"]},
    {id:"distribute",icon:<Truck size={20}/>,label:t.distribute,roles:["distribution","admin"]},
    {id:"giftcards",icon:<CreditCard size={20}/>,label:t.giftCards,roles:["reception","admin"]},
    {id:"reports",icon:<FileText size={20}/>,label:t.reports,roles:["admin"]}
  ].filter(n=>n.roles.includes(role));
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{if(navItems.length>0&&!navItems.find(n=>n.id===page))setPage(navItems[0].id);},[role]);
  const roleLabel={admin:t.admin,reception:t.reception,inventory:t.inventoryRole,distribution:t.distribution}[role];
  const roleColor={admin:"#4f46e5",reception:"#f59e0b",inventory:"#3b82f6",distribution:"#10b981"}[role];

  if(loading)return<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:c.bg}}><div style={{textAlign:"center",color:"#4f46e5"}}><Package size={40} style={{marginBottom:12}}/><div style={{fontSize:16,fontWeight:600}}>Loading...</div></div></div>;
  if(!session)return<LoginPage dark={dark} toggleDark={toggleDark}/>;

  return(
    <AppContext.Provider value={{t,lang,profile,c}}>
      {showTutorial&&<Tutorial onComplete={completeTutorial} lang={lang}/>}
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:dark?"#334155":"#0f172a",color:"#fff",padding:"12px 28px",borderRadius:12,fontWeight:600,zIndex:3000,boxShadow:"0 8px 30px rgba(0,0,0,.3)",fontSize:14,display:"flex",alignItems:"center",gap:8}}><CheckCircle size={18} color="#10b981"/> {toast}</div>}
      <div style={{display:"flex",minHeight:"100vh",background:c.bg,fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",transition:"background .3s"}}>
        <div style={{width:sidebarOpen?240:0,minWidth:sidebarOpen?240:0,background:c.sidebarBg,transition:"all .3s",overflow:"hidden",position:"fixed",top:0,left:0,bottom:0,zIndex:900,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:"#4f46e5",display:"flex",alignItems:"center",justifyContent:"center"}}><Package size={18} color="#fff"/></div><div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>NGO Inventory</div><div style={{fontSize:11,color:"#64748b"}}>v2.2</div></div></div></div>
          <nav style={{flex:1,padding:"12px 10px"}}>{navItems.map(n=>(<button key={n.id} onClick={()=>{setPage(n.id);setSidebarOpen(false);}} style={{width:"100%",padding:"11px 14px",border:"none",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:page===n.id?600:500,background:page===n.id?"rgba(79,70,229,.2)":"transparent",color:page===n.id?"#a5b4fc":"#94a3b8",display:"flex",alignItems:"center",gap:12,marginBottom:4,textAlign:"left"}}>{n.icon} {n.label}</button>))}</nav>
          <div style={{padding:"16px 14px",borderTop:"1px solid rgba(255,255,255,.08)"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><div style={{width:34,height:34,borderRadius:10,background:roleColor+"20",display:"flex",alignItems:"center",justifyContent:"center",color:roleColor}}><Shield size={16}/></div><div><div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{profile?.full_name}</div><div style={{fontSize:11,color:roleColor,fontWeight:600}}>{roleLabel}</div></div></div><button onClick={signOut} style={{width:"100%",padding:"9px",background:"rgba(255,255,255,.06)",color:"#94a3b8",border:"none",borderRadius:8,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><LogOut size={15}/> {t.logout}</button></div>
        </div>
        {sidebarOpen&&<div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:899}}/>}
        <div style={{flex:1,marginLeft:0,minWidth:0}}>
          <header style={{background:c.headerBg,borderBottom:`1px solid ${c.headerBorder}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50,transition:"background .3s"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}><button id="sidebar-btn" onClick={()=>setSidebarOpen(!sidebarOpen)} style={{background:"none",border:"none",cursor:"pointer",color:c.textSec,padding:4}}><Menu size={22}/></button><h2 style={{margin:0,fontSize:17,fontWeight:700,color:c.text}}>{navItems.find(n=>n.id===page)?.label}</h2></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <button id="theme-btn" onClick={toggleDark} style={{padding:"6px 10px",background:c.pillBg,border:"none",borderRadius:8,cursor:"pointer",color:c.textSec,display:"flex",alignItems:"center",gap:4}}>{dark?<Sun size={16}/>:<Moon size={16}/>}</button>
              <button id="lang-btn" onClick={toggleLang} style={{padding:"6px 12px",background:c.pillBg,border:"none",borderRadius:8,fontSize:13,fontWeight:600,cursor:"pointer",color:c.textSec,display:"flex",alignItems:"center",gap:4}}><Globe size={15}/> {lang.toUpperCase()}</button>
              <button id="help-btn" onClick={()=>setShowTutorial(true)} style={{padding:"6px 10px",background:c.pillBg,border:"none",borderRadius:8,cursor:"pointer",color:c.textSec,display:"flex",alignItems:"center",gap:4}}><HelpCircle size={16}/></button>
            </div>
          </header>
          <main id="page-content" style={{padding:20,maxWidth:1200,margin:"0 auto"}}>
            {page==="dashboard"&&<Dashboard items={items} giftCards={giftCards} distributions={distributions}/>}
            {page==="receive"&&<ReceiveForm items={items} giftCards={giftCards} addItem={addItem} addGiftCard={addGiftCard} addDonor={addDonor} showToast={showToast}/>}
            {page==="inventory"&&<InventoryView items={items} updateItem={updateItem} deleteItem={deleteItem} showToast={showToast}/>}
            {page==="distribute"&&<DistributeView items={items} addItem={addItem} updateItem={updateItem} addDistribution={addDistribution} showToast={showToast}/>}
            {page==="giftcards"&&<GiftCardsView giftCards={giftCards}/>}
            {page==="reports"&&<ReportsView items={items} giftCards={giftCards} distributions={distributions}/>}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}