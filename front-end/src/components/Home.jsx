import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function ReviewRatingApp() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-3 animate-fade-in">
        Store Ratings
      </h1>
      <p className="text-lg text-gray-100 mb-8 text-center max-w-xl animate-fade-in">
        Share your shopping experience, explore reviews, and help others make
        smarter choices.
      </p>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl transition-transform transform hover:scale-105">
        {!showSignup ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Login to Continue
            </h2>
            <Login />

            <p className="mt-6 text-sm text-gray-700 text-center">
              Don’t have an account?{" "}
              <button
                className="text-purple-600 font-semibold hover:text-pink-600 transition-colors duration-300"
                onClick={() => setShowSignup(true)}
              >
                Create New Account
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Create Your Account
            </h2>
            <Signup />

            <p className="mt-6 text-sm text-gray-700 text-center">
              Already have an account?{" "}
              <button
                className="text-blue-600 font-semibold hover:text-green-600 transition-colors duration-300"
                onClick={() => setShowSignup(false)}
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
