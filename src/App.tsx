  import { useState, useMemo, useCallback, useEffect, useRef, type ChangeEvent } from 'react';
  // FIX: Se ha añadido la extensión .ts al path de importación para resolver el error.
  import { hiragana, katakana, type KanaCharacter } from './kanaData'; 
  // Nota: En un entorno real, necesitarías importar './app.css' aquí o en el index principal.

  // Definición de tipos
type PracticeMode = 'hiragana' | 'katakana' | 'both';

// Interfaz para que el componente padre (App) sepa cuántos caracteres están seleccionados
interface KanaPracticeProps {
    onUpdateCount: (count: number) => void;
}

const KanaPractice: React.FC<KanaPracticeProps> = ({ onUpdateCount }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Estados de la Sesión
  const [userInput, setUserInput] = useState<string>(''); 
  const [currentKana, setCurrentKana] = useState<KanaCharacter | null>(null); 
  const [message, setMessage] = useState<string>('');
  const [feedbackState, setFeedbackState] = useState<'default' | 'correct' | 'incorrect'>('default');
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  const [isPracticing, setIsPracticing] = useState<boolean>(false); // Controla la fase de "Selección" vs. "Quiz"
  
  // Estados de Configuración
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('hiragana'); 
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedHiragana, setSelectedHiragana] = useState<string[]>(hiragana.map(k => k.kana));
  const [selectedKatakana, setSelectedKatakana] = useState<string[]>([]); 

  // Genera la lista de caracteres disponibles para la práctica
  const practiceList: KanaCharacter[] = useMemo(() => {
    let list: KanaCharacter[] = [];

    const includeHiragana = practiceMode === 'hiragana' || practiceMode === 'both';
    const includeKatakana = practiceMode === 'katakana' || practiceMode === 'both';

    if (includeHiragana) {
        list.push(...hiragana.filter(k => selectedHiragana.includes(k.kana)));
    }

    if (includeKatakana) {
        list.push(...katakana.filter(k => selectedKatakana.includes(k.kana)));
    }
    
    // Informa al componente padre (App) sobre el número de caracteres disponibles
    onUpdateCount(list.length);
    return list;
  }, [practiceMode, selectedHiragana, selectedKatakana, onUpdateCount]);
  
  const isReadyToStart = practiceList.length > 0;


  // Función para seleccionar un nuevo carácter aleatorio
  const selectRandomKana = useCallback(() => {
    if (practiceList.length === 0) {
        // La lista está vacía o se terminó el quiz
        setCurrentKana(null);
        setMessage(isPracticing ? '¡Sesión terminada! ¡Buen trabajo!' : 'Selecciona al menos un carácter para empezar.');
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
    setFeedbackState('default'); // Reset visual state
    setIsHintVisible(false); // Reset hint state
  }, [practiceList, isPracticing]); 

  // Efecto para empezar el quiz o restablecer
  useEffect(() => {
    if (isPracticing) {
        selectRandomKana();
        // Asegura que el foco esté en el input al iniciar
        setTimeout(() => inputRef.current?.focus(), 100); 
    } else {
        // Restablecer el estado cuando se termina la práctica
        setCurrentKana(null);
        setMessage('Presiona "Comenzar Práctica" para iniciar.');
        setUserInput('');
        setFeedbackState('default');
    }
  }, [isPracticing, selectRandomKana]);

  // Handler para el botón "Comenzar"
  const handleStartPractice = () => {
    if (isReadyToStart) {
        setIsPracticing(true);
    } else {
        setMessage('Debes seleccionar al menos un carácter antes de comenzar.');
    }
  };


  // Handler de Entrada de Usuario (Lógica central del quiz)
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setUserInput(value);

    if (!currentKana || !isPracticing) return; 

    if (value === currentKana.romanji) {
      // ✅ Respuesta Correcta
      setMessage('✅ ¡Correcto!');
      setFeedbackState('correct'); 
      
      // Retraso para ver la animación antes de pasar al siguiente
      setTimeout(() => {
        selectRandomKana();
        if (inputRef.current) {
            inputRef.current.focus();
        }
      }, 500); 

    } else if (currentKana.romanji.startsWith(value)) {
      // ⏳ Entrada Incompleta
      setMessage('...Escribe el resto...');
      setFeedbackState('default');
    } else {
      // ❌ Respuesta Incorrecta (Mostrar respuesta y pasar al siguiente - REQUERIMIENTO)
      setMessage(`❌ ¡Incorrecto! La respuesta correcta era: ${currentKana.romanji}`);
      setFeedbackState('incorrect'); 
      
      // Pasa al siguiente kana después de mostrar la respuesta correcta
       setTimeout(() => {
        selectRandomKana();
        if (inputRef.current) {
            inputRef.current.focus();
        }
      }, 1500); // 1.5s para que el usuario vea la respuesta
    }
  };
    
  // Toggle para la pista
  const toggleHintVisibility = useCallback(() => {
      setIsHintVisible(prev => !prev);
  }, []);

  // Handlers del Menú de Selección (Modal)
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

  // Seleccionar/Deseleccionar Todo
  const toggleAll = (type: 'h' | 'k', select: boolean) => {
    if (type === 'h') {
        setSelectedHiragana(select ? hiragana.map(k => k.kana) : []);
    } else {
        setSelectedKatakana(select ? katakana.map(k => k.kana) : []);
    }
  };

  const inputClassName = `text-input ${feedbackState}`;
  const kanaDisplayClassName = `kana-display ${feedbackState}`;
  
  // Memoized Kana Selection Grid Component for the Modal
  const KanaGridMemo = useMemo(() => {
    const renderKanaGrid = (data: KanaCharacter[], selected: string[], type: 'h' | 'k') => (
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
    );

    return (
        <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Configuración de Caracteres</h2>
            <p className="menu-instructions">Selecciona los caracteres que deseas practicar.</p>

            {/* --- Hiragana Section --- */}
            <div className="kana-type-section">
                <h3>Hiragana (あ)</h3>
                <div className="selection-actions">
                    <button onClick={() => toggleAll('h', true)} className="select-all-button">Seleccionar Todo</button>
                    <button onClick={() => toggleAll('h', false)} className="deselect-all-button">Deseleccionar Todo</button>
                </div>
                {renderKanaGrid(hiragana, selectedHiragana, 'h')}
            </div>

            {/* --- Katakana Section --- */}
            <div className="kana-type-section">
                <h3>Katakana (ア)</h3>
                <div className="selection-actions">
                    <button onClick={() => toggleAll('k', true)} className="select-all-button">Seleccionar Todo</button>
                    <button onClick={() => toggleAll('k', false)} className="deselect-all-button">Deseleccionar Todo</button>
                </div>
                {renderKanaGrid(katakana, selectedKatakana, 'k')}
            </div>

            <button onClick={() => setIsMenuOpen(false)} className="modal-close-button">
                Guardar y Cerrar
            </button>
        </div>
    );
  }, [selectedHiragana, selectedKatakana, toggleKanaSelection, toggleAll]);


  // Modal Component
  const KanaSelectionMenu = () => {
    return (
        <div className="modal-overlay" onClick={() => setIsMenuOpen(false)}>
            {KanaGridMemo}
        </div>
    );
  };


  // Rendering Logic based on Practice State
  return (
    <>
      {isMenuOpen && <KanaSelectionMenu />}

      {/* 1. SECCIÓN DE SELECCIÓN Y CONFIGURACIÓN */}
      {!isPracticing ? (
        <>
            <h1 className="main-title">Práctica de Kana (あア)</h1>

            <p className="instruction-text">
                Paso 1: Selecciona el modo y los caracteres.
                <span className="info-count"> ({practiceList.length} {practiceList.length === 1 ? 'carácter' : 'caracteres'} disponibles)</span>
            </p>

             <div className="mode-controls">
                <button 
                    onClick={() => setPracticeMode('hiragana')}
                    className={`mode-button ${practiceMode === 'hiragana' ? 'active-kana' : ''}`}
                >
                    Hiragana (あ)
                </button>
                <button 
                    onClick={() => setPracticeMode('katakana')}
                    className={`mode-button ${practiceMode === 'katakana' ? 'active-kana' : ''}`}
                >
                    Katakana (ア)
                </button>
                <button 
                    onClick={() => setPracticeMode('both')}
                    className={`mode-button ${practiceMode === 'both' ? 'active-kana' : ''}`}
                >
                    Ambos (あア)
                </button>
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="mode-button settings-button"
                    title="Seleccionar caracteres específicos"
                >
                    ⚙️ Caracteres
                </button>
            </div>
            
            <button 
                onClick={handleStartPractice}
                className="start-button"
                disabled={!isReadyToStart}
            >
                {isReadyToStart ? 'Comenzar Práctica' : 'Selecciona caracteres primero'}
            </button>
            
            <p className="feedback-message">{message}</p>
        </>
      ) : (
      
      /* 2. SESIÓN DE PRÁCTICA ACTIVA */
        <>
            <h1 className="main-title">Escribe el Romanji</h1>
            <p className="instruction-text">
                Carácter actual:
                <span className="info-count" style={{fontWeight: '700', color: currentKana ? 'var(--color-primary)' : '#888'}}>
                    {currentKana ? currentKana.kana : 'Esperando...'}
                </span>
            </p>
            
            {/* Character Display */}
            <div className={kanaDisplayClassName} key={currentKana?.kana || 'empty'}>
                {currentKana ? currentKana.kana : '—'}
            </div>

            {/* Input Field */}
            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Romanji aquí..."
                autoFocus 
                className={inputClassName}
                disabled={feedbackState === 'correct' || !currentKana} 
                ref={inputRef} // Input reference for focus
            />
            
            {/* Feedback */}
            <p className="feedback-message">{message}</p>
            
            {/* HINT SECTION */}
            {currentKana && feedbackState !== 'correct' && (
                <div className="hint-container">
                    <button 
                        onClick={toggleHintVisibility}
                        className="hint-button"
                    >
                        {isHintVisible ? 'Ocultar Pista' : 'Mostrar Pista'}
                    </button>
                    {isHintVisible && (
                        <span className="hint-tag">Pista: **{currentKana.romanji}**</span>
                    )}
                </div>
            )}
            
            <button 
                onClick={() => setIsPracticing(false)}
                className="start-button exit-button"
            >
                Finalizar Sesión
            </button>
        </>
      )}
    </>
  );
};

