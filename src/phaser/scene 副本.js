import Phaser from "phaser";
import logoImg from "../assets/logo.png";
import roleImg from "../assets/women.png";
import diceImg from "../assets/dice/dice-albedo.png";

const createDice = (x, y, scene, duration = 1000) => {

  let diceIsRolling = false;

  const dice = scene.add.mesh(x, y, "dice-albedo");
  const shadowFX = dice.postFX.addShadow(0, 0, 0.006, 2, 0x111111, 10, .8);

  dice.addVerticesFromObj("dice-obj", 0.25);
  dice.panZ(6);

  dice.modelRotation.x = Phaser.Math.DegToRad(0);
  dice.modelRotation.y = Phaser.Math.DegToRad(-90);

  return (callback) => {
    if (!diceIsRolling) {
      diceIsRolling = true;
      const diceRoll = Phaser.Math.Between(1, 6);

      // Shadow
      scene.add.tween({
        targets: shadowFX,
        x: -8,
        y: 10,
        duration: duration - 250,
        ease: "Sine.easeInOut",
        yoyo: true,
      });

      scene.add.tween({
        targets: dice,
        from: 0,
        to: 1,
        duration: duration,
        onUpdate: () => {
          dice.modelRotation.x -= .02;
          dice.modelRotation.y -= .08;
        },
        onComplete: () => {
          switch (diceRoll) {
            case 1:
              dice.modelRotation.x = Phaser.Math.DegToRad(0);
              dice.modelRotation.y = Phaser.Math.DegToRad(-90);
              break;
            case 2:
              dice.modelRotation.x = Phaser.Math.DegToRad(90);
              dice.modelRotation.y = Phaser.Math.DegToRad(0);
              break;
            case 3:
              dice.modelRotation.x = Phaser.Math.DegToRad(180);
              dice.modelRotation.y = Phaser.Math.DegToRad(0);
              break;
            case 4:
              dice.modelRotation.x = Phaser.Math.DegToRad(180);
              dice.modelRotation.y = Phaser.Math.DegToRad(180);
              break;
            case 5:
              dice.modelRotation.x = Phaser.Math.DegToRad(-90);
              dice.modelRotation.y = Phaser.Math.DegToRad(0);
              break;
            case 6:
              dice.modelRotation.x = Phaser.Math.DegToRad(0);
              dice.modelRotation.y = Phaser.Math.DegToRad(90);
              break;
          }
        },
        ease: "Sine.easeInOut",
      });

      // Intro dice
      scene.add.tween({
        targets: [dice],
        scale: 1.2,
        duration: duration - 200,
        yoyo: true,
        ease: Phaser.Math.Easing.Quadratic.InOut,
        onComplete: () => {
          dice.scale = 1;
          if (callback !== undefined) {
            diceIsRolling = false;
            callback(diceRoll);
          }
        }
      });
    } else {
      console.log("Is rolling");
    }
  }

}

let role

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    // this.load.image("logo", logoImg);
    this.load.image('role', roleImg);
    this.load.image("dice-albedo", diceImg);
    this.load.obj("dice-obj", './public/dice/dice.obj');
  }
  create() {
    // const logo = this.add.image(400, 150, "logo");

    // this.tweens.add({
    //   targets: logo,
    //   y: 450,
    //   duration: 2000,
    //   ease: "Power2",
    //   yoyo: true,
    //   loop: -1
    // });

    const Role = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

        function Role(scene, x, y) {
          Phaser.GameObjects.Image.call(this, scene)

          this.setTexture('role');
          this.setPosition(x * 16, y * 16);
          this.setOrigin(0);

          this.total = 0;

          scene.children.add(this);
        }

    });
    role = new Role(this, 3, 4);

    const dice = createDice(this.scale.width / 2, this.scale.height / 2, this, 1000);
    // Text object to show the dice value
    const textDiceValue = this.add.text(this.scale.width / 2, this.scale.height / 2, '0', { fontFamily: 'Arial Black', fontSize: 74, color: '#c51b7d' });
    textDiceValue.setStroke('#de77ae', 16)
      .setScale(0);

    this.input.on('pointerdown', () => {
      dice((diceValue) => {
      console.log('Dice value ', diceValue,this,role);

          // 创建动画
  //   this.tweens.add({
  //     targets: role,
  //     x: role.x + diceValue * 300, // 目标x坐标
  //     duration: 2000, // 持续时间（毫秒）
  //     ease: 'Power1', // 缓动函数
  //     onUpdate: function(){
  //       console.log(document.body.clientWidth,'==> document.body.clientWidth',role.x )
  //       if(role.x >= document.body.clientWidth - 1500){ 
  //          // 只有当图片x轴坐标大于等于目标值时才下移
  //          role.y += 30;
  //          role.x = document.body.clientWidth - 1550;
  //          console.log(role.y,'==> role.y')
  //       }
  //    } 
  // });
       
      // 人物移动动画
      // const endX = role.x + diceValue * 300;
      // const run = setInterval(()=>{
      //   if(role.x <= endX){
      //     role.x += 10;
      //   }else{
      //     role.x = endX;
      //     console.log(role,'==> role')
      //     clearInterval(run)
      //   }
      // },16.5)

        // Show the dice value
        textDiceValue.text = diceValue;
        textDiceValue.setOrigin(0.5);
        textDiceValue.setPosition(this.scale.width / 2, this.scale.height / 2);

        this.add.tween({
          targets: textDiceValue,
          scale: 1,
          duration: 1000,
          ease: Phaser.Math.Easing.Bounce.Out,
          onComplete: () => {
            this.add.tween({
              targets: [textDiceValue],
              scale: 0,
              delay: 1000,
              duration: 1000,
              ease: Phaser.Math.Easing.Bounce.Out,
            });
          }
        });
      });
    });

    // Text information. Is not important
    const rect = this.add.rectangle(0, this.scale.height - 50, this.scale.width, 50, 0x000000, 1)
      .setAlpha(.9)
      .setOrigin(0);
    this.add.text(rect.getCenter().x, rect.getCenter().y, 'Click to roll dice', {
      font: '20px Courier',
      fill: '#00ff00',
    }).setOrigin(0.5);

  }
}

export default playGame;
