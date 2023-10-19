import React, { useState } from 'react';
import Quiz from 'react-quiz-component';
import './App.css';
import ExcelToJson from './components/ExcelToJson';

function App() {
  const [reload, setReload] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [count, setCount] = useState(1);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [nameTyped, setNameTyped] = useState('');


  const getResult = (obj) => {
    console.log(obj);
    setQuizComplete(true);
    setQuizResult(obj);
  }

  let quizData = null;

  if (quiz !== null) {
    quizData = quiz;
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', flexDirection: 'column', margin: '20px' }} id="first-column">
        <div className="container">
          <label>Имя: </label>
          <input
            className='input'
            style={{ marginLeft: '5px' }}
            type='text'
            placeholder='Вася Пупкин'
            value={nameTyped}
            onChange={(e) => { setNameTyped(e.target.value) }}
          />
        </div>

        <ExcelToJson
          handleNewQuize={setQuiz}
          count={count}
          handleCountChange={setCount}
        />

        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button className="button" style={{ marginBottom: '15px', width: '200px' }} onClick={() => window.location.reload()}>Перезапустить тест</button>
          <button className="button" style={{ width: '200px' }} onClick={() => setReload(!reload)}>Перепройти тест</button>
        </div>

      </div>
      {quizData && <div security={{ display: 'flex', flexDirection: 'column' }}>
        <Quiz
          key={reload}
          quiz={quizData}
          shuffle={true}
          shuffleAnswer={true}
          showInstantFeedback={true}
          disableSynopsis={false}
          onComplete={getResult}
          showDefaultResult={true}
        />

        {quizComplete &&
          <button className='button' style={{ marginLeft: '20px', marginBottom: '50px', width: '200px' }}>
            Скачать результаты
          </button>
        }
      </div>}
    </div>
  );
}

export default App;
