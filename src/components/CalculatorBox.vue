<script>
// 如果最後沒填數字 清除最後的符號
// 先乘除 後加減
// 刪除 如果數字是0 就刪除arr 如果數字就放進去input
// 按鍵盤 會互動
export default {
  data() {
    return {
      numData: "0",
      formulaData: ["0"],
      numBtnList: [
        ["7", "8", "9"],
        ["4", "5", "6"],
        ["1", "2", "3"],
        ["0", "00", "."],
      ],
      symbolBtnList: ["÷", "×", "+", "-"],
      nowIsOutturn: false,
      isFocused: false
    };
  },
  methods: {
    defaultData(numStr) {
      this.numData = numStr;
      this.formulaData = [numStr];
      this.nowIsOutturn = false;
    },
    onClickNum(event) {
      const { name } = event.target;
      const {
        symbolBtnList,
        formulaData,
        nowIsOutturn,
        numberWithCommas,
        withoutCommas,
      } = this;
      let { numData } = this;

      //Outturn state
      if (nowIsOutturn) {
        // numData = "";
        // this.formulaData = [name];
        this.formulaData = [numData];
        this.nowIsOutturn = false;
      }

      //input == 0, input == .0
      if (numData === "0" && name !== "." && numData !== "0.") {
        numData = "";
      }
      let numStr = withoutCommas(numData);
      numStr += name;
      if (!isNaN(+numStr)) {
        numStr = numberWithCommas(numStr);
        this.numData = numStr;
        //now is Formula or not
        const isFormula = symbolBtnList.some(
          (f) => f === formulaData[formulaData.length - 1]
        );
        // console.log(isFormula);
        if (isFormula) {
          formulaData.push(numStr);
        } else {
          formulaData[formulaData.length - 1] = numStr;
        }
      }
    },
    onClickFormula(event) {
      const { name } = event.target;
      const { symbolBtnList, formulaData, nowIsOutturn, numData } = this;
      //IsOutturn
      if (nowIsOutturn) {
        // return;
        this.formulaData = [numData.toString()];
        this.nowIsOutturn = false;
      }
      //now is Formula or not
      const isFormula = symbolBtnList.some(
        (f) => f === formulaData[formulaData.length - 1]
      );
      if (isFormula) {
        this.formulaData[formulaData.length - 1] = name;
      } else {
        this.formulaData.push(name);
        this.numData = "0";
      }
    },
    onClickAc() {
      this.defaultData("0");
    //   console.log("onClickAc");
    },
    onClickDelete() {
      if (this.nowIsOutturn) {
        this.nowIsOutturn = false;
      }
      const { formulaData, withoutCommas, numberWithCommas } = this;
      let lastData = withoutCommas(formulaData[formulaData.length - 1]);
      // Symbol or Num
      if (isNaN(+lastData)) {
        formulaData.pop();
        this.numData = formulaData[formulaData.length - 1];
      } else {
        lastData = numberWithCommas(lastData);
        // lastData === "0"
        if (lastData === "0" && formulaData.length !== 1) {
          formulaData.pop();
        }
        //now Number Str length == 1
        else if (lastData.length === 1) {
          this.numData = "0";
          this.formulaData[formulaData.length - 1] = "0";
        } else {
          const substringLastStr = lastData.substring(0, lastData.length - 1);
          this.numData = substringLastStr;
          this.formulaData[formulaData.length - 1] = substringLastStr;
        }
      }

      // console.log("onClickDelete");
    },
    onClickAmount() {
      const { formulaData, withoutCommas, numberWithCommas } = this;

      //length to short
      if (formulaData.length < 3) {
        return;
      }
      //last is "="
      if (formulaData[formulaData.length - 1] === "=") {
        formulaData.pop();
      }
      // if (isNaN(+formulaData[formulaData.length - 1])) {
      //   formulaData.pop();
      // }
    //   console.log(formulaData);

      let calculateArr = [];

      let i = 1;
      let temp = 0;
      //while List
      while (i < formulaData.length - 1) {
        const nowStr = formulaData[i],
          beforeNum = +withoutCommas(formulaData[i - 1]),
          afterNum = +withoutCommas(formulaData[i + 1]);

        const getNextAndPush = (data, arr) => {
          // next is "+" or "-"
          if (data[i + 2] === "+" || data[i + 2] === "-") {
            arr.push(temp);
            arr.push(data[i + 2]);
            //push last
            if (i === formulaData.length - 4) {
              let lastNum = +withoutCommas(data[i + 3]);
              calculateArr.push(lastNum);
            }
            temp = 0;
            i += 4;
          } else if (data[i + 2] === "×" || data[i + 2] === "÷") {
            // next is "×" or "÷"
            i += 2;
          } else {
            arr.push(temp);
            i += 2;
          }
        };

        switch (nowStr) {
          case "×":
            // console.log("Is ×");
            // calculate
            if (temp) {
              temp = temp * afterNum;
            } else {
              temp = beforeNum * afterNum;
            }

            getNextAndPush(formulaData, calculateArr);

            break;

          case "÷":
            // console.log("Is ÷");
            // division
            if (temp) {
              temp = temp / afterNum;
            } else {
              temp = beforeNum / afterNum;
            }

            getNextAndPush(formulaData, calculateArr);

            break;
          case "+":
            // console.log("Is +");
            calculateArr.push(beforeNum);
            calculateArr.push("+");
            //push last
            if (i === formulaData.length - 2) {
              calculateArr.push(afterNum);
            }
            i += 2;
            break;
          case "-":
            // console.log("Is -");
            calculateArr.push(beforeNum);
            calculateArr.push("-");
            //push last
            if (i === formulaData.length - 2) {
              calculateArr.push(afterNum);
            }
            i += 2;
            break;

          default:
            console.error("Error not catch symbol!");
            //stop loop
            i = formulaData.length;
        }
      }

    //   console.log(calculateArr);

      // Addition and subtraction
      let sum = calculateArr[0];
      for (let i = 1; i < calculateArr.length; i += 2) {
        const nowStr = calculateArr[i],
          afterNum = +calculateArr[i + 1];

        if (nowStr === "+") {
          sum += afterNum;
        }

        if (nowStr === "-") {
          //Fix 0 - Num = -Num
          if (sum === 0) {
            sum = afterNum;
            continue;
          }

          sum -= afterNum;
        }
      }

      formulaData.push("=");

      // console.log(sum);
      sum = this.round(sum);
      this.numData = numberWithCommas(sum);
      // set value to from input
      this.$emit("setCalculatorValueToFrom", sum);

      //Outturn state
      this.nowIsOutturn = true;
    },
    onKeydown(event) {
      if(!this.isFocused) return;
      // console.log(event.key);
      let obj = {
        target: {
          name: null,
        },
      };

      const getByIdChangeBgcolor = (key) => {
        const el = document.getElementById(key);
        let tempBgcolor = "";

        if (this.symbolBtnList.some((f) => f === key)) {
          tempBgcolor = "#041936";
        } else if ("=" === key) {
          tempBgcolor = "linear-gradient(0.25turn, #1cb6f8, #3c67f6, #4a2c8d)";
        } else {
          tempBgcolor = "transparent";
        }

        el.style["background-color"] = "#1b549e";
        setTimeout(() => {
          el.style["background-color"] = tempBgcolor;
        }, 100);
      };

      // Symbol Key or Num Key
      if (isNaN(+event.key) && event.key !== ".") {
        switch (event.key) {
          case "/":
            obj.target.name = "÷";
            this.onClickFormula(obj);
            getByIdChangeBgcolor("÷");
            break;
          case "*":
            obj.target.name = "×";
            this.onClickFormula(obj);
            getByIdChangeBgcolor("×");
            break;
          case "+":
            obj.target.name = "+";
            this.onClickFormula(obj);
            getByIdChangeBgcolor("+");
            break;
          case "-":
            obj.target.name = "-";
            this.onClickFormula(obj);
            getByIdChangeBgcolor("-");
            break;
          case "Enter":
          case "=":
            this.onClickAmount();
            getByIdChangeBgcolor("amount");
            break;
          case "Backspace":
            this.onClickDelete();
            getByIdChangeBgcolor("delete");
            break;
          case "Delete":
            this.onClickAc();
            getByIdChangeBgcolor("ac");
            break;
          case "Delete":
            getByIdChangeBgcolor("ac");
            break;
        }
      } else {
        obj.target.name = event.key;
        this.onClickNum(obj);
        getByIdChangeBgcolor("Num" + event.key);
      }

      this.handleCopyAndPasteKey(event);
    },

    async handleCopyAndPasteKey(event){
        // console.log(event.key)
        // Ctrl c or v
        if (event.ctrlKey && (event.key.toLowerCase() === 'c')) {
            // Copy input
            try {
                await navigator.clipboard.writeText(this.numData);
            } catch (err) {
                console.error('The text cannot be copied to the clipboard:', err);
            }
        } else if (event.ctrlKey && (event.key.toLowerCase() === 'v')) {
        // Paste
        const clipboardText = await navigator.clipboard.readText();
        const lastOne = this.formulaData[this.formulaData.length - 1]
            // console.log(clipboardText)
            // console.log(this.isValidNumber(clipboardText))
            if(this.isValidNumber(clipboardText)){
                const numStr = this.numberWithCommas(clipboardText);
                const num = numStr
                this.numData = num;
                // paste to last one
                if(this.isValidNumber(lastOne)) {
                    this.formulaData[this.formulaData.length - 1] = num;
                } else if(lastOne === "="){
                    this.formulaData = [num]
                } 
                else {
                    this.formulaData.push(num);
                }
            }
        }
    },

    numberWithCommas(x) {
      return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    },
    withoutCommas(x) {
      return x.toString().replaceAll(",", "");
    },
    isValidNumber(input) {
        // Trimming leading and trailing spaces from a string
        let trimmedInput = input.trim()
        //allow "1,234.567" ...
        const pattern = /^\d+([,.]?\d+)*$/;
        return pattern.test(trimmedInput);
    },
    round(num) {
        // to five decimal places
        let m = Number((Math.abs(num) * 100000).toPrecision(15));
        return Math.round(m) / 100000 * Math.sign(num);
    },
    setClickIsCalculatorBox(e) {
    const clickedElement = e.target;
    const calculatorBox = document.getElementById('calculatorBox');
    // click Element is in div has id='calculatorBox'
    this.isFocused = calculatorBox.contains(clickedElement)
    },
  },
  mounted() {
    document.addEventListener("click", this.setClickIsCalculatorBox);

    // Listen keyboard event
    document.addEventListener("keydown", this.onKeydown);

  },
};
</script>

