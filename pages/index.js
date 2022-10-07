import Head from "next/head";
import React, { useState, useCallback } from "react";
import { createEditor, Editor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import styles from "../styles/Home.module.css";

const initialValue = [
  {
    type: "paragraph",
    children: [
      {
        text: "A line of text in a paragraph. Press ctrl + ` to change paragraph into block code ",
      },
    ],
  },
];

export default function Home() {
  const [editor] = useState(() => withReact(createEditor()));

  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Slate Test</title>
        <meta name="description" content="Frontend Test Typedream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Slate editor={editor} value={initialValue}>
          <Editable
            renderElement={renderElement}
            onKeyDown={(event) => {
              if (event.key === "`" && event.ctrlKey) {
                event.preventDefault();
                const [match] = Editor.nodes(editor, {
                  match: (n) => n.type === "code",
                });
                Transforms.setNodes(
                  editor,
                  { type: match ? "paragraph" : "code" },
                  { match: (n) => Editor.isBlock(editor, n) }
                );
              }
            }}
          />
        </Slate>
      </main>
    </div>
  );
}

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};
