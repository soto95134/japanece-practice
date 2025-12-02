import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { KanaCharacter } from './kanaData';
import { hiragana, katakana } from './kanaData';
import type { NumberData } from './numberData';
import { generateNumberInRange } from './numberData';
import './App.css';

// =================================================================
// 1. KANA PRACTICE COMPONENT
// =================================================================

type FeedbackState = 'default' | 'correct' | 'incorrect' | 'typing';

interface KanaPracticeProps {
    onUpdateCount: (count: number) => void;
}

const KanaPractice = ({ onUpdateCount }: KanaPracticeProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const [userInput, setUserInput] = useState<string>('');
    const [currentKana, setCurrentKana] = useState<KanaCharacter | null>(null);
    const [message, setMessage] = useState<string>('Presiona "Comenzar" para iniciar.');
    const [feedbackState, setFeedbackState] = useState<FeedbackState>('default');
    const [isPracticing, setIsPracticing] = useState<boolean>(false);
    const [selectedHiragana, setSelectedHiragana] = useState<string[]>(hiragana.map(k => k.kana));
    const [selectedKatakana, setSelectedKatakana] = useState<string[]>([]);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);
    const [remainingKanas, setRemainingKanas] = useState<number>(0);
    const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
    const [previousKana, setPreviousKana] = useState<{ kana: string, romanji: string } | null>(null);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [failedKanas, setFailedKanas] = useState<Array<{ kana: string, romanji: string }>>([]);

    const practiceList = useMemo(() => {
        // Siempre incluir hiragana y katakana seleccionados
        return [
            ...hiragana.filter(k => selectedHiragana.includes(k.kana)),
            ...katakana.filter(k => selectedKatakana.includes(k.kana))
        ];
    }, [selectedHiragana, selectedKatakana]);

    const isReadyToStart = practiceList.length > 0;

    useEffect(() => {
        onUpdateCount(practiceList.length);
    }, [practiceList.length, onUpdateCount]);

    // Efecto para manejar el foco del input
    useEffect(() => {
        if (isPracticing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isPracticing, currentKana]);

    const selectRandomKana = useCallback((wasCorrect: boolean = false) => {
        // Solo guardar el kana anterior si la respuesta fue incorrecta
        if (currentKana) {
            if (!wasCorrect) {
                setPreviousKana({
                    kana: currentKana.kana,
                    romanji: currentKana.romanji
                });
            } else {
                // Limpiar el kana anterior si la respuesta fue correcta
                setPreviousKana(null);
            }
        }

        setIsInputDisabled(false); // Habilitar el input al cambiar de kana
        setShowHint(false); // Ocultar pista al cambiar de kana

        if (practiceList.length === 0) {
            setCurrentKana(null);
            setMessage(`🎉 ¡Sesión completada! Aciertos: ${correctCount}, Fallos: ${incorrectCount}`);
            setUserInput('');
            setFeedbackState('default');
            setIsPracticing(false);
            return;
        }
        const randomIndex = Math.floor(Math.random() * practiceList.length);
        setCurrentKana(practiceList[randomIndex]);
        setUserInput('');
        setMessage('Escribe el Romanji...');
        setFeedbackState('default');
    }, [practiceList, isPracticing]);

    useEffect(() => {
        if (isPracticing) {
            selectRandomKana();
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setCurrentKana(null);
            setMessage('Presiona "Comenzar" para iniciar.');
            setUserInput('');
            setFeedbackState('default');
        }
    }, [isPracticing, selectRandomKana]);

    const handleStartPractice = () => {
        if (isReadyToStart) {
            setCorrectCount(0);
            setIncorrectCount(0);
            setRemainingKanas(practiceList.length);
            setPreviousKana(null);
            setFailedKanas([]); // Limpiar kanas fallidos al iniciar
            setIsPracticing(true);
        } else {
            setMessage('Selecciona al menos un carácter.');
        }
    };

    const validateAnswer = (input: string) => {
        if (!currentKana || !isPracticing) return false;

        const isKanaMatch = input === currentKana.kana;
        const isRomajiMatch = input.toLowerCase() === currentKana.romanji;

        if (isKanaMatch || isRomajiMatch) {
            setMessage('✅ ¡Correcto!');
            setFeedbackState('correct');
            setCorrectCount(prev => prev + 1);
            setRemainingKanas(prev => prev - 1);
            setIsInputDisabled(true);
            setTimeout(selectRandomKana, 500);
            return true;
        } else if (input.length > 0) {
            setMessage(`❌ Correcto: ${currentKana.romanji} (${currentKana.kana})`);
            setFeedbackState('incorrect');
            setIncorrectCount(prev => prev + 1);
            return false;
        }
        return false;
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setUserInput(value);

        if (!currentKana || !isPracticing) return;

        // Solo mostrar feedback de escritura sin validar la respuesta completa
        if (value.length === 0) {
            setMessage('...');
            setFeedbackState('typing');
        } else if (
            currentKana.romanji.startsWith(value.toLowerCase()) ||
            currentKana.kana.startsWith(value)
        ) {
            // Mostrar feedback mientras se escribe
            setMessage('Presiona Enter para validar...');
            setFeedbackState('typing');
        } else {
            setMessage('Intenta de nuevo o presiona Enter para ver la respuesta');
            setFeedbackState('typing');
        }
    };

    const toggleKanaSelection = useCallback((kana: string, type: 'h' | 'k') => {
        if (type === 'h') {
            setSelectedHiragana(prev =>
                prev.includes(kana) ? prev.filter(k => k !== kana) : [...prev, kana]
            );
        } else {
            setSelectedKatakana(prev =>
                prev.includes(kana) ? prev.filter(k => k !== kana) : [...prev, kana]
            );
        }
    }, []);

    const toggleAll = (type: 'h' | 'k', select: boolean) => {
        if (type === 'h') setSelectedHiragana(select ? hiragana.map(k => k.kana) : []);
        else setSelectedKatakana(select ? katakana.map(k => k.kana) : []);
    };

    const renderKanaGrid = useCallback((data: KanaCharacter[], selected: string[], type: 'h' | 'k') => (
        <div className="kana-grid">
            {data.map(k => (
                <button
                    key={k.kana}
                    className={`kana-cell ${selected.includes(k.kana) ? 'selected' : ''}`}
                    onClick={() => toggleKanaSelection(k.kana, type)}
                    title={k.romanji}
                >
                    {k.kana}
                </button>
            ))}
        </div>
    ), [toggleKanaSelection]);

    return (
        <>
            {!isPracticing ? (
                <div className="kana-config-section">
                    <div className="title-container">
                        <h1 className="main-title">Práctica de Kana</h1>
                        <div 
                            className="info-icon"
                            onMouseEnter={() => setShowInstructions(true)}
                            onMouseLeave={() => setShowInstructions(false)}
                        >
                            ℹ️
                            {showInstructions && (
                                <div className="tooltip">
                                    <h4>Instrucciones:</h4>
                                    <ul>
                                        <li>Selecciona los kanas que quieras practicar</li>
                                        <li>Escribe la lectura en romaji o el kana</li>
                                        <li>Presiona Enter para validar tu respuesta</li>
                                        <li>¡Practica hasta dominarlos todos!</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="instruction-text">
                        Selecciona los caracteres que quieres practicar.
                        <span className="info-count"> ({practiceList.length} caracteres seleccionados)</span>
                    </p>

                    <div className="kana-type-section">
                        <div className="kana-type-header">
                            <h3>Hiragana (あ)</h3>
                            <div className="selection-actions">
                                <button onClick={() => toggleAll('h', true)} className="select-all-button">Todos</button>
                                <button onClick={() => toggleAll('h', false)} className="deselect-all-button">Ninguno</button>
                            </div>
                        </div>
                        {renderKanaGrid(hiragana, selectedHiragana, 'h')}
                    </div>

                    <div className="kana-type-section">
                        <div className="kana-type-header">
                            <h3>Katakana (ア)</h3>
                            <div className="selection-actions">
                                <button onClick={() => toggleAll('k', true)} className="select-all-button">Todos</button>
                                <button onClick={() => toggleAll('k', false)} className="deselect-all-button">Ninguno</button>
                            </div>
                        </div>
                        {renderKanaGrid(katakana, selectedKatakana, 'k')}
                    </div>

                    <button
                        onClick={handleStartPractice}
                        className="start-button"
                        disabled={!isReadyToStart}
                    >
                        {isReadyToStart ? 'COMENZAR PRÁCTICA' : 'Selecciona al menos un carácter'}
                    </button>
                    <p className="feedback-message">{message}</p>
                </div>
            ) : (
                <div className="kana-quiz-section">
                    <h1 className="main-title">Romanji</h1>
                    <div className="progress-stats">
                        <span className="stat correct">✅ {correctCount}</span>
                        <span className="stat incorrect">❌ {incorrectCount}</span>
                        <span className="stat remaining">📝 {remainingKanas} restantes</span>
                    </div>
                    <div className={`kana-display ${feedbackState}`} key={currentKana?.kana || 'empty'}>
                        {currentKana ? currentKana.kana : '—'}
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!currentKana || !isPracticing || isInputDisabled) return;

                        const value = userInput.trim();
                        const isKanaMatch = value === currentKana.kana;
                        const isRomajiMatch = value.toLowerCase() === currentKana.romanji;

                        if (isKanaMatch || isRomajiMatch) {
                            // Respuesta correcta
                            setMessage('✅ ¡Correcto!');
                            setFeedbackState('correct');
                            setCorrectCount(prev => prev + 1);
                            setRemainingKanas(prev => prev - 1);
                            setIsInputDisabled(true);
                            setShowHint(false);

                            setTimeout(() => {
                                selectRandomKana(true);
                                setUserInput('');
                                setMessage('...');
                                setFeedbackState('typing');
                                setIsInputDisabled(false);
                            }, 500);
                        } else {
                            setMessage(`❌ Correcto: ${currentKana.romanji} (${currentKana.kana})`);
                            setFeedbackState('incorrect');
                            setIncorrectCount(prev => prev + 1);
                            setShowHint(true);
                            setIsInputDisabled(true);

                            // Guardar el kana fallido si no está ya en la lista
                            setFailedKanas(prev => {
                                const alreadyExists = prev.some(k =>
                                    k.kana === currentKana.kana && k.romanji === currentKana.romanji
                                );
                                return alreadyExists ? prev : [...prev, {
                                    kana: currentKana.kana,
                                    romanji: currentKana.romanji
                                }];
                            });

                            // Pasar al siguiente kana después de un breve retraso
                            setTimeout(() => {
                                selectRandomKana(false);
                                setUserInput('');
                                setMessage('...');
                                setFeedbackState('typing');
                                setIsInputDisabled(false);
                            }, 1500);
                        }
                    }}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    validateAnswer(userInput);
                                }
                            }}
                            placeholder="Romanji..."
                            autoFocus
                            className={`text-input ${feedbackState}`}
                            disabled={feedbackState === 'correct' || !currentKana || isInputDisabled}
                            ref={inputRef}
                        />
                    </form>
                    <p className="feedback-message">{message}</p>
                    {showHint && currentKana && (
                        <div className="hint-container">
                            <span className="hint-tag">{currentKana.romanji}</span>
                        </div>
                    )}
                    {previousKana && (
                        <div className="previous-kana">
                            <small>Anterior: {previousKana.kana} ({previousKana.romanji})</small>
                        </div>
                    )}
                    {failedKanas.length > 0 && (
                        <div className="failed-kanas">
                            <h4>Kanas fallados:</h4>
                            <div className="failed-kanas-list">
                                {failedKanas.map((k, index) => (
                                    <span key={index} className="failed-kana">
                                        {k.kana} ({k.romanji}){index < failedKanas.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <button onClick={() => setIsPracticing(false)} className="start-button exit-button">Salir</button>
                </div>
            )}
        </>
    );
};

// =================================================================
// 2. PLACEHOLDER COMPONENTS
// =================================================================

const NumberPractice = () => {
    const [minNumber, setMinNumber] = useState<number>(1);
    const [maxNumber, setMaxNumber] = useState<number>(10);
    const [currentNumber, setCurrentNumber] = useState<NumberData | null>(null);
    const [userInput, setUserInput] = useState<string>('');
    const [message, setMessage] = useState<string>('Selecciona un rango y presiona Empezar');
    const [feedbackState, setFeedbackState] = useState<'default' | 'correct' | 'incorrect'>('default');
    const [isPracticing, setIsPracticing] = useState<boolean>(false);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const startPractice = () => {
        if (minNumber > maxNumber) {
            setMessage('⚠️ El número mínimo debe ser menor o igual al máximo');
            return;
        }
        
        const newNumber = generateNumberInRange(minNumber, maxNumber);
        setCurrentNumber(newNumber);
        setUserInput('');
        setMessage('Escribe el número en japonés (romaji o kanji)');
        setFeedbackState('default');
        setIsPracticing(true);
        
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const checkAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentNumber || !isPracticing) return;
        
        // Normalizar la entrada del usuario
        const userAnswer = userInput.trim().toLowerCase();
        
        // Crear un array con todas las posibles respuestas válidas
        const possibleAnswers = [
            currentNumber.romaji.toLowerCase(),
            currentNumber.kanji,
            currentNumber.hiragana,
            currentNumber.number.toString()
        ];
        
        // Añadir variantes con guiones medios/bajos para romaji
        if (currentNumber.romaji.includes('/')) {
            possibleAnswers.push(...currentNumber.romaji.toLowerCase().split('/').map(a => a.trim()));
        }
        if (currentNumber.hiragana.includes('/')) {
            possibleAnswers.push(...currentNumber.hiragana.split('/').map(a => a.trim()));
        }
        
        // Verificar si alguna de las respuestas posibles coincide
        const isCorrect = possibleAnswers.some(answer => {
            const normalizedAnswer = answer.toLowerCase().trim();
            return normalizedAnswer === userAnswer;
        });
        
        if (isCorrect) {
            setMessage('✅ ¡Correcto!');
            setFeedbackState('correct');
            setCorrectCount(prev => prev + 1);
            
            // Seleccionar un nuevo número después de un breve retraso
            setTimeout(() => {
                const newNumber = generateNumberInRange(minNumber, maxNumber);
                setCurrentNumber(newNumber);
                setUserInput('');
                setFeedbackState('default');
                setMessage('');
                if (inputRef.current) inputRef.current.focus();
            }, 1000);
        } else {
            // Mostrar todas las formas correctas
            const correctAnswers = [
                `Número: ${currentNumber.number}`,
                `Kanji: ${currentNumber.kanji}`,
                `Hiragana: ${currentNumber.hiragana}`,
                `Romaji: ${currentNumber.romaji}`
            ].join(' | ');
            
            setMessage(`❌ Incorrecto. ${correctAnswers}`);
            setFeedbackState('incorrect');
            setIncorrectCount(prev => prev + 1);
            
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => {
                setMessage('Intenta de nuevo');
                setFeedbackState('default');
                if (inputRef.current) inputRef.current.focus();
            }, 3000);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            checkAnswer(e);
        }
    };

    if (!isPracticing) {
        return (
            <div className="number-practice">
                <h1 className="main-title">Práctica de Números (数字)</h1>
                <p className="instruction-text">
                    Selecciona el rango de números que deseas practicar:
                </p>
                
                <div className="number-range-selector">
                    <div className="range-input">
                        <label htmlFor="minNumber">Desde:</label>
                        <input
                            type="number"
                            id="minNumber"
                            min="0"
                            max="9999"
                            value={minNumber}
                            onChange={(e) => setMinNumber(Math.max(0, parseInt(e.target.value) || 0))}
                        />
                    </div>
                    
                    <div className="range-input">
                        <label htmlFor="maxNumber">Hasta:</label>
                        <input
                            type="number"
                            id="maxNumber"
                            min={minNumber}
                            max="9999"
                            value={maxNumber}
                            onChange={(e) => setMaxNumber(Math.max(minNumber, parseInt(e.target.value) || minNumber))}
                        />
                    </div>
                </div>
                
                <button 
                    onClick={startPractice}
                    className="start-button"
                >
                    Empezar Práctica
                </button>
                
                <div className="instructions">
                    <h3>Instrucciones:</h3>
                    <ul>
                        <li>Selecciona el rango de números que deseas practicar</li>
                        <li>Escribe el número en romaji, hiragana o kanji</li>
                        <li>Presiona Enter para validar tu respuesta</li>
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div className="number-practice">
            <h1 className="main-title">Práctica de Números (数字)</h1>
            
            <div className="number-display">
                <div className="number">{currentNumber?.number}</div>
                <div className="number-hint">Escribe este número en japonés</div>
            </div>
            
            <form onSubmit={checkAnswer} className="number-form">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`number-input ${feedbackState}`}
                    placeholder="Escribe aquí..."
                    ref={inputRef}
                    autoFocus
                />
                <button type="submit" className="check-button">
                    Verificar
                </button>
            </form>
            
            <p className={`feedback-message ${feedbackState}`}>
                {message}
            </p>
            
            <div className="score-counter">
                <div className="score correct">✅ {correctCount}</div>
                <div className="score incorrect">❌ {incorrectCount}</div>
            </div>
            
            <button 
                onClick={() => setIsPracticing(false)}
                className="exit-button"
            >
                Cambiar Rango
            </button>
        </div>
    );
};

