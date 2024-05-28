const questionDB = [
    {
        question:"Jules Rimet Trophy is related to which of the following sports?",
        op1: "Hockey",
        op2: "Cricket",
        op3: "Football",
        op4: "Volley ball",
        ans:"op3"
    },
    {
        question:"Which has been the most successful team in the Women's Hockey World Cup?",
        op1:"Netherlands",
        op2:"Pakistan",
        op3:"India",
        op4:"Germany" ,
        ans:"op1" 
    },
    {
        question:"Where were the first Women’s World Chess Championships held?",
        op1:"England",
        op2:"Germany",
        op3:"USA",
        op4:"Poland" ,
        ans:"op1" 
    },
    {
        question:"The name of S Vijayalakshmi is famous in which among the following games / sports?",
        op1:"Badminton",
        op2:"Table Tennis",
        op3:"chess",
        op4:"Hockey" ,
        ans:"op3" 
    },
    {
        question:"Electronics and IT Ministry is to collaborate with which company to set up a Quantum Computing Applications Lab?",
        op1:"Hockey",
        op2:"Cricket",
        op3:"Football",
        op4:"Volley Ball" ,
        ans:"op3" 
    }
     
]


const question = document.querySelector('.question');
const option1 = document.querySelector('#ans1');
const option2 = document.querySelector('#ans2');
const option3 = document.querySelector('#ans3');
const option4 = document.querySelector('#ans4');
const submit = document.querySelector('#submit');
const showScore = document.querySelector('#showScore')

const answers = document.querySelectorAll('.options');

let question_Number = 0;
let score = 0;
let miss = 0;

const loadQuestion = () =>{
    const questionList = questionDB[question_Number];
    question.innerHTML = questionList.question;
    option1.innerHTML = questionList.op1;
    option2.innerHTML = questionList.op2;
    option3.innerHTML = questionList.op3;
    option4.innerHTML = questionList.op4;

}

const clearPage = () =>{
    const inner = document.getElementById('qportion')
    inner.style.display = 'none';
}

loadQuestion();
// question_Number++;

const selectOption = (opID) => {
    answers.forEach((currAns) => {
        if(currAns.id === opID){
            currAns.checked = true;
        }
    })
    return;
}

const deselectOptions = () =>{
    answers.forEach((currAns) => currAns.checked = false);
}

const getCheckedAnswer = () => {
    let answer;
    answers.forEach((currAns) => {
        if(currAns.checked){
            answer = currAns.id;
        }
    })
    return answer;
}

//--------Submit Button ------------//

submit.addEventListener('click', () => {
    const checkedAnswer = getCheckedAnswer();
    console.log(checkedAnswer);
    if(checkedAnswer === questionDB[question_Number].ans){
        score = score+5;
    }else{
        miss++;
    }
    question_Number++;
    deselectOptions();
    if(question_Number<questionDB.length){
        loadQuestion();
    }else{
        clearPage();
        showScore.innerHTML = `
        <h3> You have Scored ${score}/${questionDB.length*5} </h3>
        <button class = "btn" onclick = "location.reload()">Play Again</button<
        `
    }
});
//-----------------------------------------------------//


const nextQuestion = () =>{
    const checkedAnswer = getCheckedAnswer();
    console.log(checkedAnswer);
    if(checkedAnswer === questionDB[question_Number].ans){
        score = score+5;
    }else{
        miss++;
    }
    question_Number++;
    deselectOptions();
    if(question_Number<questionDB.length){
        loadQuestion();
    }else{
        clearPage();
        showScore.innerHTML = `
        <h3> You have Scored ${score}/${questionDB.length*5} </h3>
        <button class = "btn" onclick = "location.reload()">Play Again</button<
        `
    }
}

// -------------------- alan commands -----------------//

// alan.alanButton()

var alanBtnInstance = alanBtn({
    key: "d0989f4461df59704c52e2c3181850e02e956eca572e1d8b807a3e2338fdd0dc/stage",
    onCommand: function (commandData) {
      if (commandData.command === "go:back") {
        //call client code that will react on the received command
      }
    },
    onCommand: (commandData) =>{
        if(commandData.command === "select option one"){
            let opId = "op1";
            selectOption(opId);
        }
        if(commandData.command === "select option two"){
            let opId = "op2";
            selectOption(opId);
        }
        if(commandData.command === "select option three"){
            let opId = "op3";
            selectOption(opId);
        }
        if(commandData.command === "select option four"){
            let opId = "op4";
            selectOption(opId);
        }
        if(commandData.command === 'next question'){
            nextQuestion();
        }
    },
    rootEl: document.getElementById("alan-btn"),
  });