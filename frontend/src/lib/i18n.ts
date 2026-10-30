export type Language = 'kn' | 'en' | 'hi' | 'mr';
export type SupportedLanguage = Language;

export interface I18nDictionary {
  appTitle: string;
  appSubtitle: string;
  govIndia: string;
  govHeader: string;
  voiceFirstTag: string;
  liveStatus: string;
  offlineStatus: string;
  languageName: string;
  switchLanguage: string;

  // Hero Section
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroSubtitle: string;
  heroCTA: string;
  scrollExplore: string;

  // Storytelling section
  storyHeading: string;
  storySubheading: string;
  storyDesc: string;
  feat1: string;
  feat2: string;
  feat3: string;
  storyCard1Title: string;
  storyCard1Desc: string;
  storyCard2Title: string;
  storyCard2Desc: string;
  storyCard3Title: string;
  storyCard3Desc: string;

  // Voice Core
  voiceHeading: string;
  voiceSubheading: string;
  voiceStateIdle: string;
  voiceStateListening: string;
  voiceStateProcessing: string;
  voiceStateSpeaking: string;
  voiceInstruction: string;
  typePlaceholder: string;
  recentConversations: string;
  recentQ1: string;
  recentQ2: string;
  recentQ3: string;
  recentQ4: string;

  // Chat & Voice Input Controls
  chatTitle: string;
  welcomeMessage: string;
  inputPlaceholder: string;
  recording: string;
  recordingInstruction: string;
  stopAndSend: string;
  cancelRecording: string;
  send: string;
  listeningBrowser: string;
  transcriptPreview: string;
  playingAudio: string;
  playVoice: string;
  pauseVoice: string;
  replayVoice: string;

  // Profile Progress
  profileTitle: string;
  profileCompletion: string;
  editProfile: string;
  saveProfile: string;
  cancel: string;
  slots: {
    district: string;
    land_area_acres: string;
    ownership_type: string;
    crops: string;
    has_irrigation: string;
    season: string;
  };
  ownershipLabels: {
    owner: string;
    tenant: string;
    sharecropper: string;
  };
  irrigationLabels: {
    yes: string;
    no: string;
  };
  missingTag: string;
  filledTag: string;

  // Schemes section
  schemesHeading: string;
  schemesSubheading: string;
  schemesTitle: string;
  schemesSubtitle: string;
  tabs: {
    all: string;
    eligible: string;
    needsInfo: string;
    demo: string;
  };
  status: {
    eligible: string;
    ineligible: string;
    needs_more_info: string;
  };
  verifiedBadge: string;
  verifiedDate: string;
  demoBadge: string;
  viewDetails: string;
  viewDocuments: string;
  officialPortal: string;
  helpline: string;
  benefitsHeading: string;
  rulesCheckHeading: string;
  satisfied: string;
  notSatisfied: string;
  unknown: string;
  documentsRequiredHeading: string;
  verifiedGov: string;
  lastUpdated: string;
  officialLinks: string;

  // Eligibility View
  eligibilityTitle: string;
  preliminaryResult: string;
  eligibleMessage: string;
  eligibleSubtext: string;
  detailsTitle: string;
  ruleLand: string;
  ruleOwnership: string;
  ruleTax: string;
  ruleStatus: string;
  officialSource: string;
  officialPmkisanWebsite: string;
  disclaimerBox: string;
  viewGuidanceBtn: string;

  // Evidence Modal
  modalTitle: string;
  closeModal: string;
  sourceUrl: string;
  verifiedByText: string;

  // Disclaimer
  disclaimerTitle: string;
  disclaimerText: string;

  // Nav & Settings
  navHome: string;
  navStory: string;
  navVoice: string;
  navSchemes: string;
  navEligibility: string;
  settingsTitle: string;
  voiceInputSetting: string;
  autoPlaySetting: string;
  saveChatSetting: string;
  privacyPolicy: string;
  helpSupport: string;
}

