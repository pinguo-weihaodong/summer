import SummerText from './summerText';

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
    height?: number
    radius?: number
}
interface BoardPathInterface {
    x: number
    y: number
    width: number
    height: number
    radius: number
}
interface GroundInterface {
    radius?: number
    color?: string
    border?: BorderInterface
}
interface SummerInterface {
    canvasId: string
    canvasWidth: number
    canvasHeight: number | 'auto'
    ground?: GroundInterface
    ratio?: number
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
}
interface ImgInfoInterface {
    img: HTMLImageElement
    width: number
    height: number
}
interface ImgInterface extends RectPathInterface {
    type: 'img'
    img: ImgInfoInterface | string
    mode?: 'contain' | 'cover' | 'fill'
    backgroundColor?: string
    shadow?: BoxShadowInterface
    border?: BorderInterface
}
interface RectInterface extends RectPathInterface {
    type: 'rect'
    border?: BorderInterface
    backgroundColor: string | CanvasGradient | CanvasPattern
    shadow?: BoxShadowInterface
}
interface TextInterface extends ItemBaseInterface {
    type: 'text'
    text: string
    width?: number
    fontSize?: number
    lineHeight?: number
    lastLineLeastNum?: number
    color?: string
    fontWeight?: 'normal' | 'lighter' | 'bold' | number
    textAlign?: 'left' | 'center' | 'right' | 'start' | 'end'
}
interface WrapInterface extends ItemBaseInterface {
    type: 'wrap'
    width?: number
    color?: string
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

export default class Summer {

    ratio: number
    canvas: HTMLCanvasElement
    canvasWidth: number
    canvasHeight: (number | 'auto') = 'auto'
    ctx: CanvasRenderingContext2D
    tasks: (ImgInterface | RectInterface | TextInterface | WrapInterface)[]
    ground: GroundInterface | undefined

    constructor(options: SummerInterface) {
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.ratio = options.ratio || 1
        this.canvasWidth = options.canvasWidth
        this.canvas.width = options.canvasWidth * this.ratio
        this.canvasHeight = options.canvasHeight
        this.ground = options.ground
        this.tasks = options.tasks
    }

    runLength: number = 0
    runQueue: (ImgInterface | RectInterface | TextInterface | WrapInterface)[] = []
    waitQueue: (ImgInterface | RectInterface | TextInterface | WrapInterface)[] = []
    endCallback: Function = ()=>{}

    draw(callback: Function) {
        this.endCallback = callback

        this.tasks.forEach((task:(ImgInterface | RectInterface | TextInterface | WrapInterface), index: number) => {
            if (task.dependOn) {
                let hasDepended = false
                this.tasks.forEach((_task:(ImgInterface | RectInterface | TextInterface | WrapInterface)) => {
                    if (task.dependOn && _task.id == task.dependOn.id) {
                        hasDepended = true
                    }
                })
                if (hasDepended) {
                    this.waitQueue.push(task)
                } else {
                    throw `元素：${task.id}\n依赖错误：不存在 id 为 ${task.dependOn.id} 的元素`;
                }
            } else {
                this.runQueue.push(task)
            }
        })

        this.drawGround()
    }

    drawGround() {
        if (this.canvasHeight == 'auto') {
            this.drawRunningQueue()
        } else {
            this.startDraw(this.canvasHeight)
            this.drawRunningQueue()
        }
    }

    drawRunningQueue() {
        const task = this.runQueue[this.runLength]
        if (task) {
            this.runTask(task)
        }
    }

    checkWaitQueue(waitQueue: any, prevTask: (ImgInterface | RectInterface | TextInterface | WrapInterface), pos: { right: number, bot: number }) {
        // console.log(prevTask, pos)
        let hasDepended = false
        waitQueue.forEach((task: (ImgInterface | RectInterface | TextInterface | WrapInterface), index: number) => {
            if (task.dependOn && prevTask.id == task.dependOn.id) {
                hasDepended = true
                let _task = Object.assign({}, task, {
                    x: task.dependOn.direction == 'cross' ? (pos.right + task.dependOn.margin) : task.x,
                    y: task.dependOn.direction == 'vertical' ? (pos.bot + task.dependOn.margin) : task.y,
                })
                // console.log(_task)
                this.runTask(_task, waitQueue)
            }
        })
        if (!hasDepended) {
            if (this.runQueue.length > this.runLength + 1) {
                this.runLength ++
                this.drawRunningQueue()
            } else {
                // console.log("---, end", this.endCallback)
                this.endCallback(this.canvas.toDataURL("image/png"), {
                    width: this.canvasWidth,
                    height: this.canvasHeight
                })
            }
        }
    }

