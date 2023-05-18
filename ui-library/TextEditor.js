import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import TinyLinkPreview from "./TinyLinkPreview";
import { useAsyncDebounce } from "react-table";
// import { extractUrls } from "@utils/helpers";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Toolbar, { formats } from "./Toolbar";
import Quill from "quill";
import AutoLinks from "quill-auto-links";

const Link = Quill.import("formats/link");
Link.PROTOCOL_WHITELIST = ["http", "https"];
Link.sanitize = function (url) {
  // quill by default creates relative links if scheme is missing.
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    let _url = `https://${url}`;
    try {
      new URL(_url);
    } catch (err) {
      return "about:blank";
    }
    return _url;
  }

  try {
    new URL(url);
  } catch (err) {
    return "about:blank";
  }

  return url;
};

Quill.register("modules/autoLinks", AutoLinks);

const Delta = Quill.import("delta");
const Break = Quill.import("blots/break");
const Embed = Quill.import("blots/embed");

const lineBreakMatcher = () => {
  let newDelta = new Delta();
  newDelta.insert({ break: "" });
  return newDelta;
};

class SmartBreak extends Break {
  length() {
    return 1;
  }
  value() {
    return "\n";
  }

  insertInto(parent, ref) {
    Embed.prototype.insertInto.call(this, parent, ref);
  }
}

SmartBreak.blotName = "break";
SmartBreak.tagName = "BR";
Quill.register(SmartBreak);

const bindings = {
  linebreak: {
    key: 13,
    shiftKey: true,
    handler: function (range) {
      const currentLeaf = this.quill.getLeaf(range.index)[0];
      const nextLeaf = this.quill.getLeaf(range.index + 1)[0];
      this.quill.insertEmbed(range.index, "break", true, "user");
      // Insert a second break if:
      // At the end of the editor, OR next leaf has a different parent (<p>)
      if (nextLeaf === null || currentLeaf.parent !== nextLeaf.parent) {
        this.quill.insertEmbed(range.index, "break", true, "user");
      }
      // Now that we've inserted a line break, move the cursor forward
      this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    },
  },
};

const modules = (id) => ({
  toolbar: {
    container: `#toolbar-${id}`,
  },
  keyboard: {
    bindings: bindings,
  },
  clipboard: {
    matchers: [["BR", lineBreakMatcher]],
    matchVisual: false,
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
  autoLinks: true,
});

export default function TextEditor({
  value = "",
  onChange,
  isResizable = false,
}) {
  const [editorState, setEditorState] = useState(value);
  const [links, setLinks] = useState([]);
  const [random] = useState(Math.floor(Math.random() * 90000) + 10000);

  const createLinksArray = useAsyncDebounce((markup) => {
    const urls = Array.prototype.slice
      .call(
        new DOMParser()
          .parseFromString(markup, "text/html")
          .getElementsByTagName("a")
      )
      .map((item) => item.getAttribute("href"));

    let uniqueUrls = {};

    // extractUrls(markup)
    urls.forEach((url) => {
      var domain = new URL(url);
      var uniKey =
        domain.hostname.replace("www.", "") + domain.pathname + domain.search;
      uniqueUrls[uniKey] = url;
    });
    setLinks(Object.keys(uniqueUrls).map((item) => uniqueUrls[item]));
  }, 300);

  const onEditorStateChange = useCallback((markup) => {
    setEditorState(markup);

    createLinksArray(markup);

    if (typeof onChange === "function") onChange(markup);
  }, []);

  useEffect(() => {
    if (value && value !== editorState) {
      setEditorState(value);
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      createLinksArray(value);
    }
  }, []);

  return (
    <EditorWrapper $isResizable={isResizable}>
      <ReactQuill
        preserveWhitespace
        value={editorState}
        onChange={onEditorStateChange}
        placeholder="Type your answer here... "
        modules={modules(random)}
        formats={formats}
      />

      <LinkPreviewWrapper>
        {links.slice(0, 10).map((link, idx) => (
          <TinyLinkPreview key={idx} url={link} />
        ))}
      </LinkPreviewWrapper>

      <ToolbarWrapper>
        <Toolbar id={`toolbar-${random}`} />
      </ToolbarWrapper>
    </EditorWrapper>
  );
}

const EditorWrapper = styled.div`
  &&& {
    // min-height: 170px;
    padding-bottom: 0.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #707d80;
    font-family: Manrope !important;
    font-size: 15px !important;
    padding-left: 15px;

    @media (max-width: 1224px) {
      padding-left: 0;
    }

    a {
      color: #22aaf2;
    }

    &&& {
      min-height: 190px;
      padding-bottom: 0.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #707d80;
      font-family: Manrope !important;
      font-size: 15px !important;
      padding-left: 15px;

      a {
        color: #22aaf2;
      }

      .ql-editor {
        padding-left: 0;
        overflow-y: auto;
        ${(props) =>
          props.$isResizable
            ? `
        resize: vertical;
        min-height: 100px;
        `
            : ""}
      }

      .quill {
        height: 100%;
        position: relative;
      }

      .ql-container.ql-snow {
        border: none;
        // font-family: Manrope !important;
        // font-size: 15px !important;
        padding: 0.8rem;
        font-family: "Manrope";
        font-style: normal;
        font-weight: 400;
        font-size: 14.5px;
        position: unset;
        max-height: 200px;
      }

      .ql-tooltip.ql-editing {
        input::placeholder {
          color: white;
        }
      }
    }

    @media (max-width: 1224px) {
      .quill {
        padding-left: 12px;
      }
    }
  }
`;

const LinkPreviewWrapper = styled.div`
  margin: 0.5rem 0;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
`;

const ToolbarWrapper = styled.div`
  width: 100%;
  border-top: 1px solid #969c9d;
  padding-top: 0.4rem;
`;
