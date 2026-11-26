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
      form: "Leave your details", name: "Full name", phone: "Phone", topic: "Treatment area", choose: "Choose", send: "Send",
      note: 'By sending this form I agree to the <a href="/privacy" hreflang="he">privacy policy</a> (in Hebrew).',
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
};
