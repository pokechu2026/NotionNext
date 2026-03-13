/**
 * Choosehill 選擇之丘 AI — Proxio 主題設定
 * 創辦人：Chase Chao（趙建翔）
 * UNDERSTANDING AI. EMPOWERING LEARNING. CONNECTING OPPORTUNITIES.
 */
const CONFIG = {
  PROXIO_WELCOME_COVER_ENABLE: true, // ⚠️ 必須為 true 避免白畫面
  PROXIO_WELCOME_TEXT: '歡迎來到選擇之丘 AI，點擊任意位置進入', // 歡迎語

  // ──────────────────────────────────────────
  // 英雄區（Hero）
  // ──────────────────────────────────────────
  PROXIO_HERO_ENABLE: true,
  PROXIO_HERO_TITLE_1: '用 AI 讓每個人都能發光發熱', // 主標題
  PROXIO_HERO_TITLE_2: '為企業、學校與個人打造專屬的 AI 應用能力，迎向未來知識工作', // 副標題

  // 英雄區按鈕
  PROXIO_HERO_BUTTON_1_TEXT: '探索服務',
  PROXIO_HERO_BUTTON_1_URL: '/about',
  PROXIO_HERO_BUTTON_2_TEXT: '立即聯繫',
  PROXIO_HERO_BUTTON_2_URL: 'mailto:choosehill@gmail.com',
  PROXIO_HERO_BUTTON_2_ICON: '', // 可填入 email icon 路徑

  // 英雄區背景圖
  PROXIO_HERO_BANNER_IMAGE: '',
  PROXIO_HERO_BANNER_IFRAME_URL: '',

  // ──────────────────────────────────────────
  // 文章區塊（最新內容）
  // ──────────────────────────────────────────
  PROXIO_BLOG_ENABLE: true,
  PROXIO_BLOG_TITLE: '最新內容',
  PROXIO_BLOG_COUNT: 4,
  PROXIO_BLOG_TEXT_1: '最新 AI 應用教學與案例分享',

  PROXIO_BLOG_PLACEHOLDER_IMG_URL_1: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_2: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_3: '',
  PROXIO_BLOG_PLACEHOLDER_IMG_URL_4: '',

  // ──────────────────────────────────────────
  // 公告區塊
  // ──────────────────────────────────────────
  PROXIO_ANNOUNCEMENT_ENABLE: true,

  // ──────────────────────────────────────────
  // 特性區塊（核心服務）
  // ──────────────────────────────────────────
  PROXIO_FEATURE_ENABLE: true,
  PROXIO_FEATURE_TITLE: '我們能為您做什麼',
  PROXIO_FEATURE_TEXT_1: '提供全方位的 AI 教學與顧問服務，賦能未來工作力',
  PROXIO_FEATURE_TEXT_2: '實戰導向的課程設計、專業的 VR/XR 內容製作、高效的企業 AI 自動化方案',

  PROXIO_FEATURE_1_TITLE_1: 'AI 教學與顧問',
  PROXIO_FEATURE_1_TEXT_1: '專為企業、公部門與學校設計的實體 AI 工作坊與演講。我們提供客製化的 AI 應用教學，從概念解析到實機操作，讓學員快速掌握生成式 AI，提升工作效率與創造力。',
  PROXIO_FEATURE_1_BUTTON_TEXT: '了解更多',
  PROXIO_FEATURE_1_BUTTON_URL: '/about',

  PROXIO_FEATURE_2_TITLE_1: 'AI 內容製作',
  PROXIO_FEATURE_2_TEXT_1: '結合 AI 生成技術與專業影像後製，提供企業高質感的影音與視覺設計服務。包含產品形象影片、活動紀錄，並具備 360 度 VR 虛擬實境拍攝與沉浸式體驗設計能力。',
  PROXIO_FEATURE_2_BUTTON_TEXT: '了解更多',
  PROXIO_FEATURE_2_BUTTON_URL: '/about',

  PROXIO_FEATURE_3_TITLE_1: '企業 AI 解決方案',
  PROXIO_FEATURE_3_TEXT_1: '協助企業將 AI 導入現有工作流程。透過客製化顧問服務，我們提供流程診斷、AI 工具評估與自動化腳本建置，量身打造適合您組織的數位轉型藍圖。',
  PROXIO_FEATURE_3_BUTTON_TEXT: '了解更多',
  PROXIO_FEATURE_3_BUTTON_URL: '/about',

  PROXIO_FEATURE_4_TITLE_1: '品牌策略與 AI 行銷',
  PROXIO_FEATURE_4_TEXT_1: '運用 AI 數據分析與生成技術，協助客戶制定精準的品牌行銷策略。從政府標案企劃、展場活動設計到社群內容經營，打造整合性的品牌體驗。',
  PROXIO_FEATURE_4_BUTTON_TEXT: '了解更多',
  PROXIO_FEATURE_4_BUTTON_URL: '/about',

  // ──────────────────────────────────────────
  // 生涯歷程區塊
  // ──────────────────────────────────────────
  PROXIO_CAREER_ENABLE: true,
  PROXIO_CAREER_TITLE: '專業歷程',
  PROXIO_CAREER_TEXT: '深耕影像製作與專案管理十餘載，現專注於科技賦能與 AI 教育傳播。擁有 18 年以上專案管理經驗，橫跨大型展演與 VR 影視製作。',
  PROXIO_CAREERS: [
    {
      title: 'Choosehill 選擇之丘 AI Studio',
      bio: '創辦人 ✦ AI 教學講師 ✦ 企業顧問',
      text: '2024 - present'
    },
    {
      title: 'Funique VR 睿至',
      bio: 'VR 導演 / 原創製作部總監 ✦ 虛擬實境內容產製',
      text: '2019 - 2024'
    },
    {
      title: `B'in Live 相信音樂`,
      bio: '專案經理 ✦ 參與五月天巡迴演唱會及國內外大型展演專案',
      text: '2016 - 2019'
    }
  ],

  // ──────────────────────────────────────────
  // 關於創辦人區塊
  // ──────────────────────────────────────────
  PROXIO_ABOUT_ENABLE: true,
  PROXIO_ABOUT_TITLE: '關於創辦人',
  PROXIO_ABOUT_TEXT_1: 'Chase Chao 趙建翔',
  PROXIO_ABOUT_TEXT_2:
    '擁有經濟部 iPAS+ 人工智慧應用企劃師、Google 認證教育家等多項專業資格。我深信 AI 不是取代人的工具，而是賦能每個人的魔法。透過「選擇之丘」，我期望搭建理解 AI 的橋樑，將艱澀技術化為普及應用，為每個人、每個團隊開啟無限可能。',
  PROXIO_ABOUT_PHOTO_URL: '', // 留空預設使用左側區域的排版
  PROXIO_ABOUT_VAL_1: '18 年+',
  PROXIO_ABOUT_VAL_1_TEXT: '專案管理與整合經驗',
  PROXIO_ABOUT_VAL_2: '100+',
  PROXIO_ABOUT_VAL_2_TEXT: '服務企業與組織團隊',
  PROXIO_ABOUT_VAL_3: '500+',
  PROXIO_ABOUT_VAL_3_TEXT: 'AI 課程培育學員數',
  PROXIO_ABOUT_VAL_4: '10+',
  PROXIO_ABOUT_VAL_4_TEXT: '國內外影展獲獎與入圍',

  // ──────────────────────────────────────────
  // 滾動展示區塊 (Brands)
  // ──────────────────────────────────────────
  PROXIO_BRANDS_ENABLE: true,
  PROXIO_BRANDS: [
    'Generative AI',
    'AI 培訓工作坊',
    '企業數位轉型',
    'VR 虛擬實境製作',
    '品牌行銷策略',
    '專案管理顧問'
  ],

  // ──────────────────────────────────────────
  // 用戶評價區塊
  // ──────────────────────────────────────────
  PROXIO_TESTIMONIALS_ENABLE: true,
  PROXIO_TESTIMONIALS_TITLE: '學員與客戶反饋',
  PROXIO_TESTIMONIALS_TEXT_1: '我們引以為傲的服務價值',
  PROXIO_TESTIMONIALS_TEXT_2: '看看那些與我們合作過、參與過課程的朋友怎麼說',
  PROXIO_TESTIMONIALS_STAR_ICON: '/images/proxio/star-fill.svg',

  PROXIO_TESTIMONIALS_ITEMS: [
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT: '一直覺得生成式 AI 門檻很高，但老師的課程設計非常接地氣！實機操作搭配實際工作情境，讓我上完課隔天就能用 AI 提升發想提案的效率。',
      PROXIO_TESTIMONIALS_ITEM_URL: '#',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/images/proxio/author-01.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: '企業內訓學員',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '行銷企劃'
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT: '顧問擁有十幾年的跨界專案經驗，能敏銳抓出我們團隊在流程上的痛點，並提供符合成本效益的 AI 解決方案，溝通起來非常順暢且專業。',
      PROXIO_TESTIMONIALS_ITEM_URL: '#',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/images/proxio/author-02.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: '專案決策主管',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '科技新創公司'
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT: '結合 AI 輔助與精湛的 VR 拍攝技術，產出的影像質感遠超預期。導演對節奏的掌握和敘事邏輯都相當精準，合作體驗極佳。',
      PROXIO_TESTIMONIALS_ITEM_URL: '#',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/images/proxio/author-03.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: '品牌總監',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '生活品牌'
    },
    {
      PROXIO_TESTIMONIALS_ITEM_TEXT: '在政府標案的準備過程中，能提供條理分明且具前瞻性的科技應用企劃，是專案能順利推進並拿下標案的關鍵助力。',
      PROXIO_TESTIMONIALS_ITEM_URL: '#',
      PROXIO_TESTIMONIALS_ITEM_AVATAR: '/images/proxio/author-01.png',
      PROXIO_TESTIMONIALS_ITEM_NICKNAME: '合作夥伴',
      PROXIO_TESTIMONIALS_ITEM_DESCRIPTION: '公關活動公司'
    }
  ],

  // ──────────────────────────────────────────
  // 常見問題區塊 (FAQ)
  // ──────────────────────────────────────────
  PROXIO_FAQ_ENABLE: true,
  PROXIO_FAQ_TITLE: '常見問題',
  PROXIO_FAQ_TEXT_1: '解答您的疑惑，開啟合作第一步',
  PROXIO_FAQ_TEXT_2: '',

  PROXIO_FAQS: [
    {
      q: '請問 Choosehill 提供哪些核心服務？',
      a: '我們專注於四大領域：AI 應用教學與顧問（含企業內訓、演講）、AI 結合影音與 VR 的內容製作、企業 AI 導入解決方案，以及品牌策略與行銷企劃。'
    },
    {
      q: '完全不懂程式，可以報名 AI 課程嗎？',
      a: '絕對可以！我們的課程專為一般職場人士設計，強調理喻與應用，無需寫程式背景。我們會從最直覺的 Prompt (提示詞) 撰寫開始，循序漸進引導您駕馭 AI 工具。'
    },
    {
      q: '企業內部訓練可以客製化內容嗎？',
      a: '這是我們最強調的優勢。在課程前，我們會進行需求訪談，針對企業所屬產業（如行銷、人資、行政等）痛點，量身設計實作案例，確保學員能學以致用。'
    },
    {
      q: '創辦人擁有什麼樣的 AI 專業認證？',
      a: '創辦人 Chase Chao 具備「經濟部 iPAS+ 人工智慧應用企劃師」與「Google Certified Educator_Level 1 & 2」等多項專業認證，確保所提供的 AI 知識體系完整且符合業界標準。'
    }
  ],

  // ──────────────────────────────────────────
  // 行動呼吁區塊 (CTA)
  // ──────────────────────────────────────────
  PROXIO_CTA_ENABLE: true,
  PROXIO_CTA_TITLE: '讓 AI 成為您最強大的工作夥伴',
  PROXIO_CTA_TITLE_2: '立刻開始數位轉型',
  PROXIO_CTA_DESCRIPTION:
    '不管是想提升個人競爭力，還是帶領團隊無痛導入 AI 工作流，Choosehill AI 都能為您提供最適合的支援。期待與您聯絡！',
  PROXIO_CTA_BUTTON: true,
  PROXIO_CTA_BUTTON_URL: 'mailto:choosehill@gmail.com',
  PROXIO_CTA_BUTTON_TEXT: '立即聯繫我們',

  // ──────────────────────────────────────────
  // 頁尾區塊 (Footer)
  // ──────────────────────────────────────────
  PROXIO_FOOTER_SLOGAN: 'UNDERSTANDING AI. EMPOWERING LEARNING. CONNECTING OPPORTUNITIES.',
  PROXIO_FOOTER_LINKS: [
    {
      id: 1,
      title: '快速連結',
      links: [
        { href: '/about', title: '關於我們' },
        { href: '/archive', title: '最新文章' },
        { href: 'mailto:choosehill@gmail.com', title: '聯絡合作' }
      ]
    },
    {
      id: 2,
      title: '服務項目',
      links: [
        { href: '/about', title: 'AI 教學與工作坊' },
        { href: '/about', title: 'AI 內容製作' },
        { href: '/about', title: '企業 AI 解決方案' },
        { href: '/about', title: '品牌策略與 AI 行銷' }
      ]
    }
  ]
}

export default CONFIG
