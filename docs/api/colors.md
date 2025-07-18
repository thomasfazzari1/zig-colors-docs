---
title: Colors
sidebar_position: 1
---

# Colors API Reference

Documentation for basic color functionality in zig-colors.

## Color Enum

```zig
pub const Color = enum(u8) {
    black = 30,
    red = 31,
    green = 32,
    yellow = 33,
    blue = 34,
    magenta = 35,
    cyan = 36,
    white = 37,
    default = 39,

    // Bright variants
    bright_black = 90,
    bright_red = 91,
    bright_green = 92,
    bright_yellow = 93,
    bright_blue = 94,
    bright_magenta = 95,
    bright_cyan = 96,
    bright_white = 97,
};
```

## Pre-defined Color Styles

### Basic Colors

```zig
pub const black: Style
pub const red: Style
pub const green: Style
pub const yellow: Style
pub const blue: Style
pub const magenta: Style
pub const cyan: Style
pub const white: Style
```

**Usage:**

```zig
std.debug.print("{}\n", .{colors.red.call("Error text")});
std.debug.print("{}\n", .{colors.green.call("Success text")});
```

### Bright Colors

```zig
pub const brightBlack: Style
pub const brightRed: Style
pub const brightGreen: Style
pub const brightYellow: Style
pub const brightBlue: Style
pub const brightMagenta: Style
pub const brightCyan: Style
pub const brightWhite: Style
```

**Usage:**

```zig
std.debug.print("{}\n", .{colors.brightRed.call("Bright error!")});
std.debug.print("{}\n", .{colors.brightGreen.call("Bright success!")});
```

## Style Methods

### Foreground Colors

Each `Style` instance provides methods to set foreground colors:

```zig
pub fn black(self: Style) Style
pub fn red(self: Style) Style
pub fn green(self: Style) Style
pub fn yellow(self: Style) Style
pub fn blue(self: Style) Style
pub fn magenta(self: Style) Style
pub fn cyan(self: Style) Style
pub fn white(self: Style) Style
```

**Bright variants:**

```zig
pub fn brightBlack(self: Style) Style
pub fn brightRed(self: Style) Style
pub fn brightGreen(self: Style) Style
pub fn brightYellow(self: Style) Style
pub fn brightBlue(self: Style) Style
pub fn brightMagenta(self: Style) Style
pub fn brightCyan(self: Style) Style
pub fn brightWhite(self: Style) Style
```

**Usage:**

```zig
const style = colors.Style{};
std.debug.print("{}\n", .{style.red().call("Red text")});
std.debug.print("{}\n", .{style.brightBlue().call("Bright blue text")});
```

### Chaining Colors

Colors can be chained with other styling methods:

```zig
// Combine with text styles
colors.red.bold().call("Bold red")
colors.green.italic().underline().call("Italic underlined green")

// Override colors (last one wins)
colors.blue.red().call("This will be red")
```

## Color Support Detection

### Level Enum

```zig
pub const Level = enum(u2) {
    none = 0,      // No colors
    basic = 1,     // 16 colors
    ansi256 = 2,   // 256 colors
    truecolor = 3, // 16M colors (RGB)
};
```

### Detection Functions

```zig
pub fn getLevel() Level
```

Returns the current color support level.

**Usage:**

```zig
const level = colors.getLevel();
switch (level) {
    .none => std.debug.print("No color support\n", .{}),
    .basic => std.debug.print("16 colors available\n", .{}),
    .ansi256 => std.debug.print("256 colors available\n", .{}),
    .truecolor => std.debug.print("Full RGB support!\n", .{}),
}
```

## Examples

### Semantic Color Usage

```zig
// Define semantic colors
const ColorScheme = struct {
    const error = colors.red.bold();
    const warning = colors.yellow;
    const success = colors.green.bold();
    const info = colors.blue;
    const debug = colors.dim;
};

// Use them consistently
std.debug.print("{} {s}\n", .{ColorScheme.error.call("ERROR:"), "File not found"});
std.debug.print("{} {s}\n", .{ColorScheme.warning.call("WARN:"), "Deprecated API"});
std.debug.print("{} {s}\n", .{ColorScheme.success.call("OK:"), "Build complete"});
```

### Conditional Coloring

```zig
pub fn statusColor(value: f32) colors.Style {
    if (value < 0.33) return colors.red;
    if (value < 0.66) return colors.yellow;
    return colors.green;
}

// Usage
const cpu_usage = 0.75;
std.debug.print("CPU: {}\n", .{statusColor(cpu_usage).call("75%")});
```

### Color Palettes

```zig
const Palette = struct {
    // Monokai theme colors
    const pink = colors.Style{}.hex("#F92672");
    const green = colors.Style{}.hex("#A6E22E");
    const yellow = colors.Style{}.hex("#F4BF75");
    const blue = colors.Style{}.hex("#66D9EF");
    const purple = colors.Style{}.hex("#AE81FF");
    const white = colors.Style{}.hex("#F8F8F2");
    const gray = colors.Style{}.hex("#75715E");
};
```

## Platform Considerations

### Windows

- Colors are supported on Windows 10+ by default
- Older Windows versions may require enabling ANSI support
- Windows Terminal provides full truecolor support

### macOS

- Terminal.app supports 256 colors
- iTerm2 supports truecolor
- Color detection works automatically

### Linux

- Most modern terminals support at least 256 colors
- Check `$COLORTERM` for truecolor support
- Respects `$NO_COLOR` environment variable

## Best Practices

1. **Use semantic names**: Instead of `colors.red`, use meaningful names like `error_color`
2. **Check support**: Always verify color support for graceful degradation
3. **Provide fallbacks**: Ensure your application works without colors
4. **Be consistent**: Use the same colors for the same types of information
5. **Consider accessibility**: Not everyone can distinguish all colors

## See Also

- [Styles API](styles.md) - Text styling (bold, italic, etc.)
- [Backgrounds API](backgrounds.md) - Background color methods
- [RGB & Hex API](rgb-hex.md) - Custom color support
- [Utilities API](utilities.md) - Helper functions
