import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

export interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
      <ExclamationTriangleIcon className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};
