// src/global.d.ts

// Extends the Window interface to include a vendor-prefixed version of the Speech Recognition API.
interface Window {
  webkitSpeechRecognition: any;
}

// Declares the SpeechRecognition interface, defining its properties and methods.
interface SpeechRecognition extends EventTarget {
  grammars: any;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;

  // Event handlers for the speech recognition lifecycle.
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  // This event handler is now correctly typed with the new interface.
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;

  // Methods to control the recognition process.
  start(): void;
  stop(): void;
  abort(): void;
}

// Declares the SpeechRecognition class constructor.
declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

// Defines the interface for the event object returned on a successful recognition.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly emma: Document | null;
  readonly interpretation: any;
  readonly utterance: any;
}

// New: Defines the interface for the event object returned on a recognition error.
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}