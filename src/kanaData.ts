// src/kanaData.ts

// Asegúrate de que este tipo esté definido en tu archivo
export interface KanaCharacter {
  kana: string; // El carácter japonés (ej: 'あ', 'ア')
  romanji: string; // El romanji/lectura (ej: 'a', 'ka')
}

// ----------------------------------------------------------------
//                          HIRAGANA (ひらがな)
// ----------------------------------------------------------------

export const hiragana: KanaCharacter[] = [
  // Gojūon (Vocales y Filas K, S, T, N, H, M, Y, R, W)
  { kana: 'あ', romanji: 'a' }, { kana: 'い', romanji: 'i' }, { kana: 'う', romanji: 'u' }, { kana: 'え', romanji: 'e' }, { kana: 'お', romanji: 'o' },
  { kana: 'か', romanji: 'ka' }, { kana: 'き', romanji: 'ki' }, { kana: 'く', romanji: 'ku' }, { kana: 'け', romanji: 'ke' }, { kana: 'こ', romanji: 'ko' },
  { kana: 'さ', romanji: 'sa' }, { kana: 'し', romanji: 'shi' }, { kana: 'す', romanji: 'su' }, { kana: 'せ', romanji: 'se' }, { kana: 'そ', romanji: 'so' },
  { kana: 'た', romanji: 'ta' }, { kana: 'ち', romanji: 'chi' }, { kana: 'つ', romanji: 'tsu' }, { kana: 'て', romanji: 'te' }, { kana: 'と', romanji: 'to' },
  { kana: 'な', romanji: 'na' }, { kana: 'に', romanji: 'ni' }, { kana: 'ぬ', romanji: 'nu' }, { kana: 'ね', romanji: 'ne' }, { kana: 'の', romanji: 'no' },
  { kana: 'は', romanji: 'ha' }, { kana: 'ひ', romanji: 'hi' }, { kana: 'ふ', romanji: 'fu' }, { kana: 'へ', romanji: 'he' }, { kana: 'ほ', romanji: 'ho' },
  { kana: 'ま', romanji: 'ma' }, { kana: 'み', romanji: 'mi' }, { kana: 'む', romanji: 'mu' }, { kana: 'め', romanji: 'me' }, { kana: 'も', romanji: 'mo' },
  { kana: 'や', romanji: 'ya' }, /* y i */ { kana: 'ゆ', romanji: 'yu' }, /* y e */ { kana: 'よ', romanji: 'yo' },
  { kana: 'ら', romanji: 'ra' }, { kana: 'り', romanji: 'ri' }, { kana: 'る', romanji: 'ru' }, { kana: 'れ', romanji: 're' }, { kana: 'ろ', romanji: 'ro' },
  { kana: 'わ', romanji: 'wa' }, /* w i */ /* w u */ /* w e */ { kana: 'を', romanji: 'wo' }, // 'wo' a menudo se transcribe como 'o'

  // El carácter 'N'
  { kana: 'ん', romanji: 'n' },

  // Dakuon (sonidos g, z, d, b)
  { kana: 'が', romanji: 'ga' }, { kana: 'ぎ', romanji: 'gi' }, { kana: 'ぐ', romanji: 'gu' }, { kana: 'げ', romanji: 'ge' }, { kana: 'ご', romanji: 'go' },
  { kana: 'ざ', romanji: 'za' }, { kana: 'じ', romanji: 'ji' }, { kana: 'ず', romanji: 'zu' }, { kana: 'ぜ', romanji: 'ze' }, { kana: 'ぞ', romanji: 'zo' },
  { kana: 'だ', romanji: 'da' }, { kana: 'ぢ', romanji: 'ji' }, { kana: 'づ', romanji: 'zu' }, { kana: 'で', romanji: 'de' }, { kana: 'ど', romanji: 'do' }, // ぢ/づ se usan raramente
  { kana: 'ば', romanji: 'ba' }, { kana: 'び', romanji: 'bi' }, { kana: 'ぶ', romanji: 'bu' }, { kana: 'べ', romanji: 'be' }, { kana: 'ぼ', romanji: 'bo' },

  // Handakuon (sonidos p)
  { kana: 'ぱ', romanji: 'pa' }, { kana: 'ぴ', romanji: 'pi' }, { kana: 'ぷ', romanji: 'pu' }, { kana: 'ぺ', romanji: 'pe' }, { kana: 'ぽ', romanji: 'po' },

  // Yōon (Dígrafos - Combinaciones con 'ya', 'yu', 'yo' pequeños)
  // Ky, Gy, Sh, J, Ch, Ny, Hy, By, Py, My, Ry
  { kana: 'きゃ', romanji: 'kya' }, { kana: 'きゅ', romanji: 'kyu' }, { kana: 'きょ', romanji: 'kyo' },
  { kana: 'ぎゃ', romanji: 'gya' }, { kana: 'ぎゅ', romanji: 'gyu' }, { kana: 'ぎょ', romanji: 'gyo' },
  { kana: 'しゃ', romanji: 'sha' }, { kana: 'しゅ', romanji: 'shu' }, { kana: 'しょ', romanji: 'sho' },
  { kana: 'じゃ', romanji: 'ja' }, { kana: 'じゅ', romanji: 'ju' }, { kana: 'じょ', romanji: 'jo' },
  { kana: 'ちゃ', romanji: 'cha' }, { kana: 'ちゅ', romanji: 'chu' }, { kana: 'ちょ', romanji: 'cho' },
  { kana: 'にゃ', romanji: 'nya' }, { kana: 'にゅ', romanji: 'nyu' }, { kana: 'にょ', romanji: 'nyo' },
  { kana: 'ひゃ', romanji: 'hya' }, { kana: 'ひゅ', romanji: 'hyu' }, { kana: 'ひょ', romanji: 'hyo' },
  { kana: 'びゃ', romanji: 'bya' }, { kana: 'びゅ', romanji: 'byu' }, { kana: 'びょ', romanji: 'byo' },
  { kana: 'ぴゃ', romanji: 'pya' }, { kana: 'ぴゅ', romanji: 'pyu' }, { kana: 'ぴょ', romanji: 'pyo' },
  { kana: 'みゃ', romanji: 'mya' }, { kana: 'みゅ', romanji: 'myu' }, { kana: 'みょ', romanji: 'myo' },
  { kana: 'りゃ', romanji: 'rya' }, { kana: 'りゅ', romanji: 'ryu' }, { kana: 'りょ', romanji: 'ryo' },
];

