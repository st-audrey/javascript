const Ball = function (x, y, radius, mass, vx, vy) {

    this.color = "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
    //this.direction = Math.random() * Math.PI * 2;
    //this.speed = Math.random() * 3 + 1;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.vx = vx;
    this.vy = vy;
};

//Ball.prototype = {
//    updatePosition: function (width, height) {
//        this.x += Math.cos(this.direction) * this.speed;
//        this.y += Math.sin(this.direction) * this.speed;

//        if (this.x - this.radius < 0) {

//            this.x = this.radius;
//            this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * -1);

//        } else if (this.x + this.radius > width) {

//            this.x = width - this.radius;
//            this.direction = Math.atan2(Math.sin(this.direction), Math.cos(this.direction) * - 1);
//        }

//        if (this.y - this.radius < 0) {

//            this.y = this.radius;
//            this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));

//        } else if (this.y + this.radius > height) {

//            this.y = height - this.radius;
//            this.direction = Math.atan2(Math.sin(this.direction) * -1, Math.cos(this.direction));
//        }
//    }    
//};
function move(ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;
}

function checkWalls(ball, width, height) {
    if (ball.x + ball.radius > width) {
        ball.x = width - ball.radius;
        ball.vx *= bounce;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= bounce;
    }
    if (ball.y + ball.radius > height) {
        ball.y = height - ball.radius;
        ball.vy *= bounce;
    } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= bounce;
    }
}

function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function rotate(x, y, sin, cos, reverse) {
    return {
        x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
        y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}

function collision(ball0, ball1) {
    
    var dx = ball1.x - ball0.x;
    var dy = ball1.y - ball0.y;
    var dist = Math.sqrt(dx * dx + dy * dy);

        //collision handling
    //if (getDistance(ball0.x, ball0.y, ball1.x, ball1.y) <= ball0.radius + ball1.radius) {
    if (dist < ball0.radius + ball1.radius) {

        //calculate angle, sine, and cosin
        var angle = Math.atan2(dy, dx);
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);

        //rotate ball0's position
        var pos0 = { x: 0, y: 0 }; 
        //rotate ball1's position
        var pos1 = rotate(dx, dy, sin, cos, true);

        //rotate ball0's velocity
        var vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true);       
        //rotate ball1's velocity
        var vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);

        //collision reaction
        //with energy transfer
        //var vxTotal = vel0.x - vel1.x;
        //vel0.x = ((ball0.mass - ball1.mass) * vel0.x + 2 * ball1.mass * vel1.x) / (ball0.mass + ball1.mass);
        //vel1.x = vxTotal + vel0.x;       
        //without energy transfer
        vel0.x *= bounce;
        vel1.x *= bounce;

        //update position - to avoid objects becoming stuck together
        var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
        overlap = (ball0.radius + ball1.radius) - Math.abs(pos0.x - pos1.x);
        pos0.x += vel0.x / absV * overlap;
        pos1.x += vel1.x / absV * overlap;       

        //rotate positions back
        var pos0F = rotate(pos0.x, pos0.y, sin, cos, false);
        var pos1F = rotate(pos1.x, pos1.y, sin, cos, false);        

        //adjust positions to actual screen positions
        ball1.x = ball0.x + pos1F.x;
        ball1.y = ball0.y + pos1F.y;
        ball0.x = ball0.x + pos0F.x;
        ball0.y = ball0.y + pos0F.y;

        //rotate velocities back
        var vel0F = rotate(vel0.x, vel0.y, sin, cos, false);
        var vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
        ball0.vx = vel0F.x;
        ball0.vy = vel0F.y;
        ball1.vx = vel1F.x;
        ball1.vy = vel1F.y;
    }
}

var context = document.querySelector("canvas").getContext("2d");

var balls = new Array();

let x = document.documentElement.clientWidth * 0.5;
let y = document.documentElement.clientHeight * 0.5;

var bounce = -1.0;

for (let i = 0; i < 20; i++) {
    
    var radius = Math.floor(Math.random() * 10 + 20);
    var mass = radius;
    var vx = Math.random() * 10 - 5;
    var vy = Math.random() * 10 - 5;
    balls.push(new Ball(x, y, radius, mass, vx, vy));
}

//randomizer ball size
//ex: Math.floor(Math.random() * 10 + 20)));

var timerEnds = false;
setTimeout(function () { timerEnds = true; }, 3000);

function loop() {

    window.requestAnimationFrame(loop);

    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    context.canvas.height = height;
    context.canvas.width = width;

    for (let i = 0; i < balls.length; i++) {

        context.fillStyle = balls[i].color;
        //developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/beginPath
        context.beginPath();
        //developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
        context.arc(balls[i].x, balls[i].y, balls[i].radius, 0, Math.PI * 2);
        context.fill();
        move(balls[i])
        //ball.updatePosition(width, height);  
        checkWalls(balls[i], width, height);
    }
    if (timerEnds) {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                var ball0 = balls[i];
                var ball1 = balls[j];
                collision(ball0, ball1);
            }
        }
    }
}
    
loop();
