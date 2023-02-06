import S from './styles.module.scss';
import React, { useState, useCallback } from 'react';
import Sticker from '@components/Sticker';

export interface NoteData {
  id: string;
  text: string;
  color: string;
  width: number;
  height: number;
  top: number;
  left: number;
}

const newNote = (): NoteData => {
  const letters = '6789AB';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 6)];
  }
  return {
    id: Math.random().toString(16).slice(2),
    text: 'Click to change text',
    color,
    width: 200,
    height: 200,
    top: 40,
    left: 0,
  };
};

const App = () => {
  const [notes, setNotes] = useState<NoteData[]>([]);

  const handleAdd = useCallback(() => {
    setNotes((prevState) => [...prevState, newNote()]);
  }, []);

  const updateLocation = (id: string, top: number, left: number) => {
    let targetNote = notes.find((note) => note.id === id);
    setNotes((prevState) => {
      return targetNote
        ? [
            ...prevState.filter((item) => item.id !== id),
            { ...targetNote, top, left },
          ]
        : prevState;
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <button onClick={handleAdd}>Add note</button>
      <div onDragOver={handleDragOver} className={S.container}>
        {notes?.map((note) => (
          <Sticker
            key={note.id}
            noteData={note}
            updateLocation={updateLocation}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
