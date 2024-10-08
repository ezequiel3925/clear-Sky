"use client";

import AudioPlayer from "./components/AudioPlayer";
import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import "./ClimateActionGame.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { PlanetRender } from "./planetRender";

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

// Registramos los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Configuración del gráfico
const chartOptions = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
      title: {
        display: true,
        text: "Temperatura (°C)",
      },
      ticks: {
        callback: function (value) {
          return value.toFixed(2);
        },
      },
      min: -0.5,
      max: 2,
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      title: {
        display: true,
        text: "CO2 (ppm)",
      },
      grid: {
        drawOnChartArea: false,
      },
      min: 250,
      max: 450,
    },
    x: {
      title: {
        display: true,
        text: "Año",
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toFixed(2);
          }
          return label;
        },
      },
    },
  },
};

// Función para simular la obtención de datos históricos
const fetchNASAData = async () => {
  return [
    { year: 1880, temperature: -0.16, co2: 280.0 },
    { year: 1900, temperature: -0.08, co2: 295.7 },
    { year: 1920, temperature: -0.27, co2: 303.2 },
    { year: 1940, temperature: 0.12, co2: 310.6 },
    { year: 1960, temperature: -0.03, co2: 316.9 },
    { year: 1980, temperature: 0.26, co2: 338.8 },
    { year: 2000, temperature: 0.39, co2: 369.5 },
    { year: 2020, temperature: 1.02, co2: 414.2 },
  ];
};

// Eventos climáticos importantes
const climateEvents = [
  { year: 1992, event: "Cumbre de la Tierra en Río 🌎" },
  { year: 1997, event: "Protocolo de Kioto 📜" },
  { year: 2005, event: "Huracán Katrina 🌀" },
  { year: 2015, event: "Acuerdo de París 🇫🇷" },
  { year: 2018, event: "Ola de calor europea ☀️" },
  { year: 2020, event: "Incendios en Australia 🔥" },
];