    runTask(task: (ImgInterface | RectInterface | TextInterface | WrapInterface), waitQueue: any) {
        let _task = Object.assign({}, task,
            { isGetHeight: this.canvasHeight == 'auto'})
        switch (_task.type) {
            case 'img':
                this.drawImg(_task)
                .then((pos) => {
                    if (_task.isGetHeight && _task.last) {
                        this.startDraw(pos.bot + _task.last.margin)
                    } else {
                        this.checkWaitQueue(_task, pos)
                    }
                })
                return
            case 'text':
                let text_pos = this.drawText(_task)
                if (_task.last && _task.isGetHeight) {
                    this.startDraw(text_pos.bot + _task.last.margin)
                } else {
                    this.checkWaitQueue(_task, text_pos)
                }
                return
            case 'rect':
                let rect_pos = this.drawRect(_task)
                if (_task.last && _task.isGetHeight) {
                    this.startDraw(rect_pos.bot + _task.last.margin)
                } else {
                    this.checkWaitQueue(_task, rect_pos)
                }
                return
            case 'wrap':
                this.drawWrap(_task)
                return
            default:
                // if (_task.type) {
                //     throw `不存在 ${_task.type} 方法`
                // } else {
                    throw `task.type is not defined`
                // }
        }
    }

    startDraw(canvasHeight: number) {
        this.canvasHeight = canvasHeight
        this.canvas.height = this.canvasHeight * this.ratio
        this.canvas.style.width = this.canvasWidth + 'px'
        this.canvas.style.height = this.canvasHeight + 'px'
        if (this.ground) {
            this.drawRect({
                id: 'ground',
                type: 'rect',
                radius: this.ground.radius,
                border: this.ground.border,
                x: 0,
                y: 0,
                width: this.canvas.width,
                height: this.canvas.height,
                backgroundColor: this.ground.color || 'rgba(0,0,0,0)'
            })
        }
        this.runLength = 0
        this.drawRunningQueue()
    }

    drawWrap(info: WrapInterface) {
        console.log('info: ', info)
    }

    async drawImg(info:ImgInterface) {
        let {
            img,
            x = 0,
            y = 0,
            width = 200,
            height = 0,
            isGetHeight = false,
            radius = 0,
            mode = 'fill',
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
                right: x + width,
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
            right: (info.x || 0) + (info.width || 0),
            bot: (info.y || 0) + (info.height || 0)
        }
    }

    drawRect(info: RectInterface) {
        let {
            x = 0,
            y = 0,
            width = 50,
            height = 50,
            radius = 0,
            isGetHeight = false,
            border,
            backgroundColor,
            shadow
        } = info

        if (isGetHeight) {
            return {
                right: x + width,
                bot: y + height
            }
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

        this.drawBoardPath({ x, y, width, height, radius })
        if (backgroundColor) {
            ctx.fillStyle = backgroundColor
        }
        ctx.fill();

        if (border) {
            this.drawBoxBorder(border, { x, y, width, height, radius })
        }
        return {
            right: (info.x || 0) + (info.width || 0),
            bot: (info.y || 0) + (info.height || 0)
        }
    }

    drawText(info: TextInterface) {
        let {
            x = 0,
            y = 0,
            isGetHeight = false,
            fontWeight = 'normal',
            textAlign,
            color = '#000000',
            fontSize = 20,
            lineHeight = 20,
            lastLineLeastNum = 0,
            width = 100
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
            maxUnit: Math.floor(width / fontSize),
            fontWeight,
        })
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
            summerText.drawText(x + offsetX, y, color, fontSize, lineHeight)
        }
        return {
            right: (info.x || 0) + (info.width || 0),
            bot: (info.y || 0) + (summerText.getTextHeight(lineHeight) / ratio)
        }
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