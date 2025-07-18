---
title: Advanced Styling
sidebar_position: 2
---

# Advanced Styling

This guide covers advanced features including RGB colors, custom palettes, and complex styling techniques.

## RGB and Hex Colors

### RGB Colors

Use exact RGB values for precise color control (requires truecolor terminal support):

```zig
const style = colors.Style{};

// Using RGB values
std.debug.print("{}\n", .{style.rgb(255, 107, 107).call("Coral red")});
std.debug.print("{}\n", .{style.rgb(110, 235, 131).call("Mint green")});
std.debug.print("{}\n", .{style.rgb(121, 134, 255).call("Periwinkle blue")});

// RGB with styles
std.debug.print("{}\n", .{style.rgb(255, 179, 71).bold().call("Bold orange")});
std.debug.print("{}\n", .{style.rgb(155, 89, 182).italic().call("Italic purple")});
std.debug.print("{}\n", .{style.rgb(46, 204, 113).underline().call("Underlined emerald")});
```

### Hex Colors

Use familiar hex notation for colors:

```zig
const style = colors.Style{};

// Basic hex colors
std.debug.print("{}\n", .{style.hex("#FF6B6B").call("Soft red")});
std.debug.print("{}\n", .{style.hex("#4ECDC4").call("Turquoise")});
std.debug.print("{}\n", .{style.hex("#45B7D1").call("Sky blue")});

// Popular color palettes
std.debug.print("{}\n", .{style.hex("#E74C3C").call("Alizarin")});      // Flat UI Colors
std.debug.print("{}\n", .{style.hex("#3498DB").call("Peter River")});   // Flat UI Colors
std.debug.print("{}\n", .{style.hex("#2ECC71").call("Emerald")});       // Flat UI Colors

// Material Design colors
std.debug.print("{}\n", .{style.hex("#F44336").call("Material Red")});
std.debug.print("{}\n", .{style.hex("#4CAF50").call("Material Green")});
std.debug.print("{}\n", .{style.hex("#2196F3").call("Material Blue")});
```

### RGB Backgrounds

Apply RGB colors to backgrounds:

```zig
const style = colors.Style{};

// RGB backgrounds
std.debug.print("{}\n", .{colors.white.bgRgb(52, 73, 94).call("White on dark blue-gray")});
std.debug.print("{}\n", .{colors.black.bgRgb(241, 196, 15).call("Black on sunflower")});
std.debug.print("{}\n", .{style.rgb(255, 255, 255).bgRgb(155, 89, 182).call("White on purple")});

// Hex backgrounds
std.debug.print("{}\n", .{colors.white.bgHex("#2C3E50").call("White on midnight blue")});
std.debug.print("{}\n", .{colors.black.bgHex("#F1C40F").call("Black on sunflower")});
std.debug.print("{}\n", .{style.hex("#FFFFFF").bgHex("#9B59B6").call("White on amethyst")});
```

## Custom Color Palettes

### Defining a Theme

Create consistent color themes for your application:

```zig
const Theme = struct {
    // Primary colors
    const primary = colors.Style{}.hex("#007AFF");        // iOS blue
    const secondary = colors.Style{}.hex("#5856D6");      // iOS purple
    const success = colors.Style{}.hex("#34C759");        // iOS green
    const danger = colors.Style{}.hex("#FF3B30");         // iOS red
    const warning = colors.Style{}.hex("#FF9500");        // iOS orange
    const info = colors.Style{}.hex("#5AC8FA");           // iOS light blue

    // Neutral colors
    const text = colors.Style{}.hex("#000000");
    const textLight = colors.Style{}.hex("#8E8E93");
    const background = colors.Style{}.hex("#F2F2F7");

    // Semantic styles
    const h1 = primary.bold();
    const h2 = secondary.bold();
    const error = danger.bold();
    const success_msg = success.bold();
    const muted = textLight.dim();
};

// Usage
std.debug.print("{}\n", .{Theme.h1.call("Main Title")});
std.debug.print("{}\n", .{Theme.error.call("Error: Invalid input")});
std.debug.print("{}\n", .{Theme.muted.call("Last updated 5 minutes ago")});
```

### Gradient Effects

Simulate gradients with RGB transitions:

```zig
pub fn printGradient(text: []const u8) void {
    const style = colors.Style{};
    const len = text.len;

    for (text, 0..) |char, i| {
        const progress = @as(f32, @floatFromInt(i)) / @as(f32, @floatFromInt(len));

        // Gradient from blue to purple
        const r = @as(u8, @intFromFloat(59 + (147 - 59) * progress));
        const g = @as(u8, @intFromFloat(130 - 130 * progress));
        const b = @as(u8, @intFromFloat(246 - (246 - 160) * progress));

        std.debug.print("{}", .{style.rgb(r, g, b).call(&[_]u8{char})});
    }
    std.debug.print("\n", .{});
}

// Usage
printGradient("Gradient Text Effect!");
```

## Complex Styling Patterns

### Status Badges

Create GitHub-style status badges:

```zig
pub fn printBadge(label: []const u8, value: []const u8, value_color: []const u8) void {
    const style = colors.Style{};

    // Label with dark gray background
    std.debug.print("{}", .{
        colors.white.bgRgb(85, 85, 85).call(label)
    });

    // Value with custom color background
    std.debug.print("{}\n", .{
        style.hex("#FFFFFF").bgHex(value_color).bold().call(value)
    });
}

// Usage
printBadge(" build ", " passing ", "#4CAF50");
printBadge(" coverage ", " 98% ", "#FFC107");
printBadge(" version ", " v2.1.0 ", "#2196F3");
```

