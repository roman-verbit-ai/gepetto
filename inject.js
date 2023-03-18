let currentDiv;

class GPTClient {

  constructor() {

    // openai API
    this.api_model = "text-davinci-003"
    this.api_headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer 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",
    };

    // gpt query parameters
    this.temperature = 0.05
    this.max_tokens = 3000;

    // prompt
    this.prompt_intro =
      "You are an assistant for critical thinking.\n " +
      "Consider the following tweet: ";
    this.prompt_instructions =
      "\n\nYour tasks are to extract the claims made in the text, " +
      "and generate questions which challenge these claims. " +
      "Semantically, the questions should inquire about facts to base the claims, " +
      "people and institutions involved in situations described in the post, " +
      "demand details for vague claims, challenge assumptions.\n ";
    this.prompt_output =
      "Questions' text should be in Hebrew.\n" +
      "List the claims and the questions associated with each claim. " +
      "Format output in a JSON list, where each object has the claim's text and the questions associated with it.\n";
  }

  query_gpt(input_text) {

    // build prompt
    const full_prompt = this.prompt_intro + input_text + this.prompt_instructions + this.prompt_output;
    console.log("Full prompt:" + full_prompt);
    console.log(this.api_headers);

    // build request
    const request = {
      method: "POST",
      headers: this.api_headers,
      body: JSON.stringify({
        model: this.api_model,
        prompt: full_prompt,
        temperature: 0.05,
        max_tokens: 3000,
        stream: false
      })
    };

    // fetch results
    return fetch(`https://api.openai.com/v1/completions`, request)
      .then((response) => response.text())
      .then(data => JSON.parse(data), 
            (error) => {alert('sorry. error'); return null; })
      .then(parsed_data => {
        console.log(parsed_data);
        if (parsed_data)
          return JSON.parse(parsed_data['choices'][0]['text']);
      })
  }
}

function doApprove(text) {
  _text = text; // ?? currentDiv.querySelector('#gptModal #output_area').innerText;
  let field = document.querySelector('[contenteditable="true"]');
  field.focus();
  const data = new DataTransfer();
  data.setData(
    'text/plain',
    _text
  );
  field.dispatchEvent(
    new ClipboardEvent('paste', {
      clipboardData: data,

      // need these for the event to reach Draft paste handler
      bubbles: true,
      cancelable: true
    })
  );
  // const span = document.createElement('span');
  // span.setAttribute('data-test', "true");

  // txt = document.createTextNode(_text);
  // span.appendChild(txt);
  // currentDiv.querySelector('span[data-offset-key]').append(span);
  // currentDiv.querySelector('.public-DraftEditorPlaceholder-root').remove();
  document.getElementById('gptModal').remove();
}

async function critisize(text) {
  // do GPT magic
  const gpt_client = new GPTClient();
  
  gpt_client.query_gpt(text).then((data) => {
    
    console.log(data);

    data.forEach(x => {
      const accButton = document.createElement("button");
      accButton.innerText = x.claim;
      accButton.className = 'accordion';
      accButton.addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
       
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });

      const accPanel = document.createElement("div");
      accPanel.className = 'panel';

      x.questions.forEach(q => {
        const question = document.createElement("div");
        question.className = "question";
        question.innerText = q;
        question.addEventListener("click", function() {
          doApprove(q);
        });
  
        accPanel.append(question);
      });
      
      document.getElementById("output_area").append(accButton);
      document.getElementById("output_area").append(accPanel);
    });
    
    // #gptModal #output_area 
    document.querySelector('.loading-container').style.display = 'none';
  });
}

