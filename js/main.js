(() => {
  let yOffset = 0; // window.scrollY(스크롤한 값) 대신 쓸 수 있는 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화된 scene의 번호
  let enterNewScene = false; // 새로운 scene이 시작되는 순간 true -> 즉, currentScene이 바뀌는 순간

  const sceneInfo = [
    {
      // section 0
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        // opacity in
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

        // translateY in
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],

        // opacity out
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],

        // translateY out
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // section 1
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // section 2
      type: "sticky",
      heightNum: 2,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        canvasCaption: document.querySelector(".project-caption"),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        imagesPath: ["./images/pfy.jpg"],
        images: [],

        pjMessageA: document.querySelector("#scroll-section-2 .project-box.a"),
        pjMessageB: document.querySelector("#scroll-section-2 .project-box.b"),
        pjMessageC: document.querySelector("#scroll-section-2 .project-box.c"),
        pjMessageD: document.querySelector("#scroll-section-2 .project-box.d"),
      },
      values: {
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        rectStartY: 0,

        // opacity in
        pjMessageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        pjMessageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        pjMessageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        pjMessageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

        // translate in
        pjMessageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        pjMessageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        pjMessageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        pjMessageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
      },
    },
    {
      // section 3
      type: "sticky",
      heightNum: 3.5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
      values: {},
    },
    {
      type: "normal",
      heightNum: 4,
      scrollHeight: 0,
      objs: {},
    },
  ];

  function setCanvasImages() {
    let imgElem3;
    for (let i = 0; i < sceneInfo[2].objs.imagesPath.length; i++) {
      imgElem3 = new Image();
      imgElem3.src = sceneInfo[2].objs.imagesPath[i];
      sceneInfo[2].objs.images.push(imgElem3);
    }
  }
  setCanvasImages();

  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    // setLayout에서도 현재 스크롤 위치에 맞춰 currentScene을 세팅하기
    yOffset = window.scrollY;
    let totalScorllHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScorllHeight += sceneInfo[i].scrollHeight;
      if (totalScorllHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show-scene-${currentScene}`);
  }

  function calcValues(values, currentYOffset) {
    // 현재 scene에서 scroll된 범위를 비율로 구하기
    let rv;

    const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 scene의 scrollHeight(ex, 4300px)
    const scrollRatio = currentYOffset / scrollHeight; // 현재 scene에서 얼만큼 scroll 했는지 비율

    if (values.length === 3) {
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
      // 부분 스크롤 영역 비율 구하는 식
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
      // 전체 범위에서 지금까지 스크롤된 비율 구하는 식
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;

    const currentYOffset = yOffset - prevScrollHeight; // 현재 scene에서 scroll된 높이를 나타내는 값
    const scrollHeight = sceneInfo[currentScene].scrollHeight; // 현재 scene의 scrollHeight
    const scrollRatio = currentYOffset / scrollHeight; // 현재 scene에서 얼만큼 scroll 했는지 비율

    switch (currentScene) {
      case 0:
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_in,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )}%, 0)`;
        }

        break;

      case 1:
        // section2

        // case 2의 캔버스 미리 그려주기!
        if (scrollRatio > 0.1) {
          const objs = sceneInfo[2].objs;
          const values = sceneInfo[2].values;
          // {} <- 블럭 안에 들어갔기 때문에 다시 선언

          const widthRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;

          let canvasScaleRatio;
          if (widthRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = widthRatio;
          }

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.fillStyle = "#100f10";
          objs.context.drawImage(objs.images[0], 0, 0);

          const recalculateInnerWidth =
            document.body.offsetWidth / canvasScaleRatio;
          const recalculateInnerHeight = window.innerHeight / canvasScaleRatio;
          const whiteRectWidth = recalculateInnerWidth * 0.15;

          values.rect1X[0] = (objs.canvas.width - recalculateInnerWidth) / 2; // 출발 값
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // 애니메이션이 끝날 때의 최종 값
          values.rect2X[0] =
            values.rect1X[0] + recalculateInnerWidth - whiteRectWidth + 2;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          objs.context.fillRect(
            parseInt(values.rect1X[0]), // x축
            0, // y축
            parseInt(whiteRectWidth), // width
            objs.canvas.height // height
          );
          objs.context.fillRect(
            parseInt(values.rect2X[0]), // x축
            0, // y축
            parseInt(whiteRectWidth), // width
            objs.canvas.height // height
          );
        }

        break;

      case 2:
        // section 2

        const widthRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;

        let canvasScaleRatio;
        if (widthRatio <= heightRatio) {
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = widthRatio;
        }

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.fillStyle = "#100f10";
        objs.context.drawImage(objs.images[0], 0, 0);

        const recalculateInnerWidth =
          document.body.offsetWidth / canvasScaleRatio;
        const recalculateInnerHeight = window.innerHeight / canvasScaleRatio;

        const whiteRectWidth = recalculateInnerWidth * 0.15;

        values.rect1X[0] = (objs.canvas.width - recalculateInnerWidth) / 2; // 출발 값
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // 애니메이션이 끝날 때의 최종 값
        values.rect2X[0] =
          values.rect1X[0] + recalculateInnerWidth - whiteRectWidth + 2;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        if (!values.rectStartY) {
          values.rectStartY =
            objs.canvas.offsetTop +
            (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
          values.rect1X[2].start = window.innerHeight / 5 / scrollHeight;
          values.rect2X[2].start = window.innerHeight / 5 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight; // 왼쪽
          values.rect2X[2].end = values.rectStartY / scrollHeight; // 오른쪽
        }
        objs.context.fillRect(
          parseInt(calcValues(values.rect1X, currentYOffset)), // x축
          0, // y축
          parseInt(whiteRectWidth), // width
          objs.canvas.height // height
        );
        objs.context.fillRect(
          parseInt(calcValues(values.rect2X, currentYOffset)), // x축
          0, // y축
          parseInt(whiteRectWidth), // width
          objs.canvas.height // height
        );

        break;

      case 3:
        break;
    }
  }

  function scrollLoop() {
    // currentScene의 번호 결정
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    // console.log(currentScene);

    playAnimation();
    // 스크롤 번호에 따른 animation
  }

  window.addEventListener("scroll", () => {
    yOffset = window.scrollY;
    scrollLoop();
  });
  window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
})();
