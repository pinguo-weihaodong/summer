import SummerText from './summerText';
interface PosInterface {
    bot: number
    // top: number
    // left: number
    // right: number
    // width: number
    // height: number
}
interface BackgroundInterface {
    color?: string
    image?: string
    mode?: 'fill' | 'cover' | 'contain'
}
interface DependOnInterface {
    id: string
    direction: 'cross' | 'vertical'
    margin: number
}
interface LastItemInterface {
    margin: number
}
interface ItemBaseInterface {
    x?: number
    y?: number
    id: string
    isGetHeight?: boolean
    dependOn?: DependOnInterface
    last?: LastItemInterface
}
interface RectPathInterface extends ItemBaseInterface {
    width?: number
    radius?: number
    height?: number
}
interface BoardPathInterface {
    x: number
    y: number
    width: number
    height: number
    radius: number
}
interface PaddingInterface {
    left?: number
    top?: number
    right?: number
    bot?: number
}
interface SummerInterface {
    canvasId: string
    canvasWidth: number
    canvasHeight: number | 'auto'
    ratio?: number
    border?: BorderInterface
    background?: BackgroundInterface
    radius?: number
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
}
interface ImgInfoInterface {
    img: HTMLImageElement
    width: number
    height: number
}
interface ImgInterface extends RectPathInterface {
    type: 'img'
    height: number
    img: ImgInfoInterface | string
    mode?: 'contain' | 'cover' | 'fill'
    backgroundColor?: string
    shadow?: BoxShadowInterface
    border?: BorderInterface
}
interface RectInterface extends RectPathInterface {
    type: 'rect'
    border?: BorderInterface
    background?: BackgroundInterface
    shadow?: BoxShadowInterface
}
interface TextInterface extends ItemBaseInterface {
    type: 'text'
    text: string
    width?: number
    fontSize?: number
    lineHeight?: number
    maxLine?: number
    lastLineLeastNum?: number
    color?: string
    background?: BackgroundInterface
    radius?: number
    border?: BorderInterface
    padding?: PaddingInterface
    fontWeight?: 'normal' | 'lighter' | 'bold' | number
    textAlign?: 'left' | 'center' | 'right' | 'start' | 'end'
}
interface WrapInterface extends ItemBaseInterface {
    type: 'wrap'
    width?: number
    height?: number | 'auto'
    background?: BackgroundInterface
    radius?: number
    padding?: number
    border?: BorderInterface
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
}
interface BoxShadowInterface {
    color?: string
    offsetX?: number
    offsetY?: number
    blur?: number
}
interface BorderInterface {
    width: number
    color: string
}

interface TaskInfoInterface extends ItemBaseInterface {
    height?: number | 'auto'
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
    runLength: number
    runWaitLength: number
    waitQueue: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
    runQueue: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
    done: Function
    setWrapHeight: Function
}

export default class Summer {

    ratio: number
    canvas: HTMLCanvasElement
    canvasWidth: number
    canvasHeight: (number | 'auto') = 'auto'
    ctx: CanvasRenderingContext2D
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
    border: BorderInterface | undefined
    radius: number | undefined
    background: BackgroundInterface | undefined

    constructor(options: SummerInterface) {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement
        this.ctx = this.canvas.getContext("2d")
        this.ratio = options.ratio || 1
        this.canvasWidth = options.canvasWidth
        this.canvas.width = options.canvasWidth * this.ratio
        this.canvasHeight = options.canvasHeight
        this.tasks = options.tasks
        this.border = options.border
        this.radius = options.radius
        this.background = options.background
    }

    draw(callback: Function) {
        this.drawWrap({
            id: 'canvas',
            type: 'wrap',
            height: this.canvasHeight,
            tasks: this.tasks,
            border: this.border,
            radius: this.radius,
            background: this.background,
            width: this.canvasWidth
        })
        .then((pos: PosInterface) => {
            // console.log(pos, this.canvasHeight, this.tasks)
            if (this.canvasHeight == 'auto') {
                this.canvasHeight = pos.bot
                this.canvas.height = this.canvasHeight * this.ratio
                this.canvas.style.width = this.canvasWidth + 'px'
                this.canvas.style.height = this.canvasHeight + 'px'
                this.draw(callback)
            } else {
                callback && callback(this.canvas.toDataURL("image/png"), {
                    width: this.canvasWidth,
                    height: this.canvasHeight
                })
            }
        })
    }

