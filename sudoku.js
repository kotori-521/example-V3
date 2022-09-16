import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq"
import fs from "fs"
import path from "path"

let sudokukey = false;
let board; //全局数独
let constboard;//数独的初始值,这里面的数字不能改
//处理消息
export class sudoku1 extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '数独',
            /** 功能描述 */
            dsc: '数独模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 500,
            rule: [
                {
                    reg: '^#开启数独$',
                    fnc: 'CreateSudoku'
                },
                {
                    reg: '^#行.*列.*填.*$',
                    fnc: 'setnumber'
                },
                {
                    reg: '^#检查数独$',
                    fnc: 'CheckSudoku'
                },
                {
                    reg: '^#关闭数独$',
                    fnc: 'ifCloseSudoku'
                },
                {
                    reg: '^#数独|当前数独$',
                    fnc: 'nowSudoku'
                },
            ]
        })
    }


    async CreateSudoku(e) {
        if (sudokukey) {
            await e.reply(`当前已经有数独存在,先解决它吧`);
            return;
        }
        /** 设置上下文 */
        this.setContext('Getsudokuboard');
        /** 回复 */
        await e.reply('请发送【简单】【中等】【困难】选择生成数独的难度', false, { at: true });
    }


    async Getsudokuboard(e) {

        var reg = new RegExp(/简单|中等|困难/);
        let new_msg = this.e.msg;
        let difficulty = reg.exec(new_msg);
        if (difficulty == undefined || difficulty == null) {
            this.setContext('Getsudokuboard');
            await e.reply('请发送【简单】【中等】【困难】选择生成数独的难度', false, { at: true });
            return;
        }
        /** 结束上下文 */
        this.finish('Getsudokuboard');
        let num = 30;
        switch (difficulty[0]) {
            case "简单":
                num = 30;
                break;
            case "中等":
                num = 40;
                break;
            case "困难":
                num = 50;
                break;
        }
        console.log(difficulty[0]);
        console.log(num);
        let start = Date.now();
        board = await new_sudoku();
        board = wadong(board, num);
        sudokukey = true;
        constboard = new Array();
        for (let i = 0; i < 9; i++) {
            constboard[i] = new Array()
            for (let j = 0; j < 9; j++) {
                constboard[i][j] = board[i][j]
            }
        }
        e.reply(
            `数独玩法: 填入数字1~9,使得每行每列以及9个九宫格的数字不重复` + "\n" +
            `填入数字: #行2列3填4` + "\n" +
            `就可以在第二行第三列填入数字4` + "\n" +
            `清除数字: #行2列3填0` + "\n" +
            `就可以将第二行第三列清除`
        );
        show_sudoku(e);
        let end = Date.now();
        console.log('挖洞时间', end - start, 'ms');
        return;
    }


    async setnumber(e) {

        if (board == undefined || board == null) {
            e.reply(`数独尚未开启`);
            return;
        }
        var reg = new RegExp(/\d/g);
        let new_msg = e.msg;

        //创建一个数组用于保存获取的数字
        let num = [];
        let a = reg.exec(new_msg);
        while (a != null) {
            num.push(parseInt(a[0]))
            a = reg.exec(new_msg);
        };
        console.log(num);
        if (num.length != 3 || num[0] > 9 || num[0] < 0 || num[1] > 9 || num[1] < 0 || num[2] > 9 || num[2] < 0) {
            e.reply(`请输入正确的表达式,例如:行5列2填6`);
            return;
        }
        if (num[0] > 9) {
            e.reply(`请输入正确的表达式,例如:行5列2填6`);
            return;
        }
        e.reply("获取命令:" + `行${num[0]}列${num[1]}填${num[2]}`);

        let i = num[0] - 1;
        let j = num[1] - 1;
        if (constboard[i][j] != 0) {
            e.reply(`该位置是初始位置,无法更改: 行${num[0]}列${num[1]}`);
            return;
        }
        board[i][j] = num[2];
        show_sudoku(e);
        return;
    }


    async CheckSudoku(e) {
        if (board == undefined || board == null) {
            e.reply(`数独尚未开启`);
            return;
        }
        //检查是否完成
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    e.reply(`数独尚未完成,请填写全部数字后再检查`);
                    return;
                }
            }
        }
        //检查有无冲突,错误
        let check = isValidSudoku(board);
        if (!check) {
            e.reply(`数独存在错误`);
            return;
        }

        e.reply(`恭喜,数独完成!`);
        board = null;
        sudokukey = false;
        //reward(e)
        //console.log(board);
        return;
    }


    async ifCloseSudoku(e) {
        if (board == undefined || board == null) {
            e.reply(`数独尚未开启`);
            return;
        }
        /** 设置上下文 */
        this.setContext('CloseSudoku');
        /** 回复 */
        await e.reply('关闭数独后数独数据将被清空,回复:【关闭】,将继续关闭,', false, { at: true });
        return;
    }


    async CloseSudoku(e) {
        if (this.e.msg == "关闭") {
            e.reply(`数独已经关闭`);
            board = null;
            sudokukey = false;
        }
        else {
            e.reply(`数独关闭取消`);
        }
        /** 结束上下文 */
        this.finish('CloseSudoku');
        return;
    }


    async nowSudoku(e) {
        if (board == undefined || board == null) {
            e.reply(`数独尚未开启`);
            return;
        }
        show_sudoku(e);
        return;
    }
    ////
}


class Sudoku {

    constructor() {
        this.digits = this.blankMatrix(9);
    }

    blankMatrix(size) {
        let newMatrix = [];
        for (let i = 0; i < size; i++) {
            newMatrix.push([]);
        }
        return newMatrix;
    }

