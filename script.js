(function () {
    var canvas = $('#canvas');

    if (!canvas[0].getContext) {
        $("#error").show();
        return false;
    }

    var width = canvas.width();
    var height = canvas.height();

    canvas.attr("width", width);
    canvas.attr("height", height);

    var opts = {
        seed: {
            x: width / 2 - 20,
            color: "rgb(190, 26, 37)",
            scale: 2
        },
        branch: [
            [535, 680, 570, 250, 500, 200, 30, 100, [
                [540, 500, 455, 417, 340, 400, 13, 100, [
                    [450, 435, 434, 430, 394, 395, 2, 40]
                ]],
                [550, 445, 600, 356, 680, 345, 12, 100, [
                    [578, 400, 648, 409, 661, 426, 3, 80]
                ]],
                [539, 281, 537, 248, 534, 217, 3, 40],
                [546, 397, 413, 247, 328, 244, 9, 80, [
                    [427, 286, 383, 253, 371, 205, 2, 40],
                    [498, 345, 435, 315, 395, 330, 4, 60]
                ]],
                [546, 357, 608, 252, 678, 221, 6, 100, [
                    [590, 293, 646, 277, 648, 271, 2, 80]
                ]]
            ]]
        ],
        bloom: {
            num: 700,
            width: 1080,
            height: 650,
        },
        footer: {
            width: 1200,
            height: 5,
            speed: 10,
        }
    }

    var tree = new Tree(canvas[0], width, height, opts);
    var seed = tree.seed;
    var foot = tree.footer;
    var hold = 1;

   /* canvas.click(function (e) {
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        if (seed.hover(x, y)) {
            hold = 0;
            canvas.unbind("click");
            canvas.unbind("mousemove");
            canvas.removeClass('hand');
            
        }// 🔊 Reproducir el audio cuando se toca el corazón
const media = document.getElementById("media");
if (media.paused) {
  media.play().then(() => {
    console.log("🎵 Música reproduciéndose desde el corazón...");
  }).catch(err => {
    console.log("❌ El navegador bloqueó el audio:", err);
  });
}
        
    }).mousemove(function (e) {
        var offset = canvas.offset(), x, y;
        x = e.pageX - offset.left;
        y = e.pageY - offset.top;
        canvas.toggleClass('hand', seed.hover(x, y));
    });*/

    canvas.click(function (e) {
    var offset = canvas.offset(), x, y;
    x = e.pageX - offset.left;
    y = e.pageY - offset.top;

    if (seed.hover(x, y)) {
        hold = 0;
        canvas.unbind("click");
        canvas.unbind("mousemove");
        canvas.removeClass('hand');

        // 🔊 Reproducir el audio desde el corazón (semilla)
        const media = document.getElementById("media");

        let fakeBtn = document.createElement("button");
        fakeBtn.style.display = "none";
        document.body.appendChild(fakeBtn);

        fakeBtn.addEventListener("click", () => {
            media.play().then(() => {
                console.log("✅ Música reproducida desde el corazón");
            }).catch(err => {
                console.log("❌ Error al reproducir:", err);
            });
        });

        fakeBtn.click();
        fakeBtn.remove(); // eliminar el botón oculto
    }
}).mousemove(function (e) {
    var offset = canvas.offset(), x, y;
    x = e.pageX - offset.left;
    y = e.pageY - offset.top;
    canvas.toggleClass('hand', seed.hover(x, y));
});

    var seedAnimate = eval(Jscex.compile("async", function () {
        seed.draw();
        while (hold) {
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canScale()) {
            seed.scale(0.95);
            $await(Jscex.Async.sleep(10));
        }
        while (seed.canMove()) {
            seed.move(0, 2);
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
    }));

    var growAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.grow();
            $await(Jscex.Async.sleep(10));
        } while (tree.canGrow());
    }));

    var flowAnimate = eval(Jscex.compile("async", function () {
        do {
            tree.flower(2);
            $await(Jscex.Async.sleep(10));
        } while (tree.canFlower());
    }));

    var moveAnimate = eval(Jscex.compile("async", function () {
        tree.snapshot("p1", 240, 0, 610, 680);
        while (tree.move("p1", 500, 0)) {
            foot.draw();
            $await(Jscex.Async.sleep(10));
        }
        foot.draw();
        tree.snapshot("p2", 500, 0, 610, 680);

        canvas.parent().css("background", "url(" + tree.toDataURL('image/png') + ")");
        canvas.css("background", "#F5E8DC");
        $await(Jscex.Async.sleep(300));
        canvas.css("background", "none");
    }));

    var jumpAnimate = eval(Jscex.compile("async", function () {
        var ctx = tree.ctx;
        while (true) {
            tree.ctx.clearRect(0, 0, width, height);
            tree.jump();
            foot.draw();
            $await(Jscex.Async.sleep(25));
        }
    }));

    var textAnimate = eval(Jscex.compile("async", function () {
        var together = new Date();
        together.setFullYear(2024, 3, 20);
        together.setHours(0);
        together.setMinutes(0);
        together.setSeconds(0);
        together.setMilliseconds(0);

        $("#code").show().typewriter();
        $("#clock-box").fadeIn(500);
        while (true) {
            timeElapse(together);
            $await(Jscex.Async.sleep(1000));
        }
    }));

    var runAsync = eval(Jscex.compile("async", function () {
        $await(seedAnimate());
        $await(growAnimate());
        $await(flowAnimate());
        $await(moveAnimate());

        textAnimate().start();

        $await(jumpAnimate());
    }));

    runAsync().start();
})();

