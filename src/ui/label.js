export const Label = ({ children, htmlFor }) => (
    <label className="block text-sm font-medium text-gray-700" htmlFor={htmlFor}>
      {children}
    </label>
  );