    makeDigits() {
        let colLists = this.blankMatrix(9);
        let areaLists = this.blankMatrix(3);
        let nine = this.randNine();
        let i = 0,
            j = 0,
            areaIndex = 0,
            count = 0,
            error = false,
            first = 0;
        for (i = 0; i < 9; i++) {
            colLists[i].push(nine[i]);
        }
        areaLists[0] = nine.slice(0, 3);
        areaLists[1] = nine.slice(3, 6);
        areaLists[2] = nine.slice(6);

        for (i = 0; i < 8; i++) {
            nine = this.randNine();
            if (i % 3 == 2) {
                areaLists = this.blankMatrix(3);
            }

            for (j = 0; j < 9; j++) {
                areaIndex = Math.floor(j / 3);
                count = 0;
                error = false;
                while (colLists[j].includes(nine[0]) || areaLists[areaIndex].includes(nine[0])) {
                    if (++count >= nine.length) {
                        error = true;
                        break;
                    }
                    nine.push(nine.shift());
                }
                if (error) return false;
                first = nine.shift();
                colLists[j].push(first);
                areaLists[areaIndex].push(first);
            }
        }
        this.digits = colLists;
        return true;
    }

    randNine() {
        let nine = this.nine();
        let index = 0;

        for (let i = 0; i < 5; i++) {
            index = this.randIndex();
            [nine[0], nine[index]] = [nine[index], nine[0]];
        }

        return nine;
    }

    nine() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    randIndex() {
        return Math.floor(Math.random() * 9);
    }
}


//建立新的数独
async function new_sudoku() {
    let sudoku = new Sudoku();
    let start = Date.now();
    while (!sudoku.makeDigits());
    let end = Date.now();
    //console.log(sudoku.digits);
    console.log('生成时间', end - start, 'ms');
    let ifvalid = isValidSudoku(sudoku.digits);
    console.log("If this sudoku is valid :", ifvalid);
    return sudoku.digits;
}


//判断数独是否正确
function isValidSudoku(board) {
    let flag = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            for (let z = j + 1; z < 9; z++) {
                if (board[i][j] != 0 && board[i][j] === board[i][z]) {     //判断行是否满足规则
                    flag = 1;
                    return false;
                }
                if (board[j][i] != 0 && board[j][i] === board[z][i]) {      //判断列是否满足规则
                    flag = 1;
                    return false;
                }

            }
        }
    }


    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            let nums = [];
            for (let a = row; a < row + 3; a++) {
                for (let b = col; b < col + 3; b++) {
                    if (board[a][b] != 0) {
                        nums.push(board[a][b]);        //将小方格中有效数据放入一个数组
                    }
                }
            }
            for (let x = 0; x < nums.length; x++) {           //判断小方格是否满足规则
                for (let y = x + 1; y < nums.length; y++) {
                    if (nums[x] === nums[y]) {
                        flag = 1;
                        return false;
                    }
                }
            }
        }
    }

    if (flag === 0) {
        return true;    //全部符合规则，输出正确
    }
};


//解数独方法(递归法)
function solveSudoku(board_solve) {
    //判断是否冲突
    let hasConflict = (r, c, val) => {
        for (let i = 0; i < 9; i++) {//判断行列是否有冲突
            if (board_solve[i][c] == val || board_solve[r][i] == val) {
                return true
            }
        }
        let subRowStart = Math.floor(r / 3) * 3 //该点对应小框中行的起始索引
        let subColStart = Math.floor(c / 3) * 3 //该点对应小框中列的起始索引
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board_solve[subRowStart + i][subColStart + j] == val) { //判断它所在小框是否重复
                    return true
                }
            }
        }
        return false
    }
    //递归函数
    let fill = (i, j) => {
        if (j == 9) { //换行
            i++
            j = 0;
            if (i == 9) {
                return true
            }
        }
        if (board_solve[i][j] != 0) { //如果不为空,执行下一个
            return fill(i, j + 1)
        }
        for (let num = 1; num <= 9; num++) { //开始填入数字
            if (hasConflict(i, j, num)) { //冲突
                continue
            }
            board_solve[i][j] = num;//如果不冲突,填入该数字
            if (fill(i, j + 1)) {
                return true
            }
            board_solve[i][j] = 0 //否则清空
        }
        return false
    }
    if (!fill(0, 0)) {//无解返回false
        return false;
    }
    return board_solve
}



//挖洞法
function wadong(board, num) {
    let cnt = 0;
    //递归函数
    let eliminate = (cnt) => {
        if (cnt == num) {
            return true
        }
        let i, j;
        i = Math.floor(Math.random() * 9);
        j = Math.floor(Math.random() * 9);
        if (board[i][j] == 0) { //如果为空,执行下一个
            return eliminate(cnt);
        }
        board[i][j] = 0; //清空
        return eliminate(cnt + 1);
    }
    eliminate(cnt);
    let temp = new Array()
    for (let i = 0; i < 9; i++) {
        temp[i] = new Array()
        for (let j = 0; j < 9; j++) {
            temp[i][j] = board[i][j]
        }
    }
    let solve = solveSudoku(temp);//直接操作二维数组board会污染变量,循环赋值之后操作temp
    if (solve == false) {
        this.wadong(board, num);
    }
    return board
}


async function show_sudoku(e) {
    let msg = ["sudoku:"];
    let temp = new Array()
    for (let i = 0; i < 9; i++) {
        temp[i] = new Array()
        for (let j = 0; j < 9; j++) {
            temp[i][j] = String(board[i][j]);
        }
    }
    for (let i = 0; i < 9; i++) {
        msg.push('\n');
        let n = temp[i].toString().replace(/,/g, "  ");
        msg.push(n);
    }
    e.reply(msg);
    return;
}






