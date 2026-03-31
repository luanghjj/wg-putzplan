export const ALL_PERMS=["manage_rooms","manage_residents","manage_roles","edit_rules","config_sheets","edit_tasks","check_own_area","check_all","view_history","export_data","reset_week"];
export const CRIT_PERMS=["manage_rooms","manage_roles","config_sheets","reset_week"];
export const OWNER={id:"owner-1",name:"Origami",password:"origami",role:"owner",room:"—",roomId:null};

export const DEF={
  lang:"vi", masterPin:"1234", users:[{...OWNER}], rooms:[], completions:[], sheetsUrl:"",
  penaltyRate:5, rewardText:"Wird von den anderen bekocht! 🍳", refPhotos:{}, tutorials:{
    "task-Geschirr spülen / abräumen": {
      steps:[
        {textDe:"Gạt thức ăn thừa: Đổ hết thức ăn thừa và xương xẩu vào thùng rác.",textVi:"Gạt thức ăn thừa: Đổ hết thức ăn thừa và xương xẩu vào thùng rác.",photo:null},
        {textDe:"Gom bát đĩa: Xếp gọn bát đĩa, ly tách và mang đến bồn rửa. Nên ngâm những nồi chảo bị dính chặt thức ăn với nước trước.",textVi:"Gom bát đĩa: Xếp gọn bát đĩa, ly tách và mang đến bồn rửa. Nên ngâm những nồi chảo bị dính chặt thức ăn với nước trước.",photo:null},
        {textDe:"Lau sạch bàn: Dùng khăn ẩm (có thể thêm chút nước lau bàn) để lau sạch dầu mỡ và thức ăn rơi vãi trên mặt bàn.",textVi:"Lau sạch bàn: Dùng khăn ẩm (có thể thêm chút nước lau bàn) để lau sạch dầu mỡ và thức ăn rơi vãi trên mặt bàn.",photo:null},
        {textDe:"Phân loại và tráng sơ: Tráng qua tất cả bát đĩa dưới vòi nước để trôi bớt lớp dầu mỡ bề mặt.",textVi:"Phân loại và tráng sơ: Tráng qua tất cả bát đĩa dưới vòi nước để trôi bớt lớp dầu mỡ bề mặt.",photo:null},
        {textDe:"Rửa với nước rửa chén: Dùng miếng bọt biển tạo bọt và rửa theo thứ tự: đồ ít bẩn rửa trước, đồ nhiều bẩn rửa sau (Ly tách thủy tinh ➔ Bát đĩa ăn cơm ➔ Xoong, nồi, chảo nhiều dầu mỡ).",textVi:"Rửa với nước rửa chén: Dùng miếng bọt biển tạo bọt và rửa theo thứ tự: đồ ít bẩn rửa trước, đồ nhiều bẩn rửa sau (Ly tách thủy tinh ➔ Bát đĩa ăn cơm ➔ Xoong, nồi, chảo nhiều dầu mỡ).",photo:null},
        {textDe:"Tráng sạch: Rửa lại từng món dưới vòi nước sạch từ 1 đến 2 lần cho đến khi sạch hoàn toàn bọt và không còn cảm giác nhờn rít.",textVi:"Tráng sạch: Rửa lại từng món dưới vòi nước sạch từ 1 đến 2 lần cho đến khi sạch hoàn toàn bọt và không còn cảm giác nhờn rít.",photo:null},
        {textDe:"Úp ráo nước: Úp bát đĩa, xoong nồi lên giá hoặc rổ cho ráo hẳn nước trước khi cất vào tủ để tránh ẩm mốc. Đầu đũa và thìa nên hướng lên trên để nhanh khô.",textVi:"Úp ráo nước: Úp bát đĩa, xoong nồi lên giá hoặc rổ cho ráo hẳn nước trước khi cất vào tủ để tránh ẩm mốc. Đầu đũa và thìa nên hướng lên trên để nhanh khô.",photo:null}
      ],
      videoUrl:""
    }
  },
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
    {id:"kitchen",color:"#3B82F6",bg:"#EFF6FF",tasks:[{de:"Küchenboden fegen & wischen",vi:"Quét & lau sàn bếp",pts:3},{de:"Spüle & Armaturen reinigen",vi:"Vệ sinh bồn rửa & vòi",pts:3},{de:"Herd, Backofen & Regale putzen",vi:"Chà bếp, lò nướng & kệ bếp",pts:3},{de:"Kühlschrank (innen & außen) & Schränke reinigen",vi:"Dọn tủ lạnh (trong & ngoài) & lau tủ bếp",pts:3},{de:"Mülleimer reinigen & Glastüren putzen",vi:"Rửa thùng rác & lau cửa kính",pts:2}]},
    {id:"bathroom",color:"#F59E0B",bg:"#FFFBEB",tasks:[{de:"Toilette putzen (innen & außen)",vi:"Vệ sinh toilet",pts:3},{de:"Waschbecken & Spiegel reinigen",vi:"Lau bồn rửa & gương",pts:3},{de:"Dusche / Badewanne reinigen",vi:"Vệ sinh vòi sen / bồn tắm",pts:3},{de:"Boden saugen & wischen",vi:"Hút bụi & lau sàn",pts:3},{de:"Handtücher wechseln, Regale ordnen & Waschmaschine reinigen",vi:"Thay khăn, sắp kệ gọn & vệ sinh máy giặt",pts:2}]},
    {id:"common",color:"#10B981",bg:"#ECFDF5",tasks:[{de:"Flur, Eingang & Treppenhaus reinigen, Schuhe ordnen",vi:"Lau hành lang, cửa ra vào & cầu thang, xếp giày gọn",pts:3},{de:"Wohnzimmer saugen & Böden wischen",vi:"Hút bụi phòng khách & lau sàn khu vực chung",pts:3},{de:"Tische, Regale, Türgriffe & Lichtschalter abwischen",vi:"Lau bàn, kệ, tay nắm cửa & công tắc đèn",pts:2},{de:"Fenster reinigen & Balkon aufräumen",vi:"Lau cửa sổ & dọn ban công",pts:3},{de:"Müll rausbringen & Mülleimer reinigen",vi:"Đổ rác khi đầy & rửa thùng rác",pts:2}]},
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
