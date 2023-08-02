import LexicalEditorTheme from "./LexicalEditor/themes/LexicalEditorTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./LexicalEditor/plugins/TreeViewPlugin";
import ToolbarPlugin from "./LexicalEditor/plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HashtagNode } from "@lexical/hashtag";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import {
  RootNode,
  createEditor,
  ParagraphNode,
  ElementNode,
  TextNode,
  $getRoot,
  $getSelection,
} from "lexical";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { useEffect, useState } from "react";

// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useLexicalNodeParse } from "./hooks/useLexicalNodeParse";
import Placeholder from "./hooks/useLexcialPlaceholder";

import { LocalStoragePlugin } from "./LexicalEditor/plugins/LocalStoragePlugin";
import ListMaxIndentLevelPlugin from "./LexicalEditor/plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./LexicalEditor/plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./LexicalEditor/plugins/AutoLinkPlugin";
import { MentionNode } from "./LexicalEditor/nodes/MentionNode";
import NewMentionsPlugin from "./LexicalEditor/plugins/MentionsPlugin";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase/clientapp";
import { Skeleton, Stack } from "@chakra-ui/react";

import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import { useFetchSavedNotes } from "./hooks/useLexicalFetchSavedNotes";
import { useCallback } from "react";

import { MeetingNode } from "./LexicalEditor/nodes/CollabMeetingNode";

// import ExcalidrawPlugin from "./LexicalEditor/plugins/ExcalidrawPlugin";

