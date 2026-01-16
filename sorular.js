// Web Tasarım (HTML-CSS-JS) – 50 Soruluk Sınav Soru Bankası (MCQ)
// TAMAMEN FARKLI SORULAR – Önceki setle aynı sorular yok.
// Format: window.questionBank = [ { q, t, o, a, difficulty, week, topic, importance, explanation }, ... ]

window.questionBank = [
  // =========================================================
  // ==== 1. HAFTA – HTML Temelleri (17 Soru) =================
  // =========================================================

  {
    q: "HTML’de <html lang='tr'> yazmanın en doğru amacı hangisidir?",
    t: "mcq",
    o: [
      "Sayfayı otomatik Türkçeye çevirir",
      "Arama motoru ve ekran okuyucu gibi araçlara sayfanın dilini bildirir",
      "CSS dosyasını aktif eder",
      "Sayfanın daha hızlı açılmasını sağlar",
      "JavaScript’in çalışmasını zorunlu yapar"
    ],
    a: "Arama motoru ve ekran okuyucu gibi araçlara sayfanın dilini bildirir",
    difficulty: "medium",
    week: 1,
    topic: "Dil bildirimi (lang)",
    importance: "high",
    explanation: `lang, sayfanın dilini belirtir:
- Ekran okuyucular doğru telaffuz eder
- Arama motorları sayfayı doğru sınıflandırır

Örnek:
<html lang="tr">
Sonuç: Sayfanın dili Türkçe olarak anlaşılır.`
  },

  {
    q: "Mobil uyum (responsive) için en kritik meta etiketi hangisidir?",
    t: "mcq",
    o: [
      "<meta name='keywords' content='...'>",
      "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
      "<meta charset='utf-8'>",
      "<meta http-equiv='refresh' content='5'>",
      "<meta name='author' content='...'>"
    ],
    a: "<meta name='viewport' content='width=device-width, initial-scale=1.0'>",
    difficulty: "easy",
    week: 1,
    topic: "Viewport",
    importance: "high",
    explanation: `Viewport meta etiketi, mobilde sayfanın genişliğini cihaz genişliğine uydurur.

Örnek:
<meta name="viewport" content="width=device-width, initial-scale=1.0">

Sonuç: Mobilde “yakınlaştırılmış/taşmış” görünüm azalır.`
  },

  {
    q: "Aşağıdakilerden hangisi “semantik” bir içerik parçasını en doğru ifade eder?",
    t: "mcq",
    o: [
      "<div class='haber'> ... </div>",
      "<article> ... </article>",
      "<span> ... </span>",
      "<b> ... </b>",
      "<br>"
    ],
    a: "<article> ... </article>",
    difficulty: "easy",
    week: 1,
    topic: "Semantik etiketler",
    importance: "high",
    explanation: `<article>, tek başına anlamlı bir içerik bloğunu temsil eder (haber, blog yazısı vb.).
<div> ise genel amaçlı kutudur (anlam taşımaz).

Örnek:
<article>
  <h2>Haber</h2>
  <p>Detay...</p>
</article>`
  },

  {
    q: "<section> ile <article> arasındaki en doğru fark hangisidir?",
    t: "mcq",
    o: [
      "section sadece link içindir, article sadece resim içindir",
      "article tek başına anlamlı içerik; section sayfanın tematik bir bölümüdür (içinde article olabilir)",
      "ikisi tamamen aynıdır, fark yoktur",
      "section sadece CSS ile çalışır",
      "article sadece form içinde kullanılabilir"
    ],
    a: "article tek başına anlamlı içerik; section sayfanın tematik bir bölümüdür (içinde article olabilir)",
    difficulty: "hard",
    week: 1,
    topic: "Semantik yapı mantığı",
    importance: "medium",
    explanation: `Basit mantık:
- article: “tek başına paylaşılabilir içerik” (blog yazısı, haber)
- section: “konu bölümü” (sayfada bir bölüm)

Örnek:
<section>
  <h2>Son Haberler</h2>
  <article>...</article>
  <article>...</article>
</section>`
  },

  {
    q: "<strong> etiketi en doğru neyi ifade eder?",
    t: "mcq",
    o: [
      "Sadece yazıyı kalın yapmak için görsel amaçlıdır",
      "Metnin önemli/ vurgulanması gerektiğini semantik olarak belirtir",
      "Metni otomatik kırmızı yapar",
      "Metni linke çevirir",
      "Metni gizler"
    ],
    a: "Metnin önemli/ vurgulanması gerektiğini semantik olarak belirtir",
    difficulty: "medium",
    week: 1,
    topic: "Metin vurgusu (strong)",
    importance: "medium",
    explanation: `<strong> görselde kalın görünebilir ama asıl amaç “önem” bildirmektir.
Ekran okuyucular bu önemi daha doğru yorumlar.

Örnek:
<strong>Önemli:</strong> Şifreyi kimseyle paylaşma.`
  },

  {
    q: "Bir görselin sayfada doğru boyutta görünmesi ve oranının bozulmaması için HTML tarafında en doğru yaklaşım hangisidir?",
    t: "mcq",
    o: [
      "Sadece <img> yazmak yeterlidir, boyut kontrol edilmez",
      "width ve height öznitelikleri veya CSS ile boyut verip oranı korumak (ör. height:auto)",
      "Görselleri sadece <div> içine koymak",
      "Görseli <p> ile sarmak",
      "Görselin adını büyütmek (ör. foto_BUYUK.png)"
    ],
    a: "width ve height öznitelikleri veya CSS ile boyut verip oranı korumak (ör. height:auto)",
    difficulty: "medium",
    week: 1,
    topic: "Görsel boyutlandırma",
    importance: "medium",
    explanation: `Boyutlandırma mantığı:
- HTML’de width/height verilebilir
- CSS’te width: 300px; height: auto; gibi oran korunur

Örnek CSS:
img { width: 300px; height: auto; }

Sonuç: Görsel ezilmez, oranı bozulmaz.`
  },

  {
    q: "Bir tablo oluştururken sütun başlığı (header cell) için en doğru etiket hangisidir?",
    t: "mcq",
    o: ["<td>", "<tr>", "<th>", "<thead>", "<tablehead>"],
    a: "<th>",
    difficulty: "easy",
    week: 1,
    topic: "Tablo etiketleri",
    importance: "medium",
    explanation: `<th> tablo başlık hücresidir.
Genelde kalın ve ortalı görünür, ayrıca semantik olarak “başlık” anlamı taşır.

Örnek:
<tr><th>Ad</th><th>Yaş</th></tr>`
  },

  {
    q: "Form verisi gönderirken URL’de görünmesi daha olası olan yöntem hangisidir?",
    t: "mcq",
    o: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    a: "GET",
    difficulty: "medium",
    week: 1,
    topic: "Form method",
    importance: "high",
    explanation: `GET genelde veriyi URL’e ekleyerek gönderir (arama gibi).
POST genelde gövdede gönderir (login/kayıt gibi).

Örnek:
<form method="get"> ... </form>
Sonuç: Arama parametreleri URL’de görülebilir.`
  },

  {
    q: "<form action='...'> içindeki action özelliği en doğru neyi belirler?",
    t: "mcq",
    o: [
      "Formun kaç saniyede bir yenileneceğini",
      "Form verisinin gönderileceği hedef URL/adresi",
      "Formun içindeki inputların rengini",
      "Formu otomatik doğrulama seviyesini",
      "Formun içine resim eklemeyi"
    ],
    a: "Form verisinin gönderileceği hedef URL/adresi",
    difficulty: "easy",
    week: 1,
    topic: "Form action",
    importance: "high",
    explanation: `action = “Gönderince nereye gitsin?”

Örnek:
<form action="/kayit" method="post">
Sonuç: Gönderilen veri /kayit adresine gider.`
  },

  {
    q: "Formda bir input’un name özelliği en çok hangi amaçla kritiktir?",
    t: "mcq",
    o: [
      "Input’u otomatik büyütmek",
      "Gönderilen veride alanın anahtar adı (field key) olarak kullanılmak",
      "Input’u sadece okunur yapmak",
      "Input’u gizlemek",
      "Input’a border eklemek"
    ],
    a: "Gönderilen veride alanın anahtar adı (field key) olarak kullanılmak",
    difficulty: "hard",
    week: 1,
    topic: "Form name",
    importance: "high",
    explanation: `Form gönderildiğinde çoğu sistem name değerini “alan adı” olarak kullanır.

Örnek:
<input name="email" type="email">
Sonuç: Sunucu tarafına email=... gibi gider.`
  },

  {
    q: "Tek seçim yapılacak seçenek grubu (örn. cinsiyet: Kadın/Erkek) için en uygun input türü hangisidir?",
    t: "mcq",
    o: ["checkbox", "radio", "range", "file", "color"],
    a: "radio",
    difficulty: "easy",
    week: 1,
    topic: "Radio vs Checkbox",
    importance: "high",
    explanation: `radio: aynı grupta tek seçim.
checkbox: birden fazla seçim.

Örnek:
<input type="radio" name="cinsiyet" value="kadin">
<input type="radio" name="cinsiyet" value="erkek">`
  },

  {
    q: "Kullanıcıdan gizli şekilde şifre girişi almak için doğru input type hangisidir?",
    t: "mcq",
    o: ["type='secret'", "type='password'", "type='hide'", "type='secure'", "type='private'"],
    a: "type='password'",
    difficulty: "easy",
    week: 1,
    topic: "Input type",
    importance: "medium",
    explanation: `type="password" girilen karakterleri gizler (nokta/asterisk).

Örnek:
<input type="password" name="sifre">`
  },

  {
    q: "Dışarıdan bir CSS dosyasını HTML’e bağlamanın doğru yolu hangisidir?",
    t: "mcq",
    o: [
      "<script src='style.css'></script>",
      "<link rel='stylesheet' href='style.css'>",
      "<style href='style.css'></style>",
      "<css src='style.css'></css>",
      "<meta css='style.css'>"
    ],
    a: "<link rel='stylesheet' href='style.css'>",
    difficulty: "easy",
    week: 1,
    topic: "External CSS bağlama",
    importance: "high",
    explanation: `External CSS en temiz yöntemdir.
<link rel="stylesheet" href="style.css">

Sonuç: style.css içindeki kurallar sayfaya uygulanır.`
  },

  {
    q: "<script src='app.js' defer></script> kullanmanın en doğru avantajı hangisidir?",
    t: "mcq",
    o: [
      "JavaScript’i tamamen kapatır",
      "HTML parse edilirken script indirilir; HTML bittikten sonra çalışır (daha güvenli yükleme sırası)",
      "Script’i sadece mobilde çalıştırır",
      "CSS’in daha hızlı çalışmasını sağlar",
      "Tarayıcıyı otomatik günceller"
    ],
    a: "HTML parse edilirken script indirilir; HTML bittikten sonra çalışır (daha güvenli yükleme sırası)",
    difficulty: "hard",
    week: 1,
    topic: "Script yükleme (defer)",
    importance: "medium",
    explanation: `defer:
- Dosya indirme gecikmeden başlar
- Çalışma, HTML tamamen okunduktan sonra olur

Sonuç: DOM elemanları oluşmadan JS çalışıp hata verme ihtimali düşer.`
  },

  {
    q: "Aşağıdakilerden hangisi bir e-posta linki (mailto) örneğidir?",
    t: "mcq",
    o: [
      "<a href='email:yusuf@site.com'>Mail</a>",
      "<a href='mailto:yusuf@site.com'>Mail</a>",
      "<a href='sms:yusuf@site.com'>Mail</a>",
      "<a href='http://yusuf@site.com'>Mail</a>",
      "<a href='tel:yusuf@site.com'>Mail</a>"
    ],
    a: "<a href='mailto:yusuf@site.com'>Mail</a>",
    difficulty: "medium",
    week: 1,
    topic: "Link türleri",
    importance: "low",
    explanation: `mailto: tıklanınca varsayılan mail uygulamasını açar.

Örnek:
<a href="mailto:eystudio.3d@gmail.com">Bize yaz</a>`
  },

  {
    q: "Erişilebilirlik için, butonun sadece ikon içerdiği durumda (metin yoksa) en doğru pratik hangisidir?",
    t: "mcq",
    o: [
      "Butona sadece renk vermek yeterlidir",
      "Butona aria-label eklemek",
      "Butonu div ile değiştirmek",
      "Buton yerine span kullanmak",
      "Butonun fontunu büyütmek"
    ],
    a: "Butona aria-label eklemek",
    difficulty: "hard",
    week: 1,
    topic: "Accessibility - aria-label",
    importance: "high",
    explanation: `İkon butonlarda metin yoksa ekran okuyucu ne olduğunu anlayamaz.
aria-label açıklama verir.

Örnek:
<button aria-label="Menüyü aç">☰</button>

Sonuç: Ekran okuyucu “Menüyü aç butonu” gibi okur.`
  },

  // =========================================================
  // ==== 2. HAFTA – CSS Temelleri (16 Soru) ==================
  // =========================================================

  {
    q: "CSS’te “child (>)” seçici neyi hedefler?",
    t: "mcq",
    o: [
      "Tüm torunları (iç içe her şeyi)",
      "Sadece doğrudan çocuk elemanları",
      "Sadece kardeş elemanları",
      "Sadece aynı id’yi taşıyanları",
      "Sadece hover durumundaki elemanları"
    ],
    a: "Sadece doğrudan çocuk elemanları",
    difficulty: "medium",
    week: 2,
    topic: "Seçiciler - child",
    importance: "medium",
    explanation: `> seçicisi sadece “bir alt seviye”yi seçer.

Örnek:
ul > li { ... }
Sonuç: ul’in direkt içindeki li’lar seçilir (daha derindeki li’lar değil).`
  },

  {
    q: ".menu li (boşluklu) seçici ile .menu > li (>) seçici arasındaki fark en doğru hangisidir?",
    t: "mcq",
    o: [
      "İkisi tamamen aynı",
      "Boşluklu: tüm torun li’lar; > : sadece direkt çocuk li’lar",
      "Boşluklu: sadece direkt çocuk; > : tüm torunlar",
      "İkisi sadece id ile çalışır",
      "İkisi sadece grid içinde çalışır"
    ],
    a: "Boşluklu: tüm torun li’lar; > : sadece direkt çocuk li’lar",
    difficulty: "hard",
    week: 2,
    topic: "Seçiciler - descendant vs child",
    importance: "high",
    explanation: `Boşluk = descendant (içindeki her şey)
> = child (direkt çocuk)

Örnek:
.menu li { ... }      // .menu içindeki tüm li’lar
.menu > li { ... }    // sadece .menu’nün direkt li çocukları`
  },

  {
    q: "::before pseudo-element’i en doğru ne için kullanılır?",
    t: "mcq",
    o: [
      "HTML’e yeni dosya eklemek için",
      "Bir elemana CSS ile “önüne” sanal içerik eklemek için (content ile)",
      "JavaScript’i hızlandırmak için",
      "Tarayıcı cache’ini temizlemek için",
      "Sadece mobil menü yapmak için"
    ],
    a: "Bir elemana CSS ile “önüne” sanal içerik eklemek için (content ile)",
    difficulty: "medium",
    week: 2,
    topic: "Pseudo-element",
    importance: "medium",
    explanation: `::before / ::after ile HTML yazmadan küçük ekler yapılır.
content şarttır.

Örnek:
.badge::before { content: "Yeni "; font-weight: bold; }

Sonuç: Elemanın başına “Yeni ” eklenmiş gibi görünür.`
  },

  {
    q: "box-sizing: border-box; en doğru hangi etkiyi yapar?",
    t: "mcq",
    o: [
      "Border’ı kaldırır",
      "width/height hesaplamasına padding+border’ı dahil eder (kutu taşması azalır)",
      "Sadece yazı boyutunu değiştirir",
      "Elementi inline yapar",
      "margin’i otomatik sıfırlar"
    ],
    a: "width/height hesaplamasına padding+border’ı dahil eder (kutu taşması azalır)",
    difficulty: "hard",
    week: 2,
    topic: "Box sizing",
    importance: "high",
    explanation: `border-box ile:
width = content + padding + border toplamını kapsar.

Örnek:
.kutu { width: 200px; padding: 20px; box-sizing: border-box; }
Sonuç: Kutu toplamda 200px kalır, taşma riski azalır.`
  },

  {
    q: "overflow: auto; en doğru ne yapar?",
    t: "mcq",
    o: [
      "Taşan içeriği tamamen siler",
      "Taşma yoksa scroll göstermez; taşma varsa scroll çıkarır",
      "Her zaman iki scroll bar gösterir",
      "Sadece yatay taşmayı engeller",
      "Elementi sayfadan kaldırır"
    ],
    a: "Taşma yoksa scroll göstermez; taşma varsa scroll çıkarır",
    difficulty: "medium",
    week: 2,
    topic: "Overflow",
    importance: "medium",
    explanation: `overflow:auto; pratik bir çözümdür:
- İçerik sığarsa normal
- Sığmazsa kaydırma ekler

Örnek:
.panel { max-height: 200px; overflow: auto; }`
  },

  {
    q: "Aşağıdakilerden hangisi CSS değişkeni (custom property) tanımlama ve kullanma örneğidir?",
    t: "mcq",
    o: [
      "--renk: red; color: --renk;",
      ":root { --renk: red; } .btn { color: var(--renk); }",
      "@var renk = red; .btn { color: renk; }",
      ".btn { color: $renk; }",
      "root(--renk=red); btn(color=renk);"
    ],
    a: ":root { --renk: red; } .btn { color: var(--renk); }",
    difficulty: "hard",
    week: 2,
    topic: "CSS variables",
    importance: "medium",
    explanation: `CSS değişkeni:
:root { --primary: #0a84ff; }
.btn { background: var(--primary); }

Sonuç: Renk tek yerden değiştirilebilir (tema mantığı).`
  },

  {
    q: "İki CSS kuralı aynı elemanı etkiliyorsa ve specificity eşitse, hangisi kazanır?",
    t: "mcq",
    o: [
      "Her zaman ilk yazılan kazanır",
      "Her zaman daha kısa kural kazanır",
      "Dosyada en son yazılan (cascade) kazanır",
      "Her zaman etiket seçici kazanır",
      "Tarayıcı rastgele seçer"
    ],
    a: "Dosyada en son yazılan (cascade) kazanır",
    difficulty: "medium",
    week: 2,
    topic: "Cascade kuralı",
    importance: "high",
    explanation: `Specificity eşitse “son yazılan” kazanır.

Örnek:
.btn { color: red; }
.btn { color: blue; }

Sonuç: Buton mavi olur (son kural).`
  },

  {
    q: "flex-direction: column; kullanılırsa, ana eksen (main axis) genelde hangi yönde olur?",
    t: "mcq",
    o: ["Yatay (soldan sağa)", "Dikey (yukarıdan aşağı)", "Çapraz", "Rastgele", "Grid’e dönüşür"],
    a: "Dikey (yukarıdan aşağı)",
    difficulty: "hard",
    week: 2,
    topic: "Flex yön mantığı",
    importance: "medium",
    explanation: `Flex’te ana eksen, flex-direction ile değişir.
- row: yatay
- column: dikey

Sonuç: justify-content artık dikey dağıtır gibi düşünülür.`
  },

  {
    q: "Flex/Grid düzenlerinde “elemanlar arası boşluk” için en temiz modern özellik hangisidir?",
    t: "mcq",
    o: ["margin-left", "padding", "gap", "border-spacing", "outline"],
    a: "gap",
    difficulty: "easy",
    week: 2,
    topic: "Gap",
    importance: "high",
    explanation: `gap, elemanlar arasında temiz boşluk verir.
Flex ve Grid’de çok pratik.

Örnek:
.row { display:flex; gap: 12px; }`
  },

  {
    q: "Grid’de alan isimleriyle yerleşim yapmak için kullanılan yaklaşım hangisidir?",
    t: "mcq",
    o: [
      "grid-template-areas ve grid-area",
      "flex-wrap ve flex-grow",
      "position: absolute ile tablo çizmek",
      "float ile her şeyi hizalamak",
      "z-index ile sütun yapmak"
    ],
    a: "grid-template-areas ve grid-area",
    difficulty: "hard",
    week: 2,
    topic: "Grid areas",
    importance: "medium",
    explanation: `Grid areas:
.container {
  display:grid;
  grid-template-areas:
    "header header"
    "sidebar main";
}
header { grid-area: header; }

Sonuç: Okunabilir bir layout kurulabilir.`
  },

  {
    q: "position: fixed; ile position: sticky; arasındaki fark en doğru hangisidir?",
    t: "mcq",
    o: [
      "fixed scroll ile birlikte normal akar; sticky ekrana yapışır",
      "fixed her zaman viewport’a sabitlenir; sticky belirli noktadan sonra yapışır ve konteyner içinde davranır",
      "ikisi tamamen aynı",
      "sticky sadece mobilde, fixed sadece masaüstünde çalışır",
      "fixed z-index’i kapatır, sticky açar"
    ],
    a: "fixed her zaman viewport’a sabitlenir; sticky belirli noktadan sonra yapışır ve konteyner içinde davranır",
    difficulty: "hard",
    week: 2,
    topic: "Position fixed vs sticky",
    importance: "high",
    explanation: `fixed: her zaman ekrana sabit (örn. WhatsApp butonu)
sticky: scroll’da belirli bir noktadan sonra “yapışır” (örn. tablo başlığı)

Örnek:
.header { position: sticky; top: 0; }`
  },

  {
    q: "transform: translateX(20px); kullanmanın, margin-left: 20px;’e göre tipik farkı hangisidir?",
    t: "mcq",
    o: [
      "transform yerleşimi (flow) değiştirmez; margin düzeni etkiler",
      "margin hiçbir zaman çalışmaz",
      "transform sadece yazıyı taşır, kutuyu taşımaz",
      "margin animasyon için daha hızlıdır",
      "İkisi aynı performanstadır ve aynı etkiyi verir"
    ],
    a: "transform yerleşimi (flow) değiştirmez; margin düzeni etkiler",
    difficulty: "hard",
    week: 2,
    topic: "Transform vs Layout",
    importance: "medium",
    explanation: `transform elemanı görsel olarak kaydırır, komşu elemanların yerleşimi genelde değişmez.
margin ise “yerleşim” boşluğu yaratarak düzeni etkiler.

Sonuç: Animasyonlarda transform tercih edilir (daha akıcı olabilir).`
  },

  {
    q: "transition ile animation arasındaki en doğru fark hangisidir?",
    t: "mcq",
    o: [
      "transition sadece JS ile çalışır; animation sadece HTML ile",
      "transition bir durum değişiminde geçiş yapar; animation keyframes ile kendi başına akabilir",
      "animation sadece hover’da olur; transition her zaman sonsuz döner",
      "İkisi sadece renkle ilgilidir",
      "İkisi aynı şeydir"
    ],
    a: "transition bir durum değişiminde geçiş yapar; animation keyframes ile kendi başına akabilir",
    difficulty: "medium",
    week: 2,
    topic: "Transition vs Animation",
    importance: "medium",
    explanation: `transition: hover/active gibi bir değişimde yumuşak geçiş
animation: @keyframes ile bağımsız animasyon akışı

Örnek:
@keyframes pulse { ... }
.box { animation: pulse 1s infinite; }`
  },

  {
    q: "vh birimi en doğru neyi temsil eder?",
    t: "mcq",
    o: [
      "Yazı tipi yüksekliğini",
      "Viewport (ekran) yüksekliğinin yüzdesini",
      "Sadece genişliği",
      "Sadece font kalınlığını",
      "Sadece margin değerini"
    ],
    a: "Viewport (ekran) yüksekliğinin yüzdesini",
    difficulty: "easy",
    week: 2,
    topic: "CSS units (vh)",
    importance: "medium",
    explanation: `1vh = ekran yüksekliğinin %1’i.
Örnek:
.hero { height: 100vh; }
Sonuç: Bölüm ekranı tam kaplar.`
  },

  {
    q: "display: inline-block; için en doğru ifade hangisidir?",
    t: "mcq",
    o: [
      "Yeni satıra geçer ve tüm satırı kaplar",
      "Metin gibi yan yana durabilir ama width/height alabilir",
      "Sadece resimler için geçerlidir",
      "Flex’i kapatır",
      "Her zaman görünmez yapar"
    ],
    a: "Metin gibi yan yana durabilir ama width/height alabilir",
    difficulty: "medium",
    week: 2,
    topic: "Display inline-block",
    importance: "medium",
    explanation: `inline-block:
- inline gibi yan yana durabilir
- block gibi boyutlandırılabilir

Örnek:
.badge { display:inline-block; padding: 6px 10px; }`
  },

  {
    q: ":nth-child(2) seçicisi en doğru neyi hedefler?",
    t: "mcq",
    o: [
      "Sadece class’ı 2 olan elemanı",
      "Ebeveyninin 2. çocuğu olan elemanı",
      "İkinci sayfayı",
      "Sadece ikinci satırdaki metni",
      "Sadece 2 piksel genişliğindeki elemanı"
    ],
    a: "Ebeveyninin 2. çocuğu olan elemanı",
    difficulty: "medium",
    week: 2,
    topic: "Pseudo-class nth-child",
    importance: "low",
    explanation: `nth-child, sıralamaya göre seçim yapar.

Örnek:
li:nth-child(2) { font-weight: bold; }
Sonuç: listedeki 2. li kalın olur.`
  },

  // =========================================================
  // ==== 3. HAFTA – JavaScript Temelleri + DOM Mantığı (17) ===
  // =========================================================

  {
    q: "JavaScript’te == ile === arasındaki en doğru fark hangisidir?",
    t: "mcq",
    o: [
      "== daha katıdır, === daha esnektir",
      "=== hem değer hem tür (type) karşılaştırır; == tür dönüşümü yapabilir",
      "İkisi tamamen aynıdır",
      "== sadece sayılarda çalışır",
      "=== sadece stringlerde çalışır"
    ],
    a: "=== hem değer hem tür (type) karşılaştırır; == tür dönüşümü yapabilir",
    difficulty: "medium",
    week: 3,
    topic: "Eşobaşı ve type dönüşümü",
    importance: "high",
    explanation: `Örnek:
"5" == 5   -> true (tür dönüşümü olabilir)
"5" === 5  -> false (string vs number)

Sınavlarda “strict equality” (===) genelde doğru tercih olarak sorulur.`
  },

  {
    q: "typeof operatörü en doğru ne yapar?",
    t: "mcq",
    o: [
      "Bir değişkenin değerini siler",
      "Bir değişkenin türünü string olarak döndürür",
      "Bir değişkeni sayıya çevirir",
      "Kodun hızını artırır",
      "DOM’u günceller"
    ],
    a: "Bir değişkenin türünü string olarak döndürür",
    difficulty: "easy",
    week: 3,
    topic: "typeof",
    importance: "medium",
    explanation: `typeof, tür kontrolü için kullanılır.

Örnek:
typeof 10       -> "number"
typeof "Yusuf"  -> "string"
typeof true     -> "boolean"`
  },

  {
    q: "parseInt('08') ile Number('08') kullanımında en doğru genel fark hangisidir?",
    t: "mcq",
    o: [
      "parseInt her zaman ondalıklı sayı verir, Number vermez",
      "parseInt metnin başından tam sayı okur; Number tüm metni sayıya çevirmeye çalışır",
      "Number sadece harfleri kabul eder",
      "İkisi sadece dizilerde çalışır",
      "parseInt sadece CSS için kullanılır"
    ],
    a: "parseInt metnin başından tam sayı okur; Number tüm metni sayıya çevirmeye çalışır",
    difficulty: "hard",
    week: 3,
    topic: "Type conversion",
    importance: "medium",
    explanation: `Örnek:
parseInt("12px") -> 12
Number("12px")   -> NaN

Sonuç: parseInt “başındaki sayıyı alır”, Number daha katıdır.`
  },

  {
    q: "NaN değerini doğru kontrol etmenin en güvenli modern yolu hangisidir?",
    t: "mcq",
    o: [
      "x == NaN",
      "x === NaN",
      "Number.isNaN(x)",
      "typeof x === 'NaN'",
      "x.includes('NaN')"
    ],
    a: "Number.isNaN(x)",
    difficulty: "hard",
    week: 3,
    topic: "NaN kontrolü",
    importance: "medium",
    explanation: `NaN ile karşılaştırma tuzaktır:
NaN === NaN false döner.

Doğru:
Number.isNaN(deger)

Örnek:
Number.isNaN(Number("abc")) -> true`
  },

  {
    q: "Aşağıdakilerden hangisi “falsy” bir değerdir?",
    t: "mcq",
    o: ["'0'", "[]", "{}", "0", "'false'"],
    a: "0",
    difficulty: "medium",
    week: 3,
    topic: "Truthy/Falsy",
    importance: "medium",
    explanation: `Falsy değerler (en bilinenler):
false, 0, "", null, undefined, NaN

Örnek:
if (0) { ... }  // çalışmaz
if ("0") { ... } // çalışır (string truthy)`
  },

  {
    q: "Template literal (şablon string) kullanımı için doğru örnek hangisidir?",
    t: "mcq",
    o: [
      "'Merhaba ${ad}'",
      "\"Merhaba ${ad}\"",
      "`Merhaba ${ad}`",
      "(Merhaba ${ad})",
      "<Merhaba ${ad}>"
    ],
    a: "`Merhaba ${ad}`",
    difficulty: "easy",
    week: 3,
    topic: "Template literals",
    importance: "medium",
    explanation: `Template literal backtick ile yazılır:
const ad = "Yusuf";
const mesaj = \`Merhaba \${ad}\`;

Sonuç: mesaj = "Merhaba Yusuf"`
  },

  {
    q: "Koşullu kısa yazım (ternary) için doğru örnek hangisidir?",
    t: "mcq",
    o: [
      "yas >= 18 ? 'Yetişkin' : 'Çocuk'",
      "yas >= 18 then 'Yetişkin' else 'Çocuk'",
      "if ? yas >= 18 : 'Yetişkin'",
      "yas >= 18 :: 'Yetişkin' ?? 'Çocuk'",
      "yas => 18 ? 'Yetişkin' : 'Çocuk'"
    ],
    a: "yas >= 18 ? 'Yetişkin' : 'Çocuk'",
    difficulty: "medium",
    week: 3,
    topic: "Ternary operator",
    importance: "medium",
    explanation: `Ternary: kısa if-else.
const etiket = yas >= 18 ? "Yetişkin" : "Çocuk";

Sonuç: Tek satırda karar verilir.`
  },

  {
    q: "Mantıksal AND (&&) operatörüyle “kısa devre” (short-circuit) davranışı için en doğru ifade hangisidir?",
    t: "mcq",
    o: [
      "Her zaman iki tarafı da çalıştırır",
      "Sol taraf false ise sağ tarafı çalıştırmadan false benzeri değeri döndürebilir",
      "Sol taraf true ise her zaman 1 döndürür",
      "Sadece sayılarda çalışır",
      "Sadece DOM’da çalışır"
    ],
    a: "Sol taraf false ise sağ tarafı çalıştırmadan false benzeri değeri döndürebilir",
    difficulty: "hard",
    week: 3,
    topic: "Short-circuit",
    importance: "medium",
    explanation: `Örnek:
kullanici && kullanici.ad

Eğer kullanici null/undefined ise, hata yerine hızlıca falsey döner.
Bu, güvenli erişim için basit bir tekniktir.`
  },

  {
    q: "Array’de sadece koşulu sağlayan elemanları yeni bir diziye almak için hangi metod uygundur?",
    t: "mcq",
    o: ["map", "filter", "reduce", "join", "sliceTo"],
    a: "filter",
    difficulty: "easy",
    week: 3,
    topic: "Array methods",
    importance: "high",
    explanation: `filter yeni bir dizi döndürür.

Örnek:
const sayilar = [1,2,3,4];
const cift = sayilar.filter(n => n % 2 === 0);

Sonuç: cift = [2,4]`
  },

  {
    q: "Spread operatörü (...) en doğru ne için kullanılır?",
    t: "mcq",
    o: [
      "HTML etiketini kapatmak için",
      "Dizi/nesne kopyalama ve birleştirme gibi işlemler için",
      "Sadece sayı yuvarlamak için",
      "CSS değişkeni tanımlamak için",
      "DOM’u otomatik yenilemek için"
    ],
    a: "Dizi/nesne kopyalama ve birleştirme gibi işlemler için",
    difficulty: "medium",
    week: 3,
    topic: "Spread operator",
    importance: "medium",
    explanation: `Örnek:
const a = [1,2];
const b = [...a, 3]; // [1,2,3]

Nesne:
const user2 = { ...user, role: "admin" }`
  },

  {
    q: "Destructuring ile bir nesneden alan çekmenin doğru örneği hangisidir?",
    t: "mcq",
    o: [
      "const {ad} = 'Yusuf'",
      "const [ad] = { ad: 'Yusuf' }",
      "const { ad } = { ad: 'Yusuf', yas: 28 }",
      "const (ad) = { ad: 'Yusuf' }",
      "const ad => { ad: 'Yusuf' }"
    ],
    a: "const { ad } = { ad: 'Yusuf', yas: 28 }",
    difficulty: "medium",
    week: 3,
    topic: "Destructuring",
    importance: "medium",
    explanation: `Destructuring:
const kisi = { ad: "Yusuf", yas: 28 };
const { ad, yas } = kisi;

Sonuç: ad = "Yusuf", yas = 28`
  },

  {
    q: "Default parametre (varsayılan değer) için doğru kullanım hangisidir?",
    t: "mcq",
    o: [
      "function selam(ad: 'Misafir') { ... }",
      "function selam(ad = 'Misafir') { ... }",
      "function selam('Misafir' = ad) { ... }",
      "function selam(ad == 'Misafir') { ... }",
      "function selam(ad => 'Misafir') { ... }"
    ],
    a: "function selam(ad = 'Misafir') { ... }",
    difficulty: "medium",
    week: 3,
    topic: "Default parameters",
    importance: "low",
    explanation: `Varsayılan parametre:
function selam(ad = "Misafir") {
  return "Merhaba " + ad;
}

selam() -> "Merhaba Misafir"`
  },

  {
    q: "setTimeout(fn, 1000) en doğru ne yapar?",
    t: "mcq",
    o: [
      "fn’i tam 1 saniye boyunca sürekli çalıştırır",
      "fn’i yaklaşık 1 saniye sonra bir kez çalıştırmak için zamanlar",
      "fn’i hemen çalıştırır ve sonra durdurur",
      "Sayfayı 1 saniye dondurur",
      "Sadece CSS animasyonu başlatır"
    ],
    a: "fn’i yaklaşık 1 saniye sonra bir kez çalıştırmak için zamanlar",
    difficulty: "easy",
    week: 3,
    topic: "Zamanlayıcılar",
    importance: "medium",
    explanation: `setTimeout gecikmeli tek çalıştırmadır.

Örnek:
setTimeout(() => console.log("1 sn geçti"), 1000);

Sonuç: Yaklaşık 1 saniye sonra log atar.`
  },

  {
    q: "Bir element seçmek için document.querySelector('.btn') en doğru ne döndürür?",
    t: "mcq",
    o: [
      "Tüm .btn elemanlarının listesi",
      "İlk eşleşen .btn elemanını (tek eleman) veya hiç yoksa null",
      "Her zaman bir Array döndürür",
      "Sadece id ile çalışır",
      "Sadece CSS dosyasını seçer"
    ],
    a: "İlk eşleşen .btn elemanını (tek eleman) veya hiç yoksa null",
    difficulty: "medium",
    week: 3,
    topic: "DOM seçim (querySelector)",
    importance: "high",
    explanation: `querySelector: ilk eşleşen elemanı verir.
querySelectorAll: tüm eşleşenleri verir.

Örnek:
const btn = document.querySelector(".btn");
Sonuç: ilk .btn seçilir.`
  },

  {
    q: "document.querySelectorAll('.item') ile seçilen sonuç tipi en doğru hangisidir?",
    t: "mcq",
    o: [
      "Tek bir element",
      "NodeList (liste benzeri), genelde forEach ile gezilebilir",
      "Sadece string",
      "Sadece number",
      "Boolean"
    ],
    a: "NodeList (liste benzeri), genelde forEach ile gezilebilir",
    difficulty: "hard",
    week: 3,
    topic: "NodeList",
    importance: "medium",
    explanation: `querySelectorAll NodeList döndürür.

Örnek:
const items = document.querySelectorAll(".item");
items.forEach(el => console.log(el.textContent));

Sonuç: Her item üzerinde dolaşılır.`
  },

  {
    q: "Event objesinde event.target ile event.currentTarget arasındaki en doğru fark hangisidir?",
    t: "mcq",
    o: [
      "İkisi her zaman aynı elemandır",
      "target: olayı başlatan en içteki eleman; currentTarget: listener’ın bağlı olduğu eleman",
      "currentTarget sadece mobilde çalışır",
      "target sadece form submit’te çalışır",
      "Hiçbiri DOM ile ilgili değildir"
    ],
    a: "target: olayı başlatan en içteki eleman; currentTarget: listener’ın bağlı olduğu eleman",
    difficulty: "hard",
    week: 3,
    topic: "Event hedefleri",
    importance: "high",
    explanation: `Event delegation mantığının temeli budur.

Örnek:
<ul> içinde <li> tıklanınca:
- target: tıklanan li
- currentTarget: listener ul’da ise ul

Sonuç: Hangi elemana tıklandığını doğru ayırt edersin.`
  },

  {
    q: "Event bubbling (olayın yukarı doğru yayılması) sırasında olayı durdurmak için hangi metot kullanılır?",
    t: "mcq",
    o: ["event.stopPropagation()", "event.stopDefault()", "event.break()", "event.freeze()", "event.disable()"],
    a: "event.stopPropagation()",
    difficulty: "hard",
    week: 3,
    topic: "Event propagation",
    importance: "medium",
    explanation: `stopPropagation, olayın üst elemanlara yayılmasını engeller.

Örnek:
btn.addEventListener("click", (e) => {
  e.stopPropagation();
});

Sonuç: Parent tıklama handler’ı tetiklenmeyebilir.`
  },

  {
    q: "localStorage ile sessionStorage arasındaki en doğru temel fark hangisidir?",
    t: "mcq",
    o: [
      "localStorage sadece 1 saniye tutar, sessionStorage sonsuza kadar",
      "localStorage tarayıcı kapanınca da kalabilir; sessionStorage sekme kapanınca silinir",
      "sessionStorage sadece mobilde çalışır",
      "localStorage sadece sayı saklar",
      "İkisi de aynı davranır"
    ],
    a: "localStorage tarayıcı kapanınca da kalabilir; sessionStorage sekme kapanınca silinir",
    difficulty: "medium",
    week: 3,
    topic: "Web Storage",
    importance: "medium",
    explanation: `localStorage: kalıcı depolama (kullanıcı silene kadar)
sessionStorage: sekme/oturum bazlı

Örnek kullanım:
localStorage.setItem("tema", "dark");
sessionStorage.setItem("gecici", "1");`
  }
];
