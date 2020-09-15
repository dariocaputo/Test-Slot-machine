GamePlayManager = {
   
    init:function(){
       
            
        this.moveFlag = false;
        
    

    }, 
   
    preload:function(){
      
        
        game.load.image('fondoSlot', 'assets/images/fondoSlot.png'); 
        game.load.image('marcoSlot', 'assets/images/marcoSlot.png');
        game.load.image('blackBar', 'assets/images/black_bar.png');

        game.load.image('spin', 'assets/images/btn_spin.png');
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
      
        this.reel1 = Wrapper.REELS[0];
        this.reel2 = Wrapper.REELS[1];
        this.reel3 = Wrapper.REELS[2];
      
      
        //reels con los iconos
       this.r1 = this.setIcon(this.reel1,29,-2417,144); 
       this.r2 = this.setIcon(this.reel2,175,-2417,144);
       this.r3 = this.setIcon(this.reel3,320,-2417,144);          
      
     
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
        
        this.spinButton = game.add.button(290, 500, 'spin');      
       
        game.add.sprite(30, 500, 'prize');    

        var style = {
            font: 'bold 16pt Arial',
            fill: '#1b3768',
            align: 'center'
          }
        
        this.win = game.add.text(50, 514, 'WIN: $', style);
        this.prizes = game.add.text(120, 514, '0', style);
      
       
            
   


    },
   
    update:function(){
     
        this.spinButton.events.onInputDown.add(this.play,this);               
      

        if(this.moveFlag)
        {
            this.moveReel(this.r1,6);
            this.moveReel(this.r2,6);
            this.moveReel(this.r3,6);

            this.respawnReel(this.r1);
            this.respawnReel(this.r2);
            this.respawnReel(this.r3);
        }

    
    
     

 
    },


    play:function()
    {
        this.moveFlag = true;
        this.hideAllPayLines();        
        
        var result = {};
        result = wrapper.spin();        
        this.showWinnerPaylines(result.stopPoints);     
      
        this.prizes.text = result.winnings;
        console.log(result);


    },
   
  

 

    respawnReel:function(reeL)
    {      
        for(var i=0; i<reeL.length; i++)
        {           
          
            if(reeL[i].y > 460)
            {
                reeL[i].visible = false;
                reeL[i].y = -2417;//vuelve a la posicion Y donde se origina el reel
                reeL[i].visible = true;
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

        for(var i = 0; i < reelArray.length; i++) //preparo el reel y se dibuja en pantalla al inicio
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

