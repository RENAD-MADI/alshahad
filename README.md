# بحر الشهد | AL SHAHAD SAE COMMERCIAL

الموقع الإلكتروني الرسمي لشركة **بحر الشهد (AL SHAHAD SAE COMMERCIAL)**، ومقرها جدة، المملكة العربية السعودية. الشركة متخصصة في **المقاولات**، **الخدمات العقارية**، و**التسويق العقاري**.

## نبذة عن المشروع

موقع تعريفي متعدد الصفحات (Multi-page) وثنائي اللغة (عربي/إنجليزي) يعرض خدمات الشركة ومشاريعها، ويشمل:

- الصفحة الرئيسية (`index.html`)
- من نحن (`about.html`)
- المقاولات (`contracting.html`)
- الخدمات العقارية (`real-estate.html`)
- المشاريع (`projects.html`)
- طلب عرض سعر (`quote.html`)
- تواصل معنا (`contact.html`)

الموقع يدعم التبديل بين اللغتين العربية (RTL) والإنجليزية (LTR) عبر نظام ترجمة (i18n) مبني بجافاسكربت، ويحتوي على بيانات SEO (Meta tags, Open Graph, Schema.org JSON-LD) وملفي `sitemap.xml` و `robots.txt`.

## الأدوات واللغات المستخدمة

- **HTML5** — بنية الصفحات
- **CSS3** — التنسيق والتصميم المتجاوب (`css/style.css`)
- **JavaScript (Vanilla)** — التفاعلية ونظام الترجمة متعدد اللغات (`js/`)
  - `translations.js` — قاموس الترجمات (عربي/إنجليزي)
  - `i18n-*.js` — منطق الترجمة الخاص بكل صفحة
  - `main.js`, `partials.js`, `icons.js` — وظائف عامة ومكونات مشتركة
- **Google Fonts (Cairo)** — الخط المستخدم في الموقع
- **Schema.org / JSON-LD** — بيانات منظمة لمحركات البحث
- **Python** — سكربتات مساعدة لاستخراج بيانات من ملفات Word (`extract_docx.py`, `extract_docx3.py`)

## البنية

```
├── index.html
├── about.html
├── contracting.html
├── real-estate.html
├── projects.html
├── quote.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── translations.js
│   ├── i18n-*.js
│   ├── main.js
│   ├── partials.js
│   └── icons.js
├── imoges/            # صور الموقع
├── robots.txt
└── sitemap.xml
```

## التشغيل محليًا

يمكن تشغيل الموقع محليًا باستخدام أي خادم ثابت (static server)، مثال باستخدام Python:

```bash
python -m http.server 5500
```

ثم فتح المتصفح على `http://localhost:5500`.
