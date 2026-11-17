// Sprachumschalter: Deutsch steht direkt im HTML, hier liegen die Übersetzungen.
// Neue Texte im HTML bekommen ein data-i18n="schluessel" und hier je Sprache eine Zeile.
// Fehlt eine Übersetzung, bleibt automatisch der deutsche Text stehen.
(function () {
  var T = {
    en: {
      "voices.text": "Choose your voice: swipe through our speakers and tap a sphere to listen. Every voice speaks the language you select above.",
      "lang.de": "German", "lang.en": "English", "gender.w": "female", "gender.m": "male",
      "voice.lea": "Warm and friendly – our standard voice.", "voice.petra": "Confident and pleasant.",
      "voice.franziska": "Neutral and trustworthy.", "voice.stephan": "Calm, warm and serious.",
      "voice.julius": "Relaxed and likeable.", "voice.sarah": "Clear and reassuring.",
      "voice.daniel": "Composed like a news presenter.",
      "meta.title": "Ansagewerk – Professional phone announcements for your practice",
      "meta.desc": "Professional phone announcements for medical practices, physiotherapy and businesses in the Ammerland region. Greeting, on-hold, holiday and Christmas announcements – ready in 24 hours.",
      "nav.samples": "Samples", "nav.prices": "Prices", "nav.contact": "Contact",
      "hero.title": "Professional phone announcements for your practice – in 24&nbsp;hours.",
      "hero.text": "Your patients hear a friendly, clear voice instead of a crackly phone recording. We write the script, produce the announcement and deliver the finished file.",
      "hero.cta1": "Listen to samples", "hero.cta2": "Send an enquiry",
      "samples.title": "Hear for yourself",
      "samples.text": "Tap a bubble to hear how our announcements sound (using made-up businesses as examples). The samples are in German, one is in English.",
      "orb1.t": "Greeting", "orb1.d": "The first impression before you pick up the phone.",
      "orb2.t": "On hold", "orb2.d": "When all lines are busy – friendly instead of beeping.",
      "orb3.t": "Outside opening hours", "orb3.d": "With the on-call medical service 116&nbsp;117 and the emergency number.",
      "orb4.t": "Christmas / holidays", "orb4.d": "Changed opening hours over the holidays.",
      "orb5.t": "Trade business", "orb5.d": "Answering machine for an electrician.",
      "orb6.t": "English", "orb6.d": "The same voice – also for international patients.",
      "play": "Play: {x}",
      "more.title": "Any language. Your own voice, if you like.",
      "more.l.t": "All common languages",
      "more.l.d": "German, English, Turkish, Russian, Polish, Arabic, Ukrainian and many more – ideal for practices with international patients.",
      "more.c.t": "Voice cloning",
      "more.c.d": "Your announcement in your own voice: from a short recording we create a digital version – only with your explicit consent.",
      "more.v.t": "Different voices",
      "more.v.d": "Female or male, young or serious, calm or warm – you choose the voice that suits you.",
      "more.fine": "Foreign languages and voice cloning on request.",
      "how.title": "How it works",
      "how.1": "Send us your opening hours and wishes – conveniently by email.",
      "how.2": "We write a suitable script and create the announcement with a natural-sounding AI voice.",
      "how.3": "You receive the file by email within 24&nbsp;hours – in the right format for your phone system, ready to upload.",
      "prices.title": "Prices",
      "p1.t": "Single announcement", "p1.l1": "e.g. holidays or public holidays", "p1.l2": "1 round of revisions included",
      "p2.tag": "Popular", "p2.t": "“Complete practice” package",
      "p2.l1": "Greeting", "p2.l2": "On hold", "p2.l3": "Outside opening hours", "p2.l4": "Holidays / public holidays",
      "p3.t": "Update service", "p3.per": "/ month",
      "p3.l1": "Unlimited changes", "p3.l2": "Delivery within 24 h", "p3.l3": "Cancel any month",
      "prices.fine": "All prices are final prices. No VAT is charged under § 19 UStG (German small business scheme).",
      "xmas.title": "Closed over the holidays?",
      "xmas.text": "Your Christmas announcement with changed opening hours, cover arrangements and on-call service – order by 18 December and it will be ready well before the holidays.",
      "faq.title": "Frequently asked questions",
      "faq1.q": "Is that a real speaker?",
      "faq1.a": "No, we use a high-quality AI voice. This makes us fast and affordable – and changes are possible at any time within 24 hours, without booking a new studio session.",
      "faq2.q": "Will it work with my phone system?",
      "faq2.a": "Usually, yes. We deliver the file in the format your system needs (e.g. MP3 or WAV). Just tell us which system you have.",
      "faq3.q": "Who writes the script?",
      "faq3.a": "We do. You just give us the key details (opening hours, cover, special notes), and you receive the script for approval beforehand.",
      "faq4.q": "What if I don't like the announcement?",
      "faq4.a": "One round of revisions is always included. We adjust the wording or emphasis until it's right.",
      "contact.title": "Send an enquiry",
      "contact.text": "Tell us what you need – we'll get back to you within 24 hours and are happy to call you back.",
      "contact.who": "Theo &amp; Niklas · Edewecht, Ammerland (Germany)",
      "footer.imprint": "Legal notice", "footer.privacy": "Privacy policy",
      "footer.note": "Legal pages are available in German only."
    },

    tr: {
      "voices.text": "Sesinizi seçin: Konuşmacılarımız arasında kaydırın ve dinlemek için bir küreye dokunun. Tüm sesler yukarıda seçtiğiniz dilde konuşur.",
      "gender.w": "kadın",
      "gender.m": "erkek",
      "voice.lea": "Sıcak ve samimi – standart sesimiz.",
      "voice.petra": "Özgüvenli ve hoş.",
      "voice.franziska": "Tarafsız ve güvenilir.",
      "voice.stephan": "Sakin, sıcak ve ciddi.",
      "voice.julius": "Rahat ve sempatik.",
      "voice.sarah": "Net ve güven verici.",
      "voice.daniel": "Bir haber spikeri gibi kendinden emin.",
      "meta.title": "Ansagewerk – Muayenehaneniz için profesyonel telefon anonsları",
      "meta.desc": "Ammerland bölgesindeki doktor muayenehaneleri, fizyoterapi ve işletmeler için profesyonel telefon anonsları. Karşılama, bekleme, tatil ve Noel anonsları – 24 saatte hazır.",
      "nav.samples": "Ses örnekleri", "nav.prices": "Fiyatlar", "nav.contact": "İletişim",
      "hero.title": "Muayenehaneniz için profesyonel telefon anonsları – 24&nbsp;saatte.",
      "hero.text": "Hastalarınız cızırtılı bir telefon kaydı yerine samimi ve net bir ses duyar. Metni biz yazar, anonsu hazırlar ve hazır dosyayı teslim ederiz.",
      "hero.cta1": "Ses örneklerini dinleyin", "hero.cta2": "Talep gönderin",
      "samples.title": "Kendiniz dinleyin",
      "samples.text": "Bir baloncuğa dokunun – anonslarımız böyle duyuluyor (hayali işletmeler örneğinde). Ses örnekleri Almanca, biri İngilizce.",
      "orb1.t": "Karşılama", "orb1.d": "Telefonu açmadan önceki ilk izlenim.",
      "orb2.t": "Bekleme", "orb2.d": "Tüm hatlar meşgulken – düt sesi yerine güler yüzlü bir anons.",
      "orb3.t": "Çalışma saatleri dışında", "orb3.d": "Nöbetçi doktor hattı 116&nbsp;117 ve acil numarası ile.",
      "orb4.t": "Noel / tatil", "orb4.d": "Yılbaşı döneminde değişen çalışma saatleri.",
      "orb5.t": "Zanaat işletmesi", "orb5.d": "Bir elektrik firması için telesekreter.",
      "orb6.t": "İngilizce", "orb6.d": "Aynı ses – uluslararası hastalar için de.",
      "play": "Oynat: {x}",
      "more.title": "Her dilde. İsterseniz kendi sesinizle.",
      "more.l.t": "Tüm yaygın diller",
      "more.l.d": "Almanca, İngilizce, Türkçe, Rusça, Lehçe, Arapça, Ukraynaca ve çok daha fazlası – uluslararası hastaları olan muayenehaneler için ideal.",
      "more.c.t": "Ses klonlama",
      "more.c.d": "Anonsunuz kendi sesinizle: Kısa bir kayıttan dijital bir versiyon oluşturuyoruz – yalnızca açık onayınızla.",
      "more.v.t": "Farklı sesler",
      "more.v.d": "Kadın veya erkek, genç veya ciddi, sakin veya sıcak – size uyan sesi siz seçersiniz.",
      "more.fine": "Yabancı diller ve ses klonlama talep üzerine.",
      "how.title": "Bu kadar kolay",
      "how.1": "Çalışma saatlerinizi ve isteklerinizi bize kolayca e-posta ile gönderin.",
      "how.2": "Uygun bir metin yazar ve anonsu doğal sesli bir yapay zekâ sesiyle hazırlarız.",
      "how.3": "Dosyayı 24&nbsp;saat içinde e-posta ile alırsınız – telefon sisteminize uygun formatta, yüklemeye hazır.",
      "prices.title": "Fiyatlar",
      "p1.t": "Tekli anons", "p1.l1": "ör. tatil veya bayramlar", "p1.l2": "1 düzeltme turu dahil",
      "p2.tag": "Popüler", "p2.t": "„Muayenehane komple“ paketi",
      "p2.l1": "Karşılama", "p2.l2": "Bekleme", "p2.l3": "Çalışma saatleri dışında", "p2.l4": "Tatil / bayramlar",
      "p3.t": "Değişiklik hizmeti", "p3.per": "/ ay",
      "p3.l1": "Sınırsız değişiklik", "p3.l2": "24 saatte teslim", "p3.l3": "Aylık iptal edilebilir",
      "prices.fine": "Tüm fiyatlar nihai fiyatlardır. § 19 UStG (Alman küçük işletme düzenlemesi) uyarınca KDV alınmaz.",
      "xmas.title": "Yılbaşında kapalı mısınız?",
      "xmas.text": "Değişen çalışma saatleri, vekâlet ve nöbetçi hizmet bilgileriyle Noel anonsunuz – 18 Aralık'a kadar sipariş verin, bayramlardan önce kesinlikle hazır olsun.",
      "faq.title": "Sık sorulan sorular",
      "faq1.q": "Bu gerçek bir seslendirme sanatçısı mı?",
      "faq1.a": "Hayır, yüksek kaliteli bir yapay zekâ sesi kullanıyoruz. Bu sayede hızlı ve uygun fiyatlıyız – değişiklikler de yeni bir stüdyo randevusu olmadan her zaman 24 saat içinde mümkün.",
      "faq2.q": "Telefon sistemimle çalışır mı?",
      "faq2.a": "Genellikle evet. Dosyayı sisteminizin ihtiyaç duyduğu formatta (ör. MP3 veya WAV) teslim ederiz. Hangi sisteme sahip olduğunuzu söylemeniz yeterli.",
      "faq3.q": "Metni kim yazıyor?",
      "faq3.a": "Biz. Siz bize sadece temel bilgileri (çalışma saatleri, vekâlet, özel durumlar) verirsiniz; metni önceden onayınıza sunarız.",
      "faq4.q": "Anons hoşuma gitmezse ne olur?",
      "faq4.a": "Bir düzeltme turu her zaman dahildir. Metni veya vurguyu, uygun olana kadar düzenleriz.",
      "contact.title": "Talep gönderin",
      "contact.text": "İsteklerinizi bize yazın – 24 saat içinde size dönüş yapar, memnuniyetle sizi geri ararız.",
      "contact.who": "Theo &amp; Niklas · Edewecht, Ammerland (Almanya)",
      "footer.imprint": "Künye", "footer.privacy": "Gizlilik politikası",
      "footer.note": "Yasal metinler yalnızca Almanca olarak mevcuttur."
    },

    pl: {
      "voices.text": "Wybierz głos: przesuń między naszymi lektorami i dotknij kuli, aby posłuchać. Każdy głos mówi w języku wybranym powyżej.",
      "gender.w": "kobieta",
      "gender.m": "mężczyzna",
      "voice.lea": "Ciepły i przyjazny – nasz standardowy głos.",
      "voice.petra": "Pewny siebie i przyjemny.",
      "voice.franziska": "Neutralny i godny zaufania.",
      "voice.stephan": "Spokojny, ciepły i poważny.",
      "voice.julius": "Swobodny i sympatyczny.",
      "voice.sarah": "Wyraźny i uspokajający.",
      "voice.daniel": "Opanowany jak prezenter wiadomości.",
      "meta.title": "Ansagewerk – Profesjonalne komunikaty telefoniczne dla gabinetów",
      "meta.desc": "Profesjonalne komunikaty telefoniczne dla gabinetów lekarskich, fizjoterapii i firm w regionie Ammerland. Powitanie, oczekiwanie na linii, komunikaty urlopowe i świąteczne – gotowe w 24 godziny.",
      "nav.samples": "Nagrania", "nav.prices": "Ceny", "nav.contact": "Kontakt",
      "hero.title": "Profesjonalne komunikaty telefoniczne dla Państwa gabinetu – w 24&nbsp;godziny.",
      "hero.text": "Pacjenci usłyszą przyjazny, wyraźny głos zamiast zaszumionego nagrania z telefonu. Piszemy tekst, przygotowujemy komunikat i dostarczamy gotowy plik.",
      "hero.cta1": "Posłuchaj nagrań", "hero.cta2": "Wyślij zapytanie",
      "samples.title": "Proszę posłuchać",
      "samples.text": "Wystarczy dotknąć dymka – tak brzmią nasze komunikaty (na przykładzie fikcyjnych firm). Nagrania są po niemiecku, jedno po angielsku.",
      "orb1.t": "Powitanie", "orb1.d": "Pierwsze wrażenie, zanim ktoś podniesie słuchawkę.",
      "orb2.t": "Oczekiwanie na linii", "orb2.d": "Gdy wszystkie linie są zajęte – uprzejmie zamiast sygnału.",
      "orb3.t": "Poza godzinami przyjęć", "orb3.d": "Z numerem dyżuru lekarskiego 116&nbsp;117 i numerem alarmowym.",
      "orb4.t": "Święta / urlop", "orb4.d": "Zmienione godziny otwarcia w okresie świątecznym.",
      "orb5.t": "Zakład rzemieślniczy", "orb5.d": "Automatyczna sekretarka dla firmy elektrycznej.",
      "orb6.t": "Angielski", "orb6.d": "Ten sam głos – także dla pacjentów z zagranicy.",
      "play": "Odtwórz: {x}",
      "more.title": "Każdy język. Na życzenie Państwa własny głos.",
      "more.l.t": "Wszystkie popularne języki",
      "more.l.d": "Niemiecki, angielski, turecki, rosyjski, polski, arabski, ukraiński i wiele innych – idealne dla gabinetów z pacjentami z zagranicy.",
      "more.c.t": "Klonowanie głosu",
      "more.c.d": "Komunikat Państwa własnym głosem: z krótkiego nagrania tworzymy cyfrową wersję – wyłącznie za Państwa wyraźną zgodą.",
      "more.v.t": "Różne głosy",
      "more.v.d": "Kobiecy lub męski, młody lub poważny, spokojny lub serdeczny – wybierają Państwo głos, który pasuje.",
      "more.fine": "Języki obce i klonowanie głosu na zapytanie.",
      "how.title": "To proste",
      "how.1": "Przesyłają nam Państwo godziny przyjęć i życzenia – wygodnie e-mailem.",
      "how.2": "Piszemy odpowiedni tekst i tworzymy komunikat naturalnie brzmiącym głosem AI.",
      "how.3": "Plik otrzymują Państwo e-mailem w ciągu 24&nbsp;godzin – w formacie pasującym do centrali, gotowy do wgrania.",
      "prices.title": "Ceny",
      "p1.t": "Pojedynczy komunikat", "p1.l1": "np. urlop lub święta", "p1.l2": "1 runda poprawek w cenie",
      "p2.tag": "Popularny", "p2.t": "Pakiet „Gabinet kompletny”",
      "p2.l1": "Powitanie", "p2.l2": "Oczekiwanie na linii", "p2.l3": "Poza godzinami przyjęć", "p2.l4": "Urlop / święta",
      "p3.t": "Serwis zmian", "p3.per": "/ miesiąc",
      "p3.l1": "Nieograniczone zmiany", "p3.l2": "Dostawa w 24 h", "p3.l3": "Wypowiedzenie co miesiąc",
      "prices.fine": "Wszystkie ceny są cenami końcowymi. Zgodnie z § 19 UStG (niemiecka regulacja dla małych przedsiębiorstw) nie naliczamy podatku VAT.",
      "xmas.title": "Zamknięte w okresie świąteczno-noworocznym?",
      "xmas.text": "Komunikat świąteczny ze zmienionymi godzinami otwarcia, zastępstwem i dyżurem – przy zamówieniu do 18 grudnia będzie na pewno gotowy przed świętami.",
      "faq.title": "Częste pytania",
      "faq1.q": "Czy to prawdziwa lektorka?",
      "faq1.a": "Nie, używamy wysokiej jakości głosu AI. Dzięki temu działamy szybko i niedrogo – a zmiany są zawsze możliwe w ciągu 24 godzin, bez nowej sesji w studiu.",
      "faq2.q": "Czy to zadziała z moją centralą telefoniczną?",
      "faq2.a": "Z reguły tak. Dostarczamy plik w formacie, którego potrzebuje centrala (np. MP3 lub WAV). Wystarczy powiedzieć, jaką mają Państwo centralę.",
      "faq3.q": "Kto pisze tekst?",
      "faq3.a": "My. Podają nam Państwo tylko najważniejsze informacje (godziny przyjęć, zastępstwo, szczegóły), a tekst otrzymują Państwo wcześniej do akceptacji.",
      "faq4.q": "Co, jeśli komunikat mi się nie spodoba?",
      "faq4.a": "Jedna runda poprawek jest zawsze w cenie. Dopasowujemy tekst lub intonację, aż wszystko będzie się zgadzać.",
      "contact.title": "Wyślij zapytanie",
      "contact.text": "Prosimy napisać nam o swoich życzeniach – odpowiemy w ciągu 24 godzin i chętnie oddzwonimy.",
      "contact.who": "Theo &amp; Niklas · Edewecht, Ammerland (Niemcy)",
      "footer.imprint": "Nota prawna", "footer.privacy": "Polityka prywatności",
      "footer.note": "Teksty prawne są dostępne wyłącznie w języku niemieckim."
    },

    ru: {
      "voices.text": "Выберите голос: листайте наших дикторов и нажмите на шар, чтобы послушать. Все голоса говорят на языке, выбранном вверху.",
      "gender.w": "женский",
      "gender.m": "мужской",
      "voice.lea": "Тёплый и дружелюбный – наш основной голос.",
      "voice.petra": "Уверенный и приятный.",
      "voice.franziska": "Нейтральный и надёжный.",
      "voice.stephan": "Спокойный, тёплый и серьёзный.",
      "voice.julius": "Непринуждённый и симпатичный.",
      "voice.sarah": "Чёткий и успокаивающий.",
      "voice.daniel": "Собранный, как ведущий новостей.",
      "meta.title": "Ansagewerk – Профессиональные телефонные объявления для вашей практики",
      "meta.desc": "Профессиональные телефонные объявления для врачебных практик, физиотерапии и предприятий в регионе Аммерланд. Приветствие, ожидание на линии, объявления об отпуске и Рождестве – готово за 24 часа.",
      "nav.samples": "Примеры", "nav.prices": "Цены", "nav.contact": "Контакты",
      "hero.title": "Профессиональные телефонные объявления для вашей практики – за 24&nbsp;часа.",
      "hero.text": "Ваши пациенты услышат приветливый, чёткий голос вместо шумной записи с телефона. Мы пишем текст, создаём объявление и передаём готовый файл.",
      "hero.cta1": "Послушать примеры", "hero.cta2": "Отправить запрос",
      "samples.title": "Послушайте сами",
      "samples.text": "Нажмите на облачко – так звучат наши объявления (на примере вымышленных организаций). Примеры на немецком языке, один – на английском.",
      "orb1.t": "Приветствие", "orb1.d": "Первое впечатление ещё до того, как вы снимете трубку.",
      "orb2.t": "Ожидание на линии", "orb2.d": "Когда все линии заняты – вежливо, а не просто гудки.",
      "orb3.t": "Вне часов приёма", "orb3.d": "С номером дежурной врачебной службы 116&nbsp;117 и экстренным номером.",
      "orb4.t": "Рождество / отпуск", "orb4.d": "Изменённые часы работы в праздничные дни.",
      "orb5.t": "Ремесленное предприятие", "orb5.d": "Автоответчик для электромонтажной фирмы.",
      "orb6.t": "Английский", "orb6.d": "Тот же голос – и для иностранных пациентов.",
      "play": "Воспроизвести: {x}",
      "more.title": "Любой язык. По желанию – ваш собственный голос.",
      "more.l.t": "Все распространённые языки",
      "more.l.d": "Немецкий, английский, турецкий, русский, польский, арабский, украинский и многие другие – идеально для практик с иностранными пациентами.",
      "more.c.t": "Клонирование голоса",
      "more.c.d": "Объявление вашим собственным голосом: по короткой записи мы создаём цифровую версию – только с вашего явного согласия.",
      "more.v.t": "Разные голоса",
      "more.v.d": "Женский или мужской, молодой или солидный, спокойный или тёплый – вы выбираете голос, который вам подходит.",
      "more.fine": "Иностранные языки и клонирование голоса – по запросу.",
      "how.title": "Всё просто",
      "how.1": "Пришлите нам часы приёма и пожелания – удобно по электронной почте.",
      "how.2": "Мы пишем подходящий текст и создаём объявление с естественно звучащим голосом ИИ.",
      "how.3": "Вы получаете файл по электронной почте в течение 24&nbsp;часов – в формате для вашей телефонной системы, готовый к загрузке.",
      "prices.title": "Цены",
      "p1.t": "Отдельное объявление", "p1.l1": "напр. отпуск или праздники", "p1.l2": "1 раунд правок включён",
      "p2.tag": "Популярно", "p2.t": "Пакет «Практика полностью»",
      "p2.l1": "Приветствие", "p2.l2": "Ожидание на линии", "p2.l3": "Вне часов приёма", "p2.l4": "Отпуск / праздники",
      "p3.t": "Сервис изменений", "p3.per": "/ месяц",
      "p3.l1": "Неограниченные изменения", "p3.l2": "Доставка за 24 ч", "p3.l3": "Отмена ежемесячно",
      "prices.fine": "Все цены окончательные. Согласно § 19 UStG (немецкое положение о малом предпринимательстве) НДС не взимается.",
      "xmas.title": "Закрыты между Рождеством и Новым годом?",
      "xmas.text": "Рождественское объявление с изменёнными часами работы, заменой и дежурной службой – закажите до 18 декабря, и оно точно будет готово до праздников.",
      "faq.title": "Частые вопросы",
      "faq1.q": "Это настоящий диктор?",
      "faq1.a": "Нет, мы используем высококачественный голос ИИ. Поэтому мы работаем быстро и недорого – а изменения возможны в любое время в течение 24 часов, без новой записи в студии.",
      "faq2.q": "Подойдёт ли это для моей телефонной системы?",
      "faq2.a": "Как правило, да. Мы передаём файл в формате, который нужен вашей системе (напр. MP3 или WAV). Просто скажите, какая у вас система.",
      "faq3.q": "Кто пишет текст?",
      "faq3.a": "Мы. Вы сообщаете нам только основные данные (часы приёма, замена, особенности) и заранее получаете текст на утверждение.",
      "faq4.q": "А если объявление мне не понравится?",
      "faq4.a": "Один раунд правок всегда включён. Мы корректируем текст или интонацию, пока всё не будет как надо.",
      "contact.title": "Отправить запрос",
      "contact.text": "Напишите нам о ваших пожеланиях – мы ответим в течение 24 часов и с удовольствием перезвоним.",
      "contact.who": "Theo &amp; Niklas · Эдевехт, Аммерланд (Германия)",
      "footer.imprint": "Выходные данные", "footer.privacy": "Политика конфиденциальности",
      "footer.note": "Юридические тексты доступны только на немецком языке."
    },

    uk: {
      "voices.text": "Оберіть голос: гортайте наших дикторів і торкніться кулі, щоб послухати. Усі голоси говорять мовою, обраною вгорі.",
      "gender.w": "жіночий",
      "gender.m": "чоловічий",
      "voice.lea": "Теплий і привітний – наш основний голос.",
      "voice.petra": "Впевнений і приємний.",
      "voice.franziska": "Нейтральний і надійний.",
      "voice.stephan": "Спокійний, теплий і серйозний.",
      "voice.julius": "Невимушений і симпатичний.",
      "voice.sarah": "Чіткий і заспокійливий.",
      "voice.daniel": "Зібраний, як ведучий новин.",
      "meta.title": "Ansagewerk – Професійні телефонні оголошення для вашої практики",
      "meta.desc": "Професійні телефонні оголошення для лікарських практик, фізіотерапії та підприємств у регіоні Аммерланд. Привітання, очікування на лінії, оголошення про відпустку та Різдво – готово за 24 години.",
      "nav.samples": "Приклади", "nav.prices": "Ціни", "nav.contact": "Контакти",
      "hero.title": "Професійні телефонні оголошення для вашої практики – за 24&nbsp;години.",
      "hero.text": "Ваші пацієнти почують привітний, чіткий голос замість шумного запису з телефона. Ми пишемо текст, створюємо оголошення й надаємо готовий файл.",
      "hero.cta1": "Послухати приклади", "hero.cta2": "Надіслати запит",
      "samples.title": "Послухайте самі",
      "samples.text": "Натисніть на хмаринку – так звучать наші оголошення (на прикладі вигаданих підприємств). Приклади німецькою мовою, один – англійською.",
      "orb1.t": "Привітання", "orb1.d": "Перше враження ще до того, як ви знімете слухавку.",
      "orb2.t": "Очікування на лінії", "orb2.d": "Коли всі лінії зайняті – ввічливо, а не просто гудки.",
      "orb3.t": "Поза годинами прийому", "orb3.d": "З номером чергової лікарської служби 116&nbsp;117 та екстреним номером.",
      "orb4.t": "Різдво / відпустка", "orb4.d": "Змінені години роботи у святкові дні.",
      "orb5.t": "Ремісниче підприємство", "orb5.d": "Автовідповідач для електромонтажної фірми.",
      "orb6.t": "Англійська", "orb6.d": "Той самий голос – і для іноземних пацієнтів.",
      "play": "Відтворити: {x}",
      "more.title": "Будь-яка мова. За бажанням – ваш власний голос.",
      "more.l.t": "Усі поширені мови",
      "more.l.d": "Німецька, англійська, турецька, російська, польська, арабська, українська та багато інших – ідеально для практик з іноземними пацієнтами.",
      "more.c.t": "Клонування голосу",
      "more.c.d": "Оголошення вашим власним голосом: з короткого запису ми створюємо цифрову версію – лише з вашої явної згоди.",
      "more.v.t": "Різні голоси",
      "more.v.d": "Жіночий чи чоловічий, молодий чи солідний, спокійний чи теплий – ви обираєте голос, який вам пасує.",
      "more.fine": "Іноземні мови та клонування голосу – на запит.",
      "how.title": "Усе просто",
      "how.1": "Надішліть нам години прийому та побажання – зручно електронною поштою.",
      "how.2": "Ми пишемо відповідний текст і створюємо оголошення з природно звучним голосом ШІ.",
      "how.3": "Ви отримуєте файл електронною поштою протягом 24&nbsp;годин – у форматі для вашої телефонної системи, готовий до завантаження.",
      "prices.title": "Ціни",
      "p1.t": "Окреме оголошення", "p1.l1": "напр. відпустка або свята", "p1.l2": "1 раунд правок включено",
      "p2.tag": "Популярне", "p2.t": "Пакет «Практика повністю»",
      "p2.l1": "Привітання", "p2.l2": "Очікування на лінії", "p2.l3": "Поза годинами прийому", "p2.l4": "Відпустка / свята",
      "p3.t": "Сервіс змін", "p3.per": "/ місяць",
      "p3.l1": "Необмежені зміни", "p3.l2": "Доставка за 24 год", "p3.l3": "Скасування щомісяця",
      "prices.fine": "Усі ціни остаточні. Відповідно до § 19 UStG (німецьке положення про малий бізнес) ПДВ не стягується.",
      "xmas.title": "Зачинені між Різдвом і Новим роком?",
      "xmas.text": "Різдвяне оголошення зі зміненими годинами роботи, заміною та черговою службою – замовте до 18 грудня, і воно точно буде готове до свят.",
      "faq.title": "Часті запитання",
      "faq1.q": "Це справжній диктор?",
      "faq1.a": "Ні, ми використовуємо високоякісний голос ШІ. Тому ми працюємо швидко й недорого – а зміни можливі будь-коли протягом 24 годин, без нового запису в студії.",
      "faq2.q": "Чи підійде це для моєї телефонної системи?",
      "faq2.a": "Як правило, так. Ми надаємо файл у форматі, який потрібен вашій системі (напр. MP3 або WAV). Просто скажіть, яка у вас система.",
      "faq3.q": "Хто пише текст?",
      "faq3.a": "Ми. Ви повідомляєте нам лише основні дані (години прийому, заміна, особливості) й заздалегідь отримуєте текст на затвердження.",
      "faq4.q": "А якщо оголошення мені не сподобається?",
      "faq4.a": "Один раунд правок завжди включено. Ми коригуємо текст або інтонацію, доки все не буде як слід.",
      "contact.title": "Надіслати запит",
      "contact.text": "Напишіть нам про ваші побажання – ми відповімо протягом 24 годин і охоче вам передзвонимо.",
      "contact.who": "Theo &amp; Niklas · Едевехт, Аммерланд (Німеччина)",
      "footer.imprint": "Вихідні дані", "footer.privacy": "Політика конфіденційності",
      "footer.note": "Юридичні тексти доступні лише німецькою мовою."
    },

    ar: {
      "voices.text": "اختر صوتك: تصفّح بين المتحدثين واضغط على كرة للاستماع. تتحدث جميع الأصوات باللغة التي تختارها في الأعلى.",
      "gender.w": "أنثى",
      "gender.m": "ذكر",
      "voice.lea": "دافئ وودود – صوتنا الأساسي.",
      "voice.petra": "واثق ولطيف.",
      "voice.franziska": "محايد وجدير بالثقة.",
      "voice.stephan": "هادئ ودافئ وجاد.",
      "voice.julius": "مريح ومحبوب.",
      "voice.sarah": "واضح ومطمئن.",
      "voice.daniel": "متزن مثل مذيع الأخبار.",
      "meta.title": "Ansagewerk – رسائل هاتفية احترافية لعيادتكم",
      "meta.desc": "رسائل هاتفية احترافية للعيادات الطبية والعلاج الطبيعي والشركات في منطقة أمرلاند. ترحيب، وقائمة انتظار، ورسائل الإجازات وعيد الميلاد – جاهزة خلال 24 ساعة.",
      "nav.samples": "نماذج صوتية", "nav.prices": "الأسعار", "nav.contact": "تواصل معنا",
      "hero.title": "رسائل هاتفية احترافية لعيادتكم – خلال 24&nbsp;ساعة.",
      "hero.text": "يسمع مرضاكم صوتًا ودودًا وواضحًا بدلًا من تسجيل مشوّش بالهاتف المحمول. نكتب النص، ونُعدّ الرسالة، ونسلّمكم الملف جاهزًا.",
      "hero.cta1": "استمعوا إلى النماذج", "hero.cta2": "أرسلوا طلبًا",
      "samples.title": "استمعوا بأنفسكم",
      "samples.text": "اضغطوا على إحدى الفقاعات لتسمعوا كيف تبدو رسائلنا (أمثلة لمنشآت خيالية). النماذج باللغة الألمانية، وواحد منها بالإنجليزية.",
      "orb1.t": "الترحيب", "orb1.d": "الانطباع الأول قبل أن تردّوا على الهاتف.",
      "orb2.t": "قائمة الانتظار", "orb2.d": "عندما تكون جميع الخطوط مشغولة – رسالة لطيفة بدلًا من الرنين.",
      "orb3.t": "خارج أوقات الدوام", "orb3.d": "مع رقم خدمة الطبيب المناوب 116&nbsp;117 ورقم الطوارئ.",
      "orb4.t": "عيد الميلاد / الإجازة", "orb4.d": "أوقات عمل معدّلة خلال فترة الأعياد.",
      "orb5.t": "منشأة حرفية", "orb5.d": "مجيب آلي لشركة كهرباء.",
      "orb6.t": "الإنجليزية", "orb6.d": "الصوت نفسه – للمرضى الدوليين أيضًا.",
      "play": "تشغيل: {x}",
      "more.title": "أي لغة. وبصوتكم أنتم إن رغبتم.",
      "more.l.t": "جميع اللغات الشائعة",
      "more.l.d": "الألمانية والإنجليزية والتركية والروسية والبولندية والعربية والأوكرانية وغيرها الكثير – مثالية للعيادات التي تستقبل مرضى من جنسيات مختلفة.",
      "more.c.t": "استنساخ الصوت",
      "more.c.d": "رسالتكم بصوتكم الخاص: ننشئ نسخة رقمية من تسجيل قصير – فقط بموافقتكم الصريحة.",
      "more.v.t": "أصوات متنوعة",
      "more.v.d": "صوت نسائي أو رجالي، شاب أو رصين، هادئ أو دافئ – أنتم تختارون الصوت المناسب لكم.",
      "more.fine": "اللغات الأجنبية واستنساخ الصوت حسب الطلب.",
      "how.title": "بهذه السهولة",
      "how.1": "أرسلوا لنا أوقات الدوام ورغباتكم – بسهولة عبر البريد الإلكتروني.",
      "how.2": "نكتب نصًا مناسبًا ونُعدّ الرسالة بصوت ذكاء اصطناعي طبيعي.",
      "how.3": "تستلمون الملف عبر البريد الإلكتروني خلال 24&nbsp;ساعة – بالصيغة المناسبة لنظام الهاتف لديكم، جاهزًا للتحميل.",
      "prices.title": "الأسعار",
      "p1.t": "رسالة منفردة", "p1.l1": "مثلًا للإجازة أو العطل الرسمية", "p1.l2": "جولة تعديل واحدة مشمولة",
      "p2.tag": "الأكثر طلبًا", "p2.t": "باقة «العيادة الكاملة»",
      "p2.l1": "الترحيب", "p2.l2": "قائمة الانتظار", "p2.l3": "خارج أوقات الدوام", "p2.l4": "الإجازة / العطل",
      "p3.t": "خدمة التعديلات", "p3.per": "/ شهريًا",
      "p3.l1": "تعديلات غير محدودة", "p3.l2": "التسليم خلال 24 ساعة", "p3.l3": "إمكانية الإلغاء شهريًا",
      "prices.fine": "جميع الأسعار نهائية. وفقًا للمادة 19 من قانون ضريبة المبيعات الألماني (نظام المشاريع الصغيرة) لا تُحتسب ضريبة القيمة المضافة.",
      "xmas.title": "هل عيادتكم مغلقة في فترة الأعياد؟",
      "xmas.text": "رسالة عيد الميلاد مع أوقات العمل المعدّلة والطبيب البديل وخدمة المناوبة – اطلبوها قبل 18 ديسمبر لتكون جاهزة بالتأكيد قبل الأعياد.",
      "faq.title": "الأسئلة الشائعة",
      "faq1.q": "هل هذه متحدثة حقيقية؟",
      "faq1.a": "لا، نستخدم صوتًا عالي الجودة بالذكاء الاصطناعي. لذلك نعمل بسرعة وبتكلفة مناسبة – ويمكن إجراء التعديلات في أي وقت خلال 24 ساعة دون الحاجة إلى موعد جديد في الاستوديو.",
      "faq2.q": "هل يعمل ذلك مع نظام الهاتف لديّ؟",
      "faq2.a": "في الغالب نعم. نسلّم الملف بالصيغة التي يحتاجها نظامكم (مثل MP3 أو WAV). أخبرونا فقط بنوع النظام لديكم.",
      "faq3.q": "من يكتب النص؟",
      "faq3.a": "نحن. تزوّدوننا فقط بالمعلومات الأساسية (أوقات الدوام، الطبيب البديل، الملاحظات الخاصة)، وتستلمون النص مسبقًا للموافقة عليه.",
      "faq4.q": "ماذا لو لم تعجبني الرسالة؟",
      "faq4.a": "جولة تعديل واحدة مشمولة دائمًا. نعدّل النص أو طريقة النطق حتى تصبح مناسبة.",
      "contact.title": "أرسلوا طلبًا",
      "contact.text": "اكتبوا لنا رغباتكم – سنردّ عليكم خلال 24 ساعة، ويسعدنا أن نتصل بكم.",
      "contact.who": "Theo &amp; Niklas · إديفيشت، أمرلاند (ألمانيا)",
      "footer.imprint": "بيانات الناشر", "footer.privacy": "سياسة الخصوصية",
      "footer.note": "النصوص القانونية متوفرة باللغة الألمانية فقط."
    }
  };

  var DE_PLAY = "{x} abspielen";
  var LANGS = ["de", "en", "tr", "pl", "ru", "uk", "ar"];
  var KEY = "ansagewerk-lang";
  var html = document.documentElement;
  var nodes = document.querySelectorAll("[data-i18n]");
  var metaDesc = document.querySelector("meta[data-i18n-content]");
  var orig = {};

  // Deutsche Originaltexte merken, damit man zurückschalten kann
  nodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in orig)) orig[k] = el.innerHTML;
  });
  if (metaDesc) orig["meta.desc"] = metaDesc.getAttribute("content");

  function t(lang, k) {
    var d = T[lang];
    return d && d[k] != null ? d[k] : orig[k];
  }

  function apply(lang, save) {
    if (LANGS.indexOf(lang) < 0) lang = "de";
    nodes.forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n"));
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    if (metaDesc) metaDesc.setAttribute("content", t(lang, "meta.desc"));
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";

    // Vorlese-Beschriftung der Kugeln
    var play = (T[lang] && T[lang].play) || DE_PLAY;
    document.querySelectorAll(".orb-card").forEach(function (card) {
      var title = card.querySelector(".orb-text b");
      if (title) card.setAttribute("aria-label", play.replace("{x}", title.textContent));
    });

    var cur = document.querySelector(".lang-cur");
    if (cur) cur.textContent = lang.toUpperCase();
    document.querySelectorAll(".lang-menu [data-lang]").forEach(function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    if (save) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  }

  function initialLang() {
    var m = /[?&]lang=([a-z]{2})/.exec(location.search);
    if (m && LANGS.indexOf(m[1]) >= 0) return m[1];
    try { var s = localStorage.getItem(KEY); if (s) return s; } catch (e) {}
    var list = navigator.languages || [navigator.language || "de"];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).slice(0, 2).toLowerCase();
      if (LANGS.indexOf(l) >= 0) return l;
    }
    return "de";
  }

  // Menü
  var btn = document.querySelector(".lang-btn");
  var menu = document.getElementById("lang-menu");
  function open(o) {
    if (!menu) return;
    menu.hidden = !o;
    btn.setAttribute("aria-expanded", String(o));
    if (o) { var a = menu.querySelector('[aria-current="true"]') || menu.querySelector("button"); a.focus(); }
  }
  if (btn && menu) {
    btn.addEventListener("click", function (e) { e.stopPropagation(); open(menu.hidden); });
    menu.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (!b) return;
      apply(b.getAttribute("data-lang"), true);
      open(false); btn.focus();
    });
    document.addEventListener("click", function (e) { if (!menu.hidden && !e.target.closest(".lang")) open(false); });
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { open(false); btn.focus(); return; }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        var items = Array.prototype.slice.call(menu.querySelectorAll("button"));
        var i = items.indexOf(document.activeElement);
        i = e.key === "ArrowDown" ? (i + 1) % items.length : (i - 1 + items.length) % items.length;
        items[i].focus(); e.preventDefault();
      }
    });
  }

  apply(initialLang());
})();
