interface ICell {
    row: number;
    col: number;
}


interface ISelectedCell {
    startCell: ICell | null;
    endCell: ICell | null;
}