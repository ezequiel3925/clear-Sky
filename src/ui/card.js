import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white shadow rounded-lg">{children}</div>
);

export const CardHeader = ({ children }) => (
  <div className="px-4 py-5 border-b border-gray-200">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
);

export const CardDescription = ({ children }) => (
  <p className="mt-1 max-w-2xl text-sm text-gray-500">{children}</p>
);

export const CardContent = ({ children }) => (
  <div className="px-4 py-5">{children}</div>
);

export const CardFooter = ({ children }) => (
  <div className="px-4 py-4 border-t border-gray-200">{children}</div>
);