    drawWrap(info: WrapInterface):Promise<PosInterface> {
        // console.log(info, info.id, info.isGetHeight, info.height)
        // console.log(info.id, info.isGetHeight, info.height)
        const self = this
        return new Promise((resolve) => {
            let taskHandler = () => {
                let taskInfo:TaskInfoInterface = {
                    id: info.id,
                    tasks: [],
                    x: info.x,
                    y: info.y,
                    height: info.height,
                    runLength: 0,
                    runWaitLength: 0,
                    waitQueue: [],
                    runQueue: [],
                    setWrapHeight(pos: PosInterface) {
                        if (!info.height || info.height == 'auto') {
                            info.height = pos.bot - (info.y || 0)
                        }
                        resolve({
                            bot: info.height + (info.y || 0)
                        })
                    },
                    done() {
                        this.runWaitLength ++
                        if (this.runWaitLength >= this.waitQueue.length) {
                            resolve({
                                bot: (info.y || 0) + ((info.height != 'auto' ? info.height : 0) || 0)
                            })
                        }
                    }
                }
                taskInfo.tasks = info.tasks
                taskInfo.tasks.forEach((task:(ImgInterface | RectInterface | TextInterface | WrapInterface)) => {
                    if (task.dependOn) {
                        let hasDepended = false
                        taskInfo.tasks.forEach((_task:(ImgInterface | RectInterface | TextInterface | WrapInterface)) => {
                            if (task.dependOn && _task.id == task.dependOn.id) {
                                hasDepended = true
                            }
                        })
                        if (hasDepended) {
                            taskInfo.waitQueue.push(task)
                        } else {
                            throw `元素：${task.id}\n依赖错误：不存在 id 为 ${task.dependOn.id} 的元素`;
                        }
                    } else {
                        taskInfo.runQueue.push(task)
                    }
                })
                if (taskInfo.runQueue.length) {
                    this.runTask(taskInfo, taskInfo.runQueue[taskInfo.runLength])
                } else {
                    if (info.height && info.height != 'auto') {
                        self.drawRect({
                            id: info.id,
                            type: 'rect',
                            radius: info.radius,
                            border: info.border,
                            x: info.x,
                            y: info.y,
                            width: info.width,
                            height: info.height,
                            background: info.background
                        }).then(() => {
                            resolve({
                                bot: (info.y || 0) + ((info.height != 'auto' ? info.height : 0) || 0)
                            })
                        })
                    }
                }
            }
            if (!info.isGetHeight && info.height != 'auto') {
                this.drawRect({
                    id: info.id,
                    type: 'rect',
                    radius: info.radius,
                    border: info.border,
                    x: info.x,
                    y: info.y,
                    width: info.width,
                    height: info.height,
                    background: info.background
                })
                .then(() => {
                    if (info.id == 'canvas') {
                        // console.log(1, info.id)
                    }
                    taskHandler()
                })
            } else {
                taskHandler()
                if (info.id == 'canvas') {
                    // console.log(2, info.id)
                }
            }
        })
    }

    checkWaitQueue(taskInfo:TaskInfoInterface, prevTask: (ImgInterface | RectInterface | TextInterface | WrapInterface), pos: { bot: number }) {
        let hasDepended = false
        taskInfo.waitQueue.forEach((task: (ImgInterface | RectInterface | TextInterface | WrapInterface)) => {
            if (task.dependOn && prevTask.id == task.dependOn.id) {
                hasDepended = true
                let _task = Object.assign(task, {
                    // x: task.dependOn.direction == 'cross' ? (pos.right + task.dependOn.margin) : task.x,
                    // y: task.dependOn.direction == 'vertical' ? (pos.bot + task.dependOn.margin) : task.y,
                    y: task.dependOn.direction ? (pos.bot + task.dependOn.margin) : task.y,
                })
                this.runTask(taskInfo, _task)
            }
        })
        if (!hasDepended) {
            if (taskInfo.runQueue.length > taskInfo.runLength + 1) {
                taskInfo.runLength ++
                this.runTask(taskInfo, taskInfo.runQueue[taskInfo.runLength])
            } else {
                taskInfo.done && taskInfo.done(pos)
            }
        }
    }

