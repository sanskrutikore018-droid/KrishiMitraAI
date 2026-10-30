export type Language = 'kn' | 'en' | 'hi' | 'mr' | 'te';
export type SupportedLanguage = Language;

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  sub: string;
  region: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'kn', label: 'ಕನ್ನಡ', sub: 'Kannada', region: 'ಕರ್ನಾಟಕ' },
  { code: 'en', label: 'English', sub: 'English', region: 'National' },
  { code: 'hi', label: 'हिन्दी', sub: 'Hindi', region: 'भारत' },
  { code: 'te', label: 'తెలుగు', sub: 'Telugu', region: 'ఆంధ్రప్రదేశ్ & తెలంగాణ' },
  { code: 'mr', label: 'मराठी', sub: 'Marathi', region: 'महाराष्ट्र' }
];

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
  recognizedVoiceLabel: string;
  latestAiResponseLabel: string;

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
  verifiedNationalSchemes: string;
  demoSchemesHeading: string;
  auditStamp: string;
  zeroHallucinationTag: string;
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

  // Scheme Catalog Translations
  schemeCatalog: Record<string, { name: string; desc: string }>;

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

  // Disclaimer & Footer
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

  // Auth & Farmer Portal
  login: string;
  signup: string;
  logout: string;
  authModalTitle: string;
  authModalSubtitle: string;
  mobileInputTitle: string;
  mobileInputDesc: string;
  mobilePlaceholder: string;
  sendOtpBtn: string;
  otpVerificationTitle: string;
  otpSentTo: string;
  resendOtp: string;
  verifyOtpBtn: string;
  changeNumber: string;
  farmerOnboardingTitle: string;
  farmerOnboardingDesc: string;
  farmerNameLabel: string;
  farmerNamePlaceholder: string;
  districtLabel: string;
  districtPlaceholder: string;
  landSizeLabel: string;
  landSizePlaceholder: string;
  cropsLabel: string;
  ownershipLabel: string;
  ownerOption: string;
  tenantOption: string;
  completeSetupBtn: string;
  simulatedOtpNotice: string;
  invalidPhone: string;
  invalidOtp: string;
  profileSummary: string;
  verifiedFarmerBadge: string;

  // Dedicated High-Security Login & Signup Modals
  loginTitle: string;
  loginSubtitle: string;
  signupTitle: string;
  signupSubtitle: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  rememberMe: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  accountNotFoundAlert: string;
  invalidCredentialsAlert: string;
  passwordStrengthLabel: string;
  strengthWeak: string;
  strengthMedium: string;
  strengthStrong: string;
  passwordsMismatch: string;
  bruteForceLocked: string;
  demoCredentialsPill: string;
  fillDemoBtn: string;
  step1Credentials: string;
  step2FarmProfile: string;
  nextStepBtn: string;
  completeSignupBtn: string;
  backBtn: string;
  securityBadgeText: string;
}

