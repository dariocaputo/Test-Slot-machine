var result = {};

GamePlayManager = {
   
    init:function(){
            
        this.startGame = false;   
        this.reel1Paused = true;   
        this.reel2Paused = true;    
        this.reel3Paused = true;     
      
    }, 
   
    preload:function(){
          
        game.load.image('fondoSlot', 'assets/images/fondo_Slot.png'); 
        game.load.image('marcoSlot', 'assets/images/marco_Slot.png');
        game.load.image('blackBar', 'assets/images/black_bar.png');
       
        game.load.spritesheet('spin', 'assets/images/btn_spin.png', 171, 50, 2);
        game.load.image('prize', 'assets/images/prize_window.png');
       
        game.load.image('clover', 'assets/images/sym_a.png');
        game.load.image('bell', 'assets/images/sym_b.png');
        game.load.image('strawberry', 'assets/images/sym_c.png');
        game.load.image('grapes', 'assets/images/sym_d.png');
        game.load.image('cherry', 'assets/images/sym_e.png');

        game.load.image('line1', 'assets/images/line_1.png'); 
        game.load.image('line4', 'assets/images/line_4.png');
        game.load.image('line5', 'assets/images/line_5.png');
               
    },    
   
    create:function(){
      
        game.add.sprite(0, 0, 'fondoSlot');       
 
        this.reel1 = this.setIcon(Wrapper.REELS[0],29,-2417,144); 
        this.reel2 = this.setIcon(Wrapper.REELS[1],175,-2417,144);
        this.reel3 = this.setIcon(Wrapper.REELS[2],320,-2417,144);   

         //PAYLINES
        this.horMid = game.add.sprite(20, 240, 'line1');//medio hor
        this.horTop = game.add.sprite(20, 95, 'line1');//arriba hor
        this.horDown = game.add.sprite(20, 385, 'line1');//abajo hor
        this.diagonalDes = game.add.sprite(30, 30, 'line4');
        this.diagonalAsc = game.add.sprite(30, 30, 'line5');       
        
        this.lines = [this.horMid,this.horTop,this.horDown,this.diagonalDes,this.diagonalAsc]; 
        this.hideAllPayLines();
         
        game.add.sprite(0, 0, 'marcoSlot');
        game.add.sprite(0, 139, 'blackBar');     
       
        this.spinButton = game.add.button(290, 500, 'spin',this.play,this);  
        
        game.add.sprite(30, 500, 'prize');    

        var style = {
            font: 'bold 16pt Arial',
            fill: '#1b3768',
            align: 'center'
          }
        
        this.win = game.add.text(50, 514, 'WIN: $', style);
        this.prizes = game.add.text(120, 514, '0', style);
      
        this.totalTime = 0;
           
        this.timer = game.time.events.loop(Phaser.Timer.SECOND, function(){ 
                  
                  if(this.startGame)
                  {                       
                        this.totalTime++;
                  }

        },this);
       
    },
   
    update:function(){     

        if(this.startGame)
        {                    
            this.reel1Paused = false;   
            this.reel2Paused = false;    
            this.reel3Paused = false; 
            
           if(this.totalTime<=2)
           {              
                this.spinButton.inputEnabled = false; 
                 
                this.moveReel(this.reel1,9);
                this.respawnReel(this.reel1);

                this.moveReel(this.reel2,9);
                this.respawnReel(this.reel2);                                             

                this.moveReel(this.reel3,9);               
                this.respawnReel(this.reel3);              
           }
           else
           {               
                    this.reel1Paused = this.reelManager(this.reel1,result.stopPoints,0,31,9,this.reel1Paused);                

                if(this.reel1Paused)
                {
                    this.reel2Paused = this.reelManager(this.reel2,result.stopPoints,1,31,9,this.reel2Paused);
                }
                else
                {
                    this.moveReel(this.reel2,9);
                    this.respawnReel(this.reel2);
                }

                if(this.reel1Paused && this.reel2Paused)
                {
                    this.reel3Paused = this.reelManager(this.reel3,result.stopPoints,2,31,9,this.reel3Paused);
                }
                else
                {
                    this.moveReel(this.reel3,9);
                    this.respawnReel(this.reel3);
                }                

                if(this.reel1Paused && this.reel2Paused && this.reel3Paused)
                {    
                    this.spinButton.inputEnabled = true; 
                    this.spinButton.frame = 0; 
                    this.showWinnerPaylines(result.stopPoints); 
                    this.prizes.text = result.winnings;
                }
           }           
        }      
    },

    play:function()
    {
        this.startGame = true;       

        this.totalTime = 0;
        this.prizes.text = 0;
        this.spinButton.frame = 1; 
        this.hideAllPayLines();      

        result = wrapper.spin();        
        console.log(result); 
        
    },
   
    reelManager:function(reel,sp,spIndex,y,veloc,reelPaused)
    {
       var reelPausedAux;
    
        if(reel[sp[spIndex]].y !== y) //se mueve
        {
            this.moveReel(reel,veloc);
            this.respawnReel(reel);
        }
        else //frena
        {        
            reelPaused = true;       
            reelPausedAux = reelPaused;          
            this.moveReel(reel,0);
        }
        
        return reelPausedAux;
    
    },

    respawnReel:function(reeL)
    {      
        for(var i=0; i<reeL.length; i++)
        {                   
            if(reeL[i].y >= 460)
            {                
                reeL[i].y = -2417;//vuelve a la posicion Y donde se origina el reel               
            }                       
        }   
    },

    moveReel:function(numReel,veloc)
    { 
        for(var i=0; i<numReel.length; i++)
        {
            numReel[i].y += veloc;             
        }
    },

    setIcon:function(reelArray,x,y,sep)
    {        
        var posX, posY;     
        var auxArr = [];
            
        for(var i = 0; i < reelArray.length; i++) 
        {            
            if(i === 0)
            {               
                posX = x;                    
                posY = y;                  
            }
            else
            {
                posX = x;
                posY += sep;
            }          

            if(reelArray[i] === 'a')//trebol
            {
                this.clover = game.add.sprite(posX, posY, 'clover');   
                auxArr[i] = this.clover;                     
            }

            if(reelArray[i] === 'b')//campana
            {
                this.bell = game.add.sprite(posX, posY, 'bell');          
                auxArr[i] = this.bell;               
            }

            if(reelArray[i]  === 'c')//frutilla
            {
                this.strawberry = game.add.sprite(posX, posY, 'strawberry');               
                auxArr[i] = this.strawberry;             
            }

            if(reelArray[i]  === 'd')//uva
            {
                this.grapes = game.add.sprite(posX, posY, 'grapes');             
                auxArr[i] = this.grapes;          
            }

            if(reelArray[i]  === 'e')//cereza
            {
                this.cherry = game.add.sprite(posX, posY, 'cherry'); 
                auxArr[i] = this.cherry;         
            }                
         
        } 

        return auxArr;

    },
     
   
    showWinnerPaylines:function(sp)
    {
            var layout = wrapper.getGridLayout(sp);        
            var prize;
            
            for(var i = 0; i < Wrapper.PAYLINES.length; i++)
	        {
                    prize = wrapper.getLinePrize(i, layout);
                   
                    if(prize !== null)//si hay premio
                    {                       
                        if(prize.lineId === 0)//hor medio
                        {                                
                            this.lines[0].visible = true;
                        }

                        if(prize.lineId === 1)//arriba hor
                        {                                
                            this.lines[1].visible = true;
                        }

                        if(prize.lineId === 2)//abajo hor
                        {                                
                            this.lines[2].visible = true;
                        }
                                        
                        if(prize.lineId === 3)//diagonal Des
                        {                              
                            this.lines[3].visible = true;
                        }

                        if(prize.lineId === 4)//diagonal Asc
                        {                                
                            this.lines[4].visible = true;
                        }
                    
                    }
	        }        
      
    },

    hideAllPayLines:function()
    {            
        for(var i=0; i<this.lines.length; i++)
        {
            this.lines[i].visible = false;
        }

    },    
    
}

var wrapper = new Wrapper();
var game = new Phaser.Game(490, 570, Phaser.CANVAS);

game.state.add("gameplay", GamePlayManager);
game.state.start("gameplay");