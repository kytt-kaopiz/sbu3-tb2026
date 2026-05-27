import { useState, useEffect } from "react";

const STORAGE_KEY = "tb2026_registrations";
const ADMIN_PASS = "sbu3btc2026";

const HIGHLIGHTS = [
  { value: "games", label: "Team Building & Trò chơi ngoài trời" },
  { value: "bbq", label: "BBQ & Gala Dinner lửa trại" },
  { value: "photo", label: "Chụp ảnh concept check-in" },
  { value: "relax", label: "Thư giãn, xả stress & thiên nhiên" },
  { value: "bond", label: "Kết thân thêm với đồng đội" },
];

const DEPARTMENTS = [
  "Dev / Engineering","QA / Testing","BA / Product",
  "Design / UX","PM / Scrum Master","Sale / Presale","HR / Admin","Khác"
];

const css = `
  /* System fonts - Calibri */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes rise {
    0%   { transform: translateY(0) scale(1); opacity: 0.9; }
    100% { transform: translateY(-110vh) scale(0); opacity: 0; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    from { transform: scale(0.7); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  @keyframes glow {
    0%,100% { box-shadow: 0 0 0 0 rgba(41,182,246,0.5); }
    50%      { box-shadow: 0 0 0 14px rgba(41,182,246,0); }
  }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
  input:focus, textarea:focus, select:focus {
    border-color: #29B6F6 !important; box-shadow: 0 0 0 3px rgba(41,182,246,0.2);
    background: rgba(41,182,246,0.07) !important;
    box-shadow: 0 0 0 3px rgba(41,182,246,0.15) !important;
    outline: none;
  }
  select option { background: #0B3D5E; color: #FFF8EE; }
  .btn-hover:hover { opacity: 0.85; transform: translateY(-1px); }
`;

// ── PARTICLES ────────────────────────────────────────────────────────
function Particles() {
  const sparks = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 2 + Math.random() * 3.5,
    dur: 4 + Math.random() * 6,
    delay: Math.random() * 6,
    color: ["#29B6F6","#FFB800","#4FC3F7","#81D4FA","#B3E5FC"][Math.floor(Math.random() * 5)],
  }));
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
      {sparks.map(s => (
        <div key={s.id} style={{
          position:"absolute", bottom:-10, left:s.left+"%",
          width:s.size, height:s.size, borderRadius:"50%", background:s.color,
          animation:"rise "+s.dur+"s "+s.delay+"s linear infinite",
        }} />
      ))}
    </div>
  );
}

function MetaChip({ icon, label, value }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:100, padding:"10px 22px" }}>
      <span style={{fontSize:20}}>{icon}</span>
      <div>
        <div style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)"}}>{label}</div>
        <div style={{fontSize:13,fontWeight:600,color:"#FFF8EE"}}>{value}</div>
      </div>
    </div>
  );
}

function InfoCard({ emoji, title, desc }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:14, padding:28 }}>
      <div style={{fontSize:36,marginBottom:14}}>{emoji}</div>
      <div style={{fontWeight:800,fontSize:17,color:"#FFB800",marginBottom:8}}>{title}</div>
      <div style={{fontSize:14,lineHeight:1.65,color:"rgba(255,248,238,0.82)"}}>{desc}</div>
    </div>
  );
}

function TItem({ time, title, desc }) {
  return (
    <div style={{display:"flex",gap:14,marginBottom:18}}>
      <div style={{fontSize:11,fontWeight:700,color:"#FFB800",minWidth:100,paddingTop:2}}>{time}</div>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:"#FFF8EE",marginBottom:2}}>{title}</div>
        <div style={{fontSize:13,color:"rgba(255,248,238,0.7)",lineHeight:1.5}}>{desc}</div>
      </div>
    </div>
  );
}

function FLabel({ text, req, error }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
      <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:error?"#FF6B6B":"rgba(255,248,238,0.55)",transition:"color 0.2s"}}>
        {text} {req && <span style={{color:error?"#FF6B6B":"#29B6F6"}}>*</span>}
      </span>
      {error && <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,color:"#FF6B6B"}}>⚠ {error}</span>}
    </div>
  );
}

function Radio({ value, label, selected, onSelect }) {
  return (
    <div onClick={() => onSelect(value)} style={{
      display:"flex", alignItems:"center", gap:10, padding:"11px 18px",
      background: selected ? "rgba(41,182,246,0.15)" : "rgba(255,255,255,0.05)",
      border:"1px solid "+(selected ? "#29B6F6" : "rgba(255,255,255,0.1)"),
      borderRadius:8, cursor:"pointer", userSelect:"none",
      color: selected ? "#FFB800" : "rgba(255,248,238,0.85)", fontSize:14, transition:"all 0.2s",
    }}>
      <div style={{
        width:15, height:15, borderRadius:"50%", flexShrink:0,
        border:"2px solid "+(selected ? "#29B6F6" : "rgba(255,255,255,0.3)"),
        background: selected ? "#29B6F6" : "transparent", transition:"all 0.2s",
      }} />
      {label}
    </div>
  );
}

