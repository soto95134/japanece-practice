import { useState, useMemo, useCallback, useEffect, type ChangeEvent, useRef} from 'react';
import './App.css'
import { hiragana, katakana, type KanaCharacter } from './kanaData';
// Definición de tipos
type PracticeMode = 'hiragana' | 'katakana' | 'both';

function App() {
  // ⭐️ Referencia para mantener el foco en el input (solución al pestañeo de la barra)
  const inputRef = useRef<HTMLInputElement>(null);

  // Estados del Juego
  const [userInput, setUserInput] = useState<string>(''); 
  const [currentKana, setCurrentKana] = useState<KanaCharacter | null>(null); 
  const [message, setMessage] = useState<string>('');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('hiragana'); 
  const [feedbackState, setFeedbackState] = useState<'default' | 'correct' | 'incorrect'>('default');
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  
  // Estado para el Menú de Selección
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedHiragana, setSelectedHiragana] = useState<string[]>(hiragana.map(k => k.kana));
  const [selectedKatakana, setSelectedKatakana] = useState<string[]>([]); // Por defecto, Katakana no seleccionado inicialmente

  // Lógica para la Lista de Práctica (Filtra por Modo y Selecciones Específicas)
  const practiceList: KanaCharacter[] = useMemo(() => {
    let list: KanaCharacter[] = [];

    const includeHiragana = practiceMode === 'hiragana' || practiceMode === 'both';
    const includeKatakana = practiceMode === 'katakana' || practiceMode === 'both';

    if (includeHiragana) {
        // Filtra Hiragana por los caracteres seleccionados
        list.push(...hiragana.filter(k => selectedHiragana.includes(k.kana)));
    }

    if (includeKatakana) {
        // Filtra Katakana por los caracteres seleccionados
        list.push(...katakana.filter(k => selectedKatakana.includes(k.kana)));
    }
    
    return list;
  }, [practiceMode, selectedHiragana, selectedKatakana]);

  // Función para seleccionar un nuevo carácter
  const selectRandomKana = useCallback(() => {
    if (practiceList.length === 0) {
        setCurrentKana(null);
        setMessage('¡Selecciona al menos un carácter para empezar!');
        setUserInput('');
        setFeedbackState('default'); 
        setIsHintVisible(false);
        return;
    } 

    const randomIndex = Math.floor(Math.random() * practiceList.length);
    setCurrentKana(practiceList[randomIndex]);
    setUserInput('');
    setMessage('');
    setFeedbackState('default'); // Reinicia el estado visual
    setIsHintVisible(false); // Reinicia el estado de la pista
  }, [practiceList]); // Depende de practiceList para reejecutarse si la lista cambia

  // Reiniciar al Cambiar el Modo o Selecciones
  useEffect(() => {
    selectRandomKana();
  }, [practiceList, selectRandomKana]);

  // Manejador de la entrada del teclado
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setUserInput(value);

    if (!currentKana) return; 

    if (value === currentKana.romanji) {
      // ✅ Respuesta Correcta
      setMessage('✅ ¡Correcto!');
      setFeedbackState('correct'); // Estado Correcto para animación
      
      // ⭐️ FIX: Asegurar que la función de foco se llama después del re-render
      setTimeout(() => {
        selectRandomKana();
        // Intentar mantener el foco en el input
        if (inputRef.current) {
            inputRef.current.focus();
        }
      }, 500); 

    } else if (currentKana.romanji.startsWith(value)) {
      // ⏳ Entrada Incompleta
      setMessage('...Escribe el resto...');
      setFeedbackState('default');
    } else {
      // ❌ Respuesta Incorrecta
      setMessage('❌ Inténtalo de nuevo.');
      setFeedbackState('incorrect'); // Estado Incorrecto para animación
    }
  };
    
  // Función para mostrar/ocultar la pista
  const toggleHintVisibility = useCallback(() => {
      setIsHintVisible(prev => !prev);
  }, []);

  // Handlers del Menú de Selección
  const toggleKanaSelection = useCallback((kana: string, type: 'h' | 'k') => {
    if (type === 'h') {
        // Al usar la actualización funcional, la función toggleKanaSelection es estable (useCallback)
        setSelectedHiragana(prev => 
            prev.includes(kana) ? prev.filter(k => k !== kana) : [...prev, kana]
        );
    } else {
        setSelectedKatakana(prev => 
            prev.includes(kana) ? prev.filter(k => k !== kana) : [...prev, kana]
        );
    }
  }, []);

  // Seleccionar/Deseleccionar Todos
  const toggleAll = (type: 'h' | 'k', select: boolean) => {
    if (type === 'h') {
        setSelectedHiragana(select ? hiragana.map(k => k.kana) : []);
    } else {
        setSelectedKatakana(select ? katakana.map(k => k.kana) : []);
    }
  };


  // Determina la clase del input y del kana display basada en el estado de feedback
  const inputClassName = `text-input ${feedbackState}`;
  const kanaDisplayClassName = `kana-display ${feedbackState}`;
  
  // ⭐️ FIX/Mejora para Modal: Estabilizar el contenido del modal
  // Definimos el contenido de la grilla como un componente memoizado (useMemo) 
  // para reducir el trabajo de renderizado de React en cada click de selección.
  const KanaGridMemo = useMemo(() => {
    const renderKanaGrid = (data: KanaCharacter[], selected: string[], type: 'h' | 'k') => (
      <div className="kana-grid">
          {data.map(k => (
              <button
                  key={k.kana}
                  className={`kana-select-button ${selected.includes(k.kana) ? 'selected' : ''}`}
                  // Se usa la función estable de toggleKanaSelection
                  onClick={() => toggleKanaSelection(k.kana, type)} 
                  title={k.romanji}
              >
                  {k.kana}
              </button>
          ))}
      </div>
    );

    return (
        <div className="selection-menu-content" onClick={e => e.stopPropagation()}>
            <h2 className="menu-title">Configuración de Caracteres</h2>
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

            <button onClick={() => setIsMenuOpen(false)} className="close-menu-button">
                Guardar y Cerrar
            </button>
        </div>
    );
    // El memo se actualizará solo cuando las listas de selección o los handlers estables cambien.
  }, [selectedHiragana, selectedKatakana, toggleKanaSelection, toggleAll, setIsMenuOpen]);


  // Renderizado del Modal de Selección
  const KanaSelectionMenu = () => {
    return (
        <div className="modal-overlay" onClick={() => setIsMenuOpen(false)}>
            {KanaGridMemo}
        </div>
    );
  };


  // Renderizado Principal
  return (
    <>
      {/* 3. ESTILOS CSS - Integrados */}

      {isMenuOpen && <KanaSelectionMenu />}

      <div className="app-container">
        <h1 className="main-title">Escribe en Japonés 🍣</h1>

        {/* Controles para el Modo de Práctica */}
        <div className="mode-controls">
          <button 
            onClick={() => setPracticeMode('hiragana')}
            className={`mode-button ${practiceMode === 'hiragana' ? 'active' : ''}`}
          >
            Hiragana (あ)
          </button>
          <button 
            onClick={() => setPracticeMode('katakana')}
            className={`mode-button ${practiceMode === 'katakana' ? 'active' : ''}`}
          >
            Katakana (ア)
          </button>
          <button 
            onClick={() => setPracticeMode('both')}
            className={`mode-button ${practiceMode === 'both' ? 'active' : ''}`}
          >
            Ambos (あア)
          </button>
          {/* Botón para abrir el menú de selección */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="mode-button settings-button"
            title="Seleccionar caracteres específicos"
          >
            ⚙️ Caracteres
          </button>
        </div>

        <p className="instruction-text">
            Escribe el Romanji para el siguiente carácter:
            <span className="info-count"> ({practiceList.length} {practiceList.length === 1 ? 'carácter' : 'caracteres'} seleccionados)</span>
        </p>
        
        {/* Carácter a Practicar o Mensaje de Error */}
        <div className={kanaDisplayClassName} key={currentKana?.kana || 'empty'}>
            {currentKana ? currentKana.kana : '—'}
        </div>

        {/* Campo de Entrada */}
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Romanji aquí..."
          autoFocus 
          className={inputClassName}
          disabled={feedbackState === 'correct' || !currentKana} // Deshabilita si no hay kana
          ref={inputRef} // ⭐️ Referencia del input
        />

        {/* Retroalimentación */}
        <p className="feedback-message">{message}</p>
        
        {/* SECCIÓN DE PISTA */}
        {currentKana && (
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
      </div>
    </>
  );
}

export default App;
