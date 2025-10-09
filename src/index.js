import { MiniMaple } from "./miniMaple";

document.addEventListener('DOMContentLoaded',setup)

function setup() {
    document.getElementById('demoButton').onclick = addSomething;
}

function addSomething(){
    const someDummyDiv = document.createElement('div');
    someDummyDiv.classList.add('generated');
    const count = document.getElementsByClassName('generated').length;
    someDummyDiv.innerHTML = `I was created by JS! There are already ${count} of my friends!`;
    const container = document.getElementById('container');
    container.appendChild(someDummyDiv);
}

const diffButton = document.getElementById('demoButton')
const inputTA = document.getElementById('input_text')
const resText = document.getElementById('result')

const maple = new MiniMaple()

diffButton.addEventListener('click', function() {
    resText.innerText = maple.differentiate(inputTA.value)
});