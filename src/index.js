import './styles.css';
import goblinImage from './goblin.png';

class GoblinGame {
    static FIELD_SIZE = 4;
    static MAX_MISSES = 10;
    static MOVE_INTERVAL_MS = 1000;
    static POP_ANIMATION_MS = 200;
    static HIT_ANIMATION_MS = 100;
    
    constructor() {
        this.fieldSize = GoblinGame.FIELD_SIZE;
        this.maxMisses = GoblinGame.MAX_MISSES;
        this.cells = [];
        this.currentPosition = null;
        this.score = 0;
        this.misses = 0;
        this.gameInterval = null;
        this.goblinElement = null;
        this.gameField = null;
        this.scoreElement = null;
        this.missesElement = null;
        
        this.init();
    }
    
    init() {
        const gameField = document.getElementById('game-field');
        const scoreElement = document.getElementById('score');
        const missesElement = document.getElementById('misses');
        
        if (!gameField) {
            console.error('Игровое поле не найдено!');
            return;
        }
        if (!scoreElement || !missesElement) {
            console.error('Элементы счёта не найдены!');
            return;
        }
        
        this.gameField = gameField;
        this.scoreElement = scoreElement;
        this.missesElement = missesElement;
        
        this.createGameField();
        this.createGoblin();
        this.startGame();
        this.updateScoreDisplay();
    }
    
    createGameField() {
        const totalCells = this.fieldSize * this.fieldSize;
        
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.className = 'hole';
            cell.dataset.index = i;
            
            cell.addEventListener('click', (event) => {
                this.handleClick(i, event);
            });
            
            this.gameField.append(cell);
            this.cells.push(cell);
        }
    }
    
    createGoblin() {
        this.goblinElement = document.createElement('img');
        this.goblinElement.src = goblinImage;
        this.goblinElement.className = 'goblin';
        this.goblinElement.alt = 'Goblin';
        
        this.goblinElement.addEventListener('click', (event) => {
            event.stopPropagation();
            this.hitGoblin();
        });
    }
    
    startGame() {
        this.moveGoblin();
        this.gameInterval = setInterval(() => {
            this.moveGoblin();
        }, GoblinGame.MOVE_INTERVAL_MS);
    }
    
    moveGoblin() {
        let newPosition;
        const totalCells = this.fieldSize * this.fieldSize;
        
        do {
            newPosition = Math.floor(Math.random() * totalCells);
        } while (newPosition === this.currentPosition);
        
        if (this.currentPosition !== null) {
            const oldCell = this.cells[this.currentPosition];
            if (oldCell.contains(this.goblinElement)) {
                oldCell.removeChild(this.goblinElement);
            }
        }
        
        const newCell = this.cells[newPosition];
        newCell.append(this.goblinElement);
        this.currentPosition = newPosition;
    }
    
    handleClick(cellIndex, event) {
        if (cellIndex === this.currentPosition && 
            this.goblinElement.parentElement === this.cells[cellIndex]) {
            return;
        }
        
        this.misses++;
        this.updateScoreDisplay();
        
        this.cells[cellIndex].style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.cells[cellIndex].style.transform = '';
        }, GoblinGame.POP_ANIMATION_MS);
        
        if (this.misses >= this.maxMisses) {
            this.gameOver();
        }
    }
    
    hitGoblin() {
        this.score++;
        this.updateScoreDisplay();
        
        this.goblinElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.goblinElement.style.transform = '';
        }, GoblinGame.HIT_ANIMATION_MS);
        
        this.moveGoblin();
    }
    
    updateScoreDisplay() {
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
        if (this.missesElement) {
            this.missesElement.textContent = this.misses;
        }
    }
    
    gameOver() {
        clearInterval(this.gameInterval);
        alert(`Игра окончена!\nВаш счёт: ${this.score}\nПромахов: ${this.misses}`);
        this.resetGame();
    }
    
    resetGame() {
        this.score = 0;
        this.misses = 0;
        this.updateScoreDisplay();
        this.startGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GoblinGame();
});