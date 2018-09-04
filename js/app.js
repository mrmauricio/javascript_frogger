/**********************************\
 *       JAVASCRIPT FROGGER       *        
/**********************************\
 *          agosto/2018           *
 *     github.com/mrmauricio      *
 **********************************\

/* 
 *  Classes e métodos:
 */

class Component {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
  }

// Desenha na tela o componente
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}


class Enemy extends Component {
  constructor(x, y, sprite, speed) {
    super(x, y, sprite);
    this.speed = speed;
  }

// Atualiza posição do inimigo de acordo com sua velocidade e o dt definido,
// checando se houve ou não colisão com o jogador, além de deletá-los
  update(dt, player, enemies) {

    this.x += this.speed * dt;

    if( player.x - 70 < this.x && 
        player.x + 70 > this.x &&
        player.y - 42 < this.y &&
        player.y + 42 > this.y ){

      player.collision();
    }

    this.deleteEnemies(enemies);    

  }

// Caso o inimigo saia da tela é deletado da array
  deleteEnemies(enemies){
      if((enemies.length !== 0) && (enemies[0].x > (spawnX[1] * spawnX.length))){
          enemies.shift();     
      }    
  }  

}  


class WinFlag extends Component {
    constructor(x, y, sprite, col) {
        super(x, y, sprite);
        this.col = col;
    }
}  


class Player extends Component {
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.lives = 3;
    this.level = 0;
    this.hasWon = false;
    this.hasLost = false;
  }

// Atualiza posição do player, verificando se este passou de nível, além de 
// checar se houve vitória ou derrota
  update(flags) {
    if (this.y === spawnY[0]){
        switch(this.x){
            case(spawnX[0]):
                flagExists(spawnX[0], this.x, this.y, flags, this)   
                break;  
            case(spawnX[1]):
                flagExists(spawnX[1], this.x, this.y, flags, this) 
                break;  
            case(spawnX[2]):
                flagExists(spawnX[2], this.x, this.y, flags, this)  
                break;  
            case(spawnX[3]):
                flagExists(spawnX[3], this.x, this.y, flags, this)  
                break;  
            case(spawnX[4]):
                flagExists(spawnX[4], this.x, this.y, flags, this)  
                break;                                                                  
        }                   
    }        
    else{
      this.y = this.y;
    }

    this.x = this.x;    
    this.win(flags);
    this.lose();
  }

// Aumenta o nível do jogo, alterando suas características
  increaseLevel(){
    this.level++;  
    clearInterval(enemiesInterval);
    enemiesInterval = setInterval( () => {addEnemies(allEnemies, this)},levelInfo[this.level][2]);
    bugType++;
  }

// Leva o player à posição inicial
  spawnPlayer(){
    this.y = spawnY[5];
    this.x = spawnX[2];
  }

// Realiza os movimentos do jogador de acordo com o pressionamento das teclas,
// verificando se são válidos
  handleInput(value, flags, enemies) {
    if(this.freezeControls()){    
        switch(value){
          case('up'):
              if (this.y === spawnY[1] && flagStatus(this.x, flags) === false)
                break;  
              this.y = this.y - distanceY;
              break;
          case('down'):
              if (this.y !== spawnY[5])
                this.y = this.y + distanceY; 
              break;       
          case('left'):
              if (this.x !== spawnX[0])         
                this.x = this.x - distanceX; 
              break;    
          case('right'):
              if (this.x !== spawnX[4])       
                this.x = this.x + distanceX; 
              break;                           
        }
    }else{
        if (value ==='enter')
            this.restart(enemies);
    }           
  }  

// Limpa a tela dos sprites
  clearScreen(){
    clear();
    this.x = 500;     
  }

// Método chamado quando há vitória
  win(flags){
    if (flags.length === 5){
        timer = (Date.now() - timer) / 1000;
        this.hasWon = true; 
        this.clearScreen();
    }          
  }

// Método chamado quando há derrota
  lose(){
    if (this.lives === 0){
        this.hasLost = true;
        this.clearScreen();       
    }    
  }  

// Método chamado quando há colisão
  collision(){
    this.spawnPlayer();
    this.lives--;
  } 

// Congela os controles em caso de vitória ou derrota
  freezeControls(){
    if (this.hasLost || this.hasWon)
        return false;
    return true;
  }    

// Reinicia a partida, zerando os dados da anterior
  restart(enemies) {
    this.spawnPlayer();
    this.lives = 3;
    this.hasLost = false;
    this.hasWon = false;
    this.level = 0;  
    timer = Date.now()    
    bugType = 0;    
    addFirstEnemies(enemies, this);    
    clearInterval(enemiesInterval);    
    enemiesInterval = setInterval( () => {addEnemies(enemies, this)},levelInfo[this.level][2]);
  }

