/**
 * scene.js — Ultra-detailed procedural 3D desk on rotating platform
 * Three.js r128 | No external models needed
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  //  RENDERER
  // ─────────────────────────────────────────────────────────────
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  // ─────────────────────────────────────────────────────────────
  //  SCENE + CAMERA
  // ─────────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070709);
  scene.fog = new THREE.FogExp2(0x070709, 0.055);

  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.05, 100);
  camera.position.set(0, 4.5, 9);
  camera.lookAt(0, 1.2, 0);

  // ─────────────────────────────────────────────────────────────
  //  LIGHTS
  // ─────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x0d0d1a, 3));

  // Key – warm overhead
  const key = new THREE.DirectionalLight(0xfff8e8, 4);
  key.position.set(4, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far = 40;
  key.shadow.camera.left = -7; key.shadow.camera.right = 7;
  key.shadow.camera.top = 7;  key.shadow.camera.bottom = -7;
  key.shadow.bias = -0.0005;
  key.shadow.radius = 3;
  scene.add(key);

  // Fill – cool blue
  const fill = new THREE.DirectionalLight(0x4060ff, 1.5);
  fill.position.set(-6, 4, -4);
  scene.add(fill);

  // Rim
  const rim = new THREE.DirectionalLight(0x00aaff, 0.8);
  rim.position.set(0, 6, -8);
  scene.add(rim);

  // Monitor glow (green-teal)
  const monGlow = new THREE.PointLight(0x69ffb4, 6, 3.5);
  monGlow.position.set(0, 2.4, 1.0);
  scene.add(monGlow);

  // Lamp (warm)
  const lampPt = new THREE.PointLight(0xffe0a0, 12, 4.5);
  lampPt.castShadow = true;
  lampPt.shadow.mapSize.set(512, 512);
  lampPt.position.set(2.2, 3.1, 0.2);
  scene.add(lampPt);

  // Accent under-glow (platform)
  const platGlow = new THREE.PointLight(0xe8c547, 3, 3);
  platGlow.position.set(0, 0.15, 0);
  scene.add(platGlow);

  // ─────────────────────────────────────────────────────────────
  //  CUSTOM SHADER – WOOD GRAIN
  // ─────────────────────────────────────────────────────────────
  const woodShader = new THREE.ShaderMaterial({
    uniforms: {
      uTime:      { value: 0 },
      uBase:      { value: new THREE.Color(0x6b3f1a) },
      uDark:      { value: new THREE.Color(0x3d1f08) },
      uLight:     { value: new THREE.Color(0x9b6235) },
    },
    vertexShader: `
      varying vec3 vPos;
      varying vec3 vNorm;
      void main(){
        vPos  = position;
        vNorm = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3  uBase, uDark, uLight;
      varying vec3 vPos;
      varying vec3 vNorm;

      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p); vec2 f=fract(p);
        f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                   mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }

      void main(){
        vec2 uv = vPos.xz * 2.0;
        float grain = noise(uv*8.) * .3 + noise(uv*24.)*.1;
        float ring  = sin(length(uv*1.5)*12. + noise(uv*3.)*4.) * .5 + .5;
        float t = ring*.7 + grain*.3;
        vec3 col = mix(uDark, uLight, t);
        col = mix(col, uBase, .4);

        // diffuse shading
        float diff = max(dot(normalize(vNorm), normalize(vec3(.5,1.,.3))), .0) * .4 + .6;
        col *= diff;

        gl_FragColor = vec4(col, 1.);
      }
    `,
    side: THREE.FrontSide,
  });

  // ─────────────────────────────────────────────────────────────
  //  CUSTOM SHADER – SCREEN CONTENT
  // ─────────────────────────────────────────────────────────────
  const screenShader = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;

      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p){
        vec2 i=floor(p*8.); vec2 f=fract(p*8.);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
                   mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }

      void main(){
        vec2 uv = vUv;
        // Dark background
        vec3 col = vec3(.01, .03, .02);

        // Grid lines
        float gx = step(.97, fract(uv.x*20.));
        float gy = step(.97, fract(uv.y*12.));
        col += vec3(0.,.08,.05)*(gx+gy);

        // Scan line sweep
        float scan = step(.995, fract(uv.y*80. - uTime*.5)) * .15;
        col += vec3(0.,scan*.5,scan*.3);

        // Glowing green text rows
        for(int i=0;i<8;i++){
          float y = .1 + float(i)*.1;
          float bar = smoothstep(.012,.0,abs(uv.y - y));
          float w = .3 + noise(vec2(float(i),uTime*.1))*.5;
          float x = smoothstep(.0,.01,uv.x)*smoothstep(.0,.01,w-uv.x);
          col += vec3(0.,.8,.5) * bar * x * (.7+.3*sin(uTime*2.+float(i)));
        }

        // Corner glow
        float cg = (1.-length(uv*2.-1.)*.8);
        col += vec3(0.,.12,.08)*cg*.5;

        // Vignette
        float vig = 1.-length((uv-.5)*1.6);
        col *= vig;

        gl_FragColor = vec4(col, 1.);
      }
    `,
  });

  // ─────────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────────
  function m(color, opts={}) {
    return new THREE.MeshStandardMaterial({ color, ...opts });
  }
  function bx(w,h,d, mat, rx=0,ry=0,rz=0) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d,2,2,2), mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.rotation.set(rx,ry,rz);
    return mesh;
  }
  function cy(rt,rb,h,seg, mat) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg), mat);
    mesh.castShadow = true; mesh.receiveShadow = true;
    return mesh;
  }
  function sp(r,seg,mat) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r,seg,seg), mat);
    mesh.castShadow = true; return mesh;
  }
  function tor(R,r,seg,mat) {
    return new THREE.Mesh(new THREE.TorusGeometry(R,r,12,seg), mat);
  }
  function addTo(parent,...children){ children.forEach(c=>{ c.castShadow=true; parent.add(c); }); }

  // ─────────────────────────────────────────────────────────────
  //  MATERIALS
  // ─────────────────────────────────────────────────────────────
  const MAT = {
    wood:       woodShader,
    darkWood:   m(0x2d1505, {roughness:.85,metalness:.0}),
    black:      m(0x0c0c10, {roughness:.55,metalness:.25}),
    darkPlastic:m(0x111118, {roughness:.6,metalness:.2}),
    chrome:     m(0xd0d4e0, {roughness:.12,metalness:.98}),
    aluminium:  m(0xb8bcc8, {roughness:.25,metalness:.85}),
    screen:     screenShader,
    screenBez:  m(0x080810, {roughness:.3,metalness:.1}),
    keycap:     m(0x0d0d16, {roughness:.85,metalness:.0}),
    keycapAcc:  m(0xe8c547, {roughness:.55, metalness:.05, emissive:0x3a2500, emissiveIntensity:.4}),
    mouse:      m(0x0e0e18, {roughness:.55,metalness:.2}),
    mouseSide:  m(0x1a1a28, {roughness:.7,metalness:.1}),
    mouseGlow:  m(0x69ffb4, {roughness:.3,emissive:0x00ff88,emissiveIntensity:1.2}),
    mousepad:   m(0x090912, {roughness:.99,metalness:.0}),
    mpGlow:     new THREE.MeshStandardMaterial({color:0xe8c547, emissive:0xe8c547, emissiveIntensity:.8, transparent:true, opacity:.25}),
    lamp:       m(0xe0e4f0, {roughness:.2,metalness:.85}),
    lampShade:  new THREE.MeshStandardMaterial({color:0x1a0f00, emissive:0xffe090, emissiveIntensity:2.2, roughness:.5, transparent:true, opacity:.92}),
    planter:    m(0x7daa7d, {roughness:.75,metalness:.0}),
    soil:       m(0x2a1508, {roughness:1.,metalness:.0}),
    cactus:     m(0x2a7030, {roughness:.8,metalness:.0}),
    spine:      m(0xf5f5e8, {roughness:.9}),
    mug:        m(0xf2f2f2, {roughness:.7}),
    mugInside:  m(0x2a1008, {roughness:1.}),
    coffee:     m(0x2e1404, {roughness:1.}),
    book1:      m(0x1a3a8a, {roughness:.9}),
    book2:      m(0xaa2222, {roughness:.9}),
    book3:      m(0x1a6622, {roughness:.9}),
    phone:      m(0x111118, {roughness:.2,metalness:.75}),
    phoneScreen:new THREE.MeshStandardMaterial({color:0x020208, roughness:.05, emissive:0x1a00aa, emissiveIntensity:.5}),
    phoneCam:   m(0x060610, {roughness:.1,metalness:.3}),
    cable:      m(0x0a0a0a, {roughness:.9}),
    notePad:    m(0xfaf7e8, {roughness:.95}),
    noteLines:  m(0xc8d0e0, {roughness:.95}),
    pen:        m(0x111111, {roughness:.4,metalness:.5}),
    penTip:     m(0xe8c547, {roughness:.2,metalness:.8, emissive:0x3a2500, emissiveIntensity:.3}),
    platBase:   m(0x0a0a0e, {roughness:.5,metalness:.6}),
    platRing:   new THREE.MeshStandardMaterial({color:0xe8c547, emissive:0xe8c547, emissiveIntensity:1.5, roughness:.2}),
    platRingB:  new THREE.MeshStandardMaterial({color:0x4fc3f7, emissive:0x4fc3f7, emissiveIntensity:1.2, roughness:.2}),
    floor:      m(0x060608, {roughness:.95,metalness:.0}),
    wall:       m(0x09090e, {roughness:1.,metalness:.0}),
    hpBand:     m(0x111118, {roughness:.6,metalness:.2}),
    headset:    m(0x0c0c14, {roughness:.5,metalness:.3}),
    rgbStrip:   new THREE.MeshStandardMaterial({color:0x69ffb4, emissive:0x69ffb4, emissiveIntensity:3., roughness:.1}),
    speakerBody:m(0x0a0a12, {roughness:.7,metalness:.2}),
    speakerGrill:m(0x060608,{roughness:.8}),
  };

  // ─────────────────────────────────────────────────────────────
  //  ROTATING PLATFORM
  // ─────────────────────────────────────────────────────────────
  const platformGroup = new THREE.Group();
  scene.add(platformGroup);

  // Ground shadow catcher
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(30,30),
    new THREE.ShadowMaterial({opacity:.45})
  );
  shadowPlane.rotation.x = -Math.PI/2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // Platform base disc
  const platDisc = cy(3.4, 3.4, 0.14, 64, MAT.platBase);
  platDisc.position.y = 0.07;
  platformGroup.add(platDisc);

  // Platform top surface
  const platTop = cy(3.38, 3.38, 0.02, 64, m(0x111118,{roughness:.6,metalness:.4}));
  platTop.position.y = 0.16;
  platTop.receiveShadow = true;
  platformGroup.add(platTop);

  // Platform edge bevel
  const platEdge = cy(3.4, 3.55, 0.08, 64, m(0x1a1a24,{roughness:.4,metalness:.6}));
  platEdge.position.y = 0.04;
  platformGroup.add(platEdge);

  // Glowing ring strips (multi-ring)
  const ringData = [
    {r:3.35, mat: MAT.platRing,  y:0.15},
    {r:2.8,  mat: MAT.platRingB, y:0.155},
    {r:1.8,  mat: MAT.platRing,  y:0.155},
  ];
  ringData.forEach(rd => {
    const ring = tor(rd.r, 0.012, 128, rd.mat);
    ring.rotation.x = Math.PI/2;
    ring.position.y = rd.y;
    platformGroup.add(ring);
  });

  // Concentric circle lines on platform
  for(let i=0; i<6; i++){
    const r = 0.5 + i*0.45;
    const line = tor(r, 0.003, 80, m(0x222232,{roughness:.5}));
    line.rotation.x = Math.PI/2;
    line.position.y = 0.161;
    platformGroup.add(line);
  }

  // Leg pillars under platform
  for(let i=0; i<3; i++){
    const ang = (i/3)*Math.PI*2;
    const leg = cy(0.12, 0.18, 0.4, 12, MAT.platBase);
    leg.position.set(Math.cos(ang)*2.8, -0.2, Math.sin(ang)*2.8);
    platformGroup.add(leg);
    const foot = cy(0.22, 0.22, 0.05, 12, m(0x0c0c10,{roughness:.4,metalness:.7}));
    foot.position.set(Math.cos(ang)*2.8, -0.42, Math.sin(ang)*2.8);
    platformGroup.add(foot);
  }

  // ─────────────────────────────────────────────────────────────
  //  EVERYTHING ON PLATFORM (desk scene group)
  // ─────────────────────────────────────────────────────────────
  const world = new THREE.Group();
  world.position.y = 0.17;
  platformGroup.add(world);

  // ─────────────────────────────────────────────────────────────
  //  DESK
  // ─────────────────────────────────────────────────────────────
  const deskGroup = new THREE.Group();
  world.add(deskGroup);

  // Desktop slab
  const deskTop = bx(5.6, 0.1, 2.2, MAT.wood);
  deskTop.position.set(0, 1.05, 0);
  deskGroup.add(deskTop);

  // Front apron
  const apronF = bx(5.6, 0.08, 0.06, MAT.darkWood);
  apronF.position.set(0, .99, 1.11);
  deskGroup.add(apronF);

  // Side aprons
  [-2.77, 2.77].forEach(x => {
    const ap = bx(0.06, 0.08, 2.2, MAT.darkWood);
    ap.position.set(x, .99, 0);
    deskGroup.add(ap);
  });

  // Legs (tapered)
  [[-2.55,-0.5],[-2.55,0.72],[2.55,-0.5],[2.55,0.72]].forEach(([x,z])=>{
    const lg = cy(0.05, 0.04, 0.98, 8, MAT.darkWood);
    lg.position.set(x, .51, z);
    deskGroup.add(lg);
    // Foot cap
    const fc = cy(0.055, 0.055, 0.03, 8, MAT.chrome);
    fc.position.set(x, .03, z);
    deskGroup.add(fc);
  });

  // Back shelf
  const shelf = bx(5.4, 0.06, 0.6, MAT.wood);
  shelf.position.set(0, .38, -.7);
  deskGroup.add(shelf);

  // Cable management hole
  const cableHole = bx(.18,.12,.18, MAT.darkPlastic);
  cableHole.position.set(1.2, 1.06, -.9);
  deskGroup.add(cableHole);

  // ─────────────────────────────────────────────────────────────
  //  MOUSEPAD
  // ─────────────────────────────────────────────────────────────
  const mp = bx(1.5, 0.008, 0.85, MAT.mousepad);
  mp.position.set(.65, 1.054, .38);
  deskGroup.add(mp);

  // RGB edge
  const mpEdge = bx(1.5, 0.009, 0.85, MAT.mpGlow);
  mpEdge.position.set(.65, 1.055, .38);
  deskGroup.add(mpEdge);

  // Stitched border detail
  for(let i=0;i<20;i++){
    const st = bx(.04,.003,.04, m(0x1e1e30,{roughness:1.}));
    st.position.set(-.68+i*.073, 1.058, -.38);
    deskGroup.add(st);
  }

  // ─────────────────────────────────────────────────────────────
  //  MONITOR
  // ─────────────────────────────────────────────────────────────
  const monGroup = new THREE.Group();
  monGroup.position.set(0, 2.08, -.28);
  deskGroup.add(monGroup);

  // Stand base
  const monBase = bx(.9, .045, .38, MAT.black);
  monBase.position.set(0, -1.03, .02);
  monGroup.add(monBase);

  const monBaseTop = bx(.88, .015, .36, m(0x1a1a28,{roughness:.4,metalness:.3}));
  monBaseTop.position.set(0, -1.0, .02);
  monGroup.add(monBaseTop);

  // Neck
  const monNeck = bx(.09, .48, .07, MAT.black);
  monNeck.position.set(0, -.77, .0);
  monGroup.add(monNeck);

  // VESA bracket
  const vesa = bx(.18, .12, .04, MAT.black);
  vesa.position.set(0, -.52, -.03);
  monGroup.add(vesa);

  // Monitor outer shell
  const monShell = bx(2.55, 1.52, .075, MAT.black);
  monGroup.add(monShell);

  // Bezel top/sides (very thin)
  const bez = bx(2.42, 1.38, .025, MAT.screenBez);
  bez.position.z = .046;
  monGroup.add(bez);

  // Screen
  const screenMesh = bx(2.36, 1.32, .008, MAT.screen);
  screenMesh.position.z = .052;
  monGroup.add(screenMesh);

  // Screen glare overlay
  const glare = bx(2.36, 1.32, .001,
    new THREE.MeshStandardMaterial({color:0xffffff, transparent:true, opacity:.03, roughness:0., metalness:.9})
  );
  glare.position.z = .057;
  monGroup.add(glare);

  // RGB rear halo (back of monitor)
  const backHalo = bx(2.55, 1.52, .005, new THREE.MeshStandardMaterial({color:0x69ffb4, emissive:0x69ffb4, emissiveIntensity:1.5, roughness:.2}));
  backHalo.position.z = -.042;
  monGroup.add(backHalo);

  // Bottom speaker grille strip
  const grille = bx(1.2, .025, .065, MAT.speakerGrill);
  grille.position.set(0, -.715, .036);
  monGroup.add(grille);
  for(let i=0;i<14;i++){
    const slot = bx(.008, .016, .07, m(0x040408,{roughness:.8}));
    slot.position.set(-.6+i*.092, -.715, .04);
    monGroup.add(slot);
  }

  // Power LED
  const led = cy(.009,.009,.01, 8, MAT.mouseGlow);
  led.rotation.x = Math.PI/2;
  led.position.set(.92, -.72, .04);
  monGroup.add(led);

  // RGB bottom strip
  const rgbBot = bx(2.55, .012, .065, MAT.rgbStrip);
  rgbBot.position.set(0, -.77, -.01);
  monGroup.add(rgbBot);

  // Port area (back bottom)
  const portArea = bx(.35, .06, .01, MAT.black);
  portArea.position.set(0, -.72, -.038);
  monGroup.add(portArea);
  for(let i=0;i<3;i++){
    const port = bx(.055, .03, .01, m(0x050510,{roughness:.4}));
    port.position.set(-.08+i*.09, -.72, -.04);
    monGroup.add(port);
  }

  // ─────────────────────────────────────────────────────────────
  //  KEYBOARD
  // ─────────────────────────────────────────────────────────────
  const kbG = new THREE.Group();
  kbG.position.set(-.05, 1.054, .38);
  deskGroup.add(kbG);

  // Base plate
  const kbBase = bx(1.62, .038, .52, MAT.black);
  kbBase.position.y = .012;
  kbG.add(kbBase);

  // Top plate (slightly smaller, raised)
  const kbTop = bx(1.58, .032, .48, m(0x0e0e18,{roughness:.55,metalness:.25}));
  kbTop.position.y = .036;
  kbG.add(kbTop);

  // Underglow strip
  const kbUG = bx(1.58, .004, .48, new THREE.MeshStandardMaterial({color:0xe8c547,emissive:0xe8c547,emissiveIntensity:.9,transparent:true,opacity:.4}));
  kbUG.position.y = .0;
  kbG.add(kbUG);

  // Keys
  const kRows=5, kCols=14;
  const kW=.092, kH=.026, kD=.088;
  const accentPositions=[[0,0],[0,1],[4,13],[2,0]];
  for(let r=0;r<kRows;r++){
    for(let c=0;c<kCols;c++){
      const isAcc = accentPositions.some(([ar,ac])=>ar===r&&ac===c);
      const key = bx(kW, kH, kD, isAcc ? MAT.keycapAcc : MAT.keycap);
      key.position.set(-.635+c*.1, .056, -.18+r*.1);
      kbG.add(key);
      // Keycap top face shine
      const shine = bx(kW*.85, .001, kD*.85, new THREE.MeshStandardMaterial({color:0x1a1a28,roughness:.3,metalness:.1}));
      shine.position.set(-.635+c*.1, .07, -.18+r*.1);
      kbG.add(shine);
    }
  }
  // Spacebar
  const space = bx(.46, kH, kD, MAT.keycapAcc);
  space.position.set(.02, .056, .33);
  kbG.add(space);

  // ─────────────────────────────────────────────────────────────
  //  MOUSE
  // ─────────────────────────────────────────────────────────────
  const msG = new THREE.Group();
  msG.position.set(1.47, 1.055, .42);
  deskGroup.add(msG);

  // Main body shell
  const msBody = bx(.185, .062, .29, MAT.mouse);
  msBody.position.y = .025;
  msG.add(msBody);

  // Ergonomic top hump
  const msHump = sp(.105, 16, m(0x0e0e18,{roughness:.5,metalness:.2}));
  msHump.scale.set(.88, .42, 1.4);
  msHump.position.y = .065;
  msG.add(msHump);

  // Side grips
  [-1,1].forEach(s=>{
    const grip = bx(.008, .045, .24, MAT.mouseSide);
    grip.position.set(s*.09, .028, -.01);
    msG.add(grip);
  });

  // Scroll wheel
  const scroll = cy(.02,.02,.065,12, MAT.chrome);
  scroll.rotation.z = Math.PI/2;
  scroll.position.set(0, .07, -.055);
  msG.add(scroll);
  const scrollGroove = cy(.021,.021,.012,12, m(0x111118,{roughness:.6}));
  scrollGroove.rotation.z = Math.PI/2;
  scrollGroove.position.set(0, .07, -.055);
  msG.add(scrollGroove);

  // DPI button
  const dpiBtn = bx(.018, .006, .018, MAT.keycapAcc);
  dpiBtn.position.set(0, .063, .01);
  msG.add(dpiBtn);

  // RGB underglow
  const msRgb = bx(.17, .004, .27, new THREE.MeshStandardMaterial({color:0x69ffb4, emissive:0x69ffb4, emissiveIntensity:1.4, transparent:true, opacity:.7}));
  msRgb.position.y = .001;
  msG.add(msRgb);

  // Logo
  const msLogo = bx(.055, .002, .04, new THREE.MeshStandardMaterial({color:0xe8c547, emissive:0xe8c547, emissiveIntensity:.8, roughness:.3}));
  msLogo.position.set(0, .056, .06);
  msG.add(msLogo);

  // ─────────────────────────────────────────────────────────────
  //  CABLE (spline)
  // ─────────────────────────────────────────────────────────────
  const cablePts = [
    new THREE.Vector3(1.47,1.06,.28),
    new THREE.Vector3(1.35,1.06,.08),
    new THREE.Vector3(1.1,1.06,-.1),
    new THREE.Vector3(.7,1.06,-.4),
    new THREE.Vector3(.2,1.06,-.6),
  ];
  const cableGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePts), 28, .007, 8, false);
  world.add(new THREE.Mesh(cableGeo, MAT.cable));

  // ─────────────────────────────────────────────────────────────
  //  DESKTOP SPEAKERS (mini)
  // ─────────────────────────────────────────────────────────────
  [-1, 1].forEach(side => {
    const spG = new THREE.Group();
    spG.position.set(side * 1.95, 1.055, -.55);
    deskGroup.add(spG);

    const spBody = bx(.18, .32, .18, MAT.speakerBody);
    spBody.position.y = .16;
    spG.add(spBody);

    // Grille face
    for(let r=0;r<5;r++)for(let c=0;c<4;c++){
      const dot = cy(.012,.012,.01,6, MAT.speakerGrill);
      dot.rotation.x = Math.PI/2;
      dot.position.set(-.055+c*.04, .09+r*.06, .09);
      spG.add(dot);
    }

    // Bass port
    const port = cy(.025,.025,.025,10, m(0x040406,{roughness:.5}));
    port.rotation.x = Math.PI/2;
    port.position.set(0, .05, .09);
    spG.add(port);

    // LED
    const spLed = cy(.007,.007,.01,6, new THREE.MeshStandardMaterial({color:0x69ffb4, emissive:0x69ffb4, emissiveIntensity:2.}));
    spLed.rotation.x = Math.PI/2;
    spLed.position.set(side>0?.06:-.06, .05, .09);
    spG.add(spLed);
  });

  // ─────────────────────────────────────────────────────────────
  //  DESK LAMP (articulating arm)
  // ─────────────────────────────────────────────────────────────
  const lampG = new THREE.Group();
  lampG.position.set(2.2, 1.055, -.5);
  deskGroup.add(lampG);

  // Base weight
  const lBase = cy(.2,.22,.05,20, MAT.lamp);
  lBase.position.y = .025;
  lampG.add(lBase);
  const lBaseTop = cy(.19,.19,.015,20, m(0xd0d4e0,{roughness:.15,metalness:.9}));
  lBaseTop.position.y = .055;
  lampG.add(lBaseTop);

  // Clamp bolt
  const bolt = cy(.025,.025,.06,8, MAT.chrome);
  bolt.rotation.x = Math.PI/2;
  bolt.position.set(.18,.04,0);
  lampG.add(bolt);

  // Lower arm
  const arm1 = bx(.022, .55, .022, MAT.lamp);
  arm1.position.set(.02, .34, 0);
  arm1.rotation.z = .18;
  lampG.add(arm1);

  // Joint 1
  const j1 = sp(.04, 10, MAT.chrome);
  j1.position.set(.055, .62, 0);
  lampG.add(j1);

  // Upper arm
  const arm2 = bx(.018, .5, .018, MAT.lamp);
  arm2.position.set(.08, .9, 0);
  arm2.rotation.z = -.55;
  lampG.add(arm2);

  // Joint 2
  const j2 = sp(.035, 10, MAT.chrome);
  j2.position.set(-.08, 1.13, 0);
  lampG.add(j2);

  // Head pivot
  const headPivot = new THREE.Group();
  headPivot.position.set(-.22, 1.25, 0);
  lampG.add(headPivot);

  // Shade (cone)
  const shade = cy(.055, .12, .18, 20, MAT.lampShade);
  shade.rotation.z = .6;
  headPivot.add(shade);

  // Inner reflector
  const refl = cy(.05, .11, .17, 20, m(0xddddcc,{roughness:.15,metalness:.8}));
  refl.rotation.z = .6;
  refl.position.x = .005;
  headPivot.add(refl);

  // Bulb
  const bulb = sp(.025, 8, new THREE.MeshStandardMaterial({color:0xfff5d0, emissive:0xfff5d0, emissiveIntensity:4., roughness:.1}));
  bulb.position.set(-.02, .04, 0);
  headPivot.add(bulb);

  // ─────────────────────────────────────────────────────────────
  //  CACTUS PLANT
  // ─────────────────────────────────────────────────────────────
  const plantG = new THREE.Group();
  plantG.position.set(-2.1, 1.055, -.45);
  deskGroup.add(plantG);

  // Pot body (cone)
  const pot = cy(.19,.15,.3,14, MAT.planter);
  pot.position.y = .15;
  plantG.add(pot);

  // Rim
  const rim2 = cy(.2,.19,.03,14, m(0x6da06d,{roughness:.6}));
  rim2.position.y = .315;
  plantG.add(rim2);

  // Soil
  const soil2 = cy(.185,.185,.02,14, MAT.soil);
  soil2.position.y = .31;
  plantG.add(soil2);

  // Main stem
  const stem = cy(.07,.075,.48,12, MAT.cactus);
  stem.position.y = .56;
  plantG.add(stem);
  const stemCap = sp(.072, 10, MAT.cactus);
  stemCap.position.y = .82;
  plantG.add(stemCap);

  // Arms
  [[-.15, .62, -1.1], [.14, .68, 1.1]].forEach(([x,y,ang])=>{
    const arm = cy(.04,.044,.22,10,MAT.cactus);
    arm.rotation.z = ang*.5;
    arm.position.set(x, y, 0);
    plantG.add(arm);
    const armCap = sp(.042, 8, MAT.cactus);
    armCap.position.set(x + Math.sign(x)*.04, y+.1, 0);
    plantG.add(armCap);
  });

  // Spines
  for(let i=0;i<24;i++){
    const ang = (i/24)*Math.PI*2;
    for(let j=0;j<3;j++){
      const sp2 = bx(.003, .038, .003, MAT.spine);
      sp2.position.set(Math.cos(ang)*.078, .36+j*.18, Math.sin(ang)*.078);
      sp2.lookAt(new THREE.Vector3(0, .36+j*.18, 0));
      plantG.add(sp2);
    }
  }

  // ─────────────────────────────────────────────────────────────
  //  MUG
  // ─────────────────────────────────────────────────────────────
  const mugG = new THREE.Group();
  mugG.position.set(-1.5, 1.055, .28);
  deskGroup.add(mugG);

  const mugBody = cy(.12,.1,.22,20, MAT.mug);
  mugBody.position.y = .11;
  mugG.add(mugBody);

  const mugInner = cy(.1,.1,.18,20, MAT.mugInside);
  mugInner.position.y = .14;
  mugG.add(mugInner);

  const coffeeSurf = cy(.099,.099,.01,20, MAT.coffee);
  coffeeSurf.position.y = .23;
  mugG.add(coffeeSurf);

  // Steam particles
  for(let i=0;i<3;i++){
    const steam = bx(.004, .06, .004, new THREE.MeshStandardMaterial({color:0xffffff, transparent:true, opacity:.08, roughness:1.}));
    steam.position.set(-.02+i*.02, .31+i*.02, 0);
    mugG.add(steam);
  }

  // Handle
  const hCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(.12,.16,0), new THREE.Vector3(.21,.16,0),
    new THREE.Vector3(.22,.08,0), new THREE.Vector3(.12,.06,0),
  ]);
  mugG.add(new THREE.Mesh(new THREE.TubeGeometry(hCurve,14,.011,7,false), MAT.mug));

  // ─────────────────────────────────────────────────────────────
  //  BOOKS STACK
  // ─────────────────────────────────────────────────────────────
  const booksG = new THREE.Group();
  booksG.position.set(-2.55, 1.06, -.25);
  deskGroup.add(booksG);

  [[.09,.3,.2, MAT.book1,0],[.075,.26,.18, MAT.book2,.085],[.085,.28,.19, MAT.book3,.162]].forEach(([w,h,d,mat,x])=>{
    const bk = bx(w,h,d,mat);
    bk.position.set(x, h/2, 0);
    // Spine label
    const label = bx(w*.9, h*.6, .001, m(0xfafafa,{roughness:.9, emissive:0xddddcc, emissiveIntensity:.1}));
    label.position.set(x, h*.4, d/2+.001);
    booksG.add(label);
    booksG.add(bk);
  });

  // ─────────────────────────────────────────────────────────────
  //  NOTEPAD + PEN
  // ─────────────────────────────────────────────────────────────
  const noteG = new THREE.Group();
  noteG.position.set(-1.0, 1.054, .65);
  noteG.rotation.y = -.2;
  deskGroup.add(noteG);

  const noteBody = bx(.36,.008,.5, MAT.notePad);
  noteG.add(noteBody);

  // Lines
  for(let i=0;i<8;i++){
    const line = bx(.3,.001,.006, m(0xb0c0d8,{roughness:1.}));
    line.position.set(0,.005,-.18+i*.055);
    noteG.add(line);
  }

  // Binding
  const bind = bx(.015,.01,.5, m(0xff6b35,{roughness:.8}));
  bind.position.x = -.18;
  noteG.add(bind);

  // Pen
  const penG = new THREE.Group();
  penG.position.set(-.1, 1.058, .85);
  penG.rotation.y = .3;
  deskGroup.add(penG);

  const penBody = cy(.008,.008,.32,8, MAT.pen);
  penBody.rotation.z = Math.PI/2;
  penG.add(penBody);
  const penTip2 = cy(.008,.002,.04,8, MAT.penTip);
  penTip2.rotation.z = Math.PI/2;
  penTip2.position.x = .18;
  penG.add(penTip2);
  const penClip = bx(.003,.002,.12, MAT.chrome);
  penClip.position.set(-.04,.012,0);
  penG.add(penClip);

  // ─────────────────────────────────────────────────────────────
  //  PHONE
  // ─────────────────────────────────────────────────────────────
  const phoneG = new THREE.Group();
  phoneG.position.set(1.85, 1.055, -.42);
  phoneG.rotation.y = .35;
  deskGroup.add(phoneG);

  const phoneBod = bx(.18,.01,.38, MAT.phone);
  phoneBod.position.y = .005;
  phoneG.add(phoneBod);

  const pScreen = bx(.16,.012,.34, MAT.phoneScreen);
  pScreen.position.set(0,.009,-.01);
  phoneG.add(pScreen);

  // Camera module
  const camMod = bx(.06,.014,.06, m(0x0a0a10,{roughness:.2,metalness:.8}));
  camMod.position.set(.04,.012,-.14);
  phoneG.add(camMod);
  [[-. 01,0],[.022,.018],[.022,-.018]].forEach(([x,z])=>{
    const lens = cy(.009,.009,.012,8, m(0x050510,{roughness:.05,metalness:.2}));
    lens.rotation.x = Math.PI/2;
    lens.position.set(.04+x,.02,-.14+z);
    phoneG.add(lens);
    const lensGlass = cy(.007,.007,.005,8, m(0x000511,{roughness:.0,metalness:.0}));
    lensGlass.rotation.x = Math.PI/2;
    lensGlass.position.set(.04+x,.024,-.14+z);
    phoneG.add(lensGlass);
  });

  // Side buttons
  const btn = bx(.012,.04,.003, MAT.aluminium);
  btn.position.set(.091,.005,-.05);
  phoneG.add(btn);

  // ─────────────────────────────────────────────────────────────
  //  HEADPHONES (on stand beside desk)
  // ─────────────────────────────────────────────────────────────
  const hpG = new THREE.Group();
  hpG.position.set(-1.9, 1.055, .6);
  hpG.rotation.y = .3;
  deskGroup.add(hpG);

  // Headphone stand pole
  const hpPole = cy(.018,.018,.32,8, MAT.chrome);
  hpPole.position.y = .16;
  hpG.add(hpPole);

  const hpPoleBase = cy(.055,.06,.025,16, m(0x1a1a24,{roughness:.4,metalness:.7}));
  hpPoleBase.position.y = .012;
  hpG.add(hpPoleBase);

  const hpTopKnob = sp(.025, 8, MAT.chrome);
  hpTopKnob.position.y = .34;
  hpG.add(hpTopKnob);

  // Headphone arc
  const hpArc = tor(.2, .014, 30, MAT.hpBand);
  hpArc.rotation.x = Math.PI/2;
  hpArc.position.y = .39;
  hpG.add(hpArc);

  // Ear cups
  [-.2, .2].forEach(x=>{
    const cup = cy(.07,.065,.05,16, MAT.headset);
    cup.rotation.z = Math.PI/2;
    cup.position.set(x, .39, 0);
    hpG.add(cup);
    const pad = cy(.065,.065,.01,16, m(0x111111,{roughness:.99}));
    pad.rotation.z = Math.PI/2;
    pad.position.set(x+(x>0?.032:-.032), .39, 0);
    hpG.add(pad);
    // Driver mesh
    const driver = cy(.04,.04,.008,12, m(0x1a1a26,{roughness:.5,metalness:.3}));
    driver.rotation.z = Math.PI/2;
    driver.position.set(x+(x>0?.038:-.038), .39, 0);
    hpG.add(driver);
  });

  // ─────────────────────────────────────────────────────────────
  //  SOCIAL ICON BLOCKS  (GitHub, Twitter, Coffee)
  // ─────────────────────────────────────────────────────────────
  const iconData = [
    { x:2.35, z:.6,  color:0x161b22, emv:0xffffff, label:'⌥ GitHub',   panel:'p-github',  emI:.4 },
    { x:2.35, z:.35, color:0x050505, emv:0xfafafa,  label:'𝕏 Twitter',  panel:'p-twitter', emI:.3 },
    { x:2.35, z:.1,  color:0xffdd00, emv:0xffbb00,  label:'☕ Coffee',   panel:'p-coffee',  emI:.5 },
  ];
  const iconGroups = [];
  iconData.forEach(d=>{
    const ig = new THREE.Group();
    ig.position.set(d.x, 1.055, d.z);
    deskGroup.add(ig);

    // Base cube
    const base = bx(.17,.095,.17, m(d.color,{roughness:.4,metalness:.3}));
    base.position.y = .0475;
    ig.add(base);

    // Top face glow
    const topFace = bx(.155,.002,.155, new THREE.MeshStandardMaterial({color:d.emv, emissive:d.emv, emissiveIntensity:d.emI, roughness:.3}));
    topFace.position.y = .097;
    ig.add(topFace);

    // Front logo face
    const front = bx(.13,.08,.002, new THREE.MeshStandardMaterial({color:d.emv, emissive:d.emv, emissiveIntensity:d.emI*1.5, roughness:.2, transparent:true, opacity:.9}));
    front.position.set(0,.0475,.087);
    ig.add(front);

    // Edge trim
    const trim = bx(.17,.004,.17, new THREE.MeshStandardMaterial({color:d.emv, emissive:d.emv, emissiveIntensity:.8, transparent:true, opacity:.5}));
    trim.position.y = .095;
    ig.add(trim);

    ig.userData = { panel: d.panel, label: d.label };
    iconGroups.push(ig);
  });

  // ─────────────────────────────────────────────────────────────
  //  BACK WALL + AMBIENT
  // ─────────────────────────────────────────────────────────────
  const wallBg = bx(20, 12, .08, MAT.wall);
  wallBg.position.set(0, 6, -5);
  wallBg.receiveShadow = true;
  scene.add(wallBg);

  // Glowing wall decoration strips
  [[-.5,0x69ffb4],[0,0xe8c547],[.5,0x4fc3f7]].forEach(([x,col])=>{
    const strip = bx(.008, 3.5, .01, new THREE.MeshStandardMaterial({color:col,emissive:col,emissiveIntensity:.6,transparent:true,opacity:.4}));
    strip.position.set(x*5, 2.8, -4.9);
    scene.add(strip);
  });

  // Grid floor pattern
  const gridHelper = new THREE.GridHelper(20, 30, 0x111118, 0x0d0d14);
  gridHelper.position.y = .001;
  scene.add(gridHelper);

  // ─────────────────────────────────────────────────────────────
  //  PARTICLE DUST
  // ─────────────────────────────────────────────────────────────
  const ptCount = 600;
  const ptGeo = new THREE.BufferGeometry();
  const pts = new Float32Array(ptCount*3);
  for(let i=0;i<ptCount;i++){
    pts[i*3]   = (Math.random()-.5)*14;
    pts[i*3+1] = Math.random()*5;
    pts[i*3+2] = (Math.random()-.5)*10;
  }
  ptGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  const ptMat = new THREE.PointsMaterial({color:0xe8c547, size:.025, transparent:true, opacity:.35, sizeAttenuation:true});
  scene.add(new THREE.Points(ptGeo, ptMat));

  // ─────────────────────────────────────────────────────────────
  //  CLICKABLE REGISTRY
  // ─────────────────────────────────────────────────────────────
  window._clickables = [
    { group: monGroup,  panel: 'p-about',   label: '🖥  Open About Me' },
    ...iconGroups.map(ig => ({ group: ig, panel: ig.userData.panel, label: ig.userData.label })),
  ];

  // ─────────────────────────────────────────────────────────────
  //  ORBIT CONTROLS (manual)
  // ─────────────────────────────────────────────────────────────
  let isDragging = false;
  let prevMouse = { x:0, y:0 };
  let spherical = { theta: 0, phi: Math.PI/3.5, radius: 9 };
  let targetSpherical = { ...spherical };
  let autoRotate = true;
  let autoRotateTimeout;

  canvas.addEventListener('mousedown', e=>{
    isDragging = true;
    prevMouse = { x:e.clientX, y:e.clientY };
    autoRotate = false;
    clearTimeout(autoRotateTimeout);
  });
  canvas.addEventListener('touchstart', e=>{
    isDragging = true;
    prevMouse = { x:e.touches[0].clientX, y:e.touches[0].clientY };
    autoRotate = false;
    clearTimeout(autoRotateTimeout);
  },{passive:true});

  window.addEventListener('mousemove', e=>{
    // cursor tracking for UI
    document.getElementById('cursor-dot').style.left  = e.clientX+'px';
    document.getElementById('cursor-dot').style.top   = e.clientY+'px';
    document.getElementById('cursor-ring').style.left = e.clientX+'px';
    document.getElementById('cursor-ring').style.top  = e.clientY+'px';

    if(!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    const dy = e.clientY - prevMouse.y;
    targetSpherical.theta -= dx * .006;
    targetSpherical.phi   = Math.max(.25, Math.min(1.5, targetSpherical.phi + dy*.005));
    prevMouse = { x:e.clientX, y:e.clientY };
  });
  window.addEventListener('touchmove', e=>{
    if(!isDragging) return;
    const dx = e.touches[0].clientX - prevMouse.x;
    const dy = e.touches[0].clientY - prevMouse.y;
    targetSpherical.theta -= dx * .006;
    targetSpherical.phi   = Math.max(.25, Math.min(1.5, targetSpherical.phi + dy*.005));
    prevMouse = { x:e.touches[0].clientX, y:e.touches[0].clientY };
  },{passive:true});

  window.addEventListener('mouseup',   ()=>{ isDragging=false; autoRotateTimeout=setTimeout(()=>autoRotate=true, 4000); });
  window.addEventListener('touchend',  ()=>{ isDragging=false; autoRotateTimeout=setTimeout(()=>autoRotate=true, 4000); });

  canvas.addEventListener('wheel', e=>{
    targetSpherical.radius = Math.max(4, Math.min(16, targetSpherical.radius + e.deltaY*.01));
  },{passive:true});

  // ─────────────────────────────────────────────────────────────
  //  RAYCASTER
  // ─────────────────────────────────────────────────────────────
  const ray = new THREE.Raycaster();
  const mouse2 = new THREE.Vector2();
  let hoveredClickable = null;

  window.addEventListener('mousemove', e=>{
    mouse2.x = (e.clientX/window.innerWidth)*2-1;
    mouse2.y = -(e.clientY/window.innerHeight)*2+1;
    ray.setFromCamera(mouse2, camera);

    const allMeshes = window._clickables.flatMap(c=>{
      const arr=[]; c.group.traverse(o=>{ if(o.isMesh) arr.push(o); }); return arr;
    });
    const hits = ray.intersectObjects(allMeshes);
    const tip = document.getElementById('tip');

    if(hits.length){
      const found = window._clickables.find(c=>{
        const arr=[]; c.group.traverse(o=>{ if(o.isMesh) arr.push(o); });
        return arr.includes(hits[0].object);
      });
      if(found){
        hoveredClickable = found;
        tip.style.display = 'block';
        tip.style.left = (e.clientX+14)+'px';
        tip.style.top  = (e.clientY-12)+'px';
        tip.textContent = found.label;
        document.body.classList.add('hov');
        return;
      }
    }
    hoveredClickable = null;
    tip.style.display = 'none';
    document.body.classList.remove('hov');
  });

  canvas.addEventListener('click', ()=>{
    if(hoveredClickable) window.openPanel(hoveredClickable.panel);
  });

  // ─────────────────────────────────────────────────────────────
  //  ANIMATE
  // ─────────────────────────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Auto-rotate platform
    if(autoRotate) targetSpherical.theta += .003;

    // Smooth orbit
    spherical.theta += (targetSpherical.theta - spherical.theta) * .06;
    spherical.phi   += (targetSpherical.phi   - spherical.phi)   * .06;
    spherical.radius+= (targetSpherical.radius- spherical.radius)* .06;

    camera.position.set(
      spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta),
      spherical.radius * Math.cos(spherical.phi) + 1.2,
      spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta)
    );
    camera.lookAt(0, 1.3, 0);

    // Platform counter-rotate to keep desk always "right side up" while ring lights rotate
    platformGroup.rotation.y = spherical.theta;

    // Screen shader time
    if(screenShader.uniforms) screenShader.uniforms.uTime.value = t;
    if(woodShader.uniforms)   woodShader.uniforms.uTime.value = t;

    // Monitor glow pulse
    monGlow.intensity = 5 + Math.sin(t*1.8)*.8;

    // Lamp flicker
    lampPt.intensity = 11.5 + Math.sin(t*4.3)*.5 + Math.sin(t*7.1)*.3;

    // Plant sway
    plantG.rotation.z = Math.sin(t*.7)*.016;
    plantG.rotation.x = Math.sin(t*.5)*.008;

    // Steam particles float
    mugG.children.forEach((c,i)=>{ if(i>3) c.position.y = .31 + Math.sin(t*1.5+i)*.04; });

    // Icon blocks hover bounce
    iconGroups.forEach((ig, i)=>{
      ig.position.y = 1.055 + Math.sin(t*1.4+i*1.2)*.012;
    });

    // RGB strip color cycle
    const hue = (t*.08)%1;
    const c1 = new THREE.Color().setHSL(hue, 1., .55);
    const c2 = new THREE.Color().setHSL((hue+.33)%1, 1., .55);
    MAT.rgbStrip.color.set(c1); MAT.rgbStrip.emissive.set(c1);
    MAT.mouseGlow.color.set(c2); MAT.mouseGlow.emissive.set(c2);
    platGlow.color.set(c1);

    // Platform ring pulse
    MAT.platRing.emissiveIntensity = 1.2 + Math.sin(t*2.)*.3;
    MAT.platRingB.emissiveIntensity = 1.0 + Math.sin(t*2.+1.)*.3;

    // Particle drift
    const pa = ptGeo.attributes.position.array;
    for(let i=0;i<ptCount;i++){
      pa[i*3+1] += .003;
      if(pa[i*3+1] > 5) pa[i*3+1] = 0;
    }
    ptGeo.attributes.position.needsUpdate = true;

    // Hoverable scale
    window._clickables.forEach(c=>{
      const sc = c===hoveredClickable ? 1+Math.sin(t*6)*.018 : 1;
      c.group.scale.setScalar(sc);
    });

    renderer.render(scene, camera);
  }
  animate();

  // ─────────────────────────────────────────────────────────────
  //  RESIZE
  // ─────────────────────────────────────────────────────────────
  window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─────────────────────────────────────────────────────────────
  //  LOADER PROGRESS
  // ─────────────────────────────────────────────────────────────
  const msgs = ['Assembling desk...','Arranging pixels...','Adjusting RGB...','Brewing coffee...','Almost there...'];
  let prog = 0;
  const pct = document.getElementById('ld-pct');
  const msg = document.getElementById('ld-msg');
  const fill2 = document.querySelector('.ld-progress');
  const interval = setInterval(()=>{
    prog = Math.min(100, prog + Math.random()*18 + 5);
    pct.textContent = Math.floor(prog)+'%';
    fill2.style.strokeDashoffset = 264*(1-prog/100);
    msg.textContent = msgs[Math.min(4, Math.floor(prog/20))];
    if(prog >= 100){
      clearInterval(interval);
      setTimeout(()=>{ document.getElementById('loader').classList.add('out'); }, 400);
    }
  }, 160);
})();
