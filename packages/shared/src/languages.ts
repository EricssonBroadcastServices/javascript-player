// SPDX-FileCopyrightText: 2024 Red Bee Media Ltd <https://www.redbeemedia.com/>
//
// SPDX-License-Identifier: MIT

import {
  Asset,
  Image,
  ImageOrientation,
  LocalizedData,
  LocalizedTag,
  SimpleLocalizedData,
} from "@ericssonbroadcastservices/rbm-ott-sdk";

type Localized = LocalizedData & LocalizedTag & SimpleLocalizedData;

// NOTE: getLocalizedValue and getLocalizedImageByType also exists in app-sdk,
// but since we can't use esm yet because dashjs and mitt doesn't support it, we
// can't use tree shaking yet, so they are copied instead.
export function getLocalizedValue<Key extends keyof Localized>(
  localized: Localized[],
  property: Key,
  locale: string,
  defaultLocale?: string
): Localized[Key] | undefined {
  if (!localized || localized.length === 0) {
    return undefined;
  }
  const localeItem = localized.find(
    (localizedItem) => localizedItem.locale === locale
  );
  const value = localeItem?.[property];
  if (value && (!Array.isArray(value) || value.length)) {
    return value ? (value as Localized[Key]) : undefined;
  }
  if (defaultLocale) {
    return getLocalizedValue(localized, property, defaultLocale);
  }
  if (locale === localized[0].locale) {
    return undefined;
  }
  return getLocalizedValue(localized, property, localized[0].locale);
}

export function getLocalizedTitle(
  localized: Localized[],
  language: string
): string | undefined {
  return getLocalizedValue(localized, "title", language, "en");
}

export function getAssetTitle(
  asset: Asset,
  language: string,
  enrichEpisodeTitles = true
): string | undefined {
  const title = getLocalizedValue(asset.localized, "title", language, "en");

  if (title && asset.episode && asset.season && enrichEpisodeTitles) {
    return `S${asset.season} E${asset.episode} ${title}` as string;
  }

  return title;
}

export function getAssetDescription(
  asset: Asset,
  language: string
): string | undefined {
  return (
    getLocalizedValue(asset.localized, "shortDescription", language) ||
    getLocalizedValue(asset.localized, "description", language)
  );
}

export function getAssetImages(asset: Asset, language: string): Image[] {
  return getLocalizedValue(asset.localized, "images", language, "en") || [];
}

function sortByResolution(a: Image, b: Image) {
  return b.width - a.width;
}

export function getLocalizedImageByType(
  localized: Localized[],
  orientation: ImageOrientation,
  imageType: string,
  locale: string,
  defaultLocale?: string
): Image | undefined {
  if (!localized.length) {
    return;
  }

  const allImages = (
    getLocalizedValue(localized, "images", locale, defaultLocale) || []
  ).sort(sortByResolution);
  if (!allImages || !allImages.length) {
    return;
  }

  const imagesByCorrectOrientation = allImages.filter(
    (i) => i.orientation === orientation.toUpperCase()
  );
  const imagesByCorrectType = imagesByCorrectOrientation.filter(
    (i) => i.type === imageType
  );
  if (imagesByCorrectType.length > 0) {
    return imagesByCorrectType[0];
  }
  if (imagesByCorrectOrientation.length > 0) {
    return imagesByCorrectOrientation[0];
  }
  if (allImages.length > 0) {
    return allImages[0];
  }
  return undefined;
}

