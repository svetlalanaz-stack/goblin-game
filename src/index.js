import './styles.css';
import goblinImage from './goblin.png';

class GoblinGame {
    constructor() {
        this.fieldSize = 4;
        this.cells = [];
        this.currentPosition = null;
        this.score = 0;
        this.misses = 0;
        this.gameInterval = null;
        this.goblinElement = null;
        
        this.init();
    }
    
    init() {
        this.createGameField();
        this.createGoblin();
        this.startGame();
        this.updateScoreDisplay();
    }
    
    createGameField() {
        const gameField = document.getElementById('game-field');
        
        for (let i = 0; i < this.fieldSize * this.fieldSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'hole';
            cell.dataset.index = i;
            
          
            cell.addEventListener('click', (event) => {
                this.handleClick(i, event);
            });
            
            gameField.appendChild(cell);
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
        }, 1000);
    }
    
    moveGoblin() {
        let newPosition;
        
        
        do {
            newPosition = Math.floor(Math.random() * (this.fieldSize * this.fieldSize));
        } while (newPosition === this.currentPosition);
        
       
        if (this.currentPosition !== null) {
            const oldCell = this.cells[this.currentPosition];
            if (oldCell.contains(this.goblinElement)) {
                oldCell.removeChild(this.goblinElement);
            }
        }
        
        
        const newCell = this.cells[newPosition];
        newCell.appendChild(this.goblinElement);
        
        
        this.currentPosition = newPosition;
    }
    
    handleClick(cellIndex, event) {
        
        if (cellIndex === this.currentPosition && this.goblinElement.parentElement === this.cells[cellIndex]) {
            return;
        }
        
        this.misses++;
        this.updateScoreDisplay();
        
        this.cells[cellIndex].style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.cells[cellIndex].style.transform = '';
        }, 200);
        
        if (this.misses >= 10) {
            this.gameOver();
        }
    }
    
    hitGoblin() {
        this.score++;
        this.updateScoreDisplay();
        
        // Визуальный эффект попадания
        this.goblinElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.goblinElement.style.transform = '';
        }, 100);
        
        this.moveGoblin();
    }
    
    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('misses').textContent = this.misses;
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