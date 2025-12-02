export interface NumberData {
    number: number;
    kanji: string;
    hiragana: string;
    romaji: string;
}

export const numbers: NumberData[] = [
    { number: 0, kanji: '零', hiragana: 'れい', romaji: 'rei' },
    { number: 1, kanji: '一', hiragana: 'いち', romaji: 'ichi' },
    { number: 2, kanji: '二', hiragana: 'に', romaji: 'ni' },
    { number: 3, kanji: '三', hiragana: 'さん', romaji: 'san' },
    { number: 4, kanji: '四', hiragana: 'し/よん', romaji: 'shi/yon' },
    { number: 5, kanji: '五', hiragana: 'ご', romaji: 'go' },
    { number: 6, kanji: '六', hiragana: 'ろく', romaji: 'roku' },
    { number: 7, kanji: '七', hiragana: 'しち/なな', romaji: 'shichi/nana' },
    { number: 8, kanji: '八', hiragana: 'はち', romaji: 'hachi' },
    { number: 9, kanji: '九', hiragana: 'く/きゅう', romaji: 'ku/kyuu' },
    { number: 10, kanji: '十', hiragana: 'じゅう', romaji: 'juu' },
    { number: 20, kanji: '二十', hiragana: 'にじゅう', romaji: 'nijuu' },
    { number: 30, kanji: '三十', hiragana: 'さんじゅう', romaji: 'sanjuu' },
    { number: 40, kanji: '四十', hiragana: 'よんじゅう', romaji: 'yonjuu' },
    { number: 50, kanji: '五十', hiragana: 'ごじゅう', romaji: 'gojuu' },
    { number: 60, kanji: '六十', hiragana: 'ろくじゅう', romaji: 'rokujuu' },
    { number: 70, kanji: '七十', hiragana: 'ななじゅう', romaji: 'nanajuu' },
    { number: 80, kanji: '八十', hiragana: 'はちじゅう', romaji: 'hachijuu' },
    { number: 90, kanji: '九十', hiragana: 'きゅうじゅう', romaji: 'kyuujuu' },
    { number: 100, kanji: '百', hiragana: 'ひゃく', romaji: 'hyaku' },
    { number: 200, kanji: '二百', hiragana: 'にひゃく', romaji: 'nihyaku' },
    { number: 300, kanji: '三百', hiragana: 'さんびゃく', romaji: 'sanbyaku' },
    { number: 400, kanji: '四百', hiragana: 'よんひゃく', romaji: 'yonhyaku' },
    { number: 500, kanji: '五百', hiragana: 'ごひゃく', romaji: 'gohyaku' },
    { number: 600, kanji: '六百', hiragana: 'ろっぴゃく', romaji: 'roppyaku' },
    { number: 700, kanji: '七百', hiragana: 'ななひゃく', romaji: 'nanahyaku' },
    { number: 800, kanji: '八百', hiragana: 'はっぴゃく', romaji: 'happyaku' },
    { number: 900, kanji: '九百', hiragana: 'きゅうひゃく', romaji: 'kyuuhyaku' },
    { number: 1000, kanji: '千', hiragana: 'せん', romaji: 'sen' },
    { number: 2000, kanji: '二千', hiragana: 'にせん', romaji: 'nisen' },
    { number: 3000, kanji: '三千', hiragana: 'さんぜん', romaji: 'sanzen' },
    { number: 4000, kanji: '四千', hiragana: 'よんせん', romaji: 'yonsen' },
    { number: 5000, kanji: '五千', hiragana: 'ごせん', romaji: 'gosen' },
    { number: 6000, kanji: '六千', hiragana: 'ろくせん', romaji: 'rokusen' },
    { number: 7000, kanji: '七千', hiragana: 'ななせん', romaji: 'nanasen' },
    { number: 8000, kanji: '八千', hiragana: 'はっせん', romaji: 'hassen' },
    { number: 9000, kanji: '九千', hiragana: 'きゅうせん', romaji: 'kyuusen' },
    { number: 10000, kanji: '一万', hiragana: 'いちまん', romaji: 'ichiman' },
];

