import { INSERT_MEETING_DETAILS_COMMAND } from "../plugins/MeetingDetailsPlugin"; // Adjust the path as needed
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function MeetingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className='toolbar'>
      <button
        onClick={() => {
          console.log("Command to dispatch:", INSERT_MEETING_DETAILS_COMMAND);
          editor.dispatchCommand(INSERT_MEETING_DETAILS_COMMAND, undefined);
        }}
        className={"toolbar-item spaced "}
      >
        <span className='text'>Meeting</span>
      </button>
    </div>
  );
}
