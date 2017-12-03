export class bbKey
{
  public keyCode: number;
  public preventDefault: boolean;
  public isPressed: boolean;
  public ctrlKey: boolean;
  public altKey: boolean;
  public shiftKey: boolean;

  /**
   * Compact object to hold the important details from keyboard events
   */
  constructor(event: KeyboardEvent) 
  {
    this.preventDefault = false;
    this.update(event);
  }

  public update(event: KeyboardEvent)
  {
    if (this.preventDefault)
    {
      event.preventDefault();
    }

    this.keyCode = event.keyCode;

    if (event.type === 'keydown')
    {
      this.isPressed = true;

      this.altKey = event.altKey;
      this.ctrlKey = event.ctrlKey;
      this.shiftKey = event.shiftKey;
    }
    else if (event.type === 'keyup')
    {
      this.isPressed = false;
    }
  }
}