let isRequesting = false;
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
		console.log("Full prompt:" + full_prompt)

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
		})};

		// fetch results
		return fetch(`https://api.openai.com/v1/completions`, request)
			.then((response) => response.text())
			.then(data => JSON.parse(data))
			.then(parsed_data => {
				console.log("Response" + parsed_data);
				return parsed_data['choices'][0]['text']
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
	
	async function critisize() {

		// find elements
		const input_textarea = document.getElementById("input_text")
		console.log("input: " + input_textarea.value)

		// do GPT magic
		const gpt_client = new GPTClient()
		document.getElementById("output_area").innerText = await gpt_client.query_gpt(input_textarea.value)
	}

		
function init() {
	
    const shareButton = createBtn();
	
    function appendShareButton(toolbar) {
        
		console.log(`ASB : ${toolbar}`);
		console.log(`ASB : ${document.querySelector('[data-testid="toolBar"]')}`);
		console.log(`ASB : ${document.querySelector('[data-testid="toolBar"]')?.firstChild}`);
		
		const buttonsWrapper = toolbar ?? document.querySelector('[data-testid="toolBar"]')?.firstChild;
		
		if (buttonsWrapper) {
			let btn = buttonsWrapper.querySelector('.btn-neutral');
			console.log(btn);
			if (!btn) buttonsWrapper.appendChild(shareButton);
		}
    }
	
    appendShareButton();
    
	// re-append the share buttin whenever "#__next main" gets replaced
    const observer = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
				console.log(mutation.addedNodes);
				let toolbar = mutation.addedNodes[0].querySelector('[data-testid="toolBar"]');
                console.log("in!");
				appendShareButton(toolbar);
            }
        });
    });
	
	
	console.log(document.querySelector('[data-testid="cellInnerDiv"]'));
    observer.observe(document.querySelector('[data-testid="cellInnerDiv"]'), {
        subtree: true,
        childList: true,
    });
	
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
            console.log("Full prompt:" + full_prompt)

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
            })};

            // fetch results
            return fetch(`https://api.openai.com/v1/completions`, request)
                .then((response) => response.text())
                .then(data => JSON.parse(data))
                .then(parsed_data => {
                    console.log("Response" + parsed_data);
                    return parsed_data['choices'][0]['text']
            })
          }
        }

        async function critisize() {

            // find elements
            const input_textarea = document.getElementById("input_text")
            console.log("input: " + input_textarea.value)

            // do GPT magic
            const gpt_client = new GPTClient()
            document.getElementById("output_area").innerText = await gpt_client.query_gpt(input_textarea.value)
        }

    shareButton.addEventListener("click", async () => {
		currentDiv = shareButton.closest('[data-testid="cellInnerDiv"]');
		const tweet = currentDiv.querySelector('[data-testid="tweetText"] span').innerText;
		const modal = document.createElement("div");
		modal.id = 'gptModal';
		modal.class = 'modal';
		modal.style = ' display: block; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); '
		modal.innerHTML = `
		  <div class="modal-content" style='background-color: #fefefe;  margin: 15% auto; /* 15% from the top and centered */  padding: 20px;  border: 1px solid #888;  width: 80%; /* Could be more or less, depending on screen size */'>
			<span class="close" style="color: #aaa; float: right;  font-size: 28px; font-weight: bold;' onclick="alert(222);">&times;</span>
			<input type="button" name="query">
			<textarea id="input_text">${tweet}</textarea>
			<div id="output_area"></div>
		  </div>
		`;
		
		document.querySelector('body').append(modal);
		document.querySelector('#gptModal input').addEventListener("click", critisize);
		document.querySelector('#gptModal .close').addEventListener("click", () => doApprove('xxxxxx'));
		

/* 
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; 
  padding: 20px;
  border: 1px solid #888;
  width: 80%; 
}


.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}*/
		
		console.log(shareButton);
		alert(123123132);
/*     
	 if (isRequesting) return;
        isRequesting = true;
        shareButton.textContent = "Sharing...";
        shareButton.style.cursor = "initial";
        const threadContainer = document.getElementsByClassName(
            "flex flex-col items-center text-sm dark:bg-gray-800"
        )[0];
        const modelElement = threadContainer.firstChild;
        const model = modelElement.innerText;
        const conversationData = {
            avatarUrl: getAvatarImage(),
            model,
            items: [],
        };
        for (const node of threadContainer.children) {
            const markdown = node.querySelector(".markdown");
            // tailwind class indicates human or gpt
            if ([...node.classList].includes("dark:bg-gray-800")) {
                const warning = node.querySelector(".text-orange-500");
                if (warning) {
                    conversationData.items.push({
                        from: "human",
                        value: warning.innerText.split("\n")[0],
                    });
                } else {
                    conversationData.items.push({
                        from: "human",
                        value: node.textContent,
                    });
                }
                // if it's a GPT response, it might contain code blocks
            } else if (markdown) {
                conversationData.items.push({
                    from: "gpt",
                    value: markdown.outerHTML,
                });
            }
        }
        const res = await fetch("https://sharegpt.com/api/conversations", {
                body: JSON.stringify(conversationData),
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
            })
            .catch((err) => {
                isRequesting = false;
                alert(`Error saving conversation: ${err.message}`);
            });
        const {
            id
        } = await res.json();
        const url = `https://sharegpt.com/c/${id}`;
        window.open(url, "_blank");
        setTimeout(() => {
            shareButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>Share`;
            shareButton.style.cursor = "pointer";
            isRequesting = false;
        }, 1000);*/
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

function getAvatarImage() {
    // Create a canvas element
    try {
        const canvas = document.createElement("canvas");
        const image = document.querySelectorAll("img")[1];
        // Set the canvas size to 30x30 pixels
        canvas.width = 30;
        canvas.height = 30;
        // Draw the img onto the canvas
        canvas.getContext("2d")
            .drawImage(image, 0, 0);
        // Convert the canvas to a base64 string as a JPEG image
        const base64 = canvas.toDataURL("image/jpeg");
        return base64;
    } catch (error) {
        console.log("Error generating avatar image.");
        return null;
    }
}

function createBtn() {
    const button = document.createElement("button");
    button.classList.add("btn", "flex", "gap-2", "justify-center", "btn-neutral");
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
</svg>Share`;
    return button;
}

alert("before");
setTimeout(function () { init(); }, 5000);
	