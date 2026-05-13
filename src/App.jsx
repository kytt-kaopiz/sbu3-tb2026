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
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Saira:wght@300;400;600;800&display=swap');
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
    width:"100%", fontFamily:"Saira,sans-serif", fontSize:15,
    padding:"13px 16px", borderRadius:8, color:"#FFF8EE",
    background: errors[f] ? "rgba(41,182,246,0.1)" : "rgba(255,255,255,0.05)",
    border:"1px solid "+(errors[f] ? "#29B6F6" : "rgba(255,255,255,0.13)"),
    outline:"none", transition:"all 0.2s",
  });

  return (
    <div style={{background:"linear-gradient(180deg,#0B3D5E 0%,#0A4A6E 100%)",color:"#FFF8EE",fontFamily:"Saira,sans-serif",minHeight:"100vh"}}>
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
          <h1 style={{fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(56px,11vw,140px)",lineHeight:0.9}}>
            <span style={{display:"block",color:"#FFF8EE"}}>ĐẠI HỘI</span>
            <span style={{display:"block",color:"#29B6F6",filter:"drop-shadow(0 0 30px rgba(41,182,246,0.7))"}}>TIÊN</span>
            <span style={{display:"block",color:"#4DD0E1",fontSize:"65%"}}>TỬU 🍃</span>
          </h1>
          <p style={{marginTop:24,fontSize:"clamp(13px,1.8vw,17px)",color:"rgba(255,248,238,0.7)",letterSpacing:"0.1em"}}>
            "Năng lượng mới — Tinh thần mới — SBU3 bứt phá!"
          </p>
        </div>
        <div style={{display:"flex",gap:14,marginTop:44,flexWrap:"wrap",justifyContent:"center",position:"relative",animation:"fadeUp 0.7s 0.3s both"}}>
          <MetaChip icon="📅" label="Thời gian" value="27–28/06/2026" />
          <MetaChip icon="🏕️" label="Địa điểm" value="Sơn Tinh Camp, Ba Vì" />
          <MetaChip icon="👥" label="Quy mô" value="~70 Chiến Binh" />
        </div>
        <button
          onClick={() => document.getElementById("reg-form").scrollIntoView({behavior:"smooth"})}
          style={{
            marginTop:48, background:"linear-gradient(135deg,#29B6F6,#00BCD4)", color:"white",
            fontFamily:"Bebas Neue,sans-serif", fontSize:22, letterSpacing:"0.12em",
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
          <h2 style={{fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(34px,6vw,68px)",lineHeight:1,marginBottom:44}}>MỌI THỨ BẠN<br />CẦN BIẾT</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20}}>
            <InfoCard emoji="🎯" title="Mục tiêu" desc="Tái tạo năng lượng và động lực làm việc sau giai đoạn release căng thẳng. Xây dựng văn hóa đơn vị qua các hoạt động trải nghiệm thực tế và tự túc." />
            <InfoCard emoji="📍" title="Địa điểm" desc="Sơn Tinh Camp, Đồng Mô, Ba Vì, Hà Nội — thiên nhiên xanh mát, sông hồ thoáng đãng." />
            <InfoCard emoji="🚌" title="Di chuyển" desc="Xe 29 & 45 chỗ đưa đón toàn đội. Tập trung tại đơn vị lúc 7:30 sáng ngày 27/06." />
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
          <h2 style={{fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(34px,6vw,68px)",lineHeight:1,marginBottom:48,textAlign:"center"}}>48 GIỜ<br />KHÔNG LÃNG PHÍ</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:40}}>
            <div>
              <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:28,color:"#29B6F6",paddingBottom:12,marginBottom:18,borderBottom:"2px solid rgba(41,182,246,0.3)"}}>Ngày 1 — 27/06</div>
              <TItem time="08:15–08:30" title="Tập trung & Khởi hành" desc="Tập hợp đội hình, lên xe xuất phát" />
              <TItem time="10:00–11:00" title="Nghỉ ngơi, sắp xếp đồ đạc" desc="Nhận phòng, sắp xếp đồ đạc, làm quen không gian" />
              <TItem time="11:00–13:30" title="Ăn trưa" desc="Bữa trưa tại khu ẩm thực Sơn Tinh Camp" />
              <TItem time="14:00–16:00" title="Chơi game TBD" desc="Hoạt động team building ngoài trời, trò chơi gắn kết" />
              <TItem time="16:00–18:30" title="Nghỉ ngơi, tắm rửa" desc="Thư giãn, tắm rửa, chuẩn bị cho buổi tối" />
              <TItem time="18:30–21:30" title="Gala Dinner & Lửa trại" desc="BBQ — Quẩy — Trao giải (HOT NHẤT!)" />
            </div>
            <div>
              <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:28,color:"#29B6F6",paddingBottom:12,marginBottom:18,borderBottom:"2px solid rgba(41,182,246,0.3)"}}>Ngày 2 — 28/06</div>
              <TItem time="08:00–09:00" title="Ăn sáng" desc="Bữa sáng nhẹ nhàng, hít thở không khí trong lành" />
              <TItem time="09:30–11:00" title="Kết thúc & Về Hà Nội" desc="Thu dọn đồ đạc, lên xe, kết thúc hành trình đáng nhớ!" />
            </div>
          </div>
        </div>
      </div>

      {/* KỶ NIỆM */}
      <div style={{background:"linear-gradient(135deg,#093550 0%,#0B4568 100%)",padding:"72px 32px"}}>
        <div style={{maxWidth:1040,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:14,fontWeight:700,textAlign:"center"}}>Kỷ niệm</div>
          <h2 style={{fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(34px,6vw,68px)",lineHeight:1,marginBottom:8,textAlign:"center"}}>CHUYẾN ĐI GẦN NHẤT</h2>
          <p style={{textAlign:"center",color:"rgba(255,248,238,0.5)",fontSize:14,marginBottom:44}}>Những khoảnh khắc đáng nhớ từ Team Building cuối năm 2025</p>
          {/* Video - hoạt động đầy đủ khi deploy (Netlify/Vercel) */}
          <div style={{marginBottom:32,borderRadius:16,overflow:"hidden",position:"relative",paddingBottom:"56.25%",height:0}}>
            <iframe
              src="https://www.youtube.com/embed/dW0L7jYkDKg?rel=0&modestbranding=1&color=white"
              title="SBU3 Team Building 2025"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}}
            />
          </div>

          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:12,borderRadius:16,overflow:"hidden"}}>
            <div style={{gridRow:"span 2",overflow:"hidden",borderRadius:12}}>
              <img src="data:image/jpeg;base64,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" alt="TBD 2025" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.04)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,aspectRatio:"1"}}>
              <img src="data:image/jpeg;base64,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" alt="TBD 2025" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{overflow:"hidden",borderRadius:12,aspectRatio:"1"}}>
              <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAEsAZADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDicYFIR3FHrQp5zmpKDORS5x1qV7V/sv2uJS0Qba5H8De9QZ4oAminaM8E0Sys45OahOBQDkYNAXGgncPrSnlj7UmMGk70xDxyPcVpaR5T3kaS8ISBWav3qliby5VI9c0mNM7XxN4XhtNPW6tmHBG4H6dq4hxtatWfWru4tEtpZnaJPuqTnFZTfMSTSQ2MPB4pCSfpTj0+lJkY96oQsa5NXFtZGj+RG9sd6qxnDCu+0C60pvDsq3LIk6qwyfvcjjFJjRwBGD1NBdgeG6VLdIFkYJ0zioDz1oEP81gR3/CpXOHxsUjtxVfGTVk/MEPqKAGnHXy8Y7A0m9P+mg/HNdQPDnk6E+pSfMphJVB1yeAa5R85wRTTBky7WjciRgo+9lRSBIT0lj/GMikh/wCPeb6Coh0oEWkgjJGJLdwP4SzAVIIGlkdgiMc9BKMfh7VUVcnHauji0xjpFteGMqI1dCcfeByQf1I/Chuw0rjtKvobR2NzYGRmYbmBU4UDoB0q5N4gsRKVGlMYyeGBAP5CuaJ2zMR61MH5zkH1p2uJs1r7UNNnEE0dtOkkcwZgQTlPQdeagv8AUtMntpUht5o5XGA7KOP0zWezAnIqTbu8mM5+ZsnA55oaBGYFj8wB3+U9SB0pGG8AAoMD+/U0rSoxBPQ46VEZn77T9RSAZ5fTofXBFPlUhVVee5xjGafC5kchlTaBknbUQnyf9Un5UDGgOOMECl+YZwGAPtUgO9WcRLhcAj603cCceWuaQDVVjkkHjoKRlbB4J9OKc7qrEbQcUzzQP4BTANjEdKcUIHA/GkDg/wAFPIwOFoAjw4OFBApSGKgY6GjdzjaKC2CeBx7UgA7scU0IR06/WnByfQfhTgGJ4x+VMBrL8uCQfxpAnGMipHDr1FR5JPXikAFc9+PSgD3GKPm6il5PcYNAhBGPX9KXYOmT+VSCKRl9vWmldnHegYjKAef/ANVMx+NPZtxzT4oTKdqDJPagB9ney2byBAGjmTZLG3R1/wAfQ1WdQrZXO09KnmtpImKujKR6iogOOehoAZnjtTSaVl2n2pCKYhw5Ge4pPU4o70EYOfzoAB1qUHcCo+8vIqLPGKd/y0Q9M4pACscmlyCcUjjBOOmaRetAAGHAxSEYag4p33lB9OtMYgOOlTRzMBjOBUJFC+tAiWZicMOhqMnvUn3oT7c1EPekNi5zVhP9QD6Gq4Oani5hkU+maARqPr94+mLYGX9wOAMfpmsdjkk0gORxR3osK5LBzFP/ALtRAZqe3/1cw/2KjC8jOcGmA6PAYHtXYp4gS40D+z1gCmNFBbPBGR2rjfpVyycrBcHttH9aTQ47kLtlyfU06NqgzUkXWrJJk+aQD1NdJ4ZskvNZDMRthUkA+v8Ak/pXO24/eEnoozUkF3LBJ5kTsjeqnFJlLYl8RWgstTmgVt21vvetYzVcupWmkLuSWPUmq6R75ABSDdjj+6tcfxSfyFVwuTUk7iSU7eg4FC+5pAzpfD3h2S/027mxg/KqE9+5/pWFcxiB3wQSDgVpabr97Z2klrBJhJOvHT6VjXEm+QgcgUitkRfhmkx7Uv0xQoy2BVEF/SNNk1K8jgjxuc457VueJtFg0hEAkDMw4HtXP2t49pMskLlWQ5DA0uqancajN5txIztjGTUl7FUkZJA/Gmqu40mS3A6U9SB9BTJEAyen0rtPCWjadc201zeSAlP4Scbfc1x3Vsg1Ity6IUViAetLcaLesy273kgtf9UDgH1rMPHbilZu4NMLEjHvQkJu4uecCr2nxRzXEay8IT8x9BVFamjk2dKbBHb+IU0TT9KjitNjTHpsOSfc1w0jbmJwafJK8hyx6VESX4H4mkkNsjB5q7YXhtLhJQoYqc4IqmVz92hSQcYwabVxJ2Ou8Q6/Z6rYQiK2Ecw+8f6CuVY5amhsCkz3osDZctIYppVS5do4mODIFzs98VXubd7WZomKttPDKchh2IrZ8OaxbafdD7VbiaFuDkZI96ra5Na3F5K9lH5cG75F9KQ9DJxzSkgsfXvSc5NLgUyRp4PtThn5frzS7Q2V/KkXgHr1oAXI3EHoTTRw2DR9BTuoDY6daAGHpTomGcHvTT1z60g60wH/AHWx6UDnFK3IDevBpFHWgCSLAkKk8HimAYYg9qDwwYU+Xh8/3sUDI81NbH95j1GKh20+H5Zl+tAIQHnmjqKWRcSsOnJoVDgnj86BE1ufllHX5TTR90HJpYeGf/cNJxjk80gYFTn5eRViI7LGf/aYD8v/ANdQEHAx0HpU2SLHr95/8/ypgiBeafnmmDPbmlPFUIto2Ldj3Y4qInillO2ONPbNRZpDYGnL+7hZ+54FMA3MAO9OuW+cIOij9aQ13K/T8KM44oIyadDHvfnoOpoES58qDcfvPwPp3NV8U6aXzJOOFHA+lJx0oGxuOcU5v3aY7mlRcAueR2pjMSSc0AItO9h3puMDrTvuD/aP6UAHA+X86M4OMU08dRQMk4FIBcnd8ppTkDoCKOF4/WkLdjQAnagDJwOlIBk088AAcfSgBrHsOlKpAoJwDnmgDufyoAnggWVWlmfy4V6nqWPoB60wlXB2gKOwz0pjMSv0poHPFAChiMEUm45zjmk7frSZ9aYh3mg8EU5Svpxj0qJhmnKzAD16UATLt5xkCneXkfeIz7UzZgcMDzTZWKqoNAxTCT0OCOmab5b9xz7Um5gOCfzpDJIvf86BDnDKMYP1pCcHcPxqUPlUJGcilDY+8u3PvyfwoAhJ79jQCVNS74s7cZx7UoWIjI+UH14oAgYY47Un0qwY4yAN2D9aX7Lu6SY+ooAhRsgqe/Q0Dljz2qQ2jr0ZTSm3kD5XBJHODQBD1PSpPvIB1INBtbgHPkv+HNKkcmSvlv0/u0AR89xSg4ZSOxzShuckD3BpN3J4BzQA+c5lLDuM0Ix70jDKBgDikXBGe+elAE8Q2u49VNQgds09TxjtTcHPy5wO+KABc84H5VYl/wCPaFce5qNPUDaR3HWllJZdx45x1oAYGA6nmlUAuFHc1EafCcMW9BTES3LBpzjoOBTM03JPJpc0DJYCFLSN0UVASSST1NPc4UJ+dMHIoAQdakkIjh2j7zdfYU1Rg7j2pjtuJJoAZTo1Lt7U3rxT2Oxdo/GgAmbcQF+6OlR0p7YpRzgmkA5QEXc3XsKZkkknPPelYNnmkJJPvQAnJPHJp/A4H4mm9BgUEkZoAXjvSdfoKTOcZ4FDfdU560AGcj2pfYDmkBB6CpFBztwfypDFVUVR3c/kKbjB6100aaHBoSyFZZL98gr2X/61c7ICznjGT0zQDRHz+FKAfTip7eH94u8jGeea6HV7HQ7OxjFpctJO4BPfH+FFx2OTJ96T8cUmcGjoc0EjqXHK0wZJGO5xUnWTI6ZoAkLbR0B+tI8wLbXjVsDqcihu1RMf3pJ9aYD90TsPkKk+jUjLHuIJYH3FMx0qUgSxgfxgce4oAXYrYCyAYHQ03yG3ZDK30NRHl807r06mgCdoi77m4AOeBz9MU0RNJISRgepONtNl3pIcMe3IponkH8RoAQNjgjIzThKrHDJwOwNKLmTvtP1FL5+fvRIfwoAUSSHJR/L7AKKekrBd7sx52gA8ZpqzxA824/PrTzPA+N8b4AwFB4AoAcbuZCASB7gZqeC4eRwr+XycZB5P4VXd7WTHLoF6ALUtsLZJQ/nscf7NAixZzyz5CLHwpY+Y+B+Zokv7TlGjjc+qpx+Zo0tIoJZ281ZQ0DqAo+7kdTUEdkWXb9ohx/vdaBlmCe1Y/NCsar3Y4B/LrRKdJLZ8krzglS2M/wBKhOnzM6hAhVBgFmGD70sdjceYVNu2w4BfbnjvQBO0OmKDzIox/wA9P/rUkem2Uygx3EvP+6f8KqzJd7yTaOR0AaI4FRRQzSykyQyM3uCKAND+zbU/Kl6xPTBUf40r6Uhfat1j5ed643fhmqexyB8reZ/HxzjtTfMw4iYlkIyFc8j6ehoAsHSCCALmP8QaT+y5FRsTRsT7GoxMpsGcbtqygdeehqt5jbsRFgScbief/rUwLZ02Yfxxn8T/AIUgsJQ3LJge9RIzyFkZmdgMg8hs/wB38aaJpQgJk3DunbmgCVrGYkn5MfWmGzmH9386QTqueZMHoM8j8ab5rlgsTNubvmgBz20mdo2/nTDaS/7P50ql5N2WLMo3DB6+1NaSRVGX3DpigBRbOgLcZ7UgtnPJKk06GTMiqCxBPftUTyDPG7I7E8UAP+zN0yoFD2zhsEgcZFMBcBSxLZ6Ke/NK4w+1X+XjB9aQC+T/ALYpDEoAy/Wot2eoyfWl8wk52jd6igCTy0H8RoAiIzyQO5PFRrGWXIBLZPHpUhRmPCnOMHjAoARvL67c+9AZVXcEGPpSNDLuJVSBSrGfKcMyg5BGWoAPtHYKBSiQlR600QjHMyfhk075BEqBskMecGgZLkm3D+1VjI2epq2u37GVDBuvOKpKNzY9aQDlZsjJNOdyTgnNMUAZJ9OKBjJ7HtQAwncOTQpOMHpTRRyOlMQ5OGz6U6M5IHpTB9w+5FPi+9n2oAnCM2CASKhkXBJHrVuF2G1QeKpscg+560ANJwFx2p2TuUjg0ypIPnniT1YD9aANC50pzmW1Esy5wdsZOD36VWOnXnT7Lcf9+WrrraV7Xw3LcxMUdpHYEdvmxWWmt6jt4upDj1pN23NY03PVGVPY3TMCLa4Hy4P7lv8ACoRYXIP+omH/AGxb/CugOs6mRgXMg+lN/tnVF/5fJOenT/CpU0X9XkYQspweYZv+/TUr2E8ZbKycHBxE3+FbZ1zVB/y+P+IH+FKNf1T/AJ+2/wC+R/hT50H1eRgfZJB/BJ/36ag2zdcP/wB+2/wroV8Qarn/AI+j/wB8j/CnjxFqo/5ev/HBRzoPq0zmfs7D+9/3w3+FAiYcHP4qf8K6ceItU/57qfrGKeviLU+8sZ/7ZijniH1aZhabFITdGOQIfs77sKeRxkdKpqq9PMXPbg/4V1X/AAkWo/3ov+/Qpw8Q3+ORbn/tkKXPEPq0zltqhgxmQEHkc/4UDcBuF0g5/vN/hXVDxDengpbH/tiKcNfuj1htD/2xFHPEPq1Q5iOWfI2Xwz/vn/Cpftl2vXUFP1cn+ldKNcuP+fWz/wC/NSJrMh62Nif+2eKfOhfV5nNf2hdgf8fyE/X/AOtUtrPPcmXE9sxSMttYcsfQcda6mLU2frptg30Zaf8A2mUJxpdmvqdy/wDxNHMhexmcR9vk2lC1qVJyQU4z+VNN2pPKWn4Ia7NtVXn/AIldln1+U/0qFtVODjTtP/74Bp88RrD1H0OUN4HwXW3JB460j3KP96O3P511B1h1OPsFj/35FJ/bUn/PlZD/ALZUvaRK+q1OxyzSw4z5cH5tTfPhHSOHP1auq/tmQn/jzs/+/Ipf7Yl7Wtn/AN+RS9pEawdVnKm5jJzthBHoSKa00bkfJDx9a63+15v+fa0/78imnWZ/+eFoP+2Ipe1iP6lVOREyKdyrCCOh5pDOp/hh/I11v9tXGeIbX/vyKnivdTm/1dpCR6mAAfrR7WAPCVFvY4sXGAQPKAPbBoFyyggGMA9RtrvJbu5tLV5bn7NvxhUWIdfrWX/b972W3/78ihVYy2JWGm9jlTO3Zk/BaUSykEh+B1IXpXUf29fE4xB/35FIddvwCw8geuIhVc8Q+rTOW8yQ/wDLRvypMuRy7frXVDXb8tgNCRnqIhSrrd64GTFg9P3Q5o50T7CRz9rZh4WmklCqqkrkE5PYVV8sEksWyea7aw1GW6vYYZxEyO2CPLHpXIanK5vZldizI5XJ9AaE77Gc48ujIGcZATilcEY5z3ppclPmOeeD3oU/NwenSmQWIhiMj3qoBz7ir5+5071UKkBzjgGgY0n5Sc96YfagnAA/GnfKE5+9/KmIi6U4A/UVL5SlSzkj6cmmpHkHDZWi4DW+XCkduafCByRTGBPzEYPenQjhqALsa4I9lH8s1TCD7ueOuavhcQyN/dQ/yqiHBAyBz1xQwY0qvJAP0qfTwpvoMjo2fyqLIX/aPZvap9O5vQe4UmkB1t3+78HRn+8AfzYmsGDCThTwGX+lb+rYXwnaL6iMfoTXN7jsik9PlNTPc66PwmgOSQOcL/Wq8mCSF6feX/Cm7yHOM/MKP4T2xzWVjdMYfm+tJig880ZzQWmLilApFPPpTwfwNItABSgYp0amRtq/XPoO5q3cWDxRWzxb5TND5pCp90ZxRZsLxTsynTgOKd5Ug3ZicbevynipBBJ0Mbg8cEHJ/ClZlXRGo5pwGe1KF2vtYEEHBBHIq1ZWyXLSK0yoyrlFJALn0BPFC1CTSV2RBeBVm3jJP/1qabaWMMXVk2HawbAOT2q/Z27tH5m3KjqNwz9cYq0jKUlYnhtzsJI5PqP8RU32YkZJH4sR/UVYtF3AfK34jFWTBctnytwA/wB3n86uxyudmY8tvtB6fgf/ANdZ8sfLEDHHr/8AWrduIpdjCZJFOOGO05/IVmzrlTwRgdKTRvTmZMi4Y9OtMxxVqdAGPWoCBjpzmsWdsRgHNOAxSgAUhNQaoQ1PFZkxefOSkXb1b6Va0qyS5l3y8Qx9c/xH0q7fQGadYmxjrUSdjCdZKXKjNtOZP3Mexe2ByfqTWjPfC0g3FtzHgAdz9arzr9lG1Op4zWbqLEyxg9BGMVCXNIhxVR36EN3dS3T7pGz6AdBVf604jB96FTdz2rpVkU/IaVIHzAjnpTkTIJJVdq9DTzHlQ3PBwRjv6CkLBgRnryQRT3M3oAXORgseR/n/AD3oxkhiOcYFNYZ4Awe+KF+Z+SSFGAaqxk2XbNhFqNqQeki5rC1yIx61eDoPOY/rWjG+yeJvRwf1qLxMu3XbvqAWDZB9QK1hsctfdGJsYkADNOjPzY7UdOv4CnxglgDzjse1WcxbA/dn8DVWY4GzPU5NXIV3W5P+xn8jVK4GJOlIZHxkk/hSYyCak2jyQxGSemaZnJ6jNMQu4j2/Cnbyq5Oc9KaGJ68/jQ5z8o6DtSAZknOamjHHXrUSk9gM5/Kp4xyBx17UwLkr7beX3B/mKzwABg4yauTkm3YDgnH86pNG6jPb1FAMYCSoHpxV7Sx+9d/Qf4n+lUd3PFX9MHyyH2b/ANB/+vQwOs11Nvhe1B6gR/yH+NcsjHaV7ZzXW+KB5ejW8eecqMfh/wDWrkRgGpqbnVRXuk6EmT6gVM3zLkd+KgDhXBA6YqQPgOo6ZyKyN0kIVwxPGPc0hAAz1pznP1puaCkGc/SlApB1pwNItMsWrpHIRJnY6lGIGSAR1rZj1GLyFtJwBB5KoZUbdll5HHXae4rKsbCe9J8sBUH3nboKV1sY32edPKRwXjUBfwz1pqTRE1CTsPOoyMy5jT5RtUjPAPB+vFPOoMWJEKlC5cKxJ5zmnHS/Ns2u7OYTRL98MNrL9aognA9KXMyoqEtiTcZJCxzljnk5/WtjTriwgiRzCxuNuD8y9e5yelZEfzEADNX9Ks47yVkdn4XcNuMUlLl1HVS5dS+t75gUtDFjoqhxgKMYHPXoP1qeBVlkL7AuRgAH0FZ08aQXTRLuCoSAR8xHP61fsGGSQY5F2n5o2wR9RWqdzncUldG1DERCwBxxwMVZEMfO4JjPcVDA4DBDIQD/AAyL29j3q0kw2nqc/wB3vVHLK9ylcxDadhwPUdKx7iP5iPY1t3Ui9SjBueWOex7ViXJIbedw9N2FH5dalm9IyJ0Gc1AQMGrU4+uMelVj0NYSPVhsM7UxutSpG8hKopY+w6VJdWwtolEjAyvztH8IqC+ZXsQyTOURFJ2ryAPU10sB81EDfeHB/CsTTLQyv57r+7j5Gf4iK17cNAIy/J5Zh9azlb7jkxDT0Q6eJCw3jArK1Wz22kUyncEOwkdx2rVv5VMO7PKnIFUl3NBdQN9x0Lp7Ec1UbXMaTaSZz+31oAz7Dp9asW8RlEigchSw/Cq7ZbAHTtWidzrkhcl3z0C0objOe3pQRk+WPqTTT046dKsxeoigEMxbBPTjrSDgGnnhaQCmZtELZ4pfFnOpo/aSCNv0p7Dj8aXxIgf+z37m2x9cHFaQOautEc/nBytSwMu8EjJJ59qh5pUPPt3rQ5TVsj+7dPVHH9apzYB3EZGOnrU1k2HHOeSM/UVFNyOe2aQyNY3YbiRjqSegFRHqTSq3ysuPvUY/U5piCMqGJPHHH1pyxF+lMlBV8Fdp7j0q5aw3DwiRc7MnafpQCKxt2HUGpIxhlBGMGutt9Ege0EiySPKUBIdxha5cxT/a2ieNvOBIZAMkH8KSkmU4tEgsmuJVwThlGMVrw6MTCN0jBgAMSRkfQZqukE1oiNKrBTx0+6a0hqotIJb2Wcs+NqR5PJ7Cobd9C4xjbU4+4x58m1dvzHj0rQ0pdwI/2T+rKP6VmMzO5Zjkk5Jra0FA0mG6bUGT7vmtDI3fGUhH2WLPHzEj9K5fuDWx4p1G3u7yNbeYSCMEMV5GSfWscHPSpnudNJ+7YkzljTxUa9fxpw4GPeszdEmc98/zozSA/nQD69KRSHr1p8UZllSMfedgv50wce47VJBL5U8co/gYNj6GkV0Op1hBpuh+TCNobCf41yqjGK6zXsXuiCeD51Uh8D0rlEYqQyMQR6VK2M6GxKk8kcMsKthJcbx64q/pmmNeQyTsxWGIHJHU4GcVsaa5bw688mGlVXIcjnjpWVYWMslhNeTzyR22CW2H5npg6m9tCTS7GDUklEayQyR4I+fcDn14qbwyCupzIchghByPcVY8LSoz3PlxqqALgZy3fqai8Ov/AMTe5G/s3DdPvUESlL3kPeB7nV5YU25LsTkZHGOfrVm1hhF+8O1gy5XeJBycemKrpBPca1cJBsAEhLEnp9KdYtBFq6xwxurK7Bnc5LcHp6VZLbtbyNVA0DGNSTjnICr+gP8ASntclATubdnoGIz+AB/lVW/lQXp+7naP4cEfU1AlywZgt15AwMnA/rVXFGPMrlmWcsfn+9noxY4/MCsyc45bjPoAKlknQ7RFPNNg/ebG38gKqXPGM+YSe7jbn8OtJs6KcLMhmPPXPH1xTRCFXfLk5GVX19zWhptn9oPmOgZI+uehPYUuoWpX5y25zyfasZM6FUXNyFK3LvJtAzgHao4ANFzNbSz+Y1u/mYAKlsjj2pI5vs4KsQAew61HJds33Bt/2v4vzrKzbNOW8rosxTvG+ZcA9FiHQD3q7vyhdz7kmsiAqnzyGnvPJcuEQfL2UVEo3dlsZzpXY9pWeOUj7pPFWYULRuAQDtKgnoO1LHbZCxKM45+p/wAKnezKoEDDA5Zj3NN7aGUpx2RVtNP+zoz9fVjWMoKk7Blz09q3dTuxbWn2dWzI4x9B61jJIIULNkvIOPYetaRTWrNKblJNy6lcggbR1PWiMAvzyBSElQVxyeP/AK1SsnlKqnqD831rUmQxhkkZ9zSY+XNKV2oP7zmnKvT6UyLkbrhTjtSa/n+y9NmX+EumfxzT36OPpSan+98Kwv3iucH8RVw3Oev8Jz8iLwynhv8AOKjxxjGCKkjy6tH1zyPrTEJVgCMjOMGtTjLFsduM+1OuR/OmIpUgDuM0+c/zFAysCN4p7jZEPl5PG709qYnDfjSydmPTHGaQiyNPuJwXQblHLNjAHrzWhaiSG3CKWVCOR2NdDbr5cartGzOODyvv/KkOIJC5RCoOC6jBUdOR0xmuf2l9DdQsQWOpW8cWLiYI/QZ61oeGbeGK3+0bcvOxLOD0OentWTNpMczZIUSeadsmMcHp9e+KvaTctpjvaTruQkHcv8/ce1VFroKVzacQ3BlsLvkMu5GbqSCcge44+tZsmm2lzG+nyKyQzYEbbc7W67v8/StaeCG7jVs5DfxDqpxwR+IFRWe5Gw4BdAVPHBOQKohHmus6XPo9+1rPzxuRx0dexp0W820kSEAyPHHk/Suu8e6d51jb34cl4j5bA91Y9frn+dYSaVOltN+6M7McmNO2enPqOtXfQSWpZ0jQopHKzt+8VvuHgMKj1uwjs5IjEBtbIODkAjtmi11B4XVyrBxwyt1qLUJ5L2dVjMsijLfP6n+Q6VGvU2hy9CiKdU89pJbwo7EENwMVSlnVV2qTvzz6AUJXNXNRV2Tg0uccj8au6HaQXxYNIUCDLSNyM9gB9a1ruOCDRjOsEPnAAbggIznBpPQI1b9DngQFJzx1q9otg2rs+2RIgg+83T6fWs2UEwuB1I4rf8NX8EGmpG5WJtxYsyZ47jOCaLaXCpJ8ySZFbXd9pSkFQ0DOyFW5UkdR7VDJLYSOW8i4iJ/hRlK/hmlv7o3LSR2ybrdpjKNq+o6f59ahu40t7aHAZLh+GRm9ehx2+lTYqNkuZl6PWDFaNawwbbdkZSGbLc96fp+sta2RtZYRPEQQBnHHpVjUtOtoNK8yOACeLAdlfOQcdawz0x3pNFQUZp6GnYauLOZzFbokTD7gPP1yetFnqgtruSZLZS0nAXcfX+dPlvmeeK2s4Iti7U3iMMznua6EC2SI3MBtz5QbOwcqQP507XJbS3W/mYUWqvDfPOkYUyZDozd8+varUt/MksN19lijEgLBs5JAyDVG6uDfwW8iwqkiFlkKr8vb5j6Vq6jFaTWEENnIJJIRlV5BIxg4B6/hTBqKauipqWqvLA06pCCF6hgSazyt6gFwZknAOWjbA49KjmjuJYlis7ZZZpG2DYCSK0Y3ZYlgdWWcDYU2gYNO9kTNKMuWLHSXKybRFF5aA9S2T/gKgkdRk/iWJzWtcQ3cGlbJbRSH53xjO3Hc+lYiqZJlUgEMQOpPFQ5aXOuk1K7XQqT65qECiK3aNIQSQAm4t9TWjHqct9ap8oWQ8OV7n29KvWxgMaQCNAQTsA5KfnWfbWp06N1OCQ5Oeg68fpSlONtjnoqXtPe1K87Q274uZQpHVc804Ksi7oeU7N2ptrpM11dS3M0gdHYsqjqee9DWot5plRiUdtwXn5TQ4q17nRTrTlU5GgzGv3mLY/u1YhnZVITEKnrjlzVXGPQe57UXcdxBbwyoYgkvPzE57cn86jk5tDWtOMFeZr210kCvIwyq9s8u3pmqsmpSNunf5jnCL2z6/Sq0DrcW2zeqlGweep9qTUFRUgWFhkgphuzZ61KjrymP7u3OQO5ctNKSzMeM9z60wPgmVzk54B7mlmI07UFjvClxGflOOPoRVaZ1LMwULnsO1bctmKNVTV0WbZQGM8zhY0G4knHNPV0ucyArszgAHOADUvh/SxdzfabiNZokBCRueC3vUOv2yW9wksFvHb7hhxEwIJ64IHcVWhzub5iFVnvLpvIkjiEY5eQ9M+nvU0CyxyPFKySFVBV0OQfapNBux5xh+zh2ILhhyTjtVzKvrSW+7a7/AHOMZzzRfoLVSvcz5Uwz/wC4D+tTaZbpqGk3Vm+cCdHBAzjrUd5NAt4yK4YLuVh9DTtKkFompPKj7URXA6buTj+dONwnZx1INZ0SO3gie1ScSFgu1yMt9AKw9wKZaH5gcNjIINbV7q7TESRyhJAOgGSv4+tYmbiNSWTjudua0inbU5ZNX0LumW4ub6GMq2wjLAnsDXTagmbbyGaBQ2QAF+UDHFcfAJprqFbZT5zNhAhOSa6i6t7yWJUCJNJjkoO/1qJrVFQaszkJF2SlSc4P6U1iGJzkAV0beEtTfc6CM/MRh3weOtZt9pd7pjqLiExluARgg/iK0MjpNPl+0oyAEMF5B6fgadFOVnfeP+WoQg99wH9az7aaNbxFhZnVsk/MQFA78VbhWORfMYlWEm/g5xxgZrlaOhMt2kaxo9uQQgYhR6A+n0NU7u5RdpkJ8+I4Kgcn2/rUEVzPcyylJtwSTajY2hu/P5frUN7diSWPyUKzscEY569PzFOMbMLqx09hqIks4w0UiOOoJx+P51oSsiupiXLylcgn9a4gCSEpcybgWY8Dsa0I9UkWaKXYW2DG3OAfrWu5m0aF3qbW8XmGQOiuflJ5YZ4P4dKq6da3tz5s1oYo4JXJTexH4AD69fasaXVrZZ380NuDnKDtz0zW9ZaskUA8uILg5AHpTsJOxz+qwalJelbmNxcg8IeQR6g+nvVmSwuNPAefavGQAdwx65HUV173SZWQqGh8pTuI5yx6/pWRrEtp9heFiuGcCMZ6ZOcD1HBq76WJ63Of1Od7iCGVFIg5zj7obNYyQv5wZlwuevUV6RYHTo7EQ4geNuGQYIb14P8AOuIuDGl9cG1UC2MhCJ1+XNEIlSndJGzpN4lqfLaLajc/IOc07U5jdWLxxbpC7jHHXn/9VVp7x49GgjmMewkskn8WzoFP41C1/E1qiW7DzAuOB90+v8qz5G2aKaRPc6bHHpyyW4bzUyXYt/d68exrS0i1STw3LcBVWdVeNZD0Ud8e/JrLTzbyym2SswQl9p6ZwSR/OtH7fLaaD9gChWljIbAGQzNn88cVbj0Mud7ss6PAUiW5JwWBAUcDGeOPWue1CKSe4uCkbFmk3K/pjP8A9b8q3YJpIdPiKydwqZ+bjOMfp1rNkOyZjH8ysSAM8etTy63NqXvXTJdOmmuLS4GoLtSJckYGTgcE+vb8qz7oq11IUwFLZAFIbia2aGK1UiKQsWDLuKnkEE+lSXUSpGrJzg4Jz09KTg3ojWnLkbbJNLZFvF3hslWCkNjBxUF/qO3V5vszkRSnbIM5BGP15zVaS1WZ0lLsSOBg8Z9KuXOjlY5rt2CpHCpGDgbu4quTl3Mp1eeXMkDTJDCwkP7tiA6gkbl3DNaN3OslvCbUK13uDx+VIXIA6n8sVrabpVncaDGtxCpaaPzGf+NSRkYPbFVZbGDSre2hgIdmG7eeCwz1+nIyKz2HOanJm7osca2MIMKq7Jzxz70t+LO1cXNw0atwNzEBseme9SJttbcEkN5SjJHG7A7fUVg6XbC9muNV1EKLbzGYROOrdMn1AHSr3VjC+tzcSWxuGLxXiOWPKrMMHjpiuamjih1QLFGURXAHORj1GaZ4gsLBbCK/sVVFd9jqo4Pvjsags4Bb3ws718RIQ+6IE5HH5VE43R0YeooN32Ol0vSPId5pl3SM3yr2Ue4p+u2sNxaOxXEkSFgw9B2NPn1i3ihZonDYxwe9YmsX9y2mvOq7IWwd399icAfQU1BWsZe1m5899TMtLa7uV+0wTIidI8Hknvk1BA07STRTlGmRvn2kcE/zqwNQWw02VFXazsSuBwKpafIJ0d41UTNy2OSfx9abiki1Xmpc19SbypGO1QSx9OaZqs/m2UNukZjuQVLRlcY7Cul0CBX026VAu5iUHHJ4/wAaiuoLfUobfzUcTxnCuUJ4HUbumfTNEYcpdbEe2tdWOa03T7p4JDtO4ucqeBxxkH0qwX/szUbZ5sSZVkKj5iucciuxtImgi2SSbiyBSDgheT/j+dUTp0S+JYpuR8uVQ42jAIxj64NJw97mJVdun7M5rX3e8ii8qMsitl5FQhV+vFUCu8qVy+7sOoNdxdW76zoWbMpFJP8A6w54xnkenasrUdMSws7ZxGqSY8tyhyH7hvr61Vr6Exq8rbKWiQvHNKTOIXMY2DPJP071nam88+pGKZF8zjPlnIA9etaFtDDdzJHNjys5JPtSXUUNvdSpAVKBsgrTUUmJ1JP3jR8O2li0Ls8BgljOBOJTzkfpTrGSwu9QkZLhJZVjJjZwNynnJHb0rOlv7ay1WJ9OkDowDSozcEc5A96sJqGn2xmntrUM0qD5tu0ryecdM/TimknqZuTvqVJ7SRNPknuoreK5SQFPLOWA4yGPQ/z5qvFdRPC0MhVTIowWP3R61Hq2ofao1826dsncE8oJ37461iSXDCffGOTxyKrlTBTexqLHEm4gg4JPNA+ZiuQqjrn1NVPPK7fOITK7lG3qc96fJOrvhTx9f1rQg6/wnYQCxM4jjF15jLvYZO30Hp9RXQNh4FjjJhBA3FBggegPauP8LyKbe4ju1JgcBlcnHPoD2rR03UprcmK53eW33GcY5x6n8Kye5VtDbjWK3AiiXYpy7c5/GsLXrM3Vi8rsBK53qWwPLA6CtY3Nvks7jJBXhu1UtUvoWtH/AHqAkHBJHFMk4OORkP8AEM8Fl9KuiWFLUrHcSOz/AHlUEAfnVLadpOOB3rc0yyt2sY3kiVmbnJrGTS1NYor2Buih8iMeUvzYPVvXHqantNHuLy9eaSQxF/nRtuQfTjsa0gqrGojQqF+72x6irlrKFmXIbDDGAKzUtS3HQSHQYpbNkkeQzI7HeT94+mPwp17p6yW9kLeCNA+NzjrnHetSN8RFgc/MG/WnugMSKOikVrsZHmXiOFIfEF7HGAFV+g+gqOx1OW0UptEidgTjFXfE8GzWdQlyPmlXHPquT/SseMJkbzgVqtUSb8HiS4ERihjIJ7MQVFZ96Jbx/MZ8uvHoB9KjhaPcfLxtA61JvwzYGRtBqkkhXJX1We2tDa7UJkGGkPLD6fWqaTsI9/UZ5FR3rBpE29MU21R3c7WKgdTTjoNliZmkgZMnAIZQffvUUJ+zztGcZBxknAqwy4aE9m4P4Gkvbcefvz99eAPXpTtbURq6NHcXFy0lrKqbfvk8j8u/StvWLL/iSw3kG7zgFds9GwMnFY2gvJYSzQmOQliBuC5HHv8AjXUTsw0m0Xfxlh09+Khu7BHKwam1vbYuLWQxKxXcOBuPas5dSYtvkXModsYOAAe2K2fFEkc9nFLEJCqTEcqVGT3569Ky7azWODzpRmXeuB/d5FI2pp9Ca6t7m4sklI/fK5LKOoGOPxqODUpPs5ilwWYbVPT861kbKOw9c1gaufKm8pc/3vzNKO5tUXLFtMm+0vHbyKpwykEgemeP51NJqtxfWq2U5Bi3cBBgn/61ZluJ5iQrYGOc9xTYpnt3b5flJwcjn862dnZs4k2tEd14Y11P7PW2uHJeDMeevA+7gfT+VW9SvEYLK9sZICSpO7O1v856VyOmzQ7Wke2+8c4WTbn9M1vW/iUwoIWsIzEi4QRvyPTqO1YShroVc0Lm/wDttqsdmsryDIPy4GzHJ9PSqdzqslxp0doUUBQAWHcD2qh4Y1m3tkuhLIVV5dyRsDgDnuM469MVFcXtobiQi4iALZwGoSsA+5d47NlRi3zKdhOARzz/ACpunXIaa1u5gSUYOQOpGelVbm9t3xGk0bseAB6/WmpKLW0jJOCoAqJ9DtwsVKM79jstLtIr+aa7vImHmPujVvu7fp3pPFkWzR2kSIYhZX2gYGAf8/lVEa/bIFMl3fXGAMBUCAfiazte1hL+z8i1N3EGO1vMlypH0rTlZxXMDdPqk/lRBnfBO1agjkms38tty7M4GPWug0KKK2eeSL72FX8uam1yON3SV9pSVdo5H5UdAHWl/JBo0eHVWmYuXBxxjitPQw95atcXTs0ZlBXfz93v+tYvh7STftLFPIzWkDghO7E9q7JIlSNIVQJGAVCAcAYoV7ahK19DmI72SwvXt5iQEZl2Hv6YNTzau13eQkgKUcbNvX/az6ir2taTFehpGkEc+3sflb6/41k+GtPkh8y/lBJjBWMMOvbNEtgRu2E8Fu8tlnaRIV2gbR+FZ3jC8jSOzGcrvJz26Vdv59JvcH7ZbrIANskcy7l/Xke1cR4guB5kUEc6TKpL7kbI5qUtRkdxqYbCxhgoPO04OPalh1JXmCsuxDgAAZ/WpU0y2SMCUFnPJbOPwpqabbh93zEY6E1oSU7iORLxjGGGG4NbmiWC6kxgeYxvyP8AZ29SB71k6i/kyBsZ3cdemKfp+uCxuFkEROMgjI6GgDX8XWqSWq3MSgeVKYuP7vasOxhAtllIBZnzk+nStDVteF5pstutsqB3358zJFVbVSlvGrDjHP8AOqS1DoSSbGgw6qSBjBHSs24tTHEJEyAc5U9q0pidoAHbrjrUDKzR7Tkj0+tU0BctZ11W1trC1tSZ4UOSDjIz1J9Oa6HR547e3a01K1YkglWaMuTng5rE8Eqsd3fuwOY4cZ/E5/lXVRasZoIW+ySojAPu3AkjtWLQ7mbd6NatbS3i70XaSkY6H061k6joVzDbMDhlCbyVP3faunknSW2yUYLuPyEcnnPao4bdrnzpJQV3Kw3NnJJGM47AZqugjk4cX9qsUi/NHgBxxx71qRI0ahYgAB0G8DFYumSiORgWA3fwt0NbkfzjKqCPUYNckzoiPEhU/NxnqOo/OlkeSIo8fzEtgL6n2xQBGBh8D9KnjyrIow3zDI65FRHdFPYveZqAtWeS0BVRkgTYbFZV/wCIp7LTzOlpuVn2AvISM4PtXTqoe0aN/mUjH1Fcl4/KRadY28ahVMjMFHsAP610rVmDOcZ7rXLiSeVo9zPubAwOABgfgKilnFteSRpDGyo5ADZp9pf4aCKFNjcKehHuar3albxy/wDF8/51oiS2uoRBXaTT0JI+8DnH4Gmx3JF1G6pwoz83r7iorfnBPSo0kLuSOBVCH6gRJcq7YBfk4GAOaZbyqrtkYz0AFLck4jPGQcc0iKyysqEKwHGRmhOwPUmnlAiTIKkOOtXYlaeWMYKkGswuZwhkwTyCcVoWbNvD7jgkAL2FVzCNy4jlsJlgdWb7rD5yQwq1cXkgsYEaMgrO3y59Mcfma37uyhm+zTOD5kWNvv8AWiytYJB58iBmSeRkJ7ZPX9KzGc34m+0Jo8bz2hQTSqBlwSp69Pesn7PIIAHIGGDAAHnmur8WAPZWQbBH21Mg/Q1ZktoLlI4po8owDDHGPl5xSLjNx2OQiOAV3gdeCDVG8Aa7kkaLeExGDjIzjJ/nXVeH7TbdxTOgKtuC5/nXMXWtaha6neC1utsUlw7FMBl646EVUdHccqjnGzIUYbwpzyuBxjFMlj+0qY8sWTn5RmtD/hIb2VNlyttcIOiyQgY/EYNH9vXxUxxeRAj/ACFYYQuR9eTWvtOhjYr2/wAqBR/CAKI3P2grk9sirOnxo+8suecVFbKJ9QfHCg8fSoGULfEbyrjGHI/Wqlx/rTV26Xyr65UdA5IqncA7s1IxLZgtzGTnAarl5drNJGihsBhnOKpojKUc8fNitSLTozC8pkRmxnBB4qZtKzZvScmnFdSK2YGMg/wkg0ydy21Ax+ZgNuev41DCxFwyg9RkfWppXDPEMdXBGa1exzrc01e4iiPlOIBuJ8uQbvbP6UzzJblP3kkEwH3YwuAfXNNu14/DBqLTci3RgSOPX3qBli21O60m9eGxWJ0kAZlK456cHPFbtn4vt1JS/ikt5FB+8u4fmP8ACuUvZiuqxjPCqF/A1Nq6eZBG6jJXr9KpK6E3qdJN4lW5G63g8yMf34zgficCueXxbqsfmRl0dDlQHXO36fSknfbYQp6IR+lZUQEkDbh/GTSlFAmPhgjIDkZ4HB6Uy+dWmUqu0hQp98f5FSqcKQO1V7n7w9aRSNUahuQFIweP4mqIalKWKIkQ/wC+jVKJyIduMYFNtj8556mgQ++meTG9UznqoIqqRwCKsXY5FQJ97FAFgt+598UyOMOpOdpHcUrH5D9KWFSobPQigY1PNLbfMYf8CNSujYJV2OOeSaiZypGOO2ae5OzIPWgRreEbl49UlhVEfz4yp3kjpz2/GuoMxtraGF4lJVQpKnjjiuH0W4+y6zbSHhfMAP0PH9a7W/QuCmSCehB5zSYErPJNFmF/LAI3cZ/LNYPiVZhCq+dKy7cnL9T9K1NIu/tNm4PEkbbHHoaz/ETl7V8DHlkg0ICnBAY8ZKHH+zWmttOto9z8kahgoXHJzUNrJ5H75cFgdpU9wfSta6BWwtonOWZt7fgP/r1DiilJmdbWb3c6q7ttzyxq5HbGO5ZYnd/LdlGfY1Z04KZkIHbFMu2MUyuvH7yTPv8ANSaQ02a8Lt9iXI+YNgj0riPHs268s4M52RFj/wACP/1q7fIaCPb/ABHNebeK7kXOv3JU5WMiMf8AARg/rmiO4PYoafj7dET0BzVzXAq3kQT/AJ4Jn8Rn+WKqacM3X0Ump9Yy2qTKOdu1R+CgVqTbQLeJ5bdxGOcHnOMVWiOAMd6s2x8uHDY5ORVROXY+/ApJ6lONoplgENJGSOhrZtoRJaTyMoOxPlHqax7aJp7iKPoWaui1CxOn6cZVbIkKLjuSTUyY4rQpW1vALaaSQqpjXIGOp71DpsayK1wAQWmxjPAFa82mgaNcTIeTFnB65rP0ddthz183/CiLCSPRZD+7h9MVBpj5sIv9oFvzJNPu222fmD+GMn9KZYp5dnGvTEYFMzMnxc+2004et4p/Q1pRkvZ2ko+6MK3tkYrE8bOCdNjyc+cX4/AVraVKy2wTccdDzQBJ5Ygmt1QYCqQPyry0ktIS3JLZNeqzkKsT9lDH9K8pxiQ96YEyHk0NKIWDEZ54pqHk025XcgI5INMDTtbrYj7ec88Uy0nMU+8KSG9qdY2iT2FzMzELEjEY7mtTS7dtP1RUflXT5Wx94VDqWRXIYt2wkvpX/v8AJ+tVmRmizhT+PIqe4Obq5I7SE/rSNGTbFwDjr6gU76XFazGghwhK8DqKne42xCONCuRjOTzUVrEZJo41zlyO1bN1oirESz4K9wu3/EfyqJyity6fN0OdZ0FyjA+zexq95e8qpAA3BiD2+hqlcIv2dWUfdJBPrVmJ/wB2v8K46L2963WqMnoy3eS7YXYH2qvpjfuzHno2Rn3qeS1KWUjEsybdwZ+Cfp2qvpv7zzBGvzj6ZqCuhDqqkX28EfdB/Krd7KrhIQ2Dxkj0qMr5l08MgwxjxyMkHOakUHywQ5LE5weAPp71cepL6Dbps6ejjk56fUVnwDEJB/vVb8pjaxt8zIy/MF7H1qrFxD+JokCHL3qOY4YYPang8H6UyYZYfSpZSGxnhu9NiyCG7ZqRQBGMYzk5qJGwO3WkHUluiGVSPSo4MDOetST8qKjh70PYEPbG1hTYyeCSfQClkOFxj8akgR5Y8Bc47+lJsaV9CKTOCacDui56gUTIQWU44pin91j0piEThgzdAciu/vZCFbbzjrivPjng/lXdab5WpaXHOh2yFdsg5wWHX6UCMTSLsW/iCSEv+7m+TPqeo/w/GtHXlAeVf4ZQGH1rA1VBBqrCP+EgjBzzW9rMgdbU7i7yJ5h4xgHoKOoCWMfm3S5GVXmtfUW/0iNf7sefzP8A9as/SB/pPtWnNH5t7LxnYqj/AD+dJ7jQ7Sf9YxPQc/hUNxmWwjn6/vWJ9smlkc2VlMxyHP7pfcmrmmbGtQjgFSCMHpUspCG8jt9Ia8zkwxNuBPcdPzryx2Z3ZmOWY5J9TXceMh9h0nybfAjuJgGx1wBnH51w1VElk9pK0U42BSWwvI6c1Pqpzql3g8ecw/I4qmu5XDAHg5qzITNI0hwC7Fjk+pqhDnOEXr9wVFEAMA1Zaa3WweJomecn5ZCOAPSi1tZLx1S2RpJP7qijYbd7E1oBDcxSbvmHQV0mv3AGkWe/+OZcfgDXKyyCOcA2zRyI2Gz1Brqtb0+4uNEsniCSNE43KO27gH/GokrsuMrIdqdx5OgTEfxAKB9TWNobeZbMvpL/ADFa/iWL7LoVs2BKvmAHjgnB71g6NexwySK6rHkhl9CR2oSshSdz0Gdy+kID944jP5j+lWYwBEDjgViw3NzJal54oo4/9Zt+YsMd+OBx607VdbmtId9tbxzRKOcSAsc9DtHQUXJsznvF175mvwwqQVgVVP1Jyf5ium04gWyOD94fkR2rz65u557hppYVDsxYk5HNdx4cuba5tm/eBgozhwFCtjsc5p7AX9WmVdPlVSfMETYx/u15ntXk7sZ9a9Hvr2KXRrlIBaC+ClCrMBg9zn6Vw7WmpOhHkRj8f/r0XXcRUWEhA4YEH07U4wu44HHqDmui0p1s7Zre4tiQ4+diuQfbA60+6Ftcxslrp7RsRtSRgE2e+O9Tz6jsjM0OM3Antk/5axspHoSOK3LmG4juNNIQ7VXY3+96fpWfpdtPpsgkKpKxbkqcZHpW1JqhzhLXd0JLEKOOg71D3KUtDkprK8m1e7NrbvIY3YuFXOB711VpYFdHSERNiSL5ht6kjNJY6hNY+c0cUckk8pkkZjj8OBTPtt6G+W5dB2AVeB+VE1GSSuEZ8ruYul6RqEaWt4bd2tjKOVILAZ649M10c9qzwN+7kDe+aitb+5s7RbePY8YzkyZLcnPBHTGaW1v54pS02bhSMEOBx9OKU4wnqxwqcpyN5pd5BZNNLbSCFySj7TgHNRmGSOJJHiZYWAO7Pau5uL6O8dY7h7mGBuGWPBH44GcVYvL23SyW3tYomjOF2EcbfpitVUsiGkzho9zWwjtwoi2Eyb34zjnAqDT1cxSP5TNnAODtGO+T2roL2wiupk2jyoRndGrHDZ/lUH9kIgAhd0w2Rk5HvS50BjQGKPUojHExXIypOcn8atzWxgvHSGNVVWyQTzg89PpV+60mG5uRMPNhI6gMvP5dKuXiCbShZxh/MUYWSRs49yetVGokxNXOYeYiyEat16gdqqIR5ePeuvsrO3t9GeyuA8rvkF1Xp6Y+lY1v4b/fJ9ouD5e4b/LHO32z3odRMLWMzy3QZZSAfWopAS1d81poxsxaQxGJAD+9ZN77v61y+p6FL9tb7GwlhIB3n5Oe/FLnTHsZaRM0LsADg9B1qLy2GSRgZ4yK6nw5pkWm3hurxy0ijEYjXIGepNF/Zy6tqLZEUMTMFVnPCr6/WjmQzm5EJXOAFA61BCpbJBxiu61zT9KjsEjhhhDjAUouWI9frXHvp08sreTbSbSe64H607pi2I8FfmLDHfPQ1PazxopLxbgT03YxViz0W5YFZDEnHyhm6n0z2qSTw8VnRZLqHyyxDvHlyoH+z1NJtNDV1qijeSG4kMu0LkDO0cD3qADfDhBlgSK72zh03RtJaG3IvGc5dzgFvb1AHpU2m6NpssM00lrbEy9FA3BfX/Ipc6Bq55yygEp1I6Yrp/B0rNb3sB6KBIv48H+QrH1CzEOozRQqgKyEDa+c/hVzS3Gj3Lf2hBlZABtyQV56/wA6q4irr+BqGRx8nP1rqbeMmFD5Gf3KqJCBn7o/HFcpqpe8vXliQMpJA2ZPH863P7WZfDsNs25Zlj2Pn0//AFUAW7BPIPmSKRn2q9aOJL+6DPtBY4PTir8E9hLamcW6RAfeEiYxWFAZWmTyQWlbnpwc9c+1ICfWWQ2kR3qXMoIGeuAQTVvTiPs8YP8Ad7fU03UdIF3aA2ywpcxsCxReCPQGs1JtQtXWG63wWykr5nljnJ6Z7UmUh3jhQdMs2LAAynHr92uOSMYzuP4KTXojXFrcRoolV2XlWYb/AOdc9c6dCt1KFQbS24YyODz0zSUrCkYSW4b/AJat/wB+mNa+g6PA7zS3McsyqmUCjG4noMdT9KeNPiXOF/Mn/Gp4YWhGI5GQD/aNHOSWNQ0cXCxTTxtAzLsPmELux06e3H4UuiLJZTGOSS1EJ6iJsZPbt/PNNdppAA8rMOoBOabsJ6kgfWlzhcdq9haSRo1vcySXKkZGBhl9z0qSLVbm3sBbRWXmM3XccoPXPPNQGJs4LH86cI8cgnn3pc7C46e6v5rcWnkwLbk/OHO8sPTp/wDXqkukWyNuRZAR0O7pVspyOTQIhnmk5NgG25436hd7R/D5gUfpVo3M7IUa4kZCMFTjGPyqERoewyKUouBgc0rhdiEIeoH400wwdCkePTAp/lqOvJp4Cr0XJoERgRKANqcdBinblHcY9qXHsAaXaO2CRSARXTsaUMOpBpSuB7/SlAOPSgBN4HX+VAcep/Kn4A6kH8aU56d6QEQI5PNKXGe9P+bk44pc+tADNzc5TpTiSP4OT6GlyD1wPwpcnrkUARk4OSM+xNOyeu3j60/OegJHrS7VI4GPxoAj3HHT8KUtgHCingg//Xo69vzoAjDsekQ/GgM3dB74qQr7flQowTmgZES2eFH1zSbm7IPxNT/LSFcjoMUARfN/cX86b839zNT4xwetIwHXANFwISfYfSkBznci/hUhyD0IxSMR1NFwIyNv3V/WgjP8NSYPUAUmQOCD9TRcCE8dY/1ppGfuqQfrVnHpg0mBjJGDTAqlWHamMmSGYAsOlW2BHQ00g45GfpRcCoVHI2cHr6mq72duzZaAk/7xrQHB6UEDv3p3YGb9ithgrBg9QTzRdRzXEZVnjGR97yxkfjV8qO2aYVOeDT5mO5uz20Z0yZ7KBmkKHlgQMd+p64rnY32gAB14x9+k82TAVpZSOwLnFJyB/wDWpuQXL1vqTwx7BGrqexzTrnVJ57d4NkUcbjDBU6is9eTT8/SldhcFQL9zj6E1IARximq3NSZJ7cUhAAcUYwKXHvx2pCTnAFAB09aXeOAeKYMnjg04L1JyKQBz+FPXJ7/WmZwOegp24A9VoAcMn2pcAEYOfxox6HgGjAwKAFI6Uq5Xqwpu7nv7YoUjkcn8KAHcZzTiR6/rUZwTjuOxpckcgZoAcCCe/wBacAFHr64pgbJHBx7UpNFgH7gex9KXP1/Got4PTOacHOeOlFgH5zzjJ/nQMde/1phbnHBpQ59vpRYBSeuefxowByCabyfu4JpMt26/zosBIGyBn+VOGMDp9DUYPGDS9qVgJAeuBSAGosE84Ip4yM4IFFgHYyelOAAPf86j3djye9GWxx0p2AlxweaAPT+VRc9z+RpwPPB4osA8Eg/hmkHJ4b8KaT3pm5lGQM0ASMG96F3Aev8AOmqxPU8elLySc5oADknIJoI45NNByw3Age1N3E9c496VgHBQD1pfxBHrTc45xTWBz04osMXH93PHpSnpzj8aaEPTIxRtyfvj8aAA4I64PtSHI6HIHvSEbeQaQ59TTAMMevT60hyM9qUg8c8Uh+vFADSPpn3FIW5xkYp5/wA5pjdKAKYBznNKOaPMQDkr7c4pRLEx4YH6VVhCck/KMfjTx37e1J5sY/jXNBmiXncPrmiwDs+360oJPr+VM+0RDH7xc+lI11GOBgn0osBITJ1VeKVc4Iz+QqE3cfQk/wDfJpftkZJX5sj/AGTSswJhnOMEUoBI6jn3qH7XEOnPPbnFKt5HkcN+VOzAnCAj1pxBC4Haqxv419h/KkOooFBAP1AoswLYGR0yaAmRkNVL+1Ij1HAPbB/rSrqkB67vbpRZgXBH9T+FO2EccYqkNUjyDg/iRTG1dFHEef8AgVFmBfMeOrZx60uwjk7vzrMOsd/LH4t3/KhdVbGfK/Jv/rU+VganI75oA6+vtWUNWbPMYA/3v/rUHVmI/wBWvvkmjlA1hyQP5U7OAOM1itrDdFjUH3Jpr604IwkX5Hn9afKBt5weg/OlwMZrnzrkwPHl/wDfP/16jOt3OPvqAf8AZFHKB0gAwDwaCQeR+lc4mtT9fMX6iMZo/taYsSZDyCOgo5QOj4HPPNKCFH/1q5v+1JVXAkA9Twf6Uf2vKE2mYkemB/hRygdJuGODikBRTnzFH41y0uqSNx5jke5qIalKP4mx6bqOUDrhJHyAyH1wwpRIo6MvtyK4/wC3sWJJP50fbmJzk/nRygdgZIlwXkUA/wC0KPNjxnzI8eziuPa939fwyc4/Wk+14ONxI7HP/wBenygdk0saDLOgH+9imNPAv3p4wPUsK5A3pfG9iQOxPX8c003nbJ/A/wD16OUZ2DXdqqZNxH+BpqXtuTgSj865A3bMSemewpBcFenbpRyCOy+125z868DmmG+tQQfNH4rmuRF2QMHn8Ka10WzwKOQLnX/b7RBnzc/8BNH9o2+NpYn22muP+0NSG4fOQaORAdZ/adru25Pt8pxTW1S2zgBj7gVyZmc96QzPjrT5EB1J1WAnuST6U4alETjacjnGOa5Pz37scU9bt1GASPoaOQDpf7ThBGcjnpmmvqkS9Dk9ODmucF0wPH60C8kxjP60co7nQNqoAOFPHrim/wBrDuo/Guead26mkMzHuaOULl8yE9W46daDcDjDEepzVXJA4pCcHFOwiyZSuPmB/GkNx6HnOM5qqGNJu9h1osBa8/370v2kgYHHHbvVVSS2M0Mx69wetFgLJuicgsMemKRbsg9P5f4VVLGm55osBea7J9B+ApouGHQ1WB5xTh3p2AnNwec5J+tRfaHBPP5UhqJutFgJvtMnYnp6mjzmx1qvk09etFgJvOb1IH1pDI2epP403pTc8mgB28+tAcimZozmgCQuSKTeaYTSZNAEhc9zTS+e9Rk8UZoAcTSZpKM8UALmnBjTM80ooAfk+tBz1PemjmnE/IB2GaAGmkoNNzTAdSUUmaAFyaTNBpKAFopKKAJBS0wU6gAopKKAFopKDQAE0maQ0lAC0UlFAC0lLSUAFFFFAH//2Q==" alt="TBD 2025" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.4s"}}
                onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"} />
            </div>
            <div style={{gridColumn:"2 / span 2",overflow:"hidden",borderRadius:12,height:180}}>
              <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#0E5A8A,#0B3D5E)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8}}>
                <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:36,color:"#FFB800",textAlign:"center"}}>SBU3 YEAR-END 2025</div>
                <div style={{fontSize:13,color:"rgba(255,248,238,0.6)",textAlign:"center",letterSpacing:"0.2em"}}>CÙNG NHAU — MẠNH HƠN</div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* FORM */}
      <div id="reg-form" style={{background:"linear-gradient(180deg,#0D4A70 0%,#0B3D5E 100%)",padding:"72px 32px 96px",borderTop:"4px solid #4DD0E1"}}>
        <div style={{maxWidth:660,margin:"0 auto"}}>
          <div style={{fontSize:11,letterSpacing:"0.4em",textTransform:"uppercase",color:"#FFB800",marginBottom:14,fontWeight:700}}>Đăng ký tham gia</div>
          <h2 style={{fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(34px,6vw,64px)",lineHeight:1,marginBottom:12}}>ĐIỀN FORM —<br />LÊN ĐƯỜNG THÔI! 🔥</h2>
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
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <Radio value="yes" label="🔥 Chắc chắn đi!" selected={form.attend==="yes"} onSelect={v=>set("attend",v)} />
              <Radio value="maybe" label="🤔 Có thể đi" selected={form.attend==="maybe"} onSelect={v=>set("attend",v)} />
              <Radio value="no" label="😢 Không đi được" selected={form.attend==="no"} onSelect={v=>set("attend",v)} />
            </div>
          </div>

          {(form.attend==="yes"||form.attend==="maybe") && (
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
            color:"white", fontFamily:"Bebas Neue,sans-serif", fontSize:24, letterSpacing:"0.15em",
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
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B3D5E,#0E5A8A)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"Saira,sans-serif"}}>
      <style>{css}</style>
      <div style={{background:"rgba(13,78,117,0.9)",border:"1px solid rgba(77,208,225,0.4)",borderRadius:24,padding:"52px 44px",textAlign:"center",maxWidth:440,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>
        <div style={{fontSize:68,marginBottom:20}}>🎉</div>
        <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:44,color:"#FFB800",marginBottom:14}}>ĐĂNG KÝ THÀNH CÔNG!</div>
        <p style={{fontSize:16,color:"rgba(255,248,238,0.8)",lineHeight:1.75}}>
          Chào mừng chiến binh <strong style={{color:"#FFB800"}}>{name}</strong> đã chính thức gia nhập<br />
          <strong>BIỆT ĐỘI KIẾN TẠO NIỀM VUI!</strong><br /><br />
          Chuẩn bị tinh thần — <span style={{color:"#29B6F6"}}>27/06 lên đường thôi! 🔥</span>
        </p>
        <button onClick={onBack} style={{marginTop:28,padding:"12px 40px",border:"1px solid #29B6F6",borderRadius:6,color:"#29B6F6",background:"transparent",fontFamily:"Saira,sans-serif",fontSize:14,fontWeight:700,letterSpacing:"0.1em",cursor:"pointer"}}>
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
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0B3D5E,#0E5A8A)",display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"Saira,sans-serif"}}>
      <style>{css}</style>
      <div style={{background:"rgba(13,78,117,0.9)",border:"1px solid rgba(77,208,225,0.4)",borderRadius:20,padding:"44px 40px",maxWidth:360,width:"100%",textAlign:"center"}}>
        <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:38,color:"#FFB800",marginBottom:8}}>🔐 ADMIN</div>
        <div style={{fontSize:14,color:"rgba(255,255,255,0.5)",marginBottom:28}}>Chỉ dành cho BTC Team Building 2026</div>
        <input type="password" placeholder="Mật khẩu BTC" value={pw}
          onChange={e=>{setPw(e.target.value);setErr(false);}}
          onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{width:"100%",background:err?"rgba(41,182,246,0.1)":"rgba(255,255,255,0.07)",border:"1px solid "+(err?"#29B6F6":"rgba(255,255,255,0.15)"),borderRadius:8,padding:"13px 16px",color:"#FFF8EE",marginBottom:8,fontFamily:"Saira,sans-serif",fontSize:15,outline:"none",textAlign:"center",letterSpacing:"0.2em"}} />
        {err && <div style={{color:"#29B6F6",fontSize:12,marginBottom:8}}>Sai mật khẩu. Thử lại nhé!</div>}
        <button onClick={submit} style={{width:"100%",marginTop:12,background:"#29B6F6",border:"none",borderRadius:8,padding:14,color:"white",fontFamily:"Bebas Neue,sans-serif",fontSize:20,letterSpacing:"0.1em",cursor:"pointer"}}>VÀO XEM DATA</button>
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
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#0B3D5E,#093550)",color:"#FFF8EE",fontFamily:"Saira,sans-serif",padding:32}}>
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
            <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:40,color:"#FFB800",lineHeight:1}}>ADMIN — DANH SÁCH ĐĂNG KÝ</div>
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
              <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:44,color,lineHeight:1}}>{val}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <input
            placeholder="🔍  Tìm theo tên, email, SĐT..."
            value={search} onChange={e=>setSearch(e.target.value)}
            style={{flex:1,maxWidth:400,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"11px 16px",color:"#FFF8EE",fontFamily:"Saira,sans-serif",fontSize:14,outline:"none"}}
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
            <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:26,color:"#FFF8EE",marginBottom:8}}>XÁC NHẬN XÓA</div>
            <div style={{fontSize:14,color:"rgba(255,248,238,0.6)",marginBottom:28}}>Hành động này không thể hoàn tác.</div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>deleteRow(confirmId)} style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#ef5350,#c62828)",border:"none",borderRadius:8,color:"white",fontFamily:"Bebas Neue,sans-serif",fontSize:18,letterSpacing:"0.1em",cursor:"pointer"}}>XÓA</button>
              <button onClick={()=>setConfirmId(null)} style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,color:"#FFF8EE",fontSize:14,cursor:"pointer"}}>Huỷ</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal sửa */}
      {editing && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:"rgba(14,77,117,0.8)",border:"1px solid #0288D1",borderRadius:16,padding:32,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto"}}>
            <div style={{fontFamily:"Bebas Neue,sans-serif",fontSize:28,color:"#FFB800",marginBottom:24}}>CHỈNH SỬA THÔNG TIN</div>
            {[
              ["Họ và tên","fullname","text"],
              ["Tên thân mật","nickname","text"],
              ["Email","email","email"],
              ["Số điện thoại","phone","tel"],
            ].map(([lbl,key,type])=>(
              <div key={key} style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>{lbl}</div>
                <input type={type} value={editing.data[key]||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,[key]:e.target.value}}))}
                  style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Saira,sans-serif",fontSize:14,outline:"none"}} />
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Tham gia</div>
              <select value={editing.data.attend||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,attend:e.target.value}}))}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Saira,sans-serif",fontSize:14,outline:"none",appearance:"none"}}>
                <option value="yes">Chắc chắn đi</option>
                <option value="maybe">Có thể đi</option>
                <option value="no">Không đi</option>
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Ở lại đêm</div>
              <select value={editing.data.overnight||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,overnight:e.target.value}}))}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Saira,sans-serif",fontSize:14,outline:"none",appearance:"none"}}>
                <option value="">Chưa chọn</option>
                <option value="yes">Ở lại đêm</option>
                <option value="no">Về tối</option>
              </select>
            </div>
            <div style={{marginBottom:24}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:6}}>Dị ứng / Lưu ý</div>
              <textarea value={editing.data.notes||""} onChange={e=>setEditing(ed=>({...ed,data:{...ed.data,notes:e.target.value}}))} rows={3}
                style={{width:"100%",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:6,padding:"10px 14px",color:"#FFF8EE",fontFamily:"Saira,sans-serif",fontSize:14,outline:"none",resize:"vertical"}} />
            </div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={saveEdit} style={{flex:1,padding:"12px",background:"#29B6F6",border:"none",borderRadius:8,color:"white",fontFamily:"Bebas Neue,sans-serif",fontSize:18,letterSpacing:"0.1em",cursor:"pointer"}}>LƯU LẠI</button>
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
