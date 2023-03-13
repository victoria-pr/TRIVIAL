let nombre = sessionStorage.getItem("username");
document.getElementById("user").innerText = nombre;

//Objeto que contiene 3 variables con valores numericos (que equivalen a la posición de cada categoria en la API)
let categories={
  "history": 23,
  "ciencia": 17,
  "arte": 25
}

let questions =[]; // es un array donde metemos los datos que cogemos en la funcion getQuestions
let questionNumber =0;
let correctAnswer ="";
let correctAnswerNumber =0;
let category = 0;
let score = 0;
const numCategories = 3;
const numQuestions = 5;

function getQuestions(category){ ///category: se refiere a la category que se coge de la api.
  return new Promise((resolve,reject) =>{ //se realiza la petición fetch a la API de Trivial, especificando el número de preguntas (amount), la categoría (category), la dificultad (difficulty) y el tipo de respuesta (type).
    fetch("https://opentdb.com/api.php?amount=5&category="+ category +"&difficulty=easy&type=multiple")
    .then(response => response.json())
    .then(data => {
      questions.push(data.results); // metemos todos los datos(results) de las 5 preguntas en la variable questions declarada arriba. Lo hacemos con el push
        resolve();
  });
  } )
}

async function initiale(){ // La función initiale() es una función asíncrona que llama a la función getQuestions() tres veces, pasando como parámetro las categorías "history", "ciencia" y "arte".
      await getQuestions(categories.history);
      await getQuestions(categories.ciencia); // El uso de await asegura que cada llamada a getQuestions() se complete antes de continuar con la siguiente. 
      await getQuestions(categories.arte);
      console.log(questions); // la función imprime las preguntas (almacenadas en el array questions) en la consola
      document.getElementById("loading").innerHTML="";  //Indicamos que "pinte" las preguntas en la sección con id="loading" en el juego.html
      createQuestion(); //  llama a la función createQuestion().
}

function loading(){ //animación que llamaremos tras la función "initiale()" donde muestra una animación mientras se obtienen las preguntas de la API
  let animation = 
  `<section id="loading">\
        \<lottie-player src="https://lottie.host/673bb5a7-5f41-44ba-a2bc-be1e69f54070/ClprJW4x8y.json" background="transparent" speed="90" loop autoplay></lottie-player>\
    </section>`
 
document.getElementById("loading").innerHTML=animation; //indicamos dónde irá la animación en el html
}

function createQuestion(){ //encargada de mostrar la pregunta y las opciones de respuesta en la interfaz gráfica del usuario
    let question = questions[category][questionNumber]; // Obtiene la pregunta actual basada en la variable questionNumber y la categoría actual basada en la variable category.
    correctAnswer = question.correct_answer;      // Obtiene la respuesta correcta de la pregunta y la almacena en la variable correctAnswer.
    console.log(question);
    document.getElementById("question").innerText = question.question; /*Muestra la pregunta en el elemento HTML con el id "question". Cada objeto question contiene varias propiedades, 
    incluyendo la pregunta en sí (question.question) y las opciones de respuesta (question.incorrect_answers y question.correct_answer).*/
    let answers = question.incorrect_answers; // Obtiene las respuestas incorrectas de la pregunta y las almacena en la variable answers
    answers.unshift(question.correct_answer); // Luego agrega la respuesta correcta a la matriz answers en la primera posición mediante el método unshift().
    createAnswerButtons(answers);
    AddListenerToAnswer ();
}


// seleccionar todas las respuestas

function AddListenerToAnswer (){
  
  let answerButtons= document.getElementsByClassName("answer");
  answerButtons = [...answerButtons];
  answerButtons.forEach((answer) => {
    console.log(answer);
    answer.addEventListener("click", (event) => { 
      clickAnswer(event);
    });
  })
}

function clickAnswer(event){
  let selectedAnswer = event.target.innerText; //event.target se refiere al elemento HTML que fue clickeado. innerText se utiliza para obtener el contenido de texto. En este caso, la respuesta seleccionada por el usuario.
  if (selectedAnswer === correctAnswer){
    score +=12;
    console.log(score);
    document.getElementById("score").innerText = score; // pongo en pantalla el score
    console.log("¡Respuesta correcta! suma puntos");
  } else {
    score -=3;
    document.getElementById("score").innerText = score;
    console.log("fallaste te resta puntos");
  }
  nextTurn();
  sessionStorage.setItem("score", score) //ponemos el "Setter" aquí para coger el valor del score después

}
function nextTurn (){
  category ++;
  if(category === numCategories){
    category= 0;
    questionNumber ++;
  }
    if(questionNumber === numQuestions){
         window.location.href="gameover.html";
        return;
    }
  createQuestion();

}

// obtiene el elemento del DOM con el id "choices" y lo asigna a la variable "opction". Esto se hace para poder agregar un listener a este elemento más tarde, y para poder agregar opciones de respuesta dentro de este elemento.
  

function createAnswerButtons (answers){
  shuffle(answers); // reordena aleatoriamente las opciones de respuesta.
  document.getElementById("choices").innerHTML ="";
    answers.forEach(answer => { //para recorrer cada una de las respuestas 
        let h2 = document.createElement("h2"); // se crea un elemento h2 para cada una de ellas
        h2.innerText = answer; // Luego se establece el texto de cada elemento h2 con la respuesta correspondiente 
        h2.classList.add("answer");
        document.getElementById("choices").appendChild(h2); //se añade el elemento h2 al contenedor con id choices, que es donde se muestran las opciones de respuesta al usuario.
    });
  }
// Desordenar aleatoriamente las respuestas
function shuffle(array) { 
    for (let i = array.length -1; i > 0; i--) { //  recorre el array de atrás hacia adelante.
      const j = Math.floor(Math.random() * (i + 1)); // genera un número aleatorio entre 0 y (i+1) y lo almacena en la variable j. Por lo tanto, el resultado es un número entero aleatorio entre 0 y i (ambos incluidos).
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }

initiale(); //inicia la ejecución del juego.
loading();





    
