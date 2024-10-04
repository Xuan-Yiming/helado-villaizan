import React from "react";

function InstagramLogin() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
            className="w-32"
          />
        </div>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Teléfono, usuario o correo electrónico"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Entrar
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <hr className="w-full border-t border-gray-300" />
            <span className="px-2 text-gray-500">o</span>
            <hr className="w-full border-t border-gray-300" />
          </div>
          <div className="mb-4">
            <button className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 flex items-center justify-center">
              <i className="fab fa-facebook-f mr-2"></i>
              Iniciar sesión con Facebook
            </button>
          </div>
          <div className="text-center text-blue-500 hover:underline cursor-pointer mb-4">
            ¿Has olvidado la contraseña?
          </div>
        </form>
        <div className="text-center mt-6">
          <p>
            ¿No tienes una cuenta?{" "}
            <span className="text-blue-500 hover:underline cursor-pointer">
              Regístrate
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InstagramLogin;