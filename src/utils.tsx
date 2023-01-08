const x = [0, 1, 0, -1];
const y = [1, 0, -1, 0];


const isSafe = (row: number, col: number, rows: number, columns: number) => {
    return row >= 0 && row < rows && col >= 0 && col < columns;
}

export function* runBFS(startCell: ICell, endCell: ICell, rows: number, columns: number) {

    let queue = [];

    let visited = [...new Array(rows)].map(() => [...new Array(columns)]);

    visited.forEach((_, row) => _.forEach((_, col) => visited[row][col] = false))

    queue.push(startCell);

    let pathFound: boolean = false;

    while (queue.length > 0) {

        let currCell: ICell = queue.shift()!;
        yield currCell;

        if (currCell.row === endCell.row && currCell.col === endCell.col) {
            pathFound = true;
            break;
        }
        for (let index = 0; index < 4; index++) {
            let nRow: number = currCell.row + x[index];
            let nCol: number = currCell.col + y[index];
            if (isSafe(nRow, nCol, rows, columns)) {
                if (!visited[nRow][nCol]) {
                    // yield { row: nRow, col: nCol };
                    visited[nRow][nCol] = true;
                    queue.push({ row: nRow, col: nCol });
                }
            }
        }
    }

    if (pathFound) {
        console.log("Path found :)");
    } else {
        console.log("No path found :(")
    }

}



export const waitMs = (ms: number) => {
    return new Promise<void>((resolve, _) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}