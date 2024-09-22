import { CheckCircledIcon } from "@radix-ui/react-icons";
import React from "react";

export interface FormSucessProps {
  message?: string;
}

export const FormSucess: React.FC<FormSucessProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="w-5 h-5" />
      <p>{message}</p>
    </div>
  );
};
