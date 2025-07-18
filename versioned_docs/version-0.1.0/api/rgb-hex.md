---
title: RGB & Hex Colors
sidebar_position: 4
---

# RGB & Hex API Reference

Documentation for custom color support using RGB values and hex color codes.

## RGB Struct

```zig
pub const RGB = struct {
    r: u8,
    g: u8,
    b: u8,
};
```

Represents an RGB color with red, green, and blue components (0-255).

## RGB Methods

### Foreground RGB

```zig
pub fn rgb(self: Style, r: u8, g: u8, b: u8) Style
```

Sets a custom RGB foreground color.

**Parameters:**

- `r`: Red component (0-255)
- `g`: Green component (0-255)
- `b`: Blue component (0-255)

**Returns:** New `Style` with RGB foreground color

**Usage:**

```zig
const style = colors.Style{};
std.debug.print("{}\n", .{style.rgb(255, 107, 107).call("Coral red")});
std.debug.print("{}\n", .{style.rgb(110, 235, 131).call("Mint green")});
std.debug.print("{}\n", .{style.rgb(121, 134, 255).call("Periwinkle blue")});
```

### Background RGB

```zig
pub fn bgRgb(self: Style, r: u8, g: u8, b: u8) Style
```

Sets a custom RGB background color.

**Parameters:**

- `r`: Red component (0-255)
- `g`: Green component (0-255)
- `b`: Blue component (0-255)

**Returns:** New `Style` with RGB background color

**Usage:**

```zig
std.debug.print("{}\n", .{colors.white.bgRgb(52, 73, 94).call("White on dark blue")});
std.debug.print("{}\n", .{colors.black.bgRgb(241, 196, 15).call("Black on sunflower")});
```

## Hex Methods

### Foreground Hex

```zig
pub fn hex(self: Style, hex_str: []const u8) Style
```

Sets a foreground color using hex notation.

**Parameters:**

- `hex_str`: Hex color string (e.g., "#FF6B6B" or "FF6B6B")

**Returns:** New `Style` with hex foreground color

**Usage:**

```zig
const style = colors.Style{};
std.debug.print("{}\n", .{style.hex("#FF6B6B").call("Soft red")});
std.debug.print("{}\n", .{style.hex("#4ECDC4").call("Turquoise")});
std.debug.print("{}\n", .{style.hex("45B7D1").call("Sky blue (no #)")});
```

### Background Hex

```zig
pub fn bgHex(self: Style, hex_str: []const u8) Style
```

Sets a background color using hex notation.

**Parameters:**

- `hex_str`: Hex color string (e.g., "#FF6B6B" or "FF6B6B")

**Returns:** New `Style` with hex background color

**Usage:**

```zig
std.debug.print("{}\n", .{colors.white.bgHex("#2C3E50").call("White on midnight")});
std.debug.print("{}\n", .{colors.black.bgHex("#F1C40F").call("Black on sunflower")});
```

## Hex Parsing

### parseHex Function

```zig
fn parseHex(hex: []const u8) !RGB
```

Internal function that parses hex strings to RGB values.

**Supported formats:**

- `"#RRGGBB"` - With hash prefix
- `"RRGGBB"` - Without hash prefix

**Error:** Returns `error.InvalidHexColor` if the format is invalid

## Terminal Support

### Color Level Detection

RGB/Hex colors require truecolor terminal support:

```zig
const level = colors.getLevel();
if (level == .truecolor) {
    // Full RGB support available
    std.debug.print("{}\n", .{colors.Style{}.hex("#FF6B6B").call("Truecolor!")});
} else {
    // Fallback to basic colors
    std.debug.print("{}\n", .{colors.red.call("Basic color")});
}
```

### Terminal Compatibility

| Terminal         | RGB/Hex Support | Notes             |
| ---------------- | --------------- | ----------------- |
| Windows Terminal | ✓               | Full 24-bit color |
| iTerm2           | ✓               | Full 24-bit color |
| VS Code Terminal | ✓               | Full 24-bit color |
| GNOME Terminal   | ✓               | Full 24-bit color |
| macOS Terminal   | ✗               | 256 colors only   |
| PuTTY            | ✗               | 256 colors only   |

## Color Palettes

### Material Design Colors

