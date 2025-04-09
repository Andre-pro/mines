// Настройки игры
const BET_AMOUNT = 10;
const BOMBS_COUNT = 3;
const GRID_SIZE = 5;
const MULTIPLIER_STEP = 0.2;

// Элементы DOM
const grid = document.getElementById("grid");
const cashoutBtn = document.getElementById("cashout");
const restartBtn = document.getElementById("restart");
const balanceDisplay = document.getElementById("balance");
const multiplierDisplay = document.getElementById("multiplier");
const winModal = document.querySelector(".win-modal");
const winAmount = document.getElementById("win-amount");
const closeWinBtn = document.getElementById("close-win");

// Состояние игры
let balance = 1000;
let multiplier = 1;
let revealedCells = 0;
let gameOver = false;
let bombsPositions = [];

// Инициализация игры
function initGame() {
    grid.innerHTML = "";
    multiplier = 1;
    revealedCells = 0;
    gameOver = false;
    cashoutBtn.disabled = false;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";

    // Генерация бомб
    bombsPositions = [];
    while (bombsPositions.length < BOMBS_COUNT) {
        const randomPos = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
        if (!bombsPositions.includes(randomPos)) {
            bombsPositions.push(randomPos);
        }
    }

    // Создание клеток
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        cell.addEventListener("click", () => revealCell(i));
        grid.appendChild(cell);
    }
}

// Открытие клетки
function revealCell(index) {
    if (gameOver) return;

    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    if (cell.classList.contains("revealed")) return;

    if (bombsPositions.includes(index)) {
        // Игрок наступил на бомбу
        cell.classList.add("bomb");
        cell.textContent = "💣";
        gameOver = true;
        cashoutBtn.disabled = true;
        balance -= BET_AMOUNT;
        balanceDisplay.textContent = balance;
        setTimeout(() => alert("Game Over! You hit a bomb."), 300);
    } else {
        // Игрок открыл безопасную клетку
        cell.classList.add("revealed");
        cell.textContent = "💎";
        revealedCells++;
        multiplier += MULTIPLIER_STEP;
        multiplierDisplay.textContent = multiplier.toFixed(2) + "x";
    }
}

// Кэшаут
cashoutBtn.addEventListener("click", () => {
    if (gameOver || revealedCells === 0) return;

    const win = BET_AMOUNT * multiplier;
    balance += win;
    balanceDisplay.textContent = balance;
    gameOver = true;
    cashoutBtn.disabled = true;

    winAmount.textContent = "$" + win.toFixed(2);
    winModal.classList.add("active");
});

// Закрытие модального окна
closeWinBtn.addEventListener("click", () => {
    winModal.classList.remove("active");
});

// Новая игра
restartBtn.addEventListener("click", initGame);

// Запуск игры
initGame();