// Desenha os detalhes na tela
  render(){
    super.render();

    switch(this.lives){
        case(3):    
            ctx.drawImage(Resources.get('images/lives.png'), 417, 2);  
            ctx.drawImage(Resources.get('images/lives.png'), 444, 2);
            ctx.drawImage(Resources.get('images/lives.png'), 471, 2);
            break;
        case(2):
            ctx.drawImage(Resources.get('images/lives.png'), 417, 2);  
            ctx.drawImage(Resources.get('images/lives.png'), 444, 2);        
            break;
        case(1):
            ctx.drawImage(Resources.get('images/lives.png'), 417, 2); 
            break;            
    }                      

    ctx.drawImage(Resources.get('images/frogger.png'), 0, -5);  
    ctx.drawImage(Resources.get('images/mauricio.png'), 146, 535);      

    if(this.hasLost){   
        ctx.beginPath();        
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(0, 50, 505, 535);
        ctx.closePath();   
        ctx.drawImage(Resources.get('images/game-over.png'), 112, 227);             
        ctx.drawImage(Resources.get('images/enter.png'), 116, 402);           
    }    

    if(this.hasWon){   
        ctx.beginPath();        
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(0, 50, 505, 535);
        ctx.font = "16pt Impact";
        ctx.fillStyle = "black";
        ctx.fillText(timer, 276, 447);
        ctx.closePath();        
        ctx.drawImage(Resources.get('images/you-win.png'), 112, 227); 
        ctx.drawImage(Resources.get('images/time.png'), 101, 427);                 
        ctx.drawImage(Resources.get('images/enter.png'), 116, 402);          
    }        

  }
}


// Adiciona inimigos na array, com características de acordo com o level   
  function addEnemies(enemies, player){
      enemies.push(new Enemy(
          spawnX[0] - spawnX[1],                              // x
          spawnY[Math.floor(Math.random()*4) + 1],            // y
          bugSprite[bugType],                                 // imagem
          Math.random()*levelInfo[player.level][1] + levelInfo[player.level][0]     // velocidade
      ));               
  }

// Adiciona na tela os primeiros inimigos
  function addFirstEnemies(enemies, player){
    for (let i = 1; i <= 4; i++) {
        enemies.push(new Enemy(
            Math.random()*spawnX[1] + spawnX[2],            // x
            spawnY[i],                                      // y
            'images/enemy-bug.png',                         // imagem
            Math.random()*levelInfo[player.level][1] + levelInfo[player.level][0] // velocidade
        ));   
    }
    
    for (let i = 1; i <= 4; i++) {
        enemies.push(new Enemy(
            Math.random()*spawnX[1],                        // x
            spawnY[i],                                      // y
            'images/enemy-bug.png',                         // imagem
            Math.random()*levelInfo[player.level][1] + levelInfo[player.level][0] // velocidade
        ));   
    }  
  }

  // Adiciona bandeiras na tela
    function addWinFlags(x, y, sprite, col, flags){
        flags.push(new WinFlag(
            x,       // x
            y,       // y
            sprite,  // imagem
            col      // coluna
        ));               
    }

  // Executa os métodos relacionados à vitória de um nível
    function flagExists(col, x, y, flags, player){
        if(flagStatus(col, flags)){
            addWinFlags(x, y, 'images/rock.png', col, flags);
            player.spawnPlayer();
            player.increaseLevel();
        }         
    }

  // Verifica se na coluna em questão há uma bandeira
    function flagStatus(col, flags){
        for (let flag of flags) {
            if (flag.col === col)
                return false;   // coluna 'col' tem bandeira
        }
        return true;    // coluna 'col' não tem bandeira
    }


/* 
 *  Declarações iniciais de variáveis:
 */


// Array de inimigos e bandeiras
let allEnemies = [];
let allWinFlags = [];

// Constantes de spawn
const spawnX = [0, 101, 202, 303, 404];  // as 5 colunas
const distanceX = spawnX[1] - spawnX[0];
const spawnY = [-25, 59, 143, 227, 311, 395];     // as 6 fileiras
const distanceY = spawnY[1] - spawnY[0]; 

// Características dos 5 níveis do jogo: 1º [velocidade mínima do inimigo, 
// quantidade de variação, tempo de spawn]; 2º sprites dos inimigos por nível
const levelInfo = [
    [50, 50, 1500   ],
    [60, 50, 1200   ],
    [70, 50, 1000   ],
    [80, 50, 800    ],
    [90, 50, 600    ],
    [0 , 0 , 9999999]
]; 

const bugSprite = [
    'images/enemy-bug.png' ,
    'images/enemy-bug2.png',
    'images/enemy-bug3.png',
    'images/enemy-bug4.png',
    'images/enemy-bug5.png'
];

let bugType = 0;

// Instanciar o player 
const player = new Player(spawnX[2],spawnY[5],'images/char-boy.png');

// Adicionar inimigos de forma contínua na tela
let enemiesInterval = setInterval( () => {addEnemies(allEnemies,player)},levelInfo[player.level][2]);

// Instanciar os primeiros inimigos 
addFirstEnemies(allEnemies, player);

// Ativar cronômetro de score
let timer = Date.now();

// Verifica as teclas apertadas e manda para o método Player.handleInput() 
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        65: 'left',
        87: 'up',      
        68: 'right',
        83: 'down',  
        100: 'left',
        104: 'up',
        102: 'right',
        101: 'down',
        37: 'left',
        38: 'up',      
        39: 'right',
        40: 'down',
        13: 'enter'          
    };

    player.handleInput(allowedKeys[e.keyCode], allWinFlags, allEnemies);
});

// Retira a barra de rolagem
function hidden(){
    document.body.style.overflow='hidden';
}

function clear(){
    allEnemies = [];
    allWinFlags = [];
}