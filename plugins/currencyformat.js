
export default (context, inject) => {
    const currencyFormat = (val) => {
        val = Number(val).toFixed(2)
        let splitDecimal = val.split(".")
        let beforeDecimal = splitDecimal[0].toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
        let afterDecimal = splitDecimal[1]
        if (!afterDecimal) {
            afterDecimal = "00"
        }
        val = beforeDecimal.concat(",", afterDecimal)
        return val
    }
    const currencyWithoutComma = (val) => {
        return val.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
    }
    const bolivaresFormat = (val) => {
        return val.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".")
    }
    const unFormat = (val) => {
        val = val.replace(/,00/g, "")
        // val = val.replace(",", "")
        // val = val.replace(".", "")
        val = val.split('.').join('')
        // val = val.split('.').join('')
        // val = val.split(',').join('')
        return val
    }
    inject('currencyFormat', currencyFormat)
    inject('unFormat', unFormat)
    inject('currencyWithoutComma', currencyWithoutComma)
}