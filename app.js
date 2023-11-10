const textInput = document.getElementById("text");
const fileInput = document.getElementById("file");

const saveBtn = document.getElementById("save");
const eraserBtn = document.getElementById("eraser-btn");
const modeBtn = document.getElementById("mode-btn");
const resetBtn = document.getElementById("reset-btn");

const colorOptions = Array.from(document.getElementsByClassName("color-option"));
const color = document.getElementById("color");

const lineWidth = document.getElementById("line-width");
const lineWidthText = document.getElementById("line-width-text");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.lineCap = "round";
ctx.lineWidth = lineWidth.value;
lineWidthText.innerText = "펜 크기: " + lineWidth.value;

let isPainting = false;
let isFilling = false;

// 마우스 움직일 때 isPainting이 True면 선을 그림
function onMove(event){
    if(isPainting){
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// 마우스를 누르고 있을 때
function startPainting(){
    isPainting = true;
}
// 마우스를 누르지 않을 때
function cancelPainting(){
    isPainting = false;
}
// 펜 크기(range) 바꿨을 때
function onLineWidthChange(event){
    ctx.lineWidth = event.target.value;
    lineWidthText.innerText = "펜 크기: " + event.target.value;
}

function onColorChange(event){
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}
function onColorClick(event){
    const colorValue = event.target.dataset.color;
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}
function onModeClick(){
    if(isFilling){
        isFilling = false;
        modeBtn.innerText = "🪣 fill";
    }else{
        isFilling = true;
        modeBtn.innerText = "🖌️ draw";
    }
}
function onCanvasClick(){
    if(isFilling){ ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); }
}
function onResetClick(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
function onEraserClick(){
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.innerText = "🪣 fill";
}
function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.src = url;
    image.onload = function(){
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    } 
}
function onDoubleClick(event){
    const text = textInput.value;
    if(text != ""){
        ctx.save()
        ctx.lineWidth = 1;
        ctx.font = "48px serif";
        ctx.fillText(text, event.offsetX, event.offsetY);
        ctx.restore();
    }
}
function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting)
canvas.addEventListener("mouseup", cancelPainting)
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick)

lineWidth.addEventListener("change", onLineWidthChange);

color.addEventListener("change", onColorChange);
colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
resetBtn.addEventListener("click", onResetClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);