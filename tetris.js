const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = 'red';
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        resetPlayer();
        if (blocksToFormText.length > 0) {
            player.matrix = blocksToFormText.shift();
            player.pos.y = 0;
            player.pos.x = Math.floor((arena[0].length / 2) - (player.matrix[0].length / 2));
        } else {
            gameOver = true;
        }
    }
    dropCounter = 0;
}

function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function rotate(matrix) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    matrix.forEach(row => row.reverse());
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    draw();
    if (!gameOver) {
        requestAnimationFrame(update);
    }
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function resetPlayer() {
    player.matrix = createPiece();
    player.pos.y = 0;
    player.pos.x = Math.floor((arena[0].length / 2) - (player.matrix[0].length / 2));
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        gameOver = true;
    }
}

function createPiece() {
    const pieces = [
        [[1, 1, 1],
         [0, 1, 0]],
        [[1, 1],
         [1, 1]],
        [[0, 1, 1],
         [1, 1, 0]],
        [[1, 1, 0],
         [0, 1, 1]],
        [[1, 1, 1, 1]]
    ];
    return pieces[Math.floor(Math.random() * pieces.length)];
}

const arena = createMatrix(12, 20);
const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
};

const blocksToFormText = [
    // S
    [[1, 1, 1],
     [1, 0, 0],
     [1, 1, 1],
     [0, 0, 1],
     [1, 1, 1]],

    // T
    [[1, 1, 1],
     [0, 1, 0],
     [0, 1, 0],
     [0, 1, 0],
     [0, 1, 0]],

    // A
    [[0, 1, 0],
     [1, 0, 1],
     [1, 1, 1],
     [1, 0, 1],
     [1, 0, 1]],

    // C
    [[0, 1, 1],
     [1, 0, 0],
     [1, 0, 0],
     [1, 0, 0],
     [0, 1, 1]],

    // K
    [[1, 0, 1],
     [1, 1, 0],
     [1, 0, 0],
     [1, 1, 0],
     [1, 0, 1]],

    // M
    [[1, 0, 0, 1],
     [1, 1, 1, 1],
     [1, 0, 0, 1],
     [1, 0, 0, 1],
     [1, 0, 0, 1]],

    // O
    [[0, 1, 0],
     [1, 0, 1],
     [1, 0, 1],
     [1, 0, 1],
     [0, 1, 0]],

    // X
    [[1, 0, 1],
     [1, 0, 1],
     [0, 1, 0],
     [1, 0, 1],
     [1, 0, 1]],

    // I
    [[1],
     [1],
     [1],
     [1],
     [1]],

    // E
    [[1, 1, 1],
     [1, 0, 0],
     [1, 1, 1],
     [1, 0, 0],
     [1, 1, 1]]
];

let gameOver = false;

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 38) {
        rotate(player.matrix);
    }
});

resetPlayer();
update();

