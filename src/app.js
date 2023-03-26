import './app.css';

import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';

const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    image: ImageTool,
    paragraph: {
      class: Paragraph,
    },
  },
  data: {
    blocks: [
      {
        type: 'paragraph',
        data: {
          lavel: 1
        }
      },
      {
        type: 'image',
        data: {
          lavel: 2
        }
      }
    ]
  }
});

editor.isReady.then(() => {
  // consts
  const HIDDEN_CLASS = 'hidden';
  const DEFAULT_TUNES_NAMES = ['delete', 'move-up', 'move-down'];
  const TOOLS_CLASSES = {
    paragraph: '.ce-paragraph',
    image: 'image-tool'
  }

  const FIXED_TOOLS_ORDER = ['paragraph', 'image'];

  // api
  const { blocks } = editor;

  // elements
  const toolbar = document.querySelector('.ce-toolbar');
  const toolbarAddBtn = toolbar.querySelector(':scope .ce-toolbar__plus');
  const toolbarSettingBtn = toolbar.querySelector(':scope .ce-toolbar__settings-btn');
  const toolbarPopover = toolbar.querySelector(':scope .ce-popover__items');

  // helpers
  const getCurrentBlock = () => {
    return blocks.getBlockByIndex(blocks.getCurrentBlockIndex());
  };
  const hideToolbarItemByName = (name) =>
    toolbar.querySelector(`:scope [data-item-name="${name}"]`).classList.add(HIDDEN_CLASS);

  FIXED_TOOLS_ORDER.forEach((toolName) => {
    const el = document.querySelector(`${TOOLS_CLASSES[toolName]}:first-of-type`).closest('.ce-block');

    toolbarSettingBtn.addEventListener('click', () => {
      const block = getCurrentBlock();

      if (el === block.holder && block.selected) {
        DEFAULT_TUNES_NAMES.forEach((name) => hideToolbarItemByName(name));
      }
    });

    toolbarAddBtn.addEventListener('click', () => {
      if (getCurrentBlock().holder === el) {
        toolbarPopover.childNodes.forEach((child) => {
          if (child.dataset.itemName !== toolName) {
            child.classList.add(HIDDEN_CLASS);
          } else {
            child.classList.remove(HIDDEN_CLASS);
            toolbarPopover.dataset.checked = 'true';
          }
        });
      } else if (!toolbarPopover.dataset.checked) {
        toolbarPopover.childNodes.forEach((child) => {
          child.classList.remove(HIDDEN_CLASS);
        });
      } else {
        toolbarPopover.dataset.checked = '';
      }
    });
  });

  document.getElementById('saveButton').addEventListener('click', () => {
    editor.save().then((savedData) => {
      console.log(savedData);
    });
  });
});
