import React from 'react';

// Componente principal de la aplicación
export default function App() {
  // --- ESTADO ---
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [error, setError] = React.useState('');

  // --- MANEJADORES DE EVENTOS ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    console.log('Intentando iniciar sesión con:', { username, password });
    setError('');
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
      setError('');
  };

  // --- RENDERIZADO ---
  // Si el usuario ha iniciado sesión, muestra una pantalla de bienvenida.
  if (isLoggedIn) {
    return (
      <div className="bg-gray-100 flex items-center justify-center min-h-screen font-['Barlow']">
        <div className="w-full max-w-md text-center bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido, {username}!</h1>
          <p className="text-gray-600 mb-6">Has iniciado sesión correctamente.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  // Si no, muestra el formulario de inicio de sesión con el estilo original.
  return (
    <div className="bg-[#f3f2f7] min-h-screen font-['Barlow']">
      
      <div className="flex justify-center items-center pt-[150px] mb-[50px]">
        <img 
          src="./images/logodw.png" 
          alt="Datawifi SAS Logo"
        />
      </div>

      <div className="block mx-auto my-5 w-[250px] p-2.5">
        <form onSubmit={handleSubmit} noValidate>
          
          <div className="my-[15px]">
            <label htmlFor="username" className="text-base">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              className="block w-[230px] h-10 rounded-[9px] p-[15px] border-[1.5px] border-black mx-auto mt-1
                         focus:border-[3px] focus:border-[#3BB5FC] focus:outline-none"
            />
          </div>

          <div className="my-[15px]">
            <label htmlFor="password" className="text-base">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="block w-[230px] h-10 rounded-[9px] p-[15px] border-[1.5px] border-black mx-auto mt-1
                         focus:border-[3px] focus:border-[#3BB5FC] focus:outline-none"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center my-2">{error}</p>}

          <div className="mt-2">
            <a href="#" className="text-xs text-black text-center block">
              <b>¿Olvidaste tu contraseña?</b>
            </a>
          </div>

          {/* Botón de inicio de sesión*/}
          <div>
            <button
              type="submit"
              className="block bg-[#eb59bc] text-white w-[150px] h-[35px] rounded-[7px] p-[5px] 
                         border-[1.5px] border-black mx-auto my-[30px] font-bold cursor-pointer
                         hover:bg-[#E10098]"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}