import React from 'react';

export default function HelloWorld() {
  const name = "Developer";
  const today = new Date().toLocaleDateString();

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-600">Hello, {name}!</h1>
      <p className="mt-4 text-gray-600">Today is {today}</p>
    </div>
  );
}
