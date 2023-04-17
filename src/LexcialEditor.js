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

import { createEditor } from "lexical";
import { useEffect, useState } from "react";

import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { useNextStepParse } from "./hooks/useNextStepParse";

import ListMaxIndentLevelPlugin from "./LexicalEditor/plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./LexicalEditor/plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./LexicalEditor/plugins/AutoLinkPlugin";
import { MentionNode } from "./LexicalEditor/nodes/MentionNode";
import NewMentionsPlugin from "./LexicalEditor/plugins/MentionsPlugin";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase/clientapp";
import { Skeleton, Stack } from "@chakra-ui/react";

// import ExcalidrawPlugin from "./LexicalEditor/plugins/ExcalidrawPlugin";

function DateTime() {
  const today = new Date();
  const date = new Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return date.format(today);
}

function Placeholder() {
  const params = useParams();
  const name = params.workspace_name;
  // console.log("workspaceName", params.workspace_name);
  return (
    <div className='editor-placeholder'>
      {DateTime()}, Notes for {name}
    </div>
  );
}

function simpleUuid() {
  const S4 = () =>
    (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

const defaultState = `{\"root\":{\"children\":[{\"children\":[{\"detail\":0,\"format\":0,\"mode\":\"normal\",\"style\":\"\",\"text\":\"Start writing here...\",\"type\":\"text\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1}],\"direction\":\"ltr\",\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}`;

const editorConfig = {
  namespace: "collabEditor",
  // The editor theme
  theme: LexicalEditorTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  editorState: defaultState,
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    HashtagNode,
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

const editor = createEditor(editorConfig);

export default function LexicalEditor() {
  const params = useParams();
  const [initialNoteJson, setInitialNoteJson] = useState();
  const [loadingState, setLoadingState] = useState("loading");
  const [collabUserNoteId, setCollabUserNoteId] = useState(null);
  useNextStepParse();

  const handleEditorChange = async (EditorState, params) => {
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
  };

  useEffect(() => {
    fetchSavedNote();
  }, []);

  useEffect(() => {
    if (loadingState === "loaded") {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
  }, [loadingState]);

  const fetchSavedNote = async () => {
    try {
      const { data, error } = await supabase
        .from("collab_users_notes")
        .select("note_content, collab_user_note_id")
        .eq("workspace_id", params.workspace_id);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setInitialNoteJson(data[0].note_content);
        setCollabUserNoteId(data[0].collab_user_note_id); // Store the collab_user_note_id
        console.log("data.note_content", data[0].note_content);
        setLoadingState("loaded");
      } else {
        const newUuid = simpleUuid();
        const { data: newData, error: newError } = await supabase
          .from("collab_users_notes")
          .insert([
            {
              collab_user_note_id: newUuid,
              workspace_id: params.workspace_id,
              note_content: defaultState,
            },
          ]);

        if (newError) {
          throw newError;
        }

        setInitialNoteJson(defaultState);
        setCollabUserNoteId(newUuid); // Store the new collab_user_note_id
        setLoadingState("loaded");
      }
    } catch (error) {
      console.error("Error fetching or creating saved note:", error.message);
      setInitialNoteJson(defaultState);
      setLoadingState("error");
    }
  };

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
    editorState: initialNoteJson,
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
          <OnChangePlugin onChange={handleEditorChange} />
          {/* <ExcalidrawPlugin /> */}
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
