const deleteProduct = (btn) => {
    console.log(btn)
    let prodId = btn.parentNode.querySelector('[name=productId]').value
    let csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article');

    //recupero la rotta delete e il csrftoken inserendo dinamicaminte l'id del prodotto settato nella rotta delete in routes
    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        console.log(result)
        return result.json() //come risultato recupero un json e non una pagina html 
    })
    .then(data => {
         console.log(data)
         productElement.parentNode.removeChild(productElement) //potremmo usare delete ma non è supportato da explorer, così tutti i browser lo supportano
        })
        .catch(err => {
            console.log(err)
        });
}