### Syntax Highlighting

Create a simple syntax highlighter:

```zig
const SyntaxHighlight = struct {
    const keyword = colors.Style{}.hex("#FF79C6").bold();      // Pink
    const string = colors.Style{}.hex("#F1FA8C");              // Yellow
    const number = colors.Style{}.hex("#BD93F9");              // Purple
    const comment = colors.Style{}.hex("#6272A4").italic();    // Gray
    const function = colors.Style{}.hex("#50FA7B");            // Green
    const type_name = colors.Style{}.hex("#8BE9FD");           // Cyan
};

pub fn highlightCode() void {
    std.debug.print("{} ", .{SyntaxHighlight.keyword.call("const")});
    std.debug.print("{} = ", .{SyntaxHighlight.function.call("allocator")});
    std.debug.print("{};\n", .{SyntaxHighlight.type_name.call("std.heap.page_allocator")});

    std.debug.print("{} ", .{SyntaxHighlight.keyword.call("const")});
    std.debug.print("result = ");
    std.debug.print("{}", .{SyntaxHighlight.keyword.call("try")});
    std.debug.print(" allocator.alloc(u8, ");
    std.debug.print("{});\n", .{SyntaxHighlight.number.call("1024")});

    std.debug.print("{}\n", .{SyntaxHighlight.comment.call("// Allocate 1KB of memory")});
}
```

### Box Drawing

Create colored boxes and borders:

```zig
pub fn drawBox(title: []const u8, content: []const u8, box_color: colors.Style) void {
    const width = 40;
    const top_left = "╭";
    const top_right = "╮";
    const bottom_left = "╰";
    const bottom_right = "╯";
    const horizontal = "─";
    const vertical = "│";

    // Top border
    std.debug.print("{}", .{box_color.call(top_left)});
    std.debug.print("{}", .{box_color.call(horizontal)});
    std.debug.print(" {} ", .{box_color.bold().call(title)});
    var i: usize = title.len + 4;
    while (i < width - 1) : (i += 1) {
        std.debug.print("{}", .{box_color.call(horizontal)});
    }
    std.debug.print("{}\n", .{box_color.call(top_right)});

    // Content
    std.debug.print("{} {s}", .{box_color.call(vertical), content});
    i = content.len + 2;
    while (i < width - 1) : (i += 1) {
        std.debug.print(" ", .{});
    }
    std.debug.print("{}\n", .{box_color.call(vertical)});

    // Bottom border
    std.debug.print("{}", .{box_color.call(bottom_left)});
    i = 0;
    while (i < width - 2) : (i += 1) {
        std.debug.print("{}", .{box_color.call(horizontal)});
    }
    std.debug.print("{}\n", .{box_color.call(bottom_right)});
}

// Usage
drawBox("Success", "Operation completed successfully!", colors.green);
drawBox("Warning", "This action cannot be undone", colors.yellow);
drawBox("Error", "Failed to connect to server", colors.red);
```

## Performance Considerations

### Conditional Styling

Only apply complex styles when supported:

```zig
pub const SmartStyle = struct {
    style: colors.Style,
    fallback: colors.Style,

    pub fn call(self: SmartStyle, text: []const u8) colors.StyledText {
        const level = colors.getLevel();
        if (level == .truecolor) {
            return self.style.call(text);
        } else {
            return self.fallback.call(text);
        }
    }
};

// Define styles with fallbacks
const brand_color = SmartStyle{
    .style = colors.Style{}.hex("#FF6B6B"),
    .fallback = colors.red,
};

// Usage
std.debug.print("{}\n", .{brand_color.call("Brand Text")});
```

### Caching Styles

Pre-compute styles for better performance:

```zig
const CachedStyles = struct {
    var cache: std.StringHashMap(colors.Style) = undefined;
    var initialized = false;

    pub fn init(allocator: std.mem.Allocator) void {
        cache = std.StringHashMap(colors.Style).init(allocator);
        initialized = true;
    }

    pub fn deinit() void {
        if (initialized) {
            cache.deinit();
            initialized = false;
        }
    }

    pub fn get(name: []const u8) ?colors.Style {
        if (!initialized) return null;
        return cache.get(name);
    }

    pub fn put(name: []const u8, style: colors.Style) !void {
        if (!initialized) return error.NotInitialized;
        try cache.put(name, style);
    }
};
```

## Platform-Specific Features

### Windows Terminal

Take advantage of Windows Terminal features:

```zig
if (builtin.os.tag == .windows and colors.getLevel() == .truecolor) {
    // Windows Terminal supports additional effects
    const style = colors.Style{};

    // Use Windows Terminal's extended color palette
    std.debug.print("{}\n", .{style.hex("#0078D4").call("Windows Blue")});
    std.debug.print("{}\n", .{style.hex("#107C10").call("Windows Green")});
}
```

### Terminal Capabilities

Adapt to different terminal emulators:

```zig
pub fn getBestStyle(preferred_hex: []const u8, fallback_256: u8, fallback_16: colors.Color) colors.Style {
    const level = colors.getLevel();
    return switch (level) {
        .truecolor => colors.Style{}.hex(preferred_hex),
        .ansi256 => colors.Style{}.ansi256(fallback_256),  // Note: This would need to be implemented
        .basic => colors.Style{ .fg = fallback_16 },
        .none => colors.Style{},
    };
}
```

## Next Steps

- Explore [Real World Examples](real-world.md) for complete applications
- Check the [RGB & Hex Reference](../api/rgb-hex.md) for color specifications
- Learn about [Background Styling](../api/backgrounds.md) options
