(() => {
  let yOffset = 0; // window.scrollY(스크롤한 값) 대신 쓸 수 있는 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이의 합
  let currentScene = 0; // 현재 활성화된 scene의 번호
  let enterNewScene = false; // 새로운 scene이 시작되는 순간 true -> 즉, currentScene이 바뀌는 순간

  const sceneInfo = [
    {
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
      type: "normal",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
      },
      values: {},
    },
    {
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
      },
      values: {},
    },
  ];

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
          objs.messageA.style.transform = `translate3d(0,${calcValues(
            values.messageA_translateY_in,
            currentYOffset
          )},0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageA_opacity_out,
            currentYOffset
          );
          objs.messageA.style.transform = `translate3d(0,${calcValues(
            values.messageA_translateY_out,
            currentYOffset
          )},0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_in,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0,${calcValues(
            values.messageB_translateY_in,
            currentYOffset
          )},0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageB_opacity_out,
            currentYOffset
          );
          objs.messageB.style.transform = `translate3d(0,${calcValues(
            values.messageB_translateY_out,
            currentYOffset
          )},0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_in,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0,${calcValues(
            values.messageC_translateY_in,
            currentYOffset
          )},0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageC_opacity_out,
            currentYOffset
          );
          objs.messageC.style.transform = `translate3d(0,${calcValues(
            values.messageC_translateY_out,
            currentYOffset
          )},0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_in,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0,${calcValues(
            values.messageD_translateY_in,
            currentYOffset
          )},0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(
            values.messageD_opacity_out,
            currentYOffset
          );
          objs.messageD.style.transform = `translate3d(0,${calcValues(
            values.messageD_translateY_out,
            currentYOffset
          )},0)`;
        }

        break;

      case 1:
        break;

      case 2:
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
