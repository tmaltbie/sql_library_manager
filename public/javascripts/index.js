

const books = document.querySelectorAll('tr')
const body = document.querySelector('body')
const limit = 12
const paginationElement = createElement('div', 'className', 'pagination')

function createElement (elementName, property, value) {
    const element = document.createElement(elementName)
    element[property] = value
    return element
  }

const appendLinks = (list) => {
    const totalPages = Math.ceil(list.length / limit)
    const ul = createElement('ul')
    body.appendChild(paginationElement)
    paginationElement.appendChild(ul)

    for(let i=0; i<totalPages; i++) {
        const li = createElement('li')
        const a = createElement('a')
        ul.appendChild(li)
        li.appendChild(a)

        a.href = '#'
        a.textContent = i+1
        if (i===0) {
            a.className = 'active'
        }
    }
}

appendLinks(books)

module.exports