// ----------------------------------------------------------------
//                          KATAKANA (カタカナ)
// ----------------------------------------------------------------

export const katakana: KanaCharacter[] = [
  { kana: 'ア', romanji: 'a' }, { kana: 'イ', romanji: 'i' }, { kana: 'ウ', romanji: 'u' },
  { kana: 'エ', romanji: 'e' }, { kana: 'オ', romanji: 'o' },
  { kana: 'カ', romanji: 'ka' }, { kana: 'キ', romanji: 'ki' }, { kana: 'ク', romanji: 'ku' }, { kana: 'ケ', romanji: 'ke' }, { kana: 'コ', romanji: 'ko' },
  { kana: 'サ', romanji: 'sa' }, { kana: 'シ', romanji: 'shi' }, { kana: 'ス', romanji: 'su' }, { kana: 'セ', romanji: 'se' }, { kana: 'ソ', romanji: 'so' },
  { kana: 'タ', romanji: 'ta' }, { kana: 'チ', romanji: 'chi' }, { kana: 'ツ', romanji: 'tsu' }, { kana: 'テ', romanji: 'te' }, { kana: 'ト', romanji: 'to' },
  { kana: 'ナ', romanji: 'na' }, { kana: 'ニ', romanji: 'ni' }, { kana: 'ヌ', romanji: 'nu' }, { kana: 'ネ', romanji: 'ne' }, { kana: 'ノ', romanji: 'no' },
  { kana: 'ハ', romanji: 'ha' }, { kana: 'ヒ', romanji: 'hi' }, { kana: 'フ', romanji: 'fu' }, { kana: 'ヘ', romanji: 'he' }, { kana: 'ホ', romanji: 'ho' },
  { kana: 'マ', romanji: 'ma' }, { kana: 'ミ', romanji: 'mi' }, { kana: 'ム', romanji: 'mu' }, { kana: 'メ', romanji: 'me' }, { kana: 'モ', romanji: 'mo' },
  { kana: 'ヤ', romanji: 'ya' }, { kana: 'ユ', romanji: 'yu' }, { kana: 'ヨ', romanji: 'yo' },
  { kana: 'ラ', romanji: 'ra' }, { kana: 'リ', romanji: 'ri' }, { kana: 'ル', romanji: 'ru' }, { kana: 'レ', romanji: 're' }, { kana: 'ロ', romanji: 'ro' },
  { kana: 'ワ', romanji: 'wa' }, { kana: 'ヲ', romanji: 'wo' }, { kana: 'ン', romanji: 'n' },
  { kana: 'ヴァ', romanji: 'va' }, { kana: 'ヴィ', romanji: 'vi' }, { kana: 'ヴ', romanji: 'vu' }, { kana: 'ヴェ', romanji: 've' }, { kana: 'ヴォ', romanji: 'vo' },
  { kana: 'ファ', romanji: 'fa' }, { kana: 'フィ', romanji: 'fi' }, { kana: 'フェ', romanji: 'fe' }, { kana: 'フォ', romanji: 'fo' },
  { kana: 'チェ', romanji: 'che' },
  { kana: 'ティ', romanji: 'ti' }, { kana: 'トゥ', romanji: 'tu' },
  { kana: 'ディ', romanji: 'di' }, { kana: 'ドゥ', romanji: 'du' },
  { kana: 'シェ', romanji: 'she' },
  { kana: 'ジェ', romanji: 'je' },
  { kana: 'ツァ', romanji: 'tsa' }, { kana: 'ツィ', romanji: 'tsi' }, { kana: 'ツェ', romanji: 'tse' }, { kana: 'ツォ', romanji: 'tso' }
];

// Opcional: Lista combinada (si la estás usando en App.tsx)
export const fullKanaList: KanaCharacter[] = [...hiragana, ...katakana];