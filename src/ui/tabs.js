export const Tabs = ({ children }) => (
    <div>{children}</div>
  );
  
  export const TabsList = ({ children }) => (
    <div className="flex border-b">{children}</div>
  );
  
  export const TabsTrigger = ({ children, value }) => (
    <button className="px-4 py-2 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300">
      {children}
    </button>
  );
  
  export const TabsContent = ({ children, value }) => (
    <div>{children}</div>
  );