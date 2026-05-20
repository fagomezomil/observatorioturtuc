"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

interface MethodologyNoteProps {
  content: string;
}

export function MethodologyNote({ content }: MethodologyNoteProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-muted/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full p-4 text-left hover:bg-muted/50 transition-colors rounded-lg"
      >
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">Notas metodologicas</span>
        {isOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
}