// Import necessary hooks for state management.
import { useState } from "react";
// Import PropTypes for prop type checking.
import PropTypes from "prop-types";
// Import CSS styles specific to this component.
import "./RichTextEditor.module.css";

// Define the functional component RichTextEditor, which takes value, onChange, error, and other props.
function RichTextEditor({ value, onChange, error, ...props }) {
  // Initialize state for the selected text range using the useState hook.
  const [selection, setSelection] = useState(null);

  // Define a function to handle formatting the selected text.
  const handleFormat = (format) => {
    // If no text is selected, do nothing.
    if (!selection) return;

    // Extract the start and end indices of the selected text.
    const { start, end } = selection;
    const text = value; //to store the current value of the editor
    // Initialize a variable to store the new text after formatting.
    let newText;

    // Apply formatting based on the selected format type.
    switch (format) {
      case "bold":
        // Wrap the selected text with double asterisks for bold formatting.
        newText = `${text.slice(0, start)}**${text.slice(
          start,
          end
        )}**${text.slice(end)}`;
        break;
      case "italic":
        // Wrap the selected text with underscores for italic formatting.
        newText = `${text.slice(0, start)}_${text.slice(
          start,
          end
        )}_${text.slice(end)}`;
        break;
      case "heading1":
        // Prepend the selected text with '# ' for heading 1 formatting.
        newText = `${text.slice(0, start)}# ${text.slice(
          start,
          end
        )}${text.slice(end)}`;
        break;
      case "heading2":
        // Prepend the selected text with '## ' for heading 2 formatting.
        newText = `${text.slice(0, start)}## ${text.slice(
          start,
          end
        )}${text.slice(end)}`;
        break;
      case "heading3":
        // Prepend the selected text with '### ' for heading 3 formatting.
        newText = `${text.slice(0, start)}### ${text.slice(
          start,
          end
        )}${text.slice(end)}`;
        break;
      case "list":
        // Prepend the selected text with '- ' for list formatting and add a newline character.
        newText = `${text.slice(0, start)}- ${text.slice(
          start,
          end
        )}\n${text.slice(end)}`;
        break;
      case "code":
        // Wrap the selected text with triple backticks and 'javascript' for code block formatting.
        newText = `${text.slice(0, start)}\`\`\`javascript\n${text.slice(
          start,
          end
        )}\n\`\`\`${text.slice(end)}`;
        break;
      case "blockquote":
        // Prepend the selected text with '> ' for blockquote formatting.
        newText = `${text.slice(0, start)}> ${text.slice(
          start,
          end
        )}${text.slice(end)}`;
        break;
      case "image":
        // Insert markdown for image.
        newText = `${text.slice(0, start)}![alt text](url)${text.slice(end)}`;
        break;
      case "link":
        // Insert markdown for link.
        newText = `${text.slice(0, start)}[text](url)${text.slice(end)}`;
        break;
      default:
        // If the format is not recognized, do nothing.
        return;
    }

    // Update the editor's value with the new formatted text.
    onChange(newText);
  };

  // Define a function to handle text selection changes in the textarea.
  const handleSelect = (e) => {
    setSelection({
      start: e.target.selectionStart, // Store the start index of the selection.
      end: e.target.selectionEnd, // Store the end index of the selection.
    });
  };

  // Return the JSX to render the component.
  return (
    <div className="rich-editor">
      {/* Toolbar containing formatting buttons. */}
      <div className="rich-editor__toolbar">
        <button
          type="button"
          onClick={() => handleFormat("bold")}
          className="toolbar-button"
        >
          B
        </button>
        <button
          onClick={() => handleFormat("italic")}
          className="toolbar-button"
        >
          I
        </button>
        <button
          onClick={() => handleFormat("heading1")}
          className="toolbar-button"
        >
          H1
        </button>
        <button
          onClick={() => handleFormat("heading2")}
          className="toolbar-button"
        >
          H2
        </button>
        <button
          onClick={() => handleFormat("heading3")}
          className="toolbar-button"
        >
          H3
        </button>
        <button onClick={() => handleFormat("list")} className="toolbar-button">
          List
        </button>
        <button onClick={() => handleFormat("code")} className="toolbar-button">
          Code
        </button>
        <button
          onClick={() => handleFormat("blockquote")}
          className="toolbar-button"
        >
          Quote
        </button>
        <button
          onClick={() => handleFormat("image")}
          className="toolbar-button"
        >
          Image
        </button>
        <button onClick={() => handleFormat("link")} className="toolbar-button">
          Link
        </button>
      </div>
      {/* Textarea for editing content. */}
      <textarea
        className={`rich-editor__content ${error ? "error" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        {...props} // Spread any other props to the textarea.
      />
      {/* Display error message if there is an error. */}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

// Define PropTypes for the component's props.
RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired, //value is required and must be a string
  onChange: PropTypes.func.isRequired, //onChange is required and must be a function
  error: PropTypes.string, //error is optional and can be a string
};

// Export the RichTextEditor component as the default export.
export default RichTextEditor;
