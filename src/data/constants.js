export const ALL_PERMS=["manage_rooms","manage_residents","manage_roles","edit_rules","config_sheets","edit_tasks","check_own_area","check_all","view_history","export_data","reset_week"];
export const CRIT_PERMS=["manage_rooms","manage_roles","config_sheets","reset_week"];
export const OWNER={id:"owner-1",name:"Origami",password:"origami",role:"owner",room:"—",roomId:null};

export const DEF={
  lang:"vi", masterPin:"1234", users:[{...OWNER}], rooms:[], history:[], sheetsUrl:"",
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
    },
    "task-Herd & Arbeitsflächen wischen": {
      steps:[
        {textDe:"Essensreste entfernen: Alle Krümel und Speisereste von Herdplatten und Arbeitsflächen mit einem trockenen Tuch oder Küchenpapier abwischen.",textVi:"Dọn thức ăn thừa: Dùng khăn khô hoặc giấy bếp lau sạch mọi vụn thức ăn trên bếp và mặt bàn.",photo:null},
        {textDe:"Arbeitsflächen reinigen: Feuchtes Tuch mit etwas Spülmittel nehmen und alle Arbeitsflächen gründlich abwischen. Auf Flecken und klebrige Stellen achten.",textVi:"Lau mặt bàn: Dùng khăn ẩm với một ít nước rửa chén, lau kỹ toàn bộ mặt bàn bếp. Chú ý các vết bẩn và chỗ dính.",photo:null},
        {textDe:"Herdplatten reinigen: Herdplatten mit Spülmittel und einem Schwamm abwischen. Bei eingebrannten Resten etwas einwirken lassen.",textVi:"Lau mặt bếp: Dùng miếng bọt biển với nước rửa chén lau sạch các mặt bếp. Nếu có vết cháy dính, ngâm một chút rồi chà.",photo:null},
        {textDe:"Nachtrocknen: Alle gereinigten Flächen mit einem trockenen Tuch nachwischen, damit keine Wasserflecken entstehen.",textVi:"Lau khô: Dùng khăn khô lau lại tất cả các bề mặt đã rửa để không bị vết nước.",photo:null}
      ],
      videoUrl:""
    },
    "task-Müll rausbringen (wenn voll)": {
      steps:[
        {textDe:"Müllbeutel prüfen: Kontrollieren ob der Müllbeutel voll ist oder riecht.",textVi:"Kiểm tra túi rác: Xem túi rác đã đầy hoặc có mùi chưa.",photo:null},
        {textDe:"Beutel verschließen: Müllbeutel gut zuknoten, damit nichts herausfällt oder ausläuft.",textVi:"Buộc túi rác: Buộc chặt miệng túi rác để không rơi vãi hoặc rỉ nước.",photo:null},
        {textDe:"Müll richtig trennen: Restmüll, Biomüll, Papier und Verpackungen (Gelber Sack) in die richtigen Tonnen bringen.",textVi:"Phân loại rác: Mang rác thải chung, rác hữu cơ, giấy và bao bì vào đúng thùng phân loại.",photo:null},
        {textDe:"Neuen Beutel einlegen: Sofort einen neuen Müllbeutel in den Eimer einsetzen.",textVi:"Thay túi mới: Lắp túi rác mới vào thùng ngay sau khi đổ.",photo:null}
      ],
      videoUrl:""
    },
    "task-Schuhe ordentlich aufstellen": {
      steps:[
        {textDe:"Schuhe sammeln: Alle herumliegenden Schuhe im Eingangsbereich zusammensammeln.",textVi:"Gom giày: Thu gom tất cả giày dép đang để lung tung ở khu vực cửa ra vào.",photo:null},
        {textDe:"Paarweise aufstellen: Schuhe paarweise nebeneinander ordentlich auf das Schuhregal oder die Matte stellen.",textVi:"Xếp từng đôi: Xếp giày dép thành từng đôi gọn gàng lên kệ giày hoặc thảm.",photo:null},
        {textDe:"Schuhbereich sauber halten: Schmutz und Sand vom Boden rund um den Schuhbereich aufkehren.",textVi:"Giữ sạch khu vực giày: Quét sạch bụi bẩn và cát xung quanh khu để giày.",photo:null}
      ],
      videoUrl:""
    },
    "task-Toilette nach Benutzung säubern": {
      steps:[
        {textDe:"Toilettenbürste benutzen: Nach jeder Benutzung die Toilettenschüssel mit der Bürste schrubben, besonders unter dem Rand.",textVi:"Dùng bàn chải toilet: Sau mỗi lần sử dụng, chà rửa bồn cầu bằng bàn chải, đặc biệt phần dưới viền.",photo:null},
        {textDe:"Spülen: Gründlich spülen und sicherstellen, dass alles sauber weggespült wurde.",textVi:"Xả nước: Xả nước kỹ và đảm bảo mọi thứ đã được rửa trôi sạch.",photo:null},
        {textDe:"Sitz & Brille abwischen: Toilettensitz und -brille mit Toilettenpapier oder feuchtem Tuch abwischen, wenn nötig.",textVi:"Lau bệ ngồi: Dùng giấy vệ sinh hoặc khăn ẩm lau sạch bệ ngồi và nắp toilet nếu cần.",photo:null},
        {textDe:"Lüften: Fenster öffnen oder Lüfter anschalten für frische Luft.",textVi:"Thông gió: Mở cửa sổ hoặc bật quạt thông gió để thoáng khí.",photo:null}
      ],
      videoUrl:""
    },
    "task-Spüle trockenwischen": {
      steps:[
        {textDe:"Reste entfernen: Essensreste aus der Spüle und dem Sieb entfernen und in den Müll werfen.",textVi:"Dọn thức ăn thừa: Lấy hết thức ăn thừa trong bồn rửa và lưới lọc, bỏ vào thùng rác.",photo:null},
        {textDe:"Spüle auswischen: Mit einem sauberen Tuch die gesamte Spüle auswischen, einschließlich der Ränder und der Armatur.",textVi:"Lau bồn rửa: Dùng khăn sạch lau toàn bộ bồn rửa, bao gồm viền và vòi nước.",photo:null},
        {textDe:"Trockenwischen: Mit einem trockenen Tuch die Spüle und Armatur gründlich trockenwischen, damit keine Kalkflecken entstehen.",textVi:"Lau khô: Dùng khăn khô lau kỹ bồn rửa và vòi nước để không bị vết cặn canxi.",photo:null}
      ],
      videoUrl:""
    },
    "task-Küchenboden fegen & wischen": {
      steps:[
        {textDe:"Boden freiräumen: Stühle hochstellen und lose Gegenstände vom Boden entfernen.",textVi:"Dọn sàn: Kê ghế lên và dọn các vật dụng trên sàn.",photo:null},
        {textDe:"Fegen: Den gesamten Küchenboden gründlich fegen, besonders unter dem Tisch und in den Ecken.",textVi:"Quét sàn: Quét kỹ toàn bộ sàn bếp, đặc biệt dưới bàn và các góc.",photo:null},
        {textDe:"Wischen: Mit einem feuchten Wischmopp und etwas Bodenreiniger den Boden wischen. Bei hartnäckigen Flecken stärker schrubben.",textVi:"Lau sàn: Dùng cây lau sàn ẩm với một ít nước lau sàn. Chà mạnh hơn với các vết bẩn cứng đầu.",photo:null},
        {textDe:"Trocknen lassen: Boden kurz trocknen lassen, bevor Stühle wieder heruntergestellt werden.",textVi:"Để khô: Chờ sàn khô rồi mới kê ghế lại.",photo:null}
      ],
      videoUrl:""
    },
    "task-Spüle & Armaturen reinigen": {
      steps:[
        {textDe:"Spüle leeren: Alle Gegenstände aus der Spüle entfernen. Sieb herausnehmen und reinigen.",textVi:"Dọn bồn rửa: Lấy hết đồ ra khỏi bồn. Tháo lưới lọc và rửa sạch.",photo:null},
        {textDe:"Spüle schrubben: Mit Reinigungsmittel und Schwamm die gesamte Spüle innen und außen gründlich schrubben.",textVi:"Chà bồn rửa: Dùng nước tẩy rửa và miếng bọt biển chà kỹ toàn bộ bồn rửa trong và ngoài.",photo:null},
        {textDe:"Armaturen polieren: Armatur und Wasserhahn mit einem feuchten Tuch und etwas Reiniger abwischen. Mit trockenem Tuch polieren bis sie glänzen.",textVi:"Đánh bóng vòi nước: Dùng khăn ẩm với chút nước tẩy lau vòi nước. Lau khô bằng khăn khô cho đến khi sáng bóng.",photo:null},
        {textDe:"Abfluss reinigen: Heißes Wasser durch den Abfluss laufen lassen. Bei Bedarf mit Backpulver und Essig reinigen.",textVi:"Thông cống: Xả nước nóng qua ống thoát. Nếu cần, dùng baking soda và giấm để thông.",photo:null}
      ],
      videoUrl:""
    },
    "task-Herd, Backofen & Regale putzen": {
      steps:[
        {textDe:"Herdoberfläche reinigen: Alle Herdplatten und die Oberfläche mit Fettlöser einsprühen und einwirken lassen. Dann mit Schwamm schrubben und abwischen.",textVi:"Lau mặt bếp: Xịt dung dịch tẩy dầu mỡ lên các mặt bếp, để ngấm. Sau đó chà bằng miếng bọt biển và lau sạch.",photo:null},
        {textDe:"Backofen reinigen: Backofen-Reiniger innen einsprühen, mindestens 15 Minuten einwirken lassen. Mit feuchtem Tuch gründlich auswischen. Rost und Backblech separat reinigen.",textVi:"Vệ sinh lò nướng: Xịt nước tẩy lò nướng bên trong, để ngấm ít nhất 15 phút. Lau kỹ bằng khăn ẩm. Rửa thanh grill và khay nướng riêng.",photo:null},
        {textDe:"Regale abwischen: Alles von den Küchenregalen nehmen, Regale mit feuchtem Tuch abwischen, Gegenstände ordentlich zurückstellen.",textVi:"Lau kệ bếp: Lấy hết đồ trên kệ xuống, lau kệ bằng khăn ẩm, xếp đồ lại gọn gàng.",photo:null},
        {textDe:"Knöpfe und Griffe: Alle Drehknöpfe und Griffe am Herd und Backofen mit einem feuchten Tuch abwischen.",textVi:"Nút và tay cầm: Lau sạch tất cả các nút vặn và tay cầm trên bếp và lò nướng bằng khăn ẩm.",photo:null}
      ],
      videoUrl:""
    },
    "task-Kühlschrank (innen & außen) & Schränke reinigen": {
      steps:[
        {textDe:"Kühlschrank ausräumen: Alle Lebensmittel herausnehmen. Abgelaufene oder verdorbene Produkte sofort entsorgen.",textVi:"Dọn tủ lạnh: Lấy hết thực phẩm ra. Vứt bỏ ngay những đồ hết hạn hoặc hỏng.",photo:null},
        {textDe:"Innen reinigen: Abnehmbare Fächer und Schubladen herausnehmen und mit warmem Wasser und Spülmittel reinigen. Innenwände abwischen.",textVi:"Lau bên trong: Tháo các ngăn và hộc ra, rửa bằng nước ấm và nước rửa chén. Lau sạch thành trong tủ.",photo:null},
        {textDe:"Außen abwischen: Kühlschranktür, Griffe und Seitenwände mit einem feuchten Tuch abwischen.",textVi:"Lau bên ngoài: Lau cửa tủ lạnh, tay cầm và thành bên bằng khăn ẩm.",photo:null},
        {textDe:"Küchenschränke: Schränke aufräumen, Fächer mit feuchtem Tuch auswischen, Lebensmittel und Geschirr ordentlich einräumen.",textVi:"Tủ bếp: Dọn gọn tủ, lau các ngăn bằng khăn ẩm, xếp lại thực phẩm và bát đĩa ngăn nắp.",photo:null},
        {textDe:"Lebensmittel zurückstellen: Alles ordentlich zurückstellen, ältere Produkte nach vorne, neuere nach hinten.",textVi:"Xếp lại thực phẩm: Xếp lại gọn gàng, đồ cũ để phía trước, đồ mới để phía sau.",photo:null}
      ],
      videoUrl:""
    },
    "task-Mülleimer reinigen & Glastüren putzen": {
      steps:[
        {textDe:"Mülleimer leeren: Alle Mülleimer in der Küche leeren und Müll richtig entsorgen.",textVi:"Đổ thùng rác: Đổ hết tất cả thùng rác trong bếp và phân loại rác đúng cách.",photo:null},
        {textDe:"Mülleimer waschen: Mülleimer mit heißem Wasser und Spülmittel ausspülen. Mit einer Bürste schrubben, besonders am Boden und Rand.",textVi:"Rửa thùng rác: Rửa thùng rác bằng nước nóng và nước rửa chén. Chà bằng bàn chải, đặc biệt đáy và viền thùng.",photo:null},
        {textDe:"Trocknen und neuen Beutel einlegen: Mülleimer trocknen lassen, dann neuen Müllbeutel einsetzen.",textVi:"Để khô và thay túi mới: Để thùng rác khô, sau đó lắp túi rác mới.",photo:null},
        {textDe:"Glastüren reinigen: Glasreiniger auf die Glastüren sprühen und mit einem fusselfreien Tuch von oben nach unten wischen.",textVi:"Lau cửa kính: Xịt nước lau kính lên cửa kính và dùng khăn không xơ lau từ trên xuống dưới.",photo:null},
        {textDe:"Rahmen abwischen: Tür- und Fensterrahmen mit feuchtem Tuch abwischen.",textVi:"Lau khung cửa: Lau khung cửa và khung cửa sổ bằng khăn ẩm.",photo:null}
      ],
      videoUrl:""
    },
    "task-Toilette putzen (innen & außen)": {
      steps:[
        {textDe:"Reiniger auftragen: WC-Reiniger unter den Rand und in die Schüssel spritzen, einwirken lassen (mind. 5 Min).",textVi:"Xịt nước tẩy: Xịt nước tẩy toilet vào dưới viền và trong lòng bồn cầu, để ngấm ít nhất 5 phút.",photo:null},
        {textDe:"Innen schrubben: Mit der Toilettenbürste kräftig schrubben – unter dem Rand, den Boden und den Abfluss.",textVi:"Chà bên trong: Dùng bàn chải toilet chà mạnh – dưới viền, đáy bồn và lỗ thoát nước.",photo:null},
        {textDe:"Außen reinigen: Toilettensitz, Deckel, Scharniere und den gesamten Außenbereich mit Allzweckreiniger und einem Tuch abwischen.",textVi:"Lau bên ngoài: Dùng nước tẩy đa năng và khăn lau sạch bệ ngồi, nắp đậy, bản lề và toàn bộ mặt ngoài bồn cầu.",photo:null},
        {textDe:"Boden um die Toilette: Den Boden rund um die Toilette mit feuchtem Tuch wischen.",textVi:"Sàn quanh bồn cầu: Lau sàn xung quanh bồn cầu bằng khăn ẩm.",photo:null},
        {textDe:"Spülen und kontrollieren: Spülen und prüfen ob alles sauber ist. Bei Bedarf nochmal schrubben.",textVi:"Xả nước và kiểm tra: Xả nước và kiểm tra đã sạch chưa. Nếu cần thì chà lại.",photo:null}
      ],
      videoUrl:""
    },
    "task-Waschbecken & Spiegel reinigen": {
      steps:[
        {textDe:"Waschbecken reinigen: Reiniger auf das Waschbecken sprühen, mit Schwamm schrubben – besonders Ränder, Abfluss und Überlauf.",textVi:"Rửa bồn rửa mặt: Xịt nước tẩy lên bồn, dùng miếng bọt biển chà kỹ – đặc biệt viền, lỗ thoát và lỗ tràn.",photo:null},
        {textDe:"Armatur polieren: Wasserhahn und Griffe mit feuchtem Tuch reinigen, dann trockenwischen bis sie glänzen.",textVi:"Đánh bóng vòi nước: Lau vòi nước và tay cầm bằng khăn ẩm, sau đó lau khô cho sáng bóng.",photo:null},
        {textDe:"Spiegel putzen: Glasreiniger auf den Spiegel sprühen und mit fusselfreiem Tuch in S-Bewegungen wischen.",textVi:"Lau gương: Xịt nước lau kính lên gương và dùng khăn không xơ lau theo hình chữ S.",photo:null},
        {textDe:"Ablageflächen: Zahnputzbecher, Seifenspender und andere Gegenstände abwischen und ordentlich zurückstellen.",textVi:"Kệ để đồ: Lau sạch cốc đánh răng, bình xà phòng và các vật dụng khác, xếp lại gọn gàng.",photo:null}
      ],
      videoUrl:""
    },
    "task-Dusche / Badewanne reinigen": {
      steps:[
        {textDe:"Haare entfernen: Alle Haare aus dem Abfluss und von den Wänden entfernen.",textVi:"Lấy tóc: Nhặt hết tóc từ lỗ thoát nước và trên thành bồn/vách.",photo:null},
        {textDe:"Reiniger einsprühen: Badreiniger auf Fliesen, Duschwand, Armaturen und Wanne/Boden sprühen. Einwirken lassen.",textVi:"Xịt nước tẩy: Xịt nước tẩy phòng tắm lên gạch, vách kính, vòi sen và sàn/bồn tắm. Để ngấm.",photo:null},
        {textDe:"Schrubben: Mit Schwamm oder Bürste alle Flächen gründlich schrubben, besonders Fugen und Ecken wo Schimmel entstehen kann.",textVi:"Chà rửa: Dùng miếng bọt biển hoặc bàn chải chà kỹ tất cả bề mặt, đặc biệt các khe ron và góc nơi dễ bị mốc.",photo:null},
        {textDe:"Abspülen: Alles gründlich mit Wasser abspülen, bis kein Reiniger mehr zu sehen ist.",textVi:"Xả sạch: Xả nước kỹ cho đến khi không còn vết nước tẩy.",photo:null},
        {textDe:"Trockenwischen: Armaturen und Glaswände mit trockenem Tuch abwischen, um Kalkflecken zu vermeiden.",textVi:"Lau khô: Lau khô vòi sen và vách kính bằng khăn khô để tránh vết cặn canxi.",photo:null}
      ],
      videoUrl:""
    },
    "task-Boden saugen & wischen": {
      steps:[
        {textDe:"Freiräumen: Badematten, Mülleimer und lose Gegenstände vom Boden entfernen.",textVi:"Dọn sàn: Dời thảm chân, thùng rác và các vật dụng trên sàn ra.",photo:null},
        {textDe:"Saugen: Den gesamten Badezimmerboden saugen, besonders in Ecken und hinter der Toilette.",textVi:"Hút bụi: Hút bụi toàn bộ sàn phòng tắm, đặc biệt các góc và phía sau bồn cầu.",photo:null},
        {textDe:"Wischen: Mit Wischmopp und Badreiniger den Boden feucht wischen. Hartnäckige Flecken mit Bürste bearbeiten.",textVi:"Lau sàn: Dùng cây lau sàn với nước tẩy phòng tắm lau ẩm. Các vết bẩn cứng đầu thì chà bằng bàn chải.",photo:null},
        {textDe:"Trocknen: Boden trocknen lassen, Badematten zurücklegen.",textVi:"Để khô: Chờ sàn khô rồi đặt thảm chân lại.",photo:null}
      ],
      videoUrl:""
    },
    "task-Handtücher wechseln, Regale ordnen & Waschmaschine reinigen": {
      steps:[
        {textDe:"Handtücher wechseln: Alle benutzten Handtücher abnehmen und in die Wäsche geben. Frische Handtücher aufhängen.",textVi:"Thay khăn: Gỡ hết khăn đã dùng cho vào giặt. Treo khăn sạch mới lên.",photo:null},
        {textDe:"Regale ordnen: Alle Produkte auf den Regalen aufräumen, abgelaufene Produkte entsorgen, Regalflächen abwischen.",textVi:"Sắp kệ gọn: Dọn gọn các sản phẩm trên kệ, vứt bỏ đồ hết hạn, lau mặt kệ.",photo:null},
        {textDe:"Waschmaschine – Trommel: Eine leere Maschine bei 60°C mit etwas Essig oder Maschinenreiniger laufen lassen.",textVi:"Máy giặt – lồng giặt: Chạy một mẻ trống ở 60°C với một ít giấm hoặc nước tẩy máy giặt.",photo:null},
        {textDe:"Waschmaschine – Dichtung & Fach: Gummidichtung mit feuchtem Tuch abwischen, Waschmittelfach herausnehmen und reinigen.",textVi:"Máy giặt – gioăng & ngăn: Lau gioăng cao su bằng khăn ẩm, tháo ngăn đựng bột giặt ra và rửa sạch.",photo:null},
        {textDe:"Tür offen lassen: Nach dem Reinigen die Waschmaschinentür offen lassen, damit sie trocknen kann.",textVi:"Để cửa mở: Sau khi vệ sinh, để cửa máy giặt mở cho khô thoáng.",photo:null}
      ],
      videoUrl:""
    },
    "task-Flur, Eingang & Treppenhaus reinigen, Schuhe ordnen": {
      steps:[
        {textDe:"Schuhe ordnen: Alle Schuhe im Eingangsbereich paarweise aufstellen, überzählige Schuhe ins Zimmer bringen.",textVi:"Xếp giày: Xếp tất cả giày ở cửa ra vào thành từng đôi, mang giày thừa về phòng.",photo:null},
        {textDe:"Fegen: Flur, Eingangsbereich und Treppenhaus gründlich fegen. Spinnweben in Ecken entfernen.",textVi:"Quét: Quét kỹ hành lang, khu vực cửa ra vào và cầu thang. Dọn mạng nhện ở các góc.",photo:null},
        {textDe:"Wischen: Boden mit feuchtem Mopp wischen, besonders den Eingangsbereich wo viel Schmutz hereingetragen wird.",textVi:"Lau sàn: Lau sàn bằng cây lau ẩm, đặc biệt khu vực cửa ra vào nơi hay bị bẩn.",photo:null},
        {textDe:"Fußmatten: Fußmatten ausklopfen oder absaugen.",textVi:"Thảm chân: Giũ hoặc hút bụi thảm chân.",photo:null},
        {textDe:"Garderobe: Jacken und Taschen ordentlich aufhängen, Garderobe abwischen.",textVi:"Móc áo: Treo áo khoác và túi gọn gàng, lau giá treo.",photo:null}
      ],
      videoUrl:""
    },
    "task-Wohnzimmer saugen & Böden wischen": {
      steps:[
        {textDe:"Aufräumen: Herumliegende Gegenstände aufräumen und an ihren Platz bringen. Kissen aufschütteln.",textVi:"Dọn dẹp: Dọn gọn đồ đạc vương vãi về đúng chỗ. Xốc lại gối.",photo:null},
        {textDe:"Staubsaugen: Den gesamten Wohnzimmerboden und gemeinsame Bereiche saugen – unter Sofa, Tisch und in allen Ecken.",textVi:"Hút bụi: Hút bụi toàn bộ sàn phòng khách và khu vực chung – dưới sofa, bàn và các góc.",photo:null},
        {textDe:"Böden wischen: Mit feuchtem Mopp und Bodenreiniger alle harten Böden wischen.",textVi:"Lau sàn: Dùng cây lau sàn ẩm với nước lau sàn lau tất cả sàn cứng.",photo:null},
        {textDe:"Teppiche: Falls vorhanden, Teppiche absaugen und bei Bedarf mit Teppichreiniger behandeln.",textVi:"Thảm: Nếu có thảm, hút bụi và xử lý bằng nước giặt thảm nếu cần.",photo:null}
      ],
      videoUrl:""
    },
    "task-Tische, Regale, Türgriffe & Lichtschalter abwischen": {
      steps:[
        {textDe:"Oberflächen freiräumen: Deko und Gegenstände kurz zur Seite stellen.",textVi:"Dọn bề mặt: Dời đồ trang trí và vật dụng sang bên.",photo:null},
        {textDe:"Tische & Regale abwischen: Mit feuchtem Tuch und etwas Allzweckreiniger alle Tischflächen und Regale abwischen. Staub gründlich entfernen.",textVi:"Lau bàn & kệ: Dùng khăn ẩm với chút nước tẩy đa năng lau sạch tất cả mặt bàn và kệ. Lau sạch bụi.",photo:null},
        {textDe:"Türgriffe reinigen: Alle Türgriffe in der Wohnung mit Desinfektionstuch oder feuchtem Lappen abwischen.",textVi:"Lau tay nắm cửa: Lau tất cả tay nắm cửa trong nhà bằng khăn khử khuẩn hoặc khăn ẩm.",photo:null},
        {textDe:"Lichtschalter abwischen: Lichtschalter und Steckdosenrahmen vorsichtig mit leicht feuchtem Tuch abwischen.",textVi:"Lau công tắc đèn: Cẩn thận lau các công tắc đèn và khung ổ cắm bằng khăn hơi ẩm.",photo:null}
      ],
      videoUrl:""
    },
    "task-Fenster reinigen & Balkon aufräumen": {
      steps:[
        {textDe:"Fensterrahmen abwischen: Zuerst Rahmen und Fensterbänke mit feuchtem Tuch abwischen.",textVi:"Lau khung cửa sổ: Trước tiên lau khung cửa và bệ cửa sổ bằng khăn ẩm.",photo:null},
        {textDe:"Glasflächen reinigen: Glasreiniger aufsprühen und mit fusselfreiem Tuch oder Abzieher in S-Bewegungen wischen.",textVi:"Lau kính: Xịt nước lau kính và dùng khăn không xơ hoặc cây gạt kính lau theo hình chữ S.",photo:null},
        {textDe:"Balkon fegen: Balkonboden fegen und Blätter oder Schmutz entfernen.",textVi:"Quét ban công: Quét sàn ban công, dọn lá và bụi bẩn.",photo:null},
        {textDe:"Balkonmöbel & Geländer: Tisch, Stühle und Geländer mit feuchtem Tuch abwischen.",textVi:"Bàn ghế & lan can ban công: Lau bàn, ghế và lan can bằng khăn ẩm.",photo:null},
        {textDe:"Pflanzen: Tote Blätter entfernen, bei Bedarf gießen.",textVi:"Cây cối: Dọn lá héo, tưới nước nếu cần.",photo:null}
      ],
      videoUrl:""
    },
    "task-Müll rausbringen & Mülleimer reinigen": {
      steps:[
        {textDe:"Müll sammeln: Alle Mülleimer in der Wohnung prüfen und volle Beutel herausnehmen. Gut zuknoten.",textVi:"Gom rác: Kiểm tra tất cả thùng rác trong nhà, lấy túi đầy ra và buộc chặt.",photo:null},
        {textDe:"Müll richtig entsorgen: Restmüll, Biomüll, Papier und Verpackungen (Gelber Sack) in die richtigen Tonnen draußen bringen.",textVi:"Phân loại đổ rác: Mang rác thải chung, rác hữu cơ, giấy và bao bì vào đúng thùng phân loại bên ngoài.",photo:null},
        {textDe:"Mülleimer reinigen: Leere Mülleimer mit heißem Wasser und Spülmittel ausspülen und schrubben.",textVi:"Rửa thùng rác: Rửa thùng rác rỗng bằng nước nóng và nước rửa chén, chà sạch.",photo:null},
        {textDe:"Neue Beutel: In alle Mülleimer frische Beutel einsetzen.",textVi:"Thay túi mới: Lắp túi rác mới vào tất cả các thùng rác.",photo:null}
      ],
      videoUrl:""
    }
  },
  announcements:[], reports:[], deadlineDay:0, deadlineHour:23, deadlineMin:59,
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
  {catDe:"Müllentsorgung im Gebäude",catVi:"Quy định đổ rác tại toà nhà",icon:"🗑️",hasPhotos:true,items:[
    {de:"Restmüll (schwarze Tonne): Alles, was nicht recycelt werden kann.",vi:"Rác thải chung (thùng đen): Tất cả những thứ không tái chế được."},
    {de:"Biomüll (braune Tonne): Essensreste, Obst-/Gemüseschalen, Kaffeesatz, Teebeutel.",vi:"Rác hữu cơ (thùng nâu): Thức ăn thừa, vỏ trái cây/rau, bã cà phê, túi trà."},
    {de:"Papier & Pappe (blaue Tonne): Zeitungen, Kartons, Papier (kein beschichtetes Papier).",vi:"Giấy & bìa cứng (thùng xanh dương): Báo, hộp carton, giấy (không giấy tráng phủ)."},
    {de:"Verpackungen / Gelber Sack: Plastikverpackungen, Dosen, Tetrapaks.",vi:"Bao bì / Túi vàng: Bao bì nhựa, lon, hộp Tetrapack."},
    {de:"Glas: Altglas nach Farben (weiß, grün, braun) in die Container bringen.",vi:"Thuỷ tinh: Mang chai lọ thuỷ tinh đến thùng phân loại theo màu (trắng, xanh, nâu)."},
    {de:"Müll nur zu den festgelegten Zeiten rausbringen (siehe Aushang im Treppenhaus).",vi:"Chỉ đổ rác vào giờ quy định (xem thông báo ở cầu thang)."},
    {de:"Sperrmüll: Große Gegenstände separat anmelden — NICHT einfach abstellen!",vi:"Rác cồng kềnh: Đồ lớn phải đăng ký riêng — KHÔNG được để bừa!"},
    {de:"Müllraum sauber halten. Müll NICHT vor die Tür stellen.",vi:"Giữ phòng rác sạch sẽ. KHÔNG để rác trước cửa."},
  ]},
  {catDe:"Allgemeines",catVi:"Tổng quát",icon:"📋",items:[{de:"Gegenseitiger Respekt.",vi:"Tôn trọng lẫn nhau."},{de:"Probleme direkt ansprechen.",vi:"Nói trực tiếp."},{de:"Monatliches WG-Meeting.",vi:"Họp WG hàng tháng."}]},
  {catDe:"Ruhezeiten",catVi:"Giờ yên tĩnh",icon:"🌙",items:[{de:"22:00–07:00 (Mo–Fr), 23:00–09:00 (Sa–So).",vi:"22:00–07:00 (T2–T6), 23:00–09:00 (T7–CN)."},{de:"Musik auf Zimmerlautstärke nach 22 Uhr.",vi:"Nhạc mức phòng sau 22h."}]},
  {catDe:"Küche",catVi:"Nhà bếp",icon:"🍳",items:[{de:"Geschirr sofort spülen.",vi:"Rửa bát ngay."},{de:"Herd nach Benutzung reinigen.",vi:"Lau bếp sau khi dùng."},{de:"Müll trennen.",vi:"Phân loại rác."}]},
  {catDe:"Bad & WC",catVi:"Phòng tắm",icon:"🚿",items:[{de:"Nach dem Duschen lüften.",vi:"Thông gió sau khi tắm."},{de:"Haare aus Abfluss entfernen.",vi:"Lấy tóc khỏi ống thoát."}]},
  {catDe:"Besuch",catVi:"Khách",icon:"👥",items:[{de:"Mitbewohner informieren.",vi:"Thông báo bạn phòng."},{de:"Gäste max. 3 Nächte/Woche.",vi:"Khách tối đa 3 đêm/tuần."}]},
  {catDe:"Rauchen",catVi:"Hút thuốc",icon:"🚭",items:[{de:"Nur auf Balkon / vor der Tür.",vi:"Chỉ ở ban công / trước cửa."}]},
];
