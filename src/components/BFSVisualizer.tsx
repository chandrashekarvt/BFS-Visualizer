import React, { useEffect, useState } from "react";
import { CELL_GAP, CELL_SIZE, ROWS } from "../contants";
import { runBFS, waitMs } from "../utils";
import { Helmet } from 'react-helmet'
import '../styles/BFSVisualizer.scss'

function BFSVisualizer() {
    const [cellsPerRow, setCellsPerRow] = useState(0);
    const [selectedCells, setSelectedCells] = useState<ISelectedCell>({ startCell: null, endCell: null })
    const [allColoredCells, setAllColoredCells] = useState<string[]>([]);
    const [coloredCells, setColoredCells] = useState<Set<string>>(new Set());
    const [allowReset, setAllowReset] = useState(false);

    let gridRef: HTMLDivElement;

    useEffect(() => {
        let resizeObserver = new ResizeObserver(([entry]) => {
            let gridWidth = entry.contentRect.width;
            let cellSize = CELL_SIZE;
            cellSize += 2;
            let possible = Math.floor(gridWidth / cellSize);
            gridWidth -= CELL_GAP * possible - 1; //Handling cell gap
            possible = Math.floor(gridWidth / cellSize);
            setCellsPerRow(possible)
        })
        resizeObserver.observe(gridRef as HTMLDivElement)
    }, [])

    useEffect(() => {
        if (allColoredCells.length > 0) {
            updateColoredCells()
        }
    }, [allColoredCells])

    const updateColoredCells = async () => {
        await waitMs(0.1);
        let prev = new Set(coloredCells);
        let allCells = [...allColoredCells];
        if (allCells.length > 0) {
            prev.add(allCells.shift()!);
            setAllColoredCells(allCells);
            setColoredCells(prev);
        }
        if (allCells.length === 0) setAllowReset(true);
    }

    const onClickReset = () => {
        setSelectedCells({ startCell: null, endCell: null })
        setAllColoredCells([]);
        setColoredCells(new Set());
        setAllowReset(false);
    }

    const onClickCell = (cell: ICell) => {
        const { startCell, endCell } = selectedCells;
        if (!startCell) setSelectedCells({ ...selectedCells, startCell: cell })
        else if (!endCell && !(startCell.row === cell.row && startCell.col === cell.col)) setSelectedCells({ ...selectedCells, endCell: cell })
    }

    const onClickRunBFS = async () => {
        const { startCell, endCell } = selectedCells;
        let cells = Array.from(runBFS(startCell!, endCell!, ROWS, cellsPerRow));
        setAllColoredCells(cells.map((cell) => `${cell.row}:${cell.col}`))
    }

    let cells: ICell[] = [...new Array(cellsPerRow * ROWS)].map((_, index) => {
        let row = Math.floor(index / cellsPerRow);
        let col = Math.floor(index % cellsPerRow);
        return {
            row,
            col
        } as ICell;
    });

    const { startCell, endCell } = selectedCells;
    let readyForBFS = startCell && endCell;
    return (
        <div className="bfs-visualizer">
            <Helmet>
                <body className="bfs-visualizer-body"></body>
            </Helmet>
            <h2 style={{ color: 'white' }}>BFS Visualizer</h2>
            <div className="grid-container" ref={(node: HTMLDivElement) => gridRef = node}>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${cellsPerRow}, 1fr)`, columnGap: CELL_GAP }}>
                    {cells.map((cell) => {
                        let isStartCell = cell.row === startCell?.row && cell.col === startCell?.col;
                        let isEndCell = cell.row === endCell?.row && cell.col === endCell?.col;
                        let coloredCell = coloredCells.has(`${cell.row}:${cell.col}`)
                        return (
                            <div key={`${cell.row}-${cell.col}`}
                                onClick={() => onClickCell(cell)}
                                style={{
                                    height: CELL_SIZE,
                                    width: CELL_SIZE,
                                    cursor: !readyForBFS ? 'pointer' : 'unset'
                                }} className={`grid-cell ${isStartCell ? "start-cell" : isEndCell ? "end-cell" : coloredCell ? "colored-cell" : ""}`}>
                            </div>
                        )
                    })}
                </div>
            </div>
            {readyForBFS &&
                <button className="run-bfs-btn" onClick={!allowReset ? onClickRunBFS : onClickReset} >{allowReset ? "Reset" : "Run BFS"}</button>}
        </div>
    )
}


export default BFSVisualizer;