const KanjiPractice = () => (
    <div className="placeholder-container">
        <h1 className="main-title">Kanji (漢字)</h1>
        <div className="under-development">
            <p className="dev-title">🚧 En Desarrollo</p>
            <p>Pronto podrás practicar tus Kanjis aquí.</p>
        </div>
    </div>
);

const WordsPractice = () => (
    <div className="placeholder-container">
        <h1 className="main-title">Vocabulario (言葉)</h1>
        <div className="under-development">
            <p className="dev-title">🚧 En Desarrollo</p>
            <p>Pronto podrás practicar vocabulario aquí.</p>
        </div>
    </div>
);

function App() {
    const [activeTab, setActiveTab] = useState('kana');
    const [, setKanaCount] = useState(0);

    return (
        <div className="app-container">
            <nav className="nav-bar">
                <button
                    className={`nav-button ${activeTab === 'kana' ? 'active' : ''}`}
                    onClick={() => setActiveTab('kana')}
                >
                    Kana
                </button>
                <button
                    className={`nav-button ${activeTab === 'numbers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('numbers')}
                >
                    Numeros
                </button>
                <button
                    className={`nav-button ${activeTab === 'kanji' ? 'active' : ''}`}
                    onClick={() => setActiveTab('kanji')}
                >
                    Kanji
                </button>
                <button
                    className={`nav-button ${activeTab === 'words' ? 'active' : ''}`}
                    onClick={() => setActiveTab('words')}
                >
                    Vocabulario
                </button>
            </nav>

            <main className="main-content">
                {activeTab === 'kana' && <KanaPractice onUpdateCount={setKanaCount} />}
                {activeTab === 'numbers' && <NumberPractice />}
                {activeTab === 'kanji' && <KanjiPractice />}
                {activeTab === 'words' && <WordsPractice />}
            </main>
        </div>
    );
}

export default App;