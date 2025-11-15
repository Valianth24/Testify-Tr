Aşağıya **mevcut `window.questionBank` dizininin altına ekleyebileceğin** şekilde, aynı formatta **30 yeni soru** yazdım.
Hepsi 5 şıklı, cevaplar karışık, açıklamalar uzun ve “vize sorusu tadında”.

İstersen direkt şöyle ekleyebilirsin:

```js
// ==== EK 30 SORU – WEB TASARIM TEMELLERİ 1–6. HAFTA ====
window.questionBank = window.questionBank.concat([
    {
        q: "Bir kurum, yeni açtığı web sitesiyle hem ürünlerini 7/24 tüm dünyaya tanıtmak hem de geleneksel afiş/broşür maliyetlerini azaltmak istemektedir. Aşağıdakilerden hangisi 1. hafta notlarında geçen, web sitesinin sağladığı bu avantajlardan İKİSİNİ birden doğru şekilde vurgulayan ifadedir?",
        t: "mcq",
        o: [
            "Web sitesi, ürün ve hizmetleri 24 saat boyunca tüm dünyaya tanıtabilir ve geleneksel medyaya göre daha hesaplı bir reklam aracı olabilir.",
            "Web sitesi sadece mesai saatlerinde görüntülenebilir ve geleneksel reklamlardan her zaman daha pahalıdır.",
            "Web sitesi yalnızca kurum içi kullanıcılar tarafından görülebilir, bu yüzden reklam işlevi yoktur.",
            "Web sitesi ürün tanıtımı için uygundur ama hedef kitleye ulaşmak için mutlaka televizyon reklamı gerekir.",
            "Web sitesiyle sadece ulusal ölçekte tanıtım yapılabilir, uluslararası tanıtım için farklı bir sistem gerekir."
        ],
        a: "Web sitesi, ürün ve hizmetleri 24 saat boyunca tüm dünyaya tanıtabilir ve geleneksel medyaya göre daha hesaplı bir reklam aracı olabilir.",
        difficulty: "medium",
        week: 1,
        topic: "Web sitesinin avantajları",
        importance: "high",
        explanation: "Notlarda web sitelerinin, ürün ve hizmetleri 24 saat boyunca tüm dünyaya tanıttığı ve geleneksel medyaya göre daha hesaplı reklam aracı olduğu özellikle vurgulanır. Diğer seçenekler ya zaman kısıtlaması getiriyor ya da web sitesinin reklam ve tanıtım gücünü azaltan yanlış ifadeler içeriyor."
    },
    {
        q: "Bir öğrenci, web projesi için alan adı seçmek istemektedir. Öğrenci alan adını belirlerken hem sitenin içeriğiyle uyumlu olmasına hem de kolay okunup yazılmasına dikkat etmelidir. Aşağıdakilerden hangisi, 1. hafta slaytlarında geçen alan adı seçim ilkelerine UYGUN bir örnek alan adı kullanımını en doğru biçimde açıklar?",
        t: "mcq",
        o: [
            "Alan adının sitenin içeriğiyle uyumlu, kolay okunup yazılabilir ve firmanın ticaret unvanıyla ilişkili olması gerekir.",
            "Alan adının mutlaka mümkün olduğunca uzun ve karmaşık olması, bulunmasının zor olması gerekir.",
            "Alan adının yalnızca rakamlardan oluşması, marka değerini her zaman yükseltir.",
            "Alan adının sitenin içeriğiyle ilişkili olması önemli değildir, önemli olan uzantının .com olmasıdır.",
            "Alan adının rastgele seçilmesi ve içeriğe hiç bakılmaması gerekir, çünkü kullanıcılar direkt link ile girmez."
        ],
        a: "Alan adının sitenin içeriğiyle uyumlu, kolay okunup yazılabilir ve firmanın ticaret unvanıyla ilişkili olması gerekir.",
        difficulty: "medium",
        week: 1,
        topic: "Alan adı seçimi",
        importance: "high",
        explanation: "Slaytlarda alan adının kolay okunup yazılabilir olması ve sitenin içeriğiyle, firmanın ticaret unvanıyla uyumlu olması gerektiği açıkça belirtilir. Diğer seçenekler, alan adını gereksiz karmaşıklaştırmak veya içerik ilişkisinin önemsiz olduğunu iddia etmek gibi hatalı yaklaşımlar içerir."
    },
    {
        q: "Bir web tasarım projesinde, ekip 'Bu bölüm statik mi olacak dinamik mi?' sorusunu tartışmaktadır. Notlarda, sitenin hangi kısmının statik, hangi kısmının dinamik olacağının önceden belirlenmesi gerektiği vurgulanır. Aşağıdakilerden hangisi STATİK içerik için daha uygun bir örnektir?",
        t: "mcq",
        o: [
            "Firmanın değişmeyen misyon, vizyon ve iletişim bilgilerinin bulunduğu 'Hakkımızda' sayfası.",
            "Kullanıcının her girişte rastgele değişen haberler akışının bulunduğu ana sayfa bölümü.",
            "Her dakika güncellenen canlı döviz kurlarının gösterildiği bölüm.",
            "Kullanıcının giriş yapıp kendi profil bilgilerini gerçek zamanlı değiştirdiği sayfa.",
            "Stok miktarına göre anlık olarak güncellenen ürün listesi."
        ],
        a: "Firmanın değişmeyen misyon, vizyon ve iletişim bilgilerinin bulunduğu 'Hakkımızda' sayfası.",
        difficulty: "hard",
        week: 1,
        topic: "Statik ve dinamik kısımlar",
        importance: "high",
        explanation: "Statik içerik, sık değişmeyen sabit bilgilerdir. Hakkımızda, vizyon, iletişim gibi içerikler genelde statiktir. Diğer seçenekler, verinin sık sık değiştiği, kullanıcıya göre kişiselleştiği veya gerçek zamanlı güncellendiği dinamik bölümlere örnektir."
    },
    {
        q: "Bir yazılım projesinde, 'Analiz ve Planlama' aşaması henüz tamamlanmadan doğrudan kod yazmaya başlamak istenmektedir. 1. hafta 'Yazılım Projelendirme' notlarına göre bu durumun en olası sonucu aşağıdakilerden hangisidir?",
        t: "mcq",
        o: [
            "Proje amaç, kapsam ve gereksinimler net olmadığı için ileride takvim, maliyet ve kapsam riskleri ortaya çıkabilir.",
            "Proje daha hızlı biter, çünkü gereksinim analizi zaman kaybıdır.",
            "Analiz yapılmadan başlayan projede hata riski her zaman daha azdır.",
            "Analiz yapılmadığında yalnızca grafik tasarım kısmı etkilenir, kodlama süreci etkilenmez.",
            "Analiz aşaması atlandığı için bakım maliyetleri otomatik olarak sıfıra düşer."
        ],
        a: "Proje amaç, kapsam ve gereksinimler net olmadığı için ileride takvim, maliyet ve kapsam riskleri ortaya çıkabilir.",
        difficulty: "hard",
        week: 1,
        topic: "Yazılım projelendirme aşamaları",
        importance: "high",
        explanation: "Notlarda proje aşamalarında analiz ve planlamanın önemine ve risk analizine vurgu yapılır. Analiz yapılmadığında kapsam, takvim, maliyet ve gereksinim riskleri artar. Diğer seçenekler analiz aşamasını önemsiz göstererek notlarla çelişir."
    },
    {
        q: "Bir firma web sitesini yayınlamak için, içine web dosyalarını koyacağı ve internet omurgasına hızlı bağlantısı olan özel bir bilgisayar kiralamak zorundadır. 1. hafta notlarına göre, bu bilgisayara ve verilen hizmete sırasıyla ne ad verilir?",
        t: "mcq",
        o: [
            "Web sunucusu (web server) ve web hosting.",
            "Veritabanı sunucusu ve domain hosting.",
            "DNS sunucusu ve alan adı tescili.",
            "İstemci bilgisayar ve FTP hizmeti.",
            "Proxy sunucusu ve cache barındırma."
        ],
        a: "Web sunucusu (web server) ve web hosting.",
        difficulty: "medium",
        week: 1,
        topic: "Hosting ve web sunucusu",
        importance: "high",
        explanation: "Notlarda, web dosyalarını saklayan bilgisayarlara web sunucusu, bu dosyaların saklanması ve yayınlanması hizmetine de web hosting dendiği açıkça belirtilir. Diğer seçenekler DNS, veritabanı veya istemci gibi farklı kavramları karıştırmaktadır."
    },
    {
        q: "Bir geliştirici, hazırladığı HTML dosyalarını hosting firmasının sağladığı sunucuya aktarmak için FileZilla benzeri bir program kullanmaktadır. 1. hafta notlarına göre bu aktarım sırasında kullanılan temel protokol ve bu işlemde gerekli olan bilgi aşağıdakilerden hangisidir?",
        t: "mcq",
        o: [
            "FTP protokolü ve hosting firmasının verdiği kullanıcı adı ile şifre bilgisi.",
            "HTTP protokolü ve yalnızca alan adı bilgisi.",
            "SMTP protokolü ve e-posta adresi.",
            "IMAP protokolü ve posta sunucusu adresi.",
            "POP3 protokolü ve port numarası."
        ],
        a: "FTP protokolü ve hosting firmasının verdiği kullanıcı adı ile şifre bilgisi.",
        difficulty: "medium",
        week: 1,
        topic: "FTP kullanımı",
        importance: "high",
        explanation: "Slaytlarda FTP (File Transfer Protocol) ile dosya aktarımı yapılırken, ilgili ağda geçerli bir kullanıcı adı ve şifreye ihtiyaç duyulduğu belirtilir. Bu bilgileri genellikle hosting firması sağlar. Diğer protokoller web gezintisi veya e-posta ile ilgilidir."
    },
    {
        q: "Bir öğrenci HTML öğrenmeye yeni başlamış ve 'HTML bir programlama dili midir?' sorusunu sormuştur. 2. hafta 'HTML Nedir?' slaytına göre aşağıdaki ifadelerden hangisi HTML'nin programlama dili OLARAK TANIMLANAMAMASININ temel nedenini en doğru şekilde açıklar?",
        t: "mcq",
        o: [
            "HTML ile kendi başına çalışan programlar yazılamaz, sadece bu dili yorumlayan tarayıcılar aracılığıyla sayfalar görüntülenebilir.",
            "HTML ile rakam yazılamadığı için matematiksel işlemler yapılamaz.",
            "HTML sadece sunucu tarafında çalıştığı için programlama dili sayılmaz.",
            "HTML yalnızca komut satırında çalışan metin tabanlı bir dildir.",
            "HTML sabit sürüm numarasına sahip olmadığı için programlama dili değildir."
        ],
        a: "HTML ile kendi başına çalışan programlar yazılamaz, sadece bu dili yorumlayan tarayıcılar aracılığıyla sayfalar görüntülenebilir.",
        difficulty: "medium",
        week: 2,
        topic: "HTML'nin tanımı",
        importance: "high",
        explanation: "Notlarda, HTML'nin programlama dili olarak tanımlanamamasının sebebi olarak kendi başına çalışan program yazılamaması, yalnızca tarayıcı tarafından yorumlanan sayfalar üretmesi gösterilir. Diğer ifadeler notlarda geçen gerekçelerle uyuşmaz."
    },
    {
        q: "2. hafta slaytlarında HTML sürümlerinin yıllara göre gelişimi bir tablo ile verilmiştir. Bu tabloya göre aşağıdakilerden hangisi HTML sürümleri ve yaklaşık çıkış yılları arasında DOĞRU bir eşleştirmedir?",
        t: "mcq",
        o: [
            "HTML 4.01 → 1999, HTML 5 → 2008",
            "HTML 1.0 → 1999, HTML 5 → 2015",
            "HTML 2.0 → 1991, HTML 3.0 → 1993",
            "HTML 4.01 → 1995, HTML 5 → 1997",
            "HTML 3.0 → 2008, HTML 5 → 2010"
        ],
        a: "HTML 4.01 → 1999, HTML 5 → 2008",
        difficulty: "medium",
        week: 2,
        topic: "HTML sürümleri",
        importance: "medium",
        explanation: "Slaytlarda HTML 1.0 (1991), 2.0 (1995), 3.0 (1997), 4.01 (1999) ve HTML 5 (2008) olarak listelenir. Buna göre doğru eşleşme 4.01 için 1999, HTML5 için 2008'dir. Diğer seçenekler yılları karıştırmaktadır."
    },
    {
        q: "Bir HTML belgesinde, tarayıcı sekmesinde görünen başlık metnini ayarlamak ve kullanıcıya görünmeyen meta bilgileri tanımlamak isteyen bir tasarımcı aşağıdaki bölümlerden hangisini doğru kullanmalıdır?",
        t: "mcq",
        o: [
            "<head> bölümünde <title> ve meta etiketlerini kullanmalıdır.",
            "<body> bölümünde <h1> başlığına sekme adını yazmalıdır.",
            "<html> etiketinin dışına doğrudan metni yazmalıdır.",
            "<body> etiketi içine <title> etiketini gömmelidir.",
            "Sadece <!DOCTYPE html> satırına sekme başlığını eklemesi yeterlidir."
        ],
        a: "<head> bölümünde <title> ve meta etiketlerini kullanmalıdır.",
        difficulty: "medium",
        week: 2,
        topic: "Head ve body yapısı",
        importance: "high",
        explanation: "Notlarda <head> bölümünün kullanıcıya görünmeyen meta bilgiler için kullanıldığı ve istisna olarak <title> etiketinin sekme başlığını belirlediği belirtilir. <body> içeriği kullanıcının gördüğü kısım olduğundan sekme başlığı için uygun değildir."
    },
    {
        q: "2. hafta 'HTML Syntax' kısmında <p>, <br> ve yorum etiketleri anlatılmaktadır. Aşağıdaki ifadelerden hangisi bu üç etiketin kullanımını birlikte DOĞRU şekilde özetler?",
        t: "mcq",
        o: [
            "<p> yeni bir paragraf başlatır, <br> satır sonu ekler ama yeni paragraf açmaz, yorum satırları <!-- ... --> arasında yazılır ve tarayıcıda görünmez.",
            "<p> sadece satır sonu ekler, <br> yeni paragraf açar, <!-- ... --> ise sayfada büyük başlık gösterir.",
            "<p> ve <br> aynı işlevdedir, yorum etiketinin HTML'de karşılığı yoktur.",
            "<p> etiketi sadece başlıklar için kullanılır, <br> etiketi tüm paragrafı gizler, <!-- ... --> ise bağlantı oluşturur.",
            "<p> içindeki metin tarayıcıda görünmez, <br> yeni sayfa açar, <!-- ... --> sayfanın arka plan rengini değiştirir."
        ],
        a: "<p> yeni bir paragraf başlatır, <br> satır sonu ekler ama yeni paragraf açmaz, yorum satırları <!-- ... --> arasında yazılır ve tarayıcıda görünmez.",
        difficulty: "easy",
        week: 2,
        topic: "Paragraf, satır sonu ve yorumlar",
        importance: "high",
        explanation: "Slaytlarda <p> paragraf, <br> satır atlama (yeni paragraf olmadan) için, <!-- ... --> ise programcı notu olarak yorum satırları için verilir. Diğer seçenekler etiketlerin görevlerini yanlış tanımlar."
    },
    {
        q: "Kodlar.pdf dosyasında verilen örnek sayfada <h1> ile <h6> arasında altı farklı başlık kullanılmıştır. Aşağıdaki ifadelerden hangisi bu başlık etiketlerinin kullanım amacını VE sıralamasını doğru biçimde açıklar?",
        t: "mcq",
        o: [
            "<h1> en üst düzey başlık olup en büyük boyutta; <h6> ise en alt düzey başlık olup en küçük boyuttadır ve sayfa hiyerarşisini göstermek için kullanılır.",
            "<h1> en küçük başlıktır, <h6> en büyük başlıktır; boyutlar rastgele belirlenir.",
            "Başlık etiketleri sadece yazıyı kalın yapmak için kullanılır, hiyerarşiyle ilgisi yoktur.",
            "<h1> ile <h6> arasında sadece font rengi değişir, metin boyutu sabittir.",
            "Başlık etiketleri sadece tablolar içinde kullanılabilir, normal sayfa gövdesinde kullanılmaz."
        ],
        a: "<h1> en üst düzey başlık olup en büyük boyutta; <h6> ise en alt düzey başlık olup en küçük boyuttadır ve sayfa hiyerarşisini göstermek için kullanılır.",
        difficulty: "medium",
        week: 2,
        topic: "Başlık etiketleri",
        importance: "medium",
        explanation: "Örnek kodda <h1>–<h6> sırasıyla kullanılır. HTML'de <h1> en büyük ve en üst seviye başlık, <h6> en küçük ve en alt seviyedir. Bu etiketler sayfanın yapısal hiyerarşisini ifade eder. Diğer seçenekler bu yapıyı ters çevirir veya görselliği yanlış açıklar."
    },
    {
        q: "3. hafta notlarında, <strong>, <em>, <u>, <s>, <sup> ve <sub> etiketleriyle metin biçimlendirme örneği verilmiştir. '10<sup>2</sup> = 100, H<sub>2</sub>O' ifadesine göre aşağıdaki eşleştirmelerden hangisi DOĞRUdur?",
        t: "mcq",
        o: [
            "<sup> üst simgeyi, <sub> ise alt simgeyi göstermek için kullanılır.",
            "<sup> alt çizgili metin için, <sub> ise üstü çizili metin için kullanılır.",
            "<sup> kalın metni, <sub> italik metni ifade eder.",
            "<sup> ve <sub> sadece bağlantı (link) oluştururken kullanılır.",
            "<sup> ve <sub> etiketlerinin tarayıcıda hiçbir görsel etkisi yoktur."
        ],
        a: "<sup> üst simgeyi, <sub> ise alt simgeyi göstermek için kullanılır.",
        difficulty: "easy",
        week: 3,
        topic: "Metin biçimlendirme",
        importance: "high",
        explanation: "Örnekte 10 üst 2, H alt 2 O şeklinde gösterilir; bu da <sup> etiketinin üst simge, <sub> etiketinin alt simge için kullanıldığını gösterir. Diğer seçeneklerde biçimlendirme görevleri yanlış verilmiştir."
    },
    {
        q: "3. hafta 'Bağlantı Oluşturma' kısmında <a> etiketi ve href parametresi anlatılmaktadır. Bir geliştirici, kullanıcının tıkladığında bambaşka bir web sitesine gitmesini ve bu sitenin yeni sekmede açılmasını istiyor. Aşağıdaki kodlardan hangisi bu isteği slaytlara UYGUN biçimde gerçekleştirir?",
        t: "mcq",
        o: [
            "<a href='https://www.openai.com' target='_blank'>OpenAI</a>",
            "<a src='https://www.openai.com'>OpenAI</a>",
            "<a href='https://www.openai.com'>OpenAI</a target='_blank'>",
            "<a link='https://www.openai.com' newtab='true'>OpenAI</a>",
            "<a>https://www.openai.com</a>"
        ],
        a: "<a href='https://www.openai.com' target='_blank'>OpenAI</a>",
        difficulty: "medium",
        week: 3,
        topic: "Bağlantı etiketleri",
        importance: "high",
        explanation: "Slaytlarda href ile hedef adresin verildiği ve target='_blank' ile yeni sekmede açıldığı gösterilir. Diğer seçenekler ya yanlış öznitelik (src, link, newtab) kullanıyor ya da target konumu yanlıştır."
    },
    {
        q: "3. hafta slaytlarında, sayfa içi bağlantı (id kullanarak aynı sayfanın alt kısmına inme) örneği verilmiştir. Buna göre aşağıdaki eşleştirmelerden hangisi sayfa içi bağlantı mantığını DOĞRU şekilde açıklar?",
        t: "mcq",
        o: [
            "Bağlantının href kısmında '#hedefId' kullanılır ve gidilecek öğenin id özniteliği bu değere eşit olmalıdır.",
            "Sayfa içi bağlantılar için sadece <link> etiketi kullanılır, <a> etiketi kullanılamaz.",
            "Sayfa içi bağlantı için href içine tam URL yazmak zorunludur.",
            "Sayfa içi bağlantı yapmak için id yerine name özniteliği zorunludur.",
            "Sayfa içi bağlantı yapmak için <p> etiketinin içinde mutlaka <br> olması gerekir."
        ],
        a: "Bağlantının href kısmında '#hedefId' kullanılır ve gidilecek öğenin id özniteliği bu değere eşit olmalıdır.",
        difficulty: "medium",
        week: 3,
        topic: "Sayfa içi bağlantılar",
        importance: "high",
        explanation: "Slaytlarda örnek olarak <a href='#altkisim'> ve id='altkisim' kullanımı gösterilir. Yani href içinde #id ve hedef öğede id özniteliği aynı değerde olmalıdır. Diğer seçenekler HTML4/5 standartlarıyla uyuşmaz."
    },
    {
        q: "3. hafta 'Dosya İndirme Linkleri' kısmında, <a href='dosyalar/kitap.pdf' download>Kitabı İndir</a> örneği verilmiştir. Buna göre 'download' özniteliği ile ilgili aşağıdaki ifadelerden hangisi DOĞRUdur?",
        t: "mcq",
        o: [
            "Kullanıcı linke tıkladığında tarayıcı, ilgili dosyayı yeni sekmede açmak yerine indirmeye yönelmeye çalışır.",
            "Download özniteliği yalnızca resim dosyaları için çalışır, PDF için kullanılamaz.",
            "Download özniteliği zorunlu bir özniteliktir, her <a> etiketinde bulunmalıdır.",
            "Download özniteliği sadece e-posta bağlantılarında kullanılır.",
            "Download özniteliği linkin rengini değiştirmek için kullanılır."
        ],
        a: "Kullanıcı linke tıkladığında tarayıcı, ilgili dosyayı yeni sekmede açmak yerine indirmeye yönelmeye çalışır.",
        difficulty: "medium",
        week: 3,
        topic: "Dosya indirme bağlantıları",
        importance: "medium",
        explanation: "Download özniteliği, tarayıcının dosyayı görüntülemek yerine indirmeyi tercih etmesini sağlar. Diğer seçenekler download özniteliğinin kapsamını ya kısıtlar ya da tamamen yanlış bir amaç atfeder."
    },
    {
        q: "Kodlar.pdf dosyasında, <img src='img/foto.jpg' usemap='#anil'> satırından sonra <map name='anil'> etiketi ve içinde <area> etiketleri kullanılmıştır. Buna göre aşağıdaki ifadelerden hangisi bu yapı hakkında DOĞRUDUR?",
        t: "mcq",
        o: [
            "Bu yapı, image map kullanarak resmin belirli koordinatlarına tıklanınca farklı bağlantılara gitmeyi sağlar.",
            "Bu yapı, tablonun hücrelerini otomatik birleştirmek için kullanılır.",
            "Bu yapı, yalnızca ses dosyalarını sayfaya eklemek için kullanılır.",
            "Bu yapı, tarayıcının sayfayı mobil uyumlu hale getirmesini otomatik olarak sağlar.",
            "Bu yapı, veritabanı bağlantısını tanımlamak için kullanılır."
        ],
        a: "Bu yapı, image map kullanarak resmin belirli koordinatlarına tıklanınca farklı bağlantılara gitmeyi sağlar.",
        difficulty: "hard",
        week: 3,
        topic: "Image map ve area",
        importance: "high",
        explanation: "Image map ile resim üzerinde koordinatlara göre tıklanabilir alanlar tanımlanır. <img> üzerinde usemap='#anil', altında <map name='anil'> ve <area> etiketleri koordinatlar ve href ile linkleri belirler. Diğer seçenekler image map ile ilgili değildir."
    },
    {
        q: "Kodlar.pdf içinde verilen örnekte, bir <a> etiketi içine <img> etiketi yerleştirilmiştir: <a href='https://www.youtube.com/'> <img src='img/yozgat.jpg' alt='' /> </a>. Bu yapı ile ilgili aşağıdakilerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Resme tıklandığında, tıpkı metin linkine tıklar gibi belirtilen adrese gidilmesini sağlar.",
            "Bu kullanım HTML'de yasaktır, <img> etiketi asla <a> etiketi içinde olamaz.",
            "Bu yapı sadece tablo içinde çalışır, normal sayfada çalışmaz.",
            "Bu yapı, resmin yüklenmesini engellemek için kullanılır.",
            "Bu yapı ile resim sadece alt metnini gösterir, tıklanamaz."
        ],
        a: "Resme tıklandığında, tıpkı metin linkine tıklar gibi belirtilen adrese gidilmesini sağlar.",
        difficulty: "medium",
        week: 3,
        topic: "Resmi link yapmak",
        importance: "medium",
        explanation: "Bir <a> içine <img> yerleştirmek, resmin tıklanabilir bir bağlantı gibi davranmasını sağlar. Bu teknik slaytlarda ve Kodlar.pdf'te gösterilir. Diğer seçenekler HTML kurallarıyla çelişir."
    },
    {
        q: "4. hafta 'Tablo İşlemleri' slaytlarında bir tablo yapısı verilmiştir. Buna göre aşağıdaki etiketlerden hangisi TABLO BAŞLIK HÜCRESİ olup, içeriğini varsayılan olarak kalın ve ortalı gösterir?",
        t: "mcq",
        o: [
            "<th>",
            "<td>",
            "<tr>",
            "<caption>",
            "<thead>"
        ],
        a: "<th>",
        difficulty: "easy",
        week: 4,
        topic: "Tablo etiketleri",
        importance: "high",
        explanation: "Slaytlarda <th> tablonun başlık hücresi olarak, <td> ise veri (data) hücresi olarak tanımlanır. <th> hücreleri varsayılan olarak kalın ve ortalı görünür. Diğer etiketler satır veya tablo bölümleri için kullanılır."
    },
    {
        q: "4. ve 5. hafta notlarında verilen colspan ve rowspan örneklerine göre, aşağıdaki açıklamalardan hangisi bu iki özniteliğin farkını DOĞRU şekilde ifade eder?",
        t: "mcq",
        o: [
            "colspan sütunları yatayda birleştirir, rowspan satırları dikeyde birleştirir.",
            "colspan satırları dikeyde, rowspan sütunları yatayda birleştirir.",
            "colspan ve rowspan aynı işi yapar, sadece isimleri farklıdır.",
            "colspan sadece metin biçimlendirmek için, rowspan ise arka plan rengi için kullanılır.",
            "colspan sadece form içinde, rowspan sadece listeler içinde kullanılabilir."
        ],
        a: "colspan sütunları yatayda birleştirir, rowspan satırları dikeyde birleştirir.",
        difficulty: "medium",
        week: 4,
        topic: "Colspan ve rowspan",
        importance: "high",
        explanation: "Slaytlarda colspan örneği 'Kişi Bilgileri' başlığını iki sütuna yayarken, rowspan örneği 'Matematik' hücresini iki satıra yayar. Bu da colspan'ın sütun (yatay), rowspan'ın satır (dikey) birleştirme yaptığını gösterir."
    },
    {
        q: "4. hafta örnek sayfada, tablo içinde bir sütunda web sitesi adresleri <a> etiketi ile link haline getirilmiştir. Bu durum, web tasarımında hangi pratik kullanımın bir örneğidir?",
        t: "mcq",
        o: [
            "Tablo hücrelerinin içinde de bağlantı verilebileceğini ve bir hücrenin içeriğinin tıklanabilir link olabileceğini gösterir.",
            "Tablo içinde <a> etiketi kullanmanın imkansız olduğunu kanıtlar.",
            "Tabloların sadece sayfa düzeni için, linklerin ise sadece <body> dışında kullanılabileceğini gösterir.",
            "Tablo hücrelerinin yalnızca sayısal veri saklamak için kullanıldığını kanıtlar.",
            "Tablo içinde link kullanılınca tablonun otomatik olarak gizleneceğini gösterir."
        ],
        a: "Tablo hücrelerinin içinde de bağlantı verilebileceğini ve bir hücrenin içeriğinin tıklanabilir link olabileceğini gösterir.",
        difficulty: "medium",
        week: 4,
        topic: "Tablo ve link ilişkisi",
        importance: "medium",
        explanation: "Örnek sayfada, tablo hücrelerine <a> ile link konulduğu görülür. Bu, tablo hücrelerinin metin, link, resim gibi her türlü HTML içeriğini taşıyabildiğini gösterir. Diğer seçenekler mantıksız kısıtlamalar içerir."
    },
    {
        q: "5. hafta 'Formlar' kısmında <form action='islem.php' method='post'> yapısı açıklanmıştır. Buna göre aşağıdaki ifadelerden hangisi method özniteliği ile ilgili olarak slaytlarla UYUMLUdUR?",
        t: "mcq",
        o: [
            "get yöntemi verileri URL üzerine ekleyerek görünür gönderir, post ise verileri gizli gönderir ve daha güvenlidir.",
            "get yöntemi yalnızca resim dosyaları için, post ise sadece ses dosyaları için kullanılır.",
            "get ve post arasında hiçbir fark yoktur, sadece isimleri farklıdır.",
            "post yöntemi daima URL'yi uzatır, get ise her zaman gizlidir.",
            "form gönderiminde method belirtilmesi zorunlu değildir, HTML'de böyle bir öznitelik yoktur."
        ],
        a: "get yöntemi verileri URL üzerine ekleyerek görünür gönderir, post ise verileri gizli gönderir ve daha güvenlidir.",
        difficulty: "medium",
        week: 5,
        topic: "Form methodları",
        importance: "high",
        explanation: "Slaytlarda method='get' için verilerin URL'ye eklenerek görünür, method='post' için ise gizli ve daha güvenli gönderildiği vurgulanır. Diğer seçenekler bu farkı ya reddeder ya da ters çevirir."
    },
    {
        q: "5. ve 6. hafta formlarında, text, password, checkbox ve radio tipleri gösterilmiştir. Aşağıdaki ifadelerden hangisi checkbox ile radio arasındaki farkı slaytlara UYGUN şekilde açıklar?",
        t: "mcq",
        o: [
            "Checkbox birden fazla seçeneğin aynı anda işaretlenmesine izin verirken, aynı name değerine sahip radio butonları kullanıcıyı tek seçim yapmaya zorlar.",
            "Checkbox ve radio butonları tamamen aynı çalışır, tek farkları görsel şekilleridir.",
            "Radio butonları birden fazla seçeneği aynı anda seçmeye izin verir, checkbox ise sadece tek seçim içindir.",
            "Checkbox sadece sayfa içi bağlantı oluşturmak için kullanılır, radio ise tablo hücresi biçimlendirmek içindir.",
            "Checkbox yalnızca dosya yükleme, radio yalnızca metin girişi içindir."
        ],
        a: "Checkbox birden fazla seçeneğin aynı anda işaretlenmesine izin verirken, aynı name değerine sahip radio butonları kullanıcıyı tek seçim yapmaya zorlar.",
        difficulty: "medium",
        week: 5,
        topic: "Checkbox vs radio",
        importance: "high",
        explanation: "Örneklerde hobiler checkbox ile çoklu seçim, cinsiyet radio ile tekli seçim olarak verilmiştir. Aynı name'e sahip radio butonları tek seçim, checkbox'lar ise bağımsız çoklu seçim sağlar."
    },
    {
        q: "5. hafta notlarında <select> ve <option> etiketleriyle şehir seçimi örneği verilmiştir. Bu yapıyla ilgili aşağıdaki ifadelerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "<select> açılır listeyi, <option> ise bu listenin içindeki tek tek seçenekleri oluşturur.",
            "<select> sadece metin alanını, <option> ise yalnızca parola alanını tanımlar.",
            "<select> etiketi olmadan <option> etiketlerinin anlamı yoktur, bu yüzden <option> doğrudan <body> içinde kullanılmalıdır.",
            "<select> sadece tabloların içinde, <option> ise sadece listelerin içinde kullanılabilir.",
            "<select> etiketi linkleri, <option> etiketi ise satır sonlarını tanımlar."
        ],
        a: "<select> açılır listeyi, <option> ise bu listenin içindeki tek tek seçenekleri oluşturur.",
        difficulty: "easy",
        week: 5,
        topic: "Select ve option",
        importance: "medium",
        explanation: "Örnekte şehir seçimi için <select name='sehir'> ve içinde <option value='...'> etiketleri kullanılır. <select> listeyi, <option> ise her bir seçeneği tanımlar. Diğer ifadeler kullanım amacını yanlış verir."
    },
    {
        q: "5. hafta formlarında <textarea name='mesaj' rows='4' cols='30'> örneği verilmiştir. Buna göre aşağıdaki ifadelerden hangisi <textarea> etiketinin kullanım amacını DOĞRU şekilde tanımlar?",
        t: "mcq",
        o: [
            "Kullanıcının birden fazla satırdan oluşan uzun metin girişi yapabilmesini sağlar.",
            "Yalnızca tek satırlık parola girişi yapılmasını sağlar.",
            "Sadece resim dosyalarının yüklenmesi için kullanılır.",
            "Sadece sayfa başlığını belirlemek için kullanılır.",
            "Sadece formu varsayılan değerlere sıfırlamak için kullanılır."
        ],
        a: "Kullanıcının birden fazla satırdan oluşan uzun metin girişi yapabilmesini sağlar.",
        difficulty: "easy",
        week: 5,
        topic: "Textarea kullanımı",
        importance: "medium",
        explanation: "<textarea> çok satırlı metin giriş alanıdır, slaytlarda 'Mesajınızı yazınız' örneğiyle gösterilir. Tek satırlı alanlar input type='text', 'password' vb. ile yapılır."
    },
    {
        q: "6. hafta 'Butonlar' slaytında <input type='submit'>, <input type='reset'> ve <input type='button'> örnekleri verilmiştir. Aşağıdaki ifadelerden hangisi bu üç buton tipinin işlevlerini DOĞRU olarak özetler?",
        t: "mcq",
        o: [
            "submit formu sunucuya gönderir, reset form alanlarını varsayılan değerlere getirir, button ise JavaScript gibi özel işlemler için genel amaçlı bir düğmedir.",
            "submit sadece tabloyu siler, reset yeni tablo ekler, button sayfayı yeniler.",
            "submit sadece e-posta gönderir, reset sadece veritabanını sıfırlar, button sadece bağlantı oluşturur.",
            "Üçü de tamamen aynı işi yapar, aralarında hiçbir fark yoktur.",
            "submit formu gizler, reset formu siler, button formu kaydetmeden kapatır."
        ],
        a: "submit formu sunucuya gönderir, reset form alanlarını varsayılan değerlere getirir, button ise JavaScript gibi özel işlemler için genel amaçlı bir düğmedir.",
        difficulty: "medium",
        week: 6,
        topic: "Form butonları",
        importance: "high",
        explanation: "Slaytlarda submit ve reset açıkça gösterilir; button ise özel amaçlı butonlar için kullanılır. Diğer seçenekler bu butonlara gerçek dışı görevler yükler."
    },
    {
        q: "6. hafta notlarında <input type='hidden' name='kaynak' value='web_formu'> örneği yer almaktadır. Aşağıdakilerden hangisi bu gizli alanın kullanım amacını en doğru şekilde açıklar?",
        t: "mcq",
        o: [
            "Kullanıcıya gösterilmeden form ile sunucuya ek bilgi göndermek için kullanılır.",
            "Kullanıcının yazdığı metni büyütmek için kullanılır.",
            "Formdaki tüm alanları otomatik olarak temizler.",
            "Sadece ses dosyalarını gizlemek için kullanılır.",
            "Formun arka plan rengini değiştirmek için kullanılır."
        ],
        a: "Kullanıcıya gösterilmeden form ile sunucuya ek bilgi göndermek için kullanılır.",
        difficulty: "medium",
        week: 6,
        topic: "Hidden input",
        importance: "high",
        explanation: "Hidden alanlar, kullanıcı görmeden sunucuya ek veri taşımak için kullanılır. Örnekte kaynağın 'web_formu' olduğu bilgisinin gönderilmesi amaçlanır. Diğer seçenekler hidden alanın işleviyle ilgili değildir."
    },
    {
        q: "6. hafta 'Form Doğrulama' kısmında <input type='email' name='eposta' required> ve <input type='number' name='yas' min='18' max='99'> örnekleri verilmiştir. Buna göre aşağıdaki ifadelerden hangisi HTML5 form doğrulama özelliklerini slaytlara UYGUN biçimde özetler?",
        t: "mcq",
        o: [
            "required alanın boş bırakılamayacağını, type='email' ise girilen değerin e-posta formatında olmasını bekler; min ve max ise sayısal alan için alt ve üst sınırları belirler.",
            "required sadece alanın arka planını boyar, type='email' yazıyı kalın yapar, min ve max metni ortalar.",
            "type='email' sadece sayfa başlığında kullanılabilir, min ve max yalnızca tablo sütunlarını birleştirir.",
            "required sadece tablo içinde, min ve max sadece liste içinde çalışır.",
            "Bu öznitelikler HTML'de bulunmaz, slaytlarda sadece teorik olarak bahsedilmiştir."
        ],
        a: "required alanın boş bırakılamayacağını, type='email' ise girilen değerin e-posta formatında olmasını bekler; min ve max ise sayısal alan için alt ve üst sınırları belirler.",
        difficulty: "medium",
        week: 6,
        topic: "HTML5 form doğrulama",
        importance: "high",
        explanation: "Slaytlarda HTML5 ile gelen hazır doğrulamalar bu şekilde açıklanır. required zorunlu alan, email format kontrolü, number için min ve max sınırı getirilir. Diğer seçenekler uydurma görevler verir."
    },
    {
        q: "6. hafta 'Kapsamlı Form Örneği'nde form etiketi şu şekilde başlar: <form action='kayit.php' method='post' enctype='multipart/form-data'>. Buna göre aşağıdaki ifadelerden hangisi enctype='multipart/form-data' özniteliğinin amacını DOĞRU biçimde açıklar?",
        t: "mcq",
        o: [
            "Formda dosya yükleme (file input) gibi binary verilerin sunucuya doğru şekilde gönderilmesini sağlar.",
            "Formun her zaman sadece get yöntemiyle gönderilmesini zorunlu kılar.",
            "Formun sadece metin tabanlı alanlar içermesini sağlar, dosya yüklemeyi engeller.",
            "Formun sadece e-posta ile gönderileceğini belirtir.",
            "Formun tabloya dönüştürülmesini sağlar."
        ],
        a: "Formda dosya yükleme (file input) gibi binary verilerin sunucuya doğru şekilde gönderilmesini sağlar.",
        difficulty: "hard",
        week: 6,
        topic: "Form enctype",
        importance: "high",
        explanation: "Kapsamlı form örneğinde özgeçmiş dosyası yüklemek için file input kullanıldığından, bu verinin düzgün iletimi için enctype='multipart/form-data' gerekir. Diğer seçenekler enctype'in işlevini yanlış tanımlar."
    },
    {
        q: "Kodlar.pdf dosyasında sıralı liste (ol), sırasız liste (ul) ve açıklama listesi (dl) örnekleri verilmiştir. Aşağıdaki eşleştirmelerden hangisi bu üç liste tipinin kullanım amaçlarını DOĞRU şekilde açıklar?",
        t: "mcq",
        o: [
            "ol sıralı numaralı liste, ul madde imli sırasız liste, dl ise terim ve açıklamalar için kullanılan liste yapısıdır.",
            "ol sadece linkleri listelemek için, ul sadece tabloları çizmek için, dl ise sadece formları sıralamak için kullanılır.",
            "ol ve ul aynı listelerdir, dl ise listeyle ilgili değildir.",
            "ul yalnızca resim dosyalarını, dl sadece ses dosyalarını listeler.",
            "ol, ul ve dl etiketleri HTML 5 ile kaldırılmıştır, modern sayfalarda kullanılmaz."
        ],
        a: "ol sıralı numaralı liste, ul madde imli sırasız liste, dl ise terim ve açıklamalar için kullanılan liste yapısıdır.",
        difficulty: "medium",
        week: 3,
        topic: "Liste etiketleri",
        importance: "medium",
        explanation: "Kodlar.pdf'te ol type='I', ul ve dl örnekleri vardır. ol sıralı, ul sırasız, dl ise dt/dd ile terim–açıklama çiftleri içindir. Diğer seçenekler modern HTML ile çelişir."
    },
    {
        q: "Kodlar.pdf içinde <iframe src='https://bozok.edu.tr/' height='600' width='900' title='Bozok'></iframe> satırı verilmiştir. Bu örneğe göre iframe etiketi ile ilgili aşağıdaki ifadelerden hangisi DOĞRUDUR?",
        t: "mcq",
        o: [
            "Başka bir web sayfasını mevcut sayfanın içinde, belirtilen genişlik ve yükseklikte gömmek için kullanılır.",
            "Sadece ses dosyası oynatmak için kullanılır.",
            "Yalnızca CSS kodlarını sayfaya eklemek için kullanılır.",
            "Form verilerini veritabanına kaydetmek için zorunludur.",
            "Tabloları otomatik olarak responsive yapmak için kullanılır."
        ],
        a: "Başka bir web sayfasını mevcut sayfanın içinde, belirtilen genişlik ve yükseklikte gömmek için kullanılır.",
        difficulty: "medium",
        week: 4,
        topic: "Iframe kullanımı",
        importance: "high",
        explanation: "Iframe, 'sayfa içinde sayfa' mantığıyla başka bir sayfayı gömmek için kullanılır. Örnekte Bozok Üniversitesi sayfası mevcut HTML içine gömülmüştür. Diğer seçenekler iframe'in amacını yanlış temsil eder."
    },
    {
        q: "Kodlar.pdf dosyasında hem yerel bir video dosyasını <video> etiketi ile hem de YouTube videosunu ikinci bir <iframe> ile gömme örneği vardır. Bu iki yaklaşım arasındaki farkla ilgili aşağıdaki ifadelerden hangisi slayt ve notlarla UYUMLUdUR?",
        t: "mcq",
        o: [
            "<video> etiketi yerel video dosyalarını <source> ile oynatırken, YouTube gibi platformlardan gömülü oynatma genellikle iframe ile sağlanır.",
            "<video> yalnızca ses dosyalarını, iframe ise yalnızca resim dosyalarını gösterebilir.",
            "Her iki etiket de sadece metin biçimlendirmek için kullanılır.",
            "<video> etiketi web tarayıcılarında çalışmaz, sadece masaüstü programlarda çalışır.",
            "YouTube videoları mutlaka <audio> etiketi ile gömülmelidir, iframe kullanılamaz."
        ],
        a: "<video> etiketi yerel video dosyalarını <source> ile oynatırken, YouTube gibi platformlardan gömülü oynatma genellikle iframe ile sağlanır.",
        difficulty: "hard",
        week: 4,
        topic: "Video ve iframe",
        importance: "high",
        explanation: "Kodlar.pdf'te hem yerel video için <video><source> kullanımı hem de YouTube embed kodu (iframe) gösterilir. Bu da yerel dosya ile dış platform gömme farkını ortaya koyar. Diğer seçenekler HTML etiketlerinin gerçek kullanımına aykırıdır."
    },
    {
        q: "Öğrencinin notlarında 'nav etiketi yönlendirmede' ifadesi geçmektedir. Modern HTML5'e göre <nav> etiketiyle ilgili aşağıdaki açıklamalardan hangisi bu ifadeyi destekler nitelikte DOĞRUDUR?",
        t: "mcq",
        o: [
            "<nav> etiketi, sayfadaki ana gezinme (menü) bağlantılarını gruplayarak bir navigasyon bölümü oluşturmak için kullanılır.",
            "<nav> sadece tablo sütunlarını birleştirmek için kullanılır.",
            "<nav> form elemanlarını doğrulamak için zorunludur.",
            "<nav> yalnızca video oynatmak için kullanılır.",
            "<nav> sadece yorum satırlarını gizlemek için kullanılır."
        ],
        a: "<nav> etiketi, sayfadaki ana gezinme (menü) bağlantılarını gruplayarak bir navigasyon bölümü oluşturmak için kullanılır.",
        difficulty: "medium",
        week: 3,
        topic: "Nav etiketi",
        importance: "medium",
        explanation: "Notta 'nav etiketi yönlendirmede' denmesi, <nav> içinde menü/link gruplarının tutulduğunu ifade eder. Bu, sayfanın gezinme bölümü (navigation) içindir. Diğer seçenekler nav'ın işleviyle ilgisizdir."
    },
    {
        q: "Öğrenci notunda 'div etiketi bölüm bölüm kutu kutu ayırmak için kullanılır' ifadesi geçmektedir. Buna göre aşağıdaki açıklamalardan hangisi div etiketinin kullanım amacını sınavda sorulabilecek şekilde DOĞRU açıklar?",
        t: "mcq",
        o: [
            "<div> sayfa içeriğini mantıksal bloklara ayırmak için kullanılan, genellikle stil ve yerleşim amaçlı kullanılan blok seviye bir etikettir.",
            "<div> sadece tablolarda satır birleştirmek için kullanılan özel bir hücre etiketidir.",
            "<div> sadece form butonlarını çalıştırmak için kullanılır.",
            "<div> yalnızca tarayıcı sekmesinin başlığını belirler.",
            "<div> sadece ses oynatmak için kullanılan HTML5 etiketidir."
        ],
        a: "<div> sayfa içeriğini mantıksal bloklara ayırmak için kullanılan, genellikle stil ve yerleşim amaçlı kullanılan blok seviye bir etikettir.",
        difficulty: "medium",
        week: 2,
        topic: "Div etiketi",
        importance: "high",
        explanation: "Öğrencinin notu ve standart HTML kullanımına göre <div>, sayfayı bölümlere (kutulara) ayıran blok seviye bir etikettir. Layout ve stil işlemlerinde sık kullanılır. Diğer seçenekler div'in işlevini farklı alanlara kaydırarak hatalı anlatır."
    }
]);
```
