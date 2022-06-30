const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
let answerWord;
let wordSection = $('.game__word');
let restChance = $('.chance__rest');

document.addEventListener('keypress', (event) => {
  const alphabet = String.fromCharCode(event.keyCode).toUpperCase();

  if (answerWord.indexOf(alphabet) > -1 && restChance.innerHTML === 0) {
    //게임종료
  } else {
    const currentWord = wordSection.innerHTML.split(' ').filter((alphabet) => alphabet !== '');
    wordSection.innerHTML = '';
    answerWord.forEach((answerAlphabet, idx) => {
      if (currentWord[idx] !== '_') wordSection.innerHTML += ` ${currentWord[idx]} `;
      else if (answerAlphabet === alphabet) wordSection.innerHTML += ` ${alphabet} `;
      else wordSection.innerHTML += ' _ ';
    });
    restChance.innerHTML = parseInt(restChance.innerHTML) - 1;
    updateKingmanImg();
  }
});
const updateKingmanImg = () => {
  //../public/assets//0.png
  $('.game__kingman').src = `../public/assets/${restChance.innerHTML}.png`;
};
// 단어 받아오기
const getWord = async () => {
  const response = await fetch('http://puzzle.mead.io/puzzle?wordCount=1');
  if (response.status === 200) {
    const data = await response.json();
    return data.puzzle.toUpperCase().split('');
  } else {
    throw new Error('unable to get puzzle');
  }
};
// 단어 길이 예외
const isWordLength = (word) => {
  return word.length !== 8 ? true : false;
};

const attachEvent = (gameButton) => {
  gameButton.addEventListener('click', initGame);
};
// 게임 시작 / 재시작
const initGame = async () => {
  answerWord = await getWord();

  while (isWordLength(answerWord)) {
    answerWord = await getWord();
  }
  restChance.innerHTML = answerWord.length + 3;
  updateKingmanImg();
  console.log(answerWord);
};
window.onload = () => {
  initGame();
  attachEvent($('.game__button'));
};
