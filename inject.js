

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
      .then((response) => response.text())
      .then((data) => {
        try {
          JSON.parse(data);
        } catch (error) {
          return data?.split('<body>')?.[1]?.split('</body>')?.[0];
        }
        
      });
  }
};

function debounce (callback, wait) {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}
function listenToUserSelection(cb) {
  const listener = debounce(_ => {
    cb();
  }, 500);
  document.addEventListener('selectionchange', listener);
  document.addEventListener('unload', () => {
    document.removeEventListener('selectionchange', listener);
  });
}
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
  createSidePanel();
  doGepetto(getSelectedText());
  showPanel();
}

function createSidePanel() {
  if (document.getElementById('gepetto-panel')) {
    document.removeChild('#gepetto-panel');
  }
  const panel = document.createElement('div');
  panel.id = 'gepetto-panel';
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  closeBtn.onclick = _ => hidePanel();
  panel.append(closeBtn);
  const qSection = document.createElement('div');
  qSection.id = 'questions';
  panel.append(qSection);
  const cSection = document.createElement('div');
  cSection.id = 'claims';
  panel.append(cSection);
  const refText = document.createElement('div');
  refText.id = 'ref_text';
  panel.append(refText);
  document.body.append(panel);
}
function attachToSelection(el) {
  const selection = window.getSelection();
  const pos = selection?.anchorNode?.parentElement?.getBoundingClientRect();
  const xPosition = pos.left + selection.focusOffset;
  el.style.setProperty('--pos-x', xPosition + 'px');
  el.style.setProperty('--pos-y', pos.bottom + 'px');

}
function hidePanel() {
  const panel = document.getElementById('gepetto-panel');
  panel.classList.remove('Active');
}
function showPanel() {
  const panel = document.getElementById('gepetto-panel');
  panel.classList.add('Active');
  panel.querySelector('#ref_text').innerHTML = `<p>${getSelectedText()}</p>`;
}

function createPaperClip() {
  const paperClip = document.createElement('div');
  paperClip.className = 'paper-clip';
  attachToSelection(paperClip);
  paperClip.addEventListener("mousedown", e => paperClipClicked(e));
  return paperClip;
}
function injectPaperClip() {
  const paperClip = createPaperClip();
  document.querySelector('body').append(paperClip);
  paperClip.classList.add('active');
}


function doGepetto() {
  const currSelectedText = getSelectedText();
  document.querySelector('#gepetto-panel #claims').innerHTML = '';
  document.querySelector('#gepetto-panel #questions').innerHTML = '';

  document.querySelector('#gepetto-panel #ref_text').innerHTML = `<p>${currSelectedText}</p>`;
  new GePeTtoClient().query_gepetto(currSelectedText).then((resp) => {
    
    if (resp.Claims || resp.Questions) {
      resp.Claims?.forEach((c, i) => {
        const _claim = createElementUnder('p', `claim${i}`, '#gepetto-panel #claims');
        _claim.innerHTML = c;
      }); 
      resp.Questions?.forEach((q, i) => {
        const _question = createElementUnder('p', `question${i}`, '#gepetto-panel #questions');
        _question.innerHTML = q;
      });
    } else {
      if (!document.getElementById('error-message')) {
        const _error_message = createElementUnder('p', 'error-message', '#gepetto-panel #claims');
        _error_message.innerHTML = `<detail>Something went wrong...<summary>${resp}</summary></summary></detail>`;
      }
    }
  });
}
function init() {
  listenToUserSelection(injectPaperClip);
}

  function createElementUnder(type, id, parentQS) {
    const el = document.createElement(type);
    el.id = id;
    document.querySelector(parentQS).append(el);
    return el;
  }

init();
