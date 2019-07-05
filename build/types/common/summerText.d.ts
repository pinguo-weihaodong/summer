interface SummerTextInterface {
    canvasEl: string | CanvasRenderingContext2D;
    text: string;
    maxUnit?: number;
    minSize?: number;
    maxSize?: number;
    maxLine?: number;
    fontWeight?: string | number;
    lastLineLeastNum?: number;
}
export default class SummerText {
    ctx: CanvasRenderingContext2D;
    text: string;
    maxLine: number;
    maxUnit: number;
    minSize: number;
    maxSize: number;
    fontWeight: number | string;
    lastLineLeastNum: number;
    constructor(info: SummerTextInterface);
    getTextWidth(fontSize: number): number;
    getTextHeight(lineHeight: number): number;
    drawText(x: number, y: number, color: string, fontSize: number, lineHeight: number): void;
    wordLineFormat(): {
        ratio: number;
        size: number;
        wordsList: any[];
    };
    reSplitWordsByLine(text: string, lastLineLeastNum?: number, maxUnit?: number): any[];
    omitLongWords(text: string, maxUnit?: number): {
        text: string;
        width: number;
    };
    splitWords(text: string): any;
    splitWordsByReturn(text: string): string[];
    getTextUnitWidth(text: string, fontWeight?: number | string): number;
}
export {};
//# sourceMappingURL=summerText.d.ts.map