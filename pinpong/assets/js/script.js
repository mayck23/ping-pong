
const canvas = document.querySelector("#ping-pong");
const context = canvas.getContext("2d");

// Selecciona los botones de inicio, pausa y reinicio
const startBtn = document.querySelector(".start-btn");
const pauseBtn = document.querySelector(".pause-btn");
const restartBtn = document.querySelector(".restart-btn");

// Variables para controlar el estado del juego
let gameRunning = false;
let animationId;
let countdownValue = null; // Para mostrar la cuenta regresiva

// CREAR PALA DEL USUARIO
const user = {
    x: 0,  // Posición en el eje X
    y: canvas.height / 2 - 100 / 2,  // Posición centrada en el eje Y
    width: 10,  // Ancho de la pala
    height: 100,  // Alto de la pala
    color: "red",  // Color de la pala
    score: 0  // Puntuación del usuario
};

// CREAR PALA DE LA COMPUTADORA
const computer = {
    x: canvas.width - 10,  // Posición en el borde derecho del canvas
    y: canvas.height / 2 - 100 / 2,  // Posición centrada en el eje Y
    width: 10,  // Ancho de la pala
    height: 100,  // Alto de la pala
    color: "black",  // Color de la pala
    score: 0  // Puntuación de la computadora
};

// CREAR LA PELOTA
const ball = {
    x: canvas.width / 2,  // Posición inicial en el centro del canvas
    y: canvas.height / 2,  // Posición inicial centrada en el eje Y
    radius: 10,  // Radio de la pelota
    speed: 5,  // Velocidad inicial de la pelota
    velocityX: 5,  // Velocidad en el eje X
    velocityY: 5,  // Velocidad en el eje Y
    color: "white"  // Color de la pelota
};

// CREAR LA RED
const net = {
    x: canvas.width / 2 - 1,  // Posición en el centro del canvas
    y: 0,  // Inicio desde la parte superior del canvas
    width: 2,  // Ancho de la red
    height: 10,  // Altura de cada sección de la red
    color: "white"  // Color de la red
};

// Evento para reiniciar el juego al hacer clic en el botón de reinicio
restartBtn.addEventListener("click", () => {
    document.location.reload();
});

// Evento que renderiza el juego cuando se carga la página
addEventListener("load", (event) => {
    render();
});

// FUNCIÓN PARA DIBUJAR LA RED
function drawNet() {
    const netWidth = 4;  // Ancho de la red
    const netSpacing = 15;  // Espacio entre secciones de la red

    // Dibuja la red en el lado izquierdo y derecho
    for (let i = 0; i <= canvas.height; i += netSpacing) {
        drawRectangle(net.x, net.y + i, netWidth, net.height, net.color);
    }
    for (let i = 0; i <= canvas.height; i += netSpacing) {
        drawRectangle(net.x + net.width - netWidth, net.y + i, netWidth, net.height, net.color);
    }
}

// FUNCIÓN PARA DIBUJAR UN RECTÁNGULO
function drawRectangle(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// FUNCIÓN PARA DIBUJAR UN CÍRCULO
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// FUNCIÓN PARA DIBUJAR TEXTO
function drawText(text, x, y, color, size = "45px") {
    context.fillStyle = color;
    context.font = `${size} fantasy`;
    context.fillText(text, x, y);
}

// FUNCIÓN PARA RENDERIZAR EL JUEGO
function render() {
    // Dibuja el fondo del canvas
    drawRectangle(0, 0, canvas.width, canvas.height, "green");
    drawNet();  // Dibuja la red
    drawText(user.score, canvas.width / 4, canvas.height / 5, "white");  // Muestra la puntuación del usuario
    drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "white");  // Muestra la puntuación de la computadora
    drawRectangle(user.x, user.y, user.width, user.height, user.color);  // Dibuja la pala del usuario
    drawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);  // Dibuja la pala de la computadora
    drawCircle(ball.x, ball.y, ball.radius, ball.color);  // Dibuja la pelota
    drawRectangle(net.x, net.y, net.width, canvas.height, net.color);  // Dibuja la red completa

    // Si hay cuenta regresiva, se muestra en el centro
    if (countdownValue !== null) {
        drawText(countdownValue, canvas.width / 2 - 30, canvas.height / 2, "white", "60px");
    }
}

