// On a given page, copy every link that doesnt contain "google" onto clipboard, each link is separated separated by "\n"
(function (text) { 
  const node = document.createElement('textarea'); 
  node.textContent = text;  document.body.appendChild(node); 
  document.getSelection().removeAllRanges(); 
  node.select(); 
  document.execCommand('copy'); 
  document.getSelection().removeAllRanges(); 
  document.body.removeChild(node); 
})(Array.from(document.links).map(el => el.href).filter(link => !(new URL(link)).host.includes("google")).join("\n"));
