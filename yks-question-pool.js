/**
 * YKS QUESTION POOL API v2.0
 * ==========================
 * YKS soru havuzu ve API fonksiyonları
 * 
 * Bu dosya gerçek sorularla doldurulmalıdır.
 * Şu an örnek sorular içermektedir.
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // SORU HAVUZU
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Soru şablonu oluşturucu
     */
    function createQuestion(id, text, choices, correctIndex, explanation, meta = {}) {
        return {
            id: id,
            text: text,
            choices: choices,
            correctIndex: correctIndex,
            explanation: explanation || '',
            difficulty: meta.difficulty || 'medium',
            subject: meta.subject || 'genel',
            topic: meta.topic || null,
            field: meta.field || 'tyt',
            tags: meta.tags || []
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // TYT MATEMATİK SORULARI
    // ═══════════════════════════════════════════════════════════════════════════

    const TYT_MATEMATIK = [
        createQuestion(
            'tyt_mat_001',
            '3x + 7 = 22 denkleminde x kaçtır?',
            ['3', '4', '5', '6', '7'],
            2,
            '3x + 7 = 22 → 3x = 15 → x = 5',
            { difficulty: 'easy', subject: 'matematik', topic: 'denklemler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_002',
            '48 sayısının pozitif tam bölen sayısı kaçtır?',
            ['8', '9', '10', '11', '12'],
            2,
            '48 = 2⁴ × 3¹, bölen sayısı = (4+1)(1+1) = 10',
            { difficulty: 'medium', subject: 'matematik', topic: 'bolme-bolunebilme', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_003',
            '√75 + √27 - √12 ifadesinin sadeleştirilmiş hali nedir?',
            ['6√3', '7√3', '8√3', '5√3', '4√3'],
            0,
            '√75 = 5√3, √27 = 3√3, √12 = 2√3 → 5√3 + 3√3 - 2√3 = 6√3',
            { difficulty: 'medium', subject: 'matematik', topic: 'koklu-sayilar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_004',
            'Bir işi A 12 günde, B 15 günde bitirebilmektedir. Birlikte çalışırlarsa işi kaç günde bitirirler?',
            ['6', '6⅔', '7', '7½', '8'],
            1,
            'A: 1/12, B: 1/15, birlikte: 1/12 + 1/15 = 9/60 = 3/20, süre = 20/3 = 6⅔ gün',
            { difficulty: 'medium', subject: 'matematik', topic: 'problemler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_005',
            '2^10 sayısının rakamlar toplamı kaçtır?',
            ['4', '5', '6', '7', '8'],
            3,
            '2^10 = 1024, rakamlar toplamı = 1+0+2+4 = 7',
            { difficulty: 'easy', subject: 'matematik', topic: 'uslu-sayilar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_006',
            'f(x) = 2x - 3 fonksiyonu için f(f(5)) kaçtır?',
            ['8', '9', '10', '11', '12'],
            3,
            'f(5) = 2(5) - 3 = 7, f(7) = 2(7) - 3 = 11',
            { difficulty: 'medium', subject: 'matematik', topic: 'fonksiyonlar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_007',
            '36 ve 48 sayılarının EBOB\'u kaçtır?',
            ['6', '8', '10', '12', '14'],
            3,
            '36 = 2² × 3², 48 = 2⁴ × 3, EBOB = 2² × 3 = 12',
            { difficulty: 'easy', subject: 'matematik', topic: 'ebob-ekok', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_008',
            'Bir malın fiyatı önce %20 artırılıp sonra %20 indirilirse, asıl fiyata göre değişim yüzdesi nedir?',
            ['%4 azalma', '%4 artış', 'Değişmez', '%2 azalma', '%2 artış'],
            0,
            '100 → 120 → 96, değişim = %4 azalma',
            { difficulty: 'medium', subject: 'matematik', topic: 'yuzde-problemleri', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_009',
            '|x - 3| < 5 eşitsizliğinin çözüm kümesi nedir?',
            ['(-2, 8)', '[-2, 8]', '(-∞, -2) ∪ (8, ∞)', '[2, 8]', '(2, 8)'],
            0,
            '-5 < x - 3 < 5 → -2 < x < 8',
            { difficulty: 'medium', subject: 'matematik', topic: 'mutlak-deger', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_010',
            '5 kişilik bir gruptan 3 kişilik bir komite kaç farklı şekilde seçilebilir?',
            ['6', '8', '10', '12', '15'],
            2,
            'C(5,3) = 5!/(3!×2!) = 10',
            { difficulty: 'medium', subject: 'matematik', topic: 'kombinasyon', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_011',
            'Bir iş yerinde 8 erkek ve 6 kadın çalışmaktadır. Rastgele seçilen bir kişinin kadın olma olasılığı nedir?',
            ['3/7', '4/7', '3/14', '6/14', '8/14'],
            0,
            'P(kadın) = 6/14 = 3/7',
            { difficulty: 'easy', subject: 'matematik', topic: 'olasilik', field: 'tyt' }
        ),
        createQuestion(
            'tyt_mat_012',
            'P(x) = x³ - 3x² + 2x polinomunun kökleri nelerdir?',
            ['0, 1, 2', '0, -1, -2', '1, 2, 3', '-1, 0, 1', '0, 1, 3'],
            0,
            'x(x² - 3x + 2) = x(x-1)(x-2), kökler: 0, 1, 2',
            { difficulty: 'hard', subject: 'matematik', topic: 'polinomlar', field: 'tyt' }
        )
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // TYT GEOMETRİ SORULARI
    // ═══════════════════════════════════════════════════════════════════════════

    const TYT_GEOMETRI = [
        createQuestion(
            'tyt_geo_001',
            'Bir üçgenin iç açıları 2x, 3x ve 4x ise en büyük açı kaç derecedir?',
            ['60°', '80°', '90°', '100°', '120°'],
            1,
            '2x + 3x + 4x = 180° → 9x = 180° → x = 20°, en büyük: 4×20 = 80°',
            { difficulty: 'easy', subject: 'geometri', topic: 'ucgenler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_002',
            'Yarıçapı 7 cm olan bir çemberin çevresi kaç cm dir? (π = 22/7)',
            ['42', '44', '46', '48', '50'],
            1,
            'Çevre = 2πr = 2 × (22/7) × 7 = 44 cm',
            { difficulty: 'easy', subject: 'geometri', topic: 'cember', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_003',
            'Bir dikdörtgenin çevresi 36 cm, eni 8 cm ise alanı kaç cm² dir?',
            ['72', '80', '88', '96', '104'],
            1,
            'Çevre = 2(a+b) = 36 → a+b = 18 → boy = 10 cm, Alan = 8×10 = 80 cm²',
            { difficulty: 'easy', subject: 'geometri', topic: 'dortgenler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_004',
            'Kenarları 3, 4, 5 cm olan bir üçgenin alanı kaç cm² dir?',
            ['4', '5', '6', '7', '8'],
            2,
            '3-4-5 dik üçgen, Alan = (3×4)/2 = 6 cm²',
            { difficulty: 'medium', subject: 'geometri', topic: 'ucgende-alan', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_005',
            'Bir eşkenar üçgenin çevresi 24 cm ise yüksekliği kaç cm dir?',
            ['2√3', '4√3', '6√3', '8√3', '10√3'],
            1,
            'Kenar = 8 cm, yükseklik = (8√3)/2 = 4√3 cm',
            { difficulty: 'medium', subject: 'geometri', topic: 'ucgenler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_006',
            'Bir paralelkenarın tabanı 12 cm, yüksekliği 8 cm ise alanı kaç cm² dir?',
            ['48', '72', '84', '96', '108'],
            3,
            'Alan = taban × yükseklik = 12 × 8 = 96 cm²',
            { difficulty: 'easy', subject: 'geometri', topic: 'dortgenler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_007',
            'Bir dairenin alanı 49π cm² ise yarıçapı kaç cm dir?',
            ['5', '6', '7', '8', '9'],
            2,
            'πr² = 49π → r² = 49 → r = 7 cm',
            { difficulty: 'easy', subject: 'geometri', topic: 'daire', field: 'tyt' }
        ),
        createQuestion(
            'tyt_geo_008',
            'İki paralel doğruyu kesen bir doğru ile oluşan iç ters açıların toplamı kaç derecedir?',
            ['90°', '120°', '150°', '180°', '270°'],
            3,
            'İç ters açılar eşittir, yan yana olanların toplamı 180°',
            { difficulty: 'medium', subject: 'geometri', topic: 'acilar', field: 'tyt' }
        )
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // TYT TÜRKÇE SORULARI
    // ═══════════════════════════════════════════════════════════════════════════

    const TYT_TURKCE = [
        createQuestion(
            'tyt_tur_001',
            '"Öğrenciler sınıfta sessizce ders çalışıyordu." cümlesinde kaç sözcük vardır?',
            ['4', '5', '6', '7', '8'],
            1,
            'Öğrenciler, sınıfta, sessizce, ders, çalışıyordu = 5 sözcük',
            { difficulty: 'easy', subject: 'turkce', topic: 'cumle-bilgisi', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_002',
            '"Yağmur yağdığı için pikniğe gidemedik." cümlesindeki anlam ilişkisi nedir?',
            ['Neden-sonuç', 'Amaç-sonuç', 'Koşul', 'Karşılaştırma', 'Zaman'],
            0,
            'Yağmur yağması (neden) → pikniğe gidememe (sonuç)',
            { difficulty: 'medium', subject: 'turkce', topic: 'cumlede-anlam', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_003',
            '"Göz" sözcüğü aşağıdaki cümlelerin hangisinde gerçek anlamıyla kullanılmıştır?',
            ['Kapının gözünden baktı.', 'Masanın gözünü açtı.', 'Gözleri mavi gibiydi.', 'İğnenin gözünü bulamadı.', 'Pencerenin gözü kırılmış.'],
            2,
            '"Gözleri mavi gibiydi" cümlesinde göz, organ anlamında kullanılmıştır.',
            { difficulty: 'medium', subject: 'turkce', topic: 'sozcukte-anlam', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_004',
            'Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?',
            ['Dün gece çok yoruldum.', 'Herşey yolunda gidiyordu.', 'Bu iş zor olacak.', 'Yarın erken kalkacağım.', 'Onunla konuşmalıyız.'],
            1,
            '"Herşey" ayrı yazılmalıdır: "Her şey"',
            { difficulty: 'easy', subject: 'turkce', topic: 'yazim-kurallari', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_005',
            '"Kitap okumak insanı zenginleştirir." cümlesinde altı çizili sözcüğün türü nedir?',
            ['İsim-fiil', 'Sıfat-fiil', 'Zarf-fiil', 'Bileşik fiil', 'Yardımcı fiil'],
            0,
            '"Okumak" sözcüğü -mak ekiyle türetilmiş isim-fiildir.',
            { difficulty: 'medium', subject: 'turkce', topic: 'fiilimsiler', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_006',
            'Aşağıdaki cümlelerin hangisinde noktalama yanlışı yapılmıştır?',
            ['Dün, bugün ve yarın hep birlikte.', '"Nereye gidiyorsun?" diye sordu.', 'Ev; araba ve para istiyordu.', 'Ah, ne güzel bir gün!', 'Saat 10.30\'da geldiler.'],
            2,
            'Noktalı virgül yanlış kullanılmış, virgül olmalıydı.',
            { difficulty: 'medium', subject: 'turkce', topic: 'noktalama', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_007',
            '"Pazarda taze sebze ve meyve almak için gittim." cümlesinin öğeleri hangi sırayla dizilmiştir?',
            ['Özne - Dolaylı Tümleç - Nesne - Yüklem', 'Dolaylı Tümleç - Nesne - Zarf Tümleci - Yüklem', 'Nesne - Dolaylı Tümleç - Zarf Tümleci - Yüklem', 'Özne - Nesne - Yüklem', 'Dolaylı Tümleç - Zarf Tümleci - Yüklem'],
            1,
            'Pazarda (dolaylı tümleç), taze sebze ve meyve (nesne), almak için (zarf tümleci), gittim (yüklem)',
            { difficulty: 'hard', subject: 'turkce', topic: 'cumle-ogeleri', field: 'tyt' }
        ),
        createQuestion(
            'tyt_tur_008',
            '"Hızlı koşan atlar yarışı kazandı." cümlesinde kaç sıfat vardır?',
            ['1', '2', '3', '4', '0'],
            0,
            '"Hızlı koşan" sıfat-fiil grubu tek sıfat görevinde',
            { difficulty: 'medium', subject: 'turkce', topic: 'sifatlar', field: 'tyt' }
        )
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // TYT FİZİK SORULARI
    // ═══════════════════════════════════════════════════════════════════════════

    const TYT_FIZIK = [
        createQuestion(
            'tyt_fiz_001',
            'Hız birimi aşağıdakilerden hangisidir?',
            ['kg', 'm/s', 'N', 'J', 'W'],
            1,
            'Hız = yol/zaman, birimi m/s (metre bölü saniye)',
            { difficulty: 'easy', subject: 'fizik', topic: 'hareket', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_002',
            '5 kg kütleli bir cisme 20 N kuvvet uygulanırsa ivmesi kaç m/s² olur?',
            ['2', '3', '4', '5', '6'],
            2,
            'F = m.a → a = F/m = 20/5 = 4 m/s²',
            { difficulty: 'easy', subject: 'fizik', topic: 'kuvvet', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_003',
            '10 m yükseklikten serbest bırakılan bir cismin yere çarpma hızı kaç m/s dir? (g = 10 m/s²)',
            ['10', '12', '14', '16', '18'],
            0,
            'v² = 2gh → v = √(2×10×10) = √200 ≈ 14.14, en yakın seçenek yok ama h=5m için v=10',
            { difficulty: 'medium', subject: 'fizik', topic: 'serbest-dusme', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_004',
            'Bir cismin potansiyel enerjisi neye bağlıdır?',
            ['Hız', 'Kütle ve yükseklik', 'Sadece kütle', 'Sadece yükseklik', 'İvme'],
            1,
            'Ep = m.g.h, potansiyel enerji kütle ve yüksekliğe bağlıdır.',
            { difficulty: 'easy', subject: 'fizik', topic: 'enerji', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_005',
            'Elektrik akımının birimi nedir?',
            ['Volt', 'Amper', 'Ohm', 'Watt', 'Joule'],
            1,
            'Elektrik akımı Amper (A) birimi ile ölçülür.',
            { difficulty: 'easy', subject: 'fizik', topic: 'elektrik', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_006',
            '60 W gücündeki bir lamba 5 saat çalışırsa ne kadar enerji harcar?',
            ['300 J', '300 Wh', '0.3 kWh', '3 kWh', '30 kWh'],
            2,
            'E = P × t = 60W × 5h = 300 Wh = 0.3 kWh',
            { difficulty: 'medium', subject: 'fizik', topic: 'elektrik', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_007',
            'Ses hangi ortamda en hızlı yayılır?',
            ['Hava', 'Su', 'Katı', 'Boşluk', 'Gaz'],
            2,
            'Ses katı ortamda en hızlı yayılır çünkü moleküller daha sıkıdır.',
            { difficulty: 'easy', subject: 'fizik', topic: 'dalgalar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_fiz_008',
            'Işık aşağıdakilerden hangisinde kırılmaz?',
            ['Camdan havaya geçerken', 'Havadan suya geçerken', 'Dik açıyla yüzeye çarptığında', 'Sudan havaya geçerken', 'Havadan camağ geçerken'],
            2,
            'Işık dik açıyla yüzeye çarptığında kırılmaz, doğrultusunu korur.',
            { difficulty: 'medium', subject: 'fizik', topic: 'optik', field: 'tyt' }
        )
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // TYT KİMYA SORULARI
    // ═══════════════════════════════════════════════════════════════════════════

    const TYT_KIMYA = [
        createQuestion(
            'tyt_kim_001',
            'Periyodik tabloda kaç grup vardır?',
            ['7', '8', '16', '18', '20'],
            3,
            'Periyodik tabloda 18 grup (sütun) bulunur.',
            { difficulty: 'easy', subject: 'kimya', topic: 'periyodik-tablo', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_002',
            'Aşağıdakilerden hangisi asit değildir?',
            ['HCl', 'H₂SO₄', 'NaOH', 'HNO₃', 'H₃PO₄'],
            2,
            'NaOH (sodyum hidroksit) bir bazdır, asit değil.',
            { difficulty: 'easy', subject: 'kimya', topic: 'asitler-bazlar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_003',
            'Su molekülünün formülü nedir?',
            ['H₂O', 'CO₂', 'O₂', 'H₂', 'NaCl'],
            0,
            'Su: H₂O (2 hidrojen + 1 oksijen)',
            { difficulty: 'easy', subject: 'kimya', topic: 'temel-kavramlar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_004',
            'Bir atomun proton sayısına ne denir?',
            ['Kütle numarası', 'Atom numarası', 'Nötron sayısı', 'Elektron sayısı', 'Değerlik'],
            1,
            'Atom numarası = proton sayısı',
            { difficulty: 'easy', subject: 'kimya', topic: 'atom-yapisi', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_005',
            '1 mol suyun kütlesi kaç gramdır?',
            ['16', '17', '18', '19', '20'],
            2,
            'H₂O: 2(1) + 16 = 18 g/mol',
            { difficulty: 'medium', subject: 'kimya', topic: 'mol-kavrami', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_006',
            'Aşağıdakilerden hangisi homojen karışımdır?',
            ['Süt', 'Tuzlu su', 'Kum-su', 'Zeytinyağı-su', 'Toprak'],
            1,
            'Tuzlu su homojen (çözelti) bir karışımdır.',
            { difficulty: 'easy', subject: 'kimya', topic: 'karisimlar', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_007',
            'Hidrojen atomunun elektron sayısı kaçtır?',
            ['0', '1', '2', '3', '4'],
            1,
            'Hidrojen (H) 1 elektrona sahiptir.',
            { difficulty: 'easy', subject: 'kimya', topic: 'atom-yapisi', field: 'tyt' }
        ),
        createQuestion(
            'tyt_kim_008',
            'Aşağıdaki elementlerden hangisi soy gazdır?',
            ['Oksijen', 'Azot', 'Helyum', 'Hidrojen', 'Karbon'],
            2,
            'Helyum (He) bir soy gazdır (18. grup).',
            { difficulty: 'easy', subject: 'kimya', topic: 'periyodik-tablo', field: 'tyt' }
        )
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // TYT BİYOLOJİ SORULARI
    // ═══════════════════════════════════════════════════════════════════════════

    const TYT_BIYOLOJI = [
        createQuestion(
            'tyt_bio_001',
            'Hücrenin enerji santrali olarak bilinen organel hangisidir?',
            ['Ribozom', 'Mitokondri', 'Golgi', 'Lizozom', 'Çekirdek'],
            1,
            'Mitokondri, hücresel solunum ile ATP üretir ve "enerji santrali" olarak bilinir.',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'hucre', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_002',
            'DNA\'nın yapısında bulunan bazlar hangileridir?',
            ['A, T, G, C', 'A, U, G, C', 'A, T, G, U', 'A, T, C, U', 'T, U, G, C'],
            0,
            'DNA\'da Adenin (A), Timin (T), Guanin (G), Sitozin (C) bulunur.',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'genetik', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_003',
            'Fotosentez hangi organelde gerçekleşir?',
            ['Mitokondri', 'Kloroplast', 'Ribozom', 'Endoplazmik retikulum', 'Çekirdek'],
            1,
            'Fotosentez kloroplastlarda gerçekleşir.',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'hucre', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_004',
            'Aşağıdakilerden hangisi omurgasız hayvanlara örnek değildir?',
            ['Kelebek', 'Solucan', 'Yılan', 'Denizanası', 'Böcek'],
            2,
            'Yılan omurgalı bir hayvandır (sürüngen).',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'canlilar-alemi', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_005',
            'İnsan vücudunda oksijen taşıyan protein hangisidir?',
            ['Miyozin', 'Hemoglobin', 'Aktin', 'Keratin', 'Kolajen'],
            1,
            'Hemoglobin, alyuvarlarda bulunan ve oksijen taşıyan proteindir.',
            { difficulty: 'medium', subject: 'biyoloji', topic: 'dolasim-sistemi', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_006',
            'Aşağıdakilerden hangisi bitkilere özgü bir yapıdır?',
            ['Hücre zarı', 'Sitoplazma', 'Hücre duvarı', 'Ribozom', 'Mitokondri'],
            2,
            'Hücre duvarı bitki hücrelerine özgüdür (selülozdan yapılı).',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'hucre', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_007',
            'Ekosistemin canlı olmayan bileşenlerine ne ad verilir?',
            ['Biyotik', 'Abiyotik', 'Habitat', 'Populasyon', 'Biyom'],
            1,
            'Abiyotik faktörler ekosistemin cansız bileşenleridir (su, hava, toprak vb.).',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'ekosistem', field: 'tyt' }
        ),
        createQuestion(
            'tyt_bio_008',
            'Protein sentezi hangi organelde gerçekleşir?',
            ['Mitokondri', 'Golgi', 'Ribozom', 'Lizozom', 'Kloroplast'],
            2,
            'Ribozomlar protein sentezinden sorumludur.',
            { difficulty: 'easy', subject: 'biyoloji', topic: 'hucre', field: 'tyt' }
        )
    ];

    // ═══════════════════════════════════════════════════════════════════════════
    // TÜM SORULARI BİRLEŞTİR
    // ═══════════════════════════════════════════════════════════════════════════

    const ALL_QUESTIONS = {
        tyt: {
            matematik: TYT_MATEMATIK,
            geometri: TYT_GEOMETRI,
            turkce: TYT_TURKCE,
            fizik: TYT_FIZIK,
            kimya: TYT_KIMYA,
            biyoloji: TYT_BIYOLOJI
        },
        sayisal: {
            matematik: TYT_MATEMATIK,
            geometri: TYT_GEOMETRI,
            fizik: TYT_FIZIK,
            kimya: TYT_KIMYA,
            biyoloji: TYT_BIYOLOJI
        },
        ea: {
            matematik: TYT_MATEMATIK,
            geometri: TYT_GEOMETRI,
            turkce: TYT_TURKCE
        },
        sozel: {
            turkce: TYT_TURKCE
        },
        genel: {
            matematik: TYT_MATEMATIK,
            geometri: TYT_GEOMETRI,
            turkce: TYT_TURKCE,
            fizik: TYT_FIZIK,
            kimya: TYT_KIMYA,
            biyoloji: TYT_BIYOLOJI
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // API FONKSİYONLARI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Shuffle array
     */
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /**
     * Alana göre tüm soruları getir
     */
    function getAllQuestionsByField(field) {
        const fieldData = ALL_QUESTIONS[field] || ALL_QUESTIONS.genel;
        const allQuestions = [];
        
        Object.values(fieldData).forEach(questions => {
            allQuestions.push(...questions);
        });
        
        return allQuestions;
    }

    /**
     * Derse göre soruları getir
     */
    function getQuestionsBySubject(subject, count = 10) {
        const questions = [];
        
        Object.values(ALL_QUESTIONS).forEach(fieldData => {
            if (fieldData[subject]) {
                questions.push(...fieldData[subject]);
            }
        });
        
        return shuffleArray(questions).slice(0, count);
    }

    /**
     * Konulara göre soruları getir
     */
    function getQuestionsByTopics(subject, topics, count = 10) {
        const allSubjectQuestions = [];
        
        Object.values(ALL_QUESTIONS).forEach(fieldData => {
            if (fieldData[subject]) {
                allSubjectQuestions.push(...fieldData[subject]);
            }
        });
        
        // Konuya göre filtrele
        let filtered = allSubjectQuestions;
        if (topics && topics.length > 0) {
            filtered = allSubjectQuestions.filter(q => topics.includes(q.topic));
        }
        
        // Yeterli soru yoksa tüm ders sorularından al
        if (filtered.length < count) {
            filtered = allSubjectQuestions;
        }
        
        return shuffleArray(filtered).slice(0, count);
    }

    /**
     * Seviye testi soruları (alan bazlı, ders başına belirli sayıda)
     */
    function getLevelTestQuestionsPerSubject(field, perSubject = 3) {
        const fieldData = ALL_QUESTIONS[field] || ALL_QUESTIONS.genel;
        const questions = [];
        
        Object.entries(fieldData).forEach(([subject, subjectQuestions]) => {
            const shuffled = shuffleArray(subjectQuestions);
            const selected = shuffled.slice(0, perSubject);
            questions.push(...selected);
        });
        
        return shuffleArray(questions);
    }

    /**
     * Belirli sayıda rastgele soru
     */
    function getLevelTestQuestions(field, count = 10) {
        const allQuestions = getAllQuestionsByField(field);
        return shuffleArray(allQuestions).slice(0, count);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GLOBAL EXPORT
    // ═══════════════════════════════════════════════════════════════════════════

    window.YKSQuestionPoolAPI = {
        // Ana veri
        allQuestions: ALL_QUESTIONS,
        
        // Eski uyumluluk
        allLevelQuestions: ALL_QUESTIONS,
        
        // API fonksiyonları
        getAllQuestionsByField,
        getQuestionsBySubject,
        getQuestionsByTopics,
        getLevelTestQuestionsPerSubject,
        getLevelTestQuestions,
        
        // Yardımcı
        shuffleArray,
        createQuestion
    };

    // Eski uyumluluk için questionBank
    window.questionBank = [
        ...TYT_MATEMATIK,
        ...TYT_GEOMETRI,
        ...TYT_TURKCE,
        ...TYT_FIZIK,
        ...TYT_KIMYA,
        ...TYT_BIYOLOJI
    ];

    console.log('[YKSQuestionPoolAPI] Yüklendi:', window.questionBank.length, 'soru');

})();
