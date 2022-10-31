import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccImg01 = document.querySelector(".cc-logo span:nth-child(2) img")


function setCardType(type) {
  
  const colors = {
    
    visa: ["#436D99","#2D57F2"],
    mastercard: ["#DF6F29","#C69347"],
    default: ["black","gray"],
  }
  
  ccBgColor01.setAttribute("fill",colors[type][0])
  ccBgColor02.setAttribute("fill",colors[type][1])
  ccImg01.setAttribute("src", `/cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const cvc = document.querySelector("#security-code")
const padraoCvc = {
  mask: '0000'
}
const maskedCvc = IMask(cvc, padraoCvc)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate,expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    }
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g,'')
    const foundMask = dynamicMasked.compiledMasks.find(function(item){

      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber,cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () =>{
  alert("cartão adicionado")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const nome = document.querySelector("#card-holder")
nome.addEventListener("input", () => {
  const nomeCartao = document.querySelector("#nome")

  nomeCartao.innerText = nome.value.length === 0 ? "FULANO DA SILVA" : nome.value
})

maskedCvc.on("accept", () =>{
  updatedCvc(maskedCvc);
})

function updatedCvc(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.value.length === 0 ? "123" : code.value
}

cardNumberMasked.on("accept", () =>{
  const cardHolder = document.querySelector(".cc-info .cc-number")
  cardHolder.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value
  setCardType(cardNumberMasked.masked.currentMask.cardtype)
})

expirationDateMasked.on("accept",() =>{ 
  const expirationDateHolder = document.querySelector(".cc-expiration .value")
  expirationDateHolder.innerText = expirationDateMasked.value.length === 0 ? "02/32" : expirationDateMasked.value
})