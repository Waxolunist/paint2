export const cleanHTML = (el: Element): string => {
  const innerHTML = el.shadowRoot!.innerHTML;
  return innerHTML.replace(/<!--([\s\S]*?)-->/g, '');
};
