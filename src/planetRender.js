import p5 from "p5";
import { useEffect, useRef } from "react";

export function PlanetRender({ planetDamage }) {
  const ref = useRef();

  useEffect(() => {
    ref.current.innerHTML = "";

    new p5((p) => {
      let poloNorte = [200, 100];
      let poloSur = [200, 300];
      let bias = 0.55 + planetDamage;
      let cBias = 0.45 + planetDamage;

      let stars = [];
      let velocity = [10, 10];

      let moonAnimationDuration = 30;
      let moonAnimationState = {
        lerp: 0,
        direction: 1,
        behind: false,
      };

      const drawPolo = (
        position,
        b,
        scl,
        maxDistanceFromPolo,
        planetPosition,
        planetRadius
      ) => {
        p.noiseDetail(8, 0.6);
        //console.log(b);
        for (let x = 0; x < p.width; x++) {
          for (let y = 0; y < p.height; y++) {
            let d = Math.sqrt(
              Math.pow(position[0] - x, 2) + Math.pow(position[1] - y, 2)
            );
            let dd = Math.sqrt(
              Math.pow(planetPosition[0] - x, 2) +
                Math.pow(planetPosition[1] - y, 2)
            );
            if (d > maxDistanceFromPolo || dd > planetRadius) {
              continue;
            }
            let pp = p.map(d / maxDistanceFromPolo, 0, 1, -0.2, 0.1);
            let n = p.noise(x * scl, y * scl);
            if (n > b + pp) {
              let color = p.color(255, 255, 255);
              p.pixels[4 * (y * p.width + x)] = p.red(color);
              p.pixels[4 * (y * p.width + x) + 1] = p.green(color);
              p.pixels[4 * (y * p.width + x) + 2] = p.blue(color);
              p.pixels[4 * (y * p.width + x) + 3] = p.alpha(color);
            }
          }
        }
      };

      const drawContinentes = (planetPosition, planetRadius, b, scl, polos) => {
        p.noiseDetail(3, 0.5);
        //console.log(b);
        for (let x = 0; x < p.width; x++) {
          for (let y = 0; y < p.height; y++) {
            let dd = Math.sqrt(
              Math.pow(planetPosition[0] - x, 2) +
                Math.pow(planetPosition[1] - y, 2)
            );
            let show = true;
            if (dd <= planetRadius) {
              let color = p.color(50, 50, 255);
              p.pixels[4 * (y * p.width + x)] = p.red(color);
              p.pixels[4 * (y * p.width + x) + 1] = p.green(color);
              p.pixels[4 * (y * p.width + x) + 2] = p.blue(color);
              p.pixels[4 * (y * p.width + x) + 3] = p.alpha(color);
            }
            for (let i = 0; i < polos.length; i++) {
              let poloPosition = polos[i][0];
              let poloRadius = polos[i][1];
              let distanceFromPolo = Math.sqrt(
                Math.pow(poloPosition[0] - x, 2) +
                  Math.pow(poloPosition[1] - y, 2)
              );

              if (distanceFromPolo < poloRadius) {
                show = false;

                break;
              }
            }
            if (dd > planetRadius || !show) {
              continue;
            }
            let pp = p.map(dd / planetRadius, 0, 1, 0.25, 0);
            let n = p.noise(x * scl, y * scl);
            if (n > b + pp) {
              let color = p.color(0, 255, 0);
              p.pixels[4 * (y * p.width + x)] = p.red(color);
              p.pixels[4 * (y * p.width + x) + 1] = p.green(color);
              p.pixels[4 * (y * p.width + x) + 2] = p.blue(color);
              p.pixels[4 * (y * p.width + x) + 3] = p.alpha(color);
              //p.set(x, y, p.color(0, 255, 0));
            } else {
              let color = p.color(50, 50, 255);
              p.pixels[4 * (y * p.width + x)] = p.red(color);
              p.pixels[4 * (y * p.width + x) + 1] = p.green(color);
              p.pixels[4 * (y * p.width + x) + 2] = p.blue(color);
              p.pixels[4 * (y * p.width + x) + 3] = p.alpha(color);
            }
          }
        }
      };

      const drawPlanet = () => {
        p.loadPixels();
        drawContinentes([200, 200], 100, cBias, 0.05, [
          [poloNorte, 50],
          [poloSur, 50],
        ]);
        drawPolo(poloNorte, bias, 0.05, 50, [200, 200], 100);
        drawPolo(poloSur, bias, 0.05, 50, [200, 200], 100);
        p.updatePixels();
      };

      p.setup = () => {
        p.createCanvas(400, 400, p.WEBGL).parent(ref.current);
        p.noiseSeed(123);

        for (let i = 0; i < 100; i++) {
          stars.push([
            Math.random() * p.width,
            Math.random() * p.height,
            Math.random() * 2,
          ]);
        }
      };

      p.draw = () => {
        p.background(0);
        let delta = p.deltaTime / 1000;
        let halfWidth = p.width / 2;
        let halfHeight = p.height / 2;
        for (let i = 0; i < 100; i++) {
          p.fill(255);
          p.stroke(255);
          p.circle(
            stars[i][0] - halfWidth,
            stars[i][1] - halfHeight,
            stars[i][2]
          );
          stars[i][0] += velocity[0] * delta;
          stars[i][1] += velocity[1] * delta;

          if (stars[i][0] > p.width) {
            stars[i][0] -= p.width;
            stars[i][1] = Math.random() * p.height;
          }
          if (stars[i][0] < 0) {
            stars[i][0] += p.width;
            stars[i][1] = Math.random() * p.height;
          }

          if (stars[i][1] > p.height) {
            stars[i][1] -= p.height;
            stars[i][0] = Math.random() * p.width;
          }
          if (stars[i][1] < 0) {
            stars[i][1] += p.height;
            stars[i][0] = Math.random() * p.width;
          }
        }

        if (moonAnimationState.behind) {
          p.fill(200);
          p.circle(
            p.map(moonAnimationState.lerp, 0, 1, 50, 350) - halfWidth,
            200 - halfHeight,
            50
          );
          drawPlanet();
        } else {
          drawPlanet();
          p.fill(200);
          p.circle(
            p.map(moonAnimationState.lerp, 0, 1, 50, 350) - halfWidth,
            200 - halfHeight,
            50
          );
        }

        let d = 350 - 50;
        let duration = moonAnimationDuration * 0.5;
        let vps = 1 / duration;
        moonAnimationState.lerp += moonAnimationState.direction * vps * delta;
        // alert(moonAnimationState.direction + " " + vps + " " + delta);
        //moonAnimationState.lerp = 0.25;
        if (moonAnimationState.lerp > 1 && moonAnimationState.direction == 1) {
          moonAnimationState.lerp = 1;
          moonAnimationState.direction = -1;
          moonAnimationState.behind = true;
        }
        if (moonAnimationState.lerp < 0 && moonAnimationState.direction == -1) {
          moonAnimationState.lerp = 0;
          moonAnimationState.direction = 1;
          moonAnimationState.behind = false;
        }
      };

      /* p.mousePressed = () => {
        p.background(0);
        bias += 0.01;
        cBias += 0.005;
        console.log(bias);
        //updatePixels();
        drawPlanet();
      }; */
    });
  }, [planetDamage]);

  return <div ref={ref}></div>;
}
