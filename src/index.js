const formEl = document.querySelector("#new-quote-form")
const formQuote = formEl.querySelector('#new-quote')
const formAuthor = formEl.querySelector('#author')

let currentQuote

function getQuotes() {
  return fetch("http://localhost:3000/quotes")
  .then(resp => resp.json())
}

function showQuote(quote) {
  let ulEl = document.querySelector('#quote-list')
  let liEl = document.createElement('li')
  liEl.id = `quote-${quote.id}`
  liEl.innerHTML += `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span id='quote-likes-${quote.id}'>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-edit'>Edit</button>
    </blockquote>
  `
  ulEl.append(liEl)

  let deleteBtn = liEl.querySelector('.btn-danger')
  deleteBtn.addEventListener('click', event => {
    let currentLiEl = document.querySelector(`#quote-${quote.id}`)
    deleteQuote(quote)
    currentLiEl.remove()
  })


  let likeBtn = liEl.querySelector('.btn-success')
  likeBtn.addEventListener('click', event => {
    let currentLikes = document.querySelector(`#quote-likes-${quote.id}`)
    quote.likes++
    currentLikes.innerText = quote.likes
    updateQuote(quote)
  })


    // let editBtn = liEl.querySelector('.btn-edit')
    // editBtn.addEventListener('click', () => {
    //   currentQuote = quote
    //   formQuote.value = currentQuote.quote
    //   formAuthor.value = currentQuote.author
    // })

}

function showQuotes(quotes) {
  quotes.forEach(showQuote)
}

function formCreateListener() {
formEl.addEventListener('submit', event => {
    event.preventDefault()
    let quote = {
    quote: formQuote.value,
    author: formAuthor.value,
    likes: 0
    }

    createQuote(quote)
    .then(showQuote)

    formEl.reset()
  })
}



function createQuote(quote) {
  return fetch("http://localhost:3000/quotes", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quote)
  }).then(resp => resp.json())
}

function deleteQuote(quote) {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'DELETE'
  }).then(resp => resp.json())
}

function updateQuote(quote) {
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(quote)
  }).then(resp => resp.json())
}

function initialize() {
  getQuotes()
  .then(showQuotes)
  formCreateListener()
}

initialize()
