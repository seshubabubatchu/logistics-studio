"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSmoothScroll } from "../ui/SmoothScrollProvider";

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenis = useSmoothScroll();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 25;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // GLOBE (Dotted/Wireframe)
    const globeRadius = 10;
    const segments = 64;
    const geometry = new THREE.SphereGeometry(globeRadius, segments, segments);

    // Create dotted material using Points
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x22D3EE, // Electric cyan accent
      size: 0.05,
      transparent: true,
      opacity: 0.4,
    });
    const globe = new THREE.Points(geometry, pointsMaterial);
    scene.add(globe);


    const createTextSprite = (text: string, color: string, fontSize: number = 24) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      context.font = `${fontSize}px 'JetBrains Mono', monospace`;
      const metrics = context.measureText(text);
      canvas.width = metrics.width + 10;
      canvas.height = fontSize + 10;

      context.font = `${fontSize}px 'JetBrains Mono', monospace`;
      context.fillStyle = color;
      context.fillText(text, 5, fontSize);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(spriteMaterial);

      // Scale sprite based on canvas size
      sprite.scale.set(canvas.width / 50, canvas.height / 50, 1);
      return sprite;
    };

    // NODES (Shipper, Carrier, Warehouse)
    const createNode = (lat: number, lon: number, label: string) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(globeRadius * Math.sin(phi) * Math.cos(theta));
      const y = globeRadius * Math.cos(phi);
      const z = globeRadius * Math.sin(phi) * Math.sin(theta);

      const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xF5A524 }); // Amber accent
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

      node.position.set(x, y, z);
      const labelSprite = createTextSprite(label, "#F2EFE8");
      if (labelSprite) {
        labelSprite.position.set(0, 0.8, 0);
        node.add(labelSprite);
      }
      return { mesh: node, position: new THREE.Vector3(x, y, z), label };
    };

    const nodes = [
      createNode(40, -100, "Shipper"),
      createNode(30, -80, "Carrier"),
      createNode(35, -120, "Warehouse")
    ];

    nodes.forEach(n => scene.add(n.mesh));

    // PACKETS (EDI 850/856/214/810) - Glowing rounded rectangles traveling on curves
    const packets: { mesh: THREE.Mesh, curve: THREE.QuadraticBezierCurve3, progress: number, speed: number }[] = [];

    let packetIdx = 0;
    const createPacket = (start: THREE.Vector3, end: THREE.Vector3) => {
      // Calculate a control point for the curve to arc over the globe
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      mid.normalize().multiplyScalar(globeRadius + distance * 0.3);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      const packetGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.1);
      const packetMaterial = new THREE.MeshBasicMaterial({ color: 0x22D3EE }); // Cyan
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);

      scene.add(packet);
      const packetLabelStr = ["850", "856", "214", "810"][packetIdx % 4];
      packetIdx++;
      const pLabel = createTextSprite(packetLabelStr, "#22D3EE", 16);
      if (pLabel) {
        pLabel.position.set(0, 0.5, 0);
        packet.add(pLabel);
      }

      packets.push({
        mesh: packet,
        curve,
        progress: 0,
        speed: 0.002 + Math.random() * 0.003
      });
    };

    // Create paths between nodes
    createPacket(nodes[0].position, nodes[1].position);
    createPacket(nodes[1].position, nodes[2].position);
    createPacket(nodes[2].position, nodes[0].position);

    // RAYCASTER & MOUSE ATTRACTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    const globePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // SCROLL ROTATION
    let targetRotationY = 0;

    const onScroll = () => {
      // Small rotation offset based on scroll progress
      if (lenis) {
        targetRotationY = lenis.scroll * 0.0005;
      } else {
        targetRotationY = window.scrollY * 0.0005;
      }
    };

    // If lenis is available via context, use it. Otherwise fallback.
    // Lenis context update doesn't natively trigger events here so we rely on animation loop check.

    // ANIMATION LOOP
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Scroll interaction
      onScroll();
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.1 + (0.05 * delta); // Base rotation + scroll offset
      scene.rotation.x = 0.2; // Slight tilt

      // Mouse attraction
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(globePlane, intersectionPoint);

      // Animate Packets
      packets.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const position = p.curve.getPoint(p.progress);

        // Attraction to mouse
        const worldPos = position.clone().applyMatrix4(scene.matrixWorld);
        const distToMouse = worldPos.distanceTo(intersectionPoint);

        if (distToMouse < 5) {
          // Attract towards mouse intersection
          const attraction = intersectionPoint.clone().sub(worldPos).normalize().multiplyScalar(1 - distToMouse / 5);
          position.add(attraction.multiplyScalar(0.5).applyMatrix4(scene.matrixWorld.clone().invert()));
        }

        p.mesh.position.copy(position);

        // Look ahead
        const lookAtPoint = p.curve.getPoint(Math.min(1, p.progress + 0.01));
        p.mesh.lookAt(lookAtPoint);
      });

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLER
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      pointsMaterial.dispose();
      nodes.forEach(n => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
      });
      packets.forEach(p => {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.Material).dispose();
      });

      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [lenis]);

  return <div ref={containerRef} className="absolute inset-0 z-0 opacity-80" />;
}
