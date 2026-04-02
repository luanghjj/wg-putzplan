import { useState, useRef } from "react";
import { F, C, btnS } from "../styles";
import { RULES } from "../data/constants";
import { compImg } from "../utils/helpers";
import { supabase } from "../data/supabase";

const categoryColors = [
  {gradient:"linear-gradient(135deg, #007AFF, #5856D6)", light:"rgba(0,122,255,0.06)"},
  {gradient:"linear-gradient(135deg, #5856D6, #BF5AF2)", light:"rgba(88,86,214,0.06)"},
  {gradient:"linear-gradient(135deg, #FF9F0A, #FF375F)", light:"rgba(255,159,10,0.06)"},
  {gradient:"linear-gradient(135deg, #30D158, #64D2FF)", light:"rgba(48,209,88,0.06)"},
  {gradient:"linear-gradient(135deg, #FF375F, #FF453A)", light:"rgba(255,55,95,0.06)"},
  {gradient:"linear-gradient(135deg, #64D2FF, #007AFF)", light:"rgba(100,210,255,0.06)"},
  {gradient:"linear-gradient(135deg, #34C759, #30D158)", light:"rgba(52,199,89,0.06)"},
];

const TRASH_COLORS = {
  "schwarze":"#1C1C1E", "đen":"#1C1C1E",
  "braune":"#8B5E3C", "nâu":"#8B5E3C",
  "blaue":"#007AFF", "xanh":"#007AFF",
  "Gelber":"#FFD60A", "vàng":"#FFD60A",
};

function getTrashDot(text){
  for(const[k,c] of Object.entries(TRASH_COLORS)){
    if(text.includes(k)) return c;
  }
  return null;
}

