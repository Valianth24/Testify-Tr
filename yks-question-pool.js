// yks-question-pool.js
(function () {
    'use strict';

    function shuffle(array) {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // Buraya istediğin kadar soru ekleyebilirsin.
    // field: "sayisal", "ea", "sozel", "dil", "genel"
    // subject: ilgili ders (matematik, turkce, fizik, vs.)
    const LEVEL_TEST_QUESTIONS = {
        genel: [
            {
                id: 'genel_1',
                field: 'genel',
                subject: 'turkce',
                text: 'Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?',
                choices: [
                    'Bu sene YKS’ye çok iyi hazırlandım.',
                    'Bugün ki denemede Türkçe netlerim arttı.',
                    'Planlı çalışmak başarıyı arttırır.',
                    'Her gün en az bir paragraf denemesi çözüyorum.'
                ],
                correctIndex: 1,
                explanation: '"Bugünkü" bitişik yazılmalıdır. Doğru kullanım: "Bugünkü denemede..."'
            },
            {
                id: 'genel_2',
                field: 'genel',
                subject: 'matematik',
                text: 'Bir sayı 4 ile çarpılıp 8 artırıldığında sonuç 40 oluyorsa, sayının kendisi kaçtır?',
                choices: ['6', '7', '8', '9'],
                correctIndex: 2,
                explanation: '4x + 8 = 40 ⇒ 4x = 32 ⇒ x = 8.'
            },
            {
                id: 'genel_3',
                field: 'genel',
                subject: 'fizik',
                text: 'Aşağıdakilerden hangisi birim zamanda yapılan işe karşılık gelir?',
                choices: ['Kuvvet', 'Enerji', 'Güç', 'Momentum'],
                correctIndex: 2,
                explanation: 'Güç = İş / Zaman tanımı gereği birim zamanda yapılan iştir.'
            }
        ],

        // SAYISAL
        sayisal: [
            // MATEMATİK (en az 3 soru örneği)
            {
                id: 'say_mat_1',
                field: 'sayisal',
                subject: 'matematik',
                text: 'Bir bilgisayarın işlemcisi saniyede 3 milyar işlem yapıyorsa, bu hız kaç GHz olarak ifade edilir?',
                choices: ['0,3 GHz', '3 GHz', '30 GHz', '300 GHz'],
                correctIndex: 1,
                explanation: '1 GHz = saniyede 1 milyar işlem ⇒ 3 milyar işlem = 3 GHz.'
            },
            {
                id: 'say_mat_2',
                field: 'sayisal',
                subject: 'matematik',
                text: '2x - 5 = 9 denkleminde x kaçtır?',
                choices: ['5', '6', '7', '8'],
                correctIndex: 2,
                explanation: '2x - 5 = 9 ⇒ 2x = 14 ⇒ x = 7.'
            },
            {
                id: 'say_mat_3',
                field: 'sayisal',
                subject: 'matematik',
                text: 'Bir dikdörtgenin kısa kenarı 4 cm, uzun kenarı 9 cm ise çevresi kaç cm’dir?',
                choices: ['13', '18', '26', '36'],
                correctIndex: 2,
                explanation: 'Çevre = 2(4+9) = 26 cm.'
            },

            // GEOMETRİ
            {
                id: 'say_geo_1',
                field: 'sayisal',
                subject: 'geometri',
                text: 'Bir üçgenin iç açılarından ikisi 40° ve 60° ise üçüncü iç açı kaç derecedir?',
                choices: ['60°', '70°', '80°', '90°'],
                correctIndex: 2,
                explanation: 'İç açılar toplamı 180° ⇒ 40 + 60 + x = 180 ⇒ x = 80°.'
            },
            {
                id: 'say_geo_2',
                field: 'sayisal',
                subject: 'geometri',
                text: 'Yarıçapı 3 cm olan bir dairenin alanı yaklaşık kaç cm²’dir? (π ≈ 3)',
                choices: ['9', '18', '27', '36'],
                correctIndex: 2,
                explanation: 'A = πr² ≈ 3×9 = 27 cm².'
            },

            // FİZİK
            {
                id: 'say_fiz_1',
                field: 'sayisal',
                subject: 'fizik',
                text: 'Aşağıdakilerden hangisi temel büyüklüktür?',
                choices: ['Hız', 'Kütle', 'Kuvvet', 'İş'],
                correctIndex: 1,
                explanation: 'Kütle temel büyüklüktür, diğerleri türetilmiştir.'
            },
            {
                id: 'say_fiz_2',
                field: 'sayisal',
                subject: 'fizik',
                text: 'Yerçekimi ivmesi yaklaşık kaç m/s²’dir?',
                choices: ['2', '4,9', '9,8', '12'],
                correctIndex: 2,
                explanation: 'g ≈ 9,8 m/s² olarak alınır.'
            },

            // KİMYA
            {
                id: 'say_kim_1',
                field: 'sayisal',
                subject: 'kimya',
                text: 'Su molekülünün (H₂O) molekül kütlesi yaklaşık kaçtır? (H=1, O=16)',
                choices: ['16', '17', '18', '20'],
                correctIndex: 2,
                explanation: '2×1 + 16 = 18.'
            },
            {
                id: 'say_kim_2',
                field: 'sayisal',
                subject: 'kimya',
                text: 'Aşağıdakilerden hangisi homojen karışımdır?',
                choices: ['Tebeşir tozu-su', 'Tuzlu su', 'Yağ-su', 'Kum-su'],
                correctIndex: 1,
                explanation: 'Tuzlu su çözeltisi homojendir.'
            },

            // BİYOLOJİ
            {
                id: 'say_bio_1',
                field: 'sayisal',
                subject: 'biyoloji',
                text: 'Fotosentez olayı hücrenin hangi organelinde gerçekleşir?',
                choices: ['Mitokondri', 'Ribozom', 'Kloroplast', 'Lizozom'],
                correctIndex: 2,
                explanation: 'Fotosentez kloroplastta gerçekleşir.'
            },
            {
                id: 'say_bio_2',
                field: 'sayisal',
                subject: 'biyoloji',
                text: 'Aşağıdakilerden hangisi canlıların ortak özelliği değildir?',
                choices: ['Solunum yapmak', 'Hareket etmek', 'Üremek', 'Düşünmek'],
                correctIndex: 3,
                explanation: 'Düşünmek sadece bazı canlılara özgüdür, ortak bir özellik değildir.'
            }
        ],

        // EŞİT AĞIRLIK
        ea: [
            {
                id: 'ea_mat_1',
                field: 'ea',
                subject: 'matematik',
                text: 'Bir ürün önce %20 zamlanıp sonra %20 indirim görürse, son fiyat başlangıca göre nasıl değişir?',
                choices: ['%4 artar', 'Değişmez', '%4 azalır', '%20 azalır'],
                correctIndex: 2,
                explanation: '1,2 × 0,8 = 0,96 ⇒ fiyat %4 azalır.'
            },
            {
                id: 'ea_mat_2',
                field: 'ea',
                subject: 'matematik',
                text: 'x + 3 = 10 ise 2x kaçtır?',
                choices: ['10', '12', '14', '16'],
                correctIndex: 2,
                explanation: 'x = 7 ⇒ 2x = 14.'
            },

            {
                id: 'ea_turk_1',
                field: 'ea',
                subject: 'turkce',
                text: 'Aşağıdakilerden hangisi nesnel bir yargıdır?',
                choices: [
                    'Bu kitap çok sürükleyici.',
                    'Türkiye’nin başkenti Ankara’dır.',
                    'Bu film bence sıkıcı.',
                    'Mavi en güzel renktir.'
                ],
                correctIndex: 1,
                explanation: '“Türkiye’nin başkenti Ankara’dır.” ölçülebilir ve kanıtlanabilir.'
            },

            {
                id: 'ea_tar_1',
                field: 'ea',
                subject: 'tarih',
                text: 'Kurtuluş Savaşı’nı başlatan ilk kongre aşağıdakilerden hangisidir?',
                choices: ['Erzurum', 'Sivas', 'Amasya', 'Balıkesir'],
                correctIndex: 0,
                explanation: 'İlk ulusal kongre Erzurum Kongresi’dir.'
            }
        ],

        // SÖZEL
        sozel: [
            {
                id: 'soz_turk_1',
                field: 'sozel',
                subject: 'turkce',
                text: '“Bütün gün boyunca kitap okudum.” cümlesinde hangi öge yoktur?',
                choices: ['Özne', 'Yüklem', 'Dolaylı tümleç', 'Zarf tümleci'],
                correctIndex: 2,
                explanation: 'Dolaylı tümleç (yer tamlayıcısı) yoktur.'
            },
            {
                id: 'soz_edeb_1',
                field: 'sozel',
                subject: 'edebiyat',
                text: 'Aşağıdaki şairlerden hangisi Milli Edebiyat dönemindendir?',
                choices: [
                    'Tevfik Fikret',
                    'Nazım Hikmet',
                    'Mehmet Emin Yurdakul',
                    'Yahya Kemal'
                ],
                correctIndex: 2,
                explanation: 'Mehmet Emin Yurdakul Milli Edebiyat anlayışının öncülerindendir.'
            },
            {
                id: 'soz_cog_1',
                field: 'sozel',
                subject: 'cografya',
                text: 'Aşağıdakilerden hangisi iç kuvvetlere örnektir?',
                choices: ['Deprem', 'Rüzgar', 'Akarsu', 'Buzul'],
                correctIndex: 0,
                explanation: 'Deprem, iç kuvvetlerin (endojen) bir sonucudur.'
            }
        ],

        // DİL
        dil: [
            {
                id: 'dil_ing_1',
                field: 'dil',
                subject: 'ingilizce',
                text: 'Choose the correct option: "If I ____ more time, I would study another language."',
                choices: ['have', 'had', 'will have', 'am having'],
                correctIndex: 1,
                explanation: 'Type 2 conditional: "If I had more time..."'
            },
            {
                id: 'dil_ing_2',
                field: 'dil',
                subject: 'ingilizce',
                text: 'Which one is the synonym of "huge"?',
                choices: ['tiny', 'enormous', 'narrow', 'quick'],
                correctIndex: 1,
                explanation: '"Huge" ≈ "enormous".'
            },
            {
                id: 'dil_ing_3',
                field: 'dil',
                subject: 'ingilizce',
                text: 'Fill in the blank: "She has lived in Ankara ____ 2015."',
                choices: ['for', 'since', 'from', 'at'],
                correctIndex: 1,
                explanation: 'Belirli bir yıldan beri: "since 2015".'
            }
        ]
    };

    /**
     * Eski basit fonksiyon (alanın genelinden karışık soru)
     */
    function getLevelTestQuestions(field, count) {
        const key = LEVEL_TEST_QUESTIONS[field] ? field : 'genel';
        const list = LEVEL_TEST_QUESTIONS[key] || [];
        if (!list.length) return [];
        const shuffled = shuffle(list);
        if (!count || count >= shuffled.length) return shuffled;
        return shuffled.slice(0, count);
    }

    /**
     * Yeni: seçilen alan için HER DERSTEN en fazla "perSubject" kadar soru getir.
     * Örn: perSubject = 3 ⇒ matematikten 3, fizikten 3, kimyadan 3...
     */
    function getLevelTestQuestionsPerSubject(field, perSubject) {
        const key = LEVEL_TEST_QUESTIONS[field] ? field : 'genel';
        const list = LEVEL_TEST_QUESTIONS[key] || [];
        if (!list.length) return [];

        const bySubject = {};
        list.forEach(q => {
            const s = q.subject || 'genel';
            if (!bySubject[s]) bySubject[s] = [];
            bySubject[s].push(q);
        });

        const result = [];
        const take = perSubject || 3;

        Object.keys(bySubject).forEach(subject => {
            const shuffled = shuffle(bySubject[subject]);
            const len = Math.min(take, shuffled.length);
            for (let i = 0; i < len; i++) {
                result.push(shuffled[i]);
            }
        });

        // Tüm derslerden gelen soruları da karıştıralım
        return shuffle(result);
    }

    // Global API
    window.YKSQuestionPoolAPI = {
        getLevelTestQuestions: getLevelTestQuestions,
        getLevelTestQuestionsPerSubject: getLevelTestQuestionsPerSubject,
        allLevelQuestions: LEVEL_TEST_QUESTIONS
    };
})();
