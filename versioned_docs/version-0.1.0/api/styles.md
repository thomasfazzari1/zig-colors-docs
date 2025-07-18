---
title: Text Styles
sidebar_position: 2
---

# Styles API Reference

Documentation for text styling features including bold, italic, underline, and more.

## StyleCode Enum

```zig
pub const StyleCode = enum(u8) {
    reset = 0,
    bold = 1,
    dim = 2,
    italic = 3,
    underline = 4,
    blink = 5,
    reverse = 7,
    hidden = 8,
    strikethrough = 9,
};
```

## Pre-defined Style Objects

```zig
pub const bold: Style
pub const dim: Style
pub const italic: Style
pub const underline: Style
```

**Usage:**

```zig
std.debug.print("{}\n", .{colors.bold.call("Bold text")});
std.debug.print("{}\n", .{colors.italic.call("Italic text")});
std.debug.print("{}\n", .{colors.underline.call("Underlined text")});
std.debug.print("{}\n", .{colors.dim.call("Dimmed text")});
```

## Style Struct

```zig
pub const Style = struct {
    fg: ?Color = null,
    bg: ?Color = null,
    fg_rgb: ?RGB = null,
    bg_rgb: ?RGB = null,
    bold_on: bool = false,
    dim_on: bool = false,
    italic_on: bool = false,
    underline_on: bool = false,
};
```

## Style Methods

### Text Formatting

```zig
pub fn bold(self: Style) Style
pub fn dim(self: Style) Style
pub fn italic(self: Style) Style
pub fn underline(self: Style) Style
```

Returns a new `Style` with the specified formatting enabled.

**Usage:**

```zig
// Single style
colors.red.bold().call("Bold red text")

// Multiple styles
colors.green.bold().italic().underline().call("Styled text")

// Starting with style
colors.bold.red().call("Also bold red")
```

### Applying Styles

```zig
pub fn call(self: Style, text: []const u8) StyledText
```

Applies the style to text and returns a formattable `StyledText` object.

**Parameters:**

- `text`: The text to style

**Returns:** `StyledText` object that can be formatted

**Usage:**

```zig
const styled = colors.red.bold().call("Error!");
std.debug.print("{}\n", .{styled});
```

## StyledText Struct

```zig
pub const StyledText = struct {
    style: Style,
    text: []const u8,

    pub fn format(self: StyledText, comptime fmt: []const u8, options: std.fmt.FormatOptions, writer: anytype) !void
};
```

The `StyledText` struct implements the `format` function, making it compatible with Zig's formatting system.

## Combining Styles

### With Colors

```zig
// Color + style
colors.red.bold().call("Bold red")
colors.green.italic().call("Italic green")
colors.blue.underline().call("Underlined blue")

// Multiple styles
colors.yellow.bold().italic().call("Bold italic yellow")
colors.cyan.dim().underline().call("Dim underlined cyan")
```

### With Backgrounds

```zig
// Style + color + background
colors.white.bgRed().bold().call("Bold white on red")
colors.black.bgYellow().underline().call("Underlined black on yellow")
```

### Complex Combinations

```zig
// All together
colors.brightWhite
    .bgBlue()
    .bold()
    .underline()
    .call("Highlighted text")
```

## Style Composition

### Building Custom Styles

```zig
pub fn createHeaderStyle(level: u8) colors.Style {
    return switch (level) {
        1 => colors.bold.underline(),
        2 => colors.bold,
        3 => colors.underline,
        else => colors.Style{},
    };
}

// Usage
std.debug.print("{}\n", .{createHeaderStyle(1).call("Main Title")});
std.debug.print("{}\n", .{createHeaderStyle(2).call("Subtitle")});
std.debug.print("{}\n", .{createHeaderStyle(3).call("Section")});
```

### Style Inheritance

```zig
// Base style
const base = colors.blue.bold();

// Extend base style
const error = base.red();  // Bold red (color overrides blue)
const warning = base.yellow();  // Bold yellow
const success = base.green();  // Bold green
```

## Platform Support

### Terminal Compatibility

Not all terminals support all styles:

