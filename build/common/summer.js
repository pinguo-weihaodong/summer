var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import SummerText from './summerText';
var Summer = /** @class */ (function () {
    function Summer(options) {
        this.canvasHeight = 'auto';
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ratio = options.ratio || 1;
        this.canvasWidth = options.canvasWidth;
        this.canvas.width = options.canvasWidth * this.ratio;
        this.canvasHeight = options.canvasHeight;
        this.tasks = options.tasks;
        this.border = options.border;
        this.radius = options.radius;
        this.background = options.background;
    }
    Summer.prototype.draw = function (callback) {
        var _this = this;
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
            .then(function (pos) {
            // console.log(pos, this.canvasHeight, this.tasks)
            if (_this.canvasHeight == 'auto') {
                _this.canvasHeight = pos.bot;
                _this.canvas.height = _this.canvasHeight * _this.ratio;
                _this.canvas.style.width = _this.canvasWidth + 'px';
                _this.canvas.style.height = _this.canvasHeight + 'px';
                _this.draw(callback);
            }
            else {
                callback && callback(_this.canvas.toDataURL("image/png"), {
                    width: _this.canvasWidth,
                    height: _this.canvasHeight
                });
            }
        });
    };
    Summer.prototype.drawWrap = function (info) {
        var _this = this;
        // console.log(info, info.id, info.isGetHeight, info.height)
        // console.log(info.id, info.isGetHeight, info.height)
        var self = this;
        return new Promise(function (resolve) {
            var taskHandler = function () {
                var taskInfo = {
                    id: info.id,
                    tasks: [],
                    x: info.x,
                    y: info.y,
                    height: info.height,
                    runLength: 0,
                    runWaitLength: 0,
                    waitQueue: [],
                    runQueue: [],
                    setWrapHeight: function (pos) {
                        if (!info.height || info.height == 'auto') {
                            info.height = pos.bot - (info.y || 0);
                        }
                        resolve({
                            bot: info.height + (info.y || 0)
                        });
                    },
                    done: function () {
                        this.runWaitLength++;
                        if (this.runWaitLength >= this.waitQueue.length) {
                            resolve({
                                bot: (info.y || 0) + ((info.height != 'auto' ? info.height : 0) || 0)
                            });
                        }
                    }
                };
                taskInfo.tasks = info.tasks;
                taskInfo.tasks.forEach(function (task) {
                    if (task.dependOn) {
                        var hasDepended_1 = false;
                        taskInfo.tasks.forEach(function (_task) {
                            if (task.dependOn && _task.id == task.dependOn.id) {
                                hasDepended_1 = true;
                            }
                        });
                        if (hasDepended_1) {
                            taskInfo.waitQueue.push(task);
                        }
                        else {
                            throw "\u5143\u7D20\uFF1A" + task.id + "\n\u4F9D\u8D56\u9519\u8BEF\uFF1A\u4E0D\u5B58\u5728 id \u4E3A " + task.dependOn.id + " \u7684\u5143\u7D20";
                        }
                    }
                    else {
                        taskInfo.runQueue.push(task);
                    }
                });
                if (taskInfo.runQueue.length) {
                    _this.runTask(taskInfo, taskInfo.runQueue[taskInfo.runLength]);
                }
                else {
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
                        }).then(function () {
                            resolve({
                                bot: (info.y || 0) + ((info.height != 'auto' ? info.height : 0) || 0)
                            });
                        });
                    }
                }
            };
            if (!info.isGetHeight && info.height != 'auto') {
                _this.drawRect({
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
                    .then(function () {
                    if (info.id == 'canvas') {
                        // console.log(1, info.id)
                    }
                    taskHandler();
                });
            }
            else {
                taskHandler();
                if (info.id == 'canvas') {
                    // console.log(2, info.id)
                }
            }
        });
    };
    Summer.prototype.checkWaitQueue = function (taskInfo, prevTask, pos) {
        var _this = this;
        var hasDepended = false;
        taskInfo.waitQueue.forEach(function (task) {
            if (task.dependOn && prevTask.id == task.dependOn.id) {
                hasDepended = true;
                var _task = Object.assign(task, {
                    // x: task.dependOn.direction == 'cross' ? (pos.right + task.dependOn.margin) : task.x,
                    // y: task.dependOn.direction == 'vertical' ? (pos.bot + task.dependOn.margin) : task.y,
                    y: task.dependOn.direction ? (pos.bot + task.dependOn.margin) : task.y,
                });
                _this.runTask(taskInfo, _task);
            }
        });
        if (!hasDepended) {
            if (taskInfo.runQueue.length > taskInfo.runLength + 1) {
                taskInfo.runLength++;
                this.runTask(taskInfo, taskInfo.runQueue[taskInfo.runLength]);
            }
            else {
                taskInfo.done && taskInfo.done(pos);
            }
        }
    };
    Summer.prototype.runTask = function (taskInfo, currentTask) {
        var _this = this;
        var _task = Object.assign(currentTask, {
            isGetHeight: (taskInfo.height == 'auto' || taskInfo.height == undefined)
        });
        if (_task.isGetHeight && !_task.dependOn) {
            _task = Object.assign(_task, {
                x: (taskInfo.x || 0) + (currentTask.x || 0),
                y: (taskInfo.y || 0) + (currentTask.y || 0),
            });
        }
        var taskIsLast = _task.isGetHeight && (_task.last);
        var lastTaskMargin = 0;
        if (_task.last) {
            lastTaskMargin = _task.last.margin;
        }
        // console.log(_task.id, taskInfo)
        // console.log(_task.id, _task.isGetHeight, _task.last, (taskInfo.runQueue.length - 1 == taskInfo.runLength))
        switch (_task.type) {
            case 'img':
                this.drawImg(_task)
                    .then(function (img_pos) {
                    if (taskIsLast) {
                        taskInfo.setWrapHeight({
                            bot: img_pos.bot + lastTaskMargin,
                        });
                    }
                    else {
                        _this.checkWaitQueue(taskInfo, _task, img_pos);
                    }
                });
                return;
            case 'text':
                this.drawText(_task)
                    .then(function (text_pos) {
                    if (taskIsLast) {
                        // console.log(text_pos, _task.id)
                        taskInfo.setWrapHeight({
                            bot: text_pos.bot + lastTaskMargin,
                        });
                    }
                    else {
                        _this.checkWaitQueue(taskInfo, _task, text_pos);
                    }
                });
                return;
            case 'rect':
                this.drawRect(_task)
                    .then(function (rect_pos) {
                    if (taskIsLast) {
                        taskInfo.setWrapHeight({
                            bot: rect_pos.bot + lastTaskMargin,
                        });
                    }
                    else {
                        _this.checkWaitQueue(taskInfo, _task, rect_pos);
                    }
                });
                return;
            case 'wrap':
                this.drawWrap(_task)
                    .then(function (wrap_pos) {
                    if (taskIsLast) {
                        taskInfo.setWrapHeight({
                            bot: wrap_pos.bot + lastTaskMargin,
                        });
                    }
                    else {
                        _this.checkWaitQueue(taskInfo, _task, wrap_pos);
                    }
                });
                return;
            default:
                // if (_task.type) {
                //     throw `不存在 ${_task.type} 方法`
                // } else {
                throw "task.type is not defined";
            // }
        }
    };
    Summer.prototype.drawImg = function (info) {
        return __awaiter(this, void 0, void 0, function () {
            var img, _a, x, _b, y, _c, width, _d, height, _e, isGetHeight, _f, radius, _g, mode, backgroundColor, border, shadow, imgInfo, c_ratio, ctx, iw, ih, ix, iy, 
            // 是否是占满
            ratio;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        img = info.img, _a = info.x, x = _a === void 0 ? 0 : _a, _b = info.y, y = _b === void 0 ? 0 : _b, _c = info.width, width = _c === void 0 ? 200 : _c, _d = info.height, height = _d === void 0 ? 0 : _d, _e = info.isGetHeight, isGetHeight = _e === void 0 ? false : _e, _f = info.radius, radius = _f === void 0 ? 0 : _f, _g = info.mode, mode = _g === void 0 ? 'cover' : _g, backgroundColor = info.backgroundColor, border = info.border, shadow = info.shadow;
                        if (!(typeof (img) == 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getImgInfo(img)];
                    case 1:
                        imgInfo = _h.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        imgInfo = img;
                        _h.label = 3;
                    case 3:
                        if (height == 0) {
                            height = imgInfo.height / imgInfo.width * width;
                            info.height = imgInfo.height / imgInfo.width * width;
                        }
                        if (isGetHeight) {
                            return [2 /*return*/, {
                                    bot: y + height
                                }];
                        }
                        c_ratio = this.ratio;
                        x *= c_ratio;
                        y *= c_ratio;
                        width *= c_ratio;
                        height *= c_ratio;
                        radius *= c_ratio;
                        ctx = this.ctx;
                        if (shadow) {
                            this.drawBoxShadow(shadow, { x: x, y: y, width: width, height: height, radius: radius });
                        }
                        if (radius) {
                            this.drawBoardPath({ x: x, y: y, width: width, height: height, radius: radius });
                            ctx.closePath();
                            ctx.clip();
                        }
                        if (backgroundColor) {
                            ctx.fillStyle = backgroundColor;
                            ctx.fillRect(x, y, width, height);
                        }
                        ratio = imgInfo.width / imgInfo.height > width / height;
                        if (mode == 'fill') {
                            ctx.drawImage(imgInfo.img, x, y, width, height);
                        }
                        else if (mode == 'contain') {
                            if (ratio) {
                                iw = imgInfo.width;
                                ix = 0;
                                ih = imgInfo.width / width * height;
                                iy = (imgInfo.height - ih) / 2;
                            }
                            else {
                                iw = imgInfo.height * width / height;
                                ix = (imgInfo.width - iw) / 2;
                                ih = imgInfo.height;
                                iy = 0;
                            }
                            ctx.drawImage(imgInfo.img, ix, iy, iw, ih, x, y, width, height);
                        }
                        else {
                            if (ratio) {
                                iw = imgInfo.height * width / height;
                                ix = (imgInfo.width - iw) / 2;
                                ih = imgInfo.height;
                                iy = 0;
                            }
                            else {
                                iw = imgInfo.width;
                                ix = 0;
                                ih = imgInfo.width / width * height;
                                iy = (imgInfo.height - ih) / 2;
                            }
                            ctx.drawImage(imgInfo.img, ix, iy, iw, ih, x, y, width, height);
                        }
                        ctx.restore();
                        if (border) {
                            this.drawBoxBorder(border, { x: x, y: y, width: width, height: height, radius: radius });
                        }
                        return [2 /*return*/, {
                                bot: (info.y || 0) + (info.height || 0)
                            }];
                }
            });
        });
    };
    Summer.prototype.drawRect = function (info) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a = info.x, x = _a === void 0 ? 0 : _a, _b = info.y, y = _b === void 0 ? 0 : _b, _c = info.width, width = _c === void 0 ? 50 : _c, _d = info.height, height = _d === void 0 ? 50 : _d, _e = info.radius, radius = _e === void 0 ? 0 : _e, _f = info.isGetHeight, isGetHeight = _f === void 0 ? false : _f, border = info.border, _g = info.background, background = _g === void 0 ? {
                color: ''
            } : _g, shadow = info.shadow;
            if (isGetHeight) {
                resolve({
                    bot: y + height
                });
            }
            var ratio = _this.ratio;
            x *= ratio;
            y *= ratio;
            width *= ratio;
            height *= ratio;
            radius *= ratio;
            var ctx = _this.ctx;
            if (shadow) {
                _this.drawBoxShadow(shadow, { x: x, y: y, width: width, height: height, radius: radius });
            }
            if (background.image) {
                var _imgInfo = {
                    id: info.id,
                    type: "img",
                    img: background.image,
                    x: info.x,
                    y: info.y,
                    radius: info.radius,
                    width: info.width,
                    height: (info.height || 0)
                };
                _this.drawImg(_imgInfo)
                    .then(function () {
                    if (border) {
                        _this.drawBoxBorder(border, { x: x, y: y, width: width, height: height, radius: radius });
                    }
                    resolve({
                        bot: (info.y || 0) + (info.height || 0)
                    });
                });
            }
            else {
                _this.drawBoardPath({ x: x, y: y, width: width, height: height, radius: radius });
                if (background.color) {
                    var backgroundColor = background.color.toString();
                    var _startIndex = backgroundColor.indexOf('linear(');
                    if (_startIndex > -1) {
                        var _endIndex = backgroundColor.indexOf(')');
                        var _params = backgroundColor.substring(7, _endIndex).split(",");
                        var mode = _params[0];
                        var colors = _params.slice(1);
                        var grd_1 = ctx.createLinearGradient(x, y, x, y + height);
                        if (mode == 'to right') {
                            grd_1 = ctx.createLinearGradient(x, y, x + width, y);
                        }
                        else {
                        }
                        colors.forEach(function (color) {
                            var _color = new Array();
                            color.split(" ").forEach(function (__colorItem) {
                                if (__colorItem) {
                                    _color.push(__colorItem);
                                }
                            });
                            grd_1.addColorStop(_color[0].replace("%", "") / 100, _color[1]);
                        });
                        ctx.fillStyle = grd_1;
                    }
                    else {
                        ctx.fillStyle = backgroundColor;
                    }
                    ctx.fill();
                }
                if (border) {
                    _this.drawBoxBorder(border, { x: x, y: y, width: width, height: height, radius: radius });
                }
                resolve({
                    bot: (info.y || 0) + (info.height || 0)
                });
            }
        });
    };
    Summer.prototype.drawText = function (info) {
        var _this = this;
        return new Promise(function (resolve) {
            var _a = info.x, x = _a === void 0 ? 0 : _a, _b = info.y, y = _b === void 0 ? 0 : _b, _c = info.padding, padding = _c === void 0 ? {
                top: 0,
                right: 0,
                left: 0,
                bot: 0
            } : _c, _d = info.maxLine, maxLine = _d === void 0 ? 0 : _d, _e = info.isGetHeight, isGetHeight = _e === void 0 ? false : _e, _f = info.fontWeight, fontWeight = _f === void 0 ? 'normal' : _f, _g = info.background, background = _g === void 0 ? {
                color: ''
            } : _g, textAlign = info.textAlign, _h = info.color, color = _h === void 0 ? '#000000' : _h, _j = info.fontSize, fontSize = _j === void 0 ? 20 : _j, _k = info.lineHeight, lineHeight = _k === void 0 ? 20 : _k, _l = info.lastLineLeastNum, lastLineLeastNum = _l === void 0 ? 0 : _l, _m = info.width, width = _m === void 0 ? 0 : _m;
            var ratio = _this.ratio;
            x *= ratio;
            y *= ratio;
            width *= ratio;
            fontSize *= ratio;
            lineHeight *= ratio;
            var ctx = _this.ctx;
            var summerText = new SummerText({
                canvasEl: ctx,
                text: info.text,
                lastLineLeastNum: lastLineLeastNum,
                maxLine: maxLine,
                maxUnit: Math.floor(width / fontSize),
                fontWeight: fontWeight,
            });
            var textHeight = (summerText.getTextHeight(lineHeight) / ratio);
            var textWidth = (width || summerText.getTextWidth(fontSize)) / ratio;
            if (!isGetHeight) {
                var offsetX_1 = 0;
                ctx.textAlign = textAlign || 'left';
                switch (textAlign) {
                    case 'left':
                        offsetX_1 = 0;
                        break;
                    case 'center':
                        offsetX_1 = width / 2;
                        break;
                    case 'right':
                        offsetX_1 = width;
                        break;
                    case 'start':
                        offsetX_1 = 0;
                        break;
                    case 'end':
                        offsetX_1 = width;
                        break;
                    default:
                        offsetX_1 = 0;
                        break;
                }
                if (background.color) {
                    var _bgX = textWidth;
                    switch (textAlign) {
                        case 'left':
                            _bgX = 0;
                            break;
                        case 'center':
                            _bgX = -textWidth / 2;
                            break;
                        case 'right':
                            _bgX = -textWidth;
                            break;
                        case 'start':
                            _bgX = 0;
                            break;
                        case 'end':
                            offsetX_1 = width;
                            break;
                        default:
                            _bgX = 0;
                            break;
                    }
                    _this.drawRect({
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
                        .then(function () {
                        ctx.restore();
                        summerText.drawText(x + offsetX_1, y + fontSize, color, fontSize, lineHeight);
                        resolve({
                            bot: (info.y || 0) + textHeight
                        });
                    });
                }
                else {
                    summerText.drawText(x + offsetX_1, y + fontSize, color, fontSize, lineHeight);
                }
            }
            resolve({
                bot: (info.y || 0) + textHeight
            });
        });
    };
    Summer.prototype.drawBoxShadow = function (shadow, info) {
        var ctx = this.ctx;
        var ratio = this.ratio;
        ctx.fillStyle = '#ffffff';
        this.setShadow({
            offsetX: (shadow.offsetX || 0) * ratio,
            offsetY: (shadow.offsetY || 0) * ratio,
            blur: (shadow.blur || 10) * ratio,
            color: shadow.color || 'rgba(0,0,0,0.5)',
        });
        var x = info.x, y = info.y, width = info.width, height = info.height, radius = info.radius;
        this.drawBoardPath({ x: x, y: y, width: width, height: height, radius: radius });
        ctx.fill();
        ctx.restore();
        // 清空投影
        ctx.fillStyle = 'rgba(0,0,0,0)';
        this.setShadow({});
    };
    Summer.prototype.drawBoxBorder = function (border, info) {
        var ctx = this.ctx;
        var borderWidth = (border.width || 1) * this.ratio / 2;
        this.drawBoardPath(info);
        ctx.strokeStyle = border.color || 'rgba(0,0,0,1)';
        ctx.lineWidth = borderWidth * 2;
        ctx.stroke();
        ctx.restore();
    };
    Summer.prototype.drawBoardPath = function (info) {
        var ctx = this.ctx;
        var x = info.x, y = info.y, width = info.width, height = info.height, radius = info.radius;
        ctx.save();
        if (width < 2 * radius)
            radius = width / 2;
        if (height < 2 * radius)
            radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    };
    Summer.prototype.setShadow = function (shadow) {
        var ctx = this.ctx;
        ctx.shadowOffsetX = shadow.offsetX || 0;
        ctx.shadowOffsetY = shadow.offsetY || 0;
        ctx.shadowBlur = shadow.blur || 0;
        ctx.shadowColor = shadow.color || 'rgba(0,0,0,0)';
    };
    Summer.prototype.getImgInfo = function (imgUrl) {
        return new Promise(function (resolve, reject) {
            if (imgUrl) {
                var img_1 = new Image();
                // 允许跨域，必须放在设置src之前
                img_1.setAttribute("crossOrigin", "Anonymous");
                img_1.src = imgUrl;
                img_1.onload = function (e) {
                    var _a = e.currentTarget, width = _a.width, height = _a.height;
                    resolve({
                        img: img_1,
                        width: width,
                        height: height
                    });
                };
                img_1.onerror = function (err) {
                    reject(err);
                };
            }
            else {
                reject("请传入照片地址");
            }
        });
    };
    return Summer;
}());
export default Summer;
//# sourceMappingURL=summer.js.map