// =================================================================
// 4. KANJI SECTION COMPONENT (Placeholder)
// =================================================================

const KanjiPractice = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1 className="main-title" style={{border: 'none'}}>Práctica de Kanji (漢字)</h1>
            <p style={{fontSize: '1.1rem', color: '#555', marginBottom: '30px'}}>
                ¡Bienvenido a la sección de Kanji!
            </p>
            <div style={{ border: '2px solid #CC3333', padding: '30px', borderRadius: '15px', backgroundColor: '#FFF0F0' }}>
                <p style={{fontWeight: '700', fontSize: '1.2rem', color: '#CC3333'}}>🚧 En Desarrollo 🚧</p>
                <p>Aquí se incluirán niveles de Kanji, desde los más básicos (N5) hasta los más complejos.</p>
                <p>Por ahora, puedes regresar a la sección de Kana para practicar.</p>
            </div>
        </div>
    );
};

// =================================================================
// 5. WORDS SECTION COMPONENT (Placeholder)
// =================================================================

const WordsPractice = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1 className="main-title" style={{border: 'none'}}>Práctica de Vocabulario (言葉)</h1>
            <p style={{fontSize: '1.1rem', color: '#555', marginBottom: '30px'}}>
                ¡Bienvenido a la sección de Palabras!
            </p>
            <div style={{ border: '2px solid #CC3333', padding: '30px', borderRadius: '15px', backgroundColor: '#FFF0F0' }}>
                <p style={{fontWeight: '700', fontSize: '1.2rem', color: '#CC3333'}}>🚧 En Desarrollo 🚧</p>
                <p>Aquí practicarás vocabulario con Kana y Kanji, enfocándote en la lectura y el significado.</p>
                <p>Por ahora, puedes regresar a la sección de Kana para practicar.</p>
            </div>
        </div>
    );
};


