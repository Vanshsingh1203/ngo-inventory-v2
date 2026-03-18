import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from "recharts";
import { LogOut, Package, Warehouse, Truck, DollarSign, BarChart3, FileText, Menu, HelpCircle, Globe, Trash2, AlertTriangle, CheckCircle, Users, User, Home, Plus, Search, ArrowRight, Download, Eye, EyeOff, Shield, ClipboardList, Moon, Sun } from "lucide-react";
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
    distribute:"Distribute",monetary:"Monetary",reports:"Reports",
    admin:"Administrator",reception:"Reception",distribution:"Distribution",inventoryRole:"Inventory",
    totalReceived:"Total Items Received",inStorage:"Currently In Storage",
    distributed:"Items Distributed",monetaryTotal:"Monetary Donations",
    urgentItems:"Urgent Items",peopleServed:"People Served",
    inventoryByCategory:"Inventory by Category",statusBreakdown:"Status Breakdown",
    trendsOverTime:"Donation Trends Over Time",monthly:"Monthly",yearly:"Yearly",
    receiveNew:"Receive New Donation",category:"Category",subcategory:"Subcategory",
    quantity:"Quantity",condition:"Condition",donorName:"Donor Name",
    notes:"Notes",markUrgent:"Mark as Urgent / Perishable",
    selectCategory:"Select Category",selectSub:"Select Subcategory",
    anonymous:"Leave blank for Anonymous",anyNotes:"Any special notes...",
    receiveBtn:"Receive Donation",logMonetary:"Log Monetary Donation",
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
    monetaryDonations:"Monetary Donations",totalMonetary:"Total Monetary Donations",
    transactions:"transactions",byPaymentType:"By Payment Type",
    yearEndReport:"Year-End Report",generated:"Generated",
    executiveSummary:"Executive Summary",itemsReceived:"Items Received",
    itemsDistributed:"Items Distributed",currentlyInStock:"Currently In Stock",
    monetaryReceived:"Monetary Received",uniqueDonors:"Unique Donors",
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
    received:"Received",inStorageStatus:"In Storage",help:"Help",
  },
  es: {
    appName:"Gestor de Inventario ONG",appDesc:"Sistema de Seguimiento de Donaciones y Distribución",
    login:"Iniciar Sesión",logout:"Cerrar Sesión",email:"Correo",password:"Contraseña",
    signingIn:"Iniciando sesión...",loginError:"Correo o contraseña inválidos",welcome:"Bienvenido de nuevo",
    dashboard:"Panel",receive:"Recibir",inventory:"Inventario",
    distribute:"Distribuir",monetary:"Monetario",reports:"Informes",
    admin:"Administrador",reception:"Recepción",distribution:"Distribución",inventoryRole:"Inventario",
    totalReceived:"Total de Artículos Recibidos",inStorage:"Actualmente en Almacén",
    distributed:"Artículos Distribuidos",monetaryTotal:"Donaciones Monetarias",
    urgentItems:"Artículos Urgentes",peopleServed:"Personas Atendidas",
    inventoryByCategory:"Inventario por Categoría",statusBreakdown:"Desglose por Estado",
    trendsOverTime:"Tendencias de Donaciones",monthly:"Mensual",yearly:"Anual",
    receiveNew:"Recibir Nueva Donación",category:"Categoría",subcategory:"Subcategoría",
    quantity:"Cantidad",condition:"Estado",donorName:"Nombre del Donante",
    notes:"Notas",markUrgent:"Marcar como Urgente / Perecedero",
    selectCategory:"Seleccionar Categoría",selectSub:"Seleccionar Subcategoría",
    anonymous:"Dejar en blanco para Anónimo",anyNotes:"Notas especiales...",
    receiveBtn:"Recibir Donación",logMonetary:"Registrar Donación Monetaria",
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
    monetaryDonations:"Donaciones Monetarias",totalMonetary:"Total de Donaciones Monetarias",
    transactions:"transacciones",byPaymentType:"Por Tipo de Pago",
    yearEndReport:"Informe Anual",generated:"Generado",
    executiveSummary:"Resumen Ejecutivo",itemsReceived:"Artículos Recibidos",
    itemsDistributed:"Artículos Distribuidos",currentlyInStock:"En Stock Actualmente",
    monetaryReceived:"Monetario Recibido",uniqueDonors:"Donantes Únicos",
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
    received:"Recibido",inStorageStatus:"En Almacén",help:"Ayuda",
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
  {code:"MON",name:"Monetary",nameEs:"Monetario",subs:["Cash","Check","Online Transfer"],subsEs:["Efectivo","Cheque","Transferencia"]},
  {code:"MIS",name:"Miscellaneous",nameEs:"Misceláneo",subs:["Books","Toys","Electronics","Other"],subsEs:["Libros","Juguetes","Electrónicos","Otro"]},
];

