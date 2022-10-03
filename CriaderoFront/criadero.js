
//Definiendo variables

const url = 'http://localhost:3000/api/crias'

const contenedor = document.querySelector('tbody');
let resultados = '';

const modalCriadero = new bootstrap.Modal(document.getElementById('modalCriadero'));
const formRegistro = document.querySelector('form');
const nombre = document.getElementById('nombre');
const peso = document.getElementById('peso');
const marmoleo = document.getElementById('marmoleo');
const color = document.getElementById('color');
let opcion = ''

//mostrar el boton de regristro
btnCrear.addEventListener('click', ()=>{
    nombre.value=''
    peso.value= ''
    marmoleo.value = ''
    color.value = ''
    modalCriadero.show();
    opcion = 'crear'
});
//Función para mostrar los resultados 
const mostrar = (criadero) =>{
    criadero.forEach(crias => {
        resultados +=`
        <tr>
            <td>${crias.id}</td>
            <td>${crias.nombre_registrador}</td>
            <td>${crias.peso_ingreso}</td>
            <td>${crias.marmoleo}</td>
            <td>${crias.color_musculo}</td>
            <td>${crias.cuarentena}</td>
            <td>${crias.clasificacion}</td>
            <td class="text-center">
            <a class="btnCuarentena btn btn-warning"> Cuarentena</a>
            <a class="btnEditar btn btn-primary"> Editar</a>
            <a class="btnEliminar btn btn-danger"> Eliminar</a>
  
        </td>
        </tr>  
    `  
    })
    contenedor.innerHTML = resultados 
}


//Procedimiento Mostrar, fetch y promessas

fetch(url)
    .then(response => response.json())
    .then(data => mostrar(data))
    .catch(error => console.log(error))

    //Enmolar una función/ JQuery on()
    const on = (element, event, selector, handler) =>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }
        })
    }

    //Procedimiento Borrar registro
    on(document, 'click', '.btnEliminar', e =>{  
        const fila = e.target.parentNode.parentNode
        const id = fila.firstElementChild.innerHTML    
        alertify.confirm("Quieres eliminar esta cria de la base de datos?",
        function(){
            fetch(url+id, {
                method: 'DELETE'
            })
            .then( res => res.json() )
            .then( ()=> location.reload())
        
        },
        function(){
        alertify.error('Cancelar');
        })
                
})

//Procedimiento Editar 

let idForm = 0
on(document, 'click', '.btnEditar', e =>{  
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const nombreForm = fila.children[1].innerHTML
    const pesoForm = fila.children[2].innerHTML
    const marmoleoForm = fila.children[3].innerHTML
    const colorForm = fila.children[4].innerHTML
    nombre.value = nombreForm
    peso.value = pesoForm
    marmoleo.value = marmoleoForm
    color.value = colorForm

    opcion = 'editar'
    modalCriadero.show()
})

//Procedimiento para crear y editar
formRegistro.addEventListener('submit', (e)=>{
    if(opcion =='crear'){
         fetch(url,{
             method: 'POST',
             headers:{
                 'Content-Type':'application/json'
             },
             body: JSON.stringify({
                 nombre_registrador: nombre.value,
                peso_ingreso: peso.value,
                 marmoleo: marmoleo.value,
             color_musculo: color.value,

             })
         })
         .then( response => response.json())
         .then(data =>{
             const criaNueva = []
             criaNueva.push(data)
            location.reload();
         })
    }
    if(opcion =='editar'){
        fetch(url+idForm,{
         method: 'PUT',
         headers:{
             'Content-Type' : 'application/json'
         },
         body: JSON.stringify({
             nombre: nombreForm.value,
             peso: personalbar.value,
             marmoleo: marmoleo.value,
             color: color.value,
         })
     })
         .then(response => response.json())
         .then(response => location.reload())
    }
    modalCriadero.hide()
})

//Ingreso a Cuarentena

on(document, 'click', '.btnCuarentena', e =>{  
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML    
    alertify.confirm("¿Quieres ingresar a cuarentena esta cria?",
    function(){
        fetch(url+id+`cuarentena`, {
            method: 'POST'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
    
    },
    function(){
    alertify.error('Cancelar');
    })
            
})
