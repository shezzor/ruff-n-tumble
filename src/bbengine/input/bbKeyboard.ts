import { bbKey } from './bbKey';
import { bbKeyCode } from './bbKeyCode';

export class bbKeyboard
{
  private _keys: bbKey[];

  constructor() 
  {
    document.body.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyPress(event), false);
    document.body.addEventListener('keyup', (event: KeyboardEvent) => this.onKeyPress(event), false);
  }

  private onKeyPress(event: KeyboardEvent): void
  {
    if (this._keys[event.keyCode])
    {
      this._keys[event.keyCode].update(event);
    }
    else
    {
      this._keys[event.keyCode] = new bbKey(event);
    }
  }

  public isDown(keycode: bbKeyCode): boolean
  {
    return this._keys[keycode].isPressed;
  }

  public isUp(keycode: bbKeyCode): boolean
  {
    return !this._keys[keycode].isPressed;
  }
}