// =================================================================
// 6. MAIN APP COMPONENT (Navegación y Estilos)
// =================================================================

type Section = 'kana' | 'kanji' | 'words';

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('kana');
  const [kanaCount, setKanaCount] = useState(0); // Para mostrar el conteo en la barra de navegación

  const renderSection = () => {
    switch (currentSection) {
      case 'kana':
        // Pasa la función para actualizar el conteo de caracteres disponibles
        return <KanaPractice onUpdateCount={setKanaCount} />;
      case 'kanji':
        return <KanjiPractice />;
      case 'words':
        return <WordsPractice />;
      default:
        return <KanaPractice onUpdateCount={setKanaCount} />;
    }
  };

  return (
    // Inyecta los estilos CSS definidos al inicio
    <>


      <div className="app-container">
        
        {/* Barra de Navegación Superior */}
        <nav className="nav-bar">
            <button 
                className={`nav-button ${currentSection === 'kana' ? 'active' : ''}`}
                onClick={() => setCurrentSection('kana')}
            >
                Kana (あア) {currentSection === 'kana' && kanaCount > 0 && `(${kanaCount})`}
            </button>
            <button 
                className={`nav-button ${currentSection === 'kanji' ? 'active' : ''}`}
                onClick={() => setCurrentSection('kanji')}
            >
                Kanji (漢)
            </button>
            <button 
                className={`nav-button ${currentSection === 'words' ? 'active' : ''}`}
                onClick={() => setCurrentSection('words')}
            >
                Palabras (語)
            </button>
        </nav>

        {/* Contenido de la Sección Activa */}
        {renderSection()}

      </div>
    </>
  );
}

export default App;