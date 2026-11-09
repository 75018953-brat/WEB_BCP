
// =============================================
// CONFIGURACIÓN GLOBAL DE SUPABASE
// =============================================
const SUPABASE_URL = 'https://qprlctybnsdivacitaly.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wV5PE-pPmrTQH0QkI7IjAw_MsJ_eSUB';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Evento principal: se ejecuta cuando la página carga completamente
document.addEventListener('DOMContentLoaded', () => {
  initLoginModule();
  initSolicitudModule();
  initCuentaModule();
  initPreappModule();
  initTarjetaModule();
});

// =============================================
// 1. MÓDULO: LOGIN (login-form -> TB_Usuario)
// =============================================
function initLoginModule() {
  const formulario = document.getElementById('login-form');
  if (!formulario) return; // Si no existe en la página actual, ignora el módulo

  const tabla = document.getElementById('tabla');
  const btnCancelar = document.getElementById('btnCancelar');
  const campoId = document.getElementById('id');
  const campoDocumento = document.getElementById('documento');
  const campoClavePersona = document.getElementById('clavePersona');
  const campoRuc = document.getElementById('ruc');
  const campoUsuarioEmpresa = document.getElementById('usuarioEmpresa');
  const campoClaveEmpresa = document.getElementById('claveEmpresa');
  const panePersona = document.getElementById('pane-persona');
  const paneEmpresa = document.getElementById('pane-empresa');

  let usuarios = [];

  async function listar() {
    if (!tabla) return;
    const { data, error } = await db.from('TB_Usuario').select('*').order('id', { ascending: false });
    if (error) return alert('Error al leer: ' + error.message);
    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="5">No hay usuarios registrados</td></tr>';
      return;
    }
    usuarios = data;
    tabla.innerHTML = '';
    data.forEach(usr => {
      tabla.innerHTML += `
        <tr>
          <td>${usr.tipo_cuenta}</td>
          <td>${usr.documento || '-'}</td>
          <td>${usr.ruc || '-'}</td>
          <td>${usr.usuario || '-'}</td>
          <td>
            <button onclick="editarUsuario(${usr.id})">Editar</button>
            <button onclick="eliminarUsuario(${usr.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const esPersona = panePersona && panePersona.style.display !== 'none';
    const usuario = esPersona 
      ? { tipo_cuenta: 'Persona', documento: campoDocumento.value.trim(), clave: campoClavePersona.value.trim() }
      : { tipo_cuenta: 'Empresa', ruc: campoRuc.value.trim(), usuario: campoUsuarioEmpresa.value.trim(), clave: campoClaveEmpresa.value.trim() };

    let res = campoId.value === '' 
      ? await db.from('TB_Usuario').insert(usuario) 
      : await db.from('TB_Usuario').update(usuario).eq('id', campoId.value);

    if (res.error) return alert('Error al guardar: ' + res.error.message);
    limpiar();
    listar();
  });

  window.editarUsuario = function(id) {
    const usr = usuarios.find(u => u.id === id);
    campoId.value = usr.id;
    if (usr.tipo_cuenta === 'Persona') {
      if (panePersona) panePersona.style.display = 'block';
      if (paneEmpresa) paneEmpresa.style.display = 'none';
      if (campoDocumento) campoDocumento.value = usr.documento || '';
      if (campoClavePersona) campoClavePersona.value = usr.clave || '';
    } else {
      if (panePersona) panePersona.style.display = 'none';
      if (paneEmpresa) paneEmpresa.style.display = 'block';
      if (campoRuc) campoRuc.value = usr.ruc || '';
      if (campoUsuarioEmpresa) campoUsuarioEmpresa.value = usr.usuario || '';
      if (campoClaveEmpresa) campoClaveEmpresa.value = usr.clave || '';
    }
    if (btnCancelar) btnCancelar.classList.remove('oculto');
  };

  window.eliminarUsuario = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    const { error } = await db.from('TB_Usuario').delete().eq('id', id);
    if (error) return alert('Error al eliminar: ' + error.message);
    listar();
  };

  function limpiar() {
    formulario.reset();
    campoId.value = '';
    if (btnCancelar) btnCancelar.classList.add('oculto');
  }

  if (btnCancelar) btnCancelar.addEventListener('click', limpiar);
  listar();
}

// =============================================
// 2. MÓDULO: SOLICITUD DE INFORMACIÓN (formulario -> TB_Solicitud)
// =============================================
function initSolicitudModule() {
  const formulario = document.getElementById('formulario');
  if (!formulario) return;

  const tabla = document.getElementById('tabla');
  const titulo = document.getElementById('titulo');
  const btnCancelar = document.getElementById('btnCancelar');
  const mensajeOk = document.getElementById('cobro-ok');

  const campoId = document.getElementById('id');
  const campoRuc = document.getElementById('ruc');
  const campoRazonSocial = document.getElementById('razonSocial');
  const campoSolucion = document.getElementById('solucion');

  let solicitudes = [];

  async function listar() {
    if (!tabla) return;
    const { data, error } = await db.from('TB_Solicitud').select('*').order('id', { ascending: false });
    if (error) return alert('Error al leer: ' + error.message);
    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="4">No hay solicitudes registradas</td></tr>';
      return;
    }
    solicitudes = data;
    tabla.innerHTML = '';
    data.forEach(sol => {
      tabla.innerHTML += `
        <tr>
          <td>${sol.ruc}</td>
          <td>${sol.razon_social}</td>
          <td>${sol.solucion}</td>
          <td>
            <button onclick="editarSolicitud(${sol.id})">Editar</button>
            <button onclick="eliminarSolicitud(${sol.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const solicitud = {
      ruc: campoRuc.value.trim(),
      razon_social: campoRazonSocial.value.trim(),
      solucion: campoSolucion.value
    };

    let res = campoId.value === '' 
      ? await db.from('TB_Solicitud').insert(solicitud)
      : await db.from('TB_Solicitud').update(solicitud).eq('id', campoId.value);

    if (res.error) return alert('Error al guardar: ' + res.error.message);
    if (mensajeOk) mensajeOk.classList.add('show');
    limpiar();
    listar();
  });

  window.editarSolicitud = function(id) {
    const sol = solicitudes.find(s => s.id === id);
    campoId.value = sol.id;
    campoRuc.value = sol.ruc;
    campoRazonSocial.value = sol.razon_social;
    campoSolucion.value = sol.solucion;
    if (titulo) titulo.textContent = 'Editando solicitud';
    if (btnCancelar) btnCancelar.classList.remove('oculto');
    if (mensajeOk) mensajeOk.classList.remove('show');
  };

  window.eliminarSolicitud = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
    const { error } = await db.from('TB_Solicitud').delete().eq('id', id);
    if (error) return alert('Error al eliminar: ' + error.message);
    listar();
  };

  function limpiar() {
    formulario.reset();
    campoId.value = '';
    if (titulo) titulo.textContent = 'Quiero más información';
    if (btnCancelar) btnCancelar.classList.add('oculto');
  }

  if (btnCancelar) btnCancelar.addEventListener('click', () => { limpiar(); if (mensajeOk) mensajeOk.classList.remove('show'); });
  listar();
}

