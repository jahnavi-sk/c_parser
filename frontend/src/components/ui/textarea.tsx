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
import * as React from "react";

function TextArea() {
  const [text, setText] = React.useState("");

  const handleChange = (event) => {
    setText(event.target.value);
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
        value={text}
        onChange={handleChange}
        placeholder="Type here..."
      />
    </div>
  );
}

export default TextArea;
