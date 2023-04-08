// TODO : use getComputedStyle for text and setting direction  
let currSelectedText;
let currSelectedTextDir;
let isAuto = true;
let gepetto_frame;

class GePeTtoClient {

  API_URL = 'https://gepetto-server.onrender.com/api/claims';
  
  api_headers = {
      "Content-Type": "application/json",
    /*  Authorization: "Bearer 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",*/
  };

  async query_gepetto(input_text, lang) {

    const request = {
      method: "POST",
      headers: this.api_headers,
      body: JSON.stringify({text : input_text, lang})
    };

    let response = await fetch(this.API_URL, request);
    let respJson = await response.json();

    if (response.ok) return respJson;
    else throw respJson;
  }
};

function init() {
  injectGepetto();

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

    if (document.querySelector('#gepetto').classList.contains('panel')) {
      // close
      clearPanel();
      hidePanel();
    } else {
      // close
      showPanel();
      doGepetto();
    }
  }

  function showPanel() {
    document.getElementById('gepetto').classList.add('panel');
  }

  function doSomethingWithSelectedText() {
    var selectedText = getSelectedText();
    currSelectedText = selectedText;
    currSelectedTextDir = getComputedStyle(window.getSelection().focusNode.parentElement).direction;

    if (selectedText) {
      document.getElementById('gepetto').style.direction = currSelectedTextDir;
      document.getElementById('gepetto').classList.add('button-on');
    } else {
      document.getElementById('gepetto').classList.remove('button-on');
    }
  }

  function createPaperClip() {
    const paperClip = document.createElement('div');
    paperClip.className = 'paper-clip';
    const paperClipImage = document.createElement('img');
    paperClipImage.src = chrome.runtime.getURL("icon.png");
    const midDiv = document.createElement('div');
    midDiv.appendChild(paperClipImage);
    paperClip.appendChild(midDiv);
    paperClip.addEventListener("mousedown", e => paperClipClicked(e));
    return paperClip;
  }

  function createPanelBase() {
    const iframe = document.createElement('iframe');
    iframe.id = 'gepetto-panel';
    return iframe;
  }

  function createPanelContents(/*direction*/) {
    let gepetto_frame = document.getElementById('gepetto-panel').contentDocument;
    
    const cssLink = gepetto_frame.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = chrome.runtime.getURL('inject.panel.css');

    gepetto_frame.head.appendChild(cssLink);
    // gepetto_frame.body.setAttribute('dir', direction);

    var fontLink = gepetto_frame.createElement('link');
    fontLink.setAttribute('rel', 'stylesheet');
    fontLink.setAttribute('type', 'text/css');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css?family=Girassol');
    gepetto_frame.head.appendChild(fontLink);

    const fontLink2 = gepetto_frame.createElement('link');
    fontLink2.setAttribute('rel', 'stylesheet');
    fontLink2.setAttribute('type', 'text/css');
    fontLink2.setAttribute('href', 'https://fonts.googleapis.com/css?family=Heebo');
    gepetto_frame.head.appendChild(fontLink2);

    // const closeBtn = createElementUnderElement('button', 'closeBtn', gepetto_frame, 'body');
    // closeBtn.innerText = "X";
    // closeBtn.onclick = _ => hidePanel();

    const ref_text = createElementUnderElement('div', 'ref_text', gepetto_frame, 'body');
    
    const claims = createElementUnderElement('div', 'claims', gepetto_frame, 'body');
    const loading = createLoader(gepetto_frame);
    
    const questions = createElementUnderElement('div', 'questions', gepetto_frame, 'body');
    return gepetto_frame;
  }

  function injectGepetto() {
    const gepettoDiv = document.createElement('div'); 
    gepettoDiv.id = 'gepetto';

    const paperClip = createPaperClip();
    gepetto_frame = createPanelBase();

    gepettoDiv.append(gepetto_frame);
    gepettoDiv.append(paperClip);
    
    document.body.append(gepettoDiv);

    createPanelContents();
    
    document.onmouseup = doSomethingWithSelectedText;
    document.onkeyup = doSomethingWithSelectedText;
  }

  function createLoader(frame) {
    const loader = createElementUnderElement('div', 'loader', frame, 'body');
    loader.innerHTML = '<div></div>'.repeat(3);
  }

  function hidePanel() {
    const gepetto = document.getElementById('gepetto');
    gepetto.classList.remove('panel');
  }

  function createRefText(text) {
    const frm = gepetto_frame.contentDocument;
    const q = frm.createElement('blockquote');
    const img1 = frm.createElement('img');
    img1.src = chrome.runtime.getURL("dq.png");
    const t = frm.createElement('span');
    t.textContent = text.split(' ').slice(0, -1).join(' ') + ' ';
    const lastWordDiv = frm.createElement('div');
    const lastWord = frm.createElement('span');
    lastWord.textContent = text.split(' ').at(-1);
    const img2 = frm.createElement('img');
    img2.src = chrome.runtime.getURL("dq.png");
    lastWordDiv.append(lastWord, img2);
    q.appendChild(img1);
    q.appendChild(t);
    q.appendChild(lastWordDiv);

    return q;
  }

  function clearPanel() {
    const frm = gepetto_frame.contentDocument;
    frm.body.querySelector('#claims').innerHTML = '';
    frm.body.querySelector('#questions').innerHTML = '';
    frm.body.querySelector('#ref_text').innerHTML = '';
    frm.body.querySelector('#error-message')?.remove();
  }

  function isHebrewText() {
    return currSelectedTextDir == 'rtl' && currSelectedText.match(/[א-ת]/g).length > currSelectedText.length / 2;
  }

  function doGepetto() {
    console.log(`doGepetto`);
    console.log(`doGepetto : ${currSelectedTextDir}`);
    clearPanel();
    const currSelectedText = getSelectedText();
    frm = gepetto_frame.contentDocument;
    frm.body.classList.add('loading');
    frm.body.setAttribute('dir', currSelectedTextDir);
    frm.querySelector('#ref_text').append(createRefText(currSelectedText));
    
    new GePeTtoClient().query_gepetto(currSelectedText, isHebrewText() ? 'he' : 'en').then(
      (resp) => {
        console.log(resp);
        const { claims, questions } = resp;

        createElementUnderElement('div', `claimTitle`, frm, '#claims', currSelectedTextDir == 'ltr' ? 'claims found in the text' : 'טענות שעולות מהטקסט');
        const cUL = createElementUnderElement('ul', 'claimsUL', frm, '#claims');
        createElementUnderElement('div', `questionsTitle`, frm, '#questions', currSelectedTextDir == 'ltr' ? 'questions which may be raised' : 'שאלות שעולות מהטקסט');
        const qUL = createElementUnderElement('ul', 'questionsUL', frm, '#questions');
        
        claims?.forEach((c, i) => {
          createElementUnderElement('li', `claim${i}`, frm, '#claims ul', c);
        }); 
        questions?.forEach((q, i) => {
          createElementUnderElement('li', `question${i}`, frm, '#questions ul', q);
        });
      },
      injectError
    ).finally(() => 
      { frm.body.classList.remove('loading'); }
    );
  }

  function injectError(error) {
    createElementUnderElement('p', 'error-message', gepetto_frame.contentDocument, 'body', `<detail>Something went wrong...<summary>${error.message}${error.isFatal ? '!' : ''}</summary></summary></detail>`);
  }

  function createElementUnder(type, id, parentQS, textContent) {
    const el = document.createElement(type);
    el.id = id;
    el.textContent = textContent;
    document.querySelector(parentQS).append(el);
    return el;
  }

  function createElementUnderElement(type, id, parentElement, parentQS, textContent) {
    const el = parentElement.createElement(type);
    el.id = id;
    el.textContent = textContent != undefined ? textContent : '';
    parentElement.querySelector(parentQS).append(el);
    return el;
  }
}

init();
