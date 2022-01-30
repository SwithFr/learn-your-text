export class App {

  constructor() {
    console.log('ok');
    this.outputDiff = document.getElementById('outputDiff');
    this.input = document.getElementById('input');
    this.go = document.getElementById('go');
    this.output = document.getElementById('output');
    this.clear = document.getElementById('clear');
    this.recognition = new window.webkitSpeechRecognition();
    this.dmp = new diff_match_patch();
    this.listening = false;
  }

  init() {
    this.initRecognition();
    this.initListeners();
    this.input.value = this.cleanText(this.input.value);
  }

  initRecognition() {
    this.recognition.lang = 'fr-FR';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.onresult = e => {
      const result = e.results.item(e.resultIndex);
      const transcript = result.item(0).transcript;
      const sentence = transcript.charAt(0).toUpperCase() + transcript.slice(1);
      this.output.innerText += this.cleanText(sentence);

      const d = this.dmp.diff_main(this.input.value, this.output.innerText);
      this.dmp.diff_cleanupSemantic(d);
      this.outputDiff.innerHTML = this.dmp.diff_prettyHtml(d);
    };
  }

  cleanText(text) {
    const from = 'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;…';
    const to = 'AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa---    ';
    for (let i = 0, l = from.length; i < l; i++) {
      text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    return text.replace(/(\.|!|«|\?|»|,)+/gm, ' ').replace(/’+/gm, '\'').replace(/[ ]{2,}/gm, ' ').toLowerCase();
  }

  initListeners() {
    this.go.addEventListener('click', (e) => {
      e.preventDefault();
      if (! this.listening) {
        this.recognition.start();
        this.listening = true;
        this.go.innerText = 'Arrêter';
      } else {
        this.recognition.stop();
        this.listening = false;
        this.go.innerText = 'C\'est parti';
      }
    }, false);

    this.clear.addEventListener('click', (e) => {
      e.preventDefault();
      this.recognition.stop();
      this.listening = false;
      this.go.innerText = 'C\'est parti';
      this.output.innerText = '';
      this.outputDiff.innerHTML = '';
    }, false);

    this.input.addEventListener('blur', () => {
      this.input.value = this.cleanText(this.input.value);
    }, false);
  }
}
