interface SummerTextInterface {
    canvasEl: string | CanvasRenderingContext2D
    text: string
    maxUnit?: number
    minSize?: number
    maxSize?: number
    maxLine?: number
    fontWeight?: string | number
    lastLineLeastNum?: number
}


const validPost = `!%),.:;>?]}¢¨°·ˇˉ―‖’”…‰′″›℃∶、。〃〉》」』】〕〗〞︶︺︾﹀﹄﹚﹜﹞！＂％＇），．：；？］｀｜｝～￠`
const validPre = `$([{£¥‘“〈《「『【〔〖〝﹙﹛﹝＄（．［｛￡￥`

export default class SummerText {

    ctx: CanvasRenderingContext2D

    text: string = ''
    maxLine: number = 0
    maxUnit: number = 20
    minSize: number = 12
    maxSize: number = 18
    fontWeight: number | string = 'normal'
    lastLineLeastNum: number = 4;

    constructor(info: SummerTextInterface) {
        if (typeof(info.canvasEl) == 'string') {
            let canvas:any = document.getElementById(info.canvasEl)
            this.ctx = canvas.getContext('2d')
        } else {
            this.ctx = info.canvasEl
        }
        this.text = info.text
        this.maxUnit = info.maxUnit || 1000
        this.maxLine = info.maxLine || 0
        this.fontWeight = info.fontWeight || 'normal'
        this.lastLineLeastNum = info.lastLineLeastNum || 0
    }

    getTextWidth(fontSize: number) {
        return this.getTextUnitWidth(this.text, this.fontWeight) * fontSize
    }

    getTextHeight(lineHeight: number) {
        return this.wordLineFormat().wordsList.length * lineHeight
    }

    drawText(x: number, y: number, color: string, fontSize: number, lineHeight: number) {
        const { ctx, fontWeight } = this
        this.wordLineFormat().wordsList.forEach((item: any, index: number) => {
            ctx.fillStyle = color
            ctx.font = `${fontWeight} ${fontSize}px Arial`
            ctx.fillText(item.text, x, y + lineHeight * index)
        })
    }