<template>
  <div
    id="calculatorBox"
    class="h-full lg:my-5 m-6"  
  >
  <div class="container">
    <div class="show-input-area">
      <p class="formula">{{ formulaData.join(" ") }}</p>
      <p class="input-num">{{ numData }}</p>
    </div>
    <!-- All Button Area -->
    <div class="keyboard-area">
      <div class="change-num-area">
        <!-- num area -->
        <div class="btn-num-area">
          <div class="row1" v-for="(rowList, i) in numBtnList" :key="i">
            <button
              class="num-btn"
              type="button"
              v-for="(numStr, i) in rowList"
              :key="i"
              :name="numStr"
              :id="'Num' + numStr"
              @click="onClickNum"
            >
              {{ numStr }}
            </button>
          </div>
        </div>
        <!-- symbol area -->
        <div class="btn-symbol-area">
          <button
            class="symbol-btn"
            type="button"
            v-for="(symbol, i) in symbolBtnList"
            :key="i"
            :name="symbol"
            :id="symbol"
            @click="onClickFormula"
          >
            {{ symbol }}
          </button>
        </div>
      </div>
      <!-- control area -->
      <div class="control-area">
        <button class="ac-btn" type="button" @click="onClickAc" id="ac">
          AC
        </button>
        <button
          class="delete-btn"
          type="button"
          @click="onClickDelete"
          id="delete"
        >
          <i class="fa-solid fa-delete-left"></i>
        </button>
        <button
          class="amount-btn"
          type="button"
          @click="onClickAmount"
          id="amount"
        >
          =
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<style lang="scss" scoped>
$main-color: #041936;
$bg-color: #062145;

