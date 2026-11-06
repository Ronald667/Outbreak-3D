import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GameMode, MapType, Weapon, Zombie, Teammate, Grenade, GameStats, CraftingRecipe } from '../types/game';
import { INITIAL_WEAPONS } from '../utils/gameConstants';
import { soundManager } from '../utils/audio';
import { KillFeedItem } from './KillFeed';

interface GameCanvasProps {
  mode: GameMode;
  mapType: MapType;
  onGameOver: (score: number, wave: number, stats: GameStats) => void;
  onOpenShop: () => void;
  onOpenCrafting: () => void;
  onUpdateHUD: (data: {
    health: number;
    maxHealth: number;
    armor: number;
    points: number;
    wave: number;
    zombiesRemaining: number;
    currentWeapon: Weapon;
    ammo: number;
    reserveAmmo: number;
    activePerks: string[];
    interactionPrompt: string | null;
    grenadesCount: number;
    components: Record<string, number>;
  }) => void;
  shopOpen: boolean;
  craftingOpen: boolean;
  onTriggerShop: () => void;
  onTriggerCrafting: () => void;
  currentWeaponId: string;
  ownedWeapons: Record<string, Weapon>;
  activePerks: string[];
  grenadesCount: number;
  components: Record<string, number>;
  onAddComponent: (type: string, amount: number) => void;
  onAddKillFeedEvent: (type: KillFeedItem['type'], text: string) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  mode,
  mapType,
  onGameOver,
  onOpenShop,
  onOpenCrafting,
  onUpdateHUD,
  shopOpen,
  craftingOpen,
  onTriggerShop,
  onTriggerCrafting,
  currentWeaponId,
  ownedWeapons,
  activePerks,
  grenadesCount,
  components,
  onAddComponent,
  onAddKillFeedEvent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef({
    health: 100,
    maxHealth: 100,
    armor: 50,
    points: 500,
    wave: 1,
    zombiesRemaining: 0,
    ammo: 8,
    reserveAmmo: 64,
    grenades: grenadesCount,
    isReloading: false,
    hordeRushActive: false,
    hazardWarning: null as string | null,
    stats: {
      kills: 0,
      headshots: 0,
      wavesSurvived: 0,
      pointsEarned: 500,
      shotsFired: 0,
      shotsHit: 0,
      itemsCrafted: 0
    }
  });

  useEffect(() => {
    if (activePerks.includes('juggernog')) {
      stateRef.current.maxHealth = 250;
      stateRef.current.health = Math.max(stateRef.current.health, 250);
    }
  }, [activePerks]);

