import { useState, useMemo, useCallback, useEffect, type ChangeEvent } from 'react';
import './App.css'
import { hiragana, katakana, type KanaCharacter } from './kanaData';

type PracticeMode = 'hiragana' | 'katakana' | 'both';

function App() {
// 2. Estados del Juego con Tipado Explícito
  const [userInput, setUserInput] = useState<string>(''); 
  // currentKana puede ser KanaCharacter o null hasta que se seleccione uno
  const [currentKana, setCurrentKana] = useState<KanaCharacter | null>(null); 
  const [message, setMessage] = useState<string>('');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('hiragana'); 
  
  // 3. 🧠 Lógica para la Lista de Práctica (useMemo)
  const practiceList: KanaCharacter[] = useMemo(() => {
    if (practiceMode === 'katakana') {
      return katakana;
    } else if (practiceMode === 'both') {
      return [...hiragana, ...katakana];
    }
    return hiragana;
  }, [practiceMode]);

  // 4. Función para seleccionar un nuevo carácter (useCallback)
  const selectRandomKana = useCallback(() => {
    if (practiceList.length === 0) {
        setCurrentKana(null); // Asegura que el estado es nulo si la lista está vacía
        return;
    } 

    const randomIndex = Math.floor(Math.random() * practiceList.length);
    setCurrentKana(practiceList[randomIndex]);
    setUserInput('');
    setMessage('');
  }, [practiceList]);

  // 5. Reiniciar al Cambiar el Modo
  useEffect(() => {
    selectRandomKana();
  }, [practiceList, selectRandomKana]);

  // 6. Manejador de la entrada del teclado con tipado de evento
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setUserInput(value);

    // TypeScript exige la comprobación de nulidad para currentKana
    if (!currentKana) return; 

    if (value === currentKana.romanji) {
      // ✅ Respuesta Correcta
      setMessage('✅ ¡Correcto!');
      setTimeout(() => {
        selectRandomKana();
      }, 500); 
    } else if (currentKana.romanji.startsWith(value)) {
      // ⏳ Entrada Incompleta
      setMessage('...Escribe el resto...');
    } else {
      // ❌ Respuesta Incorrecta
      setMessage('❌ Inténtalo de nuevo.');
    }
  };

  // 7. Renderizado
  if (!currentKana) {
    return (
        <div className="app-container">
            <h1>Escribe en Japonés ⌨️</h1>
            <div className="mode-controls">
                <button onClick={() => setPracticeMode('hiragana')} className={practiceMode === 'hiragana' ? 'active' : ''}>Hiragana (あ)</button>
                <button onClick={() => setPracticeMode('katakana')} className={practiceMode === 'katakana' ? 'active' : ''}>Katakana (ア)</button>
                <button onClick={() => setPracticeMode('both')} className={practiceMode === 'both' ? 'active' : ''}>Ambos (あア)</button>
            </div>
            {practiceList.length === 0 && <p>Cargando datos. Asegúrate de que `kanaData.ts` está completo.</p>}
        </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Escribe en Japonés ⌨️</h1>

      {/* Controles para el Modo de Práctica */}
      <div className="mode-controls">
        <button 
          onClick={() => setPracticeMode('hiragana')}
          className={practiceMode === 'hiragana' ? 'active' : ''}
        >
          Hiragana (あ)
        </button>
        <button 
          onClick={() => setPracticeMode('katakana')}
          className={practiceMode === 'katakana' ? 'active' : ''}
        >
          Katakana (ア)
        </button>
        <button 
          onClick={() => setPracticeMode('both')}
          className={practiceMode === 'both' ? 'active' : ''}
        >
          Ambos (あア)
        </button>
      </div>

      <p>Escribe el Romanji para el siguiente carácter:</p>

      {/* Carácter a Practicar */}
      <div className="kana-display">
        {currentKana.kana}
      </div>

      {/* Campo de Entrada */}
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Escribe aquí el Romanji"
        autoFocus 
        className="text-input"
      />

      {/* Retroalimentación */}
      <p className="feedback-message">{message}</p>
      <p className="hint">Pista: **{currentKana.romanji}**</p>
    </div>
  );
}

export default App;