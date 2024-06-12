//Variables para botones
let button,
  simular = false;
pausar = false;

// Variables para el canvas
let containerWidth = document.getElementById("p5-container").offsetWidth;
let containerHeight = document.getElementById("p5-container").offsetHeight;
//Variables de constantes para el sistema
let bandera = 0,
banderaB = 0,
  paso = 0,
  Periodo,
  Frecuencia;

//Variables para los sliders
let sliderMasa, sliderDisco, sliderAngulo, sliderL, sliderK, sliderVelocidad;

//Variables de cambio (sliders)
let valorMasa, valorElastica, valorAngulo, valorRadio, valorLongitudC;

//Variables para los sliders del segundo pendulo
let sliderMasaB,
  sliderDiscoB,
  sliderAnguloB;

//Variables de cambio (sliders) del segundo pendulo
let valorMasaB, valorAnguloB, valorRadioB;

//Variables para indicar la posición de los datos
let widthX = screen.width,
  widthY = screen.height,
  positionSliderX = 1000,
  positionTextX = positionSliderX - 200;

//Variables para: Pendulo y resorte
let angle = valorAngulo,
  anguloTemp = 0,
  posicion,
  puntoOrigen,
  anchor;

//Variables Segundo pendulo
let angleB = valorAnguloB, 
  anguloTempB = 0,
  posicionB,
  puntoOrigenB,
  anchorB;

//Variables utilizadas en los calculos
let W0_1 = 0,
  W0_2 = 0,
  W0_1B = 0,
  W0_2B = 0,
  Inercia = 0,
  InerciaB = 0,
  cuerda = 0,
  RadioNuevo = 0,
  RadioNuevoB = 0,
  A_1 = 0,
  A_2 = 0,
  B_1 = 0,
  B_2 = 0,
  t = 0;

// Variables para comparar y sacar los modos de vibracion correspondientes
let anguloA, anguloB;

//Variables de tiempo para graficas
let tX = 0,
  tV = 0,
  tA = 0;
var cnt1 = 0,
  cnt2 = 0,
  cnt3 = 0;

//Variable para simular la gravedad
let gravity = 9.8;

//Funcion propia de P5 para poder dibujar constantemente lo que se necesita
function draw() {
  informacion();
  if (simular && !pausar) {
    clear(); // Verifica si la simulación está pausada
    obtenerValores();
    simularCaso();
  }
}

//Funcion para predefinir la configuración del sistema
function setup() {
  //Se crea el canvas
  let canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent("p5-container");
  initControles(); //Botones


  //Pendulo 1
  puntoOrigen = createVector(200, 30);
  posicion = createVector(-140, 156);

  //Pendulo 2
  puntoOrigenB = createVector(400, 30);
  posicionB = createVector(-150, 156);

  //Partes de un resorte
  anchor = createVector(55, posicion.y);
  anchorB = createVector(55, posicionB.y);

  //iniciar valores Pendulo 1
  valorMasa = document.getElementById("sliderMasa").value;
  valorElastica = document.getElementById("sliderK").value;
  valorLongitudC = document.getElementById("sliderL").value;
  valorAngulo = document.getElementById("sliderAngulo").value;
  valorRadio = document.getElementById("sliderDisco").value;

  //iniciar valores Pendulo 2
  valorMasaB = document.getElementById("sliderMasaB").value;
  valorAnguloB = document.getElementById("sliderAnguloB").value;
  valorRadioB = document.getElementById("sliderDiscoB").value;

  // PENDULO 1 (A)
  document
    .getElementById("sliderMasa")
    .addEventListener("input", obtenerValores);
  document.getElementById("sliderK").addEventListener("input", obtenerValores);
  document.getElementById("sliderL").addEventListener("input", obtenerValores);
  document
    .getElementById("sliderAngulo")
    .addEventListener("input", obtenerValores);
  document
    .getElementById("sliderDisco")
    .addEventListener("input", obtenerValores);

  // PENDULO 2 (B)
  document
    .getElementById("sliderMasaB")
    .addEventListener("input", obtenerValores);
  document
    .getElementById("sliderAnguloB")
    .addEventListener("input", obtenerValores);
  document
    .getElementById("sliderDiscoB")
    .addEventListener("input", obtenerValores);
}