// =============================================
// 3. MÓDULO: APERTURA DE CUENTA (cuenta-form -> TB_Cuenta)
// =============================================
function initCuentaModule() {
  const formulario = document.getElementById('cuenta-form');
  if (!formulario) return;

  const tabla = document.getElementById('tabla');
  const titulo = document.getElementById('titulo');
  const btnCancelar = document.getElementById('btnCancelar');
  const resultado = document.getElementById('cuenta-result');

  const campoId = document.getElementById('id');
  const campoNombre = document.getElementById('nombreCompleto');
  const campoDni = document.getElementById('dni');
  const campoCelular = document.getElementById('celular');
  const campoCorreo = document.getElementById('correo');
  const campoTipoCuenta = document.getElementById('tipoCuenta');

  let cuentas = [];

  async function listar() {
    if (!tabla) return;
    const { data, error } = await db.from('TB_Cuenta').select('*').order('id', { ascending: false });
    if (error) return alert('Error al leer: ' + error.message);
    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="6">No hay cuentas registradas</td></tr>';
      return;
    }
    cuentas = data;
    tabla.innerHTML = '';
    data.forEach(cta => {
      tabla.innerHTML += `
        <tr>
          <td>${cta.nombre_completo}</td>
          <td>${cta.dni}</td>
          <td>${cta.celular}</td>
          <td>${cta.correo}</td>
          <td>${cta.tipo_cuenta}</td>
          <td>
            <button onclick="editarCuenta(${cta.id})">Editar</button>
            <button onclick="eliminarCuenta(${cta.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const registro = {
      nombre_completo: campoNombre.value.trim(),
      dni: campoDni.value.trim(),
      celular: campoCelular.value.trim(),
      correo: campoCorreo.value.trim(),
      tipo_cuenta: campoTipoCuenta.value
    };

    let res = campoId.value === '' 
      ? await db.from('TB_Cuenta').insert(registro)
      : await db.from('TB_Cuenta').update(registro).eq('id', campoId.value);

    if (res.error) return alert('Error al guardar: ' + res.error.message);
    if (resultado) {
      resultado.textContent = campoId.value === '' ? '¡Cuenta registrada con éxito!' : '¡Cuenta actualizada con éxito!';
      resultado.classList.add('show');
    }
    limpiar();
    listar();
  });

  window.editarCuenta = function(id) {
    const cta = cuentas.find(c => c.id === id);
    campoId.value = cta.id;
    campoNombre.value = cta.nombre_completo;
    campoDni.value = cta.dni;
    campoCelular.value = cta.celular;
    campoCorreo.value = cta.correo;
    campoTipoCuenta.value = cta.tipo_cuenta;
    if (titulo) titulo.textContent = 'Editando registro de cuenta';
    if (btnCancelar) btnCancelar.classList.remove('oculto');
    if (resultado) resultado.classList.remove('show');
  };

  window.eliminarCuenta = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    const { error } = await db.from('TB_Cuenta').delete().eq('id', id);
    if (error) return alert('Error al eliminar: ' + error.message);
    listar();
  };

  function limpiar() {
    formulario.reset();
    campoId.value = '';
    if (titulo) titulo.textContent = 'Apertura de Cuenta';
    if (btnCancelar) btnCancelar.classList.add('oculto');
  }

  if (btnCancelar) btnCancelar.addEventListener('click', () => { limpiar(); if (resultado) resultado.classList.remove('show'); });
  listar();
}

// =============================================
// 4. MÓDULO: PREEVALUACIÓN (preapp-form -> TB_Preevaluacion)
// =============================================
function initPreappModule() {
  const formulario = document.getElementById('preapp-form');
  if (!formulario) return;

  const tabla = document.getElementById('tabla');
  const titulo = document.getElementById('titulo');
  const btnCancelar = document.getElementById('btnCancelar');
  const resultado = document.getElementById('preapp-result');

  const campoId = document.getElementById('id');
  const campoDocType = document.getElementById('doc-type');
  const campoDocNum = document.getElementById('doc-num');

  let preevaluaciones = [];

  if (campoDocType) {
    campoDocType.addEventListener('change', () => {
      const tipo = campoDocType.value;
      if (tipo === 'RUC') campoDocNum.maxLength = 11;
      else if (tipo === 'DNI') campoDocNum.maxLength = 8;
      else campoDocNum.maxLength = 12;
    });
  }

  async function listar() {
    if (!tabla) return;
    const { data, error } = await db.from('TB_Preevaluacion').select('*').order('id', { ascending: false });
    if (error) return alert('Error al leer: ' + error.message);
    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="3">No hay preevaluaciones registradas</td></tr>';
      return;
    }
    preevaluaciones = data;
    tabla.innerHTML = '';
    data.forEach(item => {
      tabla.innerHTML += `
        <tr>
          <td>${item.tipo_documento}</td>
          <td>${item.numero_documento}</td>
          <td>
            <button onclick="editarPreapp(${item.id})">Editar</button>
            <button onclick="eliminarPreapp(${item.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const registro = {
      tipo_documento: campoDocType.value,
      numero_documento: campoDocNum.value.trim()
    };

    let res = campoId.value === '' 
      ? await db.from('TB_Preevaluacion').insert(registro)
      : await db.from('TB_Preevaluacion').update(registro).eq('id', campoId.value);

    if (res.error) return alert('Error al guardar: ' + res.error.message);
    if (resultado) {
      resultado.textContent = campoId.value === '' ? '¡Consulta registrada correctamente!' : '¡Consulta actualizada correctamente!';
      resultado.classList.add('show');
    }
    limpiar();
    listar();
  });

  window.editarPreapp = function(id) {
    const item = preevaluaciones.find(p => p.id === id);
    campoId.value = item.id;
    campoDocType.value = item.tipo_documento;
    campoDocNum.value = item.numero_documento;
    if (titulo) titulo.textContent = 'Editando consulta';
    if (btnCancelar) btnCancelar.classList.remove('oculto');
    if (resultado) resultado.classList.remove('show');
  };

  window.eliminarPreapp = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    const { error } = await db.from('TB_Preevaluacion').delete().eq('id', id);
    if (error) return alert('Error al eliminar: ' + error.message);
    listar();
  };

  function limpiar() {
    formulario.reset();
    campoId.value = '';
    if (titulo) titulo.textContent = 'Consulta de Preevaluación';
    if (btnCancelar) btnCancelar.classList.add('oculto');
  }

  if (btnCancelar) btnCancelar.addEventListener('click', () => { limpiar(); if (resultado) resultado.classList.remove('show'); });
  listar();
}

