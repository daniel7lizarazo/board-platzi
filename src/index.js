const { fromEvent } = require("rxjs");
const { switchMap, takeUntil, mergeWith } = require("rxjs/operators")

const canvas = document.getElementById('reactive-canvas');
const restarButton = document.getElementById('restart-button');

const canvasContext = canvas.getContext('2d');
canvasContext.lineWidth = 8;
canvasContext.lineJoin = 'round';
canvasContext.lineCap = 'round';
canvasContext.strokeStyle = 'white';

const cursorPosition = { x:0, y:0 }

function updateCursosPosition(event) {
    cursorPosition.x = event.clientX - canvas.offsetLeft;
    cursorPosition.y = event.clientY - canvas.offsetTop;
}

const mouseUp$ = fromEvent(canvas, 'mouseup');
const mouseDown$ = fromEvent(canvas, 'mousedown');

mouseDown$.subscribe(updateCursosPosition);
const onRestart$ = fromEvent(restarButton, 'click');

const stopConditions$ = mouseUp$.pipe(
    mergeWith(onRestart$)
)

const mouseMove$ = fromEvent(canvas, 'mousemove').pipe(takeUntil(stopConditions$));

function draw(event){
    canvasContext.beginPath();
    canvasContext.moveTo(cursorPosition.x, cursorPosition.y);
    updateCursosPosition(event);
    canvasContext.lineTo(cursorPosition.x, cursorPosition.y);
    canvasContext.stroke();
    canvasContext.closePath();
}

const startPainting = mouseDown$.pipe(
    switchMap(() => mouseMove$)
)

startPainting.subscribe(draw);

onRestart$.subscribe(() => {
    canvasContext.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
})