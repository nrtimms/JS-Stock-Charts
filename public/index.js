async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=30min&apikey=db2efdadc8f540288a38e0f9f489801f');
    const result = await response.json();
    const { GME, MSFT, DIS, BNTX } = mockData;
    const stocks = [GME, MSFT, DIS, BNTX];
    stocks.forEach(stock => stock.values.reverse())

    //Stock Price Over Time
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    }); 
    
    //Highest Stock Price
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                data: stocks.map(stock => (highestAmt(stock.values))),
                backgroundColor: stocks.map( stock => (getColor(stock.meta.symbol))),
                borderColor: stocks.map(stock => (getColor(stock.meta.symbol))),
            }]
        }
    })

    //Average Stock Price
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data:{
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Average',
                data: stocks.map(stock => (calcAvg(stock.values))),
                backgroundColor: stocks.map( stock => (getColor(stock.meta.symbol))),
                borderColor: stocks.map(stock => (getColor(stock.meta.symbol))),
            }]
        }
    })
}

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

function highestAmt(values){
    let max = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > max){
            max = value.high 
        }
    })
    return max
}

function calcAvg(values){
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high)
    })
    return total / values.length
}


main()