    wordLineFormat() {
        const {
            text,
            fontWeight,
            minSize,
            maxLine,
            maxUnit,
            maxSize
        } = this

        let wordsDrawInfo = {
            ratio: 1,
            size: minSize,
            wordsList: new Array()
        }
        let wordsUnitWidth = this.getTextUnitWidth(text, fontWeight)
        let wordsList:any = []

        if (wordsUnitWidth<=maxUnit && !/\n/.test(text)) {
            wordsDrawInfo.ratio = (maxUnit/wordsUnitWidth)>(maxSize/minSize)?(maxSize/minSize):(maxUnit/wordsUnitWidth)
            wordsDrawInfo.size = wordsDrawInfo.ratio * minSize
            wordsList = [{
                text: text
            }]
        } else {
            this.splitWordsByReturn(text).forEach((_text: string) => {
                wordsList = wordsList.concat(this.reSplitWordsByLine(_text, this.lastLineLeastNum, maxUnit))
            })
            wordsList = wordsList
        }
        if (maxLine > 0 && wordsList.length) {
            wordsList = wordsList.slice(0, maxLine)
        }
        wordsDrawInfo.wordsList = wordsList

        return wordsDrawInfo
    }
    reSplitWordsByLine(text: string, lastLineLeastNum: number = 4, maxUnit: number = 20) {
        // 分隔字符
        let spacList:any = []
        this.splitWords(text).forEach((str: string) => {
            spacList.push({
                text: str,
                width: Number((this.getTextUnitWidth(str)).toFixed(5))
            })
        })
        let finalList: any[] = []
        // 分隔行
        let lineList:any = [], _line:any = [], lineNumList:any = [], _lineNum = 0
        for (let i = 0; i < spacList.length+1; i++) {
            const _spac = spacList[i]
            if (_spac) {
                // 当前字符串超过maxUnit时，结束上一行，并将当前字符串设置为整一行
                if (_spac.width > maxUnit) {
                    if (_lineNum > 0) {
                        lineNumList.push(_lineNum)
                        lineList.push(_line)
                    }
                    let __spac = this.omitLongWords(_spac.text, maxUnit)
                    lineNumList.push(__spac.width)
                    lineList.push([__spac])
                    _lineNum = 0
                    _line = []
                } else {
                    // 连接超过maxUnit的长度时断行
                    if (_lineNum + _spac.width > maxUnit) {
                        lineNumList.push(_lineNum)
                        lineList.push(_line)
                        _lineNum = 0
                        _line = []
                    }
                    _line.push(_spac)
                    _lineNum = Number((_lineNum + _spac.width).toFixed(5))
                }
            }
            // console.log(lineList)
            // 连接最后一个字符
            // if (i == spacList.length-1 && lineList.length > 0) {
            if (i == spacList.length-1) {
                if (_lineNum > 0) {
                    lineNumList.push(_lineNum)
                    lineList.push(_line)
                }
                _lineNum = 0
                _line = []
            }
        }
        // 行数大于一行时，最后一行不小于4个基本单位
        if (lineList.length > 1) {
            // 倒数第二行
            let _lastIndex = lineList.length-1,
                _penultIndex = _lastIndex-1,
                _addToLastLineNum = 0
            if (lineNumList[_lastIndex] < lastLineLeastNum) {
                for (let j = lineList[_penultIndex].length-1; j >= 0; j--) {
                    // 倒数第二行的item
                    const _penultLineSpac = lineList[_penultIndex][j]
                    // 倒数第二行移除的长度
                    _addToLastLineNum += Number(_penultLineSpac.width)
                    // 如果最后一行加上长度后大于倒数第二行，退出
                    if ((_addToLastLineNum + lineNumList[_lastIndex]) > lineNumList[_penultIndex]) {
                        break
                    }
                    // 向最后一行移动单位
                    lineNumList[_lastIndex] += Number(_penultLineSpac.width)
                    lineList[_lastIndex].unshift(_penultLineSpac)
                    lineNumList[_penultIndex] -= Number(_penultLineSpac.width)
                    lineList[_penultIndex].splice(j, 1)
                    // 如果移动后最后一行长度大于4个基本单位，退出
                    if ((lineNumList[_lastIndex]) >= lastLineLeastNum) {
                        break
                    }
                }
            }
        }
        for (let k = 0; k < lineList.length; k++) {
            let finalWords = '', finalWidth = 0
            for (let h = 0; h < lineList[k].length; h++) {
                finalWords += lineList[k][h].text
                finalWidth += lineList[k][h].width
            }
            finalList.push({
                text: finalWords,
                width: finalWidth
            })
        }
        // console.log(finalList)
        return finalList
    }
    omitLongWords(text: string, maxUnit: number = 20) {
        let _wordsWidth = 0,
            finalWords = '',
            omitTextWidth = this.getTextUnitWidth("…")
        for (let i = 0; i < text.length; i++) {
            let wordWidth = this.getTextUnitWidth(text[i])
            // console.log(_wordsWidth + wordWidth + omitTextWidth, text[i])
            if (_wordsWidth + wordWidth + omitTextWidth > maxUnit) {
                break
            }
            _wordsWidth += wordWidth
            finalWords += text[i]
        }
        return {
            text: finalWords + '…',
            width: _wordsWidth + omitTextWidth
        }
    }
    splitWords(text: string) {
        let wordsList:any = []
        let singleStr = ''
        for (let index = 0; index < text.length; index++) {
            let _str = text[index],
                _nextStr = text[index+1]
            // 如果当前字符为前置标点时
            if (validPre.indexOf(_str)>-1) {
                // 结束
                if (singleStr) {
                    wordsList.push(singleStr)
                }
                // 连接后置标点时，结束
                singleStr = _str
                if (validPost.indexOf(_nextStr)>-1) {
                    singleStr += _nextStr
                    wordsList.push(singleStr)
                    singleStr = ''
                }
                continue
            // 数字或英文 时继续添加下一个字符
            } else if (/[A-Za-z]/.test(_str) || /[0-9]/.test(_str)) {
                singleStr += _str
                // 连接后置标点时，结束，否则继续循环
                if (validPost.indexOf(_nextStr)>-1) {
                    singleStr += _nextStr
                    wordsList.push(singleStr)
                    singleStr = ''
                }
                continue
            // 如果是后置标点，继续下一个循环
            } else if (validPost.indexOf(_str)>-1) {
                // 当后置标点在第一个
                if (wordsList.length == 0) {
                    wordsList.push(_str)
                }
                continue
            } else {
                if (singleStr) {
                    // 如果上一个字符不是前置标点，结束
                    if (validPre.indexOf(singleStr)<0) {
                        wordsList.push(singleStr)
                        singleStr = ''
                    }
                }

                singleStr += _str

                // 连接后置标点时，结束，否则继续循环
                if (validPost.indexOf(_nextStr)>-1) {
                    singleStr += _nextStr
                }
                if (singleStr) {
                    wordsList.push(singleStr)
                    singleStr = ''
                }
            }
        }
        if (singleStr) {
            wordsList.push(singleStr)
            singleStr = ''
        }
        return wordsList
    }
    splitWordsByReturn(text: string) {
        return text.split(`
`)
    }
    getTextUnitWidth(text: string, fontWeight: number | string = 'normal') {
        const ctx = this.ctx
        ctx.font = `${fontWeight} 12px 'Helvetica'`
        return ctx.measureText(text).width/12
    }
}