//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  // PENDULO 1 (A)
  valorMasa = document.getElementById("sliderMasa").value;
  valorElastica = document.getElementById("sliderK").value;
  valorLongitudC = document.getElementById("sliderL").value;
  valorAngulo = document.getElementById("sliderAngulo").value;
  valorRadio = document.getElementById("sliderDisco").value;

  // PENDULO 2 (B)
  valorMasaB = document.getElementById("sliderMasaB").value;
  valorAnguloB = document.getElementById("sliderAnguloB").value;
  valorRadioB = document.getElementById("sliderDiscoB").value;

  // PENDULO 1
  document.getElementById("masaInfo").innerText = +valorMasa;
  document.getElementById("sliderKValue").innerText = +valorElastica;
  document.getElementById("sliderLValue").innerText = +valorLongitudC;
  document.getElementById("sliderAnguloValue").innerText = +valorAngulo;
  document.getElementById("sliderDiscoValue").innerText = +valorRadio;

  // PENDULO 2
  document.getElementById("masaInfoB").innerText = +valorMasaB;
  document.getElementById("sliderAnguloValueB").innerText = +valorAnguloB;
  document.getElementById("sliderDiscoValueB").innerText = +valorRadioB;
}

function obtenerValores() {
  // PENDULO 1
  valorMasa = parseFloat(document.getElementById("sliderMasa").value);
  valorElastica = parseFloat(document.getElementById("sliderK").value);
  valorLongitudC = parseFloat(document.getElementById("sliderL").value);
  valorAngulo = parseFloat(document.getElementById("sliderAngulo").value);
  valorRadio = parseFloat(document.getElementById("sliderDisco").value);
  angle = parseFloat(document.getElementById("sliderAngulo").value) / 10;

  // PENDULO 2
  valorMasaB = parseFloat(document.getElementById("sliderMasaB").value);
  valorAnguloB = parseFloat(document.getElementById("sliderAnguloB").value);
  valorRadioB = parseFloat(document.getElementById("sliderDiscoB").value);
  angleB = parseFloat(document.getElementById("sliderAnguloB").value) / 10;
}

//Funcion para simular el caso correspondiente
function simularCaso() {
  fill(38, 117, 241);
  stroke(0, 0, 0);
  rect(50, 10, 20, 500);
  rect(50, 10, 500, 20);
  pendulo();
  resorte();
}

function updateSliderValue(sliderId, displayId) {
  let slider = document.getElementById(sliderId);
  let display = document.getElementById(displayId);

  if (slider && display) {
    display.textContent = slider.value;
  }
}

//Funcion para mostrar los botones de simulación y reinicio
function initControles() {
  // Obtener los botones del DOM
  const simularButton = document.getElementById("simularButton");
  const reiniciarButton = document.getElementById("reiniciarButton");

  // Asignar funciones a los botones
  simularButton.addEventListener("click", () => {
    simular = true;
    pausar = false; // Asegúrate de que la simulación no esté pausada al iniciar
  });

  reiniciarButton.addEventListener("click", () => {
    if (!pausar) {
      // Verifica si la simulación está pausada
      pausar = true; // Cambia el estado de pausa
    }
  });
}

