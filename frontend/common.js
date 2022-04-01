

const url = 'http://localhost:5002'
const mainId = document.querySelector('#content')
const mainInput = document.querySelector('#new-todo')
const addButton = document.querySelector('#add-new-todo')

const getData = () => {

    fetch(url + '/show-data')
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)

            let html = '<ul>'

            resp.forEach(value => {
                html += `<li data-id="${value._id}">
                            <span class="content">${value.content}</span>
                            ${value.data}
                            <button class="btn btn-primary btn-success edit-mode edit-data">Edit</button>
                            <button class="btn btn-primary btn-danger delete-mode delete-data">Delete</button>
                        </li>`

            })

            html += '</ul>'

            document.querySelector('#content').innerHTML = html



            document.querySelectorAll('.delete-data').forEach(element => {

                let id = element.parentElement.getAttribute('data-id')

                element.addEventListener('click', () => {

                    fetch(url + '/delete-data/' + id, {
                        method: "DELETE",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id })
                    })
                        .then(res => res.json())
                        .then(res => {
                            getData()

                        })

                })
            })


            document.querySelectorAll('.edit-data').forEach(element => {


                let id = element.parentElement.getAttribute('data-id')
                let content = element.parentElement.querySelector('.content').textContent

                element.addEventListener('click', () => {
                    mainInput.value = content
                    addButton.textContent = addButton.getAttribute('data-edit-label')
                    mainInput.classList.add('edit-mode')
                    mainInput.setAttribute('data-mode', 'edit')
                    addButton.setAttribute('data-id', id)

                })


            })

        })
}


window.addEventListener('load', () => {
    getData()
})



document.querySelector('#add-new-todo').addEventListener('click', () => {
    let id = addButton.getAttribute('data-id')
    let value = mainInput.value
    let mode = mainInput.getAttribute('edit-mode')
    let route = url + '/show-data'
    let method = 'POST'

    if (id === '') {
        let messages = document.querySelector('.messages')
        messages.innerHTML = 'Paspauskite edit mygtuka'
        messages.classList.add('show')
        return
    }

    fetch(url + '/edit-data/' + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: value })
    })

        .then(res => {

            mainInput.value = ''
            mainInput.classList.remove('edit-mode')
            addButton.textContent = addButton.getAttribute('data-add-label')



        })

    getData()

    window.location.reload()

})



















