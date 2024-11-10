import * as React from "react";

interface TextAreaProps {
  onChange?: (text: string) => void;
  value?: string;
}

function TextArea({ onChange, value }: TextAreaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (onChange) {
      onChange(newText);
    }
  };

  return (
    <div className="p-4">
      <textarea
        className="
          h-96
          w-full
          p-2.5
          text-sm
          rounded-md
          border
          border-gray-300
          resize-y
          cursor-text
          text-black
          bg-white
          dark:bg-black
          dark:text-white
          dark:border-neutral-800
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500
        "
        value={value}
        onChange={handleChange}
        placeholder="Type here..."
      />
    </div>
  );
}

export default TextArea;