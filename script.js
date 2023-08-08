let _speechSynth;
let _voices;
const _cache = {};

function loadVoicesWhenAvailable (onComplete = () => {}) {
  _speechSynth = window.speechSynthesis
  const voices = _speechSynth.getVoices()

  if (voices.length !== 0) {
    _voices = voices
    onComplete()
  } else {
    return setTimeout(function () { loadVoicesWhenAvailable(onComplete) }, 100)
  }
}
function getVoices (locale) {
  if (!_speechSynth) {
    throw new Error('Browser does not support speech synthesis')
  }
  if (_cache[locale]) return _cache[locale]

  _cache[locale] = _voices.filter(voice => voice.lang === locale)
  return _cache[locale]
}
/**
 * Speak a certain text 
 * @param locale the locale this voice requires
 * @param text the text to speak
 * @param onEnd callback if tts is finished
 */
function playByText (locale, text, onEnd) {
  const voices = getVoices(locale)

  const utterance = new window.SpeechSynthesisUtterance()
  utterance.voice = voices[0]
  utterance.pitch = 1
  utterance.rate = 1
  utterance.voiceURI = 'native'
  utterance.volume = 1
  utterance.rate = 1
  utterance.pitch = 0.8
  utterance.text = text
  utterance.lang = locale

  if (onEnd) {
    utterance.onend = onEnd
  }

  _speechSynth.cancel()
  _speechSynth.speak(utterance)
}
loadVoicesWhenAvailable(function () {
 console.log("loaded") 
})


function speak() {
  setTimeout(() => playByText("en-US", "Hello, world"), 300)
}

let open_ai_response;

let converstionHistory = [];

let apikey1 = "sk";
let apikey2 = "-C6aOCnyOVlIBg4eDV";
let apikey3 = "sqiT3BlbkFJgC2FydKzb32WpsFWPDw8";
let apiKey = apikey1 + apikey2 + apikey3;
const chatOutput = document.getElementById('chat');
const userInput = document.getElementById('inputText');
const sendButton = document.getElementById('submit');

let form = document.getElementById('input');

form.addEventListener('submit',(event) => {
    event.preventDefault();
    UserADD(userInput.value);
    userInput.value = '';
    updateChat();
});

async function UserADD(ques){
    let message = {role:'user',content:ques};
    converstionHistory.push(message);
    createMessage(message);
}

async function AssistantADD(res) {
    let message = {role:'assistant',content:res};
    converstionHistory.push(message);
    createMessage(message);
}

async function updateChat(){
    var url = "https://api.openai.com/v1/chat/completions"; // This is the endpoint (location) of the GPT server
    let apikey1 = "sk";
    let apikey2 = "-C6aOCnyOVlIBg4eDV";
    let apikey3 = "sqiT3BlbkFJgC2FydKzb32WpsFWPDw8";
    const apiKey = apikey1 + apikey2 + apikey3;

    let data = {model:"gpt-3.5-turbo",messages:converstionHistory};
    try{
        const res = await fetch(url,{
            method: "POST",
            headers:{
                'Content-Type':"application/json",
                Authorization:`Bearer ${apiKey}`,
            },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            const response = await res.json();
            const message = response.choices[0].message.content;
            AssistantADD(message);

            setTimeout(() => {
                playByText("en-US", message)
            }, 300);

        } else {
            console.log(error);
        }
    }
    catch(error){
        console.error();
    }
}

function createMessage(message){
    let p = document.createElement('p');
    p.textContent = message.content;
    let c = message.role === 'user' ? 'from-me' : 'from-them';
    p.classList.add(c);
    chatOutput.appendChild(p);
}

