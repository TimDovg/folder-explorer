const data = [
  {
    'folder': true,
    'title': 'Grow',
    'children': [
      {
        'title': 'logo.png'
      },
      {
        'folder': true,
        'title': 'English',
        'children': [
          {
            'title': 'Present_Perfect.txt'
          }
        ]
      }
    ]
  },
  {
    'folder': true,
    'title': 'Soft',
    'children': [
      {
        'folder': true,
        'title': 'NVIDIA',
        'children': null
      },
      {
        'title': 'nvm-setup.exe'
      },
      {
        'title': 'node.exe'
      }
    ]
  },
  {
    'folder': true,
    'title': 'Doc',
    'children': [
      {
        'title': 'project_info.txt'
      }
    ]
  },
  {
    'title': 'credentials.txt'
  }
];

const rootNode = document.getElementById('root');

let targetElementForContextMenu = null;
const contextMenu = document.createElement('div');

const closeContextMenu = () => {
  contextMenu.classList.remove('show');
  targetElementForContextMenu
      && targetElementForContextMenu.querySelector('.div').classList.remove('selected');
  targetElementForContextMenu = null;
};

const onRenameHandler = () => {
  if (targetElementForContextMenu) {
    const input = document.createElement('input');
    const fileOrFolder = targetElementForContextMenu.querySelector('.span');
    const text = fileOrFolder.innerHTML.trim();
    const extentionIndex = 4;
    const lastSelectionIndex = /\..{3,5}$/.test(text) ? text.length - extentionIndex : text.length;
    
    const onBlurInput = () => {
      input.outerHTML = `<span class="span">${input.value.trim() || 'Folder'}</span>`;
    };

    const onKeyupInput = ({ key }) => {
      if (key === 'Enter') {
        input.removeEventListener('blur', onBlurInput);
        input.outerHTML = `<span class="span">${input.value.trim() || 'Folder'}</span>`;
      }
    };

    input.classList.add('rename-input');
    input.value = text;
    fileOrFolder.remove();
    targetElementForContextMenu.querySelector('.div').append(input);
    input.setSelectionRange(0, lastSelectionIndex);
    input.addEventListener('keyup', onKeyupInput);
    input.addEventListener('blur', onBlurInput);
    input.focus();

    closeContextMenu();
  }
};

const onDeleteHandler = () => {
  if (targetElementForContextMenu) {
    const parent = targetElementForContextMenu.parentNode;

    targetElementForContextMenu.remove();

    if (!parent.innerHTML.trim()) {
      parent.outerHTML = '<ul class="ul empty no-prop"><li>Folder is empty</li></ul>';
    }

    closeContextMenu();
  }
};

contextMenu.classList.add('context-menu');
contextMenu.innerHTML = `<div class="item rename">Rename</div><div class="item delete">Delete Item</div>`;
contextMenu.setAttribute('tabindex', 0);
contextMenu.addEventListener('blur', closeContextMenu);
contextMenu.addEventListener('contextmenu', e => e.preventDefault());
contextMenu.querySelector('.rename').addEventListener('click', onRenameHandler);
contextMenu.querySelector('.delete').addEventListener('click', onDeleteHandler);
document.body.append(contextMenu);

const renderTree = (elements, child) => {
  elements.forEach(el => {
    if (el.folder) {
      const li = document.createElement('li');

      li.classList.add('li', 'folder', 'no-prop');
      li.innerHTML = '<div class="div"><div class="file-folder"></div><i class="material-icons">folder</i>' +
      `<span class="span">${el.title}</span></div>`;

      if (el.children) {
        const ul = document.createElement('ul');

        ul.classList.add('ul');
        li.append(ul);
        renderTree(el.children, ul);
      } else {
        li.innerHTML += '<ul class="ul empty no-prop"><li>Folder is empty</li></ul>';
      }
      child.append(li);
    } else {
      child.innerHTML += '<li class="li file no-prop"><div class="div"><div class="file-folder"></div>' +
      `<i class="material-icons">insert_drive_file</i><span class="span">${el.title}</span></div></li>`;
    }
  });

  const addListeners = (selector, listenerHandler) => document.querySelectorAll(selector)
      .forEach(el => el.addEventListener('click', e => listenerHandler(e, el)));

  const folderHandler = (e, folder) => {
    e.preventDefault();

    folder.classList.toggle('open');
    folder.querySelector('i').innerHTML = folder.classList.contains('open') ? 'folder_open' : 'folder';
  };

  const noPropHandler = e => {
    const leftMouseButtonCode = 0;

    e.button === leftMouseButtonCode && e.stopPropagation();
    e.which === leftMouseButtonCode && e.stopPropagation();
  };

  addListeners('.folder', folderHandler);
  addListeners('.no-prop', noPropHandler);
};

const onContextMenuHandler = e => {
  const rightMouseButtonCode = 2;
  const showContextMenu = e => {
    e.preventDefault();

    const y = e.pageY;
    const x = e.pageX;
    const targetElement = e.target;

    contextMenu.style.top = `${y}px`;
    contextMenu.style.left = `${x}px`;
    contextMenu.classList.add('show');
    contextMenu.focus();

    if (targetElement.classList.contains('file-folder')) {
      targetElementForContextMenu = targetElement.parentNode.parentNode;
      targetElementForContextMenu.querySelector('.div').classList.add('selected');
      contextMenu.classList.remove('no-target');
    } else {
      contextMenu.classList.add('no-target');
    }
  };

  if (e.which === rightMouseButtonCode) {
    showContextMenu(e);
  } else if (e.button === rightMouseButtonCode) {
    showContextMenu(e);
  }
};

rootNode.addEventListener('contextmenu', onContextMenuHandler);

if (data.length) {
  rootNode.innerHTML = '<ul class="ul"></ul>';
  renderTree(data, rootNode.querySelector('ul'));
}
