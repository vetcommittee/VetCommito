// كتالوج أماكن جامعة العلوم والتكنولوجيا الأردنية. المصدر: خريطة الجامعة الرسمية 2022 (الأسماء والأكواد فقط).
// lat/lng/poly فاضية لحد ما نحدد مكان كل مبنى بأداة التحديد. الأسماء العربية ترجمة مبدئية، راجعها.
// ملاحظة: بالخريطة الرسمية أكواد مكررة (311، D1، U.L)، لذلك الحقل id هو المعرّف الفريد وليس code.
window.CAMPUS={
 "cats": [
  {
   "id": "college",
   "ar": "الكليات"
  },
  {
   "id": "admin",
   "ar": "الإدارة"
  },
  {
   "id": "halls",
   "ar": "القاعات والمدرجات"
  },
  {
   "id": "health",
   "ar": "الصحة والمستشفيات"
  },
  {
   "id": "services",
   "ar": "خدمات الطلبة"
  },
  {
   "id": "sport",
   "ar": "الرياضة"
  },
  {
   "id": "facilities",
   "ar": "مرافق ومعالم"
  }
 ],
 "areas": {
  "medical": "المباني الطبية",
  "central": "الوسط",
  "engineering": "المباني الهندسية"
 },
 "places": [
  {
   "id": "medicine",
   "code": "M5",
   "ar": "كلية الطب",
   "en": "Faculty of Medicine",
   "cat": "college",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "science-arts",
   "code": "PH1",
   "ar": "كلية العلوم والآداب",
   "en": "Faculty of Science and Arts",
   "cat": "college",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "nursing",
   "code": "N1",
   "ar": "كلية التمريض",
   "en": "Faculty of Nursing",
   "cat": "college",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "applied-medical",
   "code": "414",
   "ar": "كلية العلوم الطبية التطبيقية",
   "en": "Faculty of Applied Medical Sciences",
   "cat": "college",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "dentistry",
   "code": "D1",
   "ar": "كلية طب الأسنان",
   "en": "Faculty of Dentistry",
   "cat": "college",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "dental-clinics",
   "code": "10H",
   "ar": "عيادات الأسنان",
   "en": "Dental Clinics",
   "cat": "health",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "pharmacy",
   "code": "P1",
   "ar": "كلية الصيدلة",
   "en": "Faculty of Pharmacy",
   "cat": "college",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "kauh",
   "code": "5A-5D",
   "ar": "مستشفى الملك عبدالله الجامعي",
   "en": "King Abdullah University Hospital",
   "cat": "health",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "field-hospital",
   "code": "F.H",
   "ar": "المستشفى الميداني الشمالي",
   "en": "Field Hospital of the North",
   "cat": "health",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "radiotherapy",
   "code": "S.R.C",
   "ar": "مركز العلاج الإشعاعي السعودي",
   "en": "Saudi Radiotherapy Center",
   "cat": "health",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "science-hall-1",
   "code": "411",
   "ar": "قاعة العلوم 1",
   "en": "Science Hall 1",
   "cat": "halls",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "hijazi-hall",
   "code": "412",
   "ar": "قاعة أ.د. سعد الحجازي",
   "en": "Prof. Sa'ad Hijazi Hall",
   "cat": "halls",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "medical-halls",
   "code": "415",
   "ar": "القاعات الطبية",
   "en": "Medical Halls",
   "cat": "halls",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "disabled-parks",
   "code": "P",
   "ar": "مواقف ذوي الإعاقة",
   "en": "Disabled Parks",
   "cat": "facilities",
   "area": "medical",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "presidency",
   "code": "U.P",
   "ar": "رئاسة الجامعة",
   "en": "University Presidency",
   "cat": "admin",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "ajlouni-halls",
   "code": "410",
   "ar": "قاعات أ.د. كامل العجلوني",
   "en": "Prof. Kamel Ajlouni Lecture Halls",
   "cat": "halls",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "library",
   "code": "U.L",
   "ar": "المكتبة",
   "en": "Library",
   "cat": "services",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "students-gate",
   "code": "15",
   "ar": "بوابة الطلبة",
   "en": "Students Gate",
   "cat": "facilities",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "post-bank",
   "code": "14",
   "ar": "البريد / البنك",
   "en": "Post Office / Bank",
   "cat": "services",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "mosque",
   "code": "12",
   "ar": "المسجد",
   "en": "The Mosque",
   "cat": "services",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "student-affairs",
   "code": "D.S.A",
   "ar": "عمادة شؤون الطلبة",
   "en": "Deanship of Students' Affairs",
   "cat": "admin",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "intl-students",
   "code": "311",
   "ar": "مكتب الطلبة الدوليين",
   "en": "International Students Office",
   "cat": "admin",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "intl-relations",
   "code": "D1",
   "ar": "مكتب العلاقات الدولية",
   "en": "International Relations Office",
   "cat": "admin",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "nano",
   "code": "334",
   "ar": "معهد تكنولوجيا النانو",
   "en": "Nanotechnology Institute",
   "cat": "college",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "football",
   "code": "F.S",
   "ar": "ملعب كرة القدم",
   "en": "Football Stadium",
   "cat": "sport",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "sport-hall",
   "code": "S.H",
   "ar": "الصالة الرياضية",
   "en": "Sport Hall",
   "cat": "sport",
   "area": "central",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "architecture",
   "code": "A4",
   "ar": "كلية العمارة والتصميم",
   "en": "Faculty of Architecture and Design",
   "cat": "college",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "agriculture",
   "code": "M1",
   "ar": "كلية الزراعة",
   "en": "Faculty of Agriculture",
   "cat": "college",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "cit",
   "code": "N2",
   "ar": "كلية الحاسوب وتكنولوجيا المعلومات",
   "en": "Faculty of Computer and Information Technology",
   "cat": "college",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "graduate",
   "code": "C1",
   "ar": "كلية الدراسات العليا",
   "en": "Faculty of Graduate Studies",
   "cat": "college",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "engineering",
   "code": "E1",
   "ar": "كلية الهندسة",
   "en": "Faculty of Engineering",
   "cat": "college",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "vet-faculty",
   "code": "G1",
   "ar": "كلية الطب البيطري",
   "en": "Faculty of Veterinary Medicine",
   "cat": "college",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "research-deanship",
   "code": "A1",
   "ar": "عمادة البحث العلمي",
   "en": "Deanship of Scientific Research",
   "cat": "admin",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "karamah",
   "code": "311",
   "ar": "قاعة الكرامة",
   "en": "Al Karamah Auditorium",
   "cat": "halls",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "farouq",
   "code": "312",
   "ar": "قاعة الفاروق",
   "en": "Al Farouq Auditorium",
   "cat": "halls",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "cafeteria",
   "code": "313",
   "ar": "الكافتيريا",
   "en": "Cafeteria",
   "cat": "services",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "salah-eldeen",
   "code": "314",
   "ar": "قاعة صلاح الدين",
   "en": "Salah Eldeen Auditorium",
   "cat": "halls",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "excellence-center",
   "code": "315",
   "ar": "مركز التميّز للمشاريع الابتكارية",
   "en": "Center of Excellence for Innovative Projects",
   "cat": "admin",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "vet-hospital",
   "code": "V.H",
   "ar": "المستشفى البيطري",
   "en": "Veterinary Hospital",
   "cat": "health",
   "area": "engineering",
   "lat": 32.485842,
   "lng": 35.9864621,
   "poly": null,
   "floors": 2
  },
  {
   "id": "female-housing",
   "code": "F.S.H",
   "ar": "سكن الطالبات",
   "en": "Female Students' Housing",
   "cat": "facilities",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "student-entrance",
   "code": "S.E",
   "ar": "مدخل الطلبة",
   "en": "Student Entrance",
   "cat": "facilities",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "cottages",
   "code": "C.U",
   "ar": "الكوتجات",
   "en": "Cottages",
   "cat": "facilities",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  },
  {
   "id": "lake",
   "code": "U.L",
   "ar": "البحيرة",
   "en": "The Lake",
   "cat": "facilities",
   "area": "engineering",
   "lat": null,
   "lng": null,
   "poly": null,
   "floors": null
  }
 ]
};
