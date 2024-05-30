import { _decorator, Component, EventTouch, Input, input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {

    mousePos: Vec3 = new Vec3(0, 0, 0);

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    onTouchStart(event: EventTouch) {
        console.log("Touch Start Success");
    }

    onTouchMove(event: EventTouch) {
        // this.mousePos = event.getUILocation;
        console.log("Touch Move Success: " + event.getUILocation());
    }

    update(deltaTime: number) {

    }
}


