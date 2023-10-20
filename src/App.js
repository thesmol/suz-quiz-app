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
    setQuizComplete(true);
    setQuizResult(obj);
  }

  const handleDataDownload = () => {
    if (!nameTyped) {
      alert('Заполните поле имени, перед тем как скачать результат');
      return;
    }

    let resultText = `Имя прошедшего тест: ${nameTyped}\n`
    resultText += `Количество правильных ответов: ${quizResult.numberOfCorrectAnswers}\n`;
    resultText += `Количество ошибочных ответов: ${quizResult.numberOfIncorrectAnswers}\n`;
    resultText += `Количество вопросов: ${quizResult.numberOfQuestions}\n`;
    resultText += `Всего очков: ${quizResult.totalPoints}\n`;
    resultText += `Полученные очки: ${quizResult.correctPoints}\n\n`;

    quizResult.questions.forEach((question, index) => {
      resultText += `Вопрос ${index + 1}: ${question.question}\n`;
      resultText += `Варианты ответов:\n`;
      question.answers.forEach((answer, answerIndex) => {
        resultText += `   ${answerIndex + 1}) ${answer}\n`;
      })
      resultText += `Правильный ответ: ${question.correctAnswer}\n`;
      resultText += `Выбранный ответ: ${quizResult.userInput[index]}\n\n`;
    });

    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'quiz_results.txt';
    link.click();

    // The URL.revokeObjectURL() static method releases an existing object URL which was previously created by calling URL.createObjectURL().
    // Let the browser know not to keep the reference to the file any longer.
    URL.revokeObjectURL(url);
  };

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
          handleReload={setReload}
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
          <button className='button' onClick={() => handleDataDownload()} style={{ marginLeft: '20px', marginBottom: '50px', width: '200px' }}>
            Скачать результаты
          </button>
        }
      </div>}
      <div style={{ width: '100%'}} />
    </div>
  );
}

export default App;
