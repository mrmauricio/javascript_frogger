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
  update(dt) {

    this.x += this.speed*dt;

    if( player.x - 70 < this.x          && 
        player.x + 70 > this.x          &&
        player.y - distanceY/2 < this.y &&
        player.y + distanceY/2 > this.y ){

      player.collision();
    }

    Enemy.deleteEnemies();    

  }

// Caso o inimigo saia da tela é deletado da array
  static deleteEnemies(){
      if((allEnemies.length !== 0) && (allEnemies[0].x > (spawnX[1] * spawnX.length))){
          allEnemies.shift();     
      }    
  }  

// Adiciona inimigos na array, com características de acordo com o level   
  static addEnemies(){
      allEnemies.push(new Enemy(
          spawnX[0] - spawnX[1],                              // x
          spawnY[Math.floor(Math.random()*4) + 1],            // y
          bugSprite[bugType],                                 // imagem
          Math.random()*levelInfo[player.level][1] + levelInfo[player.level][0]     // velocidade
      ));               
  }

// Adiciona na tela os primeiros inimigos
  static addFirstEnemies(){
    for (let i = 1; i <= 4; i++) {
        allEnemies.push(new Enemy(
            Math.random()*spawnX[1] + spawnX[2],            // x
            spawnY[i],                                      // y
            'images/enemy-bug.png',                         // imagem
            Math.random()*levelInfo[player.level][1] + levelInfo[player.level][0] // velocidade
        ));   
    }
    
    for (let i = 1; i <= 4; i++) {
        allEnemies.push(new Enemy(
            Math.random()*spawnX[1],                        // x
            spawnY[i],                                      // y
            'images/enemy-bug.png',                         // imagem
            Math.random()*levelInfo[player.level][1] + levelInfo[player.level][0] // velocidade
        ));   
    }  
  }

}


class WinFlag extends Component {
    constructor(x, y, sprite, col) {
        super(x, y, sprite);
        this.col = col;
    }

  // Adiciona bandeiras na tela
    static addWinFlags(x,y,sprite,col){
        allWinFlags.push(new WinFlag(
            x,       // x
            y,       // y
            sprite,  // imagem
            col      // coluna
        ));               
    }

  // Atualiza posição
    update(){
        this.x = this.x;
        this.y = this.y;
    }

  // Verifica se na coluna em questão há uma bandeira
    static flagStatus(col){
        for (let winFlag of allWinFlags) {
            if (winFlag.col === col)
                return false;   // coluna 'col' tem bandeira
        }
        return true;    // coluna 'col' não tem bandeira
    }

  // Executa os métodos relacionados à vitória de um nível
    static flagExists(col,x,y){
        if(WinFlag.flagStatus(col)){
            WinFlag.addWinFlags(x, y, 'images/rock.png', col);
            player.spawnPlayer();
            player.increaseLevel();
        }         
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
  update() {
    if (this.y === spawnY[0]){
        switch(this.x){
            case(spawnX[0]):
                WinFlag.flagExists(spawnX[0],this.x,this.y)   
                break;  
            case(spawnX[1]):
                WinFlag.flagExists(spawnX[1],this.x,this.y) 
                break;  
            case(spawnX[2]):
                WinFlag.flagExists(spawnX[2],this.x,this.y)  
                break;  
            case(spawnX[3]):
                WinFlag.flagExists(spawnX[3],this.x,this.y)  
                break;  
            case(spawnX[4]):
                WinFlag.flagExists(spawnX[4],this.x,this.y)  
                break;                                                                  
        }                   
    }        
    else{
      this.y = this.y;
    }

    this.x = this.x;    
    this.win();
    this.lose();
  }

// Aumenta o nível do jogo, alterando suas características
  increaseLevel(){
    this.level++;  
    clearInterval(enemiesInterval);
    enemiesInterval = setInterval(Enemy.addEnemies,levelInfo[player.level][2]);
    bugType++;
  }

// Leva o player à posição inicial
  spawnPlayer(){
    this.y = spawnY[5];
    this.x = spawnX[2];
  }

// Realiza os movimentos do jogador de acordo com o pressionamento das teclas,
// verificando se são válidos
  handleInput(value) {
    if(this.freezeControls()){    
        switch(value){
          case('up'):
              if (this.y === spawnY[1] && WinFlag.flagStatus(this.x) === false)
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
            this.restart();
    }           
  }  

// Limpa a tela dos sprites
  clearScreen(){
    allEnemies = [];
    allWinFlags = [];     
    this.x = 500;     
  }

// Método chamado quando há vitória
  win(){
    if (allWinFlags.length === 5){
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
    player.spawnPlayer();
    this.lives--;
  } 

// Congela os controles em caso de vitória ou derrota
  freezeControls(){
    if (this.hasLost || this.hasWon)
        return false;
    return true;
  }    

// Reinicia a partida, zerando os dados da anterior
  restart() {
    this.spawnPlayer();
    this.lives = 3;
    this.hasLost = false;
    this.hasWon = false;
    this.level = 0;  
    timer = Date.now()    
    bugType = 0;    
    Enemy.addFirstEnemies();    
    clearInterval(enemiesInterval);    
    enemiesInterval = setInterval(Enemy.addEnemies,levelInfo[player.level][2]);
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
    ctx.drawImage(Resources.get('images/mauricio.png'), 146, 550);      

    if(this.hasLost){   
        ctx.beginPath();        
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(0, 50, 505, 535);
        ctx.closePath();   
        ctx.drawImage(Resources.get('images/game-over.png'), spawnX[1] + 11, spawnY[3]);             
        ctx.drawImage(Resources.get('images/enter.png'), spawnX[1] + 15, spawnY[3] + 175);           
    }    

    if(this.hasWon){   
        ctx.beginPath();        
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillRect(0, 50, 505, 535);
        ctx.font = "16pt Impact";
        ctx.fillStyle = "black";
        ctx.fillText(timer, spawnX[1] + 175, spawnY[3] + 218);
        ctx.closePath();        
        ctx.drawImage(Resources.get('images/you-win.png'), spawnX[1] + 11, spawnY[3]); 
        ctx.drawImage(Resources.get('images/time.png'), spawnX[1], spawnY[3] + 200);                 
        ctx.drawImage(Resources.get('images/enter.png'), spawnX[1] + 15, spawnY[3] + 175);          
    }        

  }
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
let enemiesInterval = setInterval(Enemy.addEnemies,levelInfo[player.level][2]);

// Instanciar os primeiros inimigos 
Enemy.addFirstEnemies();

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

    player.handleInput(allowedKeys[e.keyCode]);
});

// Retira a barra de rolagem
function hidden(){
    document.body.style.overflow='hidden';
}