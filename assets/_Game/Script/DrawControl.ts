import { _decorator, Component, ERaycast2DType, ERigidBody2DType, EventTouch, Graphics, Input, input, Node, PhysicsSystem2D, PolygonCollider2D, RigidBody2D, Vec2, Vec3, } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DrawControl")
export class DrawControl extends Component {

    @property(RigidBody2D)
    listRigibody: RigidBody2D[] = [];

    @property(Graphics)
    line: Graphics = null;

    @property(Node)
    canvas: Node = null;

    startPoint: Vec2 = new Vec2(0, 0);
    endPoint: Vec2 = new Vec2(100, 100);

    lastMouseMoveTime: number = 0;

    endDraw: boolean = false;

    start() {
        this.init();
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        // input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);

        // this.drawLine(this.startPoint, this.endPoint);
    }
    init() {
        this.line.node.position = new Vec3(-this.canvas.position.x, -this.canvas.position.y);
        this.line.clear();
    }
    onTouchStart(event: EventTouch) {
        // console.log("Touch Start Success");
        this.startPoint = event.getUILocation();
    }
    onTouchMove(event: EventTouch) {
        this.endPoint = event.getUILocation();
        // console.log("Touch Move Success" + this.endPoint);
        this.drawLine(this.startPoint, this.endPoint);
    }
    onTouchEnd(event: EventTouch) {
        this.touchEnd();
    }
    touchEnd() {
        this.endDraw = true;
        this.turnDynamicType();
    }

    drawLine(start: Vec2, end: Vec2) {
        /* if (!this.checkCanDraw()) {
            console.log("Can't draw");
            return;
        } */
        console.log("Can draw");
        this.line.moveTo(start.x, start.y); // Move to start point
        this.line.lineTo(end.x, end.y); // Draw line to end point
        this.line.stroke(); // Apply the stroke to draw the line

        this.createPolygon(this.startPoint, this.endPoint);
        this.startPoint = this.endPoint;
    }
    checkCanDraw(): boolean {
        if (this.endDraw) { console.log("End Draw"); return false; }
        if (!this.line) {
            console.error("line component is not assigned.");
            return false;
        }
        if (this.checkRaycast()) {
            console.log("Have obstacle");
            return false;
        }
        // if(Vec2.strictEquals(this.startPoint, this.endPoint)) return false;

        return true;
    }
    checkRaycast(): boolean {
        let isCollision = false;
        // console.log("Begin check");
        const results = PhysicsSystem2D.instance.raycast(
            this.startPoint,
            this.endPoint,
            ERaycast2DType.All
        );
        if (results.length <= 0) console.log("return");
        results.forEach((result) => {
            const collider = result.collider;
            if (collider.node.layer == this.node.layer) {
                console.log(collider.node.name);
                isCollision = true;
            }
            // console.log(`Hit collider on layer: ${collider.node.layer}`);
        });
        if (isCollision) return true;
        return false;
    }

    private createPolygon(startPoint: Vec2, endPoint: Vec2): void {
        const vec = new Vec2(
            endPoint.x - startPoint.x,
            endPoint.y - startPoint.y
        ).normalize();
        vec.rotate(Math.PI / 2);

        const offset = 2.5;

        const listPoint = [
            new Vec2(
                startPoint.x - vec.x * offset,
                startPoint.y - vec.y * offset
            ),
            new Vec2(endPoint.x - vec.x * offset, endPoint.y - vec.y * offset),
            new Vec2(endPoint.x + vec.x * offset, endPoint.y + vec.y * offset),
            new Vec2(
                startPoint.x + vec.x * offset,
                startPoint.y + vec.y * offset
            ),
        ];

        const collider = this.line.node.addComponent(PolygonCollider2D);
        collider.group = 2;
        collider.points = listPoint;
        collider.density = 100;
        collider.apply();
    }

    turnDynamicType() {
        for (let i = 0; i < this.listRigibody.length; i++) {
            this.listRigibody[i].type = ERigidBody2DType.Dynamic;
        }
    }
}
