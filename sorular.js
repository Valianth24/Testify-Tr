// Web Tasarım (HTML-CSS-JS) – 50 Soruluk Sınav Soru Bankası (MCQ)
// Format: window.questionBank = [ { q, t, o, a, difficulty, week, topic, importance, explanation }, ... ]

window.questionBank = [
  // =========================================================
  // ==== 1. HAFTA – HTML Temelleri (17 Soru) =================
  // =========================================================

  {
    q: "HTML’de yorum satırı (comment) nasıl yazılır?",
    t: "mcq",
    o: ["// yorum", "/* yorum */", "<!-- yorum -->", "# yorum", "<comment>yorum</comment>"],
    a: "<!-- yorum -->",
    difficulty: "easy",
    week: 1,
    topic: "HTML yorum",
    importance: "low",
    explanation: `HTML yorumları tarayıcıda görünmez, kodu açıklamak için kullanılır.

Örnek:
<!-- Bu başlık Yusuf içindir -->
<h1>Yusuf</h1>

Sonuç:
Sayfada sadece Yusuf başlığı görünür; yorum görünmez.`
  },

  {
    q: "Web sayfasını oluşturan 3 temel teknoloji en doğru hangisidir?",
    t: "mcq",
    o: [
      "HTML = stil, CSS = veri tabanı, JS = sunucu",
      "HTML = yapı (iskelet), CSS = görünüm (stil), JavaScript = davranış (etkileşim)",
      "HTML = internet, CSS = RAM, JS = ekran kartı",
      "HTML = sadece resim, CSS = sadece yazı, JS = sadece link",
      "HTML = programlama dili, CSS = işletim sistemi, JS = donanım"
    ],
    a: "HTML = yapı (iskelet), CSS = görünüm (stil), JavaScript = davranış (etkileşim)",
    difficulty: "easy",
    week: 1,
    topic: "HTML-CSS-JS rol ayrımı",
    importance: "high",
    explanation: `En basit ezber:
- HTML: Sayfada “ne var?” (başlık, paragraf, buton, resim, form)
- CSS: “Nasıl görünsün?” (renk, hizalama, boşluk, boyut)
- JS: “Ne yapsın?” (tıklanınca değişsin, doğrulama yapsın)

Mini örnek mantığı:
- HTML ile <button>Buton</button> koyarsın.
- CSS ile butonu mavi yaparsın.
- JS ile tıklanınca yazıyı değiştirirsin.`
  },

  {
    q: "HTML etiket yapısı (tag anatomy) en doğru hangisidir?",
    t: "mcq",
    o: [
      "Sadece { } süslü parantezle yazılır",
      "<etiket>içerik</etiket> şeklinde açılıp kapanır (bazıları tek başına olabilir)",
      "Sadece // yorum satırıyla yazılır",
      "Sadece 'import' yazarak çalışır",
      "HTML’de hiç kapanış etiketi yoktur"
    ],
    a: "<etiket>içerik</etiket> şeklinde açılıp kapanır (bazıları tek başına olabilir)",
    difficulty: "easy",
    week: 1,
    topic: "Etiket yapısı",
    importance: "high",
    explanation: `HTML’de çoğu etiket “açılış + kapanış” şeklindedir:
- <p>Merhaba</p>
- <h1>Başlık</h1>

Bazı etiketler tek başına kullanılır:
- <img ... />
- <br />

Örnek:
<p>Eylül</p>
Sonuç: Tarayıcıda “Eylül” paragraf olarak görünür.`
  },

  {
    q: "<!doctype html> satırının görevi en doğru hangisidir?",
    t: "mcq",
    o: [
      "CSS dosyasını çağırır",
      "Tarayıcıya belgenin HTML5 olduğunu söyler (standart mod)",
      "JavaScript’i kapatır",
      "Veritabanı bağlantısını açar",
      "Sayfayı otomatik responsive yapar"
    ],
    a: "Tarayıcıya belgenin HTML5 olduğunu söyler (standart mod)",
    difficulty: "easy",
    week: 1,
    topic: "DOCTYPE",
    importance: "high",
    explanation: `<!doctype html> tarayıcıya “Bu sayfa HTML5 standardında” der.
Bu satır yoksa tarayıcı eski uyumluluk moduna düşebilir.

Örnek:
<!doctype html>
<html> ... </html>

Sonuç: Modern HTML/CSS davranışı daha tutarlı olur.`
  },

  {
    q: "HTML’de <head> ile <body> arasındaki fark en doğru hangisidir?",
    t: "mcq",
    o: [
      "<head> sayfada görünen içeriktir; <body> ayarlardır",
      "<head> ayarlar/metadata/linkler; <body> ekranda görünen içerik",
      "<head> sadece resimler; <body> sadece yazılar",
      "İkisi aynı şeydir",
      "<head> JS yazılır; <body> CSS yazılır"
    ],
    a: "<head> ayarlar/metadata/linkler; <body> ekranda görünen içerik",
    difficulty: "easy",
    week: 1,
    topic: "Head vs Body",
    importance: "high",
    explanation: `<head> görünmeyen ayarlar bölümü gibidir:
- <title>, <meta>, CSS linkleri vb.

<body> kullanıcıya görünen her şeydir:
- başlık, paragraf, buton, resim, form...

Örnek:
<head><title>Yusuf</title></head>
<body><h1>Merhaba</h1></body>

Sonuç: Sekmede “Yusuf”, sayfada “Merhaba” görünür.`
  },

  {
    q: "<meta charset='utf-8'> satırı en doğru ne içindir?",
    t: "mcq",
    o: [
      "Sayfayı hızlandırmak için",
      "Türkçe karakterler gibi doğru metin gösterimi için karakter kodlamasını ayarlamak",
      "CSS’i etkinleştirmek için",
      "JavaScript’i devre dışı bırakmak için",
      "Ekran genişliğini otomatik büyütmek için"
    ],
    a: "Türkçe karakterler gibi doğru metin gösterimi için karakter kodlamasını ayarlamak",
    difficulty: "easy",
    week: 1,
    topic: "Charset",
    importance: "high",
    explanation: `UTF-8, ş-ğ-ı-ö-ü-ç gibi karakterlerin bozulmamasını sağlar.

Örnek:
<meta charset="utf-8">

Sonuç: “Eylül” gibi kelimeler düzgün görünür.`
  },

  {
    q: "<title> etiketinin etkisi en doğru hangisidir?",
    t: "mcq",
    o: [
      "Sayfanın içindeki ana başlığı değiştirir",
      "Tarayıcı sekmesinde görünen sayfa başlığını belirler",
      "Butonların rengini değiştirir",
      "Resmin alt yazısını belirler",
      "Formu doğrular"
    ],
    a: "Tarayıcı sekmesinde görünen sayfa başlığını belirler",
    difficulty: "easy",
    week: 1,
    topic: "Title",
    importance: "medium",
    explanation: `<title> sayfada görünmez; tarayıcı sekmesinde görünür.

Örnek:
<title>Eylül - Web</title>

Sonuç: Sekme başlığı “Eylül - Web” olur.`
  },

  {
    q: "Başlık etiketleri (h1-h6) için en doğru ifade hangisidir?",
    t: "mcq",
    o: [
      "h1 en küçük, h6 en büyüktür",
      "h1 en büyük başlık, h6 en küçüktür",
      "h etiketleri sadece CSS içindir",
      "h etiketleri sadece link oluşturur",
      "h etiketleri form doğrular"
    ],
    a: "h1 en büyük başlık, h6 en küçüktür",
    difficulty: "easy",
    week: 1,
    topic: "Başlıklar",
    importance: "high",
    explanation: `h1 ana başlık; h2-h6 alt başlık gibi düşün.

Örnek:
<h1>Yusuf</h1>
<h2>Eylül</h2>

Sonuç: Yusuf daha büyük görünür, Eylül alt başlık gibi görünür.`
  },

  {
    q: "<p> ile <br> arasındaki fark en doğru hangisidir?",
    t: "mcq",
    o: [
      "<p> satır kırar, <br> paragraf oluşturur",
      "<p> paragraf (blok) oluşturur; <br> sadece satır sonu ekler",
      "İkisi aynı şeydir",
      "<br> başlık yapar",
      "<p> resim ekler"
    ],
    a: "<p> paragraf (blok) oluşturur; <br> sadece satır sonu ekler",
    difficulty: "medium",
    week: 1,
    topic: "Paragraf vs Satır sonu",
    importance: "medium",
    explanation: `<p> yeni paragraf kutusu oluşturur.
<br> aynı paragraf içinde alt satıra indirir.

Örnek:
<p>Yusuf<br>Eylül</p>

Sonuç: Aynı paragraf içinde iki satır görünür.`
  },

  {
    q: "Link (bağlantı) vermek için hangi etiket kullanılır?",
    t: "mcq",
    o: ["<img>", "<a>", "<p>", "<div>", "<span>"],
    a: "<a>",
    difficulty: "easy",
    week: 1,
    topic: "Link",
    importance: "high",
    explanation: `<a> etiketi link verir; href hedefi gösterir.

Örnek:
<a href="https://example.com">Siteye Git</a>

Sonuç: Tıklanınca adrese gider.`
  },

  {
    q: "Bir linki yeni sekmede açmak için hangi özellik kullanılır?",
    t: "mcq",
    o: ["download='true'", "target='_blank'", "rel='css'", "type='button'", "name='newtab'"],
    a: "target='_blank'",
    difficulty: "medium",
    week: 1,
    topic: "Link hedefi",
    importance: "medium",
    explanation: `target="_blank" linki yeni sekmede açar.
(Genelde güvenlik için rel="noopener noreferrer" da eklenir.)

Örnek:
<a href="https://example.com" target="_blank">Aç</a>

Sonuç: Yeni sekmede açılır.`
  },

  {
    q: "<img> etiketinde alt özelliği (alt) en doğru ne için kullanılır?",
    t: "mcq",
    o: [
      "Resmi büyütmek için",
      "Resim yüklenmezse açıklama ve ekran okuyucu (erişilebilirlik) için",
      "Resmi link yapmak için",
      "CSS’i iptal etmek için",
      "JavaScript’i çalıştırmak için"
    ],
    a: "Resim yüklenmezse açıklama ve ekran okuyucu (erişilebilirlik) için",
    difficulty: "medium",
    week: 1,
    topic: "img alt",
    importance: "high",
    explanation: `alt metni:
- Resim açılmazsa kullanıcıya ne olduğunu söyler
- Ekran okuyucu resmin anlamını okur

Örnek:
<img src="logo.png" alt="EYSTUDIO logosu" />

Sonuç: Resim yoksa/okunamazsa alt açıklama devreye girer.`
  },

  {
    q: "Liste oluşturmak için doğru kombinasyon hangisidir?",
    t: "mcq",
    o: ["<ul> + <li>", "<div> + <p>", "<h1> + <h2>", "<img> + <a>", "<table> + <span>"],
    a: "<ul> + <li>",
    difficulty: "easy",
    week: 1,
    topic: "Listeler",
    importance: "high",
    explanation: `Sırasız liste: <ul>
Liste elemanı: <li>

Örnek:
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>

Sonuç: Madde işaretli liste oluşur.`
  },

  {
    q: "Aşağıdakilerden hangisi semantik bir etiket değildir?",
    t: "mcq",
    o: ["<header>", "<nav>", "<main>", "<div>", "<footer>"],
    a: "<div>",
    difficulty: "easy",
    week: 1,
    topic: "Semantic HTML",
    importance: "medium",
    explanation: `<header/nav/main/footer gibi etiketler sayfa bölümlerini anlamlandırır.
<div> ise genel amaçlı kutudur; anlam taşımaz.

Sonuç: SEO + erişilebilirlik için semantik etiketler daha iyidir.`
  },

  {
    q: "Semantic (anlamlı) HTML etiketlerinin temel faydası hangisidir?",
    t: "mcq",
    o: [
      "Sayfayı otomatik hızlandırır",
      "Kodun anlamını güçlendirir: okunabilirlik + SEO + erişilebilirlik",
      "JavaScript’i devre dışı bırakır",
      "Veritabanı oluşturur",
      "CSS’i siler"
    ],
    a: "Kodun anlamını güçlendirir: okunabilirlik + SEO + erişilebilirlik",
    difficulty: "medium",
    week: 1,
    topic: "Semantic HTML fayda",
    importance: "high",
    explanation: `Semantic etiketler “bu bölüm ne?” sorusuna cevap verir.
- Geliştirici daha kolay okur
- Arama motoru daha iyi yorumlar (SEO)
- Erişilebilirlik araçları daha doğru okur

Örnek: <nav> menü, <footer> sayfa altı gibi.`
  },

  {
    q: "<div> ile <span> arasındaki en temel fark hangisidir?",
    t: "mcq",
    o: [
      "<div> inline, <span> block’tur",
      "<div> block (satırı kaplar), <span> inline (metin içinde) davranır",
      "İkisi aynı şeydir",
      "<span> sadece resim içindir",
      "<div> sadece link içindir"
    ],
    a: "<div> block (satırı kaplar), <span> inline (metin içinde) davranır",
    difficulty: "medium",
    week: 1,
    topic: "div vs span",
    importance: "medium",
    explanation: `<div> blok kutu gibi davranır (genelde alt satıra geçer).
<span> metin içi işaretleme gibi davranır (yan yana akar).

Örnek:
<p>Yusuf <span>ve</span> Eylül</p>

Sonuç: “ve” kelimesine ayrı stil verilebilir.`
  },

  {
    q: "id ile class farkı en doğru hangisidir?",
    t: "mcq",
    o: [
      "id aynı sayfada birden çok kez kullanılabilir, class sadece bir kez",
      "id genelde tekil (unique), class tekrar kullanılabilir (çoklu elemanda)",
      "id sadece CSS içindir, class sadece HTML içindir",
      "id resim ekler, class link ekler",
      "id JavaScript’i kapatır"
    ],
    a: "id genelde tekil (unique), class tekrar kullanılabilir (çoklu elemanda)",
    difficulty: "easy",
    week: 1,
    topic: "id vs class",
    importance: "high",
    explanation: `id tek elemanı hedeflemek içindir (tekil olması beklenir).
class aynı stili birçok elemanda kullanmak içindir.

Örnek:
<h1 id="baslik">Yusuf</h1>
<p class="aciklama">...</p>
<p class="aciklama">...</p>`
  },

  {
    q: "Form elemanını gönderirken bir input’u zorunlu yapmak için hangi özellik kullanılır?",
    t: "mcq",
    o: ["checked", "required", "selected", "disabled", "readonly"],
    a: "required",
    difficulty: "easy",
    week: 1,
    topic: "Form - required",
    importance: "medium",
    explanation: `required, alan boş bırakılırsa tarayıcının otomatik uyarı vermesini sağlar.

Örnek:
<input type="text" required />

Sonuç: Boş gönderince tarayıcı “bu alan gerekli” gibi uyarır.`
  },

  {
    q: "Erişilebilirlik (accessibility) için form alanına en doğru eşleşme hangisidir?",
    t: "mcq",
    o: [
      "<label> ile input’u ilişkilendirmek (for/id)",
      "Input’u div içine koymak",
      "Sadece renk kullanarak zorunlu alan göstermek",
      "placeholder yeterlidir, label gereksizdir",
      "label yerine sadece <br> kullanmak"
    ],
    a: "<label> ile input’u ilişkilendirmek (for/id)",
    difficulty: "hard",
    week: 1,
    topic: "Accessibility - label",
    importance: "high",
    explanation: `Label, alanın adıdır ve ekran okuyucular için kritiktir.

Örnek:
<label for="eposta">E-posta</label>
<input id="eposta" type="email" />

Sonuç:
- Label’a tıklayınca input odaklanır
- Erişilebilirlik artar (sınavda artı puan).`
  },

  // =========================================================
  // ==== 2. HAFTA – CSS Temelleri (16 Soru) ==================
  // =========================================================

  {
    q: "CSS’in görevi en doğru hangisidir?",
    t: "mcq",
    o: [
      "Veritabanı sorgusu çalıştırmak",
      "Sayfanın görünümünü/stilini belirlemek (renk, düzen, boşluk, font)",
      "Sunucu kurmak",
      "HTML’i otomatik yazmak",
      "Tarayıcıyı güncellemek"
    ],
    a: "Sayfanın görünümünü/stilini belirlemek (renk, düzen, boşluk, font)",
    difficulty: "easy",
    week: 2,
    topic: "CSS rolü",
    importance: "high",
    explanation: `CSS: “Nasıl görünsün?” sorusunu cevaplar.
HTML’de elemanı koyarsın; CSS ile renk/hizalama/boşluk verirsin.

Örnek:
h1 { color: blue; }

Sonuç: Başlık mavi olur.`
  },

  {
    q: "CSS eklemenin 3 temel yolu hangisidir?",
    t: "mcq",
    o: [
      "only-inline / only-external / only-server",
      "inline style / <style> (internal) / .css dosyası (external)",
      "HTML içine gömme / RAM’e gömme / CPU’ya gömme",
      "script / meta / title",
      "img / a / p"
    ],
    a: "inline style / <style> (internal) / .css dosyası (external)",
    difficulty: "easy",
    week: 2,
    topic: "CSS ekleme yöntemleri",
    importance: "high",
    explanation: `3 yöntem:
1) Inline: <p style="color:red">
2) Internal: <style> p { ... } </style>
3) External: <link rel="stylesheet" href="style.css">

En düzenli yöntem: External (ayrı dosya).`
  },

  {
    q: "Aşağıdakilerden hangisi class seçicisine örnektir?",
    t: "mcq",
    o: ["#kutu", ".kutu", "kutu()", "<kutu>", "@kutu"],
    a: ".kutu",
    difficulty: "easy",
    week: 2,
    topic: "Selector - class",
    importance: "high",
    explanation: `CSS seçicileri:
- .class => class seçer
- #id => id seçer
- p, div => etiket seçer`
  },

  {
    q: "CSS’te id seçicisi hangi sembolle yazılır?",
    t: "mcq",
    o: [".", "#", "$", "&", "%"],
    a: "#",
    difficulty: "easy",
    week: 2,
    topic: "Selector - id",
    importance: "high",
    explanation: `id seçicisi # ile başlar.

Örnek:
#baslik { font-size: 40px; }

Sonuç: Sadece id'si baslik olan eleman etkilenir.`
  },

  {
    q: "CSS specificity (öncelik) için en doğru genelleme hangisidir?",
    t: "mcq",
    o: [
      "Etiket her zaman class’tan güçlüdür",
      "id genelde class’tan, class da etiketten daha güçlüdür",
      "Hepsi eşittir",
      "Inline style en zayıftır",
      "CSS’te öncelik yoktur"
    ],
    a: "id genelde class’tan, class da etiketten daha güçlüdür",
    difficulty: "hard",
    week: 2,
    topic: "Specificity",
    importance: "high",
    explanation: `Basit öncelik sırası:
inline style > #id > .class > etiket

Örnek:
p { color: blue; }
.aciklama { color: red; }
#ozel { color: green; }

Aynı elemana hepsi uygulanırsa, id kazanır.`
  },

  {
    q: "Box Model’de doğru sıra hangisidir?",
    t: "mcq",
    o: [
      "margin -> border -> padding -> content",
      "content -> padding -> border -> margin",
      "padding -> content -> margin -> border",
      "content -> margin -> border -> padding",
      "border -> margin -> content -> padding"
    ],
    a: "content -> padding -> border -> margin",
    difficulty: "medium",
    week: 2,
    topic: "Box Model",
    importance: "high",
    explanation: `Box Model sırası:
- Content (içerik)
- Padding (iç boşluk)
- Border (çerçeve)
- Margin (dış boşluk)

Bu sıralama “kutunun içinden dışına” doğrudur.`
  },

  {
    q: "padding ile margin arasındaki fark en doğru hangisidir?",
    t: "mcq",
    o: [
      "padding dış boşluk, margin iç boşluktur",
      "padding iç boşluk, margin dış boşluktur",
      "İkisi aynı şeydir",
      "padding sadece yazı için, margin sadece resim için",
      "margin sadece flex için"
    ],
    a: "padding iç boşluk, margin dış boşluktur",
    difficulty: "easy",
    week: 2,
    topic: "Padding vs Margin",
    importance: "high",
    explanation: `padding: içerik ile border arası (kutu içi nefes alanı)
margin: kutu ile dış dünya arası (kutular arası mesafe)

Örnek:
.card { padding:16px; margin:12px; }`
  },

  {
    q: "display: block ile display: inline arasındaki temel fark hangisidir?",
    t: "mcq",
    o: [
      "block yan yana dizilir, inline alt alta dizilir",
      "block satırı kaplar (alt satıra iter), inline metin gibi akar (yan yana gelebilir)",
      "inline genişlik/yükseklik alır, block almaz",
      "ikisi aynı şeydir",
      "block sadece resim içindir"
    ],
    a: "block satırı kaplar (alt satıra iter), inline metin gibi akar (yan yana gelebilir)",
    difficulty: "medium",
    week: 2,
    topic: "Display türleri",
    importance: "medium",
    explanation: `block: yeni satırdan başlar (div, p)
inline: metin gibi akar, yan yana gelir (span, a)

Sonuç: Sayfa düzenini doğrudan etkiler.`
  },

  {
    q: "margin: 0 auto; ifadesi genelde ne amaçla kullanılır (block elemanda)?",
    t: "mcq",
    o: [
      "Dikey ortalamak",
      "Yatayda ortalamak (genelde width verilmiş block eleman)",
      "Rengi sıfırlamak",
      "Border’ı kaldırmak",
      "Fontu büyütmek"
    ],
    a: "Yatayda ortalamak (genelde width verilmiş block eleman)",
    difficulty: "medium",
    week: 2,
    topic: "Ortalama - margin auto",
    importance: "medium",
    explanation: `margin: 0 auto; sol ve sağ boşluğu eşit yapar.
Genelde width verilmiş blok elemanlar ortalanır.

Örnek:
.kutu { width:300px; margin:0 auto; }

Sonuç: Kutu sayfanın ortasına gelir.`
  },

  {
    q: "Flexbox ile bir elemanı hem yatay hem dikey ortalamak için en pratik ikili hangisidir?",
    t: "mcq",
    o: [
      "color + background",
      "justify-content + align-items",
      "border + outline",
      "padding + margin",
      "z-index + opacity"
    ],
    a: "justify-content + align-items",
    difficulty: "medium",
    week: 2,
    topic: "Flexbox merkezleme",
    importance: "high",
    explanation: `Flex’te:
- justify-content: ana eksen (default yatay)
- align-items: çapraz eksen (default dikey)

Örnek:
.kapsayici { display:flex; justify-content:center; align-items:center; }

Sonuç: İçerik tam ortalanır.`
  },

  {
    q: "position: relative ile position: absolute arasındaki ilişki en doğru hangisidir?",
    t: "mcq",
    o: [
      "absolute eleman her zaman ekranın sol üstüne göre konumlanır",
      "absolute eleman, en yakın position: relative ebeveyne göre konumlanır",
      "relative eleman görünmez olur",
      "absolute sadece metin içindir",
      "relative, CSS’i devre dışı bırakır"
    ],
    a: "absolute eleman, en yakın position: relative ebeveyne göre konumlanır",
    difficulty: "hard",
    week: 2,
    topic: "Positioning",
    importance: "medium",
    explanation: `Kural:
- parent: position: relative
- child: position: absolute; top/right/bottom/left

Örnek:
.parent { position:relative; }
.child { position:absolute; top:10px; right:10px; }

Sonuç: child, parent’ın içinde sağ üstte durur.`
  },

  {
    q: "Flexbox’ta justify-content neyi kontrol eder?",
    t: "mcq",
    o: ["Dikey hizalamayı", "Yatay (ana eksen) hizalamayı", "Yazı tipini", "Renk paletini", "Sadece border kalınlığını"],
    a: "Yatay (ana eksen) hizalamayı",
    difficulty: "medium",
    week: 2,
    topic: "Flexbox eksenleri",
    importance: "high",
    explanation: `justify-content ana ekseni hizalar (default yatay).
Örnek:
justify-content: space-between; -> aralara eşit boşluk dağıtır.`
  },

  {
    q: "Flexbox’ta elemanların alt satıra geçmesini sağlamak için hangisi kullanılır?",
    t: "mcq",
    o: ["flex-wrap: wrap;", "flex-grow: wrap;", "justify-content: wrap;", "align-items: wrap;", "display: wrap;"],
    a: "flex-wrap: wrap;",
    difficulty: "medium",
    week: 2,
    topic: "Flex-wrap",
    importance: "medium",
    explanation: `flex-wrap: wrap; elemanlar sığmayınca alt satıra geçer.

Örnek:
.row { display:flex; flex-wrap:wrap; }

Sonuç: Ekran daralınca kutular yeni satıra iner.`
  },

  {
    q: "Grid ile 3 eşit sütun oluşturmanın doğru yolu hangisidir?",
    t: "mcq",
    o: [
      "display: grid; grid-template-columns: 1fr 1fr 1fr;",
      "display: flex; grid-columns: 3;",
      "position: grid; columns: 3;",
      "display: block; column-count: 3fr;",
      "grid: on; columns: equal;"
    ],
    a: "display: grid; grid-template-columns: 1fr 1fr 1fr;",
    difficulty: "medium",
    week: 2,
    topic: "CSS Grid",
    importance: "medium",
    explanation: `Grid’de sütunlar grid-template-columns ile tanımlanır.

Örnek:
.grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; }

Sonuç: 3 eşit sütun oluşur.`
  },

  {
    q: "Responsive tasarımda @media sorgusunun amacı en doğru hangisidir?",
    t: "mcq",
    o: [
      "Sayfayı veritabanına bağlamak",
      "Ekran boyutuna göre CSS kurallarını değiştirmek",
      "JavaScript’i hızlandırmak",
      "HTML’i şifrelemek",
      "Tarayıcıyı güncellemek"
    ],
    a: "Ekran boyutuna göre CSS kurallarını değiştirmek",
    difficulty: "easy",
    week: 2,
    topic: "Responsive - media query",
    importance: "high",
    explanation: `@media ile “ekran şu genişlikteyse şu stil geçerli” dersin.

Örnek:
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }

Sonuç: Mobilde sütun sayısı düşer.`
  },

  {
    q: "CSS transition ne işe yarar?",
    t: "mcq",
    o: [
      "Sayfayı sunucuya taşır",
      "Stil değişimlerini yumuşatır (geçiş animasyonu gibi)",
      "HTML’i şifreler",
      "Formu doğrular",
      "JS’i siler"
    ],
    a: "Stil değişimlerini yumuşatır (geçiş animasyonu gibi)",
    difficulty: "medium",
    week: 2,
    topic: "Transition",
    importance: "medium",
    explanation: `transition, bir özellik değişince “bir anda” değil “yumuşak” değişmesini sağlar.

Örnek:
.btn { transition: .2s; }
.btn:hover { transform: scale(1.03); }

Sonuç: Hover olunca buton yumuşak büyür.`
  },

  // =========================================================
  // ==== 3. HAFTA – JavaScript, DOM, Kütüphane Mantığı (17) ===
  // =========================================================

  {
    q: "JavaScript’in web sayfasındaki temel rolü en doğru hangisidir?",
    t: "mcq",
    o: [
      "Sadece renkleri belirlemek",
      "Sayfaya davranış/etkileşim kazandırmak (tıklama, veri çekme, doğrulama)",
      "Sadece başlık eklemek",
      "Sadece resim göstermek",
      "Sadece link vermek"
    ],
    a: "Sayfaya davranış/etkileşim kazandırmak (tıklama, veri çekme, doğrulama)",
    difficulty: "easy",
    week: 3,
    topic: "JS rolü",
    importance: "high",
    explanation: `HTML “buton var” der, CSS “mavi olsun” der, JS “basınca bir şey olsun” der.

Örnek: Butona tıklanınca yazıyı değiştir.
Sonuç: Sayfa kullanıcıyla etkileşir.`
  },

  {
    q: "let ile const arasındaki en doğru fark hangisidir?",
    t: "mcq",
    o: [
      "let sabittir, const değişkendir",
      "const yeniden atama (reassign) kabul etmez; let eder",
      "let sadece sayı tutar, const sadece yazı tutar",
      "const sadece HTML’de çalışır",
      "Fark yoktur"
    ],
    a: "const yeniden atama (reassign) kabul etmez; let eder",
    difficulty: "easy",
    week: 3,
    topic: "Değişkenler",
    importance: "high",
    explanation: `let: değeri değişebilir.
const: aynı değişkene yeniden değer atanamaz.

Örnek:
let sayac = 0; sayac = 1; // olur
const isim = "Eylül"; isim = "Yusuf"; // hata`
  },

  {
    q: "console.log ne işe yarar?",
    t: "mcq",
    o: [
      "Ekrana HTML basar",
      "Tarayıcı geliştirici konsoluna bilgi yazdırır (debug için)",
      "CSS’i çalıştırır",
      "Sunucuya dosya yükler",
      "Kullanıcının şifresini değiştirir"
    ],
    a: "Tarayıcı geliştirici konsoluna bilgi yazdırır (debug için)",
    difficulty: "easy",
    week: 3,
    topic: "Debug",
    importance: "high",
    explanation: `console.log en basit hata ayıklama aracıdır.

Örnek:
console.log("Yusuf");

Sonuç: DevTools Console’da Yusuf yazar.`
  },

  {
    q: "Aşağıdakilerden hangisi JavaScript’te doğru bir koşul (if) kullanımına örnektir?",
    t: "mcq",
    o: ["if yas = 18 then", "if (yas >= 18) { ... }", "if [yas] >= 18 =>", "if yas >= 18 :", "if (yas) >= 18 ) {"],
    a: "if (yas >= 18) { ... }",
    difficulty: "medium",
    week: 3,
    topic: "Koşul yapıları",
    importance: "medium",
    explanation: `if: şart doğruysa çalış.

Örnek:
if (yas >= 18) { console.log("Yetişkin"); }

Sonuç: şart sağlanırsa yazdırır.`
  },

  {
    q: "for döngüsünün temel amacı en doğru hangisidir?",
    t: "mcq",
    o: [
      "Tek bir satırı bir kez çalıştırmak",
      "Bir işlemi belirli sayıda tekrar etmek",
      "CSS’i derlemek",
      "HTML’i şifrelemek",
      "Tarayıcıyı kapatmak"
    ],
    a: "Bir işlemi belirli sayıda tekrar etmek",
    difficulty: "easy",
    week: 3,
    topic: "Döngüler",
    importance: "medium",
    explanation: `Döngü = tekrar.

Örnek:
for (let i=1; i<=3; i++) console.log(i);

Sonuç:
1, 2, 3 yazdırır.`
  },

  {
    q: "Fonksiyon (function) kullanmanın en temel faydası hangisidir?",
    t: "mcq",
    o: [
      "Kod tekrarını azaltmak ve işi parçalara bölmek",
      "HTML’i otomatik yazmak",
      "CSS’i silmek",
      "Sunucu satın almak",
      "Resimleri sıkıştırmak"
    ],
    a: "Kod tekrarını azaltmak ve işi parçalara bölmek",
    difficulty: "easy",
    week: 3,
    topic: "Fonksiyonlar",
    importance: "high",
    explanation: `Fonksiyon = “bir işi yapan paket”.
Aynı işi tekrar tekrar yazmak yerine fonksiyonu çağırırsın.

Örnek:
function selam(ad){ console.log("Merhaba " + ad); }
selam("Yusuf"); selam("Eylül");`
  },

  {
    q: "Array (dizi) en doğru neyi temsil eder?",
    t: "mcq",
    o: [
      "Tek bir değeri",
      "Birden çok değeri sıralı şekilde tutan yapı",
      "Sadece resim formatını",
      "Sadece CSS sınıfını",
      "Sadece HTML etiketini"
    ],
    a: "Birden çok değeri sıralı şekilde tutan yapı",
    difficulty: "easy",
    week: 3,
    topic: "Array",
    importance: "medium",
    explanation: `Array = liste.

Örnek:
const isimler = ["Yusuf", "Eylül"];
isimler[0] => "Yusuf"`
  },

  {
    q: "Object (nesne) yapısı için en doğru tanım hangisidir?",
    t: "mcq",
    o: [
      "Sadece sayı tutar",
      "Anahtar-değer (key-value) ile bilgi tutar",
      "Sadece CSS dosyasıdır",
      "Sadece HTML yorumudur",
      "Sadece döngüdür"
    ],
    a: "Anahtar-değer (key-value) ile bilgi tutar",
    difficulty: "medium",
    week: 3,
    topic: "Object",
    importance: "medium",
    explanation: `Object = etiketli bilgi kutusu.

Örnek:
const kisi = { isim:"Yusuf", yas:28 };
kisi.isim => "Yusuf"`
  },

  {
    q: "DOM (Document Object Model) en doğru neyi ifade eder?",
    t: "mcq",
    o: [
      "Sunucudaki veritabanı",
      "Tarayıcının HTML’i ağaç yapı olarak temsil etmesi ve JS ile erişilebilmesi",
      "CSS renk paleti",
      "Sadece resim galerisi",
      "Sadece internet protokolü"
    ],
    a: "Tarayıcının HTML’i ağaç yapı olarak temsil etmesi ve JS ile erişilebilmesi",
    difficulty: "hard",
    week: 3,
    topic: "DOM kavramı",
    importance: "high",
    explanation: `DOM sayesinde JS, HTML elemanlarını seçip değiştirebilir.

Örnek:
<h1 id="baslik">Merhaba</h1>
JS:
document.getElementById("baslik").textContent = "Eylül";

Sonuç: Sayfada “Eylül” görünür.`
  },

  {
    q: "Bir HTML elemanını id ile seçmek için doğru yöntem hangisidir?",
    t: "mcq",
    o: [
      "document.pick('#id')",
      "document.getElementById('id')",
      "window.getCss('id')",
      "console.get('id')",
      "html.find('id')"
    ],
    a: "document.getElementById('id')",
    difficulty: "easy",
    week: 3,
    topic: "DOM seçiciler",
    importance: "high",
    explanation: `ID ile seçim:
const el = document.getElementById("baslik");

Sonuç: el değişkeni o HTML elemanını tutar.`
  },

  {
    q: "Butona tıklamayı yakalamak için en yaygın yöntem hangisidir?",
    t: "mcq",
    o: ["addEventListener('click', ...)", "addColor('click', ...)", "setHTML('click', ...)", "install('click', ...)", "import click from 'dom'"],
    a: "addEventListener('click', ...)",
    difficulty: "easy",
    week: 3,
    topic: "Event",
    importance: "high",
    explanation: `Event = olay. click = tıklama olayı.

Örnek:
btn.addEventListener("click", () => console.log("Tıklandı"));

Sonuç: Tıklayınca çalışır.`
  },

  {
    q: "Form submit olunca sayfanın yenilenmesini engellemek için en temel yöntem hangisidir?",
    t: "mcq",
    o: ["window.reload(false)", "event.preventDefault()", "document.stop()", "css.prevent()", "html.cancel()"],
    a: "event.preventDefault()",
    difficulty: "hard",
    week: 3,
    topic: "Form submit kontrol",
    importance: "high",
    explanation: `Form submit olunca tarayıcı sayfayı yenileyebilir.
Bunu durdurmak için event.preventDefault() kullanılır.

Örnek:
form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Yenileme yok");
});`
  },

  {
    q: "textContent ile innerHTML arasındaki temel fark hangisidir?",
    t: "mcq",
    o: [
      "textContent HTML’i yorumlar, innerHTML düz metindir",
      "textContent düz metin yazar; innerHTML HTML etiketlerini de yorumlayabilir",
      "İkisi tamamen aynıdır",
      "innerHTML sadece CSS içindir",
      "textContent sadece resim içindir"
    ],
    a: "textContent düz metin yazar; innerHTML HTML etiketlerini de yorumlayabilir",
    difficulty: "hard",
    week: 3,
    topic: "DOM içerik",
    importance: "high",
    explanation: `textContent: güvenli düz metin.
innerHTML: HTML olarak işlenebilir.

Örnek:
div.textContent = "<b>Yusuf</b>";  // ekranda etiket metni görünür
div.innerHTML = "<b>Eylül</b>";    // Eylül kalın görünür

Not: innerHTML yanlış kullanılırsa XSS riski doğurabilir.`
  },

  {
    q: "fetch ile veri çekmekte en temel doğru mantık hangisidir?",
    t: "mcq",
    o: [
      "fetch sadece CSS çeker",
      "fetch bir istek atar, genelde Promise döner; then/await ile sonuç alınır",
      "fetch sayfayı kapatır",
      "fetch sadece resim büyütür",
      "fetch veritabanı oluşturur"
    ],
    a: "fetch bir istek atar, genelde Promise döner; then/await ile sonuç alınır",
    difficulty: "hard",
    week: 3,
    topic: "Fetch/Async",
    importance: "medium",
    explanation: `fetch asenkron çalışır (sonuç hemen gelmeyebilir).
Bu yüzden then/await ile beklenir.

Örnek mantık:
fetch("https://example.com/data")
  .then(r => r.json())
  .then(data => console.log(data));

Sonuç: Veri gelince console’da görünür.`
  },

  {
    q: "JSON nedir? En doğru tanım hangisidir?",
    t: "mcq",
    o: [
      "Bir resim formatı",
      "Veri taşımak için kullanılan metin tabanlı format (anahtar-değer, dizi vb.)",
      "CSS dosyası",
      "HTML etiketi",
      "Bir donanım türü"
    ],
    a: "Veri taşımak için kullanılan metin tabanlı format (anahtar-değer, dizi vb.)",
    difficulty: "medium",
    week: 3,
    topic: "JSON",
    importance: "medium",
    explanation: `JSON, veri taşımak için çok yaygındır.

Örnek JSON:
{ "isim": "Yusuf", "yas": 28 }

JS:
const obj = JSON.parse(jsonMetni);

Sonuç: obj.isim => "Yusuf" olur.`
  },

  {
    q: "CDN ile npm arasındaki en doğru fark hangisidir?",
    t: "mcq",
    o: [
      "CDN sadece offline çalışır; npm sadece resim indirir",
      "CDN: <script>/<link> ile internetten çağırma; npm: projeye paket kurma (node_modules) ve import ile kullanma",
      "İkisi aynı şeydir",
      "npm tarayıcıyı günceller",
      "CDN veritabanı oluşturur"
    ],
    a: "CDN: <script>/<link> ile internetten çağırma; npm: projeye paket kurma (node_modules) ve import ile kullanma",
    difficulty: "hard",
    week: 3,
    topic: "Kütüphane mantığı",
    importance: "high",
    explanation: `CDN: Derste en kolay yöntem. Link/script ekler, direkt kullanırsın.
npm: Projeye kurarsın, import edersin (genelde build süreci ister).

Örnek CDN:
<script src="https://cdn.../axios.min.js"></script>

Örnek npm:
npm install axios
import axios from "axios";`
  },

  {
    q: "Tarayıcı DevTools (F12) içinde Network sekmesi en çok neyi görmek için kullanılır?",
    t: "mcq",
    o: [
      "Bilgisayarın RAM’ini artırmak için",
      "Sayfanın yaptığı istekleri (HTTP), dosya yüklenme sürelerini ve hataları görmek için",
      "CSS dosyasını silmek için",
      "HTML’i şifrelemek için",
      "Klavye ayarlarını değiştirmek için"
    ],
    a: "Sayfanın yaptığı istekleri (HTTP), dosya yüklenme sürelerini ve hataları görmek için",
    difficulty: "medium",
    week: 3,
    topic: "DevTools - Network",
    importance: "medium",
    explanation: `Network:
- Hangi dosya/istek kaç ms sürdü?
- 404/500 gibi hatalar var mı?
- API isteği gidip geldi mi?

Örnek:
Resim yüklenmiyorsa Network’te 404 görürsün.
Sonuç: “Yol yanlış mı?” sorusunu net çözer.`
  },

  {
    q: "XSS riskinin en temel kaynağı web’de çoğunlukla hangi hatalı yaklaşımla büyür?",
    t: "mcq",
    o: [
      "textContent kullanmak",
      "Kullanıcıdan gelen metni direkt innerHTML ile sayfaya basmak",
      "CSS ile renk vermek",
      "HTML’de <title> yazmak",
      "Responsive yapmak"
    ],
    a: "Kullanıcıdan gelen metni direkt innerHTML ile sayfaya basmak",
    difficulty: "hard",
    week: 3,
    topic: "Güvenlik - XSS temel",
    importance: "high",
    explanation: `XSS: Kullanıcı girdisi “kod” gibi çalıştırılabilir.
Bu yüzden kullanıcı metni:
- Mümkünse textContent ile basılır
- Gerekirse sanitize edilir

Riskli örnek:
div.innerHTML = kullaniciMesaji;

Sonuç: Kötü niyetli içerik script çalıştırabilir.`
  }
];
