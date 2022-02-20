(function(){
    // Inicializacion de un board de anchura y altura
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        // elementos publicos que muestra el board
        get elements(){
            var elements = this.bars.slice( ()=>bar);
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){
    // Inicializacion bola en coord x -y , con radio y en un board
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;
        this.kind = "circle";
        board.ball = this;
    }
    // metodos por defecto en bola
    self.Ball.prototype = {
        // Mover bola
        move: function(){
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        // Existe colision entre algun objeto y la bola
        collision: function(bar){
            var relative_intersect_y = (bar.y + (bar.height / 2) ) - this.y;

            var normalized_intersect_Y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_Y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        }
    }
})();

(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function(){
            this.y += this.speed;
        },
        up: function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x "+ this.x + " y: "+this.y;
        }
    }
    
})();


(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.context = canvas.getContext("2d");
    }

    self.BoardView.prototype = {

        clean: function(){
            this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
        },
        draw: function(){
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                var element = this.board.elements[i];
                draw(this.context, element);
            }
        },
        check_collisions: function(){

            for (let x = this.board.bars.length - 1; x >= 0; x--) {
                var bar = this.board.bars[x];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    // Revisa colisiones en los objetos a o b
    function hit(a, b){
        var hit = false;

        // Colision horizontal
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            // Colision vertical
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }

        // Colision de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }

        // Colision de b con a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height){
                hit = true;
            }
        }
        return hit;
    }


    function draw(context,element){

            switch(element.kind){
                case "rectangle":
                    context.fillRect(element.x, element.y, element.width, element.height);
                    break;
                case "circle":
                    context.beginPath();
                    context.arc(element.x, element.y, 10, 0, 7);
                    context.fill();
                    context.closePath();
                    break;
            }
    }
})();

var board = new Board(800, 400);
var bar2 = new Bar(20, 100, 40, 100, board);
var bar = new Bar(740, 100, 40, 100, board);
var ball = new Ball(350, 100, 10, board);
var canvas = document.getElementById('canvas', board);
var board_view = new BoardView(canvas, board);



document.addEventListener("keydown", function(ev){
    console.log(ev.key)
    if(ev.key == "ArrowUp"){
        ev.preventDefault();
        bar.up();
    }
    else if(ev.key == "ArrowDown"){
        ev.preventDefault();
        bar.down();
    }
    else if(ev.key == "w"){
        ev.preventDefault();
        bar2.up();
    }
    else if(ev.key == "s"){
        ev.preventDefault();
        bar2.down();
    }
    else if(ev.key == " "){
        ev.preventDefault();
        board.playing = !board.playing;
    }
});

board_view.draw();

window.requestAnimationFrame(controller);

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}