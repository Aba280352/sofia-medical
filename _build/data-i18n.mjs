// Language landing pages (/en/, later /ru/ and /ar/): one page per language,
// noindex, a translation of the Hebrew homepage. No links to inner pages (they
// are all in Hebrew): menu items jump to sections of the same page, every
// action goes to WhatsApp or the phone. Translations of the existing Hebrew
// copy, no new claims. No dashes in copy, ranges written with "to".
export const I18N = {
  en: {
    title: "Sofia Medical | Rehabilitation, Pain Management and Sleep Medicine in Kfar Saba",
    description: "Sofia Medical in Kfar Saba: medical rehabilitation, physiotherapy, pain management and sleep disorders, with a multidisciplinary team led by Dr. Ala Mahamid.",
    locale: "en-US",
    address: "6 Yohanan HaSandlar St, 5th floor, Kfar Saba",
    newWin: " (opens in a new window)",
    he: " (in Hebrew)",
    menu: "Menu", close: "Close the menu", navLabel: "Main menu",
    nav: [
      ["About", "#about-title"], ["Treatments", "#treat-title"], ["Team", "#team-title"],
      ["Testimonials", "#reviews-title"], ["FAQ", "#faq-title"],
    ],
    wa: "WhatsApp", waLong: "Message us on WhatsApp", call: "Call now", ask: "Ask on WhatsApp",
    waHello: "Hello, I would like more information about Sofia Medical",
    waAbout: (topic) => `Hello, I would like more information about ${topic}`,

    hero: {
      brand: "Sofia Medical:",
      h1: "A leading center in Israel for rehabilitation, pain management and sleep disorders",
      lead: "Advanced medicine, a team of experts and personalized solutions to improve our patients' function and health",
    },
    insureNav: "Choose an arrangement",
    insure: {
      clalit: { name: "Clalit Mushlam", alt: "Clalit Mushlam",
        text: "Medical consultation with Dr. Ala Mahamid in rehabilitation and sleep medicine, with a copayment of 150 NIS, subject to eligibility and the terms of the arrangement." },
      bwell: { name: "BWell and Migdal", alt: "BWell by Migdal",
        text: "Medical consultation in pain medicine (Dr. Yarona), urology consultation (Dr. Haitham) and physiotherapy treatments, with a copayment and according to the terms of your policy." },
    },
    insureWith: "Arrangement with",
    strip: { label: "Arrangements with health funds and insurers", title: "Arrangements with Clalit Mushlam, BWell and Migdal", sub: " Medical consultation with a copayment", close: "Close this message" },

    servicesTitle: "Our services",
    services: [
      { name: "Advanced rehabilitation medicine", topic: "rehabilitation medicine" },
      { name: "Pain management", topic: "pain management" },
      { name: "Sleep disorder diagnosis and treatment", topic: "sleep disorder diagnosis and treatment" },
      { name: "Advanced physiotherapy", topic: "physiotherapy" },
      { name: "Neurological rehabilitation with recoveriX", topic: "neurological rehabilitation with recoveriX" },
      { name: "Sexual and urological rehabilitation", topic: "sexual and urological rehabilitation" },
    ],

    about: {
      title: 'About <span class="hl">the center</span>',
      lead: '"Sofia Medical" is <strong>an advanced private medical center in Kfar Saba</strong>, specializing in outpatient rehabilitation, advanced physiotherapy, physiotherapy treatments, orthopedic rehabilitation, neurological rehabilitation, sexual and urological rehabilitation, pain management, and the diagnosis and treatment of sleep disorders.',
      body: "The center is led by Dr. Ala Mahamid, a specialist in physical medicine and rehabilitation and an expert in sleep disorders, and provides advanced medical and rehabilitation services for adults and children through a multidisciplinary team and innovative technologies.",
      tickerLabel: "Areas of expertise",
      ticker: ["Outpatient rehabilitation", "Advanced physiotherapy", "Orthopedic rehabilitation", "Neurological rehabilitation", "Sexual and urological rehabilitation", "Pain management", "Sleep disorder diagnosis and treatment"],
      alt: "Dr. Ala Mahamid, director and founder of Sofia Medical",
      name: "Dr. Ala Mahamid",
      role: "Specialist in physical medicine and rehabilitation and expert in sleep disorders",
    },

    treat: {
      title: 'Treatment areas <span class="hl">at Sofia Medical</span>',
      tabsLabel: "Treatment areas", more: "Read more", less: "Less",
      items: {
        rehab: { tab: "Rehabilitation medicine", title: "Advanced rehabilitation medicine", topic: "rehabilitation medicine", paras: [
          "Rehabilitation medicine focuses on improving the function and quality of life of people with a physical disability or impairment caused by illness or injury. The rehabilitation process includes restoring functional abilities, developing compensation strategies and fulfilling each patient's personal potential, with the aim of reaching maximum functional independence and a better quality of life.",
          "Sofia Medical has a multidisciplinary team of rehabilitation physicians, physiotherapists, occupational therapists and other allied health professionals, who work together to build a personalized treatment plan. The center treats patients after a stroke, head injuries, neurological diseases such as multiple sclerosis and Parkinson's, spinal cord injuries, orthopedic injuries, limb amputations, severe fractures, walking difficulties, balance disorders and more.",
          "The rehabilitation process takes into account related factors that affect function and quality of life, including sleep disorders, erectile dysfunction, chronic pain, mental state, trauma, intrusive thoughts and symptoms of PTSD. Treatment combines medical and allied health care, according to the patient's needs and overall condition.",
          "The center uses advanced technologies, including pulsed electromagnetic field therapy, as well as innovative neurological rehabilitation technologies such as recoveriX, designed for patients after a stroke and for people with neurological diseases such as multiple sclerosis.",
        ] },
        pain: { tab: "Pain clinic", title: "Pain clinic in Kfar Saba: a leading pain physician and advanced treatment", topic: "the pain clinic", paras: [
          "Chronic pain affects function, sleep and quality of life. Sofia Medical runs a pain clinic in Kfar Saba that provides advanced pain treatment led by a leading pain physician, with an innovative, multidisciplinary and personalized approach for every type of pain.",
          "We treat back pain, neck pain, chronic pain, nerve (neuropathic) pain, joint pain, fibromyalgia, herniated discs and pain after injuries or surgery, through accurate diagnosis and a deep understanding of the source of the pain.",
          "Treatment combines advanced pain technologies with advanced physiotherapy, acupuncture and drug free treatment wherever possible, including shockwave therapy, TENS, therapeutic ultrasound, low level laser, PEMF and CES. We also offer acupuncture for back pain, neck pain and chronic pain, to improve function and reduce pain.",
          "The multidisciplinary team includes a pain physician, rehabilitation physicians, physiotherapists and acupuncturists, who work together to treat the root of the problem. When needed, the diagnosis and treatment of sleep disorders is also part of the process.",
        ] },
        sleep: { tab: "Sleep disorders", title: "Professional diagnosis and treatment of sleep disorders", topic: "sleep disorder diagnosis and treatment", paras: [
          "Sleep problems directly affect physical health, cognitive function, mood and the ability to cope with pain. Sofia Medical has a professional unit that specializes in accurate diagnosis and targeted treatment of sleep disorders, combining advanced medical knowledge with first class diagnostic technologies.",
          "Diagnosis includes home sleep tests or full tests at the center's sleep institute, measuring parameters such as breathing, brain activity, muscle movements and complex sleep patterns. Once the results are in, a personal treatment plan is built, including guidance for better sleep hygiene, treatment of sleep apnea, fitting of CPAP devices when needed and complementary technologies such as CES to reduce stress and insomnia.",
          "At Sofia Medical, sleep disorders are treated by leading experts in sleep medicine. Alongside advanced diagnosis, we use proven and effective treatments, including CBT-I: cognitive behavioral therapy for insomnia, considered the first line and most effective treatment for chronic sleep problems.",
          "Treatment is tailored to each patient and, when needed, combined with rehabilitation and pain treatment, to improve sleep quality, overall health and daily function.",
        ] },
        physio: { tab: "Physiotherapy", title: "Advanced physiotherapy in Kfar Saba", topic: "physiotherapy", paras: [
          "At Sofia Medical we offer advanced physiotherapy in Kfar Saba as part of a multidisciplinary center for rehabilitation and pain management, with a professional and precise answer for a wide range of conditions.",
          "Treatment is suitable for back pain, neck pain, chronic pain, sports injuries, rehabilitation after surgery, posture problems and movement disorders, with a personal treatment plan to improve function and reduce pain.",
          "The center combines sought after areas of treatment: orthopedic physiotherapy, pelvic floor physiotherapy, physiotherapy for balance and dizziness (vestibular), lymphatic physiotherapy and lymphatic drainage, and advanced neurological rehabilitation.",
          "Treatment combines professional manual therapy, personalized rehabilitation exercise and advanced technologies such as shockwave therapy for heel spurs and pain, TENS, therapeutic ultrasound, low level laser and PEMF, which reduce pain, improve movement and speed up recovery.",
          "As part of the multidisciplinary approach, physiotherapy is combined with a pain physician and a rehabilitation physician, as well as acupuncture for back pain, neck pain and chronic pain, to treat the root of the problem and return the patient to full function.",
        ] },
        recoverix: { tab: "recoveriX", title: "Innovative neurological rehabilitation with RecoveriX", topic: "neurological rehabilitation with recoveriX", paras: [
          "RecoveriX is an advanced neurological rehabilitation technology based on a brain computer interface (BCI) and real time neurofeedback.",
          "During treatment, the patient mentally practices a movement, and the system detects the brain activity with EEG and triggers electrical stimulation and visual feedback, creating a sensorimotor loop that encourages neuroplasticity and functional recovery.",
          "The treatment suits a range of neurological conditions, including rehabilitation after a stroke, traumatic brain injury (TBI), multiple sclerosis (MS) and other nerve injuries, also at chronic stages.",
          "At Sofia Medical we integrate RecoveriX into a multidisciplinary rehabilitation program that includes a rehabilitation physician, physiotherapy and advanced technologies, tailored to each patient, to improve movement, function and quality of life.",
        ] },
      },
    },

    team: {
      title: "Multidisciplinary team",
      intro: "The center has a diverse and skilled team that includes rehabilitation physicians, consultant physicians in various fields, physiotherapists, psychologists, speech therapists, sleep technicians and occupational therapists.",
      idle: "Leading physicians and therapists, each in their own field.",
      people: {
        "ala-mahamid": { name: "Dr. Ala Mahamid", role: "Director and founder of Sofia Medical",
          line: "Senior rehabilitation physician, director of the sleep medicine service for adults and children at Loewenstein Rehabilitation Medical Center" },
        "haitham-abu-nagma": { name: "Dr. Haitham Abu Nagma", role: "Senior urologist",
          line: "Specialist in urological surgery, with extensive experience in diagnosing and treating urological problems and sexual dysfunction" },
        "yarona-shefer-yaakov": { name: "Dr. Yarona Shefer Yaakov", role: "Specialist in pain medicine and family medicine",
          line: "Senior physician at the pain rehabilitation unit of Loewenstein Rehabilitation Medical Center" },
        "vlada-guizman": { name: "Vlada Guizman", role: "Sleep disorders specialist",
          line: "Certified CBT-I therapist and senior sleep technologist" },
        "mursi-asli": { name: "Mursi Asli", role: "Senior physiotherapist and hydrotherapist",
          line: "Experienced physiotherapist in neurological, orthopedic and respiratory rehabilitation, and in treating sports injuries" },
        "hashem-khalifa": { name: "Dr. Hashem Khalifa", role: "Consultant in pediatric rehabilitation",
          line: "Specialist in physical medicine and rehabilitation, director of the pediatric rehabilitation department at Tzafon Medical Center (Poria)" },
      },
    },

    reviews: {
      title: "Testimonials", label: "Patient testimonials", carousel: "carousel", item: "review",
      of: (i, n) => `${i} of ${n}`, live: "Review {n} of {N}",
      prev: "Previous testimonial", next: "Next testimonial",
      items: [
        ["Dr. Ala accompanied me all the way, with patience, knowledge and a humanity you don't see every day.", "Mohammed, Kafr Qara"],
        ["I didn't believe sleep could affect my quality of life so much. Thank you, doctor, for the professional diagnosis and the personal care.", "Dikla, Herzliya"],
        ["The service was fast, precise and caring. I warmly recommend it to anyone who suffers from sleep problems.", "Igor, Netanya"],
        ["I had a series of sleep tests with Dr. Mahamid and received precise treatment that improved my quality of life. I suffered from insomnia for years, and he managed to diagnose a problem that had never been diagnosed before. I recommend him with all my heart!", "Mahmoud, Tayibe"],
        ["I came to Dr. Ala Mahamid, one of the leaders in rehabilitation, after a hard period of pain and weakness. From the very first meeting I felt warmth, attentiveness and rare professionalism.", "Ronit Levi, Kfar Saba"],
        ["Dr. Mahamid changed my life. I finally sleep properly after years of suffering.", "Ahmad, Haifa"],
        ["A true expert! I had trouble falling asleep for a long time, and Dr. Mahamid knew how to ask the right questions, understand my medical background and tailor a personal treatment.", "Nissim, Hadera"],
        ["As a patient with a breathing problem during sleep, I needed a reliable expert to guide me. Dr. Mahamid was precise, calm and very patient. I warmly recommend him!", "Suha, Nazareth"],
        ["From the very first conversation I knew I was in good hands. I got clear answers and excellent treatment.", "Amir, Be'er Sheva"],
      ],
      videosTitle: "Video testimonials",
      videosSub: "Because nothing compares to hearing from people who have been there. The videos are in Hebrew.",
      video: (i) => `Video testimonial ${i}`, play: (i) => `Play video testimonial ${i}`,
    },

    faq: {
      title: "Common questions",
      lead: "Didn't find an answer? Leave your details and we'll get back to you.",
      form: "Leave your details", name: "Full name", phone: "Phone", topic: "Treatment area", choose: "Choose", other: "Other", otherLabel: "Please describe the problem", send: "Send",
      note: 'By sending this form I agree to the <a href="/privacy">privacy policy</a> (in Hebrew).',
      items: [
        ["What is a sleep test and how is it done?", "A sleep test examines the sleep stages, breathing, brain activity, body movements and blood oxygen saturation during the night. The test can be done at the center's sleep institute or at the patient's home, depending on the medical condition and need."],
        ["Can a sleep test be done at home?", "Absolutely. The center provides advanced systems for home sleep tests, including full guidance and the support of a medical technician. The home test takes place in the patient's natural environment, for reliable results and maximum comfort."],
        ["Who is outpatient rehabilitation suitable for?", "Outpatient rehabilitation is suitable for patients in a stable medical condition who can come to the center on their own or with family members or a companion. It is an ideal solution for those who want to keep living at home while receiving professional and continuous treatment."],
        ["How long does rehabilitation take?", "The length of rehabilitation depends on the type of injury and the functional condition. It is usually a process of several weeks to months, with periodic assessments and adjustment of the plan according to the patient's progress."],
        ["Can sleep treatment be combined with rehabilitation?", "Absolutely. This is one of the advantages of Sofia Medical: a holistic approach that treats the rehabilitation problem as well as the sleep and mental aspects, as one whole."],
        ["Are the treatments safe?", "Yes. Every treatment is carried out under full medical supervision by a certified team, in line with the professional guidelines of the Ministry of Health."],
      ],
    },

    footer: {
      home: "Sofia Medical, top of page", name: "Sofia Medical",
      tag: "Rehabilitation, pain management and sleep disorders, led by Dr. Ala Mahamid",
      onPage: "On this page", areas: "Treatment areas", contact: "Get in touch",
      mobile: "Mobile", landline: "Clinic", email: "Email",
      rights: (y) => `Copyright © ${y} Sofia Medical. All rights reserved.`,
      credit: 'Organic SEO: <span dir="ltr">TZD SEO</span>',
      legal: [["Terms of use", "/terms"], ["Privacy", "/privacy"], ["Accessibility", "/accessibility"]],
    },
  },

  // Russian. Hyphenated terms are reworded or written without the hyphen
  // (the site's no dash rule); "Др." in name labels, "доктор" in running text.
  ru: {
    title: "Sofia Medical | Реабилитация, лечение боли и медицина сна в Кфар Саве",
    description: "Sofia Medical в Кфар Саве: медицинская реабилитация, физиотерапия, лечение боли и нарушений сна. Многопрофильная команда под руководством доктора Ала Махамида.",
    locale: "ru-RU",
    address: "ул. Йоханан ха Сандлар 6, 5 этаж, Кфар Сава",
    newWin: " (откроется в новом окне)",
    he: " (на иврите)",
    menu: "Меню", close: "Закрыть меню", navLabel: "Главное меню",
    nav: [
      ["О центре", "#about-title"], ["Лечение", "#treat-title"], ["Команда", "#team-title"],
      ["Отзывы", "#reviews-title"], ["Вопросы", "#faq-title"],
    ],
    wa: "WhatsApp", waLong: "Написать в WhatsApp", call: "Позвонить", ask: "Спросить в WhatsApp", cardMore: "Написать нам",
    waHello: "Здравствуйте, хочу узнать подробнее о Sofia Medical",
    waAbout: (topic) => `Здравствуйте, хочу узнать подробнее: ${topic}`,

    hero: {
      brand: "Sofia Medical:",
      h1: "Ведущий центр в Израиле по реабилитации, лечению боли и нарушений сна",
      lead: "Передовая медицина, команда специалистов и индивидуальные решения для улучшения здоровья и функционирования пациентов",
    },
    insureNav: "Выбор соглашения",
    insure: {
      clalit: { name: "Клалит Мушлам", alt: "Клалит Мушлам",
        text: "Медицинская консультация у доктора Ала Махамида по реабилитации и медицине сна, с доплатой 150 шекелей, при наличии права и в соответствии с условиями соглашения." },
      bwell: { name: "BWell и Мигдаль", alt: "BWell от Мигдаль",
        text: "Медицинская консультация по лечению боли (доктор Ярона), консультация уролога (доктор Хайтам) и физиотерапия, с доплатой и в соответствии с условиями полиса." },
    },
    insureWith: "Соглашение с",
    strip: { label: "Соглашения с больничными кассами и страховыми компаниями", title: "Соглашения с Клалит Мушлам, BWell и Мигдаль", sub: " Медицинская консультация с доплатой", close: "Закрыть сообщение" },

    servicesTitle: "Наши услуги",
    services: [
      { name: "Передовая медицинская реабилитация", topic: "медицинская реабилитация" },
      { name: "Лечение боли", topic: "лечение боли" },
      { name: "Диагностика и лечение нарушений сна", topic: "диагностика и лечение нарушений сна" },
      { name: "Современная физиотерапия", topic: "физиотерапия" },
      { name: "Неврологическая реабилитация с recoveriX", topic: "неврологическая реабилитация с recoveriX" },
      { name: "Сексуальная и урологическая реабилитация", topic: "сексуальная и урологическая реабилитация" },
    ],

    about: {
      title: 'О <span class="hl">центре</span>',
      lead: '«Sofia Medical» является <strong>современным частным медицинским центром в Кфар Саве</strong>, который специализируется на амбулаторной реабилитации, современной физиотерапии, физиотерапевтическом лечении, ортопедической, неврологической, сексуальной и урологической реабилитации, лечении боли, а также диагностике и лечении нарушений сна.',
      body: "Центром руководит доктор Ала Махамид, специалист по физической медицине и реабилитации и эксперт по нарушениям сна. Центр оказывает современные медицинские и реабилитационные услуги взрослым и детям силами многопрофильной команды и с применением инновационных технологий.",
      tickerLabel: "Направления",
      ticker: ["Амбулаторная реабилитация", "Современная физиотерапия", "Ортопедическая реабилитация", "Неврологическая реабилитация", "Сексуальная и урологическая реабилитация", "Лечение боли", "Диагностика и лечение нарушений сна"],
      alt: "Доктор Ала Махамид, директор и основатель Sofia Medical",
      name: "Др. Ала Махамид",
      role: "Специалист по физической медицине и реабилитации, эксперт по нарушениям сна",
    },

    treat: {
      title: 'Направления лечения <span class="hl">в Sofia Medical</span>',
      tabsLabel: "Направления лечения", more: "Читать далее", less: "Свернуть",
      items: {
        rehab: { tab: "Реабилитация", title: "Передовая реабилитационная медицина", topic: "реабилитационная медицина", paras: [
          "Реабилитационная медицина направлена на улучшение функционирования и качества жизни людей с физическими ограничениями или инвалидностью, вызванными болезнью или травмой. Процесс реабилитации включает восстановление функциональных возможностей, выработку компенсаторных стратегий и раскрытие личного потенциала каждого пациента, чтобы достичь максимальной самостоятельности и улучшить качество жизни.",
          "В Sofia Medical работает многопрофильная команда: реабилитологи, физиотерапевты, эрготерапевты и другие специалисты смежных профессий, которые вместе составляют индивидуальный план лечения. Центр помогает пациентам после инсульта и травм головы, при неврологических заболеваниях, таких как рассеянный склероз и болезнь Паркинсона, при травмах позвоночника, ортопедических травмах, ампутациях конечностей, тяжёлых переломах, трудностях при ходьбе, нарушениях равновесия и не только.",
          "Процесс реабилитации учитывает сопутствующие факторы, которые влияют на функционирование и качество жизни, в том числе нарушения сна, эректильную дисфункцию, хроническую боль, психическое состояние, травматический опыт, навязчивые мысли и симптомы ПТСР. Лечение сочетает медицинскую помощь и помощь смежных специалистов в соответствии с потребностями и общим состоянием пациента.",
          "В центре применяются передовые технологии, в том числе терапия импульсным электромагнитным полем, а также инновационные технологии неврологической реабилитации, такие как recoveriX, предназначенные для пациентов после инсульта и людей с неврологическими заболеваниями, например рассеянным склерозом.",
        ] },
        pain: { tab: "Клиника боли", title: "Клиника боли в Кфар Саве: ведущий специалист и современное лечение", topic: "клиника боли", paras: [
          "Хроническая боль влияет на функционирование, сон и качество жизни. В Sofia Medical работает клиника боли в Кфар Саве, где проводится современное лечение боли под руководством ведущего специалиста по лечению боли, с инновационным, многопрофильным и индивидуальным подходом к любому виду боли.",
          "Мы лечим боли в спине и шее, хроническую боль, нервную (нейропатическую) боль, боли в суставах, фибромиалгию, грыжи межпозвонковых дисков и боль после травм или операций, опираясь на точную диагностику и глубокое понимание источника боли.",
          "Лечение сочетает передовые технологии лечения боли с современной физиотерапией, иглоукалыванием и, по возможности, безлекарственными методами, включая терапию ударными волнами, TENS, терапевтический ультразвук, низкоинтенсивный лазер, PEMF и CES. Мы также предлагаем иглоукалывание при болях в спине, шее и хронической боли, чтобы улучшить функционирование и уменьшить боль.",
          "В многопрофильную команду входят специалист по лечению боли, реабилитологи, физиотерапевты и специалисты по иглоукалыванию, которые вместе устраняют причину проблемы. При необходимости в процесс также включаются диагностика и лечение нарушений сна.",
        ] },
        sleep: { tab: "Нарушения сна", title: "Профессиональная диагностика и лечение нарушений сна", topic: "диагностика и лечение нарушений сна", paras: [
          "Проблемы со сном напрямую влияют на физическое здоровье, когнитивные функции, настроение и способность справляться с болью. В Sofia Medical работает профессиональное подразделение, которое специализируется на точной диагностике и целенаправленном лечении нарушений сна и сочетает современные медицинские знания с диагностическими технологиями высшего класса.",
          "Диагностика включает домашние исследования сна или полные исследования в институте сна нашего центра, при которых измеряются дыхание, активность мозга, движения мышц и сложные паттерны сна. После получения результатов составляется индивидуальный план лечения: рекомендации по гигиене сна, лечение апноэ сна, подбор аппаратов CPAP при необходимости и дополнительные технологии, такие как CES, для снижения стресса и борьбы с бессонницей.",
          "В Sofia Medical нарушения сна лечат ведущие специалисты в области медицины сна. Наряду с современной диагностикой мы применяем проверенные и эффективные методы, в том числе CBT-I: когнитивную и поведенческую терапию бессонницы, которая считается первой линией и самым эффективным методом лечения хронических проблем со сном.",
          "Лечение подбирается индивидуально и при необходимости сочетается с реабилитацией и лечением боли, чтобы улучшить качество сна, общее здоровье и повседневное функционирование.",
        ] },
        physio: { tab: "Физиотерапия", title: "Современная физиотерапия в Кфар Саве", topic: "физиотерапия", paras: [
          "В Sofia Medical мы предлагаем современную физиотерапию в Кфар Саве как часть многопрофильного центра реабилитации и лечения боли, с профессиональной и точной помощью при широком спектре состояний.",
          "Лечение подходит при болях в спине и шее, хронической боли, спортивных травмах, реабилитации после операций, проблемах осанки и нарушениях движения, с индивидуальным планом лечения для улучшения функционирования и уменьшения боли.",
          "В центре представлены востребованные направления: ортопедическая физиотерапия, физиотерапия тазового дна, физиотерапия при нарушениях равновесия и головокружениях (вестибулярная), лимфатическая физиотерапия и лимфодренаж, а также современная неврологическая реабилитация.",
          "Лечение сочетает профессиональную мануальную терапию, индивидуальные реабилитационные упражнения и передовые технологии, такие как терапия ударными волнами при пяточной шпоре и болях, TENS, терапевтический ультразвук, низкоинтенсивный лазер и PEMF, которые уменьшают боль, улучшают подвижность и ускоряют восстановление.",
          "В рамках многопрофильного подхода физиотерапия сочетается с работой специалиста по лечению боли и реабилитолога, а также с иглоукалыванием при болях в спине, шее и хронической боли, чтобы устранить причину проблемы и вернуть пациента к полноценной жизни.",
        ] },
        recoverix: { tab: "recoveriX", title: "Инновационная неврологическая реабилитация с RecoveriX", topic: "неврологическая реабилитация с recoveriX", paras: [
          "RecoveriX представляет собой передовую технологию неврологической реабилитации, основанную на нейрокомпьютерном интерфейсе (BCI) и нейробиоуправлении в реальном времени.",
          "Во время процедуры пациент мысленно представляет движение, а система распознаёт активность мозга с помощью ЭЭГ и запускает электростимуляцию и визуальную обратную связь. Так создаётся сенсомоторная петля, которая способствует нейропластичности и восстановлению функций.",
          "Метод подходит при различных неврологических состояниях, включая реабилитацию после инсульта, травматические повреждения головного мозга (TBI), рассеянный склероз (MS) и другие повреждения нервов, в том числе на хронических стадиях.",
          "В Sofia Medical мы включаем RecoveriX в программу многопрофильной реабилитации, в которую входят реабилитолог, физиотерапия и передовые технологии, с индивидуальным подбором для каждого пациента, чтобы улучшить движения, функционирование и качество жизни.",
        ] },
      },
    },

    team: {
      title: "Команда специалистов",
      intro: "В центре работает разносторонняя и опытная команда: реабилитологи, консультирующие врачи разных специальностей, физиотерапевты, психологи, логопеды, техники по исследованию сна и эрготерапевты.",
      idle: "Ведущие врачи и специалисты, каждый в своей области.",
      people: {
        "ala-mahamid": { name: "Др. Ала Махамид", role: "Директор и основатель Sofia Medical",
          line: "Ведущий реабилитолог, руководитель службы медицины сна для взрослых и детей в реабилитационном медицинском центре Левинштейн" },
        "haitham-abu-nagma": { name: "Др. Хайтам Абу Нагма", role: "Старший уролог",
          line: "Специалист по урологической хирургии с большим опытом диагностики и лечения урологических проблем и сексуальной дисфункции" },
        "yarona-shefer-yaakov": { name: "Др. Ярона Шефер Яаков", role: "Специалист по медицине боли и семейной медицине",
          line: "Старший врач отделения реабилитации боли в реабилитационном медицинском центре Левинштейн" },
        "vlada-guizman": { name: "Влада Гуйзман", role: "Специалист по нарушениям сна",
          line: "Сертифицированный специалист по CBT-I и старший технолог по исследованию сна" },
        "mursi-asli": { name: "Мурси Асли", role: "Старший физиотерапевт и гидротерапевт",
          line: "Опытный физиотерапевт в области неврологической, ортопедической и респираторной реабилитации, а также лечения спортивных травм" },
        "hashem-khalifa": { name: "Др. Хашем Халифа", role: "Консультант по детской реабилитации",
          line: "Специалист по физической медицине и реабилитации, заведующий отделением детской реабилитации в медицинском центре Цафон (Пория)" },
      },
    },

    reviews: {
      title: "Отзывы", label: "Отзывы пациентов", carousel: "карусель", item: "отзыв",
      of: (i, n) => `${i} из ${n}`, live: "Отзыв {n} из {N}",
      prev: "Предыдущий отзыв", next: "Следующий отзыв",
      items: [
        ["Доктор Ала сопровождал меня на всём пути, с терпением, знаниями и человечностью, которую встречаешь не каждый день.", "Мохаммед, Кафр Кара"],
        ["Я не верила, что сон может так сильно влиять на качество моей жизни. Спасибо доктору за профессиональную диагностику и личное отношение.", "Дикла, Герцлия"],
        ["Обслуживание было быстрым, точным и заботливым. Горячо рекомендую всем, кто страдает от проблем со сном.", "Игорь, Нетания"],
        ["Я прошёл серию исследований сна у доктора Махамида и получил точное лечение, которое улучшило качество моей жизни. Я годами страдал от бессонницы, и ему удалось диагностировать проблему, которую раньше не выявляли. Рекомендую от всего сердца!", "Махмуд, Тайбе"],
        ["Я пришла к доктору Махамиду, одному из ведущих специалистов в области реабилитации, после тяжёлого периода болей и слабости. С первой же встречи я почувствовала тёплое отношение, внимание и редкий профессионализм.", "Ронит Леви, Кфар Сава"],
        ["Доктор Махамид изменил мою жизнь. Наконец я нормально сплю после многих лет мучений.", "Ахмад, Хайфа"],
        ["Настоящий эксперт! Я долго не мог заснуть, а доктор Махамид сумел задать правильные вопросы, понять мою медицинскую историю и подобрать индивидуальное лечение.", "Ниссим, Хадера"],
        ["Как пациентке с нарушением дыхания во сне, мне нужен был надёжный специалист, который сможет меня направить. Доктор Махамид был точен, спокоен и очень терпелив. Горячо рекомендую!", "Суха, Назарет"],
        ["Уже с первого разговора я знал, что нахожусь в надёжных руках. Получил чёткие ответы и отличное лечение.", "Амир, Беэр Шева"],
      ],
      videosTitle: "Видеоотзывы",
      videosSub: "Ведь нет ничего лучше, чем услышать тех, кто уже прошёл этот путь. Видео на иврите.",
      video: (i) => `Видеоотзыв ${i}`, play: (i) => `Воспроизвести видеоотзыв ${i}`,
    },

    faq: {
      title: "Частые вопросы",
      lead: "Не нашли ответ? Оставьте свои данные, и мы с вами свяжемся.",
      form: "Оставить заявку", name: "Имя и фамилия", phone: "Телефон", topic: "Направление лечения", choose: "Выберите", other: "Другое", otherLabel: "Опишите, пожалуйста, проблему", send: "Отправить",
      note: 'Отправляя форму, я соглашаюсь с <a href="/privacy">политикой конфиденциальности</a> (на иврите).',
      items: [
        ["Что такое исследование сна и как оно проводится?", "Исследование сна оценивает стадии сна, дыхание, активность мозга, движения тела и насыщение крови кислородом в течение ночи. Его можно пройти в институте сна нашего центра или дома, в зависимости от состояния здоровья и потребностей."],
        ["Можно ли пройти исследование сна дома?", "Конечно. Центр предоставляет современные системы для домашних исследований сна, включая полный инструктаж и сопровождение медицинского техника. Домашнее исследование проходит в привычной для пациента обстановке, что обеспечивает надёжные результаты и максимальный комфорт."],
        ["Кому подходит амбулаторная реабилитация?", "Амбулаторная реабилитация подходит пациентам в стабильном состоянии, которые могут приходить в центр самостоятельно или в сопровождении родственников или помощника. Это идеальное решение для тех, кто хочет продолжать жить дома и при этом получать профессиональное и непрерывное лечение."],
        ["Сколько длится реабилитация?", "Продолжительность реабилитации зависит от вида травмы и функционального состояния. Обычно это процесс от нескольких недель до нескольких месяцев, с периодической оценкой и корректировкой плана в зависимости от прогресса пациента."],
        ["Можно ли совместить лечение сна с реабилитацией?", "Конечно. В этом одно из преимуществ Sofia Medical: целостный подход, который охватывает и реабилитацию, и вопросы сна и психического состояния как единое целое."],
        ["Безопасны ли процедуры?", "Да. Каждая процедура проводится под полным медицинским контролем сертифицированной команды, в соответствии с профессиональными рекомендациями Министерства здравоохранения."],
      ],
    },

    footer: {
      home: "Sofia Medical, в начало страницы", name: "Sofia Medical",
      tag: "Реабилитация, лечение боли и нарушений сна под руководством доктора Ала Махамида",
      onPage: "На этой странице", areas: "Направления лечения", contact: "Связаться с нами",
      mobile: "Мобильный", landline: "Клиника", email: "Эл. почта",
      rights: (y) => `© ${y} Sofia Medical. Все права защищены.`,
      credit: 'Органическое продвижение: <span dir="ltr">TZD SEO</span>',
      legal: [["Условия использования", "/terms"], ["Конфиденциальность", "/privacy"], ["Доступность", "/accessibility"]],
    },
  },
  // Arabic (right to left: same layout as the Hebrew site). Brand written
  // صوفيا ميديكال in the text; Latin terms are isolated by bidiHtml().
  ar: {
    title: "صوفيا ميديكال | تأهيل، علاج الألم وطب النوم في كفار سابا",
    description: "صوفيا ميديكال في كفار سابا: تأهيل طبي، علاج طبيعي، علاج الألم واضطرابات النوم، مع فريق متعدد التخصصات بقيادة د. علاء محاميد.",
    locale: "ar",
    address: "شارع يوحنان هسندلار 6، الطابق 5، كفار سابا",
    newWin: " (يفتح في نافذة جديدة)",
    he: " (بالعبرية)",
    menu: "القائمة", close: "إغلاق القائمة", navLabel: "القائمة الرئيسية",
    nav: [
      ["عن المركز", "#about-title"], ["العلاجات", "#treat-title"], ["الفريق", "#team-title"],
      ["التوصيات", "#reviews-title"], ["أسئلة شائعة", "#faq-title"],
    ],
    wa: "واتساب", waLong: "راسلونا عبر واتساب", call: "اتصلوا الآن", ask: "اسألوا عبر واتساب", cardMore: "راسلونا",
    waHello: "مرحبًا، أود الحصول على معلومات عن صوفيا ميديكال",
    waAbout: (topic) => `مرحبًا، أود الحصول على معلومات عن ${topic}`,

    hero: {
      brand: "صوفيا ميديكال:",
      h1: "مركز رائد في إسرائيل للتأهيل وعلاج الألم واضطرابات النوم",
      lead: "طب متقدم، فريق من الخبراء وحلول مخصصة لتحسين أداء المرضى وصحتهم",
    },
    insureNav: "اختيار الاتفاقية",
    insure: {
      clalit: { name: "كلاليت مشلام", alt: "كلاليت مشلام",
        text: "استشارة طبية لدى د. علاء محاميد في مجالي التأهيل وطب النوم، بمشاركة ذاتية قدرها 150 شيكل، وفقًا للأهلية وشروط الاتفاقية." },
      bwell: { name: "BWell ومجدال", alt: "BWell من مجدال",
        text: "استشارة طبية في مجال طب الألم (د. يارونا)، استشارة في المسالك البولية (د. هيثم) وعلاجات طبيعية، بمشاركة ذاتية ووفقًا لشروط البوليصة." },
    },
    insureWith: "اتفاقية مع",
    strip: { label: "اتفاقيات مع صناديق المرضى وشركات التأمين", title: "اتفاقيات مع كلاليت مشلام، BWell ومجدال", sub: " استشارة طبية بمشاركة ذاتية", close: "إغلاق الرسالة" },

    servicesTitle: "خدماتنا",
    services: [
      { name: "طب تأهيلي متقدم", topic: "الطب التأهيلي" },
      { name: "علاج الألم", topic: "علاج الألم" },
      { name: "تشخيص وعلاج اضطرابات النوم", topic: "تشخيص وعلاج اضطرابات النوم" },
      { name: "علاج طبيعي متقدم", topic: "العلاج الطبيعي" },
      { name: "تأهيل عصبي بتقنية recoveriX", topic: "التأهيل العصبي بتقنية recoveriX" },
      { name: "تأهيل جنسي وبولي", topic: "التأهيل الجنسي والبولي" },
    ],

    about: {
      title: 'عن <span class="hl">المركز</span>',
      lead: '"صوفيا ميديكال" هو <strong>مركز طبي خاص ومتقدم في كفار سابا</strong>، متخصص في التأهيل الخارجي، العلاج الطبيعي المتقدم، علاجات العلاج الطبيعي، التأهيل العظمي، التأهيل العصبي، التأهيل الجنسي والبولي، علاج الألم وتشخيص وعلاج اضطرابات النوم.',
      body: "يعمل المركز بقيادة د. علاء محاميد، أخصائي الطب الفيزيائي والتأهيل وخبير اضطرابات النوم، ويقدم خدمات طبية وتأهيلية متقدمة للبالغين والأطفال من خلال فريق متعدد التخصصات وتقنيات مبتكرة.",
      tickerLabel: "مجالات التخصص",
      ticker: ["التأهيل الخارجي", "العلاج الطبيعي المتقدم", "التأهيل العظمي", "التأهيل العصبي", "التأهيل الجنسي والبولي", "علاج الألم", "تشخيص وعلاج اضطرابات النوم"],
      alt: "د. علاء محاميد، مدير ومؤسس مركز صوفيا ميديكال",
      name: "د. علاء محاميد",
      role: "أخصائي الطب الفيزيائي والتأهيل وخبير اضطرابات النوم",
    },

    treat: {
      title: 'مجالات العلاج <span class="hl">في صوفيا ميديكال</span>',
      tabsLabel: "مجالات العلاج", more: "مواصلة القراءة", less: "أقل",
      items: {
        rehab: { tab: "الطب التأهيلي", title: "طب تأهيلي متقدم", topic: "الطب التأهيلي", paras: [
          "يركز طب التأهيل على تحسين الأداء الوظيفي وجودة الحياة لدى الأشخاص الذين يعانون من محدودية جسدية أو إعاقة ناتجة عن مرض أو إصابة. تشمل عملية التأهيل استعادة القدرات الوظيفية، وتطوير استراتيجيات تعويضية، واستثمار الإمكانات الشخصية لكل مريض، بهدف تحقيق أقصى قدر من الاستقلالية الوظيفية وتحسين جودة الحياة.",
          "يعمل في صوفيا ميديكال فريق متعدد التخصصات يضم أطباء تأهيل، ومعالجين طبيعيين، ومعالجين وظيفيين، ومهنيين آخرين في المهن الطبية المساندة، يعملون معًا لبناء خطة علاج مخصصة. يقدم المركز العلاج للمرضى بعد السكتة الدماغية، وإصابات الرأس، والأمراض العصبية مثل التصلب المتعدد وباركنسون، وإصابات العمود الفقري، والإصابات العظمية، وبتر الأطراف، والكسور الصعبة، وصعوبات المشي، واضطرابات التوازن وغيرها.",
          "تتم عملية التأهيل مع مراعاة العوامل المصاحبة التي تؤثر على الأداء وجودة الحياة، ومنها اضطرابات النوم، وضعف الانتصاب، والألم المزمن، والحالة النفسية، والصدمات النفسية، والأفكار الوسواسية وأعراض اضطراب ما بعد الصدمة. يُقدَّم العلاج بنهج يجمع بين الرعاية الطبية والمهن الطبية المساندة، وفقًا لاحتياجات المريض وحالته العامة.",
          "يستخدم المركز تقنيات متقدمة، منها العلاج بالنبضات الكهرومغناطيسية، إلى جانب تقنيات مبتكرة للتأهيل العصبي مثل recoveriX، المخصصة للمرضى بعد السكتة الدماغية ولمرضى الأمراض العصبية مثل التصلب المتعدد.",
        ] },
        pain: { tab: "عيادة الألم", title: "عيادة الألم في كفار سابا: طبيب ألم رائد وعلاج متقدم", topic: "عيادة الألم", paras: [
          "يؤثر الألم المزمن على الأداء والنوم وجودة الحياة. تعمل في صوفيا ميديكال عيادة للألم في كفار سابا تقدم علاجًا متقدمًا للألم بقيادة طبيب ألم رائد، بنهج مبتكر ومتعدد التخصصات ومخصص لكل مريض، مع حلول لجميع أنواع الألم.",
          "نعالج آلام الظهر، وآلام الرقبة، والآلام المزمنة، والألم العصبي، وآلام المفاصل، والفيبروميالغيا، والانزلاق الغضروفي، والألم بعد الإصابات أو العمليات الجراحية، من خلال تشخيص دقيق وفهم عميق لمصدر الألم.",
          "يجمع العلاج بين تقنيات متقدمة لعلاج الألم والعلاج الطبيعي المتقدم والوخز بالإبر الصينية والعلاج دون أدوية قدر الإمكان، بما في ذلك العلاج بموجات الصدمة، والموجات فوق الصوتية العلاجية، والليزر منخفض الشدة، وتقنيات TENS و PEMF و CES. كما نقدم الوخز بالإبر لآلام الظهر والرقبة والألم المزمن لتحسين الأداء وتخفيف الألم.",
          "يضم الفريق متعدد التخصصات طبيب ألم، وأطباء تأهيل، ومعالجين طبيعيين، ومعالجين بالوخز بالإبر، يعملون معًا لعلاج جذور المشكلة. وعند الحاجة، يُدمج تشخيص وعلاج اضطرابات النوم كجزء من العملية.",
        ] },
        sleep: { tab: "اضطرابات النوم", title: "تشخيص وعلاج مهني لاضطرابات النوم", topic: "تشخيص وعلاج اضطرابات النوم", paras: [
          "تؤثر مشاكل النوم بشكل مباشر على الصحة الجسدية والأداء الإدراكي والمزاج والقدرة على التعامل مع الألم. تعمل في صوفيا ميديكال وحدة مهنية متخصصة في التشخيص الدقيق والعلاج الموجّه لاضطرابات النوم، تجمع بين المعرفة الطبية المتقدمة وتقنيات تشخيص من الطراز الأول.",
          "يشمل التشخيص فحوصات نوم منزلية أو فحوصات كاملة في معهد النوم التابع للمركز، تُقاس فيها مؤشرات مثل التنفس ونشاط الدماغ وحركات العضلات وأنماط النوم المعقدة. وبعد الحصول على النتائج، تُبنى خطة علاج شخصية تشمل الإرشاد لتحسين عادات النوم، وعلاج انقطاع النفس أثناء النوم، وملاءمة أجهزة CPAP عند الحاجة، ودمج تقنيات مكمّلة مثل CES لتقليل التوتر والأرق.",
          "في صوفيا ميديكال يُقدَّم علاج مهني لاضطرابات النوم على يد خبراء رائدين في طب النوم. وإلى جانب التشخيص المتقدم، نستخدم علاجات مثبتة وفعالة، منها CBT-I: العلاج المعرفي السلوكي للأرق، الذي يُعد خط العلاج الأول والأكثر فعالية لمشاكل النوم المزمنة.",
          "يُصمَّم العلاج لكل مريض على حدة، ويُدمج عند الحاجة مع التأهيل وعلاج الألم، بهدف تحسين جودة النوم والصحة العامة والأداء اليومي.",
        ] },
        physio: { tab: "العلاج الطبيعي", title: "علاج طبيعي متقدم في كفار سابا", topic: "العلاج الطبيعي", paras: [
          "نقدم في صوفيا ميديكال علاجًا طبيعيًا متقدمًا في كفار سابا كجزء من مركز متعدد التخصصات للتأهيل وعلاج الألم، مع استجابة مهنية ودقيقة لمجموعة واسعة من الحالات.",
          "يناسب العلاج آلام الظهر، وآلام الرقبة، والألم المزمن، والإصابات الرياضية، والتأهيل بعد العمليات الجراحية، ومشاكل القوام واضطرابات الحركة، مع بناء خطة علاج شخصية لتحسين الأداء وتخفيف الألم.",
          "نجمع في المركز مجالات علاج مطلوبة: العلاج الطبيعي العظمي، والعلاج الطبيعي لقاع الحوض، والعلاج الطبيعي للتوازن والدوار (الدهليزي)، والعلاج الطبيعي اللمفاوي والتصريف اللمفاوي، والتأهيل العصبي المتقدم.",
          "يشمل العلاج مزيجًا من العلاج اليدوي المهني، والتمارين التأهيلية المخصصة، والتقنيات المتقدمة مثل العلاج بموجات الصدمة لمهماز العقب والآلام، والموجات فوق الصوتية العلاجية، والليزر منخفض الشدة، وتقنيتي TENS و PEMF، التي تخفف الألم وتحسّن الحركة وتسرّع التعافي.",
          "في إطار النهج متعدد التخصصات، يُدمج العلاج الطبيعي مع طبيب ألم وطبيب تأهيل، ومع الوخز بالإبر لآلام الظهر والرقبة والألم المزمن، بهدف علاج جذور المشكلة وإعادة المريض إلى أداء كامل.",
        ] },
        recoverix: { tab: "recoveriX", title: "تأهيل عصبي مبتكر بتقنية RecoveriX", topic: "التأهيل العصبي بتقنية recoveriX", paras: [
          "تقنية RecoveriX هي تقنية متقدمة للتأهيل العصبي تعتمد على واجهة الدماغ والحاسوب (BCI) والارتجاع العصبي في الوقت الحقيقي.",
          "خلال العلاج يتخيّل المريض الحركة ذهنيًا، فيرصد النظام نشاط الدماغ بواسطة EEG ويفعّل تحفيزًا كهربائيًا وتغذية راجعة بصرية، مما يخلق حلقة حسية حركية تعزز المرونة العصبية والتعافي الوظيفي.",
          "يناسب العلاج مجموعة متنوعة من الحالات العصبية، منها التأهيل بعد السكتة الدماغية، وإصابات الدماغ الرضحية (TBI)، والتصلب المتعدد (MS) وإصابات عصبية أخرى، حتى في المراحل المزمنة.",
          "في صوفيا ميديكال ندمج RecoveriX ضمن برنامج تأهيل متعدد التخصصات يشمل طبيب تأهيل، وعلاجًا طبيعيًا، وتقنيات متقدمة، بما يتلاءم مع كل مريض، بهدف تحسين الحركة والأداء وجودة الحياة.",
        ] },
      },
    },

    team: {
      title: "فريق متعدد التخصصات",
      intro: "يعمل في المركز فريق متنوع وماهر يضم: أطباء تأهيل، وأطباء استشاريين في مجالات مختلفة، ومعالجين طبيعيين، وأخصائيين نفسيين، ومعالجي نطق ولغة، وفنيي نوم، ومعالجين وظيفيين.",
      idle: "أطباء ومعالجون رائدون، كلٌّ في مجاله.",
      people: {
        "ala-mahamid": { name: "د. علاء محاميد", role: "مدير ومؤسس مركز صوفيا ميديكال",
          line: "طبيب تأهيل كبير، مدير خدمة طب النوم للبالغين والأطفال في مركز لوينشتاين الطبي للتأهيل" },
        "haitham-abu-nagma": { name: "د. هيثم أبو نجمة", role: "أخصائي مسالك بولية كبير",
          line: "أخصائي في جراحة المسالك البولية، ذو خبرة واسعة في تشخيص وعلاج مشاكل المسالك البولية واضطرابات الأداء الجنسي" },
        "yarona-shefer-yaakov": { name: "د. يارونا شيفر يعكوف", role: "أخصائية في طب الألم وطب العائلة",
          line: "طبيبة كبيرة في وحدة تأهيل الألم في مركز لوينشتاين الطبي للتأهيل" },
        "vlada-guizman": { name: "فلادا غويزمان", role: "أخصائية في اضطرابات النوم",
          line: "معالجة معتمدة في CBT-I وتقنية نوم كبيرة" },
        "mursi-asli": { name: "مرسي عسلي", role: "معالج طبيعي ومعالج مائي كبير",
          line: "معالج طبيعي ذو خبرة واسعة في التأهيل العصبي والعظمي والتنفسي، وفي علاج الإصابات الرياضية" },
        "hashem-khalifa": { name: "د. هاشم خليفة", role: "استشاري في مجال تأهيل الأطفال",
          line: "أخصائي في الطب الفيزيائي والتأهيل، مدير قسم تأهيل الأطفال في المركز الطبي تسافون (بوريا)" },
      },
    },

    reviews: {
      title: "التوصيات", label: "توصيات المرضى", carousel: "عرض متحرك", item: "توصية",
      of: (i, n) => `${i} من ${n}`, live: "توصية {n} من {N}",
      prev: "التوصية السابقة", next: "التوصية التالية",
      items: [
        ["رافقني د. علاء طوال الطريق، بصبر ومعرفة وإنسانية لا تراها كل يوم.", "محمد، كفر قرع"],
        ["لم أصدق أن النوم يمكن أن يؤثر إلى هذا الحد على جودة حياتي، شكرًا للدكتور على التشخيص المهني والمعاملة الشخصية.", "دكلا، هرتسليا"],
        ["كانت الخدمة سريعة ودقيقة ومهتمة. أوصي بها بشدة لكل من يعاني من مشاكل النوم.", "إيغور، نتانيا"],
        ["خضعت لسلسلة من فحوصات النوم لدى د. محاميد، وحصلت على علاج دقيق حسّن جودة حياتي. عانيت لسنوات من الأرق، ونجح في تشخيص مشكلة لم تُشخَّص من قبل. أوصي به من كل قلبي!", "محمود، الطيبة"],
        ["وصلت إلى د. علاء محاميد، من رواد مجال التأهيل، بعد فترة صعبة من الآلام والضعف. منذ اللقاء الأول شعرت بمعاملة دافئة وإصغاء ومهنية نادرة.", "رونيت ليفي، كفار سابا"],
        ["د. محاميد غيّر حياتي. أخيرًا أنام كما يجب بعد سنوات من المعاناة.", "أحمد، حيفا"],
        ["خبير حقيقي! عانيت من صعوبة في النوم لفترة طويلة، وعرف د. محاميد كيف يطرح الأسئلة الصحيحة، ويفهم خلفيتي الطبية، ويلائم لي علاجًا شخصيًا.", "نسيم، الخضيرة"],
        ["كمريضة تعاني من مشكلة في التنفس أثناء النوم، كنت بحاجة إلى خبير موثوق يرشدني. كان د. محاميد دقيقًا وهادئًا وصبورًا جدًا. أوصي به بشدة!", "سهى، الناصرة"],
        ["منذ المحادثة الأولى عرفت أنني في أيدٍ أمينة. حصلت على إجابات واضحة وعلاج ممتاز.", "أمير، بئر السبع"],
      ],
      videosTitle: "توصيات بالفيديو",
      videosSub: "لأنه لا شيء يضاهي الاستماع إلى من مرّوا بالتجربة. مقاطع الفيديو بالعبرية.",
      video: (i) => `توصية بالفيديو ${i}`, play: (i) => `تشغيل توصية الفيديو ${i}`,
    },

    faq: {
      title: "أسئلة شائعة",
      lead: "لم تجدوا إجابة؟ اتركوا تفاصيلكم وسنعود إليكم.",
      form: "ترك التفاصيل", name: "الاسم الكامل", phone: "الهاتف", topic: "مجال العلاج", choose: "اختيار", other: "أخرى", otherLabel: "يرجى وصف المشكلة", send: "إرسال",
      note: 'بإرسال النموذج أوافق على <a href="/privacy">سياسة الخصوصية</a> (بالعبرية).',
      items: [
        ["ما هو فحص النوم وكيف يُجرى؟", "يفحص فحص النوم مراحل النوم، والتنفس، ونشاط الدماغ، وحركات الجسم، ونسبة تشبع الدم بالأكسجين خلال الليل. يمكن إجراء الفحص في معهد النوم التابع للمركز أو في منزل المريض، وفقًا للحالة الطبية والحاجة."],
        ["هل يمكن إجراء فحص النوم في المنزل؟", "بالتأكيد. يوفر المركز أنظمة متقدمة لفحوصات النوم المنزلية، تشمل إرشادًا كاملًا ومرافقة فني طبي. يُجرى الفحص المنزلي في البيئة الطبيعية للمريض، مما يتيح نتائج موثوقة وراحة قصوى."],
        ["لمن يناسب التأهيل الخارجي؟", "يناسب التأهيل الخارجي المرضى ذوي الحالة الطبية المستقرة، القادرين على الوصول إلى المركز بشكل مستقل أو برفقة أفراد العائلة أو مرافق. وهو حل مثالي لمن يرغب في مواصلة العيش في منزله أثناء تلقي علاج مهني ومتواصل."],
        ["كم تستغرق عملية التأهيل؟", "تختلف مدة التأهيل حسب نوع الإصابة والحالة الوظيفية. وغالبًا ما تمتد العملية من عدة أسابيع إلى عدة أشهر، مع إجراء تقييمات دورية وملاءمة الخطة وفقًا لتقدم المريض."],
        ["هل يمكن الدمج بين علاج النوم والعلاج التأهيلي؟", "بالتأكيد. هذه إحدى مزايا صوفيا ميديكال: نهج شمولي يعالج المشكلة التأهيلية وجوانب النوم والحالة النفسية كمنظومة واحدة."],
        ["هل العلاجات آمنة؟", "نعم. يُنفَّذ كل علاج تحت إشراف طبي كامل من قبل طاقم مؤهل، وفقًا للتوجيهات المهنية لوزارة الصحة."],
      ],
    },

    footer: {
      home: "صوفيا ميديكال، أعلى الصفحة", name: "صوفيا ميديكال",
      tag: "التأهيل وعلاج الألم واضطرابات النوم بقيادة د. علاء محاميد",
      onPage: "في هذه الصفحة", areas: "مجالات العلاج", contact: "تواصلوا معنا",
      mobile: "الجوال", landline: "العيادة", email: "البريد الإلكتروني",
      rights: (y) => `جميع الحقوق محفوظة © ${y} صوفيا ميديكال.`,
      credit: 'تحسين محركات البحث العضوي: <span dir="ltr">TZD SEO</span>',
      legal: [["شروط الاستخدام", "/terms"], ["الخصوصية", "/privacy"], ["إمكانية الوصول", "/accessibility"]],
    },
  },
};
