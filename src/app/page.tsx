"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Point } from "@/lib/types";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { CanvasPlotter } from "@/components/CanvasPlotter";
import {
  Trash2,
  Eraser,
  LineChart,
  Settings,
  ListChecks,
  Info, // Menambahkan ikon Info untuk tips
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"; // Menggunakan Separator untuk pemisah yang bersih

export default function HomePage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null
  );
  const [interpFormula, setInterpFormula] = useState<string>(
    "P(x) = (Belum ada/cukup titik)"
  );
  const [lineCreated, setLineCreated] = useState(false);
  const [interpolationType, setInterpolationType] = useState<
    "Newton" | "Lagrange"
  >("Newton");

  const [minX, setMinX] = useState<number>(-10);
  const [maxX, setMaxX] = useState<number>(10);
  const [minY, setMinY] = useState<number>(-10);
  const [maxY, setMaxY] = useState<number>(10);

  const dragThreshold = 10;

  const { canvasRef, canvasContainerRef, canvasDims, drawingParams } =
    useCanvasDrawing({
      points,
      lineCreated,
      interpolationType,
      setInterpFormula,
      minX,
      maxX,
      minY,
      maxY,
    });

  const handleClearPoints = () => {
    setPoints([]);
    setSelectedPointIndex(null);
    setLineCreated(false);
    setInterpFormula("P(x) = (Belum ada/cukup titik)");
  };

  const handleRemovePoint = (indexToRemove: number) => {
    setPoints((prev) => prev.filter((_, index) => index !== indexToRemove));
    setSelectedPointIndex(null);
    if (points.length - 1 < 2) {
      setLineCreated(false);
      setInterpFormula("P(x) = (Belum ada/cukup titik)");
    } else if (lineCreated) {
      setLineCreated(false);
      setTimeout(() => setLineCreated(true), 0);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-7xl shadow-2xl rounded-xl bg-white dark:bg-gray-800 border-none">
        <CardHeader className="text-center pb-4 pt-6">
          <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Kalkulator Interpolasi Polinomial
          </CardTitle>
          <CardDescription className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Visualisasikan Polinom Interpolasi Newton dan Lagrange dengan titik-titik kustom Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-4 pb-4 pt-0 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
          {/* Canvas Section */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
              <CanvasPlotter
                canvasRef={canvasRef}
                canvasContainerRef={canvasContainerRef}
                canvasDims={canvasDims}
                drawingParams={drawingParams}
                points={points}
                setPoints={setPoints}
                selectedPointIndex={selectedPointIndex}
                setSelectedPointIndex={setSelectedPointIndex}
                dragThreshold={dragThreshold}
              />
            </div>
          </div>

          {/* Tips for Canvas Interaction */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>
              Klik di kanvas untuk menambah titik baru. Tarik titik yang ada untuk memindahkannya.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 w-full"> {/* Menggunakan flex-wrap dan justify-center */}
            <Button
              onClick={handleClearPoints}
              variant="outline"
              className="flex-1 min-w-[140px] max-w-xs text-sm sm:text-base py-2.5 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200"
            >
              <Eraser className="mr-2 h-4 w-4" /> Bersihkan Titik
            </Button>
            <Button
              onClick={() => setLineCreated(true)}
              className="flex-1 min-w-[140px] max-w-xs text-sm sm:text-base py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700 transition-all duration-200"
              disabled={points.length < 2}
            >
              <LineChart className="mr-2 h-4 w-4" /> Hubungkan Titik
            </Button>
          </div>

          <Separator className="my-2 bg-gray-200 dark:bg-gray-700" /> {/* Pemisah yang lebih elegan */}

          {/* Section for Coordinate Settings, Interpolation Settings, and Points List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center">
            {/* Coordinate Settings */}
            <div className="flex flex-col gap-4 p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-850 w-full max-w-sm">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <Settings className="mr-2 h-5 w-5 text-purple-500" />
                Pengaturan Koordinat
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="min-x" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min X:
                  </label>
                  <Input
                    id="min-x"
                    type="number"
                    value={minX}
                    onChange={(e) => setMinX(parseFloat(e.target.value))}
                    className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="max-x" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max X:
                  </label>
                  <Input
                    id="max-x"
                    type="number"
                    value={maxX}
                    onChange={(e) => setMaxX(parseFloat(e.target.value))}
                    className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="min-y" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Y:
                  </label>
                  <Input
                    id="min-y"
                    type="number"
                    value={minY}
                    onChange={(e) => setMinY(parseFloat(e.target.value))}
                    className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label htmlFor="max-y" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Y:
                  </label>
                  <Input
                    id="max-y"
                    type="number"
                    value={maxY}
                    onChange={(e) => setMaxY(parseFloat(e.target.value))}
                    className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Interpolation Settings */}
            <div className="flex flex-col gap-4 p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-850 w-full max-w-sm">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <Settings className="mr-2 h-5 w-5 text-purple-500" />
                Pengaturan Interpolasi
              </h3>
              <div>
                <label htmlFor="interpolation-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Metode:
                </label>
                <Select
                  value={interpolationType}
                  onValueChange={(value: "Newton" | "Lagrange") => {
                    setInterpolationType(value);
                    if (points.length >= 2 && lineCreated) {
                      setLineCreated(false);
                      setTimeout(() => setLineCreated(true), 0);
                    } else {
                      setInterpFormula("P(x) = (Belum ada/cukup titik)");
                    }
                  }}
                >
                  <SelectTrigger className="w-full text-sm rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectValue placeholder="Pilih Metode" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <SelectItem value="Newton">Polinom Newton</SelectItem>
                    <SelectItem value="Lagrange">Polinom Lagrange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="interpolation-formula" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rumus P(x):
                </label>
                <Input
                  id="interpolation-formula"
                  value={interpFormula}
                  readOnly
                  className="w-full font-mono text-xs p-2 h-auto bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                  placeholder="Formula akan tampil di sini..."
                />
              </div>
            </div>

            {/* Points List */}
            <div className="flex flex-col gap-4 p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md bg-white dark:bg-gray-850 w-full max-w-sm">
              <h3 className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <ListChecks className="mr-2 h-5 w-5 text-purple-500" />
                Daftar Titik ({points.length})
              </h3>
              <div className="flex-grow border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-gray-50 dark:bg-gray-700/50 shadow-inner">
                {points.length === 0 ? (
                  <p className="text-sm text-center py-6 text-gray-500 dark:text-gray-400">
                    Belum ada titik. Klik pada kanvas untuk menambah.
                  </p>
                ) : (
                  <ScrollArea className="h-[200px] sm:h-[250px] lg:h-[300px] pr-2"> {/* Tinggi scrollarea lebih dinamis */}
                    <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                      {points.map((p, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 rounded-md"
                        >
                          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            P{index + 1}: ({p.x.toFixed(2)}, {p.y.toFixed(2)})
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePoint(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-900/30 h-8 w-8 rounded-full"
                            aria-label={`Hapus titik ${index + 1}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}