export const i18n: Record<SupportedLanguage, I18nDictionary> = {
  // ================= KANNADA (ಕನ್ನಡ) =================
  kn: {
    appTitle: "ಕೃಷಿ ಮಿತ್ರ AI",
    appSubtitle: "ನಿಮ್ಮ AI ಕೃಷಿ ಒಡನಾಡಿ • An Initiative for Indian Agriculture",
    govIndia: "ಭಾರತ ಸರ್ಕಾರ • ಅಧಿಕೃತ ಯೋಜನೆಗಳು",
    govHeader: "ಭಾರತ ಸರ್ಕಾರ ಮತ್ತು ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಯೋಜನೆಗಳು",
    voiceFirstTag: "ಧ್ವನಿ ಆಧಾರಿತ ನಿರ್ಧಾರ ಸಹಾಯಕ ವ್ಯವಸ್ಥೆ",
    liveStatus: "ಸಕ್ರಿಯವಾಗಿದೆ",
    offlineStatus: "ಆಫ್‌ಲೈನ್",
    languageName: "ಕನ್ನಡ",
    switchLanguage: "Switch Language",

    heroTitle1: "ಉತ್ತಮ ಉತ್ತರಗಳು.",
    heroTitle2: "ಸಶಕ್ತ ರೈತರು.",
    heroTitle3: "ಹಸಿರು ನಾಳೆ.",
    heroSubtitle: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು • ಅರ್ಹತಾ ಮಾರ್ಗದರ್ಶನ • ನಿಮ್ಮದೇ ಕನ್ನಡ ಭಾಷೆಯಲ್ಲಿ.",
    heroCTA: "ನಿಮ್ಮ ಪ್ರಯಾಣ ಆರಂಭಿಸಿ →",
    scrollExplore: "↓ ವಿವರಗಳಿಗಾಗಿ ಕೆಳಗೆ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ",

    storyHeading: "ಪ್ರತಿ ರೈತನಿಗೆ ಪ್ರಶ್ನೆಗಳಿವೆ.",
    storySubheading: "ಕೃಷಿ ಮಿತ್ರ AI ನಿಮ್ಮ ಜತೆಗಿದೆ.",
    storyDesc: "ಕೃಷಿ ಮಿತ್ರ AI ರೈತರಿಗೆ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ, ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಕೃಷಿ ಯೋಜನೆಗಳ ಅರ್ಹತೆಯನ್ನು ನೈಸರ್ಗಿಕ ಧ್ವನಿ ಸಂಭಾಷಣೆಯ ಮೂಲಕ ಸುಲಭವಾಗಿ ತಿಳಿಸಿಕೊಡುತ್ತದೆ.",
    feat1: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    feat2: "ಅರ್ಹತೆ ಪರಿಶೀಲನೆ",
    feat3: "ಸುಲಭ ಮಾರ್ಗದರ್ಶನ",
    storyCard1Title: "ಆಧುನಿಕ ಯಾಂತ್ರೀಕರಣ",
    storyCard1Desc: "ಕೃಷಿ ಉಪಕರಣಗಳು ಮತ್ತು ಟ್ರ್ಯಾಕ್ಟರ್‌ಗಳಿಗೆ 50% ರಿಂದ 75% ಸಬ್ಸಿಡಿ",
    storyCard2Title: "ಮಣ್ಣು ಮತ್ತು ಬೆಳೆ ಆರೋಗ್ಯ",
    storyCard2Desc: "ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ಮೈಕ್ರೋನ್ಯೂಟ್ರಿಯೆಂಟ್ ಕಿಟ್ಸ್",
    storyCard3Title: "ನೇರ ಆದಾಯ ಬೆಂಬಲ",
    storyCard3Desc: "ರೈತರ ಖಾತೆಗೆ ನೇರ ನಗದು ವರ್ಗಾವಣೆ ಮತ್ತು ಸಮಗ್ರ ಬೆಳೆ ವಿಮೆ",

    voiceHeading: "ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರ AI.",
    voiceSubheading: "ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    voiceStateIdle: "ಮೈಕ್ರೋಫೋನ್ ಒತ್ತಿ ಅಥವಾ ಮಾತನಾಡಿ",
    voiceStateListening: "ಆಲಿಸುತ್ತಿದೆ...",
    voiceStateProcessing: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    voiceStateSpeaking: "ಮಾತನಾಡುತ್ತಿದೆ...",
    voiceInstruction: "ನಿಮ್ಮ ಜಮೀನು, ಬೆಳೆ ಮತ್ತು ಜಿಲ್ಲೆಯ ವಿವರಗಳನ್ನು ಕನ್ನಡದಲ್ಲೇ ಕೇಳಿ",
    typePlaceholder: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...",
    recentConversations: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆಗಳು",
    recentQ1: "PM-KISAN ಯೋಜನೆ ಬಗ್ಗೆ ಮಾಹಿತಿ",
    recentQ2: "ನನ್ನ ಅರ್ಹತೆ ಹೇಗೆ ತಿಳಿಯುವುದು?",
    recentQ3: "PMFBY ಬೆಳೆ ವಿಮೆ ವಿವರ",
    recentQ4: "ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?",
    recognizedVoiceLabel: "ಗುರುತಿಸಿದ ಧ್ವನಿ",
    latestAiResponseLabel: "ಸಕ್ರಿಯ ಪ್ರತಿಕ್ರಿಯೆ",

    chatTitle: "ಕೃಷಿ ಸಂವಾದ",
    welcomeMessage: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರ AI. ನಿಮ್ಮ ಕೃಷಿ ಭೂಮಿ, ಬೆಳೆ ಮತ್ತು ಜಿಲ್ಲೆಯ ವಿವರಗಳನ್ನು ಹೇಳಿ, ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸರ್ಕಾರಿ ಸಹಾಯಧನ ಮತ್ತು ಬೆಳೆ ವಿಮೆ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ ಕೊಡುತ್ತೇನೆ.",
    inputPlaceholder: "ಇಲ್ಲಿ ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಧ್ವನಿ ಬಳಸಿ...",
    recording: "ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ...",
    recordingInstruction: "ಮಾತನಾಡಿ, ಮುಗಿದ ನಂತರ ನಿಲ್ಲಿಸಿ",
    stopAndSend: "ನಿಲ್ಲಿಸಿ ಕಳುಹಿಸಿ",
    cancelRecording: "ರದ್ದುಮಾಡಿ",
    send: "ಕಳುಹಿಸಿ",
    listeningBrowser: "ಬ್ರೌಸರ್ ಮೂಲಕ ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    transcriptPreview: "ಧ್ವನಿ ಪ್ರತಿಲೇಖನ:",
    playingAudio: "ಧ್ವನಿ ಪ್ಲೇ ಆಗುತ್ತಿದೆ...",
    playVoice: "ಆಡಿಯೋ ಕೇಳಿ",
    pauseVoice: "ನಿಲ್ಲಿಸಿ",
    replayVoice: "ಮತ್ತೆ ಕೇಳಿ",

    profileTitle: "ರೈತರ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ",
    profileCompletion: "ಪ್ರೊಫೈಲ್ ಪೂರ್ಣತೆ",
    editProfile: "ತಿದ್ದುಪಡಿ ಮಾಡಿ",
    saveProfile: "ಉಳಿಸಿ",
    cancel: "ರದ್ದು",
    slots: {
      district: "ಜಿಲ್ಲೆ",
      land_area_acres: "ಭೂಮಿ (ಎಕರೆ)",
      ownership_type: "ಮಾಲೀಕತ್ವದ ವಿಧ",
      crops: "ಬೆಳೆಗಳು",
      has_irrigation: "ನೀರಾವರಿ ಸೌಲಭ್ಯ",
      season: "ಋತುಮಾನ"
    },
    ownershipLabels: {
      owner: "ಸ್ವಂತ ಜಮೀನು (ಮಾಲೀಕ)",
      tenant: "ಗೇಣಿ ರೈತ (Tenant)",
      sharecropper: "ಪಾಲುದಾರ (Sharecropper)"
    },
    irrigationLabels: {
      yes: "ಹೌದು (ನೀರಾವರಿ ಇದೆ)",
      no: "ಇಲ್ಲ (ಮಳೆ ಆಶ್ರಿತ)"
    },
    missingTag: "ಮಾಹಿತಿ ಬೇಕಿದೆ",
    filledTag: "ಪೂರ್ಣಗೊಂಡಿದೆ",

    schemesHeading: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    schemesSubheading: "ಅಧಿಕೃತ ಗೆಜೆಟ್ ನಿಯಮಗಳ ಪ್ರಕಾರ ಪರಿಶೀಲಿಸಲಾದ ಯೋಜನೆಗಳು",
    schemesTitle: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಪಟ್ಟಿ",
    schemesSubtitle: "ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ನೇರವಾಗಿ ಪರೀಕ್ಷಿಸಿ",
    verifiedNationalSchemes: "ಪರಿಶೀಲಿತ ರಾಷ್ಟ್ರೀಯ ಯೋಜನೆಗಳು",
    demoSchemesHeading: "ಮಾದರಿ ಪ್ರದರ್ಶನ ಯೋಜನೆಗಳು (ಡೆಮೊ)",
    auditStamp: "ಸರ್ಕಾರಿ ಮೂಲಗಳಿಂದ ಆಡಿಟ್ ಮಾಡಲಾಗಿದೆ • ಅಕ್ಟೋಬರ್ 2026",
    zeroHallucinationTag: "ನಿಯಮ-ಆಧಾರಿತ ಮ್ಯಾಟ್ರಿಕ್ಸ್ • ಶೂನ್ಯ ಭ್ರಮೆ",
    tabs: {
      all: "ಎಲ್ಲಾ ಯೋಜನೆಗಳು",
      eligible: "ಅರ್ಹವಿರುವ ಯೋಜನೆಗಳು",
      needsInfo: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಅಗತ್ಯ",
      demo: "ಡೆಮೊ ಯೋಜನೆಗಳು"
    },
    status: {
      eligible: "ಅರ್ಹತೆ ಇದೆ",
      ineligible: "ಅರ್ಹತೆ ಇಲ್ಲ",
      needs_more_info: "ಮಾಹಿತಿ ಅಪೂರ್ಣ"
    },
    verifiedBadge: "ಪರಿಶೀಲಿತ ಯೋಜನೆ",
    verifiedDate: "ಪರಿಶೀಲನಾ ದಿನಾಂಕ: ಅಕ್ಟೋಬರ್ 2026",
    demoBadge: "ಮಾದರಿ ಯೋಜನೆ (ಡೆಮೊ)",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
    viewDocuments: "ದಾಖಲೆಗಳ ಪಟ್ಟಿ",
    officialPortal: "ಅಧಿಕೃತ ಪೋರ್ಟಲ್",
    helpline: "ಸಹಾಯವಾಣಿ",
    benefitsHeading: "ಯೋಜನೆಯ ಪ್ರಯೋಜನಗಳು",
    rulesCheckHeading: "ಅರ್ಹತಾ ನಿಯಮಗಳ ಪರಿಶೀಲನೆ",
    satisfied: "ತೃಪ್ತಿಕರ (ಅರ್ಹ)",
    notSatisfied: "ಅರ್ಹವಲ್ಲ",
    unknown: "ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
    documentsRequiredHeading: "ಅಗತ್ಯ ದಾಖಲೆಗಳು",
    verifiedGov: "ಸರ್ಕಾರಿ ಮೂಲಗಳಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    lastUpdated: "ಅಪ್‌ಡೇಟ್: ಅಕ್ಟೋಬರ್ 2026",
    officialLinks: "ಅಧಿಕೃತ ಲಿಂಕ್‌ಗಳು ಲಭ್ಯವಿದೆ",

    schemeCatalog: {
      'pm-kisan': {
        name: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ (PM-KISAN)",
        desc: "ಅರ್ಹ ಭೂಮಿ ಹೊಂದಿರುವ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ಆರ್ಥಿಕ ನೆರವು (ತಲಾ ₹2,000 ನಂತೆ ಮೂರು ಕಂತುಗಳಲ್ಲಿ ಡಿಬಿಟಿ ಮೂಲಕ)."
      },
      'pmfby': {
        name: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY)",
        desc: "ನೈಸರ್ಗಿಕ ವಿಕೋಪ, ಬರ ಮತ್ತು ಅಕಾಲಿಕ ಮಳೆಯಿಂದಾಗುವ ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಸಮಗ್ರ ಬೆಳೆ ವಿಮೆ ರಕ್ಷಣೆ. ರೈತರ ಪ್ರೀಮಿಯಂ ಕೇವಲ 1.5% ರಿಂದ 2%."
      },
      'demo-micro-irrigation': {
        name: "ಸೂಕ್ಷ್ಮ ನೀರಾವರಿ ಪ್ರೋತ್ಸಾಹ ಯೋಜನೆ (PMKSY)",
        desc: "ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಸ್ಥಾಪನೆಗೆ 90% ವರೆಗೆ ಸಬ್ಸಿಡಿ."
      },
      'demo-agri-equipment': {
        name: "ಕೃಷಿ ಯಾಂತ್ರೀಕರಣ ಮತ್ತು ಉಪಕರಣಗಳ ನೆರವು (SMAM)",
        desc: "ಟ್ರ್ಯಾಕ್ಟರ್, ಪವರ್ ಟಿಲ್ಲರ್ ಮತ್ತು ಆಧುನಿಕ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳ ಖರೀದಿಗೆ 50% ರಿಂದ 75% ಸಹಾಯಧನ."
      },
      'demo-soil-improvement': {
        name: "ಮಣ್ಣು ಆರೋಗ್ಯ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶ ಬೆಂಬಲ ಯೋಜನೆ",
        desc: "ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ, ಸೂಕ್ಷ್ಮ ಪೋಷಕಾಂಶಗಳ ಕಿಟ್ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಕಾರ್ಡ್ ವಿತರಣೆ."
      }
    },

    eligibilityTitle: "ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲನೆ",
    preliminaryResult: "ಪ್ರಾಥಮಿಕ ಫಲಿತಾಂಶ",
    eligibleMessage: "ನೀವು PM-KISAN ಗೆ ಅರ್ಹರಾಗುವ ಸಾಧ್ಯತೆ ಇದೆ",
    eligibleSubtext: "ನೀವು ಒದಗಿಸಿದ ಕೃಷಿ ವಿವರಗಳ ಆಧಾರದ ಮೇಲೆ ಈ ಕೆಳಗಿನ ಪ್ರಯೋಜನಗಳು ಅನ್ವಯಿಸುತ್ತವೆ.",
    detailsTitle: "ಪರಿಶೀಲಿಸಿದ ಮಾನದಂಡಗಳು:",
    ruleLand: "ಭೂಮಿ: ಲಭ್ಯವಿರುವ ಮಾಹಿತಿ ಅನ್ವಯ",
    ruleOwnership: "ಸ್ಥಾನಮಾನ: ಕೃಷಿ ಭೂಮಿ ಮಾಲೀಕರು",
    ruleTax: "ಆದಾಯ ತೆರಿಗೆ: ಪಾವತಿಸುವುದಿಲ್ಲ",
    ruleStatus: "ಚಾಲ್ತಿ ಕೃಷಿ ಜಮೀನು: ಅನ್ವಯಿಸುತ್ತದೆ",
    officialSource: "ಅಧಿಕೃತ ಮೂಲ:",
    officialPmkisanWebsite: "PM-KISAN ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್",
    disclaimerBox: "ಇದು ಪ್ರಾಥಮಿಕ ಅರ್ಹತಾ ಪರಿಶೀಲನೆ ಮಾತ್ರ. ಅಂತಿಮ ಅನುಮೋದನೆಗೆ ಸರ್ಕಾರಿ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಯೇ ಅಂತಿಮ.",
    viewGuidanceBtn: "ಮಾರ್ಗದರ್ಶನ ನೋಡಿ",

    modalTitle: "ಯೋಜನೆಯ ವಿವರ ಮತ್ತು ಸಾಕ್ಷ್ಯಗಳು",
    closeModal: "ಮುಚ್ಚಿ",
    sourceUrl: "ಅಧಿಕೃತ ಮೂಲ:",
    verifiedByText: "ಪರಿಶೀಲಿಸಿದ ಪ್ರಾಧಿಕಾರ:",

    disclaimerTitle: "ಕಾನೂನು ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ಎಚ್ಚರಿಕೆ",
    disclaimerText: "ಕೃಷಿ ಮಿತ್ರ AI ಒಂದು ಧ್ವನಿ ಆಧಾರಿತ ಮಾಹಿತಿ ಸಹಾಯಕವಾಗಿದ್ದು, ಅಧಿಕೃತ ಗೆಜೆಟ್ ನಿಯಮಾವಳಿಗಳ ಆಧಾರದ ಮೇಲೆ ಸಲಹೆ ನೀಡುತ್ತದೆ. ಅಂತಿಮ ಸಬ್ಸಿಡಿ ಮತ್ತು ವಿಮೆ ಮಂಜೂರಾತಿಯು ಸಂಬಂಧಿಸಿದ ಇಲಾಖಾ ಅಧಿಕಾರಿಗಳ ವಿವೇಚನೆಗೆ ಒಳಪಟ್ಟಿರುತ್ತದೆ.",

    navHome: "ಮುಖಪುಟ",
    navStory: "ಕಥೆ",
    navVoice: "ಧ್ವನಿ AI",
    navSchemes: "ಯೋಜನೆಗಳು",
    navEligibility: "ಅರ್ಹತೆ",
    settingsTitle: "ಸೆಟ್ಟಿಂಗ್ಸ್ ಮತ್ತು ಗೌಪ್ಯತೆ",
    voiceInputSetting: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಸಕ್ರಿಯಗೊಳಿಸಿ",
    autoPlaySetting: "ಉತ್ತರವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಆಲಿಸಿ",
    saveChatSetting: "ಸಂಭಾಷಣೆಯನ್ನು ಉಳಿಸಿ",
    privacyPolicy: "ಗೌಪ್ಯತಾ ನೀತಿ",
    helpSupport: "ಸಹಾಯ ಮತ್ತು ಸಂಪರ್ಕ",

    login: "ಲಾಗಿನ್",
    signup: "ನೋಂದಣಿ (ಸೈನ್ ಅಪ್)",
    logout: "ಲಾಗ್‌ಔಟ್",
    authModalTitle: "ರೈತ ಸುರಕ್ಷಿತ ಪ್ರವೇಶ ದ್ವಾರ",
    authModalSubtitle: "OTP ಮೂಲಕ ಪಾಸ್‌ವರ್ಡ್ ಮುಕ್ತ ಪ್ರವೇಶ",
    mobileInputTitle: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
    mobileInputDesc: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ 6-ಅಂಕಿಯ ಸುರಕ್ಷಿತ OTP ಕಳುಹಿಸಲಾಗುವುದು",
    mobilePlaceholder: "10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    sendOtpBtn: "OTP ಕಳುಹಿಸಿ →",
    otpVerificationTitle: "OTP ಪರಿಶೀಲನೆ",
    otpSentTo: "OTP ಕಳುಹಿಸಲಾದ ಸಂಖ್ಯೆ:",
    resendOtp: "OTP ಮರುಕಳುಹಿಸಿ",
    verifyOtpBtn: "ದೃಢೀಕರಿಸಿ ಮುಂದುವರಿಯಿರಿ →",
    changeNumber: "ಸಂಖ್ಯೆ ಬದಲಿಸಿ",
    farmerOnboardingTitle: "ರೈತರ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ",
    farmerOnboardingDesc: "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಅರ್ಹತೆಯನ್ನು ತಕ್ಷಣ ತಿಳಿಯಲು ನಿಮ್ಮ ಕೃಷಿ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ",
    farmerNameLabel: "ರೈತರ ಪೂರ್ಣ ಹೆಸರು",
    farmerNamePlaceholder: "ಉದಾ: ರಮೇಶ್ ಪಾಟೀಲ್",
    districtLabel: "ಜಿಲ್ಲೆ",
    districtPlaceholder: "ಉದಾ: ಬೆಳಗಾವಿ, ಧಾರವಾಡ",
    landSizeLabel: "ಒಟ್ಟು ಜಮೀನು (ಎಕರೆಗಳಲ್ಲಿ)",
    landSizePlaceholder: "ಉದಾ: 2.5",
    cropsLabel: "ಬೆಳೆಯುವ ಪ್ರಮುಖ ಬೆಳೆಗಳು",
    ownershipLabel: "ಭೂ ಮಾಲೀಕತ್ವದ ವಿವರ",
    ownerOption: "ಸ್ವಂತ ಜಮೀನುದಾರ (ಆರ್‌ಟಿಸಿ / ಪಟ್ಟಾದಾರ)",
    tenantOption: "ಗೇಣಿ / ಪಾಲುದಾರ ರೈತ",
    completeSetupBtn: "ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ & ಯೋಜನೆಗಳನ್ನು ನೋಡಿ →",
    simulatedOtpNotice: "ತಕ್ಷಣದ ಪರೀಕ್ಷೆಗಾಗಿ ಡೆಮೊ OTP: 123456",
    invalidPhone: "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ",
    invalidOtp: "ತಪ್ಪಾದ OTP. ದಯವಿಟ್ಟು 123456 ಅಥವಾ ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಬಂದ ಕೋಡ್ ಬಳಸಿ.",
    profileSummary: "ರೈತರ ಮಾಹಿತಿ",
    verifiedFarmerBadge: "ಪರಿಶೀಲಿತ ರೈತ",

    loginTitle: "ರೈತ ಸುರಕ್ಷಿತ ಲಾಗಿನ್",
    loginSubtitle: "ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ಉನ್ನತ ಭದ್ರತೆಯ ಡಿಜಿಟಲ್ ಪ್ರವೇಶ",
    signupTitle: "ರೈತರ ನೋಂದಣಿ & ಪ್ರೊಫೈಲ್",
    signupSubtitle: "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ಯೋಜನೆಗಳ ಅರ್ಹತೆಯನ್ನು ತಕ್ಷಣ ತಿಳಿಯಿರಿ",
    identifierLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಅಥವಾ ಇಮೇಲ್",
    identifierPlaceholder: "ಉದಾ: 9876543210 ಅಥವಾ farmer@gmail.com",
    passwordLabel: "ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಪಾಸ್‌ವರ್ಡ್",
    confirmPasswordLabel: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    confirmPasswordPlaceholder: "ಪಾಸ್‌ವರ್ಡ್ ಮರು-ನಮೂದಿಸಿ",
    rememberMe: "ನನ್ನ ಸೆಷನ್ ಸುರಕ್ಷಿತವಾಗಿ ನೆನಪಿಡಿ",
    dontHaveAccount: "ಹೊಸಬರೇ? ಇಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿಕೊಳ್ಳಿ →",
    alreadyHaveAccount: "ಖಾತೆ ಇದೆಯೇ? ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ →",
    accountNotFoundAlert: "ಖಾತೆ ಕಂಡುಬಂದಿಲ್ಲ! ಕೃಷಿ ಮಿತ್ರ AI ಪ್ರವೇಶಿಸಲು ದಯವಿಟ್ಟು ಮೊದಲು ನೋಂದಣಿ (Sign Up) ಮಾಡಿ.",
    invalidCredentialsAlert: "ತಪ್ಪಾದ ಪಾಸ್‌ವರ್ಡ್ ಅಥವಾ ವಿವರಗಳು. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.",
    passwordStrengthLabel: "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ",
    strengthWeak: "ದುರ್ಬಲ",
    strengthMedium: "ಸಾಧಾರಣ",
    strengthStrong: "ಬಲಿಷ್ಠ",
    passwordsMismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
    bruteForceLocked: "ಹೆಚ್ಚು ಬಾರಿ ತಪ್ಪಾದ ಯತ್ನ! ಭದ್ರತಾ ಕೂಲ್‌ಡೌನ್ ಬಾಕಿ ಇದೆ:",
    demoCredentialsPill: "ಡೆಮೊ ಲಾಗಿನ್: 9876543210 / Krishi@2026",
    fillDemoBtn: "ಡೆಮೊ ಮಾಹಿತಿ ಭರ್ತಿ ಮಾಡಿ",
    step1Credentials: "ಹಂತ 1: ಭದ್ರತಾ ವಿವರಗಳು",
    step2FarmProfile: "ಹಂತ 2: ಜಮೀನು & ಬೆಳೆ ವಿವರ",
    nextStepBtn: "ಮುಂದಿನ ಹಂತ: ಕೃಷಿ ಮಾಹಿತಿ →",
    completeSignupBtn: "ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ & AI ಪ್ರಾರಂಭಿಸಿ →",
    backBtn: "ಹಿಂದಕ್ಕೆ",
    securityBadgeText: "256-ಬಿಟ್ ಸುರಕ್ಷಿತ ಗೂಢಲಿಪೀಕರಣ • ಶೂನ್ಯ ಡೇಟಾ ಸೋರಿಕೆ"
  },

  // ================= ENGLISH =================
  en: {
    appTitle: "Krishi Mitra AI",
    appSubtitle: "Your AI Farming Companion • An Initiative for Indian Agriculture",
    govIndia: "Government of India • Official Schemes",
    govHeader: "Official Schemes of Government of India & State Agriculture Departments",
    voiceFirstTag: "Voice-First Agricultural Decision-Support System",
    liveStatus: "Live & Connected",
    offlineStatus: "Offline Mode",
    languageName: "English",
    switchLanguage: "Change Language",

    heroTitle1: "Better Answers.",
    heroTitle2: "Stronger Farmers.",
    heroTitle3: "A Greener Tomorrow.",
    heroSubtitle: "Government schemes • Eligibility guidance • In your language.",
    heroCTA: "Start Your Journey →",
    scrollExplore: "↓ Scroll to explore",

    storyHeading: "Every farmer has questions.",
    storySubheading: "Krishi Mitra AI is here to help.",
    storyDesc: "Krishi Mitra AI provides deterministic, zero-hallucination guidance on agricultural subsidies, crop insurance, and financial safety through natural multilingual voice interaction.",
    feat1: "Government Schemes",
    feat2: "Eligibility Check",
    feat3: "Simple Guidance",
    storyCard1Title: "Modern Mechanization",
    storyCard1Desc: "50%–75% capital subsidies on farm implements and custom hiring centers",
    storyCard2Title: "Soil & Crop Health",
    storyCard2Desc: "Free soil health testing, organic certification, and micronutrient kits",
    storyCard3Title: "Direct Income Support",
    storyCard3Desc: "Direct Benefit Transfers into bank accounts and comprehensive crop insurance",

    voiceHeading: "I am your Krishi Mitra AI.",
    voiceSubheading: "How can I assist you today?",
    voiceStateIdle: "Click microphone or speak to start",
    voiceStateListening: "Listening to your voice...",
    voiceStateProcessing: "Evaluating eligibility matrix...",
    voiceStateSpeaking: "Speaking answer...",
    voiceInstruction: "Speak naturally about your land, crops, and district",
    typePlaceholder: "Type your query here or use voice...",
    recentConversations: "Recent Conversations",
    recentQ1: "Tell me about PM-KISAN benefits",
    recentQ2: "How do I check my scheme eligibility?",
    recentQ3: "PMFBY crop insurance claim rules",
    recentQ4: "What documents are required?",
    recognizedVoiceLabel: "Recognized Voice",
    latestAiResponseLabel: "Latest AI Response",

    chatTitle: "Farm Consultation",
    welcomeMessage: "Namaskara! I am Krishi Mitra AI. Tell me about your farmland, district, and crops to evaluate your eligibility for official central and state government schemes.",
    inputPlaceholder: "Type your message or speak naturally...",
    recording: "Recording voice audio...",
    recordingInstruction: "Speak clearly and stop when finished",
    stopAndSend: "Stop & Send",
    cancelRecording: "Cancel",
    send: "Send",
    listeningBrowser: "Listening via Web Speech API...",
    transcriptPreview: "Voice Transcript:",
    playingAudio: "Playing voice response...",
    playVoice: "Listen Audio",
    pauseVoice: "Pause",
    replayVoice: "Replay",

    profileTitle: "Farmer Profile Tracker",
    profileCompletion: "Profile Completion",
    editProfile: "Edit Profile",
    saveProfile: "Save Changes",
    cancel: "Cancel",
    slots: {
      district: "District",
      land_area_acres: "Land (Acres)",
      ownership_type: "Ownership Status",
      crops: "Cultivated Crops",
      has_irrigation: "Irrigation Facility",
      season: "Season"
    },
    ownershipLabels: {
      owner: "Landowner (Self-owned)",
      tenant: "Tenant Farmer",
      sharecropper: "Sharecropper"
    },
    irrigationLabels: {
      yes: "Yes (Irrigated)",
      no: "No (Rainfed)"
    },
    missingTag: "Information Needed",
    filledTag: "Completed",

    schemesHeading: "Government Schemes",
    schemesSubheading: "Verified statutory guidelines from official Government of India gazettes",
    schemesTitle: "Official Agriculture Schemes",
    schemesSubtitle: "Deterministic, rule-based verification with no LLM hallucinations",
    verifiedNationalSchemes: "Verified National Schemes",
    demoSchemesHeading: "Prototype Demonstration Schemes",
    auditStamp: "Audited by Government Sources • October 2026",
    zeroHallucinationTag: "Deterministic Rules Engine • Zero Hallucination",
    tabs: {
      all: "All Schemes",
      eligible: "Likely Eligible",
      needsInfo: "Needs More Info",
      demo: "Demo Schemes"
    },
    status: {
      eligible: "Eligible",
      ineligible: "Ineligible",
      needs_more_info: "Needs More Info"
    },
    verifiedBadge: "Verified Scheme",
    verifiedDate: "Audit: October 2026",
    demoBadge: "Demo Prototype",
    viewDetails: "View Details",
    viewDocuments: "Required Documents",
    officialPortal: "Official Portal",
    helpline: "Toll-Free Helpline",
    benefitsHeading: "Scheme Benefits",
    rulesCheckHeading: "Eligibility Rules Evaluation",
    satisfied: "Satisfied (Eligible)",
    notSatisfied: "Not Satisfied",
    unknown: "Not Provided Yet",
    documentsRequiredHeading: "Required Documents",
    verifiedGov: "Verified by Government Sources",
    lastUpdated: "Last Updated: October 2026",
    officialLinks: "Official Links Available",

    schemeCatalog: {
      'pm-kisan': {
        name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        desc: "Direct financial assistance of ₹6,000 per year in three equal installments of ₹2,000 to all eligible landholding farmer families across India."
      },
      'pmfby': {
        name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        desc: "Comprehensive crop insurance coverage against non-preventable natural risks, drought, unseasonal rains, and post-harvest losses."
      },
      'demo-micro-irrigation': {
        name: "Micro-Irrigation Support Scheme (PMKSY)",
        desc: "Up to 90% capital subsidy for drip and sprinkler irrigation installations for small and marginal farmers."
      },
      'demo-agri-equipment': {
        name: "Farm Mechanization & Equipment Assistance (SMAM)",
        desc: "50% to 75% financial assistance on tractors, power tillers, and custom hiring center farm implements."
      },
      'demo-soil-improvement': {
        name: "Soil Health & Micronutrient Assistance Scheme",
        desc: "Free soil health testing, organic soil conditioner kits, and customized soil health card distribution."
      }
    },

    eligibilityTitle: "Eligibility Assessment",
    preliminaryResult: "Preliminary Result",
    eligibleMessage: "You are likely eligible for PM-KISAN",
    eligibleSubtext: "Based on the farmland and profile attributes you provided, you meet key criteria.",
    detailsTitle: "Evaluated Criteria:",
    ruleLand: "Land Size: Within permissible limit",
    ruleOwnership: "Ownership: Landholding Farmer",
    ruleTax: "Income Tax: Non-taxpayer",
    ruleStatus: "Active Cultivation: Satisfied",
    officialSource: "Official Source:",
    officialPmkisanWebsite: "PM-KISAN Official Portal",
    disclaimerBox: "This is a preliminary decision-support assessment. Final sanction is subject to physical verification by designated agricultural department officers.",
    viewGuidanceBtn: "View Guidance & Documents",

    modalTitle: "Scheme Dossier & Statutory Evidence",
    closeModal: "Close",
    sourceUrl: "Official Source:",
    verifiedByText: "Audited Authority:",

    disclaimerTitle: "Statutory Disclaimer",
    disclaimerText: "Krishi Mitra AI is a decision-support guide grounded strictly in official government gazette criteria. Sanctions and disbursement depend on field verification by competent agricultural authorities.",

    navHome: "Home",
    navStory: "Story",
    navVoice: "Voice AI",
    navSchemes: "Schemes",
    navEligibility: "Eligibility",
    settingsTitle: "Settings & Privacy",
    voiceInputSetting: "Voice Input Enabled",
    autoPlaySetting: "Auto-Play Spoken Audio",
    saveChatSetting: "Persist Conversation Locally",
    privacyPolicy: "Privacy Policy",
    helpSupport: "Help & Helplines",

    login: "Farmer Login",
    signup: "Register / Sign Up",
    logout: "Logout",
    authModalTitle: "Farmer Secure Portal",
    authModalSubtitle: "Password-free instant access with Mobile OTP",
    mobileInputTitle: "Enter Mobile Number",
    mobileInputDesc: "A 6-digit secure verification code (OTP) will be sent",
    mobilePlaceholder: "10-digit mobile number",
    sendOtpBtn: "Send Verification OTP →",
    otpVerificationTitle: "Enter Verification Code",
    otpSentTo: "OTP code sent to",
    resendOtp: "Resend Code",
    verifyOtpBtn: "Verify & Proceed →",
    changeNumber: "Change Mobile Number",
    farmerOnboardingTitle: "Farmer Profile Setup",
    farmerOnboardingDesc: "Set up your land and crop details to automatically evaluate government subsidy eligibility",
    farmerNameLabel: "Farmer Full Name",
    farmerNamePlaceholder: "e.g. Ramesh Patil",
    districtLabel: "District",
    districtPlaceholder: "e.g. Belagavi, Dharwad, Pune",
    landSizeLabel: "Total Land Size (Acres)",
    landSizePlaceholder: "e.g. 2.5",
    cropsLabel: "Primary Crops Grown",
    ownershipLabel: "Land Ownership Status",
    ownerOption: "Land Owner (Pattadar / RTC Title Holder)",
    tenantOption: "Tenant Farmer / Sharecropper",
    completeSetupBtn: "Save Profile & Explore Eligible Schemes →",
    simulatedOtpNotice: "Simulated test OTP for instant access: 123456",
    invalidPhone: "Please enter a valid 10-digit Indian mobile number",
    invalidOtp: "Invalid OTP. Use 123456 or the code sent to your phone.",
    profileSummary: "Farmer Profile",
    verifiedFarmerBadge: "Verified Farmer",

    loginTitle: "Farmer Secure Login",
    loginSubtitle: "High-Security Access Portal for Indian Farmers",
    signupTitle: "Farmer Registration & Onboarding",
    signupSubtitle: "Register to Unlock Government Subsidies & Schemes",
    identifierLabel: "Mobile Number or Email",
    identifierPlaceholder: "e.g. 9876543210 or farmer@gmail.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your secure password",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "Re-enter your password",
    rememberMe: "Remember my session securely",
    dontHaveAccount: "New to Krishi Mitra? Create an Account →",
    alreadyHaveAccount: "Already registered? Login here →",
    accountNotFoundAlert: "Account not found! Please sign up first to access Krishi Mitra AI.",
    invalidCredentialsAlert: "Invalid credentials or password. Please try again.",
    passwordStrengthLabel: "Password Strength",
    strengthWeak: "Weak",
    strengthMedium: "Medium",
    strengthStrong: "Strong",
    passwordsMismatch: "Passwords do not match",
    bruteForceLocked: "Too many failed attempts! Security cooldown active for",
    demoCredentialsPill: "Demo Login: 9876543210 / Krishi@2026",
    fillDemoBtn: "Fill Demo Credentials",
    step1Credentials: "Step 1: Security Credentials",
    step2FarmProfile: "Step 2: Land & Crop Mapping",
    nextStepBtn: "Next: Farm Details →",
    completeSignupBtn: "Complete Registration & Launch AI →",
    backBtn: "Back",
    securityBadgeText: "256-Bit Encrypted • Zero Data Exposure Policy"
  },

  // ================= HINDI (हिन्दी) =================
  hi: {
    appTitle: "कृषि मित्र AI",
    appSubtitle: "आपका AI किसान साथी • भारतीय कृषि के लिए एक राष्ट्रीय पहल",
    govIndia: "भारत सरकार • आधिकारिक योजनाएं",
    govHeader: "भारत सरकार और राज्य कृषि विभागों की आधिकारिक योजनाएं",
    voiceFirstTag: "आवाज-आधारित कृषि निर्णय सहायक प्रणाली",
    liveStatus: "सक्रिय और कनेक्टेड",
    offlineStatus: "ऑफ़लाइन मोड",
    languageName: "हिन्दी",
    switchLanguage: "भाषा बदलें",

    heroTitle1: "सटीक उत्तर।",
    heroTitle2: "सशक्त किसान।",
    heroTitle3: "एक हरा-भरा कल।",
    heroSubtitle: "सरकारी योजनाएं • पात्रता मार्गदर्शन • आपकी अपनी भाषा में।",
    heroCTA: "अपनी यात्रा शुरू करें →",
    scrollExplore: "↓ खोजने के लिए नीचे स्क्रॉल करें",

    storyHeading: "हर किसान के मन में सवाल होते हैं।",
    storySubheading: "कृषि मित्र AI आपके साथ है।",
    storyDesc: "कृषि मित्र AI किसानों को सरकारी सब्सिडी, फसल बीमा और वित्तीय सुरक्षा योजनाओं की प्रामाणिक जानकारी आपकी अपनी आवाज में तुरंत प्रदान करता है।",
    feat1: "सरकारी योजनाएं",
    feat2: "पात्रता जांच",
    feat3: "सरल मार्गदर्शन",
    storyCard1Title: "आधुनिक यंत्रीकरण",
    storyCard1Desc: "कृषि उपकरणों और कस्टम हायरिंग केंद्रों पर 50% से 75% तक की पूंजीगत सब्सिडी",
    storyCard2Title: "मृदा और फसल स्वास्थ्य",
    storyCard2Desc: "मुफ्त मृदा स्वास्थ्य परीक्षण, जैविक प्रमाणन और सूक्ष्म पोषक तत्व किट",
    storyCard3Title: "प्रत्यक्ष आय सहायता",
    storyCard3Desc: "बैंक खातों में सीधा लाभ हस्तांतरण (DBT) और व्यापक फसल बीमा सुरक्षा",

    voiceHeading: "मैं आपका कृषि मित्र AI हूँ।",
    voiceSubheading: "आज मैं आपकी क्या सहायता कर सकता हूँ?",
    voiceStateIdle: "माइक्रोफ़ोन दबाएं या बोलना शुरू करें",
    voiceStateListening: "आपकी आवाज सुन रहा हूँ...",
    voiceStateProcessing: "पात्रता नियमों की जांच हो रही है...",
    voiceStateSpeaking: "उत्तर बोल रहा हूँ...",
    voiceInstruction: "अपनी जमीन, फसल और जिले के बारे में खुलकर बोलें",
    typePlaceholder: "अपना प्रश्न यहाँ टाइप करें या आवाज का उपयोग करें...",
    recentConversations: "हाल की बातचीत",
    recentQ1: "PM-KISAN योजना की पूरी जानकारी",
    recentQ2: "मैं अपनी पात्रता कैसे जांचूँ?",
    recentQ3: "PMFBY फसल बीमा दावा प्रक्रिया",
    recentQ4: "किन दस्तावेजों की आवश्यकता है?",
    recognizedVoiceLabel: "पहचानी गई आवाज",
    latestAiResponseLabel: "सक्रिय एआई उत्तर",

    chatTitle: "कृषि परामर्श",
    welcomeMessage: "नमस्ते! मैं आपका कृषि मित्र AI सहायक हूँ। मुझे अपनी कृषि भूमि, जिले और फसलों के बारे में बताएं ताकि मैं सरकारी योजनाओं के लिए आपकी पात्रता जांच सकूं।",
    inputPlaceholder: "संदेश लिखें या माइक से बोलें...",
    recording: "आवाज रिकॉर्ड की जा रही है...",
    recordingInstruction: "स्पष्ट बोलें और समाप्त होने पर रोकें",
    stopAndSend: "रोकें और भेजें",
    cancelRecording: "रद्द करें",
    send: "भेजें",
    listeningBrowser: "वेब स्पीच द्वारा सुना जा रहा है...",
    transcriptPreview: "आवाज प्रतिलेख:",
    playingAudio: "आवाज चल रही है...",
    playVoice: "आवाज सुनें",
    pauseVoice: "रोकें",
    replayVoice: "पुनः सुनें",

    profileTitle: "किसान प्रोफाइल ट्रैकर",
    profileCompletion: "प्रोफाइल पूर्णता",
    editProfile: "बदलाव करें",
    saveProfile: "सहेजें",
    cancel: "रद्द करें",
    slots: {
      district: "जिला",
      land_area_acres: "भूमि (एकड़)",
      ownership_type: "स्वामित्व प्रकार",
      crops: "फसलें",
      has_irrigation: "सिंचाई सुविधा",
      season: "मौसम"
    },
    ownershipLabels: {
      owner: "भूमि स्वामी (स्वयं का खेत)",
      tenant: "बटाईदार / किरायेदार",
      sharecropper: "साझेदार किसान"
    },
    irrigationLabels: {
      yes: "हाँ (सिंचित)",
      no: "नहीं (वर्षा आधारित)"
    },
    missingTag: "जानकारी आवश्यक",
    filledTag: "पूर्ण",

    schemesHeading: "सरकारी योजनाएं",
    schemesSubheading: "भारत सरकार के राजपत्र नियमों के अनुसार सत्यापित योजनाएं",
    schemesTitle: "आधिकारिक कृषि योजनाएं",
    schemesSubtitle: "कठोर नियम-आधारित निष्पक्ष पात्रता जांच",
    verifiedNationalSchemes: "सत्यापित राष्ट्रीय योजनाएं",
    demoSchemesHeading: "प्रोटोटाइप प्रदर्शन योजनाएं (डेमो)",
    auditStamp: "सरकारी स्रोतों द्वारा सत्यापित • अक्टूबर 2026",
    zeroHallucinationTag: "नियम-आधारित निष्पक्ष जांच • शून्य भ्रम",
    tabs: {
      all: "सभी योजनाएं",
      eligible: "पात्र योजनाएं",
      needsInfo: "अधिक जानकारी चाहिए",
      demo: "डेमो योजनाएं"
    },
    status: {
      eligible: "पात्र हैं",
      ineligible: "अपात्र हैं",
      needs_more_info: "जानकारी अधूरी"
    },
    verifiedBadge: "सत्यापित योजना",
    verifiedDate: "सत्यापन: अक्टूबर 2026",
    demoBadge: "डेमो प्रोटोटाइप",
    viewDetails: "विवरण देखें",
    viewDocuments: "जरूरी दस्तावेज",
    officialPortal: "आधिकारिक पोर्टल",
    helpline: "हेल्पलाइन नंबर",
    benefitsHeading: "योजना के लाभ",
    rulesCheckHeading: "पात्रता नियमों की समीक्षा",
    satisfied: "संतुष्ट (पात्र)",
    notSatisfied: "अपात्र",
    unknown: "विवरण उपलब्ध नहीं",
    documentsRequiredHeading: "आवश्यक दस्तावेज",
    verifiedGov: "सरकारी स्रोतों द्वारा सत्यापित",
    lastUpdated: "अपडेट: अक्टूबर 2026",
    officialLinks: "आधिकारिक लिंक उपलब्ध",

    schemeCatalog: {
      'pm-kisan': {
        name: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
        desc: "सभी पात्र भूमिधारक किसान परिवारों को ₹2,000 की तीन समान किस्तों में प्रति वर्ष ₹6,000 की सीधी वित्तीय सहायता।"
      },
      'pmfby': {
        name: "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
        desc: "प्राकृतिक आपदाओं, सूखे और बेमौसम बारिश से फसल नुकसान के खिलाफ व्यापक बीमा सुरक्षा। किसान प्रीमियम मात्र 1.5% से 2%।"
      },
      'demo-micro-irrigation': {
        name: "सूक्ष्म सिंचाई प्रोत्साहन योजना (PMKSY)",
        desc: "लघु एवं सीमांत किसानों के लिए ड्रिप एवं स्प्रिंकलर सिंचाई की स्थापना पर 90% तक की पूंजीगत सब्सिडी।"
      },
      'demo-agri-equipment': {
        name: "कृषि यंत्रीकरण एवं उपकरण सहायता योजना (SMAM)",
        desc: "ट्रैक्टर, पावर टिलर और आधुनिक कृषि उपकरणों की खरीद पर 50% से 75% वित्तीय सहायता।"
      },
      'demo-soil-improvement': {
        name: "मृदा स्वास्थ्य एवं सूक्ष्म पोषक तत्व सहायता योजना",
        desc: "मुफ्त मिट्टी परीक्षण, सूक्ष्म पोषक तत्व सिफारिशें और मृदा स्वास्थ्य कार्ड वितरण।"
      }
    },

    eligibilityTitle: "पात्रता मूल्यांकन",
    preliminaryResult: "प्राथमिक परिणाम",
    eligibleMessage: "आप PM-KISAN के लिए पात्र हो सकते हैं",
    eligibleSubtext: "आपके द्वारा दी गई जानकारी के अनुसार आप लाभ प्राप्त करने के मुख्य मानदंडों को पूरा करते हैं।",
    detailsTitle: "जांचे गए मानदंड:",
    ruleLand: "जमीन: अनुमेय सीमा के भीतर",
    ruleOwnership: "स्वामित्व: कृषि भूमि मालिक",
    ruleTax: "आयकर: गैर-करदाता",
    ruleStatus: "सक्रिय खेती: लागू",
    officialSource: "आधिकारिक स्रोत:",
    officialPmkisanWebsite: "PM-KISAN आधिकारिक पोर्टल",
    disclaimerBox: "यह केवल प्राथमिक मार्गदर्शन है। अंतिम वित्तीय मंजूरी कृषि विभाग के अधिकृत अधिकारियों द्वारा सत्यापन के अधीन है।",
    viewGuidanceBtn: "मार्गदर्शन और दस्तावेज देखें",

    modalTitle: "योजना का विवरण और कानूनी साक्ष्य",
    closeModal: "बंद करें",
    sourceUrl: "आधिकारिक स्रोत:",
    verifiedByText: "सत्यापित प्राधिकारी:",

    disclaimerTitle: "वैधानिक अस्वीकरण",
    disclaimerText: "कृषि मित्र AI एक निर्णय-सहायक मंच है। अंतिम सब्सिडी एवं योजना का लाभ सक्षम सरकारी अधिकारियों द्वारा भौतिक सत्यापन के बाद ही मिलता है।",

    navHome: "होम",
    navStory: "कहानी",
    navVoice: "वॉयस AI",
    navSchemes: "योजनाएं",
    navEligibility: "पात्रता",
    settingsTitle: "सेटिंग्स और गोपनीयता",
    voiceInputSetting: "वॉयस इनपुट चालू करें",
    autoPlaySetting: "आवाज अपने आप सुनें",
    saveChatSetting: "बातचीत स्थानीय रूप से सहेजें",
    privacyPolicy: "गोपनीयता नीति",
    helpSupport: "मदद और हेल्पलाइन",

    login: "किसान लॉगिन",
    signup: "पंजीकरण / साइन अप",
    logout: "लॉगआउट",
    authModalTitle: "किसान सुरक्षित पोर्टल",
    authModalSubtitle: "मोबाइल ओटीपी के साथ पासवर्ड-मुक्त आसान प्रवेश",
    mobileInputTitle: "मोबाइल नंबर दर्ज करें",
    mobileInputDesc: "आपके नंबर पर 6-अंकों का सुरक्षित ओटीपी भेजा जाएगा",
    mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    sendOtpBtn: "ओटीपी भेजें →",
    otpVerificationTitle: "ओटीपी सत्यापन",
    otpSentTo: "ओटीपी भेजा गया:",
    resendOtp: "ओटीपी पुनः भेजें",
    verifyOtpBtn: "सत्यापित करें और आगे बढ़ें →",
    changeNumber: "नंबर बदलें",
    farmerOnboardingTitle: "किसान प्रोफ़ाइल सेटअप",
    farmerOnboardingDesc: "सरकारी योजनाओं की पात्रता जांचने के लिए अपनी जमीन और फसल का विवरण दें",
    farmerNameLabel: "किसान का पूरा नाम",
    farmerNamePlaceholder: "उदा: रमेश पाटिल",
    districtLabel: "ज़िला",
    districtPlaceholder: "उदा: बेलगावी, धारवाड़, पुणे",
    landSizeLabel: "कुल कृषि भूमि (एकड़ में)",
    landSizePlaceholder: "उदा: 2.5",
    cropsLabel: "मुख्य उगाई जाने वाली फसलें",
    ownershipLabel: "भूमि स्वामित्व की स्थिति",
    ownerOption: "भूमि स्वामी (खतौनी / पट्टाधारक)",
    tenantOption: "बटाईदार / किरायेदार किसान",
    completeSetupBtn: "प्रोफ़ाइल सहेजें और योजनाएं देखें →",
    simulatedOtpNotice: "त्वरित परीक्षण के लिए डेमो ओटीपी: 123456",
    invalidPhone: "कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें",
    invalidOtp: "अमान्य ओटीपी। कृपया 123456 या प्राप्त कोड दर्ज करें।",
    profileSummary: "किसान प्रोफ़ाइल",
    verifiedFarmerBadge: "सत्यापित किसान",

    loginTitle: "किसान सुरक्षित लॉगिन",
    loginSubtitle: "भारतीय किसानों के लिए उच्च-सुरक्षा डिजिटल पोर्टल",
    signupTitle: "किसान पंजीकरण एवं प्रोफ़ाइल",
    signupSubtitle: "सरकारी सब्सिडी एवं योजनाओं की पात्रता जानने हेतु पंजीकरण करें",
    identifierLabel: "मोबाइल नंबर या ईमेल",
    identifierPlaceholder: "उदा: 9876543210 या farmer@gmail.com",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "अपना सुरक्षित पासवर्ड दर्ज करें",
    confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
    confirmPasswordPlaceholder: "पासवर्ड पुनः दर्ज करें",
    rememberMe: "मेरा सत्र सुरक्षित रूप से याद रखें",
    dontHaveAccount: "नए किसान हैं? खाता बनाएं →",
    alreadyHaveAccount: "पहले से खाता है? यहाँ लॉगिन करें →",
    accountNotFoundAlert: "खाता नहीं मिला! कृषि मित्र AI उपयोग करने के लिए कृपया पहले साइन अप करें।",
    invalidCredentialsAlert: "अमान्य क्रेडेंशियल या गलत पासवर्ड। कृपया पुनः प्रयास करें।",
    passwordStrengthLabel: "पासवर्ड की मजबूती",
    strengthWeak: "कमजोर",
    strengthMedium: "मध्यम",
    strengthStrong: "मजबूत",
    passwordsMismatch: "पासवर्ड मेल नहीं खा रहे हैं",
    bruteForceLocked: "अत्यधिक असफल प्रयास! सुरक्षा लॉकआउट सक्रिय:",
    demoCredentialsPill: "डेमो लॉगिन: 9876543210 / Krishi@2026",
    fillDemoBtn: "डेमो क्रेडेंशियल भरें",
    step1Credentials: "चरण 1: सुरक्षा क्रेडेंशियल",
    step2FarmProfile: "चरण 2: भूमि एवं फसल मैपिंग",
    nextStepBtn: "आगे: कृषि विवरण →",
    completeSignupBtn: "पंजीकरण पूरा करें और AI शुरू करें →",
    backBtn: "पीछे",
    securityBadgeText: "256-बिट एन्क्रिप्टेड • शून्य डेटा जोखिम नीति"
  },

  // ================= TELUGU (తెలుగు) =================
  te: {
    appTitle: "కృషి మిత్ర AI",
    appSubtitle: "మీ AI వ్యవసాయ సహచరుడు • భారతీయ వ్యవసాయం కోసం ఒక జాతీయ చొరవ",
    govIndia: "భారత ప్రభుత్వం • అధికారిక పథకాలు",
    govHeader: "భారత ప్రభుత్వం మరియు రాష్ట్ర వ్యవసాయ శాఖల అధికారిక పథకాలు",
    voiceFirstTag: "వాయిస్ ఆధారిత వ్యవసాయ నిర్ణయ మద్దతు వ్యవస్థ",
    liveStatus: "ప్రత్యక్ష ప్రసారం & కనెక్ట్ చేయబడింది",
    offlineStatus: "ఆఫ్‌లైన్ మోడ్",
    languageName: "తెలుగు",
    switchLanguage: "భాషను మార్చండి",

    heroTitle1: "ఖచ్చితమైన సమాధానాలు.",
    heroTitle2: "బలమైన రైతులు.",
    heroTitle3: "హరిత రేపటి భవిత.",
    heroSubtitle: "ప్రభుత్వ పథకాలు • అర్హత మార్గదర్శకత్వం • మీ తెలుగు భాషలో.",
    heroCTA: "మీ ప్రయాణం ప్రారంభించండి →",
    scrollExplore: "↓ వివరాల కోసం క్రిందికి స్క్రోల్ చేయండి",

    storyHeading: "ప్రతి రైతుకూ సందేహాలుంటాయి.",
    storySubheading: "కృషి మిత్ర AI మీకు సరైన మార్గం చూపుతుంది.",
    storyDesc: "కృషి మిత్ర AI రైతులకు వ్యవసాయ సబ్సిడీలు, పంట భీమా మరియు ఆర్థిక భద్రత పథకాలపై సరైన, అధికారిక సమాచారాన్ని సహజమైన వాయిస్ సంభాషణ ద్వారా సులభంగా అందిస్తుంది.",
    feat1: "ప్రభుత్వ పథకాలు",
    feat2: "అర్హత పరిశీలన",
    feat3: "సులభ మార్గదర్శకత్వం",
    storyCard1Title: "ఆధునిక యాంత్రీకరణ",
    storyCard1Desc: "వ్యవసాయ పరికరాలు మరియు యంత్రాలపై 50% నుండి 75% వరకు పెట్టుబడి రాయితీ",
    storyCard2Title: "నేల & పంట ఆరోగ్యం",
    storyCard2Desc: "ఉచిత నేల పరీక్ష, సేంద్రీయ ధృవీకరణ మరియు సూక్ష్మ పోషకాల కిట్లు",
    storyCard3Title: "ప్రత్యక్ష ఆదాయ మద్దతు",
    storyCard3Desc: "రైతు బ్యాంకు ఖాతాల్లోకి నేరుగా నగదు బదిలీ (DBT) మరియు సమగ్ర పంట భీమా రక్షణ",

    voiceHeading: "నేను మీ కృషి మిత్ర AI సహాయకుడిని.",
    voiceSubheading: "నేను మీకు ఎలా సహాయపడగలను?",
    voiceStateIdle: "మైక్రోఫోన్ నొక్కండి లేదా మాట్లాడండి",
    voiceStateListening: "మీ మాట వింటున్నాను...",
    voiceStateProcessing: "అర్హత నిబంధనలను పరిశీలిస్తున్నాను...",
    voiceStateSpeaking: "సమాధానం చెబుతున్నాను...",
    voiceInstruction: "మీ భూమి, పంటలు మరియు జిల్లా వివరాలను మీ స్వంత భాషలో మాట్లాడండి",
    typePlaceholder: "మీ సందేశాన్ని ఇక్కడ టైప్ చేయండి లేదా వాయిస్ ఉపయోగించండి...",
    recentConversations: "ఇటీవలి సంభాషణలు",
    recentQ1: "PM-KISAN పథకం పూర్తి సమాచారం",
    recentQ2: "నా అర్హతను ఎలా తనిఖీ చేయాలి?",
    recentQ3: "PMFBY పంట భీమా క్లెయిమ్ విధానం",
    recentQ4: "ఏయే పత్రాలు అవసరం?",
    recognizedVoiceLabel: "గుర్తించిన వాయిస్",
    latestAiResponseLabel: "తాజా AI సమాధానం",

    chatTitle: "వ్యవసాయ సంప్రదింపులు",
    welcomeMessage: "నమస్కారం! నేను మీ కృషి మిత్ర AI సహాయకుడిని. మీ వ్యవసాయ భూమి, పంటలు మరియు జిల్లా వివరాలను తెలియజేయండి. మీకు వర్తించే ప్రభుత్వ పథకాలు మరియు పంట భీమాను కనుగొంటాను.",
    inputPlaceholder: "ఇక్కడ టైప్ చేయండి లేదా మైక్ ద్వారా మాట్లాడండి...",
    recording: "వాయిస్ రికార్డ్ అవుతోంది...",
    recordingInstruction: "స్పష్టంగా మాట్లాడి ముగిశాక ఆపండి",
    stopAndSend: "ఆపి పంపండి",
    cancelRecording: "రద్దు చేయండి",
    send: "పంపండి",
    listeningBrowser: "వెబ్ స్పీచ్ ద్వారా వింటున్నాము...",
    transcriptPreview: "వాయిస్ ప్రతిలేఖనం:",
    playingAudio: "వాయిస్ సమాధానం వినిపిస్తోంది...",
    playVoice: "వాయిస్ వినండి",
    pauseVoice: "పాజ్ చేయండి",
    replayVoice: "మళ్లీ వినండి",

    profileTitle: "రైతు ప్రొఫైల్ ట్రాకర్",
    profileCompletion: "ప్రొఫైల్ పూర్తి స్థాయి",
    editProfile: "సవరించండి",
    saveProfile: "భద్రపరచండి",
    cancel: "రద్దు",
    slots: {
      district: "జిల్లా",
      land_area_acres: "భూమి (ఎకరాలు)",
      ownership_type: "యాజమాన్య స్థితి",
      crops: "సాగు పంటలు",
      has_irrigation: "నీటిపారుదల సౌకర్యం",
      season: "సీజన్"
    },
    ownershipLabels: {
      owner: "భూ యజమాని (సొంత భూమి)",
      tenant: "కౌలు రైతు (Tenant)",
      sharecropper: "వాటాదారు (Sharecropper)"
    },
    irrigationLabels: {
      yes: "అవును (నీటిపారుదల ఉంది)",
      no: "లేదు (వర్షాధారం)"
    },
    missingTag: "సమాచారం అవసరం",
    filledTag: "పూర్తయింది",

    schemesHeading: "ప్రభుత్వ పథకాలు",
    schemesSubheading: "భారత ప్రభుత్వ అధికారిక గెజిట్ నిబంధనల ప్రకారం ధృవీకరించబడిన పథకాలు",
    schemesTitle: "అధికారిక వ్యవసాయ పథకాలు",
    schemesSubtitle: "ఖచ్చితమైన నిబంధనలతో కూడిన అర్హత పరిశీలన",
    verifiedNationalSchemes: "ధృవీకరించబడిన జాతీయ పథకాలు",
    demoSchemesHeading: "నమూనా ప్రదర్శన పథకాలు (డెమో)",
    auditStamp: "ప్రభుత్వ వనరుల ద్వారా ఆడిట్ చేయబడింది • అక్టోబర్ 2026",
    zeroHallucinationTag: "నిబంధనల ఆధారిత మూల్యాంకనం • సంపూర్ణ ఖచ్చితత్వం",
    tabs: {
      all: "అన్ని పథకాలు",
      eligible: "అర్హత కలిగినవి",
      needsInfo: "మరింత సమాచారం అవసరం",
      demo: "డెమో పథకాలు"
    },
    status: {
      eligible: "అర్హులు",
      ineligible: "అనర్హులు",
      needs_more_info: "సమాచారం అసంపూర్ణం"
    },
    verifiedBadge: "ధృవీకరించబడిన పథకం",
    verifiedDate: "ఆడిట్: అక్టోబర్ 2026",
    demoBadge: "డెమో ప్రోటోటైప్",
    viewDetails: "వివరాలను చూడండి",
    viewDocuments: "అవసరమైన పత్రాలు",
    officialPortal: "అధికారిక పోర్టల్",
    helpline: "టోల్-ఫ్రీ హెల్ప్‌లైన్",
    benefitsHeading: "పథకం ప్రయోజనాలు",
    rulesCheckHeading: "అర్హత నిబంధనల పరిశీలన",
    satisfied: "సంతృప్తికరం (అర్హులు)",
    notSatisfied: "అర్హత లేదు",
    unknown: "సమాచారం అందించబడలేదు",
    documentsRequiredHeading: "అవసరమైన పత్రాలు",
    verifiedGov: "ప్రభుత్వ వనరుల ద్వారా ధృవీకరించబడింది",
    lastUpdated: "నవీకరణ: అక్టోబర్ 2026",
    officialLinks: "అధికారిక లింకులు అందుబాటులో ఉన్నాయి",

    schemeCatalog: {
      'pm-kisan': {
        name: "ప్రధాన మంత్రి కిసాన్ సమ్మాన్ నిధి (PM-KISAN)",
        desc: "అర్హులైన భూమిగల రైతు కుటుంబాలందరికీ సంవత్సరానికి ₹6,000 ప్రత్యక్ష ఆర్థిక సహాయం (మూడు విడతలలో ₹2,000 చొప్పున)."
      },
      'pmfby': {
        name: "ప్రధాన మంత్రి ఫసల్ బీమా యోజన (PMFBY)",
        desc: "ప్రకృతి వైపరీత్యాలు, కరవు మరియు అకాల వర్షాల వల్ల పంట నష్టానికి సమగ్ర పంట భీమా రక్షణ. రైతు వాటా ప్రీమియం కేవలం 1.5% నుండి 2%."
      },
      'demo-micro-irrigation': {
        name: "సూక్ష్మ నీటిపారుదల మద్దతు పథకం (PMKSY)",
        desc: "చిన్న మరియు సన్నకారు రైతులకు డ్రిప్ మరియు స్ప్రింక్లర్ ఏర్పాటుకు 90% వరకు పెట్టుబడి రాయితీ."
      },
      'demo-agri-equipment': {
        name: "వ్యవసాయ యాంత్రీకరణ & పరికరాల సహాయం (SMAM)",
        desc: "ట్రాక్టర్లు, పవర్ టిల్లర్లు మరియు ఆధునిక వ్యవసాయ పరికరాల కొనుగోలుపై 50% నుండి 75% ఆర్థిక సహాయం."
      },
      'demo-soil-improvement': {
        name: "నేల ఆరోగ్యం & సూక్ష్మ పోషకాల సహాయ పథకం",
        desc: "ఉచిత నేల పరీక్ష, సూక్ష్మ పోషకాల సిఫార్సులు మరియు సాయిల్ హెల్త్ కార్డుల పంపిణీ."
      }
    },

    eligibilityTitle: "అర్హత మూల్యాంకనం",
    preliminaryResult: "ప్రాథమిక ఫలితం",
    eligibleMessage: "మీరు PM-KISAN పథకానికి అర్హత పొందే అవకాశం ఉంది",
    eligibleSubtext: "మీరు అందించిన వ్యవసాయ భూమి వివరాల ఆధారంగా మీరు ప్రధాన అర్హత ప్రమాణాలను అందుకున్నారు.",
    detailsTitle: "పరిశీలించిన ప్రమాణాలు:",
    ruleLand: "భూమి: అనుమతించబడిన పరిమితిలో ఉంది",
    ruleOwnership: "యాజమాన్యం: భూమి కలిగిన రైతు",
    ruleTax: "ఆదాయపు పన్ను: పన్ను చెల్లింపుదారు కాదు",
    ruleStatus: "క్రియాశీల వ్యవసాయ భూమి: వర్తిస్తుంది",
    officialSource: "అధికారిక వనరు:",
    officialPmkisanWebsite: "PM-KISAN అధికారిక పోర్టల్",
    disclaimerBox: "ఇది ప్రాథమిక నిర్ణయ మద్దతు అంచనా మాత్రమే. సంబంధిత వ్యవసాయ శాఖ అధికారుల క్షేత్రస్థాయి పరిశీలన అనంతరమే తుది ఆమోదం లభిస్తుంది.",
    viewGuidanceBtn: "మార్గదర్శకత్వం & పత్రాలు చూడండి",

    modalTitle: "పథకం వివరాలు మరియు చట్టపరమైన ఆధారాలు",
    closeModal: "మూసివేయండి",
    sourceUrl: "అధికారిక వనరు:",
    verifiedByText: "ధృవీకరించిన అధికారిక సంస్థ:",

    disclaimerTitle: "చట్టబద్ధమైన నిరాకరణ",
    disclaimerText: "కృషి మిత్ర AI అనేది ప్రభుత్వ గెజిట్ ప్రమాణాల ఆధారంగా పనిచేసే ఒక సమాచార వేదిక. సబ్సిడీ మరియు పంట భీమా తుది మంజూరు వ్యవసాయ శాఖ అధికారుల క్షేత్రస్థాయి విచారణపై ఆధారపడి ఉంటుంది.",

    navHome: "హోమ్",
    navStory: "కథ",
    navVoice: "వాయిస్ AI",
    navSchemes: "పథకాలు",
    navEligibility: "అర్హత",
    settingsTitle: "సెట్టింగ్‌లు & గోప్యత",
    voiceInputSetting: "వాయిస్ ఇన్‌పుట్ ప్రారంభించండి",
    autoPlaySetting: "సమాధానం స్వయంచాలకంగా వినండి",
    saveChatSetting: "సంభాషణను భద్రపరచండి",
    privacyPolicy: "గోప్యతా విధానం",
    helpSupport: "సహాయం & హెల్ప్‌లైన్",

    login: "రైతు లాగిన్",
    signup: "నమోదు / సైన్ అప్",
    logout: "లాగ్ అవుట్",
    authModalTitle: "రైతు భద్రతా పోర్టల్",
    authModalSubtitle: "మొబైల్ OTP ద్వారా పాస్‌వర్డ్ లేని సులభ ప్రవేశం",
    mobileInputTitle: "మొబైల్ నంబర్ నమోదు చేయండి",
    mobileInputDesc: "మీ మొబైల్‌కు 6-అంకెల సురక్షిత OTP పంపబడుతుంది",
    mobilePlaceholder: "10-అంకెల మొబైల్ నంబర్",
    sendOtpBtn: "OTP పంపండి →",
    otpVerificationTitle: "OTP ధృవీకరణ",
    otpSentTo: "OTP పంపబడిన నంబర్:",
    resendOtp: "OTP మళ్లీ పంపండి",
    verifyOtpBtn: "ధృవీకరించి ముందుకు సాగండి →",
    changeNumber: "నంబర్ మార్చండి",
    farmerOnboardingTitle: "రైతు ప్రొఫైల్ వివరాలు",
    farmerOnboardingDesc: "ప్రభుత్వ పథకాల అర్హతను తక్షణమే తెలుసుకోవడానికి మీ భూమి మరియు పంట వివరాలను నమోదు చేయండి",
    farmerNameLabel: "రైతు పూర్తి పేరు",
    farmerNamePlaceholder: "ఉదా: రమేష్ పాటిల్",
    districtLabel: "జిల్లా",
    districtPlaceholder: "ఉదా: వరంగల్, కర్నూలు",
    landSizeLabel: "మొత్తం భూమి (ఎకరాలలో)",
    landSizePlaceholder: "ఉదా: 2.5",
    cropsLabel: "పండించే ప్రధాన పంటలు",
    ownershipLabel: "భూమి యాజమాన్య వివరాలు",
    ownerOption: "భూ యజమాని (పట్టాదారు / పాస్‌బుక్)",
    tenantOption: "కౌలు రైతు / భాగస్వామి",
    completeSetupBtn: "వివరాలు సేవ్ చేసి పథకాలను చూడండి →",
    simulatedOtpNotice: "పరీక్ష కోసం డెమో OTP: 123456",
    invalidPhone: "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి",
    invalidOtp: "తప్పుడు OTP. దయచేసి 123456 లేదా వచ్చిన కోడ్ ఉపయోగించండి.",
    profileSummary: "రైతు ప్రొఫైల్",
    verifiedFarmerBadge: "ధృవీకరించబడిన రైతు",

    loginTitle: "రైతు సురక్షిత లాగిన్",
    loginSubtitle: "భారతీయ రైతుల కోసం అత్యున్నత భద్రతా డిజిటల్ పోర్టల్",
    signupTitle: "రైతు నమోదు & ప్రొఫైల్",
    signupSubtitle: "ప్రభుత్వ రాయితీలు మరియు పథకాల అర్హతను తక్షణమే తెలుసుకోండి",
    identifierLabel: "మొబైల్ నంబర్ లేదా ఇమెయిల్",
    identifierPlaceholder: "ఉదా: 9876543210 లేదా farmer@gmail.com",
    passwordLabel: "పాస్‌వర్డ్",
    passwordPlaceholder: "మీ సురక్షిత పాస్‌వర్డ్ నమోదు చేయండి",
    confirmPasswordLabel: "పాస్‌వర్డ్ నిర్ధారించండి",
    confirmPasswordPlaceholder: "పాస్‌వర్డ్ మళ్లీ నమోదు చేయండి",
    rememberMe: "నా సెషన్‌ను సురక్షితంగా గుర్తుంచుకో",
    dontHaveAccount: "కొత్త రైతులా? ఖాతా సృష్టించండి →",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా? ఇక్కడ లాగిన్ అవ్వండి →",
    accountNotFoundAlert: "ఖాతా కనుగొనబడలేదు! కృషి మిత్ర AI యాక్సెస్ చేయడానికి దయచేసి ముందుగా నమోదు (Sign Up) చేసుకోండి.",
    invalidCredentialsAlert: "చెల్లని వివరాలు లేదా తప్పుడు పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.",
    passwordStrengthLabel: "పాస్‌వర్డ్ బలం",
    strengthWeak: "బలహీనమైన",
    strengthMedium: "మధ్యస్థ",
    strengthStrong: "బలమైన",
    passwordsMismatch: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు",
    bruteForceLocked: "చాలా విఫల ప్రయత్నాలు! భద్రతా లాక్‌అవుట్ సమయం:",
    demoCredentialsPill: "డెమో లాగిన్: 9876543210 / Krishi@2026",
    fillDemoBtn: "డెమో వివరాలు నింపండి",
    step1Credentials: "దశ 1: భద్రతా ఆధారాలు",
    step2FarmProfile: "దశ 2: భూమి & పంట వివరాలు",
    nextStepBtn: "తరువాత: వ్యవసాయ వివరాలు →",
    completeSignupBtn: "నమోదు పూర్తి చేసి AI ప్రారంభించండి →",
    backBtn: "వెనుకకు",
    securityBadgeText: "256-బిట్ ఎన్‌క్రిప్ట్ చేయబడింది • జీరో డేటా లీకేజ్ విధానం"
  },

  // ================= MARATHI (मराठी) =================
  mr: {
    appTitle: "कृषी मित्र AI",
    appSubtitle: "आपला AI शेतकरी सोबती • भारतीय कृषी क्षेत्रासाठी राष्ट्रीय उपक्रम",
    govIndia: "भारत सरकार • अधिकृत योजना",
    govHeader: "भारत सरकार आणि राज्य कृषी विभागांच्या अधिकृत योजना",
    voiceFirstTag: "आवाज-आधारित कृषी निर्णय साहाय्यक प्रणाली",
    liveStatus: "सक्रिय आणि जोडलेले",
    offlineStatus: "ऑफलाइन मोड",
    languageName: "मराठी",
    switchLanguage: "भाषा बदला",

    heroTitle1: "अचूक उत्तरे.",
    heroTitle2: "सशक्त शेतकरी.",
    heroTitle3: "एक समृद्ध उद्या.",
    heroSubtitle: "सरकारी योजना • पात्रता मार्गदर्शन • आपल्या स्वतःच्या भाषेत.",
    heroCTA: "आपला प्रवास सुरू करा →",
    scrollExplore: "↓ अधिक माहितीसाठी खाली स्क्रोल करा",

    storyHeading: "प्रत्येक शेतकऱ्याच्या मनात प्रश्न असतात.",
    storySubheading: "कृषी मित्र AI आपल्या सोबत आहे.",
    storyDesc: "कृषी मित्र AI शेतकऱ्यांना शासकीय अनुदाने, पीक विमा आणि आर्थिक सुरक्षा योजनांची अचूक माहिती आपल्या स्वतःच्या भाषेत सहजतेने पुरवते.",
    feat1: "सरकारी योजना",
    feat2: "पात्रता पडताळणी",
    feat3: "सोपे मार्गदर्शन",
    storyCard1Title: "आधुनिक यांत्रिकीकरण",
    storyCard1Desc: "कृषी अवजारे आणि ट्रॅक्टरवर 50% ते 75% भांडवली अनुदान",
    storyCard2Title: "माती आणि पीक आरोग्य",
    storyCard2Desc: "मोफत माती परीक्षण, सेंद्रिय प्रमाणीकरण आणि सूक्ष्म अन्नद्रव्य किट",
    storyCard3Title: "थेट उत्पन्न साहाय्य",
    storyCard3Desc: "शेतकऱ्यांच्या बँक खात्यात थेट लाभ हस्तांतरण (DBT) आणि सर्वसमावेशक पीक विमा",

    voiceHeading: "मी आपला कृषी मित्र AI आहे.",
    voiceSubheading: "आज मी आपली काय मदत करू शकतो?",
    voiceStateIdle: "मायक्रोफोन दाबा किंवा बोलण्यास सुरुवात करा",
    voiceStateListening: "आपला आवाज ऐकत आहे...",
    voiceStateProcessing: "पात्रतेचे नियम तपासत आहे...",
    voiceStateSpeaking: "उत्तर बोलत आहे...",
    voiceInstruction: "आपली जमीन, पिके आणि जिल्ह्याबद्दल मराठीत बोला",
    typePlaceholder: "आपला प्रश्न येथे टाईप करा किंवा आवाज वापरा...",
    recentConversations: "अलीकडील संभाषणे",
    recentQ1: "PM-KISAN योजनेची संपूर्ण माहिती",
    recentQ2: "मी माझी पात्रता कशी तपासावी?",
    recentQ3: "PMFBY पीक विमा दावा प्रक्रिया",
    recentQ4: "कोणती कागदपत्रे लागतील?",
    recognizedVoiceLabel: "ओळखलेला आवाज",
    latestAiResponseLabel: "सक्रिय एआय प्रतिसाद",

    chatTitle: "कृषी सल्ला",
    welcomeMessage: "नमस्कार! मी आपला कृषी मित्र AI साहाय्यक आहे. मला आपली शेतजमीन, पिके आणि जिल्ह्याची माहिती द्या, जेणेकरून मी सरकारी योजनांसाठी आपली पात्रता तपासू शकेन.",
    inputPlaceholder: "संदेश लिहा किंवा माईक वापरा...",
    recording: "आवाज रेकॉर्ड होत आहे...",
    recordingInstruction: "स्पष्ट बोला आणि पूर्ण झाल्यावर थांबवा",
    stopAndSend: "थांबवा आणि पाठवा",
    cancelRecording: "रद्द करा",
    send: "पाठवा",
    listeningBrowser: "वेब स्पीचद्वारे ऐकले जात आहे...",
    transcriptPreview: "आवाज प्रतिलेख:",
    playingAudio: "आवाज सुरू आहे...",
    playVoice: "आवाज ऐका",
    pauseVoice: "थांबवा",
    replayVoice: "पुन्हा ऐका",

    profileTitle: "शेतकरी प्रोफाइल ट्रॅकर",
    profileCompletion: "प्रोफाइल पूर्णता",
    editProfile: "बदल करा",
    saveProfile: "जतन करा",
    cancel: "रद्द",
    slots: {
      district: "जिल्हा",
      land_area_acres: "जमीन (एकर)",
      ownership_type: "मालकी प्रकार",
      crops: "पिके",
      has_irrigation: "सिंचन सुविधा",
      season: "हंगाम"
    },
    ownershipLabels: {
      owner: "शेतजमीन मालक (स्वतःची शेती)",
      tenant: "कूळ / भाडेकरू शेतकरी",
      sharecropper: "बटाईदार शेतकरी"
    },
    irrigationLabels: {
      yes: "होय (सिंचित)",
      no: "नाही (जिरायती)"
    },
    missingTag: "माहिती आवश्यक",
    filledTag: "पूर्ण",

    schemesHeading: "सरकारी योजना",
    schemesSubheading: "भारत सरकारच्या अधिकृत राजपत्रातील नियमांनुसार तपासलेल्या योजना",
    schemesTitle: "अधिकृत कृषी योजना",
    schemesSubtitle: "नियम-आधारित अचूक पात्रता पडताळणी",
    verifiedNationalSchemes: "प्रमाणित राष्ट्रीय योजना",
    demoSchemesHeading: "प्रारूप प्रात्यक्षिक योजना (डेमो)",
    auditStamp: "शासकीय स्त्रोतांद्वारे प्रमाणित • ऑक्टोबर 2026",
    zeroHallucinationTag: "नियम-आधारित अचूक मूल्यांकन • शून्य भ्रम",
    tabs: {
      all: "सर्व योजना",
      eligible: "पात्र योजना",
      needsInfo: "अधिक माहिती हवी",
      demo: "डेमो योजना"
    },
    status: {
      eligible: "पात्र आहात",
      ineligible: "अपात्र आहात",
      needs_more_info: "माहिती अपूर्ण"
    },
    verifiedBadge: "प्रमाणित योजना",
    verifiedDate: "पडताळणी: ऑक्टोबर 2026",
    demoBadge: "डेमो प्रारूप",
    viewDetails: "तपशील पहा",
    viewDocuments: "लागणारी कागदपत्रे",
    officialPortal: "अधिकृत पोर्टल",
    helpline: "हेल्पलाईन क्रमांक",
    benefitsHeading: "योजनेचे फायदे",
    rulesCheckHeading: "पात्रता नियमांची पडताळणी",
    satisfied: "पात्र (निकष पूर्ण)",
    notSatisfied: "अपात्र",
    unknown: "माहिती उपलब्ध नाही",
    documentsRequiredHeading: "आवश्यक कागदपत्रे",
    verifiedGov: "सरकारी स्त्रोतांद्वारे प्रमाणित",
    lastUpdated: "अपडेट: ऑक्टोबर 2026",
    officialLinks: "अधिकृत लिंक्स उपलब्ध",

    schemeCatalog: {
      'pm-kisan': {
        name: "प्रधानमंत्री किसान सन्मान निधी (PM-KISAN)",
        desc: "सर्व पात्र शेतकरी कुटुंबांना ₹2,000 च्या तीन समान हप्त्यांमध्ये दरवर्षी ₹6,000 चे थेट आर्थिक साहाय्य."
      },
      'pmfby': {
        name: "प्रधानमंत्री पीक विमा योजना (PMFBY)",
        desc: "नैसर्गिक संकटे, दुष्काळ व अवेळी पावसामुळे होणाऱ्या पीक नुकसानीविरुद्ध सर्वसमाవేశक पीक विमा संरक्षण. शेतकरी हप्ता फक्त 1.5% ते 2%."
      },
      'demo-micro-irrigation': {
        name: "सूक्ष्म सिंचन साहाय्य योजना (PMKSY)",
        desc: "लहान व अत्यल्प भूधारक शेतकऱ्यांना ठिबक व तुषार सिंचन संच उभारणीसाठी 90% पर्यंत शासकीय अनुदान."
      },
      'demo-agri-equipment': {
        name: "कृषी यांत्रिकीकरण व अवजारे साहाय्य (SMAM)",
        desc: "ट्रॅक्टर, पॉवर टिलर आणि आधुनिक कृषी अवजारे खरेदीवर 50% ते 75% शासकीय साहाय्य."
      },
      'demo-soil-improvement': {
        name: "मृदा आरोग्य व सूक्ष्म अन्नद्रव्य साहाय्य योजना",
        desc: "मोफत माती परीक्षण, सूक्ष्म अन्नद्रव्य शिफारशी आणि सॉईल हेल्थ कार्डचे मोफत वाटप."
      }
    },

    eligibilityTitle: "पात्रता मूल्यांकन",
    preliminaryResult: "प्राथमिक निकाल",
    eligibleMessage: "तुम्ही PM-KISAN साठी पात्र असू शकता",
    eligibleSubtext: "आपल्या शेतजमिनीच्या माहितीनुसार आपण मुख्य लाभांसाठी पात्र आहात.",
    detailsTitle: "तपासलेले निकष:",
    ruleLand: "जमीन: अनुज्ञेय मर्यादेत उपलब्ध",
    ruleOwnership: "मालकी: शेतजमीन मालक",
    ruleTax: "आयकर: करदाते नाही",
    ruleStatus: "सक्रिय शेतजमीन: होय",
    officialSource: "अधिकृत स्त्रोत:",
    officialPmkisanWebsite: "PM-KISAN अधिकृत पोर्टल",
    disclaimerBox: "हा केवळ प्राथमिक अंदाज आहे. अंतिम मंजुरी शासकीय अधिकाऱ्यांच्या प्रत्यक्ष पडताळणीवर अवलंबून असेल.",
    viewGuidanceBtn: "मार्गदर्शन पहा",

    modalTitle: "योजनेचा तपशील आणि पुरावे",
    closeModal: "बंद करा",
    sourceUrl: "अधिकृत स्त्रोत:",
    verifiedByText: "प्रमाणित प्राधिकरण:",

    disclaimerTitle: "वैधानिक अस्वीकरण",
    disclaimerText: "कृषी मित्र AI हे एक निर्णय साहाय्यक व्यासपीठ आहे. अंतिम अनुदान आणि लाभ सक्षम कृषी अधिकाऱ्यांच्या तपासणीनंतरच मिळतात.",

    navHome: "मुख्यपृष्ठ",
    navStory: "कथा",
    navVoice: "व्हॉइस AI",
    navSchemes: "योजना",
    navEligibility: "पात्रता",
    settingsTitle: "सेटिंग्ज आणि गोपनीयता",
    voiceInputSetting: "व्हॉइस इनपुट सुरू ठेवा",
    autoPlaySetting: "आवाज आपोआप ऐका",
    saveChatSetting: "संभाषण जतन करा",
    privacyPolicy: "गोपनीयता धोरण",
    helpSupport: "मदत आणि संपर्क",

    login: "शेतकरी लॉगिन",
    signup: "नोंदणी / साइन अप",
    logout: "लॉगआउट",
    authModalTitle: "शेतकरी सुरक्षित पोर्टल",
    authModalSubtitle: "मोबाईल ओटीपीद्वारे पासवर्ड-मुक्त सुलभ प्रवेश",
    mobileInputTitle: "मोबाईल क्रमांक टाका",
    mobileInputDesc: "आपल्या मोबाईलवर 6 अंकी सुरक्षित ओटीपी पाठवला जाईल",
    mobilePlaceholder: "10 अंकी मोबाईल क्रमांक",
    sendOtpBtn: "ओटीपी पाठवा →",
    otpVerificationTitle: "ओटीपी पडताळणी",
    otpSentTo: "ओटीपी पाठवला आहे:",
    resendOtp: "ओटीपी पुन्हा पाठवा",
    verifyOtpBtn: "पडताळणी करा आणि पुढे जा →",
    changeNumber: "क्रमांक बदला",
    farmerOnboardingTitle: "शेतकरी प्रोफाइल तपशील",
    farmerOnboardingDesc: "शासकीय योजनांची पात्रता तपासण्यासाठी आपल्या शेतजमीन व पिकांची माहिती द्या",
    farmerNameLabel: "शेतकऱ्याचे संपूर्ण नाव",
    farmerNamePlaceholder: "उदा: रमेश पाटील",
    districtLabel: "जिल्हा",
    districtPlaceholder: "उदा: पुणे, सातारा, बेळगाव",
    landSizeLabel: "एकूण शेतजमीन (एकरमध्ये)",
    landSizePlaceholder: "उदा: 2.5",
    cropsLabel: "पिकवली जाणारी मुख्य पिके",
    ownershipLabel: "जमीन मालकी हक्क",
    ownerOption: "स्वतःची जमीन (7/12 खातेदार)",
    tenantOption: "कुळ / बटाईदार शेतकरी",
    completeSetupBtn: "माहिती जतन करा आणि योजना तपासा →",
    simulatedOtpNotice: "चाचणीसाठी डेमो ओटीपी: 123456",
    invalidPhone: "कृपया वैध 10 अंकी मोबाईल क्रमांक टाका",
    invalidOtp: "चुकीचा ओटीपी. कृपया 123456 किंवा प्राप्त कोड वापरा.",
    profileSummary: "शेतकरी माहिती",
    verifiedFarmerBadge: "प्रमाणित शेतकरी",

    loginTitle: "शेतकरी सुरक्षित लॉगिन",
    loginSubtitle: "भारतीय शेतकऱ्यांसाठी उच्च-सुरक्षा डिजिटल प्रवेशद्वार",
    signupTitle: "शेतकरी नोंदणी आणि प्रोफाईल",
    signupSubtitle: "शासकीय योजना व अनुदानांची अचूक माहिती मिळवण्यासाठी नोंदणी करा",
    identifierLabel: "मोबाईल क्रमांक किंवा ईमेल",
    identifierPlaceholder: "उदा: 9876543210 किंवा farmer@gmail.com",
    passwordLabel: "पासवर्ड",
    passwordPlaceholder: "आपला सुरक्षित पासवर्ड टाका",
    confirmPasswordLabel: "पासवर्ड पुष्टी करा",
    confirmPasswordPlaceholder: "पासवर्ड पुन्हा टाका",
    rememberMe: "माझे सत्र सुरक्षितपणे लक्षात ठेवा",
    dontHaveAccount: "नवीन शेतकरी आहात? खाते तयार करा →",
    alreadyHaveAccount: "आधीच खाते आहे? येथे लॉगिन करा →",
    accountNotFoundAlert: "खाते सापडले नाही! कृषी मित्र AI वापरण्यासाठी कृपया आधी नोंदणी (Sign Up) करा.",
    invalidCredentialsAlert: "चुकीचे क्रेडेंशियल्स किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा.",
    passwordStrengthLabel: "पासवर्डची मजबुती",
    strengthWeak: "कमकुवत",
    strengthMedium: "मध्यम",
    strengthStrong: "मजबूत",
    passwordsMismatch: "पासवर्ड जुळत नाहीत",
    bruteForceLocked: "अनेक अयशस्वी प्रयत्न! सुरक्षा कुलूप सक्रिय:",
    demoCredentialsPill: "डेमो लॉगिन: 9876543210 / Krishi@2026",
    fillDemoBtn: "डेमो माहिती भरा",
    step1Credentials: "टप्पा 1: सुरक्षा तपशील",
    step2FarmProfile: "टप्पा 2: शेतजमीन व पीक माहिती",
    nextStepBtn: "पुढे: शेती तपशील →",
    completeSignupBtn: "नोंदणी पूर्ण करा आणि AI सुरू करा →",
    backBtn: "मागे",
    securityBadgeText: "256-बिट एन्क्रिप्टेड • शून्य डेटा गळती धोरण"
  }
};

/**
 * Returns the dictionary for the specified language with a safe fallback to English
 * ensuring no blank strings or missing key errors occur.
 */
export function getDictionary(lang: SupportedLanguage): I18nDictionary {
  const selected = i18n[lang] || i18n.kn;
  // Fallback to English for any undefined fields, then selected language
  return { ...i18n.en, ...selected };
}
