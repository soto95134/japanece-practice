import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type { KanaCharacter } from './kanaData';
import { hiragana, katakana } from './kanaData';
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
    const [userInput, setUserInput] = useState<string>('');
    const [currentKana, setCurrentKana] = useState<KanaCharacter | null>(null);
    const [message, setMessage] = useState<string>('Presiona "Comenzar" para iniciar.');
    const [feedbackState, setFeedbackState] = useState<FeedbackState>('default');
    const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
    const [isPracticing, setIsPracticing] = useState<boolean>(false);
    const [selectedHiragana, setSelectedHiragana] = useState<string[]>(hiragana.map(k => k.kana));
    const [selectedKatakana, setSelectedKatakana] = useState<string[]>([]);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [incorrectCount, setIncorrectCount] = useState<number>(0);
    const [remainingKanas, setRemainingKanas] = useState<number>(0);
    const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

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

    const selectRandomKana = useCallback(() => {
        setIsInputDisabled(false); // Habilitar el input al cambiar de kana
        if (practiceList.length === 0) {
            setCurrentKana(null);
            setMessage(`🎉 ¡Sesión completada! Aciertos: ${correctCount}, Fallos: ${incorrectCount}`);
            setUserInput('');
            setFeedbackState('default'); 
            setIsHintVisible(false);
            setIsPracticing(false);
            return;
        } 
        const randomIndex = Math.floor(Math.random() * practiceList.length);
        setCurrentKana(practiceList[randomIndex]);
        setUserInput('');
        setMessage('Escribe el Romanji...');
        setFeedbackState('default');
        setIsHintVisible(false);
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
            setIsPracticing(true);
        } else {
            setMessage('Selecciona al menos un carácter.');
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.toLowerCase();
        setUserInput(value);
        if (!currentKana || !isPracticing) return;

        if (value === currentKana.romanji) {
            setMessage('✅ ¡Correcto!');
            setFeedbackState('correct');
            setCorrectCount(prev => prev + 1);
            setRemainingKanas(prev => prev - 1);
            setTimeout(selectRandomKana, 500);
        } else if (currentKana.romanji.startsWith(value)) {
            setMessage('...');
            setFeedbackState('typing');
        } else if (value.length >= currentKana.romanji.length) {
            // Solo mostrar error si se ha escrito la misma cantidad de caracteres
            setMessage(`❌ Correcto: ${currentKana.romanji}`);
            setFeedbackState('incorrect');
            setIncorrectCount(prev => prev + 1);
            setRemainingKanas(prev => prev - 1);
            setIsInputDisabled(true); // Deshabilitar el input al fallar
            setTimeout(selectRandomKana, 1500);
        } else {
            setMessage('...');
            setFeedbackState('typing');
        }
    };

    const toggleHintVisibility = useCallback(() => {
        setIsHintVisible(prev => !prev);
    }, []);

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
                    <h1 className="main-title">Práctica de Kana</h1>
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
                    <h1 className="main-title">Quiz</h1>
                    <div className="progress-stats">
                        <span className="stat correct">✅ {correctCount}</span>
                        <span className="stat incorrect">❌ {incorrectCount}</span>
                        <span className="stat remaining">📝 {remainingKanas} restantes</span>
                    </div>
                    <div className={`kana-display ${feedbackState}`} key={currentKana?.kana || 'empty'}>
                        {currentKana ? currentKana.kana : '—'}
                    </div>
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Romanji..."
                        autoFocus 
                        className={`text-input ${feedbackState}`}
                        disabled={feedbackState === 'correct' || !currentKana || isInputDisabled} 
                        ref={inputRef} 
                    />
                    <p className="feedback-message">{message}</p>
                    {currentKana && (
                        <div className="hint-container">
                            <button onClick={toggleHintVisibility} className="hint-button">
                                {isHintVisible ? 'Ocultar Pista' : 'Pista'}
                            </button>
                            {isHintVisible && <span className="hint-tag">{currentKana.romanji}</span>}
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
                {activeTab === 'kanji' && <KanjiPractice />}
                {activeTab === 'words' && <WordsPractice />}
            </main>
        </div>
    );
}

export default App;