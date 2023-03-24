import './app.css';

import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';

const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    image: ImageTool,
    paragraph: Paragraph,
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('saveButton').addEventListener('click', () => {
    editor.save().then((savedData) => {
      console.log(savedData);
    });
  });
});
