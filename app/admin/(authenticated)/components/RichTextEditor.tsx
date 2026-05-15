"use client";

import { useRef, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange],
  );

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      exec("createLink", url);
    }
  }, [exec]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      exec("insertImage", url);
    }
  }, [exec]);

  return (
    <div className="overflow-hidden rounded-lg border border-input">
      <div className="flex flex-wrap gap-0.5 border-b border-input bg-muted p-1">
        <ToolbarButton onClick={() => exec("bold")} label="B" title="Bold" />
        <ToolbarButton
          onClick={() => exec("italic")}
          label="I"
          title="Italic"
          className="italic"
        />
        <ToolbarButton
          onClick={() => exec("underline")}
          label="U"
          title="Underline"
          className="underline"
        />
        <span className="mx-1 w-px bg-border" />
        <ToolbarButton
          onClick={() => exec("insertUnorderedList")}
          label="• List"
          title="Bullet list"
        />
        <ToolbarButton
          onClick={() => exec("insertOrderedList")}
          label="1. List"
          title="Numbered list"
        />
        <span className="mx-1 w-px bg-border" />
        <ToolbarButton
          onClick={() => exec("formatBlock", "<h3>")}
          label="H3"
          title="Heading 3"
        />
        <ToolbarButton
          onClick={() => exec("formatBlock", "<h4>")}
          label="H4"
          title="Heading 4"
        />
        <ToolbarButton
          onClick={() => exec("formatBlock", "<p>")}
          label="P"
          title="Paragraph"
        />
        <span className="mx-1 w-px bg-border" />
        <ToolbarButton onClick={insertLink} label="Link" title="Insert link" />
        <ToolbarButton
          onClick={insertImage}
          label="Img"
          title="Insert image"
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value }}
        className="bg-background p-3 text-sm leading-relaxed text-foreground outline-none"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  label,
  title,
  className = "",
}: {
  onClick: () => void;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1 text-sm text-foreground transition-colors hover:bg-muted-foreground/20 ${className}`}
    >
      {label}
    </button>
  );
}