function Check({ value, label, checked, onToggle }) {
  return (
    <div onClick={() => onToggle(value)} style={{
      display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
      background: checked ? "rgba(255,184,0,0.1)" : "rgba(255,255,255,0.04)",
      border:"1px solid "+(checked ? "#FFB800" : "rgba(255,255,255,0.08)"),
      borderRadius:8, cursor:"pointer", userSelect:"none", transition:"all 0.2s",
    }}>
      <div style={{
        width:15, height:15, borderRadius:4, flexShrink:0,
        border:"2px solid "+(checked ? "#FFB800" : "rgba(255,255,255,0.3)"),
        background: checked ? "#FFB800" : "transparent", transition:"all 0.2s",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        {checked && <span style={{color:"white",fontSize:10,fontWeight:900,lineHeight:1}}>v</span>}
      </div>
      <span style={{fontSize:14,color:"rgba(255,248,238,0.85)"}}>{label}</span>
    </div>
  );
}

// ── COUNTDOWN TICKER ────────────────────────────────────────────────
function CountdownTicker() {
  const [now, setNow] = useState(new Date());
  useEffect(()=>{
    const t = setInterval(()=>setNow(new Date()), 1000);
    return ()=>clearInterval(t);
  },[]);
  const target = new Date("2026-06-27T08:30:00");
  const diff = target - now;
  if(diff <= 0) return null;
  const days  = Math.floor(diff/86400000);
  const hours = Math.floor((diff%86400000)/3600000);
  const mins  = Math.floor((diff%3600000)/60000);
  const secs  = Math.floor((diff%60000)/1000);
  const items = [{v:days,l:"Ngày"},{v:hours,l:"Giờ"},{v:mins,l:"Phút"},{v:secs,l:"Giây"}];
  return (
    <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
      {items.map(({v,l})=>(
        <div key={l} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(77,208,225,0.25)",borderRadius:16,padding:"24px 32px",minWidth:100}}>
          <div style={{fontFamily:"Calibri,sans-serif",fontWeight:900,fontSize:"clamp(36px,6vw,72px)",color:"#4DD0E1",lineHeight:1}}>{String(v).padStart(2,"0")}</div>
          <div style={{fontSize:12,color:"rgba(255,248,238,0.45)",letterSpacing:"0.2em",textTransform:"uppercase",marginTop:8}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ── FAQ LIST ─────────────────────────────────────────────────────────
const FAQS = [
  {q:"Chi phí tham gia là bao nhiêu?", a:"SBU tài trợ đa số chuyến đi. Chi phí đóng góp mỗi người:\n• Giám đốc / Phó Giám đốc: 1.000.000đ\n• DM: 500.000đ\n• TL / PM / BrSE: 300.000đ\n• Member: 200.000đ\n• Intern: 100.000đ\n• Người thân (người lớn & trẻ em trên 5 tuổi): 1.000.000đ\n• Trẻ em dưới 5 tuổi: Free 🎉"},
  {q:"Có cần mang theo đồ gì không?", a:"Quần áo thoải mái cho hoạt động ngoài trời, đồ bơi/tắm, kem chống nắng, thuốc cá nhân nếu cần. Còn lại đã có BTC lo ❤️"},
  {q:"Ở lại đêm có bắt buộc không?", a:"Không bắt buộc, nhưng recommend ở lại full 2 ngày để trải nghiệm Gala Dinner & Lửa trại — đây là phần không thể bỏ lỡ!"},
  {q:"Đăng ký deadline khi nào?", a:"Deadline đăng ký là 17h30 ngày 05/06/2026. Sau deadline BTC sẽ không thể đảm bảo slot xe và chỗ ở nên anh em đăng ký sớm nhé!"},
  {q:"Có thể đăng ký cho người thân đi cùng không?", a:"Thoải mái! Người thân của thành viên SBU3 cũng sẽ là member của SBU3 ❤️ Các case gia đình muốn ở riêng có thể liên hệ BTC."},
  {q:"Liên hệ BTC qua đâu nếu có thắc mắc?", a:"Nhắn trực tiếp qua Teams cho KyTT (Phụ trách tổng) hoặc PhuongNT (Mama tổng quản). Mọi thắc mắc sẽ được giải đáp trong vòng 24h."},
];

function FaqList() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {FAQS.map((f,i)=>(
        <div key={i} onClick={()=>setOpen(open===i?null:i)}
          style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(77,208,225,"+(open===i?"0.4":"0.12")+")",
            borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"all 0.2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",gap:16}}>
            <div style={{fontWeight:700,fontSize:15,color: open===i ? "#4DD0E1" : "#FFF8EE"}}>{f.q}</div>
            <div style={{color:"#4DD0E1",fontSize:20,flexShrink:0,transition:"transform 0.2s",transform:open===i?"rotate(45deg)":"rotate(0deg)"}}>+</div>
          </div>
          {open===i && (
            <div style={{padding:"0 24px 20px",fontSize:14,color:"rgba(255,248,238,0.65)",lineHeight:1.7}}>{ f.a.split("\n").map((line,i)=><div key={i}>{line}</div>) }</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── PAID LIST ────────────────────────────────────────────────────────
function PaidList() {
  const [rows, setRows] = useState(null);
  const load = () => fetch("/api/registrations").then(r=>r.json()).then(data=>setRows(data||[])).catch(()=>setRows([]));
  useEffect(()=>{
    load();
    const t = setInterval(load, 30000);
    return ()=>clearInterval(t);
  },[]);
  if (!rows || rows.length === 0) return null;
  const ATTEND_MAP = {yes:"✅ Đi"};
  return (
    <div style={{marginTop:52}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:8}}>Danh sách đăng ký</div>
        <h3 style={{fontFamily:"Calibri,sans-serif",fontWeight:900,fontSize:28,color:"#FFF8EE",margin:0}}>
          👥 {rows.length} CHIẾN BINH ĐÃ SẴN SÀNG
        </h3>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {rows.map((r,i)=>(
          <div key={r.id} style={{
            display:"flex",alignItems:"center",gap:12,
            padding:"12px 16px",borderRadius:10,
            background: r.paid ? "rgba(41,182,246,0.1)" : "rgba(255,255,255,0.04)",
            border:"1px solid "+(r.paid ? "rgba(77,208,225,0.35)" : "rgba(255,255,255,0.08)"),
          }}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#29B6F6,#0288D1)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"white",flexShrink:0}}>
              {i+1}
            </div>
            <div style={{minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:"#FFF8EE",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.fullname}</div>
              <div style={{fontSize:11,marginTop:2,color: r.paid ? "#4DD0E1" : "rgba(255,248,238,0.35)"}}>
                {r.paid ? "✅ Đã đóng tiền" : "⏳ Chưa đóng"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FORM PAGE ────────────────────────────────────────────────────────
function FormPage({ onSuccess }) {
  const [form, setForm] = useState({
    fullname:"", nickname:"", email:"", phone:"",
    department:"", attend:"", overnight:"", hasGuests:"", guests:"", hasGuests:"", guests:"",
    highlights:[], notes:"", message:"",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({...f,[k]:v})); setErrors(e => ({...e,[k]:""})); };
  const toggleHL = v => set("highlights", form.highlights.includes(v) ? form.highlights.filter(x => x!==v) : [...form.highlights, v]);

  const validate = () => {
    const e = {};
    const name = form.fullname.trim();
    if (!name) e.fullname = "Bắt buộc";
    else if (name.length < 2) e.fullname = "Tên quá ngắn";
    else if (/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(name)) e.fullname = "Tên không hợp lệ";
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!form.email.trim()) e.email = "Bắt buộc";
    else if (!emailReg.test(form.email.trim())) e.email = "Email không đúng định dạng";
    const phone = form.phone.trim().replace(/\s/g,"");
    if (!phone) e.phone = "Bắt buộc";
    else if (!/^0\d{9}$/.test(phone)) e.phone = "SĐT phải 10 số, bắt đầu bằng 0";
    if (!form.attend) e.attend = "Chưa chọn";
    return e;
  };

  const validateField = (k, v) => {
    const val = typeof v === "string" ? v.trim() : v;
    if (k === "fullname") {
      if (!val) return "Bắt buộc";
      if (val.length < 2) return "Tên quá ngắn";
      if (val.length > 50) return "Tên tối đa 50 ký tự";
      if (/[0-9!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(val)) return "Tên không hợp lệ";
    }
    if (k === "email") {
      if (!val) return "Bắt buộc";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return "Email không đúng định dạng";
    }
    if (k === "phone") {
      const p = (v||"").trim().replace(/\s/g,"");
      if (!p) return "Bắt buộc";
      if (!/^0\d{9}$/.test(p)) return "SĐT phải 10 số, bắt đầu bằng 0";
    }
    return "";
  };

  const blur = async (k) => {
    let err = validateField(k, form[k]);
    if (!err && (k === "email" || k === "phone")) {
      try {
        const res = await fetch("/api/registrations");
        const existing = await res.json();
        const val = form[k].trim().toLowerCase();
        const dup = existing.find(r => 
          k === "email" ? r.email?.toLowerCase() === val : r.phone?.replace(/\s/g,"") === val.replace(/\s/g,"")
        );
        if (dup) err = k === "email" ? "Email này đã đăng ký rồi!" : "SĐT này đã đăng ký rồi!";
      } catch(_) {}
    }
    setErrors(e => ({...e, [k]: err}));
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      let existing = [];
      try { const r = await fetch("/api/registrations"); existing = await r.json(); } catch(_) {}
      const entry = {
        id: Date.now(),
        time: new Date().toLocaleString("vi-VN"),
        fullname: form.fullname, nickname: form.nickname,
        email: form.email, phone: form.phone, department: form.department,
        attend: form.attend, overnight: form.overnight, hasGuests: form.hasGuests, guests: form.guests, hasGuests: form.hasGuests, guests: form.guests,
        highlights: form.highlights.join(", "), notes: form.notes, message: form.message,
      };
      await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      onSuccess(form.fullname);
    } catch(err) {
      alert("Lỗi lưu dữ liệu, thử lại nhé!");
    }
    setLoading(false);
  };

  const iStyle = (f) => ({
    width:"100%", fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif", fontSize:15,
    padding:"13px 16px", borderRadius:8, color:"#FFF8EE",
    background: errors[f] ? "rgba(255,107,107,0.08)" : "rgba(255,255,255,0.05)",
    border:"1px solid "+(errors[f] ? "#FF6B6B" : "rgba(255,255,255,0.13)"),
    boxShadow: errors[f] ? "0 0 0 3px rgba(255,107,107,0.15)" : "none",
    outline:"none", transition:"all 0.2s",
  });

  return (
    <div style={{background:"linear-gradient(180deg,#0B3D5E 0%,#0A4A6E 100%)",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",minHeight:"100vh"}}>
      <style>{css}</style>

      {/* HERO */}
      <div style={{
        minHeight:"100vh", position:"relative", display:"flex", flexDirection:"column",
        justifyContent:"center", alignItems:"center", textAlign:"center", padding:"60px 20px 50px",
        background:"radial-gradient(ellipse 90% 60% at 50% 90%,rgba(77,208,225,0.35) 0%,transparent 65%),radial-gradient(ellipse 60% 45% at 10% 15%,rgba(41,182,246,0.3) 0%,transparent 55%),linear-gradient(180deg,#0B3D5E 0%,#082F4A 100%)",
      }}>
        <Particles />
        <div style={{position:"relative",animation:"fadeUp 0.7s 0.1s both"}}>
          <div style={{fontSize:12,fontWeight:800,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:20}}>
            SBU3 — Team Building 2026
          </div>
          <h1 style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:"clamp(56px,11vw,140px)",lineHeight:0.95}}>
            <span style={{display:"block",color:"#FFF8EE"}}>TRẠM SẠC</span>
            <span style={{display:"block",color:"#29B6F6",filter:"drop-shadow(0 0 30px rgba(41,182,246,0.7))"}}>NĂNG</span>
            <span style={{display:"block",color:"#4DD0E1",fontSize:"65%"}}>LƯỢNG ⚡</span>
          </h1>
          <p style={{marginTop:24,fontSize:"clamp(13px,1.8vw,17px)",color:"rgba(255,248,238,0.7)",letterSpacing:"0.1em"}}>
            "Năng lượng mới — Tinh thần mới — SBU3 bứt phá!"
          </p>
        </div>
        <div style={{display:"flex",gap:14,marginTop:44,flexWrap:"wrap",justifyContent:"center",position:"relative",animation:"fadeUp 0.7s 0.3s both"}}>
          <MetaChip icon="📅" label="Thời gian" value="27–28/06/2026" />
          <MetaChip icon="🏕️" label="Địa điểm" value="Sơn Tinh Camp, Ba Vì" />
          <MetaChip icon="👥" label="Quy mô" value="Toàn bộ SBU3" />
        </div>
        <button
          onClick={() => document.getElementById("reg-form").scrollIntoView({behavior:"smooth"})}
          style={{
            marginTop:48, background:"linear-gradient(135deg,#29B6F6,#00BCD4)", color:"white",
            fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900, fontSize:22, letterSpacing:"0.12em",
            padding:"17px 52px", border:"none", borderRadius:4, cursor:"pointer",
            position:"relative", animation:"fadeUp 0.7s 0.5s both, glow 2s 2.5s infinite",
            transition:"all 0.2s",
          }}
        >
          ĐÃ SẴN SÀNG — ĐĂNG KÝ NGAY
        </button>
      </div>

      {/* COUNTDOWN */}
      <div style={{background:"linear-gradient(135deg,#071E30 0%,#0A2E48 100%)",padding:"56px 32px",borderTop:"1px solid rgba(77,208,225,0.1)"}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center"}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:12}}>Đếm ngược</div>
          <h2 style={{fontFamily:"Calibri,sans-serif",fontWeight:900,fontSize:"clamp(28px,4vw,48px)",marginBottom:40,color:"#FFF8EE"}}>
            ⚡ NGÀY LÊN ĐƯỜNG
          </h2>
          <CountdownTicker />
        </div>
      </div>

      {/* INFO */}
      <div style={{background:"linear-gradient(135deg,#0E4D75 0%,#0B5E8A 100%)",padding:"72px 32px"}}>
        <div style={{maxWidth:1040,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:14,fontWeight:700}}>Tổng quan sự kiện</div>
          <h2 style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:"clamp(34px,6vw,68px)",lineHeight:1,marginBottom:44}}>MỌI THỨ BẠN<br />CẦN BIẾT</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20}}>
            <InfoCard emoji="🎯" title="Mục tiêu" desc="Tái tạo năng lượng và động lực làm việc sau giai đoạn release căng thẳng. Xây dựng văn hóa đơn vị qua các hoạt động trải nghiệm thực tế và tự túc." />
            <InfoCard emoji="📍" title="Địa điểm" desc="Sơn Tinh Camp, Đồng Mô, Ba Vì, Hà Nội — thiên nhiên xanh mát, sông hồ thoáng đãng." />
            <InfoCard emoji="🚌" title="Di chuyển" desc="Xe 29 & 45 chỗ đưa đón toàn đội. Tập trung tại đơn vị lúc 8:30 sáng ngày 27/06." />
            <InfoCard emoji="🔥" title="Hoạt động hot" desc="Team Building ngoài trời, BBQ Gala Dinner, Lửa trại, Trò chơi gắn kết, Trao giải thưởng." />
            <InfoCard emoji="🍖" title="Ẩm thực" desc="3 bữa ăn chính ngon–rẻ–đủ đô. Menu BBQ tối là highlight quan trọng nhất!" />
            <InfoCard emoji="🏆" title="Giải thưởng" desc="Quà tặng & vinh danh cho games. Đêm Gala là đêm của quẩy hết mình!" />
          </div>
        </div>
      </div>

      {/* AGENDA */}
      <div style={{background:"linear-gradient(135deg,#0B3D5E 0%,#0D4A70 100%)",padding:"72px 32px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:14,fontWeight:700,textAlign:"center"}}>Lịch trình</div>
          <h2 style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:"clamp(34px,6vw,68px)",lineHeight:1,marginBottom:48,textAlign:"center"}}>48 GIỜ<br />KHÔNG LÃNG PHÍ</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:40}}>
            <div>
              <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:28,color:"#29B6F6",paddingBottom:12,marginBottom:18,borderBottom:"2px solid rgba(41,182,246,0.3)"}}>Ngày 1 — 27/06</div>
              <TItem time="08:15–08:30" title="Tập trung & Khởi hành" desc="Tập hợp đội hình, lên xe xuất phát" />
              <TItem time="10:00–11:00" title="Nghỉ ngơi, sắp xếp đồ đạc" desc="Nhận phòng, sắp xếp đồ đạc, làm quen không gian" />
              <TItem time="11:00–13:30" title="Ăn trưa" desc="Bữa trưa tại khu ẩm thực Sơn Tinh Camp" />
              <TItem time="14:00–16:00" title="Chơi game TBD" desc="Hoạt động team building ngoài trời, trò chơi gắn kết" />
              <TItem time="16:00–18:30" title="Nghỉ ngơi, tắm rửa" desc="Thư giãn, tắm rửa, chuẩn bị cho buổi tối" />
              <TItem time="18:30–21:30" title="Gala Dinner & Lửa trại" desc="BBQ — Quẩy — Trao giải (HOT NHẤT!)" />
            </div>
            <div>
              <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:28,color:"#29B6F6",paddingBottom:12,marginBottom:18,borderBottom:"2px solid rgba(41,182,246,0.3)"}}>Ngày 2 — 28/06</div>
              <TItem time="08:00–09:00" title="Ăn sáng" desc="Bữa sáng nhẹ nhàng, hít thở không khí trong lành" />
              <TItem time="09:30–11:00" title="Kết thúc & Về Hà Nội" desc="Thu dọn đồ đạc, lên xe, kết thúc hành trình đáng nhớ!" />
            </div>
          </div>
        </div>
      </div>

      {/* BẢN ĐỒ */}
      <div style={{background:"linear-gradient(135deg,#082840 0%,#0A3A58 100%)",padding:"72px 32px"}}>
        <div style={{maxWidth:1040,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:12}}>Địa điểm</div>
            <h2 style={{fontFamily:"Calibri,sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,56px)",marginBottom:8,color:"#FFF8EE"}}>🗺️ SƠN TINH CAMP</h2>
            <p style={{color:"rgba(255,248,238,0.5)",fontSize:14}}>Km 15, đường Tản Viên, xã Minh Quang, Ba Vì, Hà Nội</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            <div style={{borderRadius:16,overflow:"hidden",height:340,boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.123456789!2d105.3661!3d21.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134f123456789ab%3A0x123456789abcdef0!2zU8ahbiBUaW5oIENhbXA!5e0!3m2!1svi!2svn!4v1234567890"
                width="100%" height="100%" style={{border:0,display:"block"}} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:16,justifyContent:"center"}}>
              {[
                {icon:"📍",title:"Địa chỉ",desc:"Km 15, đường Tản Viên, xã Minh Quang, Ba Vì, Hà Nội"},
                {icon:"🚌",title:"Di chuyển",desc:"Xe 29 & 45 chỗ đưa đón. Tập trung tại đơn vị lúc 8:30 sáng 27/06"},
                {icon:"⏱️",title:"Thời gian",desc:"27/06 – 28/06/2026. Đi tầm ~1 tiếng từ Kaopiz Software"},
                {icon:"🏕️",title:"Khu vực",desc:"Resort sinh thái ven hồ Cẩm Quỳ, không khí trong lành, xanh mát"},
              ].map(({icon,title,desc})=>(
                <div key={title} style={{display:"flex",gap:16,padding:"16px 20px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(77,208,225,0.15)",borderRadius:12}}>
                  <span style={{fontSize:24,flexShrink:0}}>{icon}</span>
                  <div>
                    <div style={{fontWeight:700,color:"#4DD0E1",marginBottom:4,fontSize:14}}>{title}</div>
                    <div style={{fontSize:13,color:"rgba(255,248,238,0.6)",lineHeight:1.5}}>{desc}</div>
                  </div>
                </div>
              ))}
              <a href="https://maps.app.goo.gl/quaWGT95YCGXAHQ4A" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 28px",
                  background:"linear-gradient(135deg,#29B6F6,#0288D1)",borderRadius:40,
                  color:"white",fontWeight:700,fontSize:14,textDecoration:"none",marginTop:4}}>
                🗺️ Mở Google Maps
              </a>
            </div>
          </div>
          {/* Ảnh Sơn Tinh Camp */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginTop:28}}>
            <div style={{overflow:"hidden",borderRadius:12,height:160}}>
              <img src="https://cdn.justfly.vn/800x600/media/202401/02/1704166549-justfly-khu-cam-trai-son-tinh-camp-ba-vi-hanoi.jpg" alt="Hồ Đồng Mô"
                style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.07)"}
                onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,height:160}}>
              <img src="https://cdn.justfly.vn/800x600/media/202401/02/1704166558-justfly-khu-cam-trai-son-tinh-camp-ba-vi-hanoi5.jpg" alt="Không gian xanh"
                style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.07)"}
                onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,height:160}}>
              <img src="https://cdn.justfly.vn/800x600/media/202111/02/1635838209-khu-cam-trai-son-tinh-camp-du-lich-gan-ha-noi-3.jpg" alt="Khu vui chơi"
                style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.07)"}
                onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,height:160}}>
              <img src="https://cdn.justfly.vn/800x600/media/202401/02/1704166565-justfly-khu-cam-trai-son-tinh-camp-ba-vi-hanoi10.jpg" alt="Lửa trại"
                style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.07)"}
                onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
          </div>
        </div>
      </div>

      {/* KỶ NIỆM */}
      <div style={{background:"linear-gradient(180deg,#071E30 0%,#0A2E48 100%)",padding:"80px 32px"}}>
        <div style={{maxWidth:1040,margin:"0 auto"}}>

          {/* Header */}
          <div style={{textAlign:"center",marginBottom:52}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"6px 18px",
              background:"rgba(255,184,0,0.1)",border:"1px solid rgba(255,184,0,0.3)",
              borderRadius:40,marginBottom:20}}>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:"0.35em",textTransform:"uppercase",color:"#FFB800"}}>Kỷ niệm cùng nhau</span>
            </div>
            <h2 style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:"clamp(36px,5.5vw,72px)",lineHeight:1,
              margin:"0 0 16px",background:"linear-gradient(135deg,#fff 0%,#81D4FA 100%)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              CHUYẾN ĐI GẦN NHẤT
            </h2>
            <p style={{color:"rgba(255,248,238,0.45)",fontSize:15,marginBottom:24,maxWidth:480,margin:"0 auto 24px"}}>
              Team Building cuối năm 2025 — những khoảnh khắc không thể quên
            </p>
            <a href="https://drive.google.com/drive/folders/1WWW2woxNqTEvKI1fTY9d07VYXLOzWngV" target="_blank" rel="noopener noreferrer"
              style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 28px",
                background:"linear-gradient(135deg,rgba(41,182,246,0.2),rgba(77,208,225,0.1))",
                border:"1px solid rgba(77,208,225,0.4)",borderRadius:40,
                color:"#4DD0E1",fontSize:14,fontWeight:700,letterSpacing:"0.06em",textDecoration:"none"}}
              onMouseOver={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(41,182,246,0.35),rgba(77,208,225,0.2))";e.currentTarget.style.borderColor="rgba(77,208,225,0.8)"}}
              onMouseOut={e=>{e.currentTarget.style.background="linear-gradient(135deg,rgba(41,182,246,0.2),rgba(77,208,225,0.1))";e.currentTarget.style.borderColor="rgba(77,208,225,0.4)"}}>
              <span>📸</span> Xem toàn bộ ảnh — TBD SBU3 2025
            </a>
          </div>
          {/* Video full width */}
          <div style={{marginBottom:12,borderRadius:16,overflow:"hidden",position:"relative",paddingBottom:"56.25%",height:0}}>
            <iframe
              src="https://www.youtube.com/embed/dW0L7jYkDKg?rel=0&modestbranding=1&color=white"
              title="SBU3 Team Building 2025"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}
            />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
            <div style={{gridColumn:"span 2",gridRow:"span 2",overflow:"hidden",borderRadius:12,minHeight:280}}>
              <img src="/images/IMG_20251227_152246 (1).jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,minHeight:136}}>
              <img src="/images/IMG_0557.JPG" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,minHeight:136}}>
              <img src="/images/IMG_0617.JPG" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,minHeight:160}}>
              <img src="/images/IMG_0630.JPG" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,minHeight:160}}>
              <img src="/images/IMG_20251227_085921 (1).jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,minHeight:160}}>
              <img src="/images/IMG_20251227_162055.jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{background:"linear-gradient(180deg,#071E30 0%,#082840 100%)",padding:"72px 32px"}}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:12}}>Giải đáp</div>
            <h2 style={{fontFamily:"Calibri,sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,52px)",color:"#FFF8EE"}}>🎯 CÂU HỎI THƯỜNG GẶP</h2>
          </div>
          <FaqList />
        </div>
      </div>

      {/* ĐÓNG GÓP */}
      <div style={{background:"linear-gradient(135deg,#071E30 0%,#0A2E48 100%)",padding:"72px 32px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:12}}>Đóng góp</div>
            <h2 style={{fontFamily:"Calibri,sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,52px)",color:"#FFF8EE",marginBottom:12}}>💸 CHUYỂN KHOẢN ĐÓNG GÓP</h2>
            <p style={{color:"rgba(255,248,238,0.45)",fontSize:14,maxWidth:520,margin:"0 auto"}}>
              SBU tài trợ phần lớn — anh em đóng góp một phần nhỏ để cùng có chuyến đi xịn xò!
            </p>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"center"}}>
            {/* QR + bank info */}
            <div style={{textAlign:"center"}}>
              <div style={{display:"inline-block",background:"#1a1a2e",borderRadius:20,padding:24,boxShadow:"0 8px 40px rgba(0,0,0,0.5)"}}>
                <img src="data:image/jpeg;base64,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SY0VZQPu/KB8pHqOuec4GOgooApadpiad9rKO7G5uHuG3Y4LAcD24qp/wjkPlLH50uFvzqAPH3i5bb9Mn61sUUAczpXgmHTLi3k+2Syx2sckMUXlogKuACWKjLNwPmJ/mavxeHkHh1tDnuppoPJNuspCq6pjC9BgkDHOOcc1r0UAYcvhgXVvqEdzeTSyX9tHbzShVU/IG+YAcAncfamTeEon1GW6hunhinlE80SwxsWcYyQ7AsoOBkD8MZrfooAyP+Ech8pI/Ol+W/OoZ4+8WLbfpz9adqfh631TULC+lkkV7Jy2xSNso4IDeoDKrD3FatFAHP6t4XS5S7uYmka6af7ZCMIdsgiEe3DAghgMHPrnjAp0fhuRtOtYjeTRXMFwLtZQkfyvggrtA27cMwx+Oc1vUUAZ8mjwzajNey/vPOthaPEwBRk3MefruIrGh8BW9nBZxWl7OhtHnaN5USYhZWDEfODyMABuuOuc11NFAHP2Xg+3srCSzW5uHSTT108s2N20b/m/3v3h9uK0LbR47e/jvBI5aO1W0CnGCoOc/WtCigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=" alt="QR chuyển khoản"
                  style={{width:240,height:"auto",borderRadius:12,display:"block"}} />
              </div>
              <div style={{marginTop:20,fontWeight:700,color:"#FFF8EE",fontSize:18,letterSpacing:"0.05em"}}>VU THI MAI CHI</div>
              <div style={{fontSize:22,fontWeight:900,color:"#4DD0E1",letterSpacing:"0.1em",margin:"6px 0"}}>2153314538</div>
              <div style={{fontSize:13,color:"rgba(255,248,238,0.4)"}}>BIDV — Ngân hàng TMCP Đầu tư & Phát triển Việt Nam</div>
            </div>

            {/* Mức đóng góp + hướng dẫn */}
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{fontWeight:700,color:"#FFB800",fontSize:13,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:4}}>Mức đóng góp</div>
              {[
                ["Giám đốc / Phó GĐ","1.000.000đ"],
                ["DM","500.000đ"],
                ["TL / PM / BrSE","300.000đ"],
                ["Member","200.000đ"],
                ["Intern","100.000đ"],
                ["Người thân (người lớn & trẻ >5t)","1.000.000đ"],
                ["Trẻ em dưới 5 tuổi","Free 🎉"],
              ].map(([role,amount])=>(
                <div key={role} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"12px 18px",background:"rgba(255,255,255,0.04)",
                  border:"1px solid rgba(77,208,225,0.12)",borderRadius:10}}>
                  <span style={{fontSize:14,color:"rgba(255,248,238,0.7)"}}>{role}</span>
                  <span style={{fontWeight:700,color:"#4DD0E1",fontSize:14}}>{amount}</span>
                </div>
              ))}
              <div style={{marginTop:8,padding:"14px 18px",background:"rgba(255,184,0,0.08)",
                border:"1px solid rgba(255,184,0,0.25)",borderRadius:10,fontSize:13,
                color:"rgba(255,248,238,0.6)",lineHeight:1.6}}>
                📝 <strong style={{color:"#FFB800"}}>Nội dung CK:</strong> <span style={{fontFamily:"monospace",color:"#4DD0E1"}}>TB2026 [Họ tên]</span><br/>
                VD: <span style={{fontFamily:"monospace",color:"rgba(255,255,255,0.5)"}}>TB2026 KyTT</span>
              </div>
            </div>
          </div>

          {/* Public list đã đóng tiền */}
          <PaidList />
        </div>
      </div>

      {/* FORM */}
      <div id="reg-form" style={{background:"linear-gradient(180deg,#0D4A70 0%,#0B3D5E 100%)",padding:"72px 32px 96px",borderTop:"4px solid #4DD0E1"}}>
        <div style={{maxWidth:660,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:14,fontWeight:700}}>Đăng ký tham gia</div>
          <h2 style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:"clamp(34px,6vw,64px)",lineHeight:1,marginBottom:12}}>ĐIỀN FORM —<br />LÊN ĐƯỜNG THÔI! 🔥</h2>
          <p style={{color:"rgba(255,248,238,0.6)",fontSize:15,lineHeight:1.7,marginBottom:44}}>
            Deadline đăng ký: <strong style={{color:"#FFB800"}}>17h30 ngày 05/06/2026</strong>
          </p>

          <div style={{marginBottom:24}}>
            <FLabel text="Họ và tên" req error={errors.fullname} />
            <input value={form.fullname} onChange={e=>set("fullname",e.target.value)} onBlur={()=>blur("fullname")} placeholder="Nguyễn Văn A" maxLength={50} style={iStyle("fullname")} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
            <div>
              <FLabel text="Email" req error={errors.email} />
              <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} onBlur={()=>blur("email")} placeholder="ten@kaopiz.com" style={iStyle("email")} />
            </div>
            <div>
              <FLabel text="Số điện thoại" req error={errors.phone} />
              <input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} onBlur={()=>blur("phone")} placeholder="09xx xxx xxx" style={iStyle("phone")} />
            </div>
          </div>

          <div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)",margin:"32px 0"}} />

          <div style={{marginBottom:24}}>
            <FLabel text="Bạn có tham gia không?" req error={errors.attend} />
            <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"stretch"}}>
              <Radio value="yes" label="🔥 Tất nhiên là đi!" selected={form.attend==="yes"} onSelect={v=>set("attend",v)} />
              <div style={{padding:"11px 18px",background:"rgba(255,77,77,0.07)",border:"1px solid rgba(255,100,100,0.15)",borderRadius:8,display:"flex",alignItems:"center",gap:10,opacity:0.7}}>
                <div style={{width:15,height:15,borderRadius:"50%",flexShrink:0,border:"2px solid rgba(255,100,100,0.3)",background:"transparent"}} />
                <span style={{fontSize:14,color:"rgba(255,248,238,0.4)",fontStyle:"italic"}}>🚫 Không đi được (Không có option này)</span>
              </div>
            </div>
          </div>

          {form.attend==="yes" && (
            <div style={{marginBottom:24}}>
              <FLabel text="Bạn ở lại đêm không?" />
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <Radio value="yes" label="🏕️ Ở lại qua đêm (full 2 ngày)" selected={form.overnight==="yes"} onSelect={v=>set("overnight",v)} />
                <Radio value="no" label="🌅 Chỉ ngày 1 (về tối)" selected={form.overnight==="no"} onSelect={v=>set("overnight",v)} />
              </div>
            </div>
          )}


          <div style={{marginBottom:24}}>
            <FLabel text="Bạn có đem người thân đi cùng không?" />
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Radio value="yes" label="👨‍👩‍👧 Có, tôi sẽ đem theo người thân" selected={form.hasGuests==="yes"} onSelect={v=>set("hasGuests",v)} />
              <Radio value="no" label="🙋 Không, chỉ mình tôi thôi" selected={form.hasGuests==="no"} onSelect={v=>set("hasGuests",v)} />
            </div>
          </div>

          {form.hasGuests==="yes" && (
            <div style={{marginBottom:24,padding:"20px",background:"rgba(255,184,0,0.07)",border:"1px solid rgba(255,184,0,0.2)",borderRadius:12}}>
              <FLabel text="Danh sách người thân đi cùng" />
              <textarea value={form.guests} onChange={e=>set("guests",e.target.value)} rows={3}
                placeholder={"VD:\n- Vợ/chồng: Nguyễn Thị B (người lớn)\n- Con: Nguyễn C (5 tuổi)"}
                style={{...iStyle("guests"),resize:"vertical"}} />
              <div style={{marginTop:10,fontSize:12,color:"rgba(255,248,238,0.4)",lineHeight:1.6}}>
                💰 Người lớn & trẻ &gt;5 tuổi: <strong style={{color:"#FFB800"}}>1.000.000đ</strong> · Trẻ &lt;5 tuổi: <strong style={{color:"#4DD0E1"}}>Free</strong>
              </div>
            </div>
          )}

          <div style={{marginBottom:24}}>
            <FLabel text="Điều bạn hóng nhất?" />
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {HIGHLIGHTS.map(h => (
                <Check key={h.value} value={h.value} label={h.label} checked={form.highlights.includes(h.value)} onToggle={toggleHL} />
              ))}
            </div>
          </div>

          <div style={{marginBottom:24}}>
            <FLabel text="Dị ứng / Lưu ý đặc biệt" />
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={3}
              placeholder="VD: Không ăn hải sản, cần ghế gần cửa..." style={{...iStyle("notes"),resize:"vertical"}} />
          </div>

          <div style={{marginBottom:36}}>
            <FLabel text="Lời nhắn cho BTC 🎤" />
            <textarea value={form.message} onChange={e=>set("message",e.target.value)} rows={3}
              placeholder="Lời nhắn, yêu cầu bài hát, cổ vũ team BTC..." style={{...iStyle("message"),resize:"vertical"}} />
          </div>

          <button onClick={submit} disabled={loading} style={{
            width:"100%", background: loading ? "rgba(41,182,246,0.5)" : "linear-gradient(135deg,#29B6F6,#0288D1)",
            color:"white", fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900, fontSize:24, letterSpacing:"0.15em",
            padding:20, border:"none", borderRadius:8, cursor: loading ? "not-allowed" : "pointer", transition:"all 0.3s",
          }}>
            {loading ? "ĐANG LƯU..." : "🚀 XÁC NHẬN ĐĂNG KÝ"}
          </button>
        </div>
      </div>


      <div style={{background:"#082840",textAlign:"center",padding:"40px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",fontSize:13,color:"rgba(255,255,255,0.35)"}}>
        <div style={{fontWeight:700,color:"rgba(255,255,255,0.6)",marginBottom:16,fontSize:14}}>
          Tổ chức bởi <span style={{color:"#FFB800"}}>SBU3 — Biệt Đội Kiến Tạo Niềm Vui 2026</span>
        </div>
        <div style={{display:"inline-grid",gridTemplateColumns:"auto auto",gap:"6px 32px",textAlign:"left",marginBottom:16}}>
          <span style={{color:"rgba(255,255,255,0.4)"}}>Phụ trách tổng</span><span style={{color:"#4DD0E1"}}>KyTT</span>
          <span style={{color:"rgba(255,255,255,0.4)"}}>Finance</span><span style={{color:"#4DD0E1"}}>ChiVTM</span>
          <span style={{color:"rgba(255,255,255,0.4)"}}>Media</span><span style={{color:"#4DD0E1"}}>PhuongNT / PhucNT</span>
          <span style={{color:"rgba(255,255,255,0.4)"}}>Logistic</span><span style={{color:"#4DD0E1"}}>HungLQ / AnhHT1</span>
          <span style={{color:"rgba(255,255,255,0.4)"}}>F&amp;B</span><span style={{color:"#4DD0E1"}}>NgocNA / ThuTH / ThuyNT1</span>
        </div>
        <div style={{fontSize:11,opacity:0.4}}>Sơn Tinh Camp, Ba Vì · 27–28/06/2026</div>
      </div>
    </div>
  );
}