export default function ClimateActionGame() {
  // Estados del juego
  const [gameState, setGameState] = useState("start");
  const [year, setYear] = useState(2020);
  const [temperature, setTemperature] = useState(1.02);
  const [co2, setCo2] = useState(414.2);
  const [actions, setActions] = useState({
    renewableEnergy: 0,
    reforestation: 0,
    sustainableTransport: 0,
    industryEfficiency: 0,
  });
  const [score, setScore] = useState(0);
  const [currentEvent, setCurrentEvent] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [nasaData, setNasaData] = useState([]);
  const [gameData, setGameData] = useState([]);

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    const loadNASAData = async () => {
      const data = await fetchNASAData();
      setNasaData(data);
      setGameData([...data, { year, temperature, co2 }]);
    };
    loadNASAData();
  }, []);

  // Efecto para actualizar el estado del juego
  useEffect(() => {
    // Calcular el impacto de las acciones
    const impact =
      Object.values(actions).reduce((sum, value) => sum + value, 0) * 0.001;

    // Actualizar temperatura y CO2
    setTemperature((prevTemp) => {
      const newTemp = prevTemp - impact;
      return newTemp < 0.9 ? 0.9 : newTemp;
    });
    setCo2((prevCo2) => {
      const newCo2 = prevCo2 - impact * 0.5;
      return newCo2 < 280 ? 280 : newCo2;
    });

    // Calcular puntuación
    setScore(Math.round((1.02 - temperature) * 100));

    // Encontrar evento climático actual
    const event = climateEvents.find((e) => e.year === year);
    setCurrentEvent(event ? event.event : "");

    // Actualizar datos del juego
    setGameData((prevData) => {
      const newData = [...prevData];
      const lastIndex = newData.findIndex((d) => d.year === year);
      if (lastIndex !== -1) {
        newData[lastIndex] = {
          year,
          temperature: temperature - impact,
          co2: co2 - impact * 5,
        };
      } else {
        newData.push({
          year,
          temperature: temperature - impact,
          co2: co2 - impact * 5,
        });
      }
      return newData;
    });
  }, [actions, year, temperature, co2]);

  // Manejar acciones del jugador
  const handleAction = (action) => {
    setActions((prev) => ({ ...prev, [action]: prev[action] + 5 }));
    setYear((prev) => prev + 1);
  };

  // Generar pregunta aleatoria
  const generatePrompt = () => {
    const topics = [
      "impacto del aumento de temperatura en los ecosistemas",
      "relación entre los niveles de CO2 y el cambio climático",
      "efectos del cambio climático en la agricultura",
      "importancia de la energía renovable en la lucha contra el cambio climático",
      "papel de la reforestación en la captura de carbono",
      "impacto del transporte sostenible en la reducción de emisiones",
      "estrategias para mejorar la eficiencia energética en la industria",
    ];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const prompt = `Explica el ${randomTopic} y cómo se relaciona con el objetivo de limitar el aumento de la temperatura global a 1.5°C por encima de los niveles preindustriales.`;
    setGeneratedPrompt(prompt);
    setIsPromptDialogOpen(true);
  };

  // Lógica del componente
  const [selectedCard, setSelectedCard] = useState(null);

  const openModal = (card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  const [dangerLevel, setDangerLevel] = useState(5);
  const [imgs, setImgs] = useState([]);
  const [hideSecondSection, setHideSecondSection] = useState(false);
  const [ind, setInd] = useState(0);

  useEffect(() => {
    let timer;

    if (year === 2050) {
      setHideSecondSection(true);
      // Set a timer before changing the game state
      timer = setTimeout(() => {
        setGameState("finish");
      }, 2500); // Adjust the time (in milliseconds) as needed
    }

    // Cleanup the timer if the component unmounts or if year changes
    return () => {
      clearTimeout(timer);
    };
  }, [year]);

  // Renderizar el juego principal

  const renderFinish = () => {
    let resultMessage;

    // Determine the message based on the dangerLevel
    if (dangerLevel < 4) {
      resultMessage = "Bien hecho. has salvado al planeta";
    } else if (dangerLevel >= 4 && dangerLevel < 7) {
      resultMessage = "Buen intento. Pero la situación sigue siendo crítica";
    } else if (dangerLevel >= 7) {
      resultMessage =
        "Nuestras inversiones no han dado frutos. Has fallado en salvar al planeta";
    }

    return (
      <div>
        <p>{resultMessage}</p>

        <div className="c-end">
          <div className="controls">
            <button
              onClick={() => {
                setInd((i) => {
                  if (i === 0) {
                    return imgs.length - 1;
                  }
                  return i - 1;
                });
              }}
            >
              {"<"}
            </button>
            <button
              onClick={() => {
                setInd((i) => {
                  if (i === imgs.length - 1) {
                    return 0;
                  }
                  return i + 1;
                });
              }}
            >
              {">"}
            </button>
          </div>
          <div>
            {imgs.map((img, index) => (
              <img
                key={index}
                src={`/ppt/${img}`}
                alt={`Image ${img}`}
                className={"img-slide " + (index !== ind ? "hide" : "")}
              />
            ))}
          </div>
        </div>
        <button
          className="button"
          onClick={() => {
            setYear(2020);
            setDangerLevel(5);
            setHideSecondSection(false);
            setGameState("play");
            setImgs([]);
          }}
        >
          {" "}
          Reintentar
        </button>
      </div>
    );
  };

  const renderGame = () => {
    const cardData = [
      {
        id: "autos",
        src: "/invertirEnAutosElectricos.jpeg",
        text: "El futuro es eléctrico, invierte hoy en autos que están transformando el mundo hacia un mañana más limpio.",
        co2Impact: -3,
        img: "3.png",
      },
      {
        id: "migracion",
        src: "/InvertirEnMigracion.jpeg",
        text: "La migración masiva es una oportunidad para la innovación y el crecimiento cultural.",
        co2Impact: -4,
        img: "6.png",
      },
      {
        id: "nuclear",
        src: "/invertirEnNuclear.jpeg",
        text: "La energía nuclear es la clave para un planeta sostenible y una fuente de energía limpia a largo plazo.",
        co2Impact: +5,
        img: "2.png",
      },
      {
        id: "basural",
        src: "/invertirEnBasural.jpeg",
        text: "Transforma los residuos en recursos, invierte en soluciones para la gestión eficiente de basurales.",
        co2Impact: +2,
        img: "4.png",
      },
      {
        id: "eolica",
        src: "/invertirEnEolica.jpeg",
        text: "El viento es la energía del futuro, invierte en energía eólica para impulsar un planeta más verde.",
        co2Impact: +2,
        img: "8.png",
      },
      {
        id: "transgenica",
        src: "/invertirEnTransgenico.jpeg",
        text: "Los cultivos transgénicos son la solución para una agricultura más eficiente y sostenible.",
        co2Impact: +2,
        img: "7.png",
      },
      {
        id: "agricultura",
        src: "/invertirEnAgricultura.jpeg",
        text: "Invierte en agricultura inteligente y sostenible para alimentar al mundo de manera responsable.",
        co2Impact: +3,
        img: "9.png",
      },
      {
        id: "reforestar",
        src: "/invertirEnReforestar.jpeg",
        text: "Reforestar es restaurar el equilibrio natural, invierte en proyectos que dan vida al planeta.",
        co2Impact: -3,
        img: "10.png",
      },
    ];

    const calculateDanger = (selectedCard) => {
      const card = cardData.find((card) => card.id === selectedCard);

      if (card) {
        if (!imgs.includes(card.img)) {
          imgs.push(card.img);
        }
        console.log(card.co2Impact);
        if (card.co2Impact < 0) {
          if (dangerLevel - card.co2Impact > 10) {
            setDangerLevel(10);
          } else {
            setDangerLevel(dangerLevel - card.co2Impact);
          }
          setYear(year + 10);
        } else if (card.co2Impact > 0) {
          if (dangerLevel - card.co2Impact < 1) {
            setDangerLevel(1);
          } else {
            setDangerLevel(dangerLevel - card.co2Impact);
          }

          setYear(year + 10);
        }
      } else {
        console.log("Card not found");
      }
    };

    return (
      <div className="game-layout">
        {/* First Section (70% height) */}
        <div className="first-section">
          <button
            onClick={() => setGameState("graphic")}
            className="compact-button"
          >
            Revisar gráfico
          </button>
          <h1 className="year-title">Año: {year}</h1>
          {selectedCard && (
            <div onClick={closeModal}>
              <div className="modal-content">
                <button
                  onClick={() => calculateDanger(selectedCard)}
                  className="button-confirm"
                >
                  Confirmar Elección
                </button>
                <button className="close" onClick={closeModal}>
                  X
                </button>
                <img
                  width={125}
                  height={125}
                  src={cardData.find((card) => card.id === selectedCard)?.src}
                  alt="Selected card"
                />

                <p>{cardData.find((card) => card.id === selectedCard).text}</p>
              </div>
            </div>
          )}
          <PlanetRender planetDamage={map(dangerLevel / 10, 0, 1, -0.2, 0.2)} />

          <div className="battery-container">
            <div className="battery-label">Peligrosidad</div>
            {[...Array(dangerLevel)].map((_, index) => {
              let cellClass = "battery-cell";

              // Apply the color based on the index starting from the top
              if (index < 3) {
                cellClass += " low-danger"; // First 3 cells - Green
              } else if (index < 7) {
                cellClass += " moderate-danger"; // 4th to 7th cells - Yellow
              } else {
                cellClass += " high-danger"; // 8th and beyond - Red
              }

              return <div key={index} className={cellClass}></div>;
            })}
          </div>
        </div>

        {/* Second Section (30% height) */}
        {hideSecondSection ? (
          <></>
        ) : (
          <div className="second-section">
            {cardData.map((card) => (
              <div
                key={card.id}
                className="card responsive-card"
                onClick={() => openModal(card.id)}
              >
                <img
                  src={card.src}
                  alt={`Card ${card.id}`}
                  className="card-image"
                />
              </div>
            ))}
          </div>
        )}

        {/* Compact Button */}
      </div>
    );
  };

  //renderizar el grafico
  const renderGraphic = () => {
    return (
      <div className="space-y-4">
        <Card className="card">
          <CardHeader className="card-header"></CardHeader>
          <CardContent className="card-content">
            <Line
              data={{
                labels: gameData.map((data) => data.year),
                datasets: [
                  {
                    label: "Temperatura (°C)",
                    data: gameData.map((data) => data.temperature),
                    borderColor: "#ff7300",
                    backgroundColor: "rgba(255, 115, 0, 0.2)",
                    yAxisID: "y",
                    tension: 0.4,
                  },
                  {
                    label: "CO2 (ppm)",
                    data: gameData.map((data) => data.co2),
                    borderColor: "#82ca9d",
                    backgroundColor: "rgba(130, 202, 157, 0.2)",
                    yAxisID: "y1",
                    tension: 0.4,
                  },
                ],
              }}
              options={chartOptions}
            />
          </CardContent>
        </Card>

        <Button className="button w-full" onClick={() => setGameState("play")}>
          Volver al juego
        </Button>
        <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
          <DialogContent className="dialog-content">
            <DialogHeader>
              <DialogTitle className="dialog-title">
                Pregunta generada para el chatbot de IA
              </DialogTitle>
              <DialogDescription className="dialog-description">
                Copia esta pregunta y pégala en tu chatbot de IA favorito para
                aprender más sobre el cambio climático.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Label htmlFor="prompt" className="label">
                Pregunta generada:
              </Label>
              <Input
                id="prompt"
                value={generatedPrompt}
                readOnly
                className="input mt-2"
              />
            </div>
            <Button
              className="button mt-4"
              onClick={() => setIsPromptDialogOpen(false)}
            >
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>
        {year >= 2030 && (
          <Card className="card">
            <CardHeader className="card-header">
              <CardTitle className="card-title">¡Juego terminado! 🎉</CardTitle>
              <CardDescription className="card-description">
                Tu puntuación: {score}
              </CardDescription>
            </CardHeader>
            <CardContent className="card-content">
              {score > 50
                ? "¡Excelente trabajo! 🌟 Has hecho una diferencia significativa en la lucha contra el cambio climático."
                : "Buen intento, pero aún hay mucho por hacer para combatir el cambio climático. ¡Inténtalo de nuevo! 💪"}
            </CardContent>
            <CardFooter className="card-footer">
              <Button className="button" onClick={() => setGameState("quiz")}>
                Realizar cuestionario 📝
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    );
  };

  // Renderizar las instrucciones
  const renderInstructions = () => (
    <>
      <h2>Instrucciones:</h2>

      <p>
        {" "}
        En el juego virtual tu meta es reducir la peligrosidad del cambio
        climático tomando decisiones estratégicas. Cada carta que juegues
        influirá en la peligrosidad ambiental, la cual puede aumentar o
        disminuir dependiendo de las acciones que tomes. ¡Tu objetivo es
        mantener la peligrosidad baja y contribuir a un futuro más sostenible!
      </p>

      <Button className="button" onClick={() => setGameState("play")}>
        Comenzar 🚀
      </Button>
    </>
  );

  // Renderizar el cuestionario
  const renderQuiz = () => (
    <Card className="card">
      <CardHeader className="card-header">
        <CardTitle className="card-title">
          Cuestionario sobre Acción Climática 🌍
        </CardTitle>
      </CardHeader>
      <CardContent className="card-content">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setGameState("end");
          }}
          className="space-y-4"
        >
          <div>
            <label className="label">
              ¿Cuál es el principal gas de efecto invernadero?
            </label>
            <select className="input">
              <option>Oxígeno</option>
              <option>Nitrógeno</option>
              <option>Dióxido de carbono</option>
              <option>Hidrógeno</option>
            </select>
          </div>
          <div>
            <label className="label">
              ¿Qué acción NO ayuda a combatir el cambio climático?
            </label>
            <select className="input">
              <option>Usar energía renovable</option>
              <option>Plantar árboles</option>
              <option>Usar transporte público</option>
              <option>Aumentar el uso de combustibles fósiles</option>
            </select>
          </div>
          <div>
            <label className="label">
              ¿Cuál fue el año más caluroso registrado hasta la fecha?
            </label>
            <select className="input">
              <option>2016</option>
              <option>2019</option>
              <option>2020</option>
              <option>2022</option>
            </select>
          </div>
          <Button type="submit" className="button">
            Enviar respuestas
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  // Renderizar la pantalla final
  const renderEnd = () => (
    <div className="space-y-4">
      <Card className="card">
        <CardHeader className="card-header">
          <CardTitle className="card-title">
            ¡Gracias por participar! 🎊
          </CardTitle>
        </CardHeader>
        <CardContent className="card-content">
          <p>
            Has aprendido sobre el ODS 13: Acción por el Clima y cómo tus
            acciones pueden hacer una diferencia.
          </p>
          <p>
            Recuerda que pequeños cambios en tu vida diaria pueden tener un gran
            impacto en nuestro planeta. 🌱
          </p>
          <Tabs defaultValue="facts" className="mt-4">
            <TabsList>
              <TabsTrigger value="facts">Datos Curiosos</TabsTrigger>
              <TabsTrigger value="actions">Acciones Diarias</TabsTrigger>
            </TabsList>
            <TabsContent value="facts">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  El 2016 fue el año más caluroso registrado hasta la fecha. 🌡️
                </li>
                <li>
                  Los océanos han absorbido más del 90% del exceso de calor de
                  la Tierra. 🌊
                </li>
                <li>
                  El Ártico está perdiendo 13% de su hielo marino cada década.
                  ❄️
                </li>
                <li>
                  Los niveles de CO2 son los más altos en 650,000 años. 📈
                </li>
              </ul>
            </TabsContent>

            <TabsContent value="actions">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Usa transporte público o bicicleta cuando sea posible. 🚲
                </li>
                <li>Reduce el consumo de carne, especialmente de res. 🥩</li>
                <li>
                  Ahorra energía apagando luces y dispositivos cuando no los
                  uses. 💡
                </li>
                <li>Recicla y reutiliza para reducir los desechos. ♻️</li>
                <li>Planta árboles o apoya proyectos de reforestación. 🌳</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="card-footer">
          <Button className="button" onClick={() => setGameState("start")}>
            Jugar de nuevo 🔄
          </Button>
        </CardFooter>
      </Card>
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative w-full" style={{ paddingBottom: "75%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://arcade.makecode.com/---run?id=_8717J3c2fDgm"
            allowFullScreen
            sandbox="allow-popups allow-forms allow-scripts allow-same-origin"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </div>
  );

  // Renderizado principal del componente
  return (
    <div className={"container " + gameState}>
      {/*<h1 className="text-3xl font-bold mb-4">ODS 13: Acción por el Clima 🌍</h1>*/}
      {/*<h1 className="text-3xl font-bold mb-4">ODS 13: Acción por el Clima 🌍</h1>*/}
      <div className={"flex-container-title " + gameState}>
        <h1 className="heading">Clear Sky 🌍</h1>
        <AudioPlayer />
      </div>

      {gameState === "start" && (
        <Card className="card">
          <CardHeader className="card-header">
            <CardDescription className="card-description">
              Aprende sobre el cambio climático y cómo combatirlo
            </CardDescription>
          </CardHeader>
          <CardContent className="card-content">
            <CardTitle className="text-center p-1">Bienvenid@s</CardTitle>
            <p className="text-xs text-muted-foreground">
              Es importante comprender la conexión directa entre las emisiones
              de dióxido de carbono (CO₂) liberadas a la atmósfera al quemar
              combustibles fósiles y el cambio climático. Cuando el CO₂ se
              acumula en la atmósfera, actúa como un gas de efecto invernadero,
              atrapando el calor y provocando un aumento gradual de la
              temperatura del planeta. Este calentamiento afecta especialmente a
              los océanos, alterando el equilibrio climático global y dando
              lugar a cambios significativos, como sequías más intensas,
              inundaciones más frecuentes y eventos climáticos extremos.
            </p>
            <p>
              En este juego, tomarás decisiones para combatir el cambio
              climático. Veremos el impacto de tus decisiones en el tiempo.
            </p>
            <div className="mt-4">
              <h3 className="font-bold">¿Sabías que...? </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  La temperatura global ha aumentado aproximadamente 1°C desde
                  la era preindustrial.
                </li>
                <li>
                  El nivel del mar está subiendo a un ritmo de 3.3 mm por año.
                </li>
                <li>
                  Los últimos 7 años han sido los más calurosos registrados en
                  la historia.
                </li>
              </ul>
              <h4 className="p-3 text-xs text-left">
                FUENTES:
                <br />
                NASA. (s.f.). Signos vitales: Dióxido de carbono (CO₂).
                <a
                  href="https://climate.nasa.gov/en-espanol/signos-vitales/dioxido-de-carbono/?intent=111"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [Enlace]
                </a>
                <br />
                NOAA. (s.f.). Mauna Loa observatorio.
                <a
                  href="https://gml.noaa.gov/obop/mlo/"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  [Enlace]
                </a>
              </h4>
            </div>
          </CardContent>
          <CardFooter className="card-footer">
            <Button
              className="button"
              onClick={() => setGameState("instructions")}
            >
              Leer instrucciones 📕
            </Button>
          </CardFooter>
        </Card>
      )}
      {gameState === "instructions" && renderInstructions()}
      {gameState === "play" && renderGame()}
      {gameState === "quiz" && renderQuiz()}
      {gameState === "end" && renderEnd()}
      {gameState === "graphic" && renderGraphic()}
      {gameState === "finish" && renderFinish()}
    </div>
  );
}
