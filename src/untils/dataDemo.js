const articles = [
        {
                title: "Phố Wall chao đảo",
                sapo: "Sáng 24/5, Phố Wall chìm trong sắc đỏ khi Chủ tịch Hạ viện Kevin McCarthy cho biết các cuộc đàm phán về trần nợ công với Nhà Trắng vẫn bế tắc.",
                imgSrc: "https://znews-photo.zingcdn.me/w1000/Uploaded/asfzyreslz2/2023_03_18/1200x_1.jpg",
                slug: "pho-wall-chao-dao",
        },
        {
                title: "Lý do ông DeSantis tuyên bố tranh cử giữa lúc trò chuyện với Elon Musk",
                sapo: "Việc Thống đốc Ron DeSantis tuyên bố tranh cử tổng thống trên Twitter Spaces được cho giúp ông tiếp cận lượng khán giả lớn, nhưng nhiều người cũng coi đây là một bước đi sai lầm.",
                imgSrc: "https://znews-photo.zingcdn.me/w210/Uploaded/afsiy/2023_05_25/2JEUPK5LFFOTTPCAQRBX5LTOFM.jpg",
                slug: "ly-do-ong-desantis-tuyen-bo-tranh-cu-giua-luc-tro-chuyen-voi-elon-musk",
        },
        {
                title: " Dàn mỹ nhân 'Fast X'",
                sapo: "Dự án mới nhất của nhà Universal Pictures quy tụ dàn diễn viên tài năng, quyến rũ. Họ đều là những ngôi sao tiếng tăm tại kinh đô điện ảnh.",
                imgSrc: "https://znews-photo.zingcdn.me/w1000/Uploaded/rohunaa/2023_05_23/30_Insanely_Sexy_Gal_Gadot_Photo.jpg",
                slug: "dan-my-nhan-fast-x",
        },
        {
                title: "Học ngành Bất động sản là 'lùa gà'?",
                sapo: "Không giống với định kiến học lùa gà, ngành Bất động sản ở bậc đại học sẽ đào tạo sinh viên các kiến thức chuyên môn để giúp thị trường phát triển bền vững, ổn định.",
                imgSrc: "https://znews-photo.zingcdn.me/w480/Uploaded/xpivvpib/2023_05_18/Thumbnail.jpg",
                slug: "hoc-nganh-bat-dong-san-la-lua-ga",
        },
        {
                title: "Sự tàn độc đáng ngờ của mẹ Alexander Đại đế",
                sapo: "Các động thái của Olympias trước và sau vụ ám sát càng củng cố cho giả thuyết bà có liên quan đến cái chết của Vua Philip.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_23/unnamed.jpg",
                slug: "su-tan-doc-dang-ngo-cua-me-alexander-dai-de",
        },
        {
                title: "Hoài niệm một thời mạng xã hội tốt đẹp",
                sapo: "Sách Thương vụ Facebook thâu tóm Instagram khiến tôi đặt câu hỏi về mạng xã hội và công nghệ cũng như khả năng kiểm soát của con người với những phát minh của mình.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/natmts/2023_05_23/pexels_photo_3367850.jpg",
                slug: "hoai-niem-mot-thoi-mang-xa-hoi-tot-dep",
        },
        {
                title: "Muối từng được coi là biểu tượng của sự cao quý",
                sapo: "Theo quan niệm của người xưa, muối là một vật phẩm giá trị đại diện cho những đấng tối cao. Thực tế, quan niệm này xuất phát từ công dụng ướp xác, bảo quản của muối.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/mzdgi/2023_05_24/Photo_213.jpg",
                slug: "muoi-tung-duoc-coi-la-bieu-tuong-cua-su-cao-quy",
        },
        {
                title: "Hội sách thiếu nhi châu Á: Từ ý tưởng đến giá trị thực",
                sapo: "Trong không khí Hội sách thiếu nhi châu Á (AFCC) lần thứ 14 sắp diễn ra tại Singapore, cùng nhìn lại sự phát triển và đánh giá tầm quan trọng của sự kiện này.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/piqbzcvo/2023_05_23/42139108_2221401837933234_484867.jpg",
                slug: "hoi-sach-thieu-nhi-chau-a-tu-y-tuong-den-gia-tri-thuc",
        },
        {
                title: "Tác giả 'One Piece' bỏ bữa nhiều ngày khi viết truyện",
                sapo: "Eiichiro Oda, tác giả bộ manga “One-Piece” nổi tiếng đã bỏ bữa nhiều ngày khi thực hiện tác phẩm, bất chấp những rủi ro tiềm ẩn về sức khỏe.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/piqbzcvo/2023_05_23/Screen_Shot_2023_05_23_at_16.59.52.png",
                slug: "tac-gia-one-piece-bo-bua-nhieu-ngay-khi-viet-truyen",
        },
        {
                title: "Tư liệu quý về 37 công trình kiến trúc Pháp - Đông Dương tại Hà Nội",
                sapo: "Sách “Kiến trúc Pháp - Đông Dương, những viên ngọc quý tại Hà Nội” cung cấp nhiều tư liệu quý về những công trình kiến trúc được ví như “những viên ngọc quý” ở Hà Nội.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/dqmblcvo/2023_05_23/kien_truc_Phap_in_HN.jpg",
                slug: "tu-lieu-quy-ve-37-cong-trinh-kien-truc-phap-dong-duong-tai-ha-noi",
        },
        {
                title: " Những khoảnh khắc bất ngờ nhất về Batman",
                sapo: "Là một siêu anh hùng đặc biệt nhưng đôi khi Người Dơi vẫn khiến những người hâm mộ cuồng nhiệt nhất của mình phải ngạc nhiên vì các hành động bất ngờ.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/piqbzcvo/2023_05_23/0.png",
                slug: "nhung-khoanh-khac-bat-ngo-nhat-ve-batman",
        },
        {
                title: "Nhiều tiếng nói về việc nước Mỹ không có hội sách quốc tế",
                sapo: "Trang Publishers Weekly đặt ra câu hỏi: Có nên tổ chức một hội nghị quốc tế dành cho các nhà xuất bản chuyên nghiệp ở Mỹ không? Vấn đề này được đặt ra từ khi BookExpo bị dừng lại.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/qoswae/2023_05_23/100546_1.jpg",
                slug: "nhieu-tieng-noi-ve-viec-nuoc-my-khong-co-hoi-sach-quoc-te",
        },
        {
                title: "Chuyện hậu trường khi dịch tiểu thuyết kinh điển của Alexandre Dumas",
                sapo: "'Bá tước Monte Cristo' - tiểu thuyết của nhà văn người Pháp Alexandre Dumas được xem là một trong những tác phẩm kinh điển nhất mọi thời đại.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/fa311df7a4db7b8522ca_1516.jpg",
                slug: "sach-hay",
        },
        {
                title: "Ưu và nhược điểm của kháng sinh",
                sapo: "Việc sử dụng kháng sinh bừa bãi khiến mầm bệnh trở nên kháng thuốc. Việc điều trị bệnh giờ đây đòi hỏi những loại kháng sinh mạnh hơn nữa.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_23/pexels_photo_3768582.jpg",
                slug: "uu-va-nhuoc-diem-cua-khang-sinh",
        },
        {
                title: "Tình cũ là kẻ ám sát vua Philip II",
                sapo: "Căm phẫn vì bị Vua Philip (382-336 TCN) ngó lơ, Pausanias đã thọc con dao găm vào tim Vua Philip.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/natmts/2023_05_23/z4369476239356_2c0ad59854485ae2fa7de24d1788cff7.jpg",
                slug: "tinh-cu-la-ke-am-sat-vua-philip-ii",
        },
        {
                title: "Chuyện cô gái vượt lên tổn thương để yêu thương",
                sapo: "Trái tim con người quả thật là một thứ kỳ diệu. Nó có thể trải qua nhiều đau thương, xước xát, có khi đau đớn tưởng chừng muốn vỡ ra, nhưng nó vẫn đập bền bỉ, sẵn sàng yêu thương.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/334526313_478960350967154_657362.jpg",
                slug: "chuyen-co-gai-vuot-len-ton-thuong-de-yeu-thuong",
        },
        {
                title: "Chuyện chưa kể về 'vua trinh thám' Conan Doyle",
                sapo: "Sinh ngày 22/5/1859 tại Scotland, Sir Arthur Conan Doyle là con trai của ông bố nghệ sĩ tài năng Charles Altamont Doyle và bà mẹ hoạt bát Mary Foley.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/thumb_cd.jpg",
                slug: "chuyen-chua-ke-ve-vua-trinh-tham-conan-doyle",
        },
        {
                title: "Những kỷ niệm êm đềm và kinh hoàng về mùa nước nổi miền Tây",
                sapo: "Xoay quanh các câu chuyện về mùa nước nổi, tác phẩm Sống cùng nước của nhà văn Trương Chí Hùng đã ghi lại một cách sinh động nét văn hóa của người dân miền Tây.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/bpivpbbx/2023_05_22/301004863_2182718658550120_7698398310948408876_n.jpg",
                slug: "nhung-niem-em-dem-va-kinh-hoang-ve-mua-nuoc-noi-mien-tay",
        },
        {
                title: "Rước sinh thực khí và những cổ tục luyến ái tính của người Việt",
                sapo: "Các tục lệ cũ như rước sinh thực khí, lễ hội tắt đèn, trò chơi bắt chạch trong chum cho thấy quan niệm phóng khoáng về vấn đề luyến ái trước đây.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/dqmblcvo/2023_05_23/Thap_Dao_Thinh_04.jpg",
                slug: "ruoc-sinh-thuc-khi-va-nhung-co-tuc-luyen-ai-tinh-cua-nguoi-viet",
        },
        {
                title: "Công nghệ 4.0 hồi sinh các tác phẩm truyện tranh",
                sapo: "Đối với các đơn vị làm sách, công nghệ 4.0 đang được áp dụng rộng rãi hơn nhằm tiếp cận với thế hệ công chúng mới.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/mzdgi/2023_05_17/hesman_legend_02_DXQX.jpg",
                slug: "cong-nghe-40-hoi-sinh-cac-tac-pham-truyen-tranh",
        },
        {
                title: "Tôi tự lột bỏ quần áo và sự xấu hổ, rồi bắt đầu nhảy trên sân khấu",
                sapo: "Kris Kneen chia sẻ về việc vượt lên mặc cảm với cơ thể, vượt lên những định kiến về người mập và kể quá trình viết cuốn Fat girl dancing.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/caxwpqdwp/2023_05_23/tai_xuong_1_.jpg",
                slug: "toi-tu-lot-bo-quan-ao-va-su-xau-ho-roi-bat-dau-nhay-tren-san-khau",
        },
        {
                title: "Một tác giả dùng AI viết 97 quyển sách trong 9 tháng",
                sapo: "Với sự trợ giúp của một số công cụ AI, tác giả Tim Boucher đã xuất bản 97 cuốn sách giả tưởng, mỗi quyển có độ dài khoảng 2.000-5.000 từ và chứa 40-140 hình do AI tạo ra.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/pqmcbzwv/2023_05_23/thumb_AI.jpg",
                slug: "mot-tac-gia-dung-ai-viet-97-quyen-sach-trong-9-thang",
        },
        {
                title: "Quy tắc quan trọng về sức mạnh của Flash",
                sapo: "Wally West cuối cùng đã tìm ra cách thức hoạt động của Speed Force và lý do nó cho phép Flash di chuyển xuyên thời gian.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/piqbzcvo/2023_05_22/Screenshot_2023_05_22_at_21.53.31.png",
                slug: "quy-tac-quan-trong-ve-suc-manh-cua-flash",
        },
        {
                title: "Khi đàn ông trở nên hời hợt",
                sapo: "Nếu trái tim người đàn ông bị vây quanh bởi những lớp vỏ bọc thì anh ta sẽ mất kết nối với sự thật đời mình và định hướng sâu sắc trong trái tim anh ta. Anh bắt đầu sống dối trá.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_22/pexels_photo_8560663.jpg",
                slug: "khi-dan-ong-tro-nen-hoi-hot",
        },
        {
                title: "Phơi bày vụ lừa đảo các đại gia của ‘nữ tỷ phú’ 39 tuổi",
                sapo: "Sau khi bị phanh phui, ‘nữ tỷ phú’ Elizabeth Holmes kết hôn, sinh 2 con, trì hoãn được việc thi hành án 11 năm tù giam.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/theranos_1254.jpg",
                slug: "phoi-bay-vu-lua-dao-cac-dai-gia-cua-nu-ty-phu-39-tuoi",
        },
        {
                title: "Lý do bụng béo lên thì sẽ rất khó nhỏ lại được",
                sapo: "Mỡ có kết cấu khó đốt cháy và một khi nó đã tích tụ lại trong bụng thì sẽ rất khó biến mất.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/dqmblcvo/2023_05_22/beo_bung_sau_sinh_la_noi_lo_cua_nhieu_ba_me_1400x700.jpg",
                slug: "ly-do-bung-beo-len-thi-se-rat-kho-nho-lai-duoc",
        },
        {
                title: "Man mác Vàm Nao - khung trời sông nước",
                sapo: "Khép lại cuốn sách của Trương Chí Hùng với nhiều cung bậc cảm xúc, tôi tin chắc rằng sau khi đọc xong, mỗi người sẽ yêu mến hơn vùng đất An Giang xinh tươi này.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/72682354_1334677810020880_3528434359444963328_n.jpg",
                slug: "man-mac-vam-nao-khung-troi-song-nuoc",
        },
        {
                title: "Nhạc sĩ Lam Phương và cơn say màu hồng",
                sapo: "Trong khoảng 15 năm (1960-1975), Lam Phương là một trong số ít nhạc sĩ sáng tác “mát tay” nhất ở miền Nam.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/dqmblcvo/2023_05_22/LP_TH.jpg",
                slug: "nhac-si-lam-phuong-va-con-say-mau-hong",
        },
        {
                title: "'Ông vua sách cũ' Hà Nội qua đời",
                sapo: "Sáng 22/5, tin buồn ông Phan Trác Cảnh được lan truyền trên mạng xã hội. Cộng đồng sưu tầm sách bày tỏ sự thương tiếc ông vua sách cũ Hà Nội.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_22/canh.jpg",
                slug: "ong-vua-sach-cu-ha-noi-qua-doi",
        },
        {
                title: "Phiêu lưu ở 'Vương quốc Tại sao' với tranh từ truyện của Gianni Rodari",
                sapo: "Gần 100 em nhỏ và phụ huynh đã tới tham dự các hoạt động trong khuôn khổ chương trình “Phiêu lưu vương quốc Tại sao”.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/ndo_br_gianni3_826.jpg",
                slug: "phieu-luu-o-vuong-quoc-tai-sao-voi-tranh-tu-truyen-cua-gianni-rodari",
        },
        {
                title: "Phụ nữ nắm được trái tim đàn ông chưa chắc đã thành công",
                sapo: "Ở mỗi độ tuổi khác nhau, phụ nữ lại có những mục tiêu riêng, chìa khóa để đạt được những điều đó chính là sự tự tin.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/mzdgi/2023_05_17/Clueless_Cher_Alicia_Silverstone_700x380.jpg",
                slug: "phu-nu-nam-duoc-trai-tim-dan-ong-chua-chac-da-thanh-cong",
        },
        {
                title: "Salman Rushdie viết sách về trải nghiệm bị tấn công tàn bạo",
                sapo: "Theo Financial Times, nhà văn này đang hồi phục và sẽ tiếp tục đấu tranh cho quyền tự do ngôn luận. Ông đang viết sách về trải nghiệm bị tấn công tàn bạo hồi tháng 8/2022.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_21/Salman_Rushdie_Getty_H_2023.jpg",
                slug: "salman-rushdie-viet-sach-ve-trai-nghiem-bi-tan-cong-tan-bao",
        },
        {
                title: "Thế giới quan và sự phát triển của của AI trong một số tiểu thuyết",
                sapo: "Với sự phát triển mạnh mẽ của AI, các tác phẩm về AI cũng được quan tâm nhiều hơn. Trang Book Riot và Crime Read đã giới thiệu một số tiểu thuyết khám phá nhiều góc mới về AI.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/qoswae/2023_05_18/the_infinity_courts_partial_cove.jpg",
                slug: "the-gioi-quan-va-su-phat-trien-cua-cua-ai-trong-mot-so-tieu-thuyet",
        },
        {
                title: "Lỗ hổng lớn từ điều ước đầu tiên trong ‘Dragon Ball Z’",
                sapo: "Một trong những điều ước đầu tiên của Dragon Ball Z đã tạo ra lỗ hổng lớn cho cả tác phẩm. Mức độ ảnh hưởng của nó lan tới tận những phần truyện sau này.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/piqbzcvo/2023_05_21/Screenshot_2023_05_21_at_15.33.01.png",
                slug: "lo-hong-lon-tu-dieu-uoc-dau-tien-trong-dragon-ball-z",
        },
        {
                title: "Thị trường truyện tranh thiếu nhi tìm kiếm những nhân vật mới",
                sapo: "Thay vì làm lại những tác phẩm kinh điển, các ấn phẩm truyện tranh dành cho thiếu nhi hè này lại tìm kiếm các nhân vật cũng như thông điệp giáo dục mới.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/mzdgi/2023_05_20/5f0af84447599907c048.jpg",
                slug: "thi-truong-truyen-tranh-thieu-nhi-tim-kiem-nhung-nhan-vat-moi",
        },
        {
                title: " Những tấm ảnh gây tranh cãi trong sách 'Sex' của Madonna",
                sapo: "Sách Sex của Madonna được xuất bản từ năm 1992 và đã gây nhiều tranh cãi. Nhiều bức ảnh khi ấy bị cho là vượt giới hạn chuẩn mực.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_21/f85abc5fd1a2a6dbae71bf83d5981fc5.jpg",
                slug: "nhung-tam-anh-gay-tranh-cai-trong-sach-sex-cua-madonna",
        },
        {
                title: "Hội sách thiếu nhi 'Hè vui khám phá'",
                sapo: "Nhằm hưởng ứng Tháng hành động vì trẻ em 2023 và Ngày Quốc tế Thiếu nhi 1/6, Hội sách thiếu nhi được tổ chức với nhiều hoạt động ý nghĩa và hấp dẫn dành cho bạn đọc nhỏ.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/dt1_5448.jpg",
                slug: "hoi-sach-thieu-nhi-he-vui-kham-pha",
        },
        {
                title: "'Dòng máu cao quý'",
                sapo: "Dòng máu cao quý của Amélie Nothomb là sự đan xen giữa hư và thực, làm nổi bật lên hình ảnh, tình cảm của tác giả dành cho người cha quá cố - Đại sứ Bỉ Patrick Nothomb.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_17/amelie_5990.jpg",
                slug: "dong-mau-cao-quy",
        },
        {
                title: "Ba cuốn sách truyền cảm hứng cho MC Khánh Vy",
                sapo: "MC Khánh Vy chia sẻ ba cuốn sách tâm đắc nhất trong tâm năm 2023. Đây là những cuốn sách giúp cô MC, nhà sáng tạo nội dung nâng cấp bản thân, sống vui hơn.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/natmts/2023_05_20/Photo1629687957929_1.jpg",
                slug: "ba-cuon-sach-truyen-cam-hung-cho-mc-khanh-vy",
        },
        {
                title: "Xuất bản sách của Tổng bí thư bằng 7 ngoại ngữ",
                sapo: "Sách “Một số vấn đề lý luận và thực tiễn về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam” được xuất bản bằng 7 ngoại ngữ.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_17/Ra_mat_sach_Tong_bi_thu.jpg",
                slug: "xuat-ban-sach-cua-tong-bi-thu-bang-7-ngoai-ngu",
        },
        {
                title: "Sách của Tổng bí thư trở thành tài liệu giảng dạy trong trường đại học",
                sapo: "Sách của Tổng bí thư Nguyễn Phú Trọng là một trong các tài liệu được liệt kê trong công văn chỉ đạo về việc đưa nội dung phòng, chống tham nhũng giảng dạy tại các trường đại học.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/natmts/2023_05_10/MG_1104_2_.JPG",
                slug: "sach-cua-tong-bi-thu-tro-thanh-tai-lieu-giang-day-trong-truong-dai-hoc",
        },
        {
                title: "Cuốn sách của Tổng bí thư thu hút độc giả cố đô Huế\n   ",
                sapo: "Bất chấp nắng nóng, hàng nghìn lượt người dân, du khách đã đến tham quan các gian trưng bày tại Ngày Sách và Văn hóa đọc lần thứ hai diễn ra tại TP Huế.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/jugtzb/2023_04_21/3_zing_1.jpg",
                slug: "cuon-sach-cua-tong-bi-thu-thu-hut-doc-gia-co-do-hue",
        },
        {
                title: "Các công ty sách góp phần tạo nên diện mạo ngành xuất bản Việt Nam",
                sapo: "Trong 5 năm qua, các công ty sách liên kết đã đóng góp vào sự phát triển chung của ngành. Khi các đơn vị liên kết nhiều hơn, bức tranh xuất bản tăng cả chiều sâu lẫn bề rộng.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/mzdgi/2023_04_04/Lieu_Lam.jpg",
                slug: "cac-cong-ty-sach-gop-phan-tao-nen-dien-mao-nganh-xuat-ban-viet-nam",
        },
        {
                title: "Đưa sách lý luận chính trị tiếp cận rộng rãi độc giả",
                sapo: "NXB Chính trị quốc gia Sự thật đang nhanh chóng chớp thời cơ, đưa sách lý luận chính trị lên nền tảng số, giúp dòng sách này tiếp cận được rộng rãi bạn đọc.",
                avatar: "https: //znews-photo.zingcdn.me/Uploaded/natmts/2023_04_06/TBTG_Nguyen_Trong_Nghia_trai_ngh.jpg",
                slug: "dua-sach-ly-luan-chinh-tri-tiep-can-rong-rai-doc-gia",
        },
        {
                title: "Nỗ lực mở ra thị trường sách nói có bản quyền tại Việt Nam",
                sapo: "Chỉ trong vài năm, thị trường sách nói ở Việt Nam đã cho thấy tốc độ phát triển nhanh, hòa cùng xu thế phát triển mạnh mẽ của xuất bản sách nói trên thế giới.",
                avatar: "https://znews-photo.zingcdn.me/Uploaded/bpivpbbx/2023_04_07/IMG_0315_copy.jpg",
                slug: "no-luc-de-mo-ra-thi-truong-sach-noi-co-ban-quyen-tai-viet-nam",
        },
];
const cates = [
        {
                name: "Xuất bản",
                sub: [
                        {
                                name: "Tin tức xuất bản",
                                slug: "tin-tuc-xuat-ban",
                        },
                        {
                                name: "Sách hay",
                                slug: "sach-hay",
                        },
                        {
                                name: "Nghiên cứu xuất bản",
                                slug: "nghien-cuu-xuat-ban",
                        },
                        {
                                name: "Tác giả",
                                slug: "tac-gia",
                        },
                        {
                                name: "Cuốn sách tôi đọc",
                                slug: "cuon-sach-toi-doc",
                        },
                ],
                slug: "xuat-ban",
        },
        {
                name: "Kinh doanh",
                sub: [
                        {
                                name: "Doanh nhân",
                                slug: "doanh-nhan",
                        },
                        {
                                name: "Bất động sản",
                                slug: "bat-dong-san",
                        },
                        {
                                name: "Tài chính - Chứng khoán",
                                slug: "tai-chinh",
                        },
                        {
                                name: "Thị trường",
                                slug: "kinh-doanh-thi-truong",
                        },
                        {
                                name: "Kinh tế số",
                                slug: "kinh-te-so",
                        },
                        {
                                name: "Tiền Của Tôi",
                                slug: "tien-cua-toi",
                        },
                        {
                                name: "Hàng không - Du lịch",
                                slug: "hang-khong",
                        },
                        {
                                name: "TTDN",
                                slug: "ttdn",
                        },
                        {
                                name: "Công nghiệp",
                                slug: "tieu-diem/cong-nghiep",
                        },
                ],
                slug: "kinh-doanh-tai-chinh",
        },
        {
                name: "Công nghệ",
                sub: [
                        {
                                name: "Blockchain",
                                slug: "blockchain",
                        },
                        {
                                name: "Mobile",
                                slug: "mobile",
                        },
                        {
                                name: "Gadget",
                                slug: "gadget",
                        },
                        {
                                name: "Internet",
                                slug: "internet",
                        },
                ],
                slug: "cong-nghe",
        },
        {
                name: "Thể thao",
                sub: [
                        {
                                name: "Bóng đá Việt Nam",
                                slug: "bong-da-viet-nam",
                        },
                        {
                                name: "Bóng đá Anh",
                                slug: "bong-da-anh",
                        },
                        {
                                name: "Võ thuật",
                                slug: "vo-thuat",
                        },
                        {
                                name: "eSports",
                                slug: "esports-the-thao",
                        },
                        {
                                name: "Hậu trường",
                                slug: "hau-truong-the-thao",
                        },
                        {
                                name: "Dinh dưỡng Thể thao",
                                slug: "dinh-duong-the-thao",
                        },
                ],
                slug: "the-thao",
        },
        {
                name: "Giải trí",
                sub: [
                        {
                                name: "Đời sống Sao",
                                slug: "doi-song-sao",
                        },
                        {
                                name: "Âm nhạc",
                                slug: "am-nhac",
                        },
                        {
                                name: "Phim ảnh",
                                slug: "phim-anh",
                        },
                        {
                                name: "Thời trang Sao",
                                slug: "thoi-trang",
                        },
                        {
                                name: "Hoa hậu",
                                slug: "tin-tuc-hoa-hau",
                        },
                ],
                slug: "giai-tri",
        },
        {
                name: "Đời sống",
                sub: [
                        {
                                name: "Giới trẻ",
                                slug: "gioi-tre",
                        },
                        {
                                name: "Xu hướng",
                                slug: "xu-huong",
                        },
                        {
                                name: "Sống đẹp",
                                slug: "song-dep",
                        },
                        {
                                name: "Gia đình",
                                slug: "doi-song-gia-dinh",
                        },
                        {
                                name: "Gender",
                                slug: "gender",
                        },
                        {
                                name: "Sự kiện",
                                slug: "su-kien",
                        },
                ],
                slug: "doi-song",
        },
        {
                name: "Xe",
                sub: [
                        {
                                name: "Ôtô",
                                slug: "oto",
                        },
                        {
                                name: "EV",
                                slug: "xe-dien",
                        },
                        {
                                name: "Đánh giá",
                                slug: "danh-gia",
                        },
                        {
                                name: "Xe máy",
                                slug: "xe-may",
                        },
                ],
                slug: "oto-xe-may",
        },
];
