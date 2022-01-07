import './style.css';
import {App} from './app';

if (! window.webkitSpeechRecognition) {
  alert('Reconnaissance vocale non disponible !');
} else {
  const app = new App();
  app.init();
}
