export function clearBody() {
  if (document.body.childNodes.length > 0) {
    for (const item of document.body.childNodes) {
      item.remove();
    }
  }
}
