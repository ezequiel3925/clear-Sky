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

      const drawPolo = (
        position,
        b,
        scl,
        maxDistanceFromPolo,
        planetPosition,
        planetRadius
      ) => {
        p.noiseDetail(8, 0.6);
        p.loadPixels();
        console.log(b);
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
              p.set(x, y, p.color(255));
            }
          }
        }
        p.updatePixels();
      };

      const drawContinentes = (planetPosition, planetRadius, b, scl, polos) => {
        p.noiseDetail(3, 0.5);
        p.loadPixels();
        console.log(b);
        for (let x = 0; x < p.width; x++) {
          for (let y = 0; y < p.height; y++) {
            let dd = Math.sqrt(
              Math.pow(planetPosition[0] - x, 2) +
                Math.pow(planetPosition[1] - y, 2)
            );
            let show = true;
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
              p.set(x, y, p.color(0, 255, 0));
            }
          }
        }
        p.updatePixels();
      };

      const drawPlanet = () => {
        p.fill(50, 50, 255);
        p.noStroke();
        p.circle(200, 200, 200);
        drawPolo(poloNorte, bias, 0.05, 50, [200, 200], 100);
        drawPolo(poloSur, bias, 0.05, 50, [200, 200], 100);
        drawContinentes([200, 200], 100, cBias, 0.05, [
          [poloNorte, 50],
          [poloSur, 50],
        ]);
      };

      p.setup = () => {
        p.createCanvas(400, 400).parent(ref.current);
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

        for (let i = 0; i < 100; i++) {
          p.fill(255);
          p.stroke(255);
          p.circle(...stars[i]);
          stars[i][0] += velocity[0] * (p.deltaTime / 1000);
          stars[i][1] += velocity[1] * (p.deltaTime / 1000);

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

        drawPlanet();
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
