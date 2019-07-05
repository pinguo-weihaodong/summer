var validPost = "!%),.:;>?]}\u00A2\u00A8\u00B0\u00B7\u02C7\u02C9\u2015\u2016\u2019\u201D\u2026\u2030\u2032\u2033\u203A\u2103\u2236\u3001\u3002\u3003\u3009\u300B\u300D\u300F\u3011\u3015\u3017\u301E\uFE36\uFE3A\uFE3E\uFE40\uFE44\uFE5A\uFE5C\uFE5E\uFF01\uFF02\uFF05\uFF07\uFF09\uFF0C\uFF0E\uFF1A\uFF1B\uFF1F\uFF3D\uFF40\uFF5C\uFF5D\uFF5E\uFFE0";
var validPre = "$([{\u00A3\u00A5\u2018\u201C\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u301D\uFE59\uFE5B\uFE5D\uFF04\uFF08\uFF0E\uFF3B\uFF5B\uFFE1\uFFE5";
var SummerText = /** @class */ (function () {
    function SummerText(info) {
        this.text = '';
        this.maxLine = 0;
        this.maxUnit = 20;
        this.minSize = 12;
        this.maxSize = 18;
        this.fontWeight = 'normal';
        this.lastLineLeastNum = 4;
        if (typeof (info.canvasEl) == 'string') {
            var canvas = document.getElementById(info.canvasEl);
            this.ctx = canvas.getContext('2d');
        }
        else {
            this.ctx = info.canvasEl;
        }
        this.text = info.text;
        this.maxUnit = info.maxUnit || 1000;
        this.maxLine = info.maxLine || 0;
        this.fontWeight = info.fontWeight || 'normal';
        this.lastLineLeastNum = info.lastLineLeastNum || 0;
    }
    SummerText.prototype.getTextWidth = function (fontSize) {
        return this.getTextUnitWidth(this.text, this.fontWeight) * fontSize;
    };
    SummerText.prototype.getTextHeight = function (lineHeight) {
        return this.wordLineFormat().wordsList.length * lineHeight;
    };
    SummerText.prototype.drawText = function (x, y, color, fontSize, lineHeight) {
        var _a = this, ctx = _a.ctx, fontWeight = _a.fontWeight;
        this.wordLineFormat().wordsList.forEach(function (item, index) {
            ctx.fillStyle = color;
            ctx.font = fontWeight + " " + fontSize + "px Arial";
            ctx.fillText(item.text, x, y + lineHeight * index);
        });
    };
    SummerText.prototype.wordLineFormat = function () {
        var _this = this;
        var _a = this, text = _a.text, fontWeight = _a.fontWeight, minSize = _a.minSize, maxLine = _a.maxLine, maxUnit = _a.maxUnit, maxSize = _a.maxSize;
        var wordsDrawInfo = {
            ratio: 1,
            size: minSize,
            wordsList: new Array()
        };
        var wordsUnitWidth = this.getTextUnitWidth(text, fontWeight);
        var wordsList = [];
        if (wordsUnitWidth <= maxUnit && !/\n/.test(text)) {
            wordsDrawInfo.ratio = (maxUnit / wordsUnitWidth) > (maxSize / minSize) ? (maxSize / minSize) : (maxUnit / wordsUnitWidth);
            wordsDrawInfo.size = wordsDrawInfo.ratio * minSize;
            wordsList = [{
                    text: text
                }];
        }
        else {
            this.splitWordsByReturn(text).forEach(function (_text) {
                wordsList = wordsList.concat(_this.reSplitWordsByLine(_text, _this.lastLineLeastNum, maxUnit));
            });
            wordsList = wordsList;
        }
        if (maxLine > 0 && wordsList.length) {
            wordsList = wordsList.slice(0, maxLine);
        }
        wordsDrawInfo.wordsList = wordsList;
        return wordsDrawInfo;
    };
    SummerText.prototype.reSplitWordsByLine = function (text, lastLineLeastNum, maxUnit) {
        var _this = this;
        if (lastLineLeastNum === void 0) { lastLineLeastNum = 4; }
        if (maxUnit === void 0) { maxUnit = 20; }
        // 分隔字符
        var spacList = [];
        this.splitWords(text).forEach(function (str) {
            spacList.push({
                text: str,
                width: Number((_this.getTextUnitWidth(str)).toFixed(5))
            });
        });
        var finalList = [];
        // 分隔行
        var lineList = [], _line = [], lineNumList = [], _lineNum = 0;
        for (var i = 0; i < spacList.length + 1; i++) {
            var _spac = spacList[i];
            if (_spac) {
                // 当前字符串超过maxUnit时，结束上一行，并将当前字符串设置为整一行
                if (_spac.width > maxUnit) {
                    if (_lineNum > 0) {
                        lineNumList.push(_lineNum);
                        lineList.push(_line);
                    }
                    var __spac = this.omitLongWords(_spac.text, maxUnit);
                    lineNumList.push(__spac.width);
                    lineList.push([__spac]);
                    _lineNum = 0;
                    _line = [];
                }
                else {
                    // 连接超过maxUnit的长度时断行
                    if (_lineNum + _spac.width > maxUnit) {
                        lineNumList.push(_lineNum);
                        lineList.push(_line);
                        _lineNum = 0;
                        _line = [];
                    }
                    _line.push(_spac);
                    _lineNum = Number((_lineNum + _spac.width).toFixed(5));
                }
            }
            // console.log(lineList)
            // 连接最后一个字符
            // if (i == spacList.length-1 && lineList.length > 0) {
            if (i == spacList.length - 1) {
                if (_lineNum > 0) {
                    lineNumList.push(_lineNum);
                    lineList.push(_line);
                }
                _lineNum = 0;
                _line = [];
            }
        }
        // 行数大于一行时，最后一行不小于4个基本单位
        if (lineList.length > 1) {
            // 倒数第二行
            var _lastIndex = lineList.length - 1, _penultIndex = _lastIndex - 1, _addToLastLineNum = 0;
            if (lineNumList[_lastIndex] < lastLineLeastNum) {
                for (var j = lineList[_penultIndex].length - 1; j >= 0; j--) {
                    // 倒数第二行的item
                    var _penultLineSpac = lineList[_penultIndex][j];
                    // 倒数第二行移除的长度
                    _addToLastLineNum += Number(_penultLineSpac.width);
                    // 如果最后一行加上长度后大于倒数第二行，退出
                    if ((_addToLastLineNum + lineNumList[_lastIndex]) > lineNumList[_penultIndex]) {
                        break;
                    }
                    // 向最后一行移动单位
                    lineNumList[_lastIndex] += Number(_penultLineSpac.width);
                    lineList[_lastIndex].unshift(_penultLineSpac);
                    lineNumList[_penultIndex] -= Number(_penultLineSpac.width);
                    lineList[_penultIndex].splice(j, 1);
                    // 如果移动后最后一行长度大于4个基本单位，退出
                    if ((lineNumList[_lastIndex]) >= lastLineLeastNum) {
                        break;
                    }
                }
            }
        }
        for (var k = 0; k < lineList.length; k++) {
            var finalWords = '', finalWidth = 0;
            for (var h = 0; h < lineList[k].length; h++) {
                finalWords += lineList[k][h].text;
                finalWidth += lineList[k][h].width;
            }
            finalList.push({
                text: finalWords,
                width: finalWidth
            });
        }
        // console.log(finalList)
        return finalList;
    };
    SummerText.prototype.omitLongWords = function (text, maxUnit) {
        if (maxUnit === void 0) { maxUnit = 20; }
        var _wordsWidth = 0, finalWords = '', omitTextWidth = this.getTextUnitWidth("…");
        for (var i = 0; i < text.length; i++) {
            var wordWidth = this.getTextUnitWidth(text[i]);
            // console.log(_wordsWidth + wordWidth + omitTextWidth, text[i])
            if (_wordsWidth + wordWidth + omitTextWidth > maxUnit) {
                break;
            }
            _wordsWidth += wordWidth;
            finalWords += text[i];
        }
        return {
            text: finalWords + '…',
            width: _wordsWidth + omitTextWidth
        };
    };
    SummerText.prototype.splitWords = function (text) {
        var wordsList = [];
        var singleStr = '';
        for (var index = 0; index < text.length; index++) {
            var _str = text[index], _nextStr = text[index + 1];
            // 如果当前字符为前置标点时
            if (validPre.indexOf(_str) > -1) {
                // 结束
                if (singleStr) {
                    wordsList.push(singleStr);
                }
                // 连接后置标点时，结束
                singleStr = _str;
                if (validPost.indexOf(_nextStr) > -1) {
                    singleStr += _nextStr;
                    wordsList.push(singleStr);
                    singleStr = '';
                }
                continue;
                // 数字或英文 时继续添加下一个字符
            }
            else if (/[A-Za-z]/.test(_str) || /[0-9]/.test(_str)) {
                singleStr += _str;
                // 连接后置标点时，结束，否则继续循环
                if (validPost.indexOf(_nextStr) > -1) {
                    singleStr += _nextStr;
                    wordsList.push(singleStr);
                    singleStr = '';
                }
                continue;
                // 如果是后置标点，继续下一个循环
            }
            else if (validPost.indexOf(_str) > -1) {
                // 当后置标点在第一个
                if (wordsList.length == 0) {
                    wordsList.push(_str);
                }
                continue;
            }
            else {
                if (singleStr) {
                    // 如果上一个字符不是前置标点，结束
                    if (validPre.indexOf(singleStr) < 0) {
                        wordsList.push(singleStr);
                        singleStr = '';
                    }
                }
                singleStr += _str;
                // 连接后置标点时，结束，否则继续循环
                if (validPost.indexOf(_nextStr) > -1) {
                    singleStr += _nextStr;
                }
                if (singleStr) {
                    wordsList.push(singleStr);
                    singleStr = '';
                }
            }
        }
        if (singleStr) {
            wordsList.push(singleStr);
            singleStr = '';
        }
        return wordsList;
    };
    SummerText.prototype.splitWordsByReturn = function (text) {
        return text.split("\n");
    };
    SummerText.prototype.getTextUnitWidth = function (text, fontWeight) {
        if (fontWeight === void 0) { fontWeight = 'normal'; }
        var ctx = this.ctx;
        ctx.font = fontWeight + " 12px 'Helvetica'";
        return ctx.measureText(text).width / 12;
    };
    return SummerText;
}());
export default SummerText;
//# sourceMappingURL=summerText.js.map