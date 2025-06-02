"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

// Import icons from lucide-react
import { Trash2, Eraser, LineChart, Settings, ListChecks, PanelLeftClose, PanelRightClose } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function HomePage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const [interpFormula, setInterpFormula] = useState<string>(
    "P(x) = (Belum ada/cukup titik)"
  );
  const [lineCreated, setLineCreated] = useState(false);
  const [interpolationType, setInterpolationType] = useState<"Newton" | "Lagrange">("Newton");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [minX, setMinX] = useState<number>(-10);
  const [maxX, setMaxX] = useState<number>(10);
  const [minY, setMinY] = useState<number>(-10);
  const [maxY, setMaxY] = useState<number>(10);

  const dragThreshold = 10;

  const { canvasRef, canvasContainerRef, canvasDims, drawingParams } = useCanvasDrawing({
    points,
    lineCreated,
    interpolationType,
    setInterpFormula,
    minX, maxX, minY, maxY,
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
      <Card className="w-full max-w-7xl shadow-xl transition-all duration-300 ease-in-out bg-white dark:bg-gray-800">
        <CardHeader className="text-center pb-2 sm:pb-3">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Kalkulator Interpolasi
          </CardTitle>
          <CardDescription className="text-sm sm:text-base pt-1 text-gray-600 dark:text-gray-400">
            Visualisasikan interpolasi Newton & Lagrange dengan titik kustom.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-4 sm:gap-6 px-3 pb-3 pt-0 sm:px-4 sm:pb-4 sm:pt-0 md:px-6 md:pb-6 md:pt-0">
  {/* Left Column: Controls */}
  <div className="flex flex-col gap-4 lg:w-1/4">
    {/* Interpolation Settings */}
    <div className="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <h3 className="flex items-center text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
        <Settings className="mr-2 h-5 w-5 text-purple-500" />
        Pengaturan Interpolasi
      </h3>
      <div>
        <label htmlFor="interpolation-type" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
          <SelectTrigger className="w-full text-xs sm:text-sm">
            <SelectValue placeholder="Pilih Metode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Newton">Polinom Newton</SelectItem>
            <SelectItem value="Lagrange">Polinom Lagrange</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="interpolation-formula" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Rumus P(x):
        </label>
        <Input
          id="interpolation-formula"
          value={interpFormula}
          readOnly
          className="w-full font-mono text-[10px] sm:text-xs p-2 h-auto bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          placeholder="Formula akan tampil di sini..."
        />
      </div>
    </div>

    {/* Coordinate Settings */}
    <div className="flex flex-col gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <h3 className="flex items-center text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
        <Settings className="mr-2 h-5 w-5 text-purple-500" />
        Pengaturan Koordinat
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="min-x" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min X:
          </label>
          <Input
            id="min-x"
            type="number"
            value={minX}
            onChange={(e) => setMinX(parseFloat(e.target.value))}
            className="w-full text-xs sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="max-x" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max X:
          </label>
          <Input
            id="max-x"
            type="number"
            value={maxX}
            onChange={(e) => setMaxX(parseFloat(e.target.value))}
            className="w-full text-xs sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="min-y" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min Y:
          </label>
          <Input
            id="min-y"
            type="number"
            value={minY}
            onChange={(e) => setMinY(parseFloat(e.target.value))}
            className="w-full text-xs sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="max-y" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max Y:
          </label>
          <Input
            id="max-y"
            type="number"
            value={maxY}
            onChange={(e) => setMaxY(parseFloat(e.target.value))}
            className="w-full text-xs sm:text-sm"
          />
        </div>
      </div>
    </div>

    {/* Toggle Sidebar Button */}
    <Button
      variant="outline"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="w-full flex items-center justify-center gap-2"
    >
      {isSidebarOpen ? (
        <>
          <PanelRightClose className="h-5 w-5" /> Sembunyikan Daftar Titik
        </>
      ) : (
        <>
          <PanelLeftClose className="h-5 w-5" /> Tampilkan Daftar Titik
        </>
      )}
    </Button>
  </div>

  {/* Center Column: Canvas and Buttons */}
  <div className={`flex flex-col gap-4 ${isSidebarOpen ? 'lg:w-1/2' : 'lg:w-3/4'} transition-all duration-300 ease-in-out`}>
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
    <div className="flex flex-row gap-3 w-full items-center">
      <Button onClick={handleClearPoints} variant="outline" className="flex-1 text-sm sm:text-base py-2.5 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20">
        <Eraser className="mr-2 h-4 w-4" /> Clear Titik
      </Button>
      <Button
        onClick={() => setLineCreated(true)}
        className="flex-1 text-sm sm:text-base py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-700"
        disabled={points.length < 2}
      >
        <LineChart className="mr-2 h-4 w-4" /> Buat Garis
      </Button>
    </div>
  </div>

  {/* Right Column: Points List (Sidebar) */}
  {isSidebarOpen && (
    <div className="lg:w-1/4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="flex items-center text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
          <ListChecks className="mr-2 h-5 w-5 text-purple-500" />
          Daftar Titik ({points.length})
        </h3>
        <div className="flex-grow border border-gray-200 dark:border-gray-700 rounded-md p-1 bg-white dark:bg-gray-800/50 shadow-sm">
          {points.length === 0 ? (
            <p className="text-xs sm:text-sm text-center py-4 text-gray-500 dark:text-gray-400">
              Klik pada kanvas untuk menambah titik.
            </p>
          ) : (
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                {points.map((p, index) => (
                  <li key={index} className="flex justify-between items-center py-2 px-2 sm:px-3 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-150">
                    <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] sm:text-xs font-semibold border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                      #{index + 1}: ({p.x.toFixed(2)}, {p.y.toFixed(2)})
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePoint(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-red-900/30 h-7 w-7 sm:h-8 sm:w-8"
                      aria-label={`Hapus titik ${index + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )}
</CardContent>
      </Card>
    </div>
  );
}
