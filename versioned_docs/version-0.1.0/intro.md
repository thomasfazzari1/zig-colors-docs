---
slug: /
title: Introduction
sidebar_position: 1
---

# Introduction

Welcome to **zig-colors**, a modern terminal styling library for Zig that makes console output beautiful and expressive.

## Why zig-colors?

- **Rich Color Support**: From basic 16 colors to full RGB/Hex support with 16 million colors
- **Chainable API**: Compose styles naturally with methods like `red.bold().underline()`
- **Zero Dependencies**: Pure Zig implementation with no external dependencies
- **Smart Detection**: Automatically detects terminal color capabilities
- **Cross-Platform**: Works seamlessly on Windows, macOS, and Linux

## Core Features

### Automatic Terminal Detection

zig-colors automatically detects your terminal's color support level:

- **None**: No color support
- **Basic**: 16 colors
- **ANSI256**: 256 colors
- **Truecolor**: 16M colors (RGB)

### Intuitive API Design

The library is designed to be as simple as possible:

```zig
// Simple color
colors.red.call("Error!")

// Chained styling
colors.green.bold().underline().call("Success!")

// Background colors
colors.white.bgBlue().call("Info")

// RGB/Hex colors
colors.Style{}.hex("#FF6B6B").call("Custom!")
```

### Comprehensive Styling Options

- **Colors**: 8 basic + 8 bright colors
- **Backgrounds**: All colors available as backgrounds
- **Text Styles**: Bold, dim, italic, underline
- **RGB Support**: Full 24-bit color when supported
- **Hex Colors**: Convenient hex color notation

## Getting Started

Ready to add colors to your Zig project? Head over to the [Getting Started](getting-started.md) section to begin!
