//Definiendo variables

const url = 'http://localhost:3000/api/crias'

const contenedor = document.querySelector('tbody');
let resultados = '';
//Regustro  de Crías (Criadero)
const modalCriadero = new bootstrap.Modal(document.getElementById('modalCriadero'));
const formRegistro = document.querySelector('form');
const nombre = document.getElementById('nombre');
const peso = document.getElementById('peso');
const marmoleo = document.getElementById('marmoleo');
const color = document.getElementById('color');
//Registro Sensores
const modalSensores = new bootstrap.Modal(document.getElementById('modalSensores'));
const formSensores = document.querySelector('.formSensores');
const id = document.getElementById('id');
const freCardiaca = document.getElementById('freCardiaca');
const preSanguinea = document.getElementById('preSanguinea');
const freRespiratoria = document.getElementById('freRespiratoria');
const temperatura = document.getElementById('temperatura');
let opcion = ''

//Mostrar el boton de regristro de crias
btnCrear.addEventListener('click', ()=>{
    nombre.value=''
    peso.value= ''
    marmoleo.value = ''
    color.value = ''
    modalCriadero.show();
    opcion = 'crear'
});
//mostrar el boton de regristro sensores
btnSensores.addEventListener('click', ()=>{
    id.value=''
    freCardiaca.value= ''
    preSanguinea.value = ''
    freRespiratoria.value = ''
    temperatura.value = ''
    modalSensores.show();
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
            <br>
            <a class="btnquitarCuarentena btn btn-success mt-2"> Quitar <br> Cuarentena</a>
            <br>
            <a class="btnEditar btn btn-primary mt-2"> Editar</a>
            <a class="btnEliminar btn btn-danger mt-2"> Eliminar</a>
  
        </td>
        </tr>  
    `  
    })
    contenedor.innerHTML = resultados 
}
//Función para mostrar los resultados  en sensores
const mostrarSensores = (sensores) =>{
    sensores.forEach(sensor => {
        resultados +=`
        <tr>
            <td>${sensor.id}</td>
            <td>${sensor.freCardiaca}</td>
            <td>${sensor.preSanguinea}</td>
            <td>${sensor.freRespiratoria}</td>
            <td>${sensor.temperatura}</td>
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
        fetch(url+'/'+idForm,{
         method: 'PUT',
         headers:{
             'Content-Type' : 'application/json'
         },
         body: JSON.stringify({
             nombre_registrador: nombre.value,
             peso_ingreso: peso.value,
             marmoleo: marmoleo.value,
             color_musculo: color.value,
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
    const set = fila.lastElementChild.previousSibling.innerHTML
    alertify.confirm("¿Quieres ingresar a cuarentena esta cria?",
    function(){
        fetch(url+'/'+id+'/'+'Si', {
            method: 'PUT',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                id : id
            })
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
    
    },
    function(){
    alertify.error('Cancelar');
    })
            
})

on(document, 'click', '.btnquitarCuarentena', e =>{  
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    const set = fila.lastElementChild.previousSibling.innerHTML
    alertify.confirm("¿Deseas quitar esta cria de la cuarentena?",
    function(){
        fetch(url+'/'+id+'/'+'No', {
            method: 'PUT',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                id : id
            })
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
    
    },
    function(){
    alertify.error('Cancelar');
    })
            
})
