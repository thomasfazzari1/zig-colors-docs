---
title: Background Colors
sidebar_position: 3
---

# Backgrounds API Reference

Documentation for background color functionality in zig-colors.

## Background Methods

### Style Background Methods

Each `Style` instance provides methods to set background colors:

```zig
pub fn bgBlack(self: Style) Style
pub fn bgRed(self: Style) Style
pub fn bgGreen(self: Style) Style
pub fn bgYellow(self: Style) Style
pub fn bgBlue(self: Style) Style
pub fn bgMagenta(self: Style) Style
pub fn bgCyan(self: Style) Style
pub fn bgWhite(self: Style) Style
```

**Usage:**

```zig
// Simple background
std.debug.print("{}\n", .{colors.white.bgRed().call("White on red")});
std.debug.print("{}\n", .{colors.black.bgYellow().call("Black on yellow")});

// With other styles
std.debug.print("{}\n", .{colors.white.bgBlue().bold().call("Bold white on blue")});
```

### RGB Background Methods

```zig
pub fn bgRgb(self: Style, r: u8, g: u8, b: u8) Style
pub fn bgHex(self: Style, hex_str: []const u8) Style
```

**Parameters:**

- `r`, `g`, `b`: RGB values (0-255)
- `hex_str`: Hex color string (e.g., "#FF6B6B" or "FF6B6B")

**Usage:**

```zig
// RGB background
std.debug.print("{}\n", .{colors.white.bgRgb(52, 73, 94).call("Custom background")});

// Hex background
std.debug.print("{}\n", .{colors.black.bgHex("#FFD700").call("Black on gold")});
```

## Background Namespace

### bg Object

```zig
pub const bg = Style.Bg;
```

The `bg` namespace provides an alternative syntax for creating backgrounds:

```zig
pub const BgStyle = struct {
    pub fn black(self: BgStyle) Style
    pub fn red(self: BgStyle) Style
    pub fn green(self: BgStyle) Style
    pub fn yellow(self: BgStyle) Style
    pub fn blue(self: BgStyle) Style
    pub fn magenta(self: BgStyle) Style
    pub fn cyan(self: BgStyle) Style
    pub fn white(self: BgStyle) Style
    pub fn rgb(self: BgStyle, r: u8, g: u8, b: u8) Style
    pub fn hex(self: BgStyle, hex_str: []const u8) Style
};
```

**Usage:**

```zig
// Start with background, then add foreground
std.debug.print("{}\n", .{colors.bg.red().white().call("White on red")});
std.debug.print("{}\n", .{colors.bg.blue().yellow().bold().call("Bold yellow on blue")});

// Custom colors
std.debug.print("{}\n", .{colors.bg.hex("#2C3E50").white().call("White on dark")});
```

## Color Combinations

### High Contrast Combinations

```zig
// Good readability
colors.white.bgBlack()      // Maximum contrast
colors.black.bgWhite()      // Inverse maximum contrast
colors.yellow.bgBlue()      // Complementary colors
colors.white.bgRed()        // Alert/Error
colors.black.bgYellow()     // Warning
colors.white.bgGreen()      // Success

// Poor readability (avoid these)
colors.blue.bgBlack()       // Too similar
colors.yellow.bgWhite()     // Low contrast
colors.red.bgMagenta()      // Similar hues
```

### Semantic Backgrounds

```zig
const Status = struct {
    const error = colors.white.bgRed().bold();
    const warning = colors.black.bgYellow();
    const success = colors.white.bgGreen();
    const info = colors.white.bgBlue();
    const debug = colors.white.bgMagenta();
};

// Usage
std.debug.print("{}\n", .{Status.error.call(" ERROR ")});
std.debug.print("{}\n", .{Status.warning.call(" WARNING ")});
std.debug.print("{}\n", .{Status.success.call(" SUCCESS ")});
```

## Advanced Background Techniques

### Status Badges

```zig
pub fn badge(label: []const u8, value: []const u8, bg_color: colors.Style) void {
    // Dark background for label
    std.debug.print("{}", .{colors.white.bgRgb(85, 85, 85).call(label)});
    // Colored background for value
    std.debug.print("{}\n", .{bg_color.white().bold().call(value)});
}

// Usage
badge(" build ", " passing ", colors.bg.green());
badge(" tests ", " 142 ", colors.bg.blue());
badge(" coverage ", " 98% ", colors.bg.hex("#4CAF50"));
```

### Progress Bars