export default function LexicalEditor() {
  const params = useParams();
  // const [initialNoteJson, setInitialNoteJson] = useState();
  // const [loadingState, setLoadingState] = useState("loading");
  // const [collabUserNoteId, setCollabUserNoteId] = useState(null);
  const { initialNoteJson, loadingState, collabUserNoteId } =
    useFetchSavedNotes(params.workspace_id);

  useLexicalNodeParse();

  const handleEditorChange = useCallback(
    debounce(async (EditorState) => {
      const jsonString = JSON.stringify(EditorState);

      try {
        if (collabUserNoteId) {
          // Update existing record
          const { data, error } = await supabase
            .from("collab_users_notes")
            .update({
              note_content: jsonString,
            })
            .eq("collab_user_note_id", collabUserNoteId);

          if (error) {
            throw error;
          } else {
            console.log("handleEditorChange data", data);
          }
        }
      } catch (error) {
        console.error("Error updating note:", error.message);
      }
    }, 500), // This is the delay time in milliseconds
    [collabUserNoteId]
  );

  // useEffect(() => {
  //   useFetchSavedNotes();
  // }, []);

  useEffect(() => {
    if (loadingState === "loaded") {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, [loadingState]);

  // const fetchSavedNote = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from("collab_users_notes")
  //       .select("note_content, collab_user_note_id")
  //       .eq("workspace_id", params.workspace_id);

  //     if (error) {
  //       throw error;
  //     }

  //     if (data && data.length > 0) {
  //       setInitialNoteJson(data[0].note_content);
  //       setCollabUserNoteId(data[0].collab_user_note_id); // Store the collab_user_note_id
  //       console.log("data.note_content", data[0].note_content);
  //       setLoadingState("loaded");
  //     } else {
  //       const newUuid = uuidv4();
  //       const { data: newData, error: newError } = await supabase
  //         .from("collab_users_notes")
  //         .insert([
  //           {
  //             collab_user_note_id: newUuid,
  //             workspace_id: params.workspace_id,
  //             note_content: defaultState,
  //           },
  //         ]);

  //       if (newError) {
  //         throw newError;
  //       }

  //       setInitialNoteJson(defaultState);
  //       setCollabUserNoteId(newUuid); // Store the new collab_user_note_id
  //       setLoadingState("loaded");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching or creating saved note:", error.message);
  //     setInitialNoteJson(defaultState);
  //     setLoadingState("error");
  //   }
  // };

  if (loadingState === "loading") {
    return (
      <div>
        <Stack>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </div>
    );
  }

  if (loadingState === "error") {
    return <div>Error!</div>;
  }

  const editorConfig = {
    namespace: "collabEditor",
    // The editor theme
    theme: LexicalEditorTheme,
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      HashtagNode,
      // [ExcalidrawNode],
      CodeNode,
      CodeHighlightNode,
      TableNode,
      MentionNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  function onChange(editorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className='editor-container'>
        <ToolbarPlugin />
        <div className='editor-inner'>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />

          {/* <ClickableLinkPlugin /> */}
          {/* <TreeViewPlugin /> */}
          <AutoFocusPlugin />
          <LinkPlugin />
          <CodeHighlightPlugin />
          <HashtagPlugin />
          <NewMentionsPlugin />
          <ListPlugin />
          <OnChangePlugin onChange={onChange} />
          <LocalStoragePlugin namespace='myNamespace' />
          {/* <MeetingNode /> */}
          {/* <ExcalidrawPlugin /> */}
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}

// import LexicalEditorTheme from "./LexicalEditor/themes/LexicalEditorTheme";
// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
// import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// import TreeViewPlugin from "./LexicalEditor/plugins/TreeViewPlugin";
// import ToolbarPlugin from "./LexicalEditor/plugins/ToolbarPlugin";
// import { HeadingNode, QuoteNode } from "@lexical/rich-text";
// import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
// import { ListItemNode, ListNode } from "@lexical/list";
// import { CodeHighlightNode, CodeNode } from "@lexical/code";
// import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
// import { HashtagNode } from "@lexical/hashtag";
// import { AutoLinkNode, LinkNode } from "@lexical/link";
// import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
// import { ListPlugin } from "@lexical/react/LexicalListPlugin";
// import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
// import { TRANSFORMERS } from "@lexical/markdown";
// import {
//   RootNode,
//   createEditor,
//   ParagraphNode,
//   ElementNode,
//   TextNode,
//   $getRoot,
//   $getSelection,
// } from "lexical";
// import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

// import { useEffect, useState } from "react";

// // import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// import { useLexicalNodeParse } from "./hooks/useLexicalNodeParse";
// import Placeholder from "./hooks/useLexcialPlaceholder";
// import { CustomParagraphNode } from "./LexicalEditor/nodes/CustomParagraphNode";

// import ListMaxIndentLevelPlugin from "./LexicalEditor/plugins/ListMaxIndentLevelPlugin";
// import CodeHighlightPlugin from "./LexicalEditor/plugins/CodeHighlightPlugin";
// import AutoLinkPlugin from "./LexicalEditor/plugins/AutoLinkPlugin";
// import { MentionNode } from "./LexicalEditor/nodes/MentionNode";
// import NewMentionsPlugin from "./LexicalEditor/plugins/MentionsPlugin";
// import { useParams } from "react-router-dom";
// import { supabase } from "./supabase/clientapp";
// import { Skeleton, Stack } from "@chakra-ui/react";

// import { v4 as uuidv4 } from "uuid";
// import { CustomTextNode } from "./LexicalEditor/nodes/CustomTextNode";
// import { useFetchSavedNotes } from "./hooks/useLexicalFetchSavedNotes";
// import { useCallback } from "react";
// import { debounce } from "lodash";
// import { MeetingNode } from "./LexicalEditor/nodes/CollabMeetingNode";

// // import ExcalidrawPlugin from "./LexicalEditor/plugins/ExcalidrawPlugin";

// // const editorConfig = {
// //   namespace: "collabEditor",
// //   // The editor theme
// //   theme: LexicalEditorTheme,
// //   // Handling of errors during update
// //   onError(error) {
// //     throw error;
// //   },
// //   editorState: defaultState,
// //   // Any custom nodes go here
// //   nodes: [
// //     HeadingNode,
// //     ListNode,
// //     ListItemNode,
// //     QuoteNode,
// //     HashtagNode,
// //     CodeNode,
// //     CodeHighlightNode,
// //     TableNode,
// //     MentionNode,
// //     TableCellNode,
// //     TableRowNode,
// //     AutoLinkNode,
// //     LinkNode,
// //     // CustomParagraphNode,
// //     // {
// //     //   replace: ParagraphNode,
// //     //   with: (node) => {
// //     //     return new CustomParagraphNode();
// //     //   },
// //     // },
// //   ],
// // };

// export default function LexicalEditor() {
//   const params = useParams();
//   // const [initialNoteJson, setInitialNoteJson] = useState();
//   // const [loadingState, setLoadingState] = useState("loading");
//   // const [collabUserNoteId, setCollabUserNoteId] = useState(null);
//   const { initialNoteJson, loadingState, collabUserNoteId } =
//     useFetchSavedNotes(params.workspace_id);

//   useLexicalNodeParse();

//   const handleEditorChange = useCallback(
//     debounce(async (EditorState) => {
//       const jsonString = JSON.stringify(EditorState);

//       try {
//         if (collabUserNoteId) {
//           // Update existing record
//           const { data, error } = await supabase
//             .from("collab_users_notes")
//             .update({
//               note_content: jsonString,
//             })
//             .eq("collab_user_note_id", collabUserNoteId);

//           if (error) {
//             throw error;
//           } else {
//             console.log("handleEditorChange data", data);
//           }
//         }
//       } catch (error) {
//         console.error("Error updating note:", error.message);
//       }
//     }, 500), // This is the delay time in milliseconds
//     [collabUserNoteId]
//   );

//   // useEffect(() => {
//   //   useFetchSavedNotes();
//   // }, []);

//   useEffect(() => {
//     if (loadingState === "loaded") {
//       setTimeout(() => {
//         window.scrollTo(0, 0);
//       }, 0);
//     }
//   }, [loadingState]);

//   // const fetchSavedNote = async () => {
//   //   try {
//   //     const { data, error } = await supabase
//   //       .from("collab_users_notes")
//   //       .select("note_content, collab_user_note_id")
//   //       .eq("workspace_id", params.workspace_id);

//   //     if (error) {
//   //       throw error;
//   //     }

//   //     if (data && data.length > 0) {
//   //       setInitialNoteJson(data[0].note_content);
//   //       setCollabUserNoteId(data[0].collab_user_note_id); // Store the collab_user_note_id
//   //       console.log("data.note_content", data[0].note_content);
//   //       setLoadingState("loaded");
//   //     } else {
//   //       const newUuid = uuidv4();
//   //       const { data: newData, error: newError } = await supabase
//   //         .from("collab_users_notes")
//   //         .insert([
//   //           {
//   //             collab_user_note_id: newUuid,
//   //             workspace_id: params.workspace_id,
//   //             note_content: defaultState,
//   //           },
//   //         ]);

//   //       if (newError) {
//   //         throw newError;
//   //       }

//   //       setInitialNoteJson(defaultState);
//   //       setCollabUserNoteId(newUuid); // Store the new collab_user_note_id
//   //       setLoadingState("loaded");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching or creating saved note:", error.message);
//   //     setInitialNoteJson(defaultState);
//   //     setLoadingState("error");
//   //   }
//   // };

//   if (loadingState === "loading") {
//     return (
//       <div>
//         <Stack>
//           <Skeleton height='20px' />
//           <Skeleton height='20px' />
//           <Skeleton height='20px' />
//         </Stack>
//       </div>
//     );
//   }

//   if (loadingState === "error") {
//     return <div>Error!</div>;
//   }

//   const editorConfig = {
//     editorState:
//       // () => {
//       //   // Read the contents of the EditorState here.
//       //   const root = $getRoot();
//       //   const selection = $getSelection();

//       //   console.log(root, selection);
//       // },
//       initialNoteJson,
//     namespace: "collabEditor",
//     // The editor theme
//     theme: LexicalEditorTheme,
//     // Handling of errors during update
//     onError(error) {
//       throw error;
//     },
//     // Any custom nodes go here
//     nodes: [
//       HeadingNode,
//       ListNode,
//       ListItemNode,
//       QuoteNode,
//       HashtagNode,
//       // [ExcalidrawNode],
//       CodeNode,
//       CodeHighlightNode,
//       TableNode,
//       MentionNode,
//       TableCellNode,
//       TableRowNode,
//       AutoLinkNode,
//       LinkNode,
//       // MeetingNode,
//       // CustomTextNode,
//       // {
//       //   replace: TextNode,
//       //   with: (node) => {
//       //     return new CustomTextNode();
//       //   },
//       // },
//       // CustomParagraphNode,
//       // {
//       //   replace: ParagraphNode,
//       //   with: (node) => {
//       //     return new CustomParagraphNode();
//       //   },
//       // },
//     ],
//   };

//   return (
//     <LexicalComposer initialConfig={editorConfig}>
//       <div className='editor-container'>
//         <ToolbarPlugin />
//         <div className='editor-inner'>
//           <RichTextPlugin
//             contentEditable={<ContentEditable className='editor-input' />}
//             placeholder={<Placeholder />}
//             ErrorBoundary={LexicalErrorBoundary}
//           />
//           <HistoryPlugin />

//           {/* <ClickableLinkPlugin /> */}
//           {/* <TreeViewPlugin /> */}
//           <AutoFocusPlugin />
//           <LinkPlugin />
//           <CodeHighlightPlugin />
//           <HashtagPlugin />
//           <NewMentionsPlugin />
//           <ListPlugin />
//           <OnChangePlugin onChange={handleEditorChange} />
//           {/* <MeetingNode /> */}
//           {/* <ExcalidrawPlugin /> */}
//           <AutoLinkPlugin />
//           <ListMaxIndentLevelPlugin maxDepth={7} />
//           <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
//         </div>
//       </div>
//     </LexicalComposer>
//   );
// }
