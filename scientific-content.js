bunu da güncel yapıya göre toparlayıp, olası yeni **AI sekmesi** için `aiIntro` içeriğini ekleyerek tam dosya hâlinde veriyorum. Eski metinlerin hiçbirini bozmadım, sadece üzerine koydum.

```js
// scientific-content.js
// Tüm bilimsel / açıklayıcı metinler burada tutulur
// data-content-key attribute'u ile ilgili sekmeye enjekte edilir.

(function () {
    'use strict';

    // 1) İçerik havuzu
    window.TestifyContent = {
        dashboardIntro: `
            <h2>Testify: Öğrenme Bilimi, Yapay Zekâ ve Ölçme-Değerlendirmenin Kesişim Noktası</h2>
            <p>
                Testify, sınav hazırlığını “ezber odaklı” tekrarlar olmaktan çıkarıp,
                <strong>öğrenme bilimi</strong>, <strong>bilişsel psikoloji</strong> ve
                <strong>ölçme-değerlendirme</strong> ilkeleriyle yeniden tasarlayan akıllı bir eğitim platformudur.
                Amaç yalnızca çok soru çözdürmek değil; <em>hangi soruları, ne zaman, hangi zorluk seviyesinde
                çözmen gerektiğini</em> veriye dayalı olarak belirleyebilmektir.
            </p>
            <p>
                Her çözdüğün test; başarı oranların, sürelerin ve hata desenlerinle birlikte bir veri noktası üretir.
                Testify bu verileri, zaman içinde senin için kişiselleştirilmiş öneriler, öğrenme yolları ve
                zorluk ayarlı testler üretmek için kullanmayı hedefler.
            </p>

            <div class="tab-intro-grid">
                <article class="intro-card">
                    <h3>Bilişsel Psikoloji Temelli</h3>
                    <p>
                        <strong>Geri getirme (retrieval practice)</strong> ve
                        <strong>dağıtılmış tekrar (spaced repetition)</strong> ilkelerine uygun olacak şekilde;
                        belirli aralıklarla benzer soru tipleri ve konularla tekrar karşılaşmanı sağlar.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Psikometri ve Ölçme-Değerlendirme</h3>
                    <p>
                        Sadece “doğru sayısına” değil; soruların zorluk düzeyine, ayırt ediciliğine ve
                        hata desenlerine odaklanan bir yaklaşım benimser.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Veri Bilimi & Yapay Zekâ</h3>
                    <p>
                        Her test, gelecekteki önerileri besleyen bir veri kaynağıdır. Amaç,
                        <em>“çok çalışıyor musun?”</em> sorusundan daha fazlasını ölçmek:
                        <strong>Doğru yerde, doğru yoğunlukta çalışıyor musun?</strong>
                    </p>
                </article>
            </div>
        `,

        journeyIntro: `
            <h2>YKS Yolculuğum: Zaman Yönetimi ve Bilişsel Yük Dengesi</h2>
            <p>
                YKS hazırlığı, yalnızca soru sayısına odaklanılan bir süreç değildir. Zaman yönetimi, bilişsel yükün
                dengeli dağıtılması ve konuların doğru sıralamayla ele alınması, uzun vadeli başarıyı belirleyen
                temel değişkenlerdir. “YKS Yolculuğum” alanı, bu süreci <strong>planlanabilir ve ölçülebilir</strong>
                hâle getirmeyi amaçlar.
            </p>

            <div class="tab-intro-grid yks-pill-row">
                <article class="intro-card yks-pill">
                    <h3>Sınav Tarihine Geri Sayım</h3>
                    <p>
                        Sınav tarihine kalan süre; haftalık ve günlük çalışma bloklarına bölünerek,
                        <strong>makro bir çalışma planı</strong> oluşturulur. Amaç, son haftalara yoğun birikim
                        taşımadan dengeli ilerlemektir.
                    </p>
                </article>
                <article class="intro-card yks-pill">
                    <h3>Alan Bazlı Önceliklendirme</h3>
                    <p>
                        Sayısal, Eşit Ağırlık, Sözel ve Dil alanlarında; soru dağılımlarına göre ağırlıklar belirlenir.
                        Böylece her alan, puana katkısı ve senin mevcut durumun dikkate alınarak önceliklendirilir.
                    </p>
                </article>
                <article class="intro-card yks-pill">
                    <h3>Günlük & Haftalık Hedefler</h3>
                    <p>
                        Çalışma planı oluşturulurken yalnızca soru sayısı değil, <strong>odaklanma süresi</strong>
                        ve <strong>zihinsel yorgunluk</strong> da hesaba katılır. Kısa ama yüksek odaklı
                        seanslar (ör. 25–30 dk), rastgele uzun maratonlardan genellikle daha verimlidir.
                    </p>
                </article>
            </div>
        `,

        testIntro: `
            <h2>Test Çöz: Uyarlanabilir Soru Seçimi ve Gerçek Sınav Simülasyonu</h2>
            <p>
                “Test Çöz” alanı, yalnızca soru listesi sunan basit bir ekran değil; ölçme-değerlendirme ilkelerine
                dikkat eden bir çalışma ortamıdır. Farklı zorluk seviyelerindeki sorular, sınav süresi ve hata analizleri,
                <strong>gerçek sınav koşullarına yakın bir deneyim</strong> oluşturmak için birlikte çalışır.
            </p>
            <div class="tab-intro-grid">
                <article class="intro-card">
                    <h3>Kademeli Zorluk</h3>
                    <p>
                        Kolay, orta ve zor soru tiplerinin birlikte kullanılması; hem temel konuları pekiştirmenizi
                        hem de ayırt edici sorularla seviyenizi yukarı çekmenizi hedefler.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Zaman Baskısını Yönetmek</h3>
                    <p>
                        Sınav modunda süre tutulması, sadece hız çalışması değil; aynı zamanda zaman baskısını ve
                        sınav kaygısını kontrollü bir ortamda deneyimleme imkânıdır.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Hata Desenlerini Görmek</h3>
                    <p>
                        İşlem hatası mı yapıyorsun, yoksa soruyu yanlış mı yorumluyorsun?
                        Performans verileri, hangi soru türlerinde zorlandığını göstererek çalışma planını
                        yeniden şekillendirmene yardımcı olur.
                    </p>
                </article>
            </div>
        `,

        createIntro: `
            <h2>Test Oluştur: Bilimsel Test Tasarımı İçin Akıllı Araçlar</h2>
            <p>
                Test oluşturmak, yalnızca soru yazmaktan ibaret değildir. Hangi sorunun hangi öğrenme çıktısını
                ölçtüğünü bilmek, <strong>sağlıklı bir ölçme-değerlendirme</strong> tasarımının temelidir.
                Testify, oluşturduğun testleri, soru köklerini ve seçenekleri bu bakış açısıyla düşünmeni teşvik eder.
            </p>
            <div class="tab-intro-grid">
                <article class="intro-card">
                    <h3>Kazanım Odaklı Sorular</h3>
                    <p>
                        Sorularını; bilgi, kavrama, uygulama, analiz gibi bilişsel düzeylere göre
                        kategorize ederek daha dengeli testler oluşturabilirsin.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Dokümandan Soru Üretimi</h3>
                    <p>
                        PDF, DOCX ve metin dosyalarını, pasif okuma materyali olmaktan çıkarıp
                        <strong>etkileşimli soru kaynağına</strong> dönüştürmeyi hedefleyen AI desteği ile
                        içeriklerini daha verimli kullanabilirsin.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Yeniden Kullanılabilir Test Bankası</h3>
                    <p>
                        Oluşturduğun her test, uzun vadede tekrar kullanılabilir, düzenlenebilir ve
                        yeni kombinasyonlarla yeniden sunulabilir bir soru bankası öğesidir.
                    </p>
                </article>
            </div>
        `,

        libraryIntro: `
            <h2>Kütüphanem: Kişisel Dijital Soru Bankan</h2>
            <p>
                “Kütüphanem”, sınav hazırlığını bir arşiv mantığıyla yönetmeni sağlar. Çözdüğün ve oluşturduğun
                testler tek bir yerde toplanır; böylece <strong>hangi gün hangi setleri çözdüğünü</strong>,
                hangi testlerde daha yüksek başarı elde ettiğini ve yeniden çözmek istediğin testleri kolayca
                takip edebilirsin.
            </p>
            <p>
                Bu yapı, ölçme-değerlendirme literatüründeki test formu yönetimi anlayışını bireysel seviyeye
                taşır ve uzun vadede ciddi bir zaman tasarrufu sunar.
            </p>
        `,

        notesIntro: `
            <h2>Notlarım: Hatırlamayı Kolaylaştıran Kişisel Bilgi Alanı</h2>
            <p>
                Bilgiyi sadece okumak yerine onu <strong>yazmak, özetlemek ve yeniden ifade etmek</strong>,
                kalıcılığı ciddi biçimde artırır. “Notlarım” bölümü; konu özetleri, formüller, sık yaptığın
                hatalar ve öğretmen notlarını sistemli biçimde saklaman için tasarlanmıştır.
            </p>
            <p>
                Bu notlara düzenli aralıklarla geri dönmek, <em>dağıtılmış tekrar (spaced repetition)</em> ilkesine
                uygun bir çalışma döngüsü kurmana yardımcı olur.
            </p>
        `,

        leaderboardIntro: `
            <h2>Liderlik Tablosu: Sağlıklı Rekabet ve İçsel Motivasyon Dengesi</h2>
            <p>
                Motivasyon psikolojisi, sosyal karşılaştırmanın doğru kullanıldığında performansı artırabileceğini
                söyler. Testify’ın liderlik tablosu, kimseyi sadece “yarıştırmak” için değil; çözülen test sayısı,
                toplanan XP ve başarı oranlarını şeffaf biçimde göstererek <strong>hedef belirlemeyi</strong>
                kolaylaştırmak için tasarlanmıştır.
            </p>
            <p>
                Böylece çalışma süreci, yalnız ve tekdüze bir uğraş olmaktan çıkar; küçük gruplarla challenge’lar,
                arkadaşlarla birlikte ilerleyebileceğin <strong>topluluk destekli</strong> bir öğrenme deneyimine dönüşür.
            </p>
        `,

        analysisIntro: `
            <h2>Performans Analizi: Öğrenme Sürecini Veriyle Yeniden Tasarlamak</h2>
            <p>
                Performans analizi, seni notlarla yargılayan bir tablo değil; <strong>eyleme dönük geri bildirim</strong>
                üreten bir panel olarak tasarlanmıştır. Ders bazlı ve konu bazlı performans haritaları, hangi alanlarda
                istikrarlı olduğun, hangilerinde dalgalanma yaşadığını gösterir.
            </p>
            <p>
                Belirli aralıklarla yapılan ölçümler, gelişim eğrini ortaya çıkarır. İlk denemelerde düşük olan netlerin,
                doğru bir çalışmayla nasıl yükseldiğini görmek; hem motivasyon hem de öz yeterlik duygusu açısından kritiktir.
            </p>
        `,

        // Yeni: Testify AI sekmesi için intro (data-content-key="aiIntro")
        aiIntro: `
            <h2>Testify AI: Akıllı İçerik ve Geri Bildirim Asistanı</h2>
            <p>
                Testify AI, klasik soru bankası mantığını bir adım öteye taşıyarak;
                <strong>soru üretimi</strong>, <strong>çözüm açıklamaları</strong> ve
                <strong>kişiselleştirilmiş çalışma önerileri</strong> sunan yapay zekâ destekli bir asistandır.
            </p>
            <p>
                Hazırlanmak istediğin konu başlığını, seviyeni ve sınav türünü seçtiğinde;
                Testify AI senin için özgün sorular, detaylı açıklamalar ve ek pekiştirme soruları üretebilir.
                Böylece yalnızca hazır soruları tüketen bir öğrenci değil, aktif olarak içerik üreten bir “çalışma tasarımcısı”
                hâline gelirsin.
            </p>
            <div class="tab-intro-grid">
                <article class="intro-card">
                    <h3>Akıllı Soru Üretimi</h3>
                    <p>
                        Belirlediğin kazanımlara uygun, seviyene göre ayarlanmış özgün sorular üretir;
                        böylece her oturumda taze ve hedefe yönelik içerikle karşılaşırsın.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Adım Adım Çözüm Açıklamaları</h3>
                    <p>
                        Yanlış yaptığın sorularda, sadece doğru cevabı göstermekle kalmaz;
                        <strong>neden yanlış yaptığını</strong> anlamanı sağlayan adım adım yorumlar sunar.
                    </p>
                </article>
                <article class="intro-card">
                    <h3>Kişiselleştirilmiş Öneriler</h3>
                    <p>
                        Performans verilerini ve yaptığın hataları analiz ederek;
                        hangi konuları tekrar etmen, hangi soru tiplerine ağırlık vermen gerektiğine dair
                        kısa, net ve uygulanabilir tavsiyeler üretir.
                    </p>
                </article>
            </div>
        `,

        settingsIntro: `
            <h2>Ayarlar: Kişiselleştirilmiş Deneyim ve Şeffaf Veri Yönetimi</h2>
            <p>
                Ayarlar alanı, Testify deneyimini kontrol ettiğin merkezdir. Tema tercihlerinden bildirimlere,
                kullanıcı bilgilerinden çalışma alışkanlıklarına kadar birçok detayı kendi ihtiyaçlarına göre
                düzenleyebilirsin.
            </p>
            <p>
                Aynı zamanda bu alan, veri gizliliği ve güvenliği konusundaki yaklaşımımızı da yansıtır.
                Sınav performansına ilişkin verilerin; yalnızca <strong>öğrenme sürecini iyileştirmek</strong>
                amacıyla ele alınır ve şeffaf politikalar çerçevesinde yönetilir.
            </p>
        `
    };

    // 2) DOM'a enjekte eden küçük helper
    function applyTestifyContent() {
        const map = window.TestifyContent || {};
        const nodes = document.querySelectorAll('[data-content-key]');
        nodes.forEach((el) => {
            const key = el.getAttribute('data-content-key');
            if (!key) return;
            if (!map[key]) return;
            el.innerHTML = map[key];
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyTestifyContent);
    } else {
        applyTestifyContent();
    }
})();
```
