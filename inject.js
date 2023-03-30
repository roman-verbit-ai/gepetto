let currSelectedText;
let gepettoPanel;
const isAuto = true;

class GePeTtoClient {

  API_URL = 'https://gepetto-server.onrender.com/api/claims';
  
  api_headers = {
      "Content-Type": "application/json",
    /*  Authorization: "Bearer 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",*/
  };

  query_gepetto(input_text) {

    const request = {
      method: "POST",
      headers: this.api_headers,
      body: JSON.stringify({text : input_text})
    };

    return fetch(this.API_URL, request)
      .then((response) => response.text(),
            (error) => {alert('sorry. error'); console.error(error); return null; })
      .then((data) => JSON.parse(data));
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
    showPanel();
  }

  function showPanel() {
    const panel = document.getElementById('gepetto-panel');
    panel.classList.add('Active');
    panel.querySelector('#ref_text').innerHTML = `<p>${currSelectedText}</p>`;
    // if (currSelectedText) {
    //   alert("Got selected text " + currSelectedText);
    // }
  }

  function doSomethingWithSelectedText() {
    console.log("doSomethingWithSelectedText");
      var selectedText = getSelectedText();
      currSelectedText = selectedText;

      if (selectedText) {
        document.querySelector('.paper-clip').classList.add('active');

        if (isAuto) {
          doGepetto(selectedText);
        }
      } else {
        document.querySelector('.paper-clip').classList.remove('active');
      }
  }

  function injectPaperClip() {
    const paperClip = document.createElement('div');
    paperClip.className = 'paper-clip';
    paperClip.addEventListener("mousedown", e => paperClipClicked(e));
    document.querySelector('body').append(paperClip);
    document.onmouseup = doSomethingWithSelectedText;
    document.onkeyup = doSomethingWithSelectedText;
  }

  function injectPanel() {
    const panel = createElementUnder('div', 'gepetto-panel', 'body');
    const ref_text = createElementUnder('div', 'ref_text', '#gepetto-panel');
    const content = createElementUnder('div', 'content', '#gepetto-panel');
    const loading = createElementUnder('div', 'loading', '#gepetto-panel>#content');
    const questions = createElementUnder('div', 'questions', '#gepetto-panel>#content');
    const claims = createElementUnder('div', 'claims', '#gepetto-panel>#content');
  }

  function doGepetto(text) {
    document.querySelector('#gepetto-panel #claims').innerHTML = '';
    document.querySelector('#gepetto-panel #questions').innerHTML = '';

    document.querySelector('#gepetto-panel #ref_text').innerHTML = `<p>${currSelectedText}</p>`;
    
    new GePeTtoClient().query_gepetto(currSelectedText).then((resp) => {      
      console.log(resp)
      
      resp.Claims.forEach((c, i) => {
        const _claim = createElementUnder('p', `claim${i}`, '#gepetto-panel #claims');
        _claim.innerHTML = c;
      }); 

      resp.Questions.forEach((q, i) => {
        const _question = createElementUnder('p', `question${i}`, '#gepetto-panel #questions');
        _question.innerHTML = q;
      }); 
    });
  }

  function createElementUnder(type, id, parentQS) {
    const el = document.createElement(type);
    el.id = id;
    document.querySelector(parentQS).append(el);
    return el;
  }
}

init();
