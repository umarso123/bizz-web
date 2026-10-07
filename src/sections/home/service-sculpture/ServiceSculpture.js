import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, SoftShadows } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef, useState, } from 'react';
import { ACESFilmicToneMapping, BufferAttribute, CatmullRomCurve3, Color, DirectionalLight, Group, MathUtils, Mesh, MeshPhysicalMaterial, PointLight, SRGBColorSpace, TubeGeometry, Vector3, } from 'three';
const brandBlue = new Color('#0A8FD8');
const brandOrange = new Color('#F66C2A');
const matteBase = new Color('#F3F1EC');
const white = new Color('#ffffff');
const tintScratch = new Color();
/** Six art-directed poses: Connect, Flow, Layer, Frame, Network, Cloud */
const poses = [
    {
        rotY: 0.18,
        rotX: 0.1,
        rotZ: -0.04,
        lift: 0.02,
        scale: 1.08,
        core: 1,
        ringA: { s: 1, rx: 0.58, ry: 0.28, rz: -0.38, x: 0.04, y: 0.02, z: -0.03 },
        ringB: { s: 0.92, rx: -0.72, ry: 0.82, rz: 0.18, x: -0.08, y: 0.05, z: 0.05 },
        ribbon: { s: 0.96, ry: 0.1, rx: 0.05 },
        nodes: 0,
        blue: 0.24,
        orange: 0.08,
        cam: { x: 1.48, y: 0.4, z: 3.35 },
    },
    {
        rotY: -0.32,
        rotX: 0.06,
        rotZ: 0.08,
        lift: 0.04,
        scale: 1.12,
        core: 0.86,
        ringA: { s: 0.78, rx: 1.15, ry: -0.2, rz: 0.55, x: 0.12, y: -0.08, z: 0.1 },
        ringB: { s: 0.55, rx: 0.2, ry: 1.4, rz: -0.3, x: -0.2, y: 0.18, z: -0.12 },
        ribbon: { s: 1.18, ry: -0.35, rx: 0.18 },
        nodes: 0.15,
        blue: 0.16,
        orange: 0.1,
        cam: { x: 1.7, y: 0.28, z: 3.15 },
    },
    {
        rotY: 0.45,
        rotX: -0.12,
        rotZ: -0.1,
        lift: 0.06,
        scale: 1.06,
        core: 0.78,
        ringA: { s: 1.12, rx: 1.45, ry: 0.05, rz: 0.1, x: 0, y: 0.22, z: 0 },
        ringB: { s: 1.05, rx: 1.45, ry: 0.05, rz: 0.1, x: 0, y: -0.22, z: 0.04 },
        ribbon: { s: 1.02, ry: 0.55, rx: -0.2 },
        nodes: 0.35,
        blue: 0.14,
        orange: 0.16,
        cam: { x: 1.35, y: 0.55, z: 3.45 },
    },
    {
        rotY: -0.12,
        rotX: 0.22,
        rotZ: 0.02,
        lift: 0.0,
        scale: 1.04,
        core: 0.7,
        ringA: { s: 1.2, rx: 0.15, ry: 0.1, rz: 0.05, x: 0.02, y: 0.02, z: 0 },
        ringB: { s: 0.95, rx: 1.05, ry: 0.95, rz: -0.15, x: -0.05, y: -0.02, z: 0.08 },
        ribbon: { s: 0.9, ry: 0.0, rx: 0.35 },
        nodes: 0.2,
        blue: 0.12,
        orange: 0.12,
        cam: { x: 1.55, y: 0.5, z: 3.55 },
    },
    {
        rotY: 0.3,
        rotX: 0.04,
        rotZ: -0.14,
        lift: 0.05,
        scale: 1.1,
        core: 0.88,
        ringA: { s: 0.85, rx: 0.9, ry: -0.55, rz: 0.4, x: 0.15, y: 0.1, z: -0.1 },
        ringB: { s: 0.85, rx: -0.4, ry: 0.7, rz: 0.85, x: -0.15, y: -0.08, z: 0.12 },
        ribbon: { s: 1.08, ry: 0.4, rx: 0.12 },
        nodes: 0.75,
        blue: 0.22,
        orange: 0.14,
        cam: { x: 1.42, y: 0.36, z: 3.2 },
    },
    {
        rotY: -0.38,
        rotX: -0.08,
        rotZ: 0.12,
        lift: 0.16,
        scale: 1.14,
        core: 0.62,
        ringA: { s: 0.48, rx: 0.4, ry: 0.6, rz: -0.2, x: 0.35, y: 0.25, z: -0.2 },
        ringB: { s: 0.42, rx: -0.5, ry: -0.3, rz: 0.5, x: -0.32, y: -0.2, z: 0.25 },
        ribbon: { s: 0.88, ry: -0.25, rx: -0.15 },
        nodes: 1,
        blue: 0.15,
        orange: 0.2,
        cam: { x: 1.62, y: 0.58, z: 3.5 },
    },
];
function curveFor(ribbon, shape) {
    const s = shape;
    if (ribbon === 0) {
        const sets = [
            [new Vector3(-1.1, -0.35, 0.2), new Vector3(-0.55, 0.45, 0.75), new Vector3(0.35, 0.7, 0.15), new Vector3(0.95, 0.05, -0.55), new Vector3(0.7, -0.55, -0.05)],
            [new Vector3(-1.55, -0.15, 0.05), new Vector3(-0.6, 0.55, 0.55), new Vector3(0.35, 0.35, 0.05), new Vector3(1.2, -0.05, -0.35), new Vector3(1.65, -0.35, 0.15)],
            [new Vector3(-1.05, 0.55, 0.35), new Vector3(-0.35, 0.55, 0.85), new Vector3(0.35, 0.55, 0.35), new Vector3(0.95, 0.55, -0.25), new Vector3(1.15, 0.15, -0.45)],
            [new Vector3(-1.05, -0.55, 0.55), new Vector3(-1.05, 0.55, 0.55), new Vector3(0.15, 0.75, 0.05), new Vector3(1.05, 0.55, -0.55), new Vector3(1.05, -0.55, -0.55)],
            [new Vector3(-0.95, -0.65, 0.45), new Vector3(-0.15, 0.15, 0.95), new Vector3(0.85, 0.55, 0.15), new Vector3(0.25, -0.25, -0.85), new Vector3(-0.75, 0.45, -0.35)],
            [new Vector3(-0.85, 0.55, 0.55), new Vector3(-0.15, 0.85, 0.05), new Vector3(0.65, 0.35, -0.45), new Vector3(0.95, -0.45, 0.15), new Vector3(0.25, -0.75, 0.55)],
        ];
        return new CatmullRomCurve3(sets[s], false, 'centripetal', 0.5);
    }
    if (ribbon === 1) {
        const sets = [
            [new Vector3(1.0, 0.55, 0.15), new Vector3(0.35, 0.15, 0.85), new Vector3(-0.35, -0.45, 0.35), new Vector3(-0.9, 0.05, -0.45), new Vector3(-0.35, 0.65, -0.65)],
            [new Vector3(1.45, 0.45, -0.15), new Vector3(0.55, 0.05, 0.65), new Vector3(-0.45, -0.25, 0.25), new Vector3(-1.25, 0.15, -0.25), new Vector3(-1.5, 0.55, 0.25)],
            [new Vector3(-1.05, -0.05, 0.45), new Vector3(-0.35, -0.05, 0.85), new Vector3(0.35, -0.05, 0.45), new Vector3(0.95, -0.05, -0.15), new Vector3(1.15, -0.35, -0.35)],
            [new Vector3(-0.75, -0.75, -0.35), new Vector3(0.75, -0.75, -0.35), new Vector3(0.85, 0.15, 0.25), new Vector3(0.75, 0.75, 0.45), new Vector3(-0.75, 0.75, 0.45)],
            [new Vector3(0.85, -0.55, 0.65), new Vector3(-0.15, -0.15, 0.95), new Vector3(-0.85, 0.45, 0.15), new Vector3(-0.25, 0.35, -0.85), new Vector3(0.75, -0.25, -0.45)],
            [new Vector3(0.75, -0.65, 0.45), new Vector3(0.95, 0.05, -0.15), new Vector3(0.15, 0.75, -0.45), new Vector3(-0.75, 0.35, 0.15), new Vector3(-0.55, -0.55, 0.55)],
        ];
        return new CatmullRomCurve3(sets[s], false, 'centripetal', 0.5);
    }
    const sets = [
        [new Vector3(-0.25, -0.9, 0.45), new Vector3(0.55, -0.35, 0.15), new Vector3(0.25, 0.35, -0.7), new Vector3(-0.65, 0.5, -0.15), new Vector3(-0.95, -0.05, 0.4)],
        [new Vector3(-0.45, -0.75, 0.65), new Vector3(0.75, -0.15, 0.35), new Vector3(0.95, 0.45, -0.25), new Vector3(-0.15, 0.75, -0.55), new Vector3(-1.05, 0.15, 0.15)],
        [new Vector3(-1.0, -0.55, 0.25), new Vector3(-0.3, -0.55, 0.75), new Vector3(0.4, -0.55, 0.35), new Vector3(1.0, -0.55, -0.15), new Vector3(1.1, -0.15, -0.35)],
        [new Vector3(-0.95, 0.0, 0.65), new Vector3(-0.35, 0.65, 0.15), new Vector3(0.35, 0.65, -0.35), new Vector3(0.95, 0.0, -0.65), new Vector3(0.35, -0.65, -0.15)],
        [new Vector3(-0.55, 0.75, 0.35), new Vector3(0.55, 0.35, 0.75), new Vector3(0.75, -0.45, 0.15), new Vector3(-0.15, -0.75, -0.55), new Vector3(-0.85, -0.05, -0.25)],
        [new Vector3(-0.35, 0.15, 0.85), new Vector3(0.45, 0.65, 0.25), new Vector3(0.75, -0.15, -0.45), new Vector3(-0.25, -0.65, -0.25), new Vector3(-0.75, -0.05, 0.35)],
    ];
    return new CatmullRomCurve3(sets[s], false, 'centripetal', 0.5);
}
function tubeRadius(ribbon, shape) {
    const base = ribbon === 0 ? 0.152 : ribbon === 1 ? 0.124 : 0.108;
    const thick = [1, 0.92, 1.05, 0.88, 0.95, 0.82][shape] ?? 1;
    return base * thick;
}
function createRibbonMorphGeometry(ribbon, segments) {
    const radial = 36;
    const geos = Array.from({ length: 6 }, (_, shape) => {
        const curve = curveFor(ribbon, shape);
        const geo = new TubeGeometry(curve, segments, tubeRadius(ribbon, shape), radial, false);
        geo.computeVertexNormals();
        return geo;
    });
    const base = geos[0];
    const morphPositions = [];
    const morphNormals = [];
    for (let i = 1; i < geos.length; i++) {
        const geo = geos[i];
        morphPositions.push(geo.getAttribute('position').clone());
        morphNormals.push(geo.getAttribute('normal').clone());
        geo.dispose();
    }
    base.morphAttributes.position = morphPositions;
    base.morphAttributes.normal = morphNormals;
    return base;
}
function lerpPose(a, b, t) {
    const mix = (x, y) => MathUtils.lerp(x, y, t);
    const mixRing = (ra, rb) => ({
        s: mix(ra.s, rb.s),
        rx: mix(ra.rx, rb.rx),
        ry: mix(ra.ry, rb.ry),
        rz: mix(ra.rz, rb.rz),
        x: mix(ra.x, rb.x),
        y: mix(ra.y, rb.y),
        z: mix(ra.z, rb.z),
    });
    return {
        rotY: mix(a.rotY, b.rotY),
        rotX: mix(a.rotX, b.rotX),
        rotZ: mix(a.rotZ, b.rotZ),
        lift: mix(a.lift, b.lift),
        scale: mix(a.scale, b.scale),
        core: mix(a.core, b.core),
        ringA: mixRing(a.ringA, b.ringA),
        ringB: mixRing(a.ringB, b.ringB),
        ribbon: {
            s: mix(a.ribbon.s, b.ribbon.s),
            ry: mix(a.ribbon.ry, b.ribbon.ry),
            rx: mix(a.ribbon.rx, b.ribbon.rx),
        },
        nodes: mix(a.nodes, b.nodes),
        blue: mix(a.blue, b.blue),
        orange: mix(a.orange, b.orange),
        cam: {
            x: mix(a.cam.x, b.cam.x),
            y: mix(a.cam.y, b.cam.y),
            z: mix(a.cam.z, b.cam.z),
        },
    };
}
function samplePose(progress) {
    const clamped = MathUtils.clamp(progress, 0, poses.length - 1);
    const i0 = Math.floor(clamped);
    const i1 = Math.min(poses.length - 1, i0 + 1);
    const f = clamped - i0;
    return lerpPose(poses[i0], poses[i1], f);
}
function applyMorphBlend(mesh, progress) {
    const influences = mesh.morphTargetInfluences;
    if (!influences || influences.length < 5)
        return;
    for (let i = 0; i < influences.length; i++)
        influences[i] = 0;
    const clamped = MathUtils.clamp(progress, 0, 5);
    const i0 = Math.floor(clamped);
    const i1 = Math.min(5, i0 + 1);
    const f = clamped - i0;
    if (i0 === 0 && i1 === 0)
        return;
    if (i0 === i1) {
        if (i0 > 0)
            influences[i0 - 1] = 1;
        return;
    }
    if (i0 === 0) {
        influences[0] = f;
        return;
    }
    influences[i0 - 1] = 1 - f;
    influences[i1 - 1] = f;
}
function SculptureScene({ activeIndex, pointer, hovered, pulse, mobile, reducedMotion, }) {
    const root = useRef(null);
    const core = useRef(null);
    const ringA = useRef(null);
    const ringB = useRef(null);
    const ribbonGroup = useRef(null);
    const nodesGroup = useRef(null);
    const ribbonMeshes = useRef([]);
    const blueLight = useRef(null);
    const orangeLight = useRef(null);
    const keyLight = useRef(null);
    const accentPoint = useRef(null);
    const shapeProgress = useRef(activeIndex);
    const lightState = useRef({ blue: poses[0].blue, orange: poses[0].orange });
    const material = useMemo(() => new MeshPhysicalMaterial({
        color: matteBase.clone(),
        roughness: 0.34,
        metalness: 0.02,
        clearcoat: 0.72,
        clearcoatRoughness: 0.22,
        sheen: 0.45,
        sheenRoughness: 0.38,
        sheenColor: new Color('#ffffff'),
        envMapIntensity: 0.85,
        specularIntensity: 0.55,
        reflectivity: 0.42,
    }), []);
    const materialRef = useRef(material);
    useEffect(() => {
        materialRef.current = material;
    }, [material]);
    const segments = mobile ? 80 : 140;
    const ribbons = useMemo(() => {
        const count = mobile ? 2 : 3;
        return Array.from({ length: count }, (_, index) => createRibbonMorphGeometry(index, segments));
    }, [mobile, segments]);
    useEffect(() => {
        return () => {
            material.dispose();
            ribbons.forEach((geometry) => geometry.dispose());
        };
    }, [material, ribbons]);
    useFrame((state, delta) => {
        const group = root.current;
        if (!group)
            return;
        const dampSpeed = reducedMotion ? 12 : 3.8;
        shapeProgress.current = MathUtils.damp(shapeProgress.current, activeIndex, dampSpeed, delta);
        const pose = samplePose(shapeProgress.current);
        const morphFrac = shapeProgress.current - Math.floor(shapeProgress.current);
        const crossing = morphFrac > 0.001 && morphFrac < 0.999 ? Math.sin(morphFrac * Math.PI) : 0;
        const t = state.clock.elapsedTime;
        const idle = reducedMotion ? 0 : 1;
        const pointerGain = hovered ? 0.22 : 0.12;
        lightState.current.blue = MathUtils.damp(lightState.current.blue, pose.blue * (hovered ? 1.4 : 1), 3.2, delta);
        lightState.current.orange = MathUtils.damp(lightState.current.orange, pose.orange * (hovered ? 1.45 : 1), 3.2, delta);
        group.rotation.y = MathUtils.damp(group.rotation.y, pose.rotY + Math.sin(t * 0.34) * 0.028 * idle + pointer.x * pointerGain + crossing * 0.08, 4.6, delta);
        group.rotation.x = MathUtils.damp(group.rotation.x, pose.rotX + Math.cos(t * 0.28) * 0.016 * idle - pointer.y * pointerGain * 0.65 - crossing * 0.04, 4.6, delta);
        group.rotation.z = MathUtils.damp(group.rotation.z, pose.rotZ + pointer.x * -0.035, 4, delta);
        group.position.y = MathUtils.damp(group.position.y, pose.lift + Math.sin(t * 0.45) * 0.032 * idle + crossing * 0.09, 4, delta);
        group.position.z = MathUtils.damp(group.position.z, crossing * -0.18, 4, delta);
        const breath = reducedMotion ? 1 : 1 + Math.sin(t * 0.5) * 0.009;
        const nextScale = pose.scale * breath * (1 - pulse * 0.06) * (1 - crossing * 0.045) * (mobile ? 0.9 : 1);
        group.scale.setScalar(MathUtils.damp(group.scale.x || nextScale, nextScale, 4.8, delta));
        if (core.current) {
            core.current.scale.setScalar(MathUtils.damp(core.current.scale.x, pose.core, 4.2, delta));
        }
        if (ringA.current) {
            const r = pose.ringA;
            ringA.current.scale.setScalar(MathUtils.damp(ringA.current.scale.x || r.s, r.s, 4.2, delta));
            ringA.current.rotation.x = MathUtils.damp(ringA.current.rotation.x, r.rx, 4.2, delta);
            ringA.current.rotation.y = MathUtils.damp(ringA.current.rotation.y, r.ry, 4.2, delta);
            ringA.current.rotation.z = MathUtils.damp(ringA.current.rotation.z, r.rz, 4.2, delta);
            ringA.current.position.x = MathUtils.damp(ringA.current.position.x, r.x, 4.2, delta);
            ringA.current.position.y = MathUtils.damp(ringA.current.position.y, r.y, 4.2, delta);
            ringA.current.position.z = MathUtils.damp(ringA.current.position.z, r.z, 4.2, delta);
        }
        if (ringB.current) {
            const r = pose.ringB;
            ringB.current.scale.setScalar(MathUtils.damp(ringB.current.scale.x || r.s, r.s, 4.2, delta));
            ringB.current.rotation.x = MathUtils.damp(ringB.current.rotation.x, r.rx, 4.2, delta);
            ringB.current.rotation.y = MathUtils.damp(ringB.current.rotation.y, r.ry, 4.2, delta);
            ringB.current.rotation.z = MathUtils.damp(ringB.current.rotation.z, r.rz, 4.2, delta);
            ringB.current.position.x = MathUtils.damp(ringB.current.position.x, r.x, 4.2, delta);
            ringB.current.position.y = MathUtils.damp(ringB.current.position.y, r.y, 4.2, delta);
            ringB.current.position.z = MathUtils.damp(ringB.current.position.z, r.z, 4.2, delta);
        }
        if (ribbonGroup.current) {
            ribbonGroup.current.scale.setScalar(MathUtils.damp(ribbonGroup.current.scale.x || pose.ribbon.s, pose.ribbon.s, 4.2, delta));
            ribbonGroup.current.rotation.y = MathUtils.damp(ribbonGroup.current.rotation.y, pose.ribbon.ry, 4.2, delta);
            ribbonGroup.current.rotation.x = MathUtils.damp(ribbonGroup.current.rotation.x, pose.ribbon.rx, 4.2, delta);
        }
        ribbonMeshes.current.forEach((mesh) => applyMorphBlend(mesh, shapeProgress.current));
        if (nodesGroup.current) {
            const nodeScale = MathUtils.damp(nodesGroup.current.scale.x || 0.001, Math.max(0.001, pose.nodes), 4.5, delta);
            nodesGroup.current.scale.setScalar(nodeScale);
            nodesGroup.current.visible = nodeScale > 0.04;
            nodesGroup.current.rotation.y = t * 0.1 * idle;
        }
        const mat = materialRef.current;
        mat.color
            .copy(matteBase)
            .lerp(brandBlue, lightState.current.blue * 0.055)
            .lerp(brandOrange, lightState.current.orange * 0.03);
        mat.sheenColor.copy(tintScratch.copy(white).lerp(brandBlue, lightState.current.blue * 0.18));
        mat.envMapIntensity =
            0.78 + lightState.current.blue * 0.28 + (hovered ? 0.16 : 0) + pulse * 0.14 + crossing * 0.12;
        mat.clearcoat = 0.68 + (hovered ? 0.08 : 0) + crossing * 0.06;
        if (keyLight.current) {
            keyLight.current.intensity = MathUtils.damp(keyLight.current.intensity, 1.35 + crossing * 0.15, 3, delta);
            keyLight.current.position.x = MathUtils.damp(keyLight.current.position.x, 3.2 + pointer.x * 0.45, 2.8, delta);
            keyLight.current.position.y = MathUtils.damp(keyLight.current.position.y, 4.8 + pointer.y * 0.25, 2.8, delta);
        }
        if (blueLight.current)
            blueLight.current.intensity = 0.22 + lightState.current.blue * 0.62;
        if (orangeLight.current)
            orangeLight.current.intensity = 0.12 + lightState.current.orange * 0.42;
        if (accentPoint.current) {
            accentPoint.current.intensity = MathUtils.damp(accentPoint.current.intensity, hovered ? 0.55 : 0.28 + crossing * 0.2, 3, delta);
            accentPoint.current.position.x = MathUtils.damp(accentPoint.current.position.x, pointer.x * 1.4, 3, delta);
            accentPoint.current.position.y = MathUtils.damp(accentPoint.current.position.y, 0.6 + pointer.y * 0.8, 3, delta);
        }
    });
    const nodePositions = useMemo(() => [
        [0.72, 0.42, 0.18],
        [-0.68, 0.28, -0.22],
        [0.18, -0.55, 0.48],
        [-0.22, 0.62, -0.42],
        [0.55, -0.18, -0.55],
        [-0.48, -0.42, 0.28],
    ], []);
    return (_jsxs(_Fragment, { children: [_jsx(SoftShadows, { size: 18, samples: mobile ? 8 : 14, focus: 0.65 }), _jsx("ambientLight", { intensity: 0.42 }), _jsx("hemisphereLight", { args: ['#ffffff', '#EFEDE8', 0.7] }), _jsx("directionalLight", { ref: keyLight, castShadow: true, position: [3.2, 4.8, 2.4], intensity: 1.35, "shadow-mapSize": [mobile ? 1024 : 2048, mobile ? 1024 : 2048], "shadow-bias": -0.00018, "shadow-normalBias": 0.02 }), _jsx("directionalLight", { ref: blueLight, position: [-3.8, 2.2, -1.8], color: brandBlue, intensity: 0.34 }), _jsx("directionalLight", { ref: orangeLight, position: [2.2, -0.2, 3.6], color: brandOrange, intensity: 0.2 }), _jsx("directionalLight", { position: [-1.6, 3.4, -3.6], intensity: 0.45, color: "#FFF8F2" }), _jsx("pointLight", { ref: accentPoint, position: [0.8, 0.8, 1.6], intensity: 0.28, distance: 6, decay: 2, color: "#FFFFFF" }), _jsxs("group", { ref: root, children: [_jsx("group", { ref: core, children: _jsx("mesh", { castShadow: true, receiveShadow: true, material: material, children: _jsx("sphereGeometry", { args: [0.45, mobile ? 48 : 96, mobile ? 48 : 96] }) }) }), _jsx("group", { ref: ringA, children: _jsx("mesh", { castShadow: true, receiveShadow: true, material: material, children: _jsx("torusGeometry", { args: [0.64, 0.128, mobile ? 28 : 48, mobile ? 96 : 160] }) }) }), _jsx("group", { ref: ringB, children: _jsx("mesh", { castShadow: true, receiveShadow: true, material: material, children: _jsx("torusGeometry", { args: [0.5, 0.092, mobile ? 24 : 40, mobile ? 84 : 140] }) }) }), _jsx("group", { ref: ribbonGroup, children: ribbons.map((geometry, index) => (_jsx("mesh", { castShadow: true, receiveShadow: true, geometry: geometry, material: material, morphTargetInfluences: [0, 0, 0, 0, 0], ref: (node) => {
                                if (!node)
                                    return;
                                ribbonMeshes.current[index] = node;
                                if (!node.morphTargetInfluences || node.morphTargetInfluences.length < 5) {
                                    node.updateMorphTargets();
                                }
                            } }, index))) }), _jsx("group", { ref: nodesGroup, scale: 0.001, visible: false, children: nodePositions.map(([x, y, z], index) => (_jsx("mesh", { castShadow: true, receiveShadow: true, material: material, position: [x, y, z], children: _jsx("sphereGeometry", { args: [0.15 - index * 0.008, mobile ? 24 : 36, mobile ? 24 : 36] }) }, index))) })] }), _jsx(ContactShadows, { position: [0, -1.22, 0], opacity: 0.48, scale: 10, blur: 3.6, far: 5, resolution: mobile ? 512 : 1024, color: "#1A222B" })] }));
}
function CameraRig({ activeIndex, pointer, reducedMotion, }) {
    const { camera } = useThree();
    const progress = useRef(activeIndex);
    useFrame((_, delta) => {
        progress.current = MathUtils.damp(progress.current, activeIndex, reducedMotion ? 12 : 3.8, delta);
        const pose = samplePose(progress.current);
        const morphFrac = progress.current - Math.floor(progress.current);
        const crossing = morphFrac > 0.001 && morphFrac < 0.999 ? Math.sin(morphFrac * Math.PI) : 0;
        const nextX = pose.cam.x + pointer.x * 0.16;
        const nextY = pose.cam.y + pointer.y * 0.09 + crossing * 0.06;
        const nextZ = pose.cam.z + crossing * 0.22;
        camera.position.set(MathUtils.damp(camera.position.x, nextX, 3.6, delta), MathUtils.damp(camera.position.y, nextY, 3.6, delta), MathUtils.damp(camera.position.z, nextZ, 3.6, delta));
        camera.lookAt(0, 0.04, 0);
    });
    return null;
}
export function ServiceSculpture({ activeIndex, scrollProgress: _scrollProgress = 0.55, mode = 'desktop', }) {
    const wrap = useRef(null);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [pulse, setPulse] = useState(0);
    const [clickToken, setClickToken] = useState(0);
    const [reducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mobile = mode !== 'desktop';
    const interactive = mode === 'desktop' && !reducedMotion;
    useEffect(() => {
        if (clickToken === 0)
            return;
        let frame = 0;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min(1, (now - start) / 860);
            setPulse(Math.sin(t * Math.PI));
            if (t < 1)
                frame = requestAnimationFrame(tick);
            else
                setPulse(0);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [clickToken]);
    function onMove(event) {
        if (!interactive || !wrap.current)
            return;
        const rect = wrap.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        setPointer({
            x: MathUtils.clamp(x, -1, 1),
            y: MathUtils.clamp(y, -1, 1),
        });
    }
    return (_jsx("div", { ref: wrap, className: "h-full w-full touch-pan-y overflow-hidden", onPointerMove: onMove, onPointerEnter: () => interactive && setHovered(true), onPointerLeave: () => {
            setHovered(false);
            setPointer({ x: 0, y: 0 });
        }, onPointerDown: () => interactive && setClickToken((value) => value + 1), role: "img", "aria-label": "Abstract three-dimensional services sculpture", children: _jsx(Canvas, { shadows: true, dpr: mobile ? [1, 1.25] : [1, 1.85], gl: { antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }, camera: { position: [1.5, 0.4, 3.5], fov: 36, near: 0.1, far: 40 }, style: { width: '100%', height: '100%', background: 'transparent' }, onCreated: ({ gl }) => {
                gl.setClearColor(0x000000, 0);
                gl.outputColorSpace = SRGBColorSpace;
                gl.toneMappingExposure = 1.08;
            }, children: _jsxs(Suspense, { fallback: null, children: [_jsx(CameraRig, { activeIndex: activeIndex, pointer: pointer, reducedMotion: reducedMotion }), _jsx(SculptureScene, { activeIndex: activeIndex, pointer: pointer, hovered: hovered, pulse: pulse, mobile: mobile, reducedMotion: reducedMotion }), _jsx(Environment, { preset: "studio", environmentIntensity: 0.72 })] }) }) }));
}
