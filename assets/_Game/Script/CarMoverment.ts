import { __private, _decorator, CCInteger, Component, EventKeyboard, EventTouch, input, Input, KeyCode, Vec2, Vec3, WheelJoint2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CarMoverment")
export class CarMoverment extends Component {
    @property(CCInteger)
    speed: number = 1;

    @property(WheelJoint2D)
    rightWheel: WheelJoint2D = null;

    @property(WheelJoint2D)
    leftWheel: WheelJoint2D = null;

    carPos: Vec3;
    direction: Vec2;

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }
    onKeyDown(event: EventKeyboard) {
        if (event.keyCode == KeyCode.KEY_D || event.keyCode == KeyCode.ARROW_RIGHT) {
            this.enabledSpeed(this.rightWheel);
            this.disableSpeed(this.leftWheel);
        }
        else if (event.keyCode == KeyCode.KEY_A || event.keyCode == KeyCode.ARROW_LEFT) {
            this.enabledSpeed(this.leftWheel);
            this.disableSpeed(this.rightWheel);
        }
        else {
            this.disableSpeed(this.leftWheel);
            this.disableSpeed(this.rightWheel);
        }
    }

    enabledSpeed(wheel: WheelJoint2D) {
        wheel.enableMotor = true;
    }

    disableSpeed(wheel: WheelJoint2D) {
        wheel.enableMotor = false;
        wheel.connectedBody.angularVelocity = 0;
    }

    onKeyUp(event: EventKeyboard) {
        this.disableSpeed(this.leftWheel);
        this.disableSpeed(this.rightWheel);
    }

}