  useEffect(() => {
    if (!containerRef.current) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    const fogColor = mapType === 'cyber' ? 0x050510 : mapType === 'wasteland' ? 0x3d2817 : 0x0a0a0f;
    scene.background = new THREE.Color(fogColor);
    scene.fog = new THREE.FogExp2(fogColor, mapType === 'facility' ? 0.025 : 0.015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.7, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const ambientLight = new THREE.AmbientLight(0xffffff, mapType === 'cyber' ? 0.3 : 0.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(mapType === 'cyber' ? 0x9966ff : 0xffeedd, 1.2);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    const barrels: THREE.Mesh[] = [];

    const buildMap = () => {
      const floorGeo = new THREE.PlaneGeometry(100, 100, 32, 32);
      const floorMat = new THREE.MeshStandardMaterial({
        color: mapType === 'cyber' ? 0x111122 : mapType === 'wasteland' ? 0x4a3525 : 0x1a1a24,
        roughness: 0.8,
        metalness: 0.2
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const wallMat = new THREE.MeshStandardMaterial({
        color: mapType === 'cyber' ? 0x1a0b2e : mapType === 'wasteland' ? 0x5c4033 : 0x222233,
        roughness: 0.6
      });

      const wallGeo = new THREE.BoxGeometry(100, 10, 2);
      const wall1 = new THREE.Mesh(wallGeo, wallMat);
      wall1.position.set(0, 5, -50);
      wall1.castShadow = true;
      wall1.receiveShadow = true;
      scene.add(wall1);

      const wall2 = wall1.clone();
      wall2.position.set(0, 5, 50);
      scene.add(wall2);

      const wall3 = new THREE.Mesh(new THREE.BoxGeometry(2, 10, 100), wallMat);
      wall3.position.set(-50, 5, 0);
      wall3.castShadow = true;
      scene.add(wall3);

      const wall4 = wall3.clone();
      wall4.position.set(50, 5, 0);
      scene.add(wall4);

      for (let i = 0; i < 6; i++) {
        const barrelGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 16);
        const barrelMat = new THREE.MeshStandardMaterial({
          color: 0xcc2222,
          metalness: 0.6,
          roughness: 0.3
        });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.set(
          (Math.random() - 0.5) * 60,
          1.25,
          (Math.random() - 0.5) * 60
        );
        barrel.castShadow = true;
        scene.add(barrel);
        barrels.push(barrel);
      }

      const papGeo = new THREE.BoxGeometry(3, 4, 3);
      const papMat = new THREE.MeshStandardMaterial({ color: 0x8a2be2, roughness: 0.2, metalness: 0.8 });
      const pap = new THREE.Mesh(papGeo, papMat);
      pap.position.set(0, 2, -25);
      pap.castShadow = true;
      scene.add(pap);

      const benchGeo = new THREE.BoxGeometry(3, 3, 2);
      const benchMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.4, metalness: 0.5 });
      const bench = new THREE.Mesh(benchGeo, benchMat);
      bench.position.set(-20, 1.5, -20);
      bench.castShadow = true;
      scene.add(bench);
    };

    buildMap();

    const player = {
      x: 0,
      z: 10,
      yaw: 0,
      pitch: 0,
      speed: 8
    };

    const zombies: Zombie[] = [];
    const teammates: Teammate[] = [];
    if (mode === 'coop') {
      teammates.push({
        id: 'ally_1',
        name: 'Sgt. Miller',
        x: 3,
        z: 8,
        hp: 150,
        maxHp: 150,
        targetZombieId: null
      });
    }

    const spawnWave = (waveNum: number, isHordeRush = false) => {
      const count = (isHordeRush ? 12 : 5) + waveNum * 4;
      stateRef.current.zombiesRemaining += count;

      if (isHordeRush) {
        stateRef.current.hordeRushActive = true;
        stateRef.current.hazardWarning = 'WARNING: ZOMBIE HORDE RUSH INCOMING!';
        soundManager.playExplosion();
        onAddKillFeedEvent('headshot', 'WARNING: Horde Rush incoming!');
        setTimeout(() => {
          stateRef.current.hazardWarning = null;
          stateRef.current.hordeRushActive = false;
        }, 4000);
      }

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = isHordeRush ? 20 + Math.random() * 15 : 40 + Math.random() * 20;
        const typeRoll = Math.random();
        let type: 'walker' | 'runner' | 'brute' | 'crawler' = 'walker';
        let hp = 100 + waveNum * 25;
        let speed = (isHordeRush ? 6 : 4) + waveNum * 0.2;

        if (waveNum >= 3 && typeRoll < 0.3) {
          type = 'runner';
          speed = 7 + waveNum * 0.3;
          hp = 70 + waveNum * 15;
        } else if (waveNum >= 5 && typeRoll < 0.15) {
          type = 'brute';
          speed = 2.5;
          hp = 350 + waveNum * 100;
        }

        const zx = player.x + Math.cos(angle) * dist;
        const zz = player.z + Math.sin(angle) * dist;

        const group = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({
          color: type === 'brute' ? 0x225522 : type === 'runner' ? 0x553333 : 0x3d4a3a,
          roughness: 0.7
        });

        const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.8), bodyMat);
        torso.position.y = 1.8;
        torso.castShadow = true;
        group.add(torso);

        const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), bodyMat);
        head.position.y = 3.0;
        head.castShadow = true;
        group.add(head);