export default function RulesScreen({t,lang,st,user,sv,show}){
  const isVi=lang==="vi";
  const managers=st.users.filter(u=>u.role==="manager");
  const mp1=st.managerPhoto1||null;
  const mp2=st.managerPhoto2||null;
  const m1=managers[0];
  const m2=managers[1];
  const isManager=user&&(user.role==="owner"||user.role==="manager");

  // Trash photos state from config
  const trashPhotos=st.trashPhotos||[];
  const [uploading,setUploading]=useState(false);
  const [viewPhoto,setViewPhoto]=useState(null);
  const fileRef=useRef();

  const handleUpload=async(e)=>{
    const files=Array.from(e.target.files||[]);
    if(!files.length) return;
    setUploading(true);
    try{
      const newPhotos=[...trashPhotos];
      for(const file of files){
        const compressed=await compImg(file,800,0.6);
        newPhotos.push(compressed);
      }
      // Save to config via sv
      await sv({...st, trashPhotos:newPhotos});
      if(show) show(isVi?"✓ Ảnh đã tải lên!":"✓ Foto hochgeladen!","success");
    }catch(err){
      console.error("Upload error:",err);
      if(show) show(isVi?"Lỗi tải ảnh":"Fehler beim Hochladen","error");
    }
    setUploading(false);
    if(fileRef.current) fileRef.current.value="";
  };

  const removePhoto=async(idx)=>{
    const newPhotos=trashPhotos.filter((_,i)=>i!==idx);
    await sv({...st, trashPhotos:newPhotos});
    if(show) show(isVi?"✓ Đã xoá ảnh":"✓ Foto gelöscht","success");
  };

  return <div>
    <h2 style={{fontSize:28,fontWeight:800,color:C.text,margin:"0 0 20px",fontFamily:F,letterSpacing:"-0.03em"}}>
      {t.rulesTitle}
    </h2>

    {/* Manager Contact */}
    {managers.length>0&&<div style={{
      background:C.white,borderRadius:20,padding:24,marginBottom:16,
      boxShadow:C.shadowSm,
    }}>
      <div style={{display:"flex",justifyContent:"center",gap:32,marginBottom:16}}>
        {[{photo:mp1,mgr:m1},{photo:mp2,mgr:m2}].filter(x=>x.mgr).map((x,i)=>
          <div key={i} style={{textAlign:"center"}}>
            <div style={{
              width:72,height:72,borderRadius:36,overflow:"hidden",
              margin:"0 auto 10px",
              background:`linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              padding:2,
            }}>
              <div style={{width:"100%",height:"100%",borderRadius:35,overflow:"hidden",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {x.photo?<img src={x.photo} alt={x.mgr?.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                :<span style={{fontSize:24,fontWeight:700,color:C.textSecondary}}>{x.mgr?.name?.[0]||"?"}</span>}
              </div>
            </div>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{x.mgr?.name}</div>
            <div style={{fontSize:12,color:C.textSecondary}}>{x.mgr?.room}</div>
          </div>
        )}
      </div>
      <div style={{textAlign:"center",fontSize:14,color:C.textSecondary,lineHeight:1.5}}>
        {isVi?"Mọi thắc mắc xin liên hệ với 2 quản lý":"Bei Fragen wenden Sie sich bitte an die 2 Manager"}
      </div>
    </div>}

    {/* Rules — gradient accent cards */}
    {RULES.map((cat,ci)=>{
      const clr=categoryColors[ci%categoryColors.length];
      const isTrashSection=cat.hasPhotos;
      return <div key={ci} style={{
        background:C.white,borderRadius:16,padding:0,marginBottom:10,
        boxShadow:C.shadowSm,overflow:"hidden",
      }}>
        {/* Category header with gradient bar */}
        <div style={{
          padding:"14px 16px",
          background:clr.light,
          display:"flex",alignItems:"center",gap:10,
          borderBottom:"1px solid rgba(0,0,0,0.03)",
        }}>
          <div style={{
            width:32,height:32,borderRadius:10,
            background:clr.gradient,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,
            boxShadow:"0 2px 8px rgba(0,0,0,0.1)",
          }}>{cat.icon}</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{isVi?cat.catVi:cat.catDe}</div>
            <div style={{fontSize:11,color:C.textSecondary}}>{isVi?cat.catDe:cat.catVi}</div>
          </div>
        </div>
        {/* Trash section → photo gallery FIRST */}
        {isTrashSection&&<div style={{
          padding:"12px 16px 4px",
        }}>
          <div style={{
            fontSize:13,fontWeight:600,color:C.textSecondary,
            margin:"0 0 10px",display:"flex",alignItems:"center",gap:6,
          }}>
            📷 {isVi?"Ảnh minh hoạ khu vực đổ rác":"Fotos vom Müllbereich"}
          </div>

          {/* Photo grid */}
          {trashPhotos.length>0&&<div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(100px, 1fr))",
            gap:8,marginBottom:12,
          }}>
            {trashPhotos.map((photo,pi)=>(
              <div key={pi} style={{
                position:"relative",borderRadius:10,overflow:"hidden",
                aspectRatio:"1",background:"#f0f0f0",
                cursor:"pointer",
                boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                transition:"transform 0.2s",
              }}
                onClick={()=>setViewPhoto(photo)}
                onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
              >
                <img src={photo} alt={`trash-${pi}`} style={{
                  width:"100%",height:"100%",objectFit:"cover",
                }}/>
                {isManager&&<button
                  onClick={(e)=>{e.stopPropagation();removePhoto(pi);}}
                  style={{
                    position:"absolute",top:4,right:4,
                    width:22,height:22,borderRadius:11,
                    background:"rgba(0,0,0,0.6)",color:"#fff",
                    border:"none",fontSize:13,cursor:"pointer",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    lineHeight:"1",
                    backdropFilter:"blur(4px)",
                  }}
                >×</button>}
              </div>
            ))}
          </div>}

          {trashPhotos.length===0&&<div style={{
            padding:"20px 16px",
            background:"rgba(120,120,128,0.04)",
            borderRadius:12,
            textAlign:"center",
            color:C.textSecondary,
            fontSize:13,
          }}>
            {isVi?"Chưa có ảnh minh hoạ":"Noch keine Fotos vorhanden"}
          </div>}

          {/* Upload button — managers/owners only */}
          {isManager&&<div style={{marginTop:10}}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{display:"none"}}
              onChange={handleUpload}
            />
            <button
              onClick={()=>fileRef.current?.click()}
              disabled={uploading}
              style={{
                width:"100%",
                padding:"12px 16px",
                background:uploading?"rgba(120,120,128,0.08)":"rgba(0,122,255,0.06)",
                border:"2px dashed rgba(0,122,255,0.2)",
                borderRadius:12,
                color:uploading?C.textSecondary:C.accent,
                fontSize:14,fontWeight:600,
                cursor:uploading?"wait":"pointer",
                fontFamily:F,
                display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                transition:"all 0.2s",
              }}
            >
              {uploading
                ?<><span style={{display:"inline-block",width:14,height:14,border:"2px solid #ccc",borderTopColor:C.accent,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
                  {isVi?"Đang tải...":"Wird hochgeladen..."}</>
                :<>📤 {isVi?"Tải ảnh lên":"Fotos hochladen"}</>
              }
            </button>
          </div>}
        </div>}

        {/* Divider between photos and rules */}
        {isTrashSection&&<div style={{
          margin:"4px 16px 0",
          borderTop:"1px solid rgba(0,0,0,0.04)",
          paddingTop:4,
        }}>
          <div style={{
            fontSize:13,fontWeight:600,color:C.textSecondary,
            margin:"8px 0 4px",display:"flex",alignItems:"center",gap:6,
          }}>
            📋 {isVi?"Quy định phân loại rác":"Regeln zur Mülltrennung"}
          </div>
        </div>}

        {/* Items */}
        <div style={{padding:"8px 16px 12px"}}>
          {cat.items.map((item,ii)=>{
            const trashColor=isTrashSection?getTrashDot(isVi?item.vi:item.de):null;
            return <div key={ii} style={{
              display:"flex",gap:10,padding:"10px 0",
              borderBottom:ii<cat.items.length-1?"1px solid rgba(0,0,0,0.03)":"none",
            }}>
              <div style={{
                width:trashColor?8:6, height:trashColor?8:6,
                borderRadius:trashColor?4:3,
                background:trashColor||C.accent,
                marginTop:6,flexShrink:0,
                border:trashColor==="#FFD60A"?"1px solid rgba(0,0,0,0.15)":"none",
                boxShadow:trashColor?`0 0 4px ${trashColor}40`:"none",
              }}/>
              <div>
                <div style={{fontSize:14,color:C.text,lineHeight:1.5,fontWeight:500}}>{isVi?item.vi:item.de}</div>
                <div style={{fontSize:12,color:C.textSecondary,lineHeight:1.4,marginTop:2}}>{isVi?item.de:item.vi}</div>
              </div>
            </div>;
          })}
        </div>

      </div>;
    })}

    {/* Full-screen photo viewer */}
    {viewPhoto&&<div
      onClick={()=>setViewPhoto(null)}
      style={{
        position:"fixed",inset:0,
        background:"rgba(0,0,0,0.85)",
        display:"flex",alignItems:"center",justifyContent:"center",
        zIndex:1000,padding:20,
        backdropFilter:"blur(20px)",
        WebkitBackdropFilter:"blur(20px)",
        animation:"fadeUp .25s ease-out",
        cursor:"zoom-out",
      }}
    >
      <div style={{position:"relative",maxWidth:"90vw",maxHeight:"85vh"}} onClick={e=>e.stopPropagation()}>
        <img src={viewPhoto} alt="trash area" style={{
          maxWidth:"90vw",maxHeight:"85vh",
          borderRadius:16,
          boxShadow:"0 20px 60px rgba(0,0,0,0.3)",
        }}/>
        <button
          onClick={()=>setViewPhoto(null)}
          style={{
            position:"absolute",top:-12,right:-12,
            width:36,height:36,borderRadius:18,
            background:"rgba(255,255,255,0.9)",color:"#000",
            border:"none",fontSize:20,fontWeight:700,
            cursor:"pointer",
            boxShadow:"0 2px 12px rgba(0,0,0,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}
        >×</button>
      </div>
    </div>}
  </div>;
}
