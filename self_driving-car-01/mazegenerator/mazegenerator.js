

// empty cell
const CELL_EMPTY = 0;

// full cell
// ._.
// |X|
// .-.
const CELL_FULL = 1;

// right right
//   .
//  /|
// .-.
const CELL_RIGHT_RIGHT = 2;

// right left
// ._.
// |/
// .
const CELL_RIGHT_LEFT = 3;

// left right
// .-.
//  \|
//   .
const CELL_LEFT_RIGHT = 4;

// left left
// .
// |\
// ._.
const CELL_LEFT_LEFT = 5;

const DEBUG_MAZE_GENERATION = false;


//function 'createMazePath' - returns an array of with a maze path
//param 'width' - the width of the maze
//param 'height' - the height of the maze
//param 'initialPeriod' - the initial period of generation (in height axis)
//param 'deltaFactor' - the delta factor applied to the maximum possible turn
function createMazePath(width, height, initialPeriod, deltaFactor) 
{
    // check init period is multiple
    if ((height - 1) % initialPeriod != 0)
        throw "height must be a multiple of initialPeriod + 1";
    
    if (!isPowerOfTwo(initialPeriod))
        throw "Period must be a power of two";

    // Init empty maze
    let mazeHoles = new Array(height);
    for (let y = 0; y < height; y++)
    {
        mazeHoles[y] = -1;
    } 
    

    // Init initial holes
    // NB: reverse order to start in the middle
    let maxOffset = Math.floor(Math.min(initialPeriod, width - 1) * deltaFactor);
    let holePosition = Math.floor(width / 2);
    for (let y = height - 1; y >= 0; y -= initialPeriod)
    {
        // set hole
        //maze[y][holePosition] = CELL_EMPTY;
        mazeHoles[y] = holePosition;
        
        // compute next hole position
        let offset = Math.floor((Math.random() * (2 * maxOffset + 1)) - maxOffset);
        //console.log("offset " + offset);
        if (holePosition + offset < 0)
            holePosition = 0;
        else if (holePosition + offset >= width)
            holePosition = width - 1;
        else
            holePosition = holePosition + offset;
    }

    let period = initialPeriod ;

    // fine tune the maze
    while (period > 1)
    {
        period = period / 2;
        tuneMaze(mazeHoles, width, height, period, deltaFactor);
    }

    //console.log(mazeHoles);

    if (DEBUG_MAZE_GENERATION)
        drawMazeHoles(mazeHoles, width, height);

    return mazeHoles;
}

function tuneMaze(mazeHoles, width, height, period, deltaFactor)
{
    let maxOffset = Math.floor(Math.min(period, width - 1) * deltaFactor);
 
    //console.log("Period = " + period + " max offset = " + maxOffset);

    for (let y = period; y < height; y += 2 * period)
    {
        let previousHole = mazeHoles[y - period];
        let nextHole = mazeHoles[y + period];

        if (previousHole < 0)
            throw "negative previous hole (period=" + period + " y=" + y + ")";
        if (nextHole < 0)
            throw "negative next hole (period=" + period + " y=" + y + ")";

        // compute intersection of possible hole position in offset
        let minForPrevious = previousHole - maxOffset;
        let maxForPrevious = previousHole + maxOffset;
        let minForNext = nextHole - maxOffset;
        let maxForNext = nextHole + maxOffset;
        let minHolePos = Math.max(minForPrevious, minForNext, 0);
        let maxHolePos = Math.min(maxForPrevious, maxForNext, width - 1);
        
        let holePosition = randomIntFromInterval(minHolePos, maxHolePos);
        //console.log( y + " => " + holePosition);
        // set hole
        mazeHoles[y] = holePosition;
    }  
}

function drawMazeHoles(mazeHoles, width, height)
{
    for (let y = 0; y < height; y ++)
    {
        let line = "|";
        for (let x = 0; x < mazeHoles[y]; x++)
            line += "#";
        line += " ";
        for (let x = mazeHoles[y] + 1; x < width; x++)
            line += "#";
        line += "|";
        console.log(line);
    }
}