    runTask(taskInfo:TaskInfoInterface, currentTask: (ImgInterface | RectInterface | TextInterface | WrapInterface)) {

        let _task = Object.assign(currentTask,
            {
                isGetHeight: (taskInfo.height == 'auto' || taskInfo.height == undefined)
            })
        
        if (_task.isGetHeight && !_task.dependOn) {
            _task = Object.assign(_task,
                {
                    x: (taskInfo.x || 0) + (currentTask.x || 0),
                    y: (taskInfo.y || 0) + (currentTask.y || 0),
                })
        }

        let taskIsLast = _task.isGetHeight && (_task.last)
        let lastTaskMargin = 0
        if (_task.last) {
            lastTaskMargin = _task.last.margin
        }
        // console.log(_task.id, taskInfo)
        // console.log(_task.id, _task.isGetHeight, _task.last, (taskInfo.runQueue.length - 1 == taskInfo.runLength))
        switch (_task.type) {
            case 'img':
                this.drawImg(_task)
                .then((img_pos) => {
                    if (taskIsLast) {
                        taskInfo.setWrapHeight({
                            bot: img_pos.bot + lastTaskMargin,
                        })
                    } else {
                        this.checkWaitQueue(taskInfo, _task, img_pos)
                    }
                })
                return
            case 'text':
                this.drawText(_task)
                .then((text_pos) => {
                    if (taskIsLast) {
                        // console.log(text_pos, _task.id)
                        taskInfo.setWrapHeight({
                            bot: text_pos.bot + lastTaskMargin,
                        })
                    } else {
                        this.checkWaitQueue(taskInfo, _task, text_pos)
                    }
                })
                return
            case 'rect':
                this.drawRect(_task)
                .then((rect_pos) => {
                    if (taskIsLast) {
                        taskInfo.setWrapHeight({
                            bot: rect_pos.bot + lastTaskMargin,
                        })
                    } else {
                        this.checkWaitQueue(taskInfo, _task, rect_pos)
                    }
                })
                return
            case 'wrap':
                this.drawWrap(_task)
                .then((wrap_pos) => {
                    if (taskIsLast) {
                        taskInfo.setWrapHeight({
                            bot: wrap_pos.bot + lastTaskMargin,
                        })
                    } else {
                        this.checkWaitQueue(taskInfo, _task, wrap_pos)
                    }
                })
                return
            default:
                // if (_task.type) {
                //     throw `不存在 ${_task.type} 方法`
                // } else {
                    throw `task.type is not defined`
                // }
        }
    }

    async drawImg(info:ImgInterface):Promise<PosInterface> {
        let {
            img,
            x = 0,
            y = 0,
            width = 200,
            height = 0,
            isGetHeight = false,
            radius = 0,
            mode = 'cover',
            backgroundColor,
            border,
            shadow
        } = info

        let imgInfo:ImgInfoInterface
        if (typeof(img) == 'string') {
            imgInfo = await this.getImgInfo(img)
        } else {
            imgInfo = img
        }

        if (height == 0) {
            height = imgInfo.height / imgInfo.width * width
            info.height = imgInfo.height / imgInfo.width * width
        }

        if (isGetHeight) {
            return {
                bot: y + height
            }
        }

        let c_ratio = this.ratio
            x *= c_ratio
            y *= c_ratio
            width *= c_ratio
            height *= c_ratio
            radius *= c_ratio

        const ctx = this.ctx

        if (shadow) {
            this.drawBoxShadow(shadow, { x, y, width, height, radius })
        }

        if (radius) {
            this.drawBoardPath({ x, y, width, height, radius })
            ctx.closePath();
            ctx.clip();
        }

        if (backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(x, y, width, height);
        }
        let iw, ih, ix, iy,
            // 是否是占满
            ratio = imgInfo.width / imgInfo.height > width / height
        
        if (mode == 'fill') {
            ctx.drawImage(imgInfo.img, x, y, width, height);
        } else if (mode == 'contain') {
            if (ratio) {
                iw = imgInfo.width
                ix = 0
                ih = imgInfo.width / width * height
                iy = (imgInfo.height - ih) / 2
            } else {
                iw = imgInfo.height * width / height
                ix = (imgInfo.width - iw) / 2
                ih = imgInfo.height
                iy = 0
            }
            ctx.drawImage(imgInfo.img, ix, iy, iw, ih, x, y, width, height);
        } else {
            if (ratio) {
                iw = imgInfo.height * width / height
                ix = (imgInfo.width - iw) / 2
                ih = imgInfo.height
                iy = 0
            } else {
                iw = imgInfo.width
                ix = 0
                ih = imgInfo.width / width * height
                iy = (imgInfo.height - ih) / 2
            }
            ctx.drawImage(imgInfo.img, ix, iy, iw, ih, x, y, width, height);
        }

        ctx.restore();

        if (border) {
            this.drawBoxBorder(border, { x, y, width, height, radius })
        }

        return {
            bot: (info.y || 0) + (info.height || 0)
        }
    }