function init() {

  injectStyle();

  const criticizeButton = createBtn();

  function injectStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .criticizeButton:hover {
          cursor: pointer;
        }

        .loading-container{
            height: 400px;
            width: 400px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            border-radius: 10px;
        }
        .loading-container .row{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        .loading-container .circle{
            display: inline-block;
            width: 30px;
            height: 30px;
            background-color: #146356;
            border-radius: 50%;
            box-shadow: 10px 0px 5px -1px rgba(0,0,0,0.75);
        }
        .loading-container .circle1{
            animation-name: loading;
            animation-duration: 1s;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            transform: translate(0);
            animation-timing-function: ease-in-out;
        }
        @keyframes loading {
            0%{
                transform: translate(0,-30px);
            }
            50%{
                transform: translate(0);
            }
            100%{
                transform: translate(0,30px);
            }
        }
        .loading-container .circle2{
            animation-name: loading2;
            animation-duration: 1s;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            transform: translate(0);
            animation-timing-function: ease-in-out;
            animation-delay: 1s;
        }
        @keyframes loading2 {
            0%{
                transform: translate(0,-30px);
            }
            50%{
                transform: translate(0);
            }
            100%{
                transform: translate(0,30px);
            }
        }
        .loading-container .circle3{
            animation-name: loading3;
            animation-duration: 1s;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            transform: translate(0);
            animation-timing-function: ease-in-out;
        }
        @keyframes loading3 {
            0%{
                transform: translate(0,-30px);
            }
            50%{
                transform: translate(0);
            }
            100%{
                transform: translate(0,30px);
            }
        }

        /* The Modal (background) */
        #gptModal {
          display: none; /* Hidden by default */
          position: fixed; /* Stay in place */
          z-index: 1; /* Sit on top */
          left: 0;
          top: 0;
          width: 100%; /* Full width */
          height: 100%; /* Full height */
          overflow: auto; /* Enable scroll if needed */
          background-color: rgb(0,0,0); /* Fallback color */
          background-color: rgba(91, 112, 131, 0.4)
        }
        
        /* Modal Content/Box */
        #gptModal .modal-content {
          direction: rtl;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 470px;
          padding: 15px;

          background: #000000;
          border-radius: 20px;
        }
        
        #gptModal .loadingText {
          position: absolute;
          bottom: 17px;
          color: white;
          font-size: 20px;
          text-align: center;
          width: 100%;
        }

        /* The Close Button */
        #gptModal .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
        }
        
        #gptModal .close:hover,
        #gptModal .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        } 

        #gptModal .accordion {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          line-height: 140%;
          text-align: right;
          color: #FFFFFF;
          background: #17181C;
          border-radius: 20px;
          color: #FFFFFF;
          cursor: pointer;
          padding: 20px 25px;
          width: 100%;
          border: none;
          outline: none;
          transition: 0.4s;
          margin-top: 10px;
          margin-bottom: 2px;
        }
        
        #gptModal .panel {
          padding: 0 18px;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.2s ease-out;
        }

        #gptModal .panel:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        #gptModal .panel .question {
          color: #FFFFFF;
          background: #000000;
          border-radius: 20px;
          padding: 15px;
          cursor: pointer;
        }
      `
    ;

    document.head.append(style);
  }

  function appendShareButton(toolbar) {

    const buttonsWrapper = toolbar ?? document.querySelector('[data-testid="toolBar"]')?.firstChild;

    if (buttonsWrapper) {
      let btn = buttonsWrapper.querySelector('.criticizeButton');
      console.log(btn);
      if (!btn) buttonsWrapper.appendChild(criticizeButton);
    }
  }

  appendShareButton();

  const observer = new MutationObserver(function (mutations_list) {
    mutations_list.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        console.log(mutation.addedNodes);
        let toolbar = mutation.addedNodes[0].querySelector('[data-testid="toolBar"]');
        appendShareButton(toolbar);
      }
    });
  });

  observer.observe(document.querySelector('[data-testid="cellInnerDiv"]'), {
    subtree: true,
    childList: true,
  });

  criticizeButton.addEventListener("click", async () => {
    currentDiv = criticizeButton.closest('[data-testid="cellInnerDiv"]');
    const tweet = currentDiv.querySelector('[data-testid="tweetText"] span').innerText;
    const modal = document.createElement("div");

    modal.id = 'gptModal';
    modal.className = 'modal';
    modal.style = ' display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); '
    modal.innerHTML = `
		  <div class="modal-content">
        <span class="close">&times;</span>
        <div class="loading-container">
          <div class="row" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);">
              <div class="circle circle1"></div>
              <div class="circle circle2"></div>
              <div class="circle circle3"></div>
          </div>

          <span class="loadingText">חושב על זה...</span>
        </div>
        
        <div id="output_area"></div>
		  </div>
		`;

    document.querySelector('body').append(modal);
    document.querySelector('#gptModal .close').addEventListener("click", () => doApprove('xxxxxx'));
    critisize(tweet);
    console.log(criticizeButton);
  });
}

function showIfNotLoading(loadingElement, newElement) {
  const timerId = setInterval(() => {
    if (loadingElement.disabled) {
      isLoading = true;
      newElement.style.display = "none";
    } else {
      isLoading = false;
      newElement.style.display = "flex";
      clearInterval(timerId);
    }
  }, 100);
}

function createBtn() {
  const button = document.createElement("div");
  button.classList.add("criticizeButton");
  button.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0.5" y="0.5" width="27" height="27" rx="7.5" stroke="url(#paint0_linear_44_26)"/>
  <path d="M11.3742 14.5208C11.9353 11.575 12.7068 10.8035 15.6527 10.2424C16.0034 10.1722 16.2138 9.89167 16.2138 9.54097C16.2138 9.19028 16.0034 8.90972 15.6527 8.83958C12.7068 8.27847 11.9353 7.50694 11.3742 4.56111C11.3041 4.21042 11.0235 4 10.6728 4C10.3221 4 10.0416 4.21042 9.97142 4.56111C9.41031 7.50694 8.63878 8.27847 5.69295 8.83958C5.41239 8.90972 5.13184 9.19028 5.13184 9.54097C5.13184 9.89167 5.34225 10.1722 5.69295 10.2424C8.63878 10.8035 9.41031 11.575 9.97142 14.5208C10.0416 14.8715 10.3221 15.0819 10.6728 15.0819C11.0235 15.0819 11.3041 14.8014 11.3742 14.5208Z" fill="url(#paint1_linear_44_26)"/>
  <path d="M18.3885 19.4306C16.4246 19.0098 16.0038 18.589 15.5829 16.6251C15.5128 16.2744 15.2322 16.064 14.8815 16.064C14.5308 16.064 14.2503 16.2744 14.1801 16.6251C13.7593 18.589 13.3385 19.0098 11.3746 19.4306C11.0239 19.5008 10.8135 19.7813 10.8135 20.132C10.8135 20.4827 11.0239 20.7633 11.3746 20.8334C13.3385 21.2542 13.7593 21.6751 14.1801 23.639C14.2503 23.9897 14.5308 24.2001 14.8815 24.2001C15.2322 24.2001 15.5128 23.9897 15.5829 23.639C16.0038 21.6751 16.4246 21.2542 18.3885 20.8334C18.7392 20.7633 18.9496 20.4827 18.9496 20.132C18.9496 19.7813 18.669 19.5008 18.3885 19.4306Z" fill="url(#paint2_linear_44_26)"/>
  <path d="M23.4385 12.4168C21.8954 12.1363 21.5447 11.7856 21.2642 10.2425C21.194 9.89181 20.9135 9.6814 20.5628 9.6814C20.2121 9.6814 19.9315 9.89181 19.8614 10.2425C19.5808 11.7856 19.2301 12.1363 17.6871 12.4168C17.3364 12.487 17.126 12.7675 17.126 13.1182C17.126 13.4689 17.3364 13.7495 17.6871 13.8196C19.2301 14.1001 19.5808 14.4508 19.8614 15.9939C19.9315 16.3446 20.2121 16.555 20.5628 16.555C20.9135 16.555 21.194 16.3446 21.2642 15.9939C21.5447 14.4508 21.8954 14.1001 23.4385 13.8196C23.7892 13.7495 23.9996 13.4689 23.9996 13.1182C23.9996 12.7675 23.7892 12.487 23.4385 12.4168Z" fill="url(#paint3_linear_44_26)"/>
  <path d="M6.95603 18.2382C6.74562 18.0277 6.46506 17.9576 6.18451 18.0979C6.11437 18.0979 6.04423 18.168 5.97409 18.2382C5.90395 18.3083 5.83381 18.3784 5.83381 18.4486C5.76367 18.5187 5.76367 18.659 5.76367 18.7291C5.76367 18.7993 5.76367 18.9395 5.83381 19.0097C5.90395 19.0798 5.90395 19.15 5.97409 19.2201C6.04423 19.2902 6.11437 19.3604 6.18451 19.3604C6.25464 19.4305 6.39492 19.4305 6.46506 19.4305C6.5352 19.4305 6.67548 19.4305 6.74562 19.3604C6.81576 19.2902 6.88589 19.2902 6.95603 19.2201C7.02617 19.15 7.09631 19.0798 7.09631 19.0097C7.16645 18.9395 7.16645 18.7993 7.16645 18.7291C7.16645 18.659 7.16645 18.5187 7.09631 18.4486C7.09631 18.3784 7.02617 18.3083 6.95603 18.2382Z" fill="url(#paint4_linear_44_26)"/>
  <path d="M22.5969 7.50683C22.8073 7.50683 22.9476 7.43669 23.0879 7.29641C23.2281 7.15613 23.2983 7.01585 23.2983 6.80544C23.2983 6.59502 23.2281 6.45474 23.0879 6.31446C23.0177 6.24433 22.9476 6.17419 22.8775 6.17419C22.7372 6.10405 22.5268 6.10405 22.3163 6.17419C22.2462 6.17419 22.1761 6.24433 22.1059 6.31446C21.9656 6.45474 21.8955 6.59502 21.8955 6.80544C21.8955 7.01585 21.9656 7.15613 22.1059 7.29641C22.2462 7.43669 22.3865 7.50683 22.5969 7.50683Z" fill="url(#paint5_linear_44_26)"/>
  <defs>
  <linearGradient id="paint0_linear_44_26" x1="14" y1="1.77424e-08" x2="14.5953" y2="45.1092" gradientUnits="userSpaceOnUse">
  <stop stop-color="#AC23CE"/>
  <stop offset="1" stop-color="#5F1971" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="paint1_linear_44_26" x1="10.6728" y1="4" x2="10.6728" y2="15.0819" gradientUnits="userSpaceOnUse">
  <stop stop-color="#9312E2"/>
  <stop offset="1" stop-color="#FFBAFC" stop-opacity="0.97"/>
  </linearGradient>
  <linearGradient id="paint2_linear_44_26" x1="14.8815" y1="16.064" x2="14.8815" y2="24.2001" gradientUnits="userSpaceOnUse">
  <stop stop-color="#9312E2"/>
  <stop offset="1" stop-color="#FFBAFC" stop-opacity="0.97"/>
  </linearGradient>
  <linearGradient id="paint3_linear_44_26" x1="20.5628" y1="9.6814" x2="20.5628" y2="16.555" gradientUnits="userSpaceOnUse">
  <stop stop-color="#9312E2"/>
  <stop offset="1" stop-color="#FFBAFC" stop-opacity="0.97"/>
  </linearGradient>
  <linearGradient id="paint4_linear_44_26" x1="6.46506" y1="18.0249" x2="6.46506" y2="19.4305" gradientUnits="userSpaceOnUse">
  <stop stop-color="#9312E2"/>
  <stop offset="1" stop-color="#FFBAFC" stop-opacity="0.97"/>
  </linearGradient>
  <linearGradient id="paint5_linear_44_26" x1="22.5969" y1="6.12158" x2="22.5969" y2="7.50683" gradientUnits="userSpaceOnUse">
  <stop stop-color="#9312E2"/>
  <stop offset="1" stop-color="#FFBAFC" stop-opacity="0.97"/>
  </linearGradient>
  </defs>
  </svg>
  `;
  return button;
}

setTimeout(function () { init(); alert("loaded2");}, 5000);

document.addEventListener('DOMContentLoaded', function() { alert('attempt #3'); });
window.onload=function(){ alert("test"); } 