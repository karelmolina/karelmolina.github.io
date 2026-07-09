(function () {
  'use strict';

  const CONTAINER_ID = 'live2d-container';
  const CANVAS_ID = 'live2d-canvas';
  const MODEL_PATH = 'assets/live2d/wanko/wanko_touch.model3.json';

  // Motion groups available in the model.
  const MOTION_GROUPS = {
    idle: 'Idle',
    tap: 'Tap',
    flick: 'Flick',
    flick3: 'Flick3',
    flickUp: 'FlickUp',
    flickLeft: 'FlickLeft',
    shake: 'Shake'
  };

  // Interactive groups to pick from on click/tap.
  const INTERACTIVE_GROUPS = [
    MOTION_GROUPS.tap,
    MOTION_GROUPS.flick,
    MOTION_GROUPS.flick3,
    MOTION_GROUPS.flickUp,
    MOTION_GROUPS.flickLeft,
    MOTION_GROUPS.shake
  ];

  const container = document.getElementById(CONTAINER_ID);
  const canvas = document.getElementById(CANVAS_ID);

  if (!container || !canvas) {
    console.warn('[Live2D] Container or canvas not found.');
    return;
  }

  // Make PIXI globally available so the plugin can hook into the ticker.
  window.PIXI = PIXI;

  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
  }

  resizeCanvas();

  const app = new PIXI.Application({
    view: canvas,
    width: canvas.width,
    height: canvas.height,
    transparent: true,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1
  });

  function fitModel(model) {
    const bounds = model.internalModel?.drawableBounds || {
      x: 0,
      y: 0,
      width: model.width,
      height: model.height
    };

    const contentWidth = bounds.width || 1;
    const contentHeight = bounds.height || 1;
    const scaleX = app.screen.width / contentWidth;
    const scaleY = app.screen.height / contentHeight;
    const scale = Math.min(scaleX, scaleY) * 0.85;

    model.scale.set(scale);
    model.anchor.set(0.5, 0.5);
    model.x = app.screen.width / 2;
    model.y = app.screen.height / 2 + contentHeight * scale * 0.08;
  }

  function startIdleMotion(model) {
    try {
      model.internalModel?.motionManager?.startRandomMotion?.(MOTION_GROUPS.idle, 0);
    } catch (err) {
      console.warn('[Live2D] Could not start idle motion:', err);
    }
  }

  function playRandomInteractiveMotion(model) {
    const group = INTERACTIVE_GROUPS[Math.floor(Math.random() * INTERACTIVE_GROUPS.length)];
    try {
      model.motion(group);
    } catch (err) {
      console.warn('[Live2D] Could not play interactive motion:', group, err);
    }
  }

  function trackPointer(model, event) {
    const core = model.internalModel?.coreModel;
    if (!core || typeof core.setParameterValueById !== 'function') return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize distance from the model center to the pointer.
    // Divide by the largest viewport dimension so the effect is subtle and stable.
    const maxDistance = Math.max(window.innerWidth, window.innerHeight);
    const lookX = (event.clientX - centerX) / maxDistance * 4;
    const lookY = (centerY - event.clientY) / maxDistance * 4;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    core.setParameterValueById('PARAM_ANGLE_X', clamp(lookX * 30, -30, 30));
    core.setParameterValueById('PARAM_ANGLE_Y', clamp(lookY * 30, -30, 30));
    core.setParameterValueById('PARAM_ANGLE_Z', clamp(lookX * 10, -10, 10));
    core.setParameterValueById('PARAM_EYE_BALL_X', clamp(lookX, -1, 1));
    core.setParameterValueById('PARAM_EYE_BALL_Y', clamp(lookY, -1, 1));
  }

  function resetTracking(model) {
    const core = model.internalModel?.coreModel;
    if (!core || typeof core.setParameterValueById !== 'function') return;

    core.setParameterValueById('PARAM_ANGLE_X', 0);
    core.setParameterValueById('PARAM_ANGLE_Y', 0);
    core.setParameterValueById('PARAM_ANGLE_Z', 0);
    core.setParameterValueById('PARAM_EYE_BALL_X', 0);
    core.setParameterValueById('PARAM_EYE_BALL_Y', 0);
  }

  PIXI.live2d.Live2DModel.from(MODEL_PATH, {
    autoInteract: false,
    idleMotionGroup: MOTION_GROUPS.idle
  })
    .then((model) => {
      app.stage.addChild(model);
      fitModel(model);

      // Enable interaction (PixiJS v6 API).
      model.interactive = true;
      model.buttonMode = true;
      model.cursor = 'pointer';

      // Play idle motion on loop.
      startIdleMotion(model);
      app.ticker.add(() => {
        const manager = model.internalModel?.motionManager;
        if (manager && manager.isFinished && manager.isFinished()) {
          startIdleMotion(model);
        }
      });

      // Mouse tracking across the whole page.
      window.addEventListener('pointermove', (event) => {
        trackPointer(model, event);
      });

      // Click / tap interaction.
      model.on('pointerdown', () => {
        playRandomInteractiveMotion(model);
      });

      // Resize handling.
      window.addEventListener('resize', () => {
        resizeCanvas();
        app.renderer.resize(canvas.width, canvas.height);
        fitModel(model);
      });

      console.log('[Live2D] Model loaded successfully.');
    })
    .catch((error) => {
      console.error('[Live2D] Failed to load model:', error);
    });
})();