// CONTROL DE LA PALA DEL USUARIO
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rectangle = canvas.getBoundingClientRect();
    user.y = evt.clientY - rectangle.top - user.height / 2;  // Ajusta la posición de la pala del usuario
}

// FUNCIÓN PARA DETECTAR COLISIONES
function collision(b, p) {
    // Establece las posiciones de los bordes de la pelota
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    // Establece las posiciones de los bordes de la pala
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    // Detecta si la pelota está chocando con la pala
    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// FUNCIÓN PARA REINICIAR LA PELOTA
function resetBall() {
    ball.x = canvas.width / 2;  // Reposiciona la pelota en el centro
    ball.y = canvas.height / 2;
    ball.speed = 5;  // Restablece la velocidad de la pelota
    ball.velocityX = -ball.velocityX;  // Invierte la dirección en el eje X
    ball.velocityY = 5;  // Restablece la dirección en el eje Y
}

// FUNCIÓN PARA INICIAR LA CUENTA REGRESIVA
function startCountdown(callback) {
    countdownValue = "GO";  // Muestra "GO"
    setTimeout(() => {
        countdownValue = null;  // Limpia el texto después de 2 segundos
        callback();  // Inicia el juego después de la cuenta regresiva
    }, 2000);  // 2000 milisegundos = 2 segundos
}

// FUNCIÓN PARA PAUSAR Y REINICIAR DESPUÉS DE UN PUNTO
function resetAfterPoint() {
    gameRunning = false;  // Pausa el juego
    resetBall();  // Restablece la pelota al centro
    startCountdown(() => {
        gameRunning = true;
        animate();  // Reanuda el juego después de la cuenta regresiva
    });
}

// FUNCIÓN PARA MOSTRAR AL GANADOR
function displayWinner(winner) {
    gameRunning = false;
    drawRectangle(0, 0, canvas.width, canvas.height, "green");  // Limpia la pantalla
    drawText(`${winner} Wins!`, canvas.width / 4, canvas.height / 2, "white", "60px");  // Muestra el mensaje del ganador
}

// FUNCIÓN PARA ACTUALIZAR EL JUEGO
function update() {
    ball.x += ball.velocityX;  // Actualiza la posición de la pelota en X
    ball.y += ball.velocityY;  // Actualiza la posición de la pelota en Y

    // IA simple para controlar la pala de la computadora
    let computerLevel = 0.1;
    computer.y += (ball.y - (computer.y + computer.height / 2)) * computerLevel;

    // Rebote de la pelota en los bordes superior e inferior
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Detecta si la pelota está del lado del usuario o de la computadora
    let player = (ball.x < canvas.width / 2) ? user : computer;

    // Detecta colisión con la pala
    if (collision(ball, player)) {
        // Aumenta la velocidad de la pelota en cada golpe
        ball.velocityX = -ball.velocityX;
        ball.speed += 0.1;
    }

    // Detecta si la pelota sale de la pantalla (anotación)
    if (ball.x - ball.radius < 0) {
        // Punto para la computadora
        computer.score++;
        if (computer.score === 10) {
            displayWinner("Computer");  // La computadora gana si llega a 10 puntos
        } else {
            resetAfterPoint();
        }
    } else if (ball.x + ball.radius > canvas.width) {
        // Punto para el usuario
        user.score++;
        if (user.score === 10) {
            displayWinner("User");  // El usuario gana si llega a 10 puntos
        } else {
            resetAfterPoint();
        }
    }
}

// FUNCIÓN PARA INICIAR LA ANIMACIÓN DEL JUEGO
function animate() {
    if (gameRunning) {
        update();  // Actualiza el estado del juego
        render();  // Renderiza el juego
        animationId = requestAnimationFrame(animate);  // Continúa la animación
    }
}

// Evento para pausar o reanudar el juego
pauseBtn.addEventListener("click", () => {
    if (gameRunning) {
        gameRunning = false;  // Pausa el juego
        cancelAnimationFrame(animationId);  // Cancela la animación
    } else {
        gameRunning = true;  // Reanuda el juego
        animate();  // Continúa la animación
    }
});

// Evento para comenzar el juego
startBtn.addEventListener("click", () => {
    if (!gameRunning) {
        startCountdown(() => {
            gameRunning = true;  // Comienza el juego después de la cuenta regresiva
            animate();  // Inicia la animación
        });
    }
});
