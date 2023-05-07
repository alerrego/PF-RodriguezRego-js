class Zapatilla {
  constructor(id,marca, modelo, talle, precio, cantidad,img) {
        this.id= id; 
        this.marca = marca;
         this.modelo = modelo;
         this.talle = [talle];
         this.precio = Number(precio);
         this.cantidad = Number(cantidad);
         this.img = img;
  }
}

class ProductoController {
  constructor() {
         this.listaZapatillas = []
  }
  async pedirDatosYMostrar(controladorDeCarrito){
    const res = await fetch(`./data.json`)
    this.listaZapatillas = await res.json()
    this.mostrarEnDOM()
    //LO AGREGO ACA PARA PODER OBTENER EL ARRAY DE FORMA ASINCRONA
    this.eventoClickAgregarZapatilla(controladorDeCarrito)
    
  }
  mostrarEnDOM(){
    this.listaZapatillas.forEach(zapatilla => {
      contenedor_productos.innerHTML += `<div class="card" style="width: 18rem;">
    <img src="${zapatilla.img}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">Marca: ${zapatilla.marca}</h5>
      <p class="card-text">Modelo: ${zapatilla.modelo}</p>
      <p class="card-text">Talle: ${zapatilla.talle}</p>
      <p class="card-text">Precio: $${zapatilla.precio}</p>
      <a href="#" class="btn btn-primary" id="cpu-${zapatilla.id}">COMPRAR</a>
    </div>
    </div>`
    })
  }
  eventoClickAgregarZapatilla(controladorDeCarrito){
    this.listaZapatillas.forEach(zapatilla =>{
      let btn = document.getElementById(`cpu-${zapatilla.id}`)
    
      btn.addEventListener("click", () =>{
          console.log("hola")
        // ME FIJO SI LA ZAPATILLA YA EXISTE EN CARRITO
        if(controladorDeCarrito.listaCarrito.includes(zapatilla)){
            zapatilla.cantidad += 1
            //ME GUARDO LA NUEVA CANT EN STORAGE
            controladorDeCarrito.guardarStorage()
            
            controladorDeCarrito.alertaAgregarCarrito(zapatilla);
        }
        else{
              // AGREGO LA ZAPATILLA A LA LISTA DEL CARRITO
              controladorDeCarrito.agregar(zapatilla)
              //GUARDO LA ZAPATILLA EN LOCAL STORAGE
              controladorDeCarrito.guardarStorage()
              //ALERTA
              controladorDeCarrito.alertaAgregarCarrito(zapatilla);
        }
    
        //MUESTRO EL CARRITO EN DOM
        controladorDeCarrito.mostrarCarritoDOM(contenedor_carrito)
    })
    })
  }
}
class CarritoController {
  constructor() {
         this.listaCarrito = []
  }
  agregar(zapatilla) {
        this.listaCarrito.push(zapatilla)
  }
  guardarStorage(){
    let listaCarritoJSON = JSON.stringify(controladorDeCarrito.listaCarrito)
    localStorage.setItem("listaCarrito",listaCarritoJSON)
  }
  levantarStorage(){
    let listaCarritoJSON = localStorage.getItem("listaCarrito")
    this.listaCarrito = JSON.parse(listaCarritoJSON)
  }
  mostrarCarritoDOM(contenedor){
      contenedor.innerHTML = ``
    this.listaCarrito.forEach(zapatilla =>{
      contenedor.innerHTML += `<div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${zapatilla.img}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Marca: ${zapatilla.marca}</h5>
            <p class="card-text">Modelo: ${zapatilla.modelo}</p>
            <div class ="cant">
              <button id="resta${zapatilla.id}"><i class="fa-sharp fa-solid fa-minus"></i></button>
              <p class="card-text">Cantidad: ${zapatilla.cantidad}</p>
              <button id="suma${zapatilla.id}"><i class="fa-sharp fa-solid fa-plus"></i></button>
            </div>
            <p class="card-text">Precio: $${zapatilla.precio}</p>
            <div class="btn_borrar">
              <button id="borrar${zapatilla.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>`
    })
    //Llamo a la funcion limpiar carrito
    this.limpiarCarrito()
    //LLAMO A LA FN CALCULAR TOTAL EN EL CARRITO
    this.calcularTotal()

    //SUMAR/RESTAR
    this.sumarCantidad()
    this.restarCantidad()
    this.eliminar()

  }
  eliminar(){
    this.listaCarrito.forEach(zapatilla =>{
      let btn_borrar = document.getElementById(`borrar${zapatilla.id}`)
    btn_borrar.addEventListener("click", ()=>{
      let pos = this.listaCarrito.indexOf(zapatilla)
      this.listaCarrito.splice(pos,1);
      this.guardarStorage()
      this.mostrarCarritoDOM(contenedor_carrito)
    })
    })
  }
  sumarCantidad(){
    this.listaCarrito.forEach(zapatilla =>{
      let btn_suma = document.getElementById(`suma${zapatilla.id}`)
    btn_suma.addEventListener("click", ()=>{
      zapatilla.cantidad += 1
      this.guardarStorage()
      this.mostrarCarritoDOM(contenedor_carrito)
    })
    })
  }
  restarCantidad(){
    this.listaCarrito.forEach(zapatilla =>{
      let btn_resta = document.getElementById(`resta${zapatilla.id}`)
    btn_resta.addEventListener("click", ()=>{
      if(zapatilla.cantidad > 1){
        zapatilla.cantidad += -1
      }
      this.guardarStorage()
      this.mostrarCarritoDOM(contenedor_carrito)
    })
    })
  }
  limpiarCarrito(){
    //OBTENGO EL BOTON
    let btn_limpiar = document.getElementById("btn_limpiar")
    btn_limpiar.addEventListener ("click", () =>{
    this.listaCarrito = []
    contenedor_carrito.innerHTML = ``
    //BORRO LOCAL CON LA FN
    localStorage.removeItem("listaCarrito")
    //RESTAURO CANTIDADES
    controladorDeProductos.listaZapatillas.forEach(zapatilla =>{
      zapatilla.cantidad = 1
    })
    this.guardarStorage()
    res.innerHTML = ``

    })
}
  calcularTotal(){
    //OBTENGO EL ELEMENTO HTML  
    let btn_total = document.getElementById("btn_finalizar")
    btn_total.addEventListener("click", () =>{
        //CON EL CLICK LLAMO LA FN REDUCE Y ME HACE EL CONTADOR
        const total = this.listaCarrito.reduce((acc,el) => acc + (el.cantidad*el.precio),0)
        let res = document.getElementById("res")
        res.innerHTML= `El total a pagar es: $${total}`
        //ALERTA (COND PARA QUE SALGA SI HAY ALGUN PRODUCTO)
        if(this.listaCarrito != 0){
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Tu compra ha sido finalizada',
          showConfirmButton: false,
          timer: 1000,
        })}

    })
}
alertaAgregarCarrito(zapatilla){
   //ALERTA
   Swal.fire({
    title: `${zapatilla.modelo}`,
    text: 'Zapatilla agregada al carrito',
    imageUrl: `${zapatilla.img}`,
    imageWidth: 150,
    imageHeight: 75,
    showConfirmButton: false,
    timer: 1000,
    position: 'bottom-end',
    width: 250
  })
}
}

// INICIALIZO LOS CONTROLADORES
const controladorDeProductos = new ProductoController();
const controladorDeCarrito = new CarritoController();

//DOM
const contenedor_productos = document.getElementById("contenedor_productos")
const contenedor_carrito = document.getElementById("contenedor_carrito")

//ME FIJO SI EXISTE ALGO EN listaCarrito
if(localStorage.getItem("listaCarrito")){
  //COMPRUEBO SI HAY ALGO EN LOCAL STORAGE
  controladorDeCarrito.levantarStorage()
  //LO MUESTRO POR DOM
  controladorDeCarrito.mostrarCarritoDOM(contenedor_carrito)  
}else{
  controladorDeCarrito.listaCarrito = []
}
//MUESTRO LAS ZAPATILLAS POR DOM
controladorDeProductos.pedirDatosYMostrar(controladorDeCarrito)



