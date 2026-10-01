const pairInput = document.getElementById('pairInput');
const pairList = document.getElementById('pairList');
const message = document.getElementById('message');
const addBtn = document.getElementById('addBtn');
const sortByNameBtn = document.getElementById('sortByNameBtn');
const sortByValueBtn = document.getElementById('sortByValueBtn');
const deleteBtn = document.getElementById('deleteBtn');


let pairs = [];
let nextId = 1;


const PAIR_PATTERN = /^\s*([a-zA-Z0-9]+)\s*=\s*([a-zA-Z0-9]+)\s*$/;


function parsePair(text) {
    const match = text.match(PAIR_PATTERN);
    if (!match) {
        return null;
    }
    return { name: match[1], value: match[2] };
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = 'message ' + type;
    pairInput.classList.toggle('invalid', type === 'error');
}

function render() {
    pairList.innerHTML = '';
    for (const pair of pairs) {
        const option = document.createElement('option');
        option.value = String(pair.id);
        option.textContent = `${pair.name}=${pair.value}`;
        pairList.appendChild(option);
    }
}

function addPair() {
    const text = pairInput.value;

    if (text.trim() === '') {
        showMessage('Enter a pair in the format Name=Value.', 'error');
        return;
    }

    const pair = parsePair(text);
    if (!pair) {
        showMessage('Invalid format. Use Name=Value with letters and digits only.', 'error');
        return;
    }

    pairs.push({ id: nextId++, name: pair.name, value: pair.value });
    render();

    showMessage(`Added ${pair.name}=${pair.value}`, 'success');
    pairInput.value = '';
    pairInput.focus();
}

function sortPairs(key) {
    pairs.sort((a, b) =>
        a[key].localeCompare(b[key], undefined, { numeric: true, sensitivity: 'base' })
    );
    render();
}

function deleteSelected() {
    const selectedIds = Array.from(pairList.selectedOptions).map(option => Number(option.value));

    if (selectedIds.length === 0) {
        showMessage('Select one or more items to delete.', 'error');
        return;
    }

    pairs = pairs.filter(pair => !selectedIds.includes(pair.id));
    render();
    showMessage(`Deleted ${selectedIds.length} item(s).`, 'success');
}

addBtn.addEventListener('click', addPair);
sortByNameBtn.addEventListener('click', () => sortPairs('name'));
sortByValueBtn.addEventListener('click', () => sortPairs('value'));
deleteBtn.addEventListener('click', deleteSelected);

pairInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        addPair();
    }
});
pairInput.addEventListener('input', () => showMessage('', ''));

pairList.addEventListener('keydown', event => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelected();
    }
});