function buildMazeFormMazeFromPaths(mazeHolesArray, width, height)
{
    let pathLen = mazeHolesArray.length;
    //console.log("pathLen " + pathLen);

    // Init point maze
    // points are like the vertices of the final maze
    let pointMaze = new Array(height);
    for (let y = 0; y < height; y++)
    {
        pointMaze[y] = new Array(width);
        for (let x = 0; x < width; x++)
        {
            pointMaze[y][x] = 1;
        }

        // Add empty cells for line from maze holes
        for (let pathIndex = 0; pathIndex < pathLen; pathIndex++)
        {
            let mazeHoles = mazeHolesArray[pathIndex];
            pointMaze[y][mazeHoles[y]] = 0;
        }
    }
    if (DEBUG_MAZE_GENERATION)
        drawPointMaze(pointMaze);

    // merge point maze into polyons (triangles and squares)
    let maze = new Array(height - 1);
    for (let y = 0; y < height - 1; y++)
    {
        maze[y] = new Array(width - 1);
        for (let x = 0; x < width - 1; x++)
        {
            maze[y][x] = CELL_FULL;

            if (pointMaze[y][x] > 0)
            {
                if (pointMaze[y][x + 1] > 0)
                {
                    if (pointMaze[y + 1][x] > 0)
                    {
                        if (pointMaze[y + 1][x + 1] > 0)
                        {
                            maze[y][x] = CELL_FULL;
                        }
                        else
                        {
                            maze[y][x] = CELL_RIGHT_LEFT;
                        }
                    }
                    else
                    {
                        if (pointMaze[y + 1][x + 1] > 0)
                        {
                            maze[y][x] = CELL_LEFT_RIGHT;
                        }
                        else
                        {
                            maze[y][x] = CELL_EMPTY;
                        }
                    }
                }
                else
                {
                    if (pointMaze[y + 1][x] > 0)
                    {
                        if (pointMaze[y + 1][x + 1] > 0)
                        {
                            maze[y][x] = CELL_LEFT_LEFT;
                        }
                        else
                        {
                            maze[y][x] = CELL_EMPTY;
                        }
                    }
                    else
                    {
                        maze[y][x] = CELL_EMPTY;
                    }
                }
            }
            else
            {
                if (pointMaze[y][x + 1] > 0)
                {
                    if (pointMaze[y + 1][x] > 0)
                    {
                        if (pointMaze[y + 1][x + 1] > 0)
                        {
                            maze[y][x] = CELL_RIGHT_RIGHT;
                        }
                        else
                        {
                            maze[y][x] = CELL_EMPTY;
                        }
                    }
                    else
                    {
                        maze[y][x] = CELL_EMPTY;
                    }
                }
                else
                {
                    maze[y][x] = CELL_EMPTY;
                }
            }
        } 
    }

    if (DEBUG_MAZE_GENERATION)
        drawMaze(maze);

    return maze;
}

/*
function drawPointMaze

| ####### #| 
|# #####  #| 
|## ### # #| 
|### # # ##| 
|#### # ###| 
|#####  ###| 
|##### ####|
//*/
function drawPointMaze(maze)
{
    let height = maze.length;
    for (let y = 0; y < height; y ++)
    {
        let width = maze[y].length;
        let line = "|";
        for (let x = 0; x < width; x++)
        {
            if (maze[y][x] > 0)
                line += "#";
            else
                line += " ";
        }
        line += "|";
        console.log(line);
    }
}

/*
function drawMaze

| \####/  | mazegenerator.js:322:9
|\ \##/   | mazegenerator.js:322:9
|#\ \/   /| mazegenerator.js:322:9
|##\    /#| mazegenerator.js:322:9
|###\   ##| mazegenerator.js:322:9
|####  /##|
//*/
function drawMaze(maze)
{
    let height = maze.length;
    for (let y = 0; y < height; y ++)
    {
        let width = maze[y].length;
        let line = "|";
        for (let x = 0; x < width; x++)
        {
            if (maze[y][x] == CELL_FULL)
                line += "#";
            else if (maze[y][x] == CELL_LEFT_LEFT)
                line += "\\";
            else if (maze[y][x] == CELL_LEFT_RIGHT)
                line += "\\";
            else if (maze[y][x] == CELL_RIGHT_RIGHT)
                line += "/";
            else if (maze[y][x] == CELL_RIGHT_LEFT)
                line += "/";
            else
                line += " ";
        }
        line += "|";
        console.log(line);
    }
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function isPowerOfTwo(n) 
{
    return n && (n & (n - 1)) === 0;
}

