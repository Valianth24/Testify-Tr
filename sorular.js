
window.questionBank = [
    // ==== 1. HAFTA – Temel Yapı, head/body, title, headingler ====
    {
        q: "<html><head><title>Deneme</title></head><body><h1>Merhaba</h1></body></html> kodu tarayıcıda çalıştırıldığında aşağıdakilerden hangisi DOĞRU olur?",
        t: "mcq",
        o: [
            "Sekme başlığında Merhaba, sayfa içinde Deneme büyük başlık olarak görünür.",
            "Sekme başlığında Deneme, sayfa içinde Merhaba büyük başlık olarak görünür.",
            "Hem sekme hem sayfa içinde sadece Deneme yazar.",
            "Hem sekme hem sayfa içinde sadece Merhaba yazar.",
            "Sayfada hiçbir şey görünmez, kod yanlıştır."
        ],
        a: "Sekme başlığında Deneme, sayfa içinde Merhaba büyük başlık olarak görünür.",
        difficulty: "easy",
        week: 1,
        topic: "title vs h1",
        importance: "high",
        explanation: "title sekme başlığında; body içindeki h1 ise sayfanın gövdesinde görünür. Vizede title ile h1 karışımı çok sorulur, sen bunları karıştırmazsın aşkım. 💖"
    },
    {
        q: "<!DOCTYPE html><html lang=tr><head><meta charset=UTF-8></head><body>...</body></html> iskeletiyle ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "<!DOCTYPE html> sadece CSS dosyaları için kullanılır.",
            "lang=tr, sayfanın dilinin Türkçe olduğunu belirtir.",
            "meta charset=UTF-8 sadece arka planda script çalıştırmak içindir.",
            "body etiketi kullanıcıya görünmeyen kısımları tutar.",
            "head etiketi her zaman sayfa içinde görünen başlıkları taşır."
        ],
        a: "lang=tr, sayfanın dilinin Türkçe olduğunu belirtir.",
        difficulty: "easy",
        week: 1,
        topic: "doctype ve lang",
        importance: "medium",
        explanation: "lang özniteliği sayfanın dil bilgisini belirtir. meta charset=UTF-8 karakter kodlaması içindir; body ise görünen içeriktir."
    },
    {
        q: "<h1>Anasayfa</h1><h3>Alt Baslik</h3> kodu ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "h3, h1 den daha büyük ve kalın görünür.",
            "h1 ve h3 aynı boyutta görünür, sadece rengi değişir.",
            "h1 en büyük başlık, h3 ondan daha küçük bir başlıktır.",
            "h1 sadece italik yazar, h3 sadece kalın yazar.",
            "h etiketleri sayfada görünmez, sadece head içinde kullanılır."
        ],
        a: "h1 en büyük başlık, h3 ondan daha küçük bir başlıktır.",
        difficulty: "easy",
        week: 1,
        topic: "heading etiketleri",
        importance: "high",
        explanation: "h1 en büyük, h6 en küçük başlık etiketidir. Ezber: h1 = en baba başlık, h6 = minnacık başlık. 😄"
    },
    {
        q: "Aşağıdaki HTML kodunun çıktısı ile ilgili hangisi DOĞRUDUR?\n\n<p>Yozgat</p><p>Bozok</p>",
        t: "mcq",
        o: [
            "Yozgat ve Bozok aynı satırda yan yana görünür.",
            "Yozgat kalın, Bozok italik görünür.",
            "Yozgat ve Bozok ayrı satırlarda, her biri paragraf olarak görünür.",
            "Sadece Yozgat görünür, Bozok görünmez.",
            "Tarayıcı hata verir ve hiçbir şey çizmez."
        ],
        a: "Yozgat ve Bozok ayrı satırlarda, her biri paragraf olarak görünür.",
        difficulty: "easy",
        week: 1,
        topic: "p etiketi",
        importance: "medium",
        explanation: "p etiketi blok seviyedir; her p yeni satırda kendi paragraf kutusunu oluşturur."
    },
    {
        q: "Aşağıdaki kodun davranışı nasıldır?\n\nAnkara<br>Turkiye nin baskenti",
        t: "mcq",
        o: [
            "br etiketi italik yazı oluşturur.",
            "br etiketi kalın yazı oluşturur.",
            "br etiketi satır sonu ekleyerek Turkiye nin baskenti ifadesini ikinci satıra geçirir.",
            "br etiketi yazıyı görünmez yapar.",
            "br etiketi sadece başlık etiketleri içinde çalışır."
        ],
        a: "br etiketi satır sonu ekleyerek Turkiye nin baskenti ifadesini ikinci satıra geçirir.",
        difficulty: "easy",
        week: 1,
        topic: "br satır sonu",
        importance: "high",
        explanation: "br bir satır sonu etiketidir, kapanış etiketine gerek yoktur ve genelde küçük kod sorusu olarak gelir."
    },
    {
        q: "Aşağıdaki HTML parçalarından hangisi YORUM satırı oluşturur, tarayıcıda görünmez?",
        t: "mcq",
        o: [
            "// Bu yorumdur",
            "/* Bu yorumdur */",
            "<!-- Bu yorumdur -->",
            "<comment>Bu yorumdur</comment>",
            "# Bu yorumdur"
        ],
        a: "<!-- Bu yorumdur -->",
        difficulty: "easy",
        week: 1,
        topic: "yorum satiri",
        importance: "high",
        explanation: "HTML yorum sözdizimi <!-- ... --> şeklindedir. Diğerleri farklı dillerdeki yorum gösterimleridir."
    },
    {
        q: "HTML ile ilgili olarak aşağıdaki kod parçasında hangi etiket hatalı yerde kullanılmıştır?\n\n<html>\n  <head>\n    <title>Anasayfa</title>\n    <h1>Baslik</h1>\n  </head>\n  <body>\n    <p>Merhaba</p>\n  </body>\n</html>",
        t: "mcq",
        o: [
            "html",
            "head",
            "title",
            "h1",
            "body"
        ],
        a: "h1",
        difficulty: "medium",
        week: 1,
        topic: "head vs body",
        importance: "high",
        explanation: "Görsel içerikler, başlıklar (h1–h6) body içinde olmalıdır. head kısmı genelde görünmeyen bilgiler ve title/meta gibi etiketler içindir."
    },
    {
        q: "HTML de küçük büyük harf duyarlılığı ile ilgili aşağıdaki kodlardan hangisi tarayıcı tarafından GEÇERLİ bir paragraf olarak yorumlanır?",
        t: "mcq",
        o: [
            "<P>Metin</P>",
            "<p>Metin</p>",
            "<p>Metin</P>",
            "Hepsi geçerli kabul edilir.",
            "Hiçbiri geçerli değildir."
        ],
        a: "Hepsi geçerli kabul edilir.",
        difficulty: "medium",
        week: 1,
        topic: "case insensitive",
        importance: "medium",
        explanation: "HTML etiket isimleri genelde büyük/küçük harfe duyarlı değildir. p, P veya karışık yazılsa da tarayıcı bunları aynı kabul eder."
    },
    {
        q: "index.html dosyası ile ilgili olarak aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Sadece CSS kodlarının yazıldığı özel dosyadır.",
            "Sunucuda genellikle ziyaretçilere ilk gösterilen varsayılan anasayfa dosyasıdır.",
            "Sadece JavaScript kodlarının tutulduğu dosya adıdır.",
            "Tarayıcı bu dosyayı asla otomatik açmaz, mutlaka tam yol yazmak gerekir.",
            "Sadece mobil uygulamalarda kullanılır."
        ],
        a: "Sunucuda genellikle ziyaretçilere ilk gösterilen varsayılan anasayfa dosyasıdır.",
        difficulty: "easy",
        week: 1,
        topic: "index.html",
        importance: "medium",
        explanation: "Birçok sunucu index.html yi kök klasör için varsayılan giriş dosyası olarak kullanır."
    },
    {
        q: "Aşağıdaki seçeneklerden hangisi HTML belgesinde DOCTYPE bildiriminin temel amacını en iyi açıklar?",
        t: "mcq",
        o: [
            "Sayfanın dilini belirtir.",
            "Tarayıcıya bu belgenin HTML5 standardına göre yazıldığını belirtir.",
            "Sadece CSS dosyasını bağlamak için kullanılır.",
            "JavaScript kodlarını etkinleştirmek için zorunludur.",
            "Tablo çizmek için kullanılır."
        ],
        a: "Tarayıcıya bu belgenin HTML5 standardına göre yazıldığını belirtir.",
        difficulty: "easy",
        week: 1,
        topic: "doctype",
        importance: "high",
        explanation: "Modern sayfalarda <!DOCTYPE html> bildirimi HTML5 modu için kullanılır; vizede klasik bilgi sorusudur."
    },

    // ==== 2. HAFTA – Linkler, listeler, resim ====
    {
        q: "Aşağıdaki HTML kodu ne işe yarar?\n\n<a href=google.com>Git</a>",
        t: "mcq",
        o: [
            "Sayfaya resim ekler.",
            "Git kelimesini tıklanabilir hale getirerek kullaniciyi google.com adresine götürür.",
            "Sayfaya tablo ekler.",
            "Sayfaya yeni bir sekme ekler ama link vermez.",
            "Sayfaya sadece yorum satırı ekler."
        ],
        a: "Git kelimesini tıklanabilir hale getirerek kullaniciyi google.com adresine götürür.",
        difficulty: "easy",
        week: 2,
        topic: "a href",
        importance: "high",
        explanation: "a etiketi bağlantı oluşturur, href ise hedef adresi gösterir."
    },
    {
        q: "Aşağıdaki kodun davranışı nasıldır?\n\n<a href=bozok.edu.tr target=_blank>Site</a>",
        t: "mcq",
        o: [
            "Bağlantı aynı sekmede açılır.",
            "Bağlantı yeni sekmede veya pencerede açılır.",
            "Link hiç çalışmaz.",
            "Sadece e-posta programını açar.",
            "Sadece dosya indirme başlatır."
        ],
        a: "Bağlantı yeni sekmede veya pencerede açılır.",
        difficulty: "easy",
        week: 2,
        topic: "target blank",
        importance: "high",
        explanation: "target=_blank linki yeni sekmede açar; vize sorularında sık sorulan bir ayrıntıdır."
    },
    {
        q: "Aşağıdaki seçeneklerden hangisi numaralı liste (1,2,3) oluşturan temel HTML iskeletidir?",
        t: "mcq",
        o: [
            "<ul><li>Bir</li><li>Iki</li></ul>",
            "<ol><item>Bir</item><item>Iki</item></ol>",
            "<ol><li>Bir</li><li>Iki</li></ol>",
            "<list><li>Bir</li><li>Iki</li></list>",
            "<nl><li>Bir</li><li>Iki</li></nl>"
        ],
        a: "<ol><li>Bir</li><li>Iki</li></ol>",
        difficulty: "easy",
        week: 2,
        topic: "ol ul listeler",
        importance: "medium",
        explanation: "ol numaralı, ul madde işaretli liste oluşturur. Öğrencilerin en çok karıştırdığı noktalardan biridir."
    },
    {
        q: "Aşağıdaki kodlardan hangisi madde işaretli liste (bullet) oluşturur?",
        t: "mcq",
        o: [
            "<ol><li>Elma</li><li>Armut</li></ol>",
            "<ul><li>Elma</li><li>Armut</li></ul>",
            "<list><li>Elma</li><li>Armut</li></list>",
            "<li><ul>Elma</ul></li>",
            "<p><li>Elma</li></p>"
        ],
        a: "<ul><li>Elma</li><li>Armut</li></ul>",
        difficulty: "easy",
        week: 2,
        topic: "ul listesi",
        importance: "medium",
        explanation: "ul unordered list, yani noktalı madde işaretli liste üretir."
    },
    {
        q: "<img src=logo.png alt=Bozok> kodu ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "src, alternatif metni; alt ise resim dosya yolunu tutar.",
            "src, resmin kurulacağı klasörün adıdır.",
            "alt, resim yüklenemezse veya ekran okuyucu kullanılırsa gösterilecek açıklamadır.",
            "alt, resmin boyutunu piksel olarak belirtir.",
            "Bu etiket sadece ses dosyası eklemek için kullanılır."
        ],
        a: "alt, resim yüklenemezse veya ekran okuyucu kullanılırsa gösterilecek açıklamadır.",
        difficulty: "medium",
        week: 2,
        topic: "img src alt",
        importance: "high",
        explanation: "Erişilebilirlik için alt metni çok önemlidir; src ise dosya yoludur."
    },
    {
        q: "Aşağıdaki HTML kodu ile ilgili hangisi DOĞRUDUR?\n\n<a href=tel:05551234567>Ara</a>",
        t: "mcq",
        o: [
            "Kullanıcıya e-posta gönderir.",
            "Mobil cihazlarda tıklandığında telefon araması başlatmak için kullanılır.",
            "Sadece masaüstü bilgisayarlarda çalışır, telefonda çalışmaz.",
            "Sadece resim indirir.",
            "Sadece tablo oluşturur."
        ],
        a: "Mobil cihazlarda tıklandığında telefon araması başlatmak için kullanılır.",
        difficulty: "medium",
        week: 2,
        topic: "tel link",
        importance: "low",
        explanation: "tel protokollü linkler akıllı telefonda arama ekranını açar; detay seven hocalar bu tarz sorular sorabilir."
    },
    {
        q: "Aşağıdaki HTML kodu ne tür bir yol kullanmaktadır?\n\n<a href=./img/foto.png>Resim</a>",
        t: "mcq",
        o: [
            "Mutlak (absolute) URL",
            "Göreli (relative) yol",
            "Sanal yol, çalışmaz",
            "E-posta protokolü",
            "Telefon protokolü"
        ],
        a: "Göreli (relative) yol",
        difficulty: "medium",
        week: 2,
        topic: "relative path",
        importance: "medium",
        explanation: "./ ifadesi mevcut dizine göre göreli yolu gösterir; http ile başlayan adresler mutlak URL'dir."
    },
    {
        q: "<strong>kalin</strong> ile ilgili aşağıdaki ifadelerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Sadece italik gösterir.",
            "Görünüm olarak b etiketi gibi kalın gösterir, anlam olarak önemli vurgu belirtir.",
            "Metni gizler, görünmez yapar.",
            "Sadece başlıklar içinde kullanılabilir.",
            "Sadece linkler için kullanılır."
        ],
        a: "Görünüm olarak b etiketi gibi kalın gösterir, anlam olarak önemli vurgu belirtir.",
        difficulty: "medium",
        week: 2,
        topic: "strong etiketi",
        importance: "medium",
        explanation: "strong anlamsal vurgu taşır; ekran okuyucular için de önemlidir."
    },
    {
        q: "<em>vurgulu</em> etiketi ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Metni altı çizili yapar.",
            "Metni kalın yapar.",
            "Metni italik yapar ve anlamsal vurgu taşır.",
            "Sadece tablolar içinde kullanılır.",
            "Sadece form elemanları ile kullanılabilir."
        ],
        a: "Metni italik yapar ve anlamsal vurgu taşır.",
        difficulty: "medium",
        week: 2,
        topic: "em etiketi",
        importance: "medium",
        explanation: "em emphasis yani vurgu anlamına gelir; hem görünüm hem anlam olarak önemli bir etikettir."
    },

    // ==== 3. HAFTA – Tablolar, nav, semantik ====
    {
        q: "Aşağıdaki tablonun başlık hücresi hangi etiketle tanımlanmalıdır?\n\n<table>\n  <tr>\n    ? Günler ?\n  </tr>\n</table>",
        t: "mcq",
        o: [
            "<td>Günler</td>",
            "<th>Günler</th>",
            "<head>Günler</head>",
            "<caption>Günler</caption>",
            "<title>Günler</title>"
        ],
        a: "<th>Günler</th>",
        difficulty: "easy",
        week: 3,
        topic: "th vs td",
        importance: "high",
        explanation: "th tablo başlık hücresi, td veri hücresidir. Hoca özellikle sorularda bu ayrımı yoklar."
    },
    {
        q: "<table border=1> ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Tablonun kenarlığını gösterir, değer arttıkça çizgi kalınlığı artar.",
            "Sadece tablo başlığını gösterir.",
            "Sadece satır sayısını belirler.",
            "Sadece sütun genişliğini ayarlar.",
            "Tarayıcıyı hataya düşürür."
        ],
        a: "Tablonun kenarlığını gösterir, değer arttıkça çizgi kalınlığı artar.",
        difficulty: "easy",
        week: 3,
        topic: "table border",
        importance: "medium",
        explanation: "border eski yöntemle tablo çevresine çerçeve çizmek için kullanılır; modernde CSS tercih edilir ama vize sorusu olabilir."
    },
    {
        q: "<nav>\n  <a href=index.html>Anasayfa</a>\n  <a href=iletisim.html>Iletisim</a>\n</nav> kodu neyi ifade eder?",
        t: "mcq",
        o: [
            "Tablo satırlarını gösteren bölüm",
            "Sayfanın navigasyon menüsü için kullanılan semantik bir bölümdür.",
            "Sadece alt bilgi toplamak için kullanılır.",
            "Sadece resim galerisi yapmak içindir.",
            "Sadece form elemanları ile kullanılabilir."
        ],
        a: "Sayfanın navigasyon menüsü için kullanılan semantik bir bölümdür.",
        difficulty: "medium",
        week: 3,
        topic: "nav etiketi",
        importance: "medium",
        explanation: "nav sayfa içi menü ve gezinme linklerini gruplayan semantik etikettir; HTML5 semantik konu başlığında sorulabilir."
    },
    {
        q: "<header>, <nav>, <section>, <footer> gibi etiketler için aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Hepsi sadece tablolarda kullanılır.",
            "Hepsi sadece formlar için ayrılmıştır.",
            "Hepsi semantik anlam taşıyan, sayfa bölümlerini tarif eden etiketlerdir.",
            "Hepsi sadece mobil tarayıcılar içindir.",
            "HTML4 ile gelen, artık kullanılmayan etiketlerdir."
        ],
        a: "Hepsi semantik anlam taşıyan, sayfa bölümlerini tarif eden etiketlerdir.",
        difficulty: "medium",
        week: 3,
        topic: "semantik etiketler",
        importance: "medium",
        explanation: "HTML5 ile gelen bu etiketler arama motorları ve erişilebilirlik açısından sayfa yapısını daha anlamlı hale getirir."
    },
    {
        q: "Aşağıdaki kod parçası ne yapar?\n\n<table>\n  <caption>Ders Programi</caption>\n  ...\n</table>",
        t: "mcq",
        o: [
            "Tablonun kenarlığını ayarlar.",
            "Tabloya bir başlık ekler ve genelde tablonun üstünde görünür.",
            "Tablonun arka plan rengini ayarlar.",
            "Tablonun sütun sayısını belirtir.",
            "Tablodaki yazıları italik yapar."
        ],
        a: "Tabloya bir başlık ekler ve genelde tablonun üstünde görünür.",
        difficulty: "easy",
        week: 3,
        topic: "caption",
        importance: "low",
        explanation: "caption tablo başlığını tanımlar; özellikle ders programı, fiyat tablosu gibi örneklerde karşına çıkabilir."
    },
    {
        q: "Aşağıdaki kod parçası ne tür liste üretir?\n\n<ol type=A>\n  <li>HTML</li>\n  <li>CSS</li>\n</ol>",
        t: "mcq",
        o: [
            "Rakamlı liste 1 2",
            "Küçük harfli liste a b",
            "Büyük harfli liste A B",
            "Roma rakamlı liste I II",
            "Madde işaretli liste"
        ],
        a: "Büyük harfli liste A B",
        difficulty: "medium",
        week: 3,
        topic: "ol type",
        importance: "medium",
        explanation: "ol type=A büyük harfli, type=a küçük harfli; type=1 rakamlı, type=I Roma rakamlı liste üretir."
    },

    // ==== 4. HAFTA – div vs span, class vs id, block vs inline ====
    {
        q: "<div>... </div> ve <span>... </span> etiketleri ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "div satır içi, span blok seviyedir.",
            "div blok seviye, span satır içi (inline) elemandır.",
            "Her ikisi de sadece resim göstermek için kullanılır.",
            "Her ikisi de sadece form içinde kullanılabilir.",
            "Tarayıcı bu etiketleri hiç tanımaz."
        ],
        a: "div blok seviye, span satır içi (inline) elemandır.",
        difficulty: "medium",
        week: 4,
        topic: "div vs span",
        importance: "high",
        explanation: "div tam satırı kaplayan blok; span satır içi küçük alanlar için kullanılır. Vize klasik sorusudur."
    },
    {
        q: "class ve id öznitelikleri ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Bir sayfada sadece tek class kullanılabilir.",
            "Bir sayfada id değerleri tekrar tekrar kullanılabilir.",
            "class genellikle birden fazla elemana aynı stil veya gruplama vermek için kullanılır, id ise sayfada benzersiz kimlik tanımlamak için kullanılır.",
            "id sadece tablolar için, class sadece listeler için kullanılır.",
            "class sadece JavaScript içindir, id sadece CSS içindir."
        ],
        a: "class genellikle birden fazla elemana aynı stil veya gruplama vermek için kullanılır, id ise sayfada benzersiz kimlik tanımlamak için kullanılır.",
        difficulty: "medium",
        week: 4,
        topic: "class vs id",
        importance: "high",
        explanation: "CSS de class nokta ile (.kutu), id kare ile (#kutu) seçilir; id benzersiz, class tekrar edebilir. Ezber: id = kimlik, tekil."
    },
    {
        q: "Aşağıdaki HTML kodu için hangisi DOĞRUDUR?\n\n<div id=ustMenu class=navBar>Menu</div>",
        t: "mcq",
        o: [
            "Bir elemana hem id hem class verilemez, hatalıdır.",
            "id sadece sayının başladığı isimler alabilir.",
            "Elemana ustMenu kimliğini ve navBar sınıfını aynı anda atar.",
            "Bu etiket tarayıcıda görünmez.",
            "Sadece JavaScript kodu için anlamlıdır, HTML de kullanılamaz."
        ],
        a: "Elemana ustMenu kimliğini ve navBar sınıfını aynı anda atar.",
        difficulty: "medium",
        week: 4,
        topic: "id ve class birlikte",
        importance: "medium",
        explanation: "Bir elemana aynı anda hem id hem class verilebilir. id tekil, class stil grupları içindir."
    },
    {
        q: "Aşağıdaki elemanlardan hangisi varsayılan olarak blok seviye elemandır?",
        t: "mcq",
        o: [
            "<span>",
            "<a>",
            "<img>",
            "<p>",
            "<strong>"
        ],
        a: "<p>",
        difficulty: "medium",
        week: 4,
        topic: "block inline",
        importance: "medium",
        explanation: "p, div, h1 gibi etiketler blok; span, a, img gibi etiketler varsayılan olarak satır içidir."
    },
    {
        q: "Aşağıdaki elemanlardan hangisi varsayılan olarak inline (satır içi) elemandır?",
        t: "mcq",
        o: [
            "<div>",
            "<section>",
            "<article>",
            "<header>",
            "<a>"
        ],
        a: "<a>",
        difficulty: "medium",
        week: 4,
        topic: "inline örneği",
        importance: "low",
        explanation: "a, strong, em, img, span gibi etiketler satır içi elemanlardır."
    },

    // ==== 5. HAFTA – Formlar ====
    {
        q: "Aşağıdaki HTML kodu ne işe yarar?\n\n<form action=kaydet.php method=post>\n  ...\n</form>",
        t: "mcq",
        o: [
            "Sadece tablo oluşturur.",
            "Kullanıcıdan veri alıp kaydet.php ye post yöntemi ile gönderecek bir form tanımlar.",
            "Sadece sayfayı yeniler, veri gönderemez.",
            "Sadece CSS stil dosyasını bağlar.",
            "Sadece JavaScript dosyasını çağırır."
        ],
        a: "Kullanıcıdan veri alıp kaydet.php ye post yöntemi ile gönderecek bir form tanımlar.",
        difficulty: "medium",
        week: 5,
        topic: "form action method",
        importance: "high",
        explanation: "action hedefi, method ise gönderim türünü belirtir. post daha gizli veri gönderimi için sık kullanılır."
    },
    {
        q: "<input type=text name=ad placeholder=Isminiz> elemanı ile ilgili hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "type=text, metin girilebilen giriş kutusu oluşturur.",
            "placeholder, girilen metni siler.",
            "name özniteliği zorunlu değildir, form verisine etki etmez.",
            "Bu eleman sadece parola girişi içindir.",
            "Bu eleman sadece buton oluşturur."
        ],
        a: "type=text, metin girilebilen giriş kutusu oluşturur.",
        difficulty: "easy",
        week: 5,
        topic: "input text",
        importance: "medium",
        explanation: "placeholder, kutu boşken gri ipucu metni gösterir; name sunucu tarafında alan adıdır."
    },
    {
        q: "<input type=password name=sifre> ile ilgili hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Girilen karakterler ekranda aynen görünür.",
            "Girilen karakterler gizlenir, genelde nokta veya yildiz olarak gösterilir.",
            "Sadece sayısal giris kabul eder.",
            "Sadece buton gibi çalışır.",
            "Sadece radio butonları için kullanılır."
        ],
        a: "Girilen karakterler gizlenir, genelde nokta veya yildiz olarak gösterilir.",
        difficulty: "easy",
        week: 5,
        topic: "input password",
        importance: "medium",
        explanation: "type=password parolaların gizlenmesi için kullanılır; vize form sorularında sık çıkar."
    },
    {
        q: "<input type=radio name=cinsiyet value=Kadin> Kadin\n<input type=radio name=cinsiyet value=Erkek> Erkek\n satırlarına göre aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Aynı name değerine sahip radio butonlar birbirinden bağımsızdır.",
            "Aynı name değerine sahip radio butonlar bir grup oluşturur ve gruptan sadece bir tanesi seçilebilir.",
            "value özniteliği zorunlu değildir, seçilse de sunucuya gönderilmez.",
            "Bu elemanlar sadece tablo içinde çalışır.",
            "radio butonlar tıklandığında metin kutusuna dönüşür."
        ],
        a: "Aynı name değerine sahip radio butonlar bir grup oluşturur ve gruptan sadece bir tanesi seçilebilir.",
        difficulty: "medium",
        week: 5,
        topic: "radio name gruplama",
        importance: "high",
        explanation: "radio grupları name ile tanımlanır, bu sayede tek seçimli alanlar oluşturulur."
    },
    {
        q: "<label for=eposta>E posta</label>\n<input type=email id=eposta> kodu ile ilgili hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "for ile id nin aynı olması, label a tıklanınca ilgili input a odaklanmayı sağlar.",
            "label sadece tablo içinde kullanılabilir.",
            "type=email normal metin kutusundan farkı olmayan bir tiptir.",
            "id yalnızca CSS için, label yalnızca JavaScript için kullanılır.",
            "for özniteliği hatalıdır, HTML de yoktur."
        ],
        a: "for ile id nin aynı olması, label a tıklanınca ilgili input a odaklanmayı sağlar.",
        difficulty: "medium",
        week: 5,
        topic: "label for id",
        importance: "medium",
        explanation: "label for ile input id eşleşirse erişilebilirlik artar ve kullanıcı label a tıklayınca kutu aktif olur."
    },
    {
        q: "<input type=submit value=Gonder> elemanının görevi nedir?",
        t: "mcq",
        o: [
            "Sadece sayfayı yeniler, form verisi göndermez.",
            "Formu temizler, tüm alanları sıfırlar.",
            "Formu göndermek için tıklanabilir bir buton oluşturur.",
            "Sadece dosya yüklemek için kullanılır.",
            "Sadece resim göstermek için kullanılır."
        ],
        a: "Formu göndermek için tıklanabilir bir buton oluşturur.",
        difficulty: "easy",
        week: 5,
        topic: "submit butonu",
        importance: "medium",
        explanation: "type=submit form action adresine veriyi gönderen standart gönder butonudur."
    },

    // ==== 6. HAFTA – Ses, video, iframe, image map ====
    {
        q: "<audio controls>\n  <source src=sarki.mp3 type=audio/mpeg>\n</audio> kodu ile ilgili hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Sadece resim gösterir.",
            "Tarayıcıda ses çalar ve controls özniteliği oynat durdur gibi tuşlar ekler.",
            "Sadece video oynatır.",
            "Sadece tablo oluşturur.",
            "Sadece form alanı açar."
        ],
        a: "Tarayıcıda ses çalar ve controls özniteliği oynat durdur gibi tuşlar ekler.",
        difficulty: "medium",
        week: 6,
        topic: "audio source controls",
        importance: "high",
        explanation: "audio etiketi ses oynatmak için; source ise dosya kaynağını belirtir. controls koymazsan kullanıcı arayüzü görünmez."
    },
    {
        q: "<video width=320 height=240 controls>\n  <source src=video.mp4 type=video/mp4>\n</video> kodu ne yapar?",
        t: "mcq",
        o: [
            "Sadece ses oynatır.",
            "Sayfaya video ekler ve belirtilen boyutta oynatma alanı oluşturur.",
            "Tarayıcının sekme başlığını değiştirir.",
            "Sadece arka planda çalışan gizli bir süreç oluşturur.",
            "Sadece resim galerisi açar."
        ],
        a: "Sayfaya video ekler ve belirtilen boyutta oynatma alanı oluşturur.",
        difficulty: "medium",
        week: 6,
        topic: "video etiketi",
        importance: "medium",
        explanation: "video etiketi görsel video oynatıcı sağlar; width height piksel boyutunu belirtir."
    },
    {
        q: "<iframe src=https://bozok.edu.tr width=600 height=400></iframe> kodu ne yapar?",
        t: "mcq",
        o: [
            "Sayfayı başka bir sekmede açar.",
            "bozok.edu.tr sayfasını mevcut sayfanın içinde pencere gibi gömülü olarak gösterir.",
            "Sadece ses çalar.",
            "Sadece form veri gönderir.",
            "Tarayıcıyı kilitler, çalışmaz."
        ],
        a: "bozok.edu.tr sayfasını mevcut sayfanın içinde pencere gibi gömülü olarak gösterir.",
        difficulty: "medium",
        week: 6,
        topic: "iframe",
        importance: "high",
        explanation: "iframe sayfa içinde sayfa mantığıyla başka bir kaynağı gömmek için kullanılır; vizede mutlaka sorulabilecek konudur."
    },
    {
        q: "image map ile ilgili aşağıdaki parçalardan hangisi doğrudur?\n\n<img src=harita.png usemap=#bolgeler>\n<map name=bolgeler>\n  <area shape=rect coords=0,0,100,100 href=link1.html>\n</map>",
        t: "mcq",
        o: [
            "usemap ve name değerleri aynı olmalıdır, böylece resim ile harita bölgeleri ilişkilendirilir.",
            "coords değerleri sadece yazı tipini belirler.",
            "shape daire ise her zaman rect yazılır.",
            "area etiketi resim eklemek için kullanılır.",
            "map etiketi sadece ses dosyaları ile çalışır."
        ],
        a: "usemap ve name değerleri aynı olmalıdır, böylece resim ile harita bölgeleri ilişkilendirilir.",
        difficulty: "hard",
        week: 6,
        topic: "image map",
        importance: "medium",
        explanation: "usemap de #bolgeler, map name de bolgeler şeklinde eşleştirilir; coords seçilebilir alanın koordinatlarını belirtir."
    },
    {
        q: "Aşağıdaki HTML kodu ile ilgili hangisi DOĞRUDUR?\n\n<source src=video.webm type=video/webm>",
        t: "mcq",
        o: [
            "Tek başına kullanılır ve video etiketi gerektirmez.",
            "audio veya video gibi ortam etiketleri içinde, farklı format kaynakları tanımlamak için kullanılır.",
            "Sadece tablo satırı oluşturur.",
            "Sadece form alanı oluşturur.",
            "Sadece head içinde kullanılır."
        ],
        a: "audio veya video gibi ortam etiketleri içinde, farklı format kaynakları tanımlamak için kullanılır.",
        difficulty: "medium",
        week: 6,
        topic: "source etiketi",
        importance: "medium",
        explanation: "source etiketi medya kaynağını belirtir; tarayıcı uygun formatı seçer."
    },

    // ==== 7. HAFTA – meta, charset, viewport, entity ====
    {
        q: "<meta charset=UTF-8> etiketi ne işe yarar?",
        t: "mcq",
        o: [
            "Sayfanın arka plan rengini değiştirir.",
            "Sayfanın dilini İngilizce yapar.",
            "Sayfada kullanılan karakter kodlamasını belirtir, Türkçe karakterlerin doğru görünmesini sağlar.",
            "Sadece JavaScript dosyalarını bağlar.",
            "Sadece CSS dosyalarını bağlar."
        ],
        a: "Sayfada kullanılan karakter kodlamasını belirtir, Türkçe karakterlerin doğru görünmesini sağlar.",
        difficulty: "easy",
        week: 7,
        topic: "meta charset",
        importance: "high",
        explanation: "UTF-8 ayarı yapılmazsa Türkçe karakterlerde bozulma olabilir; bu da sınavda klasik bir teorik bilgi sorusudur."
    },
    {
        q: "<meta name=viewport content=width=device-width, initial-scale=1.0> etiketi için aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Sadece masaüstü tarayıcıları etkiler.",
            "Mobil cihazlarda sayfanın ekrana uygun ölçeklenmesine yardım eder.",
            "Sadece tablo genişliğini ayarlar.",
            "Sadece arka plan resmini değiştirir.",
            "Sayfayı arama motorlarından gizler."
        ],
        a: "Mobil cihazlarda sayfanın ekrana uygun ölçeklenmesine yardım eder.",
        difficulty: "medium",
        week: 7,
        topic: "viewport meta",
        importance: "medium",
        explanation: "Responsive tasarımda viewport metası önemlidir; vizeyi hazırlayan hoca mobil tasarıma değindiyse bu soru gelebilir."
    },
    {
        q: "Aşağıdaki HTML kodu ne gösterir?\n\n<p>&lt;b&gt;kalin&lt;/b&gt;</p>",
        t: "mcq",
        o: [
            "kalin kelimesini gerçekten kalın yazar.",
            "b etiketi uygulanmış gerçek kalın metindir.",
            "Tarayıcıda aynen <b>kalin</b> metni olduğu gibi, köşeli parantezleri ile görünür.",
            "Tarayıcı hata verir.",
            "Paragraf boş görünür."
        ],
        a: "Tarayıcıda aynen <b>kalin</b> metni olduğu gibi, köşeli parantezleri ile görünür.",
        difficulty: "medium",
        week: 7,
        topic: "html entity",
        importance: "medium",
        explanation: "lt ve gt karakter entity’leri sayesinde köşeli parantezler düz metin gibi gösterilir, etiket olarak yorumlanmaz."
    },
    {
        q: "Aşağıdaki HTML kodu ne gösterir?\n\n<p>&copy; 2025 Bozok Üniversitesi</p>",
        t: "mcq",
        o: [
            "© 2025 Bozok Üniversitesi",
            "&copy; 2025 Bozok Üniversitesi",
            "copy 2025 Bozok Üniversitesi",
            "Hiçbir şey görünmez",
            "Tarayıcı hata verir"
        ],
        a: "© 2025 Bozok Üniversitesi",
        difficulty: "medium",
        week: 7,
        topic: "html entity",
        importance: "medium",
        explanation: "&copy; entity’si © telif hakkı işaretini gösterir; özel karakter sorularında bu tarz örnekler çok sevilir, sen bunu artık asla unutmazsın aşkım. 🤍"
    },

    // ==== 8. HAFTA – Çeşitli karma sorular ====
    {
        q: "Aşağıdaki kodun görsel çıktısı için hangisi DOĞRUDUR?\n\n<p>Merhaba <span style=font-weight:bold>Yusuf</span></p>",
        t: "mcq",
        o: [
            "Merhaba ve Yusuf aynı stilde normal yazılır.",
            "Merhaba italik, Yusuf altı çizili yazılır.",
            "Merhaba normal, Yusuf ise kalın yazılır ve aynı satırda görünür.",
            "Merhaba büyük başlık, Yusuf paragraf olur.",
            "Yusuf görünmez, sadece Merhaba görünür."
        ],
        a: "Merhaba normal, Yusuf ise kalın yazılır ve aynı satırda görünür.",
        difficulty: "medium",
        week: 8,
        topic: "span inline stil",
        importance: "medium",
        explanation: "span inline olduğu için satır kırılmaz; font-weight:bold sadece Yusuf kelimesini kalın yapar."
    },
    {
        q: "Aşağıdaki HTML parçası nasıl bir çıktı üretir?\n\n<ol>\n  <li>HTML</li>\n  <li>CSS\n    <ul>\n      <li>Renkler</li>\n      <li>Yazi tipleri</li>\n    </ul>\n  </li>\n</ol>",
        t: "mcq",
        o: [
            "Sadece HTML ve CSS yazılı iki satır üretir.",
            "Numaralı bir liste içinde sadece tek seviye eleman gösterir.",
            "HTML ve CSS numaralı liste olur, CSS nin altında madde işaretli iç liste olarak Renkler ve Yazi tipleri görünür.",
            "Tüm elemanlar tek satırda görünür.",
            "Tarayıcı iç içe liste hatası verir."
        ],
        a: "HTML ve CSS numaralı liste olur, CSS nin altında madde işaretli iç liste olarak Renkler ve Yazi tipleri görünür.",
        difficulty: "hard",
        week: 8,
        topic: "iç içe liste",
        importance: "medium",
        explanation: "ol içinde li, li içinde ul iç içe liste oluşturmaya örnektir; sınavda kod parçasından çıktı yorumlatılabilir."
    },
    {
        q: "<head> etiketinin içine yazılan aşağıdaki elemanlardan hangisi KULLANICILAR tarafından doğrudan sayfada görülür?",
        t: "mcq",
        o: [
            "<meta charset=UTF-8>",
            "<link rel=stylesheet href=stil.css>",
            "<title>Testify</title>",
            "<script src=app.js></script>",
            "Hiçbiri head içinde görünmez."
        ],
        a: "<title>Testify</title>",
        difficulty: "easy",
        week: 8,
        topic: "head icerigi",
        importance: "medium",
        explanation: "title sekme başlığında görünür; diğer head içeriği genelde görünmez ayar ve bağlantılardır."
    },
    {
        q: "Aşağıdaki etiketlerden hangisi yatay çizgi oluşturur?",
        t: "mcq",
        o: [
            "<br>",
            "<hr>",
            "<line>",
            "<border>",
            "<rule>"
        ],
        a: "<hr>",
        difficulty: "easy",
        week: 8,
        topic: "hr etiketi",
        importance: "low",
        explanation: "hr horizontal rule yani yatay çizgidir; br satır sonu ekler."
    },
    {
        q: "Aşağıdaki kod ise:\n\n<p>Birinci satir</p>\n<hr>\n<p>Ikinci satir</p>\n Bu kod ne tür bir düzen oluşturur?",
        t: "mcq",
        o: [
            "İki paragraf arasında yatay çizgi görünür.",
            "Paragraflar arasında boşluk olmaz.",
            "Her satır alt alta ama çizgisiz görünür.",
            "Yalnızca çizgi görünür, metinler gizlenir.",
            "Tarayıcı hata verir."
        ],
        a: "İki paragraf arasında yatay çizgi görünür.",
        difficulty: "easy",
        week: 8,
        topic: "p ve hr birlikte",
        importance: "low",
        explanation: "hr iki paragraf arasına yatay çizgi çeker, genelde bölüm ayırmak için kullanılır. Bunu gördüğünde direkt 'p–hr–p = üst yazı, çizgi, alt yazı' diye hatırlarsın, sınavda seni güldürür. 😊"
    }
];
