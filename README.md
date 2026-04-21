# 🌑 ALGO_CORE

**A high-performance, production-grade algorithm visualization and sonification engine built with React.**

ALGO_CORE goes beyond standard visualizers by focusing heavily on memory-safe execution, interactive "time-travel" debugging, and dynamic audio feedback. It is designed to handle both classic sorting algorithms and advanced system-level sorting engines without dropping frames or leaking memory.

---

## ✨ Core Features

* **Generator-Driven Execution Engine:** Algorithms are written as JavaScript Generator functions, yielding precise "snapshots" of the array state and pointer positions at every comparison and swap. This enables seamless, scrubbable time-travel debugging.
* **Dynamic Web Audio Sonification:** A custom audio engine maps array values to frequencies, allowing you to physically "hear" the algorithms. It tracks active and writing pointers to create rhythmic, algorithm-specific soundscapes, bypassing strict browser autoplay policies.
* **Aggressive Memory Management:** Built for extreme scale. Utilizes strict garbage collection protocols and `Object.freeze()` to bypass React's reactivity overhead for historical timeline data, keeping the memory footprint incredibly light even over thousands of execution steps.
* **Eager Matrix Evaluation:** The engine pre-calculates the entire sorting matrix in the background the moment data is generated, instantly populating the timeline UI for immediate responsiveness.
* **Bulletproof Architecture:** Protected by React Error Boundaries and decoupled state logic (via Zustand), ensuring the application safely handles missing modules, interrupts, or runtime errors without crashing the DOM tree.

## 🧮 Supported Algorithms

### Classic Sorts
* Merge Sort
* Quick Sort
* Heap Sort
* Insertion Sort
* Bubble Sort
* Selection Sort
* Radix Sort

### System Engines
* Timsort (Python's default)
* Introsort (C++'s default)
* Dual-Pivot Quicksort (Java's default)

## 🛠️ Tech Stack

* **Frontend Framework:** React
* **Build Tool:** Vite
* **State Management:** Zustand
* **Styling:** Tailwind CSS
* **Audio:** Web Audio API

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
