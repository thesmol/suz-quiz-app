import React, { useState } from 'react';
import Quiz from 'react-quiz-component';
import './App.css';
import ExcelToJson from './components/ExcelToJson';
import Instruction from './components/Instruction';
//import ManualDataInsert from './components/ManualDataInsert';
import * as XLSX from 'xlsx';
import { instractionText } from "./instructionText"

function App() {
  const [reload, setReload] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [count, setCount] = useState(10);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [nameTyped, setNameTyped] = useState('');
  const [grade, setGrade] = useState(null);

  const getResult = (obj) => {
    setQuizComplete(true);
    setQuizResult(obj);

    // Преобразуем строки в числа
    let totalPoints = parseInt(obj.totalPoints);
    let correctPoints = parseInt(obj.correctPoints);

    // Вычисляем процент правильных ответов
    let percentage = (correctPoints / totalPoints) * 100;

    // Присваиваем оценку на основе процента
    let grade;
    switch (true) {
      case (percentage >= 80):
        grade = 5;
        break;
      case (percentage >= 60):
        grade = 4;
        break;
      case (percentage >= 40):
        grade = 3;
        break;
      case (percentage >= 20):
        grade = 2;
        break;
      default:
        grade = 1;
    }
    setGrade(grade);

    let h2Elements = document.getElementsByTagName('h2');
    if (h2Elements.length > 1 && !h2Elements[1].textContent.includes('Оценка:')) {
      h2Elements[1].textContent += ` Оценка: ${grade}`;
    }
  }

  const handleReload = () => {
    setReload(prevState => !prevState);
    setQuizResult(null);
    setQuizComplete(false);
    setGrade(null);
  }

  const handleCountChange = (e) => {
    setCount(e.target.value);
    handleReload();
    let numberOfQs = { "nrOfQuestions": null };
    numberOfQs["nrOfQuestions"] = String(e.target.value);

    if (quiz !== null) {
      setQuiz(prevState => ({ ...prevState, ...numberOfQs }));
    }
  }

  const handleDataDownloadXLSX = () => {
    if (!nameTyped) {
      alert('Заполните поле имени, перед тем как скачать результат');
      return;
    }

    let data = [
      { 'Заголовок': 'Имя прошедшего тест', 'Значение': nameTyped },
      { 'Заголовок': 'Количество правильных ответов', 'Значение': quizResult.numberOfCorrectAnswers },
      { 'Заголовок': 'Количество ошибочных ответов', 'Значение': quizResult.numberOfIncorrectAnswers },
      { 'Заголовок': 'Количество вопросов', 'Значение': quizResult.numberOfQuestions },
      { 'Заголовок': 'Всего очков', 'Значение': quizResult.totalPoints },
      { 'Заголовок': 'Полученные очки', 'Значение': quizResult.correctPoints },
      { 'Заголовок': 'Оценка', 'Значение': grade }
    ];

    quizResult.questions.forEach((question, index) => {
      data.push({ 'Заголовок': `Вопрос ${index + 1}`, 'Значение': question.question });
      question.answers.forEach((answer, answerIndex) => {
        data.push({ 'Заголовок': `Вариант ответа ${answerIndex + 1}`, 'Значение': answer });
      })
      data.push({ 'Заголовок': 'Правильный ответ', 'Значение': question.correctAnswer });
      data.push({ 'Заголовок': 'Выбранный ответ', 'Значение': quizResult.userInput[index] });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");
    XLSX.writeFile(workbook, 'quiz_results.xlsx');
  }

  let quizData = null;

  if (quiz !== null) {
    quizData = quiz;
  }

  const styles = {
    button: 'button',
    conteiner: 'container',
    input: 'input',
    danger: 'danger'
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', flexDirection: 'column', margin: '20px', minWidth: '37vw' }} id="first-column">
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

        <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: "10px" }}>Количество вопросов в тесте</label>
            <input
              className='input'
              style={{ width: '50px' }}
              type="number"
              value={count}
              onChange={handleCountChange}
              min="1"
            />
          </div>
          <span style={{ fontSize: '12px', marginBottom: '10px' }}>*укажите количество вопросов перед загрузкой вопросов</span>
        </div>

        <div className="container" style={{ display: 'flex', flexDirection: 'column' }}>
          <ExcelToJson
            handleNewQuize={setQuiz}
            count={count}
            handleReload={handleReload}
            handleNewTry={setQuizComplete}
            handleNewResult={setQuizResult}
          />
        </div>

        {/* <div className="container" style={{ display: 'none', flexDirection: 'column' }}>
          <ManualDataInsert
            styles={styles}
            handleNewQuiz={setQuiz}
          />
        </div> */}

        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: '15px', width: '200px' }}>
            <Instruction styles={styles} instractionText={instractionText} />
          </div>
          <button className="button" style={{ marginBottom: '15px', width: '200px' }} onClick={() => window.location.reload()}>Перезапустить тест</button>
          <button className="button" style={{ width: '200px' }} onClick={() => handleReload()}>Перепройти тест</button>
        </div>

      </div>
      {quizData && <div security={{ display: 'flex', flexDirection: 'column' }}>
        <Quiz
          key={reload}
          quiz={quizData}
          shuffle={true}
          shuffleAnswer={true}
          showInstantFeedback={true}
          disableSynopsis={true}
          onComplete={getResult}
          showDefaultResult={true}
        />

        {quizComplete &&
          <button className='button' onClick={() => handleDataDownloadXLSX()} style={{ marginLeft: '20px', marginBottom: '50px', width: '200px' }}>
            Скачать результаты
          </button>
        }
      </div>}
      <div style={{ width: '100%' }} id="fix" />
    </div>
  );
}

export default App;