const CONDITIONS=["New","Gently Used","Worn","Unusable"];
const COLORS=["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#3b82f6","#ec4899"];
const STATUS_CLR={Received:"#f59e0b","In Storage":"#6366f1",Distributed:"#10b981"};
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

function Dashboard({items,monetary,distributions}){
  const{t,c}=useApp();const[view,setView]=useState("monthly");
  const totalQty=items.reduce((s,i)=>s+i.qty,0);const inStock=items.filter(i=>i.status==="In Storage").reduce((s,i)=>s+i.qty,0);
  const dist=items.filter(i=>i.status==="Distributed").reduce((s,i)=>s+i.qty,0);const totalMoney=monetary.reduce((s,m)=>s+m.amount,0);
  const urgent=items.filter(i=>i.urgent&&i.status!=="Distributed").length;const pplServed=distributions.reduce((s,d)=>s+d.people_count,0);
  const catData=CATEGORIES.filter(cc=>cc.code!=="MON").map(cc=>({name:cc.name,qty:items.filter(i=>i.cat===cc.code).reduce((s,i)=>s+i.qty,0)})).filter(d=>d.qty>0);
  const statusData=Object.entries(items.reduce((a,i)=>{a[i.status]=(a[i.status]||0)+i.qty;return a;},{})).map(([name,value])=>({name,value}));
  const trendData=useMemo(()=>{if(view==="monthly"){const d={};items.forEach(i=>{const m=i.date?.substring(0,7);if(m)d[m]=(d[m]||0)+i.qty;});return Object.entries(d).sort().slice(-12).map(([k,v])=>({name:MONTHS[parseInt(k.split("-")[1])-1]+" "+k.split("-")[0],qty:v}));}else{const d={};items.forEach(i=>{const y=i.date?.substring(0,4);if(y)d[y]=(d[y]||0)+i.qty;});return Object.entries(d).sort().map(([k,v])=>({name:k,qty:v}));}},[items,view]);
  const card={background:c.card,borderRadius:14,padding:24,boxShadow:`0 1px 3px ${c.cardBorder}`};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <StatCard icon={<Package size={18}/>} label={t.totalReceived} value={totalQty} color="#6366f1"/>
        <StatCard icon={<Warehouse size={18}/>} label={t.inStorage} value={inStock} color="#3b82f6"/>
        <StatCard icon={<Truck size={18}/>} label={t.distributed} value={dist} color="#10b981"/>
        <StatCard icon={<DollarSign size={18}/>} label={t.monetaryTotal} value={`$${totalMoney.toLocaleString()}`} color="#f59e0b"/>
        <StatCard icon={<Users size={18}/>} label={t.peopleServed} value={pplServed} color="#8b5cf6"/>
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

function ReceiveForm({items,monetary,addItem,addMonetary,showToast}){
  const{t,lang,profile,c}=useApp();
  const[cat,setCat]=useState("");const[sub,setSub]=useState("");const[qty,setQty]=useState("");const[cond,setCond]=useState("New");
  const[donor,setDonor]=useState("");const[notes,setNotes]=useState("");const[urgent,setUrgent]=useState(false);
  const[monAmt,setMonAmt]=useState("");const[monType,setMonType]=useState("Cash");const[monPurpose,setMonPurpose]=useState("General Fund");
  const[lastEntry,setLastEntry]=useState(null);const[saving,setSaving]=useState(false);const[showConfirm,setShowConfirm]=useState(false);
  const isMon=cat==="MON";const catObj=CATEGORIES.find(cc=>cc.code===cat);const catName=catObj?(lang==="es"?catObj.nameEs:catObj.name):"";const subs=catObj?(lang==="es"?catObj.subsEs:catObj.subs):[];
  const reset=()=>{setSub("");setQty("");setCond("New");setNotes("");setUrgent(false);setMonAmt("");setMonPurpose("General Fund");};
  const submit=async()=>{setSaving(true);setShowConfirm(false);if(isMon){const entry={id:genId("MON",monetary),amount:parseFloat(monAmt),type:monType,donor:donor||"Anonymous",date:new Date().toISOString().split("T")[0],purpose:monPurpose,notes};const ok=await addMonetary(entry);if(ok){setLastEntry({...entry,isMon:true});showToast(lang==="es"?"Donación monetaria registrada":"Monetary donation logged!");}}else{const entry={id:genId(cat,items),cat,catName:catObj.name,sub:catObj.subs[subs.indexOf(sub)]||sub,qty:parseInt(qty),condition:cond,donor:donor||"Anonymous",status:"Received",date:new Date().toISOString().split("T")[0],notes,urgent,location:"",created_by:profile?.id};const ok=await addItem(entry);if(ok){setLastEntry(entry);showToast(lang==="es"?`${catName} recibido`:`${catName} — ${sub} (x${qty}) received!`);}}reset();setSaving(false);};
  const trySubmit=()=>{if(!cat)return;if(isMon&&(!monAmt||isNaN(monAmt)))return;if(!isMon&&(!sub||!qty||isNaN(qty)))return;setShowConfirm(true);};
  const inp={width:"100%",padding:"11px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:14,boxSizing:"border-box",outline:"none",background:c.input,color:c.text};
  const lbl={fontSize:13,fontWeight:600,color:c.textSec,marginBottom:6,display:"block"};const card={background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`};
  return(
    <>
      <Modal open={showConfirm} onClose={()=>setShowConfirm(false)}>
        <div style={{textAlign:"center",marginBottom:20}}><div style={{width:48,height:48,borderRadius:12,background:"#eef2ff",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#4f46e5"}}><ClipboardList size={24}/></div><h3 style={{margin:0,fontSize:18,fontWeight:700,color:c.text}}>{t.confirmSubmit}</h3><p style={{margin:"6px 0 0",fontSize:13,color:c.textMuted}}>{t.confirmSubmitMsg}</p></div>
        <div style={{background:c.confirmBg,borderRadius:10,padding:16,fontSize:13,color:c.textSec,lineHeight:2,marginBottom:20}}>{isMon?(<><b>{t.amount}:</b> ${monAmt}<br/><b>{t.type}:</b> {monType}<br/><b>{t.purpose}:</b> {monPurpose}<br/></>):(<><b>{t.category}:</b> {catName}<br/><b>{t.subcategory}:</b> {sub}<br/><b>{t.quantity}:</b> {qty}<br/><b>{t.condition}:</b> {cond}<br/></>)}<b>{t.donorName}:</b> {donor||"Anonymous"}</div>
        <div style={{display:"flex",gap:12}}><button onClick={()=>setShowConfirm(false)} style={{flex:1,padding:"11px",background:c.pillBg,color:c.textSec,border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.cancel}</button><button onClick={submit} disabled={saving} style={{flex:1,padding:"11px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{saving?"...":t.confirm}</button></div>
      </Modal>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))",gap:20}}>
        <div style={card}>
          <h2 style={{margin:"0 0 24px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><Package size={20} color="#4f46e5"/> {t.receiveNew}</h2>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label style={lbl}>{t.category} *</label><select value={cat} onChange={e=>{setCat(e.target.value);setSub("");}} style={inp}><option value="">— {t.selectCategory} —</option>{CATEGORIES.map(cc=><option key={cc.code} value={cc.code}>{cc.code} — {lang==="es"?cc.nameEs:cc.name}</option>)}</select></div>
            {cat&&!isMon&&(<><div><label style={lbl}>{t.subcategory} *</label><select value={sub} onChange={e=>setSub(e.target.value)} style={inp}><option value="">— {t.selectSub} —</option>{subs.map(s=><option key={s} value={s}>{s}</option>)}</select></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={lbl}>{t.quantity} *</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} placeholder="25" style={inp}/></div><div><label style={lbl}>{t.condition}</label><select value={cond} onChange={e=>setCond(e.target.value)} style={inp}>{CONDITIONS.map(cc=><option key={cc}>{cc}</option>)}</select></div></div></>)}
            {isMon&&(<><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={lbl}>{t.amount} ($) *</label><input type="number" min="0" step="0.01" value={monAmt} onChange={e=>setMonAmt(e.target.value)} placeholder="500.00" style={inp}/></div><div><label style={lbl}>{t.type}</label><select value={monType} onChange={e=>setMonType(e.target.value)} style={inp}>{(lang==="es"?catObj.subsEs:catObj.subs).map(s=><option key={s}>{s}</option>)}</select></div></div><div><label style={lbl}>{t.purpose}</label><input value={monPurpose} onChange={e=>setMonPurpose(e.target.value)} placeholder={t.generalFund} style={inp}/></div></>)}
            {cat&&(<><div><label style={lbl}>{t.donorName}</label><input value={donor} onChange={e=>setDonor(e.target.value)} placeholder={t.anonymous} style={inp}/></div><div><label style={lbl}>{t.notes}</label><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder={t.anyNotes} style={inp}/></div>{!isMon&&<label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",color:urgent?"#e11d48":c.textMuted,fontWeight:500}}><input type="checkbox" checked={urgent} onChange={e=>setUrgent(e.target.checked)} style={{accentColor:"#e11d48"}}/> {t.markUrgent}</label>}<button onClick={trySubmit} disabled={saving} style={{padding:"12px",background:saving?"#94a3b8":"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:600,cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{saving?"...":<><Plus size={18}/> {isMon?t.logMonetary:t.receiveBtn}</>}</button></>)}
          </div>
        </div>
        <div style={card}>
          <h2 style={{margin:"0 0 24px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><ClipboardList size={20} color="#4f46e5"/> {t.lastEntry}</h2>
          {lastEntry?(<div style={{background:c.confirmBg,borderRadius:12,padding:20}}><div style={{fontSize:13,color:c.textSec,lineHeight:2.2}}><b>{t.id}:</b> <span style={{fontFamily:"monospace",background:c.tagBg,padding:"2px 8px",borderRadius:6,fontSize:12}}>{lastEntry.id}</span><br/>{lastEntry.isMon?(<><b>{t.amount}:</b> ${lastEntry.amount}<br/><b>{t.type}:</b> {lastEntry.type}<br/><b>{t.purpose}:</b> {lastEntry.purpose}<br/></>):(<><b>{t.category}:</b> {lastEntry.catName} → {lastEntry.sub}<br/><b>{t.quantity}:</b> {lastEntry.qty}<br/><b>{t.condition}:</b> {lastEntry.condition}<br/></>)}<b>{t.donor}:</b> {lastEntry.donor}<br/><b>{t.date}:</b> {lastEntry.date}</div></div>):(<div style={{textAlign:"center",color:c.textFaint,padding:48,fontSize:14}}><ClipboardList size={40} style={{marginBottom:12,opacity:.4}}/><br/>{t.submitEntry}</div>)}
        </div>
      </div>
    </>
  );
}

function InventoryView({items,updateItem,deleteItem,showToast}){
  const{t,profile,c}=useApp();const[search,setSearch]=useState("");const[fCat,setFCat]=useState("");const[fStatus,setFStatus]=useState("");const[locInput,setLocInput]=useState({});const[delModal,setDelModal]=useState(null);
  const filtered=items.filter(i=>{if(search){const q=search.toLowerCase();if(!i.id.toLowerCase().includes(q)&&!i.donor.toLowerCase().includes(q)&&!i.catName.toLowerCase().includes(q))return false;}if(fCat&&i.cat!==fCat)return false;if(fStatus&&i.status!==fStatus)return false;return true;});
  const moveToStorage=async(id)=>{const loc=locInput[id];if(!loc||!loc.trim()){showToast(t.locationRequired);return;}const ok=await updateItem(id,{status:"In Storage",location:loc.trim()});if(ok){showToast(t.moveToStorage+" ✓");setLocInput(p=>({...p,[id]:""}));}};
  const confirmDelete=async()=>{if(!delModal)return;await deleteItem(delModal);setDelModal(null);showToast(t.delete+" ✓");};
  const inp={padding:"10px 14px",border:`1px solid ${c.inputBorder}`,borderRadius:10,fontSize:13,outline:"none",background:c.input,color:c.text};const isAdmin=profile?.role==="admin";
  return(
    <>
      <Modal open={!!delModal} onClose={()=>setDelModal(null)}><div style={{textAlign:"center"}}><div style={{width:48,height:48,borderRadius:12,background:"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",color:"#e11d48"}}><AlertTriangle size={24}/></div><h3 style={{margin:"0 0 6px",fontSize:18,fontWeight:700,color:c.text}}>{t.confirmDelete}</h3><p style={{margin:"0 0 24px",fontSize:13,color:c.textMuted}}>{t.confirmDeleteMsg}</p><div style={{display:"flex",gap:12}}><button onClick={()=>setDelModal(null)} style={{flex:1,padding:"11px",background:c.pillBg,color:c.textSec,border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.cancel}</button><button onClick={confirmDelete} style={{flex:1,padding:"11px",background:"#e11d48",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.delete}</button></div></div></Modal>
      <div style={{background:c.card,borderRadius:14,padding:24,boxShadow:`0 1px 3px ${c.cardBorder}`}}>
        <h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><Warehouse size={20} color="#4f46e5"/> {t.fullInventory}</h2>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}><div style={{flex:"1 1 220px",position:"relative"}}><Search size={16} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:c.textFaint}}/><input placeholder={t.searchPlaceholder} value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:"100%",paddingLeft:36,boxSizing:"border-box"}}/></div><select value={fCat} onChange={e=>setFCat(e.target.value)} style={inp}><option value="">{t.allCategories}</option>{CATEGORIES.filter(cc=>cc.code!=="MON").map(cc=><option key={cc.code} value={cc.code}>{cc.name}</option>)}</select><select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={inp}><option value="">{t.allStatuses}</option><option value="Received">{t.received}</option><option value="In Storage">{t.inStorageStatus}</option><option value="Distributed">{t.distributed}</option></select></div>
        <div style={{fontSize:12,color:c.textMuted,marginBottom:10}}>{t.showing} {filtered.length} {t.of} {items.length} {t.items}</div>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:c.tableBg,borderBottom:`2px solid ${c.headerBorder}`}}>{[t.id,t.category,t.subcategory,t.qty,t.condition,t.donor,t.status,t.location,t.date,t.action].map(h=><th key={h} style={{padding:"12px 8px",textAlign:"left",color:c.textSec,fontWeight:600,whiteSpace:"nowrap",fontSize:12}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(i=>(<tr key={i.id} style={{borderBottom:`1px solid ${c.tableRowBorder}`,background:i.urgent&&i.status!=="Distributed"?c.urgentBg:"transparent"}}><td style={{padding:"12px 8px",fontFamily:"monospace",fontSize:11,color:c.textMuted}}>{i.id}</td><td style={{padding:"12px 8px",color:c.text}}>{i.catName}</td><td style={{padding:"12px 8px",color:c.text}}>{i.sub}</td><td style={{padding:"12px 8px",fontWeight:700,color:c.text}}>{i.qty}</td><td style={{padding:"12px 8px",color:c.text}}>{i.condition}</td><td style={{padding:"12px 8px",color:c.text}}>{i.donor}</td><td style={{padding:"12px 8px"}}><span style={{padding:"4px 12px",borderRadius:20,fontSize:11,fontWeight:600,background:(STATUS_CLR[i.status]||"#94a3b8")+"18",color:STATUS_CLR[i.status]||"#94a3b8"}}>{i.status}</span></td><td style={{padding:"12px 8px",fontSize:12,color:c.textMuted}}>{i.location||"—"}</td><td style={{padding:"12px 8px",fontSize:12,color:c.textMuted}}>{i.date}</td><td style={{padding:"12px 8px",whiteSpace:"nowrap"}}>{i.status==="Received"&&(<div style={{display:"flex",gap:6,alignItems:"center"}}><input placeholder={t.enterLocation} value={locInput[i.id]||""} onChange={e=>setLocInput(p=>({...p,[i.id]:e.target.value}))} style={{padding:"6px 10px",border:`1px solid ${c.inputBorder}`,borderRadius:8,fontSize:12,width:160,background:c.input,color:c.text}}/><button onClick={()=>moveToStorage(i.id)} style={{padding:"6px 12px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:8,fontSize:11,cursor:"pointer",fontWeight:600,display:"flex",alignItems:"center",gap:4}}><ArrowRight size={14}/></button></div>)}{isAdmin&&<button onClick={()=>setDelModal(i.id)} style={{padding:"6px",background:"none",border:"none",cursor:"pointer",color:"#e11d48",marginLeft:4}}><Trash2 size={15}/></button>}</td></tr>))}</tbody></table></div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:48,color:c.textFaint}}>{t.noData}</div>}
      </div>
    </>
  );
}

function DistributeView({items,addItem,updateItem,addDistribution,showToast}){
  const{t,lang,profile,c}=useApp();const[scanId,setScanId]=useState("");const[distQty,setDistQty]=useState("");const[found,setFound]=useState(null);const[recipientType,setRecipientType]=useState("individual");const[familySize,setFamilySize]=useState("");const[showConfirm,setShowConfirm]=useState(false);
  const lookup=()=>{const item=items.find(i=>i.id.toLowerCase()===scanId.toLowerCase()&&i.status==="In Storage");setFound(item||"not_found");};
  const distribute=async()=>{if(!found||found==="not_found")return;setShowConfirm(false);const q=parseInt(distQty)||found.qty;if(q>found.qty){showToast(t.qtyExceeds);return;}const ppl=recipientType==="family"?parseInt(familySize)||1:1;if(q>=found.qty){await updateItem(found.id,{status:"Distributed",location:""});}else{await updateItem(found.id,{qty:found.qty-q});await addItem({id:found.id+"-D"+Date.now(),cat:found.cat,catName:found.catName,sub:found.sub,qty:q,condition:found.condition,donor:found.donor,status:"Distributed",date:new Date().toISOString().split("T")[0],notes:`Partial from ${found.id}`,urgent:false,location:""});}await addDistribution({id:`DIST-${Date.now()}`,item_id:found.id,quantity:q,distribution_type:recipientType,people_count:ppl,distributed_by:profile?.id,date:new Date().toISOString().split("T")[0],notes:""});showToast(lang==="es"?"Artículos distribuidos":"Items distributed successfully!");setScanId("");setDistQty("");setFound(null);setRecipientType("individual");setFamilySize("");};
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

function MonetaryView({monetary}){
  const{t,c}=useApp();const total=monetary.reduce((s,m)=>s+m.amount,0);const typeData=Object.entries(monetary.reduce((a,m)=>{a[m.type]=(a[m.type]||0)+m.amount;return a;},{})).map(([name,value])=>({name,value}));const card={background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`};
  return(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(360px, 1fr))",gap:20}}><div style={card}><h2 style={{margin:"0 0 20px",fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><DollarSign size={20} color="#4f46e5"/> {t.monetaryDonations}</h2><div style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",borderRadius:14,padding:24,color:"#fff",marginBottom:20}}><div style={{fontSize:13,opacity:.8}}>{t.totalMonetary}</div><div style={{fontSize:36,fontWeight:700,marginTop:4}}>${total.toLocaleString()}</div><div style={{fontSize:13,opacity:.8,marginTop:4}}>{monetary.length} {t.transactions}</div></div>{monetary.map(m=>(<div key={m.id} style={{padding:"14px 0",borderBottom:`1px solid ${c.tableRowBorder}`,display:"flex",justifyContent:"space-between",fontSize:13}}><div><b style={{color:c.text}}>${m.amount.toLocaleString()}</b> <span style={{color:c.textMuted}}>— {m.type}</span><br/><span style={{fontSize:12,color:c.textFaint}}>{m.donor} · {m.purpose}</span></div><div style={{fontSize:12,color:c.textFaint}}>{m.date}</div></div>))}</div><div style={card}><h3 style={{margin:"0 0 20px",fontSize:15,fontWeight:600,color:c.text}}>{t.byPaymentType}</h3><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={typeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,value})=>`${name}: $${value}`} fontSize={12}>{typeData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}</Pie><Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}} formatter={v=>`$${v}`}/></PieChart></ResponsiveContainer></div></div>);
}

function ReportsView({items,monetary,distributions}){
  const{t,c}=useApp();const totalRec=items.reduce((s,i)=>s+i.qty,0);const totalDist=items.filter(i=>i.status==="Distributed").reduce((s,i)=>s+i.qty,0);const totalStock=items.filter(i=>i.status==="In Storage").reduce((s,i)=>s+i.qty,0);const totalMoney=monetary.reduce((s,m)=>s+m.amount,0);const unusable=items.filter(i=>i.condition==="Unusable").reduce((s,i)=>s+i.qty,0);const donors=new Set([...items.map(i=>i.donor),...monetary.map(m=>m.donor)]).size;const pplServed=distributions.reduce((s,d)=>s+d.people_count,0);const families=distributions.filter(d=>d.distribution_type==="family").length;const individuals=distributions.filter(d=>d.distribution_type==="individual").length;
  const catBreakdown=CATEGORIES.filter(cc=>cc.code!=="MON").map(cc=>{const ci=items.filter(i=>i.cat===cc.code);return{name:cc.name,received:ci.reduce((s,i)=>s+i.qty,0),distributed:ci.filter(i=>i.status==="Distributed").reduce((s,i)=>s+i.qty,0)};}).filter(d=>d.received>0);
  const downloadExcel=()=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(items.map(i=>({ID:i.id,Category:i.catName,Subcategory:i.sub,Quantity:i.qty,Condition:i.condition,Donor:i.donor,Status:i.status,Location:i.location,Date:i.date,Notes:i.notes,Urgent:i.urgent?"Yes":"No"}))),"Items");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(monetary.map(m=>({ID:m.id,Amount:m.amount,Type:m.type,Donor:m.donor,Date:m.date,Purpose:m.purpose,Notes:m.notes}))),"Monetary");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(distributions.map(d=>({ID:d.id,ItemID:d.item_id,Quantity:d.quantity,Type:d.distribution_type,PeopleServed:d.people_count,Date:d.date}))),"Distributions");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet([{Metric:"Total Items Received",Value:totalRec},{Metric:"Total Distributed",Value:totalDist},{Metric:"In Stock",Value:totalStock},{Metric:"Monetary Total",Value:`$${totalMoney}`},{Metric:"Unique Donors",Value:donors},{Metric:"People Served",Value:pplServed},{Metric:"Families Served",Value:families},{Metric:"Distribution Rate",Value:totalRec?`${Math.round(totalDist/totalRec*100)}%`:"0%"}]),"Summary");XLSX.writeFile(wb,`NGO_Report_${new Date().toISOString().split("T")[0]}.xlsx`);};
  const stats=[{l:t.itemsReceived,v:totalRec},{l:t.itemsDistributed,v:totalDist},{l:t.currentlyInStock,v:totalStock},{l:t.monetaryReceived,v:`$${totalMoney.toLocaleString()}`},{l:t.uniqueDonors,v:donors},{l:t.distributionRate,v:totalRec?`${Math.round(totalDist/totalRec*100)}%`:"0%"},{l:t.totalPeopleServed,v:pplServed},{l:t.familiesServed,v:families},{l:t.individualsServed,v:individuals}];
  return(<div style={{background:c.card,borderRadius:14,padding:28,boxShadow:`0 1px 3px ${c.cardBorder}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:24}}><h2 style={{margin:0,fontSize:18,fontWeight:700,color:c.text,display:"flex",alignItems:"center",gap:10}}><FileText size={20} color="#4f46e5"/> {t.yearEndReport}</h2><div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:12,color:c.textFaint}}>{t.generated}: {new Date().toLocaleDateString()}</span><button onClick={downloadExcel} style={{padding:"9px 18px",background:"#4f46e5",color:"#fff",border:"none",borderRadius:10,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Download size={16}/> {t.downloadExcel}</button></div></div><div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:14,padding:28,color:"#fff",marginBottom:24}}><h3 style={{margin:"0 0 18px",fontSize:16,fontWeight:600}}>{t.executiveSummary}</h3><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(120px, 1fr))",gap:12}}>{stats.map((s,i)=><div key={i} style={{background:"rgba(255,255,255,.08)",borderRadius:10,padding:"14px 12px"}}><div style={{fontSize:22,fontWeight:700}}>{s.v}</div><div style={{fontSize:11,opacity:.7,marginTop:4}}>{s.l}</div></div>)}</div></div><h3 style={{fontSize:15,fontWeight:600,color:c.text,margin:"0 0 14px"}}>{t.catBreakdown}</h3><ResponsiveContainer width="100%" height={260}><BarChart data={catBreakdown}><CartesianGrid strokeDasharray="3 3" stroke={c.tableRowBorder}/><XAxis dataKey="name" fontSize={11} tick={{fill:c.textMuted}}/><YAxis fontSize={11} tick={{fill:c.textMuted}}/><Tooltip contentStyle={{background:c.card,border:`1px solid ${c.inputBorder}`,borderRadius:8,color:c.text}}/><Legend/><Bar dataKey="received" fill="#6366f1" name={t.received} radius={[6,6,0,0]}/><Bar dataKey="distributed" fill="#10b981" name={t.distributed} radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>{unusable>0&&<div style={{background:c.urgentBg,borderRadius:10,padding:14,marginTop:16,fontSize:13,color:"#991b1b",display:"flex",alignItems:"center",gap:8}}><AlertTriangle size={16}/> <b>{unusable}</b> {t.unusableWarning}</div>}<div style={{marginTop:24,padding:16,background:c.confirmBg,borderRadius:10,fontSize:12,color:c.textFaint,textAlign:"center"}}>{t.reportNote}</div></div>);
}

export default function App(){
  const[session,setSession]=useState(null);const[profile,setProfile]=useState(null);const[lang,setLang]=useState("en");
  const[dark,setDark]=useState(()=>{try{return localStorage.getItem("ngo-dark")==="true";}catch(e){return false;}});
  const[page,setPage]=useState("dashboard");const[items,setItems]=useState([]);const[monetary,setMonetary]=useState([]);
  const[distributions,setDistributions]=useState([]);const[loading,setLoading]=useState(true);const[toast,setToast]=useState(null);
  const[showTutorial,setShowTutorial]=useState(false);const[sidebarOpen,setSidebarOpen]=useState(false);
  const t=T[lang];const c=dark?DARK:LIGHT;const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500);};
  const toggleDark=()=>{setDark(p=>{const n=!p;try{localStorage.setItem("ngo-dark",n);}catch(e){}return n;});};

  useEffect(()=>{supabase.auth.getSession().then(({data:{session}})=>setSession(session));const{data:{subscription}}=supabase.auth.onAuthStateChange((_,session)=>setSession(session));return()=>subscription.unsubscribe();},[]);
  useEffect(()=>{if(!session?.user){setProfile(null);setLoading(false);return;}const lp=async()=>{const{data}=await supabase.from("profiles").select("*").eq("id",session.user.id).single();if(data){setProfile(data);setLang(data.language||"en");if(!data.tutorial_completed)setShowTutorial(true);}setLoading(false);};lp();},[session]);
  const fetchData=useCallback(async()=>{if(!session)return;const[iR,mR,dR]=await Promise.all([supabase.from("items").select("*").eq("deleted",false).order("created_at",{ascending:false}),supabase.from("monetary").select("*").eq("deleted",false).order("created_at",{ascending:false}),supabase.from("distributions").select("*").order("created_at",{ascending:false})]);setItems((iR.data||[]).map(r=>({id:r.id,cat:r.category,catName:r.category_name,sub:r.subcategory,qty:r.quantity,condition:r.condition,donor:r.donor,status:r.status,date:r.date,notes:r.notes||"",urgent:r.urgent||false,location:r.location||"",created_by:r.created_by})));setMonetary((mR.data||[]).map(r=>({id:r.id,amount:parseFloat(r.amount),type:r.type,donor:r.donor,date:r.date,purpose:r.purpose||"General Fund",notes:r.notes||""})));setDistributions(dR.data||[]);},[session]);
  useEffect(()=>{if(session)fetchData();},[session,fetchData]);
  useEffect(()=>{if(!session)return;const ch=supabase.channel("all-changes").on("postgres_changes",{event:"*",schema:"public",table:"items"},()=>fetchData()).on("postgres_changes",{event:"*",schema:"public",table:"monetary"},()=>fetchData()).on("postgres_changes",{event:"*",schema:"public",table:"distributions"},()=>fetchData()).subscribe();return()=>supabase.removeChannel(ch);},[session,fetchData]);

  const addItem=async(e)=>{const{error}=await supabase.from("items").insert({id:e.id,category:e.cat,category_name:e.catName,subcategory:e.sub,quantity:e.qty,condition:e.condition,donor:e.donor,status:e.status,date:e.date,notes:e.notes,urgent:e.urgent,location:e.location,created_by:profile?.id});if(error){showToast("Error");return false;}return true;};
  const updateItem=async(id,u)=>{const d={};if(u.status!==undefined)d.status=u.status;if(u.location!==undefined)d.location=u.location;if(u.qty!==undefined)d.quantity=u.qty;const{error}=await supabase.from("items").update(d).eq("id",id);if(error){showToast("Error");return false;}return true;};
  const deleteItem=async(id)=>{await supabase.from("items").update({deleted:true}).eq("id",id);};
  const addMonetary=async(e)=>{const{error}=await supabase.from("monetary").insert({id:e.id,amount:e.amount,type:e.type,donor:e.donor,date:e.date,purpose:e.purpose,notes:e.notes,created_by:profile?.id});if(error){showToast("Error");return false;}return true;};
  const addDistribution=async(e)=>{await supabase.from("distributions").insert(e);};
  const completeTutorial=async()=>{setShowTutorial(false);if(profile)await supabase.from("profiles").update({tutorial_completed:true}).eq("id",profile.id);};
  const toggleLang=async()=>{const nl=lang==="en"?"es":"en";setLang(nl);if(profile)await supabase.from("profiles").update({language:nl}).eq("id",profile.id);};
  const signOut=async()=>{await supabase.auth.signOut();setSession(null);setProfile(null);};

  const role=profile?.role||"reception";
  const navItems=[{id:"dashboard",icon:<BarChart3 size={20}/>,label:t.dashboard,roles:["admin"]},{id:"receive",icon:<Package size={20}/>,label:t.receive,roles:["reception","admin"]},{id:"inventory",icon:<Warehouse size={20}/>,label:t.inventory,roles:["inventory","admin"]},{id:"distribute",icon:<Truck size={20}/>,label:t.distribute,roles:["distribution","admin"]},{id:"monetary",icon:<DollarSign size={20}/>,label:t.monetary,roles:["reception","admin"]},{id:"reports",icon:<FileText size={20}/>,label:t.reports,roles:["admin"]}].filter(n=>n.roles.includes(role));
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
          <div style={{padding:"20px 20px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:"#4f46e5",display:"flex",alignItems:"center",justifyContent:"center"}}><Package size={18} color="#fff"/></div><div><div style={{fontSize:15,fontWeight:700,color:"#fff"}}>NGO Inventory</div><div style={{fontSize:11,color:"#64748b"}}>v2.0</div></div></div></div>
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
            {page==="dashboard"&&<Dashboard items={items} monetary={monetary} distributions={distributions}/>}
            {page==="receive"&&<ReceiveForm items={items} monetary={monetary} addItem={addItem} addMonetary={addMonetary} showToast={showToast}/>}
            {page==="inventory"&&<InventoryView items={items} updateItem={updateItem} deleteItem={deleteItem} showToast={showToast}/>}
            {page==="distribute"&&<DistributeView items={items} addItem={addItem} updateItem={updateItem} addDistribution={addDistribution} showToast={showToast}/>}
            {page==="monetary"&&<MonetaryView monetary={monetary}/>}
            {page==="reports"&&<ReportsView items={items} monetary={monetary} distributions={distributions}/>}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}