    drawRect(info: RectInterface):Promise<PosInterface> {
        return new Promise((resolve) => {
            let {
                x = 0,
                y = 0,
                width = 50,
                height = 50,
                radius = 0,
                isGetHeight = false,
                border,
                background = {
                    color: ''
                },
                shadow
            } = info

            if (isGetHeight) {
                resolve({
                    bot: y + height
                })
            }

            let ratio = this.ratio
                x *= ratio
                y *= ratio
                width *= ratio
                height *= ratio
                radius *= ratio

            const ctx = this.ctx

            if (shadow) {
                this.drawBoxShadow(shadow, { x, y, width, height, radius })
            }
            if (background.image) {
                let _imgInfo: ImgInterface = {
                    id: info.id,
                    type: "img",
                    img: background.image,
                    x: info.x,
                    y: info.y,
                    radius: info.radius,
                    width: info.width,
                    height: (info.height || 0)
                }
                this.drawImg(_imgInfo)
                .then(() => {
                    if (border) {
                        this.drawBoxBorder(border, { x, y, width, height, radius })
                    }
                    resolve({
                        bot: (info.y || 0) + (info.height || 0)
                    })
                })
            } else {
                this.drawBoardPath({ x, y, width, height, radius })
                if (background.color) {
                    let backgroundColor = background.color.toString()
                    const _startIndex = backgroundColor.indexOf('linear(')
                    if (_startIndex > -1) {
                        const _endIndex = backgroundColor.indexOf(')')
                        const _params = backgroundColor.substring(7, _endIndex).split(",")
                        const mode = _params[0]
                        const colors = _params.slice(1)
                        let grd = ctx.createLinearGradient(x, y, x, y + height)
                        if (mode == 'to right') {
                            grd = ctx.createLinearGradient(x, y, x + width, y)
                        } else {
                        }
                        colors.forEach((color: string) => {
                            let _color = new Array()
                            color.split(" ").forEach((__colorItem) => {
                                if (__colorItem) {
                                    _color.push(__colorItem)
                                }
                            })
                            grd.addColorStop(_color[0].replace("%", "") / 100, _color[1])
                        })
                
                        ctx.fillStyle = grd
                    } else {
                        ctx.fillStyle = backgroundColor
                    }
        
                    ctx.fill()
                }

                if (border) {
                    this.drawBoxBorder(border, { x, y, width, height, radius })
                }
                resolve({
                    bot: (info.y || 0) + (info.height || 0)
                })
            }
        })
    }