/*document.addEventListener("DOMContentLoaded", function () {
  const media = document.getElementById("media");

  function iniciarAudio() {
    media.play().then(() => {
      console.log("🎵 Música reproduciéndose...");
    }).catch(err => {
      console.log("❌ El navegador bloqueó el audio:", err);
    });

    // Eliminar eventos después del primer intento
    document.removeEventListener("click", iniciarAudio);
    document.removeEventListener("touchstart", iniciarAudio);
  }

  // Escucha el primer clic o toque en la pantalla
  document.addEventListener("click", iniciarAudio);
  document.addEventListener("touchstart", iniciarAudio);
});*/
document.addEventListener("DOMContentLoaded", function () {
  const media = document.getElementById("media");

  function iniciarAudio() {
    if (media.paused) {
      media.play().then(() => {
        console.log("🎵 Música reproduciéndose...");
      }).catch(err => {
        console.log("❌ El navegador bloqueó el audio:", err);
      });
    }

    document.removeEventListener("click", iniciarAudio);
    document.removeEventListener("touchstart", iniciarAudio);
  }

  document.addEventListener("click", iniciarAudio);
  document.addEventListener("touchstart", iniciarAudio);
});

//funcion para toques en la pantalla y aparesca un mensaje en la pantalla
/*document.addEventListener("click", function (e) {
  crearTeAmo(e.clientX, e.clientY);
});

document.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  crearTeAmo(touch.clientX, touch.clientY);
});

function crearTeAmo(x, y) {
  const span = document.createElement("span");
  span.className = "te-amo";
  span.textContent = "Te amo ❤️";
  span.style.left = x + "px";
  span.style.top = y + "px";
  document.body.appendChild(span);

  setTimeout(() => {
    span.remove();
  }, 1200);
}*/
const loveMessages = [
  "Te amo",
  "Eres mi vida",
  "Gracias por existir",
  "Siempre tú",
  "Mi corazón es tuyo",
  "Tú y yo por siempre",
  "Eres mi paz",
  "Mi persona favorita",
  "Contigo, todo",
  "Te elijo cada día"
];

let ultimaInteraccionFueTouch = false;

document.addEventListener("touchstart", function (e) {
  ultimaInteraccionFueTouch = true;
  const touch = e.touches[0];
  crearTeAmo(touch.clientX, touch.clientY);
});

document.addEventListener("click", function (e) {
  if (ultimaInteraccionFueTouch) {
    ultimaInteraccionFueTouch = false;
    return; // Evita doble ejecución
  }
  crearTeAmo(e.clientX, e.clientY);
});

function crearTeAmo(x, y) {
  const loveMessages = [
    "Te amo",
    "Eres mi vida",
    "Gracias por existir",
    "Siempre tú",
    "Mi corazón es tuyo",
    "Tú y yo por siempre",
    "Eres mi paz",
    "Mi persona favorita",
    "Contigo, todo",
    "Te elijo cada día"
  ];

  const mensajeAleatorio = loveMessages[Math.floor(Math.random() * loveMessages.length)];

  const span = document.createElement("span");
  span.className = "te-amo";
  span.textContent = mensajeAleatorio;
  span.style.left = x + "px";
  span.style.top = y + "px";
  document.body.appendChild(span);

    setTimeout(() => {
  span.classList.add("desaparecer");
  setTimeout(() => {
    span.remove();
  }, 1000); // Espera a que termine la animación CSS antes de removerlo
}, 2000); // ⏳ Tiempo visible antes de empezar a desvanecerse (2 segundos
}