```zig
const Material = struct {
    // Primary colors
    const red = colors.Style{}.hex("#F44336");
    const pink = colors.Style{}.hex("#E91E63");
    const purple = colors.Style{}.hex("#9C27B0");
    const deep_purple = colors.Style{}.hex("#673AB7");
    const indigo = colors.Style{}.hex("#3F51B5");
    const blue = colors.Style{}.hex("#2196F3");
    const light_blue = colors.Style{}.hex("#03A9F4");
    const cyan = colors.Style{}.hex("#00BCD4");
    const teal = colors.Style{}.hex("#009688");
    const green = colors.Style{}.hex("#4CAF50");
    const light_green = colors.Style{}.hex("#8BC34A");
    const lime = colors.Style{}.hex("#CDDC39");
    const yellow = colors.Style{}.hex("#FFEB3B");
    const amber = colors.Style{}.hex("#FFC107");
    const orange = colors.Style{}.hex("#FF9800");
    const deep_orange = colors.Style{}.hex("#FF5722");
};
```

### Tailwind CSS Colors

```zig
const Tailwind = struct {
    // Modern palette
    const slate = colors.Style{}.hex("#64748B");
    const gray = colors.Style{}.hex("#6B7280");
    const zinc = colors.Style{}.hex("#71717A");
    const neutral = colors.Style{}.hex("#737373");
    const stone = colors.Style{}.hex("#78716C");
    const red = colors.Style{}.hex("#EF4444");
    const orange = colors.Style{}.hex("#F97316");
    const amber = colors.Style{}.hex("#F59E0B");
    const yellow = colors.Style{}.hex("#EAB308");
    const lime = colors.Style{}.hex("#84CC16");
    const green = colors.Style{}.hex("#22C55E");
    const emerald = colors.Style{}.hex("#10B981");
    const teal = colors.Style{}.hex("#14B8A6");
    const cyan = colors.Style{}.hex("#06B6D4");
    const sky = colors.Style{}.hex("#0EA5E9");
    const blue = colors.Style{}.hex("#3B82F6");
    const indigo = colors.Style{}.hex("#6366F1");
    const violet = colors.Style{}.hex("#8B5CF6");
    const purple = colors.Style{}.hex("#A855F7");
    const fuchsia = colors.Style{}.hex("#D946EF");
    const pink = colors.Style{}.hex("#EC4899");
    const rose = colors.Style{}.hex("#F43F5E");
};
```

## Advanced Usage

### Gradient Effects

```zig
pub fn gradient(text: []const u8, start: RGB, end: RGB) void {
    const style = colors.Style{};
    const len = text.len;

    for (text, 0..) |char, i| {
        const t = @as(f32, @floatFromInt(i)) / @as(f32, @floatFromInt(len - 1));

        const r = @as(u8, @intFromFloat(@as(f32, start.r) * (1 - t) + @as(f32, end.r) * t));
        const g = @as(u8, @intFromFloat(@as(f32, start.g) * (1 - t) + @as(f32, end.g) * t));
        const b = @as(u8, @intFromFloat(@as(f32, start.b) * (1 - t) + @as(f32, end.b) * t));

        std.debug.print("{}", .{style.rgb(r, g, b).call(&[_]u8{char})});
    }
}

// Usage
gradient("Rainbow Text", RGB{ .r = 255, .g = 0, .b = 0 }, RGB{ .r = 0, .g = 0, .b = 255 });
```

### Color Interpolation

```zig
pub fn interpolateColor(c1: RGB, c2: RGB, t: f32) RGB {
    return RGB{
        .r = @intFromFloat(@as(f32, c1.r) * (1 - t) + @as(f32, c2.r) * t),
        .g = @intFromFloat(@as(f32, c1.g) * (1 - t) + @as(f32, c2.g) * t),
        .b = @intFromFloat(@as(f32, c1.b) * (1 - t) + @as(f32, c2.b) * t),
    };
}

// Create a color scale
pub fn temperatureColor(value: f32) RGB {
    // 0.0 = cold (blue), 1.0 = hot (red)
    const cold = RGB{ .r = 59, .g = 130, .b = 246 };  // Blue
    const warm = RGB{ .r = 251, .g = 191, .b = 36 };  // Amber
    const hot = RGB{ .r = 239, .g = 68, .b = 68 };    // Red

    if (value < 0.5) {
        return interpolateColor(cold, warm, value * 2);
    } else {
        return interpolateColor(warm, hot, (value - 0.5) * 2);
    }
}
```