const LANGUAGES = [
  { code: "ab", name: "Abkhaz", nativeName: "Аҧсуа" },
  { code: "aa", name: "Afar", nativeName: "Afaraf" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "ak", name: "Akan", nativeName: "Akan" },
  { code: "sq", name: "Albanian", nativeName: "Shqip" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "an", name: "Aragonese", nativeName: "Aragonés" },
  { code: "hy", name: "Armenian", nativeName: "Հայերեն" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  { code: "av", name: "Avaric", nativeName: "Авар мацӀ, магӀарул мацӀ" },
  { code: "ae", name: "Avestan", nativeName: "Avesta" },
  { code: "ay", name: "Aymara", nativeName: "Aymar aru" },
  { code: "az", name: "Azerbaijani", nativeName: "Azərbaycan dili" },
  { code: "bm", name: "Bambara", nativeName: "Bamanankan" },
  { code: "ba", name: "Bashkir", nativeName: "Башҡорт теле" },
  { code: "eu", name: "Basque", nativeName: "Euskara, euskera" },
  { code: "be", name: "Belarusian", nativeName: "Беларуская" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "bh", name: "Bihari", nativeName: "भोजपुरी" },
  { code: "bi", name: "Bislama", nativeName: "Bislama" },
  { code: "bs", name: "Bosnian", nativeName: "Bosanski jezik" },
  { code: "br", name: "Breton", nativeName: "Brezhoneg" },
  { code: "bg", name: "Bulgarian", nativeName: "Български език" },
  { code: "my", name: "Burmese", nativeName: "ဗမာစာ" },
  { code: "ca", name: "Catalan; Valencian", nativeName: "Català" },
  { code: "ch", name: "Chamorro", nativeName: "Chamoru" },
  { code: "ce", name: "Chechen", nativeName: "Нохчийн мотт" },
  {
    code: "ny",
    name: "Chichewa; Chewa; Nyanja",
    nativeName: "ChiCheŵa, chinyanja",
  },
  { code: "zh", name: "Chinese", nativeName: "中文 (Zhōngwén), 汉语, 漢語" },
  { code: "cv", name: "Chuvash", nativeName: "Чӑваш чӗлхи" },
  { code: "kw", name: "Cornish", nativeName: "Kernewek" },
  { code: "co", name: "Corsican", nativeName: "Corsu, lingua corsa" },
  { code: "cr", name: "Cree", nativeName: "ᓀᐦᐃᔭᐍᐏᐣ" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski" },
  { code: "cs", name: "Czech", nativeName: "Česky, čeština" },
  { code: "da", name: "Danish", nativeName: "Dansk" },
  { code: "dv", name: "Divehi; Dhivehi; Maldivian;", nativeName: "ދިވެހި" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands, Vlaams" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "eo", name: "Esperanto", nativeName: "Esperanto" },
  { code: "et", name: "Estonian", nativeName: "Eesti, eesti keel" },
  { code: "ee", name: "Ewe", nativeName: "Eʋegbe" },
  { code: "fo", name: "Faroese", nativeName: "Føroyskt" },
  { code: "fj", name: "Fijian", nativeName: "Vosa Vakaviti" },
  { code: "fi", name: "Finnish", nativeName: "Suomi, suomen kieli" },
  { code: "fr", name: "French", nativeName: "Français" },
  {
    code: "ff",
    name: "Fula; Fulah; Pulaar; Pular",
    nativeName: "Fulfulde, Pulaar, Pular",
  },
  { code: "gl", name: "Galician", nativeName: "Galego" },
  { code: "ka", name: "Georgian", nativeName: "Ქართული" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "el", name: "Greek, Modern", nativeName: "Ελληνικά" },
  { code: "gn", name: "Guaraní", nativeName: "Avañeẽ" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "ht", name: "Haitian; Haitian Creole", nativeName: "Kreyòl ayisyen" },
  { code: "ha", name: "Hausa", nativeName: "Hausa, هَوُسَ" },
  { code: "he", name: "Hebrew (modern)", nativeName: "עברית" },
  { code: "hz", name: "Herero", nativeName: "Otjiherero" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी, हिंदी" },
  { code: "ho", name: "Hiri Motu", nativeName: "Hiri Motu" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  { code: "ia", name: "Interlingua", nativeName: "Interlingua" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  {
    code: "ie",
    name: "Interlingue",
    nativeName: "Originally called Occidental; then Interlingue after WWII",
  },
  { code: "ga", name: "Irish", nativeName: "Gaeilge" },
  { code: "ig", name: "Igbo", nativeName: "Asụsụ Igbo" },
  { code: "ik", name: "Inupiaq", nativeName: "Iñupiaq, Iñupiatun" },
  { code: "io", name: "Ido", nativeName: "Ido" },
  { code: "is", name: "Icelandic", nativeName: "Íslenska" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "iu", name: "Inuktitut", nativeName: "ᐃᓄᒃᑎᑐᑦ" },
  { code: "ja", name: "Japanese", nativeName: "日本語 (にほんご／にっぽんご)" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa" },
  {
    code: "kl",
    name: "Kalaallisut, Greenlandic",
    nativeName: "Kalaallisut, kalaallit oqaasii",
  },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "kr", name: "Kanuri", nativeName: "Kanuri" },
  { code: "ks", name: "Kashmiri", nativeName: "कश्मीरी, كشميري" },
  { code: "kk", name: "Kazakh", nativeName: "Қазақ тілі" },
  { code: "km", name: "Khmer", nativeName: "ភាសាខ្មែរ" },
  { code: "ki", name: "Kikuyu, Gikuyu", nativeName: "Gĩkũyũ" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Ikinyarwanda" },
  { code: "ky", name: "Kirghiz, Kyrgyz", nativeName: "Кыргыз тили" },
  { code: "kv", name: "Komi", nativeName: "Коми кыв" },
  { code: "kg", name: "Kongo", nativeName: "KiKongo" },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어 (韓國語), 조선말 (朝鮮語)",
  },
  { code: "ku", name: "Kurdish", nativeName: "Kurdî, كوردی" },
  { code: "kj", name: "Kwanyama, Kuanyama", nativeName: "Kuanyama" },
  { code: "la", name: "Latin", nativeName: "Latine, lingua latina" },
  {
    code: "lb",
    name: "Luxembourgish, Letzeburgesch",
    nativeName: "Lëtzebuergesch",
  },
  { code: "lg", name: "Luganda", nativeName: "Luganda" },
  {
    code: "li",
    name: "Limburgish, Limburgan, Limburger",
    nativeName: "Limburgs",
  },
  { code: "ln", name: "Lingala", nativeName: "Lingála" },
  { code: "lo", name: "Lao", nativeName: "ພາສາລາວ" },
  { code: "lt", name: "Lithuanian", nativeName: "Lietuvių kalba" },
  { code: "lu", name: "Luba-Katanga", nativeName: "" },
  { code: "lv", name: "Latvian", nativeName: "Latviešu valoda" },
  { code: "gv", name: "Manx", nativeName: "Gaelg, Gailck" },
  { code: "mk", name: "Macedonian", nativeName: "Македонски јазик" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy fiteny" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu, بهاس ملايو" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mt", name: "Maltese", nativeName: "Malti" },
  { code: "mi", name: "Māori", nativeName: "Te reo Māori" },
  { code: "mr", name: "Marathi (Marāṭhī)", nativeName: "मराठी" },
  { code: "mh", name: "Marshallese", nativeName: "Kajin M̧ajeļ" },
  { code: "mn", name: "Mongolian", nativeName: "Монгол" },
  { code: "na", name: "Nauru", nativeName: "Ekakairũ Naoero" },
  { code: "nv", name: "Navajo, Navaho", nativeName: "Diné bizaad, Dinékʼehǰí" },
  { code: "nb", name: "Norwegian Bokmål", nativeName: "Norsk bokmål" },
  { code: "nd", name: "North Ndebele", nativeName: "IsiNdebele" },
  { code: "ne", name: "Nepali", nativeName: "नेपाली" },
  { code: "ng", name: "Ndonga", nativeName: "Owambo" },
  { code: "nn", name: "Norwegian Nynorsk", nativeName: "Norsk nynorsk" },
  { code: "no", name: "Norwegian", nativeName: "Norsk" },
  { code: "ii", name: "Nuosu", nativeName: "ꆈꌠ꒿ Nuosuhxop" },
  { code: "nr", name: "South Ndebele", nativeName: "IsiNdebele" },
  { code: "oc", name: "Occitan", nativeName: "Occitan" },
  { code: "oj", name: "Ojibwe, Ojibwa", nativeName: "ᐊᓂᔑᓈᐯᒧᐎᓐ" },
  { code: "om", name: "Oromo", nativeName: "Afaan Oromoo" },
  { code: "or", name: "Oriya", nativeName: "ଓଡ଼ିଆ" },
  { code: "os", name: "Ossetian, Ossetic", nativeName: "Ирон æвзаг" },
  { code: "pa", name: "Panjabi, Punjabi", nativeName: "ਪੰਜਾਬੀ, پنجابی" },
  { code: "pi", name: "Pāli", nativeName: "पाऴि" },
  { code: "fa", name: "Persian", nativeName: "فارسی" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
  { code: "ps", name: "Pashto, Pushto", nativeName: "پښتو" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "qu", name: "Quechua", nativeName: "Runa Simi, Kichwa" },
  { code: "rm", name: "Romansh", nativeName: "Rumantsch grischun" },
  { code: "rn", name: "Kirundi", nativeName: "KiRundi" },
  { code: "ro", name: "Romanian, Moldavian, Moldovan", nativeName: "Română" },
  { code: "ru", name: "Russian", nativeName: "Русский язык" },
  { code: "sa", name: "Sanskrit (Saṁskṛta)", nativeName: "संस्कृतम्" },
  { code: "sc", name: "Sardinian", nativeName: "Sardu" },
  { code: "sd", name: "Sindhi", nativeName: "सिन्धी, سنڌي، سندھی" },
  { code: "se", name: "Northern Sami", nativeName: "Davvisámegiella" },
  { code: "sm", name: "Samoan", nativeName: "Gagana faa Samoa" },
  { code: "sg", name: "Sango", nativeName: "Yângâ tî sängö" },
  { code: "sr", name: "Serbian", nativeName: "Српски језик" },
  { code: "gd", name: "Scottish Gaelic; Gaelic", nativeName: "Gàidhlig" },
  { code: "sn", name: "Shona", nativeName: "ChiShona" },
  { code: "si", name: "Sinhala, Sinhalese", nativeName: "සිංහල" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina" },
  { code: "sl", name: "Slovene", nativeName: "Slovenščina" },
  { code: "so", name: "Somali", nativeName: "Soomaaliga, af Soomaali" },
  { code: "st", name: "Southern Sotho", nativeName: "Sesotho" },
  { code: "es", name: "Spanish; Castilian", nativeName: "Español, castellano" },
  { code: "su", name: "Sundanese", nativeName: "Basa Sunda" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili" },
  { code: "ss", name: "Swati", nativeName: "SiSwati" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "tg", name: "Tajik", nativeName: "Тоҷикӣ, toğikī, تاجیکی" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ" },
  {
    code: "bo",
    name: "Tibetan Standard, Tibetan, Central",
    nativeName: "བོད་ཡིག",
  },
  { code: "tk", name: "Turkmen", nativeName: "Türkmen, Түркмен" },
  { code: "tl", name: "Tagalog", nativeName: "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔" },
  { code: "tn", name: "Tswana", nativeName: "Setswana" },
  { code: "to", name: "Tonga (Tonga Islands)", nativeName: "Faka Tonga" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  { code: "ts", name: "Tsonga", nativeName: "Xitsonga" },
  { code: "tt", name: "Tatar", nativeName: "Татарча, tatarça, تاتارچا" },
  { code: "tw", name: "Twi", nativeName: "Twi" },
  { code: "ty", name: "Tahitian", nativeName: "Reo Tahiti" },
  { code: "ug", name: "Uighur, Uyghur", nativeName: "Uyƣurqə, ئۇيغۇرچە" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "uz", name: "Uzbek", nativeName: "Zbek, Ўзбек, أۇزبېك" },
  { code: "ve", name: "Venda", nativeName: "Tshivenḓa" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  { code: "vo", name: "Volapük", nativeName: "Volapük" },
  { code: "wa", name: "Walloon", nativeName: "Walon" },
  { code: "cy", name: "Welsh", nativeName: "Cymraeg" },
  { code: "wo", name: "Wolof", nativeName: "Wollof" },
  { code: "fy", name: "Western Frisian", nativeName: "Frysk" },
  { code: "xh", name: "Xhosa", nativeName: "IsiXhosa" },
  { code: "yi", name: "Yiddish", nativeName: "ייִדיש" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá" },
  { code: "za", name: "Zhuang, Chuang", nativeName: "Saɯ cueŋƅ, Saw cuengh" },
];

export function getLabel(languageCode: string): string {
  return (
    LANGUAGES.find((language) => language.code === languageCode)?.nativeName ??
    languageCode.toUpperCase()
  );
}
