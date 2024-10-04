import React from "react";

function FacebookLogin() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
            alt="Facebook"
            className="w-24"
          />
        </div>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Mobile number or email address"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
              Log in
            </button>
          </div>
          <div className="text-center text-blue-500 hover:underline cursor-pointer mb-4">
            Forgotten Password?
          </div>
        </form>
        <div className="flex items-center justify-between mb-4">
          <hr className="w-full border-t border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="w-full border-t border-gray-300" />
        </div>
        <div className="mb-4">
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300">
            Create new account
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacebookLogin;