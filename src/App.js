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
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ display: 'flex', flexDirection: 'column', margin: '20px 20px 20px 20px' }}>
        <div style={{ marginBottom: '25px', marginTop: '10px' }}>
          <label>Имя: </label>
          <input
            style={{ marginLeft: '5px', width: '80%'}}
            type='text'
            placeholder='Вася Пупкин'
            value={nameTyped}
            onChange={(e) => {setNameTyped(e.target.value)}}
          />
        </div>

        <ExcelToJson
          handleNewQuize={setQuiz}
          count={count}
          handleCountChange={setCount}
        />
        <button style={{ marginTop: '40px', marginBottom: '10px' }} onClick={() => window.location.reload()}>Перезапустить тест</button>
        <button onClick={() => setReload(!reload)}>Перепройти тест</button>
      </div>
      {quizData && <div>
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
          <div style={{ margin: '50px 20px 20px 20px', }}>
            Скачать результаты
          </div>
        }
      </div>}
    </div>
  );
}

export default App;
