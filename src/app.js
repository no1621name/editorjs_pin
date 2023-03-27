import './app.css';

import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';

// global consts
const FIXED_TOOLS_ORDER = ['paragraph', 'image'];
const FIXED_TOOLS_LENGTH = FIXED_TOOLS_ORDER.length;
const FIXED_TOOLS_CLASSES = {
  paragraph: '.ce-paragraph',
  image: '.image-tool'
};

class Disabler {
  // local consts
  #DEFAULT_TUNES_NAMES = ['delete', 'move-up', 'move-down'];
  #HIDDEN_CLASS = 'hidden';

  // api
  #blocks;

  // elements
  #toolbar;
  #toolbarAddBtn;
  #toolbarSettingBtn;
  #toolbarPopoverWrapper;
  #toolbarPopover;

  constructor(api) {
    this.#blocks = api.blocks;

    this.#toolbar = document.querySelector('.ce-toolbar');
    this.#toolbarAddBtn = this.#toolbar.querySelector(':scope .ce-toolbar__plus');
    this.#toolbarSettingBtn = this.#toolbar.querySelector(':scope .ce-toolbar__settings-btn');
    this.#toolbarPopoverWrapper = this.#toolbar.querySelector(':scope .ce-toolbox').nextElementSibling;
    this.#toolbarPopover = this.#toolbar.querySelector(':scope .ce-popover__items');
  }

  // helpers
  #getCurrentBlock() {
    return this.#blocks.getBlockByIndex(this.#blocks.getCurrentBlockIndex());
  }

  #hideToolbarItemByName(name) {
    this.#toolbar.querySelector(`:scope [data-item-name="${name}"]`).classList.add(this.#HIDDEN_CLASS);
  }

  // general functions
  removeDefaultPopoverTunesOnClick(el, tunesNamesList = this.#DEFAULT_TUNES_NAMES) {
    this.#toolbarSettingBtn.addEventListener('click', () => {
      const block = this.#getCurrentBlock();

      if (el === block.holder && block.selected) {
        tunesNamesList.forEach((name) => this.#hideToolbarItemByName(name));
      }
    });
  }

  removeDefaultPopoverTunes(index, tunesNamesList = this.#DEFAULT_TUNES_NAMES) {
    const observer =  new MutationObserver(() => {
      if (this.#blocks.getCurrentBlockIndex() === index) {
        tunesNamesList.forEach((name) => this.#hideToolbarItemByName(name));
      } else {
        observer.disconnect();
      }
    });

    observer.observe(this.#toolbarPopoverWrapper, {
      childList: true,
      subtree: true
    });
  }

  removeOtherTools(el, toolName) {
    this.#toolbarAddBtn.addEventListener('click', () => {
      if (this.#getCurrentBlock().holder === el) {
        this.#toolbarPopover.childNodes.forEach((child) => {
          if (child.dataset.itemName !== toolName) {
            child.classList.add(this.#HIDDEN_CLASS);
          } else {
            child.classList.remove(this.#HIDDEN_CLASS);
            this.#toolbarPopover.dataset.checked = 'true';
          }
        });
      } else if (!this.#toolbarPopover.dataset.checked) {
        this.#toolbarPopover.childNodes.forEach((child) => {
          child.classList.remove(this.#HIDDEN_CLASS);
        });
      } else {
        this.#toolbarPopover.dataset.checked = '';
      }
    });
  }
}

let disabler;

const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    image: {
      class: ImageTool,
    },
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
  },
  onChange: (_, event) => {
    switch (event.type) {
      case 'block-added':
        if (event.detail.index === FIXED_TOOLS_LENGTH) {
          disabler.removeDefaultPopoverTunesOnClick(event.detail.target.holder, ['move-up']);
        }
      case 'block-moved':
        if (event.type === 'block-moved' && event.detail.toIndex === FIXED_TOOLS_LENGTH) {
          disabler.removeDefaultPopoverTunes(event.detail.toIndex, ['move-up']);
        }
    }
  }
});

editor.isReady.then(() => {
  disabler = new Disabler(editor);

  FIXED_TOOLS_ORDER.forEach((toolName) => {
    const el = document.querySelector(`${FIXED_TOOLS_CLASSES[toolName]}:first-of-type`).closest('.ce-block');

    disabler.removeDefaultPopoverTunesOnClick(el);
    disabler.removeOtherTools(el, toolName);
  });

  document.getElementById('saveButton').addEventListener('click', () => {
    editor.save().then((savedData) => {
      console.log(savedData);
    });
  });
});