### Theme System

```zig
pub const Theme = struct {
    primary: RGB,
    secondary: RGB,
    success: RGB,
    warning: RGB,
    error: RGB,
    info: RGB,

    pub const dark = Theme{
        .primary = .{ .r = 139, .g = 92, .b = 246 },    // Violet
        .secondary = .{ .r = 236, .g = 72, .b = 153 },  // Pink
        .success = .{ .r = 34, .g = 197, .b = 94 },     // Green
        .warning = .{ .r = 250, .g = 204, .b = 21 },    // Yellow
        .error = .{ .r = 239, .g = 68, .b = 68 },       // Red
        .info = .{ .r = 59, .g = 130, .b = 246 },       // Blue
    };

    pub const light = Theme{
        .primary = .{ .r = 79, .g = 70, .b = 229 },     // Indigo
        .secondary = .{ .r = 217, .g = 70, .b = 239 },  // Fuchsia
        .success = .{ .r = 16, .g = 185, .b = 129 },    // Emerald
        .warning = .{ .r = 245, .g = 158, .b = 11 },    // Amber
        .error = .{ .r = 220, .g = 38, .b = 38 },       // Red
        .info = .{ .r = 14, .g = 165, .b = 233 },       // Sky
    };

    pub fn apply(self: Theme) struct {
        primary: colors.Style,
        secondary: colors.Style,
        success: colors.Style,
        warning: colors.Style,
        error: colors.Style,
        info: colors.Style,
    } {
        const style = colors.Style{};
        return .{
            .primary = style.rgb(self.primary.r, self.primary.g, self.primary.b),
            .secondary = style.rgb(self.secondary.r, self.secondary.g, self.secondary.b),
            .success = style.rgb(self.success.r, self.success.g, self.success.b),
            .warning = style.rgb(self.warning.r, self.warning.g, self.warning.b),
            .error = style.rgb(self.error.r, self.error.g, self.error.b),
            .info = style.rgb(self.info.r, self.info.g, self.info.b),
        };
    }
};

// Usage
const theme = Theme.dark.apply();
std.debug.print("{}\n", .{theme.error.bold().call("Error: File not found")});
std.debug.print("{}\n", .{theme.success.call("✓ Build completed")});
```

## Best Practices

### 1. Fallback Colors

Always provide fallbacks for environments without truecolor:

```zig
pub fn smartColor(hex: []const u8, fallback: Color) colors.Style {
    if (colors.getLevel() == .truecolor) {
        return colors.Style{}.hex(hex);
    } else {
        return colors.Style{ .fg = fallback };
    }
}

// Usage
const brand = smartColor("#FF6B6B", .red);
std.debug.print("{}\n", .{brand.call("Brand color with fallback")});
```

### 2. Color Contrast

Ensure sufficient contrast for readability:

```zig
pub fn contrastRatio(c1: RGB, c2: RGB) f32 {
    const lum1 = luminance(c1);
    const lum2 = luminance(c2);
    const lighter = @max(lum1, lum2);
    const darker = @min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

fn luminance(c: RGB) f32 {
    const r = gammaExpand(@as(f32, @floatFromInt(c.r)) / 255.0);
    const g = gammaExpand(@as(f32, @floatFromInt(c.g)) / 255.0);
    const b = gammaExpand(@as(f32, @floatFromInt(c.b)) / 255.0);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

fn gammaExpand(n: f32) f32 {
    return if (n <= 0.03928) n / 12.92 else std.math.pow(f32, (n + 0.055) / 1.055, 2.4);
}
```

### 3. Accessibility

Consider color blindness when choosing colors:

```zig
// Color-blind friendly palette
const Accessible = struct {
    const blue = colors.Style{}.hex("#0173B2");
    const orange = colors.Style{}.hex("#DE8F05");
    const green = colors.Style{}.hex("#029E73");
    const yellow = colors.Style{}.hex("#CC78BC");
    const red = colors.Style{}.hex("#CA0020");
    const purple = colors.Style{}.hex("#7B3294");
    const grey = colors.Style{}.hex("#949494");
};
```

## See Also

- [Colors API](colors.md) - Basic color functionality
- [Backgrounds API](backgrounds.md) - Background color methods
- [Styles API](styles.md) - Text formatting options
- [Utilities API](utilities.md) - Helper functions and detection
