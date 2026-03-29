export const ALL_PERMS=["manage_rooms","manage_residents","manage_roles","edit_rules","config_sheets","edit_tasks","check_own_area","check_all","view_history","export_data","reset_week"];
export const CRIT_PERMS=["manage_rooms","manage_roles","config_sheets","reset_week"];
export const OWNER={id:"owner-1",name:"Origami",password:"origami",role:"owner",room:"—",roomId:null};

export const DEF={
  lang:"de", masterPin:"1234", users:[{...OWNER}], rooms:[], completions:[], sheetsUrl:"",
  penaltyRate:5, rewardText:"Wird von den anderen bekocht! 🍳", refPhotos:{}, tutorials:{},
  verifications:{}, announcements:[], reports:[], deadlineDay:0, deadlineHour:23, deadlineMin:59,
  maxDiffPercent:30, penaltyPerMissingPoint:2, catchUpEnabled:true,
  rolePerms:{owner:[...ALL_PERMS],manager:["manage_residents","check_own_area","check_all","view_history","export_data","reset_week","edit_tasks"],resident:["check_own_area","view_history"]},
  dailyTasks:[
    {de:"Geschirr spülen / abräumen",vi:"Rửa bát / dọn bàn",pts:1},
    {de:"Herd & Arbeitsflächen wischen",vi:"Lau bếp & mặt bàn",pts:1},
    {de:"Müll rausbringen (wenn voll)",vi:"Đổ rác (khi đầy)",pts:1},
    {de:"Schuhe ordentlich aufstellen",vi:"Xếp giày gọn gàng",pts:1},
    {de:"Toilette nach Benutzung säubern",vi:"Vệ sinh toilet sau khi dùng",pts:1},
    {de:"Spüle trockenwischen",vi:"Lau khô bồn rửa",pts:1},
  ],
  weeklyAreas:[
    {id:"kitchen",color:"#3B82F6",bg:"#EFF6FF",tasks:[{de:"Boden feucht wischen",vi:"Lau sàn ướt",pts:3},{de:"Spüle & Armaturen reinigen",vi:"Vệ sinh bồn rửa & vòi",pts:3},{de:"Herdplatten gründlich putzen",vi:"Chà bếp kỹ",pts:3},{de:"Kühlschrank außen wischen",vi:"Lau tủ lạnh ngoài",pts:2},{de:"Mülleimer reinigen",vi:"Rửa thùng rác",pts:2}]},
    {id:"bathroom",color:"#F59E0B",bg:"#FFFBEB",tasks:[{de:"Toilette putzen (innen & außen)",vi:"Vệ sinh toilet",pts:3},{de:"Waschbecken & Spiegel reinigen",vi:"Lau bồn rửa & gương",pts:3},{de:"Dusche / Badewanne reinigen",vi:"Vệ sinh vòi sen / bồn tắm",pts:3},{de:"Boden wischen",vi:"Lau sàn",pts:3},{de:"Handtücher wechseln",vi:"Thay khăn tắm",pts:2}]},
    {id:"common",color:"#10B981",bg:"#ECFDF5",tasks:[{de:"Flur saugen & wischen",vi:"Hút bụi & lau hành lang",pts:3},{de:"Wohnzimmer saugen",vi:"Hút bụi phòng khách",pts:3},{de:"Oberflächen abstauben",vi:"Lau bụi bề mặt",pts:2},{de:"Fenster reinigen",vi:"Lau cửa sổ",pts:3},{de:"Waschmaschine reinigen",vi:"Vệ sinh máy giặt",pts:2}]},
  ],
};

export const RULES=[
  {catDe:"Allgemeines",catVi:"Tổng quát",icon:"📋",items:[{de:"Gegenseitiger Respekt.",vi:"Tôn trọng lẫn nhau."},{de:"Probleme direkt ansprechen.",vi:"Nói trực tiếp."},{de:"Monatliches WG-Meeting.",vi:"Họp WG hàng tháng."}]},
  {catDe:"Ruhezeiten",catVi:"Giờ yên tĩnh",icon:"🌙",items:[{de:"22:00–07:00 (Mo–Fr), 23:00–09:00 (Sa–So).",vi:"22:00–07:00 (T2–T6), 23:00–09:00 (T7–CN)."},{de:"Musik auf Zimmerlautstärke nach 22 Uhr.",vi:"Nhạc mức phòng sau 22h."}]},
  {catDe:"Küche",catVi:"Nhà bếp",icon:"🍳",items:[{de:"Geschirr sofort spülen.",vi:"Rửa bát ngay."},{de:"Herd nach Benutzung reinigen.",vi:"Lau bếp sau khi dùng."},{de:"Müll trennen.",vi:"Phân loại rác."}]},
  {catDe:"Bad & WC",catVi:"Phòng tắm",icon:"🚿",items:[{de:"Nach dem Duschen lüften.",vi:"Thông gió sau khi tắm."},{de:"Haare aus Abfluss entfernen.",vi:"Lấy tóc khỏi ống thoát."}]},
  {catDe:"Besuch",catVi:"Khách",icon:"👥",items:[{de:"Mitbewohner informieren.",vi:"Thông báo bạn phòng."},{de:"Gäste max. 3 Nächte/Woche.",vi:"Khách tối đa 3 đêm/tuần."}]},
  {catDe:"Rauchen",catVi:"Hút thuốc",icon:"🚭",items:[{de:"Nur auf Balkon / vor der Tür.",vi:"Chỉ ở ban công / trước cửa."}]},
];