export const i18n: Record<SupportedLanguage, I18nDictionary> = {
  kn: {
    appTitle: "Krishi Mitra AI",
    appSubtitle: "Your AI Farming Companion • ನಿಮ್ಮ ಕೃಷಿ ಒಡನಾಡಿ",
    govIndia: "Government of India • ಭಾರತ ಸರ್ಕಾರ",
    govHeader: "ಭಾರತ ಸರ್ಕಾರ ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಯೋಜನೆಗಳು",
    voiceFirstTag: "ಧ್ವನಿ ಆಧಾರಿತ ನಿರ್ಧಾರ ಸಹಾಯಕ ವ್ಯವಸ್ಥೆ",
    liveStatus: "ಸಕ್ರಿಯವಾಗಿದೆ",
    offlineStatus: "ಆಫ್‌ಲೈನ್",
    languageName: "ಕನ್ನಡ",
    switchLanguage: "English ಗೆ ಬದಲಾಯಿಸಿ",

    heroTitle1: "Better Answers.",
    heroTitle2: "Stronger Farmers.",
    heroTitle3: "A Greener Tomorrow.",
    heroSubtitle: "ಸರ್ಕಾರದ ಯೋಜನೆಗಳು • ಅರ್ಹತಾ ಮಾರ್ಗದರ್ಶನ • ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ",
    heroCTA: "ನಿಮ್ಮ ಪ್ರಯಾಣ ಪ್ರಾರಂಭಿಸಿ",
    scrollExplore: "ಅನ್ವೇಷಿಸಲು ಕೆಳಗೆ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ",

    storyHeading: "ಪ್ರತಿ ರೈತನಿಗೂ ಪ್ರಶ್ನೆಗಳಿವೆ.",
    storySubheading: "Every farmer has questions.",
    storyDesc: "ಕೃಷಿ ಮಿತ್ರ AI ನಿಮಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ವಿಶ್ವಾಸಾರ್ಹ ಮಾಹಿತಿ ನೀಡಲು, ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು ಮತ್ತು ನಿಮ್ಮದೇ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಸೂಕ್ತ ಮಾರ್ಗದರ್ಶನ ಒದಗಿಸಲು ಸದಾ ಸಿದ್ಧವಾಗಿದೆ.",
    feat1: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    feat2: "ಅರ್ಹತಾ ಪರಿಶೀಲನೆ",
    feat3: "ಸರಳ ಮಾರ್ಗದರ್ಶನ",
    storyCard1Title: "ಯಾಂತ್ರೀಕರಣದ ಹೊಸ ಹಾದಿ",
    storyCard1Desc: "ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳಿಗೆ 50-75% ಸಹಾಯಧನ",
    storyCard2Title: "ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಸಂರಕ್ಷಣೆ",
    storyCard2Desc: "ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಮೈಕ್ರೋ-ನ್ಯೂಟ್ರಿಯಂಟ್ ಬೆಂಬಲ",
    storyCard3Title: "ರೈತರ ಆರ್ಥಿಕ ಭರವಸೆ",
    storyCard3Desc: "PM-KISAN ₹6,000 ನೇರ ನಗದು ಮತ್ತು PMFBY ಬೆಳೆ ವಿಮೆ",

    voiceHeading: "ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರ AI.",
    voiceSubheading: "ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    voiceStateIdle: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ...",
    voiceStateListening: "ಆಲಿಸುತ್ತಿದೆ...",
    voiceStateProcessing: "ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    voiceStateSpeaking: "ಉತ್ತರಿಸಲಾಗುತ್ತಿದೆ...",
    voiceInstruction: "ನಿಮ್ಮ ಜಮೀನು, ಬೆಳೆ ಅಥವಾ ಜಿಲ್ಲೆಯ ಬಗ್ಗೆ ಮುಕ್ತವಾಗಿ ಮಾತನಾಡಿ",
    typePlaceholder: "ಇಲ್ಲಿ ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ...",
    recentConversations: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆ",
    recentQ1: "PM-KISAN ಯೋಜನೆ ಬಗ್ಗೆ ಮಾಹಿತಿ",
    recentQ2: "ನನ್ನ eligibility ಹೇಗೆ?",
    recentQ3: "PMFBY ಬಗ್ಗೆ ವಿವರಣೆ",
    recentQ4: "ಬೇಕಾಗುವ ದಾಖಲೆಗಳು ಯಾವುವು?",

    chatTitle: "ಸಂಭಾಷಣೆ ಮತ್ತು ಧ್ವನಿ ಸಂವಾದ",
    welcomeMessage: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರ AI. ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿ, ಬೆಳೆ ಮತ್ತು ಜಿಲ್ಲೆಯ ವಿವರಗಳನ್ನು ಹೇಳಿ, ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಸಹಾಯಧನ ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ ಕೊಡುತ್ತೇನೆ.",
    inputPlaceholder: "ಇಲ್ಲಿ ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ...",
    recording: "ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ...",
    recordingInstruction: "ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ, ಮುಗಿದ ನಂತರ 'ನಿಲ್ಲಿಸಿ' ಒತ್ತಿ",
    stopAndSend: "ನಿಲ್ಲಿಸಿ ಕಳುಹಿಸಿ",
    cancelRecording: "ರದ್ದುಮಾಡಿ",
    send: "ಕಳುಹಿಸಿ",
    listeningBrowser: "ಬ್ರೌಸರ್ ಮೈಕ್ರೋಫೋನ್ ಆಲಿಸುತ್ತಿದೆ...",
    transcriptPreview: "ಗುರುತಿಸಿದ ಪಠ್ಯ (ಸಂಪಾದಿಸಬಹುದು):",

    playingAudio: "ಧ್ವನಿ ನುಡಿಯುತ್ತಿದೆ...",
    playVoice: "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ",
    pauseVoice: "ನಿಲ್ಲಿಸಿ",
    replayVoice: "ಮತ್ತೆ ಆಲಿಸಿ",

    profileTitle: "ರೈತರ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ",
    profileCompletion: "ಪ್ರೊಫೈಲ್ ಪೂರ್ಣತೆ",
    editProfile: "ಬದಲಾಯಿಸಿ",
    saveProfile: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    slots: {
      district: "ಜಿಲ್ಲೆ",
      land_area_acres: "ಭೂಮಿ ವಿಸ್ತೀರ್ಣ",
      ownership_type: "ಮಾಲೀಕತ್ವ",
      crops: "ಬೆಳೆಗಳು",
      has_irrigation: "ನೀರಾವರಿ",
      season: "ಋತು"
    },
    ownershipLabels: {
      owner: "ಸ್ವಂತ ಭೂಮಿ",
      tenant: "ಗೇಣಿದಾರ",
      sharecropper: "ಪಾಲುದಾರ"
    },
    irrigationLabels: {
      yes: "ಬೋರ್‌ವೆಲ್ / ಕಾಲುವೆ",
      no: "ಮಳೆ ಆಶ್ರಯ"
    },
    missingTag: "ಮಾಹಿತಿ ಬೇಕಾಗಿದೆ",
    filledTag: "ದೃಢಪಟ್ಟಿದೆ",

    schemesHeading: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    schemesSubheading: "ಕೇಂದ್ರ ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಯೋಜನೆಗಳು",
    schemesTitle: "ನಿಮಗಾಗಿ ಪರಿಶೀಲಿಸಲಾದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    schemesSubtitle: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಆಧಾರದ ಮೇಲೆ ನಿಯಮಾವಳಿಗಳನ್ನು ಕರಾರುವಾಕ್ಕಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    tabs: {
      all: "ಎಲ್ಲಾ ಯೋಜನೆಗಳು",
      eligible: "ಅರ್ಹ ಯೋಜನೆಗಳು",
      needsInfo: "ಹೆಚ್ಚಿನ ವಿವರ ಬೇಕು",
      demo: "ಡೆಮೊ ಯೋಜನೆಗಳು"
    },
    status: {
      eligible: "ಅರ್ಹರಾಗಿದ್ದೀರಿ",
      ineligible: "ಅರ್ಹರಲ್ಲ",
      needs_more_info: "ಮಾಹಿತಿ ಪೂರ್ಣಗೊಳಿಸಿ"
    },
    verifiedBadge: "MoA&FW ದೃಢೀಕರಿಸಿದೆ",
    verifiedDate: "ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ: ಅಕ್ಟೋಬರ್ 2026",
    demoBadge: "ಡೆಮೊ ವಾಟರ್‌ಮಾರ್ಕ್",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
    viewDocuments: "ದಾಖಲೆಗಳು & ಅರ್ಜಿ ಲಿಂಕ್",
    officialPortal: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ",
    helpline: "ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ",
    benefitsHeading: "ಯೋಜನೆಯ ಆರ್ಥಿಕ ಲಾಭಗಳು",
    rulesCheckHeading: "ಅರ್ಹತಾ ನಿಯಮಾವಳಿಗಳ ಪರಿಶೀಲನೆ",
    satisfied: "ಪೂರೈಸಲಾಗಿದೆ",
    notSatisfied: "ಷರತ್ತು ಪೂರೈಸಿಲ್ಲ",
    unknown: "ಮಾಹಿತಿ ಬಾಕಿ ಇದೆ",
    documentsRequiredHeading: "ಅಗತ್ಯ ದಾಖಲೆಗಳ ಪಟ್ಟಿ",
    verifiedGov: "ಸರ್ಕಾರದಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ",
    lastUpdated: "ಅಂತಿಮ ನವೀಕರಣ: ಅಕ್ಟೋಬರ್ 2026",
    officialLinks: "ಅಧಿಕೃತ ಲಿಂಕ್ ಲಭ್ಯವಿದೆ",

    eligibilityTitle: "ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲನೆ",
    preliminaryResult: "ಪ್ರಾಥಮಿಕ ಫಲಿತಾಂಶ",
    eligibleMessage: "ನೀವು PM-KISAN ಗೆ ಅರ್ಹರಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ",
    eligibleSubtext: "ವಿವರಗಳು ಮತ್ತು ಪ್ರಾಥಮಿಕ ದಾಖಲಾತಿ ಪ್ರಕಾರ ಈ ಕೆಳಗಿನ ಪ್ರಯೋಜನಗಳಿಗೆ ನೀವು ಪರಿಗಣಿಸಲ್ಪಡಬಹುದು.",
    detailsTitle: "ವಿವರಗಳು:",
    ruleLand: "ಭೂಮಿ: 4 ಎಕರೆ ಹೊಂದಿದ್ದೀರಿ",
    ruleOwnership: "ಕೃಷಿ ಆಧಾರಿತ ರೈತರು: ಸ್ವಂತ ಜಮೀನು",
    ruleTax: "ಆದಾಯ ಮಿತಿ: ಸೀಮಿತದಲ್ಲಿದೆ",
    ruleStatus: "ಚಾಲ್ತಿ ಕೃಷಿ ಭೂಮಿ: ಹೌದು",
    officialSource: "ಅಧಿಕೃತ ಮೂಲ:",
    officialPmkisanWebsite: "PM-KISAN ಅಧಿಕೃತ ಪೋರ್ಟಲ್",
    disclaimerBox: "ಇದು ಪ್ರಾಥಮಿಕ ಅರ್ಹತಾ ಪರಿಶೀಲನೆ ಮಾತ್ರ. ಅಂತಿಮ ಅನುಮೋದನೆ ಸರ್ಕಾರದ ಅಧಿಕಾರಿಗಳಿಂದ ನೀಡಲಾಗುತ್ತದೆ.",
    viewGuidanceBtn: "ಮಾರ್ಗದರ್ಶನ ನೋಡಿ",

    modalTitle: "ಯೋಜನೆಯ ವಿವರಗಳು ಮತ್ತು ಪುರಾವೆಗಳು",
    closeModal: "ಮುಚ್ಚಿ",
    sourceUrl: "ಅಧಿಕೃತ ಮೂಲ:",
    verifiedByText: "ದೃಢೀಕರಿಸಿದ ಪ್ರಾಧಿಕಾರ:",

    disclaimerTitle: "ಕಾನೂನು ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ಮಾರ್ಗಸೂಚಿ",
    disclaimerText: "ಕೃಷಿ ಮಿತ್ರ AI ಒಂದು ಮಾಹಿತಿ ಮತ್ತು ನಿರ್ಧಾರ ಬೆಂಬಲ ಸಾಧನವಾಗಿದೆ. ಇಲ್ಲಿ ತೋರಿಸಲಾದ ಅರ್ಹತಾ ಫಲಿತಾಂಶಗಳು ಅಧಿಕೃತ ನಿಯಮಾವಳಿಗಳ ಆಧಾರದ ಮೇಲೆ ಕಂಪ್ಯೂಟರ್ ನಿರ್ಣಯಿಸಿದ ಮಾಹಿತಿಯಾಗಿದೆ. ಅಂತಿಮ ಮಂಜೂರಾತಿ ಮತ್ತು ಪರಿಶೀಲನೆಯು ಸಂಬಂಧಪಟ್ಟ ಕೃಷಿ ಇಲಾಖೆ, ಗ್ರಾಮ ಒನ್ ಅಥವಾ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರಗಳ ಪರಿಶೀಲನೆಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.",

    navHome: "ಮುಖಪುಟ",
    navStory: "ಕಥೆ",
    navVoice: "ಧ್ವನಿ ಮಿತ್ರ",
    navSchemes: "ಯೋಜನೆಗಳು",
    navEligibility: "ಅರ್ಹತೆ",
    settingsTitle: "ಸೆಟ್ಟಿಂಗ್ಸ್ & ಗೌಪ್ಯತೆ",
    voiceInputSetting: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    autoPlaySetting: "ಧ್ವನಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಆಲಿಸಿ",
    saveChatSetting: "ಸಂಭಾಷಣೆ ಉಳಿಸಿ",
    privacyPolicy: "ಗೌಪ್ಯತಾ ನೀತಿ",
    helpSupport: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ"
  },
  en: {
    appTitle: "Krishi Mitra AI",
    appSubtitle: "Your AI Farming Companion",
    govIndia: "Government of India",
    govHeader: "Verified Schemes by Government of India & Government of Karnataka",
    voiceFirstTag: "Natural Voice & Deterministic Decision Support",
    liveStatus: "Live Online",
    offlineStatus: "Offline",
    languageName: "English",
    switchLanguage: "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ",

    heroTitle1: "Better Answers.",
    heroTitle2: "Stronger Farmers.",
    heroTitle3: "A Greener Tomorrow.",
    heroSubtitle: "Government schemes • Eligibility guidance • In your language",
    heroCTA: "Start Your Journey",
    scrollExplore: "Scroll to explore",

    storyHeading: "Every farmer has questions.",
    storySubheading: "ಪ್ರತಿ ರೈತನಿಗೂ ಪ್ರಶ್ನೆಗಳಿವೆ.",
    storyDesc: "Krishi Mitra AI is here to help you find trusted answers about government schemes, check eligibility and get the right guidance — in your language.",
    feat1: "Government Schemes",
    feat2: "Eligibility Check",
    feat3: "Simple Guidance",
    storyCard1Title: "Modern Mechanization",
    storyCard1Desc: "50%–75% capital subsidies on farm implements",
    storyCard2Title: "Soil & Crop Health",
    storyCard2Desc: "Free soil health testing and micronutrient kits",
    storyCard3Title: "Financial Resilience",
    storyCard3Desc: "₹6,000/yr PM-KISAN DBT & PMFBY crop insurance",

    voiceHeading: "I am your Krishi Mitra AI.",
    voiceSubheading: "How can I help you today?",
    voiceStateIdle: "Click mic or start speaking...",
    voiceStateListening: "Listening...",
    voiceStateProcessing: "Evaluating eligibility...",
    voiceStateSpeaking: "Speaking response...",
    voiceInstruction: "Speak naturally about your land, crops, or district in Kannada or English",
    typePlaceholder: "Type a message...",
    recentConversations: "Recent Conversation",
    recentQ1: "Information on PM-KISAN Scheme",
    recentQ2: "How is my eligibility calculated?",
    recentQ3: "PMFBY Crop Insurance Details",
    recentQ4: "What documents are required?",

    chatTitle: "Interactive Voice & Conversation",
    welcomeMessage: "Namaskara! I am your Krishi Mitra AI assistant. Tell me about your farmland, district, and crops in natural Kannada or English, and I will instantly evaluate your eligibility for official central and state government schemes.",
    inputPlaceholder: "Type your message or click the microphone to speak...",
    recording: "Listening...",
    recordingInstruction: "Speak naturally, then click 'Stop & Send'",
    stopAndSend: "Stop & Send",
    cancelRecording: "Cancel",
    send: "Send",
    listeningBrowser: "Listening via browser speech recognition...",
    transcriptPreview: "Recognized Transcript (Editable):",

    playingAudio: "Speaking response...",
    playVoice: "Listen in Voice",
    pauseVoice: "Pause",
    replayVoice: "Replay Voice",

    profileTitle: "Farmer Profile Parameters",
    profileCompletion: "Profile Completion",
    editProfile: "Edit Profile",
    saveProfile: "Save Changes",
    cancel: "Cancel",
    slots: {
      district: "District",
      land_area_acres: "Land Size",
      ownership_type: "Ownership",
      crops: "Crops",
      has_irrigation: "Water Source",
      season: "Season"
    },
    ownershipLabels: {
      owner: "Land Owner",
      tenant: "Tenant Farmer",
      sharecropper: "Sharecropper"
    },
    irrigationLabels: {
      yes: "Borewell / Canal",
      no: "Rainfed (Dryland)"
    },
    missingTag: "Required",
    filledTag: "Verified",

    schemesHeading: "Government Schemes",
    schemesSubheading: "Verified central and state agricultural support schemes",
    schemesTitle: "Verified Government Schemes",
    schemesSubtitle: "Evaluated by deterministic rules engine against official guidelines",
    tabs: {
      all: "All Schemes",
      eligible: "Eligible Schemes",
      needsInfo: "Needs More Info",
      demo: "Demo Prototypes"
    },
    status: {
      eligible: "Eligible",
      ineligible: "Ineligible",
      needs_more_info: "Needs More Info"
    },
    verifiedBadge: "Verified by MoA&FW",
    verifiedDate: "Verified: October 2026",
    demoBadge: "DEMO WATERMARK",
    viewDetails: "View Details",
    viewDocuments: "View Evidence & Apply",
    officialPortal: "Visit Official Portal",
    helpline: "Toll-Free Helpline",
    benefitsHeading: "Financial & Subsidy Benefits",
    rulesCheckHeading: "Eligibility Rules Evaluation",
    satisfied: "Criteria Met",
    notSatisfied: "Criteria Not Met",
    unknown: "Pending Information",
    documentsRequiredHeading: "Required Documents Checklist",
    verifiedGov: "Verified by Government Sources",
    lastUpdated: "Last Updated: October 2026",
    officialLinks: "Official Links Available",

    eligibilityTitle: "Eligibility Assessment View",
    preliminaryResult: "Preliminary Result",
    eligibleMessage: "You are likely eligible for PM-KISAN",
    eligibleSubtext: "Based on statutory rules and your declared profile parameters, you qualify for the following direct benefits.",
    detailsTitle: "Parameters Evaluated:",
    ruleLand: "Land Area: 4 Acres verified",
    ruleOwnership: "Cultivator Status: Land Owner",
    ruleTax: "Statutory Exclusion: Non-Tax Payer",
    ruleStatus: "Active Farmland: Confirmed",
    officialSource: "Official Source:",
    officialPmkisanWebsite: "PM-KISAN Official Website",
    disclaimerBox: "This is a deterministic preliminary assessment. Final approval is subject to verification by designated government authorities.",
    viewGuidanceBtn: "View Guidance & Documents",

    modalTitle: "Scheme Evidence & Application Dossier",
    closeModal: "Close",
    sourceUrl: "Official Source:",
    verifiedByText: "Verified Authority:",

    disclaimerTitle: "Statutory Disclaimer & Guidance",
    disclaimerText: "Krishi Mitra AI is an assistive decision-support tool. Eligibility evaluations are generated using deterministic logic mapped to verified government guidelines as of October 2026. Final benefit approval and DBT transfers remain subject to physical verification at local Raitha Samparka Kendras, Grama One, or the respective official government portals.",

    navHome: "Home",
    navStory: "Story",
    navVoice: "Voice AI",
    navSchemes: "Schemes",
    navEligibility: "Eligibility",
    settingsTitle: "Settings & Privacy",
    voiceInputSetting: "Voice Input Active",
    autoPlaySetting: "Auto-Play Spoken Response",
    saveChatSetting: "Persist Conversation",
    privacyPolicy: "Privacy Policy",
    helpSupport: "Help & Support"
  },
  hi: {
    appTitle: "Krishi Mitra AI",
    appSubtitle: "आपका एआई कृषि साथी",
    govIndia: "भारत सरकार",
    govHeader: "भारत सरकार एवं कर्नाटक सरकार की आधिकारिक योजनाएं",
    voiceFirstTag: "आवाज आधारित निर्णय समर्थन प्रणाली",
    liveStatus: "सक्रिय",
    offlineStatus: "ऑफ़लाइन",
    languageName: "हिन्दी",
    switchLanguage: "English में बदलें",

    heroTitle1: "बेहतर जवाब.",
    heroTitle2: "मजबूत किसान.",
    heroTitle3: "समृद्ध कल.",
    heroSubtitle: "सरकारी योजनाएं • पात्रता मार्गदर्शन • आपकी अपनी भाषा में",
    heroCTA: "शुरू करें",
    scrollExplore: "एक्सप्लोर करने के लिए स्क्रॉल करें",

    storyHeading: "हर किसान के पास सवाल हैं.",
    storySubheading: "Every farmer has questions.",
    storyDesc: "कृषि मित्र एआई आपको सरकारी योजनाओं के बारे में सटीक जानकारी देने, पात्रता जांचने और आपकी भाषा में सही मार्गदर्शन प्रदान करने के लिए उपस्थित है।",
    feat1: "सरकारी योजनाएं",
    feat2: "पात्रता जांच",
    feat3: "सरल मार्गदर्शन",
    storyCard1Title: "कृषि यंत्रीकरण",
    storyCard1Desc: "उपकरणों पर 50-75% सब्सिडी",
    storyCard2Title: "मृदा एवं फसल स्वास्थ्य",
    storyCard2Desc: "मुफ्त मिट्टी परीक्षण एवं सूक्ष्म पोषक तत्व",
    storyCard3Title: "वित्तीय संबल",
    storyCard3Desc: "पीएम-किसान ₹6,000 एवं पीएमएफबीवाई बीमा",

    voiceHeading: "मैं आपका कृषि मित्र AI हूँ.",
    voiceSubheading: "मैं आपकी क्या मदद कर सकता हूँ?",
    voiceStateIdle: "बोलने के लिए माइक दबाएं...",
    voiceStateListening: "सुन रहा हूँ...",
    voiceStateProcessing: "प्रसंस्करण हो रहा है...",
    voiceStateSpeaking: "उत्तर दिया जा रहा है...",
    voiceInstruction: "अपनी जमीन, फसल या जिले के बारे में बोलें",
    typePlaceholder: "यहाँ संदेश लिखें...",
    recentConversations: "हालिया बातचीत",
    recentQ1: "पीएम-किसान योजना की जानकारी",
    recentQ2: "मेरी पात्रता कैसे जांचें?",
    recentQ3: "पीएमएफबीवाई फसल बीमा",
    recentQ4: "आवश्यक दस्तावेज कौन से हैं?",

    chatTitle: "संवाद और वॉइस इंटरैक्शन",
    welcomeMessage: "नमस्ते! मैं आपका कृषि मित्र AI हूँ। अपनी जमीन और फसल का विवरण बताएं।",
    inputPlaceholder: "यहाँ संदेश लिखें या माइक दबाएं...",
    recording: "रिकॉर्डिंग हो रही है...",
    recordingInstruction: "स्पष्ट बोलें, फिर 'भेजें' दबाएं",
    stopAndSend: "रोकें और भेजें",
    cancelRecording: "रद्द करें",
    send: "भेजें",
    listeningBrowser: "ब्राउज़र सुन रहा है...",
    transcriptPreview: "पहचाना गया टेक्स्ट:",

    playingAudio: "आवाज सुनाई दे रही है...",
    playVoice: "आवाज सुनें",
    pauseVoice: "रोकें",
    replayVoice: "फिर सुनें",

    profileTitle: "किसान प्रोफाइल पैरामीटर",
    profileCompletion: "प्रोफाइल पूर्णता",
    editProfile: "संपादित करें",
    saveProfile: "सहेजें",
    cancel: "रद्द करें",
    slots: {
      district: "जिला",
      land_area_acres: "भूमि का आकार",
      ownership_type: "स्वामित्व",
      crops: "फसलें",
      has_irrigation: "सिंचाई स्रोत",
      season: "मौसम"
    },
    ownershipLabels: {
      owner: "भूमि स्वामी",
      tenant: "पट्टेदार किसान",
      sharecropper: "बटाईदार"
    },
    irrigationLabels: {
      yes: "बोरवेल / नहर",
      no: "वर्षा आधारित"
    },
    missingTag: "आवश्यक",
    filledTag: "सत्यापित",

    schemesHeading: "सरकारी योजनाएं",
    schemesSubheading: "केंद्र एवं राज्य सरकार की सत्यापित योजनाएं",
    schemesTitle: "सत्यापित सरकारी योजनाएं",
    schemesSubtitle: "आधिकारिक दिशानिर्देशों के अनुसार जांची गई योजनाएं",
    tabs: {
      all: "सभी योजनाएं",
      eligible: "पात्र योजनाएं",
      needsInfo: "अधिक जानकारी चाहिए",
      demo: "डेमो योजनाएं"
    },
    status: {
      eligible: "पात्र हैं",
      ineligible: "पात्र नहीं",
      needs_more_info: "जानकारी पूरी करें"
    },
    verifiedBadge: "MoA&FW द्वारा सत्यापित",
    verifiedDate: "सत्यापित: अक्टूबर 2026",
    demoBadge: "डेमो वॉटरमार्क",
    viewDetails: "विवरण देखें",
    viewDocuments: "दस्तावेज एवं आवेदन",
    officialPortal: "आधिकारिक पोर्टल पर जाएं",
    helpline: "हेल्पलाइन नंबर",
    benefitsHeading: "योजना के वित्तीय लाभ",
    rulesCheckHeading: "पात्रता नियमों की जांच",
    satisfied: "शर्त पूरी हुई",
    notSatisfied: "शर्त पूरी नहीं",
    unknown: "जानकारी शेष",
    documentsRequiredHeading: "आवश्यक दस्तावेज सूची",
    verifiedGov: "सरकारी स्रोतों द्वारा सत्यापित",
    lastUpdated: "अंतिम अद्यतन: अक्टूबर 2026",
    officialLinks: "आधिकारिक लिंक उपलब्ध",

    eligibilityTitle: "पात्रता मूल्यांकन",
    preliminaryResult: "प्रारंभिक परिणाम",
    eligibleMessage: "आप PM-KISAN के लिए पात्र हो सकते हैं",
    eligibleSubtext: "आपके विवरण के अनुसार आप निम्नलिखित लाभों के लिए पात्र हैं।",
    detailsTitle: "सत्यापित विवरण:",
    ruleLand: "भूमि: 4 एकड़",
    ruleOwnership: "स्वामित्व: भूस्वामी",
    ruleTax: "आयकर: गैर-करदाता",
    ruleStatus: "सक्रिय कृषि भूमि: हाँ",
    officialSource: "आधिकारिक स्रोत:",
    officialPmkisanWebsite: "PM-KISAN आधिकारिक वेबसाइट",
    disclaimerBox: "यह एक प्रारंभिक मूल्यांकन है। अंतिम स्वीकृति सरकारी सत्यापन के अधीन है।",
    viewGuidanceBtn: "मार्गदर्शन देखें",

    modalTitle: "योजना का विवरण एवं साक्ष्य",
    closeModal: "बंद करें",
    sourceUrl: "आधिकारिक स्रोत:",
    verifiedByText: "सत्यापित प्राधिकरण:",

    disclaimerTitle: "वैधानिक अस्वीकरण",
    disclaimerText: "कृषि मित्र एआई एक निर्णय सहायता उपकरण है। अंतिम लाभ की स्वीकृति संबंधित सरकारी विभाग द्वारा सत्यापन के बाद ही दी जाती है।",

    navHome: "होम",
    navStory: "कहानी",
    navVoice: "वॉइस एआई",
    navSchemes: "योजनाएं",
    navEligibility: "पात्रता",
    settingsTitle: "सेटिंग्स और गोपनीयता",
    voiceInputSetting: "वॉइस इनपुट सक्रिय",
    autoPlaySetting: "ऑटो-प्ले आवाज",
    saveChatSetting: "वार्तालाप सहेजें",
    privacyPolicy: "गोपनीयता नीति",
    helpSupport: "सहायता और समर्थन"
  },
  mr: {
    appTitle: "Krishi Mitra AI",
    appSubtitle: "तुमचा एआय शेतकरी सखा",
    govIndia: "भारत सरकार",
    govHeader: "भारत सरकार व महाराष्ट्र शासनाच्या प्रमाणित योजना",
    voiceFirstTag: "आवाज आधारित निर्णय समर्थन प्रणाली",
    liveStatus: "सक्रिय",
    offlineStatus: "ऑफलाइन",
    languageName: "मराठी",
    switchLanguage: "English मध्ये बदला",

    heroTitle1: "उत्तम उत्तरे.",
    heroTitle2: "सक्षम शेतकरी.",
    heroTitle3: "समृद्ध भविष्य.",
    heroSubtitle: "सरकारी योजना • पात्रता मार्गदर्शन • आपल्या भाषेत",
    heroCTA: "प्रवास सुरू करा",
    scrollExplore: "पुढे पाहण्यासाठी स्क्रोल करा",

    storyHeading: "प्रत्येक शेतकऱ्याचे काही प्रश्न असतात.",
    storySubheading: "Every farmer has questions.",
    storyDesc: "कृषी मित्र एआय आपल्याला सरकारी योजनांची खात्रीशीर माहिती देण्यासाठी, पात्रता तपासण्यासाठी आणि आपल्या भाषेत अचूक मार्गदर्शन करण्यासाठी सज्ज आहे.",
    feat1: "सरकारी योजना",
    feat2: "पात्रता पडताळणी",
    feat3: "सोपे मार्गदर्शन",
    storyCard1Title: "शेती यांत्रिकीकरण",
    storyCard1Desc: "कृषी यंत्रांवर 50-75% अनुदान",
    storyCard2Title: "माती आणि पीक संवर्धन",
    storyCard2Desc: "मोफत माती परीक्षण व पोषण सहाय्य",
    storyCard3Title: "आर्थिक सुरक्षितता",
    storyCard3Desc: "पीएम-किसान ₹6,000 थेट मदत व पीक विमा",

    voiceHeading: "मी आपला कृषी मित्र AI आहे.",
    voiceSubheading: "मी आज आपल्याला कशी मदत करू?",
    voiceStateIdle: "बोलण्यासाठी माइक दाबा...",
    voiceStateListening: "ऐकत आहे...",
    voiceStateProcessing: "माहिती तपासत आहे...",
    voiceStateSpeaking: "उत्तर देत आहे...",
    voiceInstruction: "तुमची जमीन, पीक किंवा जिल्ह्याबद्दल बोला",
    typePlaceholder: "येथे संदेश लिहा...",
    recentConversations: "अलीकडील संभाषण",
    recentQ1: "पीएम-किसान योजनेची माहिती",
    recentQ2: "माझी पात्रता कशी तपासावी?",
    recentQ3: "पीएमएफबीवाय पीक विमा तपशील",
    recentQ4: "कोणती कागदपत्रे लागतात?",

    chatTitle: "संवाद आणि व्हॉइस इंटरॅक्शन",
    welcomeMessage: "नमस्कार! मी आपला कृषी मित्र AI आहे. आपल्या शेतजमिनीचा आणि पिकाचा तपशील सांगा.",
    inputPlaceholder: "येथे संदेश लिहा किंवा माइक दाबा...",
    recording: "रेकॉर्डिंग सुरू आहे...",
    recordingInstruction: "स्पष्ट बोला, नंतर 'पाठवा' दाबा",
    stopAndSend: "थांबवा आणि पाठवा",
    cancelRecording: "रद्द करा",
    send: "पाठवा",
    listeningBrowser: "ब्राउझर ऐकत आहे...",
    transcriptPreview: "ओळखलेला मजकूर:",

    playingAudio: "आवाज ऐकू येत आहे...",
    playVoice: "आवाज ऐका",
    pauseVoice: "थांबवा",
    replayVoice: "पुन्हा ऐका",

    profileTitle: "शेतकरी प्रोफाइल माहिती",
    profileCompletion: "प्रोफाइल पूर्णता",
    editProfile: "संपादित करा",
    saveProfile: "जतन करा",
    cancel: "रद्द करा",
    slots: {
      district: "जिल्हा",
      land_area_acres: "जमिनीचे क्षेत्र",
      ownership_type: "मालकी",
      crops: "पिके",
      has_irrigation: "पाण्याचा स्त्रोत",
      season: "हंगाम"
    },
    ownershipLabels: {
      owner: "शेतजमीन मालक",
      tenant: "कूळ शेतकरी",
      sharecropper: "वाटा शेतकरी"
    },
    irrigationLabels: {
      yes: "बोअरवेल / कालवा",
      no: "कोरडवाहू"
    },
    missingTag: "आवश्यक",
    filledTag: "प्रमाणित",

    schemesHeading: "सरकारी योजना",
    schemesSubheading: "केंद्र व राज्य शासनाच्या प्रमाणित योजना",
    schemesTitle: "प्रमाणित सरकारी योजना",
    schemesSubtitle: "अधिकृत मार्गदर्शक तत्त्वांनुसार तपासलेल्या योजना",
    tabs: {
      all: "सर्व योजना",
      eligible: "पात्र योजना",
      needsInfo: "अधिक माहिती हवी",
      demo: "डेमो योजना"
    },
    status: {
      eligible: "पात्र आहात",
      ineligible: "पात्र नाही",
      needs_more_info: "माहिती पूर्ण करा"
    },
    verifiedBadge: "MoA&FW द्वारे प्रमाणित",
    verifiedDate: "प्रमाणित: ऑक्टोबर 2026",
    demoBadge: "डेमो वॉटरमार्क",
    viewDetails: "तपशील पहा",
    viewDocuments: "कागदपत्रे आणि अर्ज",
    officialPortal: "अधिकृत पोर्टलवर जा",
    helpline: "हेल्पलाइन क्रमांक",
    benefitsHeading: "योजनेचे आर्थिक लाभ",
    rulesCheckHeading: "पात्रता नियमांची पडताळणी",
    satisfied: "अट पूर्ण",
    notSatisfied: "अट अपूर्ण",
    unknown: "माहिती बाकी",
    documentsRequiredHeading: "आवश्यक कागदपत्रांची यादी",
    verifiedGov: "शासकीय स्त्रोतांद्वारे प्रमाणित",
    lastUpdated: "शेवटचे अपडेट: ऑक्टोबर 2026",
    officialLinks: "अधिकृत लिंक उपलब्ध",

    eligibilityTitle: "पात्रता मूल्यांकन",
    preliminaryResult: "प्राथमिक निकाल",
    eligibleMessage: "तुम्ही PM-KISAN साठी पात्र असू शकता",
    eligibleSubtext: "आपल्या माहितीनुसार आपण खालील लाभांसाठी पात्र आहात.",
    detailsTitle: "तपासलेले निकष:",
    ruleLand: "जमीन: 4 एकर उपलब्ध",
    ruleOwnership: "मालकी: शेतजमीन मालक",
    ruleTax: "करपात्रता: करदाते नाही",
    ruleStatus: "सक्रिय शेतजमीन: होय",
    officialSource: "अधिकृत स्त्रोत:",
    officialPmkisanWebsite: "PM-KISAN अधिकृत पोर्टल",
    disclaimerBox: "हा केवळ प्राथमिक अंदाज आहे. अंतिम मंजुरी शासकीय अधिकाऱ्यांच्या तपासणीवर अवलंबून असेल.",
    viewGuidanceBtn: "मार्गदर्शन पहा",

    modalTitle: "योजनेचा तपशील आणि पुरावे",
    closeModal: "बंद करा",
    sourceUrl: "अधिकृत स्त्रोत:",
    verifiedByText: "प्रमाणित प्राधिकरण:",

    disclaimerTitle: "वैधानिक अस्वीकरण",
    disclaimerText: "कृषी मित्र एआय हे निर्णय समर्थन साधन आहे. अंतिम मंजुरी शासकीय पडताळणीवर अवलंबून असेल.",

    navHome: "मुख्यपृष्ठ",
    navStory: "कथा",
    navVoice: "व्हॉइस एआय",
    navSchemes: "योजना",
    navEligibility: "पात्रता",
    settingsTitle: "सेटिंग्ज आणि गोपनीयता",
    voiceInputSetting: "व्हॉइस इनपुट सुरू",
    autoPlaySetting: "आवाज आपोआप ऐका",
    saveChatSetting: "संभाषण जतन करा",
    privacyPolicy: "गोपनीयता धोरण",
    helpSupport: "मदत आणि संपर्क"
  }
};

export function getDictionary(lang: SupportedLanguage): I18nDictionary {
  return i18n[lang] || i18n.kn;
}