//Funcion para simular un pendulo y sus calculos
function pendulo() {
  //Calculando el vector posicion para el pendulo 1
  posicion.x =
    valorLongitudC * 100 * sin(angle * 10 * (Math.PI / 180)) + puntoOrigen.x;
  posicion.y =
    valorLongitudC * 100 * cos(angle * 10 * (Math.PI / 180)) + puntoOrigen.y;

  //Calculando el vector posicion para el pendulo 2
  posicionB.x =
    valorLongitudC * 100 * sin(angleB * 10 * (Math.PI / 180)) + puntoOrigenB.x;
  posicionB.y =
    valorLongitudC * 100 * cos(angleB * 10 * (Math.PI / 180)) + puntoOrigenB.y;

  if (simular) {
    cuerda = valorLongitudC;
    RadioNuevo = valorRadio;
    RadioNuevoB = valorRadioB;
    if (bandera < 1) {
      // Variables de angulos solo para comparar cuando sean
      // negativos o positivos
      anguloA = angle * 10 * (Math.PI / 180);
      anguloB = angleB * 10 * (Math.PI / 180);

      //Variables de angulos utilizados en los calculos
      anguloTemp = angle * 10 * (Math.PI / 180);
      anguloTempB = angleB * 10 * (Math.PI / 180);

      // Hallamos los cálculos correspondientes
      Inercia =
        (valorMasa * Math.pow(RadioNuevo, 2)) / 2 +
        valorMasa * Math.pow(cuerda + RadioNuevo, 2);
      InerciaB = 
        (valorMasaB * Math.pow(RadioNuevoB, 2)) / 2 +
        valorMasaB * Math.pow(cuerda + RadioNuevoB, 2);
      
      // Valores de resonancia para el pendulo 1
      W0_1 = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasa * gravity * cuerda) /
          Inercia +
          (valorElastica * pow(cuerda, 2)) / Inercia
      );
      W0_2 = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasa * gravity * cuerda) /
          Inercia -
          (valorElastica * pow(cuerda, 2)) / Inercia
      );

      // Valores de resonancia para el pendulo 2
      W0_1B = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasaB * gravity * cuerda) /
          InerciaB +
          (valorElastica * pow(cuerda, 2)) / InerciaB
      );
      W0_2B = sqrt(
        (valorElastica * pow(cuerda, 2) + valorMasaB * gravity * cuerda) /
          InerciaB -
          (valorElastica * pow(cuerda, 2)) / InerciaB
      );

      // Comparación de los valores para los respectivos modos
      // Tener en cuenta que A_1 = B_1, A_2 = -B_2
      // Por lo tanto la ecuacion general es: 
      // Para Theta A : A_1 Cos(W_1 * t) + A_2 Cos(W_2 * t)
      // Para Theta B : A_1 Cos(W_1 * t) - A_2 Cos(W_2 * t)
      if (anguloA > 0 && anguloB > 0) {
        // 1er modo de vibración A1/A2 = +
        A_1 = anguloTemp;
        A_2 = 0;
        B_1 = anguloTempB;
        B_2 = 0;
      }else if(anguloA < 0 && anguloB > 0){
        // 2do modo de vibración A1/A2 = -
        A_1 = 0;
        A_2 = anguloTemp;
        B_1 = 0;
        B_2 = -anguloTempB;
      }else if(anguloA > 0 && anguloB < 0){
        A_1 = 0;
        A_2 = anguloTemp;
        B_1 = 0;
        B_2 = -anguloTempB;
      }else if (anguloA == 0 && anguloB > 0) {
        // 3er modo de vibración combinación de los modos de vibración.
        A_1 = anguloTemp / 2;
        A_2 = -(anguloTemp / 2);
        B_1 = anguloTempB / 2;
        B_2 = -(anguloTempB / 2);
      }else if (anguloA > 0 && anguloB == 0) {
        // 3er modo de vibración combinación de los modos de vibración.
        A_1 = anguloTemp / 2;
        A_2 = A_1;
        B_1 = anguloTempB / 2;
        B_2 = B_1;
      }else if (anguloA < 0 && anguloB == 0) {
        // 3er modo de vibración combinación de los modos de vibración.
        A_1 = -(anguloTemp / 2);
        A_2 = A_1;
        B_1 = -(anguloTempB / 2);
        B_2 = B_1;
      }else if (anguloA == 0 && anguloB < 0) {
        // 3er modo de vibración combinación de los modos de vibración.
        A_1 = -(anguloTemp / 2);
        A_2 = anguloTemp / 2;
        B_1 = -(anguloTempB / 2);
        B_2 = anguloTempB / 2;
      }else { // (anguloA < 0 && anguloB < 0) 
        // 1er modo de vibración A1/A2 = +
        A_1 = -anguloTemp;
        A_2 = 0;
        B_1 = -anguloTempB;
        B_2 = 0;
      }
    }
    bandera++;

    text(
      "Valores: Inercia: " +
        Inercia +
        "  W0_1: " +
        W0_1.toFixed(3) +
        "  W0_2: " +
        W0_2.toFixed(3) +
        "  A_1: " +
        A_1.toFixed(3) +
        "  A_2: " +
        A_2.toFixed(3) +
        " B_1: " +
        B_1.toFixed(3) +
        "  B_2: " +
        B_2.toFixed(3) + 
        "  InerciaA: " + Inercia.toFixed(3) + 
        "  InerciaB: " + InerciaB.toFixed(3),
      200,
      100,
      200,
      100
    );

    fill(0);
    noStroke();

    //Calculamos el movimiento del pendulo
    let xt =
      A_1.toFixed(3) * cos(W0_1.toFixed(3) * t.toFixed(3)) +
      A_2.toFixed(3) * cos(W0_2.toFixed(3) * t.toFixed(3));
    let xtB =
      B_1.toFixed(3) * cos(W0_1B.toFixed(3) * t.toFixed(3)) -
      B_2.toFixed(3) * cos(W0_2B.toFixed(3) * t.toFixed(3));

    if (!isNaN(xt) && !isNaN(xtB)) {
      anguloTemp = xt;
      anguloTempB = xtB;
    }

    // Cambiando las posiciones para el pendulo 1
    posicion.x = valorLongitudC * 100 * sin(anguloTemp) + puntoOrigen.x;
    posicion.y = valorLongitudC * 100 * cos(anguloTemp) + puntoOrigen.y;

    // Cambiando las posiciones para el pendulo 2
    posicionB.x = valorLongitudC * 100 * sin(anguloTempB) + puntoOrigenB.x;
    posicionB.y = valorLongitudC * 100 * cos(anguloTempB) + puntoOrigenB.y;

    if (paso < 1) {
      graficas();
    }
    paso++;
    t += 0.01;
    let resultadoA = document.getElementById("EcuacionA");
    let resultadoB = document.getElementById("EcuacionB");

    // Asignar un valor al elemento
    resultadoA.innerHTML =
      "Θa(t)= " +
      A_1.toFixed(3) +
      " * cos(" +
      W0_1.toFixed(2) +
      " * " +
      t.toFixed(2) +
      ") + " +
      A_2.toFixed(3) +
      " * cos(" +
      W0_2.toFixed(2) +
      " * " +
      t.toFixed(2) +
      ")";

    resultadoB.innerHTML =
      "Θb(t)= " +
      B_1.toFixed(3) +
      " * cos(" +
      W0_1B.toFixed(2) +
      " * " +
      t.toFixed(2) +
      ") - " +
      B_2.toFixed(3) +
      " * cos(" +
      W0_2B.toFixed(2) +
      " * " +
      t.toFixed(2) +
      ")";
    /*
    document.getElementById('valor-omega').innerText = "Valor de Omega: " + W0.toFixed(3) + " rad/seg";
    document.getElementById('valor-inercia').innerText = "Valor de la inercia: " + Inercia.toFixed(3) + " kg*m2";
    document.getElementById('valor-phi').innerText = "Phi: " + Phi.toFixed(3);
    document.getElementById('valor-amplitud').innerText = "Amplitud: " + Amplitud.toFixed(3) + " m";
    document.getElementById('valor-periodo').innerText = "Valor del Periodo: " + Periodo.toFixed(3) + "   s";
    document.getElementById('valor-ecuacion').innerText = "X(t)= " + Amplitud.toFixed(3) + " * cos(" + W0.toFixed(2) + " * " + t.toFixed(2) + " + " + Phi.toFixed(2) + ")";
    */
  }
  stroke(0);
  strokeWeight(2.6);
  fill(54, 24, 117);

  // Pendulo 1
  line(puntoOrigen.x, puntoOrigen.y, posicion.x, posicion.y);
  circle(posicion.x, posicion.y, valorRadio * 100);

  // Pendulo 2
  line(puntoOrigenB.x, puntoOrigenB.y, posicionB.x, posicionB.y);
  circle(posicionB.x, posicionB.y, valorRadioB * 100);
}

