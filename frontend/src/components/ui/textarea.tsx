// import * as React from "react"

// import { cn } from "@/lib/utils"

// export interface TextareaProps
//   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         className={cn(
//           "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Textarea.displayName = "Textarea"

// export { Textarea }

// components/TextAreaExample.js

// import * as React from "react";

// function TextArea() {
//   const [text, setText] = React.useState("");

//   const handleChange = (event) => {
//     setText(event.target.value);
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <textarea
//         style={{
//           minHeight: "100px",
//           width: "100%",
//           padding: "10px",
//           fontSize: "16px",
//           borderRadius: "4px",
//           border: "1px solid #ccc",
//           resize: "vertical", // Allows resizing
//           cursor: "text", // Explicitly sets text cursor
//           color: "#000", // Ensures text color is set
//           backgroundColor: "#fff", // Sets background color
//         }}
//         value={text}
//         onChange={handleChange}
//         placeholder="Type here..."
//       />
//     </div>
//   );
// }

// export default TextArea;

import { useState } from 'react';

const TextArea = () => {
  const [text, setText] = useState('');
  
  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="p-4">
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Type here..."
        className="min-h-[100px] w-full p-3 text-base rounded border border-gray-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="Text input area"
      />
    </div>
  );
};

export default TextArea;