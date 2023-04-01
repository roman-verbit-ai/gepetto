// TODO : use getComputedStyle for text and setting direction  
let currSelectedText;
let isAuto = true;
let gepetto_frame;

class GePeTtoClient {

  API_URL = 'https://gepetto-server.onrender.com/api/claims';
  
  api_headers = {
      "Content-Type": "application/json",
    /*  Authorization: "Bearer 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",*/
  };

  async query_gepetto(input_text) {

    const request = {
      method: "POST",
      headers: this.api_headers,
      body: JSON.stringify({text : input_text})
    };

    let response = await fetch(this.API_URL, request);
    let respJson = await response.json();

    if (response.ok) return respJson;
    else throw respJson;
  }
};

function init() {
  injectPaperClip();
  injectPanel();

  function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        text = window.getSelection().toString();
    } else if (typeof document.selection != "undefined" && document.selection.type == "Text") {
        text = document.selection.createRange().text;
    }
    return text;
  }

  function paperClipClicked(e) {
    e.preventDefault();
    document.querySelector('.paper-clip').classList.remove('active');
    document.querySelector('#gepetto-panel #error-message')?.remove();
    showPanel();
    doGepetto();
  }

  function showPanel() {
    document.getElementById('gepetto-panel').classList.add('Active');
    // panel.querySelector('#ref_text').innerHTML = `<blockquote>${currSelectedText}</blockquote>`;
    // if (currSelectedText) {
    //   alert("Got selected text " + currSelectedText);
    // }
  }

  function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    currSelectedText = selectedText;

    if (selectedText) {
      document.querySelector('.paper-clip').classList.add('active');
    } else {
      document.querySelector('.paper-clip').classList.remove('active');
    }
  }

  function injectPaperClip() {
    const paperClip = document.createElement('div');
    paperClip.className = 'paper-clip';
    const paperClipImage = document.createElement('img');
    paperClipImage.src = chrome.runtime.getURL("icon.png");
    paperClip.appendChild(paperClipImage);
    paperClip.addEventListener("mousedown", e => paperClipClicked(e));
    document.querySelector('body').append(paperClip);
    document.onmouseup = doSomethingWithSelectedText;
    document.onkeyup = doSomethingWithSelectedText;
  }

  function createPanel() {
    gepetto_frame = document.createElement('iframe');
    gepetto_frame.id = 'gepetto-panel';
    
    document.body.appendChild(gepetto_frame); // must be here for the iframe to have document element

    const link = gepetto_frame.contentWindow.document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('inject.panel.css');
    gepetto_frame.contentWindow.document.head.appendChild(link);
    gepetto_frame.contentWindow.document.body.setAttribute('dir', 'rtl');
  }

  function injectPanel() {
    createPanel();   
    
    const closeBtn = createElementUnderElement('button', 'closeBtn', gepetto_frame, 'body');
    closeBtn.innerText = "X";
    closeBtn.onclick = _ => hidePanel();

    const ref_text = createElementUnderElement('div', 'ref_text', gepetto_frame, 'body');
    
    const loading = createLoader();
    const claims = createElementUnderElement('ul', 'claims', gepetto_frame, 'body');
    const questions = createElementUnderElement('ul', 'questions', gepetto_frame, 'body');
  }

  function createLoader() {
    const loader = createElementUnderElement('div', 'loader', gepetto_frame, 'body');
    loader.innerHTML = '<div></div>'.repeat(3);
  }

  function hidePanel() {
    const panel = document.getElementById('gepetto-panel');
    panel.classList.remove('Active');
  }

  function doGepetto() {
    const currSelectedText = getSelectedText();
    
    gepetto_frame.contentDocument.querySelector('body').classList.add('loading');
    gepetto_frame.contentDocument.querySelector('body #claims').innerHTML = '';
    gepetto_frame.contentDocument.querySelector('body #questions').innerHTML = '';

    gepetto_frame.contentDocument.querySelector('#ref_text').innerHTML = 
      `<blockquote>
          <span class="q">”</span>
          <span>${currSelectedText}</span>
          <span class="q">“</span>
        </blockquote>`;
    
    new GePeTtoClient().query_gepetto(currSelectedText).then(
      (resp) => {
        const { claims, questions } = resp.he;
        
        createElementUnderElement('div', `claimTitle`, gepetto_frame, '#claims', 'טענות שעולות מהטקסט');
        const cUL = createElementUnderElement('ul', 'claimsUL', gepetto_frame, '#claims');
        createElementUnderElement('div', `questionTitle`, gepetto_frame, '#questions', 'שאלות שעולות מהטקסט');
        const qUL = createElementUnderElement('ul', 'questionsUL', gepetto_frame, '#questions');
        
        claims?.forEach((c, i) => {
          createElementUnderElement('li', `claim${i}`, gepetto_frame, '#claims ul', c);
        }); 
        questions?.forEach((q, i) => {
          createElementUnderElement('li', `question${i}`, gepetto_frame, '#questions', q);
        });
      },
      injectError
    ).finally(() => 
      { gepetto_frame.contentDocument.querySelector('body').classList.remove('loading'); }
    );
  }
  

  function injectError(error) {
    createElementUnderElement('p', 'error-message', gepetto_frame, 'body', `<detail>Something went wrong...<summary>${error.message}${error.isFatal ? '!' : ''}</summary></summary></detail>`);
  }

  function createElementUnder(type, id, parentQS, innerHTML) {
    const el = document.createElement(type);
    el.id = id;
    el.innerHTML = innerHTML;
    document.querySelector(parentQS).append(el);
    return el;
  }

  function createElementUnderElement(type, id, parentElement, parentQS, innerHTML) {
    const el = document.createElement(type);
    el.id = id;
    el.innerHTML = innerHTML != undefined ? innerHTML : '';
    parentElement.contentDocument.querySelector(parentQS).append(el);
    return el;
  }
}

init();
