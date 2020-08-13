const output = document.querySelector('#listings')

fetch('/items').then((response)=>{
    response.json().then((data)=>{
        if(data.error) {
            console.log(data.error)
        }
        else {
            output.innerHTML=''
            data.forEach(item => {
                output.innerHTML+='<li><a href="items/"' + item._id + '>' + item.title + ' ' + item.description + ' ' + item.category + '</li>'
            });
        }
    })
})