    drawText(info: TextInterface):Promise<PosInterface> {
        return new Promise((resolve) => {
            let {
                x = 0,
                y = 0,
                padding = {
                    top: 0,
                    right: 0,
                    left: 0,
                    bot: 0
                },
                maxLine = 0,
                isGetHeight = false,
                fontWeight = 'normal',
                background = {
                    color: ''
                },
                textAlign,
                color = '#000000',
                fontSize = 20,
                lineHeight = 20,
                lastLineLeastNum = 0,
                width = 0
            } = info

            let ratio = this.ratio
                x *= ratio
                y *= ratio
                width *= ratio
                fontSize *= ratio
                lineHeight *= ratio

            const ctx = this.ctx

            let summerText = new SummerText({
                canvasEl: ctx,
                text: info.text,
                lastLineLeastNum,
                maxLine,
                maxUnit: Math.floor(width / fontSize),
                fontWeight,
            })
            let textHeight = (summerText.getTextHeight(lineHeight) / ratio)
            let textWidth = (width || summerText.getTextWidth(fontSize)) / ratio
            if (!isGetHeight) {
                let offsetX = 0
                ctx.textAlign = textAlign || 'left'
                switch (textAlign) {
                    case 'left':
                        offsetX = 0
                        break;
                    case 'center':
                        offsetX = width / 2
                        break;
                    case 'right':
                        offsetX = width
                        break;
                    case 'start':
                        offsetX = 0
                        break;
                    case 'end':
                        offsetX = width
                        break;
                    default:
                        offsetX = 0
                        break;
                }
                if (background.color) {
                    let _bgX = textWidth
                    switch (textAlign) {
                        case 'left':
                            _bgX = 0
                            break;
                        case 'center':
                            _bgX = - textWidth / 2
                            break;
                        case 'right':
                            _bgX = - textWidth
                            break;
                        case 'start':
                            _bgX = 0
                            break;
                        case 'end':
                            offsetX = width
                            break;
                        default:
                            _bgX = 0
                            break;
                    }

                    this.drawRect({
                        id: info.id,
                        type: 'rect',
                        radius: info.radius,
                        border: info.border,
                        x: (info.x || 0) - (padding.left || 0) + _bgX,
                        y: (info.y || 0) - (padding.top || 0),
                        width: textWidth + (padding.left || 0) + (padding.right || 0),
                        height: textHeight + (padding.top || 0) + (padding.bot || 0),
                        background: background
                    })
                    .then(() => {
                        ctx.restore()
                        summerText.drawText(x + offsetX, y + fontSize, color, fontSize, lineHeight)
                        resolve ({
                            bot: (info.y || 0) + textHeight
                        })
                    })
                } else {
                    summerText.drawText(x + offsetX, y + fontSize, color, fontSize, lineHeight)
                }
            }
            resolve ({
                bot: (info.y || 0) + textHeight
            })
        })
    }

    drawBoxShadow(shadow: BoxShadowInterface, info: BoardPathInterface) {
        const ctx = this.ctx
        const ratio = this.ratio

        ctx.fillStyle = '#ffffff'
        this.setShadow({
            offsetX: (shadow.offsetX || 0) * ratio,
            offsetY: (shadow.offsetY || 0) * ratio,
            blur: (shadow.blur || 10) * ratio,
            color: shadow.color || 'rgba(0,0,0,0.5)',
        })
        
        let { x, y, width, height, radius } = info
        this.drawBoardPath({ x, y, width, height, radius })
        ctx.fill()
        ctx.restore()

        // 清空投影
        ctx.fillStyle = 'rgba(0,0,0,0)'
        this.setShadow({})
    }

    drawBoxBorder(border: BorderInterface, info: BoardPathInterface) {
        const ctx = this.ctx
        let borderWidth = (border.width || 1) * this.ratio / 2

        this.drawBoardPath(info)
        ctx.strokeStyle = border.color || 'rgba(0,0,0,1)'
        ctx.lineWidth = borderWidth * 2
        ctx.stroke()
        ctx.restore()
    }

    drawBoardPath(info: BoardPathInterface) {
        const ctx = this.ctx
        let { x, y, width, height, radius } = info
        ctx.save()
        if (width < 2 * radius) radius = width / 2
        if (height < 2 * radius) radius = height / 2
        ctx.beginPath()
        ctx.moveTo(x + radius, y)
        ctx.arcTo(x + width, y, x + width, y + height, radius)
        ctx.arcTo(x + width, y + height, x, y + height, radius)
        ctx.arcTo(x, y + height, x, y, radius)
        ctx.arcTo(x, y, x + width, y, radius)
        ctx.closePath()
    }

    setShadow(shadow: BoxShadowInterface) {
        const ctx = this.ctx
        ctx.shadowOffsetX = shadow.offsetX || 0
        ctx.shadowOffsetY = shadow.offsetY || 0
        ctx.shadowBlur = shadow.blur || 0
        ctx.shadowColor = shadow.color || 'rgba(0,0,0,0)'
    }

    getImgInfo(imgUrl: string):Promise<ImgInfoInterface> {
        return new Promise((resolve, reject) => {
            if (imgUrl) {
                let img = new Image();
                // 允许跨域，必须放在设置src之前
                img.setAttribute("crossOrigin", "Anonymous");
                img.src = imgUrl
                img.onload = (e: any) => {
                    let { width, height } = e.currentTarget
                    resolve({
                        img: img,
                        width,
                        height
                    })
                }
                img.onerror = (err: any) => {
                    reject(err)
                }
            } else {
                reject("请传入照片地址")
            }
        })
    }
}