// ── SUCCESS ──────────────────────────────────────────────────────────
function SuccessPage({ name, onBack }) {
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B3D5E,#0E5A8A)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif"}}>
      <style>{css}</style>
      <div style={{background:"rgba(13,78,117,0.9)",border:"1px solid rgba(77,208,225,0.4)",borderRadius:24,padding:"52px 44px",textAlign:"center",maxWidth:440,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{fontSize:68,marginBottom:20}}>🎉</div>
        <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:44,color:"#FFB800",marginBottom:14}}>ĐĂNG KÝ THÀNH CÔNG!</div>
        <p style={{fontSize:16,color:"rgba(255,248,238,0.8)",lineHeight:1.75}}>
          Chào mừng chiến binh <strong style={{color:"#FFB800"}}>{name}</strong> đã chính thức gia nhập<br />
          <strong>BIỆT ĐỘI KIẾN TẠO NIỀM VUI!</strong><br /><br />
          Chuẩn bị tinh thần — <span style={{color:"#29B6F6"}}>27/06 lên đường thôi! 🔥</span>
        </p>
        <button onClick={onBack} style={{marginTop:28,padding:"12px 40px",border:"1px solid #29B6F6",borderRadius:6,color:"#29B6F6",background:"transparent",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.1em",cursor:"pointer"}}>
          Đăng ký thêm
        </button>
      </div>
    </div>
  );
}

