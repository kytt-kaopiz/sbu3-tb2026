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
    border-color: #29B6F6 !important;
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
    <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,248,238,0.55)",marginBottom:9}}>
      {text} {req && <span style={{color:"#29B6F6"}}>*</span>}
      {error && <span style={{color:"#29B6F6",marginLeft:8,fontSize:10,textTransform:"none",fontWeight:400}}>— {error}</span>}
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

// ── FORM PAGE ────────────────────────────────────────────────────────
function FormPage({ onSuccess }) {
  const [form, setForm] = useState({
    fullname:"", nickname:"", email:"", phone:"",
    department:"", attend:"", overnight:"",
    highlights:[], notes:"", message:"",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({...f,[k]:v})); setErrors(e => ({...e,[k]:""})); };
  const toggleHL = v => set("highlights", form.highlights.includes(v) ? form.highlights.filter(x => x!==v) : [...form.highlights, v]);

  const validate = () => {
    const e = {};
    if (!form.fullname.trim()) e.fullname = "Bắt buộc";
    if (!form.email.includes("@")) e.email = "Email không hợp lệ";
    if (!form.phone.trim()) e.phone = "Bắt buộc";
    if (!form.attend) e.attend = "Chưa chọn";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      let existing = [];
      try { const r = await window.storage.get(STORAGE_KEY); existing = JSON.parse(r.value || "[]"); } catch(_) {}
      const entry = {
        id: Date.now(),
        time: new Date().toLocaleString("vi-VN"),
        fullname: form.fullname, nickname: form.nickname,
        email: form.email, phone: form.phone, department: form.department,
        attend: form.attend, overnight: form.overnight,
        highlights: form.highlights.join(", "), notes: form.notes, message: form.message,
      };
      await window.storage.set(STORAGE_KEY, JSON.stringify([...existing, entry]));
      onSuccess(form.fullname);
    } catch(err) {
      alert("Lỗi lưu dữ liệu, thử lại nhé!");
    }
    setLoading(false);
  };

  const iStyle = (f) => ({
    width:"100%", fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif", fontSize:15,
    padding:"13px 16px", borderRadius:8, color:"#FFF8EE",
    background: errors[f] ? "rgba(41,182,246,0.1)" : "rgba(255,255,255,0.05)",
    border:"1px solid "+(errors[f] ? "#29B6F6" : "rgba(255,255,255,0.13)"),
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
            <div style={{overflow:"hidden",borderRadius:12,minHeight:160}}>
              <img src="/images/IMG_3872.HEIC" alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}} onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div id="reg-form" style={{background:"linear-gradient(180deg,#0D4A70 0%,#0B3D5E 100%)",padding:"72px 32px 96px",borderTop:"4px solid #4DD0E1"}}>
        <div style={{maxWidth:660,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:14,fontWeight:700}}>Đăng ký tham gia</div>
          <h2 style={{fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontWeight:900,fontSize:"clamp(34px,6vw,64px)",lineHeight:1,marginBottom:12}}>ĐIỀN FORM —<br />LÊN ĐƯỜNG THÔI! 🔥</h2>
          <p style={{color:"rgba(255,248,238,0.6)",fontSize:15,lineHeight:1.7,marginBottom:44}}>
            Deadline đăng ký: <strong style={{color:"#FFB800"}}>20/06/2026</strong>
          </p>

          <div style={{marginBottom:24}}>
            <FLabel text="Họ và tên" req error={errors.fullname} />
            <input value={form.fullname} onChange={e=>set("fullname",e.target.value)} placeholder="Nguyễn Văn A" style={iStyle("fullname")} />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:24}}>
            <div>
              <FLabel text="Email" req error={errors.email} />
              <input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="ten@company.com" style={iStyle("email")} />
            </div>
            <div>
              <FLabel text="Số điện thoại" req error={errors.phone} />
              <input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="09xx xxx xxx" style={iStyle("phone")} />
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


      <div style={{background:"#082840",textAlign:"center",padding:"36px 24px",borderTop:"1px solid rgba(255,255,255,0.06)",fontSize:13,color:"rgba(255,255,255,0.3)"}}>
        <div>Tổ chức bởi <strong style={{color:"#FFB800"}}>SBU3 Team Building Committee 2026</strong></div>
        <div style={{marginTop:6}}>Liên hệ: <strong style={{color:"#FFB800"}}>KyTT</strong> (Phụ trách tổng) — <strong style={{color:"#FFB800"}}>ChiVTM</strong> (Tài chính)</div>
        <div style={{marginTop:6,fontSize:11,opacity:0.5}}>Sơn Tinh Camp, Ba Vì · 27–28/06/2026</div>
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
    window.storage.get(STORAGE_KEY)
      .then(r => setRows(JSON.parse(r.value || "[]")))
      .catch(() => setRows([]));
  }, []);

  const saveRows = async (newRows) => {
    await window.storage.set(STORAGE_KEY, JSON.stringify(newRows));
    setRows(newRows);
  };

  const deleteRow = async (id) => {
    await saveRows((rows||[]).filter(r => r.id !== id));
    setConfirmId(null);
    showToast("Đã xóa!");
  };

  const startEdit = (r, idx) => setEditing({ idx, data: {...r} });

  const saveEdit = async () => {
    const newRows = (rows||[]).map(r => r.id === editing.data.id ? editing.data : r);
    await saveRows(newRows);
    setEditing(null);
    showToast("Đã lưu thay đổi!");
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
                  {["#","Thời gian","Họ và tên","Email","Số ĐT","Tham gia","Ở đêm","Lưu ý",""].map(h=>(
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
                    <td style={{padding:"12px 16px",color:"rgba(255,255,255,0.5)",maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={r.notes}>{r.notes||"—"}</td>
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
              ["Tên thân mật","nickname","text"],
              ["Email","email","email"],
              ["Số điện thoại","phone","tel"],
            ].map(([lbl,key,type])=>(
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>{lbl}</div>
                <input type={type} value={editing.data[key]||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,[key]:e.target.value}}))}
                  style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif",fontSize:14,outline:"none"}} />
              </div>
            ))}
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
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Dị ứng / Lưu ý</div>
              <textarea value={editing.data.notes||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,notes:e.target.value}}))} rows={3}
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
