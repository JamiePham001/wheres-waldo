"use client";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h1>
        <p className="text-gray-700 mb-6">{error.message}</p>
      </div>
    </div>
  );
}
