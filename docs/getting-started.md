---
title: Getting Started
sidebar_position: 2
---

# Getting Started

This guide will help you integrate zig-colors into your project and start styling your terminal output.

## Installation

### Step 1: Add to build.zig.zon

Add zig-colors as a dependency in your `build.zig.zon` file:

```zig
.{
    .name = "my-project",
    .version = "0.1.0",
    .dependencies = .{
        .@"zig-colors" = .{
            .url = "https://github.com/thomasfazzari1/zig-colors/archive/refs/tags/v0.1.0.tar.gz",
            .hash = "1220331bffdeca5488ee0a3a73f9c274f9856b63006d22b7fa2b810eb8a3fb9db867",
        },
    },
}
```

### Step 2: Configure build.zig

In your `build.zig`, add the module import:

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "my-project",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    // Add zig-colors dependency
    const colors_dep = b.dependency("zig-colors", .{});
    exe.root_module.addImport("zig-colors", colors_dep.module("zig-colors"));

    b.installArtifact(exe);
}
```

### Step 3: Import and Initialize

In your Zig source file:

```zig
const std = @import("std");
const colors = @import("zig-colors");

pub fn main() !void {
    // Initialize color support detection
    colors.init();
    defer colors.deinit();

    // Your colorful code here!
    std.debug.print("{}\n", .{colors.green.call("Hello, colorful world!")});
}
```

## First Steps

### Basic Colors

Start with simple foreground colors:

```zig
std.debug.print("{}\n", .{colors.red.call("Error message")});
std.debug.print("{}\n", .{colors.green.call("Success message")});
std.debug.print("{}\n", .{colors.yellow.call("Warning message")});
std.debug.print("{}\n", .{colors.blue.call("Info message")});
```

### Adding Styles

Make your text stand out with text styles:

```zig
std.debug.print("{}\n", .{colors.bold.call("Bold text")});
std.debug.print("{}\n", .{colors.italic.call("Italic text")});
std.debug.print("{}\n", .{colors.underline.call("Underlined text")});
```

### Combining Styles

Chain methods for complex styling:

```zig
std.debug.print("{}\n", .{colors.red.bold().call("Bold red error!")});
std.debug.print("{}\n", .{colors.green.underline().call("Underlined success")});
std.debug.print("{}\n", .{colors.yellow.dim().italic().call("Subtle warning")});
```

### Background Colors

Add background colors for emphasis:

```zig
std.debug.print("{}\n", .{colors.white.bgRed().call("Alert!")});
std.debug.print("{}\n", .{colors.black.bgYellow().call("Warning!")});
std.debug.print("{}\n", .{colors.white.bgGreen().call("Success!")});
```

## Checking Color Support

Always check if colors are supported:

```zig
if (colors.isSupported()) {
    std.debug.print("{}\n", .{colors.green.call("✓ Colors are supported!")});
} else {
    std.debug.print("Colors not supported\n", .{});
}

// Check specific color level
const level = colors.getLevel();
switch (level) {
    .none => std.debug.print("No color support\n", .{}),
    .basic => std.debug.print("Basic 16 colors\n", .{}),
    .ansi256 => std.debug.print("256 colors supported\n", .{}),
    .truecolor => std.debug.print("Full RGB support!\n", .{}),
}
```

## Configuration

### Manual Configuration

You can manually control color output:

```zig
// Disable colors (useful for CI/CD or file output)
colors.setEnabled(false);

// Force a specific color level
colors.setLevel(.basic);  // Force 16-color mode
colors.setLevel(.truecolor);  // Force RGB mode
```

### Environment Variables

zig-colors respects standard environment variables:

- `NO_COLOR`: Disables all color output when set
- `COLORTERM`: Set to `truecolor` or `24bit` for RGB support
- `TERM`: Detected automatically (e.g., `xterm-256color`)

## Next Steps

Now that you have zig-colors set up:

1. Explore [Basic Usage](examples/basic-usage.md) for more examples
2. Learn about [Advanced Styling](examples/advanced-styling.md) techniques
3. Check the [API Reference](api/colors.md) for all available methods
4. See [Real World Examples](examples/real-world.md) for practical applications