```zig
pub fn progressBar(percent: u8) void {
    const width = 20;
    const filled = @divFloor(percent * width, 100);

    std.debug.print("[", .{});

    var i: u8 = 0;
    while (i < width) : (i += 1) {
        if (i < filled) {
            const bg = if (percent < 50)
                colors.bg.red()
            else if (percent < 80)
                colors.bg.yellow()
            else
                colors.bg.green();

            std.debug.print("{}", .{bg.call(" ")});
        } else {
            std.debug.print(" ", .{});
        }
    }

    std.debug.print("] {}%\n", .{percent});
}
```

### Table Headers

```zig
pub fn tableHeader(columns: []const []const u8) void {
    const header_style = colors.white.bgBlue().bold();

    for (columns, 0..) |col, i| {
        if (i > 0) std.debug.print(" ", .{});
        std.debug.print("{}", .{header_style.call(col)});
    }
    std.debug.print("\n", .{});
}

// Usage
tableHeader(&.{ " Name ", " Status ", " Time ", " Memory " });
```

## Terminal Support

### Background Color Support

Different terminals have varying levels of background color support:

| Terminal         | Basic Backgrounds | RGB Backgrounds |
| ---------------- | ----------------- | --------------- |
| Windows Terminal | ✓                 | ✓               |
| PowerShell       | ✓                 | ✗               |
| macOS Terminal   | ✓                 | ✗               |
| iTerm2           | ✓                 | ✓               |
| GNOME Terminal   | ✓                 | ✓               |
| Konsole          | ✓                 | ✓               |

### Graceful Degradation

```zig
pub fn adaptiveBackground(text: []const u8, rgb: RGB, fallback: Color) void {
    const level = colors.getLevel();

    const style = switch (level) {
        .truecolor => colors.white.bgRgb(rgb.r, rgb.g, rgb.b),
        .basic, .ansi256 => colors.white.withBg(fallback),
        .none => colors.Style{},
    };

    std.debug.print("{}\n", .{style.call(text)});
}
```

## Best Practices

### 1. Contrast Ratio

Ensure sufficient contrast between foreground and background:

```zig
// Good contrast
colors.white.bgBlack()
colors.black.bgWhite()
colors.yellow.bgBlue()
colors.white.bgRed()

// Poor contrast (avoid)
colors.yellow.bgWhite()
colors.blue.bgBlack()
colors.cyan.bgBlue()
```

### 2. Accessibility

Consider colorblind users:

```zig
// Use both color and symbols
pub fn statusIndicator(status: Status) void {
    const indicator = switch (status) {
        .success => colors.white.bgGreen().call(" ✓ OK "),
        .error => colors.white.bgRed().call(" ✗ FAIL "),
        .warning => colors.black.bgYellow().call(" ⚠ WARN "),
    };
    std.debug.print("{}\n", .{indicator});
}
```

### 3. Consistent Meaning

Use backgrounds consistently throughout your application:

```zig
const BackgroundMeaning = struct {
    const critical = colors.bg.red();
    const warning = colors.bg.yellow();
    const success = colors.bg.green();
    const info = colors.bg.blue();
    const muted = colors.bg.rgb(60, 60, 60);
};
```

## Common Patterns

### Highlighting

```zig
pub fn highlight(text: []const u8, search: []const u8) void {
    if (std.mem.indexOf(u8, text, search)) |index| {
        std.debug.print("{s}", .{text[0..index]});
        std.debug.print("{}", .{colors.black.bgYellow().call(search)});
        std.debug.print("{s}", .{text[index + search.len..]});
    } else {
        std.debug.print("{s}", .{text});
    }
}
```

### Diff Output

```zig
pub fn diffLine(prefix: u8, line: []const u8) void {
    const style = switch (prefix) {
        '+' => colors.white.bgGreen(),
        '-' => colors.white.bgRed(),
        '@' => colors.white.bgBlue(),
        else => colors.Style{},
    };

    if (style.bg != null) {
        std.debug.print("{}{s}\n", .{style.call(&[_]u8{prefix}), line});
    } else {
        std.debug.print("{c}{s}\n", .{prefix, line});
    }
}
```

### Selection Menu

```zig
pub fn menuItem(text: []const u8, selected: bool) void {
    if (selected) {
        std.debug.print("{}\n", .{colors.white.bgBlue().bold().call(text)});
    } else {
        std.debug.print("{s}\n", .{text});
    }
}
```

## See Also

- [Colors API](colors.md) - Foreground color methods
- [Styles API](styles.md) - Text formatting options
- [RGB & Hex API](rgb-hex.md) - Custom color specifications
- [Utilities API](utilities.md) - Helper functions
