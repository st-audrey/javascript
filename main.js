// JavaScript source code
const Ball = function (x, y, radius) {

    this.color = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    this.direction = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 3 + 1;
    this.x = x;
    this.y = y;
    this.radius = radius;
};

Ball.prototype = {
    updatePosition: function (width, height) {
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;

        if (this.x - this.radius < 0) {

            this.x = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * -1);

        } else if (this.x + this.radius > width) {

            this.x = width - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * - 1);
        }

        if (this.y - this.radius < 0) {

            this.y = this.radius;
            this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));

        } else if (this.y + this.radius > height) {

            this.y = height - this.radius;
            this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));
        }
    }
};

var context = document.querySelector("canvas").getContext("2d");

var balls = new Array();

let x = document.documentElement.clientWidth * 0.5;
let y = document.documentElement.clientHeight * 0.5;

for (let index = 0; index < 50; index++) {
    //balls.push(new Ball(x, y, 25));
    balls.push(new Ball(x, y, Math.floor(Math.random() * 10 + 20)));
}

//Pour randomizer la taille des balles :
//exemple : Math.floor(Math.random() * 10 + 20)));


function loop() {

    window.requestAnimationFrame(loop);

    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    context.canvas.height = height;
    context.canvas.width = width;

    for (let index = 0; index < balls.length - 1; index++) {
        let ball = balls[index];
        context.fillStyle = ball.color;
        //developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/beginPath
        context.beginPath();
        //developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fill();

        ball.updatePosition(width, height);

    }

    //context.fillStyle = "#008000";
    //canvas.fillRect(x, y, largeur, hauteur);
    //context.fillRect(0, 0, 100, 100);
};

loop();