// Función para generar números compuestos
export function generateNumberInRange(min: number, max: number): NumberData {
    const targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Si el número existe directamente en la lista, lo devolvemos
    const exactMatch = numbers.find(n => n.number === targetNumber);
    if (exactMatch) return exactMatch;
    
    // Si no, lo construimos
    return constructNumber(targetNumber);
}

// Función para construir números compuestos
function constructNumber(num: number): NumberData {
    if (num === 0) return numbers[0];
    
    let kanji = '';
    let hiragana = '';
    let romaji = '';
    let remaining = num;
    
    // Función auxiliar para obtener la lectura de un número
    const getReading = (n: number, type: 'kanji' | 'hiragana' | 'romaji'): string => {
        const numData = numbers.find(item => item.number === n);
        return numData ? numData[type] || '' : '';
    };
    
    // Manejar decenas de millar (10,000+)
    if (remaining >= 10000) {
        const man = Math.floor(remaining / 10000);
        if (man > 1) {
            kanji += getReading(man, 'kanji');
            hiragana += getReading(man, 'hiragana');
            romaji += getReading(man, 'romaji');
        }
        kanji += '万';
        hiragana += 'まん';
        romaji += 'man';
        remaining %= 10000;
    }
    
    // Manejar millares (1,000-9,999)
    if (remaining >= 1000) {
        const sen = Math.floor(remaining / 1000);
        if (sen > 1) {
            kanji += getReading(sen, 'kanji');
            hiragana += getReading(sen, 'hiragana');
            romaji += getReading(sen, 'romaji');
        }
        kanji += '千';
        hiragana += 'せん';
        romaji += 'sen';
        remaining %= 1000;
    }
    
    // Manejar centenas (100-999)
    if (remaining >= 100) {
        const hyaku = Math.floor(remaining / 100);
        if (hyaku > 1) {
            kanji += getReading(hyaku, 'kanji');
            hiragana += getReading(hyaku, 'hiragana');
            romaji += getReading(hyaku, 'romaji');
        }
        kanji += '百';
        hiragana += 'ひゃく';
        romaji += 'hyaku';
        remaining %= 100;
    }
    
    // Manejar decenas (10-99)
    if (remaining >= 10) {
        const juu = Math.floor(remaining / 10);
        if (juu > 1) {
            kanji += getReading(juu, 'kanji');
            hiragana += getReading(juu, 'hiragana');
            romaji += getReading(juu, 'romaji');
        }
        kanji += '十';
        hiragana += 'じゅう';
        romaji += 'juu';
        remaining %= 10;
    }
    
    // Manejar unidades (1-9)
    if (remaining > 0) {
        kanji += getReading(remaining, 'kanji');
        hiragana += getReading(remaining, 'hiragana');
        romaji += getReading(remaining, 'romaji');
    }
    
    // Manejar casos especiales de pronunciación
    hiragana = hiragana
        .replace(/さんひゃく/g, 'さんびゃく')
        .replace(/さんせん/g, 'さんぜん')
        .replace(/はっせん/g, 'はっせん')
        .replace(/はちひゃく/g, 'はっぴゃく')
        .replace(/ろくひゃく/g, 'ろっぴゃく')
        .replace(/いちせん/g, 'いっせん');
        
    romaji = romaji
        .replace(/shihyaku/g, 'byaku')
        .replace(/shisen/g, 'sen')
        .replace(/hachihyaku/g, 'happyaku')
        .replace(/rokuhyaku/g, 'roppyaku')
        .replace(/ichisen/g, 'issen');
    
    return {
        number: num,
        kanji: kanji || num.toString(),
        hiragana: hiragana || num.toString(),
        romaji: romaji || num.toString()
    };
}
