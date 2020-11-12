import {getCurrentElement, triggerEvent, getCaretCharacterOffsetWithin, get_uuid_element} from '../utils.js';

const colors = ['blue', 'red', 'brown'];
const uuid = getRandomString(10);

export default class Cursor{
    
    constructor(element) {
        this.editor = element;
        // Listen for others caret moves
        document.addEventListener('socket.receive.cursor-moves', e => {
            // select the good line and set the cursor
            let element = this.editor.querySelector('div[uuid="' + e.detail.request.data.id + '"]');
            // Insert at the right place the cursor
            let old_elements = this.editor.querySelectorAll('div[user-id="' + e.detail.request.data.userId + '"]');
            let current_color = null;
            old_elements.forEach(element => {
                current_color = element.style.background;
                element.setAttribute('user-id', '');
                element.className = '';
                element.style.background = null;
            });
            element.className = 'cursor-line';
            element.setAttribute('user-id', e.detail.request.data.userId);
            if (current_color) {
                element.style.background = current_color;
            }
            else {
                const color = colors[Math.floor(Math.random() * colors.length)];
                element.style.background = color;
            }
        });

        this.editor.addEventListener('focus', this.sendCursorPosition);
        this.editor.addEventListener('click', this.sendCursorPosition);
        this.editor.addEventListener('keypress', this.sendCursorPosition);
    }
    
    sendCursorPosition = () => {
        if(getCurrentElement() === this.editor) return;
        triggerEvent('socket.send', this.cursorRequest());
    }

    cursorRequest = () => {
        let element = get_uuid_element();
        if (element.hasAttribute('uuid')) {
            return {
                type: 'cursor-moves',
                data: {
                    id: element.getAttribute('uuid'),
                    userId: uuid,
                    content: getCaretCharacterOffsetWithin(element)
                }
            };
        }
    }
}
