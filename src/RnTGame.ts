import { 
  createContext, getContext, GraphicsSystem, loadSprites, addKeyboardInput, Scene, throwIfFalsy, DisplayOptions,
} from '@shezzor/bb-engine';

const displayOptions: DisplayOptions = {
  width: 320,
  height: 224,
  scale: 4,
  selector: 'main',
};

const TARGET_FPS = 60;
const INITIAL_CREDITS = 2;
const FRAME_DELAY = 1000 / TARGET_FPS;

export class RnTGame {
  readonly #graphics: GraphicsSystem;
  #started = false;
  #frame = -1;
  #time?: number;
  #focused = true;
  #scene?: Scene;

  constructor() {
    this.#graphics = new GraphicsSystem();

    addKeyboardInput();
  }

  async initialise(): Promise<number> {
    return Promise.all([
      loadSprites('./data/sprites.json', (key, sprite) => this.#graphics.addSprite(key, sprite)),
    ]).then((results) => {
      return results.length;
    });
  }

  start(state = 'TITLE'): void {
    if (this.#started) return;

    createContext(displayOptions);
    const context = throwIfFalsy(
      getContext(),
      'Error initialising context',
    );

    this.#graphics.setContext(context);
    this.#started = true;

    window.requestAnimationFrame((timeStamp) => this.#main(timeStamp));
  }

  #main(timeStamp: number): void {
    this.#time = (!this.#time) ? timeStamp : this.#time;
    const seg = (timeStamp - this.#time) / FRAME_DELAY << 0;

    if (seg > this.#frame) {
      this.#frame = seg;
      this.#scene?.update();
      this.#scene?.render(this.#graphics);
    }

    if (this.#focused) {
      window.requestAnimationFrame((timeStamp) => this.#main(timeStamp));
    }
  }

  #changeScene(newScene): Scene {
    switch (newScene) {
      default:
        throw new Error(`Error: Unknown game scene ${newScene}`);
    }
  }
}