$main-text-color: #fff;
$secondary-text-color: #00c4ff;

$hover-color: #1b549e;

$radius: 20px;
$paddingSize: 10px;

.container {
  background-color: $bg-color;
  border-radius: $radius;
  box-shadow: 1px 2px 8px 2px rgba(32, 27, 26, 0.596);
  width: 350px;

  .show-input-area {
    background-color: $main-color;
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    padding: $paddingSize;
    .formula {
      color: $secondary-text-color;
      text-align: end;
      word-wrap: break-word;
      max-height: 4rem;
      overflow: auto;
    }
    .input-num {
      color: $main-text-color;
      text-align: end;
      width: 100%;
      font-size: 55px;
    //   word-wrap: break-word;
      max-height: 10rem;
      overflow: auto;
    }
  }
  .keyboard-area {
    padding: $paddingSize;
    button {
      // border: 1px solid white;
      border: none;
      background-color: transparent;
      color: $main-text-color;
      width: 65px;
      height: 60px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 24px;
      margin: 8px;
      &:hover {
        background-color: $hover-color;
      }
    }
    .change-num-area {
      display: flex;
      justify-content: space-between;
      // .btn-num-area {
      //   .num-btn {
      //     border: none;
      //   }
      // }
      .btn-symbol-area {
        width: 80px;
        .symbol-btn {
          background-color: $main-color;
          color: $secondary-text-color;
          &:hover {
            background-color: $hover-color;
          }
        }
      }
    }
    .control-area {
      display: flex;
      margin-top: 5px;
      .ac-btn {
        color: $secondary-text-color;
      }
      .delete-btn {
        color: $secondary-text-color;
      }
      .amount-btn {
        background: linear-gradient(0.25turn, #1cb6f8, #3c67f6, #4a2c8d);
        flex-grow: 1;
        &:hover {
          background: #1cb6f8;
          -webkit-animation: bg-run 3s infinite;
        }
      }
    }
  }
}

@keyframes bg-run {
  30% {
    background: #3c67f6;
  }
  60% {
    background: #4a2c8d;
  }
}
@keyframes rainbow {
  0% {
    color: orange;
    // transform: rotate(360deg);
  }
  10% {
    color: purple;
  }
  20% {
    color: red;
  }
  30% {
    color: CadetBlue;
  }
  40% {
    color: yellow;
  }
  50% {
    color: coral;
  }
  60% {
    color: green;
  }
  70% {
    color: cyan;
  }
  80% {
    color: DeepPink;
  }
  90% {
    color: DodgerBlue;
  }
  100% {
    color: orange;
  }
}

// Remove Arrows/Spinners
// /* Chrome, Safari, Edge, Opera */
// input::-webkit-outer-spin-button,
// input::-webkit-inner-spin-button {
//   -webkit-appearance: none;
//   margin: 0;
// }

// /* Firefox */
// input[type="number"] {
//   -moz-appearance: textfield;
// }
</style>
