export function clearBody() {
  if (document.body.childNodes.length > 0) {
    for (const item of document.body.childNodes) {
      item.remove();
    }
  }
}
export function clearElement(el) {
  if (el.childNodes.length > 0) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }
}