| Style     | Windows Terminal | macOS Terminal | iTerm2 | Linux Terminal |
| --------- | ---------------- | -------------- | ------ | -------------- |
| Bold      | ✓                | ✓              | ✓      | ✓              |
| Dim       | ✓                | ✓              | ✓      | ✓              |
| Italic    | ✓                | ✗              | ✓      | Varies         |
| Underline | ✓                | ✓              | ✓      | ✓              |

### Checking Support

```zig
// Graceful degradation
pub fn styledHeader(text: []const u8) void {
    if (colors.isSupported()) {
        std.debug.print("{}\n", .{colors.bold.underline().call(text)});
    } else {
        std.debug.print("=== {s} ===\n", .{text});
    }
}
```

## Advanced Examples

### Log Formatter

```zig
const LogFormatter = struct {
    show_timestamp: bool = true,
    show_level: bool = true,

    pub fn format(self: LogFormatter, level: LogLevel, message: []const u8) void {
        const style = switch (level) {
            .debug => colors.dim,
            .info => colors.Style{},
            .warn => colors.yellow.bold(),
            .err => colors.red.bold(),
        };

        if (self.show_timestamp) {
            std.debug.print("{} ", .{colors.dim.call("[2024-01-15 10:30:45]")});
        }

        if (self.show_level) {
            const level_text = switch (level) {
                .debug => "DEBUG",
                .info => "INFO",
                .warn => "WARN",
                .err => "ERROR",
            };
            std.debug.print("[{}] ", .{style.call(level_text)});
        }

        std.debug.print("{s}\n", .{message});
    }
};
```

### Emphasis Levels

```zig
pub const Emphasis = enum {
    subtle,
    normal,
    strong,
    critical,

    pub fn toStyle(self: Emphasis) colors.Style {
        return switch (self) {
            .subtle => colors.dim,
            .normal => colors.Style{},
            .strong => colors.bold,
            .critical => colors.red.bold().underline(),
        };
    }
};

// Usage
pub fn emphasize(text: []const u8, level: Emphasis) void {
    std.debug.print("{}\n", .{level.toStyle().call(text)});
}

emphasize("Debug info", .subtle);
emphasize("Normal text", .normal);
emphasize("Important!", .strong);
emphasize("CRITICAL ERROR", .critical);
```

### Style Templates

```zig
const Templates = struct {
    // Headers
    const h1 = colors.bold.underline();
    const h2 = colors.bold;
    const h3 = colors.underline;

    // Code elements
    const keyword = colors.blue.bold();
    const string = colors.green;
    const comment = colors.dim.italic();
    const error = colors.red.underline();

    // UI elements
    const selected = colors.white.bgBlue().bold();
    const disabled = colors.dim;
    const highlight = colors.yellow.bold();
};
```

## Best Practices

1. **Terminal Detection**: Not all terminals support all styles. Always check support.
2. **Accessibility**: Don't rely solely on styling for meaning. Use clear text too.
3. **Consistency**: Use the same styles for the same types of content.
4. **Subtlety**: Less is often more. Don't over-style your output.
5. **Performance**: Style objects are lightweight and can be pre-computed.

## Common Patterns

### Error Formatting

```zig
pub fn formatError(err: anyerror, details: []const u8) void {
    std.debug.print("{}: {s}\n", .{
        colors.red.bold().call(@errorName(err)),
        details
    });
}
```

### Progress States

```zig
pub fn showTaskStatus(name: []const u8, status: TaskStatus) void {
    const style = switch (status) {
        .pending => colors.dim,
        .running => colors.blue.bold(),
        .success => colors.green,
        .failed => colors.red.bold(),
        .skipped => colors.yellow.dim(),
    };

    std.debug.print("[{}] {s}\n", .{
        style.call(@tagName(status)),
        name
    });
}
```

## See Also

- [Colors API](colors.md) - Color methods and constants
- [Backgrounds API](backgrounds.md) - Background color styling
- [RGB & Hex API](rgb-hex.md) - Custom color support
- [Utilities API](utilities.md) - Helper functions and configuration
