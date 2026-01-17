/* LOGIN */
const USER="admin";
const PASS="1234";

function login(){
 if(user.value===USER && pass.value===PASS){
  mostrarApp(true);
 }else{
  error.textContent="Acceso incorrecto";
 }
}

function logout(){
 localStorage.removeItem("sesion");
 location.reload();
}

function mostrarApp(ok){
 document.getElementById("login").style.display=ok?"none":"block";
 document.getElementById("app").style.display=ok?"block":"none";
 localStorage.setItem("sesion","1");
}

if(localStorage.getItem("sesion")) mostrarApp(true);

/* SISTEMA */
const STORAGE="horarios_app_final";
const DIAS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

let estado=JSON.parse(localStorage.getItem(STORAGE))||{empleados:[]};

function guardar(){
 localStorage.setItem(STORAGE,JSON.stringify(estado));
}

function render(){
 gridEmpleados.innerHTML="";
 listaEmpleados.innerHTML="";
 listaDias.innerHTML="";

 DIAS.forEach(d=>{
  listaDias.innerHTML+=`<label><input type="checkbox" value="${d}"> ${d}</label> `;
 });

 estado.empleados.forEach(e=>{
  gridEmpleados.innerHTML+=`
  <div class="empleado">
   <b>${e.nombre}</b><br>
   <span class="estado ${estadoEmpleado(e)}">${textoEstado(e)}</span><br>
   <button class="add2" onclick="editarHorario('${e.id}')">Editar</button>
   <button class="del" onclick="eliminarEmpleado('${e.id}')">Eliminar</button>
  </div>`;

  listaEmpleados.innerHTML+=`
  <label><input type="checkbox" value="${e.id}"> ${e.nombre}</label><br>`;
 });

 pintarTabla();
 guardar();
}

function agregarEmpleado(){
 if(!nuevoEmpleado.value.trim()) return;
 estado.empleados.push({
  id:Date.now(),
  nombre:nuevoEmpleado.value,
  horarios:{}
 });
 nuevoEmpleado.value="";
 render();
}

function eliminarEmpleado(id){
 estado.empleados=estado.empleados.filter(e=>e.id!=id);
 render();
}

function asignarHorario(){
 const h=horarioTxt.value;
 const dias=[...listaDias.querySelectorAll("input:checked")].map(d=>d.value);
 const emps=[...listaEmpleados.querySelectorAll("input:checked")];

 if(!h||!dias.length||!emps.length){
  alert("Completa todos los campos");
  return;
 }

 emps.forEach(x=>{
  const e=estado.empleados.find(a=>a.id==x.value);
  dias.forEach(d=>e.horarios[d]=h);
 });

 render();
}

function editarHorario(id){
 const e=estado.empleados.find(a=>a.id==id);
 const d=prompt("Día:",DIAS.join(", "));
 if(!DIAS.includes(d)) return;
 e.horarios[d]=prompt("Horario:",e.horarios[d]||"");
 render();
}

function limpiarSemana(){
 if(confirm("¿Eliminar todos los horarios?")){
  estado.empleados.forEach(e=>e.horarios={});
  render();
 }
}

function estadoEmpleado(e){
 const c=Object.keys(e.horarios).length;
 return c===0?"none":c<7?"parcial":"ok";
}

function textoEstado(e){
 const c=Object.keys(e.horarios).length;
 return c===0?"Sin horario":c<7?"Horario parcial":"Horario completo";
}

function pintarTabla(){
 resultado.innerHTML=`
 <div class="tituloDep">HORARIOS</div>
 <table id="tabla">
 <tr><th>Empleado</th>${DIAS.map(d=>`<th>${d}</th>`).join("")}</tr>
 ${estado.empleados.map(e=>`
 <tr>
  <td>${e.nombre}</td>
  ${DIAS.map(d=>`<td>${e.horarios[d]||""}</td>`).join("")}
 </tr>`).join("")}
 </table>`;
}

function exportarExcel(){
 const html=document.getElementById("tabla").outerHTML;
 const blob=new Blob([html],{type:"application/vnd.ms-excel"});
 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="horarios.xls";
 a.click();
}

function exportarPDF(){
 window.print();
}

render();
