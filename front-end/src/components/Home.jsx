import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function ReviewRatingApp() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      {/* Headline */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
        Welcome to Store Ratings
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Share your shopping experience, explore reviews, and help others make
        better choices.
      </p>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        {!showSignup ? (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Login to Continue
            </h2>
            <Login />

            <p className="mt-6 text-sm text-gray-700 text-center">
              Don’t have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setShowSignup(true)}
              >
                Create New Account
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-center mb-4">
              Create Your Account
            </h2>
            <Signup />

            <p className="mt-6 text-sm text-gray-700 text-center">
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:underline"
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