//Funcion que simula un resorte
function resorte() {
  // Pendulo 1
  anchor = createVector(posicion.x, posicion.y);
  // Pendulo 2
  anchorB = createVector(posicionB.x, posicionB.y);
  noFill();
  stroke(0); // Color negro
  strokeWeight(2.6 + valorElastica * 0.05); // Grosor de la línea

  let numSegments = 2000; // Número de segmentos del resorte

  // Dibujar las espirales del resorte
  beginShape();

  for (let i = 0; i < numSegments; i++) {
    let t = map(i, 0, numSegments, 0, TWO_PI * 10); // Ajusta el rango de la función sinusoidal

    let segmentStart = p5.Vector.lerp(anchorB, posicion, i / numSegments);
    let segmentEnd = p5.Vector.lerp(anchorB, posicion, (i + 1) / numSegments);

    let midX = (segmentStart.x + segmentEnd.x) / 2;
    let midY = (segmentStart.y + segmentEnd.y) / 2;

    let angle = atan2(
      segmentEnd.y - segmentStart.y,
      segmentEnd.x - segmentStart.x
    );

    let offset = 10 * sin(t); // Ajuste para hacer las espirales

    let endX = midX + offset * cos(angle - HALF_PI);
    let endY = midY + offset * sin(angle - HALF_PI);

    vertex(endX, endY);
  }
  endShape();
}