// ── ADMIN LOGIN ──────────────────────────────────────────────────────
function AdminLogin({ onSuccess, onBack }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => { if (pw === ADMIN_PASS) onSuccess(); else { setErr(true); setPw(""); } };
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B3D5E,#0E5A8A)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif"}}>
      <style>{css}</style>
      <div style={{background:"rgba(13,78,117,0.9)",border:"1px solid rgba(77,208,225,0.4)",borderRadius:20,padding:"44px 40px",maxWidth:360,width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:38,color:"#FFB800",marginBottom:8}}>🔐 ADMIN</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:28}}>Chỉ dành cho BTC Team Building 2026</div>
        <input type="password" placeholder="Mật khẩu BTC" value={pw}
          onChange={e=>{setPw(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{width:"100%",background:err?"rgba(41,182,246,0.1)":"rgba(255,255,255,0.07)",border:"1px solid "+(err?"#29B6F6":"rgba(255,255,255,0.15)"),borderRadius:8,padding:"13px 16px",color:"#FFF8EE",marginBottom:8,fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:15,outline:"none",textAlign:"center",letterSpacing:"0.2em"}} />
        {err && <div style={{color:"#29B6F6",fontSize:12,marginBottom:8}}>Sai mật khẩu. Thử lại nhé!</div>}
        <button onClick={submit} style={{width:"100%",marginTop:12,background:"#29B6F6",border:"none",borderRadius:8,padding:14,color:"white",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:20,letterSpacing:"0.1em",cursor:"pointer"}}>VÀO XEM DATA</button>
        <button onClick={onBack} style={{marginTop:14,background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer",textDecoration:"underline"}}>Quay lại</button>
      </div>
    </div>
  );
}

// ── ADMIN PAGE ───────────────────────────────────────────────────────
function AdminPage({ onBack }) {
  const [rows, setRows] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetch("/api/registrations")
      .then(r => r.json())
      .then(data => setRows(data || []))
      .catch(() => setRows([]));
  }, []);

  const saveRows = async (newRows) => {
    setRows(newRows);
  };

  const deleteRow = async (id) => {
    await fetch(`/api/registrations?id=${id}`, { method: "DELETE" });
    setRows(rows.filter(r => r.id !== id));
    setConfirmId(null);
    showToast("Đã xóa!");
  };

  const startEdit = (r, idx) => setEditing({ idx, data: {...r} });

  const saveEdit = async () => {
    const res = await fetch("/api/registrations", {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(editing.data),
    });
    if (res.ok) {
      setRows((rows||[]).map(r => r.id === editing.data.id ? editing.data : r));
      setEditing(null);
      showToast("✅ Đã lưu thay đổi!");
    } else {
      showToast("❌ Lỗi lưu, thử lại!");
    }
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = (rows||[]).filter(r =>
    [r.fullname,r.email,r.phone].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const aMap = { yes:"Chắc chắn đi", maybe:"Có thể đi", no:"Không đi" };
  const nMap = { yes:"Ở lại đêm", no:"Về tối" };

  const buildCSV = (data) => {
    const header = ["STT","Thời gian","Họ và tên","Tên thân mật","Email","Số điện thoại","Tham gia","Ở lại đêm","Điều hóng nhất","Dị ứng / Lưu ý","Lời nhắn BTC"];
    const body = data.map((r,i) => [
      i+1, r.time, r.fullname, r.nickname||"", r.email, r.phone,
      aMap[r.attend]||r.attend, nMap[r.overnight]||"",
      r.highlights||"", r.notes||"", r.message||"",
    ]);
    return [header,...body].map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  };

  // Tải file CSV xuống máy
  const downloadCSV = () => {
    if (!filtered.length) { showToast("Chưa có dữ liệu để xuất!"); return; }
    const bom = "\uFEFF"; // BOM để Excel đọc được tiếng Việt
    const csv = bom + buildCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DangKy_TeamBuilding2026_" + new Date().toLocaleDateString("vi-VN").replace(/\//g,"-") + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Đã tải file CSV về máy!");
  };

  // Copy vào clipboard (fallback cho iframe/artifact)
  const copyCSV = () => {
    if (!filtered.length) { showToast("Chưa có dữ liệu!"); return; }
    const content = "\uFEFF" + buildCSV(filtered);
    try {
      // Thử clipboard API trước
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(content)
          .then(() => showToast("Đã copy! Dán vào Google Sheets nhé."))
          .catch(() => fallbackCopy(content));
      } else {
        fallbackCopy(content);
      }
    } catch(_) { fallbackCopy(content); }
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    try {
      document.execCommand("copy");
      showToast("Đã copy! Dán vào Google Sheets nhé.");
    } catch(_) {
      showToast("Copy lỗi — dùng nút Tải CSV nhé.");
    }
    document.body.removeChild(ta);
  };

  const stats = {
    total:(rows||[]).length,
    yes:(rows||[]).filter(r=>r.attend==="yes").length,
    maybe:(rows||[]).filter(r=>r.attend==="maybe").length,
    night:(rows||[]).filter(r=>r.overnight==="yes").length,
  };

  const btnStyle = (bg) => ({
    padding:"10px 20px", background:bg, border:"none", borderRadius:6,
    color:"white", fontWeight:700, fontSize:13, cursor:"pointer",
    letterSpacing:"0.05em", transition:"all 0.2s", display:"flex", alignItems:"center", gap:8,
  });

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0B3D5E,#093550)",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",padding:32}}>
      <style>{css}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:24, right:24, zIndex:9999,
          background:"#0288D1", color:"white", padding:"14px 24px",
          borderRadius:10, fontWeight:600, fontSize:14,
          boxShadow:"0 8px 32px rgba(0,0,0,0.4)",
          animation:"fadeUp 0.3s ease",
        }}>{toast}</div>
      )}

      <div style={{maxWidth:1100,margin:"0 auto"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16,marginBottom:36}}>
          <div>
            <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:40,color:"#FFB800",lineHeight:1}}>ADMIN — DANH SÁCH ĐĂNG KÝ</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:4}}>Team Building 2026 · SBU3 · {(rows||[]).length} người đã đăng ký</div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <button onClick={downloadCSV} style={btnStyle("#29B6F6")} className="btn-hover">
              ⬇ Tải file CSV
            </button>
            <button onClick={copyCSV} style={btnStyle("#0288D1")} className="btn-hover">
              📋 Copy CSV
            </button>
            <button onClick={onBack} style={{...btnStyle("rgba(255,255,255,0.08)"),border:"1px solid rgba(255,255,255,0.15)"}}>
              ← Về trang đăng ký
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:32}}>
          {[
            ["👥","Tổng đăng ký",stats.total,"#FFB800"],
            ["✅","Chắc chắn đi",stats.yes,"#0288D1"],
            ["🤔","Có thể đi",stats.maybe,"#4FC3F7"],
            ["🏕️","Ở lại đêm",stats.night,"#29B6F6"],
          ].map(([icon,lbl,val,color])=>(
            <div key={lbl} style={{background:"rgba(255,255,255,0.05)",border:"1px solid "+color+"44",borderRadius:12,padding:"20px 24px",borderLeft:"4px solid "+color}}>
              <div style={{fontSize:22,marginBottom:4}}>{icon}</div>
              <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:44,color,lineHeight:1}}>{val}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <input
            placeholder="🔍  Tìm theo tên, email, SĐT..."
            value={search} onChange={e=>setSearch(e.target.value)}
            style={{flex:1,maxWidth:400,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"11px 16px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none"}}
          />
          {search && (
            <button onClick={()=>setSearch("")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer"}}>
              Xóa lọc
            </button>
          )}
        </div>

        {/* Table */}
        {rows===null ? (
          <div style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.4)"}}>⏳ Đang tải dữ liệu...</div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:60,color:"rgba(255,255,255,0.35)",background:"rgba(255,255,255,0.03)",borderRadius:12,fontSize:15}}>
            {(rows||[]).length===0
              ? "📭 Chưa có ai đăng ký. Chia sẻ link để mời mọi người!"
              : "Không tìm thấy kết quả phù hợp."}
          </div>
        ) : (
          <div style={{overflowX:"auto",borderRadius:12,border:"1px solid rgba(255,255,255,0.08)"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"rgba(14,77,117,0.8)"}}>
                  {["#","Thời gian","Họ và tên","Email","Số ĐT","Tham gia","Ở đêm","Người thân","Lưu ý","Lời nhắn","Đóng tiền",""].map(h=>(
                    <th key={h} style={{padding:"13px 16px",textAlign:"left",color:"#FFB800",fontWeight:700,letterSpacing:"0.06em",borderBottom:"2px solid rgba(255,184,0,0.3)",whiteSpace:"nowrap",fontSize:12}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r,i)=>(
                  <tr key={r.id} style={{background:i%2===0?"rgba(255,255,255,0.03)":"transparent",borderBottom:"1px solid rgba(255,255,255,0.05)",transition:"background 0.15s"}}
                    onMouseOver={e=>e.currentTarget.style.background="rgba(255,184,0,0.05)"}
                    onMouseOut={e=>e.currentTarget.style.background=i%2===0?"rgba(255,255,255,0.03)":"transparent"}
                  >
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.35)",fontWeight:700,fontSize:12}}>{i+1}</td>
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.45)",fontSize:11,whiteSpace:"nowrap"}}>{r.time}</td>
                    <td style={{padding:"12px 16px",fontWeight:700}}>
                      {r.fullname}
                      {r.nickname&&<span style={{color:"rgba(255,255,255,0.4)",fontWeight:400,marginLeft:6,fontSize:11}}>({r.nickname})</span>}
                    </td>
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.7)"}}>{r.email}</td>
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.7)",whiteSpace:"nowrap"}}>{r.phone}</td>
                    <td style={{padding:"12px 16px",whiteSpace:"nowrap"}}>
                      <span style={{
                        padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
                        background: r.attend==="yes"?"rgba(2,119,189,0.3)":r.attend==="maybe"?"rgba(255,140,66,0.3)":"rgba(41,182,246,0.3)",
                        color: r.attend==="yes"?"#6FD49A":r.attend==="maybe"?"#FFB366":"#FF7A5C",
                      }}>
                        {aMap[r.attend]||r.attend}
                      </span>
                    </td>
                    <td style={{padding:"12px 16px",whiteSpace:"nowrap",color:"rgba(255,255,255,0.6)",fontSize:12}}>{nMap[r.overnight]||"—"}</td>
                    <td style={{padding:"12px 16px",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {r.hasGuests==="yes"
                        ? <span title={r.guests} style={{color:"#FFB800",fontWeight:700,fontSize:12}}>👨‍👩‍👧 {r.guests ? r.guests.split("\n").length+"người" : "Có"}</span>
                        : <span style={{color:"rgba(255,255,255,0.3)",fontSize:12}}>—</span>}
                    </td>
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.5)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.notes}>{r.notes||"—"}</td>
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.5)",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.message}>{r.message||"—"}</td>
                    <td style={{padding:"12px 16px",whiteSpace:"nowrap",textAlign:"center"}}>
                      <button onClick={async()=>{
                        const updated = {...r, paid: !r.paid};
                        await fetch("/api/registrations", {
                          method: "PUT",
                          headers: {"Content-Type":"application/json"},
                          body: JSON.stringify(updated),
                        });
                        const newRows=(rows||[]).map(x=>x.id===r.id?updated:x);
                        setRows(newRows);
                        showToast(r.paid?"Đã bỏ xác nhận!":"✅ Đã đánh dấu đóng tiền!");
                      }} style={{
                        padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",
                        background: r.paid ? "rgba(41,182,246,0.2)" : "rgba(255,255,255,0.07)",
                        color: r.paid ? "#4DD0E1" : "rgba(255,255,255,0.35)",
                        transition:"all 0.2s"
                      }}>
                        {r.paid ? "✅ Đã đóng" : "⏳ Chưa"}
                      </button>
                    </td>
                    <td style={{padding:"12px 16px",whiteSpace:"nowrap"}}>
                      <button onClick={()=>startEdit(r,i)} style={{marginRight:6,padding:"4px 10px",background:"rgba(255,184,0,0.15)",border:"1px solid rgba(255,184,0,0.3)",borderRadius:5,color:"#FFB800",fontSize:11,cursor:"pointer",fontWeight:700}}>Sửa</button>
                      <button onClick={()=>setConfirmId(r.id)} style={{padding:"4px 10px",background:"rgba(255,100,80,0.15)",border:"1px solid rgba(255,100,80,0.3)",borderRadius:5,color:"#FF7A5C",fontSize:11,cursor:"pointer",fontWeight:700}}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>
            Hiển thị <strong style={{color:"rgba(255,255,255,0.5)"}}>{filtered.length}</strong> / {(rows||[]).length} người đăng ký
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.25)"}}>
            Nhấn "Tải file CSV" để mở bằng Excel / Google Sheets
          </div>
        </div>

      </div>

      {/* Confirm xóa */}
      {confirmId && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"linear-gradient(135deg,#0E4D75,#0B3D5E)",border:"1px solid rgba(77,208,225,0.3)",borderRadius:16,padding:"36px 40px",textAlign:"center",maxWidth:360,width:"90%"}}>
            <div style={{fontSize:36,marginBottom:16}}>🗑️</div>
            <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:26,color:"#FFF8EE",marginBottom:8}}>XÁC NHẬN XÓA</div>
            <div style={{fontSize:14,color:"rgba(255,248,238,0.6)",marginBottom:28}}>Hành động này không thể hoàn tác.</div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>deleteRow(confirmId)} style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#ef5350,#c62828)",border:"none",borderRadius:8,color:"white",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:18,letterSpacing:"0.1em",cursor:"pointer"}}>XÓA</button>
              <button onClick={()=>setConfirmId(null)} style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#FFF8EE",fontSize:14,cursor:"pointer"}}>Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa */}
      {editing && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"rgba(14,77,117,0.8)",border:"1px solid #0288D1",borderRadius:16,padding:32,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:28,color:"#FFB800",marginBottom:24}}>CHỈNH SỬA THÔNG TIN</div>
            {[
              ["Họ và tên","fullname","text"],
              ["Email","email","email"],
              ["Số điện thoại","phone","tel"],
            ].map(([lbl,key,type])=>(
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>{lbl}</div>
                <input type={type} value={editing.data[key]||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,[key]:e.target.value}}))} maxLength={key==="fullname"?50:undefined}
                  style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none"}} />
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:10}}>Đóng tiền</div>
              <div style={{display:"flex",gap:10}}>
                {[["✅ Đã đóng tiền",true],["⏳ Chưa đóng",false]].map(([lbl,val])=>(
                  <div key={lbl} onClick={()=>setEditing(ed=>({...ed,data:{...ed.data,paid:val}}))}
                    style={{flex:1,padding:"10px 14px",borderRadius:8,cursor:"pointer",textAlign:"center",fontSize:13,fontWeight:700,transition:"all 0.2s",
                      background: editing.data.paid===val ? (val?"rgba(41,182,246,0.25)":"rgba(255,107,107,0.15)") : "rgba(255,255,255,0.05)",
                      border: editing.data.paid===val ? ("1px solid "+(val?"#4DD0E1":"#FF6B6B")) : "1px solid rgba(255,255,255,0.1)",
                      color: editing.data.paid===val ? (val?"#4DD0E1":"#FF6B6B") : "rgba(255,255,255,0.4)",
                    }}>{lbl}</div>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Tham gia</div>
              <select value={editing.data.attend||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,attend:e.target.value}}))}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",appearance:"none"}}>
                <option value="yes">Chắc chắn đi</option>
                <option value="maybe">Có thể đi</option>
                <option value="no">Không đi</option>
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Ở lại đêm</div>
              <select value={editing.data.overnight||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,overnight:e.target.value}}))}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",appearance:"none"}}>
                <option value="">Chưa chọn</option>
                <option value="yes">Ở lại đêm</option>
                <option value="no">Về tối</option>
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Người thân đi cùng</div>
              <select value={editing.data.hasGuests||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,hasGuests:e.target.value}}))}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",appearance:"none",marginBottom:8}}>
                <option value="">Chưa chọn</option>
                <option value="yes">Có người thân</option>
                <option value="no">Không</option>
              </select>
              {editing.data.hasGuests==="yes" && (
                <textarea value={editing.data.guests||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,guests:e.target.value}}))} rows={3}
                  placeholder="Danh sách người thân..." style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",resize:"vertical"}} />
              )}
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Người thân đi cùng</div>
              <select value={editing.data.hasGuests||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,hasGuests:e.target.value}}))}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",appearance:"none",marginBottom:8}}>
                <option value="">Chưa chọn</option>
                <option value="yes">Có người thân</option>
                <option value="no">Không</option>
              </select>
              {editing.data.hasGuests==="yes" && (
                <textarea value={editing.data.guests||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,guests:e.target.value}}))} rows={3}
                  placeholder="Danh sách người thân..." style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",resize:"vertical"}} />
              )}
            </div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Dị ứng / Lưu ý</div>
              <textarea value={editing.data.notes||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,notes:e.target.value}}))} rows={2}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",resize:"vertical"}} />
            </div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Lời nhắn cho BTC</div>
              <textarea value={editing.data.message||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,message:e.target.value}}))} rows={2}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none",resize:"vertical"}} />
            </div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={saveEdit} style={{flex:1,padding:"12px",background:"#29B6F6",border:"none",borderRadius:8,color:"white",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:18,letterSpacing:"0.1em",cursor:"pointer"}}>LƯU LẠI</button>
              <button onClick={()=>setEditing(null)} style={{padding:"12px 24px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#FFF8EE",fontSize:14,cursor:"pointer"}}>Huỷ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("form");
  const [name, setName] = useState("");

  if (page==="success") return <SuccessPage name={name} onBack={()=>setPage("form")} />;
  if (page==="adminLogin") return <AdminLogin onSuccess={()=>setPage("admin")} onBack={()=>setPage("form")} />;
  if (page==="admin") return <AdminPage onBack={()=>setPage("form")} />;

  return (
    <div>
      <FormPage onSuccess={n=>{setName(n);setPage("success");}} />
      <div style={{position:"fixed",bottom:16,right:16,zIndex:999}}>
        <button onClick={()=>setPage("adminLogin")} style={{
          background:"rgba(0,0,0,0.75)", border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:8, color:"rgba(255,255,255,0.4)", fontSize:12,
          padding:"8px 14px", cursor:"pointer", backdropFilter:"blur(8px)",
        }}>
          🔐 BTC Admin
        </button>
      </div>
    </div>
  );
}