        group.position.set(zx, 0, zz);
        scene.add(group);

        zombies.push({
          id: Math.random().toString(),
          type,
          x: zx,
          z: zz,
          hp,
          maxHp: hp,
          speed,
          damage: type === 'brute' ? 45 : 20,
          attackCooldown: 0,
          isCrawler: false,
          meshGroup: group
        });
      }
    };

    spawnWave(1);

    const keys: Record<string, boolean> = {};
    const onKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === 'KeyB') {
        onTriggerShop();
      }
      if (e.code === 'KeyC') {
        onTriggerCrafting();
      }
      if (e.code === 'KeyR' && !stateRef.current.isReloading) {
        stateRef.current.isReloading = true;
        soundManager.playClick();
        const reloadMultiplier = activePerks.includes('speedcola') ? 0.5 : 1.0;
        setTimeout(() => {
          stateRef.current.ammo = ownedWeapons[currentWeaponId]?.magSize || 8;
          stateRef.current.isReloading = false;
        }, (ownedWeapons[currentWeaponId]?.reloadTime || 1.5) * 1000 * reloadMultiplier);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === renderer.domElement) {
        player.yaw -= e.movementX * 0.002;
        player.pitch -= e.movementY * 0.002;
        player.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, player.pitch));
      }
    };

    const onClick = () => {
      if (document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock();
        return;
      }

      if (shopOpen || craftingOpen || stateRef.current.isReloading) return;
      const weapon = ownedWeapons[currentWeaponId];
      if (!weapon || stateRef.current.ammo <= 0) return;

      stateRef.current.ammo--;
      stateRef.current.stats.shotsFired++;
      soundManager.playGunshot(weapon.id);

      const raycaster = new THREE.Raycaster();
      const center = new THREE.Vector2(0, 0);
      raycaster.setFromCamera(center, camera);

      for (const barrel of barrels) {
        const box = new THREE.Box3().setFromObject(barrel);
        if (raycaster.ray.intersectBox(box, new THREE.Vector3())) {
          soundManager.playExplosion();
          scene.remove(barrel);
          onAddKillFeedEvent('kill', 'Explosive Barrel Detonated!');
          zombies.forEach(z => {
            const dist = Math.sqrt((z.x - barrel.position.x) ** 2 + (z.z - barrel.position.z) ** 2);
            if (dist < 10) {
              z.hp -= 300;
            }
          });
          break;
        }
      }

      let hitZombie: Zombie | null = null;
      let isHeadshot = false;

      for (const z of zombies) {
        if (!z.meshGroup) continue;
        const box = new THREE.Box3().setFromObject(z.meshGroup);
        const intersection = raycaster.ray.intersectBox(box, new THREE.Vector3());
        if (intersection) {
          hitZombie = z;
          if (intersection.y > 2.5) {
            isHeadshot = true;
          }
          break;
        }
      }

      if (hitZombie) {
        stateRef.current.stats.shotsHit++;
        
        // Play hit marker audio cue with distinct pitch for headshots
        soundManager.playHitMarker(isHeadshot);

        const fireRateMult = activePerks.includes('doubletap') ? 1.5 : 1.0;
        const dmg = weapon.damage * (isHeadshot ? 2.5 : 1.0) * (weapon.isUpgraded ? 2.0 : 1.0) * fireRateMult;
        hitZombie.hp -= dmg;

        if (isHeadshot) {
          stateRef.current.stats.headshots++;
        }

        if (hitZombie.hp <= 0) {
          scene.remove(hitZombie.meshGroup);
          const index = zombies.indexOf(hitZombie);
          if (index > -1) zombies.splice(index, 1);

          stateRef.current.stats.kills++;
          const ptsEarned = isHeadshot ? 100 : 50;
          stateRef.current.points += ptsEarned;
          stateRef.current.stats.pointsEarned += ptsEarned;
          stateRef.current.zombiesRemaining--;

          const compTypes = ['scrap', 'wood', 'wire', 'explosives'];
          const droppedComp = compTypes[Math.floor(Math.random() * compTypes.length)];
          onAddComponent(droppedComp, 1);

          if (isHeadshot) {
            onAddKillFeedEvent('headshot', `HEADSHOT! Eliminated ${hitZombie.type.toUpperCase()}`);
          } else {
            onAddKillFeedEvent('kill', `Eliminated ${hitZombie.type.toUpperCase()}`);
          }

          if (stateRef.current.zombiesRemaining <= 0) {
            stateRef.current.wave++;
            stateRef.current.stats.wavesSurvived++;
            const isRush = Math.random() < 0.4;
            spawnWave(stateRef.current.wave, isRush);
            onAddKillFeedEvent('upgrade', `Wave ${stateRef.current.wave} Commencing`);
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    let clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      const dt = clock.getDelta();

      const moveSpeed = player.speed * (activePerks.includes('staminup') ? 1.4 : 1.0);
      const forward = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
      const strafe = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);

      const moveDir = new THREE.Vector3(strafe, 0, forward).normalize();
      moveDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.yaw);

      player.x += moveDir.x * moveSpeed * dt;
      player.z += moveDir.z * moveSpeed * dt;

      player.x = Math.max(-48, Math.min(48, player.x));
      player.z = Math.max(-48, Math.min(48, player.z));

      camera.position.set(player.x, 1.7, player.z);
      const euler = new THREE.Euler(player.pitch, player.yaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);

      for (const z of zombies) {
        if (!z.meshGroup) continue;
        const dx = player.x - z.x;
        const dz = player.z - z.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 1.5) {
          z.x += (dx / dist) * z.speed * dt;
          z.z += (dz / dist) * z.speed * dt;
          z.meshGroup.position.set(z.x, 0, z.z);
          z.meshGroup.lookAt(player.x, z.meshGroup.position.y, player.z);
        } else {
          z.attackCooldown -= dt;
          if (z.attackCooldown <= 0) {
            z.attackCooldown = 1.0;
            const damageMult = activePerks.includes('juggernog') ? 0.5 : 1.0;
            stateRef.current.health -= z.damage * damageMult;
            soundManager.playZombieGroan();

            if (stateRef.current.health <= 0) {
              if (activePerks.includes('quickrevive')) {
                stateRef.current.health = 100;
                soundManager.playPerkJingle();
                onAddKillFeedEvent('perk', 'Quick Revive activated self-res!');
              } else {
                onGameOver(stateRef.current.points, stateRef.current.wave, stateRef.current.stats);
              }
            }
          }
        }
      }

      for (const ally of teammates) {
        const dx = player.x - ally.x;
        const dz = player.z - ally.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 3) {
          ally.x += (dx / dist) * 5 * dt;
          ally.z += (dz / dist) * 5 * dt;
        }
      }

      let prompt: string | null = null;
      if (Math.abs(player.x) < 3 && Math.abs(player.z - (-25)) < 3) {
        prompt = 'Press B for Pack-a-Punch & Arsenal Shop';
      } else if (Math.abs(player.x - (-20)) < 3 && Math.abs(player.z - (-20)) < 3) {
        prompt = 'Press C for Crafting Workbench';
      }

      onUpdateHUD({
        health: stateRef.current.health,
        maxHealth: stateRef.current.maxHealth,
        armor: stateRef.current.armor,
        points: stateRef.current.points,
        wave: stateRef.current.wave,
        zombiesRemaining: stateRef.current.zombiesRemaining,
        currentWeapon: ownedWeapons[currentWeaponId],
        ammo: stateRef.current.ammo,
        reserveAmmo: stateRef.current.reserveAmmo,
        activePerks,
        interactionPrompt: prompt || stateRef.current.hazardWarning,
        grenadesCount: stateRef.current.grenades,
        components
      });

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        setTimeout(tick, 50);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [mapType, mode]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-crosshair" />;
};
