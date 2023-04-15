let UI = document.getElementById("tickerBoxes");
let boxList = []
let textBox = document.getElementById("addTickerEntry")
let addButton = document.getElementById("addButton")
let reloadButton = document.getElementById("reload")
let deleteButton = document.getElementById("delete")
let deleteActive = false;


document.querySelector('textarea').addEventListener('keydown', function (e) {
    if (e.keyCode != 13) return
    e.preventDefault();
    addTicker()
});

// The add button eventlistener
addButton.addEventListener('click', function () {addTicker()});

reloadButton.addEventListener("click", function () {refresh()});

deleteButton.addEventListener("click", function () {
    deleteActive = !deleteActive

    if (!deleteActive) { 
        deleteButton.classList.remove('active'); 
        return; 
    }
    
    deleteButton.classList.add('active')
});

class Box {
    constructor(ticker, price) {    
        // create ticker
        this.tickerSymbol = ticker
        this.ticker = document.createTextNode(ticker)
        this.box = document.createElement("div")
        this.box.classList.add("tickerBox")
        this.box.appendChild(this.ticker)

        // create price
        this.price = document.createTextNode(price)
        this.spanRight = document.createElement("span")
        this.spanRight.style = "float: right; color: rgb(150, 150, 150);"
        this.spanRight.appendChild(this.price)

        // combines the price to ticker
        this.box.appendChild(this.spanRight)

        this.box.addEventListener('click', (e) => {
            if (!deleteActive) return
            this.box.remove()
        });
    }

    static async new(ticker) {
        let data = await getStockPrices(ticker)
        let box = new Box(ticker, data)
        boxList.push(box)
        return box
    }

    async update() {
        let newStockPrice = await getStockPrices(this.tickerSymbol)
        this.price = newStockPrice
        this.box.classList.add('active');

    }
}

function getStockPrices(ticker) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://corsproxy.io/?https://query1.finance.yahoo.com/v7/finance/quote?formatted=true&crumb=...&lang=en-US&region=US&symbols=${ticker}&fields=regularMarketPrice`);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = () => {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                if (data.quoteResponse.result.length === 0) {
                    reject(`Unable to find stock price for ${ticker}`);
                } else {
                    const price = data.quoteResponse.result[0].regularMarketPrice.fmt;
                    resolve(price);
                }
            } else {
                reject(`Unable to retrieve stock price for ${ticker}`);
            }
        };
        xhr.onerror = () => {
            reject(`Unable to retrieve stock price for ${ticker}`);
        };
        xhr.send();
    });
}

async function addTicker() {
    let newBox = (await Box.new(textBox.value.toUpperCase()))
    UI.appendChild(newBox.box);
    textBox.value = ""
    console.log(boxList)
}

async function refresh() {
    for (let i = 0; i < boxList.length; i++) {
        console.log(boxList.length)
        boxList[i].box.classList.remove('active')
    }

    for (let i = 0; i < boxList.length; i++) {
        console.log(boxList.length)
        await boxList[i].update()
    }
}