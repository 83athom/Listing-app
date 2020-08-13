const itemForm = document.querySelector('form')
const output = document.querySelector('#listings')

itemForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    fetch('/items/:id').then((response)=>{
        response.json().then((data)=>{
            if(data.error) {
                console.log(data.error)
            }
            else {
                alert('Item created with an ID: ' + data._id + '\n'+'Keep this ID to remove the listing.')
                output.innerHTML+='<li><a href="items/"' + data._id + '>' + data.title + ' ' + data.description + ' ' + data.category + '</li>'
            }
        })
    })   
})