interface PosInterface {
    bot: number;
}
interface BackgroundInterface {
    color?: string;
    image?: string;
    mode?: 'fill' | 'cover' | 'contain';
}
interface DependOnInterface {
    id: string;
    direction: 'cross' | 'vertical';
    margin: number;
}
interface LastItemInterface {
    margin: number;
}
interface ItemBaseInterface {
    x?: number;
    y?: number;
    id: string;
    isGetHeight?: boolean;
    dependOn?: DependOnInterface;
    last?: LastItemInterface;
}
interface RectPathInterface extends ItemBaseInterface {
    width?: number;
    radius?: number;
    height?: number;
}
interface BoardPathInterface {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
}
interface PaddingInterface {
    left?: number;
    top?: number;
    right?: number;
    bot?: number;
}
interface SummerInterface {
    canvasId: string;
    canvasWidth: number;
    canvasHeight: number | 'auto';
    ratio?: number;
    border?: BorderInterface;
    background?: BackgroundInterface;
    radius?: number;
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[];
}
interface ImgInfoInterface {
    img: HTMLImageElement;
    width: number;
    height: number;
}
interface ImgInterface extends RectPathInterface {
    type: 'img';
    height: number;
    img: ImgInfoInterface | string;
    mode?: 'contain' | 'cover' | 'fill';
    backgroundColor?: string;
    shadow?: BoxShadowInterface;
    border?: BorderInterface;
}
interface RectInterface extends RectPathInterface {
    type: 'rect';
    border?: BorderInterface;
    background?: BackgroundInterface;
    shadow?: BoxShadowInterface;
}
interface TextInterface extends ItemBaseInterface {
    type: 'text';
    text: string;
    width?: number;
    fontSize?: number;
    lineHeight?: number;
    maxLine?: number;
    lastLineLeastNum?: number;
    color?: string;
    background?: BackgroundInterface;
    radius?: number;
    border?: BorderInterface;
    padding?: PaddingInterface;
    fontWeight?: 'normal' | 'lighter' | 'bold' | number;
    textAlign?: 'left' | 'center' | 'right' | 'start' | 'end';
}
interface WrapInterface extends ItemBaseInterface {
    type: 'wrap';
    width?: number;
    height?: number | 'auto';
    background?: BackgroundInterface;
    radius?: number;
    padding?: number;
    border?: BorderInterface;
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[];
}
interface BoxShadowInterface {
    color?: string;
    offsetX?: number;
    offsetY?: number;
    blur?: number;
}
interface BorderInterface {
    width: number;
    color: string;
}
interface TaskInfoInterface extends ItemBaseInterface {
    height?: number | 'auto';
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[];
    runLength: number;
    runWaitLength: number;
    waitQueue: (ImgInterface | RectInterface | TextInterface | WrapInterface)[];
    runQueue: (ImgInterface | RectInterface | TextInterface | WrapInterface)[];
    done: Function;
    setWrapHeight: Function;
}
export default class Summer {
    ratio: number;
    canvas: HTMLCanvasElement;
    canvasWidth: number;
    canvasHeight: (number | 'auto');
    ctx: CanvasRenderingContext2D;
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[];
    border: BorderInterface | undefined;
    radius: number | undefined;
    background: BackgroundInterface | undefined;
    constructor(options: SummerInterface);
    draw(callback: Function): void;
    drawWrap(info: WrapInterface): Promise<PosInterface>;
    checkWaitQueue(taskInfo: TaskInfoInterface, prevTask: (ImgInterface | RectInterface | TextInterface | WrapInterface), pos: {
        bot: number;
    }): void;
    runTask(taskInfo: TaskInfoInterface, currentTask: (ImgInterface | RectInterface | TextInterface | WrapInterface)): void;
    drawImg(info: ImgInterface): Promise<PosInterface>;
    drawRect(info: RectInterface): Promise<PosInterface>;
    drawText(info: TextInterface): Promise<PosInterface>;
    drawBoxShadow(shadow: BoxShadowInterface, info: BoardPathInterface): void;
    drawBoxBorder(border: BorderInterface, info: BoardPathInterface): void;
    drawBoardPath(info: BoardPathInterface): void;
    setShadow(shadow: BoxShadowInterface): void;
    getImgInfo(imgUrl: string): Promise<ImgInfoInterface>;
}
export {};
//# sourceMappingURL=summer.d.ts.map