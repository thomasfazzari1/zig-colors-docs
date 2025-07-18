---
title: Basic Usage
sidebar_position: 1
---

# Basic Usage

This guide covers the fundamental features of zig-colors with practical examples.

## Simple Colors

### Foreground Colors

All 16 standard terminal colors are available:

```zig
// Basic colors
std.debug.print("{}\n", .{colors.black.call("Black text")});
std.debug.print("{}\n", .{colors.red.call("Red text")});
std.debug.print("{}\n", .{colors.green.call("Green text")});
std.debug.print("{}\n", .{colors.yellow.call("Yellow text")});
std.debug.print("{}\n", .{colors.blue.call("Blue text")});
std.debug.print("{}\n", .{colors.magenta.call("Magenta text")});
std.debug.print("{}\n", .{colors.cyan.call("Cyan text")});
std.debug.print("{}\n", .{colors.white.call("White text")});

// Bright variants
std.debug.print("{}\n", .{colors.brightBlack.call("Bright black")});
std.debug.print("{}\n", .{colors.brightRed.call("Bright red")});
std.debug.print("{}\n", .{colors.brightGreen.call("Bright green")});
std.debug.print("{}\n", .{colors.brightYellow.call("Bright yellow")});
std.debug.print("{}\n", .{colors.brightBlue.call("Bright blue")});
std.debug.print("{}\n", .{colors.brightMagenta.call("Bright magenta")});
std.debug.print("{}\n", .{colors.brightCyan.call("Bright cyan")});
std.debug.print("{}\n", .{colors.brightWhite.call("Bright white")});
```

### Text Styles

Apply formatting to make text stand out:

```zig
std.debug.print("{}\n", .{colors.bold.call("Bold text")});
std.debug.print("{}\n", .{colors.dim.call("Dim text")});
std.debug.print("{}\n", .{colors.italic.call("Italic text")});
std.debug.print("{}\n", .{colors.underline.call("Underlined text")});
```

## Combining Styles

### Color + Style

Combine colors with text styles:

```zig
// Color with bold
std.debug.print("{}\n", .{colors.red.bold().call("Bold red error")});

// Color with underline
std.debug.print("{}\n", .{colors.green.underline().call("Underlined success")});

// Color with italic
std.debug.print("{}\n", .{colors.blue.italic().call("Italic info")});

// Multiple styles
std.debug.print("{}\n", .{colors.yellow.bold().underline().call("Important warning!")});
```

### Building Complex Styles

Create reusable style combinations:

```zig
// Define style presets
const error_style = colors.red.bold();
const success_style = colors.green.bold();
const warning_style = colors.yellow.underline();
const info_style = colors.blue.italic();

// Use them throughout your application
std.debug.print("{}\n", .{error_style.call("Error: File not found")});
std.debug.print("{}\n", .{success_style.call("Success: Operation completed")});
std.debug.print("{}\n", .{warning_style.call("Warning: Deprecated function")});
std.debug.print("{}\n", .{info_style.call("Info: Processing started")});
```

## Background Colors

### Simple Backgrounds

Apply background colors to text:

```zig
// White text on colored backgrounds
std.debug.print("{}\n", .{colors.white.bgRed().call("Red background")});
std.debug.print("{}\n", .{colors.white.bgGreen().call("Green background")});
std.debug.print("{}\n", .{colors.white.bgBlue().call("Blue background")});

// Black text on light backgrounds
std.debug.print("{}\n", .{colors.black.bgYellow().call("Yellow background")});
std.debug.print("{}\n", .{colors.black.bgCyan().call("Cyan background")});
std.debug.print("{}\n", .{colors.black.bgWhite().call("White background")});
```

### Using the bg Namespace

Alternative syntax for backgrounds:

```zig
// Start with background color
std.debug.print("{}\n", .{colors.bg.red().white().call("White on red")});
std.debug.print("{}\n", .{colors.bg.blue().yellow().call("Yellow on blue")});
std.debug.print("{}\n", .{colors.bg.green().black().bold().call("Bold black on green")});
```

## Practical Examples

### Status Messages

Create consistent status indicators:

```zig
pub fn printStatus(status: enum { error, success, warning, info }, message: []const u8) void {
    const style = switch (status) {
        .error => colors.red.bold(),
        .success => colors.green.bold(),
        .warning => colors.yellow.bold(),
        .info => colors.blue.bold(),
    };

    const prefix = switch (status) {
        .error => "✗ ERROR",
        .success => "✓ SUCCESS",
        .warning => "⚠ WARNING",
        .info => "ℹ INFO",
    };

    std.debug.print("{} {s}\n", .{style.call(prefix), message});
}

// Usage
printStatus(.error, "Failed to connect to database");
printStatus(.success, "Build completed");
printStatus(.warning, "Using deprecated API");
printStatus(.info, "Starting server on port 8080");
```

### Progress Indicators

Create colorful progress bars:

```zig
pub fn printProgress(percent: u8) void {
    const filled = @divFloor(percent, 5);
    const empty = 20 - filled;

    std.debug.print("[", .{});

    // Filled portion
    var i: u8 = 0;
    while (i < filled) : (i += 1) {
        const style = if (percent < 50) colors.red else if (percent < 80) colors.yellow else colors.green;
        std.debug.print("{}", .{style.call("█")});
    }

    // Empty portion
    i = 0;
    while (i < empty) : (i += 1) {
        std.debug.print("{}", .{colors.dim.call("░")});
    }

    std.debug.print("] {}%\n", .{percent});
}

// Usage
printProgress(25);  // Red progress bar
printProgress(60);  // Yellow progress bar
printProgress(90);  // Green progress bar
```

### Table Headers

Style table headers for better readability:

```zig
pub fn printTableHeader(headers: []const []const u8) void {
    for (headers, 0..) |header, i| {
        if (i > 0) std.debug.print(" | ", .{});
        std.debug.print("{}", .{colors.bold.underline().call(header)});
    }
    std.debug.print("\n", .{});
}

// Usage
printTableHeader(&.{ "Name", "Status", "Time", "Memory" });
```

## Best Practices

### 1. Check Color Support

Always verify color support before using advanced features:

```zig
if (colors.isSupported()) {
    // Use colors
    std.debug.print("{}\n", .{colors.green.call("✓ Colored output")});
} else {
    // Fallback to plain text
    std.debug.print("✓ Plain output\n", .{});
}
```

### 2. Create Semantic Styles

Define meaningful style constants:

```zig
const Styles = struct {
    const error = colors.red.bold();
    const warning = colors.yellow;
    const success = colors.green.bold();
    const info = colors.blue;
    const debug = colors.dim;
    const highlight = colors.white.bgBlue().bold();
};
```

### 3. Provide Fallbacks

Consider users without color support:

```zig
pub fn formatError(msg: []const u8) void {
    if (colors.isSupported()) {
        std.debug.print("{} {s}\n", .{colors.red.bold().call("ERROR:"), msg});
    } else {
        std.debug.print("ERROR: {s}\n", .{msg});
    }
}
```

## Next Steps

- Learn about [Advanced Styling](advanced-styling.md) with RGB and custom colors
- Explore [Real World Examples](real-world.md) for complete applications
- Check the [API Reference](../api/colors.md) for all available methods
