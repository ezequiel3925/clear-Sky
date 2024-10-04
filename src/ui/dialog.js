export const Dialog = ({ children, open, onOpenChange }) => (
    open ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6">
        {children}
      </div>
    </div> : null
  );
  
  export const DialogContent = ({ children }) => (
    <div>{children}</div>
  );
  
  export const DialogHeader = ({ children }) => (
    <div className="mb-4">{children}</div>
  );
  
  export const DialogTitle = ({ children }) => (
    <h3 className="text-lg font-medium">{children}</h3>
  );
  
  export const DialogDescription = ({ children }) => (
    <p className="text-sm text-gray-500">{children}</p>
  );