// =============================================
// 5. MÓDULO: TARJETAS (tarjeta-form -> TB_Tarjeta)
// =============================================
function initTarjetaModule() {
  const formulario = document.getElementById('tarjeta-form');
  if (!formulario) return;

  const tabla = document.getElementById('tabla');
  const titulo = document.getElementById('titulo');
  const btnCancelar = document.getElementById('btnCancelar');
  const resultado = document.getElementById('tarjeta-result');

  const campoId = document.getElementById('id');
  const campoTipoTarjeta = document.getElementById('tipoTarjeta');
  const campoDni = document.getElementById('dni');
  const campoIngresos = document.getElementById('ingresos');
  const campoCelular = document.getElementById('celular');

  let tarjetas = [];

  async function listar() {
    if (!tabla) return;
    const { data, error } = await db.from('TB_Tarjeta').select('*').order('id', { ascending: false });
    if (error) return alert('Error al leer: ' + error.message);
    if (data.length === 0) {
      tabla.innerHTML = '<tr><td colspan="5">No hay solicitudes registradas</td></tr>';
      return;
    }
    tarjetas = data;
    tabla.innerHTML = '';
    data.forEach(item => {
      tabla.innerHTML += `
        <tr>
          <td>${item.tipo_tarjeta}</td>
          <td>${item.dni}</td>
          <td>S/ ${parseFloat(item.ingresos).toFixed(2)}</td>
          <td>${item.celular}</td>
          <td>
            <button onclick="editarTarjeta(${item.id})">Editar</button>
            <button onclick="eliminarTarjeta(${item.id})">Eliminar</button>
          </td>
        </tr>`;
    });
  }

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const registro = {
      tipo_tarjeta: campoTipoTarjeta.value,
      dni: campoDni.value.trim(),
      ingresos: parseFloat(campoIngresos.value),
      celular: campoCelular.value.trim()
    };

    let res = campoId.value === '' 
      ? await db.from('TB_Tarjeta').insert(registro)
      : await db.from('TB_Tarjeta').update(registro).eq('id', campoId.value);

    if (res.error) return alert('Error al guardar: ' + res.error.message);
    if (resultado) {
      resultado.textContent = campoId.value === '' ? '¡Solicitud enviada correctamente!' : '¡Solicitud actualizada correctamente!';
      resultado.classList.add('show');
    }
    limpiar();
    listar();
  });

  window.editarTarjeta = function(id) {
    const item = tarjetas.find(t => t.id === id);
    campoId.value = item.id;
    campoTipoTarjeta.value = item.tipo_tarjeta;
    campoDni.value = item.dni;
    campoIngresos.value = item.ingresos;
    campoCelular.value = item.celular;
    if (titulo) titulo.textContent = 'Editando solicitud de tarjeta';
    if (btnCancelar) btnCancelar.classList.remove('oculto');
    if (resultado) resultado.classList.remove('show');
  };

  window.eliminarTarjeta = async function(id) {
    if (!confirm('¿Seguro que deseas eliminar esta solicitud?')) return;
    const { error } = await db.from('TB_Tarjeta').delete().eq('id', id);
    if (error) return alert('Error al eliminar: ' + error.message);
    listar();
  };

  function limpiar() {
    formulario.reset();
    campoId.value = '';
    if (titulo) titulo.textContent = 'Solicitud de Tarjeta';
    if (btnCancelar) btnCancelar.classList.add('oculto');
  }

  if (btnCancelar) btnCancelar.addEventListener('click', () => { limpiar(); if (resultado) resultado.classList.remove('show'); });
  listar();
}



























const btn = document.querySelector('#myButton');

btn.addEventListener('click', () => {
  if (btn.textContent === 'Oscurecer') {
    // 1. Pasa a Modo Oscuro
    document.body.classList.remove('theme-blue');
    document.body.classList.add('theme-dark');
    btn.textContent = 'Azul';
  } else if (btn.textContent === 'Azul') {
    // 2. Pasa a Modo Azul / Noche
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-blue');
    btn.textContent = 'Aclarar';
  } else {
    // 3. Pasa a Modo Claro (por defecto)
    document.body.classList.remove('theme-dark', 'theme-blue');
    btn.textContent = 'Oscurecer';
  }
});


