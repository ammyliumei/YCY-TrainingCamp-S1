class BrakeBanner {
  constructor(selector) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xffffff,
      resizeTo: window,
    });
    document.querySelector(selector).appendChild(this.app.view);
    this.stage = this.app.stage;
    this.loader = new PIXI.Loader();

    this.loader
      .add("btn_circle.png", "images/btn_circle.png")
      .add("brake_bike.png", "images/brake_bike.png")
      .add("brake_handlerbar.png", "images/brake_handlerbar.png")
      .add("brake_lever.png", "images/brake_lever.png")
      .add("btn.png", "images/btn.png");
    this.loader.load();
    this.loader.onComplete.add(() => {
      console.log(this.loader.resources);
      this.show();
    });
  }
  show() {
    this.showBrake();
    this.showPoint();
    this.showBtn();
  }
  showPoint() {
    // 1.创建粒子
    let pointContainer = new PIXI.Container();
    pointContainer.rotation = (35 * Math.PI) / 180;
    pointContainer.pivot.set(window.innerWidth / 2, window.innerHeight / 2);
    pointContainer.x = window.innerWidth / 2;
    pointContainer.y = window.innerHeight / 2;
    this.stage.addChild(pointContainer);
    let particles = [];
    let colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x000000];
    for (let i = 0; i <= 20; i++) {
      let rectangle = new PIXI.Graphics();
      rectangle.beginFill(colors[Math.floor(Math.random() * colors.length)]);

      rectangle.drawCircle(0, 0, 6);
      rectangle.endFill();
      pointContainer.addChild(rectangle);
      let x = Math.random() * window.innerWidth;
      let y = Math.random() * window.innerHeight;
      rectangle.x = x;
      rectangle.y = y;
      particles.push({ gr: rectangle, sx: x, sy: y });
    }
    console.log(particles);
    let speed = 10;

    function loop() {
      speed += 0.5;
      speed = Math.min(20, speed);
      particles.forEach((pItem) => {
        pItem.gr.y += speed;
        if (speed >= 20) {
          pItem.gr.scale.set(0.03, 40);
        }
        if (pItem.gr.y >= window.innerHeight) {
          pItem.gr.y = pItem.sy;
        }
      });
    }
    function start() {
      gsap.ticker.add(loop);
    }
    function pause() {
      gsap.ticker.remove(loop);
      particles.forEach((pItem) => {
        pItem.gr.scale.set(1, 1);
        gsap.to(pItem.gr, {
          duration: 0.6,
          x: pItem.sx,
          y: pItem.sy,
          ease: "elastic.out",
        });
      });
    }
    start();
    this.pause = pause;
    this.start = start;
  }
  showBtn() {
    let actionButton = new PIXI.Container();
    actionButton.x = 900;
    actionButton.y = 800;
    actionButton.scale.set(2, 2);
    this.bikeContainer.addChild(actionButton);
    let btn = new PIXI.Sprite(this.loader.resources["btn.png"].texture);
    let btn_circle = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );
    let btn_circle2 = new PIXI.Sprite(
      this.loader.resources["btn_circle.png"].texture
    );

    actionButton.addChild(btn, btn_circle, btn_circle2);
    btn.pivot.x = btn.width / 2;
    btn.pivot.y = btn.width / 2;
    btn_circle.anchor.x = 0.5;
    btn_circle.anchor.y = 0.5;
    btn_circle2.scale.set(0.8, 0.8);
    btn_circle2.anchor.set(0.5, 0.5);
    gsap.to(btn_circle2.scale, { duration: 1, x: 1.2, y: 1.2, repeat: -1 });
    gsap.to(btn_circle2, { duration: 1, alpha: 0, repeat: -1 });
    actionButton.interactive = true;
    actionButton.buttonMode = true;
    actionButton.on("mousedown", () => {
      gsap.to(this.brake_lever, {
        duration: 0.6,
        rotation: (Math.PI / 180) * -30,
      });
      this.pause();
      // this.brake_lever.rotation = (Math.PI / 180) * -30;
    });
    actionButton.on("mouseup", () => {
      gsap.to(this.brake_lever, {
        duration: 0.6,
        rotation: 0,
      });
      this.start();
      // this.brake_lever.rotation = 0;
    });
    this.actionButton = actionButton;
  }
  showBrake() {
    const bikeContainer = new PIXI.Container();
    bikeContainer.scale.x = bikeContainer.scale.y = 0.3;
    this.stage.addChild(bikeContainer);
    let brake_bike = new PIXI.Sprite(
      this.loader.resources["brake_bike.png"].texture
    );

    let brake_handlerbar = new PIXI.Sprite(
      this.loader.resources["brake_handlerbar.png"].texture
    );
    let brake_lever = new PIXI.Sprite(
      this.loader.resources["brake_lever.png"].texture
    );
    brake_lever.pivot.x = 455;
    brake_lever.pivot.y = 455;
    brake_lever.x = 722;
    brake_lever.y = 900;
    this.brake_lever = brake_lever;
    this.bikeContainer = bikeContainer;
    bikeContainer.addChild(brake_bike, brake_lever, brake_handlerbar);
    let resize = () => {
      bikeContainer.x = window.innerWidth - bikeContainer.width;
      bikeContainer.y = window.innerHeight - bikeContainer.height;
    };
    window.addEventListener("resize", resize);
    resize();
  }
}