//Funciones para simular el movimiento de X (Posicion), V (Velocidad), A (Aceleracion)
function getDataPositionA() {
  var XtA = A_1.toFixed(3) * cos(W0_1.toFixed(3) * tX.toFixed(3)) +
  A_2.toFixed(3) * cos(W0_2.toFixed(3) * tX.toFixed(3)); //Cambiarla si es necesario
  return XtA;
}
function getDataPositionB() {
  var XtB = B_1.toFixed(3) * cos(W0_1B.toFixed(3) * tV.toFixed(3)) -
  B_2.toFixed(3) * cos(W0_2B.toFixed(3) * tV.toFixed(3)); //Cambiarla si es necesario
  return XtB;
}
/*
function getDataVelocity() {
  var Vt = -Amplitud * W0 * Math.sin(W0 * tV + Phi); //Cambiarla si es necesario
  return Vt;
}
function getDataAceleration() {
  var At = -Amplitud * pow(W0, 2) * Math.cos(W0 * tV + Phi); //Cambiarla si es necesario
  return At;
}*/

function graficas() {
  if (!pausar) {
    // Verifica si la simulación está pausada
    var layout = {
      title: "Movimientos",
      autosize: true,
      height: 600,
      xaxis: { title: "Tiempo (s)", range: [0, 300] },
      yaxis: { title: "Amplitud (rad)" },
      legend: {
        x: 0,
        y: -1,
      },
    };

    let positionDataA = {
      y: [getDataPositionA()],
      type: "line",
      name: "Posición Θa",
    };
    let positionDataB = {
      y: [getDataPositionB()],
      type: "line",
      name: "Posición Θb",
    };
    /*
    let velocityData = {
      y: [getDataPosition()],
      type: "line",
      name: "Velocidad",
    };
    let acelerationData = {
      y: [getDataPosition()],
      type: "line",
      name: "Aceleración",
    };*/
    Plotly.newPlot(
      "Movimientos",
      [positionDataA, positionDataB],
      layout
    );
    setInterval(function () {
      if (!pausar) {
        // Verifica si la simulación está pausada
        tX += 0.01;
        tV += 0.01;
        //tA += 0.01;
        Plotly.extendTraces("Movimientos", { y: [[getDataPositionA()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataPositionB()]] }, [1]);
        /*Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [
          2,
        ]);*/
      }
    }, 5);
  }
}

// Apartado para las "pestañas" creadas para cambiar entre el pendulo 1 (A) y 2 (B)
function openPendulo(evt, penduloName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(penduloName).style.display = "block";
  evt.currentTarget.className += " active";
}

