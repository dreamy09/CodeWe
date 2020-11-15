/**
 * This module deals with the user caret.
 * @author Brieuc Dubois
 * @date Created on 14/11/2020
 * @date Last modification on 15/11/2020
 * @version 1.0.1
 */

export default class Caret{
    /**
     *  Create range on the specified position in node or in children if necessary
     * inspired from https://jsfiddle.net/nrx9yvw9/5/
     * @param {Node} node
     * @param {number} position
     * @param {Range} range
     * @return {Range}
     */
    static createRange(node, position, range) {
        if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }

        if (position === 0) {
            range.setEnd(node, position);
        } else if (node && position > 0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < position) {
                    position -= node.textContent.length;
                } else {
                    range.setEnd(node, position);
                    position = 0;
                }
            } else {
                for (let lp = 0; lp < node.childNodes.length; lp++) {
                    range = Caret.createRange(node.childNodes[lp], position, range);

                    if (position === 0) {
                        break;
                    }
                }
            }
        }

        return range;
    }


    /**
     * Set the position of the user caret on specified position in element or children
     * inspired from https://jsfiddle.net/nrx9yvw9/5/
     * @param {HTMLElement|Node} element
     * @param {number} position
     */
    static setPosition(element, position) {
        if (position >= 0) {
            let selection = document.getSelection();

            let range = Caret.createRange(element, position, null);

            if (range) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    /**
     * Get the position of the end of the user selection
     * Based on https://stackoverflow.com/a/4812022/11247647
     * @param {HTMLElement} element
     * @return {number}
     */
     static getEndPosition(element) {
        let caretOffset = 0;
        const sel = document.getSelection();
        if(sel && sel.rangeCount > 0) {
            let range = sel.getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
        return caretOffset;
    }

    /**
     * Get the position of the end of the user selection
     * Based on https://stackoverflow.com/a/4812022/11247647
     * @param {HTMLElement} element
     * @return {number}
     */
     static getBeginPosition(element) {
        let caretOffset = 0;
        const sel = document.getSelection();
        if(sel && sel.rangeCount > 0) {
            let range = sel.getRangeAt(0);
            let preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            caretOffset = preCaretRange.toString().length;
        }
        return caretOffset;
    }
}
