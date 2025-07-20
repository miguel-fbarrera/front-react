import React, { useState } from 'react';

const primaryColor = 'rgba(225, 0, 152, 1)';
const primaryColor67 = 'rgba(225, 0, 152, 0.67)';
const primaryColor15 = 'rgba(225, 0, 152, 0.15)';
const primaryHover = 'rgba(225, 0, 152, 0.07)';

export default function App() {
  // Estado para manejar los datos del formulario
  const initialFormState = {
    nombre: '', correo: '', username: '', password: '', rol: '', area: '',
  };
  const [formData, setFormData] = useState(initialFormState);

  // Estado para saber si estamos editando o creando
  const [editingId, setEditingId] = useState(null);

  // Estado para la lista de usuarios del modal
  const [users, setUsers] = useState([]);

  // Estados para controlar la visibilidad de los modales
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isUserListModalOpen, setUserListModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // --- MANEJADORES DE LÓGICA ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, name, value }));
  };

  const validateForm = () => {
    const { nombre, correo, username, password, rol, area } = formData;
    if (nombre.length < 2 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      alert("Por favor ingrese un nombre válido."); return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert("Por favor ingrese un correo válido."); return false;
    }
    if (username.length < 4) {
      alert("El nombre de usuario debe tener al menos 4 caracteres."); return false;
    }
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres."); return false;
    }
    if (!rol || !area) {
      alert("Por favor seleccione un rol y un área."); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !validateForm()) return;

    const isEditing = !!editingId;
    const url = isEditing ? `editarusuario?id=${editingId}` : 'registrar';
    const formPayload = new FormData(e.target);
    if(isEditing) formPayload.append('id', editingId);

    try {
      const response = await fetch(url, { method: 'POST', body: formPayload });
      if (!response.ok) throw new Error('La respuesta del servidor no fue OK');
      
      setModalMessage(`Usuario ${isEditing ? 'actualizado' : 'registrado'} correctamente.`);
      setSuccessModalOpen(true);
      setFormData(initialFormState);
      setEditingId(null);
    } catch (error) {
      console.error('Error en el formulario:', error);
      alert(`Error al ${isEditing ? 'actualizar' : 'registrar'} el usuario.`);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('consultar');
      const data = await response.json();
      setUsers(data);
      setUserListModalOpen(true);
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const fetchForm = new FormData();
      fetchForm.append('id', id);
      const response = await fetch('buscarusuario', { method: 'POST', body: fetchForm });
      const userToEdit = await response.json();
      
      setFormData({
        nombre: userToEdit.nombre || '',
        correo: userToEdit.correo || '',
        username: userToEdit.username || '',
        password: '',
        rol: userToEdit.rol || '',
        area: userToEdit.area || '',
      });
      setEditingId(id);
      setUserListModalOpen(false);
    } catch (error) {
      console.error('Error al buscar usuario para editar:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await fetch(`eliminarUsuario?id=${encodeURIComponent(id)}`);
        // Actualizar la lista en la UI sin volver a llamar a la API
        setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
        alert("Usuario eliminado.");
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert("Error al eliminar el usuario.");
      }
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#f3f2f7] font-['Barlow']">
      
      {/*  SideMenu  */}
      <aside className="absolute top-0 left-[-3px] w-[300px] h-[1000px] bg-white overflow-hidden">
        <div className="absolute top-[65px] left-5 w-[240px] h-[68px] bg-[url('/src/assets/logodw.png')] bg-cover"></div>
        <div className="absolute top-[214px] left-[24px]">
          {['Registrar usuario', 'Canales', 'Oportunidades', 'Homologaciones'].map((text, index) => (
            <div key={text} className={`relative w-[230px] h-[54px] mb-5 rounded-lg cursor-pointer hover:bg-[${primaryHover}] ${index === 0 ? `bg-[${primaryColor15}]` : ''}`}>
              {index === 0 && <div className={`absolute -left-6 top-1.5 w-2 h-[43px] bg-[${primaryColor}] rounded-full`}></div>}
              <span className={`absolute top-[15px] left-5 text-lg font-medium ${index === 0 ? `text-[${primaryColor}]` : 'text-black'}`}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/*Main Screen & Form*/}
      <main className="ml-[300px] p-10 relative h-full">
        <h1 className="absolute top-[46px] left-1/2 -translate-x-1/2 w-max text-4xl font-bold text-center">
          Registro de usuario nuevo
        </h1>
        
        <button onClick={fetchUsers} className={`absolute top-[180px] left-[296px] w-[150px] h-[30px] bg-[${primaryColor67}] text-white font-bold text-[15px] rounded-md hover:bg-[${primaryColor}]`}>
          Ver Usuarios
        </button>

        <form onSubmit={handleSubmit} className="absolute top-[252px] left-[296px]">
          <div className="grid grid-cols-2 gap-x-[68px]">
            <div>
              <label className="block text-xl font-medium mb-1">Nombre</label>
              <input name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-[320px] h-[50px] bg-white border border-black rounded-lg text-xl px-5" placeholder="Nombre" />
            </div>
            <div>
              <label className="block text-xl font-medium mb-1">Correo</label>
              <input name="correo" type="email" value={formData.correo} onChange={handleInputChange} className="w-[320px] h-[50px] bg-white border border-black rounded-lg text-xl px-5" placeholder="Correo" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-[68px] mt-11">
            <div>
              <label className="block text-xl font-medium mb-1">Usuario</label>
              <input name="username" value={formData.username} onChange={handleInputChange} className="w-[320px] h-[50px] bg-white border border-black rounded-lg text-xl px-5" placeholder="Usuario" />
            </div>
            <div>
              <label className="block text-xl font-medium mb-1">Contraseña</label>
              <input name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-[320px] h-[50px] bg-white border border-black rounded-lg text-xl px-5" placeholder="Contraseña" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-[68px] mt-11">
            <div>
              <label className="block text-xl font-medium mb-1">Rol</label>
              <select name="rol" value={formData.rol} onChange={handleInputChange} className="w-[320px] h-[50px] bg-white border border-black rounded-lg text-xl px-5">
                <option value="" disabled>Seleccione el rol</option>
                <option value="Operador">Operador</option>
                <option value="Lider">Lider</option>
              </select>
            </div>
            <div>
              <label className="block text-xl font-medium mb-1">Área</label>
              <select name="area" value={formData.area} onChange={handleInputChange} className="w-[320px] h-[50px] bg-white border border-black rounded-lg text-xl px-5">
                <option value="" disabled>Seleccione el área</option>
                <option value="Pre-Sales">Pre-Sales</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>
          </div>
          <div className="absolute top-[413px] left-[150px] flex gap-x-11">
            <button type="button" onClick={resetForm} className={`w-[207px] h-[42px] bg-white border border-solid border-[${primaryColor}] text-[${primaryColor}] font-bold text-lg rounded-md`}>
              Regresar
            </button>
            <button type="submit" className={`w-[207px] h-[42px] bg-[${primaryColor67}] text-white font-bold text-lg rounded-md hover:bg-[${primaryColor}]`}>
              {editingId ? 'Actualizar' : 'Registrar'}
            </button>
          </div>
        </form>
      </main>

      {/* ===== Modals (Renderizado Condicional) ===== */}

      {/* User List Modal */}
      {isUserListModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-10" onClick={() => setUserListModalOpen(false)}></div>
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-1/4 bg-[#fefefe] p-5 border border-solid border-[#888] z-20">
            <span onClick={() => setUserListModalOpen(false)} className="text-[#aaaaaa] float-right text-3xl font-bold cursor-pointer">&times;</span>
            <div className="mt-8">
              {users.map(user => (
                <div key={user.id} className="flex items-center gap-2 mb-2 p-1">
                  <button onClick={() => handleEdit(user.id)} className={`w-[60px] h-6 bg-[${primaryColor67}] text-white rounded-md text-sm hover:bg-[${primaryColor}]`}>Editar</button>
                  <button onClick={() => handleDelete(user.id)} className={`w-8 h-6 bg-[${primaryColor67}] text-white rounded-md text-sm hover:bg-[${primaryColor}]`}>X</button>
                  <span>{user.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[999]" onClick={() => setSuccessModalOpen(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-white p-5 rounded-lg shadow-lg text-center z-[1000]">
            <h3 className="text-xl mb-4">{modalMessage}</h3>
            <button onClick={() => setSuccessModalOpen(false)} className={`bg-[${primaryColor67}] text-white px-4 py-2 rounded-md hover:bg-[${primaryColor}]`}>
              Cerrar
            </button>
          </div>
        </